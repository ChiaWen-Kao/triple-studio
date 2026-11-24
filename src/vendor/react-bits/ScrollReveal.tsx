import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { paintPiece } from './paintRevealPiece';
import type { RevealLook } from './paintRevealPiece';

gsap.registerPlugin(ScrollTrigger);
const look: RevealLook = {
  effect: 'rise',
  masked: true,
  baseOpacity: 0.1,
  blur: 4,
  offset: 0,
  highlightColor: '',
};

export default function ScrollReveal({
  children,
  id,
}: {
  children: string;
  id?: string;
}) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const pieces = Array.from(
      element.querySelectorAll<HTMLElement>('.scroll-reveal-piece'),
    );
    const wrappers = Array.from(
      element.querySelectorAll<HTMLElement>('.scroll-reveal-word'),
    );
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const state = { progress: 0 };
      const span = 0.5;
      const gap = 0.08;
      const total = span + Math.max(0, pieces.length - 1) * gap;
      const render = () => {
        const at = state.progress * total;
        pieces.forEach((piece, index) => {
          const progress = Math.min(Math.max((at - index * gap) / span, 0), 1);
          paintPiece(piece, progress, look);
        });
      };
      wrappers.forEach((wrapper) => {
        wrapper.style.clipPath = 'inset(-1em -1em -0.15em -1em)';
      });
      render();
      gsap.to(state, {
        progress: 1,
        ease: 'none',
        onUpdate: render,
        scrollTrigger: {
          trigger: element,
          start: 'top 65%',
          end: 'top 35%',
          scrub: 0.45,
        },
      });
      return () => {
        pieces.forEach((piece) => {
          piece.style.opacity = '';
          piece.style.transform = '';
          piece.style.filter = '';
        });
        wrappers.forEach((wrapper) => {
          wrapper.style.clipPath = '';
        });
      };
    });
    return () => media.revert();
  }, [children]);
  return (
    <h2
      id={id}
      ref={containerRef}
      className="scroll-reveal"
      aria-label={children}
    >
      <span aria-hidden="true">
        {children.split(/(\s+)/).map((word, index) =>
          word.trim() === '' ? (
            word
          ) : (
            <span className="scroll-reveal-word" key={index}>
              <span className="scroll-reveal-piece">{word}</span>
            </span>
          ),
        )}
      </span>
    </h2>
  );
}
