'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

// ---------- EDIT HERE ----------
// Files live in public/certs/  (NAME.jpg = full size, NAME-thumb.jpg = preview)
const ITEMS = [
  { id: 'internship', badge: 'Intern', title: 'DevOps Internship', org: 'High Catch Private Limited, with StarAgile', date: '8 Apr to 31 Oct 2025' },
  { id: 'kubernetes', badge: 'K8s', title: 'Scalable Web Applications on Kubernetes', org: 'StarAgile', date: '31 Oct 2025' },
  { id: 'docker-essentials', badge: 'Docker', title: 'Docker Essentials', org: 'StarAgile', date: '31 Oct 2025' },
  { id: 'devops-engineer', badge: 'DevOps', title: 'DevOps Engineer', org: 'StarAgile', date: '31 Oct 2025' },
  { id: 'aws-expert', badge: 'AWS', title: 'AWS Expert', org: 'StarAgile', date: '31 Oct 2025' },
];
// --------------------------------

const full = (it) => `/certs/${it.id}.jpg`;
const thumb = (it) => `/certs/${it.id}-thumb.jpg`;

const CSS = `
.cf{position:relative;z-index:2;padding:32px clamp(20px,5.3vw,140px) 110px;margin:-12vh 0 0;color:var(--ink,#eaf6f0)}
.cf-h{font-size:clamp(44px,7vw,92px);font-weight:800;letter-spacing:-.03em;line-height:1}
.cf-h i{font-style:normal;color:var(--g,#4df0a0)}
.cf-sub{margin-top:18px;max-width:64ch;color:var(--mute,#86a094);font-size:clamp(15px,1.5vw,18px);line-height:1.6}

.cf-glass{background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.13);
  -webkit-backdrop-filter:blur(16px) saturate(140%);backdrop-filter:blur(16px) saturate(140%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 18px 50px -24px rgba(0,0,0,.7)}

.cf-thumb{position:relative;display:block;width:100%;padding:0;border:1px solid rgba(255,255,255,.14);border-radius:12px;overflow:hidden;
  background:#0b1512;aspect-ratio:1600/1131;font:inherit;color:inherit}
.cf-thumb img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .5s cubic-bezier(.2,.8,.2,1)}
.cf-thumb:hover img,.cf-thumb:focus-visible img{transform:scale(1.04)}
.cf-thumb:focus-visible{outline:2px solid var(--g,#4df0a0);outline-offset:3px}
.cf-view{position:absolute;left:50%;bottom:12px;transform:translate(-50%,8px);opacity:0;padding:7px 14px;border-radius:999px;font-size:13px;font-weight:500;
  background:rgba(4,10,11,.72);border:1px solid rgba(255,255,255,.2);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);
  transition:opacity .25s,transform .25s;white-space:nowrap}
.cf-thumb:hover .cf-view,.cf-thumb:focus-visible .cf-view{opacity:1;transform:translate(-50%,0)}
@media (hover:none){.cf-view{opacity:1;transform:translate(-50%,0)}}

/* internship: preview on the right, bar on the left */
.cf-intern{margin-top:56px;border-radius:22px;padding:clamp(20px,3vw,34px);display:grid;grid-template-columns:1fr minmax(240px,34%);gap:clamp(20px,3vw,40px);align-items:center}
.cf-role{font-size:clamp(22px,2.6vw,32px);font-weight:800;letter-spacing:-.01em;line-height:1.15}
.cf-org{margin-top:6px;color:var(--mute,#86a094);font-size:15px}
.cf-track{position:relative;margin-top:30px;height:6px;border-radius:6px;background:rgba(255,255,255,.1)}
.cf-fill{position:absolute;inset:0;border-radius:6px;background:linear-gradient(90deg,rgba(77,240,160,.35),var(--g,#4df0a0));
  box-shadow:0 0 18px rgba(77,240,160,.45);transform-origin:left;transform:scaleX(1)}
.cf-dates{display:flex;justify-content:space-between;margin-top:12px;font-size:14px;color:var(--mute,#86a094)}
.cf-dates b{color:var(--ink,#eaf6f0);font-weight:500}
.cf-actions{display:flex;gap:18px;margin-top:20px;flex-wrap:wrap}

.cf-grid{list-style:none;margin-top:18px;display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.cf-card{border-radius:18px;padding:12px 12px 18px;display:flex;flex-direction:column;gap:14px}
.cf-body{padding:0 8px;display:flex;flex-direction:column;gap:10px;flex:1}
.cf-top{display:flex;align-items:center;justify-content:space-between}
.cf-badge{font-size:13px;font-weight:800;letter-spacing:.02em;padding:5px 12px;border-radius:999px;
  border:1px solid rgba(77,240,160,.5);color:var(--g,#4df0a0);background:rgba(77,240,160,.08)}
.cf-check{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:var(--g,#4df0a0);color:#04120c}
.cf-check svg{width:13px;height:13px}
.cf-title{font-size:clamp(16px,1.5vw,19px);font-weight:800;line-height:1.25;letter-spacing:-.01em}
.cf-meta{margin-top:auto;color:var(--mute,#86a094);font-size:14px;line-height:1.5}
.cf-link{color:var(--g,#4df0a0);font-size:14px;text-decoration:underline;text-underline-offset:4px;background:none;border:0;padding:0;font-family:inherit}

/* reveal once: bar fills, then cards and ticks land in turn */
.cf.js .cf-fill{transform:scaleX(0);transition:transform 1.4s cubic-bezier(.2,.8,.2,1)}
.cf.js.on .cf-fill{transform:scaleX(1)}
.cf.js .cf-card{opacity:0;transform:translateY(14px);transition:opacity .6s ease,transform .6s cubic-bezier(.2,.8,.2,1);transition-delay:calc(.8s + var(--i)*.14s)}
.cf.js.on .cf-card{opacity:1;transform:none}
.cf.js .cf-check{transform:scale(0);transition:transform .5s cubic-bezier(.3,1.6,.5,1);transition-delay:calc(1.1s + var(--i)*.14s)}
.cf.js.on .cf-check{transform:scale(1)}

/* viewer */
.cf-lb{position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:56px 16px 24px;
  background:rgba(2,8,6,.86);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);animation:cf-in .25s ease}
@keyframes cf-in{from{opacity:0}to{opacity:1}}
.cf-lb-img{max-width:min(94vw,1280px);max-height:calc(100vh - 190px);width:auto;height:auto;border-radius:10px;
  box-shadow:0 30px 90px -20px rgba(0,0,0,.9),0 0 0 1px rgba(255,255,255,.12);background:#fff}
.cf-lb-cap{text-align:center;color:var(--ink,#eaf6f0)}
.cf-lb-cap b{display:block;font-size:clamp(16px,2vw,20px);font-weight:800}
.cf-lb-cap span{display:block;margin-top:4px;color:var(--mute,#86a094);font-size:14px}
.cf-lb-cap a{display:inline-block;margin-top:10px;color:#04120c;background:var(--g,#4df0a0);padding:8px 18px;border-radius:999px;font-size:14px;font-weight:500;text-decoration:none}
.cf-btn{position:absolute;display:grid;place-items:center;width:44px;height:44px;border-radius:50%;cursor:pointer;color:var(--ink,#eaf6f0);font-size:22px;line-height:1;
  background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
.cf-btn:hover,.cf-btn:focus-visible{background:rgba(77,240,160,.2);border-color:var(--g,#4df0a0);outline:none}
.cf-x{top:14px;right:14px}
.cf-prev{left:14px;top:50%;margin-top:-22px}
.cf-next{right:14px;top:50%;margin-top:-22px}

@media (max-width:980px){.cf-grid{grid-template-columns:repeat(2,1fr)}}
@media (max-width:720px){.cf-intern{grid-template-columns:1fr}}
@media (max-width:560px){
  .cf{padding:24px 5vw 90px}.cf-grid{grid-template-columns:1fr}
  .cf-prev,.cf-next{top:auto;bottom:18px;margin-top:0}.cf-prev{left:calc(50% - 56px)}.cf-next{right:calc(50% - 56px)}
  .cf-lb{padding-bottom:84px}.cf-lb-img{max-height:calc(100vh - 250px)}
}
@media (prefers-reduced-motion:reduce){
  .cf.js .cf-fill,.cf.js .cf-card,.cf.js .cf-check{transition:none;transform:none;opacity:1}
  .cf-thumb img,.cf-lb{transition:none;animation:none}
}
`;

const Tick = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8.5l3.2 3.2L13 4.8" />
  </svg>
);

export default function Certifications() {
  const ref = useRef(null);
  const closeRef = useRef(null);
  const lastFocus = useRef(null);
  const [ready, setReady] = useState(false);
  const [on, setOn] = useState(false);
  const [open, setOpen] = useState(-1); // index of certificate being viewed, -1 = closed

  useEffect(() => {
    setReady(true);
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show = (i, e) => {
    lastFocus.current = e && e.currentTarget;
    setOpen(i);
  };
  const close = useCallback(() => {
    setOpen(-1);
    if (lastFocus.current && lastFocus.current.focus) lastFocus.current.focus();
  }, []);
  const step = useCallback((d) => setOpen((i) => (i < 0 ? i : (i + d + ITEMS.length) % ITEMS.length)), []);

  // keyboard + page scroll lock while the viewer is open
  useEffect(() => {
    if (open < 0) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    if (closeRef.current) closeRef.current.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  const intern = ITEMS[0];
  const certs = ITEMS.slice(1);
  const cur = open >= 0 ? ITEMS[open] : null;

  return (
    <section id="certs" className={`cf${ready ? ' js' : ''}${on ? ' on' : ''}`} ref={ref}>
      <style>{CSS}</style>

      <h2 className="cf-h">certified<i>.</i></h2>
      <p className="cf-sub">
        A six-month DevOps internship and four training programs on Docker, Kubernetes and AWS. Click any certificate to see it full size.
      </p>

      <div className="cf-glass cf-intern">
        <div>
          <div className="cf-role">DevOps Intern</div>
          <div className="cf-org">{intern.org}</div>
          <div className="cf-track" aria-hidden="true"><span className="cf-fill" /></div>
          <div className="cf-dates"><b>8 Apr 2025</b><b>31 Oct 2025</b></div>
          <div className="cf-actions">
            <button type="button" className="cf-link" onClick={(e) => show(0, e)}>View certificate</button>
          </div>
        </div>
        <button type="button" className="cf-thumb" onClick={(e) => show(0, e)} aria-label={`View ${intern.title} certificate`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb(intern)} alt={`${intern.title} certificate`} loading="lazy" />
          <span className="cf-view">View certificate</span>
        </button>
      </div>

      <ul className="cf-grid">
        {certs.map((c, n) => (
          <li key={c.id} className="cf-glass cf-card" style={{ '--i': n }}>
            <button type="button" className="cf-thumb" onClick={(e) => show(n + 1, e)} aria-label={`View ${c.title} certificate`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumb(c)} alt={`${c.title} certificate`} loading="lazy" />
              <span className="cf-view">View certificate</span>
            </button>
            <div className="cf-body">
              <div className="cf-top">
                <span className="cf-badge">{c.badge}</span>
                <span className="cf-check" aria-label="Completed"><Tick /></span>
              </div>
              <h3 className="cf-title">{c.title}</h3>
              <div className="cf-meta">
                {c.org}<br />{c.date}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {cur && (
        <div className="cf-lb" role="dialog" aria-modal="true" aria-label={`${cur.title} certificate`} onClick={close}>
          <button type="button" ref={closeRef} className="cf-btn cf-x" onClick={close} aria-label="Close">×</button>
          <button type="button" className="cf-btn cf-prev" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous certificate">‹</button>
          <button type="button" className="cf-btn cf-next" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next certificate">›</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="cf-lb-img" src={full(cur)} alt={`${cur.title} certificate`} onClick={(e) => e.stopPropagation()} />
          <div className="cf-lb-cap" onClick={(e) => e.stopPropagation()}>
            <b>{cur.title}</b>
            <span>{cur.org} · {cur.date}</span>
          </div>
        </div>
      )}
    </section>
  );
}