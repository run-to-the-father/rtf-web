'use client';

import { useState } from 'react';
import { ArrowUp } from 'lucide-react';

export function ChatInput() {
  const [mode, setMode] = useState('Surrender');

  return (
    <div className='relative w-full rounded-lg border p-4'>
      <div className='mb-2 text-sm font-medium'>Message Run to the Father</div>
      <div className='flex items-center'>
        <input
          type='text'
          className='flex-1 bg-transparent outline-none'
          placeholder='Type your message here...'
        />
        <div className='flex items-center gap-2'>
          <div className='relative'>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className='appearance-none rounded-full border px-4 py-1 pr-8 text-sm'
            >
              <option value='Surrender'>Surrender</option>
              <option value='Bible'>Bible</option>
            </select>
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
              className='absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2'
            >
              <path d='m6 9 6 6 6-6' />
            </svg>
          </div>
          <button className='flex h-8 w-8 items-center justify-center rounded-full bg-black text-white'>
            <ArrowUp className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
}
