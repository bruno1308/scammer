# Papers, Please Economy System — Full Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current quota-based pass/fail progression with a Papers, Please-style persistent economy: chapter/victim progression with localStorage persistence, real-time 5-minute shift clock, daily expenses, family remittance, 20 unique per-victim personalities, and a Pierogi scambaiter final level with mid-call voice reveal.

**Architecture:** The game is restructured around *chapters* (scam types) containing multiple *victims* (individual calls). GameState becomes the persistent economy engine with localStorage save/load. OfficeScene gets a 5-minute wall clock. ResultsScene is replaced by LedgerScene. Each of the 20 victims gets a unique AI personality prompt and voice configuration. Level 5 includes a Pierogi twist with mid-call WebRTC reconnection.

**Tech Stack:** PhaserJS 3, ES modules, OpenAI Realtime API (WebRTC), Vite, localStorage

---

## Task 1: Save State System

Create a localStorage persistence layer. Everything else builds on this.

**Files:**
- Create: `src/state/SaveManager.js`

**Step 1: Create `src/state/SaveManager.js`**

Singleton that reads/writes game progress to localStorage under key `scammer_sim_save`.

```js
const SAVE_KEY = 'scammer_sim_save';

const DEFAULT_SAVE = {
  // Progress
  currentChapter: 1,             // 1-5
  completedVictims: {},          // { "Dorothy Miller": true, "Harold Patterson": true, ... }
  attemptedTonight: [],          // victim names attempted this shift (reset each shift)

  // Economy
  wallet: 0,
  shortfallCount: 0,
  shortfallDebt: 0,
  totalRemittance: 0,
  heat: 0,

  // Flags
  introSeen: false,              // boss intro played?
  pierogiConvinced: false,       // did player convince Pierogi?

  // Per-shift (not persisted across browser close, but kept for mid-session)
  shiftEarnings: 0,
};

class SaveManager {
  static load() { ... }          // Parse from localStorage, merge with defaults
  static save(state) { ... }     // Serialize to localStorage
  static reset() { ... }         // Clear save, return defaults
  static exists() { ... }        // Check if save exists

  // Helpers
  static markVictimCompleted(name) { ... }
  static isVictimCompleted(name) { ... }
  static getChapterProgress(chapter) { ... }  // { total, completed, remaining[] }
  static markAttemptedTonight(name) { ... }
  static isAttemptedTonight(name) { ... }
  static resetTonightAttempts() { ... }
}
```

**Step 2: Commit**
```
feat(save): add SaveManager with localStorage persistence
```

---

## Task 2: Consolidate Level Config Into Chapter/Victim Structure

Merge the two conflicting level configs into a single source of truth. Restructure around chapters containing victims.

**Files:**
- Modify: `src/config/levels.js` — merge all config, add chapter structure and expenses
- Modify: `src/state/GameState.js` — remove local LEVEL_CONFIG, import from levels.js
- Modify: `src/scenes/ResultsScene.js` — update imports (will be replaced later)
- Modify: `src/scenes/BriefingScene.js` — update imports
- Modify: `src/scenes/OfficeScene.js` — update imports

**Step 1: Restructure `src/config/levels.js`**

Replace the dual LEVELS/VICTIM_NAMES structure with a unified CHAPTERS object:

```js
export const CHAPTERS = {
  1: {
    name: 'Gift Card Refund',
    subtitle: 'Tutorial',
    scamType: 'gift_card',

    // Shift config
    shiftDurationSec: 300,    // 5 minutes, constant all chapters
    basePayout: 200,
    suspicionStart: 15,
    complianceStart: 30,

    // Expenses
    expenses: {
      bunkFee: 80,
      food: 40,
      debtRepayment: 150,
      protectionFee: 0,
      equipmentLevy: 0,
    },

    // Briefing
    briefing: { title: 'YOUR FIRST DAY', bossDialogue: [...], scriptNotes: [...] },

    // Victims (ordered by portraitIdx for consistency, randomized at runtime)
    victims: [
      { name: 'Dorothy Miller', age: 72, location: 'Des Moines, Iowa', portraitIdx: 1, gender: 'female' },
      { name: 'Harold Patterson', age: 78, location: 'Tucson, Arizona', portraitIdx: 2, gender: 'male' },
      { name: 'Betty Nakamura', age: 69, location: 'Portland, Oregon', portraitIdx: 3, gender: 'female' },
      { name: 'Earl Washington', age: 74, location: 'Atlanta, Georgia', portraitIdx: 4, gender: 'male' },
      { name: "Margaret O'Brien", age: 81, location: 'Boston, Massachusetts', portraitIdx: 5, gender: 'female' },
    ],
  },
  // ... chapters 2-5 with same structure
};

export const TOTAL_CHAPTERS = 5;

// Helper functions
export function getChapter(num) { return CHAPTERS[num] || null; }
export function getTotalExpenses(chapterNum) { /* sum all expense values */ }
export function getChapterVictims(chapterNum) { return CHAPTERS[chapterNum]?.victims || []; }
export function getRemainingVictims(chapterNum, completedSet) { /* filter out completed */ }
export function getTonightVictims(chapterNum, completedSet, attemptedSet) { /* remaining minus attempted */ }
```

Keep SCORING constants here too (moved from GameState.js):
```js
export const SCORING = {
  speedBonusThresholdSec: 120,
  speedBonusMultiplier: 1.5,
  lowSuspicionThreshold: 50,
  lowSuspicionBonus: 150,
  cleanExitBonus: 200,
  comboMultiplierStep: 0.25,
  maxComboMultiplier: 2.5,
};
```

**Step 2: Update GameState.js**

- Remove local `LEVEL_CONFIG` and `SCORING`
- Import `CHAPTERS, SCORING` from `../config/levels.js`
- Replace all `LEVEL_CONFIG[x]` → `CHAPTERS[x]`
- Remove `quota`, `callsTotal`, `callsCompleted`
- Add persistent economy fields (see Task 3)
- Keep exporting `VALID_EMOTIONS`, `TERMINAL_EVENTS`

**Step 3: Update scene imports**

All scenes that imported `LEVEL_CONFIG` from GameState now import `CHAPTERS` from levels.js.

**Step 4: Commit**
```
feat(config): consolidate level config into chapter/victim structure
```

---

## Task 3: Overhaul GameState for Persistent Economy

Replace the per-level money reset with a persistent wallet. Add shift timer, expense tracking, chapter progression, and remittance.

**Files:**
- Modify: `src/state/GameState.js`

**Step 1: Replace state fields**

Remove:
- `money`, `quota`, `callsCompleted`, `callsTotal`

Add:
```js
// ---- Persistent economy (survives across chapters, saved to localStorage) ----
this.wallet = 0;
this.totalRemittance = 0;
this.shortfallCount = 0;
this.shortfallDebt = 0;

// ---- Chapter/victim tracking ----
this.currentChapter = 1;
this.completedVictims = {};     // { "Dorothy Miller": true }
this.attemptedTonight = [];     // names attempted this shift
this.currentNightVictimQueue = []; // shuffled queue for tonight

// ---- Shift timer ----
this.shiftEarnings = 0;
this.shiftActive = false;
this.shiftStartTime = null;
this.shiftDurationSec = 300;

// ---- Endings ----
this.pierogiConvinced = false;
this.introSeen = false;
```

**Step 2: Update `startLevel()` → `startShift(chapterNum)`**

```js
startShift(chapterNum) {
  const chapter = CHAPTERS[chapterNum];
  this.currentChapter = chapterNum;
  this.shiftEarnings = 0;
  this.shiftDurationSec = chapter.shiftDurationSec;
  this.shiftActive = true;
  this.shiftStartTime = Date.now();
  this.combo = 0;
  this.shiftResults = [];
  this.attemptedTonight = [];

  // Build tonight's victim queue: remaining victims, shuffled
  const remaining = getRemainingVictims(chapterNum, this.completedVictims);
  this.currentNightVictimQueue = Phaser.Utils.Array.Shuffle([...remaining]);

  // Per-call values (baseline for UI)
  this.suspicion = chapter.suspicionStart;
  this.compliance = chapter.complianceStart;
  this.emotion = 'calm';
  this.callActive = false;
  this.currentVictim = null;
}
```

**Step 3: Update `endCall()`**

On success:
- Add score to `shiftEarnings` and `wallet`
- Mark victim as completed: `this.completedVictims[victim.name] = true`
- Save to localStorage via SaveManager

On failure:
- Victim NOT marked completed (goes back in pool for next night)

After call ends (success or failure):
- Add victim to `attemptedTonight`
- Check if any victims remain for tonight: `getTonightVictims()` using completedVictims + attemptedTonight
- If no victims remain tonight, emit `'no_victims_tonight'` (OfficeScene will trigger shift end)

Remove the `callsCompleted >= callsTotal` auto-end logic.

**Step 4: Update `endShift()`**

```js
endShift() {
  this.shiftActive = false;
  const chapter = CHAPTERS[this.currentChapter];
  const expenses = getTotalExpenses(this.currentChapter);

  // Deduct shortfall debt from previous shifts
  if (this.shortfallDebt > 0) {
    const debtPayment = Math.min(this.shiftEarnings, this.shortfallDebt);
    this.wallet -= debtPayment;
    this.shortfallDebt -= debtPayment;
  }

  // Deduct expenses
  this.wallet -= expenses;

  // Check shortfall
  let shortfall = 0;
  if (this.wallet < 0) {
    shortfall = Math.abs(this.wallet);
    this.shortfallDebt += shortfall;
    this.wallet = 0;
    this.shortfallCount += 1;
  }

  // Determine if chapter is complete
  const chapterComplete = getRemainingVictims(this.currentChapter, this.completedVictims).length === 0;

  // Save state
  SaveManager.save(this.getSerializableState());

  this.emit('shift_end', {
    shiftEarnings: this.shiftEarnings,
    expenses,
    expenseBreakdown: chapter.expenses,
    wallet: this.wallet,
    shortfall,
    shortfallCount: this.shortfallCount,
    chapterComplete,
    shiftResults: [...this.shiftResults],
  });
}
```

**Step 5: Add shift timer helpers**

```js
getShiftRemainingSec() {
  if (!this.shiftStartTime) return this.shiftDurationSec;
  const elapsed = (Date.now() - this.shiftStartTime) / 1000;
  return Math.max(0, this.shiftDurationSec - elapsed);
}

isShiftTimeUp() {
  return this.shiftActive && this.getShiftRemainingSec() <= 0;
}

getNextVictimTonight() {
  // Returns next victim from shuffled queue that hasn't been attempted tonight
  return this.currentNightVictimQueue.find(v =>
    !this.attemptedTonight.includes(v.name) && !this.completedVictims[v.name]
  ) || null;
}
```

**Step 6: Add remittance**

```js
sendRemittance(amount) {
  if (amount > this.wallet) return false;
  this.wallet -= amount;
  this.totalRemittance += amount;
  this.emit('remittance_sent', { amount, total: this.totalRemittance });
  SaveManager.save(this.getSerializableState());
  return true;
}
```

**Step 7: Add save/load integration**

```js
getSerializableState() {
  return {
    currentChapter: this.currentChapter,
    completedVictims: { ...this.completedVictims },
    wallet: this.wallet,
    shortfallCount: this.shortfallCount,
    shortfallDebt: this.shortfallDebt,
    totalRemittance: this.totalRemittance,
    heat: this.heat,
    introSeen: this.introSeen,
    pierogiConvinced: this.pierogiConvinced,
  };
}

loadFromSave(save) {
  Object.assign(this, save);
  this.completedVictims = { ...save.completedVictims };
}
```

**Step 8: Commit**
```
feat(economy): overhaul GameState for persistent wallet, chapter progression, shift timer
```

---

## Task 4: Per-Victim Personality Prompts

Create unique personality prompts for all 20 victims. Each victim gets distinct speech patterns, emotional triggers, objections, and voice assignment.

**Files:**
- Create: `src/config/prompts/victims/chapter1.js` — 5 victim personalities
- Create: `src/config/prompts/victims/chapter2.js` — 4 victim personalities
- Create: `src/config/prompts/victims/chapter3.js` — 4 victim personalities
- Create: `src/config/prompts/victims/chapter4.js` — 4 victim personalities
- Create: `src/config/prompts/victims/chapter5.js` — 3 victim personalities (including Pierogi pre-reveal)
- Create: `src/config/prompts/victims/index.js` — barrel export + lookup
- Modify: `src/config/prompts/index.js` — use per-victim prompts when available

**Step 1: Design victim personality matrix**

Each victim definition exports: `{ personalityBlock, voice, filterParams }`

Chapter 1 — Gift Card Refund (elderly victims):
| Victim | Voice | Personality | Key Differentiator |
|--------|-------|-------------|--------------------|
| Dorothy Miller (72, Iowa) | alloy | Gentle Midwesterner, says "oh dear" and "hon", talks about gardening, very trusting | Easiest — almost too willing. Tutorial victim. |
| Harold Patterson (78, Arizona) | onyx | Gruff retired vet, says "son" and "listen here", skeptical but fair, respects authority | More resistant initially, responds to official tone |
| Betty Nakamura (69, Oregon) | shimmer | Warm, slightly anxious, apologizes constantly, husband Ken hovering nearby | Asks "should I check with Ken?" — timer pressure |
| Earl Washington (74, Atlanta) | echo | Southern gentleman deacon, dignified, says "young man/woman", slow-burning trust | Religious guilt angle works; impatience backfires badly |
| Margaret O'Brien (81, Boston) | nova | Sharp-tongued Bostonian, feisty, says "listen pal", not easily pushed, swears mildly | Hardest Ch1 victim — requires patience and charm |

Chapter 2 — IRS Tax Scam (middle-aged):
| Victim | Voice | Personality |
|--------|-------|-------------|
| David Chen (42, Sacramento) | echo | Stressed project manager, analytical, asks for specifics, wife is a CPA |
| Maria Gonzalez (38, Houston) | nova | Fiery, challenges authority, knows her rights, hard to intimidate |
| James Wilson (45, Chicago) | onyx | Anxious, already worried about money, susceptible to fear tactics |
| Priya Patel (41, Edison NJ) | shimmer | Polite but methodical, asks for badge numbers and case IDs |

Chapter 3 — Tech Support (mixed ages):
| Victim | Voice | Personality |
|--------|-------|-------------|
| Karen Thompson (35, Denver) | nova | Impatient millennial, googles things mid-call, sarcastic |
| Mike Rodriguez (48, Phoenix) | echo | Blue collar, embarrassed by tech ignorance, defensive about it |
| Susan Lee (52, Seattle) | alloy | Former tech worker, retired early, catches technical BS |
| Tom Anderson (44, Minneapolis) | onyx | Nice guy, overly helpful, opens everything you tell him to |

Chapter 4 — Romance Scam (lonely adults):
| Victim | Voice | Personality |
|--------|-------|-------------|
| Linda Foster (56, Nashville) | nova | Warm, hopeful, recently divorced, wants to believe in love |
| Robert Kim (48, San Diego) | echo | Reserved, emotionally guarded, opens up slowly then falls hard |
| Patricia Martinez (62, Albuquerque) | shimmer | Romantic, poetic, has been catfished before (heightened radar) |
| William Brooks (53, Charlotte) | onyx | Businessman, logical about love, but lonely underneath |

Chapter 5 — CEO Fraud:
| Victim | Voice | Personality |
|--------|-------|-------------|
| Sarah Mitchell, CFO (39, NYC) | alloy | Sharp, efficient, curt. Hard to fool. Current L5 prompt personality. |
| Jennifer Walsh, CFO (44, SF) | shimmer | Warmer but detail-oriented. Will call you out on inconsistencies gently. |
| Amanda Price, CFO (41, Boston) | nova | This is actually Pierogi in disguise. Starts as a nervous new CFO, then reveals. |

**Step 2: Create per-victim prompt files**

Each file exports a map of victim names to personality configs:

```js
// src/config/prompts/victims/chapter1.js
export const CHAPTER1_VICTIMS = {
  'Dorothy Miller': {
    voice: 'alloy',
    filterParams: { highpass: 400, lowpass: 2800, midGain: 5, compression: 8 }, // landline
    personalityBlock: `
PERSONALITY — DOROTHY MILLER:
- Gentle Midwestern grandmother. Warm, trusting, a little lonely.
- Speech: Slow, soft. Says "oh dear", "well now", "isn't that something", "hon".
- Often mentions her garden, her granddaughter Emma, her late husband Harold.
- Goes on small tangents: "That reminds me of when Harold..." then catches herself.
- Very trusting of authority. If you say you're from Amazon, she believes you.
- Gets flustered by technical terms: "Is that like the Google?"
- Emotional hook: guilt about receiving too much money. She's honest to a fault.
- Biggest vulnerability: loneliness. Being patient and kind with her is the fastest path.
- Biggest resistance: if you're rude or rush her, she gets quiet and sad, not angry.
`,
  },
  'Harold Patterson': {
    voice: 'onyx',
    filterParams: { highpass: 350, lowpass: 3000, midGain: 4, compression: 6 }, // old phone
    personalityBlock: `
PERSONALITY — HAROLD PATTERSON:
- Gruff retired veteran and postal worker. Tough exterior, soft heart.
- Speech: Clipped, direct. Says "son", "listen here", "now hold on a minute", "that right?"
- Doesn't suffer fools. If you sound unsure, he'll call you on it.
- Respects authority and official processes. Badge numbers and case IDs impress him.
- Mentions his late wife Ruth, his grandson Tyler, fishing trips.
- Gets irritated by scripts: "You sound like you're reading from a card, son."
- Emotional hook: he's lonely since Ruth died and appreciates genuine conversation.
- Biggest vulnerability: if you sound like a competent official, he defers.
- Biggest resistance: any hint of scam and he shuts down fast. "I wasn't born yesterday."
`,
  },
  // ... Betty, Earl, Margaret with similar detail
};
```

**Step 3: Create barrel export**

```js
// src/config/prompts/victims/index.js
import { CHAPTER1_VICTIMS } from './chapter1.js';
import { CHAPTER2_VICTIMS } from './chapter2.js';
// ...
const ALL_VICTIMS = { ...CHAPTER1_VICTIMS, ...CHAPTER2_VICTIMS, ... };

export function getVictimPersonality(victimName) {
  return ALL_VICTIMS[victimName] || null;
}
```

**Step 4: Integrate with prompt system**

Modify `src/config/prompts/level[1-5].js` — each `getPromptConfig()` function now:
1. Looks up victim personality via `getVictimPersonality(victimName)`
2. Injects the `personalityBlock` into the prompt, replacing the generic personality section
3. Returns the victim-specific `voice` instead of generic gender-based voice
4. Returns `filterParams` for VoiceManager to use

```js
// In getPromptConfig():
const victimData = getVictimPersonality(victimName);
const personality = victimData?.personalityBlock || DEFAULT_PERSONALITY;
// ... inject personality into instructions string
return {
  instructions,
  tools: [UPDATE_GAME_STATE_TOOL],
  voice: victimData?.voice || (victimGender === "male" ? "echo" : "alloy"),
  filterParams: victimData?.filterParams || null,
};
```

**Step 5: Commit**
```
feat(prompts): add 20 unique per-victim personality prompts with voice assignments
```

---

## Task 5: Voice Post-Processing Per Victim

Parameterize the telephone filter in VoiceManager so each victim sounds different.

**Files:**
- Modify: `src/voice/VoiceManager.js`

**Step 1: Parameterize `_applyTelephoneFilter()`**

Change signature to accept filter params:

```js
_applyTelephoneFilter(stream, filterParams = null) {
  const params = filterParams || {
    highpass: 300, lowpass: 3400, midFreq: 1200, midGain: 4, midQ: 1.0,
    compThreshold: -30, compRatio: 6,
  };
  // ... use params instead of hardcoded values
}
```

Default presets:
```js
const FILTER_PRESETS = {
  landline_elderly:  { highpass: 400, lowpass: 2800, midFreq: 1200, midGain: 5, compRatio: 8 },
  landline_standard: { highpass: 350, lowpass: 3000, midFreq: 1200, midGain: 4, compRatio: 6 },
  cell_modern:       { highpass: 200, lowpass: 3800, midFreq: 1400, midGain: 2, compRatio: 4 },
  cell_speakerphone: { highpass: 250, lowpass: 3500, midFreq: 1000, midGain: 3, compRatio: 5 },
  office_phone:      { highpass: 300, lowpass: 3400, midFreq: 1200, midGain: 4, compRatio: 6 },
};
```

**Step 2: Pass filter params through `startCall()`**

The prompt config now returns `filterParams`. Pass them to `_applyTelephoneFilter()`:

```js
// In startCall(), after SDP exchange:
this.pc.ontrack = (event) => {
  if (event.streams && event.streams[0]) {
    this.audioEl.srcObject = event.streams[0];
    this.audioEl.muted = true;
    this._applyTelephoneFilter(event.streams[0], config.filterParams);
  }
};
```

**Step 3: Commit**
```
feat(voice): parameterize telephone filter for per-victim audio differentiation
```

---

## Task 6: Boss Intro Scene

New scene shown once on first play. Sets up the compound/trafficking narrative.

**Files:**
- Create: `src/scenes/IntroScene.js`
- Modify: `src/main.js` — register IntroScene
- Modify: `src/scenes/MenuScene.js` — route to IntroScene on first play

**Step 1: Create `src/scenes/IntroScene.js`**

Scene key: `'intro'`

Cinematic text sequence (click/space to advance):
```
[Black screen]
"You answered a job ad online."

"Customer service representative. $3,000/month. Free housing."

"The flight was paid for. The contract looked real."

[Dim room fades in]
"When you landed, they took your passport."

"'Travel and processing fees,' they said. '$2,000.'"

"'The only way to pay it off is to work the phones.'"

[Boss figure appears]
"This is your desk. This is your phone."

"The clock starts now."

[Transition to BriefingScene level 1]
```

- Dark, minimal. Text only (maybe a dim background).
- Each line fades in on click/space.
- After the last line, set `gameState.introSeen = true`, save, transition to BriefingScene.
- Skippable with a "SKIP >>" button in the corner.

**Step 2: Update MenuScene**

On "START GAME" click:
- Load save via SaveManager
- If `!save.introSeen`: start IntroScene
- If `save.introSeen` and save exists: show "CONTINUE" button (resume from save) and "NEW GAME" button
- "NEW GAME" clears save and starts IntroScene
- "CONTINUE" starts BriefingScene for `save.currentChapter`

**Step 3: Register in `main.js`**

Add IntroScene to scene array.

**Step 4: Commit**
```
feat(intro): add IntroScene with compound arrival narrative
```

---

## Task 7: Update BriefingScene for Compound Narrative

Update boss dialogue, show debt/expense info, show chapter progress.

**Files:**
- Modify: `src/scenes/BriefingScene.js`

**Step 1: Replace `BOSS_DIALOGUE` with compound-narrative versions**

Level 1:
```js
[
  '"Welcome to your new home, fresh meat."',
  '"You owe us two thousand dollars for your travel expenses."',
  '"The only way you pay that off is by working the phones."',
  '"Today is simple. Gift card refund scam. Follow the script."',
  '"The clock starts when you sit down. Make every minute count."',
  '"And don\'t even think about running. There\'s nowhere to go."',
]
```

Level 2:
```js
[
  '"Not bad. You survived your first chapter."',
  '"Your debt has been restructured. You owe more now."',
  '"Today: IRS Tax Scam. Scare them. Make them pay."',
  '"These marks are tougher. Watch your suspicion meter."',
  '"Oh, and your bunk fee went up. Welcome to the corner suite."',
]
```

Level 3:
```js
[
  '"New expense today. Protection fee."',
  '"Cops have been sniffing around. Everyone chips in."',
  '"Today: Tech Support. You\'re Microsoft. Sound helpful."',
  '"Show them scary errors, sell the protection plan."',
  '"And no, the protection fee is NOT optional."',
]
```

Level 4:
```js
[
  '"This one\'s different. Romance scam."',
  '"You\'re pretending to be someone they love."',
  '"Build the connection. Make them feel special. Then ask for money."',
  '"Big payouts here. You might make a dent in your debt."',
  '"...I said MIGHT."',
]
```

Level 5:
```js
[
  '"Last chapter. CEO Fraud. The big leagues."',
  '"You\'re impersonating corporate executives."',
  '"Sound important. Sound impatient. These people are smart."',
  '"Nail this and... well, you\'ll see."',
  '"Get on the phone."',
]
```

**Step 2: Add chapter progress and debt display**

After level title, show:
```
CHAPTER 1: GIFT CARD REFUND
Victims: 2/5 complete  |  Debt: $2,000  |  Shortfalls: 0/3
Tonight's shift: 5:00  |  Base pay: $200/call  |  Expenses: $270
```

Pull from GameState/SaveManager.

**Step 3: Show remaining victim count**

"You have X targets tonight." — number of un-attempted, un-completed victims in this chapter.

**Step 4: Commit**
```
feat(briefing): update for compound narrative with chapter progress and debt display
```

---

## Task 8: OfficeScene — Wall Clock and Time-Based Shifts

Replace call counts with a 5-minute real-time shift clock. Add animated wall clock. Manage victim queue.

**Files:**
- Modify: `src/scenes/OfficeScene.js`

**Step 1: Add wall clock**

New method `_drawWallClock(width, height)`:
- Position: `(width * 0.15, height * 0.18)` on the back wall
- Circular clock face: dark frame, cream face, 12 tick marks
- Minute hand: rotates based on shift remaining time (full sweep = 5 minutes)
- Depth: 3 (behind desk, above wall)
- Updated every 100ms via time event

**Step 2: Repurpose shift timer**

The existing `callTimerContainer` becomes the shift countdown, always visible:
- Shows `"4:32"` format
- Starts counting from `gameState.shiftDurationSec` downward
- Color changes: white normally, yellow at 60s, red at 30s

Audio cues (Web Audio API):
- 60s left: 220Hz tone, 200ms
- 30s left: two 220Hz tones
- 10s left: rapid ticking (click every 500ms)
- 0s: bell (440Hz + 880Hz, 500ms), flash "SHIFT OVER" text

**Step 3: Implement shift time management**

New `_onShiftTimeUp()`:
- `this.shiftEnded = true`
- If call active: set `this.endShiftAfterCall = true` (current call finishes naturally)
- If no call: call `gameState.endShift()` directly

**Step 4: Victim queue management**

Replace `getRandomVictim()` with queue-based victim selection:

`_getNextVictim()`:
- Returns `gameState.getNextVictimTonight()`
- If null (no victims left): trigger shift end immediately

Update `_setPhoneReady()`:
- Check `!this.shiftEnded`
- Check `gameState.getNextVictimTonight() !== null`
- If no victims available: show "NO MORE TARGETS TONIGHT" and end shift

Update `_answerPhone()`:
- Use victim from queue (not random)
- Mark victim as attempted tonight: `gameState.attemptedTonight.push(victim.name)`

**Step 5: Update `_onCallEnd()`**

After existing logic:
- If `this.endShiftAfterCall`: call `gameState.endShift()` after delay
- Else if no more victims tonight: call `gameState.endShift()` after delay
- Else: set phone ready for next victim

**Step 6: Handle `no_victims_tonight` event**

Listen for `gameState.on('no_victims_tonight')` → end shift.

**Step 7: Remove call count UI**

- Change `callCountText` to show: `"TARGETS: X remaining tonight"`
- Remove references to `callsTotal`, `callsCompleted`
- Update monitor text to show shift time remaining

**Step 8: Update `_onShiftEnd()`**

Navigate to `'ledger'` instead of `'results'`:
```js
this.scene.start('ledger', {
  chapter: this.chapterNum,
  shiftEarnings: gameState.shiftEarnings,
  ...
});
```

**Step 9: Commit**
```
feat(office): add wall clock, time-based shifts, victim queue management
```

---

## Task 9: Create LedgerScene

New scene replacing ResultsScene. Shows shift earnings, expense deductions, wallet balance, family remittance, and handles transitions.

**Files:**
- Create: `src/scenes/LedgerScene.js`
- Modify: `src/main.js` — register LedgerScene

**Step 1: Create `src/scenes/LedgerScene.js`**

Scene key: `'ledger'`

`init(data)`:
- `this.chapterNum`, `this.shiftEarnings`, `this.shiftResults`
- Read expense breakdown from `CHAPTERS[this.chapterNum].expenses`
- Read wallet, shortfallCount, etc. from gameState

`create()` — Dark background, sections appear with animation:

**Section 1: Shift Summary** (appears immediately)
```
SHIFT REPORT — Chapter 1: Gift Card Refund
Calls: 3  |  Successful: 2  |  Earned: $450
```

**Section 2: Expenses** (animate in one at a time, 400ms apart)
```
──── DEDUCTIONS ────
BUNK FEE .................. -$80
FOOD ...................... -$40
DEBT REPAYMENT ............ -$150
────────────────────────────────
TOTAL EXPENSES ............ -$270
```
Each line appears with a subtle "stamp" sound. Running wallet total updates as each deducts.

**Section 3: Balance** (appears after expenses)
```
WALLET: $180
```
Green if positive, red if negative (shortfall).

**Section 4: Shortfall warning** (only if applicable)
```
⚠ SHORTFALL: -$X — Carried to next shift
"Don't let it happen again." (1st)
"ONE more strike." (2nd)
```

**Section 5: Remittance** (only if wallet > 0)
```
┌──────────────────────────────────┐
│  SEND MONEY HOME?                │
│                                  │
│  [Family message here]           │
│                                  │
│  [ $50 ]  [ $100 ]  [ Skip ]    │
└──────────────────────────────────┘
```

Family messages by total remittance:
- $0 ever: "We haven't heard from you."
- $1-100: "Thank you. We are managing."
- $101-250: "Sister started school. Thank you."
- $251-500: "Mom got her medicine. We love you."
- $500+: "We are okay. Focus on staying safe."

**Section 6: Transition** (appears after remittance choice)

Check conditions in order:
1. `shortfallCount >= 3` → GameOverScene('sold')
2. `heat >= 80` → GameOverScene('arrested')
3. Chapter complete AND chapter < 5 → "CHAPTER COMPLETE — NEXT CHAPTER >>" → BriefingScene(chapter+1)
4. Chapter complete AND chapter = 5 → Ending based on pierogiConvinced + totalRemittance
5. Chapter NOT complete → "NEXT SHIFT >>" → BriefingScene(same chapter, new night)

For option 5 (next night): `SaveManager.resetTonightAttempts()` so failed victims re-enter the pool.

**Step 2: Register in main.js and add import**

**Step 3: Commit**
```
feat(ledger): add LedgerScene with expenses, remittance, shortfall tracking
```

---

## Task 10: Level 5 Pierogi Mechanic

One Chapter 5 victim (Amanda Price) is actually Pierogi in disguise. Starts as a nervous CFO, then reveals mid-call with a voice switch.

**Files:**
- Modify: `src/config/prompts/victims/chapter5.js` — Amanda Price is Pierogi pre-reveal
- Create: `src/config/prompts/pierogi_reveal.js` — Post-reveal Pierogi prompt
- Modify: `src/voice/VoiceManager.js` — add `switchSession()` method
- Modify: `src/state/GameState.js` — handle `pierogi_reveal` event
- Modify: `src/scenes/OfficeScene.js` — trigger voice switch on reveal

**Step 1: Amanda Price pre-reveal prompt**

In `chapter5.js`, Amanda Price's personality:
- Starts as a slightly nervous new CFO (just promoted 3 months ago)
- Voice: `alloy` (will switch to `echo` on reveal)
- She asks oddly specific questions an actual victim wouldn't: "Where is your office located?", "How many people work there?", "What's your employee ID?"
- After ~60 seconds OR compliance reaches 40+, triggers `event: 'pierogi_reveal'`
- Her last line as CFO: "You know what? I don't think you're who you say you are."

**Step 2: Pierogi post-reveal prompt**

Create `src/config/prompts/pierogi_reveal.js`:

```js
export function getPierogiConfig() {
  return {
    instructions: `You are Pierogi, the famous scambaiter (Scammer Payback).
    You just caught a scammer and dropped your disguise.
    ...
    [Full prompt with inverted suspicion/compliance mechanics]
    [Suspicion starts at 70 — you think they're a real scammer]
    [Compliance starts at 10 — you don't believe them yet]
    ...`,
    tools: [UPDATE_GAME_STATE_TOOL],
    voice: 'echo',
    filterParams: { highpass: 200, lowpass: 3800, midGain: 2, compRatio: 4 }, // clear cell connection
  };
}
```

Full prompt should include:
- Starts confident: "Drop the act. I know what you are."
- Asks probing questions: "Where are you? What country?"
- Compliance stages from skeptical → believing → committed to helping
- Win: compliance 90+ → 'agrees_to_pay' (rescue)
- Fail: suspicion 90+ → 'hangs_up' (just another scammer to him)

**Step 3: Add `switchSession()` to VoiceManager**

```js
async switchSession(newConfig) {
  // Save callbacks
  const cbs = { onGameStateUpdate, onDesktopAction, onCallEnd, onError, onConnected };
  this._cleanup();  // Tears down WebRTC but keeps mic
  Object.assign(this, cbs);
  // Start fresh session with new config
  return this.startCallWithConfig(newConfig);
}

// Extract session setup logic from startCall() into startCallWithConfig(config)
// startCall() builds config then calls startCallWithConfig()
// switchSession() receives config directly
```

**Step 4: Handle `pierogi_reveal` in GameState**

Add `'pierogi_reveal'` to recognized events (NOT terminal — call continues).

In `updateFromAI()`, when `event === 'pierogi_reveal'`:
- Emit `'game_event'` as usual (OfficeScene picks it up)

**Step 5: Handle reveal in OfficeScene**

In `_onGameEvent()`, when event is `'pierogi_reveal'`:
1. Play static burst (Web Audio: white noise, 500ms)
2. Brief screen glitch effect (flash)
3. Get Pierogi config from `getPierogiConfig()`
4. Call `VoiceManager.getInstance().switchSession(pierogiConfig)`
5. Reset suspicion/compliance: `gameState.suspicion = 70; gameState.compliance = 10;`
6. Emit events to update UI meters
7. Update CallScene victim card: name changes to "???" then reveals "PIEROGI"

**Step 6: Track outcome**

In GameState, when Chapter 5 call ends:
- If reason is `'agrees_to_pay'` and Pierogi was revealed: `this.pierogiConvinced = true`
- Save to localStorage

**Step 7: Commit**
```
feat(pierogi): add scambaiter reveal with voice switch and inverted mechanics
```

---

## Task 11: Update GameOverScene for New Endings

Add 'sold', 'rescued', 'rescued_alone', 'still_trapped' endings.

**Files:**
- Modify: `src/scenes/GameOverScene.js`

**Step 1: Update `init()` to accept new reasons**

Supported reasons: `'sold'`, `'arrested'`, `'rescued'`, `'rescued_alone'`, `'still_trapped'`

**Step 2: Create new ending scenes**

**'sold'** (replaces 'fired'):
- Dark, oppressive red. Title: "SOLD"
- "You failed too many times."
- "The boss sold your contract to another compound."
- "Somewhere darker. Somewhere worse."

**'rescued'** (best ending):
- Bright, hopeful. Blue/green palette.
- Police siren sounds (red/blue flash but POSITIVE context)
- "Pierogi contacted the authorities."
- "The compound was raided. You're going home."
- If totalRemittance > 0: "Your family is waiting."
- Show: "Total sent home: $X"

**'rescued_alone'** (bittersweet):
- Muted colors. Quiet.
- "The compound was raided. You're free."
- "But you never sent anything home."
- "There's nothing waiting."

**'still_trapped'** (Pierogi hung up):
- Darkest. Near silence.
- "He didn't believe you."
- "Tomorrow the phone will ring again."
- "And the day after that."
- Slow fade to black.

**Step 3: Update play-again button**

- 'rescued' endings: "PLAY AGAIN"
- 'sold'/'still_trapped': "TRY AGAIN"
- All reset save and go to menu

**Step 4: Commit**
```
feat(endings): add sold, rescued, rescued_alone, still_trapped ending variants
```

---

## Task 12: Wire Scene Flow and Transitions

Connect everything. Ensure the full loop works end-to-end.

**Files:**
- Modify: `src/main.js` — final scene list
- Modify: `src/scenes/MenuScene.js` — continue/new game logic
- Modify: `src/scenes/LedgerScene.js` — all transition paths
- Modify: `src/scenes/OfficeScene.js` — use chapterNum consistently

**Step 1: Final scene flow**

```
BootScene → MenuScene
              ↓ (first play)
          IntroScene → BriefingScene(ch=1) → OfficeScene ↔ CallScene
              ↓ (continue)                       ↕   ↕
          BriefingScene(ch=N)            SocialNetworkScene TechDesktopScene
                                               ↓
                                          LedgerScene
                                         ↙    ↓     ↘
                              BriefingScene  BriefingScene  GameOverScene
                              (same ch)      (next ch)      (ending)
```

**Step 2: MenuScene save integration**

```js
create() {
  const hasSave = SaveManager.exists();

  if (hasSave) {
    // Show CONTINUE and NEW GAME buttons
    // CONTINUE → load save, go to BriefingScene(save.currentChapter)
    // NEW GAME → SaveManager.reset(), go to IntroScene
  } else {
    // Show START GAME button
    // START GAME → go to IntroScene
  }
}
```

**Step 3: LedgerScene transitions**

After remittance choice, determine next destination:
```js
_getNextDestination() {
  if (gameState.shortfallCount >= 3) return { scene: 'gameover', data: { reason: 'sold' } };
  if (gameState.heat >= 80) return { scene: 'gameover', data: { reason: 'arrested' } };

  const remaining = getRemainingVictims(this.chapterNum, gameState.completedVictims);
  if (remaining.length === 0) {
    // Chapter complete
    if (this.chapterNum >= 5) {
      // Game ending
      if (gameState.pierogiConvinced && gameState.totalRemittance > 0)
        return { scene: 'gameover', data: { reason: 'rescued' } };
      if (gameState.pierogiConvinced)
        return { scene: 'gameover', data: { reason: 'rescued_alone' } };
      return { scene: 'gameover', data: { reason: 'still_trapped' } };
    }
    // Next chapter
    gameState.currentChapter = this.chapterNum + 1;
    SaveManager.save(gameState.getSerializableState());
    return { scene: 'briefing', data: { chapter: this.chapterNum + 1 } };
  }

  // Same chapter, next night
  SaveManager.resetTonightAttempts();
  SaveManager.save(gameState.getSerializableState());
  return { scene: 'briefing', data: { chapter: this.chapterNum } };
}
```

**Step 4: Update BriefingScene**

Accept `chapter` in init data instead of `level`. Use `gameState.startShift(chapterNum)` instead of `gameState.startLevel()`.

**Step 5: Verify OfficeScene uses chapter consistently**

Rename `this.levelNum` → `this.chapterNum` throughout. Ensure FriendBook, prompts, and victim selection all use the chapter number.

**Step 6: Commit**
```
feat(flow): wire complete scene flow with save/load, chapter transitions, endings
```

---

## Task 13: Cleanup and Documentation

Remove dead code, update docs.

**Files:**
- Delete or decommission: `src/scenes/ResultsScene.js`
- Modify: `src/main.js` — remove ResultsScene from scene array
- Modify: `CLAUDE.md` — update architecture, scene flow, economy docs

**Step 1: Remove ResultsScene**

Remove from main.js scene list. Delete file or keep for reference.

**Step 2: Update CLAUDE.md**

Update Scene Flow:
```
BootScene → MenuScene → SettingsScene
                ↓
          IntroScene (first play only)
                ↓
          BriefingScene → OfficeScene ↔ CallScene → LedgerScene → BriefingScene
                              ↕   ↕                                    ↓
                SocialNetworkScene TechDesktopScene               GameOverScene
```

Add sections:
- Chapter/Victim Structure (5 chapters, 20 victims)
- Economy System (wallet, expenses, remittance, shortfalls)
- Save State (localStorage persistence)
- Per-Victim Prompts (unique personalities)
- Pierogi Final Level Mechanic

**Step 3: Commit**
```
chore: remove ResultsScene, update CLAUDE.md for new economy system
```
