import { getLevel2WebMail } from './level2.js';
import { getLevel3WebMail } from './level3.js';

const levelGetters = {
  2: getLevel2WebMail,
  3: getLevel3WebMail,
};

/**
 * Get WebMail inbox data for a victim at a given level.
 * @param {number} level
 * @param {string} victimName
 * @returns {object|null} { emails: Array<{id, from, subject, date, body, isRead, folder, intel?}> }
 */
export function getWebMailData(level, victimName) {
  const getter = levelGetters[level];
  if (!getter) return null;
  return getter(victimName);
}
