'use client';
import { useEffect, useRef, useState } from 'react';

const EMAIL = 'kabadkhal@gmail.com';
const GH = 'https://github.com/kabadkhal';
const LI = 'https://www.linkedin.com/in/kabadkhal/';
const CMDS = ['resume','help', 'whoami', 'about', 'skills', 'projects', 'goto', 'ls', 'github', 'linkedin', 'email', 'deploy', 'clear', 'exit'];
const SECS = { home: 'hero', about: 'about', stack: 'skills', skills: 'skills', projects: 'projects', contact: 'contact' };
const WELCOME = [
  { k: 'hi', t: "Welcome to Kartik's terminal." },
  { k: 'out', t: 'Type help to see what you can do.' },
];

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState(WELCOME);
  const [val, setVal] = useState('');
  const body = useRef(null);
  const inp = useRef(null);
  const hist = useRef([]);
  const hi = useRef(-1);

  const push = (arr) => setLines((l) => [...l, ...arr]);
  const out = (...t) => push(t.map((x) => ({ k: 'out', t: x })));
  const ok = (t) => push([{ k: 'ok', t }]);
  const err = (t) => push([{ k: 'err', t }]);

  useEffect(() => {
    const toggle = () => setOpen((o) => !o);
    const key = (e) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === '`' && !(e.target.tagName === 'INPUT' && e.target !== inp.current)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('toggle-terminal', toggle);
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('toggle-terminal', toggle);
      window.removeEventListener('keydown', key);
    };
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inp.current && inp.current.focus(), 350);
  }, [open]);

  useEffect(() => {
    if (body.current) body.current.scrollTop = body.current.scrollHeight;
  }, [lines, open]);

  const run = (raw) => {
    const text = raw.trim();
    push([{ k: 'in', t: raw }]);
    if (!text) return;
    hist.current.unshift(text);
    hi.current = -1;
    const low = text.toLowerCase();
    const [c, ...a] = low.split(/\s+/);
    const arg = a.join(' ');

    if (low === 'sudo hire kartik') {
      out('[sudo] password for recruiter: ********');
      ok('authenticated');
      ok('offer letter generated');
      out(`Okay, nice try. Let's talk properly: ${EMAIL}`);
      return;
    }

    switch (c) {
      case 'help':
        out(
          'help        show this list',
          'whoami      who am I',
          'about       short intro',
          'skills      my stack',
          'projects    list my projects',
          'goto <x>    home | about | stack | projects | contact',
          'ls          list sections',
          'github      open my GitHub',
          'linkedin    open my LinkedIn',
          'email       show my email',
          'resume      download my resume',
          'deploy      watch a pipeline run',
          'clear       clear the screen',
          'exit        close (or press `)'
        );
        break;
      case 'whoami':
        out('kartik — cloud & devops engineer');
        break;
      case 'about':
        out(
          'I build and deploy cloud-native applications.',
          'Docker, Kubernetes, Jenkins pipelines and AWS networks,',
          'plus full-stack products with Next.js on top.'
        );
        break;
      case 'skills':
        out(
          'cloud      AWS EC2 · RDS · VPC · NAT Gateway · Load Balancer · Security Groups',
          'devops     Docker · Compose · Kubernetes · Jenkins · GitHub Actions · Traefik · CI/CD',
          'fullstack  Next.js · React · TypeScript · MongoDB · PostgreSQL'
        );
        break;
      case 'projects':
        out(
          '01  JobTrack          Next.js · MongoDB',
          '02  InfraFlow         Docker · Traefik · GitHub Actions',
          '03  Food Delivery     Kubernetes · Jenkins · EC2',
          '04  Ticket Booking    Jenkins · Docker · Kubernetes',
          '05  AWS 3-Tier        EC2 · RDS · VPC',
          'try: goto projects'
        );
        break;
      case 'ls':
        out('home/  about/  stack/  projects/  contact/');
        break;
      case 'goto': {
        const id = SECS[arg];
        if (id) {
          ok(`scrolling to ${arg}`);
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => setOpen(false), 500);
        } else {
          err(`unknown section: ${arg || '(none)'}. try: home, about, stack, projects, contact`);
        }
        break;
      }
      case 'github':
        ok(`opening ${GH}`);
        window.open(GH, '_blank', 'noopener');
        break;
      case 'linkedin':
        ok(`opening ${LI}`);
        window.open(LI, '_blank', 'noopener');
        break;
      case 'email':
      case 'contact':
        out(EMAIL);
        break;
      case 'deploy': {
        const steps = [
          '▶ git push origin main',
          '✔ pipeline: build passed',
          '✔ pipeline: tests passed',
          '✔ image pushed to registry',
          '✔ rolling update: 5/5 pods healthy',
          '✔ live. zero downtime.',
        ];
        steps.forEach((s, i) =>
          setTimeout(() => push([{ k: i === 0 ? 'out' : 'ok', t: s }]), 450 * (i + 1))
        );
        break;
      }
         case 'resume': {
           ok('downloading resume…');
           const a = document.createElement('a');
           a.href = '/Kartik-Resume.pdf';
           a.download = 'Kartik-Resume.pdf';
           a.click();
           break;
         }
      case 'clear':
        setLines([]);
        break;
      case 'exit':
      case 'close':
        setOpen(false);
        break;
      default:
        err(`command not found: ${c}. Type help.`);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    run(val);
    setVal('');
  };

  const onKey = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const n = Math.min(hist.current.length - 1, hi.current + 1);
      if (n >= 0) { hi.current = n; setVal(hist.current[n]); }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const n = hi.current - 1;
      hi.current = n;
      setVal(n >= 0 ? hist.current[n] : '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const m = CMDS.filter((c) => c.startsWith(val.toLowerCase()));
      if (val && m.length === 1) setVal(m[0]);
    }
  };

  return (
    <div className={`term ${open ? 'open' : ''}`} role="dialog" aria-label="Terminal" aria-hidden={!open}>
      <div className="term-bar">
        <span>kartik@cluster:~ — press ` to toggle</span>
        <button onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} aria-label="Close terminal">×</button>
      </div>
      <div className="term-body" ref={body} onClick={() => inp.current && inp.current.focus()}>
        {lines.map((l, i) => (
          <div key={i} className={`tl ${l.k}`}>
            {l.k === 'in' ? (<><b>❯</b> {l.t}</>) : l.t}
          </div>
        ))}
        <form onSubmit={submit} className="tl in">
          <b>❯</b>
          <input
            ref={inp}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={onKey}
            tabIndex={open ? 0 : -1}
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal command"
          />
        </form>
      </div>
    </div>
  );
}