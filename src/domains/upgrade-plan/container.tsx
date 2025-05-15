'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { PaymentCard } from '@/features/payment/ui/payment-card';

function UpgradePlanContainer() {
  const router = useRouter();

  const freePlanFeatures = [
    { text: '7 Free chat Per Month' },
    { text: 'Explore two powerful tools: Surrender Mode and Bible Mode' },
    { text: 'Save, Manage, and Share your conversation' },
  ];

  const proPlanFeatures = [
    { text: '300 chat Per Month' },
    { text: 'Explore two powerful tools: Surrender Mode and Bible Mode' },
    { text: 'Save, Manage, and Share your conversation' },
  ];

  const handleClosePage = () => {
    router.push('/');
  };

  const handleGetPro = () => {
    // 결제 페이지로 이동
    router.push('/upgrade-plan/checkout');
  };

  return (
    <div className='flex min-h-screen flex-col p-4 pb-16'>
      <div className='mx-auto flex w-full max-w-4xl flex-1 flex-col'>
        <div className='mb-6 flex items-center justify-between'>
          <span className='h-6 w-6' />
          <h1 className='text-2xl font-bold'>Upgrade your plan</h1>
          <button
            onClick={handleClosePage}
            className='rounded-full p-1 hover:bg-gray-100'
            aria-label='Close'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        <section className='flex flex-1 items-center justify-center'>
          <div className='grid h-full w-full grid-cols-1 gap-6 pc:grid-cols-2'>
            <PaymentCard
              type='free'
              title='Free'
              price={0}
              description='Living with God changes everything—Come run to the Father.'
              features={freePlanFeatures}
              isCurrentPlan={true}
            />

            <PaymentCard
              type='pro'
              title='Pro'
              price={8.99}
              description='Living with God changes everything — Come run to the Father.'
              features={proPlanFeatures}
              ctaText='Get Pro'
              onCtaClick={handleGetPro}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default UpgradePlanContainer;
