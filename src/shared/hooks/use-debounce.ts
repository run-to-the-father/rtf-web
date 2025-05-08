import { useCallback, useEffect, useRef } from 'react';
import { useCallbackRef } from './use-callback-ref';

/**
 * 연속적으로 발생하는 이벤트에서 마지막 이벤트 발생 후 지정된 시간이 지난 뒤에만
 * 콜백 함수를 실행하는 디바운스 훅입니다.
 *
 * @template T - 디바운스할 콜백 함수의 타입
 * @param callback - 디바운스할 콜백 함수
 * @param delay - 디바운스 지연 시간 (밀리초)
 *
 * @returns 디바운스된 콜백 함수. 원본 콜백과 동일한 파라미터를 받습니다.
 *
 * @example
 * ```tsx
 * // 검색 입력 디바운싱
 * const handleSearch = useDebounce((searchTerm: string) => {
 *   fetchSearchResults(searchTerm);
 * }, 500);
 *
 * return (
 *   <input
 *     type="text"
 *     onChange={(e) => handleSearch(e.target.value)}
 *   />
 * );
 * ```
 *
 * @example
 * ```tsx
 * // 창 크기 조절 이벤트 디바운싱
 * const handleResize = useDebounce(() => {
 *   updateLayout(window.innerWidth, window.innerHeight);
 * }, 200);
 *
 * useEffect(() => {
 *   window.addEventListener('resize', handleResize);
 *   return () => window.removeEventListener('resize', handleResize);
 * }, [handleResize]);
 * ```
 *
 * @remarks
 * - 콜백 함수는 마지막 호출 후 `delay` 밀리초가 경과한 후에만 실행됩니다.
 * - 지연 시간 내에 새로운 호출이 발생하면 타이머가 리셋됩니다.
 * - 컴포넌트가 언마운트될 때 자동으로 타이머가 정리됩니다.
 *
 * @see {@link useCallbackRef} - 콜백 함수의 안정적인 참조를 유지하기 위해 내부적으로 사용됩니다.
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
) {
  const handleCallback = useCallbackRef(callback);
  const debounceTimerRef = useRef(0);
  useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);

  return useCallback(
    (...args: Parameters<T>) => {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = window.setTimeout(
        () => handleCallback(...args),
        delay,
      );
    },
    [handleCallback, delay],
  );
}
