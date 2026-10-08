import Intro from './components/Intro';
import Cursor from './components/Cursor';
import TechOrb from './components/TechOrb';
import Nav from './components/Nav';
import ScrollRail from './components/ScrollRail';
import StatusBar from './components/StatusBar';
import Terminal from './components/Terminal';
import ScrambleAll from './components/ScrambleAll';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Chaos from './components/Chaos';
import Contact from './components/Contact';

export default function Home() {
  return (
    <>
      <Intro />
      <Cursor />
      <TechOrb />
      <Nav />
      <ScrollRail />
      <StatusBar />
      <Terminal />
      <ScrambleAll />
      <main>
        <section className="hero" id="hero">
          <h1 className="name" aria-label="Kartik">
            {[...'KARTIK'].map((c, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.08}s` }}>{c}</span>
            ))}
          </h1>
          <p className="sub">
            <b>Cloud and DevOps</b> engineer building full-stack products that ship and scale.
          </p>
        </section>
        <About />
        <Skills />
        <Projects />
        <Chaos />
        <Contact />
      </main>
    </>
  );
}