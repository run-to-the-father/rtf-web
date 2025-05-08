import { Edit, Plus, Search, Trash } from 'lucide-react';
import { cn } from '@shared/lib/utils';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn('flex flex-col bg-white', className)}>
      <div className='p-4'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
          <input
            type='text'
            placeholder='Search...'
            className='w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500'
          />
        </div>
      </div>

      <button className='mx-4 flex items-center gap-2 rounded-md border border-gray-300 p-2 text-sm hover:bg-gray-100'>
        <Plus className='h-4 w-4' />
        Create New Chat
      </button>

      <div className='mt-4 flex-1 overflow-auto'>
        <div className='px-4 py-2'>
          <h3 className='mb-2 text-xs font-medium text-gray-500'>Today</h3>
          <ConversationItem title='New conversation' isActive />
          <ConversationItem title='이게 뭐냐 갑자기 일어난 container문제' />
          <ConversationItem title='FE 247 px * 20 px 이게 최대 크기인가요?' />
        </div>

        <div className='px-4 py-2'>
          <h3 className='mb-2 text-xs font-medium text-gray-500'>Yesterday</h3>
          <ConversationItem title='FE 247 px * 20 px 이게 최대 크기인가요?' />
          <ConversationItem title='일본 관광상품 추가 정보 필요' />
        </div>

        <div className='px-4 py-2'>
          <h3 className='mb-2 text-xs font-medium text-gray-500'>
            Previous 7 Days
          </h3>
          <ConversationItem title='일본 관광상품 추가 정보 필요' />
          <ConversationItem title='일본 관광상품 추가 정보 필요' />
          <ConversationItem title='일본 관광상품 추가 정보 필요' />
        </div>

        <div className='px-4 py-2'>
          <h3 className='mb-2 text-xs font-medium text-gray-500'>
            Previous 30 Days
          </h3>
          <ConversationItem title='일본 관광상품 추가 정보 필요' />
          <ConversationItem title='일본 관광상품 추가 정보 필요' />
          <ConversationItem title='일본 관광상품 추가 정보 필요' />
          <ConversationItem title='일본 관광상품 추가 정보 필요' />
          <ConversationItem title='일본 관광상품 추가 정보 필요' />
        </div>
      </div>
    </aside>
  );
}

interface ConversationItemProps {
  title: string;
  isActive?: boolean;
}

function ConversationItem({ title, isActive }: ConversationItemProps) {
  return (
    <div
      className={cn(
        'mb-1 flex items-center justify-between rounded-md p-2',
        isActive ? 'bg-gray-100' : 'hover:bg-gray-100',
      )}
    >
      <span className='truncate text-sm'>{title}</span>
      <div className='flex items-center gap-1'>
        <button className='p-1 text-gray-500 hover:text-gray-700'>
          <Edit className='h-4 w-4' />
        </button>
        <button className='p-1 text-gray-500 hover:text-gray-700'>
          <Trash className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
}
