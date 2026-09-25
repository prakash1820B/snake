import { Direction } from '../hooks/useGame';

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

  const btnClass = `w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-bold
    bg-emerald-800/80 text-emerald-100 active:bg-orange-600 active:scale-90
    transition-all duration-100 select-none touch-manipulation
    border border-emerald-600/50 shadow-lg hover:bg-emerald-700/80 hover:border-orange-400/30`;

  const disabledBtnClass = `w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-bold
    bg-emerald-950/50 text-emerald-800 transition-all duration-100 select-none
    border border-emerald-900/30`;

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <button
        className={disabled ? disabledBtnClass : btnClass}
        onClick={handlePress('UP')}
        aria-label="Move up"
      >
        ↑
      </button>
      <div className="flex gap-2">
        <button
          className={disabled ? disabledBtnClass : btnClass}
          onClick={handlePress('LEFT')}
          aria-label="Move left"
        >
          ←
        </button>
        <button
          className={disabled ? disabledBtnClass : btnClass}
          onClick={handlePress('DOWN')}
          aria-label="Move down"
        >
          ↓
        </button>
        <button
          className={disabled ? disabledBtnClass : btnClass}
          onClick={handlePress('RIGHT')}
          aria-label="Move right"
        >
          →
        </button>
      </div>
    </div>
  );
}
