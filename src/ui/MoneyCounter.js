/**
 * MoneyCounter.js - Animated Dollar Amount Display
 *
 * Displays the player's extracted money with a smooth count-up animation.
 *
 * Features:
 *   - Animated count-up/count-down when value changes
 *   - Green neon text on dark panel background
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

    // --- Background panel ---
    this.panelGraphics = scene.add.graphics();
    this.add(this.panelGraphics);
    this._drawPanel();

    // --- Dollar sign label (static, slightly dimmer) ---
    this.dollarSign = scene.add.text(-90, -8, '$', {
      fontFamily: '"Courier New", monospace',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#22cc44',
      stroke: '#003300',
      strokeThickness: 2
    }).setOrigin(0, 0.5);
    this.add(this.dollarSign);

    // --- Amount text (animated) ---
    this.amountText = scene.add.text(-65, -8, '0.00', {
      fontFamily: '"Courier New", monospace',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#33ff55',
      stroke: '#003300',
      strokeThickness: 2
    }).setOrigin(0, 0.5);
    this.add(this.amountText);

    // Add to scene
    scene.add.existing(this);
  }

  /**
   * Draw the dark background panel behind the money display.
   * @private
   */
  _drawPanel() {
    const g = this.panelGraphics;
    const w = 200;
    const h = 40;

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
   * Smoothly animate the display to a new dollar amount.
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
      },
      onComplete: () => {
        this.displayAmount = amount;
        this.amountText.setText(amount.toFixed(2));
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
   * @param {number} delta - Amount to add (can be negative)
   */
  addMoney(delta) {
    this.setValue(this.currentAmount + delta);
  }

  /**
   * Get the current dollar amount.
   * @returns {number}
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
