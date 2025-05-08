import { useEffect } from 'react';

/**
 * window 객체에 이벤트 리스너를 추가하는 React 커스텀 훅입니다.
 *
 * @template K - 이벤트 타입을 나타내는 문자열을 확장하는 타입 파라미터
 *
 * @param type - 감지할 이벤트의 이름
 * @param listener - 이벤트 발생 시 실행될 콜백 함수
 *                  K가 WindowEventMap의 키를 확장하는 경우, listener는 해당하는 이벤트 타입을 받습니다
 *                  그렇지 않은 경우, listener는 CustomEvent를 받습니다
 * @param options - 이벤트 리스너의 특성을 지정하는 선택적 매개변수
 *                 캡처 단계를 사용할지 여부를 나타내는 boolean이거나
 *                 더 자세한 설정이 포함된 AddEventListenerOptions 객체일 수 있습니다
 *
 * @example
 * ```tsx
 * // 기본 window 이벤트 사용
 * useWindowEvent('resize', (event) => {
 *   console.log('창 너비:', window.innerWidth);
 * });
 *
 * // 커스텀 이벤트 사용
 * useWindowEvent('myCustomEvent', (event) => {
 *   console.log('커스텀 이벤트 데이터:', event.detail);
 * });
 *
 * // 옵션과 함께 사용
 * useWindowEvent('scroll', (event) => {
 *   console.log('스크롤 중');
 * }, { passive: true });
 * ```
 *
 * @returns void - 이 훅은 아무것도 반환하지 않습니다
 */
export function useWindowEvent<K extends string>(
  type: K,
  listener: K extends keyof WindowEventMap
    ? (this: Window, ev: WindowEventMap[K]) => void
    : (this: Window, ev: CustomEvent) => void,
  options?: boolean | AddEventListenerOptions,
) {
  useEffect(() => {
    window.addEventListener(type as any, listener, options);
    return () => window.removeEventListener(type as any, listener, options);
  }, [type, listener]);
}
