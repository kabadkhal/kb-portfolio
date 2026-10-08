'use client';
import { useEffect, useRef } from 'react';

// anything matching this makes the cursor expand into a see-through ring
const HOT = 'a, button, input, [data-cur]';

// styles live here, so you do NOT need to edit globals.css
const CSS = `
.cursor {
  display: block;
  border: 1.5px solid transparent;
  transition: width .35s cubic-bezier(.2,.9,.2,1), height .35s cubic-bezier(.2,.9,.2,1),
              margin .35s cubic-bezier(.2,.9,.2,1), border-color .2s;
}
.cursor span { display: none; }
.cursor.big {
  width: 72px; height: 72px;
  margin: -36px 0 0 -36px;
  background: transparent;
  box-shadow: inset 0 0 0 999px rgba(77,240,160,.08);
  border-color: rgba(77,240,160,.9);
}
.cursor.big.press { width: 56px; height: 56px; margin: -28px 0 0 -28px; }
@media (pointer: coarse) { .cursor { display: none; } }
`;

export default function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    let mx = -100, my = -100, x = -100, y = -100, raf;
    const move = (e) => { mx = e.clientX; my = e.clientY; };
    const over = (e) => {
      const hot = e.target.closest ? e.target.closest(HOT) : null;
      if (ref.current) ref.current.classList.toggle('big', !!hot);
    };
    const down = () => ref.current && ref.current.classList.add('press');
    const up = () => ref.current && ref.current.classList.remove('press');
    const loop = () => {
      x += (mx - x) * 0.2;
      y += (my - y) * 0.2;
      if (ref.current) ref.current.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerover', over);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    loop();
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="cursor" ref={ref} />
    </>
  );
}