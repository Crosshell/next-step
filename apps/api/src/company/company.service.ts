import { BadRequestException, Injectable } from '@nestjs/common';
import { Company, Prisma } from '@prisma/client';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SearchCompanyDto } from './dto/search-company.dto';
import { CompanyRepository } from './company.repository';
import { ConfigService } from '@nestjs/config';
import { getPaginationByPage } from '@common/utils';

@Injectable()
export class CompanyService {
  private readonly searchPageSize: number;

  constructor(
    private readonly repository: CompanyRepository,
    private readonly config: ConfigService,
  ) {
    this.searchPageSize = this.config.getOrThrow<number>(
      'search.company.pageSize',
    );
  }

  async create(userId: string, dto: CreateCompanyDto): Promise<Company> {
    await this.assertNotExists({ userId });
    return this.repository.create(userId, dto);
  }

  async findOne(
    where: Prisma.CompanyWhereUniqueInput,
  ): Promise<Company | null> {
    return this.repository.findOne(where);
  }

  async findOneOrThrow(
    where: Prisma.CompanyWhereUniqueInput,
  ): Promise<Company> {
    const company = await this.repository.findOne(where);
    if (!company) throw new BadRequestException('Company not found');
    return company;
  }

  async assertNotExists(where: Prisma.CompanyWhereUniqueInput): Promise<void> {
    const company = await this.repository.findOne(where);
    if (company) throw new BadRequestException('Company already exists');
  }

  async search(dto: SearchCompanyDto): Promise<Company[]> {
    const where: Prisma.CompanyWhereInput = {};
    const pagination = getPaginationByPage(dto.page, this.searchPageSize);

    if (dto.name) {
      where.name = {
        contains: dto.name,
        mode: 'insensitive',
      };
    }

    return this.repository.findMany({ where, ...pagination });
  }

  async update(id: string, dto: UpdateCompanyDto): Promise<Company> {
    return this.repository.update({ id }, dto);
  }
}
