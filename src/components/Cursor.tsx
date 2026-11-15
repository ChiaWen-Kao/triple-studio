import { useEffect, useRef } from 'react';

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = cursorRef.current;
    if (
      !cursor ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    )
      return;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');
    const move = ({ clientX, clientY }: PointerEvent) => {
      cursor.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      cursor.classList.add('is-visible');
    };
    const hide = () => cursor.classList.remove('is-visible');
    window.addEventListener('pointermove', move);
    root.addEventListener('pointerleave', hide);
    return () => {
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', hide);
    };
  }, []);
  return <div className="cursor-dot" ref={cursorRef} aria-hidden="true" />;
}
