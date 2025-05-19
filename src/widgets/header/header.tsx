'use client';

import type React from 'react';
import { ChevronDown, PenSquare } from 'lucide-react';
import { useAuth } from '@/entities/user/hooks/useAuth';
import { useUserStore } from '@/entities/user/store/user-store';
import { Button } from '@/shared/ui/button';
import { AvatarDropdown } from '@entities/user/ui/avatar-dropdown';

interface HeaderProps {
  sidebarTrigger: React.ReactNode;
}

export const Header = ({ sidebarTrigger }: HeaderProps) => {
  // useAuth 훅을 사용하여 사용자 정보 가져오기 (로딩 상태는 AvatarDropdown에서 처리)
  const { user } = useAuth();

  // 로그인된 사용자가 없을 경우 기본값 (개발 및 디자인 테스트용)
  const fallbackUserData = {
    name: 'Run to the Father',
    email: 'runtothefather@gmail.com',
    avatarFallback: 'RT',
  };

  // 로그인된 사용자 정보로 userData 구성
  const userData = user
    ? {
        name: user.nickname || user.email,
        email: user.email,
        avatarFallback: getInitials(user),
      }
    : fallbackUserData;

  // 이니셜 생성 함수
  function getInitials(user: { nickname?: string; email: string }): string {
    if (user.nickname) {
      return user.nickname.substring(0, 2).toUpperCase();
    }
    return user.email.substring(0, 2).toUpperCase();
  }

  return (
    <header className='fixed left-0 top-0 z-30 flex h-14 w-full items-center justify-between bg-white px-3 py-2'>
      <div className='flex items-center gap-2'>
        {sidebarTrigger}
        <div className='flex items-center gap-1'>
          <span className='text-lg font-semibold text-red-600'>•</span>
          <h1 className='text-lg font-semibold'>Run to the Father</h1>
          <ChevronDown className='h-4 w-4' />
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='icon'>
          <PenSquare className='h-5 w-5' />
        </Button>
        <AvatarDropdown userData={userData} />
      </div>
    </header>
  );
};
