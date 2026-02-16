/**
 * CallScene.js - Active Call Overlay
 *
 * Launched as an overlay scene on top of OfficeScene during calls.
 * Shows the victim card, hang-up button, call-active indicator,
 * audio waveform visualization, and tutorial tips for Level 1.
 */

import Phaser from 'phaser';
import gameState from '../state/GameState.js';
import VoiceManager from '../voice/VoiceManager.js';
import { LEVELS } from '../config/levels.js';

export class CallScene extends Phaser.Scene {
  constructor() {
    super({ key: 'call' });
  }

  init(data) {
    this.victim = data?.victim || { name: 'Unknown', age: 0, location: 'Unknown' };
    this.levelNum = data?.level || 1;
    this.tutorialShown = { start: false, suspicion: false, compliance: false };
  }

  create() {
    const { width, height } = this.scale;

    // ---- Semi-transparent overlay background ----
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.4);
    overlay.fillRect(0, 0, width, height);

    // ---- Call panel (left side) ----
    this._createCallPanel(30, 80, 300, 540);

    // ---- Victim card ----
    this._createVictimCard(380, 80, 500, 200);

    // ---- Waveform visualization ----
    this._createWaveform(380, 310, 500, 80);

    // ---- Active call indicator ----
    this._createCallIndicator(width / 2, 50);

    // ---- Hang-up button ----
    this._createHangUpButton(width / 2, height - 80);

    // ---- Scam script toggle tab (bottom-left, doesn't cover meters) ----
    this._createScriptPanel(width, height);

    // ---- Tutorial popups (Level 1 only) ----
    if (this.levelNum === 1) {
      this._showTutorial('start');
      this._bindTutorialEvents();
    }

    // ---- Listen for call_end to close this overlay ----
    gameState.on('call_end', this._onCallEnd, this);
  }

  // =========================================================================
  //  CALL PANEL
  // =========================================================================

  _createCallPanel(x, y, w, h) {
    const g = this.add.graphics();

    // Panel background
    g.fillStyle(0x0a0e14, 0.95);
    g.fillRoundedRect(x, y, w, h, 8);
    g.lineStyle(1, 0x00ccff, 0.4);
    g.strokeRoundedRect(x, y, w, h, 8);

    // Panel header
    g.fillStyle(0x00ccff, 0.1);
    g.fillRoundedRect(x, y, w, 35, { tl: 8, tr: 8, bl: 0, br: 0 });

    this.add.text(x + w / 2, y + 17, 'CALL CONTROL', {
      fontFamily: '"Courier New", monospace',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#00ccff'
    }).setOrigin(0.5);

    // Call info items
    const items = [
      { label: 'STATUS', value: 'CONNECTED', color: '#00ff88' },
      { label: 'TARGET', value: this.victim.name, color: '#ccddee' },
      { label: 'LOCATION', value: this.victim.location, color: '#ccddee' },
      { label: 'AGE', value: `${this.victim.age}`, color: '#ccddee' },
      { label: 'LINE', value: `SECURE #${Phaser.Math.Between(1000, 9999)}`, color: '#ffcc00' },
    ];

    items.forEach((item, i) => {
      const iy = y + 55 + i * 45;
      this.add.text(x + 15, iy, item.label, {
        fontFamily: '"Courier New", monospace',
        fontSize: '10px',
        color: '#556677'
      });
      this.add.text(x + 15, iy + 14, item.value, {
        fontFamily: '"Courier New", monospace',
        fontSize: '13px',
        color: item.color,
        wordWrap: { width: w - 30 }
      });
    });

    // Signal strength bars
    const sigX = x + 15;
    const sigY = y + h - 60;
    this.add.text(sigX, sigY - 15, 'SIGNAL', {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      color: '#556677'
    });

    const sigBars = this.add.graphics();
    for (let i = 0; i < 5; i++) {
      const barH = 6 + i * 5;
      sigBars.fillStyle(i < 4 ? 0x00ff88 : 0x00ff88, i < 4 ? 0.8 : 0.3);
      sigBars.fillRoundedRect(sigX + i * 12, sigY + 25 - barH, 8, barH, 1);
    }

    // Encryption indicator
    this.add.text(sigX, sigY + 30, '> ENCRYPTED', {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      color: '#00ff88',
      alpha: 0.5
    });

    // Call duration display in panel
    this.panelTimerText = this.add.text(x + w / 2, y + h - 20, '00:00', {
      fontFamily: '"Courier New", monospace',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#00ccff'
    }).setOrigin(0.5);

    // Update panel timer
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (gameState.callActive) {
          const elapsed = gameState.getCallElapsedSec();
          const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
          const secs = (elapsed % 60).toString().padStart(2, '0');
          this.panelTimerText.setText(`${mins}:${secs}`);
        }
      }
    });
  }

  // =========================================================================
  //  SCAM SCRIPT PANEL
  // =========================================================================

  _createScriptPanel(sceneW, sceneH) {
    const level = LEVELS[this.levelNum];
    if (!level || !level.briefing || !level.briefing.scriptNotes) return;

    const panelW = 280;
    const panelH = 350;
    const tabW = 30;
    const panelX = 0;       // relative inside container
    const panelY = 0;

    // Container positioned off-screen right (only tab visible)
    this.scriptContainer = this.add.container(sceneW - tabW, sceneH - panelH - 60);
    this.scriptOpen = false;

    // ---- Toggle tab (always visible) ----
    const tab = this.add.graphics();
    tab.fillStyle(0x1a1a2e, 0.95);
    tab.fillRoundedRect(-tabW, 0, tabW, 80, { tl: 6, tr: 0, bl: 6, br: 0 });
    tab.lineStyle(1, 0xffcc00, 0.5);
    tab.strokeRoundedRect(-tabW, 0, tabW, 80, { tl: 6, tr: 0, bl: 6, br: 0 });
    this.scriptContainer.add(tab);

    // Tab text (vertical)
    const tabLabel = this.add.text(-tabW / 2, 40, 'S\nC\nR\nI\nP\nT', {
      fontFamily: '"Courier New", monospace',
      fontSize: '9px',
      fontStyle: 'bold',
      color: '#ffcc00',
      align: 'center',
      lineSpacing: -2
    }).setOrigin(0.5);
    this.scriptContainer.add(tabLabel);

    // Tab hit zone
    const tabZone = this.add.zone(-tabW / 2, 40, tabW, 80)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    this.scriptContainer.add(tabZone);

    // ---- Panel content ----
    const panelGfx = this.add.graphics();
    panelGfx.fillStyle(0x0a0e14, 0.95);
    panelGfx.fillRoundedRect(panelX, panelY, panelW, panelH, 8);
    panelGfx.lineStyle(1, 0xffcc00, 0.4);
    panelGfx.strokeRoundedRect(panelX, panelY, panelW, panelH, 8);

    // Header
    panelGfx.fillStyle(0xffcc00, 0.08);
    panelGfx.fillRoundedRect(panelX, panelY, panelW, 30, { tl: 8, tr: 8, bl: 0, br: 0 });
    this.scriptContainer.add(panelGfx);

    this.scriptContainer.add(this.add.text(panelX + panelW / 2, panelY + 15, 'SCAM SCRIPT', {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#ffcc00'
    }).setOrigin(0.5));

    // Scam type
    this.scriptContainer.add(this.add.text(panelX + 10, panelY + 38, level.name.toUpperCase(), {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#ff8844'
    }));

    // Script steps
    const notes = level.briefing.scriptNotes;
    let stepY = panelY + 58;

    notes.forEach((note, i) => {
      this.scriptContainer.add(this.add.text(panelX + 8, stepY, `${i + 1}.`, {
        fontFamily: '"Courier New", monospace',
        fontSize: '10px',
        fontStyle: 'bold',
        color: '#ffcc00',
        alpha: 0.7
      }));

      const stepText = this.add.text(panelX + 24, stepY, note, {
        fontFamily: '"Courier New", monospace',
        fontSize: '10px',
        color: '#ccddee',
        wordWrap: { width: panelW - 40 },
        lineSpacing: 2
      });
      this.scriptContainer.add(stepText);

      stepY += stepText.height + 10;
    });

    // Toggle behavior
    tabZone.on('pointerdown', () => {
      this.scriptOpen = !this.scriptOpen;
      this.tweens.add({
        targets: this.scriptContainer,
        x: this.scriptOpen ? sceneW - tabW - panelW : sceneW - tabW,
        duration: 300,
        ease: 'Back.easeOut'
      });
    });
  }

  // =========================================================================
  //  VICTIM CARD
  // =========================================================================

  _createVictimCard(x, y, w, h) {
    const g = this.add.graphics();

    // Card background
    g.fillStyle(0x111122, 0.95);
    g.fillRoundedRect(x, y, w, h, 8);
    g.lineStyle(1, 0xffcc00, 0.4);
    g.strokeRoundedRect(x, y, w, h, 8);

    // Header
    g.fillStyle(0xffcc00, 0.08);
    g.fillRoundedRect(x, y, w, 30, { tl: 8, tr: 8, bl: 0, br: 0 });

    this.add.text(x + w / 2, y + 15, 'VICTIM PROFILE', {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#ffcc00'
    }).setOrigin(0.5);

    // Portrait area
    const portraitX = x + 70;
    const portraitY = y + 115;
    this._showVictimPortrait(portraitX, portraitY);

    // Victim details
    const detX = x + 160;
    const detY = y + 50;

    this.add.text(detX, detY, this.victim.name, {
      fontFamily: '"Courier New", monospace',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffffff'
    });

    this.add.text(detX, detY + 25, `Age: ${this.victim.age}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      color: '#aabbcc'
    });

    this.add.text(detX, detY + 45, `Location: ${this.victim.location}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      color: '#aabbcc'
    });

    // Emotion display
    this.victimEmotionText = this.add.text(detX, detY + 75, 'Mood: CALM', {
      fontFamily: '"Courier New", monospace',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#88aacc'
    });

    // Emotion emoji/indicator
    this.emotionIndicator = this.add.text(detX + 160, detY + 75, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '13px',
      color: '#88aacc'
    });

    // Listen for emotion changes
    gameState.on('emotion_change', this._onEmotionChange, this);

    // Suspicion warning
    this.suspicionWarning = this.add.text(x + w / 2, y + h - 15, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#ff2244'
    }).setOrigin(0.5).setAlpha(0);

    gameState.on('suspicion_change', this._onSuspicionWarning, this);
  }

  _showVictimPortrait(x, y) {
    const key = this.victim.portraitKey;
    if (key && this.textures.exists(key)) {
      const portrait = this.add.image(x, y, key);
      // Scale to fit ~96px circle area (50% larger than original 64px)
      const maxSize = 96;
      const scale = maxSize / Math.max(portrait.width, portrait.height);
      portrait.setScale(scale);

      // Circular mask (not added to display list — used only as mask shape)
      const maskShape = this.make.graphics({ add: false });
      maskShape.fillStyle(0xffffff);
      maskShape.fillCircle(x, y, 48);
      portrait.setMask(maskShape.createGeometryMask());
    } else {
      // Fallback: simple silhouette if image not loaded
      const g = this.add.graphics();
      g.fillStyle(0x334455, 0.8);
      g.fillCircle(x, y, 48);
      g.fillStyle(0x556677, 0.6);
      g.fillCircle(x, y - 12, 21);
      g.fillEllipse(x, y + 30, 54, 30);
    }
  }

  _onEmotionChange({ current }) {
    const emotionLabels = {
      calm: 'CALM',
      nervous: 'NERVOUS',
      angry: 'ANGRY',
      scared: 'SCARED',
      trusting: 'TRUSTING',
      confused: 'CONFUSED',
      crying: 'CRYING',
    };
    const emotionColors = {
      calm: '#88aacc',
      nervous: '#ffcc00',
      angry: '#ff4444',
      scared: '#ff8800',
      trusting: '#00ff88',
      confused: '#cc88ff',
      crying: '#4488ff',
    };
    const emotionSymbols = {
      calm: '[  _  ]',
      nervous: '[ o.o ]',
      angry: '[ >:( ]',
      scared: '[ D: ]',
      trusting: '[ :) ]',
      confused: '[ ??? ]',
      crying: '[ T_T ]',
    };

    this.victimEmotionText.setText(`Mood: ${emotionLabels[current] || current.toUpperCase()}`);
    this.victimEmotionText.setColor(emotionColors[current] || '#cccccc');
    this.emotionIndicator.setText(emotionSymbols[current] || '');
    this.emotionIndicator.setColor(emotionColors[current] || '#cccccc');
  }

  _onSuspicionWarning({ current }) {
    if (current >= 75) {
      this.suspicionWarning.setText('!! HIGH SUSPICION - DANGER !!');
      this.suspicionWarning.setAlpha(1);
      this.tweens.add({
        targets: this.suspicionWarning,
        alpha: { from: 1, to: 0.3 },
        duration: 400,
        yoyo: true,
        repeat: 3
      });
    } else if (current >= 50) {
      this.suspicionWarning.setText('SUSPICION RISING...');
      this.suspicionWarning.setAlpha(0.7);
    } else {
      this.suspicionWarning.setAlpha(0);
    }
  }

  // =========================================================================
  //  WAVEFORM VISUALIZATION
  // =========================================================================

  _createWaveform(x, y, w, h) {
    const container = this.add.container(x, y);

    // Background
    const bg = this.add.graphics();
    bg.fillStyle(0x0a0e14, 0.95);
    bg.fillRoundedRect(0, 0, w, h, 6);
    bg.lineStyle(1, 0x00ff88, 0.3);
    bg.strokeRoundedRect(0, 0, w, h, 6);
    container.add(bg);

    // Label
    const label = this.add.text(10, 5, 'AUDIO WAVEFORM', {
      fontFamily: '"Courier New", monospace',
      fontSize: '9px',
      color: '#00ff88',
      alpha: 0.5
    });
    container.add(label);

    // Waveform bars
    this.waveformBars = [];
    const barCount = 50;
    const barWidth = (w - 20) / barCount;
    const waveGfx = this.add.graphics();
    container.add(waveGfx);

    // Center line
    const centerY = h / 2;
    waveGfx.lineStyle(1, 0x00ff88, 0.1);
    waveGfx.lineBetween(10, centerY, w - 10, centerY);

    // Animate waveform bars
    this.waveformGraphics = waveGfx;
    this.waveformConfig = { x: 10, centerY, barWidth, barCount, w, h };

    this.time.addEvent({
      delay: 80,
      loop: true,
      callback: () => {
        if (!gameState.callActive) return;
        this._drawWaveformFrame();
      }
    });
  }

  _drawWaveformFrame() {
    const { x, centerY, barWidth, barCount, w, h } = this.waveformConfig;
    const g = this.waveformGraphics;

    g.clear();

    // Center line
    g.lineStyle(1, 0x00ff88, 0.1);
    g.lineBetween(x, centerY, w - x, centerY);

    // Draw animated bars
    for (let i = 0; i < barCount; i++) {
      const barH = Phaser.Math.Between(2, (h / 2) - 10);
      const bx = x + i * barWidth;

      g.fillStyle(0x00ff88, 0.6);
      g.fillRect(bx, centerY - barH / 2, barWidth - 1, barH);

      // Brighter highlight on taller bars
      if (barH > h / 4) {
        g.fillStyle(0xaaffcc, 0.3);
        g.fillRect(bx, centerY - barH / 2, barWidth - 1, 2);
      }
    }
  }

  // =========================================================================
  //  CALL INDICATOR
  // =========================================================================

  _createCallIndicator(x, y) {
    const container = this.add.container(x, y);

    // Background
    const bg = this.add.graphics();
    bg.fillStyle(0x0a0e14, 0.9);
    bg.fillRoundedRect(-100, -15, 200, 30, 6);
    bg.lineStyle(1, 0x00ff88, 0.4);
    bg.strokeRoundedRect(-100, -15, 200, 30, 6);
    container.add(bg);

    // Pulsing green dot
    const dot = this.add.graphics();
    dot.fillStyle(0x00ff88, 0.9);
    dot.fillCircle(-75, 0, 5);
    container.add(dot);

    // Pulsing ring
    const ring = this.add.graphics();
    ring.lineStyle(2, 0x00ff88, 0.5);
    ring.strokeCircle(-75, 0, 5);
    container.add(ring);

    this.tweens.add({
      targets: ring,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 1000,
      repeat: -1
    });

    // Text
    const text = this.add.text(-55, 0, 'CALL ACTIVE', {
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#00ff88'
    }).setOrigin(0, 0.5);
    container.add(text);

    // REC indicator
    const rec = this.add.text(70, 0, 'REC', {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#ff2244'
    }).setOrigin(0.5);
    container.add(rec);

    this.tweens.add({
      targets: rec,
      alpha: { from: 1, to: 0.2 },
      duration: 800,
      yoyo: true,
      repeat: -1
    });
  }

  // =========================================================================
  //  HANG-UP BUTTON
  // =========================================================================

  _createHangUpButton(x, y) {
    const container = this.add.container(x, y);

    // Outer glow circle
    const glow = this.add.graphics();
    glow.fillStyle(0xff2244, 0.1);
    glow.fillCircle(0, 0, 42);
    glow.setAlpha(0);
    container.add(glow);

    // Main button circle
    const btn = this.add.graphics();
    btn.fillStyle(0x330011, 0.95);
    btn.fillCircle(0, 0, 35);
    btn.lineStyle(3, 0xff2244, 0.8);
    btn.strokeCircle(0, 0, 35);
    container.add(btn);

    // Phone icon (rotated handset made with lines)
    const icon = this.add.graphics();
    icon.lineStyle(4, 0xff2244, 0.9);
    // Handset shape: curved line
    icon.beginPath();
    icon.arc(0, 0, 14, Math.PI + 0.3, -0.3, false);
    icon.strokePath();
    // Ear/mouth pieces
    icon.fillStyle(0xff2244, 0.9);
    icon.fillRoundedRect(-18, -6, 10, 12, 3);
    icon.fillRoundedRect(8, -6, 10, 12, 3);
    icon.setAngle(135);
    container.add(icon);

    // Label
    const label = this.add.text(0, 50, 'HANG UP', {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#ff2244'
    }).setOrigin(0.5);
    container.add(label);

    // Hit area
    const zone = this.add.zone(0, 0, 70, 70)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    container.add(zone);

    zone.on('pointerover', () => glow.setAlpha(1));
    zone.on('pointerout', () => glow.setAlpha(0));
    zone.on('pointerdown', () => {
      btn.setScale(0.9);
    });
    zone.on('pointerup', () => {
      btn.setScale(1);
      this._hangUp();
    });
  }

  _hangUp() {
    // End the call via both VoiceManager and GameState
    this._tryEndVoice();
    gameState.endCall('player_hangup');
  }

  _tryEndVoice() {
    try {
      VoiceManager.getInstance().endCall();
    } catch (e) {
      // Silent fail
    }
  }

  // =========================================================================
  //  TUTORIAL POPUPS (Level 1)
  // =========================================================================

  _showTutorial(type) {
    if (this.tutorialShown[type]) return;
    this.tutorialShown[type] = true;

    const { width, height } = this.scale;
    const messages = {
      start: {
        title: 'TIP: Getting Started',
        text: 'Build rapport first -- be friendly and\nprofessional. The victim needs to trust you.',
        color: 0x00ccff,
      },
      suspicion: {
        title: 'WARNING: Suspicion Rising!',
        text: 'They\'re getting suspicious! Try changing\nthe subject or being more reassuring.',
        color: 0xff8800,
      },
      compliance: {
        title: 'TIP: Making Progress!',
        text: 'They\'re warming up! Guide them toward\nthe payment action now.',
        color: 0x00ff88,
      },
    };

    const msg = messages[type];
    if (!msg) return;

    const popupX = width - 320;
    const popupY = height - 220;
    const pw = 280;
    const ph = 120;

    const container = this.add.container(popupX, popupY);
    container.setDepth(200);
    container.setAlpha(0);

    // Background
    const bg = this.add.graphics();
    bg.fillStyle(0x0a0e14, 0.95);
    bg.fillRoundedRect(0, 0, pw, ph, 8);
    bg.lineStyle(2, msg.color, 0.7);
    bg.strokeRoundedRect(0, 0, pw, ph, 8);
    // Top accent
    bg.fillStyle(msg.color, 0.1);
    bg.fillRoundedRect(0, 0, pw, 28, { tl: 8, tr: 8, bl: 0, br: 0 });
    container.add(bg);

    // Title
    const title = this.add.text(pw / 2, 14, msg.title, {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      fontStyle: 'bold',
      color: `#${msg.color.toString(16).padStart(6, '0')}`
    }).setOrigin(0.5);
    container.add(title);

    // Text
    const text = this.add.text(15, 38, msg.text, {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#aabbcc',
      lineSpacing: 4
    });
    container.add(text);

    // Dismiss text
    const dismiss = this.add.text(pw / 2, ph - 12, '[ click to dismiss ]', {
      fontFamily: '"Courier New", monospace',
      fontSize: '9px',
      color: '#556677'
    }).setOrigin(0.5);
    container.add(dismiss);

    // Dismiss zone
    const dismissZone = this.add.zone(pw / 2, ph / 2, pw, ph).setOrigin(0.5).setInteractive();
    container.add(dismissZone);
    dismissZone.on('pointerup', () => {
      this.tweens.add({
        targets: container,
        alpha: 0,
        y: container.y + 20,
        duration: 300,
        onComplete: () => container.destroy()
      });
    });

    // Slide in
    container.setY(popupY + 30);
    this.tweens.add({
      targets: container,
      alpha: 1,
      y: popupY,
      duration: 400,
      ease: 'Back.easeOut'
    });

    // Auto-dismiss after 8 seconds
    this.time.delayedCall(8000, () => {
      if (container && container.active) {
        this.tweens.add({
          targets: container,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            if (container && container.active) container.destroy();
          }
        });
      }
    });
  }

  _bindTutorialEvents() {
    this._onSuspicionTutorial = ({ current }) => {
      if (current >= 40 && this.levelNum === 1) {
        this._showTutorial('suspicion');
      }
    };
    this._onComplianceTutorial = ({ current }) => {
      if (current >= 50 && this.levelNum === 1) {
        this._showTutorial('compliance');
      }
    };
    gameState.on('suspicion_change', this._onSuspicionTutorial, this);
    gameState.on('compliance_change', this._onComplianceTutorial, this);
  }

  // =========================================================================
  //  CALL END
  // =========================================================================

  _onCallEnd() {
    // Clean up listeners and close this overlay
    gameState.off('call_end', this._onCallEnd, this);
    gameState.off('emotion_change', this._onEmotionChange, this);
    gameState.off('suspicion_change', this._onSuspicionWarning, this);
    if (this._onSuspicionTutorial) {
      gameState.off('suspicion_change', this._onSuspicionTutorial, this);
    }
    if (this._onComplianceTutorial) {
      gameState.off('compliance_change', this._onComplianceTutorial, this);
    }

    // Fade out
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.time.delayedCall(350, () => {
      this.scene.stop('call');
    });
  }

  shutdown() {
    gameState.off('call_end', this._onCallEnd, this);
    gameState.off('emotion_change', this._onEmotionChange, this);
    gameState.off('suspicion_change', this._onSuspicionWarning, this);
    if (this._onSuspicionTutorial) {
      gameState.off('suspicion_change', this._onSuspicionTutorial, this);
    }
    if (this._onComplianceTutorial) {
      gameState.off('compliance_change', this._onComplianceTutorial, this);
    }
  }
}
