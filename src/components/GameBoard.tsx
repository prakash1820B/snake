import { Position } from '../hooks/useGame';

interface GameBoardProps {
  rabbit: Position[];
  carrots: Position[];
  gridSize: number;
  gameState: string;
  score: number;
}

export default function GameBoard({ rabbit, carrots, gridSize, gameState, score }: GameBoardProps) {
  const cellSize = 100 / gridSize;

  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto">
      {/* Circular game board */}
      <div
        className="absolute inset-0 rounded-full border-4 border-emerald-700/60 overflow-hidden"
        style={{
          background: 'radial-gradient(circle at center, #1a3a2e 0%, #0f2818 70%, #0a1f12 100%)',
          boxShadow: '0 0 30px rgba(16, 185, 129, 0.2), inset 0 0 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" aria-hidden="true">
          {Array.from({ length: gridSize - 1 }).map((_, i) => (
            <g key={i}>
              <line
                x1={`${((i + 1) / gridSize) * 100}%`}
                y1="0"
                x2={`${((i + 1) / gridSize) * 100}%`}
                y2="100%"
                stroke="#86efac"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1={`${((i + 1) / gridSize) * 100}%`}
                x2="100%"
                y2={`${((i + 1) / gridSize) * 100}%`}
                stroke="#86efac"
                strokeWidth="0.5"
              />
            </g>
          ))}
        </svg>

        {/* Circular boundary indicator */}
        <div
          className="absolute inset-[2%] rounded-full border-2 border-emerald-600/20"
          style={{
            boxShadow: 'inset 0 0 20px rgba(16, 185, 129, 0.1)',
          }}
        />

        {/* Multiple Carrots */}
        {carrots.map((carrot, index) => (
          <div
            key={`carrot-${index}`}
            className="absolute animate-pulse"
            style={{
              left: `${carrot.x * cellSize}%`,
              top: `${carrot.y * cellSize}%`,
              width: `${cellSize}%`,
              height: `${cellSize}%`,
              animationDelay: `${index * 0.2}s`,
            }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Carrot leaves on top */}
              <div
                className="absolute"
                style={{
                  top: '8%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40%',
                  height: '30%',
                }}
              >
                <div className="absolute left-1/2 bottom-0 w-[3px] h-full bg-green-500 -translate-x-1/2 rounded-full" />
                <div className="absolute left-1/3 bottom-0 w-[3px] h-[80%] bg-green-400 -translate-x-1/2 rounded-full rotate-[-20deg]" />
                <div className="absolute left-2/3 bottom-0 w-[3px] h-[80%] bg-green-400 -translate-x-1/2 rounded-full rotate-[20deg]" />
              </div>
              {/* Carrot body */}
              <div
                className="absolute"
                style={{
                  top: '30%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '50%',
                  height: '65%',
                  background: 'linear-gradient(180deg, #fb923c 0%, #f97316 50%, #ea580c 100%)',
                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 40%, 50% 100%, 0% 40%)',
                  boxShadow: '0 0 12px rgba(249, 115, 22, 0.6)',
                }}
              />
              {/* Carrot lines */}
              <div
                className="absolute"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '30%',
                  height: '2px',
                  background: 'rgba(154, 52, 18, 0.5)',
                  borderRadius: '1px',
                }}
              />
            </div>
          </div>
        ))}

        {/* Rabbit */}
        {rabbit.map((segment, index) => {
          const isHead = index === 0;
          const opacity = Math.max(0.55, 1 - (index / Math.max(rabbit.length, 1)) * 0.45);

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
              {isHead ? (
                // Rabbit head with ears
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Left ear */}
                  <div
                    className="absolute"
                    style={{
                      top: '-15%',
                      left: '15%',
                      width: '22%',
                      height: '45%',
                      background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)',
                      borderRadius: '50% 50% 40% 40%',
                      boxShadow: '0 0 4px rgba(253, 230, 138, 0.4)',
                    }}
                  >
                    <div
                      className="absolute inset-[25%] rounded-full"
                      style={{ background: '#fca5a5' }}
                    />
                  </div>
                  {/* Right ear */}
                  <div
                    className="absolute"
                    style={{
                      top: '-15%',
                      right: '15%',
                      width: '22%',
                      height: '45%',
                      background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)',
                      borderRadius: '50% 50% 40% 40%',
                      boxShadow: '0 0 4px rgba(253, 230, 138, 0.4)',
                    }}
                  >
                    <div
                      className="absolute inset-[25%] rounded-full"
                      style={{ background: '#fca5a5' }}
                    />
                  </div>
                  {/* Head */}
                  <div
                    className="rounded-full"
                    style={{
                      width: '70%',
                      height: '70%',
                      background: 'linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)',
                      boxShadow: '0 0 10px rgba(253, 230, 138, 0.6)',
                      position: 'relative',
                    }}
                  >
                    {/* Eyes */}
                    <div
                      className="absolute rounded-full bg-slate-900"
                      style={{
                        width: '18%',
                        height: '18%',
                        top: '35%',
                        left: '22%',
                      }}
                    />
                    <div
                      className="absolute rounded-full bg-slate-900"
                      style={{
                        width: '18%',
                        height: '18%',
                        top: '35%',
                        right: '22%',
                      }}
                    />
                    {/* Nose */}
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: '14%',
                        height: '10%',
                        bottom: '25%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#f472b6',
                      }}
                    />
                  </div>
                </div>
              ) : (
                // Rabbit body segments (fluffy white)
                <div className="w-full h-full flex items-center justify-center">
                  <div
                    className="rounded-full"
                    style={{
                      width: '75%',
                      height: '75%',
                      background: 'linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%)',
                      boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.1)',
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Overlay states */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] rounded-full">
            <div className="text-center px-4">
              <div className="text-5xl mb-3">🐰</div>
              <p className="text-2xl font-bold text-white mb-2">Rabbit Game</p>
              <p className="text-slate-300 text-sm">Help the rabbit find carrots!</p>
              <p className="text-slate-400 text-xs mt-2">Press Start or Space to play</p>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] rounded-full">
            <div className="text-center px-4">
              <div className="text-5xl mb-3">⏸️</div>
              <p className="text-3xl font-bold text-yellow-400">PAUSED</p>
              <p className="text-slate-300 text-sm mt-2">Press Space or P to resume</p>
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-full">
            <div className="text-center px-4">
              <div className="text-5xl mb-3">😵</div>
              <p className="text-3xl font-bold text-red-400 mb-1">Oh No!</p>
              <p className="text-xl font-semibold text-white mb-1">Score: {score}</p>
              <p className="text-slate-300 text-sm">The rabbit got tired!</p>
              <p className="text-slate-400 text-xs mt-2">Press Restart or Space to play again</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
