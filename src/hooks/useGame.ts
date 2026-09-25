import { useState, useEffect, useCallback, useRef } from 'react';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Position = { x: number; y: number };
export type GameState = 'idle' | 'playing' | 'paused' | 'gameover';

const GRID_SIZE = 20;
const CENTER = GRID_SIZE / 2;
const RADIUS = GRID_SIZE / 2;
const SPEED = 120;
const POINTS = 10;

function isInCircle(pos: Position): boolean {
  const dx = pos.x - CENTER + 0.5;
  const dy = pos.y - CENTER + 0.5;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance <= RADIUS;
}

function wrapThroughCircle(pos: Position): Position {
  const reflected = {
    x: 2 * (CENTER - 0.5) - pos.x,
    y: 2 * (CENTER - 0.5) - pos.y,
  };

  if (!isInCircle(reflected)) {
    const dx = reflected.x - CENTER + 0.5;
    const dy = reflected.y - CENTER + 0.5;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0) {
      const scale = (RADIUS - 1) / distance;
      return {
        x: Math.round(CENTER - 0.5 + dx * scale),
        y: Math.round(CENTER - 0.5 + dy * scale),
      };
    }
  }

  return reflected;
}

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
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('rabbit-high-score');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const directionRef = useRef<Direction>('RIGHT');
  const carrotsRef = useRef<Position[]>(carrots);
  const scoreRef = useRef(0);
  const gameStateRef = useRef<GameState>('idle');
  const directionQueueRef = useRef<Direction[]>([]);

  useEffect(() => { carrotsRef.current = carrots; }, [carrots]);
  useEffect(() => { scoreRef.current = score; }, [score]);
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
    const count = Math.floor(Math.random() * 5) + 1;
    const newCarrots = generateCarrots(initialRabbit, count);
    setCarrots(newCarrots);
    carrotsRef.current = newCarrots;
    directionRef.current = 'RIGHT';
    directionQueueRef.current = [];
    setScore(0);
    scoreRef.current = 0;
    setGameState('idle');
  }, []);

  const startGame = useCallback(() => {
    if (gameStateRef.current === 'gameover' || gameStateRef.current === 'idle') {
      const initialRabbit = [...INITIAL_RABBIT];
      setRabbit(initialRabbit);
      const count = Math.floor(Math.random() * 5) + 1;
      const newCarrots = generateCarrots(initialRabbit, count);
      setCarrots(newCarrots);
      carrotsRef.current = newCarrots;
      directionRef.current = 'RIGHT';
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

  const setDirectionFromTarget = useCallback((targetX: number, targetY: number) => {
    if (gameStateRef.current !== 'playing') return;

    const dx = targetX - CENTER;
    const dy = targetY - CENTER;

    let newDir: Direction;
    if (Math.abs(dx) > Math.abs(dy)) {
      newDir = dx > 0 ? 'RIGHT' : 'LEFT';
    } else {
      newDir = dy > 0 ? 'DOWN' : 'UP';
    }

    const lastQueued = directionQueueRef.current.length > 0
      ? directionQueueRef.current[directionQueueRef.current.length - 1]
      : directionRef.current;

    if (OPPOSITES[newDir] !== lastQueued && newDir !== lastQueued) {
      directionQueueRef.current = [newDir];
    }
  }, []);

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

        if (!isInCircle(head)) {
          const wrapped = wrapThroughCircle(head);
          head.x = wrapped.x;
          head.y = wrapped.y;
        }

        const bodyToCheck = prevRabbit.slice(0, -1);
        if (bodyToCheck.some(s => s.x === head.x && s.y === head.y)) {
          endGame();
          return prevRabbit;
        }

        const newRabbit = [head, ...prevRabbit];
        const currentCarrots = carrotsRef.current;

        const eatenIndex = currentCarrots.findIndex(c => c.x === head.x && c.y === head.y);

        if (eatenIndex !== -1) {
          const newCarrots = currentCarrots.filter((_, i) => i !== eatenIndex);
          const newCarrot = getRandomPositionInCircle([...newRabbit, ...newCarrots]);
          newCarrots.push(newCarrot);

          setCarrots(newCarrots);
          carrotsRef.current = newCarrots;

          setScore(prev => {
            const newScore = prev + POINTS;
            scoreRef.current = newScore;
            return newScore;
          });

          return newRabbit;
        }

        newRabbit.pop();
        return newRabbit;
      });
    };

    const interval = setInterval(tick, SPEED);
    return () => clearInterval(interval);
  }, [gameState, endGame]);

  return {
    rabbit,
    carrots,
    gameState,
    score,
    highScore,
    gridSize: GRID_SIZE,
    startGame,
    resetGame,
    togglePause,
    changeDirection,
    setDirectionFromTarget,
  };
}
