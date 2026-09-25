# 🐍 Snake Game - Forest Hunt

A modern, realistic snake game with physics-based movement, set in a beautiful forest environment. Guide the snake to hunt mice using smooth, fluid controls!

![Snake Game](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## 🎮 Gameplay Features

### 🐍 Realistic Snake Movement
- **Physics-Based Crawling**: Smooth, fluid motion with velocity interpolation
- **360° Movement**: Move in any direction, not just 4 cardinal directions
- **Continuous Positions**: Floating-point coordinates for organic, natural movement
- **Wrap-Around**: Exit one side of the forest, appear on the opposite side
- **No Grid Snapping**: Snake glides smoothly without jerky grid-based movement

### 🌲 Forest Environment
- **Immersive Background**: Dark green forest floor with scattered leaves
- **Realistic Snake**: Green scales pattern with forked tongue and yellow eyes
- **Prey (Mice)**: Gray mice with ears, eyes, and tails scattered in the forest
- **Circular Arena**: Play in a circular forest clearing with subtle boundary
- **Atmospheric Lighting**: Radial gradients create depth and mood

### 🎯 Game Mechanics
- **Multiple Prey**: 1-5 mice appear at once, new ones spawn when caught
- **Score System**: Earn points based on difficulty (Easy: 5, Medium: 10, Hard: 20)
- **Growth**: Snake grows longer with each mouse caught
- **Self-Collision**: Game ends if snake hits its own body
- **High Score**: Persistent high score tracking via localStorage

## 🕹️ Controls

### 🖱️ Mouse Control (Primary)
- **Move mouse** over the circular game board to guide the snake
- Snake follows your cursor with smooth physics-based movement
- Works on desktop browsers

### 📱 Tilt Control (Mobile)
- **Tilt your phone** to guide the snake
- Tilt forward/backward/left/right to change direction
- Click "Enable Tilt Control" button to activate
- Uses Device Orientation API with iOS permission handling

### ⌨️ Keyboard Controls
- **Arrow Keys** or **WASD**: Move snake in 4 directions
- **Space**: Start game / Pause / Resume
- **P**: Pause / Resume
- **R**: Reset game
- **F**: Toggle fullscreen

### 👆 Touch Controls
- **Swipe** on game board to change direction
- **D-Pad buttons** below the game board for precise control
- Works on all touch devices

## 🎚️ Difficulty Levels

| Level | Speed | Points per Mouse | Description |
|-------|-------|------------------|-------------|
| 🟢 Easy | Slow | 5 | Relaxed hunting, perfect for beginners |
| 🟡 Medium | Normal | 10 | Balanced challenge |
| 🔴 Hard | Fast | 20 | Intense hunting, expert level |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/snake-game.git
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
│   │   ├── GameBoard.tsx       # Circular forest arena with snake and mice
│   │   └── TouchControls.tsx   # Mobile D-pad controls
│   ├── hooks/
│   │   ├── useGame.ts          # Core game logic with physics
│   │   └── useDeviceOrientation.ts  # Mobile tilt controls
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # React entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── README.md                   # This file
├── LICENSE                     # MIT License
└── package.json                # Dependencies
```

## 🧠 Technical Implementation

### Physics & Movement
- **Velocity-Based Physics**: Snake uses velocity vectors (vx, vy) with smooth interpolation (lerp factor 0.15)
- **Continuous Positions**: Floating-point coordinates instead of grid-snapping for organic movement
- **360° Movement**: Can move in any direction, not just 4 cardinal directions
- **requestAnimationFrame**: Smooth 60fps game loop with delta time normalization
- **Distance-Based Collision**: Circle collision detection using distance formula

### Game Mechanics
- **Circular Wrap-Around**: When snake exits the circle, it reappears on the opposite side using angle-based reflection
- **Multiple Mice**: Random 1-5 mice spawn at game start, new mouse spawns when one is caught
- **Self-collision Detection**: Distance-based check (0.5 units) to prevent false positives
- **Mouse Catching Radius**: Mice caught when snake gets within 0.8 units

### Controls
- **Mouse Control**: Snake follows mouse cursor position using normalized direction vectors
- **Tilt Control**: Device orientation API maps phone tilt (beta/gamma) to velocity changes with 15° threshold
- **iOS Permission Handling**: Properly requests DeviceOrientation permission on iOS 13+ devices
- **Touch Controls**: Swipe gestures and D-pad buttons for mobile devices

### Technical Features
- **Ref-based Game Loop**: Uses refs for mice/score/velocity to avoid stale closures
- **Efficient Rendering**: Uses stable keys for snake segments, minimal re-renders
- **localStorage Persistence**: High score survives page refreshes
- **Pure CSS Graphics**: Snake and mice drawn with CSS (no images needed)
- **Radial Gradient Background**: Beautiful forest atmosphere
- **Responsive Design**: Game board scales to `min(90vw, 90vh, 600px)` for optimal viewing
- **Fullscreen Support**: Cross-browser fullscreen API with webkit/ms prefixes

## 🎨 Visual Design

### Forest Environment
- **Circular Arena**: Round game board with emerald green border and dark forest gradient
- **Forest Floor**: Dark green background with scattered leaf patterns
- **Atmospheric Lighting**: Radial gradients create depth and natural lighting
- **Clean Background**: No grid lines for smooth, immersive visual experience

### Snake Design
- **Realistic Appearance**: Green gradient body with scale patterns
- **Detailed Head**: Yellow eyes with black pupils, forked red tongue
- **Body Segments**: Gradient coloring that darkens toward the tail
- **Smooth Movement**: Physics-based interpolation creates fluid, organic motion
- **Opacity Fade**: Tail segments fade out for depth effect

### Mice (Prey)
- **Cute Design**: Gray mice with rounded bodies
- **Details**: Ears, eyes, and tails for realistic appearance
- **Pulsing Animation**: Subtle pulse effect to attract attention
- **Scattered Placement**: Randomly positioned throughout the forest

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by classic Snake arcade games
- Built with modern web technologies for smooth, responsive gameplay
- Physics-based movement for realistic snake behavior
- Beautiful forest environment for immersive experience

## 🎯 Future Enhancements

- [ ] Sound effects (hissing, mouse squeaks)
- [ ] Multiple snake skins
- [ ] Power-ups and special mice
- [ ] Leaderboard system
- [ ] Multiplayer mode
- [ ] More forest environments (night, winter, etc.)

---

<div align="center">
  Made with ❤️ using React + TypeScript + Tailwind CSS
  
  🐍 hunts 🐭 in the 🌲 forest!
</div>
