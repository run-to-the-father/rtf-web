import { useEffect, useMemo, useRef } from 'react';

/**
 * 콜백 함수의 안정적인 참조를 유지하면서 최신 값을 사용할 수 있게 해주는 훅
 *
 * @note 이 훅은 useEffect의 의존성 배열이 비어있어, 컴포넌트가 리렌더링될 때마다 실행됩니다.
 * @param callback - 래핑할 콜백 함수
 * @returns 안정적인 참조를 가진 wrapped 콜백 함수
 *
 * @example
 * function Component() {
 *   const [count, setCount] = useState(0);
 *
 *   // count가 변경되어도 동일한 함수 참조 유지
 *   const handleClick = useCallbackRef(() => {
 *     console.log(count); // 항상 최신 count 값 사용
 *   });
 *
 *   return <button onClick={handleClick}>{count}</button>;
 * }
 */
export function useCallbackRef<T extends (...args: any[]) => any>(
  callback: T | undefined,
): T {
  const callbackRef = useRef(callback);

  /** 함수의 참조는 변하지 않지만 콜백 함수의 인자는 변할 수 있기 때문에 최신 콜백 함수를 유지하기 위해 사용 */
  useEffect(() => {
    callbackRef.current = callback;
  });

  return useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, []);
}
