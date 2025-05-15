import { ExternalLink, MoreHorizontal, Plus, X } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';

export function PaymentMethods() {
  return (
    <div className='flex w-full flex-col gap-y-20pxr py-12pxr'>
      <h2 className='font-300 text-lg'>PAYMENT METHODS</h2>
      <div className='h-1pxr bg-gray-200' />

      <div className='flex flex-col gap-y-12pxr'>
        {/* Visa Card */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <div className='mr-4 flex h-12 w-16 items-center justify-center rounded bg-blue-800'>
              <span className='font-bold text-white'>VISA</span>
            </div>
            <div className='flex flex-col'>
              <div className='flex items-center'>
                <span className='font-medium'>Visa</span>
                <span className='ml-2 text-gray-500'>•••• 2592</span>
              </div>
              <span className='text-sm text-gray-500'>Expires 11/2028</span>
            </div>
          </div>
          <div className='flex items-center'>
            <Badge
              variant='outline'
              className='mr-3 rounded-md bg-gray-100 text-gray-500'
            >
              Default
            </Badge>
            <Button variant='ghost' size='icon' className='h-8 w-8'>
              <X className='h-5 w-5' />
            </Button>
          </div>
        </div>

        {/* First Mastercard */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <div className='mr-4 flex h-12 w-16 items-center justify-center rounded bg-black'>
              <div className='flex'>
                <div className='mr-[-0.5rem] h-6 w-6 rounded-full bg-red-500'></div>
                <div className='h-6 w-6 rounded-full bg-yellow-500'></div>
              </div>
            </div>
            <div className='flex flex-col'>
              <div className='flex items-center'>
                <span className='font-medium'>Mastercard</span>
                <span className='ml-2 text-gray-500'>•••• 4980</span>
              </div>
              <div className='flex items-center text-sm text-gray-400'>
                <ExternalLink className='mr-1 h-3 w-3' />
                <span>link</span>
              </div>
            </div>
          </div>
          <Button variant='ghost' size='icon' className='h-8 w-8'>
            <MoreHorizontal className='h-5 w-5' />
          </Button>
        </div>

        {/* Second Mastercard */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <div className='mr-4 flex h-12 w-16 items-center justify-center rounded bg-black'>
              <div className='flex'>
                <div className='mr-[-0.5rem] h-6 w-6 rounded-full bg-red-500'></div>
                <div className='h-6 w-6 rounded-full bg-yellow-500'></div>
              </div>
            </div>
            <div className='flex flex-col'>
              <div className='flex items-center'>
                <span className='font-medium'>Mastercard</span>
                <span className='ml-2 text-gray-500'>•••• 4980</span>
              </div>
              <div className='flex items-center text-sm text-gray-400'>
                <ExternalLink className='mr-1 h-3 w-3' />
                <span>link</span>
              </div>
            </div>
          </div>
          <Button variant='ghost' size='icon' className='h-8 w-8'>
            <MoreHorizontal className='h-5 w-5' />
          </Button>
        </div>

        {/* Add payment method button */}
        <Button
          variant='ghost'
          className='mt-12pxr flex w-fit items-center pl-0 text-base'
        >
          <Plus className='mr-2 h-5 w-5' />
          Add payment method
        </Button>
      </div>
    </div>
  );
}
