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
import { VacancyService } from '../services/vacancy.service';
import { CreateVacancyDto } from '../dto/create-vacancy.dto';
import { SessionAuthGuard } from '../../auth/guards/session-auth.guard';
import { MessageResponse, PaginatedResponse } from '@common/responses';
import { UpdateVacancyDto } from '../dto/update-vacancy.dto';
import { FindManyVacanciesDto } from '../dto/find-many-vacancies.dto';
import { SetSkillsDto } from '../dto/set-skills.dto';
import { SetLanguagesDto } from '../dto/set-languages.dto';
import { VacancyOwnerGuard } from '../guards/vacancy-owner.guard';
import { RecruiterWithCompanyGuard } from '../../recruiter/guards/recruiter-with-company.guard';
import { CurrentRecruiterWithCompany } from '../../recruiter/decorators/current-recruiter-with-company.decorator';
import { RecruiterWithCompany } from '../../recruiter/types/recruiter-with-company.type';
import { VacancyWithRelations } from '../types/vacancy-with-relations.type';

@Controller('vacancies')
export class VacancyController {
  constructor(private readonly service: VacancyService) {}

  @Post()
  @UseGuards(SessionAuthGuard, RecruiterWithCompanyGuard)
  async create(
    @CurrentRecruiterWithCompany() recruiter: RecruiterWithCompany,
    @Body() dto: CreateVacancyDto,
  ): Promise<VacancyWithRelations> {
    return this.service.create(recruiter.companyId, dto);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<VacancyWithRelations> {
    return this.service.findOneOrThrow({ id });
  }

  @Post('search')
  @HttpCode(HttpStatus.OK)
  async findMany(
    @Body() dto: FindManyVacanciesDto,
  ): Promise<PaginatedResponse<VacancyWithRelations>> {
    return this.service.findMany(dto);
  }

  @Patch(':id')
  @UseGuards(SessionAuthGuard, RecruiterWithCompanyGuard, VacancyOwnerGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVacancyDto,
  ): Promise<VacancyWithRelations> {
    return this.service.update({ id }, dto);
  }

  @Delete(':id')
  @UseGuards(SessionAuthGuard, RecruiterWithCompanyGuard, VacancyOwnerGuard)
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MessageResponse> {
    await this.service.delete({ id });
    return { message: 'Vacancy deleted successfully' };
  }

  @Put(':id/skills')
  @UseGuards(SessionAuthGuard, RecruiterWithCompanyGuard, VacancyOwnerGuard)
  async setRequiredSkills(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SetSkillsDto,
  ): Promise<VacancyWithRelations> {
    return this.service.setRequiredSkills(id, dto);
  }

  @Put(':id/languages')
  @UseGuards(SessionAuthGuard, RecruiterWithCompanyGuard, VacancyOwnerGuard)
  async setRequiredLanguages(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SetLanguagesDto,
  ): Promise<VacancyWithRelations> {
    return this.service.setRequiredLanguages(id, dto);
  }
}
