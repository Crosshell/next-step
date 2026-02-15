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
  Query,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { Company, Recruiter } from '@prisma/client';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { SessionAuthGuard } from '../../auth/guards/session-auth.guard';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { FindManyCompaniesDto } from '../dto/find-many-companies.dto';
import { MessageResponse, PaginatedResponse } from '@common/responses';
import { InviteDto } from '../dto/invite.dto';
import { RecruiterWithoutCompanyGuard } from '../../recruiter/guards/recruiter-without-company.guard';
import { CurrentRecruiter } from '../../recruiter/decorators/current-recruiter.decorator';
import { RecruiterAdminGuard } from '../../recruiter/guards/recruiter-admin.guard';
import { CurrentRecruiterWithCompany } from '../../recruiter/decorators/current-recruiter-with-company.decorator';
import { RecruiterWithCompany } from '../../recruiter/types/recruiter-with-company.type';
import { RecruiterWithCompanyGuard } from '../../recruiter/guards/recruiter-with-company.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UserWithoutPassword } from '../../user/types/user-without-password.type';
import { AcceptInviteDto } from '../dto/accept-invite.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Post()
  @UseGuards(SessionAuthGuard, RecruiterWithoutCompanyGuard)
  async create(
    @Body() dto: CreateCompanyDto,
    @CurrentRecruiter() recruiter: Recruiter,
  ): Promise<Company> {
    return this.service.create(recruiter.id, dto);
  }

  @Post('invite')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionAuthGuard, RecruiterAdminGuard)
  async invite(
    @CurrentRecruiterWithCompany() recruiter: RecruiterWithCompany,
    @Body() dto: InviteDto,
  ): Promise<MessageResponse> {
    await this.service.invite(recruiter.companyId, dto);
    return { message: 'Invite sent successfully' };
  }

  @Get()
  async findMany(
    @Query() dto: FindManyCompaniesDto,
  ): Promise<PaginatedResponse<Company>> {
    return this.service.findMany(dto);
  }

  @Get('my')
  @UseGuards(SessionAuthGuard, RecruiterWithCompanyGuard)
  async getMy(
    @CurrentRecruiterWithCompany() recruiter: RecruiterWithCompany,
  ): Promise<Company> {
    return this.service.findOneOrThrow({ id: recruiter.companyId });
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Company> {
    return this.service.findOneOrThrow({ id });
  }

  @Get('invitations/accept')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionAuthGuard, RecruiterWithoutCompanyGuard)
  async acceptInvite(
    @Query() dto: AcceptInviteDto,
    @CurrentUser() user: UserWithoutPassword,
  ): Promise<MessageResponse> {
    await this.service.addRecruiter(user, dto);
    return { message: 'Invite accepted successfully' };
  }

  @Delete('recruiters/:recruiterId')
  @UseGuards(SessionAuthGuard, RecruiterAdminGuard)
  async removeRecruiter(
    @Param('recruiterId', ParseUUIDPipe) recruiterId: string,
    @CurrentRecruiterWithCompany() recruiter: RecruiterWithCompany,
  ): Promise<MessageResponse> {
    await this.service.removeRecruiter(recruiter.companyId, recruiterId);
    return { message: 'Recruiter removed successfully' };
  }

  @Patch('my')
  @UseGuards(SessionAuthGuard, RecruiterAdminGuard)
  async update(
    @Body() dto: UpdateCompanyDto,
    @CurrentRecruiterWithCompany() recruiter: RecruiterWithCompany,
  ): Promise<Company> {
    return this.service.update(recruiter.companyId, dto);
  }

  @Delete('my')
  @UseGuards(SessionAuthGuard, RecruiterAdminGuard)
  async delete(
    @CurrentRecruiterWithCompany() recruiter: RecruiterWithCompany,
  ): Promise<MessageResponse> {
    await this.service.delete(recruiter);
    return { message: 'Company deleted successfully' };
  }
}
