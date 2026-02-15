import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RecruiterService } from '../services/recruiter.service';
import { Recruiter } from '@prisma/client';
import { CreateRecruiterDto } from '../dto/create-recruiter.dto';
import { SessionAuthGuard } from '../../auth/guards/session-auth.guard';
import { UserWithoutPassword } from '../../user/types/user-without-password.type';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { MessageResponse, PaginatedResponse } from '@common/responses';
import { RecruiterGuard } from '../guards/recruiter.guard';
import { CurrentRecruiter } from '../decorators/current-recruiter.decorator';
import { FindManyRecruitersDto } from '../dto/find-many-recruiters.dto';
import { UpdateRecruiterDto } from '../dto/update-recruiter.dto';
import { RecruiterWithCompanyGuard } from '../guards/recruiter-with-company.guard';
import { CurrentRecruiterWithCompany } from '../decorators/current-recruiter-with-company.decorator';

@Controller('recruiters')
export class RecruiterController {
  constructor(private readonly service: RecruiterService) {}

  @Post()
  @UseGuards(SessionAuthGuard)
  async create(
    @CurrentUser() user: UserWithoutPassword,
    @Body() dto: CreateRecruiterDto,
  ): Promise<Recruiter> {
    return this.service.create(user.id, dto);
  }

  @Get('me')
  @UseGuards(SessionAuthGuard, RecruiterGuard)
  getMe(@CurrentRecruiter() recruiter: Recruiter): Recruiter {
    return recruiter;
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Recruiter> {
    return this.service.findOneOrThrow({ id });
  }

  @Get()
  async findMany(
    @Query() dto: FindManyRecruitersDto,
  ): Promise<PaginatedResponse<Recruiter>> {
    return this.service.findMany(dto);
  }

  @Patch('me')
  @UseGuards(SessionAuthGuard, RecruiterGuard)
  async update(
    @CurrentRecruiter() recruiter: Recruiter,
    @Body() dto: UpdateRecruiterDto,
  ): Promise<Recruiter> {
    return this.service.update(recruiter.id, dto);
  }

  @Delete('me/company')
  @UseGuards(SessionAuthGuard, RecruiterWithCompanyGuard)
  async leaveCompany(
    @CurrentRecruiterWithCompany() recruiter: Recruiter,
  ): Promise<MessageResponse> {
    await this.service.leaveCompany(recruiter);
    return { message: 'Company left successfully' };
  }

  @Delete('me')
  @UseGuards(SessionAuthGuard, RecruiterGuard)
  async delete(
    @CurrentRecruiter() recruiter: Recruiter,
  ): Promise<MessageResponse> {
    await this.service.delete(recruiter);
    return { message: 'Recruiter deleted successfully' };
  }
}
