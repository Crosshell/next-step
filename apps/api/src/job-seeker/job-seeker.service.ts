import { Injectable } from '@nestjs/common';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { JobSeeker, Prisma } from '@prisma/client';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';
import {
  SubjectExistsException,
  SubjectNotFoundException,
} from '@common/exceptions';
import { SearchJobSeekerDto } from './dto/search-job-seeker.dto';
import { SetSkillsDto } from './dto/set-skills.dto';
import { SetLanguagesDto } from './dto/set-languages.dto';
import { ConfigService } from '@nestjs/config';
import { JobSeekerRepository } from './job-seeker.repository';
import { SkillService } from '../skill/skill.service';
import { LanguageService } from '../language/language.service';

@Injectable()
export class JobSeekerService {
  private readonly pageSize: number;

  constructor(
    private readonly config: ConfigService,
    private readonly repository: JobSeekerRepository,
    private readonly skillService: SkillService,
    private readonly languageService: LanguageService,
  ) {
    this.pageSize = this.config.getOrThrow<number>('jobSeeker.pageSize');
  }

  async create(userId: string, dto: CreateJobSeekerDto): Promise<JobSeeker> {
    await this.assertNotExists({ userId });
    return this.repository.create(userId, dto, true);
  }

  async findOneOrThrow(
    where: Prisma.JobSeekerWhereUniqueInput,
  ): Promise<JobSeeker> {
    const jobSeeker = await this.repository.findOne(where, true);
    if (!jobSeeker) throw new SubjectNotFoundException('Job seeker');
    return jobSeeker;
  }

  async assertNotExists(
    where: Prisma.JobSeekerWhereUniqueInput,
  ): Promise<void> {
    const jobSeeker = await this.repository.findOne(where);
    if (jobSeeker) throw new SubjectExistsException('Job seeker');
  }

  async search(dto: SearchJobSeekerDto): Promise<JobSeeker[]> {
    const where = this.buildSearchFilter(dto);
    const skip = (dto.page - 1) * this.pageSize;
    return this.repository.findMany({
      where,
      skip,
      take: this.pageSize,
      orderBy: { updatedAt: 'desc' },
    });
  }

  async update(id: string, dto: UpdateJobSeekerDto): Promise<JobSeeker> {
    return this.repository.update({ id }, dto, true);
  }

  async setSkills(id: string, dto: SetSkillsDto): Promise<JobSeeker> {
    await this.skillService.assertExists(dto.skillIds);

    const skillIds = dto.skillIds.map((skillId) => ({ skillId }));

    return this.repository.putSkills(id, skillIds, true);
  }

  async setLanguages(id: string, dto: SetLanguagesDto): Promise<JobSeeker> {
    const languageIds = dto.languageItems.map((item) => item.languageId);
    await this.languageService.assertExists(languageIds);

    const data = dto.languageItems.map((i) => ({
      languageId: i.languageId,
      languageLevel: i.level,
    }));

    return this.repository.putLanguages(id, data, true);
  }

  private buildSearchFilter(
    dto: SearchJobSeekerDto,
  ): Prisma.JobSeekerWhereInput {
    const filter: Prisma.JobSeekerWhereInput = { isOpenToWork: true };

    if (dto.languageItems?.length) {
      filter.languages = {
        some: {
          OR: dto.languageItems.map((item) => ({
            languageId: item.languageId,
            languageLevel: item.level,
          })),
        },
      };
    }

    if (dto.skillIds?.length) {
      filter.skills = {
        some: { skillId: { in: dto.skillIds } },
      };
    }

    if (dto.seniorityLevels?.length) {
      filter.seniorityLevel = { in: dto.seniorityLevels };
    }

    return filter;
  }
}
