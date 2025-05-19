'use client';

import { useEffect, useState } from 'react';
import {
  type User,
  parseUserFromSession,
} from '../../entities/user/model/user';
import { useUserStore } from '../../entities/user/store/user-store';

/**
 * 사용자 인증 상태를 관리하는 프로바이더 컴포넌트
 * 앱 레이아웃에 이 컴포넌트를 포함시켜 사용자 세션을 로드하고 관리합니다.
 */
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser, clearUser, isInitialized } = useUserStore();

  // 컴포넌트 마운트 시 사용자 세션 확인
  useEffect(() => {
    const checkSession = async () => {
      try {
        // 이미 초기화되었다면 다시 확인하지 않음
        if (isInitialized) {
          setIsLoading(false);
          return;
        }

        console.log('사용자 세션 확인 중...');
        const response = await fetch('/api/auth/me');

        if (!response.ok) {
          if (response.status !== 401) {
            console.error('세션 확인 오류:', response.statusText);
          }
          clearUser();
          return;
        }

        const data = await response.json();

        if (data?.user) {
          console.log('사용자 정보 로드 성공');
          setUser(data.user as User);
        } else {
          console.log('인증된 사용자가 없음');
          clearUser();
        }
      } catch (error) {
        console.error('세션 확인 중 오류 발생:', error);
        clearUser();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [setUser, clearUser, isInitialized]);

  // 주기적으로 세션 갱신 (예: 15분마다)
  useEffect(() => {
    const refreshSessionInterval = 15 * 60 * 1000; // 15분

    const refreshSession = async () => {
      try {
        // 로그인된 상태에서만 세션 갱신 시도
        if (!user) return;

        console.log('세션 갱신 시도 중...');
        const response = await fetch('/api/auth/session', {
          method: 'POST',
        });

        if (!response.ok) {
          console.log('세션 갱신 실패, 로그아웃 처리');
          clearUser();
        }
      } catch (error) {
        console.error('세션 갱신 오류:', error);
      }
    };

    const intervalId = setInterval(refreshSession, refreshSessionInterval);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(intervalId);
  }, [user, clearUser]);

  return <>{children}</>;
};
