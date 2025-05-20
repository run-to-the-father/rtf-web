'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { toast } from '@/shared/ui/toast';
import { zodResolver } from '@hookform/resolvers/zod';

// 이메일 스키마
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // URL에서 이메일 파라미터 가져오기
  const emailFromParams = searchParams.get('email') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: emailFromParams,
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send password reset email');
      }

      toast({
        title: 'Reset Email Sent',
        description:
          'Check your email for the OTP code to reset your password.',
      });

      // OTP 확인 페이지로 이동
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Request Failed',
        description: error.message || 'Failed to send reset email',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex h-full min-h-screen w-full items-center justify-center'>
      <div className='bg-background shadow-sm mx-auto w-full max-w-md space-y-6 rounded-lg border p-6'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-bold'>Forgot Your Password?</h1>
          <p className='text-muted-foreground text-sm'>
            Enter your email address and we'll send you a one-time password
            (OTP) to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium leading-none' htmlFor='email'>
              Email
            </label>
            <Input
              id='email'
              type='email'
              placeholder='Enter your email'
              {...register('email')}
            />
            {errors.email && (
              <p className='text-destructive text-xs'>{errors.email.message}</p>
            )}
          </div>

          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
          </Button>

          <div className='text-center text-sm'>
            <p>
              Remember your password?{' '}
              <Button
                variant='link'
                className='p-0 text-sm font-medium text-primary'
                onClick={() => router.push('/sign-in')}
              >
                Sign in
              </Button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
