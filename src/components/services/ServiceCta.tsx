export function ServiceCta() {
  return (
    <article className="services__step services__step--cta">
      <div className="services__card services__card--cta">
        <div className="services__cta-copy">
          <h3>Not sure what you need?</h3>
        </div>
        <div className="services__cta-action">
          <p>
            Tell us a little about your idea, and we'll figure out the next
            steps together.
          </p>
          <a className="services__cta-link" href="#contact">
            <span>Book a Chat</span>
            <span className="services__cta-mark" aria-hidden="true">
              ↗
            </span>
          </a>
          <p className="services__pricing-note">
            Our pricing is based on your project scope, complexity and the
            support you need. Tell us what you're working on, and we'll put
            together a clear quote for you.
          </p>
        </div>
      </div>
    </article>
  );
}
