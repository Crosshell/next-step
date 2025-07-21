import { Injectable } from '@nestjs/common';
import { VacancyRepository } from './vacancy.repository';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { Vacancy } from '@prisma/client';

@Injectable()
export class VacancyService {
  constructor(private readonly repository: VacancyRepository) {}

  async create(companyId: string, dto: CreateVacancyDto): Promise<Vacancy> {
    return this.repository.create(companyId, dto);
  }
}
