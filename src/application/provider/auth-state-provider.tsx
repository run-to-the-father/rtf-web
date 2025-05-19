'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/entities/user';
import { User } from '@/entities/user/model/user';
import { setupAuthListener } from '@/shared/lib/auth-helpers';

/**
 * 인증 상태를 관리하는 클라이언트 컴포넌트
 * Supabase 인증 상태를 실시간으로 감지하여 전역 상태에 반영
 */
export function AuthStateProvider({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 세션 로드 및 Supabase 인증 이벤트 구독
  useEffect(() => {
    console.log('AuthStateProvider: 인증 상태 초기화 중...');

    async function loadSession() {
      try {
        setIsLoading(true);

        // 서버 API를 통해 현재 세션 정보 가져오기
        const response = await fetch('/api/auth/session');
        const data = await response.json();

        console.log('초기 인증 상태:', {
          isAuthenticated: !!data.user,
          userId: data.user?.id,
          email: data.user?.email,
        });

        if (data.user) {
          setUser(data.user);
        } else {
          clearUser();
        }
      } catch (error) {
        console.error('초기 인증 상태 로드 오류:', error);
        clearUser();
      } finally {
        setIsLoading(false);
      }
    }

    // 초기 세션 로드
    loadSession();

    // Supabase 인증 상태 변경 리스너 설정
    const handleAuthChange = (user: User | null) => {
      console.log('인증 상태 변경 감지:', { isAuthenticated: !!user });

      if (user) {
        setUser(user);
      } else {
        clearUser();
      }
    };

    // 인증 이벤트 리스너 설정 및 정리 함수 저장
    const unsubscribe = setupAuthListener(handleAuthChange);

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      console.log('AuthStateProvider: 인증 리스너 정리');
      unsubscribe();
    };
  }, [setUser, clearUser]);

  // 자식 컴포넌트 렌더링
  return <>{children}</>;
}
