'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  type SignUpFormData,
  signUpSchema,
} from '@/entities/user/model/user-schema';
import { useUserStore } from '@/entities/user/store/user-store';
import { toast } from '@/shared/ui/toast';
import { zodResolver } from '@hookform/resolvers/zod';

export function useSignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  // react-hook-form 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: 'other',
    },
  });

  // 이메일/패스워드 회원가입 처리
  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '회원가입에 실패했습니다.');
      }

      // 회원가입 성공 - 유저 정보 저장
      if (result.user) {
        setUser(result.user);
      }

      // 회원가입 성공
      toast({
        title: '회원가입 성공',
        description: '환영합니다!',
      });

      // 메인 페이지로 리디렉션
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '회원가입 실패',
        description: error.message || '회원가입 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Google 회원가입 처리
  const handleGoogleSignUp = async () => {
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return {
    register,
    handleSubmit,
    errors,
    isLoading,
    showPassword,
    showConfirmPassword,
    onSubmit,
    handleGoogleSignUp,
    handleBackNavigation,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    watch,
  };
}
