import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * DOM 요소가 viewport(화면에 보이는 영역)에 들어왔는지 감지하는 React hook입니다.
 * IntersectionObserver API를 사용하여 구현되어 있습니다.
 *
 * @template T - HTMLElement를 상속받는 요소의 타입 (기본값: any)
 *
 * @returns object
 * - ref: 관찰할 요소에 연결할 React ref
 * - inViewport: 요소가 viewport에 있는지 여부를 나타내는 boolean
 *
 * @example
 * // 기본 사용법
 * function Component() {
 *   const { ref, inViewport } = useInViewport();
 *
 *   return (
 *     <div ref={ref}>
 *       {inViewport ? '화면에 보이는 중' : '화면에서 보이지 않음'}
 *     </div>
 *   );
 * }
 *
 * @example
 * // 애니메이션과 함께 사용
 * function FadeInComponent() {
 *   const { ref, inViewport } = useInViewport<HTMLDivElement>();
 *
 *   return (
 *     <div
 *       ref={ref}
 *       style={{
 *         opacity: inViewport ? 1 : 0,
 *         transition: 'opacity 0.5s'
 *       }}
 *     >
 *       Fade In Content
 *     </div>
 *   );
 * }
 *
 * @remarks
 * - IntersectionObserver API가 지원되지 않는 브라우저에서는 observer가 null이 됩니다.
 * - 요소가 viewport에 조금이라도 보이면 inViewport가 true가 됩니다.
 * - 컴포넌트가 언마운트될 때 자동으로 observer가 정리됩니다.
 *
 */
export function useInViewport<T extends HTMLElement = any>() {
  const ref = useRef<T>(null);
  const [inViewport, setInViewport] = useState(false);

  const observer = useMemo(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return null;
    }
    return new IntersectionObserver(([entry]) =>
      setInViewport(entry!.isIntersecting),
    );
  }, [ref]);

  useEffect(() => {
    if (ref.current && observer) {
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
    return () => null;
  }, []);

  return { ref, inViewport };
}
