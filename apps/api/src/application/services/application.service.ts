import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationRepository } from '../repositories/application.repository';
import { Prisma } from '@prisma/client';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { VacancyService } from '../../vacancy/services/vacancy.service';
import { FindManyApplicationsDto } from '../dto/find-many-applications.dto';
import { SetStatusDto } from '../dto/set-status.dto';
import { PaginatedResponse } from '@common/responses';
import { ApplicationWithRelations } from '../types/application-with-relations.type';
import { paginate } from '@common/utils/pagination.util';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly repository: ApplicationRepository,
    private readonly vacancyService: VacancyService,
  ) {}

  async create(
    dto: CreateApplicationDto,
    jobSeekerId: string,
  ): Promise<ApplicationWithRelations> {
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

  async findOneOrThrow(
    where: Prisma.ApplicationWhereUniqueInput,
  ): Promise<ApplicationWithRelations> {
    const application = await this.repository.findOne(where);
    if (!application) throw new NotFoundException('Application not found');
    return application;
  }

  async findMany(
    dto: FindManyApplicationsDto,
    additionalWhereParams: Prisma.ApplicationWhereInput,
  ): Promise<PaginatedResponse<ApplicationWithRelations>> {
    const where: Prisma.ApplicationWhereInput = { ...additionalWhereParams };

    if (dto.status) {
      where.status = dto.status;
    }

    const orderBy = dto.orderBy ?? { createdAt: Prisma.SortOrder.desc };

    return paginate({
      repository: this.repository,
      where,
      page: dto.page,
      take: dto.take,
      orderBy,
    });
  }

  async setStatus(
    id: string,
    dto: SetStatusDto,
    recruiterCompanyId: string,
  ): Promise<ApplicationWithRelations> {
    const application = await this.findOneOrThrow({ id });
    const vacancy = await this.vacancyService.findOneOrThrow({
      id: application.vacancyId,
    });

    if (vacancy.companyId !== recruiterCompanyId) {
      throw new ForbiddenException(
        'You can only update applications for your own company',
      );
    }

    return this.repository.update({ id }, dto);
  }
}
