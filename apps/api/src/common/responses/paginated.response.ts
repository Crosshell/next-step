import { PaginationMeta } from '@common/utils/pagination.util';

export class PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
