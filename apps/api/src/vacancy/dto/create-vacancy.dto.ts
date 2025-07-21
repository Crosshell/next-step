import { EmploymentType, SeniorityLevel, WorkFormat } from '@prisma/client';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVacancyDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(50, 2000)
  description: string;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(1000000)
  salaryMin?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(1000000)
  salaryMax?: number;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  officeLocation?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(50)
  experienceRequired?: number;

  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(WorkFormat, { each: true })
  workFormat: WorkFormat[];

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(EmploymentType, { each: true })
  employmentType: EmploymentType[];

  @IsNotEmpty()
  @IsEnum(SeniorityLevel)
  seniorityLevel: SeniorityLevel;
}
