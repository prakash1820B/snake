import { Position } from '../hooks/useSnakeGame';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  gridSize: number;
  gameState: string;
}

export default function GameBoard({ snake, food, gridSize, gameState }: GameBoardProps) {
  const cellSize = 100 / gridSize;

  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto">
      {/* Grid background */}
      <div
        className="absolute inset-0 rounded-xl border-2 border-slate-700/50 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        }}
      >
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {Array.from({ length: gridSize + 1 }).map((_, i) => (
            <g key={i}>
              <line
                x1={`${(i / gridSize) * 100}%`}
                y1="0"
                x2={`${(i / gridSize) * 100}%`}
                y2="100%"
                stroke="#64748b"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1={`${(i / gridSize) * 100}%`}
                x2="100%"
                y2={`${(i / gridSize) * 100}%`}
                stroke="#64748b"
                strokeWidth="0.5"
              />
            </g>
          ))}
        </svg>

        {/* Food */}
        <div
          className="absolute rounded-full transition-all duration-200 animate-pulse"
          style={{
            left: `${food.x * cellSize}%`,
            top: `${food.y * cellSize}%`,
            width: `${cellSize}%`,
            height: `${cellSize}%`,
            padding: '8%',
          }}
        >
          <div className="w-full h-full rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
        </div>

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          const opacity = 1 - (index / snake.length) * 0.4;
          return (
            <div
              key={index}
              className={`absolute transition-all duration-75 ${
                isHead ? 'rounded-md z-10' : 'rounded-sm'
              }`}
              style={{
                left: `${segment.x * cellSize}%`,
                top: `${segment.y * cellSize}%`,
                width: `${cellSize}%`,
                height: `${cellSize}%`,
                padding: isHead ? '4%' : '6%',
                opacity,
              }}
            >
              <div
                className={`w-full h-full rounded-sm ${
                  isHead
                    ? 'bg-emerald-400 shadow-lg shadow-emerald-400/40'
                    : 'bg-emerald-500'
                }`}
              />
            </div>
          );
        })}

        {/* Overlay states */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl">
            <div className="text-center">
              <p className="text-2xl font-bold text-white mb-2">🐍 Snake Game</p>
              <p className="text-slate-300 text-sm">Press Start or Space to play</p>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-400 animate-pulse">⏸ PAUSED</p>
              <p className="text-slate-300 text-sm mt-2">Press Space or P to resume</p>
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-400 mb-2">💀 Game Over</p>
              <p className="text-slate-300 text-sm">Press Restart or Space to play again</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
