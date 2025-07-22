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
  UseGuards,
} from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { Company, Vacancy } from '@prisma/client';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { CurrentCompany } from '../company/decorators/current-company.decorator';
import { CompanyGuard } from '../company/guards/company.guard';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { MessageResponse } from '@common/responses';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';

@Controller('vacancies')
export class VacancyController {
  constructor(private readonly service: VacancyService) {}

  @Post()
  @UseGuards(SessionAuthGuard, CompanyGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentCompany() company: Company,
    @Body() dto: CreateVacancyDto,
  ): Promise<Vacancy> {
    return this.service.create(company.id, dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Vacancy> {
    return this.service.findOneOrThrow({ id });
  }

  @Get('company/:companyId')
  @HttpCode(HttpStatus.OK)
  async getByCompany(
    @Param('companyId') companyId: string,
  ): Promise<Vacancy[]> {
    return this.service.findMany({ companyId });
  }

  @Get('my')
  @UseGuards(SessionAuthGuard, CompanyGuard)
  @HttpCode(HttpStatus.OK)
  async getMyVacancies(@CurrentCompany() company: Company): Promise<Vacancy[]> {
    return this.service.findMany({ companyId: company.id });
  }

  @Patch(':id')
  @UseGuards(SessionAuthGuard, CompanyGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentCompany() company: Company,
    @Body() dto: UpdateVacancyDto,
  ): Promise<Vacancy> {
    return this.service.update({ id }, company.id, dto);
  }

  @Delete(':id')
  @UseGuards(SessionAuthGuard, CompanyGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentCompany() company: Company,
  ): Promise<MessageResponse> {
    await this.service.delete({ id }, company.id);
    return { message: 'Vacancy deleted successfully' };
  }
}
