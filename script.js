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

  const previousStackRect = servicesStack.getBoundingClientRect();
  const previousStackTop = previousStackRect.top + window.scrollY;
  const viewportAnchor = window.scrollY + window.innerHeight * 0.35;
  const shouldPreserveStackPosition =
    viewportAnchor >= previousStackTop &&
    viewportAnchor <= previousStackTop + previousStackRect.height;
  const stackProgress = previousStackRect.height > 0
    ? (viewportAnchor - previousStackTop) / previousStackRect.height
    : 0;

  servicesMode = mode;
  servicesSwitch.dataset.active = mode;
  servicesStack.dataset.mode = mode;

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

  applyServiceCardMode(mode);

  servicesSection?.querySelectorAll('[data-whole-text]').forEach((element) => {
    element.textContent = element.dataset[mode === 'whole' ? 'wholeText' : 'partText'];
  });

  if (servicesStatus) {
    servicesStatus.textContent = `Showing ${mode === 'whole' ? 'complete projects' : 'focused support'}.`;
  }

  window.requestAnimationFrame(() => {
    syncServiceCardHeights();

    if (shouldPreserveStackPosition) {
      const nextStackHeight = servicesStack.getBoundingClientRect().height;
      const nextAnchor = previousStackTop + Math.min(Math.max(stackProgress, 0), 1) * nextStackHeight;
      window.scrollBy({
        top: nextAnchor - (window.scrollY + window.innerHeight * 0.35),
        behavior: 'auto',
      });
    }

    updateActiveServiceCard();
  });
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

const serviceSteps = [...document.querySelectorAll('.services__step')];
let serviceCardsFrame;

function applyServiceCardMode(mode) {
  servicesStack.querySelectorAll('[data-hide-in-part]').forEach((step) => {
    step.hidden = mode === 'part';
  });

  servicesStack.querySelectorAll('[data-show-in-part]').forEach((step) => {
    step.hidden = mode !== 'part';
  });

  ['meta', 'title', 'description', 'examples'].forEach((field) => {
    servicesStack.querySelectorAll(`[data-whole-${field}]`).forEach((element) => {
      const nextValue = element.dataset[`${mode}${field[0].toUpperCase()}${field.slice(1)}`];
      if (typeof nextValue === 'string') element.textContent = nextValue;
    });
  });

  servicesStack.querySelectorAll('h3').forEach((title) => {
    const longestWordLength = Math.max(...title.textContent.trim().split(/\s+/).map((word) => word.length));
    title.classList.toggle('services__title--long', longestWordLength >= 11);
  });
}

function syncServiceCardHeights() {
  const activeMode = servicesMode;
  if (activeMode !== 'whole') applyServiceCardMode('whole');

  servicesStack.dataset.mode = 'whole';
  serviceSteps.forEach((step) => {
    const card = step.querySelector('.services__card');
    if (card) card.style.height = '';
  });

  const wholeModeCards = serviceSteps
    .filter((step) => !step.hidden)
    .map((step) => step.querySelector('.services__card'))
    .filter(Boolean);

  if (wholeModeCards.length) {
    const tallestCardHeight = Math.max(
      ...wholeModeCards.map((card) => card.getBoundingClientRect().height),
    );

    serviceSteps.forEach((step) => {
      const card = step.querySelector('.services__card');
      if (card) card.style.height = `${Math.ceil(tallestCardHeight)}px`;
    });
  }

  if (activeMode !== 'whole') {
    applyServiceCardMode(activeMode);
    servicesStack.dataset.mode = activeMode;
  }
}

function updateActiveServiceCard() {
  const visibleServiceSteps = serviceSteps.filter((step) => !step.hidden);
  if (!visibleServiceSteps.length) return;

  const stickyTop = Number.parseFloat(window.getComputedStyle(visibleServiceSteps[0]).top) || 0;
  let activeIndex = 0;

  visibleServiceSteps.forEach((step, index) => {
    if (step.getBoundingClientRect().top <= stickyTop + 1) activeIndex = index;
  });

  const nextStep = visibleServiceSteps[activeIndex + 1];
  const fadeStart = Math.max(stickyTop + 10 * 16, window.innerHeight * 0.82);
  const fadeDistance = Math.max(fadeStart - stickyTop, 1);
  const fadeProgress = nextStep
    ? Math.min(Math.max((fadeStart - nextStep.getBoundingClientRect().top) / fadeDistance, 0), 1)
    : 0;

  serviceSteps.forEach((step) => {
    step.style.setProperty('--service-card-opacity', '0');
    step.style.pointerEvents = 'none';
  });

  visibleServiceSteps.forEach((step, index) => {
    let opacity = 0;

    if (index === activeIndex) opacity = 1 - fadeProgress * 0.74;
    if (index === activeIndex + 1) opacity = 1;

    step.style.setProperty('--service-card-opacity', opacity.toFixed(2));
    step.style.pointerEvents = opacity < 0.05 ? 'none' : '';
  });
}

function requestServiceCardUpdate() {
  if (serviceCardsFrame) return;
  serviceCardsFrame = window.requestAnimationFrame(() => {
    updateActiveServiceCard();
    serviceCardsFrame = undefined;
  });
}

function requestServiceCardLayout() {
  if (serviceCardsFrame) window.cancelAnimationFrame(serviceCardsFrame);
  serviceCardsFrame = window.requestAnimationFrame(() => {
    syncServiceCardHeights();
    updateActiveServiceCard();
    serviceCardsFrame = undefined;
  });
}

syncServiceCardHeights();
updateActiveServiceCard();
window.addEventListener('scroll', requestServiceCardUpdate, { passive: true });
window.addEventListener('resize', requestServiceCardLayout);
