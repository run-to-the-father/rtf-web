import { Metadata } from 'next';
import { Suspense } from 'react';
import EmailVerificationContainer from '@/domains/email-verification/ui/container';

export const metadata: Metadata = {
  title: 'Email Verification - Run to the Father',
  description: 'Please verify your email to complete registration',
};

export default function EmailVerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerificationContainer />
    </Suspense>
  );
}
