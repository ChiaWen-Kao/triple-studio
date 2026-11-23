import { useEffect, useRef, useState } from 'react';

const links = [
  { id: 'work', label: 'Selected work' },
  { id: 'services', label: 'What we do' },
  { id: 'studio', label: 'The studio' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  return (
    <header className="studio-header">
      <a
        className="studio-wordmark"
        href="#top"
        aria-label="Wendava Studio home"
      >
        wendava<small>STUDIO</small>
      </a>
      <div className="header-actions">
        <a className="pill pill-dark" href="#contact">
          Let’s talk <span aria-hidden="true">•</span>
        </a>
        <button
          ref={buttonRef}
          className="pill"
          type="button"
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isOpen}
          aria-controls="studio-navigation"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Close' : 'Menu'}{' '}
          <span aria-hidden="true">{isOpen ? '×' : '••'}</span>
        </button>
      </div>
      <nav
        id="studio-navigation"
        className="studio-navigation"
        hidden={!isOpen}
        aria-label="Main navigation"
      >
        {links.map(({ id, label }) => (
          <a key={id} href={`#${id}`} onClick={() => setIsOpen(false)}>
            {label}
          </a>
        ))}
        <a href="#contact" onClick={() => setIsOpen(false)}>
          Start a conversation
        </a>
      </nav>
    </header>
  );
}
