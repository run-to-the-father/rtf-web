'use client';

import { useEffect, useRef } from 'react';

// shared/ui/modal/modal.tsx

const mutationObserverOption: MutationObserverInit = {
  childList: true,
  subtree: false,
};

/**
 * 모달 컴포넌트를 렌더링하기 위한 루트 컴퍼넌트입니다.
 * 모달이 열려 있을 때 body 요소에 'no-scroll' 클래스를 토글하여 스크롤을 비활성화합니다.
 *
 * @param {React.ReactNode} children - 모달 루트 내부에 렌더링할 자식 요소
 * @returns {JSX.Element} 모달 루트
 */
const ModalRoot: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let observer: MutationObserver;

    /**
     * MutationObserver를 사용하여 모달 루트 컨테이너의 자식 요소 변경을 감지합니다.
     * 모달이 열려 있는 경우 body 요소에 'no-scroll' 클래스를 추가하고, 모달이 닫혀 있는 경우 클래스를 제거합니다.
     */
    if (ref.current) {
      observer = new MutationObserver(() => {
        const size = ref.current?.childNodes.length || 0;
        document.body.classList.toggle('no-scroll', size > 0);
        ref.current!.style.pointerEvents = size > 0 ? 'auto' : 'none';
      });
      observer.observe(ref.current, mutationObserverOption);
    }

    // 컴포넌트 언마운트 시 MutationObserver 연결을 해제합니다.
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div id='modalRoot' className='bg-tr relative z-[9990]' ref={ref}></div>
  );
};

export default ModalRoot;
