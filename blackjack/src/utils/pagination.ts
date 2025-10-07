// utils/pagination.ts
export function getPaginationRange(current: number, total: number): (number | "...")[] {
  const maxVisible = 5;
  const result: (number | "...")[] = [];

  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const left = Math.max(current - 2, 1);
  const right = Math.min(current + 2, total);

  if (left > 1) result.push(1);
  if (left > 2) result.push("...");

  for (let i = left; i <= right; i++) result.push(i);

  if (right < total - 1) result.push("...");
  if (right < total) result.push(total);

  return result;
}
