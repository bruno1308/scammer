/**
 * NotebookScene.js - Player Notebook Overlay
 *
 * Simple note-taking app accessible from the office computer.
 * Players jot down intel and observations per victim.
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

    // Semi-transparent backdrop
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
      .setInteractive().setDepth(99);

    // Notebook dimensions
    const nbW = 500;
    const nbH = 520;
    const nbX = (width - nbW) / 2;
    const nbY = (height - nbH) / 2;

    // Notebook background (yellow legal pad style)
    const g = this.add.graphics().setDepth(100);
    g.fillStyle(0xfffde7);
    g.fillRoundedRect(nbX, nbY, nbW, nbH, 8);
    g.lineStyle(2, 0xccbb66);
    g.strokeRoundedRect(nbX, nbY, nbW, nbH, 8);

    // Red margin line
    g.lineStyle(1, 0xdd8888);
    g.lineBetween(nbX + 60, nbY + 50, nbX + 60, nbY + nbH - 10);

    // Ruled lines
    g.lineStyle(0.5, 0xccccbb);
    for (let y = nbY + 74; y < nbY + nbH - 20; y += 24) {
      g.lineBetween(nbX + 10, y, nbX + nbW - 10, y);
    }

    // Header
    this.add.text(nbX + nbW / 2, nbY + 16, `📓 ${this.victimName}`, {
      fontFamily: '"Courier New", monospace', fontSize: '16px',
      fontStyle: 'bold', color: '#4a4a3a'
    }).setOrigin(0.5, 0).setDepth(101);

    // Close button (red circle, top-right)
    const closeBtn = this.add.circle(nbX + nbW - 16, nbY + 16, 8, 0xff5555)
      .setInteractive({ useHandCursor: true }).setDepth(102);
    closeBtn.on('pointerdown', () => this._close());

    // DOM textarea for editable text input
    const textareaHTML = `<textarea id="notebook-textarea" style="
      width: ${nbW - 80}px;
      height: ${nbH - 80}px;
      background: transparent;
      border: none;
      outline: none;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      color: #3a3a2a;
      line-height: 24px;
      padding: 0;
      resize: none;
      overflow-y: auto;
    " placeholder="Type your notes here...">${this._escapeHtml(gameState.getVictimNote(this.victimName))}</textarea>`;

    this.textareaDom = this.add.dom(nbX + 70, nbY + 54).createFromHTML(textareaHTML).setDepth(101);

    // Save on every keystroke
    const textarea = document.getElementById('notebook-textarea');
    if (textarea) {
      textarea.addEventListener('input', () => {
        gameState.setVictimNote(this.victimName, textarea.value);
      });
      textarea.focus();
    }

    // Fade in
    this.cameras.main.setAlpha(0);
    this.tweens.add({ targets: this.cameras.main, alpha: 1, duration: 150 });

    if (!gameState.hasTutorialSeen('notebook_intro')) {
      gameState.markTutorialSeen('notebook_intro');
      const tipText = this.add.text(nbX + nbW / 2, nbY + nbH - 24,
        "\u{1F4A1} Jot down useful details here. Reference your notes during calls.",
        { fontFamily: '"Courier New", monospace', fontSize: '11px', color: '#44bbff' }
      ).setOrigin(0.5).setDepth(103);
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
    this.cameras.main.fadeOut(150, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => { this.scene.stop(); });
  }
}
