import { useRef } from 'react';
import type { PointerEvent } from 'react';

const SWIPE_DISTANCE = 40;
export function useSwipeChapters(onSwipe: (direction: number) => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if ((event.target as HTMLElement).closest('button, a, input')) return;
      start.current = { x: event.clientX, y: event.clientY };
    },
    onPointerUp(event: PointerEvent<HTMLElement>) {
      if (!start.current) return;
      const horizontal = event.clientX - start.current.x;
      const vertical = event.clientY - start.current.y;
      start.current = null;
      if (
        Math.abs(horizontal) >= SWIPE_DISTANCE &&
        Math.abs(horizontal) > Math.abs(vertical) * 1.3
      )
        onSwipe(horizontal < 0 ? 1 : -1);
    },
    onPointerCancel() {
      start.current = null;
    },
  };
}
