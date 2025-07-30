import { IsEnum, IsUUID } from 'class-validator';
import { LanguageLevel } from '@prisma/client';

export class JobSeekerLanguageDto {
  @IsUUID()
  languageId: string;

  @IsEnum(LanguageLevel)
  level: LanguageLevel;
}
