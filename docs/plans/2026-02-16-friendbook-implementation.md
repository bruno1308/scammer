# FriendBook Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a fake Facebook-parody social network ("FriendBook") accessible via the office monitor, allowing players to research victims and their families for hard compliance boosts during calls.

**Architecture:** New `SocialNetworkScene` overlay launched from OfficeScene when clicking the monitor. FriendBook data is hand-authored per victim in `src/config/friendbook/`. Intel tracking lives on GameState with seen/used states. The AI prompt's `update_game_state` tool gains an `intel_triggered` field so the AI can report when personal details are referenced.

**Tech Stack:** Phaser 3 (ES modules, no TypeScript), Vite, OpenAI Realtime API (WebRTC)

**Design Doc:** `docs/plans/2026-02-16-friendbook-design.md`

---

## Task 1: Add Intel Tracking to GameState

**Files:**
- Modify: `src/state/GameState.js`

**Step 1: Add intel state properties to the constructor**

In `GameState` constructor (after line ~134), add:

```js
// Intel tracking for FriendBook
this.intelKeys = [];        // Array of { key, boost, description } for current victim
this.intelSeen = new Set();  // Keys the player has seen on FriendBook
this.intelUsed = new Set();  // Keys the AI confirmed were used in conversation
```

**Step 2: Add `initIntel(intelKeys)` method**

Add after `startCall()` method (~line 188):

```js
initIntel(intelKeys) {
  this.intelKeys = intelKeys || [];
  this.intelSeen = new Set();
  this.intelUsed = new Set();
  this.emit('intel_reset', this.intelKeys);
}
```

**Step 3: Add `markIntelSeen(key)` method**

```js
markIntelSeen(key) {
  if (!this.intelSeen.has(key)) {
    this.intelSeen.add(key);
    this.emit('intel_seen', key);
  }
}
```

**Step 4: Add `markIntelUsed(key)` method**

```js
markIntelUsed(key) {
  if (!this.intelUsed.has(key)) {
    this.intelUsed.add(key);
    this.emit('intel_used', key);
  }
}
```

**Step 5: Handle `intel_triggered` in `updateFromAI()`**

In the `updateFromAI()` method (around line 203), after processing events, add:

```js
if (data.intel_triggered) {
  this.markIntelUsed(data.intel_triggered);
}
```

**Step 6: Reset intel in `startLevel()`**

In `startLevel()` (around line 144), add:

```js
this.intelKeys = [];
this.intelSeen = new Set();
this.intelUsed = new Set();
```

**Step 7: Commit**

```bash
git add src/state/GameState.js
git commit -m "feat(friendbook): add intel tracking state to GameState"
```

---

## Task 2: Create FriendBook Data — Level 1

**Files:**
- Create: `src/config/friendbook/level1.js`

**Step 1: Author FriendBook data for all 5 Level 1 victims**

This file exports a function `getLevel1FriendBook(victimName)` that returns the FriendBook data for the named victim. Each victim gets:
- Their own profile + 3-4 family member profiles
- Timeline posts with comments
- Intel markers on specific posts/comments
- 3-4 intel keys

**Level 1 difficulty: Clues are on the victim's own profile — easy to spot.**

Create `src/config/friendbook/level1.js`:

```js
/**
 * FriendBook data for Level 1: Gift Card Refund Scam
 * Difficulty: Easy — clues are on the victim's own profile
 */

const FRIENDBOOK_DATA = {
  'Dorothy Miller': {
    profiles: {
      dorothy_miller: {
        name: 'Dorothy Miller',
        portraitKey: 'l1_victim_1',
        isTarget: true,
        bio: 'Retired schoolteacher. Proud grandma. God is good.',
        location: 'Des Moines, Iowa',
        birthday: 'March 14, 1952',
        relationship: 'Widowed',
        workplace: 'Des Moines Elementary (retired 2017)',
        interests: ['Gardening', 'Baking', 'Church choir', 'Puzzles'],
        groups: ['Des Moines Gardening Club', 'First Baptist Church', 'Amazon Deals Hunters'],
        checkIns: ['Walgreens', 'First Baptist Church', 'Hy-Vee Grocery'],
        friends: ['karen_mitchell', 'mike_mitchell', 'emma_mitchell']
      },
      karen_mitchell: {
        name: 'Karen Mitchell',
        portraitKey: null,
        isTarget: false,
        bio: 'Mom. Wife. Exhausted. 📍 Minneapolis',
        location: 'Minneapolis, Minnesota',
        birthday: 'June 22, 1980',
        relationship: 'Married to Mike Mitchell',
        workplace: 'Target Corporate — Marketing Manager',
        interests: ['Running', 'Wine', 'PTA drama'],
        groups: ['Minneapolis Moms Group'],
        checkIns: [],
        friends: ['dorothy_miller', 'mike_mitchell', 'emma_mitchell']
      },
      mike_mitchell: {
        name: 'Mike Mitchell',
        portraitKey: null,
        isTarget: false,
        bio: 'Dad jokes are my love language',
        location: 'Minneapolis, Minnesota',
        birthday: 'November 3, 1978',
        relationship: 'Married to Karen Mitchell',
        workplace: 'Wells Fargo — IT Department',
        interests: ['Grilling', 'Vikings football', 'Dad jokes'],
        groups: ['Minneapolis Dads BBQ Club'],
        checkIns: ['CVS Pharmacy', 'Home Depot'],
        friends: ['dorothy_miller', 'karen_mitchell', 'emma_mitchell']
      },
      emma_mitchell: {
        name: 'Emma Mitchell',
        portraitKey: null,
        isTarget: false,
        bio: '🦄 unicorns are real 🦄 almost 8!!',
        location: 'Minneapolis, Minnesota',
        birthday: 'February 24, 2018',
        relationship: null,
        workplace: null,
        interests: ['Unicorns', 'Frozen', 'Roblox', 'Drawing'],
        groups: [],
        checkIns: [],
        friends: ['dorothy_miller', 'karen_mitchell', 'mike_mitchell']
      }
    },
    posts: {
      dorothy_miller: [
        {
          text: "Just ordered a little something on Amazon for my granddaughter Emma's birthday! She's going to be 8 — where does the time go? 🎁",
          time: '2 hours ago',
          likes: 8,
          comments: [
            { author: 'karen_mitchell', text: "Mom you always spoil her 😂 She's already asking what Grandma got her!" }
          ],
          intel: { key: 'GRANDCHILD_NAME', value: "Granddaughter's name is Emma" }
        },
        {
          text: "Beautiful morning at First Baptist. Pastor Dave's sermon really spoke to me today. Feeling blessed. 🙏",
          time: '1 day ago',
          likes: 14,
          comments: [
            { author: 'karen_mitchell', text: 'Love you Mom ❤️' }
          ],
          intel: null
        },
        {
          text: "My tomatoes are finally coming in! Harold would have been so proud of this year's garden. Miss you every day, sweetheart. 🌱",
          time: '3 days ago',
          likes: 22,
          comments: [
            { author: 'mike_mitchell', text: "Those look amazing Dorothy! Save some for us when we visit?" },
            { author: 'karen_mitchell', text: "Dad loved your garden. He'd say 'best tomatoes in Iowa' ❤️" }
          ],
          intel: { key: 'LATE_SPOUSE', value: "Late husband's name was Harold" }
        },
        {
          text: "Does anyone know how to stop those pop-up ads on my computer? I keep clicking the X but more appear. My grandson said not to click anything but it's hard when they cover the whole screen!",
          time: '5 days ago',
          likes: 3,
          comments: [
            { author: 'mike_mitchell', text: "Dorothy do NOT click those! I'll remote in this weekend and clean it up for you." },
            { author: 'karen_mitchell', text: "Mom PLEASE just call Mike when that happens 🙏" }
          ],
          intel: null
        }
      ],
      karen_mitchell: [
        {
          text: "Can't believe my baby turns 8 next Tuesday! Planning a unicorn party because obviously 🦄✨ Emma's already picked out her purple dress",
          time: '1 day ago',
          likes: 31,
          comments: [
            { author: 'dorothy_miller', text: "Oh I wish I could be there in person! Sending a big box of surprises 📦" },
            { author: 'mike_mitchell', text: 'I have been assigned balloon duty 🫡' }
          ],
          intel: { key: 'GRANDCHILD_BIRTHDAY', value: "Emma turns 8 next Tuesday, unicorn party" }
        },
        {
          text: 'School pickup line is my personal purgatory. 45 minutes. FORTY. FIVE. MINUTES.',
          time: '3 days ago',
          likes: 47,
          comments: [],
          intel: null
        }
      ],
      mike_mitchell: [
        {
          text: 'Pro tip: CVS gift cards make great last-minute gifts. Not that I would know anything about forgetting anniversaries... 😅',
          time: '4 days ago',
          likes: 12,
          comments: [
            { author: 'karen_mitchell', text: "Michael. Thomas. Mitchell. 😤" }
          ],
          intel: { key: 'GIFT_CARD_STORE', value: 'Family buys gift cards at CVS' }
        },
        {
          text: "Vikings game day! Who's coming over? Bringing the smoker out 🏈🔥",
          time: '6 days ago',
          likes: 8,
          comments: [],
          intel: null
        }
      ],
      emma_mitchell: [
        {
          text: "my cat mr whiskers learned a new trick!! he sits when i say sit!! well sometimes 🐱",
          time: '2 days ago',
          likes: 18,
          comments: [
            { author: 'dorothy_miller', text: "Mr. Whiskers is such a smart kitty! Just like his owner 😊" }
          ],
          intel: null
        }
      ]
    },
    intelKeys: [
      { key: 'GRANDCHILD_NAME', boost: 15, description: "Granddaughter's name" },
      { key: 'GRANDCHILD_BIRTHDAY', boost: 10, description: "Granddaughter's birthday" },
      { key: 'LATE_SPOUSE', boost: 8, description: "Late husband's name" },
      { key: 'GIFT_CARD_STORE', boost: 5, description: 'Where family buys gift cards' }
    ]
  },

  // TODO: Author data for Harold Patterson, Betty Nakamura, Earl Washington, Margaret O'Brien
  // Each needs: 3-4 family profiles, timeline posts, comments, 3-4 intel keys
  // Level 1 rule: clues are on the victim's own profile (easy to spot)
};

/**
 * Get FriendBook data for a Level 1 victim.
 * @param {string} victimName - The victim's name from VICTIM_NAMES
 * @returns {object|null} FriendBook data or null if not found
 */
export function getLevel1FriendBook(victimName) {
  return FRIENDBOOK_DATA[victimName] || null;
}
```

**Step 2: Author remaining 4 victims**

Complete the `FRIENDBOOK_DATA` object with entries for:
- `'Harold Patterson'` (78, Tucson AZ, male) — widower, son named Richard, grandsons
- `'Betty Nakamura'` (69, Portland OR, female) — husband alive, daughter Yuki, tech-illiterate
- `'Earl Washington'` (74, Atlanta GA, male) — widower, daughter Denise, grandson Marcus
- `"Margaret O'Brien"` (81, Boston MA, female) — widowed, son Patrick, great-grandchildren

Each victim must have:
- 3-4 connected family profiles with full bio/interests/groups
- 4-6 timeline posts per profile with realistic comments
- 3-4 intel keys with clues **on the victim's own profile** (Level 1 = easy)
- Intel boosts totaling roughly 38 (matching Dorothy's 15+10+8+5)

**Step 3: Commit**

```bash
git add src/config/friendbook/level1.js
git commit -m "feat(friendbook): hand-author Level 1 FriendBook data for all 5 victims"
```

---

## Task 3: Create FriendBook Data — Level 2

**Files:**
- Create: `src/config/friendbook/level2.js`

**Step 1: Author FriendBook data for all 4 Level 2 victims**

Level 2 (IRS Tax Scam) victims from `levels.js`:
- David Chen (42, Sacramento CA, male)
- Maria Gonzalez (38, Houston TX, female)
- James Wilson (45, Chicago IL, male)
- Priya Patel (41, Edison NJ, female)

**Level 2 difficulty: Key clues move to family member profiles.** The victim's own profile has general info, but the specific intel the player needs is on spouse/parent/sibling profiles.

Example intel keys for IRS victims:
- Filing status / recent tax activity (found on spouse's profile)
- Employer name (found on LinkedIn-style "About" of family member who works there)
- Recent large purchase that could seem like unreported income (found on partner's post)
- Name of their accountant or tax person (found in a comment thread on family profile)

Export: `getLevel2FriendBook(victimName)`

**Step 2: Commit**

```bash
git add src/config/friendbook/level2.js
git commit -m "feat(friendbook): hand-author Level 2 FriendBook data for all 4 victims"
```

---

## Task 4: Create FriendBook Data — Level 3

**Files:**
- Create: `src/config/friendbook/level3.js`

Level 3 (Tech Support) victims:
- Karen Thompson (35, Denver CO, female)
- Mike Rodriguez (48, Phoenix AZ, male)
- Susan Lee (52, Seattle WA, female)
- Tom Anderson (44, Minneapolis MN, male)

**Level 3 difficulty: Clues buried in comment threads.** The posts themselves seem innocent — the intel is in the replies and back-and-forth comments.

Example: Victim posts "My computer is acting weird again" — the useful intel is a nephew's reply: "Don't call those popup numbers again, remember last time you almost gave them your Chase login?"

Export: `getLevel3FriendBook(victimName)`

**Step 2: Commit**

```bash
git add src/config/friendbook/level3.js
git commit -m "feat(friendbook): hand-author Level 3 FriendBook data for all 4 victims"
```

---

## Task 5: Create FriendBook Data — Level 4

**Files:**
- Create: `src/config/friendbook/level4.js`

Level 4 (Romance Scam) victims:
- Linda Foster (56, Nashville TN, female)
- Robert Kim (48, San Diego CA, male)
- Patricia Martinez (62, Albuquerque NM, female)
- William Brooks (53, Charlotte NC, male)

**Level 4 difficulty: Clues on OTHER people's profiles about the victim.** The victim's own FriendBook profile is sparse (they're lonely, not very active). You have to check siblings/friends who post ABOUT the victim — "Thinking of you today sis, 2 years since Robert passed."

Export: `getLevel4FriendBook(victimName)`

**Step 2: Commit**

```bash
git add src/config/friendbook/level4.js
git commit -m "feat(friendbook): hand-author Level 4 FriendBook data for all 4 victims"
```

---

## Task 6: Create FriendBook Data — Level 5

**Files:**
- Create: `src/config/friendbook/level5.js`

Level 5 (CEO Fraud) victims:
- Sarah Mitchell, CFO (39, New York NY, female)
- Jennifer Walsh, CFO (44, San Francisco CA, female)
- Amanda Price, CFO (41, Boston MA, female)

**Level 5 difficulty: Clues require cross-referencing multiple profiles.** No single profile has the answer. One family member mentions a vacation destination, another mentions the CEO being unreachable — you piece together that the CEO is traveling and this is a window to impersonate them.

Export: `getLevel5FriendBook(victimName)`

**Step 2: Commit**

```bash
git add src/config/friendbook/level5.js
git commit -m "feat(friendbook): hand-author Level 5 FriendBook data for all 3 victims"
```

---

## Task 7: Create FriendBook Barrel Export

**Files:**
- Create: `src/config/friendbook/index.js`

**Step 1: Create barrel file**

```js
import { getLevel1FriendBook } from './level1.js';
import { getLevel2FriendBook } from './level2.js';
import { getLevel3FriendBook } from './level3.js';
import { getLevel4FriendBook } from './level4.js';
import { getLevel5FriendBook } from './level5.js';

const levelGetters = {
  1: getLevel1FriendBook,
  2: getLevel2FriendBook,
  3: getLevel3FriendBook,
  4: getLevel4FriendBook,
  5: getLevel5FriendBook,
};

/**
 * Get FriendBook data for a victim at a given level.
 * @param {number} level - Level number (1-5)
 * @param {string} victimName - The victim's name from VICTIM_NAMES
 * @returns {object|null} FriendBook data with profiles, posts, intelKeys
 */
export function getFriendBookData(level, victimName) {
  const getter = levelGetters[level];
  if (!getter) return null;
  return getter(victimName);
}
```

**Step 2: Commit**

```bash
git add src/config/friendbook/index.js
git commit -m "feat(friendbook): add barrel export for FriendBook data"
```

---

## Task 8: Build SocialNetworkScene — Core Layout

**Files:**
- Create: `src/scenes/SocialNetworkScene.js`

This is the largest task. Build it in stages.

**Step 1: Create the scene skeleton with browser chrome**

Create `src/scenes/SocialNetworkScene.js`:

```js
import Phaser from 'phaser';
import { gameState } from '../state/GameState.js';

export default class SocialNetworkScene extends Phaser.Scene {
  constructor() {
    super({ key: 'social-network' });
  }

  init(data) {
    this.friendbookData = data?.friendbookData;  // { profiles, posts, intelKeys }
    this.currentProfileId = data?.targetProfileId; // ID of the victim's profile
    this.levelNum = data?.level;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Semi-transparent background overlay
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5)
      .setInteractive()
      .on('pointerdown', () => {}); // Prevent click-through

    // Browser window dimensions
    this.browserX = 60;
    this.browserY = 30;
    this.browserW = width - 120;
    this.browserH = height - 60;

    this._drawBrowserChrome();
    this._drawFriendBookHeader();
    this._drawSearchBar();
    this._drawProfileArea();
    this._drawTabs();
    this._drawIntelTracker();

    // Show the target victim's profile initially
    this._showProfile(this.currentProfileId);
  }

  // ... methods defined in subsequent steps
}
```

**Step 2: Implement `_drawBrowserChrome()`**

Draw a browser-like window frame with:
- Light gray title bar with close button (red X), minimize, maximize dots
- URL bar showing "www.friendbook.com/profile/..."
- White body area

```js
_drawBrowserChrome() {
  const g = this.add.graphics();
  // Window shadow
  g.fillStyle(0x000000, 0.3);
  g.fillRoundedRect(this.browserX + 4, this.browserY + 4, this.browserW, this.browserH, 8);
  // Window body
  g.fillStyle(0xffffff, 1);
  g.fillRoundedRect(this.browserX, this.browserY, this.browserW, this.browserH, 8);
  // Title bar
  g.fillStyle(0xe8e8e8, 1);
  g.fillRoundedRect(this.browserX, this.browserY, this.browserW, 32, { tl: 8, tr: 8, bl: 0, br: 0 });

  // Close button (red circle)
  const closeBtn = this.add.circle(this.browserX + this.browserW - 20, this.browserY + 16, 7, 0xff5f57)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => this._close());
  // Minimize & maximize dots
  this.add.circle(this.browserX + this.browserW - 44, this.browserY + 16, 7, 0xffbd2e);
  this.add.circle(this.browserX + this.browserW - 68, this.browserY + 16, 7, 0x28c840);

  // URL bar
  g.fillStyle(0xffffff, 1);
  g.fillRoundedRect(this.browserX + 80, this.browserY + 6, this.browserW - 180, 20, 10);
  this.urlText = this.add.text(this.browserX + 92, this.browserY + 9, '🔒 www.friendbook.com', {
    fontSize: '11px', color: '#666666', fontFamily: 'Arial'
  });
}
```

**Step 3: Implement `_drawFriendBookHeader()`**

Blue Facebook-style header below the browser chrome:

```js
_drawFriendBookHeader() {
  const y = this.browserY + 32;
  const g = this.add.graphics();
  g.fillStyle(0x1877f2, 1);
  g.fillRect(this.browserX, y, this.browserW, 40);
  this.add.text(this.browserX + 16, y + 8, 'FriendBook', {
    fontSize: '22px', color: '#ffffff', fontFamily: 'Georgia', fontStyle: 'bold'
  });
}
```

**Step 4: Implement `_drawSearchBar()`**

Functional search bar in the FriendBook header. Uses a DOM element for text input:

```js
_drawSearchBar() {
  const headerY = this.browserY + 32;
  const searchX = this.browserX + 180;
  const searchY = headerY + 7;
  const searchW = 250;

  // Search bar background
  const g = this.add.graphics();
  g.fillStyle(0xffffff, 0.2);
  g.fillRoundedRect(searchX, searchY, searchW, 26, 13);

  // Search text (shows current search / hint)
  this.searchText = this.add.text(searchX + 12, searchY + 5, '🔍 Search FriendBook...', {
    fontSize: '13px', color: '#bbbbbb', fontFamily: 'Arial'
  });

  // Clickable area — opens search results dropdown
  this.add.rectangle(searchX + searchW / 2, searchY + 13, searchW, 26, 0xffffff, 0)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => this._openSearchDropdown());

  // Search results dropdown (hidden initially)
  this.searchDropdown = this.add.container(searchX, searchY + 30);
  this.searchDropdown.setVisible(false);
}
```

For the search dropdown, populate with all profile names from `this.friendbookData.profiles`. Clicking a name calls `this._showProfile(profileId)`.

**Step 5: Implement `_openSearchDropdown()` and `_showSearchResults()`**

```js
_openSearchDropdown() {
  // Clear existing dropdown items
  this.searchDropdown.removeAll(true);

  const profiles = this.friendbookData.profiles;
  const keys = Object.keys(profiles);
  let yOffset = 0;

  // Background panel
  const bg = this.add.graphics();
  bg.fillStyle(0xffffff, 1);
  bg.lineStyle(1, 0xdddddd, 1);
  bg.fillRoundedRect(0, 0, 250, keys.length * 36 + 8, 6);
  bg.strokeRoundedRect(0, 0, 250, keys.length * 36 + 8, 6);
  this.searchDropdown.add(bg);

  keys.forEach((id) => {
    const profile = profiles[id];
    const item = this.add.text(12, 8 + yOffset, `${profile.isTarget ? '⭐ ' : ''}${profile.name}`, {
      fontSize: '13px', color: '#1877f2', fontFamily: 'Arial'
    })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this._showProfile(id);
        this.searchDropdown.setVisible(false);
      })
      .on('pointerover', function() { this.setColor('#0a5dc2'); })
      .on('pointerout', function() { this.setColor('#1877f2'); });
    this.searchDropdown.add(item);
    yOffset += 36;
  });

  this.searchDropdown.setVisible(true);
  this.searchDropdown.setDepth(100);

  // Close dropdown when clicking elsewhere
  this.input.once('pointerdown', (pointer, objects) => {
    if (!objects.length) this.searchDropdown.setVisible(false);
  });
}
```

**Step 6: Implement `_close()`**

```js
_close() {
  this.cameras.main.fadeOut(150, 0, 0, 0);
  this.cameras.main.once('camerafadeoutcomplete', () => {
    this.scene.stop();
  });
}
```

**Step 7: Commit**

```bash
git add src/scenes/SocialNetworkScene.js
git commit -m "feat(friendbook): create SocialNetworkScene with browser chrome, header, and search"
```

---

## Task 9: Build SocialNetworkScene — Profile Display & Tabs

**Files:**
- Modify: `src/scenes/SocialNetworkScene.js`

**Step 1: Implement `_drawProfileArea()`**

The main content area below the FriendBook header. Has a cover area, profile pic, name, bio, and tab content area:

```js
_drawProfileArea() {
  const contentY = this.browserY + 72; // Below header
  const contentX = this.browserX + 1;
  const contentW = this.browserW - 2;

  // Cover photo area (gradient placeholder)
  const g = this.add.graphics();
  g.fillGradientStyle(0x1877f2, 0x42a5f5, 0x1565c0, 0x1877f2, 1, 1, 1, 1);
  g.fillRect(contentX, contentY, contentW, 80);

  // Profile pic area (left side) — will be filled by _showProfile
  this.profilePicContainer = this.add.container(contentX + 24, contentY + 40);

  // Name & bio area — will be filled by _showProfile
  this.profileNameText = this.add.text(contentX + 110, contentY + 82, '', {
    fontSize: '18px', color: '#1c1e21', fontFamily: 'Arial', fontStyle: 'bold'
  });
  this.profileBioText = this.add.text(contentX + 110, contentY + 104, '', {
    fontSize: '12px', color: '#65676b', fontFamily: 'Arial'
  });

  // Tab content container (scrollable area below tabs)
  this.tabContentY = contentY + 148;
  this.tabContentContainer = this.add.container(contentX + 16, this.tabContentY);

  // Mask for scrollable area
  const maskShape = this.make.graphics({ add: false });
  maskShape.fillRect(contentX, this.tabContentY, contentW, this.browserH - (this.tabContentY - this.browserY) - 8);
  this.tabContentContainer.setMask(new Phaser.Display.Masks.GeometryMask(this, maskShape));
  this.tabContentMaskBottom = this.browserY + this.browserH - 8;
}
```

**Step 2: Implement `_drawTabs()`**

Three clickable tabs: Timeline, About, Friends & Family:

```js
_drawTabs() {
  const tabY = this.browserY + 120;
  const tabX = this.browserX + 16;
  const tabs = ['Timeline', 'About', 'Friends & Family'];
  this.tabButtons = [];
  this.activeTab = 'Timeline';

  tabs.forEach((label, i) => {
    const x = tabX + i * 140;
    const text = this.add.text(x, tabY, label, {
      fontSize: '13px', color: i === 0 ? '#1877f2' : '#65676b',
      fontFamily: 'Arial', fontStyle: i === 0 ? 'bold' : 'normal'
    })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this._switchTab(label));
    this.tabButtons.push(text);
  });

  // Tab underline indicator
  this.tabIndicator = this.add.graphics();
  this._updateTabIndicator(0);
}

_switchTab(tabName) {
  this.activeTab = tabName;
  const idx = ['Timeline', 'About', 'Friends & Family'].indexOf(tabName);
  this.tabButtons.forEach((btn, i) => {
    btn.setColor(i === idx ? '#1877f2' : '#65676b');
    btn.setFontStyle(i === idx ? 'bold' : 'normal');
  });
  this._updateTabIndicator(idx);
  this._renderTabContent();
}

_updateTabIndicator(idx) {
  this.tabIndicator.clear();
  this.tabIndicator.fillStyle(0x1877f2, 1);
  this.tabIndicator.fillRect(this.browserX + 16 + idx * 140, this.browserY + 138, 80, 3);
}
```

**Step 3: Implement `_showProfile(profileId)`**

Updates the profile display and renders the active tab for a given profile:

```js
_showProfile(profileId) {
  const profile = this.friendbookData.profiles[profileId];
  if (!profile) return;

  this.currentProfileId = profileId;

  // Update URL bar
  this.urlText.setText(`🔒 www.friendbook.com/${profile.name.toLowerCase().replace(/\s+/g, '.')}`);

  // Update profile pic
  this.profilePicContainer.removeAll(true);
  if (profile.portraitKey && this.textures.exists(profile.portraitKey)) {
    const pic = this.add.image(0, 0, profile.portraitKey).setDisplaySize(72, 72);
    // Circular mask
    const mask = this.make.graphics({ add: false });
    mask.fillCircle(this.profilePicContainer.x, this.profilePicContainer.y, 36);
    pic.setMask(new Phaser.Display.Masks.GeometryMask(this, mask));
    this.profilePicContainer.add(pic);
  } else {
    // Programmatic avatar: colored circle + initials
    const initials = profile.name.split(' ').map(w => w[0]).join('').substring(0, 2);
    const colors = [0x1877f2, 0x42b72a, 0xf02849, 0xf7b928, 0x8b5cf6];
    const color = colors[profileId.length % colors.length];
    const circle = this.add.circle(0, 0, 36, color);
    const text = this.add.text(0, 0, initials, {
      fontSize: '24px', color: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.profilePicContainer.add([circle, text]);
  }

  // Update name & bio
  this.profileNameText.setText(`${profile.name}${profile.isTarget ? ' ⭐' : ''}`);
  this.profileBioText.setText(profile.bio || '');

  // Reset to Timeline tab
  this._switchTab('Timeline');
}
```

**Step 4: Implement `_renderTabContent()`**

Routes to the correct tab renderer:

```js
_renderTabContent() {
  this.tabContentContainer.removeAll(true);
  this.tabContentContainer.setY(this.tabContentY);
  this.tabScrollOffset = 0;

  switch (this.activeTab) {
    case 'Timeline': this._renderTimeline(); break;
    case 'About': this._renderAbout(); break;
    case 'Friends & Family': this._renderFriends(); break;
  }

  // Enable scroll on the content area
  this._enableScroll();
}
```

**Step 5: Commit**

```bash
git add src/scenes/SocialNetworkScene.js
git commit -m "feat(friendbook): add profile display, tabs, and search navigation"
```

---

## Task 10: Build SocialNetworkScene — Tab Content Renderers

**Files:**
- Modify: `src/scenes/SocialNetworkScene.js`

**Step 1: Implement `_renderTimeline()`**

Renders posts and comments for the current profile. Each post is a card with author, text, timestamp, likes, and comments. Posts with `intel` markers trigger `markIntelSeen()` when scrolled into view.

```js
_renderTimeline() {
  const posts = this.friendbookData.posts[this.currentProfileId] || [];
  const contentW = this.browserW - 50;
  let yOffset = 0;

  posts.forEach((post) => {
    // Post card background
    const cardBg = this.add.graphics();
    const cardH = this._estimatePostHeight(post, contentW);
    cardBg.fillStyle(0xffffff, 1);
    cardBg.lineStyle(1, 0xe4e6eb, 1);
    cardBg.fillRoundedRect(0, yOffset, contentW, cardH, 8);
    cardBg.strokeRoundedRect(0, yOffset, contentW, cardH, 8);
    this.tabContentContainer.add(cardBg);

    // Author name
    const profile = this.friendbookData.profiles[this.currentProfileId];
    const authorText = this.add.text(48, yOffset + 10, profile.name, {
      fontSize: '13px', color: '#1c1e21', fontFamily: 'Arial', fontStyle: 'bold'
    });
    this.tabContentContainer.add(authorText);

    // Author avatar (small)
    const avatarCircle = this.add.circle(20, yOffset + 20, 16, 0x1877f2);
    const avatarInitials = this.add.text(20, yOffset + 20,
      profile.name.split(' ').map(w => w[0]).join('').substring(0, 2), {
        fontSize: '11px', color: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold'
      }).setOrigin(0.5);
    this.tabContentContainer.add([avatarCircle, avatarInitials]);

    // Timestamp
    const timeText = this.add.text(48, yOffset + 26, post.time, {
      fontSize: '11px', color: '#65676b', fontFamily: 'Arial'
    });
    this.tabContentContainer.add(timeText);

    // Post text (word-wrapped)
    const postText = this.add.text(12, yOffset + 48, post.text, {
      fontSize: '13px', color: '#1c1e21', fontFamily: 'Arial',
      wordWrap: { width: contentW - 24 }
    });
    this.tabContentContainer.add(postText);

    // Likes
    const likeY = yOffset + 48 + postText.height + 8;
    const likeText = this.add.text(12, likeY, `👍 ${post.likes}`, {
      fontSize: '12px', color: '#65676b', fontFamily: 'Arial'
    });
    this.tabContentContainer.add(likeText);

    // Comments
    let commentY = likeY + 24;
    if (post.comments && post.comments.length > 0) {
      // Divider line
      const divider = this.add.graphics();
      divider.lineStyle(1, 0xe4e6eb, 1);
      divider.lineBetween(12, commentY - 4, contentW - 12, commentY - 4);
      this.tabContentContainer.add(divider);

      post.comments.forEach((comment) => {
        const authorProfile = this.friendbookData.profiles[comment.author];
        const commenterName = authorProfile ? authorProfile.name : comment.author;
        const commentAuthor = this.add.text(12, commentY, commenterName, {
          fontSize: '12px', color: '#1877f2', fontFamily: 'Arial', fontStyle: 'bold'
        })
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => this._showProfile(comment.author));
        this.tabContentContainer.add(commentAuthor);

        const commentText = this.add.text(12 + commentAuthor.width + 6, commentY, comment.text, {
          fontSize: '12px', color: '#1c1e21', fontFamily: 'Arial',
          wordWrap: { width: contentW - commentAuthor.width - 30 }
        });
        this.tabContentContainer.add(commentText);

        // Check if this comment has intel (for comments that are intel-bearing)
        // Intel on comments is handled via the post's intel field
        commentY += commentText.height + 8;
      });
    }

    // Track this post's position for intel seen detection
    if (post.intel) {
      this._trackIntelVisibility(post.intel.key, yOffset, yOffset + cardH);
    }

    yOffset += cardH + 12;
  });

  this.tabContentTotalHeight = yOffset;
}
```

**Step 2: Implement `_estimatePostHeight(post, width)`**

Helper to estimate card height for layout:

```js
_estimatePostHeight(post, width) {
  // Rough estimation: header(44) + text(~20 per line) + likes(28) + comments(24 each) + padding
  const charsPerLine = Math.floor((width - 24) / 7);
  const textLines = Math.ceil(post.text.length / charsPerLine);
  const commentLines = (post.comments || []).length;
  return 44 + textLines * 20 + 28 + commentLines * 28 + 16;
}
```

**Step 3: Implement `_renderAbout()`**

Shows profile details (birthday, location, workplace, interests, groups, check-ins):

```js
_renderAbout() {
  const profile = this.friendbookData.profiles[this.currentProfileId];
  if (!profile) return;
  const contentW = this.browserW - 50;
  let yOffset = 0;

  const sections = [
    { icon: '🎂', label: 'Birthday', value: profile.birthday },
    { icon: '📍', label: 'Lives in', value: profile.location },
    { icon: '💍', label: 'Relationship', value: profile.relationship },
    { icon: '💼', label: 'Workplace', value: profile.workplace },
    { icon: '⭐', label: 'Interests', value: (profile.interests || []).join(', ') },
    { icon: '👥', label: 'Groups', value: (profile.groups || []).join(', ') },
    { icon: '📌', label: 'Check-ins', value: (profile.checkIns || []).join(', ') },
  ];

  sections.forEach(({ icon, label, value }) => {
    if (!value) return;
    const line = this.add.text(12, yOffset, `${icon}  ${label}: ${value}`, {
      fontSize: '13px', color: '#1c1e21', fontFamily: 'Arial',
      wordWrap: { width: contentW - 24 }
    });
    this.tabContentContainer.add(line);
    yOffset += line.height + 12;
  });

  this.tabContentTotalHeight = yOffset;
}
```

**Step 4: Implement `_renderFriends()`**

Shows clickable friend/family list with mini avatars:

```js
_renderFriends() {
  const profile = this.friendbookData.profiles[this.currentProfileId];
  if (!profile || !profile.friends) return;
  const contentW = this.browserW - 50;
  let yOffset = 0;

  const title = this.add.text(12, yOffset, 'Friends & Family', {
    fontSize: '15px', color: '#1c1e21', fontFamily: 'Arial', fontStyle: 'bold'
  });
  this.tabContentContainer.add(title);
  yOffset += 30;

  profile.friends.forEach((friendId) => {
    const friend = this.friendbookData.profiles[friendId];
    if (!friend) return;

    // Clickable row
    const colors = [0x1877f2, 0x42b72a, 0xf02849, 0xf7b928, 0x8b5cf6];
    const color = colors[friendId.length % colors.length];
    const avatar = this.add.circle(24, yOffset + 18, 16, color);
    const initials = this.add.text(24, yOffset + 18,
      friend.name.split(' ').map(w => w[0]).join('').substring(0, 2), {
        fontSize: '10px', color: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold'
      }).setOrigin(0.5);
    const nameText = this.add.text(48, yOffset + 6, friend.name, {
      fontSize: '13px', color: '#1877f2', fontFamily: 'Arial', fontStyle: 'bold'
    })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this._showProfile(friendId));
    const bioText = this.add.text(48, yOffset + 22, friend.bio || '', {
      fontSize: '11px', color: '#65676b', fontFamily: 'Arial'
    });

    this.tabContentContainer.add([avatar, initials, nameText, bioText]);
    yOffset += 44;
  });

  this.tabContentTotalHeight = yOffset;
}
```

**Step 5: Implement scroll handling**

```js
_enableScroll() {
  // Remove previous scroll listener if any
  if (this._scrollListener) {
    this.input.off('wheel', this._scrollListener);
  }
  this._scrollListener = (pointer, gameObjects, deltaX, deltaY) => {
    const maxScroll = Math.max(0, this.tabContentTotalHeight - (this.tabContentMaskBottom - this.tabContentY));
    this.tabScrollOffset = Phaser.Math.Clamp(this.tabScrollOffset + deltaY * 0.5, 0, maxScroll);
    this.tabContentContainer.setY(this.tabContentY - this.tabScrollOffset);

    // Check intel visibility after scroll
    this._checkIntelVisibility();
  };
  this.input.on('wheel', this._scrollListener);
}
```

**Step 6: Implement intel visibility tracking**

```js
_trackIntelVisibility(key, topY, bottomY) {
  if (!this._intelZones) this._intelZones = [];
  this._intelZones.push({ key, topY, bottomY });
}

_checkIntelVisibility() {
  if (!this._intelZones) return;
  const viewTop = this.tabScrollOffset;
  const viewBottom = viewTop + (this.tabContentMaskBottom - this.tabContentY);

  this._intelZones.forEach(({ key, topY, bottomY }) => {
    // If the post is at least partially visible
    if (bottomY > viewTop && topY < viewBottom) {
      gameState.markIntelSeen(key);
    }
  });
}
```

**Step 7: Commit**

```bash
git add src/scenes/SocialNetworkScene.js
git commit -m "feat(friendbook): add timeline, about, friends tabs with scroll and intel tracking"
```

---

## Task 11: Build SocialNetworkScene — Intel Tracker Panel

**Files:**
- Modify: `src/scenes/SocialNetworkScene.js`

**Step 1: Implement `_drawIntelTracker()`**

Small dossier panel in the top-right corner of the browser window:

```js
_drawIntelTracker() {
  const trackerX = this.browserX + this.browserW - 180;
  const trackerY = this.browserY + 76;
  this.intelTrackerContainer = this.add.container(trackerX, trackerY);

  // Background panel
  const bg = this.add.graphics();
  bg.fillStyle(0xfffde7, 1); // Light yellow (sticky note)
  bg.lineStyle(1, 0xe0d68a, 1);
  bg.fillRoundedRect(0, 0, 165, 30 + this.friendbookData.intelKeys.length * 22, 6);
  bg.strokeRoundedRect(0, 0, 165, 30 + this.friendbookData.intelKeys.length * 22, 6);
  this.intelTrackerContainer.add(bg);

  // Header
  const header = this.add.text(8, 6, '📋 Intel', {
    fontSize: '12px', color: '#5d4037', fontFamily: 'Arial', fontStyle: 'bold'
  });
  this.intelTrackerContainer.add(header);

  // Count
  this.intelCountText = this.add.text(120, 6, '0/' + this.friendbookData.intelKeys.length, {
    fontSize: '11px', color: '#8d6e63', fontFamily: 'Arial'
  });
  this.intelTrackerContainer.add(this.intelCountText);

  // Intel items
  this.intelItemTexts = {};
  this.friendbookData.intelKeys.forEach((intel, i) => {
    const y = 28 + i * 22;
    const text = this.add.text(8, y, '🔒 ???', {
      fontSize: '11px', color: '#999999', fontFamily: 'Arial'
    });
    this.intelTrackerContainer.add(text);
    this.intelItemTexts[intel.key] = text;
  });

  this.intelTrackerContainer.setDepth(50);

  // Listen for intel events
  gameState.on('intel_seen', this._onIntelSeen, this);
  gameState.on('intel_used', this._onIntelUsed, this);
}

_onIntelSeen(key) {
  const intel = this.friendbookData.intelKeys.find(i => i.key === key);
  if (!intel) return;
  const text = this.intelItemTexts[key];
  if (text && !gameState.intelUsed.has(key)) {
    text.setText(`👁 ${intel.description}`);
    text.setColor('#5d4037');
  }
  this._updateIntelCount();
}

_onIntelUsed(key) {
  const intel = this.friendbookData.intelKeys.find(i => i.key === key);
  if (!intel) return;
  const text = this.intelItemTexts[key];
  if (text) {
    text.setText(`✅ ${intel.description}`);
    text.setColor('#2e7d32');
  }
  this._updateIntelCount();
}

_updateIntelCount() {
  const seen = gameState.intelSeen.size;
  const used = gameState.intelUsed.size;
  const total = this.friendbookData.intelKeys.length;
  this.intelCountText.setText(`${seen}/${total}`);
}
```

**Step 2: Clean up event listeners on scene shutdown**

Add to the scene:

```js
shutdown() {
  gameState.off('intel_seen', this._onIntelSeen, this);
  gameState.off('intel_used', this._onIntelUsed, this);
  if (this._scrollListener) {
    this.input.off('wheel', this._scrollListener);
  }
}
```

**Step 3: Commit**

```bash
git add src/scenes/SocialNetworkScene.js
git commit -m "feat(friendbook): add intel tracker panel with seen/used states"
```

---

## Task 12: Wire SocialNetworkScene into OfficeScene

**Files:**
- Modify: `src/scenes/OfficeScene.js`
- Modify: `src/main.js`

**Step 1: Register the scene in `main.js`**

In `src/main.js`, import and add to the scene array (line ~18):

```js
import SocialNetworkScene from './scenes/SocialNetworkScene.js';
```

Add to the `scene` array:

```js
scene: [BootScene, MenuScene, SettingsScene, BriefingScene, OfficeScene, CallScene, TechDesktopScene, SocialNetworkScene, ResultsScene, GameOverScene],
```

**Step 2: Make the monitor clickable in OfficeScene**

In `src/scenes/OfficeScene.js`, find the `_drawMonitor()` method (~line 217). After drawing the monitor, add a clickable zone:

```js
// Make monitor interactive for FriendBook
this.monitorHitZone = this.add.rectangle(width / 2, height * 0.38, 200, 130, 0xffffff, 0)
  .setInteractive({ useHandCursor: true })
  .on('pointerdown', () => this._openFriendBook());
```

Add a subtle glow/label hint:

```js
this.monitorHint = this.add.text(width / 2, height * 0.38 + 70, '💻 Click to open FriendBook', {
  fontSize: '10px', color: '#00ff00', fontFamily: 'monospace'
}).setOrigin(0.5).setAlpha(0.7);
```

**Step 3: Implement `_openFriendBook()` in OfficeScene**

```js
_openFriendBook() {
  // Don't open if already open
  if (this.scene.isActive('social-network')) return;

  // Get the current victim's FriendBook data
  const victim = this._getCurrentVictimForFriendBook();
  if (!victim || !victim.friendbookData) return;

  this.scene.launch('social-network', {
    friendbookData: victim.friendbookData,
    targetProfileId: victim.targetProfileId,
    level: this.levelNum
  });
}
```

**Step 4: Implement `_getCurrentVictimForFriendBook()`**

This needs to work both before a call (using the next queued victim) and during a call (using the current victim):

```js
_getCurrentVictimForFriendBook() {
  // During a call, use the current victim
  if (this.callInProgress && gameState.currentVictim) {
    return this._loadFriendBookForVictim(gameState.currentVictim);
  }

  // Before a call, pre-load the next victim
  // We need to pick the victim early so FriendBook data is available before the call
  if (!this._preSelectedVictim) {
    const { getRandomVictim } = require('../config/levels.js');
    this._preSelectedVictim = getRandomVictim(this.levelNum);
  }
  return this._loadFriendBookForVictim(this._preSelectedVictim);
}

_loadFriendBookForVictim(victim) {
  if (!victim) return null;
  const { getFriendBookData } = require('../config/friendbook/index.js');
  const friendbookData = getFriendBookData(this.levelNum, victim.name);
  if (!friendbookData) return null;

  // Find the target profile ID
  const targetProfileId = Object.keys(friendbookData.profiles)
    .find(id => friendbookData.profiles[id].isTarget);

  return { friendbookData, targetProfileId };
}
```

> **Note:** Since this project uses ES modules (not CommonJS), replace `require()` with proper imports at the top of OfficeScene.js:
> ```js
> import { getFriendBookData } from '../config/friendbook/index.js';
> ```
> And use it directly in the methods.

**Step 5: Pre-select victims for FriendBook browsing**

Modify `_answerPhone()` to use the pre-selected victim if one exists, instead of picking a new random one. In `_answerPhone()` (around line 658):

```js
// Use pre-selected victim if available (player may have browsed their FriendBook)
const victim = this._preSelectedVictim || getRandomVictim(this.levelNum);
this._preSelectedVictim = null; // Clear for next call
```

Also, after the call starts and victim is determined, initialize intel on GameState:

```js
const friendbookData = getFriendBookData(this.levelNum, victim.name);
if (friendbookData) {
  gameState.initIntel(friendbookData.intelKeys);
}
```

**Step 6: Auto-close SocialNetworkScene on call end**

In the existing `call_end` handler in OfficeScene, add:

```js
if (this.scene.isActive('social-network')) {
  this.scene.stop('social-network');
}
```

**Step 7: Commit**

```bash
git add src/main.js src/scenes/OfficeScene.js
git commit -m "feat(friendbook): wire SocialNetworkScene into OfficeScene with monitor click"
```

---

## Task 13: Add `intel_triggered` to Voice/Prompt Pipeline

**Files:**
- Modify: `src/voice/VoiceManager.js`
- Modify: `src/config/prompts/index.js`
- Modify: `src/config/prompts/level1.js` (and level2-5)

**Step 1: Pass intel data through to prompt config**

In `src/config/prompts/index.js`, update the signature:

```js
export function getPromptConfig(level, name, age, location, gender, intelTriggers) {
  const configFn = levelConfigs[level];
  if (!configFn) throw new Error(`Unknown level: ${level}`);
  return configFn(name, age, location, gender, intelTriggers);
}
```

**Step 2: Add `intel_triggered` to the `update_game_state` tool definition**

In `src/config/prompts/level1.js`, add to the `UPDATE_GAME_STATE_TOOL.parameters.properties` (after the `event` property, around line 48):

```js
intel_triggered: {
  type: ['string', 'null'],
  description: 'If the caller referenced a specific personal detail that you recognized (family member name, personal event, etc.), report which intel was triggered. Use null for normal conversation.',
},
```

Add `intel_triggered` to the `required` array is NOT needed — keep it optional. But DO add it to the tool description to make the AI aware.

**Step 3: Add intel trigger section to Level 1 prompt**

In the `getPromptConfig()` function of `level1.js`, accept the new `intelTriggers` parameter and append to the instructions:

```js
function getPromptConfig(victimName, victimAge, victimLocation, victimGender, intelTriggers) {
  let instructions = `...existing prompt...`;

  // Append intel triggers section if provided
  if (intelTriggers && intelTriggers.length > 0) {
    instructions += `\n\nINTEL TRIGGERS:
The caller may have researched you on social media. They may know personal details about your life.
React naturally to personal details they mention. When they reference something personal and specific:

${intelTriggers.map(t => `- ${t.description}: If the caller references this detail naturally, feel a warm connection and increased trust. Call update_game_state with compliance_delta +${Math.round(t.boost * 0.6)}, suspicion_delta -${Math.round(t.boost * 0.4)}, and intel_triggered: "${t.key}"`).join('\n')}

IMPORTANT: If the caller uses personal details in a CREEPY, FORCED, or UNNATURAL way (like reading a list of facts about you), get SCARED:
"How do you know that?! Who IS this?!" → Call update_game_state with suspicion_delta +20, compliance_delta -10, intel_triggered: null`;
  }

  return {
    instructions,
    tools: [UPDATE_GAME_STATE_TOOL],
    voice: victimGender === 'male' ? 'echo' : 'alloy',
  };
}
```

**Step 4: Repeat for levels 2-5**

Apply the same changes to each level prompt file:
- Add `intel_triggered` to `UPDATE_GAME_STATE_TOOL.parameters.properties`
- Accept `intelTriggers` parameter in `getPromptConfig()`
- Append the intel triggers section to the instructions string

Each level file has its own copy of `UPDATE_GAME_STATE_TOOL` — update each one.

**Step 5: Pass intel triggers from VoiceManager**

In `src/voice/VoiceManager.js`, in the `startCall()` method (around line 152-156), after getting the victim and building the prompt config, pass intel data:

```js
import { getFriendBookData } from '../config/friendbook/index.js';

// In startCall():
const friendbookData = getFriendBookData(level, victim.name);
const intelTriggers = friendbookData ? friendbookData.intelKeys : [];
const config = getPromptConfig(level, victim.name, victim.age, victim.location, victim.gender, intelTriggers);
```

**Step 6: Handle `intel_triggered` in VoiceManager's message handler**

In `handleDataChannelMessage()` (around line 398-408), when dispatching to `onGameStateUpdate`, the `intel_triggered` field is already part of the parsed arguments object. GameState's `updateFromAI()` (modified in Task 1) will pick it up. No additional changes needed in VoiceManager if it passes the full args object.

Verify that the dispatch looks like:

```js
if (fnName === 'update_game_state') {
  this.onGameStateUpdate(args); // args includes intel_triggered
}
```

**Step 7: Commit**

```bash
git add src/voice/VoiceManager.js src/config/prompts/index.js src/config/prompts/level1.js src/config/prompts/level2.js src/config/prompts/level3.js src/config/prompts/level4.js src/config/prompts/level5.js
git commit -m "feat(friendbook): add intel_triggered to update_game_state tool and all level prompts"
```

---

## Task 14: Add Intel Tracker to CallScene

**Files:**
- Modify: `src/scenes/CallScene.js`

**Step 1: Add an intel tracker mini-panel to CallScene**

During calls, show a small intel status indicator so the player knows what intel they've gathered and used. Add in `create()` (after creating other UI elements):

```js
this._createIntelPanel();
```

**Step 2: Implement `_createIntelPanel()`**

```js
_createIntelPanel() {
  if (!gameState.intelKeys || gameState.intelKeys.length === 0) return;

  const panelX = 16;
  const panelY = this.cameras.main.height - 160;
  this.intelPanel = this.add.container(panelX, panelY);

  // Background
  const bg = this.add.graphics();
  const panelH = 28 + gameState.intelKeys.length * 20;
  bg.fillStyle(0x000000, 0.7);
  bg.fillRoundedRect(0, 0, 180, panelH, 6);
  this.intelPanel.add(bg);

  // Header
  const header = this.add.text(8, 5, '📋 Intel', {
    fontSize: '11px', color: '#ffd54f', fontFamily: 'monospace', fontStyle: 'bold'
  });
  this.intelPanel.add(header);

  // Items
  this.callIntelTexts = {};
  gameState.intelKeys.forEach((intel, i) => {
    const y = 24 + i * 20;
    const state = gameState.intelUsed.has(intel.key) ? '✅' :
                  gameState.intelSeen.has(intel.key) ? '👁' : '🔒';
    const label = gameState.intelSeen.has(intel.key) ? intel.description : '???';
    const text = this.add.text(8, y, `${state} ${label}`, {
      fontSize: '10px', color: '#cccccc', fontFamily: 'monospace'
    });
    this.intelPanel.add(text);
    this.callIntelTexts[intel.key] = text;
  });

  // Listen for updates
  gameState.on('intel_seen', this._onCallIntelSeen, this);
  gameState.on('intel_used', this._onCallIntelUsed, this);
}

_onCallIntelSeen(key) {
  const intel = gameState.intelKeys.find(i => i.key === key);
  const text = this.callIntelTexts[key];
  if (intel && text) {
    text.setText(`👁 ${intel.description}`);
  }
}

_onCallIntelUsed(key) {
  const intel = gameState.intelKeys.find(i => i.key === key);
  const text = this.callIntelTexts[key];
  if (intel && text) {
    text.setText(`✅ ${intel.description}`);
    text.setColor('#66bb6a');
    // Satisfying flash animation
    this.tweens.add({
      targets: text,
      scaleX: 1.2, scaleY: 1.2,
      duration: 150,
      yoyo: true,
      ease: 'Quad.easeOut'
    });
  }
}
```

**Step 3: Clean up event listeners in `_onCallEnd`**

In the existing `_onCallEnd` method, add:

```js
gameState.off('intel_seen', this._onCallIntelSeen, this);
gameState.off('intel_used', this._onCallIntelUsed, this);
```

**Step 4: Commit**

```bash
git add src/scenes/CallScene.js
git commit -m "feat(friendbook): add intel tracker mini-panel to CallScene"
```

---

## Task 15: Integration Testing & Polish

**Files:**
- All modified files

**Step 1: Run the dev server**

```bash
npm start
```

**Step 2: Manual test checklist**

Test in the browser at `http://localhost:5173`:

- [ ] Monitor is clickable in OfficeScene before a call
- [ ] FriendBook opens showing the victim's profile
- [ ] Search bar works — can navigate to family member profiles
- [ ] Timeline tab shows posts with comments
- [ ] About tab shows profile details
- [ ] Friends & Family tab shows clickable links to other profiles
- [ ] Scrolling works on long timelines
- [ ] Intel tracker shows 🔒 for undiscovered items
- [ ] Scrolling past an intel-bearing post changes it to 👁
- [ ] Close button (X) closes FriendBook
- [ ] FriendBook is accessible during a call
- [ ] Intel tracker appears in CallScene during calls
- [ ] When player mentions intel detail, AI sends `intel_triggered` and tracker updates to ✅
- [ ] Using details awkwardly increases suspicion
- [ ] FriendBook auto-closes when call ends
- [ ] Works on all 5 levels

**Step 3: Fix any issues found during testing**

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix(friendbook): polish and fix integration issues"
```

---

## Task 16: Final Commit & Cleanup

**Step 1: Verify no console errors in dev tools**

**Step 2: Update CLAUDE.md**

Add FriendBook to the architecture section and scene flow:

```
OfficeScene ↔ CallScene → ResultsScene
    ↕
SocialNetworkScene (FriendBook overlay)
TechDesktopScene
```

Add a section documenting:
- FriendBook data location (`src/config/friendbook/`)
- Intel tracking system on GameState
- How `intel_triggered` works in the prompt pipeline

**Step 3: Final commit**

```bash
git add -A
git commit -m "docs: update CLAUDE.md with FriendBook feature documentation"
```
