/**
 * SaveManager.js - Multi-Slot localStorage Persistence Layer
 *
 * Supports 4 save slots. All load/save/reset/exists calls use the
 * currently active slot. Set the slot once when the player picks one
 * on the menu, then every other system works unchanged.
 */

const SAVE_PREFIX = 'scammer_sim_save_';
const MAX_SLOTS = 4;

const DEFAULT_SAVE = {
  // Progress
  currentFloor: 1,
  completedVictims: {},
  attemptedTonight: [],

  // Economy
  wallet: 0,
  shortfallCount: 0,
  shortfallDebt: 0,
  totalRemittance: 0,
  heat: 0,

  // Flags
  introSeen: false,
  pierogiConvinced: false,

  // Per-shift (transient, but kept for mid-session recovery)
  shiftEarnings: 0,
};

class SaveManager {
  /** Currently active slot (1-4). Set by MenuScene slot selection. */
  static activeSlot = 1;

  // --------------------------------------------------------------------
  //  Slot key helpers
  // --------------------------------------------------------------------

  static _key(slot) {
    return `${SAVE_PREFIX}${slot ?? SaveManager.activeSlot}`;
  }

  /**
   * Set the active save slot. All subsequent load/save/reset/exists
   * calls will target this slot.
   * @param {number} slot - 1 through 4
   */
  static setActiveSlot(slot) {
    if (slot < 1 || slot > MAX_SLOTS) {
      console.warn(`[SaveManager] Invalid slot ${slot}, clamping to 1-${MAX_SLOTS}`);
      slot = Math.max(1, Math.min(MAX_SLOTS, slot));
    }
    SaveManager.activeSlot = slot;
  }

  // --------------------------------------------------------------------
  //  Core CRUD (use activeSlot by default)
  // --------------------------------------------------------------------

  /**
   * Load save from localStorage for the active (or specified) slot.
   * @param {number} [slot] - Optional slot override
   * @returns {object}
   */
  static load(slot) {
    try {
      const raw = localStorage.getItem(SaveManager._key(slot));
      if (!raw) return { ...DEFAULT_SAVE, completedVictims: {} };
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_SAVE,
        ...parsed,
        completedVictims: { ...(parsed.completedVictims || {}) },
        attemptedTonight: [...(parsed.attemptedTonight || [])],
      };
    } catch (err) {
      console.warn('[SaveManager] Failed to load save, returning defaults:', err);
      return { ...DEFAULT_SAVE, completedVictims: {} };
    }
  }

  /**
   * Save state to localStorage for the active (or specified) slot.
   * @param {object} state
   * @param {number} [slot] - Optional slot override
   */
  static save(state, slot) {
    try {
      localStorage.setItem(SaveManager._key(slot), JSON.stringify(state));
    } catch (err) {
      console.error('[SaveManager] Failed to save:', err);
    }
  }

  /**
   * Clear a save slot and return fresh defaults.
   * @param {number} [slot] - Optional slot override
   * @returns {object}
   */
  static reset(slot) {
    try {
      localStorage.removeItem(SaveManager._key(slot));
    } catch (err) {
      console.warn('[SaveManager] Failed to clear save:', err);
    }
    return { ...DEFAULT_SAVE, completedVictims: {} };
  }

  /**
   * Check if a save exists in the active (or specified) slot.
   * @param {number} [slot] - Optional slot override
   * @returns {boolean}
   */
  static exists(slot) {
    try {
      return localStorage.getItem(SaveManager._key(slot)) !== null;
    } catch {
      return false;
    }
  }

  // --------------------------------------------------------------------
  //  Multi-slot helpers
  // --------------------------------------------------------------------

  /**
   * Get a summary of all 4 save slots for the slot selection UI.
   * @returns {Array<{ slot: number, empty: boolean, floor: number, wallet: number, completedCount: number, floorName: string }>}
   */
  static getAllSlotSummaries() {
    const summaries = [];
    for (let s = 1; s <= MAX_SLOTS; s++) {
      summaries.push(SaveManager.getSlotSummary(s));
    }
    return summaries;
  }

  /**
   * Get a display summary for a single slot.
   * @param {number} slot
   * @returns {{ slot: number, empty: boolean, floor: number, wallet: number, completedCount: number }}
   */
  static getSlotSummary(slot) {
    if (!SaveManager.exists(slot)) {
      return { slot, empty: true, floor: 0, wallet: 0, completedCount: 0 };
    }
    const save = SaveManager.load(slot);
    return {
      slot,
      empty: false,
      floor: save.currentFloor || save.currentChapter || 1,
      wallet: save.wallet || 0,
      completedCount: Object.keys(save.completedVictims || {}).length,
      totalRemittance: save.totalRemittance || 0,
      heat: save.heat || 0,
    };
  }

  /**
   * Migrate old single-slot save (if any) into slot 1.
   * Called once at boot. Safe to call multiple times.
   */
  static migrateOldSave() {
    try {
      const oldKey = 'scammer_sim_save';
      const raw = localStorage.getItem(oldKey);
      if (raw && !SaveManager.exists(1)) {
        localStorage.setItem(SaveManager._key(1), raw);
        localStorage.removeItem(oldKey);
      }
    } catch {
      // ignore
    }
  }

  // --------------------------------------------------------------------
  //  Convenience helpers (operate on activeSlot)
  // --------------------------------------------------------------------

  static markVictimCompleted(name) {
    const save = SaveManager.load();
    save.completedVictims[name] = true;
    SaveManager.save(save);
  }

  static isVictimCompleted(name) {
    const save = SaveManager.load();
    return !!save.completedVictims[name];
  }

  static getFloorProgress(floor, floorVictims) {
    const save = SaveManager.load();
    const total = floorVictims.length;
    const remaining = floorVictims.filter(v => !save.completedVictims[v.name]);
    return { total, completed: total - remaining.length, remaining };
  }

  static markAttemptedTonight(name) {
    const save = SaveManager.load();
    if (!save.attemptedTonight.includes(name)) {
      save.attemptedTonight.push(name);
      SaveManager.save(save);
    }
  }

  static isAttemptedTonight(name) {
    const save = SaveManager.load();
    return save.attemptedTonight.includes(name);
  }

  static resetTonightAttempts() {
    const save = SaveManager.load();
    save.attemptedTonight = [];
    SaveManager.save(save);
  }
}

export default SaveManager;
