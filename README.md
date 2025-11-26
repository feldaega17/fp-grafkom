# Reog Ponorogo 3D Interactive Museum

An interactive 3D visualization of Reog Ponorogo, a traditional performing art from Ponorogo, East Java, Indonesia. Built with Three.js.

> **Work in Progress:** Early prototype for an upcoming open-world Borobudur temple environment featuring Reog characters.

## Features

- Interactive 3D Reog Ponorogo model with dynamic textures
- Dual camera control systems (Orbit & First-Person)
- Dynamic lighting with animated spotlights
- Interactive hover and click events with audio feedback
- Traditional gamelan music system
- Real-time texture switching (GLB ↔ PNG materials)

## Quick Start

### Prerequisites

- Node.js 18+ or Node.js 20.19.0+ / 22.12.0+
- npm or pnpm

### Installation

```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Controls

### Camera Modes

**Orbit Mode (Default)**
- Drag: Rotate camera around model
- Scroll: Zoom in/out
- Panel buttons: Additional controls

**First-Person Mode** (Toggle via "Mode" button)
- `W` / `S`: Move forward/backward
- `A` / `D`: Strafe left/right
- `Arrow Keys`: Look around

### Panel Controls

- **Zoom In/Out**: Manual zoom controls
- **Reset Camera**: Return to default view
- **Auto Orbit**: Enable automatic rotation
- **Mode Toggle**: Switch between Orbit and FPS
- **Texture Cycle**: Switch through texture variations

### Model Interactions

- **Hover**: Highlights model with emissive glow + plays kendang percussion
- **Click**: Triggers gong sound + displays contextual information:
  - **Top (>70%)**: Dadak Merak (iconic peacock feathers)
  - **Middle (35-70%)**: Barongan/Warok (main mask face)
  - **Bottom (<35%)**: Traditional costume details

## Project Structure

```
fp-grafkom/
├── public/
│   ├── Reog.glb           # 3D model (GLTF format)
│   ├── reog-music.mp3     # Background gamelan music
│   └── texture_*.png      # Alternative texture maps
├── main.js                # Core application logic
├── index.html             # Entry point
└── package.json           # Dependencies & scripts
```

## Tech Stack

- **[Three.js](https://threejs.org/)** - WebGL 3D rendering library
- **[Vite](https://vitejs.dev/)** - Next-generation build tool

## Roadmap

- [ ] Borobudur temple environment
- [ ] Open-world navigation system
- [ ] Multiple interactive Reog characters
- [ ] Enhanced visual effects and animations
- [ ] Performance optimizations
- [ ] Mobile device support

## Development Notes

This project uses ES modules (`type: "module"` in package.json). All Three.js imports follow the modern ES6+ syntax.

## License

ISC

---

**Final Project** - Computer Graphics Course, Semester 5
