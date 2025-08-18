import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Application, JobSeeker } from '@prisma/client';
import { CurrentJobSeeker } from '../job-seeker/decorators/current-job-seeker.decorator';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { JobSeekerGuard } from '../job-seeker/guards/job-seeker.guard';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly service: ApplicationService) {}

  @Post()
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateApplicationDto,
    @CurrentJobSeeker() jobSeeker: JobSeeker,
  ): Promise<Application> {
    return this.service.create(dto, jobSeeker.id);
  }
}
