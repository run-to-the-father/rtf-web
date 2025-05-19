'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronLeft, Eye, EyeClosed } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import GoogleIcon from '@/shared/ui/icon/google';
import { Input } from '@/shared/ui/input';
import { toast } from '@/shared/ui/toast';
import { useSignIn } from './use-sign-in';

// 에러 메시지 컴포넌트
const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className='mt-1 text-sm text-red-500'>{message}</p>;
};

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [googleBtnClicked, setGoogleBtnClicked] = useState(false);

  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    isLoading,
    errors,
    handleEmailSignIn,
    handleGoogleSignIn,
    toggleShowPassword,
  } = useSignIn();

  // 오류 메시지 처리
  const error = searchParams.get('error');
  const errorDetails = searchParams.get('details');

  // 페이지 로드 시 오류 처리
  useEffect(() => {
    // 오류가 있을 때만 실행
    if (error) {
      let errorMessage = 'Login failed. Please try again.';

      if (error === 'no_code') {
        errorMessage = 'No authentication code. Please try again.';
      } else if (error === 'auth_error') {
        errorMessage = `Authentication error. ${errorDetails || 'Please try again.'}`;
      } else if (error === 'server_error') {
        errorMessage = `Server error. ${errorDetails || 'Please try again later.'}`;
      }

      // 콘솔에 항상 로깅
      console.error('로그인 오류:', {
        error,
        details: errorDetails,
        message: errorMessage,
      });

      // setTimout을 사용하여 컴포넌트 마운트 후 실행되도록 함
      const timer = setTimeout(() => {
        try {
          toast({
            variant: 'destructive',
            title: 'Login Error',
            description: errorMessage,
          });
        } catch (toastError) {
          console.error('Toast 에러:', toastError);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [error, errorDetails]);

  // 구글 로그인 핸들러
  const onGoogleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (googleBtnClicked || isLoading) return; // 이미 처리 중이면 중복 클릭 방지

    setGoogleBtnClicked(true);
    console.log('구글 로그인 버튼 클릭됨');

    try {
      // 디바운스 없이 바로 처리 - 직접 window.location.href 사용할 것이므로 지연 불필요
      handleGoogleSignIn();

      // 안전장치: 15초 후에도 페이지가 변경되지 않으면 상태 리셋
      const resetTimer = setTimeout(() => {
        console.log('구글 로그인 리다이렉트 확인...');
        if (document.location.pathname.includes('/sign-in')) {
          console.log('구글 로그인 리다이렉트 타임아웃, 상태 리셋');
          setGoogleBtnClicked(false);

          // 콘솔 로그만 남기고 토스트는 사용하지 않음
          console.error('Google login request timed out. Please try again.');
        }
      }, 15000);

      // 컴포넌트 언마운트시 타이머 정리
      return () => clearTimeout(resetTimer);
    } catch (error) {
      console.error('구글 로그인 버튼 처리 오류:', error);
      setGoogleBtnClicked(false);
    }
  };

  return (
    <div className='mx-auto w-full max-w-md p-6'>
      <div className='w-full'>
        <button
          className='flex h-40pxr w-40pxr items-center justify-center rounded-12pxr border border-secondary'
          onClick={() => router.back()}
          aria-label='Go back'
        >
          <ChevronLeft />
        </button>
      </div>
      <div className='mb-8 mt-28pxr'>
        <h1 className='mb-2 text-3xl font-bold'>Welcome back!</h1>
        <h2 className='text-3xl font-bold'>Glad to see you, Again!</h2>
      </div>

      <form onSubmit={handleEmailSignIn} className='space-y-4'>
        {errors.form && (
          <div className='rounded border border-red-200 bg-red-50 p-3 text-sm text-red-500'>
            {errors.form}
          </div>
        )}

        <div className='space-y-1'>
          <Input
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={setEmail}
            required
            className={`h-14 bg-secondary ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            disabled={isLoading || googleBtnClicked}
          />
          <ErrorMessage message={errors.email} />
        </div>

        <div className='space-y-1'>
          <div className='relative flex items-center'>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your password'
              value={password}
              onChange={setPassword}
              required
              className={`h-14 bg-secondary pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              disabled={isLoading || googleBtnClicked}
            />
            <button
              type='button'
              className='absolute right-3'
              onClick={toggleShowPassword}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isLoading || googleBtnClicked}
            >
              {showPassword ? <EyeClosed /> : <Eye />}
            </button>
          </div>
          <ErrorMessage message={errors.password} />
        </div>

        <div className='flex justify-end'>
          <Link
            href='/password'
            className='text-sm text-gray-500 hover:text-black'
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type='submit'
          className='h-14 w-full rounded-8pxr bg-black text-white'
          disabled={isLoading || googleBtnClicked}
        >
          {isLoading ? 'Logging in...' : 'Login'}
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
          className={`flex h-14 items-center justify-center rounded-8pxr border border-secondary bg-white px-6 transition-all hover:bg-gray-50 ${
            googleBtnClicked ? 'animate-pulse bg-gray-100' : ''
          }`}
          onClick={onGoogleSignInClick}
          disabled={isLoading || googleBtnClicked}
          aria-label='Sign in with Google'
        >
          <GoogleIcon className='mr-2 h-5 w-5' />
          <span>Sign in with Google</span>
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
