import { useEffect, useRef } from 'react';

/**
 * DOM 요소에 타입 안전한 이벤트 리스너를 추가하는 React hook입니다.
 * 컴포넌트가 언마운트될 때 자동으로 이벤트 리스너가 제거됩니다.
 *
 * @template K - HTMLElementEventMap의 키 타입 (예: 'click', 'scroll' 등)
 * @template T - HTMLElement를 상속받는 요소의 타입 (기본값: any)
 *
 * @param type - 등록할 이벤트의 타입
 * @param listener - 이벤트 발생 시 실행될 콜백 함수
 * @param options - addEventListener의 옵션 객체 또는 useCapture 불리언 값
 *
 * @returns ref - 이벤트 리스너를 연결할 요소의 React ref
 *
 * @example
 * // 기본 클릭 이벤트 리스너
 * function ClickableComponent() {
 *   const divRef = useEventListener('click', (event) => {
 *     console.log('클릭 위치:', event.clientX, event.clientY);
 *   });
 *
 *   return <div ref={divRef}>클릭하세요</div>;
 * }
 *
 * @example
 * // 옵션을 사용한 스크롤 이벤트 리스너
 * function ScrollableComponent() {
 *   const divRef = useEventListener(
 *     'scroll',
 *     (event) => {
 *       console.log('스크롤 위치:', event.target.scrollTop);
 *     },
 *     { passive: true }
 *   );
 *
 *   return (
 *     <div ref={divRef} style={{ height: '200px', overflow: 'auto' }}>
 *       긴 내용...
 *     </div>
 *   );
 * }
 *
 * @remarks
 * - 이벤트 리스너는 ref가 연결된 요소에만 적용됩니다.
 * - 컴포넌트가 리렌더링되어도 이벤트 리스너가 유지됩니다.
 * - options 객체를 통해 capture, once, passive 등의 설정이 가능합니다.
 *
 */
export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = any,
>(
  type: K,
  listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener(type, listener as any, options);
      return () =>
        ref.current?.removeEventListener(type, listener as any, options);
    }
    return undefined;
  }, [type, listener, options]);

  return ref;
}
