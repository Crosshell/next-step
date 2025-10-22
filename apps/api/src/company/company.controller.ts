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
  Query,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from '@prisma/client';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserWithoutPassword } from '../user/types/user-without-password.type';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { CompanyGuard } from './guards/company.guard';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SearchCompanyDto } from './dto/search-company.dto';
import { CreateCompanyGuard } from './guards/create-company.guard';
import { CurrentCompany } from './decorators/current-company.decorator';
import { PagedDataResponse } from '@common/responses';

@Controller('companies')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Post()
  @UseGuards(SessionAuthGuard, CreateCompanyGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateCompanyDto,
    @CurrentUser() user: UserWithoutPassword,
  ): Promise<Company> {
    return this.service.create(user.id, dto);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async search(
    @Query() dto: SearchCompanyDto,
  ): Promise<PagedDataResponse<Company[]>> {
    return this.service.search(dto);
  }

  @Get('me')
  @UseGuards(SessionAuthGuard, CompanyGuard)
  @HttpCode(HttpStatus.OK)
  async getMyProfile(@CurrentCompany() company: Company): Promise<Company> {
    return this.service.findOneOrThrow({ id: company.id });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Param('id', ParseUUIDPipe) id: string): Promise<Company> {
    return this.service.findOneOrThrow({ id });
  }

  @Patch('me')
  @UseGuards(SessionAuthGuard, CompanyGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() dto: UpdateCompanyDto,
    @CurrentCompany() company: Company,
  ): Promise<Company> {
    return this.service.update(company.id, dto);
  }
}
