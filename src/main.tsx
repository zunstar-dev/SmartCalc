// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerSW } from 'virtual:pwa-register';
import AppProviders from './AppProviders';
import { openExternalBrowser } from './helpers/openExternalBrowser';

// 인앱 (카카오 브라우저 대응)
openExternalBrowser();

// PWA 플러그인 서비스 워커 등록
registerSW({ immediate: true });
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
