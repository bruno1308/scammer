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
import { FLOORS } from '../config/levels.js';
import { getFriendBookData } from '../config/friendbook/index.js';
import { ArcMeter } from '../ui/ArcMeter.js';

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

    // ---- Victim profile (left side, card with waveform + portrait + meters) ----
    this._createVictimProfile(width, height);

    // ---- Active call indicator ----
    this._createCallIndicator(width / 2, 80);

    // ---- Scam script toggle tab (bottom-left, doesn't cover meters) ----
    this._createScriptPanel(width, height);

    // ---- Intel tracker mini-panel ----
    this._createIntelPanel();

    // ---- Tutorial popups (Level 1 only) ----
    if (this.levelNum === 1) {
      this._showTutorial('start');
      this._bindTutorialEvents();
    }

    // ---- Listen for call_end to close this overlay ----
    gameState.on('call_end', this._onCallEnd, this);
  }

  // =========================================================================
  //  MONITOR CLICK ZONE (FriendBook access during call)
  // =========================================================================

  _createMonitorZone(sceneW, sceneH) {
    // Match OfficeScene monitor position: center-x, 38% height
    const mx = sceneW / 2;
    const my = sceneH * 0.38;

    // Hover outline glow (matches OfficeScene style)
    this.monitorGlow = this.add.graphics();
    this.monitorGlow.lineStyle(2, 0x00ccff, 0.8);
    this.monitorGlow.strokeRoundedRect(mx - 155, my - 120, 310, 250, 10);
    this.monitorGlow.setAlpha(0);

    // Hint text
    this.monitorHint = this.add.text(mx, my + 100, 'Click to open FriendBook', {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      color: '#00ff88'
    }).setOrigin(0.5).setAlpha(0);

    // Clickable zone over the monitor
    const zone = this.add.zone(mx, my, 300, 230).setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => {
      this.monitorGlow.setAlpha(1);
      this.monitorHint.setAlpha(1);
    });
    zone.on('pointerout', () => {
      this.monitorGlow.setAlpha(0);
      this.monitorHint.setAlpha(0);
    });
    zone.on('pointerdown', () => { this.sound.play('sfx_mouse_click', { volume: 0.4 }); this._openFriendBook(); });
  }

  _openFriendBook() {
    if (this.scene.isActive('social-network')) return;

    const friendbookData = getFriendBookData(this.levelNum, this.victim.name);
    if (!friendbookData) return;

    const targetProfileId = Object.keys(friendbookData.profiles)
      .find(id => friendbookData.profiles[id].isTarget);

    this.scene.launch('social-network', {
      friendbookData,
      targetProfileId,
      level: this.levelNum
    });
  }

  // =========================================================================
  //  SCAM SCRIPT PANEL
  // =========================================================================

  _createScriptPanel(sceneW, sceneH) {
    const floor = FLOORS[this.levelNum];
    if (!floor) return;

    // Per-victim script steps (new system) or fallback to floor-level scriptNotes
    const victimSteps = this.victim.scriptSteps;
    const genericSteps = floor.genericSteps;
    const hasProgressiveReveal = this.levelNum >= 3 && genericSteps;

    // Need either victim steps or legacy scriptNotes
    if (!victimSteps && (!floor.briefing || !floor.briefing.scriptNotes)) return;
    const steps = victimSteps || (floor.briefing && floor.briefing.scriptNotes) || [];

    const panelW = 340;
    const panelH = 420;
    const tabW = 30;
    const panelX = 0;       // relative inside container
    const panelY = 0;

    // Container positioned off-screen right (only tab visible)
    this.scriptContainer = this.add.container(sceneW - tabW, sceneH - panelH - 60);
    this.scriptOpen = false;

    // ---- Toggle tab (always visible) ----
    if (this.textures.exists('ui_script_tab')) {
      const tabImg = this.add.image(-tabW / 2, 40, 'ui_script_tab')
        .setDisplaySize(tabW + 8, 84);
      this.scriptContainer.add(tabImg);
    } else {
      const tab = this.add.graphics();
      tab.fillStyle(0x1a1a2e, 0.95);
      tab.fillRoundedRect(-tabW, 0, tabW, 80, { tl: 6, tr: 0, bl: 6, br: 0 });
      tab.lineStyle(1, 0xffcc00, 0.5);
      tab.strokeRoundedRect(-tabW, 0, tabW, 80, { tl: 6, tr: 0, bl: 6, br: 0 });
      this.scriptContainer.add(tab);
    }

    // Tab text (vertical)
    const tabLabel = this.add.text(-tabW / 2, 40, 'S\nC\nR\nI\nP\nT', {
      fontFamily: '"Courier New", monospace',
      fontSize: '9px',
      fontStyle: 'bold',
      color: '#ffcc00',
      align: 'center',
      lineSpacing: -2,
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
    this.scriptContainer.add(tabLabel);

    // Tab hit zone
    const tabZone = this.add.zone(-tabW / 2, 40, tabW, 80)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    this.scriptContainer.add(tabZone);

    // ---- Panel content (solid dark background for readability) ----
    const panelGfx = this.add.graphics();
    panelGfx.fillStyle(0x0a0e14, 0.95);
    panelGfx.fillRoundedRect(panelX, panelY, panelW, panelH, 8);
    panelGfx.lineStyle(1, 0xffcc00, 0.4);
    panelGfx.strokeRoundedRect(panelX, panelY, panelW, panelH, 8);
    panelGfx.fillStyle(0xffcc00, 0.08);
    panelGfx.fillRoundedRect(panelX, panelY, panelW, 34, { tl: 8, tr: 8, bl: 0, br: 0 });
    this.scriptContainer.add(panelGfx);

    this.scriptContainer.add(this.add.text(panelX + panelW / 2, panelY + 17, 'SCAM SCRIPT', {
      fontFamily: '"Courier New", monospace',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5));

    // Scam type / variant label
    const variantLabel = this.victim.scamVariant
      ? this.victim.scamVariant.replace(/_/g, ' ').toUpperCase()
      : floor.name.toUpperCase();
    this.scriptContainer.add(this.add.text(panelX + 12, panelY + 44, variantLabel, {
      fontFamily: '"Courier New", monospace',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#ff8844'
    }));

    // Intel counter for floors 3-5 (progressive reveal)
    if (hasProgressiveReveal) {
      const intelKeys = gameState.intelKeys || [];
      const seenCount = gameState.intelSeen ? gameState.intelSeen.size : 0;
      this._intelCounterText = this.add.text(panelX + panelW - 12, panelY + 44, `Intel: ${seenCount}/${intelKeys.length}`, {
        fontFamily: '"Courier New", monospace',
        fontSize: '11px',
        color: '#ffd54f',
        fontStyle: 'bold'
      }).setOrigin(1, 0);
      this.scriptContainer.add(this._intelCounterText);
    }

    // Script steps — progressive reveal for floors 3-5, static for floors 1-2
    this._scriptStepTexts = [];
    this._scriptStepNums = [];
    this._scriptSteps = steps;
    this._genericSteps = genericSteps;
    this._hasProgressiveReveal = hasProgressiveReveal;

    let stepY = panelY + 68;

    const displaySteps = hasProgressiveReveal ? genericSteps : steps;
    const maxSteps = Math.max(steps.length, hasProgressiveReveal ? genericSteps.length : 0);

    for (let i = 0; i < maxSteps; i++) {
      const isRevealed = !hasProgressiveReveal || this._isStepRevealed(i);
      const text = isRevealed ? (steps[i] || '') : (genericSteps[i] || '');
      const color = isRevealed ? '#ccddee' : '#667788';

      const numText = this.add.text(panelX + 10, stepY, `${i + 1}.`, {
        fontFamily: '"Courier New", monospace',
        fontSize: '14px',
        fontStyle: 'bold',
        color: isRevealed ? '#ffcc00' : '#555555',
        alpha: isRevealed ? 0.7 : 0.4
      });
      this.scriptContainer.add(numText);

      const stepText = this.add.text(panelX + 28, stepY, text, {
        fontFamily: '"Courier New", monospace',
        fontSize: '13px',
        color,
        wordWrap: { width: panelW - 46 },
        lineSpacing: 3,
        alpha: isRevealed ? 1 : 0.5
      });
      this.scriptContainer.add(stepText);

      this._scriptStepTexts.push(stepText);
      this._scriptStepNums.push(numText);

      stepY += stepText.height + 12;
    }

    // Listen for intel discovery to update progressive reveal
    if (hasProgressiveReveal) {
      gameState.on('intel_seen', this._onIntelSeenForScript, this);
    }

    // Toggle behavior
    tabZone.on('pointerdown', () => {
      this.scriptOpen = !this.scriptOpen;
      this.sound.play(this.scriptOpen ? 'sfx_drawer_open' : 'sfx_drawer_close', { volume: 0.4 });
      this.tweens.add({
        targets: this.scriptContainer,
        x: this.scriptOpen ? sceneW - tabW - panelW : sceneW - tabW,
        duration: 300,
        ease: 'Back.easeOut'
      });
    });
  }

  /**
   * Check if a script step should be revealed based on discovered intel.
   * Uses the `unlocks` arrays from intel items: each seen intel key unlocks
   * specific script step indices. A step is revealed if ANY seen intel
   * includes it in its `unlocks` array.
   */
  _isStepRevealed(stepIndex) {
    if (!gameState.intelSeen || gameState.intelSeen.size === 0) return false;
    const intelKeys = gameState.intelKeys || [];
    for (const intel of intelKeys) {
      if (gameState.intelSeen.has(intel.key) && intel.unlocks && intel.unlocks.includes(stepIndex)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Called when intel is discovered on FriendBook — update script panel.
   */
  _onIntelSeenForScript() {
    if (!this._hasProgressiveReveal || !this._scriptStepTexts) return;

    const intelKeys = gameState.intelKeys || [];
    const seenCount = gameState.intelSeen ? gameState.intelSeen.size : 0;

    // Update intel counter
    if (this._intelCounterText) {
      this._intelCounterText.setText(`Intel: ${seenCount}/${intelKeys.length}`);
    }

    // Update each step
    for (let i = 0; i < this._scriptStepTexts.length; i++) {
      const wasRevealed = this._scriptStepTexts[i].alpha === 1;
      const isRevealed = this._isStepRevealed(i);

      if (isRevealed && !wasRevealed) {
        // Reveal this step with animation
        const stepText = this._scriptStepTexts[i];
        const numText = this._scriptStepNums[i];
        const revealedContent = this._scriptSteps[i] || '';

        stepText.setText(revealedContent);
        stepText.setColor('#ccddee');
        numText.setColor('#ffcc00');

        this.tweens.add({
          targets: [stepText, numText],
          alpha: { from: 0.3, to: 1 },
          duration: 400,
          ease: 'Quad.easeOut'
        });

        // Brief highlight flash
        this.tweens.add({
          targets: stepText,
          scaleX: { from: 1.05, to: 1 },
          scaleY: { from: 1.05, to: 1 },
          duration: 300,
          ease: 'Back.easeOut'
        });
      }
    }
  }

  // =========================================================================
  //  VICTIM CARD
  // =========================================================================

  _createVictimProfile(sceneW, sceneH) {
    const cardX = 20;
    const cardY = 70;
    const cardW = 270;
    const portraitX = cardX + cardW / 2;

    // Waveform sits at the top of the card
    const waveY = cardY + 12;
    const waveH = 30;

    // Portrait below waveform
    const portraitRadius = 96;
    const portraitY = waveY + waveH + 12 + portraitRadius;

    // Text below portrait + arcs
    const textY = portraitY + portraitRadius + 28;

    // Base card height (without intel)
    const baseCardH = textY + 80 - cardY;

    // Calculate intel section height
    const intelKeys = gameState.intelKeys || [];
    const intelH = intelKeys.length > 0 ? 28 + intelKeys.length * 20 + 8 : 0;
    const cardH = baseCardH + intelH;

    // ---- Card background ----
    const card = this.add.graphics();
    card.fillStyle(0x0a0e18, 0.88);
    card.fillRoundedRect(cardX, cardY, cardW, cardH, 10);
    card.lineStyle(1, 0x334466, 0.5);
    card.strokeRoundedRect(cardX, cardY, cardW, cardH, 10);

    // Store layout info for intel panel
    this._cardLayout = { cardX, cardY, cardW, baseCardH };

    // ---- Waveform at top of card ----
    this._createWaveform(cardX + 12, waveY, cardW - 24, waveH);

    // ---- Portrait with arc meters ----
    this._showVictimPortrait(portraitX, portraitY);

    // ---- Victim info below portrait ----
    this.add.text(portraitX, textY, this.victim.name, {
      fontFamily: '"Courier New", monospace',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.add.text(portraitX, textY + 22, `Age: ${this.victim.age}  |  ${this.victim.location}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#aabbcc',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Emotion display
    this.victimEmotionText = this.add.text(portraitX, textY + 46, 'Mood: CALM', {
      fontFamily: '"Courier New", monospace',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#88aacc',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    gameState.on('emotion_change', this._onEmotionChange, this);

    // Suspicion warning
    this.suspicionWarning = this.add.text(portraitX, textY + 70, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#ff2244',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setAlpha(0);

    gameState.on('suspicion_change', this._onSuspicionWarning, this);
  }

  _showVictimPortrait(x, y) {
    const key = this.victim.portraitKey;
    const radius = 96;

    // Subtle dark circle behind portrait for depth
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.5);
    shadow.fillCircle(x, y, radius + 4);

    if (key && this.textures.exists(key)) {
      const portrait = this.add.image(x, y, key);
      const maxSize = radius * 2;
      const scale = maxSize / Math.max(portrait.width, portrait.height);
      portrait.setScale(scale);

      const maskShape = this.make.graphics({ add: false });
      maskShape.fillStyle(0xffffff);
      maskShape.fillCircle(x, y, radius);
      portrait.setMask(maskShape.createGeometryMask());
    } else {
      const g = this.add.graphics();
      g.fillStyle(0x334455, 0.8);
      g.fillCircle(x, y, radius);
      g.fillStyle(0x556677, 0.6);
      g.fillCircle(x, y - 24, 42);
      g.fillEllipse(x, y + 55, 108, 60);
    }

    // Thin ring border around portrait
    const ring = this.add.graphics();
    ring.lineStyle(2, 0x556688, 0.6);
    ring.strokeCircle(x, y, radius + 1);

    // Arc meters wrapping the portrait
    this.suspicionArc = new ArcMeter(this, x, y, {
      side: 'left',
      label: 'SUS',
      color: 0xff2244,
      maxValue: 100,
      radius: radius + 14,
      thickness: 10
    });
    this.suspicionArc.setValue(gameState.suspicion);

    this.complianceArc = new ArcMeter(this, x, y, {
      side: 'right',
      label: 'COMP',
      color: 0x00ff88,
      maxValue: 100,
      radius: radius + 14,
      thickness: 10
    });
    this.complianceArc.setValue(gameState.compliance);

    // Listen for value changes
    gameState.on('suspicion_change', this._onSuspicionArc, this);
    gameState.on('compliance_change', this._onComplianceArc, this);
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

    const symbol = emotionSymbols[current] || '';
    this.victimEmotionText.setText(`Mood: ${emotionLabels[current] || current.toUpperCase()}  ${symbol}`);
    this.victimEmotionText.setColor(emotionColors[current] || '#cccccc');
  }

  _onSuspicionWarning({ current }) {
    if (current >= 75) {
      this.sound.play('sfx_suspicion_warning', { volume: 0.6 });
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
    bg.fillStyle(0x0a0e14, 0.85);
    bg.fillRoundedRect(0, 0, w, h, 4);
    bg.lineStyle(1, 0x00ff88, 0.2);
    bg.strokeRoundedRect(0, 0, w, h, 4);
    container.add(bg);

    // Waveform bars — use full height, no label
    this.waveformBars = [];
    const barCount = 30;
    const pad = 6;
    const barWidth = (w - pad * 2) / barCount;
    const waveGfx = this.add.graphics();
    container.add(waveGfx);

    // Center line slightly below center for visual weight
    const centerY = h * 0.55;
    waveGfx.lineStyle(1, 0x00ff88, 0.1);
    waveGfx.lineBetween(pad, centerY, w - pad, centerY);

    // Animate waveform bars
    this.waveformGraphics = waveGfx;
    this.waveformConfig = { x: pad, centerY, barWidth, barCount, w, h };

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

    // Blinking red dot
    const dot = this.add.graphics();
    dot.fillStyle(0xff2244, 1);
    dot.fillCircle(-75, 0, 5);
    container.add(dot);

    this.tweens.add({
      targets: dot,
      alpha: { from: 1, to: 0.15 },
      duration: 800,
      yoyo: true,
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
      this.sound.play('sfx_button_click', { volume: 0.3 });
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
  //  INTEL TRACKER
  // =========================================================================

  _createIntelPanel() {
    if (!gameState.intelKeys || gameState.intelKeys.length === 0) return;
    if (!this._cardLayout) return;

    const { cardX, cardY, cardW, baseCardH } = this._cardLayout;
    const intelY = cardY + baseCardH;

    // Divider line
    const g = this.add.graphics().setDepth(200);
    g.lineStyle(1, 0x334455);
    g.lineBetween(cardX + 8, intelY + 2, cardX + cardW - 8, intelY + 2);

    // Header
    this.add.text(cardX + 14, intelY + 6, 'Intel', {
      fontFamily: '"Courier New", monospace', fontSize: '11px',
      fontStyle: 'bold', color: '#66aacc'
    }).setDepth(201);

    this.callIntelItems = {};
    let yOffset = intelY + 24;

    gameState.intelKeys.forEach((intel) => {
      const isUsed = gameState.intelUsed.has(intel.key);
      const category = intel.trackerCategory || intel.category || '???';

      // Category/status line
      const statusIcon = isUsed ? '\u2B50' : '\uD83D\uDD0D';
      const statusText = isUsed ? intel.description : category;
      const statusColor = isUsed ? '#66bb6a' : '#aaaaaa';
      const suffix = isUsed ? ' \u2014 CONFIRMED' : '';

      const text = this.add.text(cardX + 14, yOffset, `${statusIcon} ${statusText}${suffix}`, {
        fontFamily: '"Courier New", monospace', fontSize: '11px',
        color: statusColor, wordWrap: { width: cardW - 32 }
      }).setDepth(201);

      // CallHint (shown only when used)
      let hintText = null;
      if (isUsed && intel.callHint) {
        hintText = this.add.text(cardX + 28, yOffset + 16, `\uD83D\uDCAC "${intel.callHint}"`, {
          fontFamily: '"Courier New", monospace', fontSize: '9px',
          color: '#88aa66', fontStyle: 'italic',
          wordWrap: { width: cardW - 48 }
        }).setDepth(201);
        yOffset += hintText.height + 4;
      }

      this.callIntelItems[intel.key] = { text, hintText };
      yOffset += 20;
    });

    gameState.on('intel_used', this._onCallIntelUsed, this);
  }

  _onCallIntelUsed(key) {
    const intel = gameState.intelKeys.find(i => i.key === key);
    const item = this.callIntelItems?.[key];

    if (intel && item && item.text) {
      // Update status text
      item.text.setText(`\u2B50 ${intel.description} \u2014 CONFIRMED`);
      item.text.setColor('#66bb6a');

      // Scale animation
      this.tweens.add({
        targets: item.text, scaleX: 1.15, scaleY: 1.15,
        duration: 150, yoyo: true, ease: 'Quad.easeOut'
      });

      // Show callHint below (if not already shown)
      if (!item.hintText && intel.callHint) {
        const hintY = item.text.y + 16;
        item.hintText = this.add.text(item.text.x + 14, hintY, `\uD83D\uDCAC "${intel.callHint}"`, {
          fontFamily: '"Courier New", monospace', fontSize: '9px',
          color: '#88aa66', fontStyle: 'italic',
          wordWrap: { width: (this._cardLayout?.cardW || 200) - 48 }
        }).setDepth(201).setAlpha(0);

        this.tweens.add({ targets: item.hintText, alpha: 1, duration: 300 });
      }
    }

    if (intel) { this._showIntelToast(intel.description); }

    if (!gameState.hasTutorialSeen('intel_confirmed')) {
      gameState.markTutorialSeen('intel_confirmed');
      const { width } = this.scale;
      const tip = this.add.text(width / 2, 160,
        "\u{1F4A1} Intel confirmed! Mentioning real details naturally makes your scam story credible.",
        {
          fontFamily: '"Courier New", monospace', fontSize: '12px',
          color: '#44ff88', backgroundColor: '#0a2a0a',
          padding: { x: 12, y: 8 }, wordWrap: { width: 400 }
        }
      ).setOrigin(0.5).setDepth(350);
      this.time.delayedCall(5000, () => {
        this.tweens.add({ targets: tip, alpha: 0, duration: 500, onComplete: () => tip.destroy() });
      });
    }
  }

  // =========================================================================
  //  INTEL TOAST
  // =========================================================================

  _showIntelToast(description) {
    this.sound.play('sfx_notification_ding', { volume: 0.5 });
    const { width } = this.scale;
    const toastW = 280;
    const toastH = 58;
    const toastX = width - toastW - 20;
    const toastY = 90;

    const container = this.add.container(toastX + toastW + 20, toastY);
    container.setDepth(300);
    container.setAlpha(0);

    // Background
    const bg = this.add.graphics();
    bg.fillStyle(0x0a1a0a, 0.95);
    bg.fillRoundedRect(0, 0, toastW, toastH, 8);
    bg.lineStyle(2, 0x00ff88, 0.7);
    bg.strokeRoundedRect(0, 0, toastW, toastH, 8);
    // Top accent bar
    bg.fillStyle(0x00ff88, 0.15);
    bg.fillRoundedRect(0, 0, toastW, 3, { tl: 8, tr: 8, bl: 0, br: 0 });
    container.add(bg);

    // Checkmark icon
    const icon = this.add.text(12, toastH / 2, '\u2713', {
      fontFamily: '"Courier New", monospace',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#00ff88'
    }).setOrigin(0, 0.5);
    container.add(icon);

    // Title
    const title = this.add.text(38, 10, 'INTEL CONFIRMED', {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#00ff88'
    });
    container.add(title);

    // Description
    const desc = this.add.text(38, 30, description, {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      color: '#aaddaa',
      wordWrap: { width: toastW - 50 }
    });
    container.add(desc);

    // Scanline decoration
    const scanline = this.add.graphics();
    scanline.fillStyle(0x00ff88, 0.05);
    for (let i = 0; i < toastH; i += 4) {
      scanline.fillRect(0, i, toastW, 1);
    }
    container.add(scanline);

    // Slide in from right + fade in
    this.tweens.add({
      targets: container,
      x: toastX,
      alpha: 1,
      duration: 400,
      ease: 'Back.easeOut'
    });

    // Icon pulse
    this.tweens.add({
      targets: icon,
      scaleX: 1.4,
      scaleY: 1.4,
      duration: 200,
      delay: 400,
      yoyo: true,
      ease: 'Quad.easeOut'
    });

    // Auto-dismiss: slide out right + fade
    this.time.delayedCall(3000, () => {
      if (container && container.active) {
        this.tweens.add({
          targets: container,
          x: toastX + toastW + 20,
          alpha: 0,
          duration: 400,
          ease: 'Quad.easeIn',
          onComplete: () => {
            if (container && container.active) container.destroy();
          }
        });
      }
    });
  }

  // =========================================================================
  //  CALL END
  // =========================================================================

  _onSuspicionArc({ current }) {
    if (this.suspicionArc) this.suspicionArc.setValue(current);
  }

  _onComplianceArc({ current }) {
    if (this.complianceArc) this.complianceArc.setValue(current);
  }

  _onCallEnd() {
    // Clean up listeners and close this overlay
    gameState.off('call_end', this._onCallEnd, this);
    gameState.off('emotion_change', this._onEmotionChange, this);
    gameState.off('suspicion_change', this._onSuspicionWarning, this);
    gameState.off('suspicion_change', this._onSuspicionArc, this);
    gameState.off('compliance_change', this._onComplianceArc, this);
    gameState.off('intel_used', this._onCallIntelUsed, this);
    gameState.off('intel_seen', this._onIntelSeenForScript, this);
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
    gameState.off('suspicion_change', this._onSuspicionArc, this);
    gameState.off('compliance_change', this._onComplianceArc, this);
    gameState.off('intel_used', this._onCallIntelUsed, this);
    gameState.off('intel_seen', this._onIntelSeenForScript, this);
    if (this._onSuspicionTutorial) {
      gameState.off('suspicion_change', this._onSuspicionTutorial, this);
    }
    if (this._onComplianceTutorial) {
      gameState.off('compliance_change', this._onComplianceTutorial, this);
    }
  }
}
