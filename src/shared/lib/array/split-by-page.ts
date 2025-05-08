export function splitByPage<T>(
  items: T[],
  params: { page: number; limit: number },
) {
  return items.slice(
    (params.page - 1) * params.limit,
    params.page * params.limit,
  );
}
