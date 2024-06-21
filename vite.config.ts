import { defineConfig } from 'vite'; // Vite 설정을 정의하기 위한 함수
import react from '@vitejs/plugin-react'; // React 플러그인을 가져오기
import { VitePWA } from 'vite-plugin-pwa'; // Vite PWA 플러그인을 가져오기
import path from 'path'; // 경로 모듈을 가져오기

export default defineConfig({
  plugins: [
    react(), // React 플러그인 사용 설정
    VitePWA({
      // PWA 설정
      manifest: {
        name: '나의 연봉 계산기', // PWA의 전체 이름
        short_name: '연봉 계산기', // PWA의 짧은 이름
        description: '나의 연봉 계산기를 통해 연봉 계산을 손쉽게 수행하세요.', // PWA에 대한 설명
        start_url: '/', // PWA가 시작될 URL
        display: 'standalone', // PWA가 standalone 모드로 실행되도록 설정
        background_color: '#303030', // PWA의 배경 색상
        theme_color: '#ebbd36', // PWA의 테마 색상
        icons: [
          {
            src: '/icons/icon-192x192.png', // 아이콘 경로
            sizes: '192x192', // 아이콘 크기
            type: 'image/png', // 아이콘 파일 형식
          },
          {
            src: '/icons/icon-512x512.png', // 아이콘 경로
            sizes: '512x512', // 아이콘 크기
            type: 'image/png', // 아이콘 파일 형식
          },
        ],
      },
      workbox: {
        // Workbox를 사용한 캐싱 설정
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document', // 문서 요청에 대한 캐싱 설정
            handler: 'NetworkFirst', // 네트워크 우선 전략 사용
            options: {
              cacheName: 'html-cache', // 캐시 이름
              networkTimeoutSeconds: 10, // 네트워크 타임아웃 시간 설정 (초)
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image', // 이미지 요청에 대한 캐싱 설정
            handler: 'CacheFirst', // 캐시 우선 전략 사용
            options: {
              cacheName: 'image-cache', // 캐시 이름
              expiration: {
                maxEntries: 10, // 최대 캐시 항목 수
                maxAgeSeconds: 30 * 24 * 60 * 60, // 캐시 만료 시간 설정 (30일)
              },
            },
          },
          {
            urlPattern: ({ request }) =>
              request.destination === 'script' ||
              request.destination === 'style', // 스크립트 및 스타일 요청에 대한 캐싱 설정
            handler: 'StaleWhileRevalidate', // 유효성 검사와 함께 캐시된 데이터를 반환하는 전략 사용
            options: {
              cacheName: 'static-resources', // 캐시 이름
              expiration: {
                maxEntries: 20, // 최대 캐시 항목 수
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false, // 개발 중에는 PWA 캐싱을 비활성화
      },
      registerType: 'prompt', // 'autoUpdate'에서 'prompt'로 변경, 업데이트 시 사용자에게 알림
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // '@'를 사용하여 src 디렉터리를 참조하도록 설정
    },
  },
  define: {
    'process.env': {
      VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY,
      VITE_FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID,
      VITE_FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      VITE_FIREBASE_MESSAGING_SENDER_ID:
        process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      VITE_FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID,
      VITE_FIREBASE_MEASUREMENT_ID: process.env.VITE_FIREBASE_MEASUREMENT_ID,
      VITE_VAPID_PUBLIC_KEY: process.env.VITE_VAPID_PUBLIC_KEY,
    },
  },
  server: {
    port: 5173, // 개발 서버 포트 설정
  },
});
