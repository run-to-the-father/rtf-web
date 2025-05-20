'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/shared/lib/supabase/client';
import { Button } from '@/shared/ui/button';

export function AuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>(
    'loading',
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL에서 에러 파라미터 확인
        const error = searchParams.get('error');
        const errorCode = searchParams.get('error_code');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          console.error('인증 콜백 에러:', error, errorCode, errorDescription);
          setStatus('error');
          setErrorMessage(
            errorDescription || 'Email link has expired or is invalid.',
          );
          return;
        }

        // URL 해시에서 에러 파라미터 확인 (Fragment URL 경우)
        if (window.location.hash) {
          const hashParams = new URLSearchParams(
            window.location.hash.substring(1),
          );
          const hashError = hashParams.get('error');
          const hashErrorCode = hashParams.get('error_code');
          const hashErrorDescription = hashParams.get('error_description');

          if (hashError) {
            console.error(
              '해시 인증 콜백 에러:',
              hashError,
              hashErrorCode,
              hashErrorDescription,
            );
            setStatus('error');
            setErrorMessage(
              hashErrorDescription || 'Email link has expired or is invalid.',
            );
            return;
          }
        }

        // 세션 확인
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // 세션이 있으면 성공
        if (session) {
          setStatus('success');
          // 3초 후에 홈으로 이동
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else {
          setStatus('error');
          setErrorMessage('Session not found. Please log in again.');
        }
      } catch (err: any) {
        console.error('콜백 처리 오류:', err);
        setStatus('error');
        setErrorMessage(err.message || 'Error occurred during authentication.');
      }
    };

    handleAuthCallback();
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center p-4 text-center'>
        <h1 className='mb-4 text-2xl font-bold'>
          Processing Authentication...
        </h1>
        <p className='mb-6'>Please wait a moment.</p>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-black'></div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center p-4 text-center'>
        <h1 className='mb-4 text-2xl font-bold text-red-600'>
          Authentication Error
        </h1>
        <p className='mb-6'>{errorMessage}</p>
        <div className='flex flex-col gap-3'>
          <Button asChild>
            <Link href='/sign-in'>Return to Login</Link>
          </Button>
          <Button asChild variant='outline'>
            <Link href='/forgot-password'>Reset Password</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-4 text-center'>
      <h1 className='mb-4 text-2xl font-bold text-green-600'>
        Authentication Successful!
      </h1>
      <p className='mb-6'>
        Your email has been verified successfully. You will be redirected to the
        main page soon.
      </p>
      <Button asChild>
        <Link href='/'>Go to Main Page Now</Link>
      </Button>
    </div>
  );
}
