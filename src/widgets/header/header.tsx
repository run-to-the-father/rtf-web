'use client';

import Link from 'next/link';
import type React from 'react';
import { ChevronDown, LogIn, PenSquare } from 'lucide-react';
import { useAuth } from '@/entities/user/hooks/useAuth';
import { useUserStore } from '@/entities/user/store/user-store';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { AvatarDropdown } from '@entities/user/ui/avatar-dropdown';

interface HeaderProps {
  sidebarTrigger: React.ReactNode;
}

export const Header = ({ sidebarTrigger }: HeaderProps) => {
  // useAuth에서 인증 상태와 로딩 상태만 가져오기
  const { isAuthenticated, isLoading } = useAuth();
  const { user } = useUserStore();

  // 로그인된 사용자 정보로 userData 구성
  const userData = user
    ? {
        name: user.nickname || user.email,
        email: user.email,
        avatarFallback: getInitials(user),
      }
    : null;

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

        {isLoading ? (
          // 로딩 상태일 때 스켈레톤 UI 표시
          <Skeleton className='h-8 w-8 rounded-full' />
        ) : isAuthenticated && userData ? (
          // 인증된 상태일 때 아바타 드롭다운 표시
          <AvatarDropdown userData={userData} />
        ) : (
          // 인증되지 않은 상태일 때 로그인 버튼 표시
          <Button variant='outline' size='sm' asChild>
            <Link href='/sign-in'>
              <LogIn className='mr-2 h-4 w-4' />
              Sign In
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
};
