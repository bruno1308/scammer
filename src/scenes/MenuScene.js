/**
 * MenuScene.js - Main Menu
 *
 * Displays the game title in neon styling, START GAME and TEST MIC buttons,
 * mic status indicator, and subtle animated background elements
 * (floating dollar signs, blinking cursors).
 */

import Phaser from 'phaser';
import gameState from '../state/GameState.js';
import VoiceManager from '../voice/VoiceManager.js';
import { hasApiKey } from '../config/apiKeyManager.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'menu' });
    this.micReady = false;
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor(0x0a0a1a);

    // ---- Animated background elements ----
    this._createBackgroundEffects(width, height);

    // ---- Scanline overlay ----
    this._createScanlines(width, height);

    // ---- Neon title glow (behind text) ----
    this.titleGlow = this.add.graphics();
    this.titleGlow.fillStyle(0x00ff88, 0.06);
    this.titleGlow.fillRoundedRect(width / 2 - 340, 100, 680, 100, 12);

    // ---- Title text ----
    this.titleText = this.add.text(width / 2, 135, 'SCAMMER SIMULATOR', {
      fontFamily: '"Courier New", monospace',
      fontSize: '52px',
      fontStyle: 'bold',
      color: '#00ff88',
      stroke: '#003322',
      strokeThickness: 4,
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: '#00ff88',
        blur: 20,
        fill: true
      }
    }).setOrigin(0.5);

    // Title pulse animation
    this.tweens.add({
      targets: this.titleText,
      alpha: { from: 1, to: 0.7 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // ---- Subtitle ----
    this.add.text(width / 2, 195, 'A Dark Comedy Simulation', {
      fontFamily: '"Courier New", monospace',
      fontSize: '16px',
      color: '#667788',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    // ---- Decorative line ----
    const lineGfx = this.add.graphics();
    lineGfx.lineStyle(1, 0x00ff88, 0.3);
    lineGfx.lineBetween(width / 2 - 200, 225, width / 2 + 200, 225);
    lineGfx.fillStyle(0x00ff88, 0.8);
    lineGfx.fillCircle(width / 2 - 200, 225, 2);
    lineGfx.fillCircle(width / 2 + 200, 225, 2);

    // ---- Version / tagline ----
    this.add.text(width / 2, 250, '[ v0.1 // USE HEADPHONES FOR BEST EXPERIENCE ]', {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      color: '#445566'
    }).setOrigin(0.5);

    // ---- START GAME button ----
    this._createButton(
      width / 2, 360,
      'START GAME', 0x00ff88, 0x003322,
      () => this._startGame()
    );

    // ---- TEST MIC button ----
    this._createButton(
      width / 2, 430,
      'TEST MIC', 0x00ccff, 0x002233,
      () => this._testMic()
    );

    // ---- Mic status indicator ----
    this.micDot = this.add.graphics();
    this.micStatusText = this.add.text(width / 2 + 35, 475, 'MIC: NOT TESTED', {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#ff4444'
    }).setOrigin(0, 0.5);
    this._drawMicDot(false);

    // ---- SETTINGS button ----
    this._createButton(
      width / 2, 530,
      'SETTINGS', 0xffcc00, 0x332200,
      () => this.scene.start('settings')
    );

    // ---- API key status indicator ----
    this.keyStatusText = this.add.text(width / 2, 575, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
    }).setOrigin(0.5);
    this._updateKeyStatus();

    // ---- Blinking cursor at bottom ----
    this.cursor = this.add.text(width / 2, height - 80, '> READY TO CONNECT_', {
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      color: '#00ff88'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: this.cursor,
      alpha: { from: 1, to: 0 },
      duration: 530,
      yoyo: true,
      repeat: -1
    });

    // ---- Footer ----
    this.add.text(width / 2, height - 30, 'This is a fictional game. Scamming people is a crime.', {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      color: '#334455'
    }).setOrigin(0.5);
  }

  /**
   * Create animated floating dollar signs and data fragments in the background.
   */
  _createBackgroundEffects(width, height) {
    this.floatingElements = [];

    // Floating dollar signs
    const symbols = ['$', '$$', '$$$', '0x', '//', '>>>', '...', '***'];
    for (let i = 0; i < 18; i++) {
      const sym = symbols[Phaser.Math.Between(0, symbols.length - 1)];
      const txt = this.add.text(
        Phaser.Math.Between(30, width - 30),
        Phaser.Math.Between(30, height - 30),
        sym,
        {
          fontFamily: '"Courier New", monospace',
          fontSize: `${Phaser.Math.Between(10, 22)}px`,
          color: '#00ff88',
          alpha: Phaser.Math.FloatBetween(0.03, 0.1)
        }
      ).setOrigin(0.5);

      txt.setAlpha(Phaser.Math.FloatBetween(0.03, 0.1));

      this.tweens.add({
        targets: txt,
        y: txt.y - Phaser.Math.Between(40, 120),
        alpha: 0,
        duration: Phaser.Math.Between(4000, 10000),
        repeat: -1,
        onRepeat: () => {
          txt.x = Phaser.Math.Between(30, width - 30);
          txt.y = Phaser.Math.Between(height / 2, height - 30);
          txt.setAlpha(Phaser.Math.FloatBetween(0.03, 0.1));
        }
      });

      this.floatingElements.push(txt);
    }

    // Grid lines (subtle background grid)
    const gridGfx = this.add.graphics();
    gridGfx.lineStyle(1, 0x112233, 0.15);
    for (let x = 0; x < width; x += 80) {
      gridGfx.lineBetween(x, 0, x, height);
    }
    for (let y = 0; y < height; y += 80) {
      gridGfx.lineBetween(0, y, width, y);
    }
  }

  /**
   * Draw CRT-style scanlines overlay.
   */
  _createScanlines(width, height) {
    const scanGfx = this.add.graphics();
    scanGfx.setDepth(1000);
    for (let y = 0; y < height; y += 4) {
      scanGfx.fillStyle(0x000000, 0.06);
      scanGfx.fillRect(0, y, width, 1);
    }
  }

  /**
   * Create an interactive neon-styled button.
   */
  _createButton(x, y, label, borderColor, bgColor, callback) {
    const btnWidth = 260;
    const btnHeight = 48;

    const container = this.add.container(x, y);

    // Button background
    const bg = this.add.graphics();
    bg.fillStyle(bgColor, 0.9);
    bg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 6);
    bg.lineStyle(2, borderColor, 0.8);
    bg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 6);
    container.add(bg);

    // Hover glow (invisible by default)
    const glow = this.add.graphics();
    glow.fillStyle(borderColor, 0.15);
    glow.fillRoundedRect(-btnWidth / 2 - 4, -btnHeight / 2 - 4, btnWidth + 8, btnHeight + 8, 8);
    glow.setAlpha(0);
    container.add(glow);

    // Label
    const text = this.add.text(0, 0, label, {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      fontStyle: 'bold',
      color: `#${borderColor.toString(16).padStart(6, '0')}`,
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
    container.add(text);

    // Hit area
    const hitArea = this.add.zone(0, 0, btnWidth, btnHeight).setOrigin(0.5);
    hitArea.setInteractive({ useHandCursor: true });
    container.add(hitArea);

    hitArea.on('pointerover', () => {
      glow.setAlpha(1);
      text.setScale(1.05);
    });

    hitArea.on('pointerout', () => {
      glow.setAlpha(0);
      text.setScale(1);
    });

    hitArea.on('pointerdown', () => {
      text.setScale(0.95);
    });

    hitArea.on('pointerup', () => {
      text.setScale(1.05);
      callback();
    });

    return container;
  }

  /**
   * Draw the mic status dot indicator.
   */
  _drawMicDot(ready) {
    const { width } = this.scale;
    const dotX = width / 2 + 20;
    const dotY = 475;

    this.micDot.clear();

    if (ready) {
      // Green dot with glow
      this.micDot.fillStyle(0x00ff88, 0.3);
      this.micDot.fillCircle(dotX, dotY, 8);
      this.micDot.fillStyle(0x00ff88, 0.9);
      this.micDot.fillCircle(dotX, dotY, 4);
      this.micStatusText.setText('MIC: READY');
      this.micStatusText.setColor('#00ff88');
    } else {
      // Red dot
      this.micDot.fillStyle(0xff2244, 0.3);
      this.micDot.fillCircle(dotX, dotY, 8);
      this.micDot.fillStyle(0xff2244, 0.9);
      this.micDot.fillCircle(dotX, dotY, 4);
    }
  }

  /**
   * Attempt to get microphone permission through VoiceManager.
   */
  async _testMic() {
    try {
      const granted = await VoiceManager.getInstance().requestMicPermission();
      this.micReady = !!granted;
    } catch (err) {
      console.warn('[MenuScene] Mic permission denied or unavailable:', err);
      this.micReady = false;
    }

    this._drawMicDot(this.micReady);
  }

  /**
   * Update the API key status indicator.
   */
  _updateKeyStatus() {
    if (hasApiKey()) {
      this.keyStatusText.setText('API KEY: CONFIGURED');
      this.keyStatusText.setColor('#00ff88');
    } else {
      this.keyStatusText.setText('API KEY: NOT SET (go to Settings)');
      this.keyStatusText.setColor('#ff4444');
    }
  }

  /**
   * Start the game - reset state and go to briefing.
   */
  _startGame() {
    if (!hasApiKey()) {
      const { width } = this.scale;
      const warning = this.add.text(width / 2, 310, 'Set your OpenAI API key in Settings first!', {
        fontFamily: '"Courier New", monospace',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#ff4444',
        stroke: '#000000',
        strokeThickness: 2,
      }).setOrigin(0.5);

      this.tweens.add({
        targets: warning,
        alpha: 0,
        duration: 3000,
        delay: 2000,
        onComplete: () => warning.destroy(),
      });
      return;
    }

    gameState.reset();
    this.registry.set('currentLevel', 1);
    this.scene.start('briefing', { level: 1 });
  }
}
