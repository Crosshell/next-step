import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Language, Prisma } from '@prisma/client';

@Injectable()
export class LanguageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async count(where: Prisma.LanguageWhereInput): Promise<number> {
    return this.prisma.language.count({ where });
  }

  async create(data: Prisma.LanguageCreateInput): Promise<Language> {
    return this.prisma.language.create({ data });
  }

  async findOne(
    where: Prisma.LanguageWhereUniqueInput,
  ): Promise<Language | null> {
    return this.prisma.language.findUnique({ where });
  }

  async findAll(): Promise<Language[]> {
    return this.prisma.language.findMany();
  }

  async delete(where: Prisma.LanguageWhereUniqueInput): Promise<Language> {
    return this.prisma.language.delete({ where });
  }
}
