import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Company, Prisma } from '@prisma/client';

@Injectable()
export class CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    data: Prisma.CompanyCreateWithoutUserInput,
  ): Promise<Company> {
    return this.prisma.company.create({
      data: {
        ...data,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findOne(
    where: Prisma.CompanyWhereUniqueInput,
  ): Promise<Company | null> {
    return this.prisma.company.findUnique({ where });
  }

  async findMany(params: Prisma.CompanyFindManyArgs): Promise<Company[]> {
    return this.prisma.company.findMany(params);
  }

  async update(
    where: Prisma.CompanyWhereUniqueInput,
    data: Prisma.CompanyUpdateInput,
  ): Promise<Company> {
    return this.prisma.company.update({ where, data });
  }
}
