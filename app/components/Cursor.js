'use client';
import { useEffect, useRef } from 'react';

export default function Cursor() {
  const ref = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    let mx = 0, my = 0, x = 0, y = 0, raf;
    const move = (e) => { mx = e.clientX; my = e.clientY; };
    const over = (e) => {
      const t = e.target.closest ? e.target.closest('[data-cur]') : null;
      if (t) { label.current.textContent = t.dataset.cur; ref.current.classList.add('big'); }
      else ref.current.classList.remove('big');
    };
    const loop = () => {
      x += (mx - x) * 0.2;
      y += (my - y) * 0.2;
      if (ref.current) ref.current.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerover', over);
    loop();
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="cursor" ref={ref}><span ref={label} /></div>;
}