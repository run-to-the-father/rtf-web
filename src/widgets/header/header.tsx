'use client';

import type React from 'react';
import { ChevronDown, PenSquare } from 'lucide-react';
import { Avatar, AvatarFallback } from '@shared/components/avatar';
import { Button } from '@shared/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/components/dropdown-menu';

interface HeaderProps {
  sidebarTrigger: React.ReactNode;
}

export const Header = ({ sidebarTrigger }: HeaderProps) => {
  return (
    <header className='fixed left-0 top-0 z-30 flex h-14 w-full items-center justify-between border-b bg-white px-3 py-2'>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='rounded-full'>
              <Avatar className='h-8 w-8'>
                <AvatarFallback className='bg-purple-600 text-white'>
                  {}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
