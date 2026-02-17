/**
 * MenuScene.js - Main Menu
 *
 * Title screen with PLAY button → 4-slot save selector.
 * Each slot shows save summary or "NEW GAME".
 */

import Phaser from 'phaser';
import gameState from '../state/GameState.js';
import SaveManager from '../state/SaveManager.js';
import VoiceManager from '../voice/VoiceManager.js';
import { hasApiKey } from '../config/apiKeyManager.js';
import { FLOORS } from '../config/levels.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'menu' });
    this.micReady = false;
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor(0x0a0a1a);

    // ---- Audio ----
    const menuThemePlaying = this.sound.getAllPlaying().some(s => s.key === 'music_menu_theme');
    if (!menuThemePlaying) {
      this.sound.stopAll();
      this.sound.play('music_menu_theme', { loop: true, volume: 0.3 });
    }

    // ---- Background & visual polish ----
    this._createBackgroundEffects(width, height);
    this._createScanlines(width, height);

    // ---- Neon title glow ----
    this.titleGlow = this.add.graphics();
    this.titleGlow.fillStyle(0x00ff88, 0.06);
    this.titleGlow.fillRoundedRect(width / 2 - 340, 100, 680, 100, 12);

    // ---- Title text ----
    this.titleText = this.add.text(width / 2, 150, 'SCAMMER SIMULATOR', {
      fontFamily: '"Courier New", monospace',
      fontSize: '52px',
      fontStyle: 'bold',
      color: '#00ff88',
      stroke: '#003322',
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 0, color: '#00ff88', blur: 20, fill: true }
    }).setOrigin(0.5);

    this.tweens.add({
      targets: this.titleText,
      alpha: { from: 1, to: 0.7 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // ---- Subtitle ----
    this.add.text(width / 2, 212, 'A Dark Comedy Simulation', {
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

    // ---- Main menu buttons ----
    let btnY = 340;

    this._createButton(width / 2, btnY, 'PLAY', 0x00ff88, 0x003322,
      () => this._showSlotSelection());
    btnY += 60;

    // ---- TEST MIC button ----
    this._createButton(width / 2, btnY, 'TEST MIC', 0x00ccff, 0x002233,
      () => this._testMic());
    btnY += 45;

    // ---- Mic status indicator ----
    this.micDotY = btnY;
    this.micDot = this.add.graphics();
    this.micStatusText = this.add.text(width / 2 + 35, btnY, 'MIC: NOT TESTED', {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#ff4444'
    }).setOrigin(0, 0.5);
    this._drawMicDot(false);
    btnY += 55;

    // ---- SETTINGS button ----
    this._createButton(width / 2, btnY, 'SETTINGS', 0xffcc00, 0x332200,
      () => this.scene.start('settings'));
    btnY += 45;

    // ---- API key status ----
    this.keyStatusText = this.add.text(width / 2, btnY, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
    }).setOrigin(0.5);
    this._updateKeyStatus();

    // ---- Blinking cursor ----
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

    // ---- Slot selection overlay (hidden by default) ----
    this.slotOverlay = null;

    // ---- Auto-connect microphone ----
    this._testMic();
  }

  // =========================================================================
  //  SLOT SELECTION OVERLAY
  // =========================================================================

  _showSlotSelection() {
    if (this._requireApiKey()) return;
    if (this.slotOverlay) return;

    const { width, height } = this.scale;
    this.slotOverlay = this.add.container(0, 0).setDepth(500);

    // Dim background
    const dim = this.add.graphics();
    dim.fillStyle(0x000000, 0.7);
    dim.fillRect(0, 0, width, height);
    this.slotOverlay.add(dim);

    // Make dim clickable to close
    const dimZone = this.add.zone(0, 0, width, height).setOrigin(0).setInteractive();
    dimZone.on('pointerdown', () => this._hideSlotSelection());
    this.slotOverlay.add(dimZone);

    // Panel
    const panelW = 700;
    const panelH = 420;
    const px = (width - panelW) / 2;
    const py = (height - panelH) / 2;

    const panelGfx = this.add.graphics();
    panelGfx.fillStyle(0x0a0e14, 0.98);
    panelGfx.fillRoundedRect(px, py, panelW, panelH, 10);
    panelGfx.lineStyle(2, 0x00ff88, 0.6);
    panelGfx.strokeRoundedRect(px, py, panelW, panelH, 10);
    // Top accent
    panelGfx.fillStyle(0x00ff88, 0.08);
    panelGfx.fillRoundedRect(px, py, panelW, 40, { tl: 10, tr: 10, bl: 0, br: 0 });
    this.slotOverlay.add(panelGfx);

    // Stop clicks on panel from closing the overlay
    const panelBlocker = this.add.zone(px + panelW / 2, py + panelH / 2, panelW, panelH)
      .setOrigin(0.5).setInteractive();
    this.slotOverlay.add(panelBlocker);

    // Title
    this.slotOverlay.add(this.add.text(width / 2, py + 20, 'SELECT SAVE SLOT', {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#00ff88',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5));

    // 4 slot cards in a 2x2 grid
    const summaries = SaveManager.getAllSlotSummaries();
    const cardW = 300;
    const cardH = 140;
    const gap = 20;
    const gridX = px + (panelW - cardW * 2 - gap) / 2;
    const gridY = py + 60;

    summaries.forEach((info, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const cx = gridX + col * (cardW + gap);
      const cy = gridY + row * (cardH + gap);
      this._createSlotCard(cx, cy, cardW, cardH, info);
    });

    // Close hint
    this.slotOverlay.add(this.add.text(width / 2, py + panelH - 18, '[ click outside to go back ]', {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      color: '#445566'
    }).setOrigin(0.5));

    // Slide in
    this.slotOverlay.setAlpha(0);
    this.tweens.add({
      targets: this.slotOverlay,
      alpha: 1,
      duration: 200,
      ease: 'Quad.easeOut'
    });
  }

  _hideSlotSelection() {
    if (!this.slotOverlay) return;
    this.tweens.add({
      targets: this.slotOverlay,
      alpha: 0,
      duration: 150,
      onComplete: () => {
        if (this.slotOverlay) {
          this.slotOverlay.destroy();
          this.slotOverlay = null;
        }
      }
    });
  }

  _createSlotCard(x, y, w, h, info) {
    const isEmpty = info.empty;
    const borderColor = isEmpty ? 0x445566 : 0x00ff88;

    // Card background
    const cardGfx = this.add.graphics();
    cardGfx.fillStyle(isEmpty ? 0x0a0a1a : 0x0a1a14, 0.95);
    cardGfx.fillRoundedRect(x, y, w, h, 8);
    cardGfx.lineStyle(1.5, borderColor, 0.6);
    cardGfx.strokeRoundedRect(x, y, w, h, 8);
    this.slotOverlay.add(cardGfx);

    // Slot number
    this.slotOverlay.add(this.add.text(x + 12, y + 10, `SLOT ${info.slot}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      fontStyle: 'bold',
      color: isEmpty ? '#556677' : '#00ff88'
    }));

    if (isEmpty) {
      // Empty slot - "NEW GAME"
      this.slotOverlay.add(this.add.text(x + w / 2, y + h / 2 + 5, 'NEW GAME', {
        fontFamily: '"Courier New", monospace',
        fontSize: '20px',
        fontStyle: 'bold',
        color: '#556677'
      }).setOrigin(0.5));
    } else {
      // Filled slot - show save data
      const floorCfg = FLOORS[info.floor];
      const floorName = floorCfg ? floorCfg.name : 'Unknown';

      this.slotOverlay.add(this.add.text(x + 12, y + 30, `Floor ${info.floor}: ${floorName}`, {
        fontFamily: '"Courier New", monospace',
        fontSize: '13px',
        fontStyle: 'bold',
        color: '#ffffff'
      }));

      this.slotOverlay.add(this.add.text(x + 12, y + 52, `Wallet: $${info.wallet}`, {
        fontFamily: '"Courier New", monospace',
        fontSize: '11px',
        color: '#33ff55'
      }));

      this.slotOverlay.add(this.add.text(x + 12, y + 70, `Victims: ${info.completedCount} completed`, {
        fontFamily: '"Courier New", monospace',
        fontSize: '11px',
        color: '#aabbcc'
      }));

      this.slotOverlay.add(this.add.text(x + 12, y + 88, `Remittance: $${info.totalRemittance || 0}`, {
        fontFamily: '"Courier New", monospace',
        fontSize: '11px',
        color: '#ffcc00'
      }));

      // Delete save button (small, bottom-right)
      const delText = this.add.text(x + w - 12, y + h - 12, '[DELETE]', {
        fontFamily: '"Courier New", monospace',
        fontSize: '9px',
        color: '#663333'
      }).setOrigin(1, 1).setInteractive({ useHandCursor: true });

      delText.on('pointerover', () => delText.setColor('#ff4444'));
      delText.on('pointerout', () => delText.setColor('#663333'));
      delText.on('pointerdown', (pointer) => {
        pointer.event.stopPropagation();
        this._confirmDeleteSlot(info.slot);
      });
      this.slotOverlay.add(delText);
    }

    // Hover glow
    const hoverGfx = this.add.graphics();
    hoverGfx.fillStyle(borderColor, 0.1);
    hoverGfx.fillRoundedRect(x - 2, y - 2, w + 4, h + 4, 10);
    hoverGfx.setAlpha(0);
    this.slotOverlay.add(hoverGfx);

    // Click zone
    const zone = this.add.zone(x + w / 2, y + h / 2, w, h).setOrigin(0.5).setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => hoverGfx.setAlpha(1));
    zone.on('pointerout', () => hoverGfx.setAlpha(0));
    zone.on('pointerdown', (pointer) => {
      pointer.event.stopPropagation();
      this.sound.play('sfx_button_click', { volume: 0.5 });
      this._selectSlot(info.slot, isEmpty);
    });
    this.slotOverlay.add(zone);
  }

  _selectSlot(slot, isEmpty) {
    SaveManager.setActiveSlot(slot);

    if (isEmpty) {
      // New game in this slot
      SaveManager.reset();
      gameState.reset();
      this.registry.set('currentLevel', 1);
      this._hideSlotSelection();
      this.time.delayedCall(200, () => this.scene.start('intro'));
    } else {
      // Continue from save
      const save = SaveManager.load();
      gameState.loadFromSave(save);
      this.registry.set('currentLevel', gameState.currentFloor);
      this._hideSlotSelection();
      this.time.delayedCall(200, () => this.scene.start('briefing', { level: gameState.currentFloor }));
    }
  }

  _confirmDeleteSlot(slot) {
    // Simple confirmation: two-click delete
    // First click marks, second click deletes (using a short timer)
    if (this._pendingDelete === slot) {
      SaveManager.reset(slot);
      this._pendingDelete = null;
      // Refresh the slot selection UI
      this._hideSlotSelection();
      this.time.delayedCall(200, () => this._showSlotSelection());
      return;
    }

    this._pendingDelete = slot;

    // Flash a confirmation message
    const { width, height } = this.scale;
    const confirmText = this.add.text(width / 2, height / 2 + 190, `Click [DELETE] again to erase Slot ${slot}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#ff4444',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(600);

    this.time.delayedCall(3000, () => {
      this._pendingDelete = null;
      if (confirmText && confirmText.active) confirmText.destroy();
    });
  }

  // =========================================================================
  //  BACKGROUND & HELPERS
  // =========================================================================

  _createBackgroundEffects(width, height) {
    this.floatingElements = [];
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

    const gridGfx = this.add.graphics();
    gridGfx.lineStyle(1, 0x112233, 0.15);
    for (let x = 0; x < width; x += 80) gridGfx.lineBetween(x, 0, x, height);
    for (let y = 0; y < height; y += 80) gridGfx.lineBetween(0, y, width, y);
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

    hitArea.on('pointerover', () => { glow.setAlpha(1); text.setScale(1.05); });
    hitArea.on('pointerout', () => { glow.setAlpha(0); text.setScale(1); });
    hitArea.on('pointerdown', () => text.setScale(0.95));
    hitArea.on('pointerup', () => {
      text.setScale(1.05);
      this.sound.play('sfx_button_click', { volume: 0.5 });
      callback();
    });

    return container;
  }

  _drawMicDot(ready) {
    const { width } = this.scale;
    const dotX = width / 2 + 20;
    const dotY = this.micDotY || 475;
    this.micDot.clear();
    if (ready) {
      this.micDot.fillStyle(0x00ff88, 0.3);
      this.micDot.fillCircle(dotX, dotY, 8);
      this.micDot.fillStyle(0x00ff88, 0.9);
      this.micDot.fillCircle(dotX, dotY, 4);
      this.micStatusText.setText('MIC: READY');
      this.micStatusText.setColor('#00ff88');
    } else {
      this.micDot.fillStyle(0xff2244, 0.3);
      this.micDot.fillCircle(dotX, dotY, 8);
      this.micDot.fillStyle(0xff2244, 0.9);
      this.micDot.fillCircle(dotX, dotY, 4);
    }
  }

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

  _updateKeyStatus() {
    if (hasApiKey()) {
      this.keyStatusText.setText('API KEY: CONFIGURED');
      this.keyStatusText.setColor('#00ff88');
    } else {
      this.keyStatusText.setText('API KEY: NOT SET (go to Settings)');
      this.keyStatusText.setColor('#ff4444');
    }
  }

  _requireApiKey() {
    if (hasApiKey()) return false;
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
    return true;
  }
}
