'use client';
import { useEffect, useState } from 'react';

const NAMES = { hero: 'home', about: 'about', skills: 'stack', projects: 'projects', contact: 'contact' };

export default function StatusBar() {
  const [sec, setSec] = useState('home');
  const [up, setUp] = useState(0);
  const [time, setTime] = useState('');

  useEffect(() => {
    const t0 = Date.now();
    const clock = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    clock();
    const tick = setInterval(() => {
      setUp(Math.floor((Date.now() - t0) / 1000));
      clock();
    }, 1000);

    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight * 0.5;
      let a = 'hero';
      for (const id in NAMES) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= mid) a = id;
      }
      setSec(NAMES[a]);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearInterval(tick);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const mm = String(Math.floor(up / 60)).padStart(2, '0');
  const ss = String(up % 60).padStart(2, '0');

  return (
    <footer className="sbar">
      <span className="dot" />
      <span>prod-cluster</span>
      <span className="hide-m">·</span>
      <span className="hide-m">pods 5/5</span>
      <span>·</span>
      <span className="sec">/{sec}</span>
      <span className="sp" />
      <span className="hide-m">uptime {mm}:{ss}</span>
      <span className="hide-m">·</span>
      <span className="hide-m">{time}</span>
      <button onClick={() => window.dispatchEvent(new Event('toggle-terminal'))}>
        terminal <kbd>`</kbd>
      </button>
    </footer>
  );
}