import { getPromptConfig as getLevel1Config } from './level1.js';
import { getPromptConfig as getLevel2Config } from './level2.js';
import { getPromptConfig as getLevel3Config } from './level3.js';
import { getPromptConfig as getLevel4Config } from './level4.js';
import { getPromptConfig as getLevel5Config } from './level5.js';

const levelConfigs = {
  1: getLevel1Config,
  2: getLevel2Config,
  3: getLevel3Config,
  4: getLevel4Config,
  5: getLevel5Config,
};

/**
 * Get the prompt configuration for a given level, interpolated with victim data.
 * @param {number} level - Level number (1-5)
 * @param {string} name - Victim name
 * @param {number} age - Victim age
 * @param {string} location - Victim location
 * @returns {{ instructions: string, tools: object[], voice: string }}
 */
export function getPromptConfig(level, name, age, location) {
  const configFn = levelConfigs[level];
  if (!configFn) throw new Error(`Unknown level: ${level}`);
  return configFn(name, age, location);
}
