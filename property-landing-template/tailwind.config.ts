import path from 'path';
import type { Config } from 'tailwindcss';

const config: Config = {
  // JIT 모드 (기본값이지만 명시)
  mode: 'jit',
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './sections/**/*.{js,ts,jsx,tsx}',
    // 디자인 시스템 컴포넌트 스캔 (심링크 경로)
    path.resolve(__dirname, '../design-system/src/**/*.{js,ts,jsx,tsx}'),
    // node_modules 백업 경로 (빌드 시)
    path.resolve(__dirname, 'node_modules/@your-org/design-system/src/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'rgb(var(--brand-50) / <alpha-value>)',
          100: 'rgb(var(--brand-100) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          600: 'rgb(var(--brand-600) / <alpha-value>)',
        },
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        onprimary: 'rgb(var(--color-onprimary) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-alt': 'rgb(var(--color-surface-alt) / <alpha-value>)',
        'surface-strong': 'rgb(var(--color-surface-strong) / <alpha-value>)',
        onsurface: 'rgb(var(--color-onsurface) / <alpha-value>)',
        outline: 'rgb(var(--color-outline) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};

export default config;
