import localFont from 'next/font/local';

export const Urbanist = localFont({
  src: [
    {
      path: './Urbanist-Bold.ttf',
      weight: '700',
    },
    {
      path: './Urbanist-Medium.ttf',
      weight: '500',
    },
    {
      path: './Urbanist-Regular.ttf',
      weight: '400',
    },
    {
      path: './Urbanist-Light.ttf',
      weight: '300',
    },
  ],
  display: 'swap',
  preload: true,
});
