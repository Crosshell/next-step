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
import { ApplicationService } from './application.service';
import { Application, Company, JobSeeker } from '@prisma/client';
import { CurrentJobSeeker } from '../job-seeker/decorators/current-job-seeker.decorator';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { JobSeekerGuard } from '../job-seeker/guards/job-seeker.guard';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CompanyGuard } from '../company/guards/company.guard';
import { SearchApplicationDto } from './dto/search-application';
import { SetStatusDto } from './dto/set-status.dto';
import { VacancyOwnerGuard } from '../vacancy/guards/vacancy-owner.guard';
import { CurrentCompany } from '../company/decorators/current-company.decorator';
import { PagedDataResponse } from '@common/responses';

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

  @Get('vacancies/:id')
  @UseGuards(SessionAuthGuard, CompanyGuard, VacancyOwnerGuard)
  async searchByVacancy(
    @Query() dto: SearchApplicationDto,
    @Param('id', ParseUUIDPipe) vacancyId: string,
  ): Promise<PagedDataResponse<Application[]>> {
    return this.service.searchByVacancyId(vacancyId, dto);
  }

  @Get('job-seekers/my')
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  async searchMyApplications(
    @Query() dto: SearchApplicationDto,
    @CurrentJobSeeker() jobSeeker: JobSeeker,
  ): Promise<PagedDataResponse<Application[]>> {
    return this.service.searchByJobSeekerId(jobSeeker.id, dto);
  }

  @Put(':id/status')
  @UseGuards(SessionAuthGuard, CompanyGuard)
  async setStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SetStatusDto,
    @CurrentCompany() company: Company,
  ): Promise<Application> {
    return this.service.setStatus(id, company.id, dto);
  }
}
