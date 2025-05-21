'use client';

import { useEffect, useState } from 'react';
import {
  PasswordChangedSuccess,
  ResetPasswordForm,
} from '@/features/password/form';
import useFunnel from '@/shared/hooks/use-funnel';
import { supabase } from '@/shared/lib/supabase/client';

// 퍼널 단계 정의
const STEPS = ['RESET_PASSWORD', 'SUCCESS'] as const;
type ResetPasswordStep = (typeof STEPS)[number];

export default function ResetPasswordFunnel() {
  // useFunnel 훅 사용
  const { Funnel, Step, setCurrentStep } = useFunnel<ResetPasswordStep>(
    STEPS,
    'RESET_PASSWORD',
  );

  const [sessionError, setSessionError] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);

  // Supabase 인증 상태 변경 감지
  useEffect(() => {
    // 페이지 로드 시 현재 세션 확인
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setHasSession(true);
      } else {
        setSessionError(
          'No active session found. Please follow the reset link from your email.',
        );
      }
    };

    checkSession();

    // PASSWORD_RECOVERY 이벤트 리스너 설정
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          console.log('Password recovery event detected');
          setHasSession(true);
          setSessionError(null);
        } else if (event === 'SIGNED_OUT') {
          setHasSession(false);
          setSessionError(
            'Session expired. Please follow the reset link from your email again.',
          );
        }
      },
    );

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // 비밀번호 재설정 성공 핸들러
  const handleResetSuccess = () => {
    setCurrentStep('SUCCESS');
  };

  return (
    <div className='shadow-sm mx-auto w-full max-w-md rounded-lg border bg-white p-8'>
      <Funnel>
        <Step name='RESET_PASSWORD'>
          <ResetPasswordForm
            onResetSuccess={handleResetSuccess}
            sessionError={sessionError}
            hasSession={hasSession}
          />
        </Step>
        <Step name='SUCCESS'>
          <PasswordChangedSuccess />
        </Step>
      </Funnel>
    </div>
  );
}
