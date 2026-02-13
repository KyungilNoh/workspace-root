'use client';

import { useRef, useEffect } from 'react';

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

export default function LocationMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;
    script.onload = () => {
      const naver = window.naver;
      if (!naver || !mapRef.current) return;
      const center = new naver.maps.LatLng(37.359218, 126.945801);
      const map = new naver.maps.Map(mapRef.current, { center, zoom: 16 });
      new naver.maps.Marker({ position: center, map });
    };
    document.head.appendChild(script);
    return () => script.remove();
  }, [clientId]);

  return (
    <div
      ref={mapRef}
      className="h-[360px] w-full rounded-xl border border-slate-200"
    />
  );
}
