import ScrollReveal from '../../vendor/react-bits/ScrollReveal';

export function StudioIntro() {
  return (
    <section className="studio-intro section">
      <ScrollReveal>Good questions. Better possibilities.</ScrollReveal>
      <div className="intro-description">
        <p>
          You don’t need to know what to build.
          <br />
          You just need something worth solving.
        </p>
        <a className="pill pill-dark" href="#services">
          Explore what we do
        </a>
      </div>
    </section>
  );
}
