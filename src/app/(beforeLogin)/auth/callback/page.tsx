import { Suspense } from 'react';
import { AuthCallback } from '@/domains/auth';

// 로딩 UI 컴포넌트
function LoadingFallback() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-4 text-center'>
      <h1 className='mb-4 text-2xl font-bold'>Loading...</h1>
      <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-black'></div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallback />
    </Suspense>
  );
}
