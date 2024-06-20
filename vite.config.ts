import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: './', // 기본 루트 디렉토리
  publicDir: 'public', // 정적 파일 디렉토리
  build: {
    outDir: 'dist', // 빌드 결과물 디렉토리
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
});
