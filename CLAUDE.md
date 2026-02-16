# Scammer Simulator

A dark comedy PhaserJS game where you play as a scam call center employee. Uses OpenAI's Realtime Voice API for live AI-driven phone conversations with procedurally generated victims. Satirical — the game is commentary on scam operations, not a celebration.

## Quick Start

```bash
npm install
npm start          # Runs both Vite dev server (5173) and Express backend (3001) concurrently
```

Requires `.env` at project root with:
- `OPENAI_API_KEY` — for Realtime Voice API sessions
- `MESHY_API_KEY` — for regenerating art assets via Meshy text-to-image API

## Architecture

```
src/                    # Phaser 3 frontend (ES modules, Vite bundled)
  main.js               # Phaser.Game bootstrap (1280x720, FIT scaling)
  scenes/               # 8 Phaser scenes (see Scene Flow below)
  state/GameState.js    # Singleton game state — suspicion, compliance, money, level progress
  voice/VoiceManager.js # Singleton WebRTC manager for OpenAI Realtime API
  config/levels.js      # Level definitions, victim pools, briefing text
  config/scoring.js     # Post-call score calculation with multipliers
  ui/                   # Reusable UI components (Meter, MoneyCounter, CallTimer, VictimCard, TutorialPopup)

server/                 # Express backend (port 3001)
  index.js              # POST /api/session — creates ephemeral OpenAI Realtime session
  prompts/level[1-5].js # AI victim prompt configs per level with compliance-gated behavior

public/assets/          # Static assets served by Vite
  portraits/level[1-5]/ # Victim portrait PNGs (editorial caricature style)
  characters/           # Boss character PNGs (boss_idle.png, boss_angry.png)
```

## Scene Flow

```
BootScene → MenuScene → BriefingScene → OfficeScene ↔ CallScene → ResultsScene → BriefingScene (next level)
                                                  ↕                                    ↓
                                          TechDesktopScene                       GameOverScene
```

- **BootScene**: Preloads all portrait/character textures
- **MenuScene**: Title screen with mic test (VoiceManager.getMicLevel())
- **BriefingScene**: Boss dialogue + scam script before each level
- **OfficeScene**: Phone rings (Web Audio API dual-tone), player answers to start call
- **CallScene**: Overlay scene during active call — shows victim portrait, suspicion/compliance meters, call timer, money counter, script drawer tab
- **TechDesktopScene**: Level 3 mini-game with fake desktop interaction
- **ResultsScene**: Post-level score breakdown with multipliers and letter grade
- **GameOverScene**: Fired screen if quota not met

## Key Singletons

### GameState (`src/state/GameState.js`)
- Extends `Phaser.Events.EventEmitter`
- Tracks: `suspicion`, `compliance`, `moneyEarned`, `callsRemaining`, `currentLevel`
- `updateFromAI(data)` — called by VoiceManager when AI triggers `update_game_state` function
- Emits events: `suspicionChanged`, `complianceChanged`, `moneyChanged`, `callEnded`

### VoiceManager (`src/voice/VoiceManager.js`)
- Manages WebRTC connection to OpenAI Realtime API (`gpt-realtime` model)
- Flow: `requestMicPermission()` → `startCall(level)` → fetches ephemeral key from `/api/session` → SDP exchange → data channel for function calls
- Callbacks: `onGameStateUpdate`, `onDesktopAction`, `onCallEnd`, `onError`, `onConnected`
- `serverVictim` property stores victim data from server response for identity sync

## Voice API Integration

The backend (`server/index.js`) creates ephemeral sessions with level-specific prompts. Each prompt in `server/prompts/level[N].js` defines:
- AI persona and voice
- Victim personality and backstory
- **Compliance stages** — the AI's behavior is gated to compliance levels (e.g., won't agree to pay until compliance > 90)
- Two function tools the AI can call:
  - `update_game_state` — adjusts suspicion/compliance/money values
  - `tech_support_desktop_action` — triggers desktop events in Level 3

## Compliance-Gated Prompts

Every level prompt includes a COMPLIANCE STAGES section that prevents AI behavior from desyncing with game mechanics. Example from Level 1:
- 0-30: Skeptical, asks questions
- 30-50: Processing information, still uncertain
- 50-70: Starting to believe but hesitant
- 70-85: Convinced, looking for gift card
- 85-95: Found a card, reading it slowly
- 95+: Reads the full code (triggers win)

## Art Assets

Portraits use editorial caricature style (MAD Magazine-inspired: exaggerated features, ink lines, flat watercolor washes, satirical/ugly-funny). Generated via Meshy API (`/openapi/v1/text-to-image`, `ai_model: "nano-banana"`).

Portrait counts per level: L1=5, L2=4, L3=4, L4=4, L5=3, Boss=2. Total: 22 images.

BootScene preloads all portraits with keys like `l1_victim_1`, `l2_victim_3`, etc.

## Development

- **Build**: `npm run build` (Vite outputs to `dist/`)
- **Dev server**: `npm run dev` (port 5173, proxies `/api` to 3001)
- **Backend only**: `npm run server` (port 3001)
- Vite proxy config in `vite.config.js` routes `/api/*` to Express backend
- No test framework currently set up
- No TypeScript — plain ES modules with JSDoc annotations

## Important Patterns

- Scenes communicate via `this.scene.launch()` / `this.scene.stop()` and Phaser's scene data passing
- CallScene runs as an overlay on top of OfficeScene
- Phone ring sound is procedural (Web Audio API, 440Hz + 480Hz dual-tone, 2s on / 4s off)
- Victim `portraitKey` is assigned in OfficeScene before launching CallScene
- Script panel in CallScene is a toggleable slide-out drawer on the right edge
- Portrait display uses circular Phaser geometry masks with fallback to programmatic shapes if texture missing
