import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import gsap from 'gsap';

export function useProjectDialog(
  triggerRef: RefObject<HTMLAnchorElement | null>,
  onClose: () => void,
) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const exitTween = useRef<gsap.core.Tween | null>(null);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const overflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const tile = trigger?.querySelector('.work-tile-media');
    const hero = heroRef.current;
    const context = gsap.context(() => {
      if (!reduced && tile && hero) {
        const from = tile.getBoundingClientRect();
        const to = hero.getBoundingClientRect();
        gsap
          .timeline()
          .from(hero, {
            x: from.x - to.x,
            y: from.y - to.y,
            scaleX: from.width / to.width,
            scaleY: from.height / to.height,
            transformOrigin: 'top left',
            duration: 0.85,
            ease: 'power3.inOut',
          })
          .from(
            dialog.querySelector('.project-introduction'),
            {
              opacity: 0,
              x: -40,
              duration: 0.6,
            },
            0.35,
          );
      }
    });
    return () => {
      exitTween.current?.kill();
      context.revert();
      dialog.close();
      document.body.style.overflow = overflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [triggerRef]);
  const close = () => {
    if (closing) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onClose();
      return;
    }
    setClosing(true);
    exitTween.current = gsap.to(dialogRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: onClose,
    });
  };
  return { dialogRef, heroRef, close, closing };
}
