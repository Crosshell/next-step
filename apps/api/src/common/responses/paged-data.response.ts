import { PaginationMeta } from '@common/utils/pagination-meta';

export class PagedDataResponse<T> {
  data: T;
  meta: PaginationMeta;
}
