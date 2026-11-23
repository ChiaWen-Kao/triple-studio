import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';

const SWIPE_DISTANCE = 40;
const DIRECTION_RATIO = 1.3;
export function useSwipeChapters(onSwipe: (direction: number) => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState(0);
  const reset = () => {
    start.current = null;
    setOffset(0);
  };
  const handlers = {
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (
        event.button > 0 ||
        (event.target as HTMLElement).closest('button, a, input')
      )
        return;
      start.current = { x: event.clientX, y: event.clientY };
    },
    onPointerMove(event: PointerEvent<HTMLElement>) {
      if (!start.current) return;
      const horizontal = event.clientX - start.current.x;
      const vertical = event.clientY - start.current.y;
      if (
        Math.abs(vertical) > 12 &&
        Math.abs(vertical) > Math.abs(horizontal)
      ) {
        reset();
        return;
      }
      if (
        Math.abs(horizontal) > 12 &&
        Math.abs(horizontal) > Math.abs(vertical) * DIRECTION_RATIO
      ) {
        event.currentTarget.setPointerCapture?.(event.pointerId);
        setOffset(Math.max(-70, Math.min(70, horizontal * 0.3)));
      }
    },
    onPointerUp(event: PointerEvent<HTMLElement>) {
      if (!start.current) return;
      const horizontal = event.clientX - start.current.x;
      const vertical = event.clientY - start.current.y;
      reset();
      if (
        Math.abs(horizontal) >= SWIPE_DISTANCE &&
        Math.abs(horizontal) > Math.abs(vertical) * DIRECTION_RATIO
      )
        onSwipe(horizontal < 0 ? 1 : -1);
    },
    onPointerCancel: reset,
    onLostPointerCapture: reset,
  };
  return { handlers, offset };
}
