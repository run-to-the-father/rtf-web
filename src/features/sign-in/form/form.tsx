'use client';

import Link from 'next/link';
import { ChevronLeft, Eye, EyeOff, Mail } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import GoogleIcon from '@/shared/ui/icon/google';
import { Input } from '@/shared/ui/input';
import { useSignIn } from '../hooks/use-sign-in';

// 에러 메시지 컴포넌트
const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className='mt-1 text-sm text-red-500'>{message}</p>;
};

export function SignInForm() {
  const {
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
  } = useSignIn();

  return (
    <div className='mx-auto w-full max-w-md p-6'>
      <div className='w-full'>
        <button
          className='flex h-40pxr w-40pxr items-center justify-center rounded-12pxr border border-secondary'
          onClick={handleBackNavigation}
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

      {isEmailVerificationNeeded ? (
        <div className='mb-6 rounded-md bg-amber-50 p-4'>
          <div className='flex items-start space-x-3'>
            <Mail className='mt-0.5 h-5 w-5 text-amber-800' />
            <div>
              <h3 className='font-medium text-amber-800'>
                Email verification required
              </h3>
              <p className='mt-1 text-sm text-amber-700'>
                Please verify your email address to complete your registration.
                Check your inbox for the verification link.
              </p>
              <Button
                onClick={handleResendVerification}
                disabled={isResendingVerification}
                className='mt-3 bg-amber-600 hover:bg-amber-700'
                size='sm'
              >
                {isResendingVerification
                  ? 'Sending...'
                  : 'Resend Verification Email'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

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
              onClick={togglePasswordVisibility}
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
          disabled={isLoading || isResendingVerification}
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
          className={`flex h-56pxr items-center justify-center rounded-8pxr border border-secondary bg-white px-6 transition-all hover:bg-gray-50`}
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          aria-label='Sign in with Google'
        >
          <GoogleIcon width={32} height={32} />
          <span className='ml-2'>Sign in with Google</span>
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
