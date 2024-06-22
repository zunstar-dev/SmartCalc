// src/helpers/openExternalBrowser.ts
export const openExternalBrowser = () => {
  const url = window.location.href.toString();

  const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = () => /Android/i.test(navigator.userAgent);
  const isKakaoBrowser = () => /kakaotalk/i.test(navigator.userAgent);

  if (isKakaoBrowser()) {
    if (isIOS()) {
      window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(url)}`;
    } else if (isAndroid()) {
      window.location.href = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
    } else {
      window.location.href = url;
    }
  }
};
