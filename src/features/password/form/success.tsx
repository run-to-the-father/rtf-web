'use client';

import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { SuccessIcon } from '@/shared/ui/icon/success';

export function PasswordChangedSuccess() {
  return (
    <div className='flex flex-col items-center'>
      <div className='mb-8 flex flex-col items-center justify-center'>
        <SuccessIcon className='mb-8 h-24 w-24' />
        <h1 className='mb-2 text-center text-3xl font-bold'>
          Password Changed!
        </h1>
        <p className='text-center text-gray-400'>
          Your password has been changed successfully.
        </p>
      </div>

      <Button asChild className='h-14 w-full rounded-8pxr bg-black text-white'>
        <Link href='/sign-in'>Back to Login</Link>
      </Button>
    </div>
  );
}
