'use client';

import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ChatInputBox } from '@features/chat/input/input-box';
import { ChatModeSelect } from '@features/chat/mode-select/mode-select';
import { Button } from '@shared/components/button';
import { ScriptureFooter } from '@widgets/footer/scripture-footer';
import { Header } from '@widgets/header/header';
import { Sidebar } from '@widgets/sidebar/sidebar';

export function HomeContainer() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    setIsInitialRender(false);
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const sidebarTrigger = (
    <Button
      variant='ghost'
      size='icon'
      onClick={toggleSidebar}
      aria-label='사이드바 메뉴 열기'
      aria-expanded={sidebarOpen}
    >
      <Menu className='h-5 w-5' />
    </Button>
  );

  return (
    <div className='bg-background flex min-h-screen w-full flex-col overflow-hidden'>
      {/* 헤더 */}
      <Header sidebarTrigger={sidebarTrigger} />

      {/* 모바일 오버레이 */}
      {sidebarOpen && isMobile && (
        <div
          className='fixed inset-0 z-10 bg-black/50 transition-opacity'
          onClick={toggleSidebar}
          aria-hidden='true'
        />
      )}

      <div className='relative flex flex-1 pt-[56px]'>
        {/* 모바일용 사이드바 (오버레이 형태) */}
        {isMobile && (
          <aside
            className={cn(
              'fixed left-0 top-56pxr z-20 h-[calc(100vh-56px)] w-280pxr -translate-x-full border-r bg-white',
              'transition-all duration-300 ease-in-out',
              !isInitialRender && sidebarOpen
                ? 'animate-slide-in-left translate-x-0'
                : !isInitialRender && !sidebarOpen
                  ? 'animate-slide-out-left -translate-x-full'
                  : '',
            )}
          >
            <div className='h-full w-full'>
              <Sidebar />
            </div>
          </aside>
        )}

        {/* 데스크탑용 사이드바 (푸시 형태) */}
        {!isMobile && (
          <aside
            className={cn(
              'relative z-20 h-full overflow-hidden border-r bg-white',
              'transition-all duration-300 ease-in-out',
              sidebarOpen ? 'w-320pxr min-w-320pxr' : 'w-0 min-w-0',
            )}
          >
            <div className='h-full w-320pxr'>
              <Sidebar />
            </div>
          </aside>
        )}

        {/* 메인 콘텐츠 */}
        <main className='flex-1 overflow-auto'>
          <div className='flex h-full flex-col'>
            <div className='flex flex-1 items-center justify-center p-4'>
              <div className='w-full space-y-8'>
                <ChatModeSelect />
                <ChatInputBox />
                <ScriptureFooter />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
