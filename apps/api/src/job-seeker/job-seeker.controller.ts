import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { JobSeekerGuard } from './guards/job-seeker.guard';
import { JobSeekerService } from './job-seeker.service';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserWithoutPassword } from '../user/types/user-without-password.type';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';
import { JobSeeker } from '@prisma/client';
import { CompanyGuard } from '../company/guards/company.guard';
import { SearchJobSeekerDto } from './dto/search-job-seeker.dto';
import { SetSkillsDto } from './dto/set-skills.dto';
import { SetLanguagesDto } from './dto/set-languages.dto';
import { CreateJobSeekerGuard } from './guards/create-job-seeker.guard';
import { CurrentJobSeeker } from './decorators/current-job-seeker.decorator';
import { JobSeekerSwagger } from '../../docs/swagger/job-seeker.swagger';
import { SetContactsDto } from './dto/set-contacts.dto';
import { PagedDataResponse } from '@common/responses';

@Controller('job-seekers')
export class JobSeekerController {
  constructor(private readonly service: JobSeekerService) {}

  @Post()
  @UseGuards(SessionAuthGuard, CreateJobSeekerGuard)
  @HttpCode(HttpStatus.CREATED)
  @JobSeekerSwagger.create()
  async create(
    @CurrentUser() user: UserWithoutPassword,
    @Body() dto: CreateJobSeekerDto,
  ): Promise<JobSeeker> {
    return this.service.create(user.id, dto);
  }

  @Get('me')
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  @HttpCode(HttpStatus.OK)
  @JobSeekerSwagger.getMyProfile()
  getMyProfile(@CurrentJobSeeker() jobSeeker: JobSeeker): JobSeeker {
    return jobSeeker;
  }

  @Get(':id')
  @UseGuards(SessionAuthGuard, CompanyGuard)
  @HttpCode(HttpStatus.OK)
  @JobSeekerSwagger.getProfile()
  async getProfile(@Param('id', ParseUUIDPipe) id: string): Promise<JobSeeker> {
    return this.service.findOneOrThrow({ id });
  }

  @Get('search')
  @UseGuards(SessionAuthGuard, CompanyGuard)
  @HttpCode(HttpStatus.OK)
  @JobSeekerSwagger.search()
  async search(
    @Query() dto: SearchJobSeekerDto,
  ): Promise<PagedDataResponse<JobSeeker[]>> {
    return this.service.search(dto);
  }

  @Patch('me')
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  @HttpCode(HttpStatus.OK)
  @JobSeekerSwagger.update()
  async update(
    @CurrentJobSeeker() jobSeeker: JobSeeker,
    @Body() dto: UpdateJobSeekerDto,
  ): Promise<JobSeeker> {
    return this.service.update(jobSeeker.id, dto);
  }

  @Put('me/skills')
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  @HttpCode(HttpStatus.OK)
  @JobSeekerSwagger.setSkills()
  async setSkills(
    @CurrentJobSeeker() jobSeeker: JobSeeker,
    @Body() dto: SetSkillsDto,
  ): Promise<JobSeeker> {
    return this.service.setSkills(jobSeeker.id, dto);
  }

  @Put('me/languages')
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  @HttpCode(HttpStatus.OK)
  @JobSeekerSwagger.setLanguages()
  async setLanguages(
    @CurrentJobSeeker() jobSeeker: JobSeeker,
    @Body() dto: SetLanguagesDto,
  ): Promise<JobSeeker> {
    return this.service.setLanguages(jobSeeker.id, dto);
  }

  @Put('me/contacts')
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  @HttpCode(HttpStatus.OK)
  @JobSeekerSwagger.setContacts()
  async setContacts(
    @CurrentJobSeeker() jobSeeker: JobSeeker,
    @Body() dto: SetContactsDto,
  ): Promise<JobSeeker> {
    return this.service.setContacts(jobSeeker.id, dto);
  }
}
