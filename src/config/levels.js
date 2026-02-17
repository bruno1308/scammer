/**
 * levels.js - Unified Floor / Victim Configuration
 *
 * Single source of truth for all game progression data.
 * Structured around 5 FLOORS (scam types), each containing multiple VICTIMS.
 *
 * Economy tables (expenses, payouts) are from:
 *   docs/plans/2026-02-17-papers-please-economy-design.md
 */

// ---------------------------------------------------------------------------
// FLOORS — the single source of truth
// ---------------------------------------------------------------------------

export const FLOORS = {
  1: {
    name: 'Gift Card Refund',
    subtitle: 'Tutorial',
    scamType: 'gift_card',

    // Shift config
    shiftDurationSec: 300,  // 5 minutes, constant all floors
    basePayout: 200,
    suspicionStart: 15,
    complianceStart: 30,

    // Expenses (deducted end of each shift)
    expenses: {
      bunkFee: 80,
      food: 40,
      debtRepayment: 150,
      protectionFee: 0,
      equipmentLevy: 0,
    },

    // Flags
    hasTutorial: true,
    hasDesktop: false,

    // Briefing
    briefing: {
      title: 'YOUR FIRST DAY',
      bossDialogue: [
        '"Welcome to your new home, fresh meat."',
        '"You owe us two thousand dollars for your travel expenses."',
        '"The only way you pay that off is by working the phones."',
        '"Today is simple. Gift card refund scam. Follow the script."',
        '"The clock starts when you sit down. Make every minute count."',
        '"And don\'t even think about running. There\'s nowhere to go."',
      ],
      scriptNotes: [
        "Introduce yourself as 'Amazon Customer Service'",
        "Reference a recent purchase they made",
        "Explain there was a billing error — they were overcharged $499.99",
        "Say a refund was issued but the system sent too much ($3,000)",
        "Ask them to buy gift cards to return the extra — read codes over the phone",
      ],
    },

    // Victims (order doesn't matter — shuffled at runtime)
    victims: [
      { name: 'Dorothy Miller', age: 72, location: 'Des Moines, Iowa', portraitIdx: 1, gender: 'female' },
      { name: 'Harold Patterson', age: 78, location: 'Tucson, Arizona', portraitIdx: 2, gender: 'male' },
      { name: 'Betty Nakamura', age: 69, location: 'Portland, Oregon', portraitIdx: 3, gender: 'female' },
      { name: 'Earl Washington', age: 74, location: 'Atlanta, Georgia', portraitIdx: 4, gender: 'male' },
      { name: "Margaret O'Brien", age: 81, location: 'Boston, Massachusetts', portraitIdx: 5, gender: 'female' },
    ],
  },

  2: {
    name: 'IRS Tax Scam',
    subtitle: 'Medium',
    scamType: 'irs',

    shiftDurationSec: 300,
    basePayout: 350,
    suspicionStart: 30,
    complianceStart: 10,

    expenses: {
      bunkFee: 100,
      food: 45,
      debtRepayment: 200,
      protectionFee: 0,
      equipmentLevy: 0,
    },

    hasTutorial: false,
    hasDesktop: false,

    briefing: {
      title: 'MOVING UP',
      bossDialogue: [
        '"Not bad. You survived your first floor."',
        '"Your debt has been restructured. You owe more now."',
        '"Today: IRS Tax Scam. Scare them. Make them pay."',
        '"These marks are tougher. Watch your suspicion meter."',
        '"Oh, and your bunk fee went up. Welcome to the corner suite."',
      ],
      scriptNotes: [
        "You are 'Agent' from the IRS",
        "They owe back taxes — be specific with fake amounts",
        "A warrant has been issued — arrest TODAY",
        "Payment must be immediate to avoid arrest",
        "Accept gift cards or wire transfer",
      ],
    },

    victims: [
      { name: 'David Chen', age: 42, location: 'Sacramento, California', portraitIdx: 1, gender: 'male' },
      { name: 'Maria Gonzalez', age: 38, location: 'Houston, Texas', portraitIdx: 2, gender: 'female' },
      { name: 'James Wilson', age: 45, location: 'Chicago, Illinois', portraitIdx: 3, gender: 'male' },
      { name: 'Priya Patel', age: 41, location: 'Edison, New Jersey', portraitIdx: 4, gender: 'female' },
    ],
  },

  3: {
    name: 'Tech Support',
    subtitle: 'Medium-Hard',
    scamType: 'tech_support',

    shiftDurationSec: 300,
    basePayout: 400,
    suspicionStart: 15,
    complianceStart: 25,

    expenses: {
      bunkFee: 120,
      food: 50,
      debtRepayment: 250,
      protectionFee: 80,
      equipmentLevy: 0,
    },

    hasTutorial: false,
    hasDesktop: true,

    briefing: {
      title: 'THE TECH DESK',
      bossDialogue: [
        '"New expense today. Protection fee."',
        '"Cops have been sniffing around. Everyone chips in."',
        '"Today: Tech Support. You\'re Microsoft. Sound helpful."',
        '"Show them scary errors, sell the protection plan."',
        '"And no, the protection fee is NOT optional."',
      ],
      scriptNotes: [
        "You are 'Windows Technical Support'",
        "Have them open Event Viewer (scary errors!)",
        "Run netstat (foreign connections = hackers!)",
        "Open fake antivirus scan (47 threats found!)",
        "Sell $299 protection plan via payment form",
      ],
    },

    victims: [
      { name: 'Karen Thompson', age: 35, location: 'Denver, Colorado', portraitIdx: 2, gender: 'female' },
      { name: 'Mike Rodriguez', age: 48, location: 'Phoenix, Arizona', portraitIdx: 1, gender: 'male' },
      { name: 'Susan Lee', age: 52, location: 'Seattle, Washington', portraitIdx: 4, gender: 'female' },
      { name: 'Tom Anderson', age: 44, location: 'Minneapolis, Minnesota', portraitIdx: 3, gender: 'male' },
    ],
  },

  4: {
    name: 'Romance Scam',
    subtitle: 'Hard',
    scamType: 'romance',

    shiftDurationSec: 300,
    basePayout: 800,
    suspicionStart: 10,
    complianceStart: 15,

    expenses: {
      bunkFee: 150,
      food: 55,
      debtRepayment: 300,
      protectionFee: 100,
      equipmentLevy: 50,
    },

    hasTutorial: false,
    hasDesktop: false,

    briefing: {
      title: 'THE LONG CON',
      bossDialogue: [
        '"This one\'s different. Romance scam."',
        '"You\'re pretending to be someone they love."',
        '"Build the connection. Make them feel special. Then ask for money."',
        '"Big payouts here. You might make a dent in your debt."',
        '"...I said MIGHT."',
      ],
      scriptNotes: [
        "You are 'Captain James Mitchell' (or similar)",
        "Reference your 'past conversations' with them",
        "Stay consistent with your backstory",
        "Build emotional connection BEFORE asking for money",
        "Never agree to video call — always have an excuse",
      ],
    },

    victims: [
      { name: 'Linda Foster', age: 56, location: 'Nashville, Tennessee', portraitIdx: 1, gender: 'female' },
      { name: 'Robert Kim', age: 48, location: 'San Diego, California', portraitIdx: 2, gender: 'male' },
      { name: 'Patricia Martinez', age: 62, location: 'Albuquerque, New Mexico', portraitIdx: 3, gender: 'female' },
      { name: 'William Brooks', age: 53, location: 'Charlotte, North Carolina', portraitIdx: 2, gender: 'male' },
    ],
  },

  5: {
    name: 'CEO Fraud',
    subtitle: 'Hardest',
    scamType: 'ceo_fraud',

    shiftDurationSec: 300,
    basePayout: 800,
    suspicionStart: 50,
    complianceStart: 5,

    expenses: {
      bunkFee: 200,
      food: 60,
      debtRepayment: 400,
      protectionFee: 150,
      equipmentLevy: 80,
    },

    hasTutorial: false,
    hasDesktop: false,

    briefing: {
      title: 'THE BIG LEAGUES',
      bossDialogue: [
        '"Last floor. CEO Fraud. The big leagues."',
        '"You\'re impersonating corporate executives."',
        '"Sound important. Sound impatient. These people are smart."',
        '"Nail this and... well, you\'ll see."',
        '"Get on the phone."',
      ],
      scriptNotes: [
        "You are 'Robert Chen, CEO of Nexus Dynamics'",
        "Reference the 'Meridian acquisition' — it's closing today",
        "Wire $47,500 to the escrow account",
        "You're in a board meeting — can't email right now",
        "The CFO's name is 'Sarah', act like you know her well",
      ],
    },

    victims: [
      { name: 'Sarah Mitchell, CFO', age: 39, location: 'New York, New York', portraitIdx: 2, gender: 'female' },
      { name: 'Jennifer Walsh, CFO', age: 44, location: 'San Francisco, California', portraitIdx: 2, gender: 'female' },
      { name: 'Amanda Price, CFO', age: 41, location: 'Boston, Massachusetts', portraitIdx: 2, gender: 'female' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Scoring constants
// ---------------------------------------------------------------------------

export const SCORING = {
  speedBonusThresholdSec: 120,
  speedBonusMultiplier: 1.5,
  lowSuspicionThreshold: 50,
  lowSuspicionBonus: 150,
  cleanExitBonus: 200,
  comboMultiplierStep: 0.25,
  maxComboMultiplier: 2.5,
};

export const TOTAL_FLOORS = 5;

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Get floor config by number.
 * @param {number} num - Floor number (1-5)
 * @returns {object|null}
 */
export function getFloor(num) {
  return FLOORS[num] || null;
}

/**
 * Sum all expenses for a floor.
 * @param {number} floorNum
 * @returns {number}
 */
export function getTotalExpenses(floorNum) {
  const ch = FLOORS[floorNum];
  if (!ch) return 0;
  return Object.values(ch.expenses).reduce((sum, v) => sum + v, 0);
}

/**
 * Get all victims for a floor.
 * @param {number} floorNum
 * @returns {Array}
 */
export function getFloorVictims(floorNum) {
  return FLOORS[floorNum]?.victims || [];
}

/**
 * Get victims not yet permanently completed.
 * @param {number} floorNum
 * @param {object} completedSet - { "name": true, ... }
 * @returns {Array}
 */
export function getRemainingVictims(floorNum, completedSet) {
  return getFloorVictims(floorNum).filter(v => !completedSet[v.name]);
}

/**
 * Get victims available tonight (remaining minus already attempted).
 * @param {number} floorNum
 * @param {object} completedSet
 * @param {string[]} attemptedList
 * @returns {Array}
 */
export function getTonightVictims(floorNum, completedSet, attemptedList) {
  const attempted = new Set(attemptedList);
  return getRemainingVictims(floorNum, completedSet).filter(v => !attempted.has(v.name));
}

// ---------------------------------------------------------------------------
// Legacy helpers (still used by VoiceManager as fallback)
// ---------------------------------------------------------------------------

/** Pick a random victim from a floor's pool (fallback for VoiceManager). */
export function getRandomVictim(level) {
  const pool = FLOORS[level]?.victims;
  if (!pool || pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
