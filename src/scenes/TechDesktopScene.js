/**
 * TechDesktopScene.js - Fake Desktop for Tech Support Scam (Level 3)
 *
 * Draws a fake Windows-style desktop overlay used during Level 3 calls.
 * Provides methods to show/hide fake windows (Event Viewer, Command Prompt,
 * Antivirus Scanner, Payment Form, Browser) that the AI can trigger.
 */

import Phaser from 'phaser';
import gameState from '../state/GameState.js';

export class TechDesktopScene extends Phaser.Scene {
  constructor() {
    super({ key: 'tech-desktop' });
  }

  create() {
    const { width, height } = this.scale;

    // ---- Desktop wallpaper ----
    const wallpaper = this.add.graphics();
    wallpaper.fillStyle(0x1a6b7a, 1);
    wallpaper.fillRect(0, 0, width, height);

    // Gradient effect on wallpaper
    wallpaper.fillStyle(0x0d4a56, 0.5);
    wallpaper.fillRect(0, height / 2, width, height / 2);

    // Subtle pattern
    wallpaper.lineStyle(1, 0x1d7a8a, 0.15);
    for (let i = 0; i < width; i += 60) {
      wallpaper.lineBetween(i, 0, i, height - 40);
    }
    for (let i = 0; i < height - 40; i += 60) {
      wallpaper.lineBetween(0, i, width, i);
    }

    // ---- Desktop icons ----
    this._createDesktopIcons();

    // ---- Taskbar ----
    this._createTaskbar(width, height);

    // ---- Window containers (all hidden initially) ----
    this.windows = {};
    this._createEventViewerWindow();
    this._createCommandPromptWindow();
    this._createAntivirusWindow();
    this._createPaymentWindow();
    this._createBrowserWindow();

    // ---- Listen for tech desktop action events ----
    gameState.on('game_event', this._onGameEvent, this);
  }

  // =========================================================================
  //  DESKTOP ICONS
  // =========================================================================

  _createDesktopIcons() {
    const icons = [
      { x: 50, y: 40, label: 'My Computer', icon: this._drawComputerIcon.bind(this) },
      { x: 50, y: 130, label: 'Recycle Bin', icon: this._drawRecycleIcon.bind(this) },
      { x: 50, y: 220, label: 'Documents', icon: this._drawFolderIcon.bind(this) },
      { x: 50, y: 310, label: 'Internet\nExplorer', icon: this._drawBrowserIcon.bind(this) },
      { x: 50, y: 400, label: 'Command\nPrompt', icon: this._drawCmdIcon.bind(this) },
    ];

    icons.forEach(({ x, y, label, icon }) => {
      const g = this.add.graphics();
      icon(g, x, y);

      this.add.text(x, y + 35, label, {
        fontFamily: 'Tahoma, sans-serif',
        fontSize: '11px',
        color: '#ffffff',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 2,
        lineSpacing: 1
      }).setOrigin(0.5, 0);
    });
  }

  _drawComputerIcon(g, x, y) {
    // Monitor
    g.fillStyle(0x4488cc);
    g.fillRoundedRect(x - 18, y - 15, 36, 26, 3);
    g.fillStyle(0x88ccff);
    g.fillRect(x - 14, y - 11, 28, 18);
    // Stand
    g.fillStyle(0x666666);
    g.fillRect(x - 5, y + 11, 10, 5);
    g.fillRect(x - 12, y + 15, 24, 3);
  }

  _drawRecycleIcon(g, x, y) {
    g.fillStyle(0x888888);
    g.fillRoundedRect(x - 12, y - 10, 24, 30, 3);
    g.fillStyle(0xaaaaaa);
    g.fillRect(x - 14, y - 14, 28, 6);
    // Lines
    g.lineStyle(1, 0x666666);
    for (let i = 0; i < 3; i++) {
      g.lineBetween(x - 6, y + i * 8, x + 6, y + i * 8);
    }
  }

  _drawFolderIcon(g, x, y) {
    g.fillStyle(0xddaa44);
    g.fillRoundedRect(x - 16, y - 8, 32, 24, 3);
    g.fillStyle(0xeecc66);
    g.fillRoundedRect(x - 14, y - 14, 16, 8, 2);
  }

  _drawBrowserIcon(g, x, y) {
    g.fillStyle(0x2277cc);
    g.fillCircle(x, y, 16);
    g.lineStyle(2, 0x44aaff);
    g.strokeCircle(x, y, 16);
    g.lineStyle(1, 0x44aaff);
    g.lineBetween(x - 16, y, x + 16, y);
    g.strokeEllipse(x, y, 12, 32);
  }

  _drawCmdIcon(g, x, y) {
    g.fillStyle(0x111111);
    g.fillRoundedRect(x - 16, y - 12, 32, 24, 2);
    g.lineStyle(1, 0xcccccc);
    g.strokeRoundedRect(x - 16, y - 12, 32, 24, 2);
    // > prompt
    g.fillStyle(0xcccccc);
    g.fillTriangle(x - 10, y - 4, x - 10, y + 4, x - 2, y);
  }

  // =========================================================================
  //  TASKBAR
  // =========================================================================

  _createTaskbar(width, height) {
    const barH = 36;
    const barY = height - barH;

    const g = this.add.graphics();
    // Taskbar background
    g.fillStyle(0x1a1a33, 0.95);
    g.fillRect(0, barY, width, barH);
    g.lineStyle(1, 0x333366, 0.5);
    g.lineBetween(0, barY, width, barY);

    // Start button
    g.fillStyle(0x003388);
    g.fillRoundedRect(4, barY + 4, 70, barH - 8, 3);
    g.lineStyle(1, 0x4488cc, 0.5);
    g.strokeRoundedRect(4, barY + 4, 70, barH - 8, 3);

    this.add.text(39, barY + barH / 2, 'Start', {
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Windows logo (simple squares)
    const logoG = this.add.graphics();
    logoG.fillStyle(0xff0000);
    logoG.fillRect(10, barY + 10, 6, 6);
    logoG.fillStyle(0x00ff00);
    logoG.fillRect(18, barY + 10, 6, 6);
    logoG.fillStyle(0x0000ff);
    logoG.fillRect(10, barY + 18, 6, 6);
    logoG.fillStyle(0xffff00);
    logoG.fillRect(18, barY + 18, 6, 6);

    // System tray (right side)
    // Clock
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    this.add.text(width - 55, barY + barH / 2, timeStr, {
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '11px',
      color: '#aabbcc'
    }).setOrigin(0.5);

    // Tray icons
    const trayG = this.add.graphics();
    // Volume
    trayG.fillStyle(0x88aacc);
    trayG.fillTriangle(width - 100, barY + 14, width - 100, barY + 24, width - 90, barY + 19);
    // Network
    trayG.fillStyle(0x88aacc);
    for (let i = 0; i < 4; i++) {
      trayG.fillRect(width - 130 + i * 4, barY + 24 - i * 4, 3, i * 4 + 2);
    }

    // Notification area text
    this.add.text(width - 160, barY + barH / 2, '^', {
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '10px',
      color: '#88aacc'
    }).setOrigin(0.5);
  }

  // =========================================================================
  //  WINDOW FACTORY
  // =========================================================================

  /**
   * Create a draggable window container with title bar.
   */
  _createWindow(key, x, y, w, h, title, titleBarColor = 0x003388) {
    const container = this.add.container(x, y);
    container.setDepth(10);
    container.setAlpha(0);
    container.setVisible(false);

    // Shadow
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillRect(4, 4, w, h);
    container.add(shadow);

    // Window body
    const body = this.add.graphics();
    body.fillStyle(0xf0f0f0);
    body.fillRect(0, 0, w, h);
    body.lineStyle(1, 0x888888);
    body.strokeRect(0, 0, w, h);
    container.add(body);

    // Title bar
    const titleBar = this.add.graphics();
    titleBar.fillStyle(titleBarColor);
    titleBar.fillRect(0, 0, w, 28);
    container.add(titleBar);

    // Title text
    const titleText = this.add.text(8, 5, title, {
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#ffffff'
    });
    container.add(titleText);

    // Window control buttons (decorative)
    const btnSize = 18;
    const controls = this.add.graphics();
    // Minimize
    controls.fillStyle(0xdddddd);
    controls.fillRect(w - btnSize * 3 - 6, 4, btnSize, btnSize);
    controls.lineStyle(1, 0x888888);
    controls.strokeRect(w - btnSize * 3 - 6, 4, btnSize, btnSize);
    controls.lineBetween(w - btnSize * 3 - 2, 16, w - btnSize * 2 - 10, 16);
    // Maximize
    controls.fillStyle(0xdddddd);
    controls.fillRect(w - btnSize * 2 - 4, 4, btnSize, btnSize);
    controls.lineStyle(1, 0x888888);
    controls.strokeRect(w - btnSize * 2 - 4, 4, btnSize, btnSize);
    controls.strokeRect(w - btnSize * 2, 8, btnSize - 8, btnSize - 8);
    // Close
    controls.fillStyle(0xcc3333);
    controls.fillRect(w - btnSize - 2, 4, btnSize, btnSize);
    controls.lineStyle(2, 0xffffff);
    controls.lineBetween(w - btnSize + 2, 8, w - 6, 18);
    controls.lineBetween(w - 6, 8, w - btnSize + 2, 18);
    container.add(controls);

    // Content area reference point
    container.contentY = 30;
    container.contentArea = { x: 2, y: 30, w: w - 4, h: h - 32 };

    this.windows[key] = container;
    return container;
  }

  /**
   * Show a window with slide-in animation.
   */
  _showWindow(key) {
    const win = this.windows[key];
    if (!win) return;

    win.setVisible(true);
    win.setY(win.y + 50);
    win.setAlpha(0);

    this.tweens.add({
      targets: win,
      y: win.y - 50,
      alpha: 1,
      duration: 400,
      ease: 'Back.easeOut'
    });

    // Bring to front
    win.setDepth(20 + Object.keys(this.windows).indexOf(key));
  }

  // =========================================================================
  //  EVENT VIEWER
  // =========================================================================

  _createEventViewerWindow() {
    const win = this._createWindow('eventViewer', 150, 40, 550, 350, 'Event Viewer', 0x003388);
    const ca = win.contentArea;

    // Dark content area
    const contentBg = this.add.graphics();
    contentBg.fillStyle(0xf8f8f8);
    contentBg.fillRect(ca.x, ca.y, ca.w, ca.h);
    win.add(contentBg);

    // Column headers
    const headerBg = this.add.graphics();
    headerBg.fillStyle(0xe0e0e0);
    headerBg.fillRect(ca.x, ca.y, ca.w, 20);
    headerBg.lineStyle(1, 0xcccccc);
    headerBg.lineBetween(ca.x, ca.y + 20, ca.x + ca.w, ca.y + 20);
    win.add(headerBg);

    const headers = ['Level', 'Date/Time', 'Source', 'Event ID'];
    const colWidths = [60, 140, 180, 100];
    let colX = ca.x + 5;
    headers.forEach((h, i) => {
      const ht = this.add.text(colX, ca.y + 3, h, {
        fontFamily: 'Tahoma, sans-serif',
        fontSize: '10px',
        fontStyle: 'bold',
        color: '#333333'
      });
      win.add(ht);
      colX += colWidths[i];
    });

    // Error entries container (will be populated)
    this.eventViewerEntries = [];
    this.eventViewerContainer = this.add.container(0, 0);
    win.add(this.eventViewerContainer);
  }

  _addEventViewerEntries(count = 8) {
    const ca = this.windows.eventViewer.contentArea;
    const errorTypes = [
      { level: 'Error', source: 'Application Error', color: '#cc0000' },
      { level: 'Error', source: 'Service Control Manager', color: '#cc0000' },
      { level: 'Warning', source: 'Disk', color: '#cc8800' },
      { level: 'Error', source: 'Windows Defender', color: '#cc0000' },
      { level: 'Critical', source: 'Kernel-Power', color: '#ff0000' },
      { level: 'Error', source: 'DCOM', color: '#cc0000' },
      { level: 'Warning', source: 'Security-Kerberos', color: '#cc8800' },
      { level: 'Critical', source: 'EventLog', color: '#ff0000' },
    ];

    const startY = ca.y + 22 + this.eventViewerEntries.length * 18;

    for (let i = 0; i < count; i++) {
      const entry = Phaser.Utils.Array.GetRandom(errorTypes);
      const entryY = startY + i * 18;

      // Icon
      const icon = this.add.graphics();
      icon.fillStyle(entry.level === 'Warning' ? 0xffaa00 : 0xff0000);
      icon.fillCircle(ca.x + 12, entryY + 9, 5);
      if (entry.level !== 'Warning') {
        icon.fillStyle(0xffffff);
        icon.fillRect(ca.x + 11, entryY + 5, 2, 5);
        icon.fillRect(ca.x + 11, entryY + 12, 2, 2);
      } else {
        icon.fillStyle(0x000000);
        icon.fillRect(ca.x + 11, entryY + 5, 2, 5);
      }
      this.eventViewerContainer.add(icon);

      const entryText = this.add.text(ca.x + 25, entryY + 1,
        `${entry.level.padEnd(10)} ${new Date().toLocaleString().padEnd(22)} ${entry.source.padEnd(25)} ${Phaser.Math.Between(1000, 9999)}`,
        {
          fontFamily: '"Courier New", monospace',
          fontSize: '10px',
          color: entry.color
        });
      this.eventViewerContainer.add(entryText);

      this.eventViewerEntries.push(entryText);
    }
  }

  // =========================================================================
  //  COMMAND PROMPT
  // =========================================================================

  _createCommandPromptWindow() {
    const win = this._createWindow('cmdPrompt', 200, 100, 520, 300, 'C:\\Windows\\system32\\cmd.exe', 0x111111);
    const ca = win.contentArea;

    // Black background
    const bg = this.add.graphics();
    bg.fillStyle(0x0c0c0c);
    bg.fillRect(ca.x, ca.y, ca.w, ca.h);
    win.add(bg);

    // Initial text
    this.cmdTextContent = [];
    this.cmdContainer = this.add.container(ca.x + 5, ca.y + 5);
    win.add(this.cmdContainer);

    this._addCmdLine('Microsoft Windows [Version 10.0.19045.3803]', '#cccccc');
    this._addCmdLine('(c) Microsoft Corporation. All rights reserved.', '#cccccc');
    this._addCmdLine('', '#cccccc');
    this._addCmdLine('C:\\Users\\victim>', '#cccccc');
  }

  _addCmdLine(text, color = '#cccccc') {
    const lineY = this.cmdTextContent.length * 14;
    const line = this.add.text(0, lineY, text, {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: color
    });
    this.cmdContainer.add(line);
    this.cmdTextContent.push(line);
  }

  // =========================================================================
  //  ANTIVIRUS SCANNER
  // =========================================================================

  _createAntivirusWindow() {
    const win = this._createWindow('antivirus', 250, 80, 480, 320, 'Windows Defender Pro - Security Scan', 0x006600);
    const ca = win.contentArea;

    // White background
    const bg = this.add.graphics();
    bg.fillStyle(0xffffff);
    bg.fillRect(ca.x, ca.y, ca.w, ca.h);
    win.add(bg);

    // Shield icon
    const shield = this.add.graphics();
    shield.fillStyle(0x006600);
    shield.fillTriangle(ca.x + 40, ca.y + 20, ca.x + 20, ca.y + 45, ca.x + 60, ca.y + 45);
    shield.fillRect(ca.x + 20, ca.y + 30, 40, 25);
    shield.fillStyle(0xffffff);
    shield.fillRect(ca.x + 37, ca.y + 32, 6, 15);
    shield.fillRect(ca.x + 31, ca.y + 38, 18, 5);
    win.add(shield);

    // Status text
    this.avStatusText = this.add.text(ca.x + 80, ca.y + 25, 'Scan Status: Ready', {
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#333333'
    });
    win.add(this.avStatusText);

    this.avSubText = this.add.text(ca.x + 80, ca.y + 48, 'Click "Scan Now" to begin full system scan', {
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '11px',
      color: '#666666'
    });
    win.add(this.avSubText);

    // Progress bar frame
    const progFrame = this.add.graphics();
    progFrame.fillStyle(0xeeeeee);
    progFrame.fillRect(ca.x + 20, ca.y + 100, ca.w - 40, 25);
    progFrame.lineStyle(1, 0xcccccc);
    progFrame.strokeRect(ca.x + 20, ca.y + 100, ca.w - 40, 25);
    win.add(progFrame);

    // Progress bar fill (hidden initially)
    this.avProgressFill = this.add.graphics();
    win.add(this.avProgressFill);
    this.avProgressConfig = { x: ca.x + 21, y: ca.y + 101, w: ca.w - 42, h: 23 };

    // Threat counter
    this.avThreatText = this.add.text(ca.x + 20, ca.y + 140, 'Threats Found: 0', {
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#333333'
    });
    win.add(this.avThreatText);

    // Threat list area
    this.avThreatList = this.add.container(ca.x + 20, ca.y + 170);
    win.add(this.avThreatList);
  }

  // =========================================================================
  //  PAYMENT FORM
  // =========================================================================

  _createPaymentWindow() {
    const win = this._createWindow('payment', 300, 120, 440, 340, 'Secure Payment - Microsoft Support', 0x003388);
    const ca = win.contentArea;

    // White background
    const bg = this.add.graphics();
    bg.fillStyle(0xffffff);
    bg.fillRect(ca.x, ca.y, ca.w, ca.h);
    win.add(bg);

    // Lock icon
    const lock = this.add.graphics();
    lock.lineStyle(3, 0x006600);
    lock.strokeCircle(ca.x + ca.w / 2, ca.y + 25, 10);
    lock.fillStyle(0x006600);
    lock.fillRoundedRect(ca.x + ca.w / 2 - 12, ca.y + 28, 24, 16, 3);
    win.add(lock);

    // Title
    win.add(this.add.text(ca.x + ca.w / 2, ca.y + 55, 'Lifetime Security Protection Plan', {
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#003388',
      align: 'center'
    }).setOrigin(0.5));

    win.add(this.add.text(ca.x + ca.w / 2, ca.y + 75, 'One-time payment for full protection', {
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '11px',
      color: '#666666',
      align: 'center'
    }).setOrigin(0.5));

    // Form fields
    const fields = [
      { label: 'Full Name:', y: ca.y + 100 },
      { label: 'Card Number:', y: ca.y + 140 },
      { label: 'Expiry (MM/YY):', y: ca.y + 180 },
      { label: 'CVV:', y: ca.y + 220 },
    ];

    fields.forEach(({ label, y: fy }) => {
      win.add(this.add.text(ca.x + 20, fy, label, {
        fontFamily: 'Tahoma, sans-serif',
        fontSize: '11px',
        color: '#333333'
      }));

      const field = this.add.graphics();
      field.fillStyle(0xffffff);
      field.fillRect(ca.x + 20, fy + 15, ca.w - 60, 22);
      field.lineStyle(1, 0xaaaaaa);
      field.strokeRect(ca.x + 20, fy + 15, ca.w - 60, 22);
      win.add(field);
    });

    // Pay button
    const payBtn = this.add.graphics();
    payBtn.fillStyle(0x006600);
    payBtn.fillRoundedRect(ca.x + ca.w / 2 - 80, ca.y + 260, 160, 36, 4);
    win.add(payBtn);

    win.add(this.add.text(ca.x + ca.w / 2, ca.y + 278, 'PAY $299.00', {
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5));

    // SSL indicator
    win.add(this.add.text(ca.x + ca.w / 2, ca.y + ca.h - 10, 'SSL Secured | 256-bit Encryption', {
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '9px',
      color: '#006600'
    }).setOrigin(0.5));
  }

  // =========================================================================
  //  BROWSER WINDOW
  // =========================================================================

  _createBrowserWindow() {
    const win = this._createWindow('browser', 120, 50, 600, 400, 'Internet Explorer - microsoft-support.com', 0x003388);
    const ca = win.contentArea;

    // Browser toolbar
    const toolbar = this.add.graphics();
    toolbar.fillStyle(0xf0f0f0);
    toolbar.fillRect(ca.x, ca.y, ca.w, 30);
    toolbar.lineStyle(1, 0xdddddd);
    toolbar.lineBetween(ca.x, ca.y + 30, ca.x + ca.w, ca.y + 30);
    win.add(toolbar);

    // Nav buttons
    const navBtns = this.add.graphics();
    navBtns.fillStyle(0xdddddd);
    navBtns.fillCircle(ca.x + 18, ca.y + 15, 10);
    navBtns.fillCircle(ca.x + 42, ca.y + 15, 10);
    // Arrows
    navBtns.fillStyle(0x666666);
    navBtns.fillTriangle(ca.x + 14, ca.y + 15, ca.x + 22, ca.y + 10, ca.x + 22, ca.y + 20);
    navBtns.fillTriangle(ca.x + 46, ca.y + 15, ca.x + 38, ca.y + 10, ca.x + 38, ca.y + 20);
    win.add(navBtns);

    // URL bar
    const urlBar = this.add.graphics();
    urlBar.fillStyle(0xffffff);
    urlBar.fillRect(ca.x + 60, ca.y + 5, ca.w - 70, 20);
    urlBar.lineStyle(1, 0xaaaaaa);
    urlBar.strokeRect(ca.x + 60, ca.y + 5, ca.w - 70, 20);
    win.add(urlBar);

    // Lock icon in URL bar
    urlBar.fillStyle(0x006600);
    urlBar.fillCircle(ca.x + 72, ca.y + 15, 4);

    this.browserUrlText = this.add.text(ca.x + 80, ca.y + 9, 'https://microsoft-support.com/security', {
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '10px',
      color: '#333333'
    });
    win.add(this.browserUrlText);

    // Content area
    const contentBg = this.add.graphics();
    contentBg.fillStyle(0xffffff);
    contentBg.fillRect(ca.x, ca.y + 31, ca.w, ca.h - 31);
    win.add(contentBg);

    // Default page content container
    this.browserContent = this.add.container(ca.x, ca.y + 35);
    win.add(this.browserContent);

    this._renderMicrosoftSupportPage();
  }

  _renderMicrosoftSupportPage() {
    // Microsoft logo header
    const header = this.add.graphics();
    header.fillStyle(0x003388);
    header.fillRect(0, 0, 596, 45);
    this.browserContent.add(header);

    this.browserContent.add(this.add.text(10, 12, 'Microsoft Security Center', {
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffffff'
    }));

    // Warning banner
    const banner = this.add.graphics();
    banner.fillStyle(0xffeeee);
    banner.fillRect(10, 55, 576, 40);
    banner.lineStyle(1, 0xff0000);
    banner.strokeRect(10, 55, 576, 40);
    this.browserContent.add(banner);

    this.browserContent.add(this.add.text(20, 62, 'WARNING: Your computer may be infected!', {
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#cc0000'
    }));

    this.browserContent.add(this.add.text(20, 80, 'Call our support team immediately: 1-800-FAKE-NUM', {
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '11px',
      color: '#cc0000'
    }));

    // Body content
    const bodyLines = [
      'Our security systems have detected suspicious activity on your computer.',
      'Multiple threats have been identified that may compromise your:',
      '  - Personal banking information',
      '  - Social security number',
      '  - Email passwords and accounts',
      '',
      'To resolve this issue, please purchase our Lifetime Security',
      'Protection Plan for a one-time fee of $299.00.',
    ];

    bodyLines.forEach((line, i) => {
      this.browserContent.add(this.add.text(20, 110 + i * 18, line, {
        fontFamily: 'Tahoma, sans-serif',
        fontSize: '11px',
        color: '#333333'
      }));
    });
  }

  _renderBankPage() {
    // Clear existing content
    this.browserContent.removeAll(true);

    this.browserUrlText.setText('https://www.bankofamerica-secure.com/login');

    // Bank header
    const header = this.add.graphics();
    header.fillStyle(0xcc0000);
    header.fillRect(0, 0, 596, 45);
    this.browserContent.add(header);

    this.browserContent.add(this.add.text(10, 12, 'Bank of America - Online Banking', {
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffffff'
    }));

    // Login form
    this.browserContent.add(this.add.text(200, 70, 'Sign In to Your Account', {
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#333333'
    }));

    const fields = ['User ID:', 'Password:'];
    fields.forEach((label, i) => {
      this.browserContent.add(this.add.text(180, 110 + i * 50, label, {
        fontFamily: 'Tahoma, sans-serif',
        fontSize: '12px',
        color: '#333333'
      }));

      const field = this.add.graphics();
      field.fillStyle(0xffffff);
      field.fillRect(180, 128 + i * 50, 240, 24);
      field.lineStyle(1, 0xaaaaaa);
      field.strokeRect(180, 128 + i * 50, 240, 24);
      this.browserContent.add(field);
    });

    // Sign in button
    const signIn = this.add.graphics();
    signIn.fillStyle(0xcc0000);
    signIn.fillRoundedRect(230, 230, 140, 32, 4);
    this.browserContent.add(signIn);

    this.browserContent.add(this.add.text(300, 246, 'Sign In', {
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5));

    // Fake security notice
    this.browserContent.add(this.add.text(190, 280, 'Secure Area - 128-bit SSL Encryption', {
      fontFamily: 'Tahoma, sans-serif',
      fontSize: '9px',
      color: '#006600'
    }));
  }

  // =========================================================================
  //  PUBLIC ACTION METHODS
  // =========================================================================

  showEventViewer() {
    this._showWindow('eventViewer');
    this._addEventViewerEntries(5);
  }

  showErrors() {
    if (!this.windows.eventViewer.visible) {
      this._showWindow('eventViewer');
    }
    this._addEventViewerEntries(8);
  }

  showCommandPrompt() {
    this._showWindow('cmdPrompt');
  }

  runTreeCommand() {
    if (!this.windows.cmdPrompt.visible) {
      this._showWindow('cmdPrompt');
    }

    this._addCmdLine('C:\\Users\\victim>tree /f', '#cccccc');

    const dirs = [
      'C:\\Users\\victim',
      '+---Desktop',
      '|   +---personal_photos',
      '|   |       vacation_2023.jpg',
      '|   |       family_reunion.jpg',
      '|   +---tax_documents',
      '|   |       2023_W2.pdf',
      '|   |       bank_statements.pdf',
      '+---Documents',
      '|   +---Financial',
      '|   |       retirement_accounts.xlsx',
      '|   |       investment_portfolio.pdf',
      '+---Downloads',
      '|       suspicious_file.exe',
      '|       unknown_installer.msi',
    ];

    dirs.forEach((dir, i) => {
      this.time.delayedCall(i * 60, () => {
        this._addCmdLine(dir, dir.includes('suspicious') || dir.includes('unknown') ? '#ff4444' : '#00cc00');
      });
    });
  }

  runNetstat() {
    if (!this.windows.cmdPrompt.visible) {
      this._showWindow('cmdPrompt');
    }

    this._addCmdLine('', '#cccccc');
    this._addCmdLine('C:\\Users\\victim>netstat -an', '#cccccc');
    this._addCmdLine('', '#cccccc');
    this._addCmdLine('Active Connections', '#ffffff');
    this._addCmdLine('  Proto  Local Address          Foreign Address        State', '#888888');

    const connections = [
      { proto: 'TCP', local: '192.168.1.105:49152', foreign: '185.243.115.84:443', state: 'ESTABLISHED', threat: true },
      { proto: 'TCP', local: '192.168.1.105:49153', foreign: '91.234.99.42:8080', state: 'ESTABLISHED', threat: true },
      { proto: 'TCP', local: '192.168.1.105:49154', foreign: '178.62.11.203:993', state: 'ESTABLISHED', threat: true },
      { proto: 'TCP', local: '192.168.1.105:49155', foreign: '45.33.32.156:80', state: 'TIME_WAIT', threat: false },
      { proto: 'TCP', local: '192.168.1.105:49156', foreign: '203.0.113.50:4444', state: 'ESTABLISHED', threat: true },
      { proto: 'UDP', local: '0.0.0.0:5353', foreign: '*:*', state: '', threat: false },
    ];

    connections.forEach((conn, i) => {
      this.time.delayedCall(i * 150, () => {
        const line = `  ${conn.proto.padEnd(6)} ${conn.local.padEnd(22)} ${conn.foreign.padEnd(22)} ${conn.state}`;
        this._addCmdLine(line, conn.threat ? '#ff4444' : '#cccccc');
      });
    });
  }

  showFakeAntivirus() {
    this._showWindow('antivirus');
  }

  runVirusScan() {
    if (!this.windows.antivirus.visible) {
      this._showWindow('antivirus');
    }

    this.avStatusText.setText('Scan Status: SCANNING...');
    this.avStatusText.setColor('#cc8800');
    this.avSubText.setText('Scanning system files...');

    // Animate progress bar
    const pc = this.avProgressConfig;
    let progress = 0;
    let threats = 0;

    const scanEvent = this.time.addEvent({
      delay: 60,
      repeat: 99,
      callback: () => {
        progress++;
        const fillW = (pc.w * progress) / 100;

        this.avProgressFill.clear();
        this.avProgressFill.fillStyle(0x006600);
        this.avProgressFill.fillRect(pc.x, pc.y, fillW, pc.h);
        // Highlight
        this.avProgressFill.fillStyle(0x00aa00, 0.5);
        this.avProgressFill.fillRect(pc.x, pc.y, fillW, 4);

        this.avSubText.setText(`Scanning: C:\\Windows\\System32\\... (${progress}%)`);

        // Randomly add threats
        if (progress % 7 === 0 || progress > 85) {
          threats += Phaser.Math.Between(1, 5);
          this.avThreatText.setText(`Threats Found: ${threats}`);
          this.avThreatText.setColor(threats > 10 ? '#ff0000' : '#cc8800');

          // Add threat to list
          const threatNames = [
            'Trojan.Win32.Agent.bx',
            'Backdoor.IRC.Bot.gen',
            'Spyware.Keylogger.fam',
            'Worm.Win32.Mydoom.m',
            'Rootkit.TDSS.variant',
            'Adware.BrowseFox.gen',
            'Ransom.WannaCry.gen',
          ];

          const threatText = this.add.text(0, (threats > 40 ? 40 : threats) * 14 - 14,
            `[!] ${Phaser.Utils.Array.GetRandom(threatNames)} - C:\\Windows\\...`, {
            fontFamily: '"Courier New", monospace',
            fontSize: '9px',
            color: '#cc0000'
          });
          this.avThreatList.add(threatText);
        }

        if (progress >= 100) {
          threats = 47;
          this.avStatusText.setText('Scan Status: COMPLETE');
          this.avStatusText.setColor('#ff0000');
          this.avThreatText.setText('Threats Found: 47 THREATS FOUND!');
          this.avThreatText.setColor('#ff0000');
          this.avSubText.setText('CRITICAL: Immediate action required!');
          this.avSubText.setColor('#ff0000');

          // Flash the threat text
          this.tweens.add({
            targets: this.avThreatText,
            alpha: { from: 1, to: 0.3 },
            duration: 400,
            yoyo: true,
            repeat: -1
          });
        }
      }
    });
  }

  showPaymentPage() {
    this._showWindow('payment');
  }

  showBrowser() {
    this._showWindow('browser');
  }

  showBankPage() {
    if (!this.windows.browser.visible) {
      this._showWindow('browser');
    }
    this._renderBankPage();
  }

  // =========================================================================
  //  EVENT HANDLING
  // =========================================================================

  _onGameEvent({ event }) {
    // Map game events to desktop actions
    const actionMap = {
      'open_event_viewer': () => this.showEventViewer(),
      'show_event_viewer': () => this.showEventViewer(),
      'show_errors': () => this.showErrors(),
      'open_command_prompt': () => this.showCommandPrompt(),
      'show_command_prompt': () => this.showCommandPrompt(),
      'run_tree_command': () => this.runTreeCommand(),
      'run_netstat': () => this.runNetstat(),
      'open_fake_antivirus': () => this.showFakeAntivirus(),
      'show_fake_antivirus': () => this.showFakeAntivirus(),
      'show_virus_scan': () => this.runVirusScan(),
      'run_virus_scan': () => this.runVirusScan(),
      'show_payment_page': () => this.showPaymentPage(),
      'open_browser': () => this.showBrowser(),
      'show_browser': () => this.showBrowser(),
      'show_bank_page': () => this.showBankPage(),
    };

    if (actionMap[event]) {
      actionMap[event]();
    }
  }

  // =========================================================================
  //  CLEANUP
  // =========================================================================

  shutdown() {
    gameState.off('game_event', this._onGameEvent, this);
  }
}
