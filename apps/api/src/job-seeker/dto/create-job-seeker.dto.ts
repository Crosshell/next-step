import { SeniorityLevel } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJobSeekerDto {
  @IsString()
  @Length(2, 35)
  firstName: string;

  @IsString()
  @Length(2, 35)
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
  @IsUrl()
  avatarUrl?: string;

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
  @IsEnum(SeniorityLevel)
  seniorityLevel?: SeniorityLevel;
}
