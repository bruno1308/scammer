import Phaser from 'phaser';
import { FLOORS, SCORING, getRemainingVictims, getTonightVictims, getTotalExpenses } from '../config/levels.js';
import SaveManager from './SaveManager.js';

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
 *   'suspicion_change'    { previous, current, delta }
 *   'compliance_change'   { previous, current, delta }
 *   'emotion_change'      { previous, current }
 *   'game_event'          { event }  (e.g. 'threatens_police', 'pierogi_reveal')
 *   'call_end'            { reason, score, callResult }
 *   'shift_end'           { shiftEarnings, expenses, expenseBreakdown, wallet, shortfall, shortfallCount, floorComplete, shiftResults }
 *   'heat_change'         { previous, current, delta }
 *   'money_change'        { previous, current, delta }
 *   'combo_change'        { previous, current }
 *   'intel_reset'         intelKeys[]
 *   'intel_seen'          key
 *   'intel_used'          key
 *   'no_victims_tonight'  (no data)
 *   'remittance_sent'     { amount, total }
 */
class GameState extends Phaser.Events.EventEmitter {
  constructor() {
    super();

    // ---- Persistent economy (survives across floors, saved to localStorage) ----
    this.wallet = 0;
    this.totalRemittance = 0;
    this.shortfallCount = 0;
    this.shortfallDebt = 0;

    // ---- Floor / victim tracking ----
    this.currentFloor = 1;
    this.completedVictims = {};       // { "Dorothy Miller": true }
    this.attemptedTonight = [];       // names attempted this shift
    this.currentNightVictimQueue = []; // shuffled queue for tonight

    // ---- Shift state ----
    this.shiftEarnings = 0;
    this.shiftActive = false;
    this.shiftStartTime = null;
    this.shiftDurationSec = 300;
    this.combo = 0;
    this.shiftResults = [];

    // ---- Per-call state ----
    this.suspicion = 0;
    this.compliance = 0;
    this.emotion = 'calm';
    this.callActive = false;
    this.callStartTime = null;
    this.callEndedClean = true;
    this.currentVictim = null;

    // ---- Global state (persists across levels) ----
    this.heat = 0;

    // ---- Flags ----
    this.introSeen = false;
    this.pierogiConvinced = false;

    // ---- Intel tracking for FriendBook ----
    this.intelKeys = [];
    this.intelSeen = new Set();
    this.intelUsed = new Set();
  }

  /* ------------------------------------------------------------------
   * Shift lifecycle
   * ----------------------------------------------------------------*/

  /**
   * Start a new shift for the given floor.
   * @param {number} floorNum - 1 through 5
   */
  startShift(floorNum) {
    const floor = FLOORS[floorNum];
    if (!floor) {
      console.error(`[GameState] Unknown floor: ${floorNum}`);
      return;
    }

    this.currentFloor = floorNum;
    this.shiftEarnings = 0;
    this.shiftDurationSec = floor.shiftDurationSec;
    this.shiftActive = true;
    this.shiftStartTime = Date.now();
    this.combo = 0;
    this.shiftResults = [];
    this.attemptedTonight = [];

    // Build tonight's victim queue: remaining victims, shuffled
    const remaining = getRemainingVictims(floorNum, this.completedVictims);
    this.currentNightVictimQueue = Phaser.Utils.Array.Shuffle([...remaining]);

    // Per-call values (baseline for UI)
    this.suspicion = floor.suspicionStart;
    this.compliance = floor.complianceStart;
    this.emotion = 'calm';
    this.callActive = false;
    this.currentVictim = null;
    this.callStartTime = null;
    this.callEndedClean = true;
    this.intelKeys = [];
    this.intelSeen = new Set();
    this.intelUsed = new Set();
  }

  /* ------------------------------------------------------------------
   * Call lifecycle
   * ----------------------------------------------------------------*/

  /**
   * Prepare state for a new call.
   * @param {{ name: string, age: number, location: string }} victimInfo
   */
  startCall(victimInfo) {
    const floor = FLOORS[this.currentFloor];

    this.currentVictim = victimInfo;
    this.suspicion = floor.suspicionStart;
    this.compliance = floor.complianceStart;
    this.emotion = 'calm';
    this.callActive = true;
    this.callStartTime = Date.now();
    this.callEndedClean = true;
  }

  /* ------------------------------------------------------------------
   * Intel tracking (FriendBook)
   * ----------------------------------------------------------------*/

  /**
   * Initialize intel keys for the current victim.
   * @param {Array<{ key: string, boost: number, description: string }>} intelKeys
   */
  initIntel(intelKeys) {
    this.intelKeys = intelKeys || [];
    this.intelSeen = new Set();
    this.intelUsed = new Set();
    this.emit('intel_reset', this.intelKeys);
  }

  /**
   * Mark an intel key as seen by the player on FriendBook.
   * @param {string} key
   */
  markIntelSeen(key) {
    if (!this.intelSeen.has(key)) {
      this.intelSeen.add(key);
      this.emit('intel_seen', key);
    }
  }

  /**
   * Mark an intel key as used in conversation (confirmed by the AI).
   * @param {string} key
   */
  markIntelUsed(key) {
    if (!this.intelUsed.has(key)) {
      this.intelUsed.add(key);
      this.emit('intel_used', key);
    }
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
      `[GameState] AI update_game_state:\n` +
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
        this.emit('emotion_change', {
          previous: prev,
          current: this.emotion,
        });
      }
    }

    // --- Special events ---
    if (data.event) {
      console.log(`[GameState] Event triggered: ${data.event}`);
      this.emit('game_event', { event: data.event });

      // Pierogi reveal is NOT terminal — call continues with new session
      if (data.event === 'pierogi_reveal') {
        // Handled by OfficeScene/CallScene — don't end call
      } else {
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
    }

    // --- Intel triggered ---
    if (data.intel_triggered) {
      this.markIntelUsed(data.intel_triggered);
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
   * @param {string} reason - Why the call ended
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

    // Update wallet and shift earnings
    if (success) {
      const prevWallet = this.wallet;
      this.wallet += score;
      this.shiftEarnings += score;
      this.emit('money_change', {
        previous: prevWallet,
        current: this.wallet,
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

    // Mark victim as completed (success) or just attempted (failure)
    if (this.currentVictim) {
      if (success) {
        this.completedVictims[this.currentVictim.name] = true;
      }
      if (!this.attemptedTonight.includes(this.currentVictim.name)) {
        this.attemptedTonight.push(this.currentVictim.name);
      }

      // Track Pierogi outcome (Floor 5 Amanda Price)
      if (this.currentFloor === 5
        && this.currentVictim.name === 'Amanda Price, CFO'
        && success) {
        this.pierogiConvinced = true;
      }
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

    this.emit('call_end', { reason, score, callResult });

    // Check if any victims remain for tonight
    const tonightRemaining = getTonightVictims(
      this.currentFloor, this.completedVictims, this.attemptedTonight
    );
    if (tonightRemaining.length === 0) {
      this.emit('no_victims_tonight');
    }

    // Auto-save after each call
    SaveManager.save(this.getSerializableState());
  }

  /**
   * End the current shift, calculate expenses, emit results.
   */
  endShift() {
    if (!this.shiftActive) return; // Idempotency guard — prevent double-charge
    this.shiftActive = false;
    const floor = FLOORS[this.currentFloor];
    const expenses = getTotalExpenses(this.currentFloor);

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

    // Failing a shift adds heat
    if (this.shiftEarnings === 0) {
      this._addHeat(20);
    }

    // Determine if floor is complete
    const floorComplete = getRemainingVictims(this.currentFloor, this.completedVictims).length === 0;

    // Save state
    SaveManager.save(this.getSerializableState());

    this.emit('shift_end', {
      shiftEarnings: this.shiftEarnings,
      expenses,
      expenseBreakdown: floor.expenses,
      wallet: this.wallet,
      shortfall,
      shortfallCount: this.shortfallCount,
      floorComplete,
      shiftResults: [...this.shiftResults],
    });
  }

  /* ------------------------------------------------------------------
   * Scoring
   * ----------------------------------------------------------------*/

  /**
   * Compute the score for the current (or just-completed) call.
   * @param {boolean} [success=true]
   * @param {string}  [reason='']
   * @returns {number}
   */
  getCallScore(success = true, reason = '') {
    if (!success) return 0;

    const floor = FLOORS[this.currentFloor];
    let score = floor.basePayout;

    // Speed bonus
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

    // Clean exit bonus
    const cleanReasons = [
      'agrees_to_pay',
      'gives_gift_card_code',
      'compliance_maxed',
    ];
    if (this.callEndedClean && cleanReasons.includes(reason)) {
      score += SCORING.cleanExitBonus;
    }

    // Combo multiplier
    const comboMultiplier = Math.min(
      1 + this.combo * SCORING.comboMultiplierStep,
      SCORING.maxComboMultiplier,
    );
    score = Math.round(score * comboMultiplier);

    return score;
  }

  /* ------------------------------------------------------------------
   * Shift timer helpers
   * ----------------------------------------------------------------*/

  /**
   * Seconds remaining in the current shift.
   * @returns {number}
   */
  getShiftRemainingSec() {
    if (!this.shiftStartTime) return this.shiftDurationSec;
    const elapsed = (Date.now() - this.shiftStartTime) / 1000;
    return Math.max(0, this.shiftDurationSec - elapsed);
  }

  /**
   * Whether the shift timer has expired.
   * @returns {boolean}
   */
  isShiftTimeUp() {
    return this.shiftActive && this.getShiftRemainingSec() <= 0;
  }

  /**
   * Get the next available victim for tonight.
   * @returns {object|null}
   */
  getNextVictimTonight() {
    return this.currentNightVictimQueue.find(v =>
      !this.attemptedTonight.includes(v.name) && !this.completedVictims[v.name]
    ) || null;
  }

  /* ------------------------------------------------------------------
   * Remittance (send money home)
   * ----------------------------------------------------------------*/

  /**
   * Send money home to family.
   * @param {number} amount
   * @returns {boolean} Whether the transfer succeeded
   */
  sendRemittance(amount) {
    if (amount > this.wallet || amount <= 0) return false;
    this.wallet -= amount;
    this.totalRemittance += amount;
    this.emit('remittance_sent', { amount, total: this.totalRemittance });
    SaveManager.save(this.getSerializableState());
    return true;
  }

  /* ------------------------------------------------------------------
   * Heat (global across floors)
   * ----------------------------------------------------------------*/

  /**
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
   * Save / Load
   * ----------------------------------------------------------------*/

  /**
   * Return a plain object suitable for JSON serialization.
   * @returns {object}
   */
  getSerializableState() {
    return {
      currentFloor: this.currentFloor,
      completedVictims: { ...this.completedVictims },
      attemptedTonight: [...this.attemptedTonight],
      wallet: this.wallet,
      shortfallCount: this.shortfallCount,
      shortfallDebt: this.shortfallDebt,
      totalRemittance: this.totalRemittance,
      heat: this.heat,
      introSeen: this.introSeen,
      pierogiConvinced: this.pierogiConvinced,
      shiftEarnings: this.shiftEarnings,
    };
  }

  /**
   * Load state from a save object (typically from SaveManager.load()).
   * @param {object} save
   */
  loadFromSave(save) {
    this.currentFloor = save.currentFloor || save.currentChapter || 1;
    this.completedVictims = { ...(save.completedVictims || {}) };
    this.attemptedTonight = [...(save.attemptedTonight || [])];
    this.wallet = save.wallet || 0;
    this.shortfallCount = save.shortfallCount || 0;
    this.shortfallDebt = save.shortfallDebt || 0;
    this.totalRemittance = save.totalRemittance || 0;
    this.heat = save.heat || 0;
    this.introSeen = save.introSeen || false;
    this.pierogiConvinced = save.pierogiConvinced || false;
    this.shiftEarnings = save.shiftEarnings || 0;
  }

  /* ------------------------------------------------------------------
   * Full reset
   * ----------------------------------------------------------------*/

  /**
   * Full reset for a brand-new game.
   */
  reset() {
    this.currentFloor = 1;
    this.completedVictims = {};
    this.attemptedTonight = [];
    this.currentNightVictimQueue = [];
    this.wallet = 0;
    this.totalRemittance = 0;
    this.shortfallCount = 0;
    this.shortfallDebt = 0;
    this.shiftEarnings = 0;
    this.shiftActive = false;
    this.shiftStartTime = null;
    this.shiftDurationSec = 300;
    this.combo = 0;
    this.shiftResults = [];
    this.suspicion = 0;
    this.compliance = 0;
    this.emotion = 'calm';
    this.callActive = false;
    this.callStartTime = null;
    this.callEndedClean = true;
    this.currentVictim = null;
    this.heat = 0;
    this.introSeen = false;
    this.pierogiConvinced = false;
    this.intelKeys = [];
    this.intelSeen = new Set();
    this.intelUsed = new Set();
  }

  /* ------------------------------------------------------------------
   * Helpers (backward-compatible)
   * ----------------------------------------------------------------*/

  /**
   * Return the floor config for the current (or specified) floor.
   * @param {number} [level]
   * @returns {object|null}
   */
  getLevelConfig(level) {
    return FLOORS[level ?? this.currentFloor] ?? null;
  }

  /**
   * Elapsed call time in seconds.
   * @returns {number}
   */
  getCallElapsedSec() {
    if (!this.callStartTime) return 0;
    return Math.round((Date.now() - this.callStartTime) / 1000);
  }

  /**
   * @deprecated Shift timer replaces per-call time limits
   */
  isCallOverTime() {
    return false;
  }
}

/* ------------------------------------------------------------------
 * Singleton instance
 * ----------------------------------------------------------------*/

const gameState = new GameState();

export default gameState;
export { GameState, SCORING, VALID_EMOTIONS, TERMINAL_EVENTS };

