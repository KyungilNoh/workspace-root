// app-shell/src/sections/PoppinTagSection.tsx

import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import PoppinTag, { type PoppinTagTone } from '../components/PoppinTag';
// @ts-ignore
import characterImg from '../assets/characters/nohk.png';

type RowTag = {
  id: string;
  text: string;

  tone?: PoppinTagTone;
  selected?: boolean;
  disabled?: boolean;

  strength?: number;

  /** 태그 개별 이동 (없으면 섹션 to 사용) */
  to?: string;
};

type TagRow = {
  /** 아래부터 1,2,3... (1이 가장 아래 줄) */
  stack: number;
  tags: RowTag[];

  shiftX?: number;
  justify?: 'start' | 'center' | 'end';
};

type PoppinTagSectionProps = {
  to: string;
  rows?: TagRow[];

  baseWidth?: number;
  baseHeight?: number;

  uiScaleMin?: number;
  uiScaleMax?: number;

  /** 전체 톤 조절 (1 = 100%) */
  scaleFactor?: number;

  rowGap?: number;
  tagGap?: number;
  stackBottomGap?: number;

  padTop?: number;
  padX?: number;

  tagBleed?: number;

  /** ✅ 상단 좌측 텍스트 (원하면 override) */
  topLeft?: React.ReactNode;

  /** ✅ 상단 패딩(px) */
  topPadY?: number;
  topPadX?: number;
};

type HeartColor = 'red' | 'pink' | 'orange' | 'yellow' | 'green' | 'blue' | 'violet';

const HEART_COLORS: HeartColor[] = ['red', 'pink', 'orange', 'yellow', 'green', 'blue', 'violet'];

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * ✅ heart pop: 클릭 위치에서 생성 + 불규칙한 웨이브로 위로 상승
 * - 손 커서는 위(z-index 더 큼), 하트는 뒤(z-index 더 작음)
 * - 색상은 랜덤으로 바뀜
 */
function spawnHeart(x: number, y: number) {
  const el = document.createElement('div');
  el.className = `heart-pop is-${pick(HEART_COLORS)}`;
  el.textContent = '❤';

  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  const dx1 = (Math.random() * 2 - 1) * 18;
  const dx2 = (Math.random() * 2 - 1) * 26;
  const dx3 = (Math.random() * 2 - 1) * 34;
  const dy = 110 + Math.random() * 50;
  const rot = (Math.random() * 2 - 1) * 18;

  el.style.setProperty('--dx1', `${dx1}px`);
  el.style.setProperty('--dx2', `${dx2}px`);
  el.style.setProperty('--dx3', `${dx3}px`);
  el.style.setProperty('--dy', `${dy}px`);
  el.style.setProperty('--rot', `${rot}deg`);

  document.body.appendChild(el);

  const remove = () => {
    el.removeEventListener('animationend', remove);
    el.remove();
  };
  el.addEventListener('animationend', remove);
}

export default function PoppinTagSection({
  to,
  rows,

  baseWidth = 1200,
  baseHeight = 700,

  uiScaleMin = 0.75,
  uiScaleMax = 6,

  scaleFactor = 1.0,

  rowGap = 10,
  tagGap = 10,
  stackBottomGap = 10,

  padTop = 56,
  padX = 48,

  tagBleed = 6,

  topLeft,
  topPadY = 28,
  topPadX = 40,
}: PoppinTagSectionProps) {
  const navigate = useNavigate();

  const sectionRef = useRef<HTMLElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  const fallbackRows: TagRow[] = useMemo(
    () => [
      {
        stack: 1,
        shiftX: 0,
        tags: [
          { id: 'radio', text: 'Radio', tone: 'violet' },
          { id: 'chip', text: 'Chip', tone: 'violet', selected: true },
          { id: 'toggle', text: 'Toggle', tone: 'violet' },
        ],
      },
      {
        stack: 2,
        shiftX: -40,
        tags: [
          { id: 'lnb', text: 'LNB', tone: 'violet', selected: true },
          { id: 'iconography', text: 'Iconography', tone: 'violet', disabled: true },
          { id: 'checkbox', text: 'Checkbox', tone: 'violet', disabled: true },
        ],
      },
      {
        stack: 3,
        shiftX: 30,
        tags: [
          { id: 'search', text: 'Search Bar', tone: 'violet', selected: true },
          { id: 'input', text: 'Input', tone: 'violet' },
          { id: 'switch', text: 'Switch', tone: 'violet', to: '/ds/switch' },
          { id: 'tabs', text: 'Tabs', tone: 'violet' },
        ],
      },
      {
        stack: 4,
        shiftX: 0,
        tags: [
          { id: 'layout_disabled', text: 'Layout', tone: 'violet', disabled: true },
          { id: 'iconography2_disabled', text: 'Iconography', tone: 'violet', disabled: true },
          { id: 'tooltip', text: 'Tooltip', tone: 'violet' },
        ],
      },
      {
        stack: 5,
        shiftX: 0,
        tags: [
          { id: 'palettes', text: 'Palettes', tone: 'blue', selected: true },
          { id: 'layout2_disabled', text: 'Layout', tone: 'violet', disabled: true },
          { id: 'card', text: 'Card', tone: 'violet', selected: true },
        ],
      },
    ],
    []
  );

  const sortedRows: TagRow[] = useMemo(() => {
    const src = rows?.length ? rows : fallbackRows;
    if (!rows?.length) return src;
    return [...src].sort((a, b) => a.stack - b.stack);
  }, [rows, fallbackRows]);

  const handleTagClick = (tag?: RowTag) => {
    if (!tag || tag.disabled) return;
    navigate(tag.to ?? to);
  };

  /**
   * ✅ wave 모드(👋 커서) 토글
   * FIX: wave 해제 시 섹션 안에 있으면 xray 커서를 다시 켠다.
   */
  const setWaveMode = (on: boolean) => {
    const sectionEl = sectionRef.current;
    const cursorEl = cursorRef.current;
    if (!sectionEl) return;

    if (on) {
      sectionEl.classList.add('cursor-wave');
      cursorEl?.classList.remove('is-visible', 'is-hover');
      return;
    }

    sectionEl.classList.remove('cursor-wave');

    if (sectionEl.classList.contains('has-xray-cursor')) {
      cursorEl?.classList.add('is-visible');

      const { x, y } = pointerRef.current;
      if (cursorEl) {
        cursorEl.style.left = `${x}px`;
        cursorEl.style.top = `${y}px`;
      }
      sectionEl.style.setProperty('--cursor-x', `${x}px`);
      sectionEl.style.setProperty('--cursor-y', `${y}px`);
    }
  };

  const handleHeartPop = () => {
    const { x, y } = pointerRef.current;
    spawnHeart(x, y);
  };

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const cursorEl = cursorRef.current;
    if (!sectionEl || !cursorEl) return;

    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (isTouch) return;

    const cleanupAll = () => {
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      cursorEl.classList.remove('is-visible', 'is-hover');
      sectionEl.classList.remove('has-xray-cursor');
      setWaveMode(false);
    };

    // ✅ FIX: 외부앱(전화/메일) 모달로 blur 발생 시 상태를 "날리지" 말고 표시만 끔
    const softHideOnBlur = () => {
      cursorEl.classList.remove('is-visible', 'is-hover');
    };

    // ✅ FIX: 모달 닫고 다시 focus 되면, 포인터가 섹션 내부면 xray 복구
    const restoreOnFocus = () => {
      const { x, y } = pointerRef.current;
      const rect = sectionEl.getBoundingClientRect();

      const isInside =
        x >= rect.left && x <= rect.right &&
        y >= rect.top && y <= rect.bottom;

      if (!isInside) return;

      sectionEl.classList.add('has-xray-cursor');

      if (!sectionEl.classList.contains('cursor-wave')) {
        cursorEl.classList.add('is-visible');
        cursorEl.style.left = `${x}px`;
        cursorEl.style.top = `${y}px`;
      }
    };

    const setPos = () => {
      rafRef.current = null;
      const { x, y } = pointerRef.current;

      cursorEl.style.left = `${x}px`;
      cursorEl.style.top = `${y}px`;

      sectionEl.style.setProperty('--cursor-x', `${x}px`);
      sectionEl.style.setProperty('--cursor-y', `${y}px`);
    };

    const onEnter = () => {
      cursorEl.classList.add('is-visible');
      sectionEl.classList.add('has-xray-cursor');
    };

    const onLeave = () => {
      cleanupAll();
    };

    const onMove = (e: MouseEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;

      if (rafRef.current == null) {
        rafRef.current = window.requestAnimationFrame(setPos);
      }
    };

    sectionEl.addEventListener('mouseenter', onEnter);
    sectionEl.addEventListener('mouseleave', onLeave);
    sectionEl.addEventListener('mousemove', onMove, { passive: true });

    window.addEventListener('blur', softHideOnBlur);
    window.addEventListener('focus', restoreOnFocus);

    return () => {
      sectionEl.removeEventListener('mouseenter', onEnter);
      sectionEl.removeEventListener('mouseleave', onLeave);
      sectionEl.removeEventListener('mousemove', onMove);

      window.removeEventListener('blur', softHideOnBlur);
      window.removeEventListener('focus', restoreOnFocus);

      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;

      cleanupAll();
    };
  }, []);

  const fallbackTopLeft = (
    <div className='poppinTagTopBlock'>
      <div className='poppinTagTopTitle'>UX/UI DESIGN</div>
      <div className='poppinTagTopDesc'>/13+ YEARS EXP. (2026)</div>
      <div className='poppinTagTopDesc'>
        <a
          href='mailto:wildnokall@gmail.com'
          className='poppinTagTopLink'
          aria-label='Send email to wildnokall@gmail.com'
        >
          /WILDNOKALL@GMAIL.COM
        </a>
      </div>
      <div className='poppinTagTopDesc'>
        <a
          href='tel:+821090824238'
          className='poppinTagTopLink'
          aria-label='Call +82 10 9082 4238'
        >
          /+821090824238
        </a>
      </div>
      <button
        type='button'
        className='poppinTagTopMeta is-wave'
        onPointerEnter={() => setWaveMode(true)}
        onPointerLeave={() => setWaveMode(false)}
        onPointerMove={(e) => {
          pointerRef.current.x = e.clientX;
          pointerRef.current.y = e.clientY;
        }}
        onClick={handleHeartPop}
        aria-label='Wave and send a heart'
      >
        /BY KYUNGIL NOH
      </button>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className='poppinTagSection'
      style={
        {
          ['--baseW' as any]: `${baseWidth}px`,
          ['--baseH' as any]: `${baseHeight}px`,
          ['--uiScaleMin' as any]: uiScaleMin,
          ['--uiScaleMax' as any]: uiScaleMax,
          ['--scaleFactor' as any]: scaleFactor,

          ['--rowGap' as any]: `${rowGap}px`,
          ['--tagGap' as any]: `${tagGap}px`,
          ['--stackBottomGap' as any]: `${stackBottomGap}px`,

          ['--padTop' as any]: `${padTop}px`,
          ['--padX' as any]: `${padX}px`,

          ['--tagBleed' as any]: `${tagBleed}px`,

          ['--topPadY' as any]: `${topPadY}px`,
          ['--topPadX' as any]: `${topPadX}px`,
        } as React.CSSProperties
      }
    >
      <div ref={cursorRef} className='poppinTagSection-xrayCursor' aria-hidden='true' />

      <div className='poppinTagSection-top' aria-label='Section header'>
        <div className='poppinTagSection-topLeft'>{topLeft ?? fallbackTopLeft}</div>
      </div>

      <div className='poppinTagSection-stage'>
        <div className='poppinTagSection-stack'>
          {sortedRows.map((row) => (
            <div
              key={row.stack}
              className={[
                'poppinTagSection-row',
                row.justify ? `is-${row.justify}` : 'is-center',
              ].join(' ')}
              style={{ ['--rowShiftX' as any]: `${row.shiftX ?? 0}px` } as React.CSSProperties}
            >
              {row.tags.map((t) => (
                <button
                  key={`${row.stack}:${t.id}`}
                  type='button'
                  className={['poppinTagSection-hit', t.disabled ? 'is-disabled' : ''].join(' ')}
                  onClick={() => handleTagClick(t)}
                  onPointerEnter={() => cursorRef.current?.classList.add('is-hover')}
                  onPointerLeave={() => cursorRef.current?.classList.remove('is-hover')}
                  disabled={t.disabled}
                  aria-label={t.text}
                >
                  <PoppinTag
                    text={t.text}
                    tone={t.tone}
                    selected={t.selected}
                    disabled={t.disabled}
                    strength={t.strength}
                  />
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className='poppinTagSection-characterWrap' aria-hidden='true'>
          <img src={characterImg} alt='' draggable={false} />
        </div>
      </div>

      <style>{css}</style>
    </section>
  );
}

const css = `
.poppinTagSection{
  position: relative;
  width: 100%;
  overflow: hidden;
  background: rgb(var(--color-surface));
  transition: background-color 0.35s ease;

  height: 100vh;
  height: 100svh;
  height: 100dvh;

  cursor: default;
  isolation: isolate;

  --baseW: 1200px;
  --baseH: 700px;

  --vh: 100vh;

  --cursorSize: 24px;
  --cursorSizeHover: 48px;
  --xrayCursorColor: #dd2636;

  --emojiSize: 32px;

  --topPadY: 28px;
  --topPadX: 40px;

  --uiScale: clamp(
    var(--uiScaleMin),
    calc(var(--vh) / var(--baseH)),
    var(--uiScaleMax)
  );
}

/* ✅ 다크 테마: xray 커서 색만 오버라이드 (배경은 design-system --color-surface 사용) */
:root[data-theme='dark'] .poppinTagSection{
  --xrayCursorColor: #ff4466;
}

@supports (height: 100svh){
  .poppinTagSection{ --vh: 100svh; }
}
@supports (height: 100dvh){
  .poppinTagSection{ --vh: 100dvh; }
}

.poppinTagSection.has-xray-cursor{
  cursor: none;
}

.poppinTagSection-xrayCursor{
  position: fixed;
  left: 0;
  top: 0;

  width: var(--cursorSize);
  height: var(--cursorSize);
  border-radius: 999px;

  background: var(--xrayCursorColor);
  mix-blend-mode: difference;

  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 100;

  opacity: 0;
  transition:
    opacity 120ms ease,
    width 180ms ease,
    height 180ms ease;
}
.poppinTagSection-xrayCursor.is-visible{
  opacity: 1;
}
.poppinTagSection-xrayCursor.is-hover{
  width: var(--cursorSizeHover);
  height: var(--cursorSizeHover);
}

/* ✅ wave 모드에서는 xray 커서를 숨김 (보험) */
.poppinTagSection.cursor-wave .poppinTagSection-xrayCursor{
  opacity: 0 !important;
}

/* wave 모드에서는 기본 커서 숨김 */
.poppinTagSection.cursor-wave,
.poppinTagSection.cursor-wave *{
  cursor: none !important;
}

/* ✅ TOP */
.poppinTagSection-top{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  padding: var(--topPadY) var(--topPadX);
  z-index: 10;

  pointer-events: none;
}

.poppinTagSection-topLeft {
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: auto;
}

.poppinTagTopBlock{
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.poppinTagTopTitle{
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 14px;
  font-weight: 600;
  color: rgba(0,0,0,0.9);
}
.poppinTagTopDesc{
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 14px;
  font-weight: 300;
  color: rgba(0,0,0,0.6);
}
.poppinTagTopMeta{
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 14px;
  font-weight: 300;
  color: rgba(0,0,0,0.6);

  border: 0;
  background: transparent;
  padding: 0;
  margin: 0;
  text-align: left;
  align-self: flex-start;

  cursor: pointer;
  pointer-events: auto;
}

:root[data-theme='dark'] .poppinTagSection .poppinTagTopTitle{
  color: rgba(255,255,255,0.95);
}
:root[data-theme='dark'] .poppinTagSection .poppinTagTopDesc,
:root[data-theme='dark'] .poppinTagSection .poppinTagTopMeta{
  color: rgba(255,255,255,0.65);
}

.poppinTagTopLink{
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
  text-decoration: none;
  cursor: inherit; /* 또는 아예 명시 안 해도 됨 */
}
.poppinTagTopLink:hover{
  text-decoration: underline;
}

/* ✅ STAGE */
.poppinTagSection-stage{
  position: absolute;
  left: 50%;
  bottom: 0;

  width: var(--baseW);
  height: var(--baseH);

  transform: translateX(-50%) scale(calc(var(--uiScale) * var(--scaleFactor)));
  transform-origin: 50% 100%;
  will-change: transform;
}

/* ✅ TAG STACK */
.poppinTagSection-stack{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;

  display: flex;
  flex-direction: column;
  gap: var(--rowGap);

  padding: var(--padTop) var(--padX) var(--stackBottomGap);
}

.poppinTagSection-row{
  display: flex;
  align-items: center;
  gap: var(--tagGap);
  justify-content: center;
  transform: translateX(var(--rowShiftX));
}
.poppinTagSection-row.is-start{ justify-content: flex-start; }
.poppinTagSection-row.is-center{ justify-content: center; }
.poppinTagSection-row.is-end{ justify-content: flex-end; }

.poppinTagSection-hit{
  appearance: none;
  border: 0;
  margin: 0;
  background: transparent;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  padding: var(--tagBleed);
  flex: 0 0 auto;
}

.poppinTagSection.has-xray-cursor .poppinTagSection-hit{
  cursor: none;
}

.poppinTagSection-hit.is-disabled,
.poppinTagSection-hit:disabled{
  cursor: default;
}

/* ✅ CHARACTER */
.poppinTagSection-characterWrap{
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.poppinTagSection-characterWrap img{
  position: absolute;
  left: 50%;
  bottom: 0;

  height: 100%;
  width: auto;

  transform: translateX(-50%);
  display: block;

  user-select: none;
  -webkit-user-drag: none;
}

/* 👋 wave cursor */
.poppinTagSection.cursor-wave::after{
  content: '👋';
  position: fixed;
  left: var(--cursor-x);
  top: var(--cursor-y);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 100;

  font-size: var(--emojiSize);
  line-height: 1;
}

/* ❤ heart pop */
.heart-pop{
  position: fixed;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 100;

  font-size: 20px;
  line-height: 1;

  animation: heartPopWave 3000ms ease-out forwards;
  will-change: transform, opacity;
}

.heart-pop.is-red{ color: #ff2d55; }
.heart-pop.is-pink{ color: #ff5fa2; }
.heart-pop.is-orange{ color: #ff8a00; }
.heart-pop.is-yellow{ color: #ffd000; }
.heart-pop.is-green{ color: #19c37d; }
.heart-pop.is-blue{ color: #2f7cff; }
.heart-pop.is-violet{ color: #7c3aed; }

@keyframes heartPopWave{
  0%{
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.7) rotate(0deg);
  }
  12%{
    opacity: 1;
    transform: translate(calc(-50% + var(--dx1)), calc(-50% - 18px)) scale(1) rotate(var(--rot));
  }
  45%{
    opacity: 1;
    transform: translate(calc(-50% + var(--dx2)), calc(-50% - (var(--dy) * 0.55))) scale(1.05) rotate(var(--rot));
  }
  78%{
    opacity: 0.75;
    transform: translate(calc(-50% + var(--dx3)), calc(-50% - (var(--dy) * 0.9))) scale(1.1) rotate(var(--rot));
  }
  100%{
    opacity: 0;
    transform: translate(calc(-50% + var(--dx3)), calc(-50% - var(--dy))) scale(1.15) rotate(var(--rot));
  }
}

.poppinTagTopMeta.is-wave{
  cursor: none !important;
}
`;