export function formatTimeToMinute(unixTimeMs: number): string {
  const minutes = Math.floor(unixTimeMs / (1000 * 60));

  if (minutes < 1) return '1분 미만';

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) return `${hours}시간 ${remainingMinutes}분`;
  return `${remainingMinutes}분`;
}

export function formatTimeWithSeconds(unixTimeMs: number): string {
  const unixTimeSeconds = Math.floor(unixTimeMs / 1000);

  if (unixTimeSeconds < 60) return `${unixTimeSeconds}초`;

  const minutes = Math.floor(unixTimeSeconds / 60);
  const remainingSeconds = unixTimeSeconds % 60;

  return `${minutes}분 ${remainingSeconds}초`;
}
