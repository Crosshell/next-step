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
import { LanguageSwagger } from '../../docs/swagger/language.swagger';

@Controller('languages')
export class LanguageController {
  constructor(private readonly service: LanguageService) {}

  @Get()
  @LanguageSwagger.findAll()
  async findAll(): Promise<Language[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @LanguageSwagger.findOne()
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Language> {
    return this.service.findOneOrThrow({ id });
  }

  // ADMIN GUARD
  @Post()
  @LanguageSwagger.create()
  async create(@Body() dto: CreateLanguageDto): Promise<Language> {
    return this.service.create(dto);
  }

  // ADMIN GUARD
  @Delete(':id')
  @LanguageSwagger.delete()
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MessageResponse> {
    await this.service.delete({ id });
    return { message: 'Language deleted successfully' };
  }
}
