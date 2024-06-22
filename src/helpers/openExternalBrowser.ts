// src/helpers/openExternalBrowser.ts
export const openExternalBrowser = () => {
  const url = window.location.href.toString();

  const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = () => /Android/i.test(navigator.userAgent);
  const isKakaoBrowser = () => /KAKAOTALK/i.test(navigator.userAgent);

  if (isKakaoBrowser()) {
    if (isIOS()) {
      alert(
        'URL주소가 복사되었습니다.\n\nSafari가 열리면 주소창을 길게 터치한 뒤, "붙여놓기 및 이동"을 누르면 정상적으로 이용하실 수 있습니다.'
      );
      const copyToClipboard = (val: string) => {
        const t = document.createElement('textarea');
        document.body.appendChild(t);
        t.value = val;
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);
      };
      copyToClipboard(url);
      window.location.href = 'x-web-search://?';
    } else if (isAndroid()) {
      window.location.href = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
    } else {
      window.location.href = url;
    }
  }
};
