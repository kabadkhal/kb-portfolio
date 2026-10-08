'use client';
import { useEffect, useRef, useState } from 'react';

const EMAIL = 'kabadkhal@gmail.com';
const RESUME = '/Kartik-Resume.pdf';
const LINKS = [
  { name: 'GitHub', href: 'https://github.com/kabadkhal' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/kabadkhal/' },
  { name: 'Email', href: `mailto:${EMAIL}` },
];
const HEAD = ["Let's build", 'something', 'reliable.'];
const BAND = 'OPEN TO WORK ✦ CLOUD ✦ DEVOPS ✦ KUBERNETES ✦ AWS ✦ TERRAFORM ✦ ';
const SEQ = [
  { t: '✔ commit created: "hire kartik"', k: 'ok', ms: 500 },
  { t: '$ git push origin main', k: 'cmd', ms: 1000 },
  { t: '✔ pipeline passed · 5/5 pods ready', k: 'ok', ms: 1900 },
  { t: '→ opening your email app…', k: 'hi', ms: 2600 },
];
const COLORS = ['#4df0a0', '#ffffff', '#38bdf8', '#ffb020'];

export default function Contact() {
  const sec = useRef(null);
  const timers = useRef([]);
  const [lines, setLines] = useState([]);
  const [running, setRunning] = useState(false);
  const [pieces, setPieces] = useState([]);
  const [copied, setCopied] = useState(false);

  // letters react to the cursor
  useEffect(() => {
    const el = sec.current;
    const timersList = timers.current;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return () => timersList.forEach(clearTimeout);
    }
    let raf = 0, mx = -999, my = -999;
    const apply = () => {
      raf = 0;
      el.querySelectorAll('.cl').forEach((c) => {
        const r = c.getBoundingClientRect();
        const dx = mx - (r.left + r.width / 2);
        const dy = my - (r.top + r.height / 2);
        const k = Math.max(0, 1 - Math.hypot(dx, dy) / 170);
        c.style.setProperty('--k', k.toFixed(3));
      });
    };
    const move = (e) => { mx = e.clientX; my = e.clientY; if (!raf) raf = requestAnimationFrame(apply); };
    const leave = () => { mx = -999; my = -999; apply(); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
      timersList.forEach(clearTimeout);
    };
  }, []);

  const at = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const run = () => {
    if (running) return;
    setRunning(true);
    setLines([]);
    SEQ.forEach((s) => at(() => setLines((l) => [...l, s]), s.ms));
    at(() => {
      const b = Date.now();
      setPieces(Array.from({ length: 30 }, (_, i) => ({
        id: i, b,
        dx: (Math.random() - 0.5) * 380,
        dy: -90 - Math.random() * 230,
        r: (Math.random() - 0.5) * 720,
        c: COLORS[i % COLORS.length],
      })));
    }, 2400);
    at(() => {
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Opportunity for Kartik')}`;
    }, 3400);
    at(() => setRunning(false), 3600);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      at(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section className="contact" id="contact" ref={sec}>
      <div className="ct-pill"><i />Open to work · Cloud / DevOps</div>

      <h2 className="ct-h" aria-label="Let's build something reliable.">
        {HEAD.map((line, li) => (
          <span className={`ct-line ${li === 2 ? 'ct-acc' : ''}`} key={li} aria-hidden="true">
            {line.split(' ').map((w, wi) => (
              <span className="ct-w" key={wi}>
                {[...w].map((c, ci) => <span className="cl" key={ci}>{c}</span>)}
              </span>
            ))}
          </span>
        ))}
      </h2>

      <div className="ct-term">
        <div className="ct-tb"><i /><i /><i /><span>kartik@cluster:~/contact</span></div>
        <div className="ct-tbody">
          <div className="cmd">$ git add .</div>
          <div className="cmd">
            $ git commit -m &quot;hire kartik&quot;
            {!running && !lines.length && <span className="caret" />}
          </div>
          {lines.map((l, i) => <div key={i} className={l.k}>{l.t}</div>)}
        </div>
        <button className="ct-run" onClick={run} disabled={running} data-cur="Run">
          {running ? 'running…' : lines.length ? 'Run again ↵' : 'Run ↵  send me a message'}
        </button>
        {pieces.length > 0 && (
          <div className="ct-conf" key={pieces[0].b} aria-hidden="true">
            {pieces.map((p) => (
              <i key={p.id} style={{ '--dx': p.dx + 'px', '--dy': p.dy + 'px', '--r': p.r + 'deg', background: p.c }} />
            ))}
          </div>
        )}
      </div>

      <div className="ct-row">
        <button className="ct-copy" onClick={copy} data-cur="Copy">
          {copied ? 'Copied ✓' : EMAIL} <span aria-hidden="true">⧉</span>
        </button>
        <a className="resume" href={RESUME} download="Kartik-Resume.pdf" data-cur="Download">
          Download Resume <span aria-hidden="true">↓</span>
        </a>
      </div>

      <div className="socials">
        {LINKS.map((l) => (
          <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" data-cur="Open">
            {l.name} ↗
          </a>
        ))}
      </div>

      <div className="ct-band" aria-hidden="true">
        <div className="ct-r a"><div>{BAND.repeat(5)}{BAND.repeat(5)}</div></div>
        <div className="ct-r b"><div>{BAND.repeat(5)}{BAND.repeat(5)}</div></div>
      </div>
    </section>
  );
}