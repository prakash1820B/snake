import { useState, useEffect, useCallback, useRef } from 'react';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Position = { x: number; y: number };
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameState = 'idle' | 'playing' | 'paused' | 'gameover';

const GRID_SIZE = 20;

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

function getRandomPosition(exclude: Position[]): Position {
  let pos: Position;
  let attempts = 0;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    attempts++;
    if (attempts > 1000) break; // safety valve
  } while (exclude.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
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
  const [carrot, setCarrot] = useState<Position>({ x: 15, y: 10 });
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
  const carrotRef = useRef<Position>({ x: 15, y: 10 });
  const scoreRef = useRef(0);
  const difficultyRef = useRef<Difficulty>('medium');
  const gameStateRef = useRef<GameState>('idle');
  const directionQueueRef = useRef<Direction[]>([]);

  // Keep refs in sync with state
  useEffect(() => { carrotRef.current = carrot; }, [carrot]);
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
    const newCarrot = getRandomPosition(initialRabbit);
    setCarrot(newCarrot);
    carrotRef.current = newCarrot;
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
      const newCarrot = getRandomPosition(initialRabbit);
      setCarrot(newCarrot);
      carrotRef.current = newCarrot;
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
    // Queue direction changes to prevent rapid reversal
    const lastQueued = directionQueueRef.current.length > 0
      ? directionQueueRef.current[directionQueueRef.current.length - 1]
      : directionRef.current;

    if (OPPOSITES[newDir] !== lastQueued && newDir !== lastQueued) {
      directionQueueRef.current.push(newDir);
      // Keep queue small
      if (directionQueueRef.current.length > 2) {
        directionQueueRef.current = directionQueueRef.current.slice(-2);
      }
    }
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const tick = () => {
      // Process direction queue
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

        // Wrap around edges (toroidal grid)
        if (head.x < 0) head.x = GRID_SIZE - 1;
        else if (head.x >= GRID_SIZE) head.x = 0;
        if (head.y < 0) head.y = GRID_SIZE - 1;
        else if (head.y >= GRID_SIZE) head.y = 0;

        // Self collision (check against body, excluding tail since it will move)
        const bodyToCheck = prevRabbit.slice(0, -1);
        if (bodyToCheck.some(s => s.x === head.x && s.y === head.y)) {
          endGame();
          return prevRabbit;
        }

        const newRabbit = [head, ...prevRabbit];
        const currentCarrot = carrotRef.current;

        // Carrot collision
        if (head.x === currentCarrot.x && head.y === currentCarrot.y) {
          const points = POINTS_MAP[difficultyRef.current];
          setScore(prev => {
            const newScore = prev + points;
            scoreRef.current = newScore;
            return newScore;
          });
          const newCarrot = getRandomPosition(newRabbit);
          setCarrot(newCarrot);
          carrotRef.current = newCarrot;
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
    carrot,
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
