import { PenSquare, Search } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';

export function BillingInformation() {
  return (
    <div className='flex w-full flex-col gap-y-20pxr py-12pxr'>
      <h2 className='font-300 text-lg'>BILLING INFORMATION</h2>
      <div className='h-1pxr bg-gray-200' />

      <div className='flex flex-col gap-y-12pxr'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <h3 className='text-lg font-medium'>Name</h3>
          </div>
          <div>
            <p>HYUNJEE JUNG</p>
          </div>

          <div>
            <h3 className='text-lg font-medium'>Billing address</h3>
          </div>
          <div className='space-y-1'>
            <p>서울특별시gangnam-gu</p>
            <p>datich</p>
            <p>06185</p>
            <p>KR</p>
          </div>
        </div>

        <Button variant='ghost' className='flex h-auto w-fit items-center p-0'>
          <PenSquare className='mr-2 h-5 w-5' />
          Update information
        </Button>

        <div className='mt-8 rounded border border-gray-300 p-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-medium text-gray-500'>
              INVOICE HISTORY
            </h3>
            <Button variant='ghost' size='icon'>
              <Search className='h-5 w-5 text-gray-500' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
