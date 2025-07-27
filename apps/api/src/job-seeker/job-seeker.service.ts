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
import { JobSeekerRepository } from './job-seeker.repository';
import { SkillService } from '../skill/skill.service';
import { LanguageService } from '../language/language.service';
import { JobSeekerSearchService } from './job-seeker-search.service';

@Injectable()
export class JobSeekerService {
  constructor(
    private readonly repository: JobSeekerRepository,
    private readonly skillService: SkillService,
    private readonly languageService: LanguageService,
    private readonly searchService: JobSeekerSearchService,
  ) {}

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
    return this.searchService.search(dto);
  }

  async update(id: string, dto: UpdateJobSeekerDto): Promise<JobSeeker> {
    return this.repository.update({ id }, dto, true);
  }

  async setSkills(id: string, dto: SetSkillsDto): Promise<JobSeeker> {
    await this.skillService.assertExists(dto.skillIds);
    const skillIds = dto.skillIds.map((skillId) => ({ skillId }));
    return this.repository.setSkills(id, skillIds, true);
  }

  async setLanguages(id: string, dto: SetLanguagesDto): Promise<JobSeeker> {
    const languageIds = dto.languages.map((language) => language.languageId);
    await this.languageService.assertExists(languageIds);
    return this.repository.setLanguages(id, dto.languages, true);
  }
}
