import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { LanguageService } from './language.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { Language } from '@prisma/client';
import { MessageResponse } from '@common/responses';

@Controller('languages')
export class LanguageController {
  constructor(private readonly service: LanguageService) {}

  @Get()
  async findAll(): Promise<Language[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Language> {
    return this.service.findOneOrThrow({ id });
  }

  // ADMIN GUARD
  @Post()
  async create(@Body() dto: CreateLanguageDto): Promise<Language> {
    return this.service.create(dto);
  }

  // ADMIN GUARD
  @Delete(':id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MessageResponse> {
    await this.service.delete({ id });
    return { message: 'Language deleted successfully' };
  }
}
