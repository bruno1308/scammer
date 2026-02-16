/**
 * CallTimer.js - Call Duration Timer
 *
 * Displays the elapsed time of the current phone call in MM:SS format.
 * Changes color based on duration to create urgency:
 *   - White: 0 - 2 minutes (normal)
 *   - Yellow: 2 - 3 minutes (getting long)
 *   - Red: 3+ minutes (danger zone)
 *
 * Features:
 *   - Precise timing via scene.time.addEvent
 *   - Smooth color transitions at time thresholds
 *   - Dark/neon styled background panel
 *   - Programmatic drawing (no external assets)
 */

import Phaser from 'phaser';

export class CallTimer extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene - The scene this timer belongs to
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  constructor(scene, x, y) {
    super(scene, x, y);

    this.elapsedSeconds = 0;
    this.isRunning = false;
    this.timerEvent = null;

    // Color thresholds (in seconds)
    this.yellowThreshold = 120; // 2 minutes
    this.redThreshold = 180;    // 3 minutes

    // --- Background panel ---
    this.panelGraphics = scene.add.graphics();
    this.add(this.panelGraphics);
    this._drawPanel();

    // --- Small "CALL TIME" label ---
    this.labelText = scene.add.text(0, -10, 'CALL TIME', {
      fontFamily: '"Courier New", monospace',
      fontSize: '9px',
      color: '#6688aa',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5, 0.5);
    this.add(this.labelText);

    // --- Timer display (MM:SS) ---
    this.timerText = scene.add.text(0, 8, '00:00', {
      fontFamily: '"Courier New", monospace',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5, 0.5);
    this.add(this.timerText);

    // --- Blinking recording dot (left of timer) ---
    this.recordDot = scene.add.graphics();
    this.recordDot.setPosition(-48, 8);
    this.recordDot.setAlpha(0);
    this.add(this.recordDot);
    this._drawRecordDot();

    // Add to scene
    scene.add.existing(this);
  }

  /**
   * Draw the dark background panel behind the timer.
   * @private
   */
  _drawPanel() {
    const g = this.panelGraphics;
    const w = 130;
    const h = 40;

    g.clear();

    // Panel background
    g.fillStyle(0x0a0a1a, 0.85);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 5);

    // Border
    g.lineStyle(1, 0x334466, 0.7);
    g.strokeRoundedRect(-w / 2, -h / 2, w, h, 5);
  }

  /**
   * Draw the small red recording indicator dot.
   * @private
   */
  _drawRecordDot() {
    const g = this.recordDot;
    g.clear();
    g.fillStyle(0xff2222, 1);
    g.fillCircle(0, 0, 4);
    // Glow
    g.fillStyle(0xff2222, 0.3);
    g.fillCircle(0, 0, 7);
  }

  /**
   * Format elapsed seconds as MM:SS string.
   * @param {number} totalSeconds - Total elapsed seconds
   * @returns {string} Formatted time string
   * @private
   */
  _formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  /**
   * Update the timer display and color based on the current elapsed time.
   * Called every second while the timer is running.
   * @private
   */
  _tick() {
    this.elapsedSeconds++;
    this.timerText.setText(this._formatTime(this.elapsedSeconds));

    // Update text color based on thresholds
    if (this.elapsedSeconds >= this.redThreshold) {
      // Red zone: 3+ minutes
      this.timerText.setColor('#ff3333');
      this.labelText.setColor('#ff5555');

      // Pulse effect in red zone
      if (!this._redPulsing) {
        this._redPulsing = true;
        this.pulseTween = this.scene.tweens.add({
          targets: this.timerText,
          alpha: { from: 1, to: 0.5 },
          duration: 500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    } else if (this.elapsedSeconds >= this.yellowThreshold) {
      // Yellow zone: 2-3 minutes
      this.timerText.setColor('#ffdd33');
      this.labelText.setColor('#aaaa55');
    }
    // White is the default color set in the constructor
  }

  /**
   * Start the timer. Creates a repeating time event that ticks every second.
   * Also starts the blinking recording dot animation.
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Create the ticking timer event (1 second interval)
    this.timerEvent = this.scene.time.addEvent({
      delay: 1000,
      callback: this._tick,
      callbackScope: this,
      loop: true
    });

    // Animate the recording dot (blink on/off)
    this.recordDotTween = this.scene.tweens.add({
      targets: this.recordDot,
      alpha: { from: 1, to: 0 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Stop the timer. Freezes the display at the current elapsed time.
   */
  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;

    // Remove the ticking event
    if (this.timerEvent) {
      this.timerEvent.remove(false);
      this.timerEvent = null;
    }

    // Stop the recording dot blink
    if (this.recordDotTween) {
      this.recordDotTween.stop();
      this.recordDotTween = null;
    }
    this.recordDot.setAlpha(0);

    // Stop any pulse effects
    if (this.pulseTween) {
      this.pulseTween.stop();
      this.pulseTween = null;
      this.timerText.setAlpha(1);
    }
    this._redPulsing = false;
  }

  /**
   * Reset the timer back to 00:00. Also resets colors to default.
   */
  reset() {
    this.stop();
    this.elapsedSeconds = 0;
    this.timerText.setText('00:00');
    this.timerText.setColor('#ffffff');
    this.labelText.setColor('#6688aa');
    this.timerText.setAlpha(1);
    this._redPulsing = false;
  }

  /**
   * Get the total elapsed time in seconds.
   * @returns {number} Elapsed seconds since start
   */
  getElapsed() {
    return this.elapsedSeconds;
  }

  /**
   * Clean up timer events and tweens when destroyed.
   */
  destroy(fromScene) {
    this.stop();
    super.destroy(fromScene);
  }
}
