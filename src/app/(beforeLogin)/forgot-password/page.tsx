import { Metadata } from 'next';
import { Suspense } from 'react';
import ForgotPasswordFunnel from '@/domains/forgot-password/ui/funnel';

export const metadata: Metadata = {
  title: 'Forgot Password - Run to the Father',
  description: 'Reset your password for Run to the Father',
};

export default function ForgotPasswordPage() {
  return (
    <div className='flex h-full min-h-screen w-full items-center justify-center'>
      <Suspense fallback={<div>Loading...</div>}>
        <ForgotPasswordFunnel />
      </Suspense>
    </div>
  );
}
