import { useEffect, useRef, useCallback } from 'react';
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

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Prevent scrolling with arrow keys
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (key) {
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
          togglePause();
          break;
        case 'r':
          resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, changeDirection, startGame, togglePause, resetGame]);

  // Touch/swipe controls
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const minSwipe = 30;

    if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      changeDirection(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      changeDirection(dy > 0 ? 'DOWN' : 'UP');
    }
    touchStartRef.current = null;
  }, [changeDirection]);

  const difficulties: { value: Difficulty; label: string; color: string }[] = [
    { value: 'easy', label: 'Easy', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'hard', label: 'Hard', color: 'bg-red-500' },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col items-center justify-center p-4 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🐍 Snake Game
        </h1>
        <p className="text-slate-400 text-sm mt-1">Classic arcade fun, modern style</p>
      </div>

      {/* Score Panel */}
      <div className="flex items-center gap-6 mb-4">
        <div className="text-center">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Score</p>
          <p className="text-2xl font-bold text-emerald-400 tabular-nums">{score}</p>
        </div>
        <div className="w-px h-10 bg-slate-700" />
        <div className="text-center">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Best</p>
          <p className="text-2xl font-bold text-yellow-400 tabular-nums">{highScore}</p>
        </div>
      </div>

      {/* Game Board */}
      <GameBoard
        snake={snake}
        food={food}
        gridSize={gridSize}
        gameState={gameState}
      />

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
        {/* Start/Pause Button */}
        {(gameState === 'idle' || gameState === 'gameover') && (
          <button
            onClick={startGame}
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold
              transition-all duration-200 active:scale-95 shadow-lg shadow-emerald-600/30"
          >
            {gameState === 'gameover' ? '🔄 Restart' : '▶ Start'}
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
          <button
            onClick={togglePause}
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold
              transition-all duration-200 active:scale-95 shadow-lg shadow-emerald-600/30"
          >
            ▶ Resume
          </button>
        )}

        {/* Restart Button */}
        {gameState !== 'idle' && (
          <button
            onClick={resetGame}
            className="px-5 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold
              transition-all duration-200 active:scale-95 border border-slate-600"
          >
            🔄 Reset
          </button>
        )}
      </div>

      {/* Difficulty Selector */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-xs text-slate-400 uppercase tracking-wide mr-1">Difficulty:</span>
        {difficulties.map(d => (
          <button
            key={d.value}
            onClick={() => {
              setDifficulty(d.value);
              if (gameState === 'playing' || gameState === 'paused') {
                resetGame();
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
              ${
                difficulty === d.value
                  ? `${d.color} text-white shadow-lg scale-105`
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50'
              }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Touch Controls (Mobile) */}
      <TouchControls
        onDirection={changeDirection}
        disabled={gameState !== 'playing'}
      />

      {/* Keyboard hints (Desktop) */}
      <div className="hidden md:flex items-center gap-4 mt-4 text-xs text-slate-500">
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 text-xs">↑↓←→</kbd> Move
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 text-xs">Space</kbd> Start/Pause
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 text-xs">R</kbd> Reset
        </span>
      </div>

      {/* Footer */}
      <p className="text-slate-600 text-xs mt-6">
        Swipe on mobile or use arrow keys on desktop
      </p>
    </div>
  );
}
