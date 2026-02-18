/**
 * BriefingScene.js - Pre-Shift Briefing
 *
 * Shows the boss character delivering instructions before each shift.
 * Displays level-specific dialogue one line at a time, then reveals
 * the scam script card with floor progress and expense info.
 * Player clicks "START SHIFT" to begin.
 */

import Phaser from 'phaser';
import gameState from '../state/GameState.js';
import { FLOORS, getTotalExpenses, getRemainingVictims } from '../config/levels.js';

/** Boss dialogue per floor (compound narrative). */
const BOSS_DIALOGUE = {
  1: [
    '"Welcome to your new home, fresh meat."',
    '"You owe us two thousand dollars for your travel expenses."',
    '"The only way you pay that off is by working the phones."',
    '"Today is simple. Consumer refund scams. Follow the script."',
    '"The clock starts when you sit down. Make every minute count."',
    '"And don\'t even think about running. There\'s nowhere to go."',
  ],
  2: [
    '"Not bad. You survived your first floor."',
    '"Your debt has been restructured. You owe more now."',
    '"Today: Government impersonation. Scare them. Make them pay."',
    '"These marks are tougher. Watch your suspicion meter."',
    '"Oh, and your bunk fee went up. Welcome to the corner suite."',
  ],
  3: [
    '"New expense today. Protection fee."',
    '"Cops have been sniffing around. Everyone chips in."',
    '"Today: Tech Support. Sound helpful, sound urgent."',
    '"Do your homework on FriendBook — figure out each mark\'s angle."',
    '"And no, the protection fee is NOT optional."',
  ],
  4: [
    '"This one\'s different. Trust scams."',
    '"Find their weakness. Become the person who can fix it."',
    '"Do your research. FriendBook will tell you everything you need."',
    '"Big payouts here. You might make a dent in your debt."',
    '"...I said MIGHT."',
  ],
  5: [
    '"Last floor. CEO Fraud. The big leagues."',
    '"You\'re impersonating corporate executives."',
    '"Sound important. Sound impatient. These people are smart."',
    '"Nail this and... well, you\'ll see."',
    '"Get on the phone."',
  ],
};

/** Scam script notes per level. */
const SCAM_SCRIPTS = {
  1: {
    title: 'CONSUMER REFUND',
    lines: [
      'You are: Customer Service calling about a billing error',
      'Claim: Overcharge on a recent purchase or service',
      'Hook: A refund was sent but "the system overpaid"',
      'Method: Gift cards needed to return the excess',
      'Each victim has a different company — check their script',
    ],
  },
  2: {
    title: 'GOVERNMENT IMPERSONATION',
    lines: [
      'You are: Official from a government authority',
      'Claim: Outstanding debt, warrant, or frozen account',
      'Method: Immediate payment required to avoid consequences',
      'Target: Wire transfer or prepaid card payment',
      'Each victim has a different agency — check their script',
    ],
  },
  3: {
    title: 'TECH SUPPORT',
    lines: [
      'You are: Support agent from a tech or security company',
      'Claim: Their device or account has been compromised',
      'Method: Remote access to show fake issues, sell protection',
      'Research: Use FriendBook to discover each victim\'s tech problem',
      'Each victim has a different angle — research before calling',
    ],
  },
  4: {
    title: 'TRUST & CONFIDENCE',
    lines: [
      'You are: Someone who can solve their specific problem',
      'Claim: Help with debt, investments, shipping, or charity',
      'Method: Build trust, then introduce a financial request',
      'Research: Use FriendBook to find each victim\'s vulnerability',
      'Each victim has a different angle — research before calling',
    ],
  },
  5: {
    title: 'CEO FRAUD',
    lines: [
      'You are: A corporate executive or supplier contact',
      'Claim: Urgent confidential financial transaction needed',
      'Method: Authority + urgency + insider knowledge',
      'Research: Cross-reference profiles to build your pretext',
      'Each victim has a different setup — research before calling',
    ],
  },
};

export class BriefingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'briefing' });
  }

  init(data) {
    this.levelNum = data?.level || data?.floor || this.registry.get('currentLevel') || 1;
  }

  create() {
    // If all victims on this floor are already completed (e.g. player quit on
    // the ledger before clicking "NEXT FLOOR"), auto-advance to the next floor.
    const remaining = getRemainingVictims(this.levelNum, gameState.completedVictims);
    if (remaining.length === 0 && this.levelNum < 5) {
      this.levelNum += 1;
      gameState.currentFloor = this.levelNum;
    }

    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(0x0a0a1a);

    // ---- Audio ----
    this.sound.stopAll();
    this.sound.play('music_briefing_theme', { loop: true, volume: 0.25 });

    const floor = FLOORS[this.levelNum];
    const dialogue = BOSS_DIALOGUE[this.levelNum] || BOSS_DIALOGUE[1];
    const script = SCAM_SCRIPTS[this.levelNum] || SCAM_SCRIPTS[1];

    this.dialogueLines = dialogue;
    this.currentLine = 0;
    this.showingScript = false;

    // ---- Header ----
    this.add.text(width / 2, 25, `FLOOR ${this.levelNum}: ${floor?.name?.toUpperCase() || 'UNKNOWN'}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#00ff88',
      stroke: '#003322',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Subtitle
    if (floor?.subtitle) {
      this.add.text(width / 2, 48, floor.subtitle, {
        fontFamily: '"Courier New", monospace',
        fontSize: '11px',
        color: '#556677',
        fontStyle: 'italic'
      }).setOrigin(0.5);
    }

    // Decorative line
    const lineGfx = this.add.graphics();
    lineGfx.lineStyle(1, 0x00ff88, 0.3);
    lineGfx.lineBetween(100, 62, width - 100, 62);

    // ---- Floor progress bar ----
    this._drawFloorProgress(width, 80);

    // ---- Boss portrait ----
    this._showBossPortrait(200, 310);

    // ---- Dialogue box ----
    this.dialogueBox = this.add.graphics();
    this.dialogueBox.fillStyle(0x111122, 0.9);
    this.dialogueBox.fillRoundedRect(340, 180, width - 400, 200, 8);
    this.dialogueBox.lineStyle(1, 0x00ccff, 0.5);
    this.dialogueBox.strokeRoundedRect(340, 180, width - 400, 200, 8);

    // Boss name label
    this.add.text(360, 185, 'BOSS:', {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#ff4444'
    });

    // Dialogue text
    this.dialogueText = this.add.text(360, 210, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '16px',
      color: '#ccddee',
      wordWrap: { width: width - 440 },
      lineSpacing: 6
    });

    // "Click to continue" prompt
    this.continueText = this.add.text(width - 80, 370, '[ CLICK ]', {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#556677'
    }).setOrigin(1, 1);

    this.tweens.add({
      targets: this.continueText,
      alpha: { from: 1, to: 0.3 },
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // ---- Script card (hidden initially) ----
    this.scriptContainer = this.add.container(width / 2, 520);
    this.scriptContainer.setAlpha(0);

    const cardW = 600;
    const cardH = 200;
    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x0d1a0d, 0.95);
    cardBg.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 8);
    cardBg.lineStyle(2, 0x00ff88, 0.6);
    cardBg.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 8);
    // Corner accent
    cardBg.fillStyle(0x00ff88, 0.8);
    cardBg.fillTriangle(-cardW / 2, -cardH / 2, -cardW / 2 + 20, -cardH / 2, -cardW / 2, -cardH / 2 + 20);
    this.scriptContainer.add(cardBg);

    // "TOP SECRET" watermark
    const watermark = this.add.text(0, 0, 'CLASSIFIED', {
      fontFamily: '"Courier New", monospace',
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#00ff88',
      alpha: 0.04
    }).setOrigin(0.5).setAngle(-15);
    this.scriptContainer.add(watermark);

    // Script title
    const scriptTitle = this.add.text(0, -cardH / 2 + 18, `SCAM SCRIPT: ${script.title}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#00ff88',
      stroke: '#003322',
      strokeThickness: 1
    }).setOrigin(0.5);
    this.scriptContainer.add(scriptTitle);

    // Script lines
    script.lines.forEach((line, i) => {
      const lineText = this.add.text(-cardW / 2 + 30, -cardH / 2 + 45 + i * 24, `> ${line}`, {
        fontFamily: '"Courier New", monospace',
        fontSize: '12px',
        color: '#aabbcc',
        wordWrap: { width: cardW - 60 }
      });
      this.scriptContainer.add(lineText);
    });

    // ---- Shift info text ----
    this.shiftInfoText = this.add.text(width / 2, height - 110, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '13px',
      color: '#ffcc00',
      align: 'center'
    }).setOrigin(0.5).setAlpha(0);

    // ---- START SHIFT button (hidden initially) ----
    this.startButtonContainer = this.add.container(width / 2, height - 55);
    this.startButtonContainer.setAlpha(0);

    const btnW = 240;
    const btnH = 44;
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x003322, 0.9);
    btnBg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 6);
    btnBg.lineStyle(2, 0x00ff88, 0.8);
    btnBg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 6);
    this.startButtonContainer.add(btnBg);

    const btnGlow = this.add.graphics();
    btnGlow.fillStyle(0x00ff88, 0.12);
    btnGlow.fillRoundedRect(-btnW / 2 - 4, -btnH / 2 - 4, btnW + 8, btnH + 8, 8);
    btnGlow.setAlpha(0);
    this.startButtonContainer.add(btnGlow);

    const btnText = this.add.text(0, 0, 'START SHIFT >>', {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#00ff88'
    }).setOrigin(0.5);
    this.startButtonContainer.add(btnText);

    const btnZone = this.add.zone(0, 0, btnW, btnH).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.startButtonContainer.add(btnZone);

    btnZone.on('pointerover', () => {
      btnGlow.setAlpha(1);
      btnText.setScale(1.05);
    });
    btnZone.on('pointerout', () => {
      btnGlow.setAlpha(0);
      btnText.setScale(1);
    });
    btnZone.on('pointerup', () => {
      this.sound.play('sfx_button_click', { volume: 0.5 });
      this._startShift();
    });

    // ---- Show first dialogue line ----
    this._showNextLine();

    // ---- Input: click or Space to advance dialogue ----
    this.input.on('pointerdown', () => {
      if (!this.showingScript) {
        this._showNextLine();
      }
    });

    this.input.keyboard.on('keydown-SPACE', () => {
      if (!this.showingScript) {
        this._showNextLine();
      }
    });
  }

  /**
   * Draw floor progress info below the header.
   */
  _drawFloorProgress(width, y) {
    const floor = FLOORS[this.levelNum];
    if (!floor) return;

    const totalVictims = floor.victims.length;
    const completedCount = floor.victims.filter(
      v => gameState.completedVictims[v.name]
    ).length;
    const remaining = getRemainingVictims(this.levelNum, gameState.completedVictims);
    const expenses = getTotalExpenses(this.levelNum);

    const progressLine = [
      `Victims: ${completedCount}/${totalVictims}`,
      `Debt: $${gameState.shortfallDebt}`,
      `Shortfalls: ${gameState.shortfallCount}/3`,
    ].join('  |  ');

    this.add.text(width / 2, y, progressLine, {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#667788'
    }).setOrigin(0.5);

    const shiftLine = [
      `Shift: 5:00`,
      `Base pay: $${floor.basePayout}/call`,
      `Expenses: $${expenses}`,
    ].join('  |  ');

    this.add.text(width / 2, y + 16, shiftLine, {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#556677'
    }).setOrigin(0.5);

    // Tonight's target count
    this.add.text(width / 2, y + 34, `Tonight: ${remaining.length} target${remaining.length !== 1 ? 's' : ''} available`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#ffcc00'
    }).setOrigin(0.5);
  }

  /**
   * Show the boss portrait image with a styled frame.
   */
  _showBossPortrait(x, y) {
    const size = 240;

    // Dark frame background
    const frame = this.add.graphics();
    frame.fillStyle(0x111122, 0.9);
    frame.fillRoundedRect(x - size / 2 - 6, y - size / 2 - 6, size + 12, size + 12, 10);
    frame.lineStyle(2, 0xff4444, 0.6);
    frame.strokeRoundedRect(x - size / 2 - 6, y - size / 2 - 6, size + 12, size + 12, 10);

    // Boss image
    const boss = this.add.image(x, y, 'boss_idle');
    const scale = size / Math.max(boss.width, boss.height);
    boss.setScale(scale);

    // Rounded mask
    const maskShape = this.make.graphics({ add: false });
    maskShape.fillStyle(0xffffff);
    maskShape.fillRoundedRect(x - size / 2, y - size / 2, size, size, 8);
    boss.setMask(maskShape.createGeometryMask());

    // Name tag
    this.add.text(x, y + size / 2 + 20, '"THE BOSS"', {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#ff4444',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
  }

  /**
   * Advance to the next dialogue line or show the script card.
   */
  _showNextLine() {
    if (this.currentLine < this.dialogueLines.length) {
      this.sound.play('sfx_page_flip', { volume: 0.3 });
      this.dialogueText.setText(this.dialogueLines[this.currentLine]);
      this.currentLine++;

      // Subtle text appear effect
      this.dialogueText.setAlpha(0);
      this.tweens.add({
        targets: this.dialogueText,
        alpha: 1,
        duration: 200
      });
    } else {
      // All dialogue done - show script card and button
      this._showScript();
    }
  }

  /**
   * Reveal the scam script card and START SHIFT button.
   */
  _showScript() {
    this.showingScript = true;
    this.continueText.setVisible(false);

    const floor = FLOORS[this.levelNum];
    const expenses = getTotalExpenses(this.levelNum);

    // Show shift info
    this.shiftInfoText.setText(
      `SHIFT: 5:00  |  BASE PAY: $${floor.basePayout}/call  |  EXPENSES: $${expenses}`
    );

    this.tweens.add({
      targets: [this.scriptContainer, this.shiftInfoText],
      alpha: 1,
      duration: 500,
      ease: 'Cubic.easeOut'
    });

    // Show button with slight delay
    this.time.delayedCall(300, () => {
      this.tweens.add({
        targets: this.startButtonContainer,
        alpha: 1,
        y: this.startButtonContainer.y,
        duration: 400,
        ease: 'Back.easeOut'
      });
    });
  }

  /**
   * Transition to the Office scene.
   */
  _startShift() {
    gameState.startShift(this.levelNum);
    this.registry.set('currentLevel', this.levelNum);
    this.scene.start('office', { level: this.levelNum });
  }
}
