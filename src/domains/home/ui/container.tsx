'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { useUserStore } from '@/entities/user';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Drawer, DrawerContent, DrawerHeader } from '@/shared/ui/drawer';
import { ChatInputBox } from '@features/chat/input/input-box';
import { ChatModeSelect } from '@features/chat/mode-select/mode-select';
import { ScriptureFooter } from '@widgets/footer/scripture-footer';
import { Header } from '@widgets/header/header';
import { Sidebar } from '@widgets/sidebar/sidebar';

export function HomeContainer() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    setIsInitialRender(false);
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const loginSuccess = searchParams.get('login');
    if (loginSuccess === 'success') {
      console.log('로그인 성공 파라미터 감지됨', {
        timestamp: searchParams.get('t'),
        isAuthenticated,
        userExists: !!user,
      });
    }
  }, [searchParams, isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('홈 페이지: 인증되지 않음, 로그인 페이지로 리디렉트');
      router.push('/sign-in');
    } else {
      console.log('홈 페이지: 인증됨', { user });
    }
  }, [isAuthenticated, router, user]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const sidebarTrigger = (
    <Button
      variant='ghost'
      size='icon'
      onClick={toggleSidebar}
      aria-label='Open Sidebar'
      aria-expanded={sidebarOpen}
    >
      <Menu className='h-5 w-5' />
    </Button>
  );

  return (
    <div className='bg-background flex min-h-screen w-full flex-col overflow-hidden'>
      {/* 헤더 */}
      <Header sidebarTrigger={sidebarTrigger} />

      <div className='relative flex flex-1 pt-[56px]'>
        {/* 모바일용 사이드바 (Drawer 형태) */}
        {isMobile && (
          <Drawer
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
            direction='left'
          >
            <DrawerHeader className='p-0' />

            <DrawerContent
              disableOverlay
              className='mt-56pxr w-280pxr rounded-none border-r bg-white'
            >
              <div className='h-full w-full'>
                <Sidebar />
              </div>
            </DrawerContent>
          </Drawer>
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
          <div className='flex h-full flex-col items-center justify-center'>
            <div className='w-full max-w-[768px] px-4 md:px-6 lg:px-8'>
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
