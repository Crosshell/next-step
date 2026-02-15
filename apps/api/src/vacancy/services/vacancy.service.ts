import { Injectable, NotFoundException } from '@nestjs/common';
import { VacancyRepository } from '../repositories/vacancy.repository';
import { CreateVacancyDto } from '../dto/create-vacancy.dto';
import { Prisma, Vacancy } from '@prisma/client';
import { UpdateVacancyDto } from '../dto/update-vacancy.dto';
import { FindManyVacanciesDto } from '../dto/find-many-vacancies.dto';
import { LanguageService } from '../../language/services/language.service';
import { SkillService } from '../../skill/services/skill.service';
import { SetLanguagesDto } from '../dto/set-languages.dto';
import { SetSkillsDto } from '../dto/set-skills.dto';
import { PaginatedResponse } from '@common/responses';
import { VacancyQueryBuilder } from '../builders/vacancy-query.builder';
import { VacancyWithRelations } from '../types/vacancy-with-relations.type';
import { paginate } from '@common/utils/pagination.util';

@Injectable()
export class VacancyService {
  constructor(
    private readonly repository: VacancyRepository,
    private readonly languageService: LanguageService,
    private readonly skillService: SkillService,
  ) {}

  async create(
    companyId: string,
    dto: CreateVacancyDto,
  ): Promise<VacancyWithRelations> {
    return this.repository.create(companyId, dto);
  }

  async findOneOrThrow(
    where: Prisma.VacancyWhereUniqueInput,
  ): Promise<VacancyWithRelations> {
    const vacancy = await this.repository.findOne(where);
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return vacancy;
  }

  async findMany(
    dto: FindManyVacanciesDto,
  ): Promise<PaginatedResponse<VacancyWithRelations>> {
    const where = new VacancyQueryBuilder()
      .withTitle(dto.title)
      .withSalaryMin(dto.salaryMin)
      .withExperience(dto.experienceRequired)
      .withWorkFormats(dto.workFormats)
      .withEmploymentTypes(dto.employmentTypes)
      .withSeniorityLevels(dto.seniorityLevels)
      .withRequiredSkillIds(dto.requiredSkillIds)
      .withRequiredLanguages(dto.requiredLanguages)
      .withCompanyId(dto.companyId, true)
      .build();

    const orderBy = dto.orderBy ?? { createdAt: Prisma.SortOrder.desc };

    return paginate({
      repository: this.repository,
      where,
      page: dto.page,
      take: dto.take,
      orderBy,
    });
  }

  async update(
    where: Prisma.VacancyWhereUniqueInput,
    dto: UpdateVacancyDto,
  ): Promise<VacancyWithRelations> {
    return this.repository.update(where, dto);
  }

  async delete(where: Prisma.VacancyWhereUniqueInput): Promise<Vacancy> {
    return this.repository.delete(where);
  }

  async setRequiredSkills(
    id: string,
    dto: SetSkillsDto,
  ): Promise<VacancyWithRelations> {
    await this.skillService.assertExists(dto.requiredSkillIds);
    const requiredSkills = dto.requiredSkillIds.map((skillId) => ({
      skillId,
    }));
    return this.repository.setRequiredSkills(id, requiredSkills);
  }

  async setRequiredLanguages(
    id: string,
    dto: SetLanguagesDto,
  ): Promise<VacancyWithRelations> {
    const languageIds = dto.requiredLanguages.map((lang) => lang.languageId);
    await this.languageService.assertExists(languageIds);
    return this.repository.setRequiredLanguages(id, dto.requiredLanguages);
  }
}
