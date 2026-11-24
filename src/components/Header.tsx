import { useEffect, useRef, useState } from 'react';

const links = [
  { id: 'work', label: 'Selected work' },
  { id: 'services', label: 'What we do' },
  { id: 'studio', label: 'The studio' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);
  const openNavigation = () => {
    dialogRef.current?.showModal();
    setIsOpen(true);
  };
  const closeNavigation = () => dialogRef.current?.close();
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
          Let’s talk
        </a>
        <button
          ref={buttonRef}
          className="pill menu-toggle"
          type="button"
          aria-label="Open navigation"
          aria-expanded={isOpen}
          aria-controls="studio-navigation"
          onClick={openNavigation}
        >
          <span className="menu-label">Menu</span>
          <span aria-hidden="true">••</span>
        </button>
      </div>
      <dialog
        ref={dialogRef}
        id="studio-navigation"
        className="navigation-dialog"
        aria-label="Main navigation"
        onClose={() => {
          setIsOpen(false);
          buttonRef.current?.focus();
        }}
      >
        <div className="navigation-top">
          <span className="studio-wordmark">
            wendava<small>STUDIO</small>
          </span>
          <button
            className="pill menu-toggle"
            aria-label="Close navigation"
            onClick={closeNavigation}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav className="studio-navigation" aria-label="Main navigation">
          {links.map(({ id, label }, index) => (
            <a key={id} href={`#${id}`} onClick={closeNavigation}>
              <small>0{index + 1}</small>
              {label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
        <a
          className="navigation-contact"
          href="#contact"
          onClick={closeNavigation}
        >
          Have a “what if”?
          <strong>
            Let’s talk <span aria-hidden="true">↗</span>
          </strong>
        </a>
        <p className="navigation-note">
          Creative thinking. Real-world solutions.
        </p>
      </dialog>
    </header>
  );
}
