'use client';
import { useEffect, useRef } from 'react';

const TEXT =
  'I build and deploy cloud-native applications. From Docker and Kubernetes to Jenkins pipelines and AWS networks, I automate how software gets built, tested and shipped, and I build full-stack products with Next.js on top.';

export default function About() {
  const sec = useRef(null);

  useEffect(() => {
    const words = sec.current.querySelectorAll('.w');
    const update = () => {
      const r = sec.current.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.75 - r.top) / (r.height * 0.7)));
      words.forEach((w, i) => w.classList.toggle('on', i / words.length < p));
    };
    update();
    window.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <section className="about" id="about" ref={sec}>
      <div className="lbl">About</div>
      <p>
        {TEXT.split(' ').map((w, i) => (
          <span className="w" key={i}>{w} </span>
        ))}
      </p>
    </section>
  );
}