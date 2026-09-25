import { Direction } from '../hooks/useSnakeGame';

interface TouchControlsProps {
  onDirection: (dir: Direction) => void;
  disabled: boolean;
}

export default function TouchControls({ onDirection, disabled }: TouchControlsProps) {
  const handlePress = (dir: Direction) => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) onDirection(dir);
  };

  const btnClass = `w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold
    bg-slate-700/80 text-white active:bg-emerald-600 active:scale-90
    transition-all duration-100 select-none touch-manipulation
    border border-slate-600/50 shadow-lg
    ${disabled ? 'opacity-40 pointer-events-none' : ''}`;

  return (
    <div className="md:hidden flex flex-col items-center gap-2 mt-4">
      <button
        className={btnClass}
        onClick={handlePress('UP')}
        aria-label="Move up"
      >
        ↑
      </button>
      <div className="flex gap-2">
        <button
          className={btnClass}
          onClick={handlePress('LEFT')}
          aria-label="Move left"
        >
          ←
        </button>
        <button
          className={btnClass}
          onClick={handlePress('DOWN')}
          aria-label="Move down"
        >
          ↓
        </button>
        <button
          className={btnClass}
          onClick={handlePress('RIGHT')}
          aria-label="Move right"
        >
          →
        </button>
      </div>
    </div>
  );
}
