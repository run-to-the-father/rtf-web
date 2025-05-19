import { Metadata } from 'next';
import { SignUpForm } from '@/features/sign-up/form';

export const metadata: Metadata = {
  title: 'Sign Up - Run to the Father',
  description: 'Create a new account for Run to the Father',
};

export default function SignUpPage() {
  return (
    <div className='flex h-full min-h-screen w-full items-center justify-center'>
      <SignUpForm />
    </div>
  );
}
