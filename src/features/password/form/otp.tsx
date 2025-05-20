'use client';

import { useState } from 'react';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';

interface OTPVerificationProps {
  email: string;
  onVerifySuccess: () => void;
}

export function OTPVerification({
  email,
  onVerifySuccess,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // API를 호출하여 OTP 코드 검증
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify OTP code');
      }

      // 인증 성공 시 다음 단계로 이동
      onVerifySuccess();
    } catch (error: any) {
      console.error('OTP 인증 오류:', error);
      setError(error.message || 'Invalid OTP code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');

    try {
      // OTP 코드 재전송
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP code');
      }

      // 성공 메시지 표시
      setError('A new code has been sent to your email');
    } catch (error: any) {
      console.error('OTP 코드 재전송 오류:', error);
      setError(error.message || 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  // 입력 필드 렌더링 함수
  const renderSlot = (index: number) => {
    const hasChar = otp.length > index;

    return (
      <InputOTPSlot
        key={index}
        index={index}
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-md border bg-stone-50 text-xl data-[active=true]:ring-0',
          hasChar && 'border border-black bg-white',
        )}
      />
    );
  };

  return (
    <div>
      <div className='mb-8 mt-28pxr'>
        <h1 className='mb-2 text-3xl font-bold'>OTP Verification</h1>
        <p className='text-gray-600'>
          Enter the verification code we just sent on your email address.
        </p>
      </div>

      <form onSubmit={handleVerifyOTP} className='space-y-8'>
        {error && (
          <div
            className={cn(
              'rounded border p-3 text-sm',
              error.includes('new code')
                ? 'border-green-200 bg-green-50 text-green-600'
                : 'border-red-200 bg-red-50 text-red-500',
            )}
          >
            {error}
          </div>
        )}

        <div className='flex w-full justify-center'>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            inputMode='numeric'
            containerClassName='gap-x-10pxr justify-center'
          >
            <InputOTPGroup className='gap-x-10pxr'>
              {[0, 1, 2, 3, 4, 5].map(renderSlot)}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          type='submit'
          className='h-14 w-full rounded-8pxr bg-black text-white'
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </Button>
      </form>

      <div className='mt-16 text-center'>
        <p className='typo-2xl-500'>
          Didn't receive code?{' '}
          <button
            onClick={handleResendCode}
            type='button'
            className='font-semibold text-black'
            disabled={isLoading}
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
