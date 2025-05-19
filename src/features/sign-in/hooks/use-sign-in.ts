'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  type SignInFormData,
  signInSchema,
} from '@/entities/user/model/user-schema';
import { toast } from '@/shared/ui/toast';
import { zodResolver } from '@hookform/resolvers/zod';

export function useSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 에러 파라미터 확인
  const errorType = searchParams.get('error');

  // react-hook-form 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 에러 메시지 표시
  useEffect(() => {
    if (errorType === 'auth_callback_error') {
      toast({
        variant: 'destructive',
        title: '인증 오류',
        description:
          '소셜 로그인 처리 중 오류가 발생했습니다. 다시 시도해 주세요.',
      });
    }
  }, [errorType]);

  // 이메일/패스워드 로그인 처리
  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '로그인에 실패했습니다.');
      }

      // 로그인 성공
      toast({
        title: '로그인 성공',
        description: '환영합니다!',
      });

      // 메인 페이지로 리디렉션
      router.push('/chat');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '로그인 실패',
        description: error.message || '로그인 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Google 로그인 처리
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      window.location.href = '/api/auth/google';
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google 로그인 실패',
        description: error.message || 'Google 로그인 중 오류가 발생했습니다.',
      });
      setIsLoading(false);
    }
  };

  const handleBackNavigation = () => {
    router.back();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return {
    register,
    handleSubmit,
    errors,
    isLoading,
    showPassword,
    onSubmit,
    handleGoogleSignIn,
    handleBackNavigation,
    togglePasswordVisibility,
  };
}
