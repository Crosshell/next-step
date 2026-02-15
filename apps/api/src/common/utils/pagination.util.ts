import { PaginatedResponse } from '@common/responses';

interface IPaginationRepository<T, WhereInput, OrderByInput> {
  findMany(
    where: WhereInput,
    orderBy: OrderByInput,
    skip: number,
    take: number,
  ): Promise<T[]>;
  count(where: WhereInput): Promise<number>;
}

interface PaginateOptions<T, WhereInput, OrderByInput> {
  repository: IPaginationRepository<T, WhereInput, OrderByInput>;
  where: WhereInput;
  page: number;
  take: number;
  orderBy: OrderByInput;
}

export interface PaginationMeta {
  total: number;
  page: number;
  totalPages: number;
}

function createPaginationMeta(
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

export async function paginate<T, WhereInput, OrderByInput>({
  repository,
  where,
  page,
  take,
  orderBy,
}: PaginateOptions<T, WhereInput, OrderByInput>): Promise<
  PaginatedResponse<T>
> {
  const skip = (page - 1) * take;

  const [data, total] = await Promise.all([
    repository.findMany(where, orderBy, skip, take),
    repository.count(where),
  ]);

  const meta = createPaginationMeta(total, page, take);

  return { data, meta };
}
