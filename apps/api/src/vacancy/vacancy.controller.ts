import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { Company, Vacancy } from '@prisma/client';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { CurrentCompany } from '../company/decorators/current-company.decorator';
import { CompanyGuard } from '../company/guards/company.guard';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';

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
}
