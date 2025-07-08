import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
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

@Controller('job-seekers')
export class JobSeekerController {
  constructor(private readonly jobSeekerService: JobSeekerService) {}

  @Post()
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  async create(
    @Body() createJobSeekerDto: CreateJobSeekerDto,
    @CurrentUser() user: UserWithoutPassword,
  ): Promise<JobSeeker> {
    return this.jobSeekerService.create(createJobSeekerDto, user.id);
  }

  @Get('me')
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  async getMyProfile(
    @CurrentUser() user: UserWithoutPassword,
  ): Promise<JobSeeker | null> {
    return this.jobSeekerService.findOne({ userId: user.id });
  }

  @Get(':id')
  @UseGuards(SessionAuthGuard, CompanyGuard)
  async getProfile(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<JobSeeker | null> {
    return this.jobSeekerService.findOne({ id });
  }

  @Post('search')
  @UseGuards(SessionAuthGuard, CompanyGuard)
  async search(
    @Body() searchJobSeekerDto: SearchJobSeekerDto,
  ): Promise<JobSeeker[]> {
    return this.jobSeekerService.findMany(searchJobSeekerDto);
  }

  @Patch('me')
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  async update(
    @Body() updateJobSeekerDto: UpdateJobSeekerDto,
    @CurrentUser() user: UserWithoutPassword,
  ): Promise<JobSeeker> {
    return this.jobSeekerService.update(updateJobSeekerDto, {
      userId: user.id,
    });
  }

  @Put('me/skills')
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  async updateSkills(
    @Body() setSkillsDto: SetSkillsDto,
    @CurrentUser() user: UserWithoutPassword,
  ): Promise<JobSeeker> {
    return this.jobSeekerService.setSkills(setSkillsDto, user.id);
  }

  @Put('me/languages')
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  async updateLanguages(
    @Body() setLanguagesDto: SetLanguagesDto,
    @CurrentUser() user: UserWithoutPassword,
  ): Promise<JobSeeker> {
    return this.jobSeekerService.setLanguages(setLanguagesDto, user.id);
  }
}
