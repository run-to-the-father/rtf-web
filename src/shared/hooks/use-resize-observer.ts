import { useCallback, useEffect, useRef } from 'react';
import { usePreservedCallback } from './use-preserved-callback';

export type OnResize = (entry: ResizeObserverEntry) => void;

/** 요소 크기가 변경될 때 트리거되는 커스텀 훅입니다. */
export function useResizeObserver<E extends HTMLElement = HTMLElement>(
  onResize: OnResize,
) {
  const resizeCallback = usePreservedCallback(onResize);

  // DOM element의 ref를 저장
  const elementRef = useRef<E | null>(null);

  // ResizeObserver 인스턴스를 ref로 관리
  const observerRef = useRef<ResizeObserver | null>(null);

  // ref 콜백 함수
  const ref = useCallback((element: E | null) => {
    // 이전 관찰 정리
    if (elementRef.current && observerRef.current) {
      observerRef.current.unobserve(elementRef.current);
    }

    // 새로운 element 설정
    elementRef.current = element;

    // 새로운 element가 있으면 관찰 시작
    if (element) {
      if (!observerRef.current) {
        observerRef.current = new ResizeObserver((entries) => {
          if (entries[0] != null) {
            resizeCallback(entries[0]);
          }
        });
      }
      observerRef.current.observe(element);
    }
  }, []);

  // cleanup
  useEffect(() => {
    return () => {
      if (elementRef.current && observerRef.current) {
        observerRef.current.unobserve(elementRef.current);
      }
    };
  }, []);

  return ref;
}
