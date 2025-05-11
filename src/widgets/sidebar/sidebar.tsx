'use client';

import { Edit, PenSquare, Search, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

interface ChatItem {
  id: string;
  title: string;
  isActive?: boolean;
  date: string;
}

interface ChatGroup {
  title: string;
  items: ChatItem[];
}

// 샘플 데이터
const chatGroups: ChatGroup[] = [
  {
    title: 'Today',
    items: [
      { id: '1', title: 'New conversation', isActive: true, date: 'Today' },
      {
        id: '2',
        title: '이게 최대 글자수 입니다 Fill container로',
        date: 'Today',
      },
      {
        id: '3',
        title: 'Fill 247 px * 20 px 아래 최대 글자수입니다',
        date: 'Today',
      },
    ],
  },
  {
    title: 'Yesterday',
    items: [
      {
        id: '4',
        title: 'Fill 247 px * 20 px 아래 최대 글자수입니다',
        date: 'Yesterday',
      },
      { id: '5', title: '질문 완전상세 추가 정보 필요', date: 'Yesterday' },
    ],
  },
  {
    title: 'Previous 7 Days',
    items: [
      { id: '6', title: '질문 완전상세 추가 정보 필요', date: '3 days ago' },
      { id: '7', title: '질문 완전상세 추가 정보 필요', date: '4 days ago' },
      { id: '8', title: '질문 완전상세 추가 정보 필요', date: '5 days ago' },
    ],
  },
  {
    title: 'Previous 30 Days',
    items: [
      { id: '9', title: '질문 완전상세 추가 정보 필요', date: '10 days ago' },
      { id: '10', title: '질문 완전상세 추가 정보 필요', date: '15 days ago' },
      { id: '11', title: '질문 완전상세 추가 정보 필요', date: '20 days ago' },
      { id: '12', title: '질문 완전상세 추가 정보 필요', date: '25 days ago' },
      { id: '13', title: '질문 완전상세 추가 정보 필요', date: '30 days ago' },
    ],
  },
];

export const Sidebar = () => {
  return (
    <nav className='flex h-full w-full flex-col bg-white'>
      {/* 검색 헤더 */}
      <div className='border-b p-3'>
        <div className='relative'>
          <Input
            type='search'
            placeholder='Search...'
            className='h-9 w-full pl-8'
          />
          <Search
            className='text-muted-foreground absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2'
            aria-hidden='true'
          />
        </div>
        <Button
          className='mt-2 flex w-full items-center justify-start gap-2'
          variant='ghost'
        >
          <PenSquare className='h-4 w-4' />
          <span>Create New Chat</span>
        </Button>
      </div>

      {/* 대화 목록 */}
      <div className='flex-1 overflow-y-auto p-1'>
        {chatGroups.map((group) => (
          <div key={group.title} className='mb-2'>
            <h3 className='rounded-md bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500'>
              {group.title}
            </h3>
            <ul className='mt-1'>
              {group.items.map((item) => (
                <li key={item.id} className='group relative'>
                  <button
                    className={`flex w-full items-center rounded-md px-3 py-2 text-xs ${
                      item.isActive
                        ? 'bg-gray-100 font-medium text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className='truncate'>{item.title}</span>
                  </button>
                  <div className='absolute right-2 top-1/2 flex -translate-y-1/2 opacity-0 group-hover:opacity-100'>
                    <button
                      className='rounded-md p-1 hover:bg-gray-200'
                      title='수정'
                      aria-label='대화 제목 편집하기'
                    >
                      <Edit className='h-4 w-4 text-gray-500' />
                    </button>
                    <button
                      className='rounded-md p-1 hover:bg-gray-200'
                      title='삭제'
                      aria-label='대화 삭제하기'
                    >
                      <Trash2 className='h-4 w-4 text-gray-500' />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
};
