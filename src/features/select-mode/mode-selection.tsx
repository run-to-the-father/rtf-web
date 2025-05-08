import { Book, Gift } from 'lucide-react';

export function ModeSelection() {
  return (
    <div className='grid w-full max-w-lg grid-cols-1 gap-4 md:grid-cols-2'>
      <div className='hover:shadow-md cursor-pointer rounded-lg border p-4 transition-shadow'>
        <div className='mb-2 flex items-center'>
          <Gift className='mr-2 h-5 w-5' />
          <span className='font-medium'>Surrender</span>
        </div>
        <p className='text-sm text-gray-600'>
          Solving My Problems and Struggles Through God's Will
        </p>
      </div>

      <div className='hover:shadow-md cursor-pointer rounded-lg border p-4 transition-shadow'>
        <div className='mb-2 flex items-center'>
          <Book className='mr-2 h-5 w-5' />
          <span className='font-medium'>Bible</span>
        </div>
        <p className='text-sm text-gray-600'>
          Discovering God's Will in the Bible
        </p>
      </div>
    </div>
  );
}
