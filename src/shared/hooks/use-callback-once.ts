import { DependencyList, useCallback, useRef } from 'react';

/**
 * 콜백 함수를 단 한 번만 실행되도록 메모이제이션하는 훅입니다.
 * 한 번 실행된 후에는 동일한 호출이 발생해도 무시됩니다.
 *
 * @template F - 래핑할 콜백 함수의 타입
 * @param callback - 한 번만 실행할 콜백 함수
 * @param deps - useCallback의 의존성 배열
 * @returns 메모이제이션된 일회성 콜백 함수
 *
 * @example
 * ```tsx
 * // 한 번만 실행되는 이벤트 핸들러
 * const handleOnboarding = useCallbackOnce(() => {
 *   console.log('온보딩 시작');
 * }, []);
 *
 * <button onClick={handleOnboarding}>시작하기</button>
 * ```
 *
 * @example
 * ```tsx
 * // 중복 제출 방지
 * const handleSubmit = useCallbackOnce(async (data: FormData) => {
 *   await submitForm(data);
 * }, []);
 * ```
 *
 * @remarks
 * - 컴포넌트가 리마운트되면 실행 상태가 리셋됩니다.
 * - 의존성 배열이 변경되어도 이미 실행된 콜백은 다시 실행되지 않습니다.
 * - 일반적인 이벤트 핸들러에는 불필요할 수 있으니 신중하게 사용해야 합니다.
 *
 * @see {@link useCallback} - 내부적으로 사용되는 React 훅
 */
export function useCallbackOnce<F extends (...args: any[]) => void>(
  callback: F,
  deps: DependencyList,
) {
  const hasFired = useRef(false);
  const memoizedCallback = useCallback((...args: Parameters<F>) => {
    if (hasFired.current) {
      return;
    }

    callback(...args);
    hasFired.current = true;
  }, deps);

  return memoizedCallback;
}
