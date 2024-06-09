import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // 정적 파일 디렉토리
  build: {
    outDir: 'dist', // 빌드 결과물 디렉토리
  },
});
