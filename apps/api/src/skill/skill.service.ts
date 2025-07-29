import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Skill } from '@prisma/client';
import { CreateSkillDto } from './dto/create-skill.dto';
import { SkillRepository } from './skill.repository';

@Injectable()
export class SkillService {
  constructor(private readonly repository: SkillRepository) {}

  async assertExists(skillIds: string[]): Promise<void> {
    const found = await this.repository.count({
      id: { in: skillIds },
    });

    if (found !== skillIds.length) {
      throw new BadRequestException('Skill not found');
    }
  }

  async create(dto: CreateSkillDto): Promise<Skill> {
    await this.assertNotExists({ name: dto.name });
    return this.repository.create(dto);
  }

  async findAll(): Promise<Skill[]> {
    return this.repository.findAll();
  }

  async findOneOrThrow(where: Prisma.SkillWhereUniqueInput): Promise<Skill> {
    const skill = await this.repository.findOne(where);
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }

  async assertNotExists(where: Prisma.SkillWhereUniqueInput): Promise<void> {
    const skill = await this.repository.findOne(where);
    if (skill) throw new BadRequestException('Skill already exists');
  }

  async delete(where: Prisma.SkillWhereUniqueInput): Promise<Skill> {
    await this.findOneOrThrow(where);
    return this.repository.delete(where);
  }
}
