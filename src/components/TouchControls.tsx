import { Direction } from '../hooks/useSnakeGame';

interface TouchControlsProps {
  onDirection: (dir: Direction) => void;
  disabled: boolean;
}

export default function TouchControls({ onDirection, disabled }: TouchControlsProps) {
  const btnClass = `w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold
    bg-slate-700/80 text-white active:bg-emerald-600 active:scale-95
    transition-all duration-100 select-none touch-manipulation
    border border-slate-600/50 shadow-lg
    ${disabled ? 'opacity-40 pointer-events-none' : ''}`;

  return (
    <div className="md:hidden flex flex-col items-center gap-2 mt-4">
      <button className={btnClass} onTouchStart={() => !disabled && onDirection('UP')}>
        ↑
      </button>
      <div className="flex gap-2">
        <button className={btnClass} onTouchStart={() => !disabled && onDirection('LEFT')}>
          ←
        </button>
        <button className={btnClass} onTouchStart={() => !disabled && onDirection('DOWN')}>
          ↓
        </button>
        <button className={btnClass} onTouchStart={() => !disabled && onDirection('RIGHT')}>
          →
        </button>
      </div>
    </div>
  );
}
