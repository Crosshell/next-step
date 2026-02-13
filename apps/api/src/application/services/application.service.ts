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
import { createPaginationMeta } from '@common/utils';
import { FindManyApplicationsDto } from '../dto/find-many-applications.dto';
import { SetStatusDto } from '../dto/set-status.dto';
import { PagedDataResponse } from '@common/responses';
import { ApplicationWithRelations } from '../types/application-with-relations.type';

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

  async search(
    dto: FindManyApplicationsDto,
    additionalWhereParams: Prisma.ApplicationWhereInput,
  ): Promise<PagedDataResponse<ApplicationWithRelations[]>> {
    const where: Prisma.ApplicationWhereInput = { ...additionalWhereParams };

    if (dto.status) {
      where.status = dto.status;
    }

    const skip = (dto.page - 1) * dto.take;
    const orderBy = dto.orderBy ?? { createdAt: Prisma.SortOrder.desc };

    const data = await this.repository.findMany(where, orderBy, skip, dto.take);

    const total = await this.repository.count(where);

    const meta = createPaginationMeta(total, dto.page, dto.take);

    return { data, meta };
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
