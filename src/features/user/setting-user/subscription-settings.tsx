'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Check, ChevronDown, CreditCard, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';

interface SubscriptionSettingsProps {
  onBack: () => void;
}

export const SubscriptionSettings = ({ onBack }: SubscriptionSettingsProps) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleUpgradePlan = () => {
    router.push('/upgrade-plan');
  };

  return (
    <div className='space-y-6'>
      {!showCancelDialog ? (
        <>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-medium'>Pro Plan</h3>
            <Button
              variant='outline'
              className='h-8'
              onClick={handleUpgradePlan}
            >
              View all plans
            </Button>
          </div>

          <div>
            <h4 className='mb-2 font-medium'>Your plan includes:</h4>
            <ul className='space-y-2'>
              <li className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-green-500' />
                <span>300 chat Per Month</span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-green-500' />
                <span>Save, Manage, and Share your conversation</span>
              </li>
              <li className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-green-500' />
                <span>
                  Explore two powerful tools: Surrender Mode and Bible Mode
                </span>
              </li>
            </ul>
          </div>

          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm'>Your plan auto-renews on May 20, 2025</p>
            </div>

            <div className='relative'>
              <Button
                variant='outline'
                className='flex h-8 items-center gap-1'
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Manage
                <ChevronDown className='h-4 w-4' />
              </Button>

              {isDropdownOpen && (
                <div className='shadow-md absolute right-0 top-full z-10 mt-1 w-56 rounded-md border bg-white'>
                  <Button
                    variant='ghost'
                    className='w-full justify-start gap-2 px-4 py-2'
                  >
                    <CreditCard className='h-4 w-4' />
                    <span>Upgrade plan</span>
                  </Button>
                  <Separator />
                  <Button
                    variant='ghost'
                    className='w-full justify-start gap-2 px-4 py-2 text-red-500'
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setShowCancelDialog(true);
                    }}
                  >
                    <X className='h-4 w-4' />
                    <span>Cancel Subscription</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className='flex items-center justify-between'>
            <div>
              <h4 className='font-medium'>Payment</h4>
            </div>
            <Button variant='outline' className='h-8'>
              Manage
            </Button>
          </div>
        </>
      ) : (
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-medium'>Subscription Cancellation</h3>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setShowCancelDialog(false)}
            >
              <X className='h-5 w-5' />
            </Button>
          </div>

          <Separator />

          <p className='text-sm'>
            Your Pro subscription will be canceled but will remain active until
            the end of your billing period on May 19, 2025.
          </p>

          <div className='flex justify-end gap-2'>
            <Button
              variant='outline'
              onClick={() => setShowCancelDialog(false)}
            >
              Go back
            </Button>
            <Button
              variant='destructive'
              className='bg-red-500 text-white hover:bg-red-600'
            >
              Cancel subscription
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
