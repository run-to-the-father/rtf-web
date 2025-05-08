import { useCallback, useRef, useState } from 'react';

/**
 * DOM 요소의 가시성 변화를 관찰하는 React hook입니다.
 * IntersectionObserver API를 사용하여 요소가 viewport나 특정 요소와 교차하는 것을 감지합니다.
 *
 * @template T - HTMLElement를 상속받는 요소의 타입 (기본값: any)
 *
 * @param options - IntersectionObserver 생성자의 옵션 객체
 * @param options.root - 교차를 감지할 기준이 되는 요소. null이면 viewport
 * @param options.rootMargin - root 요소의 마진. CSS margin 형식의 문자열 (예: "10px 20px")
 * @param options.threshold - 교차 비율 임계값. 0과 1 사이의 숫자 또는 숫자 배열
 *
 * @returns object
 * - ref: 관찰할 요소에 연결할 콜백 ref
 * - entry: 현재 관찰 중인 요소의 IntersectionObserverEntry 객체 또는 null
 *
 * @example
 * // 기본 사용법
 * function Component() {
 *   const { ref, entry } = useIntersection();
 *
 *   return (
 *     <div ref={ref}>
 *       가시성: {entry?.isIntersecting ? '보임' : '안 보임'}
 *     </div>
 *   );
 * }
 *
 * @example
 * // 고급 옵션 사용
 * function ProgressiveImage() {
 *   const { ref, entry } = useIntersection({
 *     threshold: [0, 0.5, 1],
 *     rootMargin: '50px'
 *   });
 *
 *   return (
 *     <div
 *       ref={ref}
 *       style={{
 *         opacity: entry?.intersectionRatio || 0,
 *         transition: 'opacity 0.3s'
 *       }}
 *     >
 *       콘텐츠
 *     </div>
 *   );
 * }
 *
 * @remarks
 * - callback ref를 사용하므로, ref.current에 직접 접근할 수 없습니다.
 * - options이 변경되면 IntersectionObserver가 자동으로 재생성됩니다.
 * - entry는 요소가 언마운트되거나 관찰이 중단되면 null이 됩니다.
 * - IntersectionObserver API를 지원하지 않는 브라우저에서는 작동하지 않을 수 있습니다.
 *
 */
export function useIntersection<T extends HTMLElement = any>(
  options?: ConstructorParameters<typeof IntersectionObserver>[1],
) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (element: T | null) => {
      if (observer.current) {
        observer.current.disconnect();
        observer.current = null;
      }

      if (element === null) {
        setEntry(null);
        return;
      }

      observer.current = new IntersectionObserver(([_entry]) => {
        setEntry(_entry!);
      }, options);

      observer.current.observe(element);
    },
    [options?.rootMargin, options?.root, options?.threshold],
  );

  return { ref, entry };
}
