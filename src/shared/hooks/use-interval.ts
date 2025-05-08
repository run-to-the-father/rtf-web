import { useCallback, useEffect, useRef, useState } from 'react';

interface UseIntervalOptions {
  /** 컴포넌트 마운트 시 자동으로 인터벌을 시작할지 여부 (기본값: false) */
  autoInvoke?: boolean;
}

/**
 * setInterval을 React 친화적으로 사용할 수 있게 해주는 React hook입니다.
 * 시작, 중지, 토글 기능과 현재 실행 상태를 제공합니다.
 *
 * @param fn - 주기적으로 실행될 콜백 함수
 * @param interval - 실행 간격 (밀리초)
 * @param options - hook 설정 옵션
 * @param options.autoInvoke - 컴포넌트 마운트 시 자동 시작 여부 (기본값: false)
 *
 * @returns object
 * - start: 인터벌 시작 함수
 * - stop: 인터벌 중지 함수
 * - toggle: 인터벌 시작/중지 토글 함수
 * - active: 현재 인터벌 실행 상태
 *
 * @example
 * // 기본 타이머 구현
 * function Timer() {
 *   const [count, setCount] = useState(0);
 *   const { start, stop, active } = useInterval(
 *     () => setCount(c => c + 1),
 *     1000
 *   );
 *
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={active ? stop : start}>
 *         {active ? 'Stop' : 'Start'}
 *       </button>
 *     </div>
 *   );
 * }
 *
 * @example
 * // 자동 시작 옵션 사용
 * function Clock() {
 *   const [time, setTime] = useState(new Date());
 *
 *   useInterval(
 *     () => setTime(new Date()),
 *     1000,
 *     { autoInvoke: true }
 *   );
 *
 *   return <p>{time.toLocaleTimeString()}</p>;
 * }
 *
 * @remarks
 * - 컴포넌트가 언마운트되면 자동으로 인터벌이 정리됩니다.
 * - fn이나 interval이 변경되면 인터벌이 자동으로 재시작됩니다.
 * - useEffect 내부에서 fn을 ref로 관리하여 불필요한 재실행을 방지합니다.
 *
 */
export function useInterval(
  fn: () => void,
  interval: number,
  { autoInvoke = false }: UseIntervalOptions = {},
) {
  const [active, setActive] = useState(false);
  const intervalRef = useRef<number>(null);
  const fnRef = useRef<() => void>(null);

  const start = useCallback(() => {
    setActive((old) => {
      if (!old && !intervalRef.current) {
        intervalRef.current = window.setInterval(fnRef.current!, interval);
      }
      return true;
    });
  }, [interval]);

  const stop = useCallback(() => {
    setActive(false);

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const toggle = () => {
    if (active) {
      stop();
    } else {
      start();
    }
  };

  useEffect(() => {
    fnRef.current = fn;
    active && start();
    return stop;
  }, [fn, active, interval]);

  useEffect(() => {
    if (autoInvoke) {
      start();
    }
  }, []);

  return { start, stop, toggle, active };
}
