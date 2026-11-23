const services = [
  {
    title: 'Bring an idea to life.',
    description: 'From a first sketch to something people can use.',
    details:
      'We help clarify the idea, test what matters, design the experience and build the first useful version. Websites, web apps and mobile products—chosen around the problem.',
  },
  {
    title: 'Make everyday work easier.',
    description: 'Less copying, chasing and switching between tools.',
    details:
      'We look at how your team works, connect scattered information and simplify repeated tasks. That might mean a custom business tool, a connected workflow, or a small improvement to what you already use.',
  },
  {
    title: 'Move an existing product forward.',
    description: 'Keep what works. Improve what gets in the way.',
    details:
      'We help make an existing website or app clearer, easier to use and ready for its next stage. We can support one part of a project or work with you from discovery to launch.',
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="section studio-services"
      aria-labelledby="services-heading"
    >
      <div className="services-intro">
        <p className="eyebrow">What we can help with</p>
        <h2 id="services-heading">
          A useful
          <br />
          way forward.
        </h2>
        <p>
          Start with the problem.
          <br />
          We’ll find the right tools together.
        </p>
      </div>
      <div className="service-options">
        {services.map((service) => (
          <details key={service.title}>
            <summary>
              <span>
                <strong>{service.title}</strong>
                <span>{service.description}</span>
              </span>
              <i aria-hidden="true">+</i>
            </summary>
            <p>{service.details}</p>
          </details>
        ))}
        <a className="text-link" href="#contact">
          Not sure where to start? Let’s talk.
        </a>
      </div>
    </section>
  );
}
