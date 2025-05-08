'use client';

import Link from 'next/link';
import { Edit, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className='flex items-center justify-between border-b p-4'>
      <div className='flex items-center'>
        <button onClick={onMenuClick} className='mr-3 p-1 lg:hidden'>
          <Menu className='h-6 w-6' />
        </button>
        <Link href='/' className='flex items-center'>
          <span className='mr-1 text-red-500'>•</span>
          <span className='text-lg font-bold'>Run to the Father</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='ml-1 h-4 w-4'
          >
            <path d='m6 9 6 6 6-6' />
          </svg>
        </Link>
      </div>

      <div className='flex items-center gap-2'>
        <button className='p-1'>
          <Edit className='h-6 w-6' />
        </button>
        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-purple-700 text-white'>
          U
        </div>
      </div>
    </header>
  );
}
