import { useEffect, useRef, useState } from 'react';
import { caseStudies } from '../constants/cases';
import type { CaseStudy } from '../types/cases';

function readProject() {
  return caseStudies.find(
    (study) => window.location.hash === `#work/${study.id}`,
  );
}

export function useProjectNavigation() {
  const [study, setStudy] = useState(readProject);
  const triggerRef = useRef<HTMLAnchorElement | null>(null);
  const openedFromGallery = useRef(false);
  const returnToGallery = useRef(window.location.hash === '#work');
  useEffect(() => {
    if (study || !returnToGallery.current) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById('work')?.scrollIntoView({ behavior: 'instant' });
      returnToGallery.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [study]);
  useEffect(() => {
    const onHashChange = () => setStudy(readProject());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  const open = (project: CaseStudy, trigger: HTMLAnchorElement) => {
    triggerRef.current = trigger;
    openedFromGallery.current = true;
    window.history.pushState(null, '', `#work/${project.id}`);
    setStudy(project);
  };
  const close = () => {
    if (openedFromGallery.current) {
      window.history.back();
    } else {
      returnToGallery.current = true;
      window.history.replaceState(null, '', '#work');
      setStudy(undefined);
    }
  };
  const next = (project: CaseStudy) => {
    window.history.replaceState(null, '', `#work/${project.id}`);
    setStudy(project);
  };
  return { study, triggerRef, open, close, next };
}
