import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Application, Prisma } from '@prisma/client';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateApplicationDto,
    jobSeekerId: string,
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
    });
  }

  async findOne(
    where: Prisma.ApplicationWhereUniqueInput,
  ): Promise<Application | null> {
    return this.prisma.application.findUnique({ where });
  }

  async findMany(
    params: Prisma.ApplicationFindManyArgs,
  ): Promise<Application[]> {
    return this.prisma.application.findMany(params);
  }

  async update(
    where: Prisma.ApplicationWhereUniqueInput,
    data: Prisma.ApplicationUpdateInput,
  ): Promise<Application> {
    return this.prisma.application.update({ where, data });
  }
}
