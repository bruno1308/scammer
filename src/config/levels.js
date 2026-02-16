/**
 * levels.js - Level Configuration Data
 *
 * Defines all 5 scam levels with their parameters, briefings, and victim pools.
 * Each level represents a different type of scam with increasing difficulty.
 *
 * Level structure:
 *   - name: Display name of the scam type
 *   - subtitle: Difficulty label
 *   - quota: Dollar amount player must extract to pass
 *   - callsPerShift: Number of victims available per level
 *   - startSuspicion: Victim's initial suspicion (higher = harder)
 *   - startCompliance: Victim's initial compliance (lower = harder)
 *   - payoutRange: [min, max] possible payout per call
 *   - timeLimit: Seconds per call (null = no limit)
 *   - hasTutorial: Whether tutorial popups appear
 *   - hasDesktop: Whether the tech desktop mini-game is available
 *   - briefing: Pre-level boss dialogue and script notes
 */

export const LEVELS = {
  1: {
    name: 'Gift Card Refund',
    subtitle: 'Tutorial - Easy',
    quota: 200,
    callsPerShift: 3,
    startSuspicion: 15,
    startCompliance: 30,
    payoutRange: [100, 250],
    timeLimit: null, // No timer for the tutorial level
    hasTutorial: true,
    briefing: {
      title: 'YOUR FIRST DAY',
      bossDialogue: [
        "Listen up, newbie. Here's how this works.",
        "You tell them they got double-charged on Amazon.",
        "Say you owe them a $499 refund, but oops — the system sent $3,000.",
        "They'll feel guilty and want to 'return' the extra money.",
        "Tell them gift cards are the fastest way to send it back. Get those codes."
      ],
      scriptNotes: [
        "Introduce yourself as 'Amazon Customer Service'",
        "Reference a recent purchase they made",
        "Explain there was a billing error — they were overcharged $499.99",
        "Say a refund was issued but the system sent too much ($3,000)",
        "Ask them to buy gift cards to return the extra — read codes over the phone"
      ]
    }
  },

  2: {
    name: 'IRS Tax Scam',
    subtitle: 'Medium',
    quota: 400,
    callsPerShift: 4,
    startSuspicion: 40,
    startCompliance: 20,
    payoutRange: [200, 500],
    timeLimit: 180, // 3 minutes
    hasTutorial: false,
    briefing: {
      title: 'MOVING UP',
      bossDialogue: [
        "Good work yesterday. Time to step it up.",
        "Today you're the IRS. Scary, right?",
        "Tell them they owe back taxes and there's a warrant for their arrest.",
        "These people will fight back. You need to sound OFFICIAL.",
        "Gift cards or wire transfer. Make it happen."
      ],
      scriptNotes: [
        "You are 'Agent' from the IRS",
        "They owe back taxes - be specific with fake amounts",
        "A warrant has been issued - arrest TODAY",
        "Payment must be immediate to avoid arrest",
        "Accept gift cards or wire transfer"
      ]
    }
  },

  3: {
    name: 'Tech Support',
    subtitle: 'Medium-Hard',
    quota: 500,
    callsPerShift: 3,
    startSuspicion: 25,
    startCompliance: 35,
    payoutRange: [200, 400],
    timeLimit: 240, // 4 minutes
    hasTutorial: false,
    hasDesktop: true,
    briefing: {
      title: 'THE TECH DESK',
      bossDialogue: [
        "Today's special. They come to US.",
        "They saw a pop-up saying their computer is infected.",
        "Walk them through 'diagnostics' - Event Viewer, netstat, tree command.",
        "Everything looks scary if you don't know what it means.",
        "Then sell them a $299 'protection plan'. Show them the payment page."
      ],
      scriptNotes: [
        "You are 'Windows Technical Support'",
        "Have them open Event Viewer (scary errors!)",
        "Run netstat (foreign connections = hackers!)",
        "Open fake antivirus scan (47 threats found!)",
        "Sell $299 protection plan via payment form"
      ]
    }
  },

  4: {
    name: 'Romance Scam',
    subtitle: 'Hard',
    quota: 800,
    callsPerShift: 3,
    startSuspicion: 15,
    startCompliance: 25,
    payoutRange: [500, 1500],
    timeLimit: 300, // 5 minutes
    hasTutorial: false,
    briefing: {
      title: 'THE LONG CON',
      bossDialogue: [
        "This one's different. No threats, no urgency tricks.",
        "They think you're their boyfriend. Military officer, overseas.",
        "You've been 'dating' for weeks. They're in love.",
        "Now you need money. Wallet stolen, plane ticket, medical bills.",
        "Be WARM. Be LOVING. Then ask for the money. Maximum emotional damage."
      ],
      scriptNotes: [
        "You are 'Captain James Mitchell' (or similar)",
        "Reference your 'past conversations' with them",
        "Stay consistent with your backstory",
        "Build emotional connection BEFORE asking for money",
        "Never agree to video call - always have an excuse"
      ]
    }
  },

  5: {
    name: 'CEO Fraud',
    subtitle: 'Hardest',
    quota: 2000,
    callsPerShift: 3,
    startSuspicion: 55,
    startCompliance: 10,
    payoutRange: [2000, 5000],
    timeLimit: 120, // 2 minutes - the CFO is busy
    hasTutorial: false,
    briefing: {
      title: 'THE BIG LEAGUES',
      bossDialogue: [
        "This is it. The big one. Corporate phishing.",
        "You're the CEO. The CFO picks up. You need a wire transfer NOW.",
        "Study the briefing document. Know the company details.",
        "Sound impatient. Sound important. You don't have time for questions.",
        "This one pays the most. Screw it up and you're done. Permanently."
      ],
      scriptNotes: [
        "You are 'Robert Chen, CEO of Nexus Dynamics'",
        "Reference the 'Meridian acquisition' - it's closing today",
        "Wire $47,500 to the escrow account",
        "You're in a board meeting - can't email right now",
        "The CFO's name is 'Sarah', act like you know her well"
      ]
    }
  }
};

/**
 * Victim name pools per level.
 * Each entry contains the victim's name, age, and location.
 * A random victim is selected from the pool for each call in that level.
 */
export const VICTIM_NAMES = {
  // Portraits: 1=F(glasses) 2=M(bald) 3=F(Asian) 4=M(cardigan) 5=F(hat)
  1: [
    { name: 'Dorothy Miller', age: 72, location: 'Des Moines, Iowa', portraitIdx: 1 },
    { name: 'Harold Patterson', age: 78, location: 'Tucson, Arizona', portraitIdx: 2 },
    { name: 'Betty Nakamura', age: 69, location: 'Portland, Oregon', portraitIdx: 3 },
    { name: 'Earl Washington', age: 74, location: 'Atlanta, Georgia', portraitIdx: 4 },
    { name: "Margaret O'Brien", age: 81, location: 'Boston, Massachusetts', portraitIdx: 5 }
  ],

  // Portraits: 1=M(office) 2=F(curly) 3=M(desk) 4=F(kitchen)
  2: [
    { name: 'David Chen', age: 42, location: 'Sacramento, California', portraitIdx: 1 },
    { name: 'Maria Gonzalez', age: 38, location: 'Houston, Texas', portraitIdx: 2 },
    { name: 'James Wilson', age: 45, location: 'Chicago, Illinois', portraitIdx: 3 },
    { name: 'Priya Patel', age: 41, location: 'Edison, New Jersey', portraitIdx: 4 }
  ],

  // Portraits: 1=M(computer) 2=F(red hair) 3=M(glasses) 4=F(dark hair)
  3: [
    { name: 'Karen Thompson', age: 35, location: 'Denver, Colorado', portraitIdx: 2 },
    { name: 'Mike Rodriguez', age: 48, location: 'Phoenix, Arizona', portraitIdx: 1 },
    { name: 'Susan Lee', age: 52, location: 'Seattle, Washington', portraitIdx: 4 },
    { name: 'Tom Anderson', age: 44, location: 'Minneapolis, Minnesota', portraitIdx: 3 }
  ],

  // Portraits: 1=F(rose) 2=M(book) 3=F(wine) 4=F(pearls)
  4: [
    { name: 'Linda Foster', age: 56, location: 'Nashville, Tennessee', portraitIdx: 1 },
    { name: 'Robert Kim', age: 48, location: 'San Diego, California', portraitIdx: 2 },
    { name: 'Patricia Martinez', age: 62, location: 'Albuquerque, New Mexico', portraitIdx: 3 },
    { name: 'William Brooks', age: 53, location: 'Charlotte, North Carolina', portraitIdx: 2 }
  ],

  // Portraits: 1=M(suit) 2=F(stern) 3=M(document)
  5: [
    { name: 'Sarah Mitchell, CFO', age: 39, location: 'New York, New York', portraitIdx: 2 },
    { name: 'Jennifer Walsh, CFO', age: 44, location: 'San Francisco, California', portraitIdx: 2 },
    { name: 'Amanda Price, CFO', age: 41, location: 'Boston, Massachusetts', portraitIdx: 2 }
  ]
};

/**
 * Helper: Get a random victim from a level's pool.
 * @param {number} level - The level number (1-5)
 * @returns {object} A victim object { name, age, location }
 */
export function getRandomVictim(level) {
  const pool = VICTIM_NAMES[level];
  if (!pool || pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Helper: Get level config by number.
 * @param {number} level - The level number (1-5)
 * @returns {object|null} The level configuration or null if invalid
 */
export function getLevelConfig(level) {
  return LEVELS[level] || null;
}

/**
 * Total number of levels in the game.
 */
export const TOTAL_LEVELS = Object.keys(LEVELS).length;
