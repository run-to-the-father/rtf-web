'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { type User } from '../model/user';
import { useUserStore } from '../store/user-store';

/**
 * 사용자 인증 상태를 관리하는 커스텀 훅
 * 애플리케이션 내 모든 페이지에서 사용자 세션을 로드하고 관리합니다.
 */
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { user, setUser, clearUser, isInitialized, isAuthenticated } =
    useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  // 인증이 필요한 경로인지 확인
  const isProtectedRoute = (path: string) => {
    const protectedRoutes = ['/chat', '/settings', '/profile'];
    return protectedRoutes.some((route) => path.startsWith(route));
  };

  // 인증 페이지인지 확인
  const isAuthRoute = (path: string) => {
    const authRoutes = ['/login', '/sign-in', '/sign-up', '/register'];
    return authRoutes.some((route) => path === route);
  };

  // 로그아웃 처리 함수
  const handleSignOut = async () => {
    try {
      console.log('로그아웃 처리 시작');

      // 로컬 상태 초기화
      clearUser();

      // 서버에 로그아웃 요청
      await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('로그아웃 처리 완료');
    } catch (error) {
      console.error('로그아웃 처리 실패:', error);
    }
  };

  // 컴포넌트 마운트 시 사용자 세션 확인
  useEffect(() => {
    console.log('useAuth 훅 실행, 경로:', pathname);

    const checkSession = async () => {
      try {
        setIsLoading(true);
        console.log('사용자 세션 확인 중...');

        // 이미 초기화되었고 로그인된 경우 추가 확인 생략
        if (isInitialized && user) {
          console.log('이미 로그인된 상태, 세션 확인 생략');
          setIsLoading(false);
          setIsCheckingAuth(false);
          return;
        }

        const response = await fetch('/api/auth/me');

        if (!response.ok) {
          if (response.status === 401) {
            console.log(
              '인증되지 않은 상태 (401 Unauthorized), 자동 로그아웃 처리',
            );
            // 401 오류 발생 시 자동 로그아웃 처리
            await handleSignOut();
          } else {
            console.error('세션 확인 오류:', response.statusText);
            clearUser();
          }

          // 인증되지 않은 상태에서 보호된 경로 접근 시 리디렉션
          if (isProtectedRoute(pathname)) {
            console.log('인증되지 않은 상태로 보호된 경로 접근, 리디렉션');
            router.push('/sign-in');
          }

          setIsCheckingAuth(false);
          setIsLoading(false);
          return;
        }

        const data = await response.json();

        if (data?.user) {
          console.log('사용자 정보 로드 성공');
          setUser(data.user as User);

          // 인증된 상태에서 인증 페이지 접근 시 리디렉션
          if (isAuthRoute(pathname)) {
            console.log('이미 로그인된 상태로 인증 페이지 접근, 리디렉션');
            router.push('/');
          }
        } else {
          console.log('인증된 사용자가 없음');
          clearUser();

          // 인증되지 않은 상태에서 보호된 경로 접근 시 리디렉션
          if (isProtectedRoute(pathname)) {
            console.log('인증되지 않은 상태로 보호된 경로 접근, 리디렉션');
            router.push('/sign-in');
          }
        }
      } catch (error) {
        console.error('세션 확인 중 오류 발생:', error);
        clearUser();

        // 오류 발생 시 보호된 경로에서 리디렉션
        if (isProtectedRoute(pathname)) {
          router.push('/sign-in');
        }
      } finally {
        setIsLoading(false);
        setIsCheckingAuth(false);
      }
    };

    checkSession();
  }, [pathname]);

  return {
    isLoading,
    isCheckingAuth,
    isAuthenticated,
    handleSignOut,
  };
};
