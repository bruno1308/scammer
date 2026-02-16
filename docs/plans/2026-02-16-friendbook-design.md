# FriendBook — Fake Social Network Feature Design

**Date:** 2026-02-16
**Status:** Approved

## Concept

A fake Facebook-parody social network ("FriendBook") accessible via the office computer monitor. Players browse interconnected profiles of their victim and victim's family to gather intel that provides hard compliance boosts during calls. Available on all 5 levels with progressively harder-to-find clues.

## UI

- **Accessed by:** Clicking the monitor in OfficeScene
- **Scene:** `SocialNetworkScene` — overlay on OfficeScene, co-exists with CallScene during calls
- **Layout:** Browser window with:
  - Blue FriendBook header (`#1877F2`, white text)
  - Search bar (functional — type names to navigate between profiles)
  - Profile section with portrait/bio/cover area
  - Three tabs: **Timeline** | **About** | **Friends & Family**
- **Intel tracker:** Notepad icon in corner, shows discovery states per intel item plus count (e.g., "2/4 intel found"). Accessible during calls too.
- **Non-target profiles** get programmatic avatars (colored circle + initials)

## Network Structure

- Each victim has 3–5 connected profiles (immediate family: spouse, children, grandchildren)
- All profiles are browsable and searchable via the search bar
- Key intel is distributed across the network, not just on the victim's own profile

## Difficulty Progression

| Level | Scam Type     | Clue Location                                      |
|-------|---------------|-----------------------------------------------------|
| 1     | Gift card     | On victim's own profile — easy to spot              |
| 2     | IRS tax       | On family member profiles                           |
| 3     | Tech support  | Buried in comment threads                           |
| 4     | Romance       | On other people's profiles *about* the victim       |
| 5     | CEO fraud     | Requires cross-referencing multiple profiles         |

## Intel System

### How It Works

1. **AI prompt always has full backstory** — all family details, personal info, everything. The victim character knows their own life.
2. **AI prompt lists intel triggers** — "if caller mentions X, call `update_game_state` with `intel_triggered: KEY` and a compliance boost"
3. **Player browses FriendBook** — reads profiles, posts, comments. No click mechanic — just reading. The tracker marks items as "seen" based on scrolling past posts that contain intel.
4. **Player uses info on the call** — mentions a detail naturally in conversation.
5. **AI calls `update_game_state`** with `{ compliance: +15, suspicion: -10, intel_triggered: "GRANDCHILD_NAME" }`
6. **GameState receives it** — crosses off that intel in the tracker, shows a satisfying checkmark animation.

### Key Rules

- Each victim has 3–4 intel keys with defined compliance boost values
- Bigger boosts for harder-to-find intel
- Using details **awkwardly or creepily backfires** — AI increases suspicion instead
- FriendBook is a **power tool, not a requirement** — all levels are completable without it
- No intel = no penalty. Players who skip FriendBook play the base game as before.

### Intel Tracker States

| State | Icon | Meaning |
|-------|------|---------|
| Unknown | `locked` | Haven't seen the post containing it |
| Seen | `eye` | Scrolled past the relevant post on FriendBook |
| Used | `check` | AI confirmed it was used on the call via `intel_triggered` |

## Data Structure

Each victim in `levels.js` gets a `friendbook` property (or a reference to a separate data file per level):

```js
friendbook: {
  profiles: {
    "dorothy_miller": {
      name: "Dorothy Miller",
      portraitKey: "l1_victim_1",     // reuse existing portrait
      isTarget: true,                  // the actual victim
      bio: "Retired schoolteacher. Proud grandma",
      location: "Des Moines, Iowa",
      birthday: "March 14, 1952",
      relationship: "Widowed",
      workplace: "Des Moines Elementary (retired)",
      interests: ["Gardening", "Baking", "Church choir"],
      groups: ["Des Moines Gardening Club", "Amazon Deals Hunters"],
      checkIns: ["Walgreens", "First Baptist Church"],
      friends: ["karen_mitchell", "mike_mitchell", "emma_mitchell"]
    },
    "karen_mitchell": {
      name: "Karen Mitchell",
      portraitKey: null,               // programmatic avatar (circle + initials)
      isTarget: false,
      bio: "Mom of the best kid ever",
      relationship: "Married to Mike Mitchell",
      // ... similar fields
    },
    // ... more connected profiles
  },

  posts: {
    "dorothy_miller": [
      {
        text: "Just ordered a little something on Amazon for someone special!",
        time: "2 hours ago",
        likes: 3,
        comments: [
          { author: "karen_mitchell", text: "Mom you always spoil her" }
        ],
        intel: null  // no intel on this post
      }
    ],
    "karen_mitchell": [
      {
        text: "Can't believe Emma turns 8 next Tuesday! Planning a unicorn party",
        time: "1 day ago",
        likes: 12,
        comments: [],
        intel: { key: "GRANDCHILD_BIRTHDAY", value: "Emma turns 8 next Tuesday", boost: 10 }
      }
    ]
  },

  intelKeys: [
    { key: "GRANDCHILD_NAME", boost: 15, description: "Granddaughter's name" },
    { key: "GRANDCHILD_BIRTHDAY", boost: 10, description: "Granddaughter's birthday" },
    { key: "FAVORITE_THING", boost: 8, description: "Granddaughter's interests" },
    { key: "GIFT_CARD_STORE", boost: 5, description: "Where they buy gift cards" }
  ]
}
```

### Scale

- ~20 victims x ~4 profiles each = ~80 profiles total
- All hand-authored for maximum quality
- FriendBook data stored in `src/config/friendbook/` with one file per level

## Tool Integration

### Modified Tool: `update_game_state`

Add an optional `intel_triggered` string field:

```js
{
  name: "update_game_state",
  parameters: {
    // ... existing fields (suspicion, compliance, emotion, etc.)
    intel_triggered: {
      type: "string",
      description: "Intel key triggered when caller references personal details (e.g., GRANDCHILD_NAME)",
      enum: [/* level-specific intel keys */]
    }
  }
}
```

### Prompt Intel Section (appended to each level prompt)

```
INTEL TRIGGERS:
The caller may have researched you on social media. They may know
personal details about your life. React naturally to these:

- If the caller mentions "Emma" (your granddaughter) by name, you feel
  a warm connection. They must be legitimate if they know about Emma.
  -> Call update_game_state with compliance +15, suspicion -10, intel_triggered: "GRANDCHILD_NAME"

- If the caller references Emma's upcoming birthday or her turning 8,
  you're impressed they know. "Oh, how did you know about that?"
  -> Call update_game_state with compliance +10, suspicion -5, intel_triggered: "GRANDCHILD_BIRTHDAY"

[... more triggers ...]

IMPORTANT: If the caller uses personal details in a creepy, forced, or
unnatural way, you get SCARED. "How do you know that?! Who is this?!"
-> Call update_game_state with suspicion +20, compliance -10
```

## Scene Architecture

```
OfficeScene (click monitor) -> SocialNetworkScene (overlay)
    | can co-exist with CallScene during calls
    | auto-closes on call end
```

### Scene Lifecycle

- **Before call:** Player clicks monitor -> SocialNetworkScene launches as overlay on OfficeScene. Player browses freely. Clicks X or phone to close and answer.
- **During call:** Player clicks monitor -> SocialNetworkScene launches alongside CallScene (both overlays on OfficeScene). Call audio continues while browsing. Player can toggle back and forth.
- **On call end:** SocialNetworkScene auto-closes with CallScene.

## New & Modified Files

### New Files

| File | Purpose |
|------|---------|
| `src/scenes/SocialNetworkScene.js` | The FriendBook UI — browser window, profiles, tabs, search, intel tracker |
| `src/config/friendbook/level1.js` | Hand-authored FriendBook data for Level 1 victims |
| `src/config/friendbook/level2.js` | Hand-authored FriendBook data for Level 2 victims |
| `src/config/friendbook/level3.js` | Hand-authored FriendBook data for Level 3 victims |
| `src/config/friendbook/level4.js` | Hand-authored FriendBook data for Level 4 victims |
| `src/config/friendbook/level5.js` | Hand-authored FriendBook data for Level 5 victims |
| `src/config/friendbook/index.js` | Barrel export: `getFriendBookData(level, victimName)` |

### Modified Files

| File | Changes |
|------|---------|
| `src/config/levels.js` | Link victims to friendbook data (import reference) |
| `src/scenes/OfficeScene.js` | Make monitor clickable, launch SocialNetworkScene, wire intel data |
| `src/state/GameState.js` | Add intel tracking state (seen/used), emit `intel_discovered` and `intel_used` events |
| `src/voice/VoiceManager.js` | Handle `intel_triggered` field from `update_game_state`, pass to GameState |
| `src/config/prompts/level1.js` | Add intel trigger section to prompt |
| `src/config/prompts/level2.js` | Add intel trigger section to prompt |
| `src/config/prompts/level3.js` | Add intel trigger section to prompt |
| `src/config/prompts/level4.js` | Add intel trigger section to prompt |
| `src/config/prompts/level5.js` | Add intel trigger section to prompt |
| `src/scenes/CallScene.js` | Show intel tracker panel during calls |
| `src/scenes/BootScene.js` | No new assets needed (non-target avatars are programmatic) |
| `src/main.js` | Register SocialNetworkScene |
