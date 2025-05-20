'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { passwordChangeSchema } from '@/entities/user';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

interface ResetPasswordFormProps {
  onResetSuccess: () => void;
}

export function ResetPasswordForm({ onResetSuccess }: ResetPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = (): boolean => {
    setError('');

    try {
      // Zod 스키마로 유효성 검증
      passwordChangeSchema.parse({ password, confirmPassword });
      return true;
    } catch (validationError: any) {
      if (validationError.errors && validationError.errors.length > 0) {
        setError(validationError.errors[0].message);
      } else {
        setError('비밀번호 유효성 검증에 실패했습니다.');
      }
      return false;
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검증
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // API를 호출하여 비밀번호 업데이트
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      // 성공 시 다음 단계로 이동
      onResetSuccess();
    } catch (error: any) {
      console.error('비밀번호 재설정 오류:', error);
      setError(error.message || '비밀번호 재설정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className='mb-8 mt-28pxr'>
        <h1 className='mb-2 text-3xl font-bold'>Create new password</h1>
        <p className='text-gray-600'>
          Your new password must be unique from those previously used.
        </p>
      </div>

      <form onSubmit={handleResetPassword} className='space-y-6'>
        <div className='space-y-4'>
          <div className='relative'>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder='New Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='h-14 bg-secondary pr-10'
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className='relative'>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className='h-14 bg-secondary pr-10'
            />
            <button
              type='button'
              onClick={toggleConfirmPasswordVisibility}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <div className='rounded border border-red-200 bg-red-50 p-3 text-sm text-red-500'>
              {error}
            </div>
          )}
        </div>

        <Button
          type='submit'
          className='h-14 w-full rounded-8pxr bg-black text-white'
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
}
