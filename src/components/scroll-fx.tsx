'use client';

import { useEffect } from 'react';

// Efectos de scroll de la landing, sin dependencias. El marcado del servidor ya es el estado final:
//  · [data-reveal]  aparece al entrar en pantalla (retardo opcional con --d).
//  · [data-count]   cuenta desde 0 hasta su valor al verse.
//  · [data-parallax="v"] se desplaza a v × la distancia de su contenedor al centro de la pantalla.
// Con prefers-reduced-motion no se activa nada: la página se queda tal cual llegó.
export function ScrollFx() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement;
    const vh = () => window.innerHeight;

    // 1. Aparición progresiva. Lo que ya está en pantalla se marca antes de activar el estado oculto: sin parpadeo.
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    reveals.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh() * 0.92 && r.bottom > 0) el.setAttribute('data-in', '');
    });

    // 2. Contadores: se ponen a 0 solo si todavía no se ven; los visibles cuentan ya.
    const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
    const run = (el: HTMLElement) => {
      const to = Number(el.dataset.count);
      if (!Number.isFinite(to) || el.dataset.done) return;
      el.dataset.done = '1';
      const t0 = performance.now();
      const dur = 1400;
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    counters.forEach((el) => {
      el.textContent = '0';
    });

    root.setAttribute('data-fx', '');

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.setAttribute('data-in', '');
          if (el.hasAttribute('data-count')) run(el);
          io.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
    );
    reveals.forEach((el) => !el.hasAttribute('data-in') && io.observe(el));
    counters.forEach((el) => io.observe(el));

    // 3. Parallax suave, medido sobre el contenedor (no sobre el propio elemento, que ya se mueve).
    const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    let raf = 0;
    const paint = () => {
      raf = 0;
      for (const el of layers) {
        const box = (el.parentElement ?? el).getBoundingClientRect();
        if (box.bottom < -200 || box.top > vh() + 200) continue;
        const speed = Number(el.dataset.parallax) || 0;
        const offset = -((box.top + box.height / 2) - vh() / 2) * speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      root.removeAttribute('data-fx');
    };
  }, []);

  return null;
}
