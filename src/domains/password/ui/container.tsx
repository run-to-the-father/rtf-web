'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { OTPVerification, PasswordForgotForm } from '@/features/password/form';
import useFunnel from '@/shared/hooks/use-funnel';

// 비밀번호 찾기 단계
const STEPS = ['forgot', 'verification'] as const;
type Step = (typeof STEPS)[number];

export function PasswordForgotContainer() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const {
    currentStep,
    Funnel,
    Step: FunnelStep,
    onNextStep,
    onPrevStep,
  } = useFunnel<Step>(STEPS, 'forgot');

  // 이메일 상태 갱신 핸들러
  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
  };

  const handlePrevStep = () => {
    console.log('현재 단계:', currentStep);
    if (currentStep === 'forgot') {
      router.push('/sign-in');
      return;
    }
    onPrevStep();
  };

  // OTP 코드 전송 후 다음 단계로 이동하는 핸들러
  const handleSendCodeSuccess = () => {
    onNextStep();
  };

  return (
    <div className='mx-auto w-full max-w-md p-6'>
      <button
        className='border-secondary flex h-40pxr w-40pxr items-center justify-center rounded-12pxr border'
        aria-label='go back'
        onClick={handlePrevStep}
      >
        <ChevronLeft />
      </button>

      <Funnel>
        <FunnelStep name='forgot'>
          <PasswordForgotForm
            email={email}
            onEmailChange={handleEmailChange}
            onSendSuccess={handleSendCodeSuccess}
          />
        </FunnelStep>

        <FunnelStep name='verification'>
          <OTPVerification />
        </FunnelStep>
      </Funnel>
    </div>
  );
}
