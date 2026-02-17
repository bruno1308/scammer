/**
 * IntroScene.js - First-play compound arrival narrative
 *
 * Cinematic text sequence shown once when the player first starts the game.
 * Establishes the trafficked-worker premise: lured overseas by a fake job ad,
 * passport taken, in debt, forced to work the phones.
 *
 * Click or press Space to advance. Skippable.
 */

import Phaser from 'phaser';
import gameState from '../state/GameState.js';
import SaveManager from '../state/SaveManager.js';

const INTRO_LINES = [
  { text: 'You answered a job ad online.', delay: 0 },
  { text: 'Customer service representative. $3,000/month. Free housing.', delay: 0 },
  { text: 'The flight was paid for. The contract looked real.', delay: 0 },
  { text: 'When you landed, they took your passport.', delay: 0 },
  { text: '"Travel and processing fees," they said. "$2,000."', delay: 0 },
  { text: '"The only way to pay it off is to work the phones."', delay: 0 },
  { text: 'This is your desk. This is your phone.', delay: 0 },
  { text: 'The clock starts now.', delay: 0 },
];

export class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'intro' });
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor(0x000000);

    // Stop any music from menu
    this.sound.stopAll();

    this.lineIndex = 0;
    this.advancing = false;

    // ---- Current text display ----
    this.introText = this.add.text(width / 2, height / 2, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '22px',
      color: '#cccccc',
      align: 'center',
      wordWrap: { width: 700 },
      lineSpacing: 8,
    }).setOrigin(0.5).setAlpha(0);

    // ---- "SKIP >>" button ----
    const skipText = this.add.text(width - 30, height - 30, 'SKIP >>', {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      color: '#555555',
    }).setOrigin(1, 1).setInteractive({ useHandCursor: true });

    skipText.on('pointerover', () => skipText.setColor('#888888'));
    skipText.on('pointerout', () => skipText.setColor('#555555'));
    skipText.on('pointerup', () => { this.sound.play('sfx_button_click', { volume: 0.4 }); this._finish(); });

    // ---- "Click or press Space" hint ----
    this.hintText = this.add.text(width / 2, height - 60, '[ click or press space to continue ]', {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#333333',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: this.hintText,
      alpha: { from: 0.3, to: 0.8 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });

    // ---- Input handlers ----
    this.input.on('pointerup', () => this._advance());
    this.input.keyboard.on('keydown-SPACE', () => this._advance());

    // Show first line
    this._showLine();
  }

  _showLine() {
    if (this.lineIndex >= INTRO_LINES.length) {
      this._finish();
      return;
    }

    const line = INTRO_LINES[this.lineIndex];

    this.introText.setText(line.text);
    this.introText.setAlpha(0);

    this.tweens.add({
      targets: this.introText,
      alpha: 1,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        this.advancing = false;
      },
    });

    // Shift color darker for early lines, then brighter
    if (this.lineIndex >= 3) {
      this.introText.setColor('#ffffff');
    } else {
      this.introText.setColor('#999999');
    }
  }

  _advance() {
    if (this.advancing) return;
    this.advancing = true;

    // Fade out current line, then show next
    this.tweens.add({
      targets: this.introText,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.lineIndex++;
        this._showLine();
      },
    });
  }

  _finish() {
    gameState.introSeen = true;
    SaveManager.save(gameState.getSerializableState());

    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('briefing', { floor: 1 });
    });
  }
}
