/**
 * SettingsScene.js - Settings Menu
 *
 * Allows the player to enter their OpenAI API key, which is stored in
 * localStorage. Matches the neon cyberpunk aesthetic of the main menu.
 */

import Phaser from 'phaser';
import { getApiKey, setApiKey, clearApiKey, hasApiKey } from '../config/apiKeyManager.js';

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'settings' });
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor(0x0a0a1a);

    // ---- Scanline overlay ----
    this._createScanlines(width, height);

    // ---- Title ----
    this.add.text(width / 2, 80, 'SETTINGS', {
      fontFamily: '"Courier New", monospace',
      fontSize: '42px',
      fontStyle: 'bold',
      color: '#00ccff',
      stroke: '#002233',
      strokeThickness: 4,
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: '#00ccff',
        blur: 20,
        fill: true
      }
    }).setOrigin(0.5);

    // ---- Decorative line ----
    const lineGfx = this.add.graphics();
    lineGfx.lineStyle(1, 0x00ccff, 0.3);
    lineGfx.lineBetween(width / 2 - 200, 120, width / 2 + 200, 120);
    lineGfx.fillStyle(0x00ccff, 0.8);
    lineGfx.fillCircle(width / 2 - 200, 120, 2);
    lineGfx.fillCircle(width / 2 + 200, 120, 2);

    // ---- Section: API Key ----
    this.add.text(width / 2, 170, 'OPENAI API KEY', {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#00ff88'
    }).setOrigin(0.5);

    this.add.text(width / 2, 200, 'Required for voice AI. Your key stays in your browser.', {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#667788',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    // ---- Key display box ----
    const boxGfx = this.add.graphics();
    boxGfx.fillStyle(0x111122, 0.9);
    boxGfx.fillRoundedRect(width / 2 - 250, 230, 500, 44, 6);
    boxGfx.lineStyle(1, 0x334455, 0.6);
    boxGfx.strokeRoundedRect(width / 2 - 250, 230, 500, 44, 6);

    this.keyDisplayText = this.add.text(width / 2, 252, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '16px',
      color: '#aabbcc'
    }).setOrigin(0.5);

    // ---- Status text ----
    this.statusText = this.add.text(width / 2, 295, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this._updateKeyDisplay();

    // ---- Buttons ----
    this._createButton(
      width / 2, 360,
      'ENTER KEY', 0x00ccff, 0x002233,
      () => this._promptForApiKey()
    );

    this.clearBtn = this._createButton(
      width / 2, 430,
      'CLEAR KEY', 0xff2244, 0x220011,
      () => this._clearKey()
    );

    // ---- Privacy note ----
    this.add.text(width / 2, 500, [
      'Your key is stored in localStorage and used only for',
      'direct API calls from your browser. It is never sent to any server.'
    ], {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      color: '#445566',
      align: 'center'
    }).setOrigin(0.5);

    // ---- Get a key link hint ----
    this.add.text(width / 2, 545, 'Get a key at: https://platform.openai.com/api-keys', {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      color: '#00ccff'
    }).setOrigin(0.5);

    // ---- BACK button ----
    this._createButton(
      width / 2, 620,
      'BACK', 0xffcc00, 0x332200,
      () => this.scene.start('menu')
    );
  }

  _updateKeyDisplay() {
    const key = getApiKey();
    if (key) {
      const masked = key.substring(0, 7) + '...' + key.substring(key.length - 4);
      this.keyDisplayText.setText(masked);
      this.keyDisplayText.setColor('#00ff88');
      this.statusText.setText('KEY: SET');
      this.statusText.setColor('#00ff88');
      this.clearBtn?.setVisible(true);
    } else {
      this.keyDisplayText.setText('NOT SET');
      this.keyDisplayText.setColor('#ff4444');
      this.statusText.setText('No API key configured');
      this.statusText.setColor('#ff4444');
      this.clearBtn?.setVisible(false);
    }
  }

  _promptForApiKey() {
    const key = window.prompt(
      'Enter your OpenAI API key:\n\n' +
      'Your key is stored locally in your browser and never sent to any server.\n' +
      'Get a key at: https://platform.openai.com/api-keys'
    );
    if (key && key.trim().length > 10) {
      setApiKey(key.trim());
      this._updateKeyDisplay();
      this._showFlash('Key saved!', '#00ff88');
    } else if (key !== null) {
      this._showFlash('Invalid key format', '#ff4444');
    }
  }

  _clearKey() {
    clearApiKey();
    this._updateKeyDisplay();
    this._showFlash('Key cleared', '#ffcc00');
  }

  _showFlash(message, color) {
    const { width } = this.scale;
    const flash = this.add.text(width / 2, 325, message, {
      fontFamily: '"Courier New", monospace',
      fontSize: '13px',
      fontStyle: 'bold',
      color: color,
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 2000,
      delay: 1000,
      onComplete: () => flash.destroy()
    });
  }

  _createScanlines(width, height) {
    const scanGfx = this.add.graphics();
    scanGfx.setDepth(1000);
    for (let y = 0; y < height; y += 4) {
      scanGfx.fillStyle(0x000000, 0.06);
      scanGfx.fillRect(0, y, width, 1);
    }
  }

  _createButton(x, y, label, borderColor, bgColor, callback) {
    const btnWidth = 260;
    const btnHeight = 48;

    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(bgColor, 0.9);
    bg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 6);
    bg.lineStyle(2, borderColor, 0.8);
    bg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 6);
    container.add(bg);

    const glow = this.add.graphics();
    glow.fillStyle(borderColor, 0.15);
    glow.fillRoundedRect(-btnWidth / 2 - 4, -btnHeight / 2 - 4, btnWidth + 8, btnHeight + 8, 8);
    glow.setAlpha(0);
    container.add(glow);

    const text = this.add.text(0, 0, label, {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      fontStyle: 'bold',
      color: `#${borderColor.toString(16).padStart(6, '0')}`,
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
    container.add(text);

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
}
