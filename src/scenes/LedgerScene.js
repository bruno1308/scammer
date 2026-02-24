/**
 * LedgerScene.js - End-of-Shift Ledger
 *
 * Shows shift earnings, expense deductions (animated line-by-line),
 * wallet balance, shortfall warnings, family remittance option,
 * and handles floor/game transitions.
 */

import Phaser from 'phaser';
import gameState from '../state/GameState.js';
import SaveManager from '../state/SaveManager.js';
import { FLOORS, getRemainingVictims } from '../config/levels.js';

export class LedgerScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ledger' });
  }

  init(data) {
    this.floorNum = data?.floor || gameState.currentFloor;
    this.shiftEarnings = data?.shiftEarnings ?? gameState.shiftEarnings;
    this.expenses = data?.expenses ?? 0;
    this.expenseBreakdown = data?.expenseBreakdown ?? {};
    this.walletBalance = data?.wallet ?? gameState.wallet;
    this.shortfall = data?.shortfall ?? 0;
    this.shortfallCount = data?.shortfallCount ?? gameState.shortfallCount;
    this.floorComplete = data?.floorComplete ?? false;
    this.shiftResults = data?.shiftResults ?? gameState.shiftResults ?? [];
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(0x0a0a1a);

    // ---- Audio ----
    this.sound.stopAll();
    this.sound.play(this.shortfall > 0 ? 'music_results_failure' : 'music_results_success',
      { loop: true, volume: 0.3 });

    // ---- Scanlines ----
    const scanGfx = this.add.graphics().setDepth(1000);
    for (let y = 0; y < height; y += 4) {
      scanGfx.fillStyle(0x000000, 0.04);
      scanGfx.fillRect(0, y, width, 1);
    }

    const floor = FLOORS[this.floorNum];

    // ---- Header ----
    this.add.text(width / 2, 25, 'SHIFT REPORT', {
      fontFamily: '"Courier New", monospace',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#00ccff',
      stroke: '#002233',
      strokeThickness: 3,
      shadow: { offsetX: 0, offsetY: 0, color: '#00ccff', blur: 15, fill: true }
    }).setOrigin(0.5);

    this.add.text(width / 2, 60, `Floor ${this.floorNum}: ${floor?.name || 'Unknown'}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      color: '#667788'
    }).setOrigin(0.5);

    // Decorative line
    const lineGfx = this.add.graphics();
    lineGfx.lineStyle(1, 0x00ccff, 0.3);
    lineGfx.lineBetween(100, 80, width - 100, 80);

    // ---- Section 1: Shift Summary ----
    const successCount = this.shiftResults.filter(r => r.success).length;
    this.add.text(width / 2, 100,
      `Calls: ${this.shiftResults.length}  |  Successful: ${successCount}  |  Earned: $${this.shiftEarnings}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      color: '#aabbcc'
    }).setOrigin(0.5);

    // ---- Section 2: Expense Deductions (animated) ----
    this._animateExpenses(width, height);
  }

  /**
   * Animate expense lines appearing one at a time.
   */
  _animateExpenses(width, height) {
    const startY = 145;
    const lineH = 26;
    let currentY = startY;
    let delay = 600;

    // Section header
    const headerText = this.add.text(width / 2, currentY, '──── DEDUCTIONS ────', {
      fontFamily: '"Courier New", monospace',
      fontSize: '13px',
      color: '#ff8844'
    }).setOrigin(0.5).setAlpha(0);

    this.time.delayedCall(delay, () => headerText.setAlpha(1));
    currentY += lineH;
    delay += 400;

    // Expense lines
    const expenseLabels = {
      bunkFee: 'BUNK FEE',
      food: 'FOOD',
      debtRepayment: 'DEBT REPAYMENT',
      protectionFee: 'PROTECTION FEE',
      equipmentLevy: 'EQUIPMENT LEVY',
    };

    const expenseEntries = Object.entries(this.expenseBreakdown)
      .filter(([, val]) => val > 0);

    expenseEntries.forEach(([key, amount]) => {
      const label = expenseLabels[key] || key.toUpperCase();
      const dots = '.'.repeat(Math.max(2, 38 - label.length - `$${amount}`.length));
      const lineText = this.add.text(width / 2 - 200, currentY,
        `${label} ${dots} -$${amount}`, {
        fontFamily: '"Courier New", monospace',
        fontSize: '13px',
        color: '#ff4444'
      }).setAlpha(0);

      this.time.delayedCall(delay, () => {
        lineText.setAlpha(1);
        this.sound.play('sfx_page_flip', { volume: 0.2 });
      });

      currentY += lineH;
      delay += 400;
    });

    // Total expenses line
    const totalLine = this.add.text(width / 2 - 200, currentY,
      `${'─'.repeat(40)}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '13px',
      color: '#556677'
    }).setAlpha(0);

    this.time.delayedCall(delay, () => totalLine.setAlpha(1));
    currentY += lineH;
    delay += 200;

    const totalText = this.add.text(width / 2 - 200, currentY,
      `TOTAL EXPENSES ${'.'.repeat(20)} -$${this.expenses}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#ff6644'
    }).setAlpha(0);

    this.time.delayedCall(delay, () => {
      totalText.setAlpha(1);
      this.sound.play('sfx_stamp_press', { volume: 0.4 });
    });
    currentY += lineH + 10;
    delay += 600;

    // ---- Section 3: Wallet Balance ----
    const walletColor = this.walletBalance > 0 ? '#00ff88' : '#ff4444';
    const walletText = this.add.text(width / 2, currentY, `WALLET: $${this.walletBalance}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '22px',
      fontStyle: 'bold',
      color: walletColor,
      stroke: '#000000',
      strokeThickness: 3,
      shadow: { offsetX: 0, offsetY: 0, color: walletColor, blur: 10, fill: true }
    }).setOrigin(0.5).setAlpha(0);

    this.time.delayedCall(delay, () => {
      walletText.setAlpha(1);
      this.sound.play('sfx_money_chaching', { volume: 0.4 });
    });
    currentY += 40;
    delay += 600;

    // ---- Section 4: Shortfall Warning ----
    if (this.shortfall > 0) {
      const warnings = [
        '"Don\'t let it happen again."',
        '"ONE more strike and you\'re done."',
        '"..."'
      ];
      const warningMsg = warnings[Math.min(this.shortfallCount - 1, warnings.length - 1)];

      const shortfallText = this.add.text(width / 2, currentY,
        `SHORTFALL: -$${this.shortfall} — Carried to next shift`, {
        fontFamily: '"Courier New", monospace',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#ff2244',
        stroke: '#000000',
        strokeThickness: 2,
      }).setOrigin(0.5).setAlpha(0);

      const bossWarning = this.add.text(width / 2, currentY + 24, warningMsg, {
        fontFamily: '"Courier New", monospace',
        fontSize: '12px',
        fontStyle: 'italic',
        color: '#ff8888'
      }).setOrigin(0.5).setAlpha(0);

      const strikeText = this.add.text(width / 2, currentY + 44,
        `Shortfalls: ${this.shortfallCount}/3`, {
        fontFamily: '"Courier New", monospace',
        fontSize: '11px',
        color: '#ff4444'
      }).setOrigin(0.5).setAlpha(0);

      this.time.delayedCall(delay, () => {
        shortfallText.setAlpha(1);
        bossWarning.setAlpha(1);
        strikeText.setAlpha(1);
        this.sound.play('sfx_suspicion_warning', { volume: 0.5 });
      });

      currentY += 70;
      delay += 800;
    }

    // ---- Section 5: Remittance or Transition ----
    this.time.delayedCall(delay, () => {
      if (this.walletBalance > 0 && !this._isGameOver()) {
        this._showRemittance(width, currentY);
      } else {
        this._showTransition(width, currentY);
      }
    });
  }

  /**
   * Show the "Send Money Home" option.
   */
  _showRemittance(width, startY) {
    const boxW = 500;
    const boxH = 160;
    const boxX = width / 2 - boxW / 2;
    const boxY = startY;
    let remittanceChosen = false;

    // Box background
    const bg = this.add.graphics();
    bg.fillStyle(0x0d1a0d, 0.95);
    bg.fillRoundedRect(boxX, boxY, boxW, boxH, 8);
    bg.lineStyle(2, 0x00ff88, 0.5);
    bg.strokeRoundedRect(boxX, boxY, boxW, boxH, 8);

    // Title
    this.add.text(width / 2, boxY + 20, 'SEND MONEY HOME?', {
      fontFamily: '"Courier New", monospace',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#00ff88'
    }).setOrigin(0.5);

    // Family message based on total remittance
    const total = gameState.totalRemittance;
    let familyMsg;
    if (total === 0) familyMsg = '"We haven\'t heard from you."';
    else if (total <= 100) familyMsg = '"Thank you. We are managing."';
    else if (total <= 250) familyMsg = '"Sister started school. Thank you."';
    else if (total <= 500) familyMsg = '"Mom got her medicine. We love you."';
    else familyMsg = '"We are okay. Focus on staying safe."';

    this.add.text(width / 2, boxY + 50, familyMsg, {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      fontStyle: 'italic',
      color: '#aaccaa'
    }).setOrigin(0.5);

    // Remittance buttons
    const amounts = [50, 100];
    const btnY = boxY + 110;
    const gap = 130;
    const btnStartX = width / 2 - gap;
    const allBtns = [];

    const disableOtherBtns = (chosenBtn) => {
      allBtns.forEach(btn => {
        if (btn === chosenBtn) {
          // Highlight chosen
          this.tweens.add({ targets: btn, scaleX: 1.1, scaleY: 1.1, duration: 150, ease: 'Back.easeOut' });
        } else {
          // Dim and disable others
          this.tweens.add({ targets: btn, alpha: 0.3, duration: 200 });
          btn.getAll().forEach(child => {
            if (child.input) child.disableInteractive();
          });
        }
      });
    };

    amounts.forEach((amount, i) => {
      if (amount > this.walletBalance) return;
      const btn = this._createLedgerButton(
        btnStartX + i * gap, btnY,
        `$${amount}`, 0x00ff88, 0x003322,
        () => {
          if (remittanceChosen) return;
          remittanceChosen = true;
          disableOtherBtns(btn);
          gameState.sendRemittance(amount);
          this.walletBalance = gameState.wallet;
          this.time.delayedCall(600, () => this._showTransition(width, boxY + boxH + 20));
        }
      );
      allBtns.push(btn);
    });

    // Skip button
    const skipBtn = this._createLedgerButton(
      btnStartX + 2 * gap, btnY,
      'SKIP', 0x667788, 0x111122,
      () => {
        if (remittanceChosen) return;
        remittanceChosen = true;
        disableOtherBtns(skipBtn);
        this.time.delayedCall(600, () => this._showTransition(width, boxY + boxH + 20));
      }
    );
    allBtns.push(skipBtn);
  }

  /**
   * Determine and show the transition button/screen.
   */
  _showTransition(width, startY) {
    const dest = this._getNextDestination();

    if (dest.scene === 'gameover') {
      // Auto-transition after delay
      this.time.delayedCall(2000, () => {
        this.scene.start('gameover', dest.data);
      });

      this.add.text(width / 2, startY + 20, dest.label || 'THE END', {
        fontFamily: '"Courier New", monospace',
        fontSize: '22px',
        fontStyle: 'bold',
        color: '#ff2244',
        stroke: '#000000',
        strokeThickness: 3,
        shadow: { offsetX: 0, offsetY: 0, color: '#ff2244', blur: 15, fill: true }
      }).setOrigin(0.5);
      return;
    }

    // Show appropriate button
    const btnLabel = this.floorComplete
      ? (this.floorNum >= 5 ? 'SEE YOUR FATE >>' : 'NEXT FLOOR >>')
      : 'NEXT SHIFT >>';
    const btnColor = this.floorComplete ? 0xffcc00 : 0x00ff88;

    if (this.floorComplete) {
      this.add.text(width / 2, startY, 'FLOOR COMPLETE', {
        fontFamily: '"Courier New", monospace',
        fontSize: '20px',
        fontStyle: 'bold',
        color: '#ffcc00',
        shadow: { offsetX: 0, offsetY: 0, color: '#ffcc00', blur: 10, fill: true }
      }).setOrigin(0.5);
      startY += 40;
    }

    this._createLedgerButton(
      width / 2, startY + 20,
      btnLabel, btnColor, 0x001100,
      () => this.scene.start(dest.scene, dest.data)
    );
  }

  /**
   * Determine the next destination based on game state.
   */
  _getNextDestination() {
    // Game over: too many shortfalls
    if (this.shortfallCount >= 3) {
      return { scene: 'gameover', data: { reason: 'sold' }, label: 'SOLD' };
    }

    // Game over: heat too high
    if (gameState.heat >= 80) {
      return { scene: 'gameover', data: { reason: 'arrested' }, label: 'BUSTED' };
    }

    // Floor complete
    if (this.floorComplete) {
      if (this.floorNum >= 5) {
        // Final ending
        if (gameState.pierogiConvinced && gameState.totalRemittance > 0) {
          return { scene: 'gameover', data: { reason: 'rescued' } };
        }
        if (gameState.pierogiConvinced) {
          return { scene: 'gameover', data: { reason: 'rescued_alone' } };
        }
        return { scene: 'gameover', data: { reason: 'still_trapped' } };
      }

      // Next floor
      const nextFloor = this.floorNum + 1;
      gameState.currentFloor = nextFloor;
      SaveManager.save(gameState.getSerializableState());
      return { scene: 'briefing', data: { level: nextFloor } };
    }

    // Same floor, next night — clear tonight's attempts so they can be re-attempted
    gameState.attemptedTonight = [];
    SaveManager.save(gameState.getSerializableState());
    return { scene: 'briefing', data: { level: this.floorNum } };
  }

  /**
   * Check if we're heading to a game over.
   */
  _isGameOver() {
    return this.shortfallCount >= 3 || gameState.heat >= 80;
  }

  /**
   * Create a styled button.
   */
  _createLedgerButton(x, y, label, borderColor, bgColor, callback) {
    const btnW = 110;
    const btnH = 32;
    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(bgColor, 0.9);
    bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 6);
    bg.lineStyle(2, borderColor, 0.8);
    bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 6);
    container.add(bg);

    const text = this.add.text(0, 0, label, {
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      fontStyle: 'bold',
      color: `#${borderColor.toString(16).padStart(6, '0')}`,
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
    container.add(text);

    const zone = this.add.zone(0, 0, btnW, btnH).setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    container.add(zone);

    zone.on('pointerover', () => {
      text.setScale(1.05);
      container.setScale(1.03);
    });
    zone.on('pointerout', () => {
      text.setScale(1);
      container.setScale(1);
    });
    zone.on('pointerup', () => {
      this.sound.play('sfx_button_click', { volume: 0.5 });
      callback();
    });

    return container;
  }
}
