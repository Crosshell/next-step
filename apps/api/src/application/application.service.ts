import { BadRequestException, Injectable } from '@nestjs/common';
import { ApplicationRepository } from './application.repository';
import { Application, Prisma } from '@prisma/client';
import { CreateApplicationDto } from './dto/create-application.dto';
import { VacancyService } from '../vacancy/vacancy.service';
import { getPaginationByPage } from '@common/utils';
import { ConfigService } from '@nestjs/config';
import { SearchApplicationDto } from './dto/search-application';
import { JobSeekerService } from '../job-seeker/job-seeker.service';

@Injectable()
export class ApplicationService {
  private readonly pageSize: number;

  constructor(
    private readonly repository: ApplicationRepository,
    private readonly vacancyService: VacancyService,
    private readonly config: ConfigService,
    private readonly jobSeekerService: JobSeekerService,
  ) {
    this.pageSize = this.config.getOrThrow<number>(
      'search.application.pageSize',
    );
  }

  async create(
    dto: CreateApplicationDto,
    jobSeekerId: string,
  ): Promise<Application> {
    await this.assertNotExists({
      jobSeekerId_vacancyId: { jobSeekerId, vacancyId: dto.vacancyId },
    });
    await this.vacancyService.findOneOrThrow({ id: dto.vacancyId });
    return this.repository.create(dto, jobSeekerId);
  }

  async assertNotExists(
    where: Prisma.ApplicationWhereUniqueInput,
  ): Promise<void> {
    const application = await this.repository.findOne(where);
    if (application)
      throw new BadRequestException('Application already exists');
  }

  async searchByVacancyId(
    vacancyId: string,
    dto: SearchApplicationDto,
  ): Promise<Application[]> {
    await this.vacancyService.findOneOrThrow({ id: vacancyId });
    return this.search(dto, { vacancyId });
  }

  async searchByJobSeekerId(
    jobSeekerId: string,
    dto: SearchApplicationDto,
  ): Promise<Application[]> {
    await this.jobSeekerService.findOneOrThrow({ id: jobSeekerId });
    return this.search(dto, { jobSeekerId });
  }

  async search(
    dto: SearchApplicationDto,
    additionalFilters: Prisma.ApplicationWhereInput = {},
  ): Promise<Application[]> {
    const where: Prisma.ApplicationWhereInput = { ...additionalFilters };
    const orderBy = dto.orderBy ?? { createdAt: 'desc' };

    const pagination = getPaginationByPage(dto.page, this.pageSize);

    if (dto.status) {
      where.status = dto.status;
    }

    return this.repository.findMany({ where, ...pagination, orderBy });
  }
}
