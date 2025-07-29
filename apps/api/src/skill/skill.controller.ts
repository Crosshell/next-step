import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { Skill } from '@prisma/client';
import { CreateSkillDto } from './dto/create-skill.dto';
import { MessageResponse } from '@common/responses';
import { SkillSwagger } from '../../docs/swagger/skill.swagger';

@Controller('skills')
export class SkillController {
  constructor(private readonly service: SkillService) {}

  @Get()
  @SkillSwagger.findAll()
  async findAll(): Promise<Skill[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @SkillSwagger.findOne()
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Skill> {
    return this.service.findOneOrThrow({ id });
  }

  // ADMIN GUARD
  @Post()
  @SkillSwagger.create()
  async create(@Body() dto: CreateSkillDto): Promise<Skill> {
    return this.service.create(dto);
  }

  // ADMIN GUARD
  @Delete(':id')
  @SkillSwagger.delete()
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MessageResponse> {
    await this.service.delete({ id });
    return { message: 'Skill deleted successfully' };
  }
}
