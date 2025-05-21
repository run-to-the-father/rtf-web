'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { EmailSent, ForgotPasswordForm } from '@/features/password/form';
import useFunnel from '@/shared/hooks/use-funnel';

// 퍼널 단계 정의
const STEPS = ['SEND_EMAIL', 'EMAIL_SENT'] as const;
type ForgotPasswordStep = (typeof STEPS)[number];

export default function ForgotPasswordFunnel() {
  const searchParams = useSearchParams();

  // URL에서 이메일 파라미터 가져오기
  const initialEmail = searchParams.get('email') || '';

  // useFunnel 훅 사용
  const { Funnel, Step, currentStep, setCurrentStep } =
    useFunnel<ForgotPasswordStep>(STEPS, 'SEND_EMAIL');

  const [email, setEmail] = useState(initialEmail);
  const [isResending, setIsResending] = useState(false);

  // 이메일 변경 핸들러
  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
  };

  // 이메일 전송 성공 핸들러
  const handleSendSuccess = () => {
    setCurrentStep('EMAIL_SENT');
  };

  // 이메일 재전송 핸들러
  const handleResend = async () => {
    if (isResending) return;

    setIsResending(true);

    try {
      // API 호출하여 이메일 재전송
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '이메일 재전송에 실패했습니다.');
      }

      // 재전송 성공 알림 (생략)
    } catch (error) {
      console.error('이메일 재전송 오류:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className='mx-auto w-full max-w-md bg-white p-8'>
      <Funnel>
        <Step name='SEND_EMAIL'>
          <ForgotPasswordForm
            email={email}
            onEmailChange={handleEmailChange}
            onSendSuccess={handleSendSuccess}
          />
        </Step>
        <Step name='EMAIL_SENT'>
          <EmailSent
            email={email}
            onResend={handleResend}
            isResending={isResending}
          />
        </Step>
      </Funnel>
    </div>
  );
}
