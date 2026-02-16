/**
 * VictimCard.js - Victim Information Display Card
 *
 * Displays victim details in a CRM-style card on the scammer's monitor.
 * Shows the victim's name, age, location, brief notes, and a portrait placeholder.
 *
 * Features:
 *   - Dark panel with subtle neon border (CRM card aesthetic)
 *   - Programmatic portrait silhouette (no external assets needed)
 *   - Layout: portrait area on left, text info on right
 *   - Clean text hierarchy with color-coded labels
 */

import Phaser from 'phaser';

export class VictimCard extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene - The scene this card belongs to
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  constructor(scene, x, y) {
    super(scene, x, y);

    // Card dimensions
    this.cardWidth = 320;
    this.cardHeight = 160;

    // --- Card background panel ---
    this.panelGraphics = scene.add.graphics();
    this.add(this.panelGraphics);
    this._drawPanel();

    // --- Portrait area (left side) ---
    this.portraitGraphics = scene.add.graphics();
    this.portraitGraphics.setPosition(-this.cardWidth / 2 + 50, 0);
    this.add(this.portraitGraphics);
    this._drawDefaultPortrait();

    // --- "CALLER INFO" header label ---
    this.headerText = scene.add.text(-this.cardWidth / 2 + 100, -this.cardHeight / 2 + 12, 'CALLER INFO', {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#4488aa',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0, 0);
    this.add(this.headerText);

    // --- Horizontal divider line under the header ---
    this.dividerGraphics = scene.add.graphics();
    this.add(this.dividerGraphics);
    this._drawDivider();

    // --- Name text ---
    this.nameText = scene.add.text(-this.cardWidth / 2 + 100, -this.cardHeight / 2 + 32, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#eeeeff',
      stroke: '#000000',
      strokeThickness: 2,
      wordWrap: { width: 200 }
    }).setOrigin(0, 0);
    this.add(this.nameText);

    // --- Age and location text ---
    this.detailsText = scene.add.text(-this.cardWidth / 2 + 100, -this.cardHeight / 2 + 54, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#8899aa',
      stroke: '#000000',
      strokeThickness: 1,
      wordWrap: { width: 200 }
    }).setOrigin(0, 0);
    this.add(this.detailsText);

    // --- Notes section label ---
    this.notesLabel = scene.add.text(-this.cardWidth / 2 + 100, -this.cardHeight / 2 + 82, 'NOTES:', {
      fontFamily: '"Courier New", monospace',
      fontSize: '9px',
      fontStyle: 'bold',
      color: '#556677',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0, 0);
    this.add(this.notesLabel);

    // --- Notes text ---
    this.notesText = scene.add.text(-this.cardWidth / 2 + 100, -this.cardHeight / 2 + 96, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      color: '#7799bb',
      stroke: '#000000',
      strokeThickness: 1,
      wordWrap: { width: 200 },
      lineSpacing: 2
    }).setOrigin(0, 0);
    this.add(this.notesText);

    // --- Status indicator dot (top right corner) ---
    this.statusDot = scene.add.graphics();
    this.statusDot.setPosition(this.cardWidth / 2 - 15, -this.cardHeight / 2 + 15);
    this.add(this.statusDot);
    this._drawStatusDot(0x33ff55); // Green = active

    // Add to scene
    scene.add.existing(this);
  }

  /**
   * Draw the card background panel with CRM-style dark styling.
   * @private
   */
  _drawPanel() {
    const g = this.panelGraphics;
    const w = this.cardWidth;
    const h = this.cardHeight;

    g.clear();

    // Outer shadow/glow
    g.fillStyle(0x112233, 0.3);
    g.fillRoundedRect(-w / 2 - 2, -h / 2 - 2, w + 4, h + 4, 8);

    // Main background
    g.fillStyle(0x0d0d22, 0.92);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 6);

    // Border - subtle neon
    g.lineStyle(1.5, 0x334466, 0.7);
    g.strokeRoundedRect(-w / 2, -h / 2, w, h, 6);

    // Left portrait area background (slightly lighter)
    g.fillStyle(0x111133, 0.5);
    g.fillRoundedRect(-w / 2 + 8, -h / 2 + 8, 76, h - 16, 4);

    // Portrait area border
    g.lineStyle(1, 0x223355, 0.5);
    g.strokeRoundedRect(-w / 2 + 8, -h / 2 + 8, 76, h - 16, 4);
  }

  /**
   * Draw a horizontal divider line under the header text.
   * @private
   */
  _drawDivider() {
    const g = this.dividerGraphics;
    const startX = -this.cardWidth / 2 + 100;
    const endX = this.cardWidth / 2 - 12;
    const lineY = -this.cardHeight / 2 + 26;

    g.clear();
    g.lineStyle(1, 0x334466, 0.4);
    g.beginPath();
    g.moveTo(startX, lineY);
    g.lineTo(endX, lineY);
    g.strokePath();
  }

  /**
   * Draw a default silhouette portrait (head and shoulders) using graphics.
   * This is used when no portrait key/texture is available.
   * @private
   */
  _drawDefaultPortrait() {
    const g = this.portraitGraphics;
    g.clear();

    // Head (circle)
    g.fillStyle(0x334455, 0.8);
    g.fillCircle(0, -16, 18);

    // Shoulders (ellipse approximated with an arc)
    g.fillStyle(0x334455, 0.6);
    g.fillRoundedRect(-28, 6, 56, 30, 14);

    // Subtle outline
    g.lineStyle(1, 0x4466aa, 0.3);
    g.strokeCircle(0, -16, 18);
  }

  /**
   * Draw a small colored status indicator dot.
   * @param {number} color - The hex color for the dot
   * @private
   */
  _drawStatusDot(color) {
    const g = this.statusDot;
    g.clear();

    // Glow
    g.fillStyle(color, 0.3);
    g.fillCircle(0, 0, 6);

    // Dot
    g.fillStyle(color, 0.9);
    g.fillCircle(0, 0, 3);
  }

  /**
   * Populate the card with victim data. All fields are optional and will
   * gracefully default to empty/placeholder values if missing.
   *
   * @param {object} victimData - Victim information
   * @param {string} [victimData.name] - Victim's display name
   * @param {number} [victimData.age] - Victim's age
   * @param {string} [victimData.location] - Victim's city/state
   * @param {string} [victimData.notes] - Brief notes about the victim
   * @param {string} [victimData.portraitKey] - Texture key for portrait (optional)
   */
  setVictim({ name = 'Unknown', age = '??', location = 'Unknown', notes = '', portraitKey = null } = {}) {
    // Update name
    this.nameText.setText(name);

    // Update details (age + location)
    this.detailsText.setText(`Age ${age} | ${location}`);

    // Update notes
    this.notesText.setText(notes || 'No additional notes.');

    // Update portrait
    if (portraitKey && this.scene.textures.exists(portraitKey)) {
      // If a real portrait texture is available, use it
      this._showPortraitTexture(portraitKey);
    } else {
      // Draw the default silhouette
      this._drawDefaultPortrait();
    }

    // Flash the card border briefly to indicate new data loaded
    this._flashBorder();
  }

  /**
   * Display a texture-based portrait image instead of the default silhouette.
   * @param {string} key - The Phaser texture key to display
   * @private
   */
  _showPortraitTexture(key) {
    // Remove previous portrait sprite if it exists
    if (this.portraitSprite) {
      this.portraitSprite.destroy();
    }

    this.portraitGraphics.clear();

    this.portraitSprite = this.scene.add.image(
      -this.cardWidth / 2 + 50, 0, key
    );
    this.portraitSprite.setDisplaySize(60, 70);
    this.add(this.portraitSprite);
  }

  /**
   * Brief flash animation on the card border when new victim data loads.
   * @private
   */
  _flashBorder() {
    const flashGraphics = this.scene.add.graphics();
    this.add(flashGraphics);

    const w = this.cardWidth;
    const h = this.cardHeight;

    flashGraphics.lineStyle(2, 0x44aaff, 0.8);
    flashGraphics.strokeRoundedRect(-w / 2, -h / 2, w, h, 6);

    this.scene.tweens.add({
      targets: flashGraphics,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        flashGraphics.destroy();
      }
    });
  }

  /**
   * Update the status dot color (e.g. green=active, red=disconnected).
   * @param {number} color - Hex color for the status dot
   */
  setStatus(color) {
    this._drawStatusDot(color);
  }

  /**
   * Clean up when destroyed.
   */
  destroy(fromScene) {
    if (this.portraitSprite) {
      this.portraitSprite.destroy();
    }
    super.destroy(fromScene);
  }
}
