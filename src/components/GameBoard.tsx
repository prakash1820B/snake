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
  // Top-down perspective: taller cells to create depth illusion
  const heightStretch = 1.35;

  return (
    <div
      className="relative w-full max-w-[500px] mx-auto"
      style={{
        aspectRatio: `1 / ${heightStretch}`,
        perspective: '800px',
      }}
    >
      {/* Circular game board with perspective tilt */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: '50% / 37%',
          border: '4px solid #1a1a1a',
          background: 'radial-gradient(ellipse at 50% 40%, #1a2e1a 0%, #0a1a0a 60%, #050d05 100%)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(16, 185, 129, 0.15), inset 0 -30px 60px rgba(0,0,0,0.5)',
          transform: 'rotateX(25deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Black grid lines */}
        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
          {Array.from({ length: gridSize - 1 }).map((_, i) => (
            <g key={i}>
              <line
                x1={`${((i + 1) / gridSize) * 100}%`}
                y1="0"
                x2={`${((i + 1) / gridSize) * 100}%`}
                y2="100%"
                stroke="#000000"
                strokeWidth="0.8"
                opacity="0.4"
              />
              <line
                x1="0"
                y1={`${((i + 1) / gridSize) * 100}%`}
                x2="100%"
                y2={`${((i + 1) / gridSize) * 100}%`}
                stroke="#000000"
                strokeWidth="0.8"
                opacity="0.4"
              />
            </g>
          ))}
        </svg>

        {/* Ground shadow/depth gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, transparent 30%, rgba(0,0,0,0.4) 100%)',
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
              height: `${cellSize * heightStretch}%`,
              animationDelay: `${index * 0.2}s`,
              zIndex: 5,
            }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Carrot shadow */}
              <div
                className="absolute"
                style={{
                  bottom: '10%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: '15%',
                  background: 'rgba(0,0,0,0.4)',
                  borderRadius: '50%',
                  filter: 'blur(2px)',
                }}
              />
              {/* Carrot leaves */}
              <div
                className="absolute"
                style={{
                  top: '5%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '45%',
                  height: '35%',
                }}
              >
                <div className="absolute left-1/2 bottom-0 w-[3px] h-full bg-green-600 -translate-x-1/2 rounded-full" />
                <div className="absolute left-1/3 bottom-0 w-[3px] h-[85%] bg-green-500 -translate-x-1/2 rounded-full rotate-[-25deg]" />
                <div className="absolute left-2/3 bottom-0 w-[3px] h-[85%] bg-green-500 -translate-x-1/2 rounded-full rotate-[25deg]" />
              </div>
              {/* Carrot body */}
              <div
                className="absolute"
                style={{
                  top: '30%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '55%',
                  height: '65%',
                  background: 'linear-gradient(180deg, #fb923c 0%, #f97316 50%, #c2410c 100%)',
                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 40%, 50% 100%, 0% 40%)',
                  boxShadow: '0 0 15px rgba(249, 115, 22, 0.7), inset -3px -3px 6px rgba(0,0,0,0.3)',
                }}
              />
              {/* Carrot highlight */}
              <div
                className="absolute"
                style={{
                  top: '35%',
                  left: '42%',
                  width: '12%',
                  height: '30%',
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  filter: 'blur(1px)',
                }}
              />
            </div>
          </div>
        ))}

        {/* Rabbit - top-down perspective with taller segments */}
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
                height: `${cellSize * heightStretch}%`,
                opacity,
                zIndex: isHead ? 20 : 10 - index,
              }}
            >
              {/* Shadow beneath rabbit */}
              <div
                className="absolute"
                style={{
                  bottom: '5%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: isHead ? '70%' : '60%',
                  height: '15%',
                  background: 'rgba(0,0,0,0.5)',
                  borderRadius: '50%',
                  filter: 'blur(3px)',
                }}
              />

              {isHead ? (
                // Rabbit head - top-down view
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Left ear */}
                  <div
                    className="absolute"
                    style={{
                      top: '5%',
                      left: '12%',
                      width: '24%',
                      height: '35%',
                      background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)',
                      borderRadius: '50% 50% 40% 40%',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(0,0,0,0.1)',
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
                      top: '5%',
                      right: '12%',
                      width: '24%',
                      height: '35%',
                      background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)',
                      borderRadius: '50% 50% 40% 40%',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    <div
                      className="absolute inset-[25%] rounded-full"
                      style={{ background: '#fca5a5' }}
                    />
                  </div>
                  {/* Head - top-down oval */}
                  <div
                    className="rounded-full"
                    style={{
                      width: '75%',
                      height: '65%',
                      marginTop: '15%',
                      background: 'radial-gradient(ellipse at 40% 35%, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.4), inset -3px -3px 6px rgba(0,0,0,0.1), inset 2px 2px 4px rgba(255,255,255,0.3)',
                      position: 'relative',
                    }}
                  >
                    {/* Eyes */}
                    <div
                      className="absolute rounded-full bg-slate-900"
                      style={{
                        width: '16%',
                        height: '20%',
                        top: '30%',
                        left: '24%',
                        boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.3)',
                      }}
                    >
                      <div
                        className="absolute rounded-full bg-white"
                        style={{ width: '30%', height: '30%', top: '20%', left: '20%' }}
                      />
                    </div>
                    <div
                      className="absolute rounded-full bg-slate-900"
                      style={{
                        width: '16%',
                        height: '20%',
                        top: '30%',
                        right: '24%',
                        boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.3)',
                      }}
                    >
                      <div
                        className="absolute rounded-full bg-white"
                        style={{ width: '30%', height: '30%', top: '20%', left: '20%' }}
                      />
                    </div>
                    {/* Nose */}
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: '14%',
                        height: '10%',
                        bottom: '22%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'radial-gradient(ellipse at 40% 40%, #f9a8d4, #ec4899)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      }}
                    />
                    {/* Cheeks */}
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: '18%',
                        height: '12%',
                        bottom: '25%',
                        left: '12%',
                        background: 'rgba(252, 165, 165, 0.4)',
                        filter: 'blur(1px)',
                      }}
                    />
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: '18%',
                        height: '12%',
                        bottom: '25%',
                        right: '12%',
                        background: 'rgba(252, 165, 165, 0.4)',
                        filter: 'blur(1px)',
                      }}
                    />
                  </div>
                </div>
              ) : (
                // Rabbit body segments - top-down fluffy view
                <div className="w-full h-full flex items-center justify-center">
                  <div
                    className="rounded-full"
                    style={{
                      width: '78%',
                      height: '70%',
                      background: 'radial-gradient(ellipse at 40% 35%, #fffbeb 0%, #fef3c7 60%, #fde68a 100%)',
                      boxShadow: '0 3px 6px rgba(0,0,0,0.35), inset -2px -2px 4px rgba(0,0,0,0.1), inset 2px 2px 4px rgba(255,255,255,0.4)',
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Overlay states */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]" style={{ borderRadius: 'inherit' }}>
            <div className="text-center px-4">
              <div className="text-5xl mb-3">🐰</div>
              <p className="text-2xl font-bold text-white mb-2">Rabbit Game</p>
              <p className="text-slate-300 text-sm">Help the rabbit find carrots!</p>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]" style={{ borderRadius: 'inherit' }}>
            <div className="text-center px-4">
              <div className="text-5xl mb-3">⏸️</div>
              <p className="text-3xl font-bold text-yellow-400">PAUSED</p>
              <p className="text-slate-300 text-sm mt-2">Press Space to resume</p>
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-[2px]" style={{ borderRadius: 'inherit' }}>
            <div className="text-center px-4">
              <div className="text-5xl mb-3">😵</div>
              <p className="text-3xl font-bold text-red-400 mb-1">Oh No!</p>
              <p className="text-xl font-semibold text-white mb-1">Score: {score}</p>
              <p className="text-slate-300 text-sm">The rabbit got tired!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
