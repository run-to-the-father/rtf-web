import { useEffect, useState } from 'react';

/**
 * 컴포넌트가 마운트되었는지 여부를 반환하는 React hook입니다.
 * SSR(Server-Side Rendering) 환경에서 하이드레이션 이슈를 처리할 때 유용합니다.
 *
 * @returns boolean - 컴포넌트의 마운트 여부
 *
 * @example
 * // 기본 사용법
 * function Component() {
 *   const isMounted = useIsMounted();
 *
 *   if (!isMounted) {
 *     return null; // 또는 로딩 상태
 *   }
 *
 *   return <div>클라이언트에서만 렌더링됩니다</div>;
 * }
 *
 * @example
 * // 클라이언트에서만 사용 가능한 API 처리
 * function WindowSizeComponent() {
 *   const isMounted = useIsMounted();
 *   const [width, setWidth] = useState(0);
 *
 *   useEffect(() => {
 *     if (isMounted) {
 *       setWidth(window.innerWidth);
 *     }
 *   }, [isMounted]);
 *
 *   return <div>Window width: {width}px</div>;
 * }
 *
 * @remarks
 * - 서버에서의 초기 렌더링에서는 false를 반환합니다.
 * - 클라이언트에서 하이드레이션이 완료된 후 true로 변경됩니다.
 * - window나 document 같은 브라우저 API를 안전하게 사용할 때 유용합니다.
 */
export function useIsMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
