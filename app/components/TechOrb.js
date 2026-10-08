'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// [label, color (6-digit hex)] - EDIT THIS LIST. Remove tools you have not used.
const T = [
  ['Docker', '#2496ed'], ['K8s', '#326ce5'], ['Helm', '#4f6bed'], ['Terraform', '#7b42bc'],
  ['Ansible', '#ff4d4d'], ['Jenkins', '#ff5a52'], ['Actions', '#2088ff'], ['Git', '#f05033'],
  ['AWS', '#ff9900'], ['EC2', '#ffb340'], ['S3', '#e25444'], ['RDS', '#527fff'],
  ['VPC', '#8c4fff'], ['IAM', '#dd344c'], ['Linux', '#fcc624'], ['Bash', '#6ccf3a'],
  ['Python', '#4b8bbe'], ['Nginx', '#12c35a'], ['Traefik', '#24a1c1'], ['Prometheus', '#e6522c'],
  ['Grafana', '#f46800'], ['Redis', '#dc382d'], ['Postgres', '#4f8fc7'], ['Mongo', '#47a248'],
  ['Next', '#e5e7eb'], ['React', '#61dafb'], ['TS', '#3178c6'], ['Node', '#5fa04e'],
  ['Compose', '#38b6ff'], ['CI/CD', '#4df0a0'],
];

// where the orb sits for each section: x position, size, opacity, glow color
const STATES = {
  hero:   { x: 2.4, s: 1,    o: 1,    c: '#4df0a0' },
  about:  { x: 2.8, s: 0.55, o: 0.3,  c: '#38bdf8' },
  skills: { x: 0,   s: 1.45, o: 1,    c: '#4df0a0' },
  work:   { x: 3.4, s: 0.45, o: 0.12, c: '#2de2c4' },
};
const SEL = { hero: '#hero', about: '#about', skills: '#skills', work: '.pj-intro' };

// draws one frosted-glass badge
function makeBadge(label, col) {
  const S = 256, cx = S / 2, r = 108;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const x = c.getContext('2d');

  // soft colored halo
  let g = x.createRadialGradient(cx, cx, r * 0.6, cx, cx, r * 1.16);
  g.addColorStop(0, col + '66');
  g.addColorStop(1, col + '00');
  x.fillStyle = g;
  x.beginPath(); x.arc(cx, cx, r * 1.16, 0, 7); x.fill();

  // glass body
  g = x.createRadialGradient(cx * 0.8, cx * 0.7, r * 0.08, cx, cx, r);
  g.addColorStop(0, 'rgba(255,255,255,0.34)');
  g.addColorStop(0.5, col + '30');
  g.addColorStop(1, col + '70');
  x.fillStyle = g;
  x.beginPath(); x.arc(cx, cx, r, 0, 7); x.fill();

  // bright rim, white at top-left fading to the tool color
  g = x.createLinearGradient(cx - r, cx - r, cx + r, cx + r);
  g.addColorStop(0, 'rgba(255,255,255,0.95)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.15)');
  g.addColorStop(1, col + 'cc');
  x.strokeStyle = g; x.lineWidth = 5;
  x.beginPath(); x.arc(cx, cx, r - 2, 0, 7); x.stroke();

  // inner thin ring for depth
  x.strokeStyle = 'rgba(255,255,255,0.14)'; x.lineWidth = 2;
  x.beginPath(); x.arc(cx, cx, r - 14, 0, 7); x.stroke();

  // specular highlight (top-left)
  x.save();
  x.translate(cx - 36, cx - 54);
  x.rotate(-0.62);
  g = x.createLinearGradient(0, -22, 0, 22);
  g.addColorStop(0, 'rgba(255,255,255,0.65)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.beginPath(); x.ellipse(0, 0, 52, 20, 0, 0, 7); x.fill();
  x.restore();

  // soft reflection (bottom)
  g = x.createRadialGradient(cx, cx + r * 0.78, 2, cx, cx + r * 0.78, r * 0.55);
  g.addColorStop(0, col + '88');
  g.addColorStop(1, col + '00');
  x.save();
  x.beginPath(); x.arc(cx, cx, r - 8, 0, 7); x.clip();
  x.fillStyle = g; x.fillRect(0, 0, S, S);
  x.restore();

  // label
  const size = label.length > 8 ? 34 : label.length > 5 ? 42 : label.length > 3 ? 54 : 66;
  x.font = `800 ${size}px sans-serif`;
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.shadowColor = col; x.shadowBlur = 16;
  x.fillStyle = '#ffffff';
  x.fillText(label, cx, cx + 4);

  const tx = new THREE.CanvasTexture(c);
  tx.colorSpace = THREE.SRGBColorSpace;
  return tx;
}

export default function TechOrb() {
  const cvRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const canvas = cvRef.current;
    const R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    R.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const sc = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    cam.position.z = 8.4;

    const textures = T.map(([t, col]) => makeBadge(t, col));

    const orb = new THREE.Group();
    const sprites = [];
    const N = 66;
    const RAD = 2.55;
    for (let i = 0; i < N; i++) {
      const y = 1 - (2 * (i + 0.5)) / N, r = Math.sqrt(1 - y * y), a = i * 2.39996;
      const mat = new THREE.SpriteMaterial({
        map: textures[i % textures.length],
        transparent: true,
        depthWrite: false,
      });
      const s = new THREE.Sprite(mat);
      s.position.set(Math.cos(a) * r, y, Math.sin(a) * r).multiplyScalar(RAD);
      s.scale.setScalar(0.62 + Math.random() * 0.3);
      s.userData.b = s.position.clone();
      s.userData.p = Math.random() * 6;
      sprites.push(s);
      orb.add(s);
    }

    // two thin glass rings around the orb
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x4df0a0, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false,
    });
    const ringGeo = new THREE.RingGeometry(RAD + 0.25, RAD + 0.27, 160);
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2.25;
    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.x = Math.PI / 2;
    ring2.rotation.y = 0.7;
    orb.add(ring1, ring2);
    sc.add(orb);

    const resize = () => {
      R.setSize(window.innerWidth, window.innerHeight, false);
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
    };
    resize();

    let mx = window.innerWidth / 2, my = window.innerHeight / 2, gx = mx, gy = my;
    const move = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('pointermove', move);
    window.addEventListener('resize', resize);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cur = 'hero', ox = 0, os = 1, oo = 1, rot = 0, raf;
    const t0 = performance.now();
    const wp = new THREE.Vector3();

    const loop = () => {
      const t = (performance.now() - t0) / 1000;
      const mid = window.scrollY + window.innerHeight * 0.5;
      let best = 'hero', bestTop = -Infinity;
      for (const k in SEL) {
        const el = document.querySelector(SEL[k]);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= mid && top > bestTop) { best = k; bestTop = top; }
      }
      if (best !== cur) {
        cur = best;
        document.documentElement.style.setProperty('--glow', STATES[cur].c);
      }
      const st = STATES[cur], wide = window.innerWidth > 800;
      ox += ((wide ? st.x : 0) - ox) * 0.05;
      os += (st.s * (wide ? 1 : 0.7) - os) * 0.05;
      oo += (st.o - oo) * 0.05;
      orb.position.set(ox, wide ? 0 : 1.6, 0);
      orb.scale.setScalar(os);
      rot += ((mx / window.innerWidth - 0.5) * 3 - rot) * 0.04;
      orb.rotation.y = reduce ? 0 : t * 0.15 + rot;
      orb.rotation.x = reduce ? 0 : (my / window.innerHeight - 0.5) * 0.6;
      ringMat.opacity = 0.18 * oo;

      sprites.forEach((s) => {
        const k = 1 + 0.05 * Math.sin(t * 1.5 + s.userData.p);
        s.position.copy(s.userData.b).multiplyScalar(k);
        // badges at the back fade, so the front ones feel like glass in front
        s.getWorldPosition(wp);
        const depth = THREE.MathUtils.clamp((wp.z / (RAD * os)) * 0.5 + 0.5, 0, 1);
        s.material.opacity = oo * (0.4 + 0.6 * depth);
      });
      R.render(sc, cam);

      gx += (mx - gx) * 0.04; gy += (my - gy) * 0.04;
      if (glowRef.current) {
        const half = window.innerWidth * 0.35;
        glowRef.current.style.transform = `translate(${gx - half}px, ${gy - half}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('resize', resize);
      textures.forEach((tx) => tx.dispose());
      sprites.forEach((s) => s.material.dispose());
      ringGeo.dispose();
      ringMat.dispose();
      R.dispose();
    };
  }, []);

  return (
    <>
      <div className="glow" ref={glowRef} />
      <canvas id="gl" ref={cvRef} />
    </>
  );
}