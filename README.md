# 🐰 Rabbit Game

> A modern, immersive Rabbit & Carrot game with top-down perspective. Guide the hungry rabbit to collect carrots in a circular garden!

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
| 🖱️ **Mouse Control** | Move mouse over the circular board to guide the rabbit |
| 🔄 **Circular Wrap** | Rabbit wraps through the circle boundary |
| 🎥 **Top-Down Perspective** | 3D-like view as if playing from above |
| 🖥️ **Fullscreen Mode** | Play button automatically enters fullscreen |
| ❓ **Help Modal** | Click Help to see instructions |
| 🏆 **High Score Tracking** | Best score persisted via `localStorage` |
| 🔴 **Circular Board** | Round board with black grid lines and depth effect |
| 🥕 **Multiple Carrots** | 1-5 random carrots on the board at once |
| 🎨 **3D Shadows** | Realistic shadows and depth for immersive feel |
| 🚀 **Lightweight** | Fast load times, zero heavy dependencies |
| 🛡 **Type-Safe** | Built entirely with TypeScript |

## 🎮 How to Play

1. Click **▶ Play** to start (enters fullscreen automatically)
2. **Move your mouse** over the circular board to guide the rabbit
3. Collect carrots 🥕 to grow longer and earn points
4. The rabbit **wraps around** the circle - exit one side, appear on the opposite
5. Avoid hitting your own body
6. Try to beat your high score! 🏆

## 🕹 Controls

### Mouse (Primary)
- **Move mouse** over the circular game board to guide the rabbit
- The rabbit follows your cursor direction
- Works on touch devices (touch and drag)

### Keyboard (Fallback)
| Key | Action |
|-----|--------|
| `↑` `↓` `←` `→` or `W` `A` `S` `D` | Move rabbit |
| `Space` | Start / Pause / Resume |
| `P` | Pause / Resume |
| `R` | Reset game |
| `Esc` | Close help modal |

## 🎨 Visual Design

- **Top-Down Perspective**: The board is tilted with `rotateX(25deg)` and elliptical shape to create depth
- **Black Grid Lines**: Subtle black grid pattern on dark green background
- **3D Shadows**: Each rabbit segment and carrot casts a shadow for depth
- **Radial Gradients**: Beautiful lighting effects on rabbit and carrots
- **Perspective Stretch**: Rabbit segments are taller than wide for top-down view
- **Circular Board**: Elliptical shape with 3D border and glow effects

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/rabbit-game.git
cd rabbit-game

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
rabbit-game/
├── src/
│   ├── components/
│   │   └── GameBoard.tsx       # 3D circular board with perspective
│   ├── hooks/
│   │   └── useGame.ts          # Core game logic
│   ├── App.tsx                 # Main app with Help/Play buttons
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── README.md
└── LICENSE
```

## 🧠 Implementation Highlights

- **Top-Down Perspective**: CSS `perspective` + `rotateX` + elliptical border-radius
- **Mouse Control**: Real-time direction calculation from mouse position
- **Circular Wrap**: Reflection math for seamless boundary crossing
- **3D Shadows**: Dynamic shadows beneath rabbit and carrots
- **Height Stretch**: Rabbit segments are 1.35x taller for perspective illusion
- **Black Grid**: Subtle black lines on dark background for grid pattern
- **Fullscreen API**: Play button triggers native fullscreen mode
- **Help Modal**: Overlay with instructions and start button

---

<div align="center">
  Made with ❤️ using React + TypeScript + Tailwind CSS
  
  🐰 loves 🥕
</div>
