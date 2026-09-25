import { Position } from '../hooks/useGame';

interface GameBoardProps {
  snake: Position[];
  food: Position[];
  gridSize: number;
  gameState: string;
  score: number;
}

export default function GameBoard({ snake, food, gridSize, gameState, score }: GameBoardProps) {
  const cellSize = 100 / gridSize;

  return (
    <div className="relative w-full aspect-square">
      {/* Circular forest game board */}
      <div
        className="absolute inset-0 rounded-full border-4 border-emerald-900/80 overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #1a3a2e 0%, #0f2818 40%, #081a0f 100%)',
          boxShadow: '0 0 40px rgba(16, 185, 129, 0.15), inset 0 0 80px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Forest floor texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(22, 163, 74, 0.08) 0%, transparent 40%),
              radial-gradient(circle at 50% 80%, rgba(21, 128, 61, 0.06) 0%, transparent 45%)
            `,
          }}
        />

        {/* Scattered leaves */}
        <svg className="absolute inset-0 w-full h-full opacity-15" aria-hidden="true">
          {Array.from({ length: 15 }).map((_, i) => {
            const x = (i * 37) % 100;
            const y = (i * 53) % 100;
            const rotation = (i * 47) % 360;
            const scale = 0.5 + (i % 3) * 0.3;
            return (
              <g key={i} transform={`translate(${x}%, ${y}%) rotate(${rotation}) scale(${scale})`}>
                <ellipse cx="0" cy="0" rx="2" ry="1" fill="#4a7c59" opacity="0.6" />
              </g>
            );
          })}
        </svg>

        {/* Circular boundary indicator */}
        <div
          className="absolute inset-[2%] rounded-full border-2 border-emerald-800/30"
          style={{
            boxShadow: 'inset 0 0 30px rgba(16, 185, 129, 0.08)',
          }}
        />

        {/* Food items (mice/eggs) */}
        {food.map((item, index) => (
          <div
            key={`food-${index}`}
            className="absolute animate-pulse"
            style={{
              left: `${item.x * cellSize}%`,
              top: `${item.y * cellSize}%`,
              width: `${cellSize}%`,
              height: `${cellSize}%`,
              animationDelay: `${index * 0.2}s`,
            }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Mouse body */}
              <div
                className="absolute"
                style={{
                  top: '35%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '55%',
                  height: '45%',
                  background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                  borderRadius: '50% 50% 45% 45%',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                }}
              />
              {/* Mouse ears */}
              <div
                className="absolute"
                style={{
                  top: '25%',
                  left: '30%',
                  width: '18%',
                  height: '18%',
                  background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
                  borderRadius: '50%',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                }}
              />
              <div
                className="absolute"
                style={{
                  top: '25%',
                  right: '30%',
                  width: '18%',
                  height: '18%',
                  background: 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
                  borderRadius: '50%',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                }}
              />
              {/* Mouse eyes */}
              <div
                className="absolute rounded-full bg-slate-900"
                style={{
                  width: '8%',
                  height: '8%',
                  top: '38%',
                  left: '38%',
                }}
              />
              <div
                className="absolute rounded-full bg-slate-900"
                style={{
                  width: '8%',
                  height: '8%',
                  top: '38%',
                  right: '38%',
                }}
              />
              {/* Mouse tail */}
              <div
                className="absolute"
                style={{
                  bottom: '30%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '2%',
                  height: '25%',
                  background: '#9ca3af',
                  borderRadius: '50%',
                }}
              />
            </div>
          </div>
        ))}

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          const opacity = Math.max(0.6, 1 - (index / Math.max(snake.length, 1)) * 0.4);
          const segmentSize = isHead ? cellSize * 1.1 : cellSize * (0.9 - index * 0.01);

          return (
            <div
              key={`${index}`}
              className="absolute"
              style={{
                left: `${segment.x * cellSize}%`,
                top: `${segment.y * cellSize}%`,
                width: `${segmentSize}%`,
                height: `${segmentSize}%`,
                opacity,
                zIndex: isHead ? 10 : snake.length - index,
                transition: 'left 0.05s linear, top 0.05s linear',
              }}
            >
              {isHead ? (
                // Snake head
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Head shape */}
                  <div
                    className="rounded-full"
                    style={{
                      width: '85%',
                      height: '85%',
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%)',
                      boxShadow: '0 0 15px rgba(22, 163, 74, 0.6), inset 0 -3px 6px rgba(0,0,0,0.3)',
                      position: 'relative',
                    }}
                  >
                    {/* Scale pattern on head */}
                    <div
                      className="absolute inset-0 rounded-full opacity-30"
                      style={{
                        backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                      }}
                    />
                    {/* Eyes */}
                    <div
                      className="absolute rounded-full bg-yellow-300"
                      style={{
                        width: '20%',
                        height: '20%',
                        top: '30%',
                        left: '20%',
                        boxShadow: '0 0 4px rgba(253, 224, 71, 0.8)',
                      }}
                    >
                      <div
                        className="absolute rounded-full bg-slate-900"
                        style={{
                          width: '50%',
                          height: '50%',
                          top: '25%',
                          left: '25%',
                        }}
                      />
                    </div>
                    <div
                      className="absolute rounded-full bg-yellow-300"
                      style={{
                        width: '20%',
                        height: '20%',
                        top: '30%',
                        right: '20%',
                        boxShadow: '0 0 4px rgba(253, 224, 71, 0.8)',
                      }}
                    >
                      <div
                        className="absolute rounded-full bg-slate-900"
                        style={{
                          width: '50%',
                          height: '50%',
                          top: '25%',
                          left: '25%',
                        }}
                      />
                    </div>
                    {/* Forked tongue */}
                    <div
                      className="absolute"
                      style={{
                        bottom: '15%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '3%',
                        height: '20%',
                        background: '#dc2626',
                        borderRadius: '50%',
                      }}
                    >
                      <div
                        className="absolute"
                        style={{
                          bottom: '-30%',
                          left: '-50%',
                          width: '200%',
                          height: '40%',
                          background: '#dc2626',
                          borderRadius: '50% 50% 0 0',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Snake body segments
                <div className="w-full h-full flex items-center justify-center">
                  <div
                    className="rounded-full"
                    style={{
                      width: '90%',
                      height: '90%',
                      background: `linear-gradient(135deg, 
                        hsl(${120 + index * 2}, 70%, ${35 - index * 0.5}%) 0%, 
                        hsl(${120 + index * 2}, 70%, ${25 - index * 0.5}%) 50%, 
                        hsl(${120 + index * 2}, 70%, ${20 - index * 0.5}%) 100%)`,
                      boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.4), 0 0 8px rgba(22, 163, 74, 0.3)',
                      position: 'relative',
                    }}
                  >
                    {/* Scale pattern */}
                    <div
                      className="absolute inset-0 rounded-full opacity-40"
                      style={{
                        backgroundImage: `
                          radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 0%, transparent 40%),
                          radial-gradient(circle at 75% 75%, rgba(0,0,0,0.2) 0%, transparent 40%)
                        `,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Overlay states */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-full">
            <div className="text-center px-4">
              <div className="text-5xl mb-3">🐍</div>
              <p className="text-2xl font-bold text-white mb-2">Snake Game</p>
              <p className="text-slate-300 text-sm">Hunt mice in the forest!</p>
              <p className="text-slate-400 text-xs mt-2">Press Start or Space to play</p>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-full">
            <div className="text-center px-4">
              <div className="text-5xl mb-3">⏸️</div>
              <p className="text-3xl font-bold text-yellow-400">PAUSED</p>
              <p className="text-slate-300 text-sm mt-2">Press Space or P to resume</p>
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-[2px] rounded-full">
            <div className="text-center px-4">
              <div className="text-5xl mb-3">💀</div>
              <p className="text-3xl font-bold text-red-400 mb-1">Game Over!</p>
              <p className="text-xl font-semibold text-white mb-1">Score: {score}</p>
              <p className="text-slate-300 text-sm">The snake got caught!</p>
              <p className="text-slate-400 text-xs mt-2">Press Restart or Space to play again</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
