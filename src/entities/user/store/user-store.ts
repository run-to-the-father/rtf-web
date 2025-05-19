'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from '../model/user';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  // 액션
  setUser: (user: User) => void;
  clearUser: () => void;
}

/**
 * 사용자 상태 관리 스토어
 */
export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
        isInitialized: false,

        /**
         * 사용자 정보 설정
         */
        setUser: (user: User) =>
          set((state) => ({
            ...state,
            user,
            isAuthenticated: true,
            isInitialized: true,
            error: null,
          })),

        /**
         * 사용자 정보 초기화
         */
        clearUser: () =>
          set((state) => ({
            ...state,
            user: null,
            isAuthenticated: false,
            isInitialized: true,
            error: null,
          })),
      }),
      {
        name: 'user-store', // 로컬 스토리지 키
      },
    ),
  ),
);
