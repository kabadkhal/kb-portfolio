'use client';
import { useEffect, useRef, useState } from 'react';

const S = [
  { id: 'hero', label: 'Commit', ok: 'git push ✓' },
  { id: 'about', label: 'Build', ok: 'build passed ✓' },
  { id: 'skills', label: 'Test', ok: 'tests passed ✓' },
  { id: 'projects', label: 'Push', ok: 'image pushed ✓' },
  { id: 'contact', label: 'Deploy', ok: '' },
];
const LAST = S.length - 1;

const deployMsg = (n) => {
  if (n === 1) return 'v1.0 deployed · 5/5 pods';
  if (n === 2) return 'v1.1 · canary → 100% · zero downtime';
  if (n === 3) return 'v1.2 · secret unlocked: press ` and type sudo hire kartik';
  return `v1.${n - 1} · deployed again`;
};

export default function ScrollRail() {
  const rail = useRef(null);
  const fill = useRef(null);
  const thumb = useRef(null);
  const tw = useRef(null);
  const pct = useRef(null);
  const tops = useRef(S.map(() => 0));
  const doneRef = useRef(S.map(() => false));
  const lastY = useRef(0);
  const dir = useRef('down');
  const passes = useRef(0);
  const ready = useRef(false);
  const timer = useRef(null);

  const [marks, setMarks] = useState(S.map(() => 0));
  const [done, setDone] = useState(S.map(() => false));
  const [msg, setMsg] = useState(null);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    let raf;
    const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    const show = (t, tone) => {
      setMsg({ k: Date.now() + Math.random(), t, tone });
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMsg(null), 2200);
    };

    const measure = () => {
      const max = maxScroll();
      tops.current = S.map((s) => {
        const el = document.getElementById(s.id);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      });
      setMarks(tops.current.map((t) => Math.min(1, Math.max(0, t / max))));
    };

    const update = () => {
      const y = window.scrollY;
      const max = maxScroll();
      const p = Math.min(1, Math.max(0, y / max));
      if (y !== lastY.current) {
        dir.current = y > lastY.current ? 'down' : 'up';
        lastY.current = y;
      }
      if (fill.current) fill.current.style.height = p * 100 + '%';
      if (thumb.current) thumb.current.style.top = p * 100 + '%';
      if (tw.current) tw.current.style.top = p * 100 + '%';
      if (pct.current) {
        pct.current.textContent =
          String(Math.round(p * 100)).padStart(3, '0') + '% · v1.' + passes.current;
      }
      if (rail.current) {
        rail.current.classList.toggle('rb', dir.current === 'up' && p < 0.995 && p > 0.005);
        rail.current.classList.toggle('lt', y + window.innerHeight * 0.5 >= tops.current[LAST]);
      }

      const passed = tops.current.map((t, i) =>
        i === 0 ? true : i === LAST ? p >= 0.985 : y + window.innerHeight * 0.4 >= t
      );
      const prev = doneRef.current;
      const changed = passed.some((v, i) => v !== prev[i]);
      if (changed) {
        if (ready.current) {
          passed.forEach((v, i) => {
            if (v === prev[i]) return;
            if (v && i > 0) {
              if (i === LAST) {
                passes.current += 1;
                setBurst((b) => b + 1);
                show(deployMsg(passes.current), 'ok');
              } else {
                show(S[i].ok, 'ok');
              }
            } else if (!v) {
              show(`↩ rollback · ${S[i].label.toLowerCase()}`, 'rb');
            }
          });
        }
        doneRef.current = passed;
        setDone(passed);
      }
      ready.current = true;
    };

    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    const onResize = () => { measure(); update(); };

    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, []);

  const seek = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    window.scrollTo({ top: f * (document.documentElement.scrollHeight - window.innerHeight), behavior: 'instant' });
  };

  const jump = (i) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: i === LAST ? max : tops.current[i], behavior: 'smooth' });
  };

  return (
    <div className="pr" ref={rail} aria-label="Page scroll pipeline">
      <div className="pr-track">
        <div className="pr-fill" ref={fill} />

        {S.map((s, i) => (
          <button
            key={s.id}
            className={`pr-n ${done[i] ? 'on' : ''}`}
            style={{ top: `${marks[i] * 100}%` }}
            onClick={() => jump(i)}
            aria-label={`Go to ${s.label}`}
          >
            <b>{done[i] ? '✓' : ''}</b>
            <span>{s.label}</span>
          </button>
        ))}

        <div className="pr-th" ref={thumb} />

        <div className="pr-tw" ref={tw}>
          {msg && <div key={msg.k} className={`pr-toast ${msg.tone}`}>{msg.t}</div>}
        </div>

        {burst > 0 && (
          <div className="pr-burst" key={burst}>
            {Array.from({ length: 16 }).map((_, i) => (
              <i key={i} style={{ '--a': `${i * 22.5}deg` }} />
            ))}
          </div>
        )}

        <div className="pr-hit" onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); seek(e); }}
          onPointerMove={(e) => { if (e.buttons === 1) seek(e); }} />
        <div className="pr-pct" ref={pct}>000% · v1.0</div>
      </div>
    </div>
  );
}