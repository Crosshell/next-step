import { Injectable } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { Language, Prisma, Skill } from '@prisma/client';
import {
  SubjectExistsException,
  SubjectNotFoundException,
} from '@common/exceptions';
import { LanguageRepository } from './language.repository';

@Injectable()
export class LanguageService {
  constructor(private readonly repository: LanguageRepository) {}

  async assertExists(languageIds: string[]): Promise<void> {
    const found = await this.repository.count({ id: { in: languageIds } });

    if (found !== languageIds.length) {
      throw new SubjectNotFoundException('Language');
    }
  }

  async create(dto: CreateLanguageDto): Promise<Language> {
    await this.assertNotExists({ name: dto.name });
    return this.repository.create(dto);
  }

  async findAll(): Promise<Language[]> {
    return this.repository.findAll({ name: 'asc' });
  }

  async findOneOrThrow(where: Prisma.LanguageWhereUniqueInput): Promise<Skill> {
    const language = await this.repository.findOne(where);
    if (!language) throw new SubjectNotFoundException('Language');
    return language;
  }

  async assertNotExists(where: Prisma.LanguageWhereUniqueInput): Promise<void> {
    const language = await this.repository.findOne(where);
    if (language) throw new SubjectExistsException('Language');
  }

  async delete(where: Prisma.LanguageWhereUniqueInput): Promise<Language> {
    await this.findOneOrThrow(where);
    return this.repository.delete(where);
  }
}
