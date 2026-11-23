export function CaseStepNavigation({
  index,
  count,
  onStep,
}: {
  index: number;
  count: number;
  onStep: (direction: number) => void;
}) {
  return (
    <div className="case-step-navigation">
      <span className="case-swipe-hint">
        Swipe to explore <span aria-hidden="true">↔</span>
      </span>
      <div className="case-step-buttons">
        <button
          type="button"
          aria-label="Previous chapter"
          onClick={() => onStep(-1)}
        >
          ←
        </button>
        <span>
          0{index + 1} / 0{count}
        </span>
        <button
          type="button"
          aria-label="Next chapter"
          onClick={() => onStep(1)}
        >
          →
        </button>
      </div>
    </div>
  );
}
