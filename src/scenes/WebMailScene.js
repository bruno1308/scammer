/**
 * WebMailScene.js - WebMail Email Client Overlay
 *
 * Fake email client accessible from the office computer (Floor 2+).
 * Password-protected per victim. Contains order confirmations, bank alerts,
 * and official notifications — some with embedded intel.
 */

import Phaser from 'phaser';
import gameState from '../state/GameState.js';
import { getWebMailData } from '../config/webmail/index.js';
import { FLOORS } from '../config/levels.js';

export default class WebMailScene extends Phaser.Scene {
  constructor() {
    super({ key: 'webmail' });
  }

  init(data) {
    this.victim = data?.victim || null;
    this.levelNum = data?.level || 2;
  }

  create() {
    const { width, height } = this.scale;

    // Backdrop
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
      .setInteractive().setDepth(99);

    // Browser window dimensions
    this.browserW = width - 120;
    this.browserH = height - 60;
    this.browserX = 60;
    this.browserY = 30;

    this._drawBrowserChrome();

    if (!this.victim) {
      this._showError('No victim selected');
      return;
    }

    this.mailData = getWebMailData(this.levelNum, this.victim.name);
    if (!this.mailData) {
      this._showError('No email data available');
      return;
    }

    // Check if already logged in this shift
    if (gameState.isEmailLoggedIn(this.victim.name)) {
      this._showInbox();
    } else {
      this._showLoginScreen();
    }
  }

  _drawBrowserChrome() {
    const g = this.add.graphics().setDepth(100);
    // Window background
    g.fillStyle(0x1a1a2e);
    g.fillRoundedRect(this.browserX, this.browserY, this.browserW, this.browserH, 6);
    // Title bar
    g.fillStyle(0x2a2a3e);
    g.fillRect(this.browserX, this.browserY, this.browserW, 30);

    // Close button
    const closeBtn = this.add.circle(this.browserX + this.browserW - 16, this.browserY + 15, 7, 0xff5555)
      .setInteractive({ useHandCursor: true }).setDepth(102);
    closeBtn.on('pointerdown', () => this._close());

    // Title
    this.add.text(this.browserX + 14, this.browserY + 8, '📧 WebMail', {
      fontFamily: '"Courier New", monospace', fontSize: '13px',
      fontStyle: 'bold', color: '#aabbcc'
    }).setDepth(101);
  }

  _showLoginScreen() {
    const cx = this.browserX + this.browserW / 2;
    const cy = this.browserY + this.browserH / 2;

    // Login panel background
    const panelW = 360;
    const panelH = 300;
    const panelX = cx - panelW / 2;
    const panelY = cy - panelH / 2;

    this.loginContainer = this.add.container(0, 0).setDepth(101);

    const bg = this.add.graphics();
    bg.fillStyle(0x222244);
    bg.fillRoundedRect(panelX, panelY, panelW, panelH, 8);
    bg.lineStyle(1, 0x4466aa);
    bg.strokeRoundedRect(panelX, panelY, panelW, panelH, 8);
    this.loginContainer.add(bg);

    // Mail icon + title
    const title = this.add.text(cx, panelY + 30, '📧 Sign In', {
      fontFamily: '"Courier New", monospace', fontSize: '18px',
      fontStyle: 'bold', color: '#ccddff'
    }).setOrigin(0.5);
    this.loginContainer.add(title);

    // Email display (read-only)
    const emailLabel = this.add.text(panelX + 20, panelY + 70, 'Email:', {
      fontFamily: '"Courier New", monospace', fontSize: '12px', color: '#8899aa'
    });
    this.loginContainer.add(emailLabel);

    const emailText = this.add.text(panelX + 20, panelY + 88, this.victim.emailAddress || 'unknown@mail.com', {
      fontFamily: '"Courier New", monospace', fontSize: '14px', color: '#ffffff'
    });
    this.loginContainer.add(emailText);

    // Password input (DOM element)
    const pwHTML = `<input id="webmail-password" type="password" style="
      width: ${panelW - 44}px;
      height: 32px;
      background: #1a1a3e;
      border: 1px solid #4466aa;
      border-radius: 4px;
      color: #ffffff;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      padding: 0 8px;
      outline: none;
    " placeholder="Enter password..." />`;

    const pwLabel = this.add.text(panelX + 20, panelY + 120, 'Password:', {
      fontFamily: '"Courier New", monospace', fontSize: '12px', color: '#8899aa'
    });
    this.loginContainer.add(pwLabel);

    this.passwordDom = this.add.dom(panelX + panelW / 2, panelY + 152)
      .createFromHTML(pwHTML).setDepth(102);

    // Login button
    const loginBtn = this.add.rectangle(cx, panelY + 200, 120, 36, 0x336699)
      .setInteractive({ useHandCursor: true }).setDepth(102);
    const loginText = this.add.text(cx, panelY + 200, 'Sign In', {
      fontFamily: '"Courier New", monospace', fontSize: '14px',
      fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(0.5).setDepth(103);
    this.loginContainer.add(loginBtn);
    this.loginContainer.add(loginText);

    // Failed attempts counter
    this.failedAttempts = 0;
    this.hintText = null;

    loginBtn.on('pointerdown', () => this._attemptLogin());

    // Allow Enter key to submit
    const pwInput = document.getElementById('webmail-password');
    if (pwInput) {
      pwInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this._attemptLogin();
      });
      pwInput.focus();
    }
  }

  _attemptLogin() {
    const pwInput = document.getElementById('webmail-password');
    if (!pwInput) return;

    const entered = pwInput.value.trim().toLowerCase();
    const correct = (this.victim.emailPassword || '').toLowerCase();

    if (entered === correct) {
      gameState.setEmailLoggedIn(this.victim.name);
      if (this.sound.get('sfx_notification_ding')) {
        this.sound.play('sfx_notification_ding', { volume: 0.3 });
      }
      // Remove login UI
      if (this.loginContainer) this.loginContainer.destroy();
      if (this.passwordDom) this.passwordDom.destroy();
      this._showInbox();
    } else {
      this.failedAttempts++;
      pwInput.value = '';
      pwInput.style.borderColor = '#ff4444';
      this.time.delayedCall(500, () => {
        if (pwInput) pwInput.style.borderColor = '#4466aa';
      });

      // Show hint after 2 failed attempts
      if (this.failedAttempts >= 2 && !this.hintText) {
        const hint = this.victim.emailHint || 'No hint available';
        const cx = this.browserX + this.browserW / 2;
        const cy = this.browserY + this.browserH / 2;
        this.hintText = this.add.text(cx, cy + 100, `💡 Password hint: "${hint}"`, {
          fontFamily: '"Courier New", monospace', fontSize: '12px',
          color: '#ffcc44', wordWrap: { width: 300 }
        }).setOrigin(0.5).setDepth(103);
      }
    }
  }

  _showInbox() {
    const contentX = this.browserX + 16;
    const contentY = this.browserY + 44;
    const contentW = this.browserW - 32;

    // Inbox header
    this.add.text(contentX, contentY, `Inbox — ${this.victim.emailAddress || 'unknown'}`, {
      fontFamily: '"Courier New", monospace', fontSize: '14px',
      fontStyle: 'bold', color: '#aabbcc'
    }).setDepth(101);

    // Email list (scrollable container)
    this.emailContainer = this.add.container(0, 0).setDepth(101);
    let yPos = contentY + 30;

    this.mailData.emails.forEach((email, idx) => {
      const emailY = yPos;
      const rowH = 54;

      // Row background
      const rowBg = this.add.rectangle(contentX + contentW / 2, emailY + rowH / 2, contentW, rowH - 2,
        email.isRead ? 0x1a1a2e : 0x1a2a3e).setDepth(101);
      rowBg.setInteractive({ useHandCursor: true });
      this.emailContainer.add(rowBg);

      // Unread indicator
      if (!email.isRead) {
        const dot = this.add.circle(contentX + 8, emailY + rowH / 2, 4, 0x4488ff).setDepth(102);
        this.emailContainer.add(dot);
      }

      // From
      const fromText = this.add.text(contentX + 20, emailY + 6, email.from, {
        fontFamily: '"Courier New", monospace', fontSize: '11px',
        fontStyle: email.isRead ? 'normal' : 'bold', color: '#ccddee'
      }).setDepth(102);
      this.emailContainer.add(fromText);

      // Subject
      const subjectText = this.add.text(contentX + 20, emailY + 22, email.subject, {
        fontFamily: '"Courier New", monospace', fontSize: '12px',
        fontStyle: email.isRead ? 'normal' : 'bold', color: '#ffffff'
      }).setDepth(102);
      this.emailContainer.add(subjectText);

      // Date
      const dateText = this.add.text(contentX + contentW - 10, emailY + 6, email.date, {
        fontFamily: '"Courier New", monospace', fontSize: '10px', color: '#667788'
      }).setOrigin(1, 0).setDepth(102);
      this.emailContainer.add(dateText);

      rowBg.on('pointerdown', () => this._showEmail(email));
      rowBg.on('pointerover', () => rowBg.setFillStyle(0x2a3a4e));
      rowBg.on('pointerout', () => rowBg.setFillStyle(email.isRead ? 0x1a1a2e : 0x1a2a3e));

      yPos += rowH;
    });

    // Scroll mask
    const maskShape = this.make.graphics();
    maskShape.fillRect(this.browserX, this.browserY + 40, this.browserW, this.browserH - 40);
    this.emailContainer.setMask(new Phaser.Display.Masks.GeometryMask(this, maskShape));

    // Scroll support — remove previous listener to avoid stacking
    if (this._wheelListener) this.input.off('wheel', this._wheelListener);
    const viewportH = this.browserH - 40;
    this._wheelListener = (pointer, gameObjects, deltaX, deltaY) => {
      if (pointer.x >= this.browserX && pointer.x <= this.browserX + this.browserW) {
        const minY = Math.min(-(yPos - this.browserY - viewportH), 0);
        this.emailContainer.y = Phaser.Math.Clamp(
          this.emailContainer.y - deltaY * 0.5,
          minY, 0
        );
      }
    };
    this.input.on('wheel', this._wheelListener);
  }

  _showEmail(email) {
    // Mark intel as seen
    if (email.intel && email.intel.key) {
      gameState.markIntelSeen(email.intel.key);
    }

    // Clear inbox view and show email body
    if (this.emailContainer) this.emailContainer.destroy();
    if (this.emailDetailContainer) this.emailDetailContainer.destroy();

    this.emailDetailContainer = this.add.container(0, 0).setDepth(101);

    const contentX = this.browserX + 16;
    const contentY = this.browserY + 44;
    const contentW = this.browserW - 32;

    // Back button
    const backBtn = this.add.text(contentX, contentY, '← Back to Inbox', {
      fontFamily: '"Courier New", monospace', fontSize: '12px',
      color: '#4488cc'
    }).setInteractive({ useHandCursor: true }).setDepth(102);
    backBtn.on('pointerdown', () => {
      this.emailDetailContainer.destroy();
      this._showInbox();
    });
    this.emailDetailContainer.add(backBtn);

    // From
    this.emailDetailContainer.add(this.add.text(contentX, contentY + 30, `From: ${email.from}`, {
      fontFamily: '"Courier New", monospace', fontSize: '12px', color: '#aabbcc'
    }).setDepth(102));

    // Subject
    this.emailDetailContainer.add(this.add.text(contentX, contentY + 48, email.subject, {
      fontFamily: '"Courier New", monospace', fontSize: '14px',
      fontStyle: 'bold', color: '#ffffff'
    }).setDepth(102));

    // Date
    this.emailDetailContainer.add(this.add.text(contentX, contentY + 70, email.date, {
      fontFamily: '"Courier New", monospace', fontSize: '11px', color: '#667788'
    }).setDepth(102));

    // Divider
    const divG = this.add.graphics().setDepth(102);
    divG.lineStyle(1, 0x334455);
    divG.lineBetween(contentX, contentY + 88, contentX + contentW, contentY + 88);
    this.emailDetailContainer.add(divG);

    // Body (word-wrapped)
    const bodyText = this.add.text(contentX, contentY + 96, email.body, {
      fontFamily: '"Courier New", monospace', fontSize: '12px',
      color: '#ccddee', wordWrap: { width: contentW - 20 }, lineSpacing: 4
    }).setDepth(102);
    this.emailDetailContainer.add(bodyText);

    // Scroll mask for long emails
    const maskShape = this.make.graphics();
    maskShape.fillRect(this.browserX, this.browserY + 40, this.browserW, this.browserH - 40);
    this.emailDetailContainer.setMask(new Phaser.Display.Masks.GeometryMask(this, maskShape));

    // Scroll support — reuse tracked listener
    if (this._wheelListener) this.input.off('wheel', this._wheelListener);
    this._wheelListener = (pointer, gameObjects, deltaX, deltaY) => {
      if (pointer.x >= this.browserX && pointer.x <= this.browserX + this.browserW) {
        const minY = Math.min(-(bodyText.height - this.browserH + 200), 0);
        this.emailDetailContainer.y = Phaser.Math.Clamp(
          this.emailDetailContainer.y - deltaY * 0.5,
          minY, 0
        );
      }
    };
    this.input.on('wheel', this._wheelListener);
  }

  _showError(msg) {
    const cx = this.browserX + this.browserW / 2;
    const cy = this.browserY + this.browserH / 2;
    this.add.text(cx, cy, msg, {
      fontFamily: '"Courier New", monospace', fontSize: '14px', color: '#ff6666'
    }).setOrigin(0.5).setDepth(101);
  }

  _close() {
    this.cameras.main.fadeOut(150, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => { this.scene.stop(); });
  }

  shutdown() {
    if (this._wheelListener) {
      this.input.off('wheel', this._wheelListener);
      this._wheelListener = null;
    }
  }
}
