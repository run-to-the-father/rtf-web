export function clampPercentage(value: number): number {
  return Math.max(0, Math.min(100, value));
}
