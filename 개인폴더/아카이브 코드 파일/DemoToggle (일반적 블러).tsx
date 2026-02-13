// design-system/src/demo/shell/DemoToggle.tsx

/* 🔴🔴 복원시 이 줄 삭제해 🔴🔴
import React from 'react';

type Theme = 'light' | 'dark';

export default function DemoToggle() {
  const [theme, setTheme] = React.useState<Theme>(() => {
    const stored =
      typeof window !== 'undefined'
        ? localStorage.getItem('ds-demo-theme')
        : null;
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

  // ❗ 이모지 규칙 유지
  const icon =
    theme === 'light'
      ? hovered ? '🌚' : '🌞'
      : hovered ? '🌝' : '🌖';

  return (
    <>
      <button
        type='button'
        onClick={toggleTheme}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label='Theme'
        title='Theme'
        className='demoThemeToggle'
      >
        <span className='demoThemeToggle__icon'>{icon}</span>
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

        /* ======================================================
           🔥 MULTI BLOB FLAME (블러 살짝 약화)
        ====================================================== */
/* 🔴🔴 복원시 이 줄 삭제 🔴🔴
        .demoThemeToggle::before,
        .demoThemeToggle::after {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 999px;
          pointer-events: none;

          opacity: 0;
          transform: scale(0.96);

          transition:
            opacity 520ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 520ms cubic-bezier(0.16, 1, 0.3, 1);

          /* 🔧 블러 감소 */
/* 🔴🔴 복원시 이 줄 삭제 🔴🔴          
          filter: blur(9px) saturate(1.15);

          will-change: transform, filter, opacity, border-radius;
        }

        /* ===== Blob Group A (Warm) ===== */
/* 🔴🔴 복원시 이 줄 삭제 🔴🔴        
        .demoThemeToggle::before {
          z-index: 1;
          background:
            radial-gradient(45% 55% at 30% 38%,
              rgb(255 200 120 / 0.42), transparent 72%),
            radial-gradient(38% 46% at 72% 44%,
              rgb(255 120 180 / 0.36), transparent 74%);
        }

        /* ===== Blob Group B (Cool) ===== */
/* 🔴🔴 복원시 이 줄 삭제 🔴🔴        
        .demoThemeToggle::after {
          z-index: 2;
          background:
            radial-gradient(42% 50% at 60% 72%,
              rgb(120 190 255 / 0.34), transparent 74%),
            radial-gradient(36% 44% at 36% 66%,
              rgb(190 140 255 / 0.32), transparent 76%);
        }

        .demoThemeToggle:hover::before,
        .demoThemeToggle:focus-visible::before {
          opacity: 0.9;
          transform: scale(1);
          animation: blobAUnified 11s ease-in-out infinite;
        }

        .demoThemeToggle:hover::after,
        .demoThemeToggle:focus-visible::after {
          opacity: 0.75;
          transform: scale(1);
          animation: blobBUnified 13s ease-in-out infinite;
        }

        /* ===== Light mode (조금 또렷) ===== */
/* 🔴🔴 복원시 이 줄 삭제 🔴🔴        
        :root:not([data-theme='dark']) .demoThemeToggle::before,
        :root:not([data-theme='dark']) .demoThemeToggle::after {
          filter: blur(10px) saturate(1.22);
        }

        /* ===== Dark mode ===== */
/* 🔴🔴 복원시 이 줄 삭제 🔴🔴        
        :root[data-theme='dark'] .demoThemeToggle::before,
        :root[data-theme='dark'] .demoThemeToggle::after {
          mix-blend-mode: screen;
          filter: blur(10px) saturate(1.15);
        }

        /* ===== Unified animations (유지) ===== */
/* 🔴🔴 복원시 이 줄 삭제 🔴🔴
        @keyframes blobAUnified {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            border-radius: 44% 56% 60% 40% / 48% 48% 52% 52%;
            filter: blur(9px) saturate(1.15) hue-rotate(0deg);
          }
          25% {
            transform: translate(-1.7px, 1.2px) rotate(90deg) scale(1.12);
            border-radius: 70% 30% 46% 54% / 34% 66% 38% 62%;
            filter: blur(10px) saturate(1.22) hue-rotate(55deg);
          }
          50% {
            transform: translate(1.2px, -1px) rotate(180deg) scale(0.98);
            border-radius: 36% 64% 44% 56% / 58% 42% 60% 40%;
            filter: blur(9px) saturate(1.18) hue-rotate(95deg);
          }
          75% {
            transform: translate(-1px, -1.4px) rotate(270deg) scale(1.08);
            border-radius: 58% 42% 62% 38% / 40% 60% 44% 56%;
            filter: blur(10px) saturate(1.2) hue-rotate(125deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg) scale(1);
            border-radius: 44% 56% 60% 40% / 48% 48% 52% 52%;
            filter: blur(9px) saturate(1.15) hue-rotate(140deg);
          }
        }

        @keyframes blobBUnified {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(0.98);
            border-radius: 52% 48% 62% 38% / 60% 40% 60% 40%;
            filter: blur(9px) saturate(1.12) hue-rotate(35deg);
          }
          30% {
            transform: translate(1.9px, 0.9px) rotate(-120deg) scale(1.1);
            border-radius: 30% 70% 48% 52% / 54% 46% 36% 64%;
            filter: blur(10px) saturate(1.18) hue-rotate(115deg);
          }
          60% {
            transform: translate(-1.6px, -1.3px) rotate(-240deg) scale(1.02);
            border-radius: 66% 34% 52% 48% / 42% 58% 62% 38%;
            filter: blur(9px) saturate(1.15) hue-rotate(175deg);
          }
          85% {
            transform: translate(0.8px, -1.1px) rotate(-320deg) scale(1.08);
            border-radius: 44% 56% 34% 66% / 62% 38% 54% 46%;
            filter: blur(10px) saturate(1.17) hue-rotate(215deg);
          }
          100% {
            transform: translate(0, 0) rotate(-360deg) scale(0.98);
            border-radius: 52% 48% 62% 38% / 60% 40% 60% 40%;
            filter: blur(9px) saturate(1.12) hue-rotate(240deg);
          }
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
*/ /* 🔴🔴 복원시 이 줄 삭제 🔴🔴 */