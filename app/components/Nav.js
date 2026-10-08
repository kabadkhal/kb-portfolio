'use client';
import { useEffect, useRef, useState } from 'react';

// ---- EDIT HERE ----
const LINKS = [
  { label: 'Work', href: '#projects', menu: [
      { label: 'Projects', href: '#projects' },
      { label: 'Break it', href: '#chaos' },
      { label: 'Stack', href: '#skills' },
    ] },
  { label: 'About', href: '#about' },
  { label: 'Stack', href: '#skills' },
  { label: 'Resume', href: '/Kartik-Resume.pdf', late: true, file: true },
];
const CTA = { label: 'Get in touch', href: '#contact' };
// -------------------

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&/<>';

// scrambles the text of an element, then settles on the real label
function scramble(el, text) {
  if (!el) return;
  clearInterval(el._t);
  let f = 0;
  const total = 12;
  el._t = setInterval(() => {
    f++;
    const settled = Math.floor((f / total) * text.length);
    el.textContent = text
      .split('')
      .map((c, i) => (c === ' ' || i < settled ? c : CHARS[Math.floor(Math.random() * CHARS.length)]))
      .join('');
    if (f >= total) { clearInterval(el._t); el.textContent = text; }
  }, 32);
}

const CSS = `
.gn { position: fixed; top: 2.2vh; left: 0; right: 0; z-index: 20; display: flex; justify-content: space-between;
  align-items: flex-start; padding: 0 clamp(12px, 3vw, 40px); pointer-events: none; }
.gn > * { pointer-events: auto; }
.gn-logo { font-weight: 800; letter-spacing: -.04em; font-size: 1.25rem; color: #fff; text-decoration: none;
  padding: .55rem .9rem; border-radius: 99px; background: rgba(8,16,15,.55);
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,.14); }
.gn-pill { position: relative; display: flex; align-items: center; gap: .15rem; padding: .35rem;
  border-radius: 99px; background: rgba(8,16,15,.55);
  backdrop-filter: blur(14px) saturate(1.4); -webkit-backdrop-filter: blur(14px) saturate(1.4);
  border: 1px solid rgba(255,255,255,.14); box-shadow: 0 10px 40px -12px rgba(0,0,0,.6);
  opacity: 0; transform: translateY(-16px); transition: opacity .7s, transform .7s cubic-bezier(.2,.9,.2,1); }
.gn.in .gn-pill { opacity: 1; transform: none; }
.gn-it { position: relative; }
.gn-a { all: unset; box-sizing: border-box; display: flex; align-items: center; gap: .35rem; cursor: pointer;
  padding: .55rem .95rem; border-radius: 99px; font: 600 .74rem 'Bricolage Grotesque', system-ui, sans-serif;
  letter-spacing: .12em; text-transform: uppercase; color: #eaf6f0; white-space: nowrap;
  transition: background .25s, color .25s; }
.gn-a:hover, .gn-it:focus-within > .gn-a { background: rgba(255,255,255,.1); }
.gn-a:focus-visible { outline: 2px solid var(--g); outline-offset: 2px; }
.gn-a .w { display: inline-block; min-width: 1ch; }
.gn-car { font-size: .6rem; transition: transform .3s; }
.gn-it:hover .gn-car, .gn-it:focus-within .gn-car { transform: rotate(180deg); }

/* dropdown */
.gn-dd { position: absolute; left: 0; top: calc(100% + 10px); min-width: 190px; padding: .5rem; border-radius: 18px;
  background: rgba(14,22,20,.72); backdrop-filter: blur(18px) saturate(1.4); -webkit-backdrop-filter: blur(18px) saturate(1.4);
  border: 1px solid rgba(255,255,255,.14); box-shadow: 0 24px 60px -16px rgba(0,0,0,.7);
  opacity: 0; transform: translateY(-8px) scale(.97); transform-origin: top left; pointer-events: none;
  transition: opacity .25s, transform .35s cubic-bezier(.2,.9,.2,1); }
.gn-dd::before { content: ''; position: absolute; left: 0; right: 0; top: -12px; height: 12px; }
.gn-it:hover .gn-dd, .gn-it:focus-within .gn-dd { opacity: 1; transform: none; pointer-events: auto; }
.gn-dd a { display: block; padding: .6rem .8rem; border-radius: 12px; color: #c9d9d0; text-decoration: none;
  font: 600 .72rem 'Bricolage Grotesque', system-ui, sans-serif; letter-spacing: .12em; text-transform: uppercase;
  opacity: 0; transform: translateX(-8px); transition: background .2s, color .2s, opacity .3s, transform .3s; }
.gn-it:hover .gn-dd a, .gn-it:focus-within .gn-dd a { opacity: 1; transform: none; }
.gn-dd a:nth-child(2) { transition-delay: 0s, 0s, .04s, .04s; }
.gn-dd a:nth-child(3) { transition-delay: 0s, 0s, .08s, .08s; }
.gn-dd a:hover { background: rgba(255,255,255,.1); color: #fff; }
.gn-dd a:focus-visible { outline: 2px solid var(--g); outline-offset: 2px; }

/* items that slide in after the first load */
.gn-late { max-width: 0; overflow: hidden; opacity: 0; transform: translateX(24px);
  transition: max-width .8s cubic-bezier(.2,.9,.2,1), opacity .6s .15s, transform .8s cubic-bezier(.2,.9,.2,1); }
.gn.more .gn-late { max-width: 260px; opacity: 1; transform: none; }

.gn-cta { all: unset; box-sizing: border-box; cursor: pointer; margin-left: .25rem; padding: .6rem 1.1rem; border-radius: 99px;
  background: var(--g); color: #06120d; font: 700 .74rem 'Bricolage Grotesque', system-ui, sans-serif;
  letter-spacing: .12em; text-transform: uppercase; white-space: nowrap;
  box-shadow: 0 0 0 0 rgba(77,240,160,.5); transition: transform .25s, box-shadow .3s, background .3s; }
.gn-cta:hover { transform: translateY(-1px); background: #7dffbf; box-shadow: 0 0 0 5px rgba(77,240,160,.2), 0 8px 24px -6px rgba(77,240,160,.6); }
.gn-cta:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

@media (max-width: 800px) {
  .gn-it { display: none; }
  .gn-pill { padding: .3rem; }
  .gn-cta { margin: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .gn-pill, .gn-late, .gn-dd, .gn-dd a { transition-duration: .01s; }
}
`;

export default function Nav() {
  const [shown, setShown] = useState(false);
  const [more, setMore] = useState(false);
  const root = useRef(null);

  useEffect(() => {
    // wait for the boot sequence (body.go), with a safety fallback
    let t1, t2;
    const start = () => {
      t1 = setTimeout(() => setShown(true), 300);
      t2 = setTimeout(() => setMore(true), 1500);
    };
    let obs;
    if (document.body.classList.contains('go')) start();
    else {
      obs = new MutationObserver(() => {
        if (document.body.classList.contains('go')) { obs.disconnect(); start(); }
      });
      obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }
    const fb = setTimeout(() => { setShown(true); setMore(true); }, 9000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(fb); obs && obs.disconnect(); };
  }, []);

  const go = (e, href) => {
    if (!href.startsWith('#')) return;
    const el = document.querySelector(href);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
  };
  const hov = (e) => scramble(e.currentTarget.querySelector('.w'), e.currentTarget.dataset.t);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className={`gn${shown ? ' in' : ''}${more ? ' more' : ''}`} ref={root}>
        <a className="gn-logo" href="#hero" onClick={(e) => go(e, '#hero')}>KB</a>
        <nav className="gn-pill" aria-label="Main">
          {LINKS.map((l) => (
            <div className={`gn-it${l.late ? ' gn-late' : ''}`} key={l.label}>
              <a
                className="gn-a" href={l.href} data-t={l.label}
                {...(l.file ? { download: '' } : {})}
                onMouseEnter={hov} onFocus={hov} onClick={(e) => go(e, l.href)}
              >
                <span className="w">{l.label}</span>
                {l.menu && <span className="gn-car" aria-hidden="true">▾</span>}
              </a>
              {l.menu && (
                <div className="gn-dd">
                  {l.menu.map((m) => (
                    <a key={m.label} href={m.href} onClick={(e) => go(e, m.href)}>{m.label}</a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a className="gn-cta" href={CTA.href} onClick={(e) => go(e, CTA.href)}>{CTA.label}</a>
        </nav>
      </header>
    </>
  );
}