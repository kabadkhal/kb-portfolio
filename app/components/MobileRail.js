'use client';
import { useEffect, useRef, useState } from 'react';

// [label, selector] - sections in page order. Missing ones are skipped.
const SECS = [
  ['Home', '#hero'],
  ['About', '#about'],
  ['Stack', '#skills'],
  ['Work', '.pj-intro'],
  ['Break', '.chaos'],
  ['Contact', '.contact'],
];

// true  = the bottom dock and the top line appear only while you scroll,
//         and fade away shortly after you stop.
// false = they stay on screen all the time.
const SHOW_ONLY_WHILE_SCROLLING = true;
const HIDE_AFTER_MS = 1200; // how long they stay after you stop scrolling

const CSS = `
.mr { display: none; }
@media (max-width: 800px) {
  .pr, .rail { display: none !important; }
  .mr { display: block; }

  /* the last section gets extra room, so the dock never covers its bottom lines */
  .contact { padding-bottom: calc(120px + env(safe-area-inset-bottom, 0px)) !important; }

  /* thin top progress line */
  .mr-top { position: fixed; left: 0; top: 0; height: 3px; width: 100%; z-index: 30; background: rgba(255,255,255,.08); pointer-events: none; }
  .mr-top i { display: block; height: 100%; width: 0; background: var(--g); box-shadow: 0 0 10px var(--g); border-radius: 0 3px 3px 0; }

  /* compact bottom dock, sits just above the status bar */
  .mr-dock { position: fixed; left: 50%; bottom: calc(42px + env(safe-area-inset-bottom, 0px)); transform: translateX(-50%); z-index: 12;
    width: min(88vw, 340px); padding: .38rem .8rem .3rem; border-radius: 18px;
    background: rgba(8,16,15,.62); backdrop-filter: blur(16px) saturate(1.4); -webkit-backdrop-filter: blur(16px) saturate(1.4);
    border: 1px solid rgba(255,255,255,.14); box-shadow: 0 10px 28px -12px rgba(0,0,0,.7);
    transition: transform .35s cubic-bezier(.2,.8,.2,1), opacity .25s ease;
    user-select: none; -webkit-user-select: none; }
  /* hidden until you scroll, then they slide in; they leave again after you stop */
  .mr.auto .mr-dock { transform: translate(-50%, 170%); opacity: 0; pointer-events: none; }
  .mr.auto.moving .mr-dock { transform: translate(-50%, 0); opacity: 1; pointer-events: auto; }
  .mr.auto .mr-top { opacity: 0; transition: opacity .3s ease; }
  .mr.auto.moving .mr-top { opacity: 1; }
  .mr-lab { display: flex; justify-content: space-between; align-items: baseline;
    font: 600 .62rem ui-monospace, Consolas, monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--mute); }
  .mr-lab b { color: var(--g); font-weight: 700; }
  .mr-row { position: relative; height: 30px; transition: height .3s cubic-bezier(.2,.8,.2,1); }
  .mr-nodes { transition: opacity .2s ease; }
  .mr-line { position: absolute; left: 14px; right: 14px; top: 50%; height: 2px; margin-top: -1px; background: rgba(255,255,255,.16); border-radius: 2px; }
  .mr-fill { position: absolute; left: 0; top: 0; height: 100%; width: 0; background: var(--g); border-radius: 2px; box-shadow: 0 0 10px var(--g); }
  .mr-nodes { position: absolute; left: 14px; right: 14px; top: 0; bottom: 0; }
  .mr-n { all: unset; position: absolute; top: 50%; width: 34px; height: 30px; margin: -15px 0 0 -17px; display: grid; place-items: center; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .mr-n i { width: 10px; height: 10px; border-radius: 50%; background: var(--bg); border: 2px solid rgba(255,255,255,.4);
    transition: transform .3s, background .3s, border-color .3s, box-shadow .3s; }
  .mr-n.past i { border-color: var(--g); background: rgba(77,240,160,.35); }
  .mr-n.on i { transform: scale(1.5); background: var(--g); border-color: var(--g); box-shadow: 0 0 0 4px rgba(77,240,160,.22), 0 0 14px var(--g); }
  .mr-n:focus-visible i { outline: 2px solid #fff; outline-offset: 3px; }

  /* light version over the Contact section */
  .mr.lt .mr-dock { background: rgba(238,243,238,.7); border-color: rgba(8,19,15,.18); }
  .mr.lt .mr-lab { color: #3b5248; }
  .mr.lt .mr-lab b { color: #0b8f57; }
  .mr.lt .mr-line { background: rgba(8,19,15,.2); }
  .mr.lt .mr-fill { background: #0b8f57; box-shadow: none; }
  .mr.lt .mr-n i { background: #eef3ee; border-color: rgba(8,19,15,.4); }
  .mr.lt .mr-n.past i { border-color: #0b8f57; background: rgba(11,143,87,.3); }
  .mr.lt .mr-n.on i { background: #0b8f57; border-color: #0b8f57; box-shadow: 0 0 0 4px rgba(11,143,87,.2); }
}
@media (prefers-reduced-motion: reduce) { .mr-n i, .mr-dock { transition: none; } }
`;

export default function MobileRail() {
  const top = useRef(null);
  const fill = useRef(null);
  const root = useRef(null);
  const [active, setActive] = useState(0);
  const [names, setNames] = useState(SECS.map((s) => s[0]));
  const [count, setCount] = useState(SECS.length);
  const secs = useRef([]);

  useEffect(() => {
    const find = () => {
      secs.current = SECS.map(([l, sel]) => ({ l, el: document.querySelector(sel) })).filter((s) => s.el);
      setNames(secs.current.map((s) => s.l));
      setCount(secs.current.length);
    };
    find();
    const late = setTimeout(find, 1500); // sections may mount a moment later

    let raf, idle;
    const update = () => {
      raf = 0;
      const list = secs.current;
      if (!list.length) return;
      const y = window.scrollY;
      const mid = y + window.innerHeight * 0.5;
      const tops = list.map((s) => s.el.getBoundingClientRect().top + y);
      let idx = 0;
      for (let i = 0; i < tops.length; i++) if (tops[i] <= mid) idx = i;
      const next = tops[idx + 1];
      const frac = next ? Math.min(1, Math.max(0, (mid - tops[idx]) / (next - tops[idx]))) : 1;
      const n = list.length - 1 || 1;
      const p = Math.min(1, (idx + (idx === list.length - 1 ? 0 : frac)) / n);
      if (fill.current) fill.current.style.width = p * 100 + '%';

      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (top.current) top.current.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

      setActive((a) => (a === idx ? a : idx));
      if (root.current) root.current.classList.toggle('lt', list[idx].l === 'Contact');
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onScroll = () => {
      schedule();
      if (SHOW_ONLY_WHILE_SCROLLING && root.current) {
        root.current.classList.add('moving');
        clearTimeout(idle);
        idle = setTimeout(() => { if (root.current) root.current.classList.remove('moving'); }, HIDE_AFTER_MS);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      clearTimeout(late);
      clearTimeout(idle);
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const jump = (i) => {
    const s = secs.current[i];
    if (s) s.el.scrollIntoView({ behavior: 'smooth' });
  };
  const n = Math.max(count - 1, 1);

  return (
    <div className={`mr${SHOW_ONLY_WHILE_SCROLLING ? ' auto' : ''}`} ref={root}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="mr-top" aria-hidden="true"><i ref={top} /></div>
      <nav className="mr-dock" aria-label="Sections">
        <div className="mr-lab">
          <span><b>{String(active + 1).padStart(2, '0')}</b> / {String(count).padStart(2, '0')}</span>
          <span>{names[active]}</span>
        </div>
        <div className="mr-row">
          <div className="mr-line"><div className="mr-fill" ref={fill} /></div>
          <div className="mr-nodes">
            {names.map((name, i) => (
              <button
                key={name}
                className={`mr-n${i === active ? ' on' : ''}${i < active ? ' past' : ''}`}
                style={{ left: `${(i / n) * 100}%` }}
                onClick={() => jump(i)}
                aria-label={`Go to ${name}`}
                aria-current={i === active ? 'true' : undefined}
              >
                <i />
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}