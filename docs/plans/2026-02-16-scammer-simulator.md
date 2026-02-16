# Scammer Simulator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a 5-level PhaserJS dark comedy game where players voice-scam AI victims using OpenAI Realtime API.

**Architecture:** Vite + PhaserJS frontend with WebRTC voice integration. Minimal Express.js backend for ephemeral OpenAI keys. Game state driven by AI function calls through WebRTC data channel. Art assets generated via Meshy API.

**Tech Stack:** PhaserJS 3, Vite, Express.js, OpenAI Realtime API (WebRTC), Meshy API

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.js`

**Step 1: Initialize Vite + Phaser project**
```bash
cd B:/Projects/ScammerSimmulator
npm init -y
npm install phaser vite
npm install express cors dotenv
```

**Step 2: Create Vite config, index.html, main.js entry point with Phaser game config**

**Step 3: Verify dev server starts**
```bash
npm run dev
```

---

### Task 2: Core Game State & Voice Manager

**Files:**
- Create: `src/state/GameState.js`, `src/voice/VoiceManager.js`

**Step 1:** Build GameState singleton (suspicion, compliance, money, heat, level, call state)
**Step 2:** Build VoiceManager class (WebRTC to OpenAI, mic handling, function call event dispatching)
**Step 3:** Verify VoiceManager connects and receives audio

---

### Task 3: Ephemeral Key Server

**Files:**
- Create: `server/index.js`, `server/prompts/level1.js` through `level5.js`

**Step 1:** Build Express server with POST /api/session endpoint
**Step 2:** Write all 5 level system prompts with function calling tools
**Step 3:** Verify server returns ephemeral keys

---

### Task 4: Boot, Menu, and Scene Infrastructure

**Files:**
- Create: `src/scenes/BootScene.js`, `src/scenes/MenuScene.js`, `src/scenes/BriefingScene.js`, `src/scenes/OfficeScene.js`, `src/scenes/CallScene.js`, `src/scenes/ResultsScene.js`, `src/scenes/GameOverScene.js`, `src/scenes/TechDesktopScene.js`

**Step 1:** Build BootScene with asset loading
**Step 2:** Build MenuScene with start button + mic permission
**Step 3:** Build all scene shells with transitions

---

### Task 5: UI Components

**Files:**
- Create: `src/ui/Meter.js`, `src/ui/MoneyCounter.js`, `src/ui/CallTimer.js`, `src/ui/VictimCard.js`, `src/ui/TutorialPopup.js`

**Step 1:** Build reusable Meter (animated fill bar with tweens)
**Step 2:** Build MoneyCounter, CallTimer, VictimCard, TutorialPopup
**Step 3:** Wire UI to GameState events

---

### Task 6: Art Asset Generation (Parallel)

**Using:** meshy-text-to-image skill

Generate all assets in batch:
- Office background, desk items (phone, monitor, notebook, coffee)
- Boss sprites (idle, angry, walking)
- UI elements (meter frames, buttons, card backgrounds)
- Victim portraits (3-5 per level = 15-25 portraits)
- Fake desktop assets for Level 3
- Level-specific backgrounds

---

### Task 7: OfficeScene + CallScene Full Implementation

**Step 1:** Build OfficeScene with desk, phone, monitor, background elements
**Step 2:** Build CallScene overlay with meters, hang-up button, victim card
**Step 3:** Wire phone click -> WebRTC call -> AI speaks -> meters update -> call ends
**Step 4:** Implement all call end conditions

---

### Task 8: Level Configuration & Scoring

**Files:**
- Create: `src/config/levels.js`, `src/config/scoring.js`

**Step 1:** Define level configs (quota, calls per shift, difficulty params)
**Step 2:** Implement scoring formulas (money, speed bonus, suspicion bonus, combo)
**Step 3:** Build ResultsScene with score breakdown

---

### Task 9: BriefingScene + Level Flow

**Step 1:** Build BriefingScene with boss dialogue and scam script display
**Step 2:** Implement shift structure (briefing -> 3-5 calls -> results)
**Step 3:** Implement quota tracking and game over conditions

---

### Task 10: Level 3 Tech Desktop Scene

**Files:**
- Create/Modify: `src/scenes/TechDesktopScene.js`

**Step 1:** Build fake Windows desktop with taskbar and icons
**Step 2:** Build each window type as Phaser container (Event Viewer, CMD, antivirus, payment form, browser)
**Step 3:** Wire tech_support_desktop_action function calls to visual changes
**Step 4:** Implement window open/close animations with tweens

---

### Task 11: Level 4 Romance Scam UI

**Step 1:** Build dating app / messaging interface variant for monitor
**Step 2:** Create fake message history display
**Step 3:** Wire to Level 4 system prompt

---

### Task 12: Full Game Polish

**Step 1:** Add sound effects (phone ring, hang-up, ambient office)
**Step 2:** Add boss character walking animation
**Step 3:** Add coworker background animations
**Step 4:** Implement game over scenes (fired, arrested)
**Step 5:** Add ending sequence for completing all 5 levels
**Step 6:** Final prompt tuning pass

---

### Task 13: Final Integration & Testing

**Step 1:** Test full game flow Levels 1-5
**Step 2:** Fix any integration issues
**Step 3:** Verify `npm install && npm run dev` works cleanly
**Step 4:** Verify voice calls work end-to-end
