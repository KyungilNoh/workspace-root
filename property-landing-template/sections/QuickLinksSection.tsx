import Link from 'next/link';
import Image from 'next/image';
import { SectionHeader } from '@your-org/design-system';

const QUICK_LINKS = [
  { href: '/overview', eyebrow: 'overview', title: '개요' },
  { href: '/unit-plan', eyebrow: 'unit information', title: '세대안내' },
  { href: '/environment', eyebrow: 'location advantages', title: '입지환경' },
];

export default function QuickLinksSection() {
  return (
    <section id="quick-links" className="section-shell bg-surface">
      <div className="section-inner section-pad border-b border-outline">
        <SectionHeader
          title="QuickLinksSection"
          description="보고 싶은 정보를 바로 확인해 보세요."
          align="left"
        />
      </div>

      <div className="relative w-full overflow-hidden min-h-[320px] md:min-h-[600px]">
        <Image
          src="/quicklinkssection-bg.jpg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="relative section-inner border-t border-x border-white/40">
          <div className="flex min-h-[320px] flex-col md:min-h-[600px] md:flex-row">
            <div className="hidden h-full min-h-[600px] w-px shrink-0 bg-white/40 md:block" aria-hidden />
            {QUICK_LINKS.map((item, i) => (
              <span key={item.href} className="flex flex-1 flex-col md:flex-row md:contents">
                {i > 0 && (
                  <div
                    className="hidden h-full min-h-[600px] w-px shrink-0 bg-white/40 md:block"
                    aria-hidden
                  />
                )}
                <Link
                  href={item.href}
                  className={[
                    'group relative flex min-h-[160px] w-full flex-1 items-center justify-center border-b border-white/40 md:min-h-[600px] md:border-b-0',
                    'text-white overflow-hidden',
                    i === QUICK_LINKS.length - 1 ? 'border-b-0' : '',
                  ].join(' ')}
                >
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />
                  <div className="relative z-10 px-6 text-center transition-transform duration-500 group-hover:-translate-y-2">
                    <div className="text-lg font-semibold opacity-90">{item.eyebrow}</div>
                    <div className="mt-3 text-4xl font-extrabold tracking-tight">{item.title}</div>
                  </div>
                </Link>
              </span>
            ))}
            <div className="hidden h-full min-h-[600px] w-px shrink-0 bg-white/40 md:block" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
