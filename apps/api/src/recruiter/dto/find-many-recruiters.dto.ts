import { IsUUID } from 'class-validator';
import { PaginationDto } from '@common/dto/pagination.dto';

export class FindManyRecruitersDto extends PaginationDto {
  @IsUUID('4')
  companyId: string;
}
