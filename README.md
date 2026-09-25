# 🐍 Snake Game

A modern, responsive Snake web game built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. Enjoy classic arcade fun with a sleek dark theme, smooth animations, and full mobile support.

![Snake Game](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🎮 **Keyboard Controls** — Arrow keys or WASD to move, Space to start/pause, R to reset
- 📱 **Touch Controls** — Swipe gestures + on-screen D-pad for mobile devices
- ⏸ **Pause & Restart** — Full game state management (idle, playing, paused, game over)
- 🎯 **3 Difficulty Levels** — Easy, Medium, Hard (different speeds & scoring)
- 🏆 **High Score Tracking** — Best score persisted via `localStorage`
- ✨ **Modern UI** — Dark theme, gradients, smooth CSS animations
- 📐 **Fully Responsive** — Optimized for desktop and mobile screens
- 🚀 **Lightweight** — Fast load times, no heavy dependencies

## 🎯 How to Play

1. Press **Start** or **Space** to begin
2. Guide the snake to eat the red food
3. The snake grows longer with each food eaten
4. Avoid hitting the walls or yourself
5. Try to beat your high score!

## 🎮 Controls

### Desktop (Keyboard)

| Key | Action |
|-----|--------|
| `↑` `↓` `←` `→` or `W` `A` `S` `D` | Move snake |
| `Space` | Start / Pause / Resume |
| `P` | Pause / Resume |
| `R` | Reset game |

### Mobile (Touch)

- **Swipe** on the game board to change direction
- **On-screen D-pad** buttons below the game board
- **Tap** buttons to Start, Pause, or Reset

## 🎚 Difficulty Levels

| Level | Speed | Points per Food |
|-------|-------|-----------------|
| 🟢 Easy | Slow | 5 |
| 🟡 Medium | Normal | 10 |
| 🔴 Hard | Fast | 20 |

## 🛠 Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Vite** — Build tool
- **Tailwind CSS 4** — Styling
- **Custom Hooks** — Game logic separation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/snake-game.git
cd snake-game

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
snake-game/
├── src/
│   ├── components/
│   │   ├── GameBoard.tsx      # Game board rendering
│   │   └── TouchControls.tsx  # Mobile D-pad controls
│   ├── hooks/
│   │   └── useSnakeGame.ts    # Core game logic hook
│   ├── App.tsx                # Main app component
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── index.html                 # HTML template
├── vite.config.js             # Vite configuration
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencies & scripts
```

## 📸 Screenshots

_Add screenshots of your game here!_

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the classic Snake arcade game
- Built with modern web technologies for a smooth experience

---

Made with ❤️ and React
