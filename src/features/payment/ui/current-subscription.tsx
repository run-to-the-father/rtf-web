import { ChevronDown, PenSquare } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';

export function CurrentSubscription() {
  return (
    <div className='flex w-full flex-col gap-y-20pxr py-12pxr'>
      <h2 className='font-300 text-lg'>CURRENT SUBSCRIPTION</h2>
      <div className='h-1pxr bg-gray-200' />

      <div className='flex flex-col gap-y-12pxr'>
        <h3 className='text-xl font-medium'>
          Run to the father Pro Subscription
        </h3>

        <p className='text-2xl'>$7.99 per month</p>

        <div className='flex items-center gap-x-4'>
          <p>View details</p>
          <ChevronDown className='h-4 w-4' />
        </div>

        <p className='text-base'>Your subscription renews on May 19, 2025.</p>

        <div className='flex w-fit items-center gap-x-12pxr'>
          <div className='flex h-40pxr w-48pxr items-center justify-center rounded bg-black'>
            <div className='flex'>
              <div className='mr-[-0.5rem] h-20pxr w-20pxr rounded-full bg-red-500'></div>
              <div className='h-20pxr w-20pxr rounded-full bg-yellow-500'></div>
            </div>
          </div>
          <span className=''>Mastercard</span>
          <span className='text-gray-500'>•••• 4980</span>
          <Button variant='ghost' className='ml-auto p-1' size='icon'>
            <PenSquare className='h-5 w-5 text-gray-500' />
          </Button>
        </div>

        <Button
          variant='outline'
          className='mx-auto mt-12pxr w-full max-w-500pxr rounded-10pxr border-gray-300'
        >
          Cancel subscription
        </Button>
      </div>
    </div>
  );
}
