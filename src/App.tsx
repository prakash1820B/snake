import { useEffect, useRef, useCallback, useState } from 'react';
import { useSnakeGame, Direction, Difficulty } from './hooks/useSnakeGame';
import GameBoard from './components/GameBoard';
import TouchControls from './components/TouchControls';

export default function App() {
  const {
    snake,
    food,
    gameState,
    score,
    difficulty,
    highScore,
    gridSize,
    startGame,
    resetGame,
    togglePause,
    changeDirection,
    setDifficulty,
  } = useSnakeGame();

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
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

  // Keyboard controls
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

  // Swipe controls on game board only
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const minSwipe = 20;

    if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) {
      touchStartRef.current = null;
      return;
    }

    if (gameState === 'playing') {
      if (Math.abs(dx) > Math.abs(dy)) {
        changeDirection(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        changeDirection(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStartRef.current = null;
  }, [changeDirection, gameState]);

  const difficulties: { value: Difficulty; label: string; color: string; emoji: string }[] = [
    { value: 'easy', label: 'Easy', color: 'bg-green-500', emoji: '🟢' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500', emoji: '🟡' },
    { value: 'hard', label: 'Hard', color: 'bg-red-500', emoji: '🔴' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col items-center p-4 py-6 select-none overflow-x-hidden">
      {/* Header */}
      <div className="text-center mb-3">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🐍 Snake Game
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">Classic arcade fun, modern style</p>
      </div>

      {/* Score Panel */}
      <div className="flex items-center gap-6 mb-3 bg-slate-800/50 rounded-xl px-6 py-3 border border-slate-700/50">
        <div className="text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Score</p>
          <p className="text-2xl md:text-3xl font-bold text-emerald-400 tabular-nums leading-tight">{score}</p>
        </div>
        <div className="w-px h-10 bg-slate-700" />
        <div className="text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Best</p>
          <p className="text-2xl md:text-3xl font-bold text-yellow-400 tabular-nums leading-tight">{highScore}</p>
        </div>
      </div>

      {/* Game Board */}
      <div
        ref={boardRef}
        className="w-full max-w-[500px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <GameBoard
          snake={snake}
          food={food}
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
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold
              transition-all duration-200 active:scale-95 shadow-lg shadow-emerald-600/30"
          >
            {gameState === 'gameover' ? '🔄 Play Again' : '▶ Start Game'}
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
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold
                transition-all duration-200 active:scale-95 shadow-lg shadow-emerald-600/30"
            >
              ▶ Resume
            </button>
            <button
              onClick={resetGame}
              className="px-5 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold
                transition-all duration-200 active:scale-95 border border-slate-600"
            >
              🔄 Reset
            </button>
          </>
        )}

        {(gameState === 'playing' || gameState === 'gameover') && (
          <button
            onClick={resetGame}
            className="px-5 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold
              transition-all duration-200 active:scale-95 border border-slate-600"
          >
            🔄 Reset
          </button>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="px-5 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold
            transition-all duration-200 active:scale-95 border border-slate-600"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? '⛶ Exit' : '⛶ Fullscreen'}
        </button>
      </div>

      {/* Difficulty Selector */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mr-1">
          Difficulty:
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
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50'
              }`}
          >
            {d.emoji} {d.label}
          </button>
        ))}
      </div>

      {/* Touch Controls (Mobile only) */}
      <TouchControls
        onDirection={changeDirection}
        disabled={gameState !== 'playing'}
      />

      {/* Keyboard hints (Desktop only) */}
      <div className="hidden md:flex flex-wrap items-center justify-center gap-3 mt-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-300 text-[10px] font-mono border border-slate-600">↑↓←→</kbd>
          <span>Move</span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-300 text-[10px] font-mono border border-slate-600">Space</kbd>
          <span>Start / Pause</span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-300 text-[10px] font-mono border border-slate-600">P</kbd>
          <span>Pause</span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-300 text-[10px] font-mono border border-slate-600">R</kbd>
          <span>Reset</span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-300 text-[10px] font-mono border border-slate-600">F</kbd>
          <span>Fullscreen</span>
        </span>
      </div>

      {/* Footer */}
      <p className="text-slate-600 text-[10px] mt-4 text-center">
        Swipe or use arrow keys • Press F for fullscreen • Built with React + TypeScript
      </p>
    </div>
  );
}
