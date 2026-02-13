import React from 'react';

type Theme = 'light' | 'dark';

export default function DemoToggle() {
  const [theme, setTheme] = React.useState<Theme>(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('ds-demo-theme') : null;
    return (stored as Theme) || 'light';
  });

  const [hovered, setHovered] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ds-demo-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const icon = theme === 'light' 
    ? (hovered ? '🌚' : '🌞') 
    : (hovered ? '🌝' : '🌖');

  return (
    <>
      <button
        type="button"
        onClick={toggleTheme}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Theme"
        title="Theme"
        className="demoThemeToggle"
      >
        <span className="demoThemeToggle__icon">{icon}</span>
      </button>

      <style>{`
        .demoThemeToggle {
          all: unset;
          cursor: pointer;
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border-radius: 999px;
          isolation: isolate;
        }

        .demoThemeToggle__icon {
          font-size: 20px;
          z-index: 5;
          position: relative;
        }

        /* ===== 공통 플레임 스타일 ===== */
        .demoThemeToggle::before,
        .demoThemeToggle::after {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 999px;
          pointer-events: none;
          opacity: 0;
          filter: blur(11px);
          will-change: transform, filter;
          transition: opacity 500ms ease;
        }

        /* 1번 레이어 (따뜻한 톤) */
        .demoThemeToggle::before {
          z-index: 1;
          background: 
            radial-gradient(45% 55% at 30% 38%, rgb(255 200 120 / 0.42), transparent 72%),
            radial-gradient(38% 46% at 72% 44%, rgb(255 120 180 / 0.36), transparent 74%);
        }

        /* 2번 레이어 (차가운 톤) */
        .demoThemeToggle::after {
          z-index: 2;
          background: 
            radial-gradient(42% 50% at 60% 72%, rgb(120 190 255 / 0.34), transparent 74%),
            radial-gradient(36% 44% at 36% 66%, rgb(190 140 255 / 0.32), transparent 76%);
        }

        /* 호버 시 애니메이션 활성화 */
        .demoThemeToggle:hover::before,
        .demoThemeToggle:focus-visible::before {
          opacity: 0.9;
          animation: 
            blobDriftA 9s ease-in-out infinite,
            blobMorphA 7s ease-in-out infinite,
            blobHueA 12s linear infinite;
        }

        .demoThemeToggle:hover::after,
        .demoThemeToggle:focus-visible::after {
          opacity: 0.75;
          animation: 
            blobDriftB 11s ease-in-out infinite,
            blobMorphB 8.5s ease-in-out infinite,
            blobHueB 14s linear infinite;
        }

        /* ===== 라이트 모드 채도 보정 ===== */
        :root:not([data-theme='dark']) .demoThemeToggle::before {
          filter: blur(12px) saturate(1.25);
        }
        :root:not([data-theme='dark']) .demoThemeToggle::after {
          filter: blur(11px) saturate(1.2);
        }

        /* ===== 다크 모드 블렌딩 ===== */
        :root[data-theme='dark'] .demoThemeToggle::before,
        :root[data-theme='dark'] .demoThemeToggle::after {
          mix-blend-mode: screen;
          filter: blur(12px) saturate(1.15);
        }

        /* ================= 애니메이션 정의 ================= */
        
        /* 레이어 A */
        @keyframes blobDriftA {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          35% { transform: translate(-2px, 1.8px) rotate(120deg) scale(1.15); }
          70% { transform: translate(2.2px, -1.2px) rotate(240deg) scale(0.96); }
          100% { transform: translate(0, 0) rotate(360deg) scale(1); }
        }

        @keyframes blobMorphA {
          0%, 100% { border-radius: 44% 56% 60% 40% / 48% 48% 52% 52%; }
          50% { border-radius: 70% 30% 46% 54% / 34% 66% 38% 62%; }
        }

        @keyframes blobHueA {
          from { filter: hue-rotate(0deg); }
          to { filter: hue-rotate(140deg); }
        }

        /* 레이어 B */
        @keyframes blobDriftB {
          0% { transform: translate(0, 0) rotate(0deg) scale(0.96); }
          45% { transform: translate(2.6px, 1.2px) rotate(-150deg) scale(1.1); }
          80% { transform: translate(-2.4px, -1.8px) rotate(-280deg) scale(1.02); }
          100% { transform: translate(0, 0) rotate(-360deg) scale(0.96); }
        }

        @keyframes blobMorphB {
          0%, 100% { border-radius: 52% 48% 62% 38% / 60% 40% 60% 40%; }
          55% { border-radius: 28% 72% 48% 52% / 54% 46% 36% 64%; }
        }

        @keyframes blobHueB {
          from { filter: hue-rotate(40deg); }
          to { filter: hue-rotate(220deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .demoThemeToggle::before,
          .demoThemeToggle::after {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}