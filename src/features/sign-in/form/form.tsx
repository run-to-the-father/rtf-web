'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import {
  type SignInFormData,
  signInSchema,
} from '@/entities/user/model/user-schema';
import { Button } from '@/shared/ui/button';
import GoogleIcon from '@/shared/ui/icon/google';
import { Input } from '@/shared/ui/input';
import { toast } from '@/shared/ui/toast';
import { zodResolver } from '@hookform/resolvers/zod';

// 에러 메시지 컴포넌트
const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className='mt-1 text-sm text-red-500'>{message}</p>;
};

export function SignInForm() {
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

  return (
    <div className='mx-auto w-full max-w-md p-6'>
      <div className='w-full'>
        <button
          className='flex h-40pxr w-40pxr items-center justify-center rounded-12pxr border border-secondary'
          onClick={() => router.back()}
          aria-label='Go back'
          type='button'
        >
          <ChevronLeft />
        </button>
      </div>
      <div className='mb-8 mt-28pxr'>
        <h1 className='mb-2 text-3xl font-bold'>Welcome back!</h1>
        <h2 className='text-3xl font-bold'>Glad to see you, Again!</h2>
      </div>

      <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-1'>
          <Input
            type='email'
            placeholder='Enter your email'
            required
            className={`h-14 bg-secondary ${errors.email ? 'border-red-500' : ''}`}
            {...register('email')}
          />
          <ErrorMessage message={errors.email?.message} />
        </div>

        <div className='space-y-1'>
          <div className='relative flex items-center'>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your password'
              required
              className={`h-14 bg-secondary ${errors.password ? 'border-red-500' : ''}`}
              {...register('password')}
            />
            <button
              type='button'
              className='absolute right-3'
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <ErrorMessage message={errors.password?.message} />
        </div>

        <div className='flex justify-end'>
          <Link
            href='/forgot-password'
            className='text-sm text-gray-500 hover:text-black'
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type='submit'
          className='h-14 w-full rounded-8pxr bg-black text-white'
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Login'}
        </Button>
      </form>

      <div className='relative mt-8'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-gray-300'></div>
        </div>
        <div className='relative flex justify-center text-sm'>
          <span className='typo-2xl-500 bg-white px-2 text-gray-500'>
            Or Login with
          </span>
        </div>
      </div>

      <div className='mt-27pxr flex items-center justify-center'>
        <Button
          type='button'
          variant='outline'
          className={`flex h-56pxr w-100pxr items-center justify-center rounded-8pxr border border-secondary bg-white px-6 transition-all hover:bg-gray-50`}
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          aria-label='Sign in with Google'
        >
          <GoogleIcon width={32} height={32} />
        </Button>
      </div>

      <div className='mt-6 text-center'>
        <p className='typo-2xl-500'>
          Don't have an account?{' '}
          <Link href='/sign-up' className='font-semibold text-black'>
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}
