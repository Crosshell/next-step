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
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  async findAll(): Promise<Language[]> {
    return this.languageService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Language | null> {
    return this.languageService.findOne({ id });
  }

  // ADMIN GUARD
  @Post()
  async create(
    @Body() createLanguageDto: CreateLanguageDto,
  ): Promise<Language> {
    return this.languageService.create(createLanguageDto);
  }

  // ADMIN GUARD
  @Delete(':id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MessageResponse> {
    await this.languageService.delete({ id });
    return { message: 'Language deleted successfully' };
  }
}
