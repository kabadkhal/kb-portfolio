'use client';
import { useEffect, useState } from 'react';

const LINES = [
  { t: '$ git clone github.com/kabadkhal/kb-portfolio', c: 'cmd' },
  { t: '✔ cloned 1 repository', c: 'ok' },
  { t: '$ docker build -t kb-portfolio .', c: 'cmd' },
  { t: '✔ image built', c: 'ok' },
  { t: '$ kubectl apply -f deployment.yaml', c: 'cmd' },
  { t: '✔ deployment created', c: 'ok' },
  { t: '$ kubectl rollout status deploy/portfolio', c: 'cmd' },
  { t: '✔ 5/5 pods ready', c: 'ok' },
  { t: '→ welcome. scroll to explore.', c: 'hi' },
];

export default function Intro() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let i = 0, t2;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= LINES.length) {
        clearInterval(id);
        t2 = setTimeout(() => {
          setDone(true);
          document.body.classList.add('go');
        }, reduce ? 50 : 650);
      }
    }, reduce ? 20 : 330);
    return () => { clearInterval(id); clearTimeout(t2); };
  }, []);

  return (
    <div className={`boot ${done ? 'done' : ''}`} aria-hidden={done}>
      <div className="boot-win">
        <div className="boot-bar"><i /><i /><i /><span>kartik@cluster:~</span></div>
        <div className="boot-body">
          {LINES.slice(0, n).map((l, k) => (
            <div key={k} className={`ln ${l.c}`}>{l.t}</div>
          ))}
          <span className="caret" />
        </div>
        <div className="boot-prog"><div style={{ width: (n / LINES.length) * 100 + '%' }} /></div>
      </div>
    </div>
  );
}