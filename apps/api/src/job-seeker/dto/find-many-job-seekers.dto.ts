import { Prisma, SeniorityLevel } from '@prisma/client';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { JobSeekerLanguageDto } from './job-seeker-language.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

class OrderBy {
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  expectedSalary?: Prisma.SortOrder;

  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  updatedAt?: Prisma.SortOrder;
}

export class FindManyJobSeekersDto extends PaginationDto {
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
}
