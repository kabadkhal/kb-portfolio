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
import HeroGreeting from './components/HeroGreeting';
import MobileRail from './components/MobileRail';
import Certifications from './components/Certifications';

export default function Home() {
  return (
    <>
      <Intro />
      <Cursor />
      <TechOrb />
      <Nav />
      <ScrollRail />
      <MobileRail />
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
             <HeroGreeting />
        </section>
        <About />
        <Skills />
        <Projects />
        <Chaos />
        <Certifications />
        <Contact />
      </main>
    </>
  );
}