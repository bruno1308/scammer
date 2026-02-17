# Scammer Simulator

A dark comedy PhaserJS game where you play as a trafficked scam call center worker. Uses OpenAI's Realtime Voice API for live AI-driven phone conversations with 20 unique victims across 5 floors. Papers, Please-style persistent economy. Satirical — the game is commentary on scam operations, not a celebration.

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
  scenes/                      # 11 Phaser scenes (see Scene Flow below)
  state/GameState.js           # Singleton — persistent economy, shift timer, call state, heat, intel
  state/SaveManager.js         # Multi-slot localStorage persistence (4 save slots)
  voice/VoiceManager.js        # Singleton WebRTC manager for OpenAI Realtime API
  config/levels.js             # FLOORS object — single source of truth for all progression data
  config/apiKeyManager.js      # localStorage wrapper for OpenAI API key
  config/prompts/              # AI victim prompt configs per level
    index.js                   # Barrel: getPromptConfig(level, name, age, location, intel)
    level[1-5].js              # Per-level prompt with compliance-gated behavior + intel integration
    victims/                   # Per-victim personality prompts (20 unique victims)
      index.js                 # Barrel: getVictimPersonality(victimName)
      floor[1-5].js            # Voice, filterParams, personalityBlock per victim
    pierogi_reveal.js          # Post-reveal Pierogi prompt with inverted mechanics
  config/friendbook/           # FriendBook social network data per level
    index.js                   # Barrel: getFriendBookData(level, victimName)
    level[1-5].js              # Victim profiles, posts, friends, intel keys
  ui/                          # Reusable UI components (Meter, MoneyCounter, CallTimer, VictimCard, TutorialPopup)

public/assets/                 # Static assets served by Vite
  portraits/level[1-5]/        # Victim portrait PNGs (editorial caricature style)
  characters/                  # Boss character PNGs (boss_idle.png, boss_angry.png)
```

## Scene Flow

```
BootScene → MenuScene → SettingsScene (API key entry)
                ↓
          IntroScene (first play only — trafficked worker premise)
                ↓
          BriefingScene → OfficeScene ↔ CallScene → LedgerScene → BriefingScene
                              ↕   ↕                                    ↓
                SocialNetworkScene TechDesktopScene               GameOverScene
```

- **BootScene**: Preloads all portrait/character/spritesheet/audio assets with progress bar
- **MenuScene**: Title screen with PLAY button → 4-slot save selector. Each slot shows save summary or "NEW GAME". Delete with confirmation
- **SettingsScene**: API key entry via `window.prompt()`, masked display, clear button, privacy note
- **IntroScene**: First-play cinematic establishing trafficked-worker narrative (8-line text sequence, skippable)
- **BriefingScene**: Boss dialogue + scam script before each shift. Shows floor progress, expenses, targets
- **OfficeScene**: First-person desk view. 5-minute shift clock, wallet display, phone (click to call), computer (click for FriendBook), desk clock (real-world time). Manages call lifecycle
- **CallScene**: Overlay scene during active call — victim portrait, suspicion/compliance meters, call timer, money counter, script drawer, intel panel
- **SocialNetworkScene**: FriendBook overlay — fake social network for researching victims before/during calls
- **TechDesktopScene**: Level 3 mini-game with fake desktop interaction
- **LedgerScene**: End-of-shift report — animated expense deductions, wallet balance, shortfall warnings, family remittance option, floor/game transitions
- **GameOverScene**: Five endings — sold, arrested, rescued, rescued_alone, still_trapped

## Floor/Victim Structure

5 floors with 20 total victims (5+4+4+4+3):

| Floor | Scam Type | Victims | Base Payout | Total Expenses |
|-------|-----------|---------|-------------|----------------|
| 1 | Gift Card Refund | 5 | $200 | $270 |
| 2 | IRS Tax Scam | 4 | $350 | $345 |
| 3 | Tech Support | 4 | $400 | $500 |
| 4 | Romance Scam | 4 | $800 | $655 |
| 5 | CEO Fraud | 3 | $800 | $890 |

Victims within each floor are shuffled each night. Successfully scammed victims are permanently completed. Failed victims can be re-attempted on future nights. Only one attempt per victim per night.

## Economy System

**Persistent wallet** — carries across floors, never resets. Starts at $0.

**Shift cycle**: 5-minute real-time clock. Player calls victims until time runs out or no victims remain.

**End-of-shift expenses** (mandatory, deducted from wallet):
- Bunk fee, food, debt repayment (all floors)
- Protection fee (floor 3+), equipment levy (floor 4+)

**Shortfalls**: If wallet goes negative after expenses, shortfall count increases and debt carries forward. 3 shortfalls = game over ("sold" ending).

**Heat**: Global suspicion tracker. Failed calls add +5, threatening police adds +15, earning nothing in a shift adds +20. Heat >= 80 = game over ("arrested" ending).

**Family remittance**: After each shift, player can optionally send $50/$100 home. Affects ending and family messages.

**Multiple endings**:
- `rescued` — Pierogi convinced + money sent home (best)
- `rescued_alone` — Pierogi convinced, no remittance (bittersweet)
- `still_trapped` — Finished floor 5 without convincing Pierogi
- `sold` — 3 shortfalls
- `arrested` — Heat >= 80

## Save State

`SaveManager` supports 4 save slots persisted to `localStorage` under prefix `scammer_sim_save_`:
- `currentFloor`, `completedVictims`, `attemptedTonight`
- `wallet`, `shortfallCount`, `shortfallDebt`, `totalRemittance`
- `heat`, `introSeen`, `pierogiConvinced`

Active slot tracked via `SaveManager.activeSlot`. MenuScene PLAY button opens slot selection with 2x2 grid. Auto-saves after each call and shift end.

## Key Singletons

### GameState (`src/state/GameState.js`)
- Extends `Phaser.Events.EventEmitter`
- **Persistent fields**: `wallet`, `totalRemittance`, `shortfallCount`, `shortfallDebt`, `completedVictims`, `heat`
- **Shift fields**: `shiftEarnings`, `shiftActive`, `shiftStartTime`, `shiftDurationSec`, `combo`, `currentNightVictimQueue`
- **Per-call fields**: `suspicion`, `compliance`, `emotion`, `callActive`, `currentVictim`
- Key methods: `startShift(floorNum)`, `startCall(victim)`, `endCall(reason)`, `endShift()`, `getNextVictimTonight()`, `getShiftRemainingSec()`, `sendRemittance(amount)`
- Emits: `suspicion_change`, `compliance_change`, `emotion_change`, `call_end`, `shift_end`, `money_change`, `heat_change`, `no_victims_tonight`, `intel_seen`, `intel_used`

### VoiceManager (`src/voice/VoiceManager.js`)
- Manages WebRTC connection to OpenAI Realtime API (`gpt-realtime` model)
- **No backend needed** — uses the player's API key directly for the SDP exchange
- Flow: `requestMicPermission()` → `startCall(level, victim)` → builds prompt with personality → SDP exchange → data channel → `session.update`
- Per-victim voice differentiation: 5 OpenAI voices (alloy, echo, nova, onyx, shimmer) + parameterized telephone filter (bandpass, compression)
- `switchSession(level, config)` / `startCallWithConfig(level, config)` for mid-call Pierogi reveal
- Callbacks: `onGameStateUpdate`, `onDesktopAction`, `onCallEnd`, `onError`, `onConnected`

## Per-Victim Personalities

Each of the 20 victims has unique:
- **Voice**: One of 5 OpenAI voices (alloy, echo, nova, onyx, shimmer)
- **Filter params**: Telephone post-processing (bandpass frequency, Q, compression)
- **Personality block**: Unique speech patterns, vocabulary, backstory injected into the AI prompt

Defined in `src/config/prompts/victims/floor[1-5].js`. The barrel at `victims/index.js` exports `getVictimPersonality(name)` which is called by `getPromptConfig()` to inject per-victim behavior.

## Level 5 Pierogi Mechanic

Amanda Price (Floor 5 victim) is actually Pierogi the scambaiter in disguise.
- Pre-reveal: Plays as normal CFO victim using `nova` voice
- Reveal trigger: `pierogi_reveal` game event (not terminal — call continues)
- Post-reveal: WebRTC session reconnects with new voice (`echo`) and inverted prompt from `pierogi_reveal.js`
- Inverted mechanics: suspicion starts at 70, compliance at 10. Player must convince Pierogi to help them escape

## Voice API Integration

VoiceManager connects directly to OpenAI's Realtime API from the browser. Each call:
1. Gets the player's API key from `localStorage` via `apiKeyManager`
2. Receives victim data from OfficeScene (from floor's victim queue)
3. Builds a level-specific prompt from `config/prompts/level[N].js` with per-victim personality injected
4. Establishes WebRTC connection using the API key in the SDP exchange
5. Sends `session.update` over the data channel with voice, instructions, tools, and VAD config
6. The AI can call two function tools via the data channel:
   - `update_game_state` — adjusts suspicion/compliance/emotion values. Includes `intel_triggered` field (string|null) to mark when the player successfully uses gathered intel in conversation
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

Each victim in FLOORS[n].victims has a `portraitIdx` field that maps to a specific portrait file. BootScene preloads all portraits with keys like `l1_victim_1`, `l2_victim_3`, etc.

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
- `FLOORS` object in `levels.js` is the single source of truth for all progression data
- Victim queue is built per-night by `gameState.startShift()` — shuffled remaining victims
- OfficeScene shift timer ticks every second, turns red under 60s, auto-ends shift when time expires (current call finishes first)
- LedgerScene animates expense deductions one-at-a-time before showing wallet balance and transition options
- Portrait display uses circular Phaser geometry masks with fallback to programmatic shapes
- API key stored in `localStorage` under key `scammer_sim_openai_api_key`
- Game saves stored in `localStorage` under prefix `scammer_sim_save_` (4 slots)
- FriendBook data lives in `src/config/friendbook/level[N].js` — difficulty progresses from obvious clues (L1) to cross-referencing multiple profiles (L5)
- Intel gathered in FriendBook is injected into the AI prompt via `getPromptConfig()`, allowing victims to reference their social media posts
