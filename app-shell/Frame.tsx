// app-shell/Frame.tsx
/// <reference types="vite/client" />

import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';

const DS_ORIGIN = import.meta.env.VITE_DS_ORIGIN || 'http://localhost:5175';
const PROP_ORIGIN = import.meta.env.VITE_PROP_ORIGIN || 'http://localhost:3000';

interface FrameProps {
  src: string;
}

export default function Frame({ src }: FrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoad = () => {
    try {
      iframeRef.current?.contentWindow?.focus();
    } catch {
      // cross-origin
    }
  };

  return (
    <div className='frame'>
      <iframe
        ref={iframeRef}
        className='frameIframe'
        src={src}
        title='embedded-app'
        loading='eager'
        referrerPolicy='no-referrer'
        allow='clipboard-read; clipboard-write'
        onLoad={handleLoad}
      />
    </div>
  );
}

export function DSFramePage() {
  const { pathname } = useLocation();
  const subpath = pathname.replace(/^\/ds/, '') || '/';
  const src = `${DS_ORIGIN}${subpath}`;
  return <Frame src={src} />;
}

export function PropFramePage() {
  React.useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = PROP_ORIGIN;
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  return <Frame src={PROP_ORIGIN} />;
}
