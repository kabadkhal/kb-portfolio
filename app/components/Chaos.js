'use client';
import { useEffect, useRef, useState } from 'react';

const mk = (i, extra) => ({
  id: i,
  name: `web-${String.fromCharCode(97 + i)}`,
  st: 'up',
  v: 1,
  hits: 0,
  flash: 0,
  lock: false,
  extra: !!extra,
});
const init = () => Array.from({ length: 5 }, (_, i) => mk(i));
const LABEL = { up: 'Running', down: 'Terminated', start: 'Starting', bad: 'CrashLoopBackOff' };

export default function Chaos() {
  const [, force] = useState(0);
  const render = () => force((n) => n + 1);

  const pods = useRef(init());
  const logs = useRef([{ id: 0, t: 'cluster ready · 5/5 pods running', k: 'ok' }]);
  const stat = useRef({ served: 0, dropped: 0 });
  const spiking = useRef(false);
  const deploying = useRef(false);
  const visible = useRef(false);
  const timers = useRef([]);
  const sec = useRef(null);
  const lid = useRef(1);

  const log = (t, k) => {
    logs.current = [...logs.current.slice(-6), { id: lid.current++, t, k }];
  };
  const later = (fn, ms) => {
    const t = setTimeout(() => { fn(); render(); }, ms);
    timers.current.push(t);
  };

  // traffic loop: one request at a time, only while the section is on screen
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; }, { threshold: 0.1 });
    io.observe(sec.current);
    let t;
    const tick = () => {
      if (visible.current) {
        const up = pods.current.filter((p) => p.st === 'up');
        if (up.length) {
          const p = up[Math.floor(Math.random() * up.length)];
          p.hits += 1;
          p.flash += 1;
          stat.current.served += 1;
        } else {
          stat.current.dropped += 1;
        }
        render();
      }
      t = setTimeout(tick, spiking.current ? 130 : 600);
    };
    tick();
    return () => {
      clearTimeout(t);
      io.disconnect();
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const kill = (p) => {
    if (p.st !== 'up' || p.lock) return;
    p.st = 'down';
    log(`pod/${p.name} terminated`, 'err');
    render();
    later(() => { p.st = 'start'; log(`pod/${p.name} restarting…`, 'warn'); }, 1400);
    later(() => { p.st = 'up'; log(`pod/${p.name} ready ✓ readiness probe passed`, 'ok'); }, 3000);
  };

  const killRandom = () => {
    const up = pods.current.filter((p) => p.st === 'up' && !p.lock);
    if (up.length) kill(up[Math.floor(Math.random() * up.length)]);
  };

  const spike = () => {
    if (spiking.current) return;
    spiking.current = true;
    log('traffic ×5 · autoscaler adding pods', 'warn');
    const add = [5, 6, 7].map((i) => mk(i, true));
    add.forEach((p) => { p.st = 'start'; });
    pods.current = [...pods.current, ...add];
    render();
    later(() => {
      add.forEach((p) => { p.st = 'up'; });
      log('3 new pods ready · load shared across 8', 'ok');
    }, 1300);
    later(() => {
      pods.current = pods.current.filter((p) => !p.extra);
      spiking.current = false;
      log('traffic normal · scaled back to 5 pods', 'ok');
    }, 6500);
  };

  const deploy = () => {
    if (deploying.current) return;
    const p = pods.current.find((x) => x.st === 'up' && !x.extra && !x.lock);
    if (!p) return;
    deploying.current = true;
    p.lock = true;
    p.st = 'start';
    p.v = 2;
    log('kubectl set image deploy/web → v2 (rolling update)', 'warn');
    render();
    later(() => { p.st = 'bad'; log(`pod/${p.name} CrashLoopBackOff · readiness probe failed`, 'err'); }, 1300);
    later(() => log('rollout halted · rolling back to v1', 'warn'), 2800);
    later(() => {
      p.v = 1; p.st = 'up'; p.lock = false;
      deploying.current = false;
      log('rollback complete · 0 requests dropped', 'ok');
    }, 4200);
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    pods.current = init();
    stat.current = { served: 0, dropped: 0 };
    spiking.current = false;
    deploying.current = false;
    logs.current = [{ id: lid.current++, t: 'cluster reset · 5/5 pods running', k: 'ok' }];
    render();
  };

  const upCount = pods.current.filter((p) => p.st === 'up').length;
  const total = pods.current.length;
  const { served, dropped } = stat.current;
  const avail = served + dropped ? ((served / (served + dropped)) * 100).toFixed(1) : '100.0';

  return (
    <section className="chaos" id="chaos" ref={sec}>
      <div className="ch-head">
        <div className="lbl">Live demo</div>
        <h2>break it.</h2>
        <p>
          A simulated Kubernetes cluster running in your browser. Click any pod to kill it and watch the
          cluster heal itself, or use the buttons to cause trouble.
        </p>
      </div>

      <div className="ch-grid">
        <div className="ch-cluster">
          <div className={`ch-lb ${spiking.current ? 'hot' : ''}`}>
            <span>Load Balancer</span>
            <span>{spiking.current ? '×5 traffic' : 'normal traffic'}</span>
          </div>

          <div className="ch-pods">
            {pods.current.map((p) => (
              <button
                key={p.id}
                className={`ch-pod ${p.st}`}
                onClick={() => kill(p)}
                data-cur="Kill"
                aria-label={`Kill pod ${p.name}, currently ${LABEL[p.st]}`}
              >
                <span key={p.flash} className="ch-fl" />
                <b>{p.name}</b>
                <small>{LABEL[p.st]}</small>
                <em>v{p.v} · {p.hits} req</em>
              </button>
            ))}
          </div>

          <div className="ch-btns">
            <button onClick={killRandom} data-cur="">Kill random pod</button>
            <button onClick={spike} data-cur="">Traffic spike</button>
            <button onClick={deploy} data-cur="">Bad deploy</button>
            <button onClick={reset} data-cur="" className="ghost">Reset</button>
          </div>
        </div>

        <div className="ch-side">
          <div className="ch-stats">
            <div><b>{upCount}/{total}</b><span>pods healthy</span></div>
            <div><b>{served}</b><span>requests served</span></div>
            <div><b className={dropped ? 'bad' : ''}>{dropped}</b><span>requests dropped</span></div>
            <div><b className={dropped ? 'bad' : ''}>{avail}%</b><span>availability</span></div>
          </div>

          <div className="ch-log" aria-live="polite">
            {logs.current.map((l) => (
              <div key={l.id} className={l.k}>› {l.t}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}