'use client';

import { useState } from 'react';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';

interface OTPVerificationProps {
  onVerifySuccess: () => void;
}

export function OTPVerification({ onVerifySuccess }: OTPVerificationProps) {
  const [otp, setOtp] = useState('');

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    try {
      // TODO: Supabase를 사용하여 OTP 인증 로직 구현
      console.log('OTP 인증:', { otp });
      // 인증 성공 시 비밀번호 재설정 페이지로 이동
      onVerifySuccess();
    } catch (error) {
      console.error('OTP 인증 오류:', error);
    }
  };

  const handleResendCode = () => {
    // TODO: Supabase를 사용하여 OTP 코드 재전송 로직 구현
    console.log('OTP 코드 재전송:');
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
        >
          Verify
        </Button>
      </form>

      <div className='mt-16 text-center'>
        <p className='typo-2xl-500'>
          Didn't receive code?{' '}
          <button
            onClick={handleResendCode}
            type='button'
            className='font-semibold text-black'
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
