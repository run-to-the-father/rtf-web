import { SignUpForm } from '@/features/sign-up/form';

function SignUpPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-white'>
      <div className='w-full max-w-md'>
        <SignUpForm />
      </div>
    </div>
  );
}

export default SignUpPage;
