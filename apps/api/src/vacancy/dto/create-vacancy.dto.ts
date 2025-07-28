import { EmploymentType, SeniorityLevel, WorkFormat } from '@prisma/client';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVacancyDto {
  @IsString()
  @Length(10, 100)
  title: string;

  @IsString()
  @Length(50, 2000)
  description: string;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(1000000)
  salaryMin: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(1000000)
  @Validate((value: number, obj: CreateVacancyDto) => {
    if (value === undefined || obj.salaryMin === undefined) return true;
    return value >= obj.salaryMin;
  })
  salaryMax: number;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  officeLocation?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(50)
  experienceRequired?: number;

  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(WorkFormat, { each: true })
  workFormat: WorkFormat[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(EmploymentType, { each: true })
  employmentType: EmploymentType[];

  @IsEnum(SeniorityLevel)
  seniorityLevel: SeniorityLevel;
}
