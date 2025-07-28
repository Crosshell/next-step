import { Injectable } from '@nestjs/common';
import { JobSeeker, Prisma } from '@prisma/client';
import { SearchJobSeekerDto } from './dto/search-job-seeker.dto';
import { ConfigService } from '@nestjs/config';
import { JobSeekerRepository } from './job-seeker.repository';
import { SkillService } from '../skill/skill.service';
import { LanguageService } from '../language/language.service';
import { JobSeekerLanguageDto } from './dto/job-seeker-language.dto';
import { getPaginationByPage, getLanguageLevelsFromLevel } from '@common/utils';

@Injectable()
export class JobSeekerSearchService {
  private readonly searchPageSize: number;

  constructor(
    private readonly config: ConfigService,
    private readonly repository: JobSeekerRepository,
    private readonly skillService: SkillService,
    private readonly languageService: LanguageService,
  ) {
    this.searchPageSize = this.config.getOrThrow<number>(
      'search.jobSeeker.pageSize',
    );
  }

  async search(dto: SearchJobSeekerDto): Promise<JobSeeker[]> {
    await this.validateSearchFilters(dto);
    const where = this.buildSearchFilter(dto);

    const pagination = getPaginationByPage(dto.page, this.searchPageSize);

    return this.repository.findMany({
      where,
      ...pagination,
      orderBy: dto.orderBy ?? { updatedAt: 'desc' },
    });
  }

  private buildSearchFilter(
    dto: SearchJobSeekerDto,
  ): Prisma.JobSeekerWhereInput {
    const filter: Prisma.JobSeekerWhereInput = { isOpenToWork: true };

    if (dto.languages?.length) {
      filter.AND = dto.languages.map((lang) => this.buildLanguageFilter(lang));
    }

    if (dto.skillIds?.length) {
      filter.skills = { some: { skillId: { in: dto.skillIds } } };
    }

    if (dto.seniorityLevels?.length) {
      filter.seniorityLevel = { in: dto.seniorityLevels };
    }

    return filter;
  }

  private buildLanguageFilter(
    dto: JobSeekerLanguageDto,
  ): Prisma.JobSeekerWhereInput {
    return {
      languages: {
        some: {
          languageId: dto.languageId,
          level: {
            in: getLanguageLevelsFromLevel({ minLevel: dto.level }),
          },
        },
      },
    };
  }

  private async validateSearchFilters(dto: SearchJobSeekerDto): Promise<void> {
    if (dto.skillIds?.length) {
      await this.skillService.assertExists(dto.skillIds);
    }
    if (dto.languages?.length) {
      const languageIds = dto.languages.map((lang) => lang.languageId);
      await this.languageService.assertExists(languageIds);
    }
  }
}
