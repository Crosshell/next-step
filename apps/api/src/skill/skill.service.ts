import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  SubjectExistsException,
  SubjectNotFoundException,
} from '@common/exceptions';
import { Prisma, Skill } from '@prisma/client';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillService {
  constructor(private readonly prismaService: PrismaService) {}

  async assertExists(skillIds: string[]): Promise<void> {
    const found = await this.prismaService.skill.count({
      where: { id: { in: skillIds } },
    });

    if (found !== skillIds.length) {
      throw new SubjectNotFoundException('Skill');
    }
  }

  async findAll(): Promise<Skill[]> {
    return this.prismaService.skill.findMany();
  }

  async findOne(where: Prisma.SkillWhereUniqueInput): Promise<Skill | null> {
    return this.prismaService.skill.findUnique({
      where,
    });
  }

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    const existingSkill = await this.findOne({ name: createSkillDto.name });
    if (existingSkill) {
      throw new SubjectExistsException('Skill');
    }

    return this.prismaService.skill.create({
      data: createSkillDto,
    });
  }

  async delete(where: Prisma.SkillWhereUniqueInput): Promise<Skill> {
    const existingSkill = await this.findOne(where);
    if (!existingSkill) {
      throw new SubjectNotFoundException('Skill');
    }

    return this.prismaService.skill.delete({
      where,
    });
  }
}
