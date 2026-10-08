'use client';
import { useEffect } from 'react';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#%&01';
const HOVER = '.nav a, .socials a, .pj-lk a';
const REVEAL = '.pj-intro h2, .ch-head h2, .lbl';

export default function ScrambleAll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const raf = new WeakMap();

    const run = (el) => {
      if (el.children.length) return; // only plain-text elements
      const orig = el.dataset.orig || (el.dataset.orig = el.textContent);
      cancelAnimationFrame(raf.get(el));
      const width = el.offsetWidth;
      if (getComputedStyle(el).display === 'inline') el.style.display = 'inline-block';
      el.style.minWidth = width + 'px';

      const chars = [...orig];
      const start = performance.now();
      const done = chars.map((_, i) => start + 120 + i * 38 + Math.random() * 260);
      const end = Math.max(...done);

      const frame = (now) => {
        el.textContent = chars
          .map((c, i) => (c === ' ' || now >= done[i] ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join('');
        if (now < end) raf.set(el, requestAnimationFrame(frame));
        else { el.textContent = orig; el.style.minWidth = ''; }
      };
      raf.set(el, requestAnimationFrame(frame));
    };

    const over = (e) => {
      const el = e.target.closest ? e.target.closest(HOVER) : null;
      if (el && !el.contains(e.relatedTarget)) run(el);
    };
    document.addEventListener('pointerover', over);

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    document.querySelectorAll(REVEAL).forEach((el) => io.observe(el));

    return () => {
      document.removeEventListener('pointerover', over);
      io.disconnect();
    };
  }, []);

  return null;
}
