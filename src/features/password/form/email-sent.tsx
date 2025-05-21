'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface EmailSentProps {
  email: string;
  onResend: () => void;
  isResending?: boolean;
}

export function EmailSent({
  email,
  onResend,
  isResending = false,
}: EmailSentProps) {
  return (
    <div className='w-full text-center'>
      <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100'>
        <Mail className='h-12 w-12 text-blue-600' />
      </div>

      <h1 className='mb-4 text-3xl font-bold'>Check Your Email</h1>

      <p className='mb-6 text-gray-600'>
        We have sent a password reset link to{' '}
        <span className='font-medium'>{email}</span>. Click the link in the
        email to reset your password.
      </p>

      <div className='mb-6 rounded-md bg-amber-50 p-4 text-left text-sm text-amber-800'>
        <p className='mb-2 font-medium'>Next steps:</p>
        <ol className='list-inside list-decimal space-y-1'>
          <li>Check your email inbox.</li>
          <li>Open the "Reset Your Password" email.</li>
          <li>Click the reset link in the email.</li>
        </ol>
      </div>

      <p className='mb-8 text-sm text-gray-500'>
        Didn't receive an email? Check your spam folder or click the button
        below to request a new reset email.
      </p>

      <div className='flex flex-col gap-3'>
        <Button onClick={onResend} disabled={isResending} className='mb-2'>
          {isResending ? 'Sending...' : 'Resend Reset Email'}
        </Button>

        <Button asChild variant='outline'>
          <Link href='/sign-in'>Back to Login</Link>
        </Button>
      </div>
    </div>
  );
}
