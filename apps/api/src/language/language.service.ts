import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { Language, Prisma } from '@prisma/client';
import {
  SubjectExistsException,
  SubjectNotFoundException,
} from '@common/exceptions';

@Injectable()
export class LanguageService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Language[]> {
    return this.prismaService.language.findMany();
  }

  async findOne(
    where: Prisma.LanguageWhereUniqueInput,
  ): Promise<Language | null> {
    return this.prismaService.language.findUnique({ where });
  }

  async create(createLanguageDto: CreateLanguageDto): Promise<Language> {
    const existingLanguage = await this.findOne({
      name: createLanguageDto.name,
    });
    if (existingLanguage) {
      throw new SubjectExistsException('Language');
    }

    return this.prismaService.language.create({
      data: createLanguageDto,
    });
  }

  async delete(where: Prisma.LanguageWhereUniqueInput): Promise<Language> {
    const existingLanguage = await this.findOne(where);
    if (!existingLanguage) {
      throw new SubjectNotFoundException('Language');
    }

    return this.prismaService.language.delete({ where });
  }
}
