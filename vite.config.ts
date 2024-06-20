import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: '나의 연봉 계산기',
        short_name: '연봉 계산기',
        description: '나의 연봉 계산기를 통해 연봉 계산을 손쉽게 수행하세요.',
        start_url: '/',
        display: 'standalone',
        background_color: '#303030',
        theme_color: '#ebbd36',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
      registerType: 'autoUpdate',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': process.env,
  },
  server: {
    port: 5173,
  },
});
