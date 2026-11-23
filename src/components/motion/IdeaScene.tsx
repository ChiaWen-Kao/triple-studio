import { lazy, Suspense, useCallback, useEffect, useState } from 'react';

const Ballpit = lazy(() => import('../../vendor/react-bits/Ballpit'));
const colors = ['#f7e7a8', '#ed2616', '#f8f8f4', '#e9be32'];

export function IdeaScene() {
  const [paused, setPaused] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [available, setAvailable] = useState(true);
  const [burstSignal, setBurstSignal] = useState(0);
  const handleUnavailable = useCallback(() => setAvailable(false), []);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPaused(preference.matches);
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);
  const stirIdeas = () => {
    setPaused(false);
    setBurstSignal((signal) => signal + 1);
  };
  return (
    <div className="idea-scene" role="region" aria-label="Play with the ideas">
      {available && (
        <Suspense fallback={<SceneFallback />}>
          <Ballpit
            style={{ position: 'absolute', inset: 0 }}
            count={90}
            colors={colors}
            material="satin"
            gravity={0}
            drift={0.65}
            minSize={0.7}
            maxSize={1.4}
            depth={3}
            intro={false}
            dpr={1.5}
            paused={paused}
            burstSignal={burstSignal}
            onUnavailable={handleUnavailable}
          />
        </Suspense>
      )}
      {!available && <SceneFallback />}
      {available && (
        <div className="scene-controls">
          <button
            className="scene-stir"
            onClick={stirIdeas}
            aria-label="Move the ideas"
          >
            <span aria-hidden="true">✳</span>
          </button>
          <button
            className="motion-toggle"
            onClick={() => setPaused(!paused)}
            aria-pressed={paused}
            aria-label={paused ? 'Play motion' : 'Pause motion'}
          >
            <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

function SceneFallback() {
  return (
    <div className="scene-fallback" aria-hidden="true">
      <span>●</span>
      <span>●</span>
      <span>●</span>
    </div>
  );
}
