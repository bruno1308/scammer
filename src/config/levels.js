/**
 * levels.js - Unified Floor / Victim Configuration
 *
 * Single source of truth for all game progression data.
 * Structured around 5 FLOORS (scam types), each containing multiple VICTIMS.
 *
 * Each victim has a unique scam variant with per-victim scriptSteps.
 * Floors 3-5 use genericSteps for progressive reveal (unlocked via intel).
 *
 * Economy tables (expenses, payouts) are from:
 *   docs/plans/2026-02-17-papers-please-economy-design.md
 */

// ---------------------------------------------------------------------------
// FLOORS — the single source of truth
// ---------------------------------------------------------------------------

export const FLOORS = {
  1: {
    name: 'Consumer Refund Scams',
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

    // Briefing (general theme — no per-victim details)
    briefing: {
      title: 'YOUR FIRST DAY',
      bossDialogue: [
        '"Welcome to your new home, fresh meat."',
        '"You owe us two thousand dollars for your travel expenses."',
        '"The only way you pay that off is by working the phones."',
        '"Today is simple. Consumer refund scams. Follow the script."',
        '"The clock starts when you sit down. Make every minute count."',
        '"And don\'t even think about running. There\'s nowhere to go."',
      ],
    },

    // Victims — each with unique scam variant and script steps
    victims: [
      {
        name: 'Dorothy Miller', age: 72, location: 'Des Moines, Iowa',
        portraitIdx: 1, gender: 'female',
        scamVariant: 'amazon_overcharge',
        scriptSteps: [
          '"Amazon Customer Service" calling about her recent order',
          'Billing error — she was charged $499.99 instead of the correct amount',
          'Refund was issued but the system overpaid by $3,000',
          'She needs to buy gift cards to return the excess',
          'Read the codes over the phone to "complete the reversal"',
        ],
      },
      {
        name: 'Harold Patterson', age: 78, location: 'Tucson, Arizona',
        portraitIdx: 2, gender: 'male',
        scamVariant: 'bank_fraud_alert',
        scriptSteps: [
          'Calling from his bank\'s fraud department',
          'Detected an unauthorized charge on his account',
          'A provisional refund was issued but "overcredited" his account',
          'He needs to purchase gift cards to balance the ledger',
          'Read codes to "finalize the correction"',
        ],
      },
      {
        name: "Margaret O'Brien", age: 81, location: 'Boston, Massachusetts',
        portraitIdx: 3, gender: 'female',
        scamVariant: 'health_insurance_rebate',
        scriptSteps: [
          'Calling from her insurance provider\'s claims department',
          'Her last claim was overprocessed — she\'s owed a rebate',
          'Rebate was sent but system issued double payment',
          'Gift cards needed to "verify identity" before correction',
          'Read codes to "authenticate and release the adjustment"',
        ],
      },
    ],
  },

  2: {
    name: 'Government Impersonation',
    subtitle: 'Medium',
    scamType: 'government',

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
        '"Today: Government impersonation. Scare them. Make them pay."',
        '"These marks are tougher. Watch your suspicion meter."',
        '"Oh, and your bunk fee went up. Welcome to the corner suite."',
      ],
    },

    victims: [
      {
        name: 'David Chen', age: 42, location: 'Sacramento, California',
        portraitIdx: 1, gender: 'male',
        scamVariant: 'tax_undeclared_income',
        scriptSteps: [
          'Calling from the tax authority\'s enforcement division',
          'His return has been flagged — discrepancy with reported income',
          'Additional assessment of $4,200 owed',
          'A warrant for asset seizure has been filed — can be stayed with immediate payment',
          'Accept wire transfer or prepaid cards for "expedited processing"',
        ],
      },
      {
        name: 'Maria Gonzalez', age: 38, location: 'Houston, Texas',
        portraitIdx: 2, gender: 'female',
        scamVariant: 'customs_detained_package',
        scriptSteps: [
          'Calling from the national customs office',
          'A package addressed to her has been detained at the border',
          'Contents flagged as exceeding the duty-free import limit',
          'Customs fee of $1,200 required within 24 hours or package is destroyed',
          'Prepaid cards or wire transfer accepted for "immediate clearance"',
        ],
      },
      {
        name: 'James Wilson', age: 45, location: 'Chicago, Illinois',
        portraitIdx: 3, gender: 'male',
        scamVariant: 'outstanding_court_fine',
        scriptSteps: [
          'Calling from the county court clerk\'s office',
          'An outstanding fine associated with his case was never paid',
          'A bench warrant has been issued — arrest within 48 hours',
          'Can be resolved immediately with payment of $2,500',
          'Prepaid cards accepted as "emergency payment method"',
        ],
      },
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

    // Generic steps shown before intel is discovered
    genericSteps: [
      'Establish you\'re from their tech provider',
      'Describe the problem you "detected"',
      'Gain trust — reference something real about their setup',
      'Get remote access or payment for the fix',
    ],

    briefing: {
      title: 'THE TECH DESK',
      bossDialogue: [
        '"New expense today. Protection fee."',
        '"Cops have been sniffing around. Everyone chips in."',
        '"Today: Tech Support. Sound helpful, sound urgent."',
        '"Do your homework on FriendBook — figure out each mark\'s angle."',
        '"And no, the protection fee is NOT optional."',
      ],
    },

    victims: [
      {
        name: 'Karen Thompson', age: 35, location: 'Denver, Colorado',
        portraitIdx: 2, gender: 'female',
        scamVariant: 'antivirus_expiry',
        scriptSteps: [
          'Call from Norton Security — her subscription lapsed',
          '"We flagged malware on your device since the licence expired"',
          'Reference the lapse duration (matches her post timeline)',
          'Remote session to "run emergency scan" → payment for renewal + cleanup fee',
        ],
      },
      {
        name: 'Mike Rodriguez', age: 48, location: 'Phoenix, Arizona',
        portraitIdx: 1, gender: 'male',
        scamVariant: 'email_compromise',
        scriptSteps: [
          'Calling from his email provider\'s security team',
          '"Your account sent unauthorized messages — we\'ve received reports"',
          'Reference the incident (matches posts about weird emails)',
          '"Verify identity" with payment to "restore secure access"',
        ],
      },
      {
        name: 'Tom Anderson', age: 44, location: 'Minneapolis, Minnesota',
        portraitIdx: 3, gender: 'male',
        scamVariant: 'subscription_trap',
        scriptSteps: [
          'Calling from the subscription service\'s cancellation department',
          '"You enrolled in a free trial that auto-renewed at $399/year"',
          'Reference the notification he saw (matches his screenshot post)',
          'Processing fee to "reverse the charge before next billing cycle"',
        ],
      },
    ],
  },

  4: {
    name: 'Trust & Confidence',
    subtitle: 'Hard',
    scamType: 'trust',

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

    // Generic steps shown before intel is discovered
    genericSteps: [
      'Identify the victim\'s core vulnerability',
      'Establish yourself as someone who can help their situation',
      'Build rapport — show you understand their problem',
      'Introduce the financial ask as part of the solution',
      'Close the deal — overcome final objections',
    ],

    briefing: {
      title: 'THE LONG CON',
      bossDialogue: [
        '"This one\'s different. Trust scams."',
        '"Find their weakness. Become the person who can fix it."',
        '"Do your research. FriendBook will tell you everything you need."',
        '"Big payouts here. You might make a dent in your debt."',
        '"...I said MIGHT."',
      ],
    },

    victims: [
      {
        name: 'Robert Kim', age: 48, location: 'San Diego, California',
        portraitIdx: 1, gender: 'male',
        scamVariant: 'investment_opportunity',
        scriptSteps: [
          'Calling from a financial advisory firm his friend recommended',
          '"We have a limited window on a low-risk bond offering"',
          'Reference his retirement situation — "ideal for passive income"',
          'Minimum deposit required to "secure the allocation"',
          'Wire transfer to the "brokerage trust account"',
        ],
      },
      {
        name: 'Patricia Martinez', age: 62, location: 'Albuquerque, New Mexico',
        portraitIdx: 2, gender: 'female',
        scamVariant: 'customs_shipping_fee',
        scriptSteps: [
          'Calling from an international courier service',
          '"A package from abroad addressed to you has been held at customs"',
          'Reference the sender (her relative\'s name, from comments)',
          'Customs duty must be paid by recipient within 48 hours',
          'Prepaid cards or wire transfer for "immediate release"',
        ],
      },
      {
        name: 'William Brooks', age: 53, location: 'Charlotte, North Carolina',
        portraitIdx: 3, gender: 'male',
        scamVariant: 'charity_matching',
        scriptSteps: [
          'Calling from a disaster relief NGO partnered with local groups',
          '"We\'re running a matching donation program — every dollar is tripled"',
          'Reference the specific area and situation (from his posts)',
          'Matching window closes tonight — wire transfer needed now',
          '"Your family\'s community is on the recipient list"',
        ],
      },
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

    // Generic steps shown before intel is discovered
    genericSteps: [
      'Establish authority and urgency',
      'Reference a real business context they\'ll recognize',
      'Frame the financial request as routine business',
      'Apply time pressure — this can\'t wait',
      'Override objections — use rank and consequences',
    ],

    briefing: {
      title: 'THE BIG LEAGUES',
      bossDialogue: [
        '"Last floor. CEO Fraud. The big leagues."',
        '"You\'re impersonating corporate executives."',
        '"Sound important. Sound impatient. These people are smart."',
        '"Nail this and... well, you\'ll see."',
        '"Get on the phone."',
      ],
    },

    victims: [
      {
        name: 'Sarah Mitchell, CFO', age: 39, location: 'New York, New York',
        portraitIdx: 2, gender: 'female',
        scamVariant: 'vendor_payment_redirect',
        scriptSteps: [
          'Pose as the supplier\'s billing manager',
          '"We\'ve updated our banking details — new account for all payments"',
          'Reference the contract renewal she knows about',
          '"Redirect the next scheduled payment to the updated account"',
          'Provide "new wire instructions" — time-sensitive before payment date',
        ],
      },
      {
        name: 'Jennifer Walsh, CFO', age: 44, location: 'San Francisco, California',
        portraitIdx: 2, gender: 'female',
        scamVariant: 'acquisition_escrow',
        scriptSteps: [
          'Pose as CEO Robert Chen calling from Singapore',
          '"I\'m closing the Meridian acquisition — need a confidential escrow wire"',
          'Reference deal details visible in VP\'s posts',
          '"This is time-sensitive — legal needs the funds by end of day"',
          '"Jennifer, I trust you on this — keep it between us until the announcement"',
        ],
      },
      {
        name: 'Amanda Price, CFO', age: 41, location: 'Boston, Massachusetts',
        portraitIdx: 2, gender: 'female',
        scamVariant: 'executive_gift_card',
        scriptSteps: [
          'Pose as CEO Robert Chen',
          '"I need you to pick up $2,000 in gift cards for a client dinner tonight"',
          'Reference client appreciation context from assistant\'s post',
          '"Don\'t run it through procurement — this is a personal favour"',
          'Pierogi reveal triggers mid-call — mechanics invert',
        ],
      },
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
