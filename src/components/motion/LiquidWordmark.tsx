import { useEffect, useRef, useState } from 'react';

type WordmarkScene = { setPaused(value: boolean): void; dispose(): void };

export function LiquidWordmark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<WordmarkScene | null>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    let cancelled = false;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPaused(preference.matches);
    preference.addEventListener('change', updatePreference);
    void import('../../graphics/createLiquidWordmark')
      .then(({ createLiquidWordmark }) => {
        if (cancelled || !canvasRef.current) return;
        const scene = createLiquidWordmark(canvasRef.current);
        scene.setPaused(preference.matches);
        sceneRef.current = scene;
        setReady(true);
      })
      .catch(() => setReady(false));
    return () => {
      cancelled = true;
      preference.removeEventListener('change', updatePreference);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setPaused(paused);
  }, [paused, ready]);

  return (
    <div
      className="liquid-wordmark"
      role="group"
      aria-label="WENDAVA in flowing, iridescent liquid lettering"
      data-ready={ready}
    >
      <span className="wordmark-fallback" aria-hidden="true">
        WENDAVA
      </span>
      <canvas ref={canvasRef} aria-hidden="true" />
      {ready && (
        <button
          className="motion-toggle"
          onClick={() => setPaused(!paused)}
          aria-pressed={paused}
          aria-label={paused ? 'Play motion' : 'Pause motion'}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            {paused ? (
              <path d="M8 5 19 12 8 19Z" fill="currentColor" />
            ) : (
              <path d="M8 5v14M16 5v14" stroke="currentColor" strokeWidth="2" />
            )}
          </svg>
        </button>
      )}
    </div>
  );
}
