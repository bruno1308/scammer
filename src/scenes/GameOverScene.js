/**
 * GameOverScene.js - Game Over Screen
 *
 * Two variants:
 *  - "FIRED": Boss fires you for missing quota too many times.
 *  - "ARRESTED": Police catch up with you (high heat).
 *
 * Dark, dramatic styling with appropriate visual effects.
 */

import Phaser from 'phaser';
import gameState from '../state/GameState.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'gameover' });
  }

  init(data) {
    this.reason = data?.reason || 'fired'; // 'fired' or 'arrested'
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(0x050508);

    if (this.reason === 'arrested') {
      this._createArrestedScene(width, height);
    } else {
      this._createFiredScene(width, height);
    }

    // ---- PLAY AGAIN button ----
    this._createPlayAgainButton(width, height);

    // ---- Scanlines ----
    const scanGfx = this.add.graphics();
    scanGfx.setDepth(1000);
    for (let y = 0; y < height; y += 3) {
      scanGfx.fillStyle(0x000000, 0.06);
      scanGfx.fillRect(0, y, width, 1);
    }
  }

  // =========================================================================
  //  FIRED VARIANT
  // =========================================================================

  _createFiredScene(width, height) {
    // Dark, oppressive background
    const bg = this.add.graphics();
    bg.fillStyle(0x0a0508);
    bg.fillRect(0, 0, width, height);

    // Dim red vignette
    bg.fillStyle(0x330000, 0.15);
    bg.fillRect(0, 0, width, height);

    // ---- Boss figure (larger, pointing at door) ----
    this._drawAngryBoss(width / 2 - 100, height / 2 - 20);

    // ---- Door on the right ----
    this._drawDoor(width / 2 + 180, height / 2 - 60);

    // ---- "EXIT" sign above door ----
    const exitSign = this.add.graphics();
    exitSign.fillStyle(0xff2244, 0.9);
    exitSign.fillRoundedRect(width / 2 + 155, height / 2 - 120, 80, 28, 4);
    this.add.text(width / 2 + 195, height / 2 - 106, 'EXIT', {
      fontFamily: '"Courier New", monospace',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Pulsing exit sign
    this.tweens.add({
      targets: exitSign,
      alpha: { from: 1, to: 0.4 },
      duration: 1200,
      yoyo: true,
      repeat: -1
    });

    // ---- FIRED text ----
    const firedText = this.add.text(width / 2, 80, 'FIRED', {
      fontFamily: '"Courier New", monospace',
      fontSize: '64px',
      fontStyle: 'bold',
      color: '#ff2244',
      stroke: '#330000',
      strokeThickness: 6,
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: '#ff2244',
        blur: 30,
        fill: true
      }
    }).setOrigin(0.5).setAlpha(0);

    // Dramatic entrance
    this.tweens.add({
      targets: firedText,
      alpha: 1,
      scaleX: { from: 2, to: 1 },
      scaleY: { from: 2, to: 1 },
      duration: 800,
      ease: 'Cubic.easeOut'
    });

    // ---- Boss dialogue ----
    const dialogues = [
      '"You failed to meet quota."',
      '"Pack your things. You\'re done here."',
      '"And don\'t even think about using me as a reference."',
    ];

    dialogues.forEach((line, i) => {
      const dialogText = this.add.text(width / 2, height - 180 + i * 28, line, {
        fontFamily: '"Courier New", monospace',
        fontSize: '14px',
        fontStyle: 'italic',
        color: '#ff8888',
        stroke: '#000000',
        strokeThickness: 1
      }).setOrigin(0.5).setAlpha(0);

      this.time.delayedCall(1500 + i * 1200, () => {
        this.tweens.add({
          targets: dialogText,
          alpha: 1,
          duration: 400
        });
      });
    });

    // Subtle red pulse on the whole screen
    const redFlash = this.add.graphics();
    redFlash.fillStyle(0xff0000, 0.05);
    redFlash.fillRect(0, 0, width, height);
    redFlash.setDepth(500);

    this.tweens.add({
      targets: redFlash,
      alpha: { from: 0.05, to: 0 },
      duration: 2000,
      yoyo: true,
      repeat: -1
    });
  }

  _drawAngryBoss(x, y) {
    const g = this.add.graphics();

    // Shadow
    g.fillStyle(0x000000, 0.4);
    g.fillEllipse(x, y + 130, 120, 25);

    // Body (suit - darker, more menacing)
    g.fillStyle(0x1a1a33);
    g.fillRoundedRect(x - 40, y - 10, 80, 110, 10);

    // Suit details
    g.lineStyle(2, 0x222244);
    g.lineBetween(x - 12, y - 10, x, y + 35);
    g.lineBetween(x + 12, y - 10, x, y + 35);

    // Tie (red, angry)
    g.fillStyle(0xcc0000);
    g.fillTriangle(x - 8, y - 5, x + 8, y - 5, x, y + 45);

    // Neck
    g.fillStyle(0xcc9977);
    g.fillRect(x - 10, y - 35, 20, 28);

    // Head
    g.fillStyle(0xcc9977);
    g.fillCircle(x, y - 55, 32);

    // Hair
    g.fillStyle(0x1a1a1a);
    g.fillEllipse(x, y - 75, 36, 18);
    g.fillRect(x - 32, y - 75, 64, 14);

    // Eyes (angry, narrowed)
    g.fillStyle(0x111111);
    g.fillEllipse(x - 12, y - 58, 5, 3);
    g.fillEllipse(x + 12, y - 58, 5, 3);

    // Angry eyebrows (steep angle)
    g.lineStyle(3, 0x1a1a1a);
    g.lineBetween(x - 20, y - 72, x - 6, y - 64);
    g.lineBetween(x + 20, y - 72, x + 6, y - 64);

    // Angry mouth (frown)
    g.lineStyle(2, 0x993333);
    g.beginPath();
    g.arc(x, y - 36, 10, Math.PI + 0.3, -0.3, false);
    g.strokePath();

    // Pointing arm (right arm extended)
    g.lineStyle(8, 0x1a1a33);
    g.lineBetween(x + 40, y + 10, x + 120, y - 20);

    // Pointing hand
    g.fillStyle(0xcc9977);
    g.fillCircle(x + 122, y - 22, 8);
    // Pointing finger
    g.lineStyle(4, 0xcc9977);
    g.lineBetween(x + 128, y - 22, x + 150, y - 30);

    // Left arm (on hip)
    g.lineStyle(8, 0x1a1a33);
    g.lineBetween(x - 40, y + 10, x - 55, y + 50);
    g.fillStyle(0xcc9977);
    g.fillCircle(x - 55, y + 52, 8);

    // Legs
    g.fillStyle(0x151528);
    g.fillRect(x - 28, y + 95, 22, 35);
    g.fillRect(x + 6, y + 95, 22, 35);

    // Shoes
    g.fillStyle(0x0a0a0a);
    g.fillRoundedRect(x - 32, y + 125, 30, 12, 4);
    g.fillRoundedRect(x + 2, y + 125, 30, 12, 4);
  }

  _drawDoor(x, y) {
    const g = this.add.graphics();

    // Door frame
    g.fillStyle(0x333344);
    g.fillRect(x - 5, y - 5, 90, 180);

    // Door
    g.fillStyle(0x444455);
    g.fillRect(x, y, 80, 170);

    // Door panels
    g.lineStyle(1, 0x555566, 0.5);
    g.strokeRect(x + 8, y + 10, 64, 60);
    g.strokeRect(x + 8, y + 80, 64, 70);

    // Door handle
    g.fillStyle(0xccaa44);
    g.fillCircle(x + 65, y + 85, 5);

    // Light coming through the door
    g.fillStyle(0xffffff, 0.03);
    g.fillTriangle(x + 40, y, x - 40, y + 170, x + 120, y + 170);
  }

  // =========================================================================
  //  ARRESTED VARIANT
  // =========================================================================

  _createArrestedScene(width, height) {
    // Dark background
    const bg = this.add.graphics();
    bg.fillStyle(0x050510);
    bg.fillRect(0, 0, width, height);

    // ---- Red/Blue police flashers ----
    this.redFlash = this.add.graphics();
    this.redFlash.fillStyle(0xff0000, 0.12);
    this.redFlash.fillRect(0, 0, width / 2, height);
    this.redFlash.setDepth(500);
    this.redFlash.setAlpha(0);

    this.blueFlash = this.add.graphics();
    this.blueFlash.fillStyle(0x0000ff, 0.12);
    this.blueFlash.fillRect(width / 2, 0, width / 2, height);
    this.blueFlash.setDepth(500);
    this.blueFlash.setAlpha(0);

    // Alternating flash animation
    this.tweens.add({
      targets: this.redFlash,
      alpha: { from: 0, to: 0.3 },
      duration: 400,
      yoyo: true,
      repeat: -1,
      delay: 0
    });

    this.tweens.add({
      targets: this.blueFlash,
      alpha: { from: 0, to: 0.3 },
      duration: 400,
      yoyo: true,
      repeat: -1,
      delay: 400
    });

    // ---- ARRESTED text ----
    const arrestedText = this.add.text(width / 2, 70, 'ARRESTED', {
      fontFamily: '"Courier New", monospace',
      fontSize: '58px',
      fontStyle: 'bold',
      color: '#4488ff',
      stroke: '#000033',
      strokeThickness: 6,
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: '#4488ff',
        blur: 30,
        fill: true
      }
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: arrestedText,
      alpha: 1,
      scaleX: { from: 3, to: 1 },
      scaleY: { from: 3, to: 1 },
      duration: 600,
      ease: 'Cubic.easeOut'
    });

    // ---- Handcuffs ----
    this._drawHandcuffs(width / 2, height / 2 - 30);

    // ---- Badge / warrant ----
    this._drawBadge(width / 2 - 200, height / 2);
    this._drawWarrant(width / 2 + 150, height / 2 - 40);

    // ---- Arrest text ----
    const messages = [
      '"The authorities caught up with you."',
      '"Your operations have been traced and recorded."',
      '"You have the right to remain silent..."',
    ];

    messages.forEach((msg, i) => {
      const msgText = this.add.text(width / 2, height - 170 + i * 28, msg, {
        fontFamily: '"Courier New", monospace',
        fontSize: '14px',
        fontStyle: 'italic',
        color: '#8888ff',
        stroke: '#000000',
        strokeThickness: 1
      }).setOrigin(0.5).setAlpha(0);

      this.time.delayedCall(1200 + i * 1000, () => {
        this.tweens.add({
          targets: msgText,
          alpha: 1,
          duration: 400
        });
      });
    });

    // ---- Static/interference effect ----
    this._createStaticEffect(width, height);
  }

  _drawHandcuffs(x, y) {
    const g = this.add.graphics();

    // Left cuff ring
    g.lineStyle(6, 0x888899);
    g.strokeCircle(x - 35, y, 22);

    // Right cuff ring
    g.strokeCircle(x + 35, y, 22);

    // Chain links connecting cuffs
    g.lineStyle(4, 0x888899);
    g.lineBetween(x - 13, y, x + 13, y);

    // Chain detail
    g.lineStyle(3, 0xaaaabb);
    g.lineBetween(x - 10, y - 2, x - 5, y + 2);
    g.lineBetween(x - 5, y + 2, x, y - 2);
    g.lineBetween(x, y - 2, x + 5, y + 2);
    g.lineBetween(x + 5, y + 2, x + 10, y - 2);

    // Keyholes
    g.fillStyle(0x222233);
    g.fillRect(x - 38, y + 15, 6, 8);
    g.fillRect(x + 32, y + 15, 6, 8);

    // Lock mechanisms
    g.fillStyle(0x666677);
    g.fillRoundedRect(x - 44, y + 12, 18, 14, 2);
    g.fillRoundedRect(x + 26, y + 12, 18, 14, 2);

    // Metallic highlight
    g.lineStyle(1, 0xccccdd, 0.5);
    g.beginPath();
    g.arc(x - 35, y, 20, -0.5, 1.2, false);
    g.strokePath();
    g.beginPath();
    g.arc(x + 35, y, 20, -0.5, 1.2, false);
    g.strokePath();

    // Subtle shadow
    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(x, y + 50, 100, 12);
  }

  _drawBadge(x, y) {
    const g = this.add.graphics();

    // Shield shape
    g.fillStyle(0xccaa33);
    g.beginPath();
    g.moveTo(x, y - 40);
    g.lineTo(x + 35, y - 25);
    g.lineTo(x + 35, y + 15);
    g.lineTo(x, y + 35);
    g.lineTo(x - 35, y + 15);
    g.lineTo(x - 35, y - 25);
    g.closePath();
    g.fillPath();

    // Inner shield
    g.fillStyle(0x1a1a33);
    g.beginPath();
    g.moveTo(x, y - 30);
    g.lineTo(x + 25, y - 18);
    g.lineTo(x + 25, y + 10);
    g.lineTo(x, y + 25);
    g.lineTo(x - 25, y + 10);
    g.lineTo(x - 25, y - 18);
    g.closePath();
    g.fillPath();

    // Star in center
    g.fillStyle(0xccaa33);
    const starPoints = 5;
    const outerR = 12;
    const innerR = 5;
    g.beginPath();
    for (let i = 0; i < starPoints * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / starPoints - Math.PI / 2;
      const sx = x + Math.cos(angle) * r;
      const sy = y - 5 + Math.sin(angle) * r;
      if (i === 0) g.moveTo(sx, sy);
      else g.lineTo(sx, sy);
    }
    g.closePath();
    g.fillPath();

    // Badge text
    this.add.text(x, y + 42, 'POLICE', {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#ccaa33'
    }).setOrigin(0.5);
  }

  _drawWarrant(x, y) {
    const g = this.add.graphics();

    // Paper
    g.fillStyle(0xeeddcc);
    g.fillRect(x - 60, y, 120, 150);

    // Paper shadow
    g.fillStyle(0x000000, 0.2);
    g.fillRect(x - 57, y + 3, 120, 150);

    // Header
    this.add.text(x, y + 15, 'ARREST WARRANT', {
      fontFamily: '"Courier New", monospace',
      fontSize: '9px',
      fontStyle: 'bold',
      color: '#222222'
    }).setOrigin(0.5);

    // Fake text lines
    g.lineStyle(1, 0xaaaaaa, 0.5);
    for (let i = 0; i < 8; i++) {
      const lineW = Phaser.Math.Between(60, 100);
      g.lineBetween(x - 45, y + 35 + i * 12, x - 45 + lineW, y + 35 + i * 12);
    }

    // Seal
    g.fillStyle(0xcc0000, 0.6);
    g.fillCircle(x + 20, y + 125, 15);
    g.lineStyle(1, 0x880000, 0.8);
    g.strokeCircle(x + 20, y + 125, 15);
    g.strokeCircle(x + 20, y + 125, 10);

    // "FRAUD" stamp
    this.add.text(x - 10, y + 80, 'FRAUD', {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#cc0000',
      alpha: 0.5
    }).setOrigin(0.5).setAngle(-20);
  }

  _createStaticEffect(width, height) {
    const staticGfx = this.add.graphics();
    staticGfx.setDepth(800);

    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        staticGfx.clear();
        // Random static lines
        for (let i = 0; i < 3; i++) {
          const sy = Phaser.Math.Between(0, height);
          staticGfx.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.01, 0.04));
          staticGfx.fillRect(0, sy, width, Phaser.Math.Between(1, 3));
        }
      }
    });
  }

  // =========================================================================
  //  PLAY AGAIN BUTTON
  // =========================================================================

  _createPlayAgainButton(width, height) {
    const btnX = width / 2;
    const btnY = height - 60;
    const btnW = 240;
    const btnH = 44;

    const container = this.add.container(btnX, btnY);
    container.setDepth(900);
    container.setAlpha(0);

    // Button background
    const bg = this.add.graphics();
    bg.fillStyle(0x111122, 0.9);
    bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 6);
    bg.lineStyle(2, 0x00ccff, 0.7);
    bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 6);
    container.add(bg);

    // Hover glow
    const glow = this.add.graphics();
    glow.fillStyle(0x00ccff, 0.12);
    glow.fillRoundedRect(-btnW / 2 - 4, -btnH / 2 - 4, btnW + 8, btnH + 8, 8);
    glow.setAlpha(0);
    container.add(glow);

    // Text
    const text = this.add.text(0, 0, 'PLAY AGAIN', {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#00ccff'
    }).setOrigin(0.5);
    container.add(text);

    // Hit area
    const zone = this.add.zone(0, 0, btnW, btnH).setOrigin(0.5).setInteractive({ useHandCursor: true });
    container.add(zone);

    zone.on('pointerover', () => { glow.setAlpha(1); text.setScale(1.05); });
    zone.on('pointerout', () => { glow.setAlpha(0); text.setScale(1); });
    zone.on('pointerdown', () => text.setScale(0.95));
    zone.on('pointerup', () => {
      text.setScale(1);
      this.registry.set('shiftFailures', 0);
      gameState.reset();
      this.scene.start('menu');
    });

    // Show button after delay
    this.time.delayedCall(3500, () => {
      this.tweens.add({
        targets: container,
        alpha: 1,
        duration: 600,
        ease: 'Cubic.easeOut'
      });
    });
  }
}
