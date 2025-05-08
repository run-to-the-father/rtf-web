import { useEffect, useRef } from 'react';

const DEFAULT_EVENTS = ['mousedown', 'touchstart'];

/**
 * 특정 요소 외부의 클릭을 감지하는 React hook입니다.
 * 주로 모달, 드롭다운, 팝오버 등의 컴포넌트를 닫을 때 사용됩니다.
 *
 * @template T - HTMLElement를 상속받는 요소의 타입 (기본값: any)
 *
 * @param handler - 외부 클릭이 감지되었을 때 실행될 콜백 함수
 * @param events - 감지할 이벤트 목록 (기본값: ['mousedown', 'touchstart'])
 * @param nodes - 클릭 감지에서 제외할 HTML 요소들의 배열
 *
 * @returns ref - 클릭 감지를 적용할 요소에 연결할 React ref
 *
 * @example
 * // 기본 사용법
 * function Modal({ onClose }) {
 *   const modalRef = useClickOutside(() => {
 *     onClose();
 *   });
 *
 *   return (
 *     <div ref={modalRef}>
 *       모달 내용
 *     </div>
 *   );
 * }
 *
 * @example
 * // 여러 노드와 커스텀 이벤트 사용
 * function Dropdown() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const dropdownRef = useRef(null);
 *   const buttonRef = useRef(null);
 *
 *   useClickOutside(
 *     () => setIsOpen(false),
 *     ['mousedown', 'touchstart', 'contextmenu'],
 *     [dropdownRef.current, buttonRef.current]
 *   );
 *
 *   return (
 *     <>
 *       <button ref={buttonRef}>Toggle</button>
 *       {isOpen && <div ref={dropdownRef}>Content</div>}
 *     </>
 *   );
 * }
 *
 * @remarks
 * - `data-ignore-outside-clicks` 속성이 있는 요소는 클릭 감지에서 제외됩니다.
 * - DOM에서 제거된 요소나 HTML 태그에 대한 클릭은 무시됩니다.
 * - 컴포넌트가 언마운트될 때 자동으로 이벤트 리스너가 제거됩니다.
 *
 */
export function useClickOutside<T extends HTMLElement = any>(
  handler: () => void,
  events?: string[] | null,
  nodes?: (HTMLElement | null)[],
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener = (event: any) => {
      const { target } = event ?? {};

      if (Array.isArray(nodes)) {
        const shouldIgnore =
          target?.hasAttribute('data-ignore-outside-clicks') ||
          (!document.body.contains(target) && target.tagName !== 'HTML');
        const shouldTrigger = nodes.every(
          (node) => !!node && !event.composedPath().includes(node),
        );
        shouldTrigger && !shouldIgnore && handler();
      } else if (ref.current && !ref.current.contains(target)) {
        const shouldIgnore =
          target?.hasAttribute('data-ignore-outside-clicks') ||
          (!document.body.contains(target) && target.tagName !== 'HTML');
        !shouldIgnore && handler();
      }
    };

    (events || DEFAULT_EVENTS).forEach((fn) =>
      document.addEventListener(fn, listener),
    );

    return () => {
      (events || DEFAULT_EVENTS).forEach((fn) =>
        document.removeEventListener(fn, listener),
      );
    };
  }, [ref, handler, nodes]);

  return ref;
}
