Memory Game

A web-based memory matching game built with Vue 3 and PixiJS. Flip cards, find matching pairs, and track your time and moves.

🛠️ Tech Stack

Vue 3 (Composition API, <script setup>)

TypeScript

Vite (bundler)

PixiJS (2D rendering)

Pinia (state management)

@vueuse/core (composition utilities)

@pixi/sound (audio effects)

ESLint + Prettier (linting & formatting)

🚀 Features

Configurable grid sizes (Easy, Medium, Hard)

Seeded shuffle for reproducible games

Move counter and timer with pause/resume support

Save & restore game state via localStorage

Flip animations, card match checking, victory detection

Audio feedback on flip and match

Responsive canvas, auto-resizing

Highscore records display

📦 Installation

# Clone repository
git clone https://github.com/TymoteuszStr/memory-game.git
cd memory-game

# Install dependencies
npm install

🏃‍♂️ Development

# Start dev server
npm run dev

App will be available at http://localhost:5173

Hot Module Replacement enabled

🛠️ Type Checking & Linting

# Type-check with Vue TypeScript Compiler
npm run type-check

# Lint and fix files
npm run lint

🔧 Building for Production

npm run build

Outputs static assets to dist/

Preview locally via npm run preview

📦 Deployment

This project is configured for Vercel:

Push to GitHub main branch

Connect repository in Vercel dashboard

Vercel auto-detects Vite and builds with npm run build

🎮 Gameplay

Select difficulty (Easy:4x4, Medium:6x6, Hard:8x8).

Click cards to flip and reveal symbols.

Match pairs to remove them.

Track your moves and time.

Game ends when all pairs are matched.

Highscores saved in browser localStorage.

📁 Project Structure

src/
├── assets/             # Images, audio
├── components/         # Vue components
│   └── GameCanvas.vue  # Main game canvas
├── game/               # Game logic
│   ├── Card.ts         # Card class (Pixi)
│   ├── Board.ts        # Board layout
│   ├── GameManager.ts  # Game manager
│   ├── types.ts        # Shared types & constants
│   └── mockWeapons.ts  # Sample weapon data
├── stores/             # Pinia stores
│   └── gameStore.ts
├── utils/              # Helpers (shuffle, formatTime)
└── main.ts             # App entry

public/
└── index.html

🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

Fork the repo

Create your feature branch (git checkout -b feature/fooBar)

Commit your changes (git commit -m 'Add some fooBar')

Push to the branch (git push origin feature/fooBar)

Open a Pull Request

📄 License

This project is licensed under the MIT License. See LICENSE for details.
