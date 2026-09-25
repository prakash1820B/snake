import { useEffect, useRef, useCallback, useState } from 'react';
import { useGame, Direction, Difficulty } from './hooks/useGame';
import GameBoard from './components/GameBoard';

export default function App() {
  const {
    rabbit,
    carrots,
    gameState,
    score,
    difficulty,
    highScore,
    gridSize,
    startGame,
    resetGame,
    togglePause,
    changeDirection,
    setDirectionFromTarget,
    setDifficulty,
  } = useGame();

  const boardRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Mouse move handler - control rabbit with mouse hover
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'playing' || !boardRef.current) return;

    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert to grid coordinates
    const gridX = (x / rect.width) * gridSize;
    const gridY = (y / rect.height) * gridSize;

    setDirectionFromTarget(gridX, gridY);
  }, [gameState, gridSize, setDirectionFromTarget]);

  // Touch move handler - control rabbit with touch
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (gameState !== 'playing' || !boardRef.current) return;
    e.preventDefault();

    const touch = e.touches[0];
    const rect = boardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // Convert to grid coordinates
    const gridX = (x / rect.width) * gridSize;
    const gridY = (y / rect.height) * gridSize;

    setDirectionFromTarget(gridX, gridY);
  }, [gameState, gridSize, setDirectionFromTarget]);

  // Keyboard controls (fallback)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const keyLower = key.toLowerCase();

      // Prevent default for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(key)) {
        e.preventDefault();
      }

      switch (keyLower) {
        case 'arrowup':
        case 'w':
          changeDirection('UP');
          break;
        case 'arrowdown':
        case 's':
          changeDirection('DOWN');
          break;
        case 'arrowleft':
        case 'a':
          changeDirection('LEFT');
          break;
        case 'arrowright':
        case 'd':
          changeDirection('RIGHT');
          break;
        case ' ':
          if (gameState === 'idle' || gameState === 'gameover') {
            startGame();
          } else {
            togglePause();
          }
          break;
        case 'p':
          if (gameState === 'playing' || gameState === 'paused') {
            togglePause();
          }
          break;
        case 'r':
          resetGame();
          break;
        case 'f':
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, changeDirection, startGame, togglePause, resetGame, toggleFullscreen]);

  const difficulties: { value: Difficulty; label: string; color: string; emoji: string }[] = [
    { value: 'easy', label: 'Easy', color: 'bg-green-500', emoji: '🟢' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500', emoji: '🟡' },
    { value: 'hard', label: 'Hard', color: 'bg-red-500', emoji: '🔴' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-950 to-emerald-950 text-white flex flex-col items-center p-4 py-6 select-none overflow-x-hidden">
      {/* Header */}
      <div className="text-center mb-3">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
          🐰 Rabbit Game
        </h1>
        <p className="text-emerald-300/70 text-xs md:text-sm mt-1">Move your mouse to guide the rabbit!</p>
      </div>

      {/* Score Panel */}
      <div className="flex items-center gap-6 mb-3 bg-emerald-900/40 rounded-xl px-6 py-3 border border-emerald-700/40">
        <div className="text-center">
          <p className="text-[10px] text-emerald-300/70 uppercase tracking-wider font-semibold">🥕 Carrots</p>
          <p className="text-2xl md:text-3xl font-bold text-orange-400 tabular-nums leading-tight">{score}</p>
        </div>
        <div className="w-px h-10 bg-emerald-700/50" />
        <div className="text-center">
          <p className="text-[10px] text-emerald-300/70 uppercase tracking-wider font-semibold">🎯 On Board</p>
          <p className="text-2xl md:text-3xl font-bold text-emerald-300 tabular-nums leading-tight">{carrots.length}</p>
        </div>
        <div className="w-px h-10 bg-emerald-700/50" />
        <div className="text-center">
          <p className="text-[10px] text-emerald-300/70 uppercase tracking-wider font-semibold">🏆 Best</p>
          <p className="text-2xl md:text-3xl font-bold text-yellow-400 tabular-nums leading-tight">{highScore}</p>
        </div>
      </div>

      {/* Game Board with Mouse Control */}
      <div
        ref={boardRef}
        className="w-full max-w-[500px] cursor-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        <GameBoard
          rabbit={rabbit}
          carrots={carrots}
          gridSize={gridSize}
          gameState={gameState}
          score={score}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        {(gameState === 'idle' || gameState === 'gameover') && (
          <button
            onClick={startGame}
            className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold
              transition-all duration-200 active:scale-95 shadow-lg shadow-orange-600/30"
          >
            {gameState === 'gameover' ? '🔄 Try Again' : '▶ Start Game'}
          </button>
        )}

        {gameState === 'playing' && (
          <button
            onClick={togglePause}
            className="px-5 py-2.5 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white font-semibold
              transition-all duration-200 active:scale-95 shadow-lg shadow-yellow-600/30"
          >
            ⏸ Pause
          </button>
        )}

        {gameState === 'paused' && (
          <>
            <button
              onClick={togglePause}
              className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold
                transition-all duration-200 active:scale-95 shadow-lg shadow-orange-600/30"
            >
              ▶ Resume
            </button>
            <button
              onClick={resetGame}
              className="px-5 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold
                transition-all duration-200 active:scale-95 border border-emerald-600"
            >
              🔄 Reset
            </button>
          </>
        )}

        {(gameState === 'playing' || gameState === 'gameover') && (
          <button
            onClick={resetGame}
            className="px-5 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold
              transition-all duration-200 active:scale-95 border border-emerald-600"
          >
            🔄 Reset
          </button>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="px-5 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold
            transition-all duration-200 active:scale-95 border border-emerald-600"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? '⛶ Exit' : '⛶ Fullscreen'}
        </button>
      </div>

      {/* Difficulty Selector */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-xs text-emerald-300/70 uppercase tracking-wider font-semibold mr-1">
          Speed:
        </span>
        {difficulties.map(d => (
          <button
            key={d.value}
            onClick={() => {
              if (difficulty !== d.value) {
                setDifficulty(d.value);
                if (gameState === 'playing' || gameState === 'paused') {
                  resetGame();
                }
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
              ${
                difficulty === d.value
                  ? `${d.color} text-white shadow-lg scale-105`
                  : 'bg-emerald-900/50 text-emerald-200 hover:bg-emerald-800/60 border border-emerald-700/50'
              }`}
          >
            {d.emoji} {d.label}
          </button>
        ))}
      </div>

      {/* Control hints */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs text-emerald-400/60">
        <span className="flex items-center gap-1">
          <span className="px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200 text-[10px] font-mono border border-emerald-700/50">🖱️ Mouse</span>
          <span>Move rabbit</span>
        </span>
        <span className="hidden md:flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200 text-[10px] font-mono border border-emerald-700/50">↑↓←→</kbd>
          <span>or keys</span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200 text-[10px] font-mono border border-emerald-700/50">Space</kbd>
          <span>Start/Pause</span>
        </span>
        <span className="hidden md:flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200 text-[10px] font-mono border border-emerald-700/50">F</kbd>
          <span>Fullscreen</span>
        </span>
      </div>

      {/* Footer */}
      <p className="text-emerald-700/60 text-[10px] mt-4 text-center">
        Hover mouse over the circle to guide the rabbit • 🐰 loves 🥕
      </p>
    </div>
  );
}
