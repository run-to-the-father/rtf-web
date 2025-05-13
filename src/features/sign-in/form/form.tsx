'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, Eye, EyeClosed } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import GoogleIcon from '@/shared/ui/icon/google';
import { Input } from '@/shared/ui/input';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 여기에 로그인 로직 구현
    console.log('로그인 시도:', { email, password });
  };

  return (
    <div className='mx-auto w-full max-w-md p-6'>
      <div className='w-full'>
        <button className='border-secondary flex h-40pxr w-40pxr items-center justify-center rounded-12pxr border'>
          <ChevronLeft />
        </button>
      </div>
      <div className='mb-8 mt-28pxr'>
        <h1 className='mb-2 text-3xl font-bold'>Welcome back!</h1>
        <h2 className='text-3xl font-bold'>Glad to see you, Again!</h2>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Input
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='bg-secondary h-14'
          />
        </div>

        <div className='relative flex items-center'>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='bg-secondary h-14 pr-10'
          />
          <button
            type='button'
            className='absolute right-3'
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'hide password' : 'show password'}
          >
            {showPassword ? <EyeClosed /> : <Eye />}
          </button>
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
        >
          Login
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
        <button
          type='button'
          className='border-secondary rounded-8pxr border bg-white p-14pxr px-40pxr'
        >
          <GoogleIcon className='h-26pxr w-26pxr' />
        </button>
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
