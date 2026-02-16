/**
 * BootScene.js - Boot & Asset Generation Scene
 *
 * Generates all programmatic textures/sprites the game needs
 * (no external image files). Shows a neon-styled loading bar
 * and transitions to MenuScene when ready.
 */

import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'boot' });
  }

  preload() {
    // Load portrait images for all levels
    for (let v = 1; v <= 5; v++) {
      this.load.image(`l1_victim_${v}`, `assets/portraits/level1/victim_${v}.png`);
    }
    for (let v = 1; v <= 4; v++) {
      this.load.image(`l2_victim_${v}`, `assets/portraits/level2/victim_${v}.png`);
      this.load.image(`l3_victim_${v}`, `assets/portraits/level3/victim_${v}.png`);
      this.load.image(`l4_victim_${v}`, `assets/portraits/level4/victim_${v}.png`);
    }
    for (let v = 1; v <= 3; v++) {
      this.load.image(`l5_victim_${v}`, `assets/portraits/level5/victim_${v}.png`);
    }

    // Boss
    this.load.image('boss_idle', 'assets/characters/boss_idle.png');
    this.load.image('boss_angry', 'assets/characters/boss_angry.png');
  }

  create() {
    const { width, height } = this.scale;

    // ---- Dark background ----
    this.cameras.main.setBackgroundColor(0x0a0a1a);

    // ---- "LOADING..." text ----
    this.loadingText = this.add.text(width / 2, height / 2 - 60, 'INITIALIZING SYSTEM...', {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      color: '#00ff88',
      stroke: '#003322',
      strokeThickness: 2
    }).setOrigin(0.5);

    // ---- Loading bar frame ----
    const barWidth = 400;
    const barHeight = 24;
    const barX = (width - barWidth) / 2;
    const barY = height / 2 - 12;

    this.barFrame = this.add.graphics();
    // Outer glow
    this.barFrame.lineStyle(2, 0x00ff88, 0.4);
    this.barFrame.strokeRoundedRect(barX - 3, barY - 3, barWidth + 6, barHeight + 6, 4);
    // Inner border
    this.barFrame.lineStyle(1, 0x00ff88, 0.8);
    this.barFrame.strokeRoundedRect(barX, barY, barWidth, barHeight, 2);
    // Dark fill
    this.barFrame.fillStyle(0x0a0a1a, 0.9);
    this.barFrame.fillRoundedRect(barX + 1, barY + 1, barWidth - 2, barHeight - 2, 2);

    // ---- Loading bar fill ----
    this.barFill = this.add.graphics();

    // ---- Status text ----
    this.statusText = this.add.text(width / 2, barY + barHeight + 20, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#338866',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5, 0);

    // ---- Simulate loading + generate textures ----
    const tasks = [
      { label: '> Generating phone texture...', fn: () => this._generatePhoneTexture() },
      { label: '> Generating monitor texture...', fn: () => this._generateMonitorTexture() },
      { label: '> Generating desk background...', fn: () => this._generateDeskTexture() },
      { label: '> Generating button textures...', fn: () => this._generateButtonTextures() },
      { label: '> Initializing game state...', fn: () => {} },
      { label: '> Connecting to call center...', fn: () => {} },
      { label: '> System ready.', fn: () => {} },
    ];

    let taskIndex = 0;
    const progressPerTask = barWidth - 4;

    this.time.addEvent({
      delay: 250,
      repeat: tasks.length - 1,
      callback: () => {
        const task = tasks[taskIndex];
        this.statusText.setText(task.label);
        task.fn();
        taskIndex++;

        // Update bar fill
        const progress = taskIndex / tasks.length;
        this.barFill.clear();
        this.barFill.fillStyle(0x00ff88, 0.9);
        this.barFill.fillRoundedRect(barX + 2, barY + 2, progressPerTask * progress, barHeight - 4, 2);
        // Highlight
        this.barFill.fillStyle(0xaaffcc, 0.3);
        this.barFill.fillRect(barX + 2, barY + 2, progressPerTask * progress, 3);

        if (taskIndex >= tasks.length) {
          this.time.delayedCall(500, () => {
            this.loadingText.setText('SYSTEM ONLINE');
            this.time.delayedCall(400, () => {
              this.scene.start('menu');
            });
          });
        }
      }
    });
  }

  /**
   * Generate a simple phone texture (rectangle with handset shape).
   */
  _generatePhoneTexture() {
    const g = this.make.graphics({ add: false });
    // Phone body
    g.fillStyle(0x222233);
    g.fillRoundedRect(0, 0, 80, 100, 6);
    // Screen
    g.fillStyle(0x112211);
    g.fillRoundedRect(10, 10, 60, 35, 3);
    // Buttons
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        g.fillStyle(0x444466);
        g.fillRoundedRect(15 + col * 20, 55 + row * 14, 14, 10, 2);
      }
    }
    // Neon accent line
    g.lineStyle(1, 0x00ff88, 0.6);
    g.strokeRoundedRect(0, 0, 80, 100, 6);
    g.generateTexture('phone', 80, 100);
    g.destroy();
  }

  /**
   * Generate a monitor texture (rectangle with screen area).
   */
  _generateMonitorTexture() {
    const g = this.make.graphics({ add: false });
    // Monitor bezel
    g.fillStyle(0x1a1a2e);
    g.fillRoundedRect(0, 0, 400, 280, 8);
    // Screen area
    g.fillStyle(0x0d1117);
    g.fillRoundedRect(12, 12, 376, 236, 4);
    // Stand
    g.fillStyle(0x222233);
    g.fillRect(170, 280, 60, 20);
    g.fillRect(140, 296, 120, 8);
    // Neon border
    g.lineStyle(2, 0x00ccff, 0.3);
    g.strokeRoundedRect(10, 10, 380, 240, 4);
    g.generateTexture('monitor', 400, 310);
    g.destroy();
  }

  /**
   * Generate desk background texture.
   */
  _generateDeskTexture() {
    const g = this.make.graphics({ add: false });
    // Desk surface
    g.fillStyle(0x1c1c28);
    g.fillRect(0, 0, 1280, 300);
    // Wood grain lines
    for (let i = 0; i < 20; i++) {
      g.lineStyle(1, 0x252535, 0.4);
      g.lineBetween(0, i * 15, 1280, i * 15 + 3);
    }
    // Edge highlight
    g.lineStyle(2, 0x333344, 0.6);
    g.lineBetween(0, 0, 1280, 0);
    g.generateTexture('desk_bg', 1280, 300);
    g.destroy();
  }

  /**
   * Generate generic button textures used across scenes.
   */
  _generateButtonTextures() {
    // Green button
    const gGreen = this.make.graphics({ add: false });
    gGreen.fillStyle(0x003322, 0.9);
    gGreen.fillRoundedRect(0, 0, 200, 48, 6);
    gGreen.lineStyle(2, 0x00ff88, 0.8);
    gGreen.strokeRoundedRect(0, 0, 200, 48, 6);
    gGreen.generateTexture('btn_green', 200, 48);
    gGreen.destroy();

    // Red button
    const gRed = this.make.graphics({ add: false });
    gRed.fillStyle(0x330011, 0.9);
    gRed.fillRoundedRect(0, 0, 200, 48, 6);
    gRed.lineStyle(2, 0xff2244, 0.8);
    gRed.strokeRoundedRect(0, 0, 200, 48, 6);
    gRed.generateTexture('btn_red', 200, 48);
    gRed.destroy();
  }
}
