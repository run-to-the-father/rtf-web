import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import ForgotPasswordFunnel from '@/domains/forgot-password/ui/funnel';

export const metadata: Metadata = {
  title: 'Verify OTP - Run to the Father',
  description: 'Verify your OTP code to reset your password',
};

export default function VerifyOTPPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  // 이메일 파라미터가 없으면 forgot-password 페이지로 리다이렉트
  if (!searchParams.email) {
    redirect('/forgot-password');
  }

  return (
    <div className='flex h-full min-h-screen w-full items-center justify-center'>
      <Suspense fallback={<div>Loading...</div>}>
        <ForgotPasswordFunnel />
      </Suspense>
    </div>
  );
}
