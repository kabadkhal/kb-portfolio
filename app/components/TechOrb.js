'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// [label, badge color, text color] - edit to match your real stack
const T = [
  ['Docker', '#2496ed', '#fff'], ['K8s', '#326ce5', '#fff'], ['Jenkins', '#d33833', '#fff'],
  ['AWS', '#ff9900', '#000'], ['Git', '#f05033', '#fff'], ['Actions', '#2088ff', '#fff'],
  ['Next', '#ffffff', '#000'], ['React', '#20232a', '#61dafb'], ['TS', '#3178c6', '#fff'],
  ['Node', '#3c873a', '#fff'], ['Mongo', '#4db33d', '#fff'], ['Postgres', '#336791', '#fff'],
  ['Traefik', '#24a1c1', '#fff'], ['EC2', '#ff9900', '#000'], ['RDS', '#527fff', '#fff'],
  ['VPC', '#8c4fff', '#fff'], ['CI/CD', '#4df0a0', '#000'], ['Linux', '#fcc624', '#000'],
];

// where the orb sits for each section: x position, size, opacity, glow color
const STATES = {
  hero:   { x: 2.4, s: 1,    o: 1,    c: '#4df0a0' },
  about:  { x: 2.8, s: 0.55, o: 0.3,  c: '#38bdf8' },
  skills: { x: 0,   s: 1.45, o: 1,    c: '#4df0a0' },
  work:   { x: 3.4, s: 0.45, o: 0.12, c: '#2de2c4' },
};
const SEL = { hero: '#hero', about: '#about', skills: '#skills', work: '.pj-intro' };

export default function TechOrb() {
  const cvRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const canvas = cvRef.current;
    const R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    R.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const sc = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    cam.position.z = 8;

    const textures = T.map(([t, bg, fg]) => {
      const c = document.createElement('canvas');
      c.width = c.height = 128;
      const x = c.getContext('2d');
      x.fillStyle = bg; x.beginPath(); x.arc(64, 64, 60, 0, 7); x.fill();
      x.fillStyle = fg; x.font = '800 ' + (t.length > 5 ? 26 : t.length > 3 ? 32 : 40) + 'px sans-serif';
      x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(t, 64, 66);
      return new THREE.CanvasTexture(c);
    });

    const orb = new THREE.Group();
    const sprites = [];
    const N = 48;
    for (let i = 0; i < N; i++) {
      const y = 1 - (2 * (i + 0.5)) / N, r = Math.sqrt(1 - y * y), a = i * 2.39996;
      const mat = new THREE.SpriteMaterial({ map: textures[i % textures.length], transparent: true });
      const s = new THREE.Sprite(mat);
      s.position.set(Math.cos(a) * r, y, Math.sin(a) * r).multiplyScalar(2.3);
      s.scale.setScalar(0.55 + Math.random() * 0.35);
      s.userData.b = s.position.clone();
      s.userData.p = Math.random() * 6;
      sprites.push(s); orb.add(s);
    }
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
      sprites.forEach((s) => {
        s.material.opacity = oo;
        const k = 1 + 0.06 * Math.sin(t * 1.5 + s.userData.p);
        s.position.copy(s.userData.b).multiplyScalar(k);
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