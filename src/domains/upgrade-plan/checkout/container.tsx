'use client';

import { PaymentNavigation } from '@/features/payment/ui/payment-sidebar';
import PaymentFormContainer from './payment-form-container';

function CheckoutContainer() {
  return (
    <div className='flex max-h-screen w-full flex-col md:flex-row'>
      <PaymentNavigation />

      <PaymentFormContainer />
    </div>
  );
}

export default CheckoutContainer;
