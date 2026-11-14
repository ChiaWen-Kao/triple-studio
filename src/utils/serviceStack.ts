export function updateServiceCardOpacity(steps: HTMLElement[]) {
  const visible = steps.filter((step) => !step.hidden);
  if (!visible.length) return;
  const stickyTop = Number.parseFloat(getComputedStyle(visible[0]).top) || 0;
  let activeIndex = 0;
  visible.forEach((step, index) => {
    if (step.getBoundingClientRect().top <= stickyTop + 1) activeIndex = index;
  });
  const next = visible[activeIndex + 1];
  const fadeStart = Math.max(stickyTop + 160, window.innerHeight * 0.82);
  const progress = next
    ? Math.min(
        Math.max(
          (fadeStart - next.getBoundingClientRect().top) /
            Math.max(fadeStart - stickyTop, 1),
          0,
        ),
        1,
      )
    : 0;
  steps.forEach((step) => {
    const index = visible.indexOf(step);
    const opacity =
      index === activeIndex
        ? 1 - progress * 0.74
        : index === activeIndex + 1
          ? 1
          : 0;
    step.style.setProperty('--service-card-opacity', opacity.toFixed(2));
    step.style.pointerEvents = opacity < 0.05 ? 'none' : '';
  });
}

export function syncServiceCardHeights(
  section: HTMLElement,
  measurement: HTMLElement,
) {
  const stack = section.querySelector<HTMLElement>('#services-stack');
  if (!stack) return;
  measurement.style.width = `${stack.getBoundingClientRect().width}px`;
  const heights = Array.from(
    measurement.querySelectorAll<HTMLElement>(
      '.services__step:not([hidden]) .services__card',
    ),
  ).map((card) => card.getBoundingClientRect().height);
  const height = Math.ceil(Math.max(...heights));
  section
    .querySelectorAll<HTMLElement>('.services__stack .services__card')
    .forEach((card) => {
      card.style.height = `${height}px`;
    });
}
