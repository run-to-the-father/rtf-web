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
        throw new Error(result.message || 'Failed to sign up.');
      }

      // 회원가입 성공 - 유저 정보 저장
      if (result.user) {
        setUser(result.user);
      }

      // 회원가입 성공
      toast({
        title: 'Sign Up Successful',
        description: 'Please check your email to complete registration.',
      });

      // 이메일 확인 안내 페이지로 리다이렉션 (이메일 주소를 쿼리 파라미터로 전달)
      router.push(
        `/email-verification?email=${encodeURIComponent(data.email)}`,
      );
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message || 'An error occurred during sign up.',
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
        title: 'Google Login Failed',
        description: error.message || 'An error occurred during Google login.',
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
