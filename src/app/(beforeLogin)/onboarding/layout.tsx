import type { ReactNode } from 'react';

interface OnboardingLayoutProps {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      {children}
    </div>
  );
}
