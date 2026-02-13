// app-shell/src/sections/TestSection.tsx

import React from 'react';

export default function TestSection() {
  return (
    <section className='test-section'>
      <h1 className='test-title'>Man&apos;s Cave</h1>
      <style>{`
        .test-section {
          height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgb(var(--color-surface));
          color: rgb(var(--color-onsurface));
        }
        .test-title {
          margin: 0;
          font-size: 56px;
          letter-spacing: -0.04em;
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .test-title { font-size: 40px; }
        }
      `}</style>
    </section>
  );
}
