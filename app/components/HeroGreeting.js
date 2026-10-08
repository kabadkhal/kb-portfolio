'use client';
import { useEffect, useState } from 'react';

// ---- EDIT HERE ----
const HELLOS = ['Hello', 'नमस्ते', 'Hola', 'Bonjour', 'こんにちは', 'Ciao', 'Hallo', 'Olá'];
const NAME = 'Kartik';
// -------------------

const CSS = `
.gr { max-width: 46ch; display: grid; gap: .9rem; }
.gr-hi { display: flex; align-items: baseline; gap: .6rem; flex-wrap: wrap; color: var(--ink);
  font-weight: 800; letter-spacing: -.03em; font-size: clamp(1.6rem, 3.4vw, 2.8rem); line-height: 1.05; }
.gr-w { display: inline-block; color: var(--g); min-width: 1ch; animation: grin .6s cubic-bezier(.2,.9,.2,1) both; }
@keyframes grin { from { opacity: 0; transform: translateY(.5em); filter: blur(6px); } }
.gr-wave { display: inline-block; transform-origin: 70% 70%; animation: grwave 2.4s ease-in-out 1.2s infinite; }
@keyframes grwave {
  0%, 60%, 100% { transform: rotate(0); }
  10%, 30% { transform: rotate(16deg); }
  20%, 40% { transform: rotate(-10deg); }
  50% { transform: rotate(8deg); }
}
.gr-ln { color: var(--mute); font-size: clamp(1.05rem, 1.8vw, 1.4rem); line-height: 1.5; }
.gr-ln b { color: var(--ink); font-weight: 500; }
.gr-ln em { font-style: normal; color: var(--g); font-weight: 500; }
.gr-st { display: inline-flex; align-items: center; gap: .55rem; width: fit-content;
  padding: .4rem .9rem; border-radius: 99px; border: 1px solid rgba(255,255,255,.16);
  background: rgba(255,255,255,.05); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  font-size: .85rem; color: var(--mute); }
.gr-st i { width: 8px; height: 8px; border-radius: 50%; background: var(--g); box-shadow: 0 0 10px var(--g); animation: pulse 2s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .gr-wave, .gr-w { animation: none; } }
`;

export default function HeroGreeting() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % HELLOS.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="sub gr">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="gr-hi">
        <span className="gr-w" key={i} data-noscramble>{HELLOS[i]}</span>
        <span className="gr-wave" aria-hidden="true">👋</span>
        <span>I&apos;m {NAME}.</span>
      </div>
      <p className="gr-ln">
        A <b>full-stack developer</b> and <b>DevOps engineer</b>. I build products, then <em>ship</em> and <em>scale</em> them.
      </p>
      <span className="gr-st"><i /> Open to work and collaborations</span>
    </div>
  );
}