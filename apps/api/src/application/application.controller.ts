import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Application, JobSeeker } from '@prisma/client';
import { CurrentJobSeeker } from '../job-seeker/decorators/current-job-seeker.decorator';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { JobSeekerGuard } from '../job-seeker/guards/job-seeker.guard';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CompanyGuard } from '../company/guards/company.guard';
import { SearchApplicationDto } from './dto/search-application';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly service: ApplicationService) {}

  @Post()
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  async create(
    @Body() dto: CreateApplicationDto,
    @CurrentJobSeeker() jobSeeker: JobSeeker,
  ): Promise<Application> {
    return this.service.create(dto, jobSeeker.id);
  }

  @Get('vacancies/:vacancyId')
  @UseGuards(SessionAuthGuard, CompanyGuard)
  async searchByVacancy(
    @Query() dto: SearchApplicationDto,
    @Param('vacancyId', ParseUUIDPipe) vacancyId: string,
  ): Promise<Application[]> {
    return this.service.searchByVacancyId(vacancyId, dto);
  }

  @Get('job-seekers/my')
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  async searchMyApplications(
    @Query() dto: SearchApplicationDto,
    @CurrentJobSeeker() jobSeeker: JobSeeker,
  ): Promise<Application[]> {
    return this.service.searchByJobSeekerId(jobSeeker.id, dto);
  }
}
