import { Injectable } from '@nestjs/common';
import { VacancyRepository } from './vacancy.repository';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { Prisma, Vacancy } from '@prisma/client';
import { SubjectNotFoundException } from '@common/exceptions';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { SearchVacancyDto } from './dto/search-vacancy.dto';
import { ConfigService } from '@nestjs/config';
import { LanguageService } from '../language/language.service';
import { SkillService } from '../skill/skill.service';
import { SetLanguagesDto } from './dto/set-languages.dto';
import { SetSkillsDto } from './dto/set-skills.dto';
import { VacancyLanguageDto } from './dto/vacancy-language.dto';

@Injectable()
export class VacancyService {
  private readonly pageSize: number;

  constructor(
    private readonly repository: VacancyRepository,
    private readonly config: ConfigService,
    private readonly languageService: LanguageService,
    private readonly skillService: SkillService,
  ) {
    this.pageSize = this.config.getOrThrow<number>('vacancy.pageSize');
  }

  async create(companyId: string, dto: CreateVacancyDto): Promise<Vacancy> {
    return this.repository.create(companyId, dto, true);
  }

  async findOneOrThrow(
    where: Prisma.VacancyWhereUniqueInput,
  ): Promise<Vacancy> {
    const vacancy = await this.repository.findOne(where, true);
    if (!vacancy) throw new SubjectNotFoundException('Vacancy');
    return vacancy;
  }

  async findMany(where: Prisma.VacancyWhereInput): Promise<Vacancy[]> {
    return this.repository.findMany({ where }, true);
  }

  async search(dto: SearchVacancyDto): Promise<Vacancy[]> {
    await this.validateSearchFilters(dto);

    const where = this.buildSearchFilter(dto);
    const skip = (dto.page - 1) * this.pageSize;
    return this.repository.findMany(
      {
        where,
        skip,
        take: this.pageSize,
        orderBy: dto.orderBy ?? { createdAt: 'desc' },
      },
      true,
    );
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
    const languageIds = dto.requiredLanguages.map(
      (language) => language.languageId,
    );
    await this.languageService.assertExists(languageIds);
    return this.repository.setRequiredLanguages(
      id,
      dto.requiredLanguages,
      true,
    );
  }

  private buildSearchFilter(dto: SearchVacancyDto): Prisma.VacancyWhereInput {
    const filter: Prisma.VacancyWhereInput = { isActive: true };

    if (dto.title) {
      filter.title = { contains: dto.title, mode: 'insensitive' };
    }

    if (dto.salaryMin) {
      filter.salaryMin = { gte: dto.salaryMin };
    }

    if (dto.experienceRequired) {
      filter.experienceRequired = { lte: dto.experienceRequired };
    }

    if (dto.workFormats?.length) {
      filter.workFormat = { hasSome: dto.workFormats };
    }

    if (dto.employmentTypes?.length) {
      filter.employmentType = { hasSome: dto.employmentTypes };
    }

    if (dto.seniorityLevel) {
      filter.seniorityLevel = { equals: dto.seniorityLevel };
    }

    if (dto.requiredLanguages?.length) {
      filter.requiredLanguages = {
        some: {
          OR: dto.requiredLanguages.map((lang) =>
            this.buildLanguageFilter(lang),
          ),
        },
      };
    }

    if (dto.requiredSkillIds?.length) {
      filter.requiredSkills = {
        some: { skillId: { in: dto.requiredSkillIds } },
      };
    }

    return filter;
  }

  private buildLanguageFilter(
    dto: VacancyLanguageDto,
  ): Prisma.VacancyWhereInput {
    return {
      requiredLanguages: {
        some: {
          languageId: dto.languageId,
          level: {
            in: this.languageService.getLanguageLevelsFromLevel({
              maxLevel: dto.level,
            }),
          },
        },
      },
    };
  }

  private async validateSearchFilters(dto: SearchVacancyDto): Promise<void> {
    if (dto.requiredSkillIds?.length) {
      await this.skillService.assertExists(dto.requiredSkillIds);
    }
    if (dto.requiredLanguages?.length) {
      const languageIds = dto.requiredLanguages.map((lang) => lang.languageId);
      await this.languageService.assertExists(languageIds);
    }
  }
}
