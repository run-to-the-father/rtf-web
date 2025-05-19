'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/entities/user';
import { getCurrentUser } from '@/entities/user';

/**
 * 사용자 인증 상태를 관리하는 클라이언트 컴포넌트
 * 앱이 로드될 때 사용자의 인증 상태를 확인하고 전역 상태로 관리
 */
export function AuthStateProvider({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    // 페이지 로드 시 사용자 인증 상태 확인
    async function checkAuthState() {
      try {
        console.log('사용자 인증 상태 확인 중...');
        const user = await getCurrentUser();
        console.log('사용자 인증 상태:', { isAuthenticated: !!user, user });

        if (user) {
          setUser(user);
        }
      } catch (error) {
        console.error('인증 상태 확인 오류:', error);
      }
    }

    checkAuthState();
  }, [setUser]);

  return <>{children}</>;
}
