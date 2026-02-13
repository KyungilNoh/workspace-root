// 글로벌 LNB
// app-shell/src/AppShell.tsx

import React from 'react';
import { createRoot } from 'react-dom/client';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@your-org/design-system';

// Rounded 아이콘만 사용
import SmartToyRounded from '@mui/icons-material/SmartToyRounded';
import ColorLensRounded from '@mui/icons-material/ColorLensRounded';
import ApartmentRounded from '@mui/icons-material/ApartmentRounded';

type NavItem = {
  to: string;
  label: string;
  tooltip?: string;
  icon: React.ReactNode;
};

const NAV: NavItem[] = [
  { to: '/', label: 'About', tooltip: "Hi, I'm Kyungil", icon: <SmartToyRounded /> },
  { to: '/ds', label: 'DS', tooltip: 'Design System', icon: <ColorLensRounded /> },
  { to: '/prop.', label: 'Prop.', tooltip: 'Property Landing', icon: <ApartmentRounded /> },
];

export default function AppShell() {
  const { pathname } = useLocation();
  const themeToggleRootRef = React.useRef<ReturnType<typeof createRoot> | null>(null);
  const themeToggleContainerRef = React.useRef<HTMLDivElement | null>(null);

  const isFrameRoute = pathname.startsWith('/ds') || pathname.startsWith('/prop.');
  const showThemeToggle = pathname === '/' || pathname.startsWith('/ds');

  // 테마 토글을 body에 별도 React 루트로 렌더 (앱 트리와 분리해 이벤트 수신 보장)
  React.useEffect(() => {
    if (!showThemeToggle) {
      themeToggleRootRef.current?.unmount();
      themeToggleRootRef.current = null;
      themeToggleContainerRef.current?.remove();
      themeToggleContainerRef.current = null;
      return;
    }
    const el = document.createElement('div');
    Object.assign(el.style, {
      position: 'fixed',
      top: '16px',
      right: '32px',
      width: '48px',
      height: '48px',
      zIndex: '2147483647',
      pointerEvents: 'auto',
    });
    document.body.appendChild(el);
    themeToggleContainerRef.current = el;
    const root = createRoot(el);
    themeToggleRootRef.current = root;
    root.render(<ThemeToggle storageKey="app-shell-theme" />);
    return () => {
      root.unmount();
      themeToggleRootRef.current = null;
      el.remove();
      themeToggleContainerRef.current = null;
    };
  }, [showThemeToggle]);

  // 테마 토글은 app-shell에서만 사용. iframe(DS)은 부모 테마를 postMessage로 수신.
  React.useEffect(() => {
    const sendThemeToFrame = (theme: string) => {
      const iframe = document.querySelector('.frameIframe') as HTMLIFrameElement | null;
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'DS_THEME', theme }, '*');
      }
    };

    const observer = new MutationObserver(() => {
      const next = document.documentElement.getAttribute('data-theme') || 'light';
      sendThemeToFrame(next);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === 'DS_READY' && e.source) {
        const t = document.documentElement.getAttribute('data-theme') || 'light';
        (e.source as Window).postMessage({ type: 'DS_THEME', theme: t }, '*');
      }
    };
    window.addEventListener('message', onMessage);

    if (isFrameRoute) sendThemeToFrame(document.documentElement.getAttribute('data-theme') || 'light');

    return () => {
      observer.disconnect();
      window.removeEventListener('message', onMessage);
    };
  }, [isFrameRoute]);

  return (
    <div className='appShell'>
      <aside className='rail' aria-label='Global navigation'>
        <div className='railInner'>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `railItem ${isActive ? 'isActive' : ''}`}
              aria-label={item.tooltip ?? item.label}
              title={item.tooltip ?? item.label}
            >
              <div className='railItemInner'>
                <div className='indicator' aria-hidden />
                <div className='icon'>{item.icon}</div>
                <div className='label'>{item.label}</div>
              </div>
            </NavLink>
          ))}
        </div>
      </aside>

      <main className={`content ${isFrameRoute ? 'content--locked' : 'content--scroll'}`}>
        <Outlet />
      </main>
    </div>
  );
}