import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Application, Prisma } from '@prisma/client';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationRepository {
  private readonly applicationRelations: Prisma.ApplicationInclude;

  constructor(private readonly prisma: PrismaService) {
    this.applicationRelations = {
      jobSeeker: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          contacts: true,
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
        },
      },
    };
  }

  async create(
    dto: CreateApplicationDto,
    jobSeekerId: string,
    includeRelations?: boolean,
  ): Promise<Application> {
    const { vacancyId, ...data } = dto;

    return this.prisma.application.create({
      data: {
        ...data,
        jobSeeker: {
          connect: {
            id: jobSeekerId,
          },
        },
        vacancy: {
          connect: {
            id: vacancyId,
          },
        },
      },
      include: includeRelations ? this.applicationRelations : null,
    });
  }

  async findOne(
    where: Prisma.ApplicationWhereUniqueInput,
    includeRelations?: boolean,
  ): Promise<Application | null> {
    return this.prisma.application.findUnique({
      where,
      include: includeRelations ? this.applicationRelations : null,
    });
  }

  async findMany(
    params: Prisma.ApplicationFindManyArgs,
    includeRelations?: boolean,
  ): Promise<Application[]> {
    return this.prisma.application.findMany({
      ...params,
      include: includeRelations ? this.applicationRelations : null,
    });
  }

  async update(
    where: Prisma.ApplicationWhereUniqueInput,
    data: Prisma.ApplicationUpdateInput,
    includeRelations?: boolean,
  ): Promise<Application> {
    return this.prisma.application.update({
      where,
      data,
      include: includeRelations ? this.applicationRelations : null,
    });
  }

  async count(where: Prisma.ApplicationWhereInput): Promise<number> {
    return this.prisma.application.count({ where });
  }
}
