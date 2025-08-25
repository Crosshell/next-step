import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Company, Prisma } from '@prisma/client';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SearchCompanyDto } from './dto/search-company.dto';
import { CompanyRepository } from './company.repository';
import { ConfigService } from '@nestjs/config';
import { createPaginationMeta, getPaginationByPage } from '@common/utils';
import { PagedDataResponse } from '@common/responses';

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
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async assertNotExists(where: Prisma.CompanyWhereUniqueInput): Promise<void> {
    const company = await this.repository.findOne(where);
    if (company) throw new BadRequestException('Company already exists');
  }

  async search(dto: SearchCompanyDto): Promise<PagedDataResponse<Company[]>> {
    const where: Prisma.CompanyWhereInput = {};
    const pagination = getPaginationByPage(dto.page, this.searchPageSize);

    if (dto.name) {
      where.name = {
        contains: dto.name,
        mode: 'insensitive',
      };
    }

    const data = await this.repository.findMany({ where, ...pagination });
    const total = await this.repository.count(where);

    const meta = createPaginationMeta(total, dto.page, this.searchPageSize);

    return { data, meta };
  }

  async update(id: string, dto: UpdateCompanyDto): Promise<Company> {
    return this.repository.update({ id }, dto);
  }
}
