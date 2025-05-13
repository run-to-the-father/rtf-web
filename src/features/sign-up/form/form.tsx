'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, Eye, EyeClosed } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import GoogleIcon from '@/shared/ui/icon/google';
import { Input } from '@/shared/ui/input';

export function SignUpForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 비밀번호 일치 확인
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    // 여기에 회원가입 로직 구현
    console.log('회원가입 시도:', { username, email, password });
  };

  return (
    <div className='mx-auto w-full max-w-md p-6'>
      <div className='w-full'>
        <button className='border-secondary flex h-40pxr w-40pxr items-center justify-center rounded-12pxr border'>
          <ChevronLeft />
        </button>
      </div>
      <form onSubmit={handleSubmit} className='mt-28pxr space-y-4'>
        <div className='space-y-2'>
          <Input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className='bg-secondary h-14'
          />
        </div>

        <div className='space-y-2'>
          <Input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='bg-secondary h-14'
          />
        </div>

        <div className='relative flex items-center'>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='bg-secondary h-14 pr-10'
          />
          <button
            type='button'
            className='absolute right-3'
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? <EyeClosed /> : <Eye />}
          </button>
        </div>

        <div className='relative flex items-center'>
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className='bg-secondary h-14 pr-10'
          />
          <button
            type='button'
            className='absolute right-3'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={
              showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'
            }
          >
            {showConfirmPassword ? <EyeClosed /> : <Eye />}
          </button>
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
          className='border-secondary rounded-8pxr border bg-white p-14pxr px-40pxr'
          aria-label='Google로 회원가입'
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
