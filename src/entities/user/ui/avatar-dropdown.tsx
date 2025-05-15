'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, PenSquare, Settings } from 'lucide-react';
import { SettingsDrawer } from '@/features/user/setting-user/settings-drawer';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

export interface UserData {
  name: string;
  email: string;
  avatarFallback: string;
}

interface AvatarDropdownProps {
  userData: UserData;
}

export const AvatarDropdown = ({ userData }: AvatarDropdownProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    setIsSettingsOpen(open);
  };

  const handleUpgradePlan = () => {
    router.push('/upgrade-plan');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarFallback className='bg-purple-600 text-white'>
                {userData.avatarFallback}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[200px]'>
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
          <DropdownMenuItem className='flex cursor-pointer items-center gap-2'>
            <LogOut className='h-4 w-4' />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Settings Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onOpenChange={handleOpenChange}
        userData={userData}
      />
    </>
  );
};
