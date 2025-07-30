import {
  EmploymentType,
  Prisma,
  SeniorityLevel,
  WorkFormat,
} from '@prisma/client';
import { VacancyLanguageDto } from './vacancy-language.dto';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderBy {
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  createdAt?: Prisma.SortOrder;

  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  salaryMin?: Prisma.SortOrder;
}

export class SearchVacancyDto {
  @IsOptional()
  @IsString()
  @Length(10, 100)
  title?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(1000000)
  salaryMin?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(50)
  experienceRequired?: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(WorkFormat, { each: true })
  workFormats?: WorkFormat[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(EmploymentType, { each: true })
  employmentTypes?: EmploymentType[];

  @IsOptional()
  @IsEnum(SeniorityLevel)
  seniorityLevel?: SeniorityLevel;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @Type(() => VacancyLanguageDto)
  requiredLanguages?: VacancyLanguageDto[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  requiredSkillIds?: string[];

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
