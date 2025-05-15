import { BillingInformation } from '@/features/payment/ui/billing-information';
import { CurrentSubscription } from '@/features/payment/ui/current-subscription';
import { InvoiceHistory } from '@/features/payment/ui/invoice-history';
import { PaymentMethods } from '@/features/payment/ui/payment-methods';

function PaymentFormContainer() {
  return (
    <section className='mx-auto flex w-full max-w-500pxr flex-1 flex-col p-4 md:p-6'>
      <div className='flex flex-col'>
        <CurrentSubscription />
        <PaymentMethods />
        <BillingInformation />
        <InvoiceHistory />
      </div>
    </section>
  );
}

export default PaymentFormContainer;
