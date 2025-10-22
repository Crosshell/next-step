import { Injectable, NotFoundException } from '@nestjs/common';
import { VacancyRepository } from './vacancy.repository';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { Prisma, Vacancy } from '@prisma/client';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { SearchVacancyDto } from './dto/search-vacancy.dto';
import { LanguageService } from '../language/language.service';
import { SkillService } from '../skill/skill.service';
import { SetLanguagesDto } from './dto/set-languages.dto';
import { SetSkillsDto } from './dto/set-skills.dto';
import { VacancySearchService } from './vacancy-search.service';
import { CompanyService } from '../company/company.service';
import { PagedDataResponse } from '@common/responses';

@Injectable()
export class VacancyService {
  constructor(
    private readonly repository: VacancyRepository,
    private readonly languageService: LanguageService,
    private readonly skillService: SkillService,
    private readonly searchService: VacancySearchService,
    private readonly companyService: CompanyService,
  ) {}

  async create(companyId: string, dto: CreateVacancyDto): Promise<Vacancy> {
    return this.repository.create(companyId, dto, true);
  }

  async findOne(
    where: Prisma.VacancyWhereUniqueInput,
  ): Promise<Vacancy | null> {
    return this.repository.findOne(where, true);
  }

  async findOneOrThrow(
    where: Prisma.VacancyWhereUniqueInput,
  ): Promise<Vacancy> {
    const vacancy = await this.repository.findOne(where, true);
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return vacancy;
  }

  async searchByCompanyId(
    companyId: string,
    dto: SearchVacancyDto,
  ): Promise<PagedDataResponse<Vacancy[]>> {
    await this.companyService.findOneOrThrow({ id: companyId });
    return this.searchService.search(dto, { companyId });
  }

  async search(
    dto: SearchVacancyDto,
    additionalWhereParams?: Prisma.VacancyWhereInput,
  ): Promise<PagedDataResponse<Vacancy[]>> {
    return this.searchService.search(dto, additionalWhereParams);
  }

  async update(
    where: Prisma.VacancyWhereUniqueInput,
    dto: UpdateVacancyDto,
  ): Promise<Vacancy> {
    return this.repository.update(where, dto, true);
  }

  async delete(where: Prisma.VacancyWhereUniqueInput): Promise<Vacancy> {
    return this.repository.delete(where);
  }

  async setRequiredSkills(id: string, dto: SetSkillsDto): Promise<Vacancy> {
    await this.skillService.assertExists(dto.requiredSkillIds);
    const requiredSkills = dto.requiredSkillIds.map((skillId) => ({
      skillId,
    }));
    return this.repository.setRequiredSkills(id, requiredSkills, true);
  }

  async setRequiredLanguages(
    id: string,
    dto: SetLanguagesDto,
  ): Promise<Vacancy> {
    const languageIds = dto.requiredLanguages.map((lang) => lang.languageId);
    await this.languageService.assertExists(languageIds);
    return this.repository.setRequiredLanguages(
      id,
      dto.requiredLanguages,
      true,
    );
  }
}
