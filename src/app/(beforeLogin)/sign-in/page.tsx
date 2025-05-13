import { SignInForm } from '@/features/sign-in/form';

function SignInPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-white'>
      <div className='w-full max-w-md'>
        <SignInForm />
      </div>
    </div>
  );
}

export default SignInPage;
