import { IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchCompanyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page: number = 1;
}
