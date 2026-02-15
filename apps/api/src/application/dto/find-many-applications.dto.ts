import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApplicationStatus, Prisma } from '@prisma/client';
import { PaginationDto } from '@common/dto/pagination.dto';

class OrderBy {
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  createdAt?: Prisma.SortOrder;
}

export class FindManyApplicationsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderBy)
  orderBy?: OrderBy;
}
