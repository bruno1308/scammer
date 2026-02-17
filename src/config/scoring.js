/**
 * scoring.js - Call Scoring and Performance Calculation
 *
 * Calculates the final score for each completed call based on multiple factors:
 *   - Base score: Money extracted from the victim
 *   - Speed bonus: Faster calls earn multipliers
 *   - Suspicion bonus: Lower final suspicion earns multipliers
 *   - Clean exit bonus: No police threat during the call
 *   - Combo bonus: Consecutive successful calls multiply earnings
 *
 * The scoring system rewards efficient, convincing scam calls
 * while penalizing sloppy play that raises suspicion.
 */

/**
 * Calculate the final score for a completed call.
 *
 * @param {object} callData - Data from the completed call
 * @param {number} callData.moneyExtracted - Dollar amount extracted from the victim
 * @param {number} callData.callDuration - Duration of the call in seconds
 * @param {number} callData.finalSuspicion - Victim's suspicion level at call end (0-100)
 * @param {boolean} callData.cleanExit - True if the call ended without police being threatened
 * @param {number} callData.combo - Number of consecutive successful calls (0-based)
 * @param {number} callData.level - Current level number (1-5)
 * @returns {number} The final calculated score (rounded to nearest integer)
 */
export function calculateCallScore(callData) {
  // Base score is the raw money extracted
  let score = callData.moneyExtracted;

  // --- Speed Bonus ---
  // Faster calls demonstrate efficiency and confidence.
  // Under 90 seconds: 1.5x multiplier (exceptional speed)
  // Under 120 seconds: 1.25x multiplier (good speed)
  // Under 180 seconds: 1.1x multiplier (decent speed)
  // 180+ seconds: No speed bonus
  if (callData.callDuration < 90) {
    score *= 1.5;
  } else if (callData.callDuration < 120) {
    score *= 1.25;
  } else if (callData.callDuration < 180) {
    score *= 1.1;
  }

  // --- Low Suspicion Bonus ---
  // Keeping the victim unsuspecting means a smoother operation.
  // Under 30 suspicion: 1.3x multiplier (masterful deception)
  // Under 50 suspicion: 1.15x multiplier (decent cover)
  // 50+ suspicion: No suspicion bonus
  if (callData.finalSuspicion < 30) {
    score *= 1.3;
  } else if (callData.finalSuspicion < 50) {
    score *= 1.15;
  }

  // --- Clean Exit Bonus ---
  // No police threat during the call means less heat on the operation.
  // 1.2x multiplier for a clean exit.
  if (callData.cleanExit) {
    score *= 1.2;
  }

  // --- Combo Bonus ---
  // Consecutive successful calls show consistency.
  // 3+ combo: 1.5x multiplier
  // 2 combo: 1.25x multiplier
  // 0-1 combo: No combo bonus
  if (callData.combo >= 3) {
    score *= 1.5;
  } else if (callData.combo >= 2) {
    score *= 1.25;
  }

  return Math.round(score);
}

/**
 * Calculate a breakdown of all score bonuses for display on the results screen.
 * Returns an object with each bonus category and its multiplier.
 *
 * @param {object} callData - Same callData object as calculateCallScore
 * @returns {object} Breakdown of multipliers applied
 */
export function getScoreBreakdown(callData) {
  const breakdown = {
    base: callData.moneyExtracted,
    speedMultiplier: 1.0,
    speedLabel: 'None',
    suspicionMultiplier: 1.0,
    suspicionLabel: 'None',
    cleanExitMultiplier: 1.0,
    cleanExitLabel: 'No',
    comboMultiplier: 1.0,
    comboLabel: 'None',
    finalScore: 0
  };

  // Speed
  if (callData.callDuration < 90) {
    breakdown.speedMultiplier = 1.5;
    breakdown.speedLabel = 'Lightning (< 90s)';
  } else if (callData.callDuration < 120) {
    breakdown.speedMultiplier = 1.25;
    breakdown.speedLabel = 'Quick (< 120s)';
  } else if (callData.callDuration < 180) {
    breakdown.speedMultiplier = 1.1;
    breakdown.speedLabel = 'Decent (< 180s)';
  }

  // Suspicion
  if (callData.finalSuspicion < 30) {
    breakdown.suspicionMultiplier = 1.3;
    breakdown.suspicionLabel = 'Masterful (< 30)';
  } else if (callData.finalSuspicion < 50) {
    breakdown.suspicionMultiplier = 1.15;
    breakdown.suspicionLabel = 'Decent (< 50)';
  }

  // Clean exit
  if (callData.cleanExit) {
    breakdown.cleanExitMultiplier = 1.2;
    breakdown.cleanExitLabel = 'Yes';
  }

  // Combo
  if (callData.combo >= 3) {
    breakdown.comboMultiplier = 1.5;
    breakdown.comboLabel = `x${callData.combo} Streak!`;
  } else if (callData.combo >= 2) {
    breakdown.comboMultiplier = 1.25;
    breakdown.comboLabel = `x${callData.combo} Streak`;
  }

  breakdown.finalScore = calculateCallScore(callData);

  return breakdown;
}
