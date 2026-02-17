/**
 * GameOverScene.js - Game Over / Ending Screen
 *
 * Five ending variants:
 *  - "sold":           Boss sold your contract (3 shortfalls)
 *  - "arrested":       Police caught up (heat >= 80)
 *  - "rescued":        Pierogi + remittance = best ending
 *  - "rescued_alone":  Pierogi saved you, but family got nothing
 *  - "still_trapped":  Finished all floors but never escaped
 */

import Phaser from 'phaser';
import gameState from '../state/GameState.js';
import SaveManager from '../state/SaveManager.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'gameover' });
  }

  init(data) {
    this.reason = data?.reason || 'sold';
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(0x050508);

    // ---- Audio ----
    this.sound.stopAll();

    switch (this.reason) {
      case 'rescued':
        this.sound.play('music_results_success', { loop: true, volume: 0.3 });
        this._createRescuedScene(width, height);
        break;
      case 'rescued_alone':
        this.sound.play('music_results_success', { loop: true, volume: 0.15 });
        this._createRescuedAloneScene(width, height);
        break;
      case 'arrested':
        this.sound.play('music_game_over_theme', { loop: true, volume: 0.3 });
        this.sound.play('sfx_game_over', { volume: 0.6 });
        this._createArrestedScene(width, height);
        break;
      case 'still_trapped':
        this.sound.play('music_game_over_theme', { loop: true, volume: 0.15 });
        this._createStillTrappedScene(width, height);
        break;
      case 'sold':
      default:
        this.sound.play('music_game_over_theme', { loop: true, volume: 0.3 });
        this.sound.play('sfx_game_over', { volume: 0.6 });
        this._createSoldScene(width, height);
        break;
    }

    // ---- Button ----
    const btnLabel = (this.reason === 'rescued' || this.reason === 'rescued_alone')
      ? 'PLAY AGAIN' : 'TRY AGAIN';
    this._createPlayAgainButton(width, height, btnLabel);

    // ---- Scanlines ----
    const scanGfx = this.add.graphics();
    scanGfx.setDepth(1000);
    for (let y = 0; y < height; y += 3) {
      scanGfx.fillStyle(0x000000, 0.06);
      scanGfx.fillRect(0, y, width, 1);
    }
  }

  // =========================================================================
  //  SOLD (shortfallCount >= 3)
  // =========================================================================

  _createSoldScene(width, height) {
    const bg = this.add.graphics();
    bg.fillStyle(0x0a0508);
    bg.fillRect(0, 0, width, height);
    bg.fillStyle(0x330000, 0.15);
    bg.fillRect(0, 0, width, height);

    // Boss figure
    this._drawAngryBoss(width / 2 - 100, height / 2 - 20);

    // Door
    this._drawDoor(width / 2 + 180, height / 2 - 60);

    // Exit sign
    const exitSign = this.add.graphics();
    exitSign.fillStyle(0xff2244, 0.9);
    exitSign.fillRoundedRect(width / 2 + 155, height / 2 - 120, 80, 28, 4);
    this.add.text(width / 2 + 195, height / 2 - 106, 'EXIT', {
      fontFamily: '"Courier New", monospace',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.tweens.add({
      targets: exitSign,
      alpha: { from: 1, to: 0.4 },
      duration: 1200,
      yoyo: true,
      repeat: -1
    });

    // Title
    const title = this.add.text(width / 2, 80, 'SOLD', {
      fontFamily: '"Courier New", monospace',
      fontSize: '64px',
      fontStyle: 'bold',
      color: '#ff2244',
      stroke: '#330000',
      strokeThickness: 6,
      shadow: { offsetX: 0, offsetY: 0, color: '#ff2244', blur: 30, fill: true }
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: title,
      alpha: 1,
      scaleX: { from: 2, to: 1 },
      scaleY: { from: 2, to: 1 },
      duration: 800,
      ease: 'Cubic.easeOut'
    });

    // Dialogue
    const lines = [
      '"You failed too many times."',
      '"The boss sold your contract to another compound."',
      '"Somewhere darker. Somewhere worse."',
    ];
    this._showDialogueLines(width, height, lines, '#ff8888', 1500);

    // Red pulse
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

  // =========================================================================
  //  ARRESTED (heat >= 80)
  // =========================================================================

  _createArrestedScene(width, height) {
    const bg = this.add.graphics();
    bg.fillStyle(0x050510);
    bg.fillRect(0, 0, width, height);

    // Police flashers
    this.redFlash = this.add.graphics();
    this.redFlash.fillStyle(0xff0000, 0.12);
    this.redFlash.fillRect(0, 0, width / 2, height);
    this.redFlash.setDepth(500).setAlpha(0);

    this.blueFlash = this.add.graphics();
    this.blueFlash.fillStyle(0x0000ff, 0.12);
    this.blueFlash.fillRect(width / 2, 0, width / 2, height);
    this.blueFlash.setDepth(500).setAlpha(0);

    this.tweens.add({
      targets: this.redFlash,
      alpha: { from: 0, to: 0.3 },
      duration: 400,
      yoyo: true,
      repeat: -1
    });
    this.tweens.add({
      targets: this.blueFlash,
      alpha: { from: 0, to: 0.3 },
      duration: 400,
      yoyo: true,
      repeat: -1,
      delay: 400
    });

    // Title
    const title = this.add.text(width / 2, 70, 'ARRESTED', {
      fontFamily: '"Courier New", monospace',
      fontSize: '58px',
      fontStyle: 'bold',
      color: '#4488ff',
      stroke: '#000033',
      strokeThickness: 6,
      shadow: { offsetX: 0, offsetY: 0, color: '#4488ff', blur: 30, fill: true }
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: title,
      alpha: 1,
      scaleX: { from: 3, to: 1 },
      scaleY: { from: 3, to: 1 },
      duration: 600,
      ease: 'Cubic.easeOut'
    });

    this._drawHandcuffs(width / 2, height / 2 - 30);
    this._drawBadge(width / 2 - 200, height / 2);
    this._drawWarrant(width / 2 + 150, height / 2 - 40);

    const lines = [
      '"The authorities caught up with you."',
      '"Your operations have been traced and recorded."',
      '"You have the right to remain silent..."',
    ];
    this._showDialogueLines(width, height, lines, '#8888ff', 1200);

    this._createStaticEffect(width, height);
  }

  // =========================================================================
  //  RESCUED (best ending — Pierogi + sent money home)
  // =========================================================================

  _createRescuedScene(width, height) {
    // Dawn-like gradient background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a1a2e, 0x0a1a2e, 0x1a3344, 0x1a3344);
    bg.fillRect(0, 0, width, height / 2);
    bg.fillGradientStyle(0x1a3344, 0x1a3344, 0x2a4455, 0x2a4455);
    bg.fillRect(0, height / 2, width, height / 2);

    // Sunrise glow at center
    const glow = this.add.graphics();
    glow.fillStyle(0x00ff88, 0.04);
    glow.fillCircle(width / 2, height / 2 - 50, 250);
    glow.fillStyle(0x00ccff, 0.03);
    glow.fillCircle(width / 2, height / 2 - 50, 350);

    this.tweens.add({
      targets: glow,
      alpha: { from: 0.6, to: 1 },
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Police flashers (positive context — the raid)
    const redFlash = this.add.graphics();
    redFlash.fillStyle(0xff0000, 0.04);
    redFlash.fillRect(0, 0, width / 2, height);
    redFlash.setDepth(500).setAlpha(0);

    const blueFlash = this.add.graphics();
    blueFlash.fillStyle(0x0000ff, 0.04);
    blueFlash.fillRect(width / 2, 0, width / 2, height);
    blueFlash.setDepth(500).setAlpha(0);

    this.tweens.add({
      targets: redFlash,
      alpha: { from: 0, to: 0.15 },
      duration: 600,
      yoyo: true,
      repeat: 5
    });
    this.tweens.add({
      targets: blueFlash,
      alpha: { from: 0, to: 0.15 },
      duration: 600,
      yoyo: true,
      repeat: 5,
      delay: 600
    });

    // Title
    const title = this.add.text(width / 2, 80, 'RESCUED', {
      fontFamily: '"Courier New", monospace',
      fontSize: '58px',
      fontStyle: 'bold',
      color: '#00ff88',
      stroke: '#003322',
      strokeThickness: 6,
      shadow: { offsetX: 0, offsetY: 0, color: '#00ff88', blur: 30, fill: true }
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: title,
      alpha: 1,
      y: { from: 100, to: 80 },
      duration: 1200,
      ease: 'Cubic.easeOut'
    });

    // Dialogue
    const lines = [
      '"Pierogi contacted the authorities."',
      '"The compound was raided at dawn."',
      '"You\'re going home."',
    ];
    this._showDialogueLines(width, height - 40, lines, '#aaffcc', 2000);

    // Family message + remittance total
    const remittance = gameState.totalRemittance;
    const familyMsg = this.add.text(width / 2, height / 2 + 30,
      `Total sent home: $${remittance}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#00ff88',
      stroke: '#000000',
      strokeThickness: 2,
      shadow: { offsetX: 0, offsetY: 0, color: '#00ff88', blur: 10, fill: true }
    }).setOrigin(0.5).setAlpha(0);

    const waitingMsg = this.add.text(width / 2, height / 2 + 60,
      '"Your family is waiting."', {
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      fontStyle: 'italic',
      color: '#88ddaa'
    }).setOrigin(0.5).setAlpha(0);

    this.time.delayedCall(4000, () => {
      this.tweens.add({ targets: familyMsg, alpha: 1, duration: 800 });
      this.tweens.add({ targets: waitingMsg, alpha: 1, duration: 800, delay: 600 });
    });
  }

  // =========================================================================
  //  RESCUED ALONE (Pierogi saved you, but no remittance)
  // =========================================================================

  _createRescuedAloneScene(width, height) {
    // Muted, gray-blue background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0a15, 0x0a0a15, 0x151525, 0x151525);
    bg.fillRect(0, 0, width, height);

    // Faint glow
    const glow = this.add.graphics();
    glow.fillStyle(0x4466aa, 0.03);
    glow.fillCircle(width / 2, height / 2 - 50, 200);

    // Title
    const title = this.add.text(width / 2, 80, 'FREE', {
      fontFamily: '"Courier New", monospace',
      fontSize: '52px',
      fontStyle: 'bold',
      color: '#6688aa',
      stroke: '#112233',
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 0, color: '#4466aa', blur: 15, fill: true }
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: title,
      alpha: 1,
      duration: 1500,
      ease: 'Cubic.easeOut'
    });

    // Subtitle
    const subtitle = this.add.text(width / 2, 140, '...but at what cost?', {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      fontStyle: 'italic',
      color: '#445566'
    }).setOrigin(0.5).setAlpha(0);

    this.time.delayedCall(1500, () => {
      this.tweens.add({ targets: subtitle, alpha: 1, duration: 800 });
    });

    // Dialogue
    const lines = [
      '"The compound was raided. You\'re free."',
      '"But you never sent anything home."',
      '"There\'s nothing waiting."',
    ];
    this._showDialogueLines(width, height, lines, '#7799aa', 2500);
  }

  // =========================================================================
  //  STILL TRAPPED (finished floor 5 without Pierogi)
  // =========================================================================

  _createStillTrappedScene(width, height) {
    // Near-black background
    const bg = this.add.graphics();
    bg.fillStyle(0x050508);
    bg.fillRect(0, 0, width, height);

    // Title — slow fade
    const title = this.add.text(width / 2, height / 2 - 60, 'STILL TRAPPED', {
      fontFamily: '"Courier New", monospace',
      fontSize: '42px',
      fontStyle: 'bold',
      color: '#445566',
      stroke: '#111122',
      strokeThickness: 3,
      shadow: { offsetX: 0, offsetY: 0, color: '#334455', blur: 10, fill: true }
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: title,
      alpha: 0.8,
      duration: 3000,
      ease: 'Cubic.easeOut'
    });

    // Dialogue — appears slowly, one line at a time
    const lines = [
      '"He didn\'t believe you."',
      '"Tomorrow the phone will ring again."',
      '"And the day after that."',
    ];

    lines.forEach((line, i) => {
      const text = this.add.text(width / 2, height / 2 + 20 + i * 35, line, {
        fontFamily: '"Courier New", monospace',
        fontSize: '16px',
        fontStyle: 'italic',
        color: '#556677',
        stroke: '#000000',
        strokeThickness: 1
      }).setOrigin(0.5).setAlpha(0);

      this.time.delayedCall(3000 + i * 2000, () => {
        this.tweens.add({
          targets: text,
          alpha: 0.7,
          duration: 1500,
          ease: 'Cubic.easeOut'
        });
      });
    });

    // Slow fade to even darker after all text appears
    this.time.delayedCall(10000, () => {
      const blackout = this.add.graphics().setDepth(400);
      blackout.fillStyle(0x000000, 1);
      blackout.fillRect(0, 0, width, height);
      blackout.setAlpha(0);
      this.tweens.add({
        targets: blackout,
        alpha: 0.5,
        duration: 5000
      });
    });
  }

  // =========================================================================
  //  SHARED HELPERS
  // =========================================================================

  /**
   * Show dialogue lines appearing one at a time near the bottom.
   */
  _showDialogueLines(width, height, lines, color, startDelay) {
    lines.forEach((line, i) => {
      const text = this.add.text(width / 2, height - 180 + i * 28, line, {
        fontFamily: '"Courier New", monospace',
        fontSize: '14px',
        fontStyle: 'italic',
        color,
        stroke: '#000000',
        strokeThickness: 1
      }).setOrigin(0.5).setAlpha(0);

      this.time.delayedCall(startDelay + i * 1200, () => {
        this.tweens.add({ targets: text, alpha: 1, duration: 400 });
      });
    });
  }

  _drawAngryBoss(x, y) {
    const g = this.add.graphics();

    // Shadow
    g.fillStyle(0x000000, 0.4);
    g.fillEllipse(x, y + 130, 120, 25);

    // Body
    g.fillStyle(0x1a1a33);
    g.fillRoundedRect(x - 40, y - 10, 80, 110, 10);

    // Suit details
    g.lineStyle(2, 0x222244);
    g.lineBetween(x - 12, y - 10, x, y + 35);
    g.lineBetween(x + 12, y - 10, x, y + 35);

    // Tie
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

    // Eyes (angry)
    g.fillStyle(0x111111);
    g.fillEllipse(x - 12, y - 58, 5, 3);
    g.fillEllipse(x + 12, y - 58, 5, 3);

    // Angry eyebrows
    g.lineStyle(3, 0x1a1a1a);
    g.lineBetween(x - 20, y - 72, x - 6, y - 64);
    g.lineBetween(x + 20, y - 72, x + 6, y - 64);

    // Angry mouth
    g.lineStyle(2, 0x993333);
    g.beginPath();
    g.arc(x, y - 36, 10, Math.PI + 0.3, -0.3, false);
    g.strokePath();

    // Pointing arm
    g.lineStyle(8, 0x1a1a33);
    g.lineBetween(x + 40, y + 10, x + 120, y - 20);
    g.fillStyle(0xcc9977);
    g.fillCircle(x + 122, y - 22, 8);
    g.lineStyle(4, 0xcc9977);
    g.lineBetween(x + 128, y - 22, x + 150, y - 30);

    // Left arm
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

    g.fillStyle(0x333344);
    g.fillRect(x - 5, y - 5, 90, 180);
    g.fillStyle(0x444455);
    g.fillRect(x, y, 80, 170);
    g.lineStyle(1, 0x555566, 0.5);
    g.strokeRect(x + 8, y + 10, 64, 60);
    g.strokeRect(x + 8, y + 80, 64, 70);
    g.fillStyle(0xccaa44);
    g.fillCircle(x + 65, y + 85, 5);
    g.fillStyle(0xffffff, 0.03);
    g.fillTriangle(x + 40, y, x - 40, y + 170, x + 120, y + 170);
  }

  _drawHandcuffs(x, y) {
    const g = this.add.graphics();

    g.lineStyle(6, 0x888899);
    g.strokeCircle(x - 35, y, 22);
    g.strokeCircle(x + 35, y, 22);

    g.lineStyle(4, 0x888899);
    g.lineBetween(x - 13, y, x + 13, y);

    g.lineStyle(3, 0xaaaabb);
    g.lineBetween(x - 10, y - 2, x - 5, y + 2);
    g.lineBetween(x - 5, y + 2, x, y - 2);
    g.lineBetween(x, y - 2, x + 5, y + 2);
    g.lineBetween(x + 5, y + 2, x + 10, y - 2);

    g.fillStyle(0x222233);
    g.fillRect(x - 38, y + 15, 6, 8);
    g.fillRect(x + 32, y + 15, 6, 8);

    g.fillStyle(0x666677);
    g.fillRoundedRect(x - 44, y + 12, 18, 14, 2);
    g.fillRoundedRect(x + 26, y + 12, 18, 14, 2);

    g.lineStyle(1, 0xccccdd, 0.5);
    g.beginPath();
    g.arc(x - 35, y, 20, -0.5, 1.2, false);
    g.strokePath();
    g.beginPath();
    g.arc(x + 35, y, 20, -0.5, 1.2, false);
    g.strokePath();

    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(x, y + 50, 100, 12);
  }

  _drawBadge(x, y) {
    const g = this.add.graphics();

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

    this.add.text(x, y + 42, 'POLICE', {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#ccaa33'
    }).setOrigin(0.5);
  }

  _drawWarrant(x, y) {
    const g = this.add.graphics();

    g.fillStyle(0x000000, 0.2);
    g.fillRect(x - 57, y + 3, 120, 150);
    g.fillStyle(0xeeddcc);
    g.fillRect(x - 60, y, 120, 150);

    this.add.text(x, y + 15, 'ARREST WARRANT', {
      fontFamily: '"Courier New", monospace',
      fontSize: '9px',
      fontStyle: 'bold',
      color: '#222222'
    }).setOrigin(0.5);

    g.lineStyle(1, 0xaaaaaa, 0.5);
    for (let i = 0; i < 8; i++) {
      const lineW = Phaser.Math.Between(60, 100);
      g.lineBetween(x - 45, y + 35 + i * 12, x - 45 + lineW, y + 35 + i * 12);
    }

    g.fillStyle(0xcc0000, 0.6);
    g.fillCircle(x + 20, y + 125, 15);
    g.lineStyle(1, 0x880000, 0.8);
    g.strokeCircle(x + 20, y + 125, 15);
    g.strokeCircle(x + 20, y + 125, 10);

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

  _createPlayAgainButton(width, height, label = 'TRY AGAIN') {
    const btnX = width / 2;
    const btnY = height - 60;
    const btnW = 240;
    const btnH = 44;

    const container = this.add.container(btnX, btnY);
    container.setDepth(900);
    container.setAlpha(0);

    const bg = this.add.graphics();
    bg.fillStyle(0x111122, 0.9);
    bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 6);
    bg.lineStyle(2, 0x00ccff, 0.7);
    bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 6);
    container.add(bg);

    const glow = this.add.graphics();
    glow.fillStyle(0x00ccff, 0.12);
    glow.fillRoundedRect(-btnW / 2 - 4, -btnH / 2 - 4, btnW + 8, btnH + 8, 8);
    glow.setAlpha(0);
    container.add(glow);

    const text = this.add.text(0, 0, label, {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#00ccff'
    }).setOrigin(0.5);
    container.add(text);

    const zone = this.add.zone(0, 0, btnW, btnH).setOrigin(0.5).setInteractive({ useHandCursor: true });
    container.add(zone);

    zone.on('pointerover', () => { glow.setAlpha(1); text.setScale(1.05); });
    zone.on('pointerout', () => { glow.setAlpha(0); text.setScale(1); });
    zone.on('pointerdown', () => text.setScale(0.95));
    zone.on('pointerup', () => {
      text.setScale(1);
      this.sound.play('sfx_button_click', { volume: 0.5 });
      SaveManager.reset();
      gameState.reset();
      this.scene.start('menu');
    });

    // Show button after delay (longer for still_trapped due to slow pacing)
    const delay = this.reason === 'still_trapped' ? 8000 : 3500;
    this.time.delayedCall(delay, () => {
      this.tweens.add({
        targets: container,
        alpha: 1,
        duration: 600,
        ease: 'Cubic.easeOut'
      });
    });
  }
}
