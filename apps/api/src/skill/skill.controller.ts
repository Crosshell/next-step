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

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  async findAll(): Promise<Skill[]> {
    return this.skillService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Skill | null> {
    return this.skillService.findOne({ id });
  }

  // ADMIN GUARD
  @Post()
  async create(@Body() createSkillDto: CreateSkillDto): Promise<Skill> {
    return this.skillService.create(createSkillDto);
  }

  // ADMIN GUARD
  @Delete(':id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MessageResponse> {
    await this.skillService.delete({ id });
    return { message: 'Skill deleted successfully' };
  }
}
