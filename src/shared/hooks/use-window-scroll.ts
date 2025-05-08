import { useEffect, useState } from 'react';
import { useWindowEvent } from './use-window-event';

/**
 * 창의 스크롤 위치를 나타내는 인터페이스입니다.
 */
interface ScrollPosition {
  /** 가로축 스크롤 위치 (픽셀) */
  x: number;
  /** 세로축 스크롤 위치 (픽셀) */
  y: number;
}

/**
 * 현재 창의 스크롤 위치를 가져오는 유틸리티 함수입니다.
 * 서버 사이드 렌더링(SSR) 환경에서는 {x: 0, y: 0}을 반환합니다.
 *
 * @returns 현재 스크롤 위치 정보를 담은 객체를 반환합니다
 */
function getScrollPosition(): ScrollPosition {
  return typeof window !== 'undefined'
    ? { x: window.scrollX, y: window.scrollY }
    : { x: 0, y: 0 };
}

/**
 * 창을 지정된 위치로 부드럽게 스크롤하는 함수입니다.
 *
 * @param param0 - 이동할 스크롤 위치 정보
 * @param param0.x - 가로축 스크롤 위치 (선택사항)
 * @param param0.y - 세로축 스크롤 위치 (선택사항)
 */
function scrollTo({ x, y }: Partial<ScrollPosition>) {
  if (typeof window !== 'undefined') {
    const scrollOptions: ScrollToOptions = { behavior: 'smooth' };

    if (typeof x === 'number') {
      scrollOptions.left = x;
    }

    if (typeof y === 'number') {
      scrollOptions.top = y;
    }

    window.scrollTo(scrollOptions);
  }
}

/**
 * 창의 스크롤 위치를 실시간으로 추적하고 제어할 수 있는 React 커스텀 훅입니다.
 *
 * 이 훅은 다음과 같은 기능을 제공합니다:
 * - 현재 스크롤 위치의 실시간 추적
 * - 스크롤 및 창 크기 변경 이벤트 감지
 * - 지정된 위치로의 부드러운 스크롤 이동
 * - 서버 사이드 렌더링(SSR) 지원
 *
 * @returns [position, scrollTo] 형태의 튜플을 반환합니다
 * - position: 현재 스크롤 위치 ({x, y})
 * - scrollTo: 스크롤 위치 제어 함수
 *
 * @example
 * ```tsx
 * function ScrollComponent() {
 *   const [스크롤위치, 스크롤이동] = useWindowScroll();
 *
 *   return (
 *     <div>
 *       <div>현재 위치: {스크롤위치.x}, {스크롤위치.y}</div>
 *
 *       <button onClick={() => 스크롤이동({ y: 0 })}>
 *         맨 위로 이동
 *       </button>
 *
 *       <button onClick={() => 스크롤이동({ y: 1000 })}>
 *         1000px 아래로 이동
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useWindowScroll() {
  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 });

  useWindowEvent('scroll', () => setPosition(getScrollPosition()));
  useWindowEvent('resize', () => setPosition(getScrollPosition()));

  useEffect(() => {
    setPosition(getScrollPosition());
  }, []);

  return [position, scrollTo] as const;
}
