'use client';

import { BookOpenText, Gift } from 'lucide-react';
import { type ChatMode, useChatStore } from '@/entities/chat/models/store';
import { cn } from '@/shared/lib/utils';
import { Card, CardContent } from '@/shared/ui/card';

export const ChatModeSelect = () => {
  const { mode, setMode } = useChatStore();

  const handleModeSelect = (selectedMode: ChatMode) => {
    setMode(selectedMode);
  };

  return (
    <div className='mx-auto flex flex-wrap justify-center gap-8pxr'>
      <Card
        className={cn(
          'hover:shadow-md h-124pxr w-160pxr cursor-pointer rounded-16pxr border py-14pxr transition-all',
          mode === 'surrender' && 'ring-2 ring-primary',
        )}
        onClick={() => handleModeSelect('surrender')}
      >
        <CardContent className='flex h-full flex-col gap-y-8pxr px-14pxr'>
          <div className='flex items-center gap-x-10pxr'>
            <Gift className='h-24pxr w-24pxr' />
            <h3 className='text-base font-semibold'>Surrender</h3>
          </div>
          <p className='text-xs text-[#676767]'>
            Solving My Problems and Struggles Through God's Will
          </p>
        </CardContent>
      </Card>

      <Card
        className={cn(
          'hover:shadow-md h-124pxr w-160pxr cursor-pointer rounded-16pxr border py-14pxr transition-all',
          mode === 'bible' && 'ring-2 ring-primary',
        )}
        onClick={() => handleModeSelect('bible')}
      >
        <CardContent className='flex h-full flex-col gap-y-8pxr px-14pxr'>
          <div className='flex items-center gap-x-10pxr'>
            <BookOpenText className='h-24pxr w-24pxr' />
            <h3 className='text-base font-semibold'>Bible</h3>
          </div>
          <p className='text-xs text-[#676767]'>
            Discovering God's Will in the Bible
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
