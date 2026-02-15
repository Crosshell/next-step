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
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '@common/dto/pagination.dto';

class OrderBy {
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  createdAt?: Prisma.SortOrder;

  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  salaryMin?: Prisma.SortOrder;
}

export class FindManyVacanciesDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
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
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(SeniorityLevel, { each: true })
  seniorityLevels?: SeniorityLevel[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @ValidateNested({ each: true })
  @Type(() => VacancyLanguageDto)
  requiredLanguages?: VacancyLanguageDto[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  requiredSkillIds?: string[];

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderBy)
  orderBy?: OrderBy;
}
