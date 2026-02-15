import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApplicationService } from '../services/application.service';
import { CurrentJobSeeker } from '../../job-seeker/decorators/current-job-seeker.decorator';
import { SessionAuthGuard } from '../../auth/guards/session-auth.guard';
import { JobSeekerGuard } from '../../job-seeker/guards/job-seeker.guard';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { FindManyApplicationsDto } from '../dto/find-many-applications.dto';
import { SetStatusDto } from '../dto/set-status.dto';
import { VacancyOwnerGuard } from '../../vacancy/guards/vacancy-owner.guard';
import { PaginatedResponse } from '@common/responses';
import { RecruiterWithCompanyGuard } from '../../recruiter/guards/recruiter-with-company.guard';
import { CurrentRecruiter } from '../../recruiter/decorators/current-recruiter.decorator';
import { RecruiterWithCompany } from '../../recruiter/types/recruiter-with-company.type';
import { JobSeekerWithRelations } from '../../job-seeker/types/job-seeker-with-relations.type';
import { ApplicationWithRelations } from '../types/application-with-relations.type';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly service: ApplicationService) {}

  @Post()
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  async create(
    @Body() dto: CreateApplicationDto,
    @CurrentJobSeeker() jobSeeker: JobSeekerWithRelations,
  ): Promise<ApplicationWithRelations> {
    return this.service.create(dto, jobSeeker.id);
  }

  @Get(':id')
  @UseGuards(SessionAuthGuard)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApplicationWithRelations> {
    return this.service.findOneOrThrow({ id });
  }

  @Get('vacancies/:id')
  @UseGuards(SessionAuthGuard, RecruiterWithCompanyGuard, VacancyOwnerGuard)
  async findManyByVacancy(
    @Query() dto: FindManyApplicationsDto,
    @Param('id', ParseUUIDPipe) vacancyId: string,
  ): Promise<PaginatedResponse<ApplicationWithRelations>> {
    return this.service.findMany(dto, { vacancyId: vacancyId });
  }

  @Get('job-seekers/my')
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  async findMy(
    @Query() dto: FindManyApplicationsDto,
    @CurrentJobSeeker() jobSeeker: JobSeekerWithRelations,
  ): Promise<PaginatedResponse<ApplicationWithRelations>> {
    return this.service.findMany(dto, { jobSeekerId: jobSeeker.id });
  }

  @Put(':id/status')
  @UseGuards(SessionAuthGuard, RecruiterWithCompanyGuard)
  async setStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SetStatusDto,
    @CurrentRecruiter() recruiter: RecruiterWithCompany,
  ): Promise<ApplicationWithRelations> {
    return this.service.setStatus(id, dto, recruiter.companyId);
  }
}
