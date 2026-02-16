/**
 * TutorialPopup.js - Tutorial Tip Popup System
 *
 * Displays tutorial tips in a speech-bubble-style container during Level 1.
 * Features a queue system so multiple tips are shown one at a time.
 *
 * Features:
 *   - Speech bubble styled container with downward-pointing arrow
 *   - Fade in/out transitions using tweens
 *   - Queue system: tips are displayed sequentially, never overlapping
 *   - Auto-dismiss after configurable duration
 *   - Dark/neon call center aesthetic
 *   - Programmatic drawing (no external assets)
 */

import Phaser from 'phaser';

export class TutorialPopup extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene - The scene this popup belongs to
   * @param {number} x - X position (anchor point for the bubble)
   * @param {number} y - Y position (tip of the downward arrow)
   */
  constructor(scene, x, y) {
    super(scene, x, y);

    // Queue of pending tips: [{ text, duration }]
    this.tipQueue = [];
    this.isShowing = false;
    this.currentTimer = null;

    // Bubble dimensions (will be adjusted per-tip based on text length)
    this.bubbleWidth = 360;
    this.bubbleHeight = 80;
    this.arrowHeight = 14;
    this.padding = 16;

    // --- Bubble background ---
    this.bubbleGraphics = scene.add.graphics();
    this.add(this.bubbleGraphics);

    // --- Tip text ---
    this.tipText = scene.add.text(0, 0, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '13px',
      color: '#ddeeff',
      align: 'center',
      wordWrap: { width: this.bubbleWidth - this.padding * 2 },
      lineSpacing: 4,
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5, 0.5);
    this.add(this.tipText);

    // --- Small "TIP" label ---
    this.tipLabel = scene.add.text(0, 0, '[ TIP ]', {
      fontFamily: '"Courier New", monospace',
      fontSize: '9px',
      fontStyle: 'bold',
      color: '#44aaff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5, 0.5);
    this.add(this.tipLabel);

    // Start invisible
    this.setAlpha(0);
    this.setVisible(false);

    // Add to scene
    scene.add.existing(this);
  }

  /**
   * Draw the speech bubble background with a downward-pointing arrow.
   * The bubble is positioned so the arrow tip is at (0, 0) - the container origin.
   * @param {number} textHeight - The measured height of the text content
   * @private
   */
  _drawBubble(textHeight) {
    const g = this.bubbleGraphics;
    const w = this.bubbleWidth;
    const h = textHeight + this.padding * 2 + 18; // Extra space for the TIP label
    const arrowH = this.arrowHeight;
    const arrowW = 20;
    const radius = 8;

    // The bubble sits above the arrow. Arrow tip is at (0, 0).
    const bubbleTop = -arrowH - h;
    const bubbleLeft = -w / 2;

    g.clear();

    // --- Outer glow / shadow ---
    g.fillStyle(0x1144aa, 0.15);
    g.fillRoundedRect(bubbleLeft - 3, bubbleTop - 3, w + 6, h + 6, radius + 2);

    // --- Main bubble body ---
    g.fillStyle(0x0d1a2e, 0.95);
    g.fillRoundedRect(bubbleLeft, bubbleTop, w, h, radius);

    // --- Border ---
    g.lineStyle(1.5, 0x3366aa, 0.7);
    g.strokeRoundedRect(bubbleLeft, bubbleTop, w, h, radius);

    // --- Downward arrow (triangle) ---
    g.fillStyle(0x0d1a2e, 0.95);
    g.beginPath();
    g.moveTo(-arrowW / 2, -arrowH);
    g.lineTo(0, 0);
    g.lineTo(arrowW / 2, -arrowH);
    g.closePath();
    g.fillPath();

    // Arrow border lines (left and right edges)
    g.lineStyle(1.5, 0x3366aa, 0.7);
    g.beginPath();
    g.moveTo(-arrowW / 2, -arrowH);
    g.lineTo(0, 0);
    g.lineTo(arrowW / 2, -arrowH);
    g.strokePath();

    // Cover the gap between arrow and bubble bottom edge
    g.fillStyle(0x0d1a2e, 0.95);
    g.fillRect(-arrowW / 2 + 1, -arrowH - 1, arrowW - 2, 3);

    // --- Inner top highlight for depth ---
    g.lineStyle(1, 0x2255aa, 0.2);
    g.beginPath();
    g.moveTo(bubbleLeft + radius, bubbleTop + 1);
    g.lineTo(bubbleLeft + w - radius, bubbleTop + 1);
    g.strokePath();

    // Store computed height for positioning text
    this._bubbleHeight = h;
    this._bubbleTop = bubbleTop;
  }

  /**
   * Show a tip. If another tip is currently showing, the new tip is queued.
   *
   * @param {string} text - The tip text to display
   * @param {number} [duration=4000] - How long to show the tip in milliseconds
   */
  show(text, duration = 4000) {
    // Add to queue
    this.tipQueue.push({ text, duration });

    // If nothing is currently showing, start showing the next tip
    if (!this.isShowing) {
      this._showNext();
    }
  }

  /**
   * Show the next tip from the queue. This is called internally.
   * @private
   */
  _showNext() {
    if (this.tipQueue.length === 0) {
      this.isShowing = false;
      return;
    }

    this.isShowing = true;
    const { text, duration } = this.tipQueue.shift();

    // Set the text content and measure its height
    this.tipText.setText(text);

    // Wait one frame for text metrics to update, then position everything
    this.scene.time.delayedCall(0, () => {
      const textHeight = this.tipText.height;

      // Draw the bubble sized to fit the text
      this._drawBubble(textHeight);

      // Position the TIP label at the top of the bubble
      this.tipLabel.setPosition(0, this._bubbleTop + 12);

      // Position the tip text centered in the bubble (below the label)
      this.tipText.setPosition(0, this._bubbleTop + this._bubbleHeight / 2 + 6);

      // Make visible and fade in
      this.setVisible(true);
      this.scene.tweens.add({
        targets: this,
        alpha: 1,
        duration: 300,
        ease: 'Cubic.easeOut'
      });

      // Slight upward slide on entrance
      const originalY = this.y;
      this.y = originalY + 10;
      this.scene.tweens.add({
        targets: this,
        y: originalY,
        duration: 300,
        ease: 'Back.easeOut'
      });

      // Schedule auto-hide after the specified duration
      this.currentTimer = this.scene.time.delayedCall(duration, () => {
        this._hideAndShowNext();
      });
    });
  }

  /**
   * Hide the current tip with a fade-out, then show the next queued tip.
   * @private
   */
  _hideAndShowNext() {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 250,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        this.setVisible(false);
        // Show next queued tip (if any)
        this._showNext();
      }
    });
  }

  /**
   * Immediately hide the current tip and clear the queue.
   */
  hide() {
    // Cancel the auto-hide timer
    if (this.currentTimer) {
      this.currentTimer.remove(false);
      this.currentTimer = null;
    }

    // Clear the queue
    this.tipQueue = [];
    this.isShowing = false;

    // Fade out immediately
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 200,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        this.setVisible(false);
      }
    });
  }

  /**
   * Clear the entire tip queue without affecting the currently displayed tip.
   */
  clearQueue() {
    this.tipQueue = [];
  }

  /**
   * Get the number of tips waiting in the queue (not including current).
   * @returns {number} Queue length
   */
  getQueueLength() {
    return this.tipQueue.length;
  }

  /**
   * Clean up timers and tweens when destroyed.
   */
  destroy(fromScene) {
    if (this.currentTimer) {
      this.currentTimer.remove(false);
      this.currentTimer = null;
    }
    this.tipQueue = [];
    super.destroy(fromScene);
  }
}
