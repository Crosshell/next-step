import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationRepository } from './application.repository';
import { Application, Prisma } from '@prisma/client';
import { CreateApplicationDto } from './dto/create-application.dto';
import { VacancyService } from '../vacancy/vacancy.service';
import { getPaginationByPage, createPaginationMeta } from '@common/utils';
import { ConfigService } from '@nestjs/config';
import { SearchApplicationDto } from './dto/search-application';
import { JobSeekerService } from '../job-seeker/job-seeker.service';
import { SetStatusDto } from './dto/set-status.dto';
import { PagedDataResponse } from '@common/responses';

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
    return this.repository.create(dto, jobSeekerId, true);
  }

  async assertNotExists(
    where: Prisma.ApplicationWhereUniqueInput,
  ): Promise<void> {
    const application = await this.repository.findOne(where);
    if (application)
      throw new BadRequestException('Application already exists');
  }

  async findOneOrThrow(
    where: Prisma.ApplicationWhereUniqueInput,
  ): Promise<Application> {
    const application = await this.repository.findOne(where, true);
    if (!application) throw new NotFoundException('Application not found');
    return application;
  }

  async searchByVacancyId(
    vacancyId: string,
    dto: SearchApplicationDto,
  ): Promise<PagedDataResponse<Application[]>> {
    await this.vacancyService.findOneOrThrow({ id: vacancyId });
    return this.search(dto, { vacancyId });
  }

  async searchByJobSeekerId(
    jobSeekerId: string,
    dto: SearchApplicationDto,
  ): Promise<PagedDataResponse<Application[]>> {
    await this.jobSeekerService.findOneOrThrow({ id: jobSeekerId });
    return this.search(dto, { jobSeekerId });
  }

  async search(
    dto: SearchApplicationDto,
    additionalWhereParams: Prisma.ApplicationWhereInput,
  ): Promise<PagedDataResponse<Application[]>> {
    const where: Prisma.ApplicationWhereInput = { ...additionalWhereParams };
    const orderBy = dto.orderBy ?? { createdAt: 'desc' };

    const pagination = getPaginationByPage(dto.page, this.pageSize);

    if (dto.status) {
      where.status = dto.status;
    }

    const data = await this.repository.findMany(
      {
        where,
        ...pagination,
        orderBy,
      },
      true,
    );

    const total = await this.repository.count(where);

    const meta = createPaginationMeta(total, dto.page, this.pageSize);

    return { data, meta };
  }

  async setStatus(
    id: string,
    companyId: string,
    dto: SetStatusDto,
  ): Promise<Application> {
    const application = await this.findOneOrThrow({ id });

    const vacancy = await this.vacancyService.findOneOrThrow({
      id: application.vacancyId,
    });

    if (vacancy.companyId !== companyId) {
      throw new ForbiddenException(
        'You are not allowed to change the status of this application',
      );
    }

    return this.repository.update({ id }, dto, true);
  }
}
