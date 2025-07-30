import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Vacancy } from '@prisma/client';

@Injectable()
export class VacancyRepository {
  private readonly vacancyRelations: Prisma.VacancyInclude;

  constructor(private readonly prisma: PrismaService) {
    this.vacancyRelations = {
      company: true,
      requiredSkills: {
        select: {
          skill: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      requiredLanguages: {
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
    };
  }

  async create(
    companyId: string,
    data: Prisma.VacancyCreateWithoutCompanyInput,
    includeRelations?: boolean,
  ): Promise<Vacancy> {
    return this.prisma.vacancy.create({
      data: { ...data, company: { connect: { id: companyId } } },
      include: includeRelations ? this.vacancyRelations : null,
    });
  }

  async findOne(
    where: Prisma.VacancyWhereUniqueInput,
    includeRelations?: boolean,
  ): Promise<Vacancy | null> {
    return this.prisma.vacancy.findUnique({
      where,
      include: includeRelations ? this.vacancyRelations : null,
    });
  }

  async findMany(
    params: Prisma.VacancyFindManyArgs,
    includeRelations?: boolean,
  ): Promise<Vacancy[]> {
    return this.prisma.vacancy.findMany({
      ...params,
      include: includeRelations ? this.vacancyRelations : null,
    });
  }

  async update(
    where: Prisma.VacancyWhereUniqueInput,
    data: Prisma.VacancyUpdateInput,
    includeRelations?: boolean,
  ): Promise<Vacancy> {
    return this.prisma.vacancy.update({
      where,
      data,
      include: includeRelations ? this.vacancyRelations : null,
    });
  }

  async delete(where: Prisma.VacancyWhereUniqueInput): Promise<Vacancy> {
    return this.prisma.vacancy.delete({ where });
  }

  async setRequiredSkills(
    id: string,
    data: Prisma.VacancySkillCreateManyVacancyInput[],
    includeRelations?: boolean,
  ): Promise<Vacancy> {
    return this.prisma.vacancy.update({
      where: { id },
      data: {
        requiredSkills: {
          deleteMany: {},
          createMany: {
            data,
            skipDuplicates: true,
          },
        },
      },
      include: includeRelations ? this.vacancyRelations : null,
    });
  }

  async setRequiredLanguages(
    id: string,
    data: Prisma.VacancyLanguageCreateManyVacancyInput[],
    includeRelations?: boolean,
  ): Promise<Vacancy> {
    return this.prisma.vacancy.update({
      where: { id },
      data: {
        requiredLanguages: {
          deleteMany: {},
          createMany: {
            data,
            skipDuplicates: true,
          },
        },
      },
      include: includeRelations ? this.vacancyRelations : null,
    });
  }
}
