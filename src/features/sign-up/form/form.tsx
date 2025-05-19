'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Eye, EyeClosed } from 'lucide-react';
import { Gender } from '@/entities/user';
import { Button } from '@/shared/ui/button';
import GoogleIcon from '@/shared/ui/icon/google';
import { Input } from '@/shared/ui/input';
import { useSignUp } from './use-sign-up';

// 에러 메시지 컴포넌트
const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className='mt-1 text-sm text-red-500'>{message}</p>;
};

export function SignUpForm() {
  const router = useRouter();
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    gender,
    setGender,
    showPassword,
    showConfirmPassword,
    isLoading,
    errors,
    handleSubmit,
    handleGoogleSignUp,
    toggleShowPassword,
    toggleShowConfirmPassword,
  } = useSignUp();

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
      <form onSubmit={handleSubmit} className='mt-28pxr space-y-4'>
        {errors.form && (
          <div className='rounded border border-red-200 bg-red-50 p-3 text-sm text-red-500'>
            {errors.form}
          </div>
        )}

        <div className='space-y-1'>
          <Input
            type='text'
            placeholder='Username'
            value={username}
            onChange={setUsername}
            required
            className={`h-14 bg-secondary ${errors.username ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            disabled={isLoading}
          />
          <ErrorMessage message={errors.username} />
        </div>

        <div className='space-y-1'>
          <Input
            type='email'
            placeholder='Email'
            value={email}
            onChange={setEmail}
            required
            className={`h-14 bg-secondary ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            disabled={isLoading}
          />
          <ErrorMessage message={errors.email} />
        </div>

        <div className='space-y-1'>
          <div className='relative flex items-center'>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              value={password}
              onChange={setPassword}
              required
              className={`h-14 bg-secondary pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              disabled={isLoading}
            />
            <button
              type='button'
              className='absolute right-3'
              onClick={toggleShowPassword}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeClosed /> : <Eye />}
            </button>
          </div>
          <ErrorMessage message={errors.password} />
        </div>

        <div className='space-y-1'>
          <div className='relative flex items-center'>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
              className={`h-14 bg-secondary pr-10 ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              disabled={isLoading}
            />
            <button
              type='button'
              className='absolute right-3'
              onClick={toggleShowConfirmPassword}
              aria-label={
                showConfirmPassword ? 'Hide password' : 'Show password'
              }
            >
              {showConfirmPassword ? <EyeClosed /> : <Eye />}
            </button>
          </div>
          <ErrorMessage message={errors.confirmPassword} />
        </div>

        <div className='space-y-1'>
          <div className='flex flex-col'>
            <label className='mb-2 text-sm font-medium'>Gender</label>
            <div className='flex space-x-4'>
              <label className='flex cursor-pointer items-center space-x-2'>
                <input
                  type='radio'
                  name='gender'
                  value='male'
                  checked={gender === 'male'}
                  onChange={() => setGender('male')}
                  disabled={isLoading}
                  className='h-4 w-4'
                />
                <span>Male</span>
              </label>
              <label className='flex cursor-pointer items-center space-x-2'>
                <input
                  type='radio'
                  name='gender'
                  value='female'
                  checked={gender === 'female'}
                  onChange={() => setGender('female')}
                  disabled={isLoading}
                  className='h-4 w-4'
                />
                <span>Female</span>
              </label>
              <label className='flex cursor-pointer items-center space-x-2'>
                <input
                  type='radio'
                  name='gender'
                  value='other'
                  checked={gender === 'other'}
                  onChange={() => setGender('other')}
                  disabled={isLoading}
                  className='h-4 w-4'
                />
                <span>Other</span>
              </label>
            </div>
          </div>
        </div>

        <Button
          type='submit'
          className='h-14 w-full rounded-8pxr bg-black text-white'
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
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
        <button
          type='button'
          className='rounded-8pxr border border-secondary bg-white p-14pxr px-40pxr'
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          aria-label='Sign up with Google'
        >
          <GoogleIcon className='h-26pxr w-26pxr' />
        </button>
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
