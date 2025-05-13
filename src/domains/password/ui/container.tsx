'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import {
  OTPVerification,
  PasswordChangedSuccess,
  PasswordForgotForm,
  PasswordResetForm,
} from '@/features/password/form';
import useFunnel from '@/shared/hooks/use-funnel';

// 비밀번호 찾기 단계
const STEPS = ['forgot', 'verification', 'reset', 'success'] as const;
type Step = (typeof STEPS)[number];

export function PasswordForgotContainer() {
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

  // OTP 코드 전송 후 다음 단계로 이동하는 핸들러
  const handleSendCodeSuccess = () => {
    onNextStep();
  };

  // OTP 인증 성공 후 비밀번호 재설정으로 이동
  const handleVerifySuccess = () => {
    onNextStep();
  };

  // 비밀번호 재설정 성공 후 완료 화면으로 이동
  const handleResetSuccess = () => {
    onNextStep();
  };

  // 뒤로 가기 버튼 처리
  const handleBack = () => {
    // 성공 화면에서는 로그인 페이지로 이동 (이 부분은 필요에 따라 수정)
    if (currentStep === 'success') {
      window.location.href = '/sign-in';
      return;
    }

    onPrevStep();
  };

  return (
    <div className='mx-auto w-full max-w-md p-6'>
      {currentStep !== 'success' && (
        <div className='w-full'>
          <button
            className='border-secondary flex h-40pxr w-40pxr items-center justify-center rounded-12pxr border'
            aria-label='go back'
            onClick={handleBack}
          >
            <ChevronLeft />
          </button>
        </div>
      )}

      <Funnel>
        <FunnelStep name='forgot'>
          <PasswordForgotForm
            email={email}
            onEmailChange={handleEmailChange}
            onSendSuccess={handleSendCodeSuccess}
          />
        </FunnelStep>

        <FunnelStep name='verification'>
          <OTPVerification onVerifySuccess={handleVerifySuccess} />
        </FunnelStep>

        <FunnelStep name='reset'>
          <PasswordResetForm onResetSuccess={handleResetSuccess} />
        </FunnelStep>

        <FunnelStep name='success'>
          <PasswordChangedSuccess />
        </FunnelStep>
      </Funnel>
    </div>
  );
}
