/**
 * MoneyCounter.js - Animated Dollar Amount Display
 *
 * Displays the player's extracted money with a smooth count-up animation.
 * Includes a quota progress bar that fills as the player approaches their target.
 *
 * Features:
 *   - Animated count-up/count-down when value changes
 *   - Green neon text on dark panel background
 *   - Quota progress bar with color transitions
 *   - Programmatic drawing via Phaser.GameObjects.Graphics (no external assets)
 */

import Phaser from 'phaser';

export class MoneyCounter extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene - The scene this counter belongs to
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  constructor(scene, x, y) {
    super(scene, x, y);

    this.currentAmount = 0;
    this.displayAmount = 0;
    this.quota = 0;

    // --- Background panel ---
    this.panelGraphics = scene.add.graphics();
    this.add(this.panelGraphics);
    this._drawPanel();

    // --- Dollar sign label (static, slightly dimmer) ---
    this.dollarSign = scene.add.text(-90, -14, '$', {
      fontFamily: '"Courier New", monospace',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#22cc44',
      stroke: '#003300',
      strokeThickness: 2
    }).setOrigin(0, 0.5);
    this.add(this.dollarSign);

    // --- Amount text (animated) ---
    this.amountText = scene.add.text(-65, -14, '0.00', {
      fontFamily: '"Courier New", monospace',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#33ff55',
      stroke: '#003300',
      strokeThickness: 2
    }).setOrigin(0, 0.5);
    this.add(this.amountText);

    // --- "QUOTA" label ---
    this.quotaLabel = scene.add.text(-90, 12, 'QUOTA:', {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      color: '#6688aa',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0, 0.5);
    this.add(this.quotaLabel);

    // --- Quota progress bar ---
    this.quotaBarGraphics = scene.add.graphics();
    this.add(this.quotaBarGraphics);
    this._drawQuotaBar(0);

    // --- Quota amount text (right-aligned) ---
    this.quotaText = scene.add.text(90, 12, '$0 / $0', {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      color: '#6688aa',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(1, 0.5);
    this.add(this.quotaText);

    // Add to scene
    scene.add.existing(this);
  }

  /**
   * Draw the dark background panel behind the money display.
   * Styled with a subtle border and inner shadow for depth.
   * @private
   */
  _drawPanel() {
    const g = this.panelGraphics;
    const w = 200;
    const h = 55;

    g.clear();

    // Outer glow
    g.fillStyle(0x003311, 0.3);
    g.fillRoundedRect(-w / 2 - 2, -h / 2 - 2, w + 4, h + 4, 8);

    // Main panel background
    g.fillStyle(0x0a0a1a, 0.9);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 6);

    // Border
    g.lineStyle(1.5, 0x22553a, 0.8);
    g.strokeRoundedRect(-w / 2, -h / 2, w, h, 6);

    // Inner shadow top edge
    g.lineStyle(1, 0x000000, 0.4);
    g.beginPath();
    g.moveTo(-w / 2 + 6, -h / 2 + 1);
    g.lineTo(w / 2 - 6, -h / 2 + 1);
    g.strokePath();
  }

  /**
   * Draw the quota progress bar at the given fill percentage.
   * Bar color shifts from red -> yellow -> green as quota completion increases.
   * @param {number} percent - Fill percentage from 0 to 1
   * @private
   */
  _drawQuotaBar(percent) {
    const g = this.quotaBarGraphics;
    const barX = -38;
    const barY = 8;
    const barW = 120;
    const barH = 8;

    g.clear();

    // Bar background
    g.fillStyle(0x111122, 0.8);
    g.fillRoundedRect(barX, barY, barW, barH, 3);

    // Bar border
    g.lineStyle(1, 0x334455, 0.6);
    g.strokeRoundedRect(barX, barY, barW, barH, 3);

    if (percent <= 0) return;

    // Determine fill color based on quota completion
    let fillColor;
    if (percent >= 1.0) {
      fillColor = 0x33ff55; // Bright green - quota met
    } else if (percent >= 0.7) {
      fillColor = 0x88dd33; // Yellow-green - almost there
    } else if (percent >= 0.4) {
      fillColor = 0xddaa22; // Yellow - making progress
    } else {
      fillColor = 0xdd4422; // Red - far from quota
    }

    const fillW = Math.min((barW - 2) * percent, barW - 2);

    // Fill bar
    g.fillStyle(fillColor, 0.85);
    g.fillRoundedRect(barX + 1, barY + 1, fillW, barH - 2, 2);

    // Highlight on top edge of fill
    g.fillStyle(0xffffff, 0.15);
    g.fillRect(barX + 2, barY + 1, fillW - 2, 1);
  }

  /**
   * Set the quota target for the progress bar.
   * @param {number} quota - The dollar amount the player needs to reach
   */
  setQuota(quota) {
    this.quota = quota;
    this._updateQuotaDisplay();
  }

  /**
   * Update the quota text and progress bar to reflect the current amount.
   * @private
   */
  _updateQuotaDisplay() {
    const percent = this.quota > 0 ? this.currentAmount / this.quota : 0;
    this._drawQuotaBar(Math.min(percent, 1));
    this.quotaText.setText(`$${Math.round(this.currentAmount)} / $${this.quota}`);

    // Flash the quota text green when quota is met
    if (percent >= 1.0 && this.quotaLabel.style.color !== '#33ff55') {
      this.quotaLabel.setColor('#33ff55');
      this.quotaText.setColor('#33ff55');
    }
  }

  /**
   * Smoothly animate the display to a new dollar amount.
   * The number counts up/down over a short duration for a satisfying effect.
   * @param {number} amount - The new dollar amount to display
   */
  setValue(amount) {
    const previousAmount = this.currentAmount;
    this.currentAmount = amount;

    // Kill any existing count-up tween
    if (this.countTween) {
      this.countTween.stop();
    }

    // Animate the displayed number from current to target
    const proxy = { value: this.displayAmount };
    this.countTween = this.scene.tweens.add({
      targets: proxy,
      value: amount,
      duration: 600,
      ease: 'Cubic.easeOut',
      onUpdate: () => {
        this.displayAmount = proxy.value;
        this.amountText.setText(proxy.value.toFixed(2));
        // Update quota bar during animation
        const percent = this.quota > 0 ? proxy.value / this.quota : 0;
        this._drawQuotaBar(Math.min(percent, 1));
        this.quotaText.setText(`$${Math.round(proxy.value)} / $${this.quota}`);
      },
      onComplete: () => {
        this.displayAmount = amount;
        this.amountText.setText(amount.toFixed(2));
        this._updateQuotaDisplay();
      }
    });

    // Pop/scale effect when money increases
    if (amount > previousAmount) {
      this.scene.tweens.add({
        targets: this.amountText,
        scaleX: 1.15,
        scaleY: 1.15,
        duration: 100,
        yoyo: true,
        ease: 'Back.easeOut'
      });

      // Brief green flash on the dollar sign
      this.scene.tweens.add({
        targets: this.dollarSign,
        alpha: 0.5,
        duration: 80,
        yoyo: true
      });
    }
  }

  /**
   * Add a delta amount to the current value (convenience method).
   * Triggers the same count-up animation as setValue.
   * @param {number} delta - Amount to add (can be negative)
   */
  addMoney(delta) {
    this.setValue(this.currentAmount + delta);
  }

  /**
   * Get the current dollar amount.
   * @returns {number} Current amount
   */
  getValue() {
    return this.currentAmount;
  }

  /**
   * Clean up tweens when destroyed.
   */
  destroy(fromScene) {
    if (this.countTween) {
      this.countTween.stop();
    }
    super.destroy(fromScene);
  }
}
