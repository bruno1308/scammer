import Phaser from 'phaser';

/**
 * Level configuration table.
 * Each level defines starting values, quota, number of calls, and payout amounts.
 */
const LEVEL_CONFIG = {
  1: {
    name: 'Gift Card Refund',
    suspicionStart: 10,
    complianceStart: 20,
    quota: 500,
    callsTotal: 3,
    basePayout: 200,
    callTimeLimitSec: null, // no time limit on tutorial
  },
  2: {
    name: 'IRS Tax Scam',
    suspicionStart: 30,
    complianceStart: 10,
    quota: 1200,
    callsTotal: 4,
    basePayout: 400,
    callTimeLimitSec: 300,
  },
  3: {
    name: 'Tech Support Scam',
    suspicionStart: 15,
    complianceStart: 25,
    quota: 1500,
    callsTotal: 4,
    basePayout: 450,
    callTimeLimitSec: 360,
  },
  4: {
    name: 'Romance / Catfish',
    suspicionStart: 10,
    complianceStart: 15,
    quota: 2500,
    callsTotal: 3,
    basePayout: 1000,
    callTimeLimitSec: 420,
  },
  5: {
    name: 'CEO Fraud',
    suspicionStart: 50,
    complianceStart: 5,
    quota: 5000,
    callsTotal: 5,
    basePayout: 1500,
    callTimeLimitSec: 240,
  },
};

/**
 * Scoring constants used by getCallScore().
 */
const SCORING = {
  speedBonusThresholdSec: 120,   // calls under 2 minutes get a speed bonus
  speedBonusMultiplier: 1.5,
  lowSuspicionThreshold: 50,     // suspicion below 50 at call end = bonus
  lowSuspicionBonus: 150,
  cleanExitBonus: 200,           // no police threat, no hang-up by victim
  comboMultiplierStep: 0.25,     // each consecutive success adds 25% multiplier
  maxComboMultiplier: 2.5,
};

/**
 * Valid emotion values the AI can report.
 */
const VALID_EMOTIONS = [
  'calm',
  'nervous',
  'angry',
  'scared',
  'trusting',
  'confused',
  'crying',
];

/**
 * Events that signal the call should end (and how).
 */
const TERMINAL_EVENTS = [
  'hangs_up',
  'agrees_to_pay',
  'gives_gift_card_code',
  'threatens_police',
];

/**
 * GameState -- singleton game-state manager.
 *
 * Extends Phaser.Events.EventEmitter so any Phaser scene can subscribe to
 * state-change events without tight coupling.
 *
 * Emitted events:
 *   'suspicion_change'   { previous, current, delta }
 *   'compliance_change'  { previous, current, delta }
 *   'emotion_change'     { previous, current }
 *   'game_event'         { event }  (e.g. 'threatens_police')
 *   'call_end'           { reason, score, callResult }
 *   'shift_end'          { totalMoney, quota, passed, shiftResults }
 *   'heat_change'        { previous, current, delta }
 *   'money_change'       { previous, current, delta }
 *   'combo_change'       { previous, current }
 */
class GameState extends Phaser.Events.EventEmitter {
  constructor() {
    super();

    // ---- shift / level state ----
    this.currentLevel = 1;
    this.suspicion = 0;
    this.compliance = 0;
    this.emotion = 'calm';
    this.money = 0;
    this.quota = 0;
    this.callsCompleted = 0;
    this.callsTotal = 0;
    this.combo = 0;

    // ---- global state (persists across levels) ----
    this.heat = 0;

    // ---- per-call state ----
    this.currentVictim = null;   // { name, age, location, portrait }
    this.callActive = false;
    this.callStartTime = null;
    this.callEndedClean = true;  // tracks whether victim threatened police / hung up

    // ---- results ----
    this.shiftResults = [];      // array of per-call result objects
  }

  /* ------------------------------------------------------------------
   * Level lifecycle
   * ----------------------------------------------------------------*/

  /**
   * Reset shift state and configure for the given level.
   * @param {number} levelNum - 1 through 5
   */
  startLevel(levelNum) {
    const config = LEVEL_CONFIG[levelNum];
    if (!config) {
      console.error(`[GameState] Unknown level: ${levelNum}`);
      return;
    }

    this.currentLevel = levelNum;
    this.money = 0;
    this.callsCompleted = 0;
    this.callsTotal = config.callsTotal;
    this.quota = config.quota;
    this.combo = 0;
    this.shiftResults = [];

    // Per-call values will be set properly in startCall, but we initialise
    // them here so the UI can show baseline meters during briefing.
    this.suspicion = config.suspicionStart;
    this.compliance = config.complianceStart;
    this.emotion = 'calm';
    this.callActive = false;
    this.currentVictim = null;
    this.callStartTime = null;
    this.callEndedClean = true;
  }

  /* ------------------------------------------------------------------
   * Call lifecycle
   * ----------------------------------------------------------------*/

  /**
   * Prepare state for a new call.
   * @param {{ name: string, age: number, location: string, portrait: string }} victimInfo
   */
  startCall(victimInfo) {
    const config = LEVEL_CONFIG[this.currentLevel];

    this.currentVictim = victimInfo;
    this.suspicion = config.suspicionStart;
    this.compliance = config.complianceStart;
    this.emotion = 'calm';
    this.callActive = true;
    this.callStartTime = Date.now();
    this.callEndedClean = true;
  }

  /**
   * Process an update_game_state function call from the AI.
   *
   * Expected shape:
   * {
   *   suspicion_delta: number,
   *   compliance_delta: number,
   *   emotion: string,
   *   event: string | null
   * }
   *
   * @param {object} data
   */
  updateFromAI(data) {
    if (!this.callActive) {
      console.warn('[GameState] updateFromAI called while no call is active');
      return;
    }

    if (!data || typeof data !== 'object') {
      console.warn('[GameState] updateFromAI received invalid data:', data);
      return;
    }

    console.log(
      `[GameState] 📊 AI update_game_state:\n` +
      `  suspicion: ${data.suspicion_delta >= 0 ? '+' : ''}${data.suspicion_delta} (${this.suspicion} → ${Phaser.Math.Clamp(this.suspicion + (data.suspicion_delta || 0), 0, 100)})\n` +
      `  compliance: ${data.compliance_delta >= 0 ? '+' : ''}${data.compliance_delta} (${this.compliance} → ${Phaser.Math.Clamp(this.compliance + (data.compliance_delta || 0), 0, 100)})\n` +
      `  emotion: ${data.emotion || 'unchanged'}\n` +
      `  event: ${data.event || 'none'}`
    );

    // --- Suspicion ---
    if (typeof data.suspicion_delta === 'number') {
      const prev = this.suspicion;
      this.suspicion = Phaser.Math.Clamp(this.suspicion + data.suspicion_delta, 0, 100);
      if (this.suspicion !== prev) {
        console.log(`[GameState] 🔴 Suspicion changed: ${prev} → ${this.suspicion} (delta: ${data.suspicion_delta})`);
        this.emit('suspicion_change', {
          previous: prev,
          current: this.suspicion,
          delta: data.suspicion_delta,
        });
      }
    }

    // --- Compliance ---
    if (typeof data.compliance_delta === 'number') {
      const prev = this.compliance;
      this.compliance = Phaser.Math.Clamp(this.compliance + data.compliance_delta, 0, 100);
      if (this.compliance !== prev) {
        console.log(`[GameState] 🟢 Compliance changed: ${prev} → ${this.compliance} (delta: ${data.compliance_delta})`);
        this.emit('compliance_change', {
          previous: prev,
          current: this.compliance,
          delta: data.compliance_delta,
        });
      }
    }

    // --- Emotion ---
    if (data.emotion && VALID_EMOTIONS.includes(data.emotion)) {
      const prev = this.emotion;
      if (data.emotion !== prev) {
        this.emotion = data.emotion;
        console.log(`[GameState] 😐 Emotion changed: ${prev} → ${this.emotion}`);
        this.emit('emotion_change', {
          previous: prev,
          current: this.emotion,
        });
      }
    }

    // --- Special events ---
    if (data.event) {
      console.log(`[GameState] ⚡ Event triggered: ${data.event}`);
      this.emit('game_event', { event: data.event });

      // Track dirty exit conditions
      if (data.event === 'threatens_police' || data.event === 'hangs_up') {
        this.callEndedClean = false;
      }

      // Add heat for risky events
      if (data.event === 'threatens_police') {
        this._addHeat(15);
      }

      // Auto-end the call on terminal events
      if (TERMINAL_EVENTS.includes(data.event)) {
        this.endCall(data.event);
      }
    }

    // --- Threshold-based auto-end ---
    if (this.callActive && this.suspicion >= 100) {
      this.endCall('suspicion_maxed');
    }
    if (this.callActive && this.compliance >= 100) {
      this.endCall('compliance_maxed');
    }
  }

  /**
   * End the current call.
   * @param {string} reason - Why the call ended (e.g. 'agrees_to_pay', 'hangs_up',
   *                          'player_hangup', 'suspicion_maxed', 'compliance_maxed',
   *                          'time_expired', 'connection_lost')
   */
  endCall(reason) {
    if (!this.callActive) return;

    this.callActive = false;

    const success = [
      'agrees_to_pay',
      'gives_gift_card_code',
      'compliance_maxed',
    ].includes(reason);

    const score = this.getCallScore(success, reason);

    // Update money
    if (success) {
      const prevMoney = this.money;
      this.money += score;
      this.emit('money_change', {
        previous: prevMoney,
        current: this.money,
        delta: score,
      });
    }

    // Update combo
    const prevCombo = this.combo;
    if (success) {
      this.combo += 1;
    } else {
      this.combo = 0;
    }
    if (this.combo !== prevCombo) {
      this.emit('combo_change', { previous: prevCombo, current: this.combo });
    }

    // Add heat for failed calls
    if (!success) {
      this._addHeat(5);
    }

    // Build call result record
    const callResult = {
      victim: this.currentVictim ? { ...this.currentVictim } : null,
      reason,
      success,
      score,
      suspicion: this.suspicion,
      compliance: this.compliance,
      emotion: this.emotion,
      callDurationSec: this.callStartTime
        ? Math.round((Date.now() - this.callStartTime) / 1000)
        : 0,
      combo: this.combo,
    };

    this.shiftResults.push(callResult);
    this.callsCompleted += 1;

    this.emit('call_end', { reason, score, callResult });

    // Auto-end shift if all calls are done
    if (this.callsCompleted >= this.callsTotal) {
      this.endShift();
    }
  }

  /**
   * End the current shift, evaluate quota, emit results.
   */
  endShift() {
    const passed = this.money >= this.quota;

    // Failing a shift adds significant heat
    if (!passed) {
      this._addHeat(20);
    }

    this.emit('shift_end', {
      totalMoney: this.money,
      quota: this.quota,
      passed,
      shiftResults: [...this.shiftResults],
    });
  }

  /* ------------------------------------------------------------------
   * Scoring
   * ----------------------------------------------------------------*/

  /**
   * Compute the score for the current (or just-completed) call.
   *
   * @param {boolean} [success=true] - Whether the call was a success.
   * @param {string}  [reason='']    - The end-call reason, for clean-exit evaluation.
   * @returns {number} The computed score (0 if call failed).
   */
  getCallScore(success = true, reason = '') {
    if (!success) return 0;

    const config = LEVEL_CONFIG[this.currentLevel];
    let score = config.basePayout;

    // Speed bonus -- calls completed in under the threshold get a multiplier
    if (this.callStartTime) {
      const durationSec = (Date.now() - this.callStartTime) / 1000;
      if (durationSec < SCORING.speedBonusThresholdSec) {
        score = Math.round(score * SCORING.speedBonusMultiplier);
      }
    }

    // Low suspicion bonus
    if (this.suspicion < SCORING.lowSuspicionThreshold) {
      score += SCORING.lowSuspicionBonus;
    }

    // Clean exit bonus (no police threat, no victim hang-up)
    const cleanReasons = [
      'agrees_to_pay',
      'gives_gift_card_code',
      'compliance_maxed',
    ];
    if (this.callEndedClean && cleanReasons.includes(reason)) {
      score += SCORING.cleanExitBonus;
    }

    // Combo multiplier (applied on the combo count BEFORE this call increments it)
    const comboMultiplier = Math.min(
      1 + this.combo * SCORING.comboMultiplierStep,
      SCORING.maxComboMultiplier,
    );
    score = Math.round(score * comboMultiplier);

    return score;
  }

  /* ------------------------------------------------------------------
   * Heat (global across levels)
   * ----------------------------------------------------------------*/

  /**
   * Add heat and emit the change event.
   * @param {number} delta
   * @private
   */
  _addHeat(delta) {
    const prev = this.heat;
    this.heat = Phaser.Math.Clamp(this.heat + delta, 0, 100);
    if (this.heat !== prev) {
      this.emit('heat_change', {
        previous: prev,
        current: this.heat,
        delta,
      });
    }
  }

  /* ------------------------------------------------------------------
   * Full reset
   * ----------------------------------------------------------------*/

  /**
   * Full reset for a brand-new game.
   */
  reset() {
    this.currentLevel = 1;
    this.suspicion = 0;
    this.compliance = 0;
    this.emotion = 'calm';
    this.money = 0;
    this.quota = 0;
    this.callsCompleted = 0;
    this.callsTotal = 0;
    this.combo = 0;
    this.heat = 0;
    this.currentVictim = null;
    this.callActive = false;
    this.callStartTime = null;
    this.callEndedClean = true;
    this.shiftResults = [];
  }

  /* ------------------------------------------------------------------
   * Helpers
   * ----------------------------------------------------------------*/

  /**
   * Return the configuration object for the current (or specified) level.
   * @param {number} [level]
   * @returns {object|null}
   */
  getLevelConfig(level) {
    return LEVEL_CONFIG[level ?? this.currentLevel] ?? null;
  }

  /**
   * Elapsed call time in seconds (0 if no active call).
   * @returns {number}
   */
  getCallElapsedSec() {
    if (!this.callStartTime) return 0;
    return Math.round((Date.now() - this.callStartTime) / 1000);
  }

  /**
   * Whether the current call has exceeded the level time limit.
   * @returns {boolean}
   */
  isCallOverTime() {
    const config = LEVEL_CONFIG[this.currentLevel];
    if (!config || !config.callTimeLimitSec) return false;
    return this.getCallElapsedSec() >= config.callTimeLimitSec;
  }
}

/* ------------------------------------------------------------------
 * Singleton instance
 * ----------------------------------------------------------------*/

const gameState = new GameState();

export default gameState;
export { GameState, LEVEL_CONFIG, SCORING, VALID_EMOTIONS, TERMINAL_EVENTS };
