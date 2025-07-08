import { SeniorityLevel } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJobSeekerDto {
  @IsString()
  @Length(2, 35, { message: 'firstName must be between 2 and 35 characters' })
  firstName: string;

  @IsString()
  @Length(2, 35, { message: 'lastName must be between 2 and 35 characters' })
  lastName: string;

  @IsString()
  @IsOptional()
  @Length(2, 100)
  location?: string;

  @IsString()
  @IsOptional()
  @Length(0, 2000)
  bio?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(1000000)
  expectedSalary?: number;

  @IsOptional()
  @Type(() => Date)
  dateOfBirth?: Date;

  @IsOptional()
  @Type(() => Boolean)
  isOpenToWork?: boolean;

  @IsOptional()
  @IsEnum(SeniorityLevel, {
    message: 'Seniority level must be an enum SeniorityLevel',
  })
  seniorityLevel?: SeniorityLevel;
}
