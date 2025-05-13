'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
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
import { Input } from '@/shared/ui/input';
import type { UserData } from '@entities/user/ui/avatar-dropdown';

interface EditNameDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserData;
  onSave: (firstName: string, lastName: string) => void;
  children?: React.ReactNode;
}

export const EditNameDrawer = ({
  isOpen,
  onOpenChange,
  userData,
  onSave,
  children,
}: EditNameDrawerProps) => {
  const [firstName, setFirstName] = useState('tothefather');
  const [lastName, setLastName] = useState('tothefather');

  const handleSave = () => {
    onSave(firstName, lastName);
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction='bottom'>
      {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}

      <DrawerContent className='h-[40vh] rounded-t-32pxr bg-white'>
        <DrawerHeader className='border-b'>
          <div className='flex items-center justify-between'>
            <div className='h-5 w-5'></div> {/* 왼쪽 여백 */}
            <DrawerTitle className='title-l-500 text-black'>
              Edit name
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant='ghost' size='icon' onClick={handleClose}>
                <X className='h-5 w-5 text-black' />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className='p-4'>
          <div className='space-y-6'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label
                  htmlFor='firstName'
                  className='text-sm font-medium text-black'
                >
                  First name
                </label>
                <Input
                  id='firstName'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className='bg-secondary w-full'
                />
              </div>

              <div className='space-y-2'>
                <label
                  htmlFor='lastName'
                  className='text-sm font-medium text-black'
                >
                  Last name
                </label>
                <Input
                  id='lastName'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className='bg-secondary w-full'
                />
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter className='border-t px-4 py-4'>
          <div className='flex justify-end space-x-2'>
            <Button
              variant='outline'
              className='h-40pxr w-65pxr rounded-full'
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className='h-40pxr w-65pxr rounded-full bg-black'
            >
              Save
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
