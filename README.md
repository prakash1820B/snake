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
| 🖱️ **Mouse Control** | Move mouse over the circular board to guide the rabbit - intuitive and smooth! |
| 🔄 **Circular Wrap** | Rabbit wraps through the circle boundary - exits one side, appears on opposite! |
| 🎮 **Keyboard Fallback** | Arrow keys or WASD still work as alternative controls |
| 📱 **Touch Support** | Touch and drag on mobile devices to control the rabbit |
| 🖥️ **Fullscreen Mode** | Immersive fullscreen gameplay with F key or button |
| ⏸ **Pause & Restart** | Full game state management (idle, playing, paused, game over) |
| 🎯 **3 Difficulty Levels** | Easy, Medium, Hard — different speeds & scoring |
| 🏆 **High Score Tracking** | Best score persisted via `localStorage` |
| 🔴 **Circular Board** | Round game board with radial gradient and wrap-around boundaries |
| 🥕 **Multiple Carrots** | 1-5 random carrots on the board at once - eat one, a new one spawns! |
| 🌿 **Garden Theme** | Beautiful green garden background with grass details |
| ✨ **Modern UI** | Dark theme, gradients, smooth animations, glass-morphism overlays |
| 📐 **Fully Responsive** | Optimized for desktop and mobile screens |
| 🚀 **Lightweight** | Fast load times, zero heavy dependencies |
| 🛡 **Type-Safe** | Built entirely with TypeScript |

## 🎮 How to Play

1. Press **Start Game** or **Space** to begin
2. **Move your mouse** over the circular board to guide the rabbit 🐰
3. The rabbit will follow your mouse cursor - just hover in the direction you want to go!
4. Collect carrots 🥕 to grow longer and earn points
5. **Multiple carrots** (1-5) appear on the board at once - eat one and a new one spawns!
6. The rabbit **wraps around** the circular boundary - exit one side, appear on the opposite!
7. Avoid hitting your own body
8. Try to beat your high score! 🏆

## 🕹 Controls

### Mouse Control (Primary)

- **Move mouse** over the circular game board to guide the rabbit
- The rabbit follows your cursor - just hover in the direction you want to go!
- Works on both desktop and touch devices (touch and drag)

### Keyboard (Fallback)

| Key | Action |
|-----|--------|
| `↑` `↓` `←` `→` or `W` `A` `S` `D` | Move rabbit |
| `Space` | Start / Pause / Resume |
| `P` | Pause / Resume |
| `R` | Reset game |
| `F` | Toggle fullscreen |

### Touch (Mobile)

- **Touch and drag** on the game board to guide the rabbit
- The rabbit follows your finger movement
- Tap buttons to Start, Pause, or Reset

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

- **Mouse Control** — Rabbit follows mouse cursor position using coordinate mapping and direction calculation
- **Circular Wrap-Around** — When rabbit exits the circle, it reappears on the opposite side using reflection math
- **Circular Board** — Round game board with boundary detection using distance formula from center
- **Multiple Carrots** — Random 1-5 carrots spawn at game start, new carrot spawns when one is eaten
- **Direction Queue** — Prevents rapid inputs from causing the rabbit to reverse into itself
- **Ref-based Game Loop** — Uses refs for carrots/score/direction to avoid stale closures in `setInterval`
- **Efficient Rendering** — Uses stable keys for rabbit segments, minimal re-renders
- **Self-collision Optimization** — Excludes tail from collision check (since it moves away)
- **localStorage Persistence** — High score survives page refreshes
- **Pure CSS Graphics** — Rabbit and carrots drawn with CSS (no images needed)
- **Radial Gradient Background** — Beautiful circular gradient for the game board

## 🎨 Visual Design

- **Circular Board**: Round game board with emerald green border and radial gradient background
- **Rabbit**: Cute white/cream character with pink ears, black eyes, and pink nose
- **Carrots**: Multiple orange triangular carrots with green leaves, each with staggered pulse animations
- **Background**: Dark green garden theme with subtle circular grid patterns
- **Animations**: Smooth pulsing carrots with staggered delays, gradient effects, glass-morphism overlays
- **Boundary Indicator**: Subtle inner ring showing the circular play area

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
