'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const BACKGROUND_IMAGES = ['/hero-bg.jpg', '/hero-bg-2.jpg', '/hero-bg-3.jpg'];
const SLIDE_INTERVAL_MS = 5000;

const HEADLINE_STYLE = {
  fontSize: 'clamp(2rem, 5.5vw, 8rem)',
  lineHeight: 1,
} as const;

export default function HeroSection02() {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setBgIndex((i) => (i + 1) % BACKGROUND_IMAGES.length),
      SLIDE_INTERVAL_MS
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="hero"
      className="relative h-[calc(100dvh-4rem)] min-h-[calc(100vh-4rem)] w-full overflow-hidden"
    >
      {BACKGROUND_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 overflow-hidden transition-opacity duration-1000"
          style={{ opacity: i === bgIndex ? 1 : 0, zIndex: 0 }}
        >
          <div
            className="absolute inset-0"
            style={
              i === bgIndex
                ? { animation: 'heroBgZoom 5s linear forwards' }
                : undefined
            }
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>
      ))}
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes heroBgZoom{from{transform:scale(1)}to{transform:scale(1.12)}}`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
        }}
      />

      <div className="relative z-10 section-inner flex h-full flex-col justify-between pb-24 pt-20">
        <div className="relative h-10 w-28 shrink-0 md:h-12 md:w-36">
          <Image
            src="/hero-logo-w.png"
            alt=""
            fill
            className="object-contain object-left"
            sizes="(max-width: 768px) 112px, 144px"
          />
        </div>

        <div
          className="flex max-w-2xl flex-col items-start text-white"
          style={{ gap: 'clamp(0.75rem, 2vw, 1.5rem)' }}
        >
          <span
            className="font-gothic-neo font-medium tracking-tight text-white whitespace-nowrap"
            style={{
              fontSize: HEADLINE_STYLE.fontSize,
              lineHeight: HEADLINE_STYLE.lineHeight,
            }}
          >
            For
            <br />
            Better Living
          </span>
          <p
            className="max-w-lg leading-relaxed text-white/95 font-light"
            style={{ fontSize: 'clamp(0.8125rem, 1.25vw, 1.375rem)' }}
          >
            경기도 안양시 No.1 아파트 금정역호계푸르지오
            <br />
            모두가 꿈꾸는 아파트입니다.
          </p>
        </div>
      </div>
    </section>
  );
}
