import { useRef, useState } from 'react';
import { team } from '../../constants/team';
import { useMascotMotion } from '../../hooks/useMascotMotion';
import { Mascot } from '../Mascot';

export function IdeaScene() {
  const scene = useRef<HTMLDivElement>(null);
  const { paused, setPaused } = useMascotMotion(scene);
  const [jump, setJump] = useState({ id: '', count: 0 });

  return (
    <div
      ref={scene}
      className="idea-scene mascot-scene"
      role="region"
      aria-label="The Wendava team"
      data-paused={paused}
    >
      <div className="mascot-horizon" aria-hidden="true" />
      <div className="mascot-stars" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      <div className="mascot-world">
        <div className="mascot-orbit" aria-hidden="true" />
        {team.map((person) => (
          <button
            key={person.id}
            className={`mascot-island mascot-island--${person.id}`}
            aria-label={`Animate ${person.name}`}
            onClick={() =>
              setJump(({ count }) => ({ id: person.id, count: count + 1 }))
            }
          >
            <span className="mascot-float">
              <span
                key={jump.id === person.id ? jump.count : 0}
                className={
                  jump.id === person.id
                    ? 'mascot-character is-jumping'
                    : 'mascot-character'
                }
              >
                <Mascot sprite={person.sprite} eager />
              </span>
              <span className="mascot-platform" aria-hidden="true" />
            </span>
          </button>
        ))}
        <span className="mascot-cube mascot-cube--one" aria-hidden="true" />
        <span className="mascot-cube mascot-cube--two" aria-hidden="true" />
        <span className="mascot-cube mascot-cube--three" aria-hidden="true" />
      </div>
      <div className="scene-controls">
        <button
          className="motion-toggle"
          onClick={() => setPaused(!paused)}
          aria-pressed={paused}
          aria-label={paused ? 'Play motion' : 'Pause motion'}
        >
          <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>
        </button>
      </div>
    </div>
  );
}
