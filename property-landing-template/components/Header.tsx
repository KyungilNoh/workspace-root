'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Button, Switch } from '@your-org/design-system';

/** iframe 안이면 Link 대신 <a> 사용 (Next Link는 iframe에서 동작 안 함) */
const isInIframe = () => typeof window !== 'undefined' && window.self !== window.top;

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  const t = document.documentElement.dataset.theme as Theme | undefined;
  if (t === 'dark' || t === 'light') return t;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

function NavLink({
  href,
  children,
  isActive,
  isPending,
  defaultText,
  navActive,
  navBase,
  navPending,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  isPending: boolean;
  defaultText: string;
  navActive: string;
  navBase: string;
  navPending: string;
  onClick?: () => void;
}) {
  const cn = clsx(navBase, isActive ? navActive : defaultText, isPending && navPending);
  if (isInIframe()) {
    return <a href={href} className={cn} onClick={onClick}>{children}</a>;
  }
  return <Link href={href} className={cn} onClick={onClick}>{children}</Link>;
}

const THEME_COOKIE = 'theme';
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1년

export default function Header({ initialTheme }: { initialTheme?: Theme }) {
  const [theme, setTheme] = useState<Theme>(() => initialTheme ?? getInitialTheme());
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  const isHome = pathname === '/';
  const isOverview = pathname === '/overview';
  const isUnitPlan = pathname === '/unit-plan';
  const isEnvironment = pathname === '/environment';
  const isLocation = pathname === '/location';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('theme') as Theme | null;
    const resolved = stored === 'dark' || stored === 'light'
      ? stored
      : (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    setTheme(resolved);
    document.documentElement.dataset.theme = resolved;
    document.cookie = `${THEME_COOKIE}=${resolved}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const setThemeTo = (next: Theme) => {
    setTheme(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', next);
      document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
    }
    document.documentElement.dataset.theme = next;
  };

  /* 토큰 사용으로 head 스크립트가 세팅한 data-theme과 첫 페인트부터 일치 */
  const defaultText = 'text-onsurface';
  const navBase =
    'relative flex h-full items-center px-1 text-sm border-b-2 border-transparent transition-colors duration-150 active:opacity-80';
  const navActive = 'border-b-brand-500 text-brand-600';
  const navPending = 'opacity-70';

  const handleGoHome = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContactClick = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const setScrollToContactAndClose = () => {
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('scrollToContact', '1');
    setMenuOpen(false);
  };

  const inIframe = isInIframe();

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 w-full border-b backdrop-blur"
      style={{
        backgroundColor: 'rgb(var(--color-surface) / 0.85)',
        borderColor: 'rgb(var(--color-outline))',
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between px-4 md:px-6 lg:px-8">
        {inIframe ? (
          <a href="/" className={clsx('text-md font-semibold', defaultText)} onClick={pathname === '/' ? handleGoHome : undefined}>
            금정역 호계 푸르지오 1588-1599
          </a>
        ) : (
          <Link href="/" className={clsx('text-md font-semibold', defaultText)} onClick={handleGoHome}>
            금정역 호계 푸르지오 1588-1599
          </Link>
        )}

        <nav className="hidden h-full items-center gap-6 md:flex">
          <NavLink href="/" isActive={isHome} isPending={pendingHref === '/'} defaultText={defaultText} navActive={navActive} navBase={navBase} navPending={navPending} onClick={() => setPendingHref('/')}>홈</NavLink>
          <NavLink href="/overview" isActive={isOverview} isPending={pendingHref === '/overview'} defaultText={defaultText} navActive={navActive} navBase={navBase} navPending={navPending} onClick={() => setPendingHref('/overview')}>개요</NavLink>
          <NavLink href="/unit-plan" isActive={isUnitPlan} isPending={pendingHref === '/unit-plan'} defaultText={defaultText} navActive={navActive} navBase={navBase} navPending={navPending} onClick={() => setPendingHref('/unit-plan')}>세대안내</NavLink>
          <NavLink href="/environment" isActive={isEnvironment} isPending={pendingHref === '/environment'} defaultText={defaultText} navActive={navActive} navBase={navBase} navPending={navPending} onClick={() => setPendingHref('/environment')}>입지환경</NavLink>
          <NavLink href="/location" isActive={isLocation} isPending={pendingHref === '/location'} defaultText={defaultText} navActive={navActive} navBase={navBase} navPending={navPending} onClick={() => setPendingHref('/location')}>오시는 길</NavLink>
          {pathname === '/' ? (
            <Button size="sm" onClick={handleContactClick}>문의하기</Button>
          ) : inIframe ? (
            <a href="/" onClick={setScrollToContactAndClose} className="inline-block">
              <Button as="span" size="sm">문의하기</Button>
            </a>
          ) : (
            <Link href="/" onClick={setScrollToContactAndClose} className="inline-block">
              <Button as="span" size="sm">문의하기</Button>
            </Link>
          )}
          <Switch label="Light" size="sm" checked={theme === 'light'} onChange={(on) => setThemeTo(on ? 'light' : 'dark')} className={defaultText} />
        </nav>

        <button
          className={clsx('flex h-8 w-8 items-center justify-center md:hidden', defaultText)}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          ≡
        </button>
      </div>

      {menuOpen && (
        <div
          className="w-full border-t md:hidden"
          style={{
            backgroundColor: 'rgb(var(--color-surface) / 0.95)',
            borderColor: 'rgb(var(--color-outline))',
          }}
        >
          <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-3 px-4 py-4 md:px-6 lg:px-8">
            <NavLink href="/" isActive={isHome} isPending={false} defaultText={clsx('text-sm', defaultText)} navActive="text-sm text-brand-600" navBase="text-sm" navPending="" onClick={() => setMenuOpen(false)}>홈</NavLink>
            <NavLink href="/overview" isActive={isOverview} isPending={false} defaultText={clsx('text-sm', defaultText)} navActive="text-sm text-brand-600" navBase="text-sm" navPending="" onClick={() => setMenuOpen(false)}>개요</NavLink>
            <NavLink href="/unit-plan" isActive={isUnitPlan} isPending={false} defaultText={clsx('text-sm', defaultText)} navActive="text-sm text-brand-600" navBase="text-sm" navPending="" onClick={() => setMenuOpen(false)}>세대안내</NavLink>
            <NavLink href="/environment" isActive={isEnvironment} isPending={false} defaultText={clsx('text-sm', defaultText)} navActive="text-sm text-brand-600" navBase="text-sm" navPending="" onClick={() => setMenuOpen(false)}>입지환경</NavLink>
            <NavLink href="/location" isActive={isLocation} isPending={false} defaultText={clsx('text-sm', defaultText)} navActive="text-sm text-brand-600" navBase="text-sm" navPending="" onClick={() => setMenuOpen(false)}>오시는 길</NavLink>
            {pathname === '/' ? (
              <Button size="md" onClick={() => { handleContactClick(); setMenuOpen(false); }}>문의하기</Button>
            ) : inIframe ? (
              <a href="/" onClick={setScrollToContactAndClose} className="inline-block">
                <Button as="span" size="md">문의하기</Button>
              </a>
            ) : (
              <Link href="/" onClick={setScrollToContactAndClose} className="inline-block">
                <Button as="span" size="md">문의하기</Button>
              </Link>
            )}
            <Switch label="Light" size="md" checked={theme === 'light'} onChange={(on) => { setThemeTo(on ? 'light' : 'dark'); setMenuOpen(false); }} className={defaultText} />
          </div>
        </div>
      )}
    </header>
  );
}
