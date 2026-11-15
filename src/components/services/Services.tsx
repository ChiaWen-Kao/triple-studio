import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { services } from '../../constants/services';
import type { ServiceMode } from '../../types/services';
import { useServiceStack } from '../../hooks/useServiceStack';
import { useServicesReveal } from '../../hooks/useServicesReveal';
import { ServiceCard } from './ServiceCard';
import { ServiceCta } from './ServiceCta';

const modes: { id: ServiceMode; label: string }[] = [
  { id: 'whole', label: 'The Whole Thing' },
  { id: 'part', label: 'One Part' },
];

export function Services() {
  const [mode, setMode] = useState<ServiceMode>('whole');
  const [announcement, setAnnouncement] = useState('');
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const { sectionRef, measurementRef, preserveScrollPosition } =
    useServiceStack(mode);
  useServicesReveal(sectionRef);

  function selectMode(next: ServiceMode) {
    if (next === mode) return;
    preserveScrollPosition();
    setMode(next);
    setAnnouncement(
      `Showing ${next === 'whole' ? 'complete projects' : 'focused support'}.`,
    );
  }
  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
    tabsRef.current[next]?.focus();
    selectMode(modes[next].id);
  }

  return (
    <section
      id="services"
      className="section services"
      aria-labelledby="services-heading"
      ref={sectionRef}
    >
      <div className="services__header">
        <div className="services__intro">
          <h2 id="services-heading" className="section-title">
            How can we help?
          </h2>
        </div>
        <div className="services__chooser">
          <p className="services__summary">
            Whether you need a complete project or support with a specific part,
            we're here to help.
          </p>
        </div>
      </div>
      <div className="services__stack">
        <div className="services__work">
          <div className="services__switch-sticky">
            <div
              className="services__switch"
              role="tablist"
              aria-label="Choose how you would like to work together"
              data-active={mode}
            >
              {modes.map(({ id, label }, index) => (
                <button
                  key={id}
                  ref={(node) => {
                    tabsRef.current[index] = node;
                  }}
                  className={`services__switch-button${mode === id ? ' is-active' : ''}`}
                  id={`services-${id}-tab`}
                  type="button"
                  role="tab"
                  aria-selected={mode === id}
                  aria-controls="services-stack"
                  data-mode={id}
                  tabIndex={mode === id ? 0 : -1}
                  onClick={() => selectMode(id)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                >
                  <span className="services__switch-dot" aria-hidden="true" />
                  {label}
                </button>
              ))}
              <span className="services__switch-thumb" aria-hidden="true" />
            </div>
          </div>
          <div
            className="services__cards"
            id="services-stack"
            role="tabpanel"
            aria-labelledby={`services-${mode}-tab`}
            data-mode={mode}
          >
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} mode={mode} />
            ))}
          </div>
        </div>
        <ServiceCta />
      </div>
      <p className="sr-only" id="services-mode-status" aria-live="polite">
        {announcement}
      </p>
      <div
        className="services__measurement"
        ref={measurementRef}
        aria-hidden="true"
        inert
      >
        <div className="services__cards" data-mode="whole">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} mode="whole" />
          ))}
        </div>
        <ServiceCta />
      </div>
    </section>
  );
}
