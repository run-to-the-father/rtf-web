'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ForgotPasswordForm } from '@/features/password/form/form';
import { OTPVerification } from '@/features/password/form/otp';
import { ResetPasswordForm } from '@/features/password/form/reset';
import { PasswordChangedSuccess } from '@/features/password/form/success';

// Funnel 단계
enum ForgotPasswordStep {
  SEND_EMAIL = 'send_email',
  VERIFY_OTP = 'verify_otp',
  RESET_PASSWORD = 'reset_password',
  SUCCESS = 'success',
}

export default function ForgotPasswordFunnel() {
  const searchParams = useSearchParams();

  // URL에서 이메일 파라미터 가져오기
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>(
    ForgotPasswordStep.SEND_EMAIL,
  );

  // 이메일 변경 핸들러
  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
  };

  // 이메일 전송 성공 핸들러
  const handleSendSuccess = () => {
    setCurrentStep(ForgotPasswordStep.VERIFY_OTP);
  };

  // OTP 검증 성공 핸들러
  const handleVerifySuccess = () => {
    setCurrentStep(ForgotPasswordStep.RESET_PASSWORD);
  };

  // 비밀번호 재설정 성공 핸들러
  const handleResetSuccess = () => {
    setCurrentStep(ForgotPasswordStep.SUCCESS);
  };

  // 현재 단계에 맞는 컴포넌트 렌더링
  const renderCurrentStep = () => {
    switch (currentStep) {
      case ForgotPasswordStep.SEND_EMAIL:
        return (
          <ForgotPasswordForm
            email={email}
            onEmailChange={handleEmailChange}
            onSendSuccess={handleSendSuccess}
          />
        );
      case ForgotPasswordStep.VERIFY_OTP:
        return (
          <OTPVerification
            email={email}
            onVerifySuccess={handleVerifySuccess}
          />
        );
      case ForgotPasswordStep.RESET_PASSWORD:
        return <ResetPasswordForm onResetSuccess={handleResetSuccess} />;
      case ForgotPasswordStep.SUCCESS:
        return <PasswordChangedSuccess />;
      default:
        return null;
    }
  };

  return (
    <div className='shadow-sm mx-auto w-full max-w-md rounded-lg border bg-white p-8'>
      {renderCurrentStep()}
    </div>
  );
}
