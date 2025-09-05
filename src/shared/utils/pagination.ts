import { IPaginatedData } from '@shared/types/pagination';

export function normalizePagination(page?: number, limit?: number) {
  const normalizedPage = Math.max(1, page || 1);
  const normalizedLimit = Math.max(1, Math.min(100, limit || 10));
  const skip = (normalizedPage - 1) * normalizedLimit;
  return { page: normalizedPage, limit: normalizedLimit, skip };
}

export function buildMeta(page: number, limit: number, total: number) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

export function toPaginatedData<T>(items: T[], page: number, limit: number, total: number): IPaginatedData<T> {
  return {
    items,
    meta: buildMeta(page, limit, total),
  };
}
