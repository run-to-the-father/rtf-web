import { useCallback, useEffect, useRef } from 'react';

/**
 * 콜백 함수의 참조를 보존하는 커스텀 훅입니다.
 * 콜백의 내용이 변경되어도 동일한 참조를 유지하면서 항상 최신 콜백을 실행합니다.
 *
 * @template Callback - 보존할 콜백 함수의 타입
 * @param callback - 보존하고자 하는 콜백 함수
 * @returns 보존된 참조를 가진 콜백 함수를 반환합니다. 콜백의 내용이 변경되어도 동일한 참조가 유지됩니다.
 *
 * @example
 * ```tsx
 * function Component() {
 *   const [count, setCount] = useState(0);
 *
 *   // count가 변경되어도 동일한 함수 참조 유지
 *   const handleClick = usePreservedCallback(() => {
 *     console.log(count);
 *   });
 *
 *   return <ChildComponent onClick={handleClick} />;
 * }
 * ```
 *
 * @remarks
 * 이 훅은 `useCallback`과 유사하지만, 의존성 배열 없이도 항상 최신 콜백을 실행하면서
 * 함수의 참조를 안정적으로 유지합니다. 특히 다음과 같은 상황에서 유용합니다:
 * - 이벤트 핸들러를 자식 컴포넌트에 전달할 때
 * - 콜백이 클로저를 통해 최신 상태나 props를 참조해야 할 때
 * - `useEffect`의 의존성 배열에 콜백을 포함시켜야 할 때
 */
export function usePreservedCallback<Callback extends (...args: any[]) => any>(
  callback: Callback,
) {
  const callbackRef = useRef<Callback>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []) as Callback;
}
