'use client';

import { useEffect, useRef } from 'react';

// Dentro de la cabecera: la barra de progreso de lectura y el estado "con scroll" de la propia cabecera
// (atributo data-scrolled, que los estilos de site-header.tsx leen). Sin estado de React: solo rAF y estilos.
export function HeaderFx() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = bar.current?.closest('header');
    let raf = 0;
    const paint = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      header?.setAttribute('data-scrolled', String(y > 12));
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5">
      <div className="h-full origin-left scale-x-0 bg-accent will-change-transform" ref={bar} />
    </div>
  );
}
