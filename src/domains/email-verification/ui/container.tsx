'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { toast } from '@/shared/ui/toast';

export default function EmailVerificationContainer() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [isResending, setIsResending] = useState(false);
  const [justResent, setJustResent] = useState(false);

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Email address is missing. Please try signing up again.',
      });
      return;
    }

    try {
      setIsResending(true);

      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to resend verification email');
      }

      setJustResent(true);
      toast({
        title: 'Email Sent',
        description: 'A new verification email has been sent to your inbox.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to resend verification email',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className='flex h-full min-h-screen w-full items-center justify-center'>
      <div className='mx-auto w-full max-w-md p-6 text-center'>
        <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100'>
          <Mail className='h-12 w-12 text-blue-600' />
        </div>

        <h1 className='mb-4 text-3xl font-bold'>Check Your Email</h1>

        <p className='mb-8 text-gray-600'>
          Please check your email to complete the registration. Click the
          verification link in the email we just sent to finalize your account.
        </p>

        <div className='mb-6 rounded-md bg-amber-50 p-4 text-left text-sm text-amber-800'>
          <p className='mb-2 font-medium'>Next steps:</p>
          <ol className='list-inside list-decimal space-y-1'>
            <li>Check your email inbox.</li>
            <li>Open the &quot;Confirm Your Signup&quot; email.</li>
            <li>Click the verification link in the email.</li>
          </ol>
        </div>

        {justResent && (
          <div className='mb-6 rounded-md bg-green-50 p-4 text-left text-sm text-green-800'>
            <p className='font-medium'>Verification email sent!</p>
            <p>
              A new verification email has been sent to {email}. Please check
              your inbox.
            </p>
          </div>
        )}

        <p className='mb-8 text-sm text-gray-500'>
          Didn't receive an email? Check your spam folder or click the button
          below to request a new verification email.
        </p>

        <div className='flex flex-col gap-3'>
          {email && (
            <Button
              onClick={handleResendVerification}
              disabled={isResending}
              className='mb-2'
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          )}
          <Button asChild>
            <Link href='/sign-in'>Go to Login Page</Link>
          </Button>
          <Button asChild variant='outline'>
            <Link href='/sign-up'>Return to Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
