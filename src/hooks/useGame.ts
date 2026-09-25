import { useState, useEffect, useCallback, useRef } from 'react';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Position = { x: number; y: number };
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameState = 'idle' | 'playing' | 'paused' | 'gameover';

const GRID_SIZE = 20;
const CENTER = GRID_SIZE / 2;
const RADIUS = GRID_SIZE / 2;

const SPEED_MAP: Record<Difficulty, number> = {
  easy: 180,
  medium: 120,
  hard: 70,
};

const POINTS_MAP: Record<Difficulty, number> = {
  easy: 5,
  medium: 10,
  hard: 20,
};

// Check if position is within circular boundary
function isInCircle(pos: Position): boolean {
  const dx = pos.x - CENTER + 0.5;
  const dy = pos.y - CENTER + 0.5;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance <= RADIUS;
}

// Get random position within circle
function getRandomPositionInCircle(exclude: Position[]): Position {
  let pos: Position;
  let attempts = 0;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    attempts++;
    if (attempts > 1000) break;
  } while (!isInCircle(pos) || exclude.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

// Generate multiple carrots (1-5 random)
function generateCarrots(rabbit: Position[], count: number): Position[] {
  const carrots: Position[] = [];
  for (let i = 0; i < count; i++) {
    const exclude = [...rabbit, ...carrots];
    carrots.push(getRandomPositionInCircle(exclude));
  }
  return carrots;
}

const INITIAL_RABBIT: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

const OPPOSITES: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

export function useGame() {
  const [rabbit, setRabbit] = useState<Position[]>(INITIAL_RABBIT);
  const [carrots, setCarrots] = useState<Position[]>(() => generateCarrots(INITIAL_RABBIT, 3));
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('rabbit-high-score');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  // Refs to avoid stale closures in game loop
  const directionRef = useRef<Direction>('RIGHT');
  const nextDirectionRef = useRef<Direction>('RIGHT');
  const carrotsRef = useRef<Position[]>(carrots);
  const scoreRef = useRef(0);
  const difficultyRef = useRef<Difficulty>('medium');
  const gameStateRef = useRef<GameState>('idle');
  const directionQueueRef = useRef<Direction[]>([]);
  const carrotCountRef = useRef(3);

  // Keep refs in sync with state
  useEffect(() => { carrotsRef.current = carrots; }, [carrots]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { difficultyRef.current = difficulty; }, [difficulty]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  const saveHighScore = useCallback((finalScore: number) => {
    setHighScore(prev => {
      const newHigh = Math.max(prev, finalScore);
      try {
        localStorage.setItem('rabbit-high-score', String(newHigh));
      } catch { /* ignore */ }
      return newHigh;
    });
  }, []);

  const endGame = useCallback(() => {
    setGameState('gameover');
    saveHighScore(scoreRef.current);
  }, [saveHighScore]);

  const resetGame = useCallback(() => {
    const initialRabbit = [...INITIAL_RABBIT];
    setRabbit(initialRabbit);
    const count = Math.floor(Math.random() * 5) + 1; // 1-5 carrots
    carrotCountRef.current = count;
    const newCarrots = generateCarrots(initialRabbit, count);
    setCarrots(newCarrots);
    carrotsRef.current = newCarrots;
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = 'RIGHT';
    directionQueueRef.current = [];
    setScore(0);
    scoreRef.current = 0;
    setGameState('idle');
  }, []);

  const startGame = useCallback(() => {
    if (gameStateRef.current === 'gameover' || gameStateRef.current === 'idle') {
      const initialRabbit = [...INITIAL_RABBIT];
      setRabbit(initialRabbit);
      const count = Math.floor(Math.random() * 5) + 1; // 1-5 carrots
      carrotCountRef.current = count;
      const newCarrots = generateCarrots(initialRabbit, count);
      setCarrots(newCarrots);
      carrotsRef.current = newCarrots;
      directionRef.current = 'RIGHT';
      nextDirectionRef.current = 'RIGHT';
      directionQueueRef.current = [];
      setScore(0);
      scoreRef.current = 0;
    }
    setGameState('playing');
  }, []);

  const togglePause = useCallback(() => {
    if (gameStateRef.current === 'playing') {
      setGameState('paused');
    } else if (gameStateRef.current === 'paused') {
      setGameState('playing');
    }
  }, []);

  const changeDirection = useCallback((newDir: Direction) => {
    const lastQueued = directionQueueRef.current.length > 0
      ? directionQueueRef.current[directionQueueRef.current.length - 1]
      : directionRef.current;

    if (OPPOSITES[newDir] !== lastQueued && newDir !== lastQueued) {
      directionQueueRef.current.push(newDir);
      if (directionQueueRef.current.length > 2) {
        directionQueueRef.current = directionQueueRef.current.slice(-2);
      }
    }
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const tick = () => {
      if (directionQueueRef.current.length > 0) {
        const nextDir = directionQueueRef.current.shift()!;
        if (OPPOSITES[nextDir] !== directionRef.current) {
          directionRef.current = nextDir;
        }
      }

      setRabbit(prevRabbit => {
        const head = { ...prevRabbit[0] };
        const dir = directionRef.current;

        switch (dir) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Check if outside circular boundary
        if (!isInCircle(head)) {
          endGame();
          return prevRabbit;
        }

        // Self collision
        const bodyToCheck = prevRabbit.slice(0, -1);
        if (bodyToCheck.some(s => s.x === head.x && s.y === head.y)) {
          endGame();
          return prevRabbit;
        }

        const newRabbit = [head, ...prevRabbit];
        const currentCarrots = carrotsRef.current;

        // Check if rabbit ate a carrot
        const eatenIndex = currentCarrots.findIndex(c => c.x === head.x && c.y === head.y);
        
        if (eatenIndex !== -1) {
          // Remove eaten carrot
          const newCarrots = currentCarrots.filter((_, i) => i !== eatenIndex);
          
          // Spawn a new carrot to maintain count
          const newCarrot = getRandomPositionInCircle([...newRabbit, ...newCarrots]);
          newCarrots.push(newCarrot);
          
          setCarrots(newCarrots);
          carrotsRef.current = newCarrots;
          
          const points = POINTS_MAP[difficultyRef.current];
          setScore(prev => {
            const newScore = prev + points;
            scoreRef.current = newScore;
            return newScore;
          });
          
          return newRabbit;
        }

        newRabbit.pop();
        return newRabbit;
      });
    };

    const interval = setInterval(tick, SPEED_MAP[difficulty]);
    return () => clearInterval(interval);
  }, [gameState, difficulty, endGame]);

  return {
    rabbit,
    carrots,
    gameState,
    score,
    difficulty,
    highScore,
    gridSize: GRID_SIZE,
    startGame,
    resetGame,
    togglePause,
    changeDirection,
    setDifficulty,
  };
}
