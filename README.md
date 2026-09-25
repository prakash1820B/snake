# 🐰 Rabbit Game

> A modern, responsive Rabbit & Carrot game built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. Help the hungry rabbit collect carrots in a beautiful garden setting!

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🐰 **Cute Rabbit** | Adorable rabbit character with ears, eyes, and fluffy body |
| 🥕 **Tasty Carrots** | Collect delicious carrots to grow your rabbit's tail |
| 🎮 **Keyboard Controls** | Arrow keys or WASD to move, Space to start/pause, R to reset, F for fullscreen |
| 📱 **Touch Controls** | Swipe gestures on game board + on-screen D-pad for all devices |
| 🖥️ **Fullscreen Mode** | Immersive fullscreen gameplay with F key or button |
| ⏸ **Pause & Restart** | Full game state management (idle, playing, paused, game over) |
| 🎯 **3 Difficulty Levels** | Easy, Medium, Hard — different speeds & scoring |
| 🏆 **High Score Tracking** | Best score persisted via `localStorage` |
| 🔄 **Wrap-Around Edges** | Rabbit passes through walls and appears on the opposite side |
| 🌿 **Garden Theme** | Beautiful green garden background with grass details |
| ✨ **Modern UI** | Dark theme, gradients, smooth animations, glass-morphism overlays |
| 📐 **Fully Responsive** | Optimized for desktop and mobile screens |
| 🚀 **Lightweight** | Fast load times, zero heavy dependencies |
| 🛡 **Type-Safe** | Built entirely with TypeScript |

## 🎮 How to Play

1. Press **Start Game** or **Space** to begin
2. Guide the rabbit 🐰 to eat the carrots 🥕
3. The rabbit grows longer with each carrot eaten
4. The rabbit **wraps around edges** — go off one side, appear on the other!
5. Avoid hitting your own body
6. Try to beat your high score! 🏆

## 🕹 Controls

### Desktop (Keyboard)

| Key | Action |
|-----|--------|
| `↑` `↓` `←` `→` or `W` `A` `S` `D` | Move rabbit |
| `Space` | Start / Pause / Resume |
| `P` | Pause / Resume |
| `R` | Reset game |
| `F` | Toggle fullscreen |

### Mobile (Touch)

- **Swipe** on the game board to change direction
- **On-screen D-pad** buttons below the game board (visible on all devices)
- **Tap** buttons to Start, Pause, or Reset
- **Fullscreen button** for immersive gameplay

## 🎚 Difficulty Levels

| Level | Emoji | Speed | Points per Carrot |
|-------|-------|-------|-------------------|
| Easy | 🟢 | Slow (180ms) | 5 |
| Medium | 🟡 | Normal (120ms) | 10 |
| Hard | 🔴 | Fast (70ms) | 20 |

## 🛠 Tech Stack

- **React 18** — UI framework with hooks
- **TypeScript** — Type safety throughout
- **Vite** — Lightning-fast build tool
- **Tailwind CSS 4** — Utility-first styling
- **Custom Hooks** — Clean game logic separation

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/rabbit-game.git
cd rabbit-game

# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
rabbit-game/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── GameBoard.tsx       # Game board rendering (rabbit, carrot, overlays)
│   │   └── TouchControls.tsx   # Mobile D-pad controls
│   ├── hooks/
│   │   └── useGame.ts          # Core game logic (state, loop, collisions)
│   ├── App.tsx                 # Main app component (layout, controls)
│   ├── main.tsx                # React entry point
│   └── index.css               # Global styles + Tailwind
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies & scripts
├── LICENSE                     # MIT License
└── README.md                   # This file
```

## 🧠 Implementation Highlights

- **Wrap-Around Edges** — Toroidal grid where the rabbit passes through walls and appears on the opposite side
- **Direction Queue** — Prevents rapid key presses from causing the rabbit to reverse into itself
- **Ref-based Game Loop** — Uses refs for carrot/score/direction to avoid stale closures in `setInterval`
- **Efficient Rendering** — Uses stable keys for rabbit segments, minimal re-renders
- **Self-collision Optimization** — Excludes tail from collision check (since it moves away)
- **localStorage Persistence** — High score survives page refreshes
- **Pure CSS Graphics** — Rabbit and carrot drawn with CSS (no images needed)

## 🎨 Visual Design

- **Rabbit**: Cute white/cream character with pink ears, black eyes, and pink nose
- **Carrot**: Orange triangular carrot with green leaves on top
- **Background**: Dark green garden theme with subtle grass patterns
- **Animations**: Smooth pulsing carrot, gradient effects, glass-morphism overlays

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by classic arcade games
- Built with modern web technologies for a smooth, responsive experience
- Pure CSS graphics - no images required!

---

<div align="center">
  Made with ❤️ using React + TypeScript + Tailwind CSS
  
  🐰 loves 🥕
</div>
