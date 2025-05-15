'use client';

import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

interface Feature {
  text: string;
}

interface PaymentCardProps {
  type: 'free' | 'pro';
  title: string;
  price: number;
  currency?: string;
  period?: string;
  description: string;
  features: Feature[];
  isCurrentPlan?: boolean;
  ctaText?: string;
  onCtaClick?: () => void;
}

export function PaymentCard({
  type,
  title,
  price,
  currency = 'USD',
  period = 'month',
  description,
  features,
  isCurrentPlan = false,
  ctaText,
  onCtaClick,
}: PaymentCardProps) {
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-450pxr flex-col gap-y-25pxr rounded-lg border p-6 transition-all',
        type === 'pro' ? 'border border-green-600 bg-green-50' : 'bg-white',
      )}
    >
      <h3 className='title-xl-500'>{title}</h3>

      <div className='flex gap-x-4pxr py-25pxr'>
        <span className='text- text-xl'>$</span>
        <span className='font-600 text-45pxr'>{price}</span>
        <div className='text-muted-foreground ml-1 mt-auto flex flex-col text-sm text-stone-600'>
          <span>{currency}/</span>
          <span>{period}</span>
        </div>
      </div>

      <p className='text-muted-foreground text-15pxr'>{description}</p>
      <div className='flex w-full items-center justify-center py-10pxr'>
        {isCurrentPlan ? (
          <Button
            variant='outline'
            className='h-40pxr w-full max-w-300pxr rounded-full bg-secondary text-stone-600'
            disabled
          >
            Your current plan
          </Button>
        ) : (
          ctaText && (
            <Button
              variant={type === 'pro' ? 'default' : 'outline'}
              className={cn(
                'h-40pxr w-full max-w-300pxr rounded-full',
                type === 'pro' && 'bg-green-600 hover:bg-green-700',
              )}
              onClick={onCtaClick}
            >
              {ctaText}
            </Button>
          )
        )}
      </div>

      <ul className='flex flex-col gap-y-5pxr py-25pxr'>
        {features.map((feature, i) => (
          <li key={i} className='flex items-start text-15pxr'>
            <Check className='mr-2 h-5 w-5 shrink-0' />
            <span className='text-sm'>{feature.text}</span>
          </li>
        ))}
      </ul>

      <div className='text-muted-foreground space-y-1 text-12pxr'>
        <button className='block hover:underline'>
          Manage my subscription
        </button>
        <button className='block hover:underline'>
          I need help with a billing issue
        </button>
      </div>
    </div>
  );
}
