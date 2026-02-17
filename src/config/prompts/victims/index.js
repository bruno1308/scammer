/**
 * Per-victim personality barrel export.
 * Provides unique voice, filter params, and personality blocks for all 20 victims.
 */

import { FLOOR1_VICTIMS } from './floor1.js';
import { FLOOR2_VICTIMS } from './floor2.js';
import { FLOOR3_VICTIMS } from './floor3.js';
import { FLOOR4_VICTIMS } from './floor4.js';
import { FLOOR5_VICTIMS } from './floor5.js';

const ALL_VICTIMS = {
  ...FLOOR1_VICTIMS,
  ...FLOOR2_VICTIMS,
  ...FLOOR3_VICTIMS,
  ...FLOOR4_VICTIMS,
  ...FLOOR5_VICTIMS,
};

/**
 * Look up a victim's personality config by name.
 * @param {string} victimName - Exact victim name as it appears in FLOORS config
 * @returns {{ voice: string, filterParams: object, personalityBlock: string } | null}
 */
export function getVictimPersonality(victimName) {
  return ALL_VICTIMS[victimName] || null;
}

export {
  FLOOR1_VICTIMS,
  FLOOR2_VICTIMS,
  FLOOR3_VICTIMS,
  FLOOR4_VICTIMS,
  FLOOR5_VICTIMS,
};
