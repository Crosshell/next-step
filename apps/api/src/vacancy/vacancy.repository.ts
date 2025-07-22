import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Vacancy } from '@prisma/client';
import { CreateVacancyDto } from './dto/create-vacancy.dto';

@Injectable()
export class VacancyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(companyId: string, dto: CreateVacancyDto): Promise<Vacancy> {
    return this.prisma.vacancy.create({
      data: { ...dto, company: { connect: { id: companyId } } },
    });
  }

  async findOne(
    where: Prisma.VacancyWhereUniqueInput,
  ): Promise<Vacancy | null> {
    return this.prisma.vacancy.findUnique({ where });
  }

  async findMany(where: Prisma.VacancyWhereInput): Promise<Vacancy[]> {
    return this.prisma.vacancy.findMany({ where });
  }

  async update(
    where: Prisma.VacancyWhereUniqueInput,
    data: Prisma.VacancyUpdateInput,
  ): Promise<Vacancy> {
    return this.prisma.vacancy.update({ where, data });
  }

  async delete(where: Prisma.VacancyWhereUniqueInput): Promise<Vacancy> {
    return this.prisma.vacancy.delete({ where });
  }
}
