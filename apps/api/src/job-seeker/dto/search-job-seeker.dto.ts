import { Prisma, SeniorityLevel } from '@prisma/client';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { JobSeekerLanguageDto } from './job-seeker-language.dto';

class OrderBy {
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  expectedSalary?: Prisma.SortOrder;

  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  updatedAt?: Prisma.SortOrder;
}

export class SearchJobSeekerDto {
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ValidateNested({ each: true })
  @Type(() => JobSeekerLanguageDto)
  languages?: JobSeekerLanguageDto[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  skillIds?: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(SeniorityLevel, { each: true })
  seniorityLevels?: SeniorityLevel[];

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderBy)
  orderBy?: OrderBy;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;
}
