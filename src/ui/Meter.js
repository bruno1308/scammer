/**
 * Meter.js - Animated Vertical Meter Bar
 *
 * A polished vertical meter bar with dark/neon call center aesthetic.
 * Used for displaying suspicion and compliance levels during calls.
 *
 * Features:
 *   - Smooth tween-based fill animation
 *   - Pulsing glow effect when value exceeds 80%
 *   - Programmatic drawing via Phaser.GameObjects.Graphics (no external assets)
 *   - Configurable label, color, dimensions, and max value
 */

import Phaser from 'phaser';

export class Meter extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene - The scene this meter belongs to
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {object} config - Meter configuration
   * @param {string} config.label - Label text displayed above the meter
   * @param {number} config.color - Fill color as a hex number (e.g. 0xff0000)
   * @param {number} config.maxValue - Maximum value the meter can represent
   * @param {number} [config.width=30] - Width of the meter bar in pixels
   * @param {number} [config.height=200] - Height of the meter bar in pixels
   */
  constructor(scene, x, y, { label, color, maxValue, width = 30, height = 200 }) {
    super(scene, x, y);

    this.meterWidth = width;
    this.meterHeight = height;
    this.maxValue = maxValue;
    this.currentValue = 0;
    this.fillColor = color;
    this.isGlowing = false;

    // --- Frame (dark border with subtle neon outline) ---
    this.frameGraphics = scene.add.graphics();
    this.add(this.frameGraphics);

    // --- Fill bar (colored portion representing current value) ---
    this.fillGraphics = scene.add.graphics();
    this.add(this.fillGraphics);

    // --- Glow overlay (used for the pulse effect above 80%) ---
    this.glowGraphics = scene.add.graphics();
    this.glowGraphics.setAlpha(0);
    this.add(this.glowGraphics);

    // --- Label text above the meter ---
    this.labelText = scene.add.text(0, -20, label, {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      color: '#aaddff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5, 1);
    this.add(this.labelText);

    // --- Value text below the meter showing numeric value ---
    this.valueText = scene.add.text(0, this.meterHeight + 8, '0', {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#ffffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5, 0);
    this.add(this.valueText);

    // Draw the initial frame and empty fill
    this._drawFrame();
    this._drawFill(0);

    // Add this container to the scene
    scene.add.existing(this);
  }

  /**
   * Draw the meter frame (outer border and dark background).
   * Uses a subtle neon border glow effect for the call center aesthetic.
   * @private
   */
  _drawFrame() {
    const g = this.frameGraphics;
    const w = this.meterWidth;
    const h = this.meterHeight;
    const halfW = w / 2;

    g.clear();

    // Outer glow border - subtle neon edge
    g.lineStyle(3, 0x334466, 0.6);
    g.strokeRoundedRect(-halfW - 2, -2, w + 4, h + 4, 4);

    // Main border
    g.lineStyle(2, 0x556688, 0.9);
    g.strokeRoundedRect(-halfW, 0, w, h, 3);

    // Dark inner fill (background of the meter)
    g.fillStyle(0x0a0a1a, 0.85);
    g.fillRoundedRect(-halfW + 1, 1, w - 2, h - 2, 2);

    // Subtle inner shadow lines for depth
    g.lineStyle(1, 0x000000, 0.3);
    g.strokeRoundedRect(-halfW + 1, 1, w - 2, h - 2, 2);
  }

  /**
   * Draw the fill bar at the specified percentage.
   * The fill grows upward from the bottom of the meter.
   * @param {number} percent - Fill percentage from 0 to 1
   * @private
   */
  _drawFill(percent) {
    const g = this.fillGraphics;
    const w = this.meterWidth;
    const h = this.meterHeight;
    const halfW = w / 2;

    g.clear();

    if (percent <= 0) return;

    const fillHeight = Math.max(0, (h - 4) * Math.min(percent, 1));
    const fillY = h - 2 - fillHeight;

    // Main fill bar
    g.fillStyle(this.fillColor, 0.9);
    g.fillRoundedRect(-halfW + 2, fillY, w - 4, fillHeight, 2);

    // Lighter highlight on the left edge for a 3D look
    const lighterColor = Phaser.Display.Color.IntegerToColor(this.fillColor);
    lighterColor.lighten(30);
    g.fillStyle(lighterColor.color, 0.3);
    g.fillRect(-halfW + 2, fillY, 3, fillHeight);

    // Top edge highlight (subtle white line across the top of the fill)
    if (fillHeight > 2) {
      g.fillStyle(0xffffff, 0.2);
      g.fillRect(-halfW + 3, fillY, w - 6, 1);
    }
  }

  /**
   * Draw the glow overlay for the pulse effect.
   * @param {number} percent - Fill percentage from 0 to 1
   * @private
   */
  _drawGlow(percent) {
    const g = this.glowGraphics;
    const w = this.meterWidth;
    const h = this.meterHeight;
    const halfW = w / 2;

    g.clear();

    if (percent <= 0) return;

    const fillHeight = (h - 4) * Math.min(percent, 1);
    const fillY = h - 2 - fillHeight;

    // Glow effect - a brighter, wider version of the fill
    g.fillStyle(this.fillColor, 0.5);
    g.fillRoundedRect(-halfW, fillY - 2, w, fillHeight + 4, 3);

    // Extra bright core
    g.fillStyle(0xffffff, 0.15);
    g.fillRoundedRect(-halfW + 2, fillY, w - 4, fillHeight, 2);
  }

  /**
   * Start the pulsing glow animation when the meter is above 80%.
   * The glow fades in and out in a continuous loop.
   * @private
   */
  _startGlow() {
    if (this.isGlowing) return;
    this.isGlowing = true;

    this.glowTween = this.scene.tweens.add({
      targets: this.glowGraphics,
      alpha: { from: 0, to: 0.6 },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Stop the pulsing glow animation.
   * @private
   */
  _stopGlow() {
    if (!this.isGlowing) return;
    this.isGlowing = false;

    if (this.glowTween) {
      this.glowTween.stop();
      this.glowTween = null;
    }
    this.glowGraphics.setAlpha(0);
  }

  /**
   * Smoothly animate the meter to a new value.
   * @param {number} value - The new value (will be clamped to 0..maxValue)
   */
  setValue(value) {
    const clampedValue = Phaser.Math.Clamp(value, 0, this.maxValue);
    const targetPercent = clampedValue / this.maxValue;

    // Animate using a tween on a proxy object
    const proxy = { percent: this.currentValue / this.maxValue };

    this.scene.tweens.add({
      targets: proxy,
      percent: targetPercent,
      duration: 400,
      ease: 'Cubic.easeOut',
      onUpdate: () => {
        this._drawFill(proxy.percent);
        this._drawGlow(proxy.percent);
      },
      onComplete: () => {
        // Update glow state based on final value
        if (targetPercent >= 0.8) {
          this._startGlow();
        } else {
          this._stopGlow();
        }
      }
    });

    this.currentValue = clampedValue;

    // Update the numeric display
    this.valueText.setText(Math.round(clampedValue).toString());
  }

  /**
   * Get the current value of the meter.
   * @returns {number} Current meter value
   */
  getValue() {
    return this.currentValue;
  }

  /**
   * Clean up tweens and graphics when this container is destroyed.
   */
  destroy(fromScene) {
    this._stopGlow();
    super.destroy(fromScene);
  }
}
