import { useState, useEffect, useCallback, useRef } from 'react';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Position = { x: number; y: number };
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameState = 'idle' | 'playing' | 'paused' | 'gameover';

const GRID_SIZE = 20;
const CENTER = GRID_SIZE / 2;
const RADIUS = GRID_SIZE / 2;

const SPEED_MAP: Record<Difficulty, number> = {
  easy: 0.08,
  medium: 0.12,
  hard: 0.18,
};

const POINTS_MAP: Record<Difficulty, number> = {
  easy: 5,
  medium: 10,
  hard: 20,
};

function isInCircle(pos: Position): boolean {
  const dx = pos.x - CENTER;
  const dy = pos.y - CENTER;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance <= RADIUS;
}

function wrapThroughCircle(pos: Position): Position {
  const dx = pos.x - CENTER;
  const dy = pos.y - CENTER;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance > RADIUS) {
    const angle = Math.atan2(dy, dx);
    const wrappedDistance = distance - RADIUS * 2;
    return {
      x: CENTER + Math.cos(angle + Math.PI) * Math.abs(wrappedDistance),
      y: CENTER + Math.sin(angle + Math.PI) * Math.abs(wrappedDistance),
    };
  }
  
  return pos;
}

function getRandomPositionInCircle(exclude: Position[], minDistance: number = 1): Position {
  let pos: Position;
  let attempts = 0;
  do {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * (RADIUS - 1);
    pos = {
      x: CENTER + Math.cos(angle) * radius,
      y: CENTER + Math.sin(angle) * radius,
    };
    attempts++;
    if (attempts > 1000) break;
  } while (!isInCircle(pos) || exclude.some(s => {
    const dx = s.x - pos.x;
    const dy = s.y - pos.y;
    return Math.sqrt(dx * dx + dy * dy) < minDistance;
  }));
  return pos;
}

function generateFood(snake: Position[], count: number): Position[] {
  const food: Position[] = [];
  for (let i = 0; i < count; i++) {
    const exclude = [...snake, ...food];
    food.push(getRandomPositionInCircle(exclude, 1.5));
  }
  return food;
}

const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9.5, y: 10 },
  { x: 9, y: 10 },
  { x: 8.5, y: 10 },
  { x: 8, y: 10 },
];

interface Velocity {
  x: number;
  y: number;
}

export function useGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position[]>(() => generateFood(INITIAL_SNAKE, 3));
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('snake-high-score');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const velocityRef = useRef<Velocity>({ x: 0.12, y: 0 });
  const targetVelocityRef = useRef<Velocity>({ x: 0.12, y: 0 });
  const foodRef = useRef<Position[]>(food);
  const scoreRef = useRef(0);
  const difficultyRef = useRef<Difficulty>('medium');
  const gameStateRef = useRef<GameState>('idle');
  const timeRef = useRef(0);

  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { difficultyRef.current = difficulty; }, [difficulty]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  const saveHighScore = useCallback((finalScore: number) => {
    setHighScore(prev => {
      const newHigh = Math.max(prev, finalScore);
      try {
        localStorage.setItem('snake-high-score', String(newHigh));
      } catch { /* ignore */ }
      return newHigh;
    });
  }, []);

  const endGame = useCallback(() => {
    setGameState('gameover');
    saveHighScore(scoreRef.current);
  }, [saveHighScore]);

  const resetGame = useCallback(() => {
    const initialSnake = [...INITIAL_SNAKE];
    setSnake(initialSnake);
    const count = Math.floor(Math.random() * 5) + 1;
    const newFood = generateFood(initialSnake, count);
    setFood(newFood);
    foodRef.current = newFood;
    velocityRef.current = { x: 0.12, y: 0 };
    targetVelocityRef.current = { x: 0.12, y: 0 };
    setScore(0);
    scoreRef.current = 0;
    setGameState('idle');
  }, []);

  const startGame = useCallback(() => {
    if (gameStateRef.current === 'gameover' || gameStateRef.current === 'idle') {
      const initialSnake = [...INITIAL_SNAKE];
      setSnake(initialSnake);
      const count = Math.floor(Math.random() * 5) + 1;
      const newFood = generateFood(initialSnake, count);
      setFood(newFood);
      foodRef.current = newFood;
      velocityRef.current = { x: 0.12, y: 0 };
      targetVelocityRef.current = { x: 0.12, y: 0 };
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
    const speed = SPEED_MAP[difficultyRef.current];
    switch (newDir) {
      case 'UP':
        targetVelocityRef.current = { x: 0, y: -speed };
        break;
      case 'DOWN':
        targetVelocityRef.current = { x: 0, y: speed };
        break;
      case 'LEFT':
        targetVelocityRef.current = { x: -speed, y: 0 };
        break;
      case 'RIGHT':
        targetVelocityRef.current = { x: speed, y: 0 };
        break;
    }
  }, []);

  const setDirectionFromTarget = useCallback((targetX: number, targetY: number) => {
    if (gameStateRef.current !== 'playing') return;

    const dx = targetX - CENTER;
    const dy = targetY - CENTER;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0.5) {
      const speed = SPEED_MAP[difficultyRef.current];
      const normalizedX = dx / distance;
      const normalizedY = dy / distance;
      targetVelocityRef.current = {
        x: normalizedX * speed,
        y: normalizedY * speed,
      };
    }
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const tick = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 16;
      lastTime = currentTime;
      timeRef.current += deltaTime * 0.1;

      // Smooth velocity interpolation
      const lerpFactor = 0.15 * deltaTime;
      velocityRef.current = {
        x: velocityRef.current.x + (targetVelocityRef.current.x - velocityRef.current.x) * lerpFactor,
        y: velocityRef.current.y + (targetVelocityRef.current.y - velocityRef.current.y) * lerpFactor,
      };

      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        
        // Apply velocity
        head.x += velocityRef.current.x * deltaTime;
        head.y += velocityRef.current.y * deltaTime;

        // Wrap through circle
        if (!isInCircle(head)) {
          const wrapped = wrapThroughCircle(head);
          head.x = wrapped.x;
          head.y = wrapped.y;
        }

        // Self collision
        const bodyToCheck = prevSnake.slice(0, -1);
        if (bodyToCheck.some(s => {
          const dx = s.x - head.x;
          const dy = s.y - head.y;
          return Math.sqrt(dx * dx + dy * dy) < 0.5;
        })) {
          endGame();
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];
        const currentFood = foodRef.current;

        // Check food collision
        const eatenIndex = currentFood.findIndex(f => {
          const dx = f.x - head.x;
          const dy = f.y - head.y;
          return Math.sqrt(dx * dx + dy * dy) < 0.8;
        });

        if (eatenIndex !== -1) {
          const newFood = currentFood.filter((_, i) => i !== eatenIndex);
          const newFoodItem = getRandomPositionInCircle([...newSnake, ...newFood], 1.5);
          newFood.push(newFoodItem);

          setFood(newFood);
          foodRef.current = newFood;

          const points = POINTS_MAP[difficultyRef.current];
          setScore(prev => {
            const newScore = prev + points;
            scoreRef.current = newScore;
            return newScore;
          });

          return newSnake;
        }

        newSnake.pop();
        return newSnake;
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, endGame]);

  return {
    snake,
    food,
    gameState,
    score,
    difficulty,
    highScore,
    gridSize: GRID_SIZE,
    startGame,
    resetGame,
    togglePause,
    changeDirection,
    setDirectionFromTarget,
    setDifficulty,
  };
}
