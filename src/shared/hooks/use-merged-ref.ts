import { Ref, useCallback } from 'react';

/**
 * React ref에 할당할 수 있는 가능한 타입을 정의합니다.
 * `React.Ref` 또는 `undefined`가 될 수 있습니다.
 * @template T - ref가 참조할 값의 타입
 */
type PossibleRef<T> = Ref<T> | undefined;

/**
 * ref에 값을 할당하는 유틸리티 함수입니다.
 * 함수형 ref와 객체형 ref 모두를 지원합니다.
 *
 * @template T - ref가 참조할 값의 타입
 * @param ref - 값을 할당할 ref (함수형 또는 객체형)
 * @param value - ref에 할당할 값
 *
 * @example
 * ```tsx
 * // 객체형 ref 사용
 * const objRef = useRef<HTMLDivElement>(null);
 * assignRef(objRef, divElement);
 *
 * // 함수형 ref 사용
 * const fnRef = (element: HTMLDivElement) => console.log(element);
 * assignRef(fnRef, divElement);
 * ```
 */
export function assignRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (typeof ref === 'object' && ref !== null && 'current' in ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

/**
 * 여러 개의 ref를 하나의 ref 함수로 통합합니다.
 * 반환된 ref 함수는 전달받은 모든 ref에 동일한 값을 할당합니다.
 *
 * @template T - ref들이 참조할 값의 타입
 * @param refs - 통합할 ref들의 배열
 * @returns 통합된 ref 콜백 함수
 *
 * @example
 * ```tsx
 * const Component = () => {
 *   const firstRef = useRef<HTMLDivElement>(null);
 *   const secondRef = (node: HTMLDivElement) => console.log(node);
 *
 *   const merged = mergeRefs(firstRef, secondRef);
 *   return <div ref={merged}>Content</div>;
 * };
 * ```
 */
export function mergeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T | null) => {
    refs.forEach((ref) => assignRef(ref, node));
  };
}

/**
 * 여러 ref를 하나로 통합하는 React 훅입니다.
 * `mergeRefs` 함수의 메모이제이션된 버전을 제공합니다.
 *
 * @template T - ref들이 참조할 값의 타입
 * @param refs - 통합할 ref들
 * @returns 메모이제이션된 통합 ref 콜백 함수
 *
 * @example
 * ```tsx
 * function TextInput() {
 *   const focusRef = useRef<HTMLInputElement>(null);
 *   const sizeRef = useRef<HTMLInputElement>(null);
 *   const forwardedRef = useForwardedRef<HTMLInputElement>();
 *
 *   const mergedRef = useMergedRef(focusRef, sizeRef, forwardedRef);
 *
 *   return <input ref={mergedRef} />;
 * }
 * ```
 */
export function useMergedRef<T>(...refs: PossibleRef<T>[]) {
  return useCallback(mergeRefs(...refs), refs);
}
