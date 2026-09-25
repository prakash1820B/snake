import { useState, useEffect, useCallback, useRef } from 'react';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Position = { x: number; y: number };
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameState = 'idle' | 'playing' | 'paused' | 'gameover';

const GRID_SIZE = 20;

const SPEED_MAP: Record<Difficulty, number> = {
  easy: 150,
  medium: 100,
  hard: 60,
};

function getRandomPosition(snake: Position[]): Position {
  let pos: Position;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

export function useSnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-high-score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const directionRef = useRef<Direction>(direction);
  const gameStateRef = useRef<GameState>(gameState);
  const lastDirectionRef = useRef<Direction>(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomPosition(INITIAL_SNAKE));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    lastDirectionRef.current = 'RIGHT';
    setScore(0);
    setGameState('idle');
  }, []);

  const startGame = useCallback(() => {
    if (gameState === 'gameover' || gameState === 'idle') {
      setSnake(INITIAL_SNAKE);
      setFood(getRandomPosition(INITIAL_SNAKE));
      setDirection('RIGHT');
      directionRef.current = 'RIGHT';
      lastDirectionRef.current = 'RIGHT';
      setScore(0);
    }
    setGameState('playing');
  }, [gameState]);

  const togglePause = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
    }
  }, [gameState]);

  const changeDirection = useCallback((newDir: Direction) => {
    const current = lastDirectionRef.current;
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };
    if (opposites[newDir] !== current) {
      setDirection(newDir);
      directionRef.current = newDir;
    }
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        const dir = directionRef.current;

        switch (dir) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameState('gameover');
          setScore(prev => {
            const finalScore = prev;
            setHighScore(hs => {
              const newHigh = Math.max(hs, finalScore);
              localStorage.setItem('snake-high-score', String(newHigh));
              return newHigh;
            });
            return prev;
          });
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(s => s.x === head.x && s.y === head.y)) {
          setGameState('gameover');
          setScore(prev => {
            const finalScore = prev;
            setHighScore(hs => {
              const newHigh = Math.max(hs, finalScore);
              localStorage.setItem('snake-high-score', String(newHigh));
              return newHigh;
            });
            return prev;
          });
          return prevSnake;
        }

        lastDirectionRef.current = dir;
        const newSnake = [head, ...prevSnake];

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(prev => prev + (difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 20));
          setFood(getRandomPosition(newSnake));
          return newSnake;
        }

        newSnake.pop();
        return newSnake;
      });
    }, SPEED_MAP[difficulty]);

    return () => clearInterval(interval);
  }, [gameState, difficulty, food]);

  return {
    snake,
    food,
    direction,
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
