import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Vacancy } from '@prisma/client';
import { CreateVacancyDto } from './dto/create-vacancy.dto';

@Injectable()
export class VacancyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(companyId: string, dto: CreateVacancyDto): Promise<Vacancy> {
    return this.prisma.vacancy.create({
      data: { ...dto, company: { connect: { id: companyId } } },
    });
  }
}
