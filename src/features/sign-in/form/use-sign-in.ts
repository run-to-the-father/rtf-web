'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  SignInFormData,
  getGoogleSignInUrl,
  parseUserFromSession,
  signInSchema,
} from '@/entities/user';
import { useUserStore } from '@/entities/user';
import { supabase } from '@/shared/lib';

export type ValidationError = {
  email?: string;
  password?: string;
  form?: string;
};

export function useSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError>({});
  const setUser = useUserStore((state) => state.setUser);

  // 리다이렉트 URL 가져오기
  // 기본값을 '/'로 설정
  const redirectTo = searchParams?.get('redirectTo') || '/';

  const validateForm = (): boolean => {
    try {
      // Zod 스키마로 유효성 검증
      signInSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error: any) {
      const formErrors: ValidationError = {};

      if (error.errors) {
        error.errors.forEach((err: any) => {
          const path = err.path[0] as keyof ValidationError;
          formErrors[path] = err.message;
        });
      }

      setErrors(formErrors);
      return false;
    }
  };

  // 입력 필드 변경 핸들러
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // 에러가 있으면 지움
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // 에러가 있으면 지움
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  // 이메일/비밀번호 로그인
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검증
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Supabase 이메일 로그인 직접 호출
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data?.session && data?.user) {
        // 세션 API 호출해서 최신 사용자 정보 가져오기
        const response = await fetch('/api/auth/session');
        const sessionData = await response.json();

        if (sessionData.user) {
          // 사용자 상태 업데이트
          setUser(sessionData.user);

          console.log(`로그인 성공, 리다이렉트:`, redirectTo);

          // 항상 홈으로 리다이렉트하려면 여기서 redirectTo를 '/'로 강제 설정
          const homePath = '/';

          // 현재 페이지 재로드하여 세션 쿠키를 확실히 적용
          if (typeof window !== 'undefined') {
            // redirectTo 대신 homePath 사용
            window.location.href = homePath;
            return;
          } else {
            // redirectTo 대신 homePath 사용
            router.push(homePath);
            router.refresh(); // 페이지 새로고침하여 서버 컴포넌트 다시 로드
          }
        } else {
          throw new Error('사용자 정보를 가져올 수 없습니다.');
        }
      } else {
        throw new Error('로그인 실패: 세션 데이터가 없습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      // 폼 에러 설정
      setErrors({ form: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Google 로그인
  const handleGoogleSignIn = () => {
    try {
      setIsLoading(true);
      console.log('구글 로그인 시도...');

      // 구글 로그인 URL 가져오기 (리다이렉트 URL 포함)
      // 항상 홈으로 리다이렉트하려면 여기서 리다이렉트 경로를 '/'로
      const googleUrl = getGoogleSignInUrl('/');
      console.log('구글 로그인 URL:', googleUrl);

      // 직접 window.location.href 사용 (router.push 대신)
      window.location.href = googleUrl;
    } catch (error) {
      console.error('Google 로그인 오류:', error);
      setErrors({ form: 'Google 로그인 중 오류가 발생했습니다.' });
      setIsLoading(false);
    }
  };

  // 비밀번호 표시 토글
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return {
    email,
    setEmail: handleEmailChange,
    password,
    setPassword: handlePasswordChange,
    showPassword,
    isLoading,
    errors,
    handleEmailSignIn,
    handleGoogleSignIn,
    toggleShowPassword,
    redirectTo,
  };
}
