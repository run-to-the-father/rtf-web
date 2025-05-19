'use client';

import Link from 'next/link';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import GoogleIcon from '@/shared/ui/icon/google';
import { Input } from '@/shared/ui/input';
import { useSignUp } from '../hooks/use-sign-up';

// 에러 메시지 컴포넌트
const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className='mt-1 text-sm text-red-500'>{message}</p>;
};

export function SignUpForm() {
  const {
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
  } = useSignUp();

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
        <h1 className='mb-2 text-3xl font-bold'>Create Account</h1>
        <h2 className='text-3xl font-bold'>to Get Started</h2>
      </div>
      <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-1'>
          <Input
            type='text'
            placeholder='Username'
            required
            className={`h-14 bg-secondary ${errors.nickname ? 'border-red-500' : ''}`}
            {...register('nickname')}
          />
          <ErrorMessage message={errors.nickname?.message} />
        </div>

        <div className='space-y-1'>
          <Input
            type='email'
            placeholder='Email'
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
              placeholder='Password'
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

        <div className='space-y-1'>
          <div className='relative flex items-center'>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Confirm password'
              required
              className={`h-14 bg-secondary ${errors.confirmPassword ? 'border-red-500' : ''}`}
              {...register('confirmPassword')}
            />
            <button
              type='button'
              className='absolute right-3'
              onClick={toggleConfirmPasswordVisibility}
              aria-label={
                showConfirmPassword ? 'Hide password' : 'Show password'
              }
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <ErrorMessage message={errors.confirmPassword?.message} />
        </div>

        <div className='space-y-1'>
          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium'>Gender</label>
            <div className='flex space-x-4'>
              <label className='flex cursor-pointer items-center space-x-2'>
                <input
                  type='radio'
                  className='h-4 w-4'
                  value='male'
                  {...register('gender')}
                />
                <span>Male</span>
              </label>
              <label className='flex cursor-pointer items-center space-x-2'>
                <input
                  type='radio'
                  className='h-4 w-4'
                  value='female'
                  {...register('gender')}
                />
                <span>Female</span>
              </label>
              <label className='flex cursor-pointer items-center space-x-2'>
                <input
                  type='radio'
                  className='h-4 w-4'
                  value='other'
                  {...register('gender')}
                />
                <span>Other</span>
              </label>
            </div>
            <ErrorMessage message={errors.gender?.message} />
          </div>
        </div>

        <Button
          type='submit'
          className='h-14 w-full rounded-8pxr bg-black text-white'
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Register'}
        </Button>
      </form>

      <div className='relative mt-8'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-gray-300'></div>
        </div>
        <div className='relative flex justify-center text-sm'>
          <span className='typo-2xl-500 bg-white px-2 text-gray-500'>
            Or Register with
          </span>
        </div>
      </div>

      <div className='mt-27pxr flex items-center justify-center'>
        <Button
          type='button'
          variant='outline'
          className={`flex h-56pxr items-center justify-center rounded-8pxr border border-secondary bg-white px-6 transition-all hover:bg-gray-50`}
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          aria-label='Sign up with Google'
        >
          <GoogleIcon width={32} height={32} />
          <span className='ml-2'>Sign up with Google</span>
        </Button>
      </div>

      <div className='mt-6 text-center'>
        <p className='typo-2xl-500'>
          Already have an account?{' '}
          <Link href='/sign-in' className='font-semibold text-black'>
            Login Now
          </Link>
        </p>
      </div>
    </div>
  );
}
