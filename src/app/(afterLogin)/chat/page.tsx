import { Suspense } from 'react';
import { HomeContainer } from '@domains/home/ui';

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen w-full items-center justify-center'>
          Loading...
        </div>
      }
    >
      <HomeContainer />
    </Suspense>
  );
}
