import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateJobSeekerDto } from '../dto/create-job-seeker.dto';
import { JobSeeker, Prisma } from '@prisma/client';
import { UpdateJobSeekerDto } from '../dto/update-job-seeker.dto';
import {
  SubjectExistsException,
  SubjectNotFoundException,
} from '@common/exceptions';
import { SearchJobSeekerDto } from '../dto/search-job-seeker.dto';
import { SetSkillsDto } from '../dto/set-skills.dto';
import { SetLanguagesDto } from '../dto/set-languages.dto';
import { ConfigService } from '@nestjs/config';
import { JobSeekerSkillService } from './job-seeker-skill.service';
import { JobSeekerLanguageService } from './job-seeker-language.service';

@Injectable()
export class JobSeekerService {
  private readonly pageSize: number;
  private readonly jobSeekerRelations: Prisma.JobSeekerInclude;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jobSeekerSkillService: JobSeekerSkillService,
    private readonly jobSeekerLanguageService: JobSeekerLanguageService,
  ) {
    this.pageSize = this.configService.getOrThrow('jobSeeker.pageSize');
    this.jobSeekerRelations = {
      languages: { include: { language: true } },
      skills: { include: { skill: true } },
      contacts: true,
    };
  }

  async create(
    createJobSeekerDto: CreateJobSeekerDto,
    userId: string,
  ): Promise<JobSeeker> {
    await this.assertNotExists({ userId });

    return this.prismaService.jobSeeker.create({
      data: {
        ...createJobSeekerDto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: this.jobSeekerRelations,
    });
  }

  async findOne(
    where: Prisma.JobSeekerWhereUniqueInput,
  ): Promise<JobSeeker | null> {
    return this.prismaService.jobSeeker.findUnique({
      where,
      include: this.jobSeekerRelations,
    });
  }

  async assertNotExists(
    where: Prisma.JobSeekerWhereUniqueInput,
  ): Promise<void> {
    const jobSeeker = await this.findOne(where);
    if (jobSeeker) throw new SubjectExistsException('Job seeker');
  }

  async findOrThrow(
    where: Prisma.JobSeekerWhereUniqueInput,
  ): Promise<JobSeeker> {
    const jobSeeker = await this.findOne(where);
    if (!jobSeeker) throw new SubjectNotFoundException('Job seeker');
    return jobSeeker;
  }

  async findMany(searchJobSeekerDto: SearchJobSeekerDto): Promise<JobSeeker[]> {
    const where = this.buildSearchFilter(searchJobSeekerDto);
    const skip = (searchJobSeekerDto.page - 1) * this.pageSize;

    return this.prismaService.jobSeeker.findMany({
      where,
      skip,
      take: this.pageSize,
      orderBy: { updatedAt: 'desc' },
      include: this.jobSeekerRelations,
    });
  }

  async update(
    updateJobSeekerDto: UpdateJobSeekerDto,
    where: Prisma.JobSeekerWhereUniqueInput,
  ): Promise<JobSeeker> {
    return this.prismaService.jobSeeker.update({
      where,
      data: updateJobSeekerDto,
      include: this.jobSeekerRelations,
    });
  }

  async setSkills(
    setSkillsDto: SetSkillsDto,
    userId: string,
  ): Promise<JobSeeker> {
    const jobSeeker = await this.findOrThrow({ userId });
    return this.jobSeekerSkillService.setSkills(
      jobSeeker.id,
      setSkillsDto.skillIds,
      this.jobSeekerRelations,
    );
  }

  async setLanguages(
    setLanguagesDto: SetLanguagesDto,
    userId: string,
  ): Promise<JobSeeker> {
    const jobSeeker = await this.findOrThrow({ userId });
    return this.jobSeekerLanguageService.setLanguages(
      jobSeeker.id,
      setLanguagesDto.languageItems,
      this.jobSeekerRelations,
    );
  }

  private buildSearchFilter(
    searchJobSeekerDto: SearchJobSeekerDto,
  ): Prisma.JobSeekerWhereInput {
    const filter: Prisma.JobSeekerWhereInput = { isOpenToWork: true };

    if (searchJobSeekerDto.languageItems?.length) {
      filter.languages = {
        some: {
          OR: searchJobSeekerDto.languageItems.map((item) => ({
            languageId: item.languageId,
            languageLevel: item.level,
          })),
        },
      };
    }

    if (searchJobSeekerDto.skillIds?.length) {
      filter.skills = {
        some: { skillId: { in: searchJobSeekerDto.skillIds } },
      };
    }

    if (searchJobSeekerDto.seniorityLevels?.length) {
      filter.seniorityLevel = { in: searchJobSeekerDto.seniorityLevels };
    }

    return filter;
  }
}
