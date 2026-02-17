/**
 * ArcMeter.js - Arc-shaped meter that wraps around a circular portrait.
 *
 * Draws a semicircular arc (left or right side) that fills from bottom upward.
 * Used for suspicion (red, left) and compliance (green, right) around the
 * victim portrait during calls.
 *
 * Fully programmatic — uses Phaser.GameObjects.Graphics arcs, no assets.
 */

import Phaser from 'phaser';

export class ArcMeter extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} cx - Center X (portrait center)
   * @param {number} cy - Center Y (portrait center)
   * @param {object} config
   * @param {'left'|'right'} config.side - Which side of the portrait
   * @param {string} config.label - Short label (e.g. 'SUS', 'COMP')
   * @param {number} config.color - Fill color hex (e.g. 0xff2244)
   * @param {number} [config.maxValue=100]
   * @param {number} [config.radius=44] - Arc radius (slightly larger than portrait)
   * @param {number} [config.thickness=7] - Arc stroke width
   * @param {number} [config.gap=0.15] - Gap in radians at top and bottom
   */
  constructor(scene, cx, cy, {
    side,
    label,
    color,
    maxValue = 100,
    radius = 44,
    thickness = 7,
    gap = 0.15
  }) {
    super(scene, cx, cy);

    this.side = side;
    this.fillColor = color;
    this.maxValue = maxValue;
    this.currentValue = 0;
    this.meterRadius = radius;
    this.thickness = thickness;
    this.isGlowing = false;

    // Arc angles: both start at bottom (π/2) and sweep upward to top (3π/2)
    // with a small gap at top and bottom so the two arcs don't touch.
    // Left arc: clockwise (anticlockwise=false) from bottom through left to top
    // Right arc: counter-clockwise (anticlockwise=true) from bottom through right to top
    this.arcStart = Math.PI / 2 + gap;         // just past bottom
    this.arcEnd = (3 * Math.PI) / 2 - gap;     // just before top
    this.anticlockwise = side === 'right';      // right side sweeps counter-clockwise

    // Background track
    this.trackGraphics = scene.add.graphics();
    this.add(this.trackGraphics);

    // Fill arc
    this.fillGraphics = scene.add.graphics();
    this.add(this.fillGraphics);

    // Glow overlay
    this.glowGraphics = scene.add.graphics();
    this.glowGraphics.setAlpha(0);
    this.add(this.glowGraphics);

    // Label positioned at the midpoint of the arc, offset outward
    const midAngle = side === 'left' ? Math.PI : 0;
    const labelDist = radius + thickness + 12;
    const lx = Math.cos(midAngle) * labelDist;
    const ly = Math.sin(midAngle) * labelDist;

    this.labelText = scene.add.text(lx, ly, label, {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      fontStyle: 'bold',
      color: `#${color.toString(16).padStart(6, '0')}`,
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    this.add(this.labelText);


    this._drawTrack();
    this._drawFill(0);

    scene.add.existing(this);
  }

  /** Draw the dark background track for the full arc range. */
  _drawTrack() {
    const g = this.trackGraphics;
    g.clear();
    g.lineStyle(this.thickness + 2, 0x0a0a1a, 0.7);
    g.beginPath();
    g.arc(0, 0, this.meterRadius, this.arcStart, this.arcEnd, this.anticlockwise);
    g.strokePath();

    // Subtle border
    g.lineStyle(1, 0x334466, 0.4);
    g.beginPath();
    g.arc(0, 0, this.meterRadius - this.thickness / 2 - 1, this.arcStart, this.arcEnd, this.anticlockwise);
    g.strokePath();
    g.beginPath();
    g.arc(0, 0, this.meterRadius + this.thickness / 2 + 1, this.arcStart, this.arcEnd, this.anticlockwise);
    g.strokePath();
  }

  /**
   * Draw the colored fill arc at a given percentage.
   * @param {number} percent - 0 to 1
   */
  _drawFill(percent) {
    const g = this.fillGraphics;
    g.clear();
    if (percent <= 0) return;

    const p = Math.min(percent, 1);
    const totalSweep = this.arcEnd - this.arcStart; // positive sweep (π - 2*gap)

    let fillEnd;
    if (this.side === 'left') {
      // Clockwise: startAngle + sweep * p
      fillEnd = this.arcStart + totalSweep * p;
    } else {
      // Counter-clockwise: startAngle - sweep * p
      // (mirror: we go from arcStart downward through 0/2π to arcEnd equivalent)
      fillEnd = this.arcStart - totalSweep * p;
    }

    g.lineStyle(this.thickness, this.fillColor, 0.9);
    g.beginPath();
    g.arc(0, 0, this.meterRadius, this.arcStart, fillEnd, this.anticlockwise);
    g.strokePath();

    // Bright highlight on the leading edge
    if (p > 0.05) {
      g.fillStyle(0xffffff, 0.6);
      const ex = Math.cos(fillEnd) * this.meterRadius;
      const ey = Math.sin(fillEnd) * this.meterRadius;
      g.fillCircle(ex, ey, this.thickness / 2 - 1);
    }
  }

  /** Draw glow effect overlay. */
  _drawGlow(percent) {
    const g = this.glowGraphics;
    g.clear();
    if (percent <= 0) return;

    const p = Math.min(percent, 1);
    const totalSweep = this.arcEnd - this.arcStart;
    let fillEnd;
    if (this.side === 'left') {
      fillEnd = this.arcStart + totalSweep * p;
    } else {
      fillEnd = this.arcStart - totalSweep * p;
    }

    g.lineStyle(this.thickness + 6, this.fillColor, 0.3);
    g.beginPath();
    g.arc(0, 0, this.meterRadius, this.arcStart, fillEnd, this.anticlockwise);
    g.strokePath();
  }

  _startGlow() {
    if (this.isGlowing) return;
    this.isGlowing = true;
    this.glowTween = this.scene.tweens.add({
      targets: this.glowGraphics,
      alpha: { from: 0, to: 0.7 },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

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
   * @param {number} value - 0 to maxValue
   */
  setValue(value) {
    const clamped = Phaser.Math.Clamp(value, 0, this.maxValue);
    const targetPercent = clamped / this.maxValue;
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
        if (targetPercent >= 0.8) this._startGlow();
        else this._stopGlow();
      }
    });

    this.currentValue = clamped;
  }

  getValue() {
    return this.currentValue;
  }

  destroy(fromScene) {
    this._stopGlow();
    super.destroy(fromScene);
  }
}
