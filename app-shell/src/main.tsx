// app-shell/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './AppShell';
import { DSFramePage, PropFramePage } from '../Frame';
import Overview from './pages/Overview';
import './index.css';
import './AppShell.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          {/* 메인 캔버스 섹션들 */}
          <Route index element={<Overview />} />

          <Route path="/ds/*" element={<DSFramePage />} />
          <Route path="/prop." element={<PropFramePage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);