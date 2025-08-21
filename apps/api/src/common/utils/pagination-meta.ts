export interface PaginationMeta {
  total: number;
  page: number;
  totalPages: number;
}

export function createPaginationMeta(
  total: number,
  page: number,
  pageSize: number,
): PaginationMeta {
  return {
    total,
    page,
    totalPages: Math.ceil(total / pageSize),
  };
}
