'use client';

import { ReactNode, createContext, useContext } from 'react';
import { useAuth } from '@/entities/user/hooks/useAuth';

// 인증 컨텍스트 인터페이스
interface AuthContextType {
  isLoading: boolean;
  isCheckingAuth: boolean;
  isAuthenticated: boolean;
}

// 기본값으로 초기화된 인증 컨텍스트
const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isCheckingAuth: true,
  isAuthenticated: false,
});

// 인증 컨텍스트 사용 훅
export const useAuthContext = () => useContext(AuthContext);

/**
 * 사용자 인증 상태를 제공하는 프로바이더 컴포넌트
 * 앱 레이아웃에 이 컴포넌트를 포함시켜 모든 페이지에서 인증 상태에 접근할 수 있습니다.
 */
export function UserProvider({ children }: { children: ReactNode }) {
  // useAuth 훅을 사용하여 인증 상태 관리
  const { isLoading, isCheckingAuth, isAuthenticated } = useAuth();

  // 인증 상태를 컨텍스트로 제공
  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isCheckingAuth,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
