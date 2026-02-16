# Scammer Simulator

A dark comedy browser game where you experience the other side of a scam call center. Use your real voice to talk to AI-powered victims, manage suspicion and compliance meters, and hit your quota before the boss fires you — or the police show up.

Built with **PhaserJS** for the game engine and **OpenAI's Realtime API** for live voice-to-voice conversations with AI victims.

## How It Works

You sit at a desk in a scam call center. The phone rings. You pick it up and start talking — with your actual microphone — to an AI victim who responds in real time. Your job is to run the scam: keep suspicion low, push compliance high, and extract money before the victim catches on or hangs up.

Each level introduces a different scam type with escalating difficulty, smarter victims, and tighter quotas.

## Features

- **Real voice interaction** — speak into your mic to conduct calls with AI victims via WebRTC
- **Dynamic AI victims** — each victim has a unique personality, emotional state, and decision-making logic
- **5 progressive levels** — from gift card refunds to CEO fraud, each with distinct mechanics
- **Live meters** — suspicion and compliance update in real time based on how convincing you are
- **Fake desktop mini-game** — Level 3 includes a Windows XP-style desktop with fake error windows, antivirus scans, and payment forms
- **Multiple endings** — get fired for missing quota or arrested for attracting too much heat
- **Combo multiplier** — chain successful calls for up to 2.5x payout
- **Neon call center aesthetic** — dark theme with glowing UI, CRT scanlines, and procedural animations

## The 5 Levels

| Level | Scam Type | Difficulty | Quota | Target |
|-------|-----------|------------|-------|--------|
| 1 | Gift Card Refund | Easy (Tutorial) | $200 | Elderly victims |
| 2 | IRS Tax Scam | Medium | $400 | Middle-aged adults |
| 3 | Tech Support | Medium-Hard | $500 | Non-technical users |
| 4 | Romance Scam | Hard | $800 | Lonely individuals |
| 5 | CEO Fraud | Hardest | $2,000 | Corporate CFOs |

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Game Engine | PhaserJS 3 |
| Voice AI | OpenAI Realtime API (WebRTC) |
| Backend | Express.js |
| Build Tool | Vite |

## Getting Started

### Prerequisites

- Node.js 16+
- A microphone
- A modern browser with WebRTC support (Chrome, Firefox, Edge, Safari)
- An [OpenAI API key](https://platform.openai.com/api-keys) with access to the Realtime API

### Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/ScammerSimulator.git
   cd ScammerSimulator
   ```

2. **Create a `.env` file** in the project root

   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Start the game**

   ```bash
   npm start
   ```

   This launches both the Express backend (port 3001) and the Vite dev server (port 5173). Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server only |
| `npm run server` | Express backend only |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |

## Project Structure

```
├── src/
│   ├── main.js              # Phaser config and game init
│   ├── scenes/
│   │   ├── BootScene.js     # Asset loading
│   │   ├── MenuScene.js     # Title screen
│   │   ├── BriefingScene.js # Boss briefing before each level
│   │   ├── OfficeScene.js   # Main gameplay loop
│   │   ├── CallScene.js     # Call overlay with meters and victim info
│   │   ├── TechDesktopScene.js  # Fake Windows desktop (Level 3)
│   │   ├── ResultsScene.js  # End-of-shift scoring
│   │   └── GameOverScene.js # Fired/Arrested endings
│   ├── state/
│   │   └── GameState.js     # Singleton game state and event emitter
│   ├── ui/                  # Meter bars, timers, victim cards, tutorials
│   ├── voice/
│   │   └── VoiceManager.js  # WebRTC + OpenAI Realtime API integration
│   └── config/
│       ├── levels.js        # Level configs and victim data pools
│       └── scoring.js       # Scoring constants
├── server/
│   ├── index.js             # Express server with session endpoint
│   └── prompts/             # AI system prompts per level (level1-5.js)
├── public/assets/           # Portraits, boss sprites, office backgrounds
├── index.html               # Entry point
├── vite.config.js           # Vite config with API proxy
└── .env                     # API keys (not committed)
```

## How the AI Works

The backend mints ephemeral OpenAI session tokens and sends them to the browser. The game establishes a WebRTC connection directly to OpenAI's Realtime API — your voice goes in, the AI victim's voice comes out.

Each level has a detailed system prompt that defines the victim's personality, emotional triggers, and behavior thresholds. The AI uses function calling to update game state in real time:

- **`update_game_state`** — adjusts suspicion, compliance, emotion, and triggers events (victim hangs up, agrees to pay, threatens police, etc.)
- **`tech_support_desktop_action`** (Level 3 only) — opens fake windows on the desktop to scare the victim

## Disclaimer

This is a satirical, educational game. It exists to expose how real scam tactics work — not to teach them. If you learn something about how scammers operate, use that knowledge to protect yourself and others.
