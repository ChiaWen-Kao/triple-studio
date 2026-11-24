import { LiquidWordmark } from './motion/LiquidWordmark';

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
          We design and build websites, web apps, mobile apps and AI-powered
          workflows for businesses.
        </p>
      </div>
      <LiquidWordmark />
      <a className="hero-scroll-cue" href="#services">
        <span className="scroll-icon" aria-hidden="true">
          <i />
        </span>
        <span>Scroll to explore</span>
      </a>
    </section>
  );
}
