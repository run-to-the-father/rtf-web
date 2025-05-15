'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface PaymentNavigationProps {
  onReturn?: () => void;
}

export function PaymentNavigation({ onReturn }: PaymentNavigationProps) {
  return (
    <div className='flex flex-col bg-black text-white md:h-screen md:w-[40%] md:max-w-[320px]'>
      {/* 태블릿 이상에서 보이는 헬프 섹션 */}
      <div className='hidden flex-col gap-4 px-6 py-12 md:flex'>
        <div>
          <h2 className='text-xl font-semibold'>Need help?</h2>
          <p className='mt-2'>Email runtothefather@gmail.com</p>
        </div>

        <div className='mt-auto'>
          {onReturn ? (
            <Button
              variant='ghost'
              className='flex items-center gap-2 text-white hover:bg-white/10'
              onClick={onReturn}
            >
              <ArrowLeft className='h-4 w-4' />
              Return to run to the father
            </Button>
          ) : (
            <Link href='/'>
              <Button
                variant='ghost'
                className='flex items-center gap-2 text-white hover:bg-white/10'
              >
                <ArrowLeft className='h-4 w-4' />
                Return to run to the father
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* 모바일에서 보이는 돌아가기 버튼 */}
      <div className='mt-auto p-4 md:hidden'>
        {onReturn ? (
          <Button
            variant='ghost'
            className='flex items-center gap-2 text-white hover:bg-white/10'
            onClick={onReturn}
          >
            <ArrowLeft className='h-4 w-4' />
            Return to run to the father
          </Button>
        ) : (
          <Link href='/'>
            <Button
              variant='ghost'
              className='flex items-center gap-2 text-white hover:bg-white/10'
            >
              <ArrowLeft className='h-4 w-4' />
              Return to run to the father
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

// 하위 호환성을 위해 PaymentSidebar 내보내기
export const PaymentSidebar = PaymentNavigation;
