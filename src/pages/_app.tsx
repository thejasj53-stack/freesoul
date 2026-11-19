import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

function ScrollAtmosphere() {
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
        document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(3));
        document.documentElement.style.setProperty('--scroll-hue', String(Math.round(264 + progress * 34)));
        document.documentElement.style.setProperty('--scroll-depth', `${Math.min(window.scrollY * 0.035, 34).toFixed(1)}px`);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  return <><ScrollAtmosphere /><Component {...pageProps} /></>;
}
