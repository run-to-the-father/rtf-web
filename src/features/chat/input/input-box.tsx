'use client';

import type React from 'react';
import { useState } from 'react';
import { ArrowUp, ChevronDown } from 'lucide-react';
import { useChatStore } from '@/entities/chat/models/store';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Textarea } from '@/shared/ui/textarea';

export const ChatInputBox = () => {
  const [message, setMessage] = useState('');
  const { mode, setMode } = useChatStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    console.log('Sending message:', message, 'Mode:', mode);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='mx-auto max-w-2xl'>
      <div className='shadow-sm relative rounded-xl border bg-white'>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Message Run to the Father'
          className='h-138pxr min-h-[60px] resize-none border-0 p-4 focus-visible:ring-0'
        />
        <div className='absolute bottom-2 right-2 flex items-center gap-1'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='shadow-sm h-8 rounded-full px-3 text-sm font-medium'
              >
                {mode === 'surrender' ? 'Surrender' : 'Bible'}
                <ChevronDown className='ml-1 h-3 w-3' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => setMode('surrender')}>
                Surrender
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMode('bible')}>
                Bible
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            type='submit'
            size='icon'
            className='shadow-sm h-8 w-8 rounded-full bg-black'
          >
            <ArrowUp className='h-4 w-4 text-white' />
          </Button>
        </div>
      </div>
    </form>
  );
};
