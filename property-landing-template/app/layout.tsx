import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Nanum_Gothic } from 'next/font/google';
import Header from '@/components/Header';
import '@/app/globals.css';

const THEME_COOKIE = 'theme';

const nanumGothic = Nanum_Gothic({
  weight: ['400', '700', '800'],
  subsets: ['latin'],
  variable: '--font-gothic-neo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '금정역호계푸르지오',
  description: '내 랜딩 설명 문구',
  openGraph: {
    title: '금정역호계푸르지오',
    description: '내 랜딩 설명 문구',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(THEME_COOKIE)?.value;
  const initialTheme = themeCookie === 'dark' || themeCookie === 'light' ? themeCookie : undefined;

  return (
    <html lang="ko" className={nanumGothic.variable} suppressHydrationWarning>
      <head>
        {/* 저장된 테마를 첫 페인트 전에 적용 (localStorage 우선, 쿠키, 없으면 OS 테마) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=typeof localStorage!=='undefined'?localStorage.getItem('theme'):null;if(!t){var c=document.cookie.match(/\\s*theme=([^;]+)/);t=c?c[1]:null;}if(t!=='dark'&&t!=='light'){t=typeof window!=='undefined'&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;})();`,
          }}
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-light.png"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-dark.png"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body>
        {/* 새로고침 시 스크롤 위치 복원 대신 항상 최상단으로 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.history.scrollRestoration='manual';window.scrollTo(0,0);`,
          }}
        />
        <Header initialTheme={initialTheme} />
        <main className="min-h-screen pt-16">{children}</main>
      </body>
    </html>
  );
}
