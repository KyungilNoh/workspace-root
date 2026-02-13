import Image from 'next/image';

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden min-h-[calc(100vh-4rem)] h-[calc(100dvh-4rem)]"
    >
      <Image
        src="/hero-bg.jpg"
        alt=""
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-4 md:px-6 lg:px-8">
        <div className="section-inner flex w-full max-w-full flex-col items-center justify-center gap-8 md:flex-row md:items-center md:justify-between md:gap-16">
          <p className="text-center text-xs font-light text-white/80 md:flex-1 md:text-right md:text-sm lg:text-base">
            <span className="tracking-[0.6em]">새로운 랜드마크</span>
          </p>
          <div className="relative flex shrink-0 items-center justify-center w-[180px] md:w-[260px] lg:w-[320px] h-[80px] md:h-[120px] lg:h-[140px]">
            <Image
              src="/hero-logo-w.png"
              alt=""
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 180px, (max-width: 1024px) 260px, 320px"
            />
          </div>
          <p className="text-center text-xs font-light text-white/80 md:flex-1 md:text-left md:text-sm lg:text-base">
            <span className="tracking-[0.6em]">금정역 호계</span>
          </p>
        </div>
      </div>
    </section>
  );
}
