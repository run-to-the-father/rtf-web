import { Metadata } from 'next';
import { PasswordForgotContainer } from '@/domains/password/ui/container';

export const metadata: Metadata = {
  title: 'Forgot Password - Run to the Father',
  description: 'Reset your password for Run to the Father',
};

export default function PasswordPage() {
  return (
    <div className='flex h-full min-h-screen w-full items-center justify-center'>
      <PasswordForgotContainer />
    </div>
  );
}
