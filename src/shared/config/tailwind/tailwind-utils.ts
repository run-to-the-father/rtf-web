// pxToRem 함수 정의
const pxToRem = (px: number) => `${px / 16}rem`;

// fontSize용 특별 생성 함수 추가
const generateFontSizeSpacing = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => i + start).reduce(
    (acc, px) => {
      acc[`${px}pxr`] = [pxToRem(px), { lineHeight: '1.4' }];
      return acc;
    },
    {} as { [key: string]: [string, { lineHeight: string }] },
  );

// 기존 generatePxrSpacing 함수는 그대로 유지
const generatePxrSpacing = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => i + start).reduce(
    (acc, px) => {
      acc[`${px}pxr`] = pxToRem(px);
      return acc;
    },
    {} as { [key: string]: string },
  );

// 음수 범위 스페이싱 생성
export const pxrSpacingWithNegative = (negative: number, positive: number) =>
  generatePxrSpacing(negative, positive);

// fontSize용 새로운 함수 추가
export const pxrFontSizeSpacing = (positive: number) =>
  generateFontSizeSpacing(0, positive);

export const pxrSpacingPositive = (positive: number) =>
  generatePxrSpacing(0, positive);

export const addWidth = (obj: Record<string, string>) => {
  return {
    ...obj,
    desktop: '76.25rem', // 1220px
  };
};
