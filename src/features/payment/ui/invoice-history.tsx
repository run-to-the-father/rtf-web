import { ChevronDown } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

export function InvoiceHistory() {
  return (
    <div className='flex w-full flex-col gap-y-20pxr py-12pxr'>
      <h2 className='font-300 text-lg'>INVOICE HISTORY</h2>
      <div className='h-1pxr bg-gray-200' />

      <div className='flex flex-col gap-y-12pxr'>
        {/* Invoice entries */}
        <div className='flex flex-col gap-y-12pxr'>
          {/* April invoice */}
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-lg font-medium'>Apr 19</p>
            </div>
            <div className='flex items-center gap-x-4'>
              <p className='text-lg font-medium'>$21.78</p>
              <Badge className='rounded-md bg-green-100 px-4 text-green-600 hover:bg-green-100'>
                Paid
              </Badge>
            </div>
          </div>

          {/* March invoice */}
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-lg font-medium'>Mar 19</p>
            </div>
            <div className='flex items-center gap-x-4'>
              <p className='text-lg font-medium'>$217.75</p>
              <Badge className='rounded-md bg-green-100 px-4 text-green-600 hover:bg-green-100'>
                Paid
              </Badge>
            </div>
          </div>

          {/* February invoice */}
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-lg font-medium'>Feb 18</p>
            </div>
            <div className='flex items-center gap-x-4'>
              <p className='text-lg font-medium'>$212.82</p>
              <Badge className='rounded-md bg-green-100 px-4 text-green-600 hover:bg-green-100'>
                Paid
              </Badge>
            </div>
          </div>
        </div>

        {/* View more button */}
        <Button
          variant='ghost'
          className='mx-auto flex items-center text-gray-400'
        >
          <ChevronDown className='mr-2 h-5 w-5' />
          View more
        </Button>

        {/* Footer */}
        <div className='flex flex-col gap-y-2 pt-8 text-center'>
          <div className='flex items-center justify-center text-sm text-gray-400'>
            Powered by
            <span className='ml-2 font-semibold'>stripe</span>
          </div>
          <div className='text-sm text-gray-400'>
            Learn more about Stripe Billing
          </div>
          <div className='text-sm text-gray-400'>Terms Privacy</div>
        </div>
      </div>
    </div>
  );
}
