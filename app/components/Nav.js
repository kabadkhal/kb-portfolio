'use client';
import { useEffect, useRef } from 'react';

export default function Nav() {
  const bar = useRef(null);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <>
      <div className="bar" ref={bar} />
      <nav className="nav">
        <a href="#hero" data-cur="Top">KB</a>
        <div>
          <a href="#about">About</a>
          <a href="#skills">Stack</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>
    </>
  );
}