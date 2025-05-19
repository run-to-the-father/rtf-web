'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  SignInFormData,
  getGoogleSignInUrl,
  parseUserFromSession,
  signInSchema,
  signInWithEmail,
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
      const result = await signInWithEmail(email, password);

      if (result.success && result.user) {
        // Supabase 세션에서 사용자 정보 추출
        const { data } = await supabase.auth.getSession();

        // 사용자 상태 업데이트
        const userData = parseUserFromSession(data.session);
        if (userData) {
          setUser(userData);
          // 지정된 리다이렉트 URL로 이동
          console.log(`로그인 성공, 리다이렉트:`, redirectTo);
          router.push(redirectTo);
        } else {
          throw new Error('사용자 정보를 가져올 수 없습니다.');
        }
      } else {
        throw new Error(result.error || '로그인 실패');
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
      const googleUrl = getGoogleSignInUrl(redirectTo);
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
