import { Metadata } from 'next';
import { Suspense } from 'react';
import ResetPasswordFunnel from '@/domains/reset-password/ui/reset-funnel';

export const metadata: Metadata = {
  title: 'Reset Password - Run to the Father',
  description: 'Reset your password for Run to the Father',
};

export default function ResetPasswordPage() {
  return (
    <div className='flex h-full min-h-screen w-full items-center justify-center'>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordFunnel />
      </Suspense>
    </div>
  );
}
