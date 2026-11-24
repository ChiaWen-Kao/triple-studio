import type { MouseEvent } from 'react';
import { services } from '../../constants/services';
import ScrollReveal from '../../vendor/react-bits/ScrollReveal';

export function Services() {
  const goToContact = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    const contact = document.getElementById('contact');
    if (!contact) return;
    event.preventDefault();
    history.pushState(null, '', '#contact');
    contact.scrollIntoView({ behavior: 'instant', block: 'start' });
    contact.focus({ preventScroll: true });
  };
  return (
    <section
      id="services"
      className="section studio-services"
      aria-labelledby="services-heading"
    >
      <div className="services-intro">
        <ScrollReveal id="services-heading">What we can help with</ScrollReveal>
        <p>Start with the problem. We’ll find the right tools together.</p>
      </div>
      <div className="service-options">
        {services.map((service, index) => (
          <article className="service-option" key={service.title}>
            <span className="service-number" aria-hidden="true">
              0{index + 1}
            </span>
            <div>
              <h3>{service.title}</h3>
              <p className="service-subtitle">{service.subtitle}</p>
              <p className="service-description">{service.description}</p>
              <p className="service-labels">
                <span>Services</span>
                {service.labels.join(' · ')}
              </p>
            </div>
          </article>
        ))}
      </div>
      <div className="services-cta">
        <p>Not sure where to start?</p>
        <a
          className="pill pill-dark section-cta"
          href="#contact"
          onClick={goToContact}
        >
          Let’s talk <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
