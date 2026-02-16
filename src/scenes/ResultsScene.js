/**
 * ResultsScene.js - End-of-Shift Score Breakdown
 *
 * Shows per-call results, money earned, total vs quota,
 * and determines whether the player proceeds, retries, or fails.
 */

import Phaser from 'phaser';
import gameState, { LEVEL_CONFIG } from '../state/GameState.js';

export class ResultsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'results' });
  }

  init(data) {
    this.levelNum = data?.level || this.registry.get('currentLevel') || 1;
    this.totalMoney = data?.totalMoney ?? gameState.money;
    this.quota = data?.quota ?? gameState.quota;
    this.passed = data?.passed ?? (this.totalMoney >= this.quota);
    this.shiftResults = data?.shiftResults ?? gameState.shiftResults ?? [];

    // Track failures across the game
    const failures = this.registry.get('shiftFailures') || 0;
    if (!this.passed) {
      this.registry.set('shiftFailures', failures + 1);
    }
    this.totalFailures = this.registry.get('shiftFailures') || 0;
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(0x0a0a1a);

    // ---- Scanlines ----
    const scanGfx = this.add.graphics();
    scanGfx.setDepth(1000);
    for (let y = 0; y < height; y += 4) {
      scanGfx.fillStyle(0x000000, 0.04);
      scanGfx.fillRect(0, y, width, 1);
    }

    // ---- Header ----
    this.add.text(width / 2, 30, 'SHIFT REPORT', {
      fontFamily: '"Courier New", monospace',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#00ccff',
      stroke: '#002233',
      strokeThickness: 3,
      shadow: { offsetX: 0, offsetY: 0, color: '#00ccff', blur: 15, fill: true }
    }).setOrigin(0.5);

    const config = LEVEL_CONFIG[this.levelNum];
    this.add.text(width / 2, 65, `Shift ${this.levelNum}: ${config?.name || 'Unknown'}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      color: '#667788'
    }).setOrigin(0.5);

    // Decorative line
    const lineGfx = this.add.graphics();
    lineGfx.lineStyle(1, 0x00ccff, 0.3);
    lineGfx.lineBetween(100, 85, width - 100, 85);

    // ---- Per-call results ----
    this._drawCallResults(width, height);

    // ---- Total and quota bar ----
    this._drawQuotaResult(width, height);

    // ---- Verdict ----
    this._drawVerdict(width, height);
  }

  // =========================================================================
  //  CALL RESULTS TABLE
  // =========================================================================

  _drawCallResults(width, height) {
    const tableX = 80;
    const tableY = 105;
    const tableW = width - 160;
    const rowH = 40;

    // Table header background
    const headerBg = this.add.graphics();
    headerBg.fillStyle(0x111122, 0.9);
    headerBg.fillRoundedRect(tableX, tableY, tableW, 28, { tl: 6, tr: 6, bl: 0, br: 0 });

    // Header columns
    const columns = [
      { label: '#', x: tableX + 20, width: 30 },
      { label: 'VICTIM', x: tableX + 55, width: 180 },
      { label: 'RESULT', x: tableX + 240, width: 100 },
      { label: 'SUSPICION', x: tableX + 350, width: 90 },
      { label: 'EARNINGS', x: tableX + 460, width: 100 },
      { label: 'BONUS', x: tableX + 570, width: 80 },
    ];

    columns.forEach(col => {
      this.add.text(col.x, tableY + 6, col.label, {
        fontFamily: '"Courier New", monospace',
        fontSize: '10px',
        fontStyle: 'bold',
        color: '#00ccff'
      });
    });

    // Rows for each call
    this.shiftResults.forEach((result, i) => {
      const rowY = tableY + 30 + i * rowH;
      const delay = 300 + i * 400;

      // Row background (alternating)
      const rowBg = this.add.graphics();
      rowBg.fillStyle(i % 2 === 0 ? 0x0d0d1f : 0x111128, 0.8);
      rowBg.fillRect(tableX, rowY, tableW, rowH - 2);
      rowBg.setAlpha(0);

      // Row data
      const success = result.success;
      const rowTexts = [];

      // Call number
      rowTexts.push(this.add.text(columns[0].x, rowY + 12, `${i + 1}`, {
        fontFamily: '"Courier New", monospace',
        fontSize: '13px',
        color: '#888899'
      }).setAlpha(0));

      // Victim name
      rowTexts.push(this.add.text(columns[1].x, rowY + 5, result.victim?.name || 'Unknown', {
        fontFamily: '"Courier New", monospace',
        fontSize: '12px',
        color: '#ccddee'
      }).setAlpha(0));

      // Victim location (sub line)
      rowTexts.push(this.add.text(columns[1].x, rowY + 22, result.victim?.location || '', {
        fontFamily: '"Courier New", monospace',
        fontSize: '9px',
        color: '#556677'
      }).setAlpha(0));

      // Result
      const resultLabel = success ? 'SUCCESS' : result.reason.replace(/_/g, ' ').toUpperCase();
      rowTexts.push(this.add.text(columns[2].x, rowY + 12,
        resultLabel.length > 14 ? resultLabel.substring(0, 14) : resultLabel, {
        fontFamily: '"Courier New", monospace',
        fontSize: '11px',
        fontStyle: 'bold',
        color: success ? '#00ff88' : '#ff4444'
      }).setAlpha(0));

      // Suspicion level
      const suspColor = result.suspicion > 75 ? '#ff2244' : result.suspicion > 50 ? '#ffcc00' : '#00ff88';
      rowTexts.push(this.add.text(columns[3].x, rowY + 12, `${result.suspicion}%`, {
        fontFamily: '"Courier New", monospace',
        fontSize: '13px',
        color: suspColor
      }).setAlpha(0));

      // Suspicion bar
      const suspBar = this.add.graphics();
      suspBar.fillStyle(0x111122);
      suspBar.fillRect(columns[3].x + 45, rowY + 14, 40, 8);
      const suspFillColor = result.suspicion > 75 ? 0xff2244 : result.suspicion > 50 ? 0xffcc00 : 0x00ff88;
      suspBar.fillStyle(suspFillColor, 0.7);
      suspBar.fillRect(columns[3].x + 45, rowY + 14, 40 * (result.suspicion / 100), 8);
      suspBar.setAlpha(0);
      rowTexts.push({ setAlpha: (a) => suspBar.setAlpha(a), destroy: () => suspBar.destroy() });

      // Earnings
      rowTexts.push(this.add.text(columns[4].x, rowY + 12,
        success ? `+$${result.score}` : '$0', {
        fontFamily: '"Courier New", monospace',
        fontSize: '14px',
        fontStyle: 'bold',
        color: success ? '#00ff88' : '#ff4444'
      }).setAlpha(0));

      // Combo bonus
      const comboText = result.combo > 1 ? `x${result.combo} COMBO` : result.combo === 1 ? 'x1' : '-';
      rowTexts.push(this.add.text(columns[5].x, rowY + 12, comboText, {
        fontFamily: '"Courier New", monospace',
        fontSize: '11px',
        color: result.combo > 1 ? '#ffcc00' : '#556677'
      }).setAlpha(0));

      // Animate row appearing
      this.time.delayedCall(delay, () => {
        rowBg.setAlpha(1);
        rowTexts.forEach(t => {
          if (t.setAlpha) t.setAlpha(1);
        });
      });
    });
  }

  // =========================================================================
  //  QUOTA RESULT
  // =========================================================================

  _drawQuotaResult(width, height) {
    const barY = height - 180;
    const barX = 120;
    const barW = width - 240;

    // Separator line
    const sep = this.add.graphics();
    sep.lineStyle(1, 0x333355, 0.5);
    sep.lineBetween(80, barY - 30, width - 80, barY - 30);

    // "TOTAL" label
    this.add.text(barX, barY - 22, 'SHIFT TOTAL', {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#aabbcc'
    });

    // Money total
    this.totalMoneyText = this.add.text(width - barX, barY - 22, `$${this.totalMoney}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      fontStyle: 'bold',
      color: this.passed ? '#00ff88' : '#ff4444',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(1, 0);

    // Quota bar background
    const barBg = this.add.graphics();
    barBg.fillStyle(0x111122, 0.9);
    barBg.fillRoundedRect(barX - 10, barY + 5, barW + 20, 40, 6);
    barBg.lineStyle(1, this.passed ? 0x00ff88 : 0xff2244, 0.4);
    barBg.strokeRoundedRect(barX - 10, barY + 5, barW + 20, 40, 6);

    // Bar frame
    const barFrame = this.add.graphics();
    barFrame.fillStyle(0x0a0a15, 0.9);
    barFrame.fillRoundedRect(barX, barY + 12, barW, 20, 4);
    barFrame.lineStyle(1, 0x333344, 0.6);
    barFrame.strokeRoundedRect(barX, barY + 12, barW, 20, 4);

    // Quota marker line
    const quotaMarkerX = barX + barW;
    const quotaLine = this.add.graphics();
    quotaLine.lineStyle(2, 0xffcc00, 0.8);
    quotaLine.lineBetween(quotaMarkerX, barY + 8, quotaMarkerX, barY + 38);

    this.add.text(quotaMarkerX, barY + 40, `QUOTA: $${this.quota}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      color: '#ffcc00'
    }).setOrigin(0.5, 0);

    // Animated fill
    const barFill = this.add.graphics();
    const fillPercent = Math.min(this.totalMoney / this.quota, 1.2); // Allow overshoot
    const finalWidth = Math.min(barW * fillPercent, barW) - 2;

    // Animate the bar filling
    const proxy = { width: 0 };
    this.time.delayedCall(800, () => {
      this.tweens.add({
        targets: proxy,
        width: finalWidth,
        duration: 1500,
        ease: 'Cubic.easeOut',
        onUpdate: () => {
          barFill.clear();
          const color = this.passed ? 0x00ff88 : 0xff8844;
          barFill.fillStyle(color, 0.85);
          barFill.fillRoundedRect(barX + 1, barY + 13, proxy.width, 18, 3);
          // Highlight
          barFill.fillStyle(0xffffff, 0.2);
          barFill.fillRect(barX + 1, barY + 13, proxy.width, 4);
        }
      });
    });
  }

  // =========================================================================
  //  VERDICT & BUTTONS
  // =========================================================================

  _drawVerdict(width, height) {
    const verdictY = height - 95;

    // Check for game over conditions
    if (this.totalFailures >= 2) {
      // GAME OVER - Too many failures
      this.time.delayedCall(2500, () => {
        this.scene.start('gameover', { reason: 'fired' });
      });

      this.add.text(width / 2, verdictY, 'TERMINATED', {
        fontFamily: '"Courier New", monospace',
        fontSize: '24px',
        fontStyle: 'bold',
        color: '#ff2244',
        stroke: '#000000',
        strokeThickness: 3,
        shadow: { offsetX: 0, offsetY: 0, color: '#ff2244', blur: 15, fill: true }
      }).setOrigin(0.5);

      this.add.text(width / 2, verdictY + 30, 'You failed too many shifts. The boss is not happy...', {
        fontFamily: '"Courier New", monospace',
        fontSize: '12px',
        color: '#ff8888'
      }).setOrigin(0.5);

      return;
    }

    // Check for heat-based arrest
    if (gameState.heat >= 80) {
      this.time.delayedCall(2500, () => {
        this.scene.start('gameover', { reason: 'arrested' });
      });

      this.add.text(width / 2, verdictY, 'BUSTED', {
        fontFamily: '"Courier New", monospace',
        fontSize: '24px',
        fontStyle: 'bold',
        color: '#4488ff',
        stroke: '#000000',
        strokeThickness: 3,
        shadow: { offsetX: 0, offsetY: 0, color: '#4488ff', blur: 15, fill: true }
      }).setOrigin(0.5);

      this.add.text(width / 2, verdictY + 30, 'The authorities have traced your operations...', {
        fontFamily: '"Courier New", monospace',
        fontSize: '12px',
        color: '#88aaff'
      }).setOrigin(0.5);

      return;
    }

    if (this.passed) {
      // Check if all 5 levels complete
      if (this.levelNum >= 5) {
        this._drawWinScreen(width, height, verdictY);
      } else {
        // QUOTA MET - next shift
        this._drawQuotaMet(width, height, verdictY);
      }
    } else {
      // QUOTA MISSED - retry
      this._drawQuotaMissed(width, height, verdictY);
    }
  }

  _drawQuotaMet(width, height, verdictY) {
    const verdictText = this.add.text(width / 2, verdictY, 'QUOTA MET', {
      fontFamily: '"Courier New", monospace',
      fontSize: '26px',
      fontStyle: 'bold',
      color: '#00ff88',
      stroke: '#003322',
      strokeThickness: 3,
      shadow: { offsetX: 0, offsetY: 0, color: '#00ff88', blur: 15, fill: true }
    }).setOrigin(0.5).setAlpha(0);

    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: verdictText,
        alpha: 1,
        scaleX: { from: 0.5, to: 1 },
        scaleY: { from: 0.5, to: 1 },
        duration: 500,
        ease: 'Back.easeOut'
      });
    });

    // Next shift button
    this._createActionButton(width / 2, verdictY + 45, 'NEXT SHIFT >>', 0x00ff88, 0x003322, () => {
      const nextLevel = this.levelNum + 1;
      this.registry.set('currentLevel', nextLevel);
      this.scene.start('briefing', { level: nextLevel });
    }, 2500);
  }

  _drawQuotaMissed(width, height, verdictY) {
    const verdictText = this.add.text(width / 2, verdictY, 'QUOTA MISSED', {
      fontFamily: '"Courier New", monospace',
      fontSize: '26px',
      fontStyle: 'bold',
      color: '#ff2244',
      stroke: '#330011',
      strokeThickness: 3,
      shadow: { offsetX: 0, offsetY: 0, color: '#ff2244', blur: 15, fill: true }
    }).setOrigin(0.5).setAlpha(0);

    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: verdictText,
        alpha: 1,
        scaleX: { from: 0.5, to: 1 },
        scaleY: { from: 0.5, to: 1 },
        duration: 500,
        ease: 'Back.easeOut'
      });
    });

    // Boss warning
    const warningText = this.add.text(width / 2, verdictY + 30,
      `"Don't let it happen again. ${this.totalFailures >= 1 ? 'ONE more strike and you\'re OUT.' : 'Everyone gets one chance.'}"`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      fontStyle: 'italic',
      color: '#ff8888'
    }).setOrigin(0.5).setAlpha(0);

    this.time.delayedCall(2800, () => {
      warningText.setAlpha(1);
    });

    // Try again button
    this._createActionButton(width / 2, verdictY + 60, 'TRY AGAIN', 0xff8844, 0x331100, () => {
      this.scene.start('briefing', { level: this.levelNum });
    }, 3200);
  }

  _drawWinScreen(width, height, verdictY) {
    // Calculate total career earnings across all shifts
    const totalCareerEarnings = this.totalMoney; // In a real game, accumulate across levels

    const youWin = this.add.text(width / 2, verdictY - 10, 'YOU WIN', {
      fontFamily: '"Courier New", monospace',
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#ffcc00',
      stroke: '#332200',
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 0, color: '#ffcc00', blur: 20, fill: true }
    }).setOrigin(0.5).setAlpha(0);

    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: youWin,
        alpha: 1,
        scaleX: { from: 0.3, to: 1 },
        scaleY: { from: 0.3, to: 1 },
        duration: 800,
        ease: 'Back.easeOut'
      });
    });

    const subText = this.add.text(width / 2, verdictY + 30,
      `Total Career Earnings: $${totalCareerEarnings}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      color: '#ffdd44'
    }).setOrigin(0.5).setAlpha(0);

    this.time.delayedCall(3000, () => {
      subText.setAlpha(1);
    });

    const moralText = this.add.text(width / 2, verdictY + 55,
      '"But at what cost?"', {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      fontStyle: 'italic',
      color: '#667788'
    }).setOrigin(0.5).setAlpha(0);

    this.time.delayedCall(4000, () => {
      moralText.setAlpha(1);
    });

    // Play again button
    this._createActionButton(width / 2, verdictY + 85, 'PLAY AGAIN', 0x00ccff, 0x002233, () => {
      this.registry.set('shiftFailures', 0);
      gameState.reset();
      this.scene.start('menu');
    }, 4500);
  }

  // =========================================================================
  //  BUTTON HELPER
  // =========================================================================

  _createActionButton(x, y, label, borderColor, bgColor, callback, showDelay = 0) {
    const btnW = 220;
    const btnH = 38;
    const container = this.add.container(x, y);
    container.setAlpha(0);

    const bg = this.add.graphics();
    bg.fillStyle(bgColor, 0.9);
    bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 6);
    bg.lineStyle(2, borderColor, 0.8);
    bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 6);
    container.add(bg);

    const glow = this.add.graphics();
    glow.fillStyle(borderColor, 0.12);
    glow.fillRoundedRect(-btnW / 2 - 4, -btnH / 2 - 4, btnW + 8, btnH + 8, 8);
    glow.setAlpha(0);
    container.add(glow);

    const text = this.add.text(0, 0, label, {
      fontFamily: '"Courier New", monospace',
      fontSize: '15px',
      fontStyle: 'bold',
      color: `#${borderColor.toString(16).padStart(6, '0')}`
    }).setOrigin(0.5);
    container.add(text);

    const zone = this.add.zone(0, 0, btnW, btnH).setOrigin(0.5).setInteractive({ useHandCursor: true });
    container.add(zone);

    zone.on('pointerover', () => { glow.setAlpha(1); text.setScale(1.05); });
    zone.on('pointerout', () => { glow.setAlpha(0); text.setScale(1); });
    zone.on('pointerup', () => callback());

    this.time.delayedCall(showDelay, () => {
      this.tweens.add({
        targets: container,
        alpha: 1,
        y: y,
        duration: 400,
        ease: 'Back.easeOut'
      });
    });

    return container;
  }
}
