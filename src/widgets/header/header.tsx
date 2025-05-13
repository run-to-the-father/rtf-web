'use client';

import type React from 'react';
import { ChevronDown, PenSquare } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { AvatarDropdown } from '@entities/user/ui/avatar-dropdown';

interface HeaderProps {
  sidebarTrigger: React.ReactNode;
}

export const Header = ({ sidebarTrigger }: HeaderProps) => {
  // 임시 사용자 데이터 (실제 구현에서는 상태 관리 또는 서버에서 가져옴)
  const userData = {
    name: 'Run to the Father',
    email: 'runtothefather@gmail.com',
    avatarFallback: 'U',
  };

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
