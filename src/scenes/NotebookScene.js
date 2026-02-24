/**
 * NotebookScene.js - Draggable Player Notebook Overlay
 *
 * Floating note-taking pad that stays on top of other overlays.
 * Designed to be used alongside FriendBook so players can take
 * notes while researching victims.
 * Notes persist across the shift via GameState.victimNotes.
 */

import Phaser from 'phaser';
import gameState from '../state/GameState.js';

export default class NotebookScene extends Phaser.Scene {
  constructor() {
    super({ key: 'notebook' });
  }

  init(data) {
    this.victimName = data?.victimName || 'Notes';
    this.levelNum = data?.level || 1;
  }

  create() {
    const { width, height } = this.scale;

    // Notebook dimensions — compact so it fits beside FriendBook
    const nbW = 340;
    const nbH = 420;
    // Default position: right side of screen
    const startX = width - nbW - 30;
    const startY = (height - nbH) / 2;

    // Main container — everything is a child so dragging moves it all
    this.nbContainer = this.add.container(startX, startY).setDepth(200);

    // Drop shadow
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillRoundedRect(4, 4, nbW, nbH, 8);
    this.nbContainer.add(shadow);

    // Notebook background (yellow legal pad)
    const bg = this.add.graphics();
    bg.fillStyle(0xfffde7);
    bg.fillRoundedRect(0, 0, nbW, nbH, 8);
    bg.lineStyle(2, 0xccbb66);
    bg.strokeRoundedRect(0, 0, nbW, nbH, 8);
    this.nbContainer.add(bg);

    // Title bar (drag handle)
    const titleBar = this.add.rectangle(nbW / 2, 18, nbW, 36, 0xf0e6b0)
      .setInteractive({ useHandCursor: true, draggable: true });
    this.nbContainer.add(titleBar);

    // Top border on title bar
    const titleBorder = this.add.graphics();
    titleBorder.lineStyle(1, 0xccbb66);
    titleBorder.lineBetween(0, 36, nbW, 36);
    this.nbContainer.add(titleBorder);

    // Header text
    const headerText = this.add.text(nbW / 2, 18, `\u{1F4D3} ${this.victimName}`, {
      fontFamily: '"Courier New", monospace', fontSize: '14px',
      fontStyle: 'bold', color: '#4a4a3a'
    }).setOrigin(0.5);
    this.nbContainer.add(headerText);

    // Close button (red circle, top-right)
    const closeBtn = this.add.circle(nbW - 16, 18, 8, 0xff5555)
      .setInteractive({ useHandCursor: true });
    closeBtn.on('pointerover', () => closeBtn.setFillStyle(0xff3333));
    closeBtn.on('pointerout', () => closeBtn.setFillStyle(0xff5555));
    closeBtn.on('pointerdown', () => this._close());
    this.nbContainer.add(closeBtn);

    // Red margin line
    const lines = this.add.graphics();
    lines.lineStyle(1, 0xdd8888);
    lines.lineBetween(50, 44, 50, nbH - 10);
    // Ruled lines
    lines.lineStyle(0.5, 0xccccbb);
    for (let y = 60; y < nbH - 20; y += 24) {
      lines.lineBetween(10, y, nbW - 10, y);
    }
    this.nbContainer.add(lines);

    // DOM textarea for editable text input
    const taW = nbW - 70;
    const taH = nbH - 70;
    const textareaHTML = `<textarea id="notebook-textarea" style="
      width: ${taW}px;
      height: ${taH}px;
      background: transparent;
      border: none;
      outline: none;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: #3a3a2a;
      line-height: 24px;
      padding: 0;
      resize: none;
      overflow-y: auto;
    " placeholder="Type your notes here...">${this._escapeHtml(gameState.getVictimNote(this.victimName))}</textarea>`;

    this.textareaDom = this.add.dom(58, 44).createFromHTML(textareaHTML).setOrigin(0, 0);
    this.nbContainer.add(this.textareaDom);

    // Save on every keystroke
    const textarea = document.getElementById('notebook-textarea');
    if (textarea) {
      textarea.addEventListener('input', () => {
        gameState.setVictimNote(this.victimName, textarea.value);
      });
      // Stop keyboard events from propagating to Phaser when textarea is focused,
      // so typing here doesn't also feed into FriendBook search or other Phaser keyboard listeners
      textarea.addEventListener('keydown', (e) => e.stopPropagation());
      textarea.addEventListener('keyup', (e) => e.stopPropagation());
      // Don't auto-focus — prevents stealing input from other overlays (e.g. FriendBook search)
    }

    // --- Dragging ---
    let grabOffsetX = 0;
    let grabOffsetY = 0;
    this.input.setDraggable(titleBar);
    this.input.on('dragstart', (pointer) => {
      grabOffsetX = pointer.x - this.nbContainer.x;
      grabOffsetY = pointer.y - this.nbContainer.y;
    });
    this.input.on('drag', (pointer) => {
      this.nbContainer.x = Phaser.Math.Clamp(pointer.x - grabOffsetX, -nbW + 60, width - 60);
      this.nbContainer.y = Phaser.Math.Clamp(pointer.y - grabOffsetY, -10, height - 60);
    });

    // Quick fade-in on the notebook container
    this.nbContainer.setAlpha(0);
    this.tweens.add({ targets: this.nbContainer, alpha: 1, duration: 150 });

    if (!gameState.hasTutorialSeen('notebook_intro')) {
      gameState.markTutorialSeen('notebook_intro');
      const tipText = this.add.text(nbW / 2, nbH - 20,
        "\u{1F4A1} Drag the title bar to move. Use alongside FriendBook!",
        { fontFamily: '"Courier New", monospace', fontSize: '10px', color: '#44bbff' }
      ).setOrigin(0.5);
      this.nbContainer.add(tipText);
      this.time.delayedCall(5000, () => {
        this.tweens.add({ targets: tipText, alpha: 0, duration: 500, onComplete: () => tipText.destroy() });
      });
    }
  }

  _escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  _close() {
    // Save final state
    const textarea = document.getElementById('notebook-textarea');
    if (textarea) {
      gameState.setVictimNote(this.victimName, textarea.value);
    }
    this.scene.stop();
  }
}
