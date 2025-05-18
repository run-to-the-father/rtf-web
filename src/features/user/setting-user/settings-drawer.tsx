'use client';

import { useState } from 'react';
import { ChevronRight, Gift, Paintbrush, User, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui/drawer';
import type { UserData } from '@entities/user/ui/avatar-dropdown';
import { AccountSettings } from './account-settings';
import { SubscriptionSettings } from './subscription-settings';

type SettingsTab = 'main' | 'account' | 'appearance' | 'subscription';

interface SettingsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserData;
  children?: React.ReactNode;
}

export const SettingsDrawer = ({
  isOpen,
  onOpenChange,
  userData,
  children,
}: SettingsDrawerProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('main');

  const handleClose = () => {
    onOpenChange(false);
    // 닫힌 후 약간의 지연을 주고 메인 탭으로 리셋
    setTimeout(() => setActiveTab('main'), 300);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <AccountSettings
            userData={userData}
            onBack={() => setActiveTab('main')}
          />
        );
      case 'subscription':
        return <SubscriptionSettings onBack={() => setActiveTab('main')} />;
      default:
        return (
          <div className='space-y-4'>
            <div
              className='flex cursor-pointer items-center justify-between rounded-md p-4 hover:bg-gray-50'
              onClick={() => setActiveTab('account')}
            >
              <div className='flex items-center gap-3'>
                <User className='h-5 w-5 text-black' />
                <span className='text-base text-black'>Account</span>
              </div>
              <ChevronRight className='h-5 w-5 text-black' />
            </div>

            <div
              className='flex cursor-pointer items-center justify-between rounded-md p-4 hover:bg-gray-50'
              onClick={() => setActiveTab('subscription')}
            >
              <div className='flex items-center gap-3'>
                <Gift className='h-5 w-5 text-black' />
                <span className='text-base text-black'>Subscription</span>
              </div>
              <ChevronRight className='h-5 w-5 text-black' />
            </div>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'account':
        return 'Account';
      case 'subscription':
        return 'Subscription';
      default:
        return 'Settings';
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction='bottom'>
      {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}

      <DrawerContent className='h-[calc(100vh-56px)] rounded-t-32pxr bg-white'>
        <DrawerHeader>
          <div className='flex items-center justify-between'>
            <div className='h-5 w-5'></div> {/* 왼쪽 여백 */}
            <DrawerTitle className='text-black title-l-500'>
              {getTitle()}
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant='ghost' size='icon' onClick={handleClose}>
                <X className='h-5 w-5 text-black' />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className='overflow-y-auto p-4'>{renderContent()}</div>

        {activeTab !== 'main' && (
          <DrawerFooter className='border-t'>
            <Button
              variant='ghost'
              className='w-full text-black'
              onClick={() => setActiveTab('main')}
            >
              Back to settings
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
