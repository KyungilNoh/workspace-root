'use client';

import { FormEvent, useCallback, useRef, useState, useEffect } from 'react';
import {
  Button,
  Input,
  Label,
  SectionHeader,
  Textarea,
} from '@your-org/design-system';

const MAP_CENTER = { lat: 37.359218, lng: 126.945801 };
const MAP_ZOOM = 16;

const OFFICE = {
  name: '분양 오피스',
  address: '서울시 중구 세종대로 73 태평로빌딩 5층',
  tel: '02-6048-3700',
  email: 'contact@example.com',
} as const;

const OFFICE_FIELDS: { label: string; value: string }[] = [
  { label: '주소', value: OFFICE.address },
  { label: '전화번호', value: OFFICE.tel },
  { label: '이메일', value: OFFICE.email },
];

declare global {
  interface Window {
    naver?: {
      maps: {
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (el: HTMLElement, o: { center: unknown; zoom: number }) => unknown;
        Marker: new (o: { position: unknown; map: unknown }) => void;
      };
    };
  }
}

export default function ContactSection() {
  const [pending, setPending] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const naverClientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  const handleNaverMapLoad = useCallback(() => {
    const naver = window.naver;
    if (!naver || !mapRef.current) return;
    const center = new naver.maps.LatLng(MAP_CENTER.lat, MAP_CENTER.lng);
    const map = new naver.maps.Map(mapRef.current, { center, zoom: MAP_ZOOM });
    new naver.maps.Marker({ position: center, map });
  }, []);

  useEffect(() => {
    if (!naverClientId) return;
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverClientId}`;
    script.async = true;
    script.onload = handleNaverMapLoad;
    document.head.appendChild(script);
    return () => script.remove();
  }, [naverClientId, handleNaverMapLoad]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setPending(true);
      const form = e.currentTarget;
      const formData = new FormData(form);
      const payload = Object.fromEntries([...formData.entries()]);

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed');
        form.reset();
        window.alert('문의가 정상적으로 전송되었습니다. 최대한 빨리 회신드릴게요.');
      } catch {
        window.alert('문의 전송 중 오류가 발생했습니다.');
      } finally {
        setPending(false);
      }
    },
    []
  );

  return (
    <section id="contact" className="section-shell border-outline bg-surface-alt">
      <div className="section-inner section-pad">
        <SectionHeader eyebrow="Contact" title="ContactSection" />
        <div className="mb-10" />

        <div className="flex flex-col gap-10 md:flex-row md:items-stretch md:gap-12">
          <div className="min-w-0 md:min-w-[320px] md:max-w-[400px]">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <Input name="name" label="이름" placeholder="이름을 입력해주세요" />
                <Input
                  name="email"
                  type="email"
                  required
                  label="이메일 *"
                  placeholder="답변을 받을 이메일 주소"
                />
                <Input
                  name="phone"
                  label="연락처 (선택)"
                  placeholder="띄어쓰기나 하이픈 없이 숫자만 입력"
                />
                <Textarea
                  name="message"
                  label="문의 내용"
                  rows={4}
                  placeholder="특히 궁금한 내용이 등을 자유롭게 적어주세요."
                />
              </div>
              <div className="mt-2 flex items-center gap-3">
                <Button type="submit" size="md" disabled={pending}>
                  {pending ? '전송 중...' : '문의하기'}
                </Button>
              </div>
            </form>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Label as="p" variant="field" size="md">
              {OFFICE.name}
            </Label>
            <div className="overflow-hidden rounded-2xl border border-outline bg-surface shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
              <div className="relative min-h-[260px] overflow-hidden">
                <div
                  ref={mapRef}
                  className="h-full min-h-[260px] w-full"
                  aria-label="분양사무소 위치 지도"
                />
              </div>
              <div className="border-t border-outline bg-surface-alt px-5 py-4">
                <dl className="flex flex-col gap-2 text-sm">
                  {OFFICE_FIELDS.map(({ label, value }) => (
                    <div key={label}>
                      <span className="font-medium text-onsurface/70">{label}</span>
                      <p className="mt-0.5 text-onsurface">{value}</p>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
