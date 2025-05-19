'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, LogOut, PenSquare, Settings } from 'lucide-react';
import { SettingsDrawer } from '@/features/user/setting-user/settings-drawer';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { toast } from '@/shared/ui/toast';
import { useAuthContext } from '@/application/provider/user-provider';
import { useUserStore } from '../store/user-store';

export interface UserData {
  name: string;
  email: string;
  avatarFallback: string;
}

interface AvatarDropdownProps {
  userData?: UserData;
}

export const AvatarDropdown = ({ userData }: AvatarDropdownProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, clearUser } = useUserStore();
  const { isLoading } = useAuthContext();

  const handleOpenChange = (open: boolean) => {
    setIsSettingsOpen(open);
  };

  const handleUpgradePlan = () => {
    router.push('/upgrade-plan');
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);

      // 로그아웃 API 호출
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || '로그아웃 중 오류가 발생했습니다.',
        );
      }

      // 로컬 상태 초기화
      clearUser();

      // 로그인 페이지로 리디렉션
      router.push('/sign-in');
    } catch (error: any) {
      console.error('로그아웃 오류:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  // 사용자 이름 또는 이메일에서 이니셜 생성
  const getInitials = (): string => {
    if (user?.nickname) {
      return user.nickname.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    if (userData?.name) {
      return userData.name.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // 실제 표시할 사용자 이름
  const displayName =
    user?.nickname ||
    user?.email ||
    userData?.name ||
    userData?.email ||
    'User';

  // 로딩 중이거나 로그아웃 중일 때 스켈레톤 표시
  if (isLoading || isSigningOut) {
    return (
      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-200'>
        <Loader2 className='h-4 w-4 animate-spin text-gray-400' />
      </div>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='rounded-full'>
            <Avatar className='h-8 w-8'>
              {user?.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={displayName} />
              ) : (
                <AvatarFallback className='bg-purple-600 text-white'>
                  {getInitials()}
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[200px]'>
          <div className='px-2 py-1.5 text-sm font-medium'>{displayName}</div>
          <div className='text-muted-foreground px-2 pb-1.5 text-xs'>
            {user?.email || userData?.email || ''}
          </div>
          <DropdownMenuItem
            className='flex cursor-pointer items-center gap-2'
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className='h-4 w-4' />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='flex cursor-pointer items-center gap-2'
            onClick={handleUpgradePlan}
          >
            <PenSquare className='h-4 w-4' />
            <span>Upgrade Plan</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='flex cursor-pointer items-center gap-2 text-red-500'
            onClick={handleSignOut}
          >
            <LogOut className='h-4 w-4' />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Settings Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onOpenChange={handleOpenChange}
        userData={{
          name: displayName,
          email: user?.email || userData?.email || '',
          avatarFallback: getInitials(),
        }}
      />
    </>
  );
};
