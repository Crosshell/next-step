import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobSeeker, Prisma } from '@prisma/client';

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
    data: Prisma.JobSeekerCreateWithoutUserInput,
    includeRelations?: boolean,
  ): Promise<JobSeeker> {
    return this.prisma.jobSeeker.create({
      data: { ...data, user: { connect: { id: userId } } },
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
    data: Prisma.JobSeekerUpdateInput,
    includeRelations?: boolean,
  ): Promise<JobSeeker> {
    return this.prisma.jobSeeker.update({
      where,
      data,
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

  async setContacts(
    id: string,
    data: Prisma.JobSeekerContactsCreateWithoutJobSeekerInput,
    includeRelations?: boolean,
  ): Promise<JobSeeker> {
    return this.prisma.jobSeeker.update({
      where: { id },
      data: {
        contacts: {
          upsert: {
            update: data,
            create: data,
          },
        },
      },
      include: includeRelations ? this.jobSeekerRelations : undefined,
    });
  }
}
