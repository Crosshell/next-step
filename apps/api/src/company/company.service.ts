import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Company, Prisma } from '@prisma/client';
import { CreateCompanyDto } from './dto/create-company.dto';
import {
  SubjectExistsException,
  SubjectNotFoundException,
} from '@common/exceptions';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SearchCompanyDto } from './dto/search-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    userId: string,
  ): Promise<Company> {
    const existingCompany = await this.findOne({ userId });
    if (existingCompany) {
      throw new SubjectExistsException('Company');
    }

    return this.prismaService.company.create({
      data: {
        ...createCompanyDto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findOne(
    where: Prisma.CompanyWhereUniqueInput,
  ): Promise<Company | null> {
    return this.prismaService.company.findUnique({ where });
  }

  async findMany(searchCompanyDto: SearchCompanyDto): Promise<Company[]> {
    const where: Prisma.CompanyWhereInput = {};
    if (searchCompanyDto.name) {
      where.name = {
        contains: searchCompanyDto.name,
        mode: 'insensitive',
      };
    }

    return this.prismaService.company.findMany({ where });
  }

  async update(
    updateCompanyDto: UpdateCompanyDto,
    userId: string,
  ): Promise<Company> {
    const existingCompany = await this.findOne({ userId });
    if (!existingCompany) {
      throw new SubjectNotFoundException('Company');
    }

    return this.prismaService.company.update({
      where: {
        userId,
      },
      data: updateCompanyDto,
    });
  }
}
