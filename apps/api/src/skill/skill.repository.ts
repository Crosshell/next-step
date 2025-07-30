import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Skill } from '@prisma/client';

@Injectable()
export class SkillRepository {
  constructor(private readonly prisma: PrismaService) {}

  async count(where: Prisma.SkillWhereInput): Promise<number> {
    return this.prisma.skill.count({ where });
  }

  async create(data: Prisma.SkillCreateInput): Promise<Skill> {
    return this.prisma.skill.create({ data });
  }

  async findOne(where: Prisma.SkillWhereUniqueInput): Promise<Skill | null> {
    return this.prisma.skill.findUnique({ where });
  }

  async findAll(): Promise<Skill[]> {
    return this.prisma.skill.findMany();
  }

  async delete(where: Prisma.SkillWhereUniqueInput): Promise<Skill> {
    return this.prisma.skill.delete({ where });
  }
}
