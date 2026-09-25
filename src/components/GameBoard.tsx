import { Position } from '../hooks/useSnakeGame';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  gridSize: number;
  gameState: string;
  score: number;
}

export default function GameBoard({ snake, food, gridSize, gameState, score }: GameBoardProps) {
  const cellSize = 100 / gridSize;

  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto">
      <div
        className="absolute inset-0 rounded-xl border-2 border-slate-700/50 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        }}
      >
        {/* Subtle grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" aria-hidden="true">
          {Array.from({ length: gridSize - 1 }).map((_, i) => (
            <g key={i}>
              <line
                x1={`${((i + 1) / gridSize) * 100}%`}
                y1="0"
                x2={`${((i + 1) / gridSize) * 100}%`}
                y2="100%"
                stroke="#94a3b8"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1={`${((i + 1) / gridSize) * 100}%`}
                x2="100%"
                y2={`${((i + 1) / gridSize) * 100}%`}
                stroke="#94a3b8"
                strokeWidth="0.5"
              />
            </g>
          ))}
        </svg>

        {/* Food */}
        <div
          className="absolute animate-pulse"
          style={{
            left: `${food.x * cellSize}%`,
            top: `${food.y * cellSize}%`,
            width: `${cellSize}%`,
            height: `${cellSize}%`,
          }}
        >
          <div
            className="w-full h-full rounded-full bg-red-500"
            style={{
              boxShadow: '0 0 12px rgba(239, 68, 68, 0.6), 0 0 4px rgba(239, 68, 68, 0.8)',
              margin: '12%',
              width: '76%',
              height: '76%',
            }}
          />
        </div>

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          const opacity = Math.max(0.5, 1 - (index / Math.max(snake.length, 1)) * 0.5);
          const inset = isHead ? '6%' : '10%';

          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className="absolute"
              style={{
                left: `${segment.x * cellSize}%`,
                top: `${segment.y * cellSize}%`,
                width: `${cellSize}%`,
                height: `${cellSize}%`,
                opacity,
                zIndex: isHead ? 10 : 1,
              }}
            >
              <div
                className={`w-full h-full ${isHead ? 'rounded-md' : 'rounded-sm'}`}
                style={{
                  margin: inset,
                  width: `calc(100% - ${inset} * 2)`,
                  height: `calc(100% - ${inset} * 2)`,
                  background: isHead
                    ? 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'
                    : '#10b981',
                  boxShadow: isHead ? '0 0 8px rgba(52, 211, 153, 0.5)' : 'none',
                }}
              />
            </div>
          );
        })}

        {/* Overlay states */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] rounded-xl">
            <div className="text-center px-4">
              <div className="text-5xl mb-3">🐍</div>
              <p className="text-2xl font-bold text-white mb-2">Snake Game</p>
              <p className="text-slate-300 text-sm">Press Start or Space to play</p>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] rounded-xl">
            <div className="text-center px-4">
              <div className="text-5xl mb-3">⏸️</div>
              <p className="text-3xl font-bold text-yellow-400">PAUSED</p>
              <p className="text-slate-300 text-sm mt-2">Press Space or P to resume</p>
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-xl">
            <div className="text-center px-4">
              <div className="text-5xl mb-3">💀</div>
              <p className="text-3xl font-bold text-red-400 mb-1">Game Over</p>
              <p className="text-xl font-semibold text-white mb-1">Score: {score}</p>
              <p className="text-slate-300 text-sm">Press Restart or Space to play again</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
