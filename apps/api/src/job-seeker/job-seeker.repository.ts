import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobSeeker, Prisma } from '@prisma/client';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';

@Injectable()
export class JobSeekerRepository {
  private readonly jobSeekerRelations: Prisma.JobSeekerInclude;

  constructor(private readonly prisma: PrismaService) {
    this.jobSeekerRelations = {
      languages: {
        select: {
          level: true,
          language: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      skills: {
        select: {
          skill: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      contacts: true,
    };
  }

  async create(
    userId: string,
    dto: CreateJobSeekerDto,
    includeRelations?: boolean,
  ): Promise<JobSeeker> {
    return this.prisma.jobSeeker.create({
      data: { ...dto, user: { connect: { id: userId } } },
      include: includeRelations ? this.jobSeekerRelations : null,
    });
  }

  async findOne(
    where: Prisma.JobSeekerWhereUniqueInput,
    includeRelations?: boolean,
  ): Promise<JobSeeker | null> {
    return this.prisma.jobSeeker.findUnique({
      where,
      include: includeRelations ? this.jobSeekerRelations : null,
    });
  }

  async findMany(params: Prisma.JobSeekerFindManyArgs): Promise<JobSeeker[]> {
    return this.prisma.jobSeeker.findMany({
      ...params,
      include: params.include ?? this.jobSeekerRelations,
    });
  }

  async update(
    where: Prisma.JobSeekerWhereUniqueInput,
    dto: UpdateJobSeekerDto,
    includeRelations?: boolean,
  ): Promise<JobSeeker> {
    return this.prisma.jobSeeker.update({
      where,
      data: dto,
      include: includeRelations ? this.jobSeekerRelations : null,
    });
  }

  async setSkills(
    id: string,
    data: Prisma.JobSeekerSkillCreateManyJobSeekerInput[],
    includeRelations?: boolean,
  ): Promise<JobSeeker> {
    return this.prisma.jobSeeker.update({
      where: { id },
      data: {
        skills: {
          deleteMany: {},
          createMany: {
            data,
            skipDuplicates: true,
          },
        },
      },
      include: includeRelations ? this.jobSeekerRelations : null,
    });
  }

  async setLanguages(
    id: string,
    data: Prisma.JobSeekerLanguageCreateManyJobSeekerInput[],
    includeRelations?: boolean,
  ): Promise<JobSeeker> {
    return this.prisma.jobSeeker.update({
      where: { id },
      data: {
        languages: {
          deleteMany: {},
          createMany: {
            data,
            skipDuplicates: true,
          },
        },
      },
      include: includeRelations ? this.jobSeekerRelations : null,
    });
  }
}
