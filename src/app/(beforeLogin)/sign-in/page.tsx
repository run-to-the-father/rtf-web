import { Metadata } from 'next';
import { Suspense } from 'react';
import { SignInForm } from '@/features/sign-in/form';

export const metadata: Metadata = {
  title: 'Sign In - Run to the Father',
  description: 'Sign in to your Run to the Father account',
};

export default function SignInPage() {
  return (
    <div className='flex h-full min-h-screen w-full items-center justify-center'>
      <Suspense fallback={<div>Loading...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
