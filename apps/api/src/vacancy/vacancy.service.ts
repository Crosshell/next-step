import { ForbiddenException, Injectable } from '@nestjs/common';
import { VacancyRepository } from './vacancy.repository';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { Prisma, Vacancy } from '@prisma/client';
import { SubjectNotFoundException } from '@common/exceptions';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';

@Injectable()
export class VacancyService {
  constructor(private readonly repository: VacancyRepository) {}

  async create(companyId: string, dto: CreateVacancyDto): Promise<Vacancy> {
    return this.repository.create(companyId, dto);
  }

  async findOneOrThrow(
    where: Prisma.VacancyWhereUniqueInput,
  ): Promise<Vacancy> {
    const vacancy = await this.repository.findOne(where);
    if (!vacancy) throw new SubjectNotFoundException('Vacancy');
    return vacancy;
  }

  async findMany(where: Prisma.VacancyWhereInput): Promise<Vacancy[]> {
    return this.repository.findMany(where);
  }

  async update(
    where: Prisma.VacancyWhereUniqueInput,
    companyId: string,
    dto: UpdateVacancyDto,
  ): Promise<Vacancy> {
    const vacancy = await this.findOneOrThrow(where);
    if (vacancy.companyId !== companyId) {
      throw new ForbiddenException(
        'You are not allowed to update this vacancy',
      );
    }
    return this.repository.update(where, dto);
  }

  async delete(
    where: Prisma.VacancyWhereUniqueInput,
    companyId: string,
  ): Promise<Vacancy> {
    const vacancy = await this.findOneOrThrow(where);
    if (vacancy.companyId !== companyId) {
      throw new ForbiddenException(
        'You are not allowed to delete this vacancy',
      );
    }
    return this.repository.delete(where);
  }
}
