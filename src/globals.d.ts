// src/globals.d.ts
declare module 'virtual:pwa-register' {
  export function registerSW(options?: RegisterSWOptions): void;

  export interface RegisterSWOptions {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
  }
}
