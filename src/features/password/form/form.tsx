'use client';

import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

interface PasswordForgotFormProps {
  email: string;
  onEmailChange: (email: string) => void;
  onSendSuccess: () => void;
}

export function PasswordForgotForm({
  email,
  onEmailChange,
  onSendSuccess,
}: PasswordForgotFormProps) {
  // OTP 인증 코드 보내기
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      // TODO: Supabase를 사용하여 OTP 코드 전송 로직 구현
      console.log('OTP 코드 보내기:', email);
      // 다음 단계로 이동
      onSendSuccess();
    } catch (error) {
      console.error('OTP 전송 오류:', error);
    }
  };

  return (
    <div>
      <div className='mb-8 mt-28pxr'>
        <h1 className='mb-2 text-3xl font-bold'>Forgot Password?</h1>
        <p className='text-gray-600'>
          Don't worry! It occurs. Please enter the email address linked with
          your account.
        </p>
      </div>

      <form onSubmit={handleSendCode} className='space-y-8'>
        <div className='space-y-2'>
          <Input
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
            className='bg-secondary h-14'
          />
        </div>

        <Button
          type='submit'
          className='h-14 w-full rounded-8pxr bg-black text-white'
        >
          Send Code
        </Button>
      </form>

      <div className='mt-16 text-center'>
        <p className='typo-2xl-500'>
          Remember Password?{' '}
          <Link href='/sign-in' className='font-semibold text-black'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
