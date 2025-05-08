import { useEffect, useState } from 'react';

type NotNullishValue = {};

/**
 * 객체의 참조를 보존하는 커스텀 훅입니다.
 * 실제 값이 변경된 경우에만 새로운 참조를 반환합니다.
 *
 * @template T - 보존할 값의 타입. `NotNullishValue`를 상속해야 합니다.
 *
 * @param value - 보존하고자 하는 값(객체나 배열 등)
 * @param areValuesEqual - 두 값의 동일성을 비교하는 함수. 기본값으로 {@link areDeeplyEqual} 사용
 *
 * @returns 보존된 참조값을 반환합니다. 값이 실제로 변경된 경우에만 새로운 참조가 반환됩니다.
 *
 * @example
 * ```typescript
 * function Component() {
 *   const options = usePreservedReference({
 *     sortBy: 'name',
 *     filterBy: 'active'
 *   });
 *
 *   return <DataGrid options={options} />;
 * }
 * ```
 */
export function usePreservedReference<T extends NotNullishValue>(
  value: T,
  areValuesEqual: (a: T, b: T) => boolean = areDeeplyEqual,
) {
  const [reference, setReference] = useState<T>(value);

  useEffect(() => {
    if (!areValuesEqual(value, reference)) {
      setReference(value);
    }
  }, [reference, value]);

  return reference;
}

/**
 * 두 값의 깊은 동일성을 비교하는 헬퍼 함수입니다.
 *
 * @template T - 비교할 값들의 타입. `NotNullishValue`를 상속해야 합니다.
 * @param x - 비교할 첫 번째 값
 * @param y - 비교할 두 번째 값
 * @returns 두 값이 깊은 비교 시 동일하면 true, 그렇지 않으면 false를 반환합니다.
 *
 * @internal
 */
function areDeeplyEqual<T extends NotNullishValue>(x: T, y: T) {
  return JSON.stringify(x) === JSON.stringify(y);
}
