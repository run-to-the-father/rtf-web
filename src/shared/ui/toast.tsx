'use client';

import React, { createContext, useContext, useState } from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { AlertCircle, CheckCircle, InfoIcon, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

// 토스트 스타일 설정
const toastVariants = cva(
  'flex w-full max-w-sm items-center justify-between rounded-md p-4 shadow-md transition-all',
  {
    variants: {
      variant: {
        default: 'bg-white text-gray-900 border',
        destructive: 'bg-red-600 text-white',
        success: 'bg-green-600 text-white',
        warning: 'bg-amber-500 text-white',
        info: 'bg-blue-500 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

// 토스트 인터페이스
interface ToastProps extends VariantProps<typeof toastVariants> {
  title?: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
}

// 토스트 컨텍스트 인터페이스
interface ToastContextType {
  toasts: (ToastProps & { id: string })[];
  addToast: (toast: ToastProps) => void;
  removeToast: (id: string) => void;
}

// 전역 상태로 관리할 토스트 컨텍스트 함수
let toastFunctions: ToastContextType | undefined = undefined;

// 토스트 컨텍스트 생성
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// 토스트 훅
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// 안전한 토스트 함수 - React 훅 컨텍스트 외부에서도 사용 가능
export function toast(props: ToastProps) {
  // 컨텍스트가 설정되어 있으면 사용, 아니면 콘솔 로그
  if (toastFunctions) {
    toastFunctions.addToast(props);
  } else {
    console.error('Toast error: ToastProvider not initialized');
    console.log('Toast would show:', props.title, props.description);
  }
}

// 토스트 아이콘 컴포넌트
function ToastIcon({
  variant,
}: {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
}) {
  if (variant === 'destructive') {
    return <AlertCircle className='h-5 w-5' />;
  }
  if (variant === 'success') {
    return <CheckCircle className='h-5 w-5' />;
  }
  if (variant === 'info') {
    return <InfoIcon className='h-5 w-5' />;
  }
  return null;
}

// 토스트 컴포넌트
export function Toast({
  variant,
  title,
  description,
  onClose,
}: ToastProps & { onClose: () => void }) {
  return (
    <div className={cn(toastVariants({ variant }))}>
      <div className='flex items-start gap-3'>
        {variant && <ToastIcon variant={variant} />}
        <div className='flex-1'>
          {title && <div className='font-semibold'>{title}</div>}
          {description && (
            <div className='text-sm opacity-90'>{description}</div>
          )}
        </div>
      </div>
      <button
        onClick={onClose}
        className='ml-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-sm'
        aria-label='Close toast'
      >
        <X className='h-4 w-4' />
      </button>
    </div>
  );
}

// 토스트 프로바이더
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

  const addToast = (toast: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);

    // 자동 제거 타이머 설정
    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // 전역 토스트 함수 설정
  React.useEffect(() => {
    toastFunctions = { toasts, addToast, removeToast };
    return () => {
      toastFunctions = undefined;
    };
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className='fixed bottom-4 right-4 z-50 flex flex-col gap-2'>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
