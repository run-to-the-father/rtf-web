'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  type LoginFormData,
  loginSchema,
} from '@/entities/user/model/user-schema';
import { toast } from '@/shared/ui/toast';
import { zodResolver } from '@hookform/resolvers/zod';

export function useSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailVerificationNeeded, setIsEmailVerificationNeeded] =
    useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string>('');
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  const errorType = searchParams.get('error');

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (errorType === 'auth_callback_error') {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description:
          'An error occurred during social login processing. Please try again.',
      });
    }
  }, [errorType]);

  const handleResendVerification = async () => {
    if (!unverifiedEmail) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Email address is missing.',
      });
      return;
    }

    try {
      setIsResendingVerification(true);

      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: unverifiedEmail }),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to resend verification email');
      }

      toast({
        title: 'Email Sent',
        description: 'A new verification email has been sent to your inbox.',
      });

      router.push(
        `/email-verification?email=${encodeURIComponent(unverifiedEmail)}`,
      );
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to resend verification email',
      });
    } finally {
      setIsResendingVerification(false);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setIsEmailVerificationNeeded(false);

      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        if (
          result.error &&
          result.error.includes('이메일 인증이 완료되지 않았습니다')
        ) {
          setIsEmailVerificationNeeded(true);
          setUnverifiedEmail(data.email);
          throw new Error(
            '이메일 인증이 완료되지 않았습니다. 인증 이메일을 확인해주세요.',
          );
        }

        throw new Error(result.message || '로그인에 실패했습니다.');
      }

      toast({
        title: '로그인 성공',
        description: '환영합니다!',
      });

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

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      window.location.href = '/api/auth/google';
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-in Failed',
        description:
          error.message || 'An error occurred during Google sign-in.',
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
    isEmailVerificationNeeded,
    handleResendVerification,
    isResendingVerification,
  };
}
