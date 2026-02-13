import React, { useRef } from 'react';

export type PoppinTagAlign = 'start' | 'center' | 'end';
export type PoppinTagTone = 'blue' | 'green' | 'violet';

export type PoppinTagProps = {
  text: string;

  align?: PoppinTagAlign;
  tone?: PoppinTagTone;

  /** 의미적 상태만 유지 (외형 변화 없음) */
  selected?: boolean;

  /** 시각 유지 + 인터랙션만 off */
  disabled?: boolean;

  rotate?: number;
  strength?: number;
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default function PoppinTag({
  text,
  align = 'start',
  tone = 'violet',
  selected = false, // 의미만 유지
  disabled = false,
  rotate = 0,
  strength = 1,
}: PoppinTagProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const setVars = (mx: number, my: number, a: 0 | 1) => {
    if (!ref.current) return;
    ref.current.style.setProperty('--mx', String(mx));
    ref.current.style.setProperty('--my', String(my));
    ref.current.style.setProperty('--a', String(a));
  };

  const onPointerEnter = () => {
    if (disabled) return;
    setVars(0, 0, 1);
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (disabled || !ref.current) return;

    const r = ref.current.getBoundingClientRect();
    const mx = clamp((e.clientX - r.left) / r.width - 0.5, -0.5, 0.5);
    const my = clamp((e.clientY - r.top) / r.height - 0.5, -0.5, 0.5);

    setVars(mx, my, 1);
  };

  const onPointerLeave = () => {
    if (disabled) return;
    setVars(0, 0, 0);
  };

  return (
    <div
      ref={ref}
      className={[
        'poppinTag',
        `is-${align}`,
        `is-${tone}`,
        disabled ? 'is-disabled' : '',
      ].join(' ')}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={
        {
          ['--r' as any]: `${rotate}deg`,
          ['--str' as any]: strength,
        } as React.CSSProperties
      }
    >
      <span className='poppinTag-text'>{text}</span>

      {/* stroke + handles는 항상 존재 */}
      <span className='poppinTag-handle tl' />
      <span className='poppinTag-handle tr' />
      <span className='poppinTag-handle bl' />
      <span className='poppinTag-handle br' />

      <style>{css}</style>
    </div>
  );
}

const css = `
/* =============================
   Font
============================= */
@font-face{
  font-family: 'Ubuntu-Medium';
  src: url('../assets/fonts/Ubuntu-Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

/* =============================
   Base (ONE SIZE ONLY)
============================= */
.poppinTag{
  --mx: 0;
  --my: 0;
  --a: 0;

  /* ✅ 너가 조정하는 핵심 2개 */
  --strokeW: 4px;
  --handleSize: 8px;

  /* ✅ 텍스트 색: design-system 토큰 (서체/크기는 전용 유지) */
  --text: rgb(var(--color-onsurface));

  /* handle outer size = size + stroke*2 */
  --handleOuter: calc(var(--handleSize) + (var(--strokeW) * 2));

  position: relative;
  display: inline-block;

  background: transparent;

  /* ✅ outline 대신 box-shadow로 “정밀한 외곽 stroke” 구현 (밀림 현상 크게 감소) */
  box-shadow: 0 0 0 var(--strokeW) var(--stroke);

  padding: 4px 8px;

  transform:
    translate3d(
      calc(var(--mx) * 6px * var(--str) * var(--a)),
      calc(var(--my) * 4px * var(--str) * var(--a)),
      0
    )
    rotate(calc(
      var(--r)
      + (var(--mx) * 1.2deg * var(--a))
      + (var(--my) * -1deg * var(--a))
    ));

  transition: transform 90ms ease-out;
  will-change: transform;

  pointer-events: auto;
  border-radius: 0;
}

/* =============================
   Typography
============================= */
.poppinTag-text{
  font-family: 'Ubuntu-Medium';
  font-weight: 500;
  font-style: italic;

  letter-spacing: -0.02em;
  white-space: nowrap;

  color: var(--text);
  font-size: 60px;
  line-height: 1.1;
}

/* =============================
   Tone (stroke only)
============================= */
.poppinTag.is-blue{ --stroke: #3b82f6; }
.poppinTag.is-green{ --stroke: #22c55e; }
.poppinTag.is-violet{ --stroke: #8b5cf6; }

/* =============================
   Disabled overrides (opacity 말고 색상 지정)
============================= */
.poppinTag.is-disabled{
  --stroke: #ededed;
  --text: rgb(var(--color-disabled));
  pointer-events: none;
}

/* =============================
   Handles (CORNER CENTERED, 안정적인 방식)
   - 코너에 left/top = 0 놓고, transform으로 반만 밀기
   - half 계산에 의존하지 않아서 더 “픽셀 안정적”
============================= */
.poppinTag-handle{
  position: absolute;

  /* ✅ 바깥 크기(outer)를 고정하고 border는 안쪽으로 먹게 */
  width: var(--handleOuter);
  height: var(--handleOuter);
  box-sizing: border-box;

  background: #ffffff;
  border: var(--strokeW) solid var(--stroke);
  border-radius: 0;
}

.poppinTag-handle.tl{
  left: 0;
  top: 0;
  transform: translate(-50%, -50%);
}
.poppinTag-handle.tr{
  right: 0;
  top: 0;
  transform: translate(50%, -50%);
}
.poppinTag-handle.bl{
  left: 0;
  bottom: 0;
  transform: translate(-50%, 50%);
}
.poppinTag-handle.br{
  right: 0;
  bottom: 0;
  transform: translate(50%, 50%);
}

/* =============================
   테마(light/dark) 반영 (텍스트는 --color-onsurface/--color-disabled 토큰으로 자동 전환)
============================= */
:root[data-theme='dark'] .poppinTag.is-blue{ --stroke: #60a5fa; }
:root[data-theme='dark'] .poppinTag.is-green{ --stroke: #4ade80; }
:root[data-theme='dark'] .poppinTag.is-violet{ --stroke: #a78bfa; }
:root[data-theme='dark'] .poppinTag.is-disabled{
  --stroke: rgba(255,255,255,0.25);
}
:root[data-theme='dark'] .poppinTag-handle{
  background: #1a1a1e;
}

/* =============================
   Reduced motion
============================= */
@media (prefers-reduced-motion: reduce){
  .poppinTag{
    transform: none;
    transition: none;
  }
}
`;
