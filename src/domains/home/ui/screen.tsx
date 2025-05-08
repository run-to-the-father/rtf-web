'use client';

import { useState } from 'react';
import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/sidebar';
import { ChatInput } from '@/features/chat';
import { ModeSelection } from '@/features/select-mode';
import { useMediaQuery } from '@shared/hooks';
import { BibleVerse } from './bible-vers';

export function HomeScreen() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* 사이드바 - 데스크톱에서만 기본적으로 표시 */}
      {isDesktop && <Sidebar className='w-64 border-r' />}

      {/* 모바일 사이드바 - 토글 시 표시 */}
      {!isDesktop && isSidebarOpen && (
        <div className='fixed inset-0 z-50 bg-white'>
          <div className='flex h-full flex-col'>
            <div className='flex items-center justify-between border-b p-4'>
              <h2 className='text-lg font-medium'>Run to the Father</h2>
              <button onClick={toggleSidebar} className='p-2'>
                ✕
              </button>
            </div>
            <Sidebar className='flex-1' />
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className='flex flex-1 flex-col'>
        <Header onMenuClick={toggleSidebar} />

        <main className='flex flex-1 flex-col items-center justify-center p-4 md:p-6'>
          <div className='w-full max-w-3xl'>
            <div className='mb-8 flex flex-col items-center justify-center'>
              <ModeSelection />

              <div className='mt-8 w-full'>
                <ChatInput />
              </div>

              <div className='mt-8 w-full text-center'>
                <BibleVerse />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
