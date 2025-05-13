import { PasswordForgotContainer } from '@/domains/password/ui/container';

function PasswordPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-white'>
      <div className='w-full max-w-md'>
        <PasswordForgotContainer />
      </div>
    </div>
  );
}

export default PasswordPage;
