// src/helpers/openExternalLink.ts
export const openExternalLink = () => {
  const url = window.location.href;

  const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = () => /Android/i.test(navigator.userAgent);
  const isKakaoBrowser = () => /KAKAOTALK/i.test(navigator.userAgent);

  if (isKakaoBrowser()) {
    if (isIOS()) {
      window.location.href = 'kakaoweb://' + url;
      setTimeout(() => {
        window.location.href = url;
      }, 100);
    } else if (isAndroid()) {
      window.location.href =
        'intent://' +
        url.replace(/^https?:\/\//, '') +
        '#Intent;scheme=https;package=com.android.chrome;end';
    } else {
      window.location.href = url;
    }
  }
};
