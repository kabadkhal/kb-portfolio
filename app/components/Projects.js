'use client';
import { useEffect, useRef, useState } from 'react';

// EDIT LATER: replace gh with each project's exact repo, and live with the live link
const GH = 'https://github.com/kabadkhal';
const P = [
  {
    s: 'JobTrack',
    name: 'JobTrack — Job Application Tracking Platform',
    cat: 'FULL-STACK / NEXT.JS',
    d: 'Built and deployed a full-stack job application tracking platform using Next.js, React, TypeScript and MongoDB. Implemented authentication, job application tracking, status pipelines, dashboard statistics and a responsive interface for managing the job-search workflow.',
    tags: ['Next.js', 'React', 'TypeScript', 'MongoDB', 'Authentication', 'Vercel'],
    gh: GH, live: '#',
  },
  {
    s: 'InfraFlow',
    name: 'InfraFlow — DevOps & CI/CD Platform',
    cat: 'DEVOPS / CI-CD',
    d: 'Built a production-oriented DevOps implementation using Docker, Docker Compose, Traefik, PostgreSQL, LocalStack S3, GitHub Actions and Docker Hub. Implemented containerization, reverse-proxy routing, health checks, automated Docker image builds, SHA-based deployments, production deployment and rollback to a previous known-good version.',
    tags: ['Docker', 'Docker Compose', 'Traefik', 'GitHub Actions', 'PostgreSQL', 'LocalStack S3', 'Docker Hub', 'CI/CD'],
    gh: GH, live: '#',
  },
  {
    s: 'Food Delivery',
    name: 'Microservices Food Delivery Platform',
    cat: 'KUBERNETES / CI-CD',
    d: 'Architected and deployed a Docker-Kubernetes food delivery platform with independently scalable microservices, service discovery, load balancing and health checks. Built a Jenkins CI/CD pipeline on AWS EC2 with automated build, testing, deployment, auto-recovery and rollback.',
    tags: ['Docker', 'Kubernetes', 'Jenkins', 'AWS EC2', 'Microservices', 'CI/CD'],
    gh: GH, live: '#',
  },
  {
    s: 'Ticket Booking',
    name: 'Online Ticket Booking Application',
    cat: 'AWS / TERRAFORM / ANSIBLE',
    d: 'Designed and implemented an end-to-end deployment for a ticket booking application. Terraform provisions the AWS infrastructure as code, Ansible configures the servers and deploys the application, and a Jenkins CI/CD pipeline builds Docker images and releases them to Kubernetes. The project demonstrates infrastructure as code, configuration management, containerization and DevOps automation.',
    tags: ['AWS', 'Terraform', 'Ansible', 'Jenkins', 'Docker', 'Kubernetes', 'CI/CD'],
    gh: GH, live: '#',
  },
  {
    s: 'AWS 3-Tier',
    name: 'AWS 3-Tier Architecture',
    cat: 'AWS / CLOUD',
    d: 'Deployed a scalable 3-tier web application using AWS EC2, RDS and VPC networking across presentation, logic and data layers. Configured subnet segmentation, security groups, NAT gateways and load balancers for secure and resilient inter-tier connectivity.',
    tags: ['AWS EC2', 'RDS', 'VPC', 'Load Balancer', 'NAT Gateway', 'Security Groups'],
    gh: GH, live: '#',
  },
];
const N = P.length;

export default function Projects() {
  const pin = useRef(null);
  const cv = useRef(null);
  const curRef = useRef(0);
  const [cur, setCur] = useState(0);
  const p = P[cur];

  // scroll position -> which project is active
  useEffect(() => {
    const el = pin.current;
    const onScroll = () => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const prog = Math.min(0.9999, Math.max(0, (window.scrollY - top) / (el.offsetHeight - window.innerHeight)));
      const i = Math.floor(prog * N);
      el.style.setProperty('--p', i / (N - 1));
      if (i !== curRef.current) { curRef.current = i; setCur(i); }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // canvas animations
  useEffect(() => {
    const C = cv.current;
    const x = C.getContext('2d');
    if (!x.roundRect) x.roundRect = function (a, b, c, d) { this.rect(a, b, c, d); };
    let W = 0, H = 0, fs = 12;
    const G = '#4df0a0', RD = '#ff5d6c';
    const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

    const rs = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2);
      W = C.clientWidth; H = C.clientHeight;
      C.width = W * d; C.height = H * d;
      x.setTransform(d, 0, 0, d, 0, 0);
      fs = Math.max(10, Math.min(16, W * 0.017));
    };
    const B = (a, b, w, h, l, on, col) => {
      x.save();
      x.beginPath(); x.roundRect(a, b, w, h, 10);
      x.fillStyle = on ? (col || G) + '26' : '#ffffff08'; x.fill();
      x.strokeStyle = on ? (col || G) : '#ffffff30'; x.lineWidth = on ? 2 : 1.2; x.stroke();
      if (l) {
        x.fillStyle = on ? '#fff' : '#a9c0b5';
        x.font = `500 ${fs}px Bricolage Grotesque, sans-serif`;
        x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillText(l, a + w / 2, b + h / 2);
      }
      x.restore();
    };
    const T = (s, a, b, c, al) => {
      x.fillStyle = c || '#86a094';
      x.font = `500 ${fs * 0.9}px Bricolage Grotesque, sans-serif`;
      x.textAlign = al || 'left'; x.textBaseline = 'middle';
      x.fillText(s, a, b);
    };
    const D = (a, b, r, c) => { x.beginPath(); x.arc(a, b, r, 0, 7); x.fillStyle = c || G; x.fill(); };
    const L = (a, b, c, d, dash) => {
      x.save();
      if (dash) x.setLineDash([5, 5]);
      x.beginPath(); x.moveTo(a, b); x.lineTo(c, d);
      x.strokeStyle = '#ffffff2a'; x.lineWidth = 1.2; x.stroke();
      x.restore();
    };
    const Pt = (pts, u) => {
      const n = pts.length - 1, s = Math.min(n - 1e-6, u * n), i = Math.floor(s), k = s - i;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
    };

    const A = [
      // 0 JobTrack: cards move Applied > Interview > Offer
      (t) => {
        const cw = W * 0.26, ch = H * 0.76, cy = H * 0.1, gap = W * 0.03, x0 = W * 0.07;
        ['Applied', 'Interview', 'Offer'].forEach((n, i) => {
          B(x0 + i * (cw + gap), cy, cw, ch, '', i == 2);
          T(n, x0 + i * (cw + gap) + cw / 2, cy + ch * 0.07, i == 2 ? G : null, 'center');
        });
        ['Frontend', 'Backend', 'DevOps', 'Intern', 'SDE'].forEach((r, i) => {
          const u = (t * 0.1 + i / 5) % 1;
          const px = x0 + cw * 0.1 + u * 2 * (cw + gap);
          const py = cy + ch * 0.2 + (i % 3) * ch * 0.25;
          B(px, py, cw * 0.8, ch * 0.18, r, px > x0 + 2 * (cw + gap) - cw * 0.3);
        });
      },
      // 1 InfraFlow: push > actions > build > hub > deploy, plus rollback
      (t) => {
        const nm = ['Push', 'Actions', 'Build', 'Docker Hub', 'Deploy'];
        const cx = (i) => W * (0.12 + (0.76 * i) / 4);
        const y = H * 0.3, w = W * 0.15, h = H * 0.2;
        const pts = nm.map((_, i) => [cx(i), y + h / 2]);
        pts.slice(1).forEach((q, i) => L(pts[i][0] + w / 2, q[1], q[0] - w / 2, q[1]));
        const u = (t * 0.2) % 1;
        nm.forEach((n, i) => B(cx(i) - w / 2, y, w, h, n, Math.abs(u * 4 - i) < 0.35));
        const q = Pt(pts, u); D(q[0], q[1], 6);
        const v = Math.floor(t * 0.2) % 3;
        ['v1 known-good', 'v2', 'v3 live'].forEach((s, i) =>
          B(W * 0.2 + i * W * 0.22, H * 0.68, W * 0.19, H * 0.13, s, i == v, i == v && v == 1 ? RD : G));
        T('SHA-tagged images · rollback to last known-good', W / 2, H * 0.92, null, 'center');
      },
      // 2 Food delivery: ingress > services, one pod fails and self-heals
      (t) => {
        const px = W * 0.64, pw = W * 0.28, ph = H * 0.16;
        const nm = ['Order', 'Menu', 'Payment', 'Delivery'];
        const py = (i) => H * 0.08 + i * H * 0.22;
        const ix = W * 0.06, iy = H * 0.4, iw = W * 0.17, ih = H * 0.2;
        const f = Math.floor(t / 5) % 4, fail = t % 5 < 1.8;
        nm.forEach((n, i) => L(ix + iw, iy + ih / 2, px, py(i) + ph / 2, true));
        B(ix, iy, iw, ih, 'Ingress', 1);
        nm.forEach((n, i) => {
          const bad = fail && i == f;
          B(px, py(i), pw, ph, bad ? n + ' · restarting' : n, 1, bad ? RD : G);
        });
        for (let k = 0; k < 4; k++) {
          const s = t * 0.5 + k / 4;
          let tg = (k + Math.floor(s)) % 4;
          if (fail && tg == f) tg = (tg + 1) % 4;
          const q = Pt([[ix + iw, iy + ih / 2], [px, py(tg) + ph / 2]], s % 1);
          D(q[0], q[1], 5);
        }
        T('health checks · auto-recovery', W * 0.06, H * 0.88);
      },
      // 3 Ticket booking: Terraform > Ansible > Jenkins > Kubernetes
      (t) => {
        const nm = ['Terraform', 'Ansible', 'Jenkins', 'Kubernetes'];
        const items = [
          ['VPC', 'Subnets', 'Security Group', 'EC2 x3'],
          ['install Docker', 'install K8s', 'join workers', 'copy manifests'],
          ['git pull', 'build image', 'run tests', 'push image'],
          ['pod 1', 'pod 2', 'pod 3', 'service'],
        ];
        const cap = [
          'terraform apply · provisioning AWS as code',
          'ansible-playbook · configuring servers',
          'Jenkins pipeline · build, test and push',
          'kubectl apply · pods scale out',
        ];
        const pr = (t * 0.1) % 1;
        const st = Math.floor(pr * 4);
        const f = pr * 4 - st;
        const bw = W * 0.19, y = H * 0.08, bh = H * 0.17;

        nm.forEach((n, i) => {
          const xx = W * (0.06 + i * 0.235), fi = cl(pr * 4 - i);
          B(xx, y, bw, bh, n, i <= st);
          x.fillStyle = G; x.fillRect(xx + 8, y + bh - 10, (bw - 16) * fi, 4);
          if (i < 3) L(xx + bw, y + bh / 2, xx + W * 0.235, y + bh / 2);
        });

        T(nm[st] + ' · what is happening', W * 0.06, H * 0.36);
        items[st].forEach((label, i) => {
          const xx = W * (0.06 + i * 0.235), yy = H * 0.44;
          const on = f * 4 > i + 0.2;
          B(xx, yy, bw, H * 0.2, on ? (st === 0 ? '+ ' : '✓ ') + label : '', on);
        });
        T(cap[st], W * 0.06, H * 0.8);
      },
      // 4 AWS 3-tier: internet > load balancer > EC2 > RDS inside a VPC
      (t) => {
        const lb = [W * 0.2, H * 0.4, W * 0.17, H * 0.2];
        const e1 = [W * 0.46, H * 0.15, W * 0.17, H * 0.17];
        const e2 = [W * 0.46, H * 0.62, W * 0.17, H * 0.17];
        const db = [W * 0.74, H * 0.4, W * 0.17, H * 0.2];
        const nat = [W * 0.2, H * 0.78, W * 0.17, H * 0.12];
        x.save(); x.setLineDash([6, 6]); x.strokeStyle = '#4df0a055';
        x.strokeRect(W * 0.14, H * 0.06, W * 0.82, H * 0.88); x.restore();
        T('VPC', W * 0.15, H * 0.1, G);
        const c = (b) => [b[0] + b[2] / 2, b[1] + b[3] / 2];
        [[[W * 0.04, H * 0.5], c(lb)], [c(lb), c(e1)], [c(lb), c(e2)], [c(e1), c(db)], [c(e2), c(db)]]
          .forEach((s) => L(s[0][0], s[0][1], s[1][0], s[1][1], true));
        T('Internet', W * 0.02, H * 0.55);
        B(...lb, 'Load Balancer', 1); B(...e1, 'EC2 · app', 1); B(...e2, 'EC2 · app', 1);
        B(...db, 'RDS', 1); B(...nat, 'NAT Gateway');
        T('public', lb[0], lb[1] - 12); T('private app', e1[0], e1[1] - 12); T('data', db[0], db[1] - 12);
        for (let k = 0; k < 4; k++) {
          const u = (t * 0.28 + k / 4) % 1;
          const q = Pt([[W * 0.04, H * 0.5], c(lb), c(k % 2 ? e2 : e1), c(db)], u);
          D(q[0], q[1], 5);
        }
      },
    ];

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t0 = performance.now();
    let raf;
    const loop = () => {
      if (C.clientWidth !== W || C.clientHeight !== H) rs();
      const t = reduce ? 2 : (performance.now() - t0) / 1000;
      x.clearRect(0, 0, W, H);
      try { A[curRef.current](t); } catch (e) { console.error(e); }
      raf = requestAnimationFrame(loop);
    };
    rs();
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  const go = (i) => {
    const el = pin.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((i + 0.5) / N) * (el.offsetHeight - window.innerHeight), behavior: 'smooth' });
  };

  return (
    <>
      <header className="pj-intro">
        <h2>projects.</h2>
        <p>Cloud and DevOps projects focused on containerization, Kubernetes orchestration, CI/CD automation, AWS infrastructure and scalable application deployment.</p>
      </header>

      <section className="pin" ref={pin} id="projects" aria-label="Projects">
        <div className="pj-sticky">
          <ol className="pj-list">
            {P.map((q, i) => (
              <li key={q.s}>
                <button onClick={() => go(i)} aria-current={i === cur}>
                  0{i + 1} — {q.s}
                  <small>{q.cat}</small>
                </button>
              </li>
            ))}
          </ol>

          <div className="pj-stage">
            <div className="pj-art"><canvas ref={cv} /></div>
                        <div className="pj-tx" key={cur} aria-live="polite">
              <div className="pj-top"><span>0{cur + 1}</span><span>{p.cat}</span></div>
              <h3>{p.name}</h3>
              <p className="pj-d">{p.d}</p>
              <div className="pj-tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
              <div className="pj-lk">
                <a href={p.gh}>GitHub</a>
                <a href={p.live}>View Project ↗</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}