import { IsEnum, IsUUID } from 'class-validator';
import { LanguageLevel } from '@prisma/client';

export class LanguageItem {
  @IsUUID('4')
  languageId: string;

  @IsEnum(LanguageLevel)
  level: LanguageLevel;
}
