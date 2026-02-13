// app-shell/src/pages/Overview.tsx

import React from 'react';
import PoppinTagSection from '../sections/PoppinTagSection';
import TestSection from '../sections/TestSection';

const styles = {
  pageContainer: {
    width: '100%',
    backgroundColor: '#000',
  },
  section: {
    position: 'relative' as const,
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
  },
};

export default function Overview() {
  return (
    <div className='overviewPage'>
      <style>{`
        .overviewSection + .overviewSection {
          border-top: 12px solid rgb(var(--color-surface-alt));
        }
      `}</style>
      <section className='overviewSection'>
        <PoppinTagSection to='/' />
      </section>
      <section className='overviewSection'>
        <TestSection />
      </section>
    </div>
  );
}