import React, { useEffect } from 'react';
import { useDraft } from './use-draft';

/** 값을 스로틀링하여 반환하는 커스텀 훅입니다. */
export default function useThrottleValue<T>(value: T, delay: number) {
  const [throttleValue, setThrottleValue] = useDraft<T>(value);
  const throttling = React.useRef(false);
  const isFirstRender = React.useRef(true);

  useEffect(() => {
    // 첫 렌더링 시에는 즉시 값을 적용
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setThrottleValue(value);
      return;
    }

    // 이후 변경사항에 대해서는 스로틀링 적용
    if (throttling.current === false) {
      setThrottleValue(value);
      throttling.current = true;
      setTimeout(() => {
        if (throttling?.current) throttling.current = false;
      }, delay);
    }
  }, [value, delay]);
  return throttleValue;
}
