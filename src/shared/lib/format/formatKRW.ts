export const formatKRW = (amount: number) =>
  Math.round(amount).toLocaleString('ko-KR') + '원';
