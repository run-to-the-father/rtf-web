'use client';

import { useState } from 'react';
import { Check, Globe } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import type { UserData } from '@entities/user/ui/avatar-dropdown';
import { EditNameDrawer } from './edit-name-drawer';

interface AccountSettingsProps {
  userData: UserData;
  onBack: () => void;
}

export const AccountSettings = ({ userData, onBack }: AccountSettingsProps) => {
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: userData.name,
    email: userData.email,
    avatarFallback: userData.avatarFallback,
  });

  const handleSaveName = (firstName: string, lastName: string) => {
    // 실제 구현에서는 여기서 API 호출을 통해 데이터를 저장합니다
    setUserInfo((prev) => ({
      ...prev,
      name: `${firstName} ${lastName}`,
    }));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className='space-y-6'>
      {showSuccess && (
        <div className='flex items-center gap-2 rounded-md bg-green-50 p-2 text-green-700'>
          <Check className='h-5 w-5' />
          <span>Name updated successfully</span>
        </div>
      )}

      <div className='flex items-center space-x-4'>
        <Avatar className='h-12 w-12'>
          <AvatarFallback className='bg-purple-600 text-white'>
            {userInfo.avatarFallback}
          </AvatarFallback>
        </Avatar>

        <div className='flex-1'>
          <h3 className='font-medium'>{userInfo.name}</h3>
          <p className='text-sm text-gray-500'>{userInfo.email}</p>
        </div>

        <Button
          variant='outline'
          className='h-8'
          onClick={() => setIsEditNameOpen(true)}
        >
          Edit
        </Button>
      </div>

      {/* 이름 편집 Drawer */}
      <EditNameDrawer
        isOpen={isEditNameOpen}
        onOpenChange={setIsEditNameOpen}
        userData={userData}
        onSave={handleSaveName}
      />
    </div>
  );
};
