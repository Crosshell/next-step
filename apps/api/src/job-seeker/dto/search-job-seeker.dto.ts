import { SeniorityLevel } from '@prisma/client';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchJobSeekerDto {
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (value) return [value];
    return undefined;
  })
  skillIds?: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(SeniorityLevel, { each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (value) return [value];
    return undefined;
  })
  seniorityLevels?: SeniorityLevel[];
}
