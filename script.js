const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.site-nav');
const siteHeader = document.querySelector('.site-header');
const cursorDot = document.querySelector('.cursor-dot');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

if (cursorDot && finePointer.matches) {
  document.documentElement.classList.add('has-custom-cursor');

  window.addEventListener('pointermove', ({ clientX, clientY }) => {
    cursorDot.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
    cursorDot.classList.add('is-visible');
  });

  document.documentElement.addEventListener('pointerleave', () => {
    cursorDot.classList.remove('is-visible');
  });
}

const updateHeaderState = () => {
  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 48);
};

updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navigation.classList.toggle('is-open', !isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  });
});

const sectionLinks = [...(navigation?.querySelectorAll('a[href^="#"]:not(.nav-cta)') ?? [])];
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const setActiveSection = (sectionId) => {
  sectionLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${sectionId}`;
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
};

const activeSectionObserver = new IntersectionObserver(
  (entries) => {
    const activeEntry = entries.find((entry) => entry.isIntersecting);
    if (activeEntry) setActiveSection(activeEntry.target.id);
  },
  { rootMargin: '-28% 0px -62% 0px', threshold: 0 },
);

observedSections.forEach((section) => activeSectionObserver.observe(section));

const servicesSection = document.querySelector('#services');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (servicesSection && !reduceMotion && window.gsap && window.ScrollTrigger) {
  window.gsap.registerPlugin(window.ScrollTrigger);
  window.gsap.fromTo(
    servicesSection,
    { autoAlpha: 0, y: 56 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: servicesSection,
        start: 'top 82%',
        once: true,
      },
    },
  );
} else if (servicesSection && !reduceMotion) {
  servicesSection.style.opacity = '0';
  servicesSection.style.transform = 'translateY(56px)';

  const servicesObserver = new IntersectionObserver(
    ([entry], observer) => {
      if (!entry.isIntersecting) return;
      servicesSection.animate(
        [
          { opacity: 0, transform: 'translateY(56px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 900, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' },
      );
      observer.disconnect();
    },
    { threshold: 0.15 },
  );

  servicesObserver.observe(servicesSection);
}

const contactForm = document.querySelector('.contact-form');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = contactForm.querySelector('.form-status');
  if (status) status.hidden = false;
});

const servicesSwitch = document.querySelector('.services__switch');
const servicesTabs = [...(servicesSwitch?.querySelectorAll('[role="tab"]') ?? [])];
const servicesStack = document.querySelector('#services-stack');
const servicesStatus = document.querySelector('#services-mode-status');
let servicesMode = 'whole';

function setServicesMode(mode) {
  if (!servicesSwitch || !servicesStack || !['whole', 'part'].includes(mode)) return;

  servicesMode = mode;
  servicesSwitch.dataset.active = mode;

  servicesTabs.forEach((tab) => {
    const selected = tab.dataset.mode === mode;
    tab.classList.toggle('is-active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  servicesStack.setAttribute(
    'aria-labelledby',
    mode === 'whole' ? 'services-whole-tab' : 'services-part-tab',
  );

  ['meta', 'title', 'description', 'scope'].forEach((field) => {
    servicesStack.querySelectorAll(`[data-whole-${field}]`).forEach((element) => {
      element.textContent = element.dataset[`${mode}${field[0].toUpperCase()}${field.slice(1)}`];
    });
  });

  if (servicesStatus) {
    servicesStatus.textContent = `Showing ${mode === 'whole' ? 'complete projects' : 'focused support'}.`;
  }
}

servicesTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    if (tab.dataset.mode !== servicesMode) setServicesMode(tab.dataset.mode);
  });

  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % servicesTabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + servicesTabs.length) % servicesTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = servicesTabs.length - 1;

    servicesTabs[nextIndex].focus();
    setServicesMode(servicesTabs[nextIndex].dataset.mode);
  });
});
