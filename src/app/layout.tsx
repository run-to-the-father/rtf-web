import type { Metadata } from 'next';
import ModalRoot from '@/shared/ui/modal-root';
import { ThemeProvider } from '@application/provider/theme-provider';
import { Urbanist } from '@shared/config/fonts';
import './globals.css';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://runtothefather.com';

export const metadata: Metadata = {
  title: 'Run to the Father - 성경적 가치 기반 AI 챗봇',
  description:
    'Run to the Father는 성경적 가치와 지혜를 바탕으로 신앙적 조언과 도움을 제공하는 크리스천 AI 챗봇 서비스입니다.',
  openGraph: {
    title: 'Run to the Father - 성경적 가치 기반 AI 챗봇',
    description:
      '성경적 가치와 지혜를 바탕으로 신앙적 조언과 도움을 제공하는 크리스천 AI 챗봇 서비스',
    url: baseUrl,
    siteName: 'Run to the Father',
    locale: 'ko-KR',
    images: [`${baseUrl}/assets/og-image.png`],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Run to the Father - 성경적 가치 기반 AI 챗봇',
    description:
      '성경적 가치와 지혜를 바탕으로 신앙적 조언과 도움을 제공하는 크리스천 AI 챗봇 서비스',
    images: [`${baseUrl}/assets/og-image.png`],
  },
  verification: {
    // 필요시 검색 엔진 인증 코드 추가
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko' className='light' suppressHydrationWarning>
      <body className={Urbanist.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem={false}
          disableTransitionOnChange
          storageKey='rtf-theme'
        >
          <ModalRoot />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
