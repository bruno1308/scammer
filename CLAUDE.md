# Scammer Simulator

A dark comedy PhaserJS game where you play as a scam call center employee. Uses OpenAI's Realtime Voice API for live AI-driven phone conversations with procedurally generated victims. Satirical — the game is commentary on scam operations, not a celebration.

## Quick Start

```bash
npm install
npm start          # Runs Vite dev server (port 5173)
```

Players must enter their own OpenAI API key in the in-game Settings screen. The key is stored in `localStorage` and used directly from the browser — no backend server needed.

## Architecture

```
src/                           # Phaser 3 frontend (ES modules, Vite bundled)
  main.js                      # Phaser.Game bootstrap (1280x720, FIT scaling)
  scenes/                      # 9 Phaser scenes (see Scene Flow below)
  state/GameState.js           # Singleton game state — suspicion, compliance, money, level progress
  voice/VoiceManager.js        # Singleton WebRTC manager for OpenAI Realtime API
  config/levels.js             # Level definitions, victim pools (with portraitIdx), briefing text
  config/apiKeyManager.js      # localStorage wrapper for OpenAI API key
  config/prompts/              # AI victim prompt configs per level (moved from server/)
    index.js                   # Barrel: getPromptConfig(level, name, age, location)
    level[1-5].js              # Per-level prompt with compliance-gated behavior
  config/scoring.js            # Post-call score calculation with multipliers
  ui/                          # Reusable UI components (Meter, MoneyCounter, CallTimer, VictimCard, TutorialPopup)

public/assets/                 # Static assets served by Vite
  portraits/level[1-5]/        # Victim portrait PNGs (editorial caricature style)
  characters/                  # Boss character PNGs (boss_idle.png, boss_angry.png)
```

## Scene Flow

```
BootScene → MenuScene → SettingsScene (API key entry)
                ↓
          BriefingScene → OfficeScene ↔ CallScene → ResultsScene → BriefingScene (next level)
                                ↕                                        ↓
                        TechDesktopScene                           GameOverScene
```

- **BootScene**: Preloads all portrait/character textures
- **MenuScene**: Title screen with mic test, SETTINGS button, API key status indicator. START GAME gated behind `hasApiKey()`
- **SettingsScene**: API key entry via `window.prompt()`, masked display, clear button, privacy note
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
- **No backend needed** — uses the player's API key directly for the SDP exchange, then sends `session.update` over the data channel to configure voice, instructions, and tools
- Flow: `requestMicPermission()` → `startCall(level)` → gets API key from `apiKeyManager` → picks random victim from `levels.js` → builds prompt config from `config/prompts/` → SDP exchange with API key → data channel opens → sends `session.update` with full config
- Callbacks: `onGameStateUpdate`, `onDesktopAction`, `onCallEnd`, `onError`, `onConnected`
- `currentVictim` property stores the client-generated victim data for identity sync

## Voice API Integration

VoiceManager connects directly to OpenAI's Realtime API from the browser. Each call:
1. Gets the player's API key from `localStorage` via `apiKeyManager`
2. Picks a random victim and builds a level-specific prompt from `src/config/prompts/level[N].js`
3. Establishes WebRTC connection using the API key in the SDP exchange
4. Sends `session.update` over the data channel with voice, instructions, tools, and VAD config
5. The AI can call two function tools via the data channel:
   - `update_game_state` — adjusts suspicion/compliance/emotion values
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

Portraits use editorial caricature style (MAD Magazine-inspired: exaggerated features, ink lines, flat watercolor washes, satirical/ugly-funny). Generated via Meshy API.

Portrait counts per level: L1=5, L2=4, L3=4, L4=4, L5=3, Boss=2. Total: 22 images.

Each victim in `VICTIM_NAMES` (levels.js) has a `portraitIdx` field that maps to a specific portrait file, ensuring gender-correct portrait assignment. BootScene preloads all portraits with keys like `l1_victim_1`, `l2_victim_3`, etc.

## Deployment

The game is a fully static site deployable to GitHub Pages. No backend server needed.

- **Build**: `npm run build` (Vite outputs to `dist/`)
- **Dev server**: `npm start` or `npm run dev` (port 5173)
- **GitHub Pages**: Auto-deployed via `.github/workflows/deploy.yml` on push to `main`
- `base` path in `vite.config.js` must match the GitHub Pages URL path (e.g., `/scammer/`)
- No test framework currently set up
- No TypeScript — plain ES modules with JSDoc annotations

## Important Patterns

- Scenes communicate via `this.scene.launch()` / `this.scene.stop()` and Phaser's scene data passing
- CallScene runs as an overlay on top of OfficeScene
- Phone ring sound is procedural (Web Audio API, 440Hz + 480Hz dual-tone, 2s on / 4s off)
- Victim `portraitKey` is assigned in OfficeScene from `victim.portraitIdx` before launching CallScene
- Script panel in CallScene is a toggleable slide-out drawer on the right edge
- Portrait display uses circular Phaser geometry masks (`this.make.graphics({ add: false })`) with fallback to programmatic shapes if texture missing
- API key stored in `localStorage` under key `scammer_sim_openai_api_key`
