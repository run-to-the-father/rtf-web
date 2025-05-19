'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { signOut } from '../api/user-auth-api';
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
  logout: () => Promise<void>;
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

        /**
         * 로그아웃
         */
        logout: async () => {
          set({ isLoading: true });

          try {
            const { success, error } = await signOut();

            if (success) {
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
                isInitialized: true,
              });
            } else {
              throw new Error(error || '로그아웃 실패');
            }
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : '로그아웃 실패',
              isLoading: false,
            });
          }
        },
      }),
      {
        name: 'user-store', // 로컬 스토리지 키
      },
    ),
  ),
);
