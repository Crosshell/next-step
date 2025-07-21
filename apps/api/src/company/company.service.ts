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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CompanyService {
  private readonly pageSize: number;

  constructor(
    private readonly repository: CompanyRepository,
    private readonly config: ConfigService,
  ) {
    this.pageSize = this.config.getOrThrow<number>('company.pageSize');
  }

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

  async search(dto: SearchCompanyDto): Promise<Company[]> {
    const where: Prisma.CompanyWhereInput = {};
    const skip = (dto.page - 1) * this.pageSize;

    if (dto.name) {
      where.name = {
        contains: dto.name,
        mode: 'insensitive',
      };
    }

    return this.repository.findMany({ where, skip, take: this.pageSize });
  }

  async update(id: string, dto: UpdateCompanyDto): Promise<Company> {
    return this.repository.update({ id }, dto);
  }
}
