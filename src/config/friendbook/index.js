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
