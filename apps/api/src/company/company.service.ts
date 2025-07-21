import { Injectable } from '@nestjs/common';
import { Company, Prisma } from '@prisma/client';
import { CreateCompanyDto } from './dto/create-company.dto';
import {
  SubjectExistsException,
  SubjectNotFoundException,
} from '@common/exceptions';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SearchCompanyDto } from './dto/search-company.dto';
import { CompanyRepository } from './company.repository';

@Injectable()
export class CompanyService {
  constructor(private readonly repository: CompanyRepository) {}

  async create(userId: string, dto: CreateCompanyDto): Promise<Company> {
    await this.assertNotExists({ userId });
    return this.repository.create(userId, dto);
  }

  async findOneOrThrow(
    where: Prisma.CompanyWhereUniqueInput,
  ): Promise<Company> {
    const company = await this.repository.findOne(where);
    if (!company) throw new SubjectNotFoundException('Company');
    return company;
  }

  async assertNotExists(where: Prisma.CompanyWhereUniqueInput): Promise<void> {
    const company = await this.repository.findOne(where);
    if (company) throw new SubjectExistsException('Company');
  }

  async findMany(dto: SearchCompanyDto): Promise<Company[]> {
    const where: Prisma.CompanyWhereInput = {};
    if (dto.name) {
      where.name = {
        contains: dto.name,
        mode: 'insensitive',
      };
    }

    return this.repository.findMany({ where });
  }

  async update(userId: string, dto: UpdateCompanyDto): Promise<Company> {
    await this.findOneOrThrow({ userId });
    return this.repository.update({ userId }, dto);
  }
}
