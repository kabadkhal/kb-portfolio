'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    let saved = null;
    try { saved = localStorage.getItem('kb-theme'); } catch {}
    const t = saved === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = t;
    setTheme(t);
  }, []);

  const apply = (next, x, y) => {
    const set = () => {
      document.documentElement.dataset.theme = next;
      setTheme(next);
      try { localStorage.setItem('kb-theme', next); } catch {}
    };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduce) { set(); return; }
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const vt = document.startViewTransition(set);
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(() => {});
  };

  const toggle = (e) => {
    const rect = e && e.currentTarget ? e.currentTarget.getBoundingClientRect() : null;
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    apply(theme === 'dark' ? 'light' : 'dark', x, y);
  };

  useEffect(() => {
    const onEvent = () => apply(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light', window.innerWidth / 2, window.innerHeight / 2);
    window.addEventListener('toggle-theme', onEvent);
    return () => window.removeEventListener('toggle-theme', onEvent);
  }, []);

  return (
    <button
      className="theme-btn"
      onClick={toggle}
      data-cur="Theme"
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={theme === 'light'}
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}