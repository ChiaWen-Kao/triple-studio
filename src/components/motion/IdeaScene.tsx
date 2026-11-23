import { useEffect, useRef, useState } from 'react';
import type { createIdeaScene } from '../../graphics/createIdeaScene';

export function IdeaScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [available, setAvailable] = useState(true);
  const pausedRef = useRef(paused);
  const sceneRef = useRef<ReturnType<typeof createIdeaScene> | null>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let cancelled = false;
    import('../../graphics/createIdeaScene')
      .then(({ createIdeaScene }) => {
        if (cancelled || !canvasRef.current) return;
        sceneRef.current = createIdeaScene(
          canvasRef.current,
          pausedRef.current,
        );
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });
    const updatePreference = () => {
      sceneRef.current?.setPaused(preference.matches);
      pausedRef.current = preference.matches;
      setPaused(preference.matches);
    };
    const updateScroll = () => {
      const bounds = canvasRef.current?.getBoundingClientRect();
      if (bounds)
        sceneRef.current?.setProgress(Math.max(0, -bounds.top / bounds.height));
    };
    preference.addEventListener('change', updatePreference);
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => {
      cancelled = true;
      preference.removeEventListener('change', updatePreference);
      window.removeEventListener('scroll', updateScroll);
      sceneRef.current?.dispose();
    };
  }, []);
  const toggleMotion = () => {
    pausedRef.current = !paused;
    sceneRef.current?.setPaused(!paused);
    setPaused(!paused);
  };
  return (
    <div className="idea-scene">
      <div className="scene-fallback" aria-hidden="true">
        <span>✳</span>
        <span>✳</span>
        <span>✳</span>
      </div>
      {available && (
        <canvas
          ref={canvasRef}
          aria-label="Floating sculptural pieces connect ideas, thinking and outcomes"
          role="img"
        />
      )}
      <div className="scene-caption">
        <span>Different perspectives.</span>
        <span>One shared direction.</span>
      </div>
      {available && (
        <button
          className="motion-toggle"
          onClick={toggleMotion}
          aria-pressed={paused}
        >
          {paused ? 'Play motion' : 'Pause motion'}
        </button>
      )}
    </div>
  );
}
