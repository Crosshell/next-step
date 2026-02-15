import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SessionAuthGuard } from '../../auth/guards/session-auth.guard';
import { JobSeekerGuard } from '../guards/job-seeker.guard';
import { JobSeekerService } from '../services/job-seeker.service';
import { CreateJobSeekerDto } from '../dto/create-job-seeker.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UserWithoutPassword } from '../../user/types/user-without-password.type';
import { UpdateJobSeekerDto } from '../dto/update-job-seeker.dto';
import { FindManyJobSeekersDto } from '../dto/find-many-job-seekers.dto';
import { SetSkillsDto } from '../dto/set-skills.dto';
import { SetLanguagesDto } from '../dto/set-languages.dto';
import { CurrentJobSeeker } from '../decorators/current-job-seeker.decorator';
import { SetContactsDto } from '../dto/set-contacts.dto';
import { MessageResponse, PaginatedResponse } from '@common/responses';
import { JobSeekerWithRelations } from '../types/job-seeker-with-relations.type';

@Controller('job-seekers')
export class JobSeekerController {
  constructor(private readonly service: JobSeekerService) {}

  @Post()
  @UseGuards(SessionAuthGuard)
  async create(
    @CurrentUser() user: UserWithoutPassword,
    @Body() dto: CreateJobSeekerDto,
  ): Promise<JobSeekerWithRelations> {
    return this.service.create(user.id, dto);
  }

  @Get('me')
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  getMe(
    @CurrentJobSeeker() jobSeeker: JobSeekerWithRelations,
  ): JobSeekerWithRelations {
    return jobSeeker;
  }

  @Get(':id')
  @UseGuards(SessionAuthGuard)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<JobSeekerWithRelations> {
    return this.service.findOneOrThrow({ id });
  }

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionAuthGuard)
  async findMany(
    @Body() dto: FindManyJobSeekersDto,
  ): Promise<PaginatedResponse<JobSeekerWithRelations>> {
    return this.service.findMany(dto);
  }

  @Patch('me')
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  async update(
    @CurrentJobSeeker() jobSeeker: JobSeekerWithRelations,
    @Body() dto: UpdateJobSeekerDto,
  ): Promise<JobSeekerWithRelations> {
    return this.service.update(jobSeeker.id, dto);
  }

  @Delete('me')
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  async delete(
    @CurrentJobSeeker() jobSeeker: JobSeekerWithRelations,
  ): Promise<MessageResponse> {
    await this.service.delete(jobSeeker.id);
    return { message: 'Job seeker deleted successfully' };
  }

  @Put('me/skills')
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  async setSkills(
    @CurrentJobSeeker() jobSeeker: JobSeekerWithRelations,
    @Body() dto: SetSkillsDto,
  ): Promise<JobSeekerWithRelations> {
    return this.service.setSkills(jobSeeker.id, dto);
  }

  @Put('me/languages')
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  async setLanguages(
    @CurrentJobSeeker() jobSeeker: JobSeekerWithRelations,
    @Body() dto: SetLanguagesDto,
  ): Promise<JobSeekerWithRelations> {
    return this.service.setLanguages(jobSeeker.id, dto);
  }

  @Put('me/contacts')
  @UseGuards(SessionAuthGuard, JobSeekerGuard)
  async setContacts(
    @CurrentJobSeeker() jobSeeker: JobSeekerWithRelations,
    @Body() dto: SetContactsDto,
  ): Promise<JobSeekerWithRelations> {
    return this.service.setContacts(jobSeeker.id, dto);
  }
}
