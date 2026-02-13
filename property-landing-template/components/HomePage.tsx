'use client';

import { useEffect } from 'react';
import HeroSection from '@/sections/HeroSection';
import HeroSection02 from '@/sections/HeroSection02';
import QuickLinksSection from '@/sections/QuickLinksSection';
import ContactSection from '@/sections/ContactSection';

const SCROLL_KEY = 'scrollToContact';

export default function HomePage() {
  useEffect(() => {
    if (typeof sessionStorage === 'undefined' || sessionStorage.getItem(SCROLL_KEY) !== '1') return;
    sessionStorage.removeItem(SCROLL_KEY);
    const el = document.getElementById('contact');
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }, []);

  return (
    <>
      <HeroSection />
      <HeroSection02 />
      <QuickLinksSection />
      <ContactSection />
    </>
  );
}
