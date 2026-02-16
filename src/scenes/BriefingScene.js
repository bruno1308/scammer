/**
 * BriefingScene.js - Pre-Shift Briefing
 *
 * Shows the boss character delivering instructions before each shift.
 * Displays level-specific dialogue one line at a time, then reveals
 * the scam script card. Player clicks "START SHIFT" to begin.
 */

import Phaser from 'phaser';
import gameState, { LEVEL_CONFIG } from '../state/GameState.js';

/** Boss dialogue per level. */
const BOSS_DIALOGUE = {
  1: [
    '"Welcome to your first day, rookie."',
    '"The job is simple: call people, follow the script, get paid."',
    '"Today you\'re running the Gift Card Refund scam."',
    '"Tell them there was a billing error. They need to buy gift cards to fix it."',
    '"Don\'t overthink it. Just stay calm and stick to the script."',
    '"Hit your quota or you\'re done. Got it?"',
  ],
  2: [
    '"Not bad yesterday, kid. You survived."',
    '"Today we\'re stepping it up -- IRS Tax Scam."',
    '"Tell them they owe back taxes and there\'s a warrant for their arrest."',
    '"Fear is your friend. Use urgency. They need to pay NOW."',
    '"These marks are tougher. Watch your suspicion meter."',
    '"Quota\'s higher today. Don\'t disappoint me."',
  ],
  3: [
    '"Alright, time for Tech Support."',
    '"You\'ll call them pretending to be from Microsoft."',
    '"Tell them their computer is infected, show them fake errors."',
    '"You\'ve got a remote desktop tool -- use it to scare them."',
    '"Then sell them the \'protection plan\' for $299."',
    '"This one takes finesse. Build trust first, then strike."',
  ],
  4: [
    '"This next one\'s... different."',
    '"Romance scam. You\'re pretending to be someone they can trust."',
    '"Build the relationship. Make them feel special."',
    '"Then hit them with the emergency -- you need money urgently."',
    '"Big payouts on this one, but it takes patience."',
    '"Don\'t catch feelings, rookie. It\'s just business."',
  ],
  5: [
    '"Listen carefully. This is the big leagues."',
    '"CEO Fraud. You\'re impersonating a company executive."',
    '"These are corporate targets -- accountants, finance people."',
    '"They\'re smart and suspicious. One wrong word and it\'s over."',
    '"But the payouts? Life-changing money."',
    '"This is your last shift. Make it count."',
  ],
};

/** Scam script notes per level. */
const SCAM_SCRIPTS = {
  1: {
    title: 'GIFT CARD REFUND',
    lines: [
      'You are: Customer Service Rep at "National Billing Center"',
      'Claim: Billing error resulted in overcharge of $499.99',
      'Method: Victim must purchase gift cards to "process refund"',
      'Target: 1x $200 gift card, read code over phone',
      'If questioned: "This is standard procedure, ma\'am/sir"',
    ],
  },
  2: {
    title: 'IRS TAX ENFORCEMENT',
    lines: [
      'You are: Agent at the "IRS Tax Enforcement Division"',
      'Claim: Outstanding tax debt with arrest warrant issued',
      'Method: Immediate payment required to avoid arrest',
      'Target: Wire transfer or prepaid debit card payment',
      'If questioned: "Your local police have been notified"',
    ],
  },
  3: {
    title: 'TECH SUPPORT RESCUE',
    lines: [
      'You are: Technician at "Microsoft Security Center"',
      'Claim: Their computer is sending virus alerts to your system',
      'Method: Remote access to show fake errors, sell protection plan',
      'Target: $299 "Lifetime Security Protection Plan"',
      'Tools: Event Viewer, Command Prompt, Fake Antivirus Scanner',
    ],
  },
  4: {
    title: 'ROMANCE CONNECTION',
    lines: [
      'You are: A lonely professional working overseas',
      'Claim: Genuine romantic interest, building relationship',
      'Method: Build trust over time, then urgent financial need',
      'Target: Emergency funds -- medical, legal, or travel',
      'Remember: Patience is key. Don\'t rush the ask.',
    ],
  },
  5: {
    title: 'CEO WIRE AUTHORIZATION',
    lines: [
      'You are: CEO/CFO of the victim\'s company',
      'Claim: Urgent confidential wire transfer needed',
      'Method: Email spoofing + phone call for authorization',
      'Target: Wire transfer to offshore account',
      'Critical: Use corporate jargon. Sound authoritative.',
    ],
  },
};

export class BriefingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'briefing' });
  }

  init(data) {
    this.levelNum = data?.level || this.registry.get('currentLevel') || 1;
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(0x0a0a1a);

    const levelConfig = LEVEL_CONFIG[this.levelNum];
    const dialogue = BOSS_DIALOGUE[this.levelNum] || BOSS_DIALOGUE[1];
    const script = SCAM_SCRIPTS[this.levelNum] || SCAM_SCRIPTS[1];

    this.dialogueLines = dialogue;
    this.currentLine = 0;
    this.showingScript = false;

    // ---- Header ----
    this.add.text(width / 2, 25, `SHIFT ${this.levelNum}: ${levelConfig?.name?.toUpperCase() || 'UNKNOWN'}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#00ff88',
      stroke: '#003322',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Decorative line
    const lineGfx = this.add.graphics();
    lineGfx.lineStyle(1, 0x00ff88, 0.3);
    lineGfx.lineBetween(100, 50, width - 100, 50);

    // ---- Draw boss character ----
    this._drawBoss(200, 340);

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

    // ---- Quota info ----
    this.quotaText = this.add.text(width / 2, height - 110, '', {
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
   * Draw a simple boss figure using Graphics.
   */
  _drawBoss(x, y) {
    const g = this.add.graphics();

    // Shadow
    g.fillStyle(0x000000, 0.3);
    g.fillEllipse(x, y + 115, 100, 20);

    // Body (suit)
    g.fillStyle(0x222244);
    g.fillRoundedRect(x - 35, y - 10, 70, 100, 8);

    // Suit lapels
    g.lineStyle(2, 0x333366, 0.8);
    g.lineBetween(x - 10, y - 10, x, y + 30);
    g.lineBetween(x + 10, y - 10, x, y + 30);

    // Tie
    g.fillStyle(0xff2244);
    g.fillTriangle(x - 6, y - 5, x + 6, y - 5, x, y + 40);

    // Neck
    g.fillStyle(0xddaa88);
    g.fillRect(x - 8, y - 30, 16, 25);

    // Head
    g.fillStyle(0xddaa88);
    g.fillCircle(x, y - 48, 28);

    // Hair (slicked back)
    g.fillStyle(0x222222);
    g.fillEllipse(x, y - 65, 32, 16);
    g.fillRect(x - 28, y - 65, 56, 12);

    // Eyes
    g.fillStyle(0x111111);
    g.fillCircle(x - 10, y - 52, 3);
    g.fillCircle(x + 10, y - 52, 3);

    // Eyebrows (angry)
    g.lineStyle(2, 0x222222);
    g.lineBetween(x - 16, y - 62, x - 6, y - 58);
    g.lineBetween(x + 16, y - 62, x + 6, y - 58);

    // Mouth (smirk)
    g.lineStyle(2, 0x884444);
    g.beginPath();
    g.arc(x, y - 38, 8, 0.1, Math.PI - 0.1, false);
    g.strokePath();

    // Cigar
    g.fillStyle(0xbb8844);
    g.fillRect(x + 8, y - 42, 22, 5);
    g.fillStyle(0xff6600, 0.8);
    g.fillCircle(x + 30, y - 40, 3);

    // Smoke puff
    const smoke = this.add.text(x + 35, y - 55, '~', {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      color: '#666677'
    });
    this.tweens.add({
      targets: smoke,
      y: y - 90,
      alpha: 0,
      duration: 3000,
      repeat: -1,
      delay: 500
    });

    // Arms
    g.lineStyle(6, 0x222244);
    g.lineBetween(x - 35, y + 5, x - 55, y + 60);
    g.lineBetween(x + 35, y + 5, x + 55, y + 60);

    // Hands
    g.fillStyle(0xddaa88);
    g.fillCircle(x - 55, y + 62, 8);
    g.fillCircle(x + 55, y + 62, 8);

    // Legs
    g.fillStyle(0x1a1a33);
    g.fillRect(x - 25, y + 85, 20, 30);
    g.fillRect(x + 5, y + 85, 20, 30);

    // Shoes
    g.fillStyle(0x111111);
    g.fillRoundedRect(x - 28, y + 110, 26, 10, 4);
    g.fillRoundedRect(x + 2, y + 110, 26, 10, 4);

    // Name tag
    this.add.text(x, y + 135, '"THE BOSS"', {
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

    const levelConfig = LEVEL_CONFIG[this.levelNum];

    // Show quota info
    this.quotaText.setText(
      `QUOTA: $${levelConfig.quota}  |  CALLS: ${levelConfig.callsTotal}  |  BASE PAY: $${levelConfig.basePayout}/call`
    );

    this.tweens.add({
      targets: [this.scriptContainer, this.quotaText],
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
    gameState.startLevel(this.levelNum);
    this.registry.set('currentLevel', this.levelNum);
    this.scene.start('office', { level: this.levelNum });
  }
}
