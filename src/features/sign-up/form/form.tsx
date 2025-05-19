'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Eye, EyeClosed } from 'lucide-react';
import { Gender } from '@/entities/user';
import { Button } from '@/shared/ui/button';
import GoogleIcon from '@/shared/ui/icon/google';
import { Input } from '@/shared/ui/input';

// 에러 메시지 컴포넌트
const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className='mt-1 text-sm text-red-500'>{message}</p>;
};

export function SignUpForm() {
  const router = useRouter();

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
      <form className='mt-28pxr space-y-4'>
        <div className='space-y-1'>
          <Input
            type='text'
            placeholder='Username'
            required
            className={`h-14 bg-secondary`}
          />
        </div>

        <div className='space-y-1'>
          <Input
            type='email'
            placeholder='Email'
            required
            className={`h-14 bg-secondary`}
          />
        </div>

        <div className='space-y-1'>
          <div className='relative flex items-center'>
            <Input
              type='password'
              placeholder='Password'
              required
              className={`h-14 bg-secondary`}
            />
            <button
              type='button'
              className='absolute right-3'
              aria-label='Show password'
            >
              <Eye />
            </button>
          </div>
        </div>

        <div className='space-y-1'>
          <div className='relative flex items-center'>
            <Input
              type='password'
              placeholder='Confirm password'
              required
              className={`h-14 bg-secondary`}
            />
            <button
              type='button'
              className='absolute right-3'
              aria-label='Show password'
            >
              <Eye />
            </button>
          </div>
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
                  className='h-4 w-4'
                />
                <span>Male</span>
              </label>
              <label className='flex cursor-pointer items-center space-x-2'>
                <input
                  type='radio'
                  name='gender'
                  value='female'
                  className='h-4 w-4'
                />
                <span>Female</span>
              </label>
              <label className='flex cursor-pointer items-center space-x-2'>
                <input
                  type='radio'
                  name='gender'
                  value='other'
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
        >
          Register
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
