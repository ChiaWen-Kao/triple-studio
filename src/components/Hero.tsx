export function Hero() {
  return (
    <section id="top" className="section hero" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <h1 id="hero-heading">
          You bring the idea.
          <br />
          We bring it to life.
        </h1>
        <p className="hero-intro">
          We help teams turn ideas into clear, useful digital products—designed
          and built together from first concept to launch.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#contact">
            Book a chat
          </a>
          <a className="text-link" href="#services">
            See what we make
          </a>
        </div>
      </div>

      <div
        className="motion-canvas"
        aria-label="Geometric composition showing triple studio capabilities"
      ></div>
    </section>
  );
}
