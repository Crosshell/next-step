import { Injectable } from '@nestjs/common';
import { VacancyRepository } from './vacancy.repository';
import { Prisma, Vacancy } from '@prisma/client';
import { SearchVacancyDto } from './dto/search-vacancy.dto';
import { ConfigService } from '@nestjs/config';
import { LanguageService } from '../language/language.service';
import { SkillService } from '../skill/skill.service';
import { VacancyLanguageDto } from './dto/vacancy-language.dto';
import { getPaginationByPage, getLanguageLevelsFromLevel } from '@common/utils';

@Injectable()
export class VacancySearchService {
  private readonly searchPageSize: number;

  constructor(
    private readonly repository: VacancyRepository,
    private readonly config: ConfigService,
    private readonly languageService: LanguageService,
    private readonly skillService: SkillService,
  ) {
    this.searchPageSize = this.config.getOrThrow<number>(
      'search.vacancy.pageSize',
    );
  }

  async search(dto: SearchVacancyDto): Promise<Vacancy[]> {
    await this.validateSearchFilters(dto);
    const where = this.buildSearchFilter(dto);
    const pagination = getPaginationByPage(dto.page, this.searchPageSize);
    return this.repository.findMany(
      {
        where,
        ...pagination,
        orderBy: dto.orderBy ?? { createdAt: 'desc' },
      },
      true,
    );
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
            in: getLanguageLevelsFromLevel({ maxLevel: dto.level }),
          },
        },
      },
    };
  }
}
