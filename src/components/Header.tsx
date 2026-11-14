import { useEffect, useRef, useState } from 'react';

const links = [
  { id: 'services', label: 'Service' },
  { id: 'process', label: 'How we work' },
  { id: 'team', label: 'Team' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateHeader = () =>
      headerRef.current?.classList.toggle('is-scrolled', window.scrollY > 48);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries.find((entry) => entry.isIntersecting);
        if (active) setActiveSection(active.target.id);
      },
      { rootMargin: '-28% 0px -62% 0px', threshold: 0 },
    );
    links.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => {
      window.removeEventListener('scroll', updateHeader);
      observer.disconnect();
    };
  }, []);

  return (
    <header
      className="site-header"
      ref={headerRef}
      data-wire-label="Sticky anchor nav"
    >
      <a className="wordmark" href="#top" aria-label="triple studio home">
        <span className="wordmark-name">
          <span className="wordmark-primary">
            triple
            <span className="wordmark-dot" aria-hidden="true">
              .
            </span>
          </span>
          <span className="wordmark-studio">studio</span>
        </span>
      </a>
      <button
        className="menu-button"
        type="button"
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpen}
        aria-controls="site-nav"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="menu-icon" aria-hidden="true" />
      </button>
      <nav
        id="site-nav"
        className={`site-nav${isOpen ? ' is-open' : ''}`}
        aria-label="Main navigation"
      >
        {links.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={() => setIsOpen(false)}
            className={activeSection === id ? 'is-active' : undefined}
            aria-current={activeSection === id ? 'location' : undefined}
          >
            {label}
          </a>
        ))}
        <a className="nav-cta" href="#contact" onClick={() => setIsOpen(false)}>
          Book a chat
        </a>
      </nav>
    </header>
  );
}
