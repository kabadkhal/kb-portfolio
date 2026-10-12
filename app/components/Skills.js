export default function Skills() {
  return (
    <section className="skills" id="skills">
      <h2>My stack,<br />in orbit.</h2>
      {/* mouse devices see the first line, touch screens and phones see the second */}
      <small className="sk-desk">Move your cursor to spin it.</small>
      <small className="sk-touch">Scroll to explore the stack.</small>
      <style>{`
        @media (hover: hover) and (min-width: 801px) { .skills .sk-touch { display: none; } }
        @media (hover: none), (max-width: 800px) { .skills .sk-desk { display: none; } }
      `}</style>
    </section>
  );
}