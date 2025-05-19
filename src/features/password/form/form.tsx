'use client';

import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useForgotPassword } from './use-forgot-password';

// 에러 메시지 컴포넌트
const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className='mt-1 text-sm text-red-500'>{message}</p>;
};

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
  const {
    email: emailValue,
    setEmail,
    isLoading,
    errors,
    handleSendCode,
  } = useForgotPassword(email, onEmailChange, onSendSuccess);

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
        {errors.form && (
          <div className='rounded border border-red-200 bg-red-50 p-3 text-sm text-red-500'>
            {errors.form}
          </div>
        )}

        <div className='space-y-1'>
          <Input
            type='email'
            placeholder='Enter your email'
            value={emailValue}
            onChange={setEmail}
            required
            className={`h-14 bg-secondary ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            disabled={isLoading}
          />
          <ErrorMessage message={errors.email} />
        </div>

        <Button
          type='submit'
          className='h-14 w-full rounded-8pxr bg-black text-white'
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Code'}
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
