'use client';

import { useState } from 'react';
import OnboardingLayout from './layout';

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Surrender',
      description: 'What is surrender mode?',
    },
    {
      title: 'Bible',
      description: 'what is bible mode?',
    },
    {
      title: 'Lorem ipsum dolor sit amet adipiscing elit.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Habitasse id orci facilisi nulla scelerisque. Nisl',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // 온보딩 완료 후 메인 페이지로 이동
      window.location.href = '/';
    }
  };

  return (
    <OnboardingLayout>
      <div className='flex h-full flex-col justify-between pb-8'>
        {/* <OnboardingSlide title={slides[currentSlide].title} description={slides[currentSlide].description} /> */}

        <div className='flex flex-col items-center gap-8'>
          {/* <OnboardingIndicator total={slides.length} current={currentSlide} />
          <OnboardingButton onClick={handleNext} /> */}
        </div>
      </div>
    </OnboardingLayout>
  );
}
