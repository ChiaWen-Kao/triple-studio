import { IdeaScene } from './motion/IdeaScene';

export function Hero() {
  return (
    <section id="top" className="studio-hero" aria-labelledby="hero-heading">
      <div className="hero-introduction">
        <h1 id="hero-heading">
          Creative thinking.
          <br />
          Real-world solutions.
        </h1>
        <p>
          We turn your ideas and everyday challenges into useful digital
          experiences.
        </p>
      </div>
      <IdeaScene />
      <div className="scene-baseline" aria-hidden="true">
        <span>+</span>
        <span>Ideas take shape</span>
        <span>Scroll to explore</span>
        <span>+</span>
      </div>
    </section>
  );
}
