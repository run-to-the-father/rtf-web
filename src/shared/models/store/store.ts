import { StateCreator, StoreApi, UseBoundStore, create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

/**
 * devtools, immer 미들웨어 적용한 zustand store 만듦
 * @template T store의 상태 타입
 * @param initializer 초기 상태와 액션 정의하는 함수
 * @returns zustand store
 */
export const createCustomStore = <T extends object>(
  initializer: StateCreator<
    T,
    [['zustand/devtools', never], ['zustand/immer', never]]
  >,
) =>
  // devtools, immer
  create<T, [['zustand/devtools', never], ['zustand/immer', never]]>(
    devtools(immer(initializer)),
  );
