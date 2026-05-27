# 🎮 Dare or Drop

**Dare or Drop** is a cross-platform, high-performance memory game built with React Native and Expo. 

Designed with a premium dark-mode aesthetic, it challenges players to replicate increasingly complex, randomly generated sequences. The game features buttery-smooth 60fps animations, haptic feedback, and a responsive layout that scales perfectly across iOS, Android, and the Web.

---

## ✨ Key Features & Technical Highlights

* **Advanced State Management:** Utilizes React Context and `useReducer` to create a robust, centralized game engine handling sequence generation, input validation, scoring, and timing logic.
* **Dynamic Sequence Generation:** Unlike classic memory games, *Dare or Drop* generates a completely new, randomized sequence at the start of every level, algorithmically preventing consecutive duplicate colors for a more varied and challenging experience.
* **High-Performance Animations:** Built with `react-native-reanimated` to ensure complex UI updates (like the ambient particle background, pulsing neon glow effects, and button spring physics) run on the UI thread at a locked 60fps without blocking JavaScript.
* **Premium UI/UX (Glassmorphism):** Features a bespoke design system (`theme.ts`) that leverages modern UI paradigms including frosted glass panels, neon shadows, and vibrant gradients.
* **Cross-Platform Haptics:** Implements `expo-haptics` with intelligent fallbacks, ensuring mobile players get physical feedback (success, error, and interaction ticks) while web players receive a graceful, error-free fallback.

---

## 🛠️ Technology Stack

* **Framework:** React Native / Expo (SDK 56)
* **Language:** TypeScript
* **Animations:** React Native Reanimated v4
* **State Management:** React Context API
* **Typography:** Expo Google Fonts (`Inter`)
* **Hardware API:** Expo Haptics

---

## 🗂️ Project Architecture

The codebase is strictly typed and modular, designed for scalability and readability:

```text
src/
├── components/          # Reusable, decoupled UI elements
│   ├── AnimatedButton.tsx  # Spring-animated buttons with gradients
│   ├── GamePad.tsx         # Interactive game grid elements with brightness interpolation
│   ├── GlassCard.tsx       # Translucent UI panels
│   └── ParticleBackground.tsx # Ambient floating background effect
├── constants/
│   └── theme.ts         # Centralized design tokens (colors, spacing, typography)
├── context/
│   └── GameContext.tsx  # Core game engine logic and global state
├── hooks/
│   └── useHaptics.ts    # Custom hook wrapping platform-specific haptic logic
└── screens/             # Primary application views
    ├── HomeScreen.tsx      
    ├── GameScreen.tsx      
    └── GameOverScreen.tsx  
```

---

## 🚀 Running the Project Locally

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine. 

### 2. Installation
Clone the repository and install the dependencies:
```bash
cd DareOrDrop
npm install
```

### 3. Start the Development Server
```bash
npx expo start
```

### 4. Choose your Platform
* **📱 Physical Device:** Download the **Expo Go** app on your iOS or Android device and scan the QR code displayed in your terminal. (Recommended to experience haptic feedback).
* **🌐 Web Browser:** Press `w` in the terminal to launch the web-optimized version.
* **💻 Emulators:** Press `i` for iOS Simulator (requires macOS) or `a` for Android Emulator.
