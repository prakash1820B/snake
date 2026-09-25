import { useEffect, useRef, useCallback, useState } from 'react';
import { useGame, Direction } from './hooks/useGame';
import GameBoard from './components/GameBoard';

export default function App() {
  const {
    rabbit,
    carrots,
    gameState,
    score,
    highScore,
    gridSize,
    startGame,
    resetGame,
    togglePause,
    changeDirection,
    setDirectionFromTarget,
  } = useGame();

  const boardRef = useRef<HTMLDivElement>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Handle Play button - enter fullscreen and start
  const handlePlay = useCallback(() => {
    // Try to enter fullscreen
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        // Fullscreen might fail, continue anyway
      });
    }
    startGame();
  }, [startGame]);

  // Mouse move handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'playing' || !boardRef.current) return;

    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const gridX = (x / rect.width) * gridSize;
    const gridY = (y / rect.height) * gridSize;

    setDirectionFromTarget(gridX, gridY);
  }, [gameState, gridSize, setDirectionFromTarget]);

  // Touch move handler
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (gameState !== 'playing' || !boardRef.current) return;
    e.preventDefault();

    const touch = e.touches[0];
    const rect = boardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const gridX = (x / rect.width) * gridSize;
    const gridY = (y / rect.height) * gridSize;

    setDirectionFromTarget(gridX, gridY);
  }, [gameState, gridSize, setDirectionFromTarget]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const keyLower = key.toLowerCase();

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
            handlePlay();
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
        case 'escape':
          if (showHelp) setShowHelp(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, changeDirection, handlePlay, togglePause, resetGame, showHelp]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white flex flex-col items-center justify-center p-4 select-none overflow-hidden">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
          🐰 Rabbit Game
        </h1>
      </div>

      {/* Score Panel */}
      <div className="flex items-center gap-6 mb-4 bg-black/40 rounded-2xl px-6 py-3 border border-emerald-700/30 backdrop-blur-sm">
        <div className="text-center">
          <p className="text-[10px] text-emerald-300/70 uppercase tracking-wider font-semibold">🥕 Score</p>
          <p className="text-2xl md:text-3xl font-bold text-orange-400 tabular-nums leading-tight">{score}</p>
        </div>
        <div className="w-px h-10 bg-emerald-700/50" />
        <div className="text-center">
          <p className="text-[10px] text-emerald-300/70 uppercase tracking-wider font-semibold">🏆 Best</p>
          <p className="text-2xl md:text-3xl font-bold text-yellow-400 tabular-nums leading-tight">{highScore}</p>
        </div>
      </div>

      {/* Game Board */}
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

      {/* Action Buttons - Just Help and Play */}
      <div className="flex items-center justify-center gap-4 mt-6">
        {/* Help Button */}
        <button
          onClick={() => setShowHelp(true)}
          className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg
            transition-all duration-200 active:scale-95 shadow-lg border-2 border-slate-600
            hover:border-emerald-500/50 hover:shadow-emerald-500/20"
        >
          ❓ Help
        </button>

        {/* Play Button */}
        {(gameState === 'idle' || gameState === 'gameover') && (
          <button
            onClick={handlePlay}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500
              text-white font-bold text-lg transition-all duration-200 active:scale-95
              shadow-lg shadow-orange-600/40 hover:shadow-orange-500/60 border-2 border-orange-400/30"
          >
            ▶ Play
          </button>
        )}

        {/* Pause Button (during gameplay) */}
        {gameState === 'playing' && (
          <button
            onClick={togglePause}
            className="px-8 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-lg
              transition-all duration-200 active:scale-95 shadow-lg shadow-yellow-600/30"
          >
            ⏸ Pause
          </button>
        )}

        {/* Resume Button */}
        {gameState === 'paused' && (
          <button
            onClick={togglePause}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500
              text-white font-bold text-lg transition-all duration-200 active:scale-95
              shadow-lg shadow-orange-600/40"
          >
            ▶ Resume
          </button>
        )}
      </div>

      {/* Footer hint */}
      <p className="text-emerald-700/60 text-xs mt-4 text-center">
        Move mouse over the circle to guide the rabbit
      </p>

      {/* Help Modal */}
      {showHelp && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-gradient-to-br from-slate-900 to-emerald-950 rounded-2xl p-6 md:p-8 max-w-md w-full
              border-2 border-emerald-600/50 shadow-2xl shadow-emerald-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-emerald-400">🐰 How to Play</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="text-slate-400 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center
                  rounded-lg hover:bg-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-slate-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🖱️</span>
                <div>
                  <p className="font-semibold text-white">Mouse Control</p>
                  <p className="text-sm text-slate-400">Move your mouse over the circle to guide the rabbit</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">🥕</span>
                <div>
                  <p className="font-semibold text-white">Collect Carrots</p>
                  <p className="text-sm text-slate-400">Eat carrots to grow longer and earn points</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">🔄</span>
                <div>
                  <p className="font-semibold text-white">Wrap Around</p>
                  <p className="text-sm text-slate-400">Exit one side of the circle, appear on the opposite side</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-semibold text-white">Avoid Yourself</p>
                  <p className="text-sm text-slate-400">Don't hit your own body or the game ends!</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">⌨️</span>
                <div>
                  <p className="font-semibold text-white">Keyboard</p>
                  <p className="text-sm text-slate-400">Arrow keys or WASD also work • Space to pause</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowHelp(false);
                handlePlay();
              }}
              className="w-full mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500
                text-white font-bold text-lg transition-all duration-200 active:scale-95
                shadow-lg shadow-orange-600/40"
            >
              ▶ Start Playing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
