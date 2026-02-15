import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@common/dto/pagination.dto';

export class FindManyCompaniesDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string;
}
