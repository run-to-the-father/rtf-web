'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/entities/user';
import { User } from '@/entities/user/model/user';
import { getSessionUser, setupAuthListener } from '@/shared/lib/auth-helpers';

// 실제 인증 상태 로직을 처리하는 클라이언트 컴포넌트
function AuthStateClient({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 세션 로드 및 Supabase 인증 이벤트 구독
  useEffect(() => {
    console.log('AuthStateProvider: 인증 상태 초기화 중...');

    // 초기 세션 확인
    async function initializeAuthState() {
      try {
        setIsLoading(true);
        const user = await getSessionUser();

        console.log('초기 인증 상태:', {
          isAuthenticated: !!user,
          userId: user?.id,
          email: user?.email,
        });

        if (user) {
          setUser(user);
        } else {
          clearUser();
        }
      } catch (error) {
        console.error('초기 인증 상태 확인 오류:', error);
        clearUser();
      } finally {
        setIsLoading(false);
      }
    }

    // 초기 세션 로드
    initializeAuthState();

    // Supabase 인증 상태 변경 리스너 설정
    const handleAuthChange = (user: User | null) => {
      console.log('인증 상태 변경 감지:', { isAuthenticated: !!user });

      if (user) {
        setUser(user);
      } else {
        clearUser();
      }

      setIsLoading(false);
    };

    // 인증 이벤트 리스너 설정 및 정리 함수 저장
    const unsubscribe = setupAuthListener(handleAuthChange);

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      console.log('AuthStateProvider: 인증 리스너 정리');
      unsubscribe();
    };
  }, [setUser, clearUser]);

  // 로딩 상태에서도 자식 컴포넌트 렌더링 (추후 로딩 UI 추가 가능)
  return <>{children}</>;
}

/**
 * 사용자 인증 상태를 관리하는 클라이언트 컴포넌트
 * 앱이 로드될 때 사용자의 인증 상태를 확인하고 전역 상태로 관리
 * Supabase 인증 이벤트를 실시간으로 감지하여 상태 동기화
 */
export function AuthStateProvider({ children }: { children: React.ReactNode }) {
  return <AuthStateClient>{children}</AuthStateClient>;
}
