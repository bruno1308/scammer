# Scammer Simulator — PhaserJS MVP Execution Plan

## Overview

**Scammer Simulator** is a dark comedy simulation game where the player works at an Indian scam call center. The player uses their real voice (via microphone) to convince AI-powered victims to hand over money. The game runs in PhaserJS with a cartoon/comic art style, and uses voice-to-voice AI for the victim conversations.

**Target:** 5 playable levels, each a different scam type with escalating difficulty.

---

## Tech Stack

| Component | Technology | Why |
|-----------|-----------|-----|
| Game Engine | **PhaserJS 3** (HTML5/Canvas) | Fast iteration, browser-native, handles 2D scenes and UI well |
| Voice AI | **OpenAI Realtime API via WebRTC** | Native voice-to-voice in browser, sub-200ms latency, function calling for game state, steerable via system prompts for victim personas |
| Art Generation | **Meshy API** (via Claude skill) | Text-to-image for cartoon/comic style assets |
| Backend | **Lightweight Node.js server** | Only needed to mint ephemeral OpenAI keys (never expose API keys to client) |
| Build Tool | **Vite** | Fast dev server, works perfectly with Phaser |

---

## Voice AI Architecture

### Why OpenAI Realtime API

The OpenAI Realtime API with WebRTC is the best fit for this game because:

1. **True voice-to-voice**: No separate STT → LLM → TTS pipeline. The model natively understands audio input and produces audio output, which means lower latency and it can pick up on tone, hesitation, and emotion in the player's voice.
2. **Browser-native via WebRTC**: Phaser runs in the browser. WebRTC gives us sub-200ms round-trip latency with built-in echo cancellation and noise suppression.
3. **Function calling**: The model can call functions mid-conversation to report game state changes back to PhaserJS (e.g., `update_suspicion(+15)`, `victim_action("threatens_police")`). This is the bridge between the AI conversation and the game mechanics.
4. **System prompt steering**: Each level gets a different system prompt that defines the victim's personality, vulnerability, knowledge level, and behavior thresholds.

### Integration Pattern

```
[Player Mic] → WebRTC → OpenAI Realtime API → WebRTC → [Speaker/Headphones]
                              ↕ (data channel)
                     [PhaserJS Game State]
```

1. On call start, the Phaser game requests an ephemeral API key from the Node.js backend.
2. A WebRTC peer connection is established directly between the browser and OpenAI.
3. The player's microphone audio streams to OpenAI; the AI victim's voice streams back.
4. Game state updates (suspicion, compliance, events) come through the WebRTC data channel via function calls.
5. PhaserJS listens for these events and updates the UI (meters, animations, visual events).

### Function Calling Schema

The AI victim's system prompt will include tool definitions that let it report state changes to the game. The victim AI calls these functions as the conversation progresses:

```json
{
  "tools": [
    {
      "name": "update_game_state",
      "description": "Report changes to the victim's emotional/behavioral state during the conversation. Call this after each meaningful exchange.",
      "parameters": {
        "suspicion_delta": "number (-10 to +20). Positive = more suspicious.",
        "compliance_delta": "number (-10 to +20). Positive = closer to paying.",
        "emotion": "string. Current emotion: 'calm', 'nervous', 'angry', 'scared', 'trusting', 'confused', 'crying'",
        "event": "string or null. Special event trigger: 'threatens_police', 'wants_to_call_family', 'asks_for_supervisor', 'hangs_up', 'agrees_to_pay', 'gives_gift_card_code', 'starts_crying', null"
      }
    },
    {
      "name": "tech_support_desktop_action",
      "description": "ONLY for tech support level. Trigger a visual action on the fake desktop the victim is screen-sharing. The victim narrates what they see.",
      "parameters": {
        "action": "string. One of: 'open_event_viewer', 'show_errors', 'open_command_prompt', 'run_tree_command', 'run_netstat', 'open_fake_antivirus', 'show_virus_scan', 'show_payment_page', 'open_browser', 'show_bank_page'"
      }
    }
  ]
}
```

When OpenAI calls these functions, the game receives them via the data channel event listener and dispatches them to the active Phaser scene.

### Ephemeral Key Server

A minimal Express.js server (can be deployed on Vercel, Railway, or similar):

```
POST /api/session → calls OpenAI /v1/realtime/sessions → returns ephemeral key + session config
```

The server sets the victim's system prompt, voice, and tools based on the level number passed in the request.

---

## Game Structure

### Main Scenes (Phaser Scenes)

| Scene | Purpose |
|-------|---------|
| `BootScene` | Load all assets, show loading bar |
| `MenuScene` | Title screen, start game, settings (mic test) |
| `OfficeScene` | The main gameplay view — your desk in the call center |
| `CallScene` | Overlay/child scene during active calls — shows conversation HUD |
| `TechDesktopScene` | Fake Windows desktop (Level 3 only) |
| `BriefingScene` | Pre-level briefing from your boss with scam script/instructions |
| `ResultsScene` | End-of-level score breakdown |
| `GameOverScene` | Fired / arrested endings |

### Main Gameplay View: OfficeScene

The player sees a first-person view of their call center desk. This is the persistent scene throughout a shift. Visual elements:

- **Desk surface** with phone, monitor, notebook, coffee cup, scattered papers
- **Monitor** showing a CRM-like interface with victim info (name, age, location, notes)
- **Phone** — glows/rings when a new call comes in. Player clicks to answer.
- **Notebook/cheat sheet** — shows the current scam script/tips for the level
- **Compliance meter** (hidden from "real" scammers, this is the game UI) — a vertical bar on the side
- **Suspicion meter** — another vertical bar, turns red as it fills
- **Money counter** — shows shift earnings vs. quota
- **Background** — other scammers at desks, a boss figure pacing around, posters on walls
- **Boss character** — walks by periodically. If you're behind quota, he stops and glares. If you fail too many calls, he comes to your desk (game over warning).

### Call Flow

1. Phone rings → Player clicks to answer → `CallScene` activates as overlay
2. Victim info card appears on monitor (name, age, brief profile)
3. WebRTC connection established → AI victim says "Hello?" in character
4. Player talks freely using their mic — this is the core gameplay
5. AI victim responds, updates game state via function calls
6. Meters animate in real-time based on function call data
7. Call ends via: victim hangs up (suspicion maxed), victim pays (compliance maxed), player hangs up (voluntary), or special event (police threat, etc.)
8. Results flash on screen → next call queues up

---

## The 5 Levels

### Level 1: Gift Card Refund Scam (Tutorial / Easy)

**Setup:** You tell the victim they've been "double charged" for an Amazon purchase and need to install remote desktop software so you can "process the refund." You then pretend to accidentally refund too much and guilt them into buying gift cards to "return" the excess.

**Victim Profile:**
- Elderly person (65+), limited tech knowledge
- Trusting, polite, slow to get suspicious
- Low initial suspicion, high initial compliance willingness
- Emotional trigger: confusion, desire to be honest/helpful

**System Prompt Personality:**
- Speaks slowly, asks you to repeat things
- Very polite, calls you "dear" or "sir"
- Gets confused by technical terms (good for the player)
- Suspicion rises slowly, compliance rises moderately
- Win condition: They read out a gift card code

**Visual Elements:**
- Standard office desk view
- Monitor shows simple victim info card
- Tutorial prompts appear (e.g., "Try creating urgency", "The victim seems confused — guide them step by step")

**Teaching Mechanics:**
- This level teaches the player the basic loop: build rapport → create urgency → guide to action → extract payment
- Pop-up tips appear during the call explaining game mechanics (meters, scoring)
- Quota is low and forgiving

---

### Level 2: IRS / Tax Scam (Medium)

**Setup:** You call the victim claiming to be from the IRS. They owe back taxes and a warrant has been issued for their arrest. They must pay immediately via wire transfer or gift cards to avoid being arrested today.

**Victim Profile:**
- Middle-aged working adult (40s), moderate education
- Nervous but not gullible — asks questions
- Medium initial suspicion
- Emotional triggers: fear of arrest, fear of ruining credit score

**System Prompt Personality:**
- Initially skeptical: "Wait, the IRS calls people?"
- Gets nervous when you mention arrest warrants and police
- Will ask to call back, ask for a case number, try to verify
- If player uses confident authority voice, suspicion drops
- If player stumbles or contradicts themselves, suspicion spikes
- Win condition: They agree to purchase gift cards or wire money

**New Mechanics Introduced:**
- **Objection handling**: The victim pushes back. Player must improvise responses to skeptical questions.
- **No tutorial prompts** — player is on their own
- **Higher quota** — need to close faster or handle more calls
- **Time pressure**: A call timer appears. Longer calls attract more heat.

---

### Level 3: Tech Support Scam (Medium-Hard)

**Setup:** The victim's computer has a pop-up saying it's infected. They called YOUR fake tech support number. You guide them through "diagnostic steps" that are actually just normal Windows features made to look scary (Event Viewer errors, netstat connections, tree commands). Then you sell them a $299 "protection plan."

**Victim Profile:**
- Adult (30s-50s), knows how to use a computer but not deeply technical
- Called YOU, so initially trusting — but can get suspicious if you push too hard
- Moderate suspicion, moderate compliance
- Emotional triggers: fear of losing files/photos, fear of hackers

**System Prompt Personality:**
- Starts trusting (they called your number, after all)
- Follows your instructions but asks "what does this mean?"
- Gets nervous when they see "errors" (Event Viewer)
- Can get suspicious if you ask for payment too early
- May say "let me ask my husband/wife" — a stall tactic
- Win condition: They enter credit card details on the fake payment page

**Unique Feature: Fake Desktop Scene (`TechDesktopScene`)**

This is the signature level. When the victim "shares their screen" (narrative framing), the game switches to a **fake Windows desktop** that both the player sees and the victim narrates seeing. The AI victim calls `tech_support_desktop_action` functions which trigger visual changes on the fake desktop:

| Action | What Player Sees |
|--------|-----------------|
| `open_event_viewer` | Fake Event Viewer window opens, filled with scary-looking red/yellow error entries |
| `show_errors` | Error count increases, highlighting critical warnings |
| `open_command_prompt` | Black terminal window opens |
| `run_tree_command` | `tree` command scrolls rapidly — victim reacts with concern |
| `run_netstat` | `netstat` output shows "suspicious foreign connections" (fake IPs labeled as Russia, China) |
| `open_fake_antivirus` | A fake "Windows Security Scan" window appears |
| `show_virus_scan` | Scan animation runs, "finds" 47 threats |
| `show_payment_page` | A fake "Microsoft Certified Tech Support" payment form appears |
| `open_browser` | Fake browser opens to a fake support website |
| `show_bank_page` | If you're really bold — a fake bank login page |

The player TALKS the victim through these steps via voice. The AI controls when each action triggers based on the conversation flow. The player doesn't click the desktop — they convince the victim to "click" things, and the AI triggers the visual changes.

**Art Requirements for This Level:**
- Fake Windows 10/11 desktop background
- Fake Event Viewer window with error rows
- Fake Command Prompt with pre-rendered text animations
- Fake antivirus scan UI
- Fake payment form
- Fake browser chrome

---

### Level 4: Romance / Catfish Scam (Hard)

**Setup:** You're messaging a victim on a dating app who thinks you're a deployed military officer / humanitarian worker. After weeks of "relationship building" (represented as a montage), you now need emergency money — your wallet was stolen, you need a plane ticket to come visit them, your child needs surgery, etc.

**Victim Profile:**
- Lonely adult (any age), recently divorced or widowed
- Emotionally invested — they think they're in a relationship with you
- Low initial suspicion (deep emotional bond) but VERY sensitive to inconsistencies
- Emotional triggers: love, fear of losing the relationship, guilt

**System Prompt Personality:**
- Affectionate, calls you pet names
- Asks personal questions — player must stay consistent with backstory
- Gets hurt if you're cold or dismissive
- Suspicious of specific things: why can't you video call? Why always money?
- If player shows genuine warmth AND weaves in the money request naturally, compliance rises
- If player is too transactional or contradicts earlier "backstory" (the prompt will track this), suspicion spikes hard
- Win condition: They send a wire transfer / crypto

**New Mechanics:**
- **Backstory consistency**: The victim references "past conversations" (the system prompt includes a fake history). Player must not contradict established facts about "their" identity.
- **Emotional manipulation**: Raw authority doesn't work here. Player must use emotional tactics — guilt, love, desperation.
- **Higher stakes**: This scam pays the most but the victim is the most sympathetic. The game leans into the moral discomfort here.
- **Visual**: Instead of a phone, the monitor shows a dating app / messaging interface with past "messages"

---

### Level 5: Corporate Phishing / CEO Fraud (Hardest)

**Setup:** You're impersonating the CEO of a company, calling the CFO's office to authorize an emergency wire transfer. "I'm in a meeting, I can't email, just process this — it's for the acquisition, you know which one. I need this done in 30 minutes or the deal falls through."

**Victim Profile:**
- Corporate professional (30s-50s), smart, busy, skeptical
- High initial suspicion — they handle money all day and are trained to verify
- Emotionally driven by: career fear (what if the CEO is mad?), urgency, authority
- Will try to verify through back-channels

**System Prompt Personality:**
- Professional, efficient, doesn't waste time
- Asks probing questions: "What's the invoice number?", "Which entity is this going to?", "Let me confirm with [real CEO name]'s assistant"
- Responds to authority and urgency but is trained to push back
- If the player sounds hesitant or doesn't know company details, suspicion maxes fast
- Win condition: They initiate the wire transfer

**New Mechanics:**
- **No warmth, pure authority**: The player must project confidence and impatience
- **Knowledge test**: The victim asks company-specific questions. The system prompt includes a briefing document the player must study before the call (shown in `BriefingScene`). Player must reference real-sounding details.
- **Time limit**: Strict call timer — the CFO is busy and will end the call if you waste their time
- **Counter-verification**: The victim may say "I'll call you back on the CEO's direct line" — player must deflect without raising suspicion
- **Highest pay, highest risk**: Failing this level hard can trigger the "arrested" ending

---

## Progression & Meta Systems

### Shift Structure

Each level = 1 work shift. A shift consists of:

- **Briefing** from your boss (BriefingScene) — explains the scam type, gives you a script, sets the quota
- **3-5 calls** per shift — each is a unique AI-generated victim
- **Quota** — dollar target you must hit. Failing quota = warning from boss. Fail 2 shifts in a row = fired (game over).
- **Results** — score breakdown after each shift

### Scoring Per Call

| Factor | Points |
|--------|--------|
| Money extracted | Base score (varies by scam type) |
| Speed bonus | Faster extraction = more points |
| Low suspicion bonus | Ending the call with suspicion below 50% |
| Clean exit | Victim doesn't threaten police or report |
| Combo bonus | Multiple successful calls in a row |

### Between-Level Upgrades (Stretch Goal)

If time allows, add a simple upgrade shop between shifts:

- **Better headset**: Victim hears you more clearly (slight suspicion reduction at start)
- **Caller ID spoofing**: Victim sees a real-looking phone number (reduces initial suspicion)
- **Script binder**: Notes appear on screen with tips specific to the victim type
- **English coaching**: (humorous) Unlocks "more convincing accent" — purely cosmetic/funny
- **VPN upgrade**: Reduces "heat" accumulation

### Heat System (Stretch Goal)

A global "heat" meter that fills across all levels. Aggressive tactics and failed calls add heat. At max heat, law enforcement closes in — adds tension to the meta-game. Could be the trigger for the "arrested" ending.

---

## Art Asset List

All assets should be generated in a **cartoon/comic style** suitable for a mobile game aesthetic. Use the Meshy API skill for generation.

### Office Environment

| Asset | Description | Dimensions (approx) |
|-------|-------------|-------------------|
| `office_bg` | First-person view of a call center desk. Cluttered, fluorescent lighting, motivational posters, other scammers in background | 1280x720 or 1920x1080 |
| `phone` | Desk phone, cartoon style. Needs idle and ringing animation frames | 128x128, 2-3 frames |
| `monitor` | Desktop monitor on desk, screen area will be overlaid with game UI | 400x300 |
| `notebook` | Open notebook with scribbled notes | 200x150 |
| `coffee_cup` | Coffee mug, steam optional | 64x64 |
| `boss_idle` | Boss character standing, arms crossed, stern expression | 256x512 sprite |
| `boss_angry` | Boss character pointing/yelling | 256x512 sprite |
| `boss_walking` | Boss walking in background, 3-4 frame walk cycle | 256x512 per frame |
| `coworker_1` through `coworker_3` | Other scammers at desks in background, simple idle animations | 200x300 each |
| `wall_poster_1` through `wall_poster_3` | Funny motivational posters ("EVERY 'NO' IS CLOSER TO A 'YES'", "THINK OF THE QUOTA") | 100x150 each |

### UI Elements

| Asset | Description |
|-------|-------------|
| `meter_frame` | Frame for suspicion/compliance meters |
| `meter_fill_green` | Compliance meter fill (green gradient) |
| `meter_fill_red` | Suspicion meter fill (red gradient) |
| `money_counter_bg` | Background for the dollar counter |
| `call_timer_bg` | Background for call duration timer |
| `victim_card_bg` | Background for the victim info card on monitor |
| `phone_ringing_icon` | Animated phone icon for incoming call |
| `hang_up_button` | Red hang-up button |
| `quota_bar` | Progress bar showing shift earnings vs quota |

### Victim Portraits

For each level, generate 3-5 victim portrait variants (the AI randomizes which one is used per call):

| Level | Portraits Needed |
|-------|-----------------|
| Level 1 | 3-5 elderly people, kind faces, cartoon style |
| Level 2 | 3-5 middle-aged working adults, range of expressions |
| Level 3 | 3-5 adults at computers, slightly confused expressions |
| Level 4 | 3-5 lonely/hopeful looking adults, range of ages |
| Level 5 | 3-5 corporate professionals, suits, serious expressions |

### Tech Desktop (Level 3 only)

| Asset | Description |
|-------|-------------|
| `fake_desktop_bg` | Windows 10/11 style desktop with icons |
| `event_viewer_window` | Fake Event Viewer with red/yellow error rows |
| `cmd_window` | Fake Command Prompt, black background, green/white text |
| `fake_antivirus_window` | Fake "Windows Security Scan" with progress bar |
| `fake_payment_form` | Fake tech support payment page |
| `fake_browser` | Browser chrome (toolbar, tabs) for fake websites |
| `virus_scan_animation` | Scanning animation frames or progress bar fill |

### Level-Specific Backgrounds

| Level | Background Variant |
|-------|--------------------|
| Level 4 | Monitor shows dating app / messaging interface instead of CRM |
| Level 5 | Office looks slightly more "professional" — you've been promoted to the big-scam division |

---

## Implementation Phases

### Phase 1: Scaffolding & Voice Integration (Priority: HIGHEST)

**Goal:** Get a Phaser game running with a working voice-to-voice call against an AI victim.

**Tasks:**
1. Initialize Vite + PhaserJS project structure
2. Create `BootScene` with asset loading
3. Create `MenuScene` with "Start Game" and microphone permission request
4. Build the Node.js ephemeral key server (`POST /api/session`)
5. Implement WebRTC connection to OpenAI Realtime API in a `VoiceManager` class
6. Create a minimal `OfficeScene` with placeholder art (colored rectangles are fine)
7. Create `CallScene` overlay — just the meters and a hang-up button for now
8. Write the Level 1 victim system prompt with function calling tools
9. Wire up function call events from the data channel to Phaser's event system
10. **Test the core loop:** Click phone → hear victim say hello → talk to them → see meters move → call ends

**Deliverable:** Playable voice call against an AI victim with working game state feedback. Once confirmed working, proceed immediately to Phase 2.

### Phase 2: Full Level 1 — Gift Card Refund (Tutorial)

**Goal:** Complete, polished first level with real art and tutorial flow.

**Tasks:**
1. Generate all office environment art assets via Meshy
2. Build the complete `OfficeScene` with all visual elements (desk, phone, monitor, etc.)
3. Build `BriefingScene` — boss explains the scam, shows the script
4. Implement victim info card on monitor (name, age, location generated per call)
5. Add tutorial pop-up system for teaching mechanics
6. Polish meter animations (smooth tweens, color transitions)
7. Implement call end conditions (hang-up, success, failure, special events)
8. Build `ResultsScene` with scoring breakdown
9. Generate Level 1 victim portraits
10. Add boss character in background with idle animation
11. Implement quota tracking within the shift (3 calls per shift)
12. Add sound effects: phone ring, hang-up click, ambient office noise
13. Write 3-5 variant system prompts for Level 1 victims (different personalities but same difficulty)

**Deliverable:** Complete, polished Level 1 that can be played start to finish. Proceed immediately to Phase 3.

### Phase 3: Levels 2 and 4 (Phone-Only Levels)

**Goal:** Add the IRS scam and romance scam levels.

**Tasks:**
1. Write Level 2 system prompt (IRS victim) with higher difficulty parameters
2. Write Level 4 system prompt (romance victim) with backstory tracking and emotional manipulation dynamics
3. Generate victim portraits for both levels
4. Implement the "dating app" monitor variant for Level 4 (shows fake message history)
5. Implement objection handling scoring — track how well the player handles pushback
6. Adjust quota and difficulty curves
7. Create Level 2 and Level 4 briefing content
8. Add call timer mechanic (Level 2+)
9. Generate any level-specific art variants
10. Test and iterate on AI victim behavior (prompt tuning)

**Deliverable:** 3 playable levels (1, 2, 4). Proceed immediately to Phase 4.

### Phase 4: Level 3 — Tech Support with Fake Desktop

**Goal:** Build the signature level with the interactive fake desktop.

**Tasks:**
1. Generate all fake desktop art assets (Event Viewer, CMD, antivirus, payment form, browser)
2. Build `TechDesktopScene` as a Phaser scene that overlays the office view
3. Implement each desktop action as an animated transition (window opens, text scrolls, scan runs)
4. Write Level 3 system prompt with `tech_support_desktop_action` function calling
5. Wire up data channel events to trigger visual desktop changes in real-time
6. Implement the "screen sharing starts" narrative transition (victim "shares screen" → desktop scene appears)
7. Add ambient sounds (keyboard clicks, error dings, scan beeps)
8. Create the fake payment flow (form appears → victim "enters" card details → success)
9. Test extensively — this level has the most moving parts

**Deliverable:** Level 3 fully playable with interactive fake desktop. Proceed immediately to Phase 5.

### Phase 5: Level 5 + Polish + Meta Systems

**Goal:** Final level, overall game polish, stretch goals.

**Tasks:**
1. Write Level 5 system prompt (corporate CFO, hardest difficulty)
2. Implement the pre-call briefing document mechanic (player must study company details)
3. Generate Level 5 art variants (more "professional" office)
4. Implement the shift progression system (Levels 1 → 5 in sequence)
5. Add the upgrade shop between levels (if time allows)
6. Add the heat system (if time allows)
7. Implement game over states: "Fired" (failed quota) and "Arrested" (max heat/failed level 5)
8. Add a simple ending sequence for completing all 5 levels
9. Final art polish pass
10. Final prompt tuning pass on all 5 victim AIs
11. Bug fixing and playtesting

**Deliverable:** Complete 5-level game.

---

## System Prompt Template

Here's the general template for each level's AI victim. Customize per level.

```
You are playing the role of a scam victim in a video game called "Scammer Simulator."
You are NOT an AI assistant. You are a CHARACTER in a game. Stay in character at all times.

IMPORTANT RULES:
- You are a {victim_description}. Your name is {name}. You are {age} years old.
- You live in {location}. {backstory}.
- Your personality: {personality_traits}
- Your tech literacy: {tech_level}
- Your emotional state at call start: {starting_emotion}

BEHAVIOR PARAMETERS:
- Starting suspicion: {start_suspicion}/100
- Starting compliance: {start_compliance}/100
- Suspicion sensitivity: {suspicion_rate} (how fast suspicion rises per red flag)
- Compliance sensitivity: {compliance_rate} (how fast compliance rises when persuaded)

CONVERSATION GUIDELINES:
- Respond naturally as this character would. Use their speech patterns, vocabulary, and emotional responses.
- React to the CALLER'S tone and approach. If they sound confident and authoritative, you're more likely to comply. If they sound nervous or inconsistent, your suspicion rises.
- You have specific objections you might raise: {objection_list}
- You have specific emotional triggers: {trigger_list}

FUNCTION CALLING:
- After EVERY meaningful exchange (roughly every 2-3 conversational turns), call update_game_state with the current deltas.
- Trigger special events when appropriate (e.g., if suspicion > 80, consider 'threatens_police' or 'hangs_up').
- If compliance reaches 90+, trigger the win condition event (e.g., 'agrees_to_pay', 'gives_gift_card_code').

VOICE GUIDELINES:
- Speak naturally with {accent/speech_pattern} characteristics.
- {Additional voice direction per level}
- Keep responses concise — this is a phone call, not a monologue. 1-3 sentences per turn typically.

DO NOT:
- Break character or acknowledge you are an AI
- Be impossible to scam (the player should be able to win if they play well)
- Be trivially easy to scam (the player should have to work for it)
- Use the same objections repeatedly
- Ignore obvious red flags from the caller
```

---

## Key Technical Considerations

### Microphone Handling
- Request mic permission at the `MenuScene` stage, not mid-game
- Include a mic test/level meter in settings so the player can verify their audio
- Handle permission denied gracefully with a clear message

### OpenAI Realtime API Session Config
- Use `gpt-realtime` model for best quality (or `gpt-realtime-mini` for cost savings during dev)
- Set `max_tokens` low (150-200) for snappy responses — this is a phone call
- Configure turn detection carefully: too aggressive = AI interrupts the player; too slow = awkward pauses
- Use voice presets that match the victim demographic (OpenAI offers several voices)

### Phaser + Voice Coordination
- Use Phaser's event emitter system as the bridge: `this.events.emit('game_state_update', data)`
- The `VoiceManager` class should be a singleton accessible from any scene
- Call state (suspicion, compliance, emotion) should live in a global game state object
- Meter animations should tween smoothly, not jump — use `Phaser.Tweens`

### Cost Management
- OpenAI Realtime API charges per audio token (~$32/M input, ~$64/M output for gpt-realtime)
- A typical 3-minute call might cost $0.10-0.30
- For development/testing, use `gpt-realtime-mini` which is significantly cheaper
- Consider adding a "call budget" to the game design that naturally limits call length

### Error Handling
- WebRTC connection can drop — show "call dropped" in-game (fits the theme!)
- If OpenAI is slow, show the victim "thinking" or "holding" (also fits the theme)
- If mic cuts out, don't crash — show "bad connection" and let the player retry

---

## File / Folder Structure

```
scammer-simulator/
├── server/
│   ├── index.js              # Express server for ephemeral keys
│   └── prompts/
│       ├── level1.js          # Gift card refund victim prompt
│       ├── level2.js          # IRS scam victim prompt
│       ├── level3.js          # Tech support victim prompt
│       ├── level4.js          # Romance scam victim prompt
│       └── level5.js          # CEO fraud victim prompt
├── src/
│   ├── main.js                # Phaser game config & entry point
│   ├── voice/
│   │   └── VoiceManager.js    # WebRTC + OpenAI Realtime integration
│   ├── state/
│   │   └── GameState.js       # Global game state (suspicion, compliance, money, heat)
│   ├── scenes/
│   │   ├── BootScene.js
│   │   ├── MenuScene.js
│   │   ├── BriefingScene.js
│   │   ├── OfficeScene.js
│   │   ├── CallScene.js
│   │   ├── TechDesktopScene.js
│   │   ├── ResultsScene.js
│   │   └── GameOverScene.js
│   ├── ui/
│   │   ├── Meter.js           # Reusable animated meter component
│   │   ├── MoneyCounter.js
│   │   ├── CallTimer.js
│   │   ├── VictimCard.js
│   │   └── TutorialPopup.js
│   └── config/
│       ├── levels.js          # Level configs (quota, calls per shift, difficulty params)
│       └── scoring.js         # Scoring formulas
├── public/
│   └── assets/
│       ├── office/            # Office environment sprites
│       ├── ui/                # UI elements
│       ├── portraits/         # Victim portraits per level
│       ├── desktop/           # Fake Windows desktop assets (Level 3)
│       ├── characters/        # Boss + coworker sprites
│       └── audio/             # Sound effects
├── index.html
├── vite.config.js
└── package.json
```

---

## Development Instructions for Claude (the implementer)

**IMPORTANT: Build the entire game end-to-end in one session.** The user expects to come back and find a fully playable 5-level game. Do not stop after Phase 1 to wait for feedback. Execute all 5 phases sequentially and deliver a complete, working game.

1. **Build all phases in order without stopping.** Each phase builds on the last. Move through them continuously — Phase 1 → 2 → 3 → 4 → 5. If you hit a blocker on voice integration, implement a graceful fallback (e.g., text input mode) so the rest of the game still works, and flag it for the user to debug later.

2. **Generate all art assets as you go.** Use the Meshy API skill to generate art for each level as you build it. Don't use placeholder rectangles — produce real cartoon/comic style assets. If Meshy is unavailable, create simple but polished SVG/Canvas-drawn assets as standin art that still looks intentional and styled.

3. **Write all 5 victim system prompts.** Craft detailed, differentiated prompts for each level. Vary personality, speech patterns, suspicion sensitivity, and emotional triggers. Err on the side of making victims slightly too easy rather than too hard — it's more fun for the player to succeed.

4. **Keep Phaser scenes thin.** Business logic (scoring, state management) should live in `GameState.js` and `VoiceManager.js`, not in scene code. Scenes should only handle rendering and input.

5. **The function calling schema is the API contract.** The game's responsiveness depends entirely on the AI calling `update_game_state` reliably. If the AI forgets to call it, the meters don't move and the game feels dead. Reinforce this heavily in every system prompt.

6. **For the fake desktop (Level 3):** Build each "window" as a separate Phaser container that can be shown/hidden/animated independently. Use tweens for window open/close animations. Pre-render the fake terminal text as sprite text or bitmap font for the "scrolling" effect.

7. **Voice selection matters.** OpenAI Realtime offers several voice presets. Match them to the victim demographic — an elderly gift card victim should sound different from a corporate CFO. Use different voice presets per level.

8. **Art generation prompt tips for Meshy:** Be specific about "cartoon/comic style, flat colors, clean lines, mobile game aesthetic." Generate assets at 2x resolution and scale down in Phaser for crisp rendering.

9. **Test as you build.** After completing each phase, do a quick sanity check that the game runs without errors before moving to the next phase. Fix issues immediately rather than accumulating tech debt.

10. **Deliver a runnable game.** At the end, the user should be able to `npm install && npm run dev` and play through all 5 levels. Include clear setup instructions in a README (especially the OpenAI API key configuration).
