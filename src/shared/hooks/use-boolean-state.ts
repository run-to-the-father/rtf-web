import { useCallback, useState } from 'react';

export const useBooleanState = (defaultValue = false) => {
  const [bool, setBool] = useState(defaultValue);

  const setTrue = useCallback(() => {
    setBool(true);
  }, []);

  const setFalse = useCallback(() => {
    setBool(false);
  }, []);

  const toggle = useCallback(() => {
    setBool((b) => !b);
  }, []);

  return {
    value: bool,
    setTrue,
    setFalse,
    toggle,
  } as const;
};
