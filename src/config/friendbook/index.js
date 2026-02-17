import { getLevel1FriendBook, LEVEL1_DATA } from './level1.js';
import { getLevel2FriendBook, LEVEL2_DATA } from './level2.js';
import { getLevel3FriendBook, LEVEL3_DATA } from './level3.js';
import { getLevel4FriendBook, LEVEL4_DATA } from './level4.js';
import { getLevel5FriendBook, LEVEL5_DATA } from './level5.js';

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

/** Cached result for getAllProfiles */
let _allProfilesCache = null;

/**
 * Get every profile and their posts across all levels.
 * @returns {{ profiles: Object, posts: Object }}
 */
export function getAllProfiles() {
  if (_allProfilesCache) return _allProfilesCache;

  const allProfiles = {};
  const allPosts = {};

  for (const levelData of [LEVEL1_DATA, LEVEL2_DATA, LEVEL3_DATA, LEVEL4_DATA, LEVEL5_DATA]) {
    for (const victimData of Object.values(levelData)) {
      Object.assign(allProfiles, victimData.profiles);
      Object.assign(allPosts, victimData.posts);
    }
  }

  _allProfilesCache = { profiles: allProfiles, posts: allPosts };
  return _allProfilesCache;
}
