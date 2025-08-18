import { BadRequestException, Injectable } from '@nestjs/common';
import { ApplicationRepository } from './application.repository';
import { Application, Prisma } from '@prisma/client';
import { CreateApplicationDto } from './dto/create-application.dto';
import { VacancyService } from '../vacancy/vacancy.service';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly repository: ApplicationRepository,
    private readonly vacancyService: VacancyService,
  ) {}

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
}
