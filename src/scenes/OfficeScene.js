/**
 * OfficeScene.js - Main Gameplay Scene
 *
 * First-person view of a call center desk. Contains the phone (clickable),
 * monitor, notebook, background scammers, UI meters, and quota tracker.
 * Manages the call lifecycle and listens to GameState events.
 */

import Phaser from 'phaser';
import gameState, { LEVEL_CONFIG } from '../state/GameState.js';
import VoiceManager from '../voice/VoiceManager.js';
import { Meter } from '../ui/Meter.js';
import { getRandomVictim } from '../config/levels.js';

export class OfficeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'office' });
  }

  init(data) {
    this.levelNum = data?.level || this.registry.get('currentLevel') || 1;
    this.callInProgress = false;
    this.shiftEnded = false;
    this.callQueue = [];
    this.bossWalkTimer = null;
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(0x0d0d1a);

    // ---- Wire up VoiceManager callbacks ----
    const vm = VoiceManager.getInstance();
    vm.onGameStateUpdate = (data) => {
      gameState.updateFromAI(data);
    };
    vm.onDesktopAction = (data) => {
      if (this.scene.isActive('tech-desktop')) {
        const desktopScene = this.scene.get('tech-desktop');
        const action = data.action;
        // Map action names to method calls
        const actionMap = {
          'open_event_viewer': 'showEventViewer',
          'show_event_viewer': 'showEventViewer',
          'show_errors': 'showErrors',
          'open_command_prompt': 'showCommandPrompt',
          'show_command_prompt': 'showCommandPrompt',
          'run_tree_command': 'runTreeCommand',
          'run_netstat': 'runNetstat',
          'open_fake_antivirus': 'showFakeAntivirus',
          'show_fake_antivirus': 'showFakeAntivirus',
          'show_virus_scan': 'runVirusScan',
          'run_virus_scan': 'runVirusScan',
          'show_payment_page': 'showPaymentPage',
          'open_browser': 'showBrowser',
          'show_browser': 'showBrowser',
          'show_bank_page': 'showBankPage',
        };
        const method = actionMap[action];
        if (method && typeof desktopScene[method] === 'function') {
          desktopScene[method]();
        }
      }
    };
    vm.onCallEnd = (reason) => {
      gameState.endCall(reason);
    };
    vm.onError = (err) => {
      console.error('[OfficeScene] VoiceManager error:', err);
      if (this.callInProgress) {
        gameState.endCall('voice_error');
      }
    };

    // ---- Build the office environment ----
    this._drawBackground(width, height);
    this._drawBackgroundScammers(width, height);
    this._drawPosters(width, height);
    this._drawDesk(width, height);
    this._drawMonitor(width, height);
    this._drawNotebook(width, height);
    this._drawPhone(width, height);

    // ---- UI Elements ----
    this._createUIMeters(width, height);
    this._createMoneyCounter(width, height);
    this._createCallTimer(width, height);
    this._createQuotaBar(width, height);
    this._createShiftInfo(width, height);

    // ---- Boss walk-by ----
    this._setupBossWalkBy(width, height);

    // ---- Event listeners ----
    this._bindGameStateEvents();

    // ---- Start phone ringing after a short delay ----
    this.time.delayedCall(1500, () => {
      if (!this.shiftEnded) {
        this._startPhoneRinging();
      }
    });
  }

  // =========================================================================
  //  ENVIRONMENT DRAWING
  // =========================================================================

  _drawBackground(width, height) {
    const g = this.add.graphics();

    // Dark wall
    g.fillStyle(0x0d0d1a);
    g.fillRect(0, 0, width, height);

    // Wall texture (subtle vertical lines)
    g.lineStyle(1, 0x151525, 0.5);
    for (let x = 0; x < width; x += 40) {
      g.lineBetween(x, 0, x, height * 0.6);
    }

    // Baseboard
    g.fillStyle(0x1a1a2e);
    g.fillRect(0, height * 0.58, width, 8);

    // Ceiling light strips (neon tubes)
    for (let i = 0; i < 3; i++) {
      const lx = 200 + i * 350;
      // Light fixture
      g.fillStyle(0x222233);
      g.fillRect(lx - 60, 5, 120, 8);
      // Neon tube
      g.fillStyle(0x00ff88, 0.15);
      g.fillRect(lx - 50, 10, 100, 3);
      // Light cone
      g.fillStyle(0x00ff88, 0.02);
      g.fillTriangle(lx - 50, 13, lx + 50, 13, lx, height * 0.4);
    }
  }

  _drawBackgroundScammers(width, height) {
    // Silhouettes of other call center workers in the background
    const positions = [
      { x: 100, y: height * 0.4, scale: 0.6 },
      { x: width - 120, y: height * 0.38, scale: 0.55 },
      { x: 60, y: height * 0.42, scale: 0.5 },
      { x: width - 60, y: height * 0.43, scale: 0.48 },
    ];

    const g = this.add.graphics();
    positions.forEach(({ x, y, scale }) => {
      const s = scale;
      // Head
      g.fillStyle(0x0a0a15, 0.7);
      g.fillCircle(x, y - 30 * s, 14 * s);
      // Body
      g.fillRoundedRect(x - 16 * s, y - 18 * s, 32 * s, 45 * s, 4);
      // Desk edge
      g.fillStyle(0x151522, 0.5);
      g.fillRect(x - 30 * s, y + 20 * s, 60 * s, 6 * s);
      // Monitor glow
      g.fillStyle(0x00ccff, 0.05);
      g.fillRect(x - 12 * s, y - 15 * s, 24 * s, 18 * s);
    });
  }

  _drawPosters(width, height) {
    // "Motivational" neon posters on the back wall
    const posters = [
      { x: 350, y: 80, text: 'HUSTLE\nHARDER', color: 0xff2244 },
      { x: 850, y: 70, text: 'CLOSE\nTHE DEAL', color: 0x00ccff },
      { x: 1100, y: 90, text: 'NO\nREFUNDS', color: 0xffcc00 },
    ];

    posters.forEach(({ x, y, text, color }) => {
      const g = this.add.graphics();
      g.fillStyle(0x111122, 0.8);
      g.fillRoundedRect(x - 45, y - 10, 90, 65, 4);
      g.lineStyle(1, color, 0.5);
      g.strokeRoundedRect(x - 45, y - 10, 90, 65, 4);

      this.add.text(x, y + 20, text, {
        fontFamily: '"Courier New", monospace',
        fontSize: '13px',
        fontStyle: 'bold',
        color: `#${color.toString(16).padStart(6, '0')}`,
        align: 'center',
        stroke: '#000000',
        strokeThickness: 1
      }).setOrigin(0.5).setAlpha(0.7);
    });
  }

  _drawDesk(width, height) {
    const g = this.add.graphics();
    const deskY = height * 0.62;

    // Desk top surface (perspective trapezoid)
    g.fillStyle(0x1c1c2e);
    g.fillRect(0, deskY, width, height - deskY);

    // Desk front edge highlight
    g.lineStyle(2, 0x2a2a44, 0.8);
    g.lineBetween(0, deskY, width, deskY);

    // Desk surface texture
    g.lineStyle(1, 0x222238, 0.3);
    for (let i = 0; i < 15; i++) {
      g.lineBetween(0, deskY + 8 + i * 8, width, deskY + 10 + i * 8);
    }

    // Edge reflection
    g.fillStyle(0x00ff88, 0.03);
    g.fillRect(0, deskY, width, 3);
  }

  _drawMonitor(width, height) {
    const mx = width / 2;
    const my = height * 0.38;
    const g = this.add.graphics();

    // Monitor bezel
    g.fillStyle(0x1a1a2e);
    g.fillRoundedRect(mx - 180, my - 110, 360, 230, 8);

    // Screen
    g.fillStyle(0x0a0e14);
    g.fillRoundedRect(mx - 168, my - 98, 336, 206, 4);

    // Screen content - fake terminal
    const lines = [
      '> CALL_CENTER_OS v3.7.1',
      '> STATUS: ONLINE',
      `> SHIFT: ${this.levelNum}`,
      `> CALLS REMAINING: ${gameState.callsTotal - gameState.callsCompleted}`,
      '> AWAITING NEXT TARGET...',
      '',
      '> WARNING: ALL CALLS ARE MONITORED',
    ];

    lines.forEach((line, i) => {
      this.add.text(mx - 155, my - 85 + i * 22, line, {
        fontFamily: '"Courier New", monospace',
        fontSize: '12px',
        color: i === 6 ? '#ff4444' : '#00cc66',
        alpha: 0.6
      });
    });

    // Monitor power LED
    g.fillStyle(0x00ff88, 0.8);
    g.fillCircle(mx + 160, my + 115, 3);

    // Stand
    g.fillStyle(0x222233);
    g.fillRect(mx - 20, my + 120, 40, 25);
    g.fillRoundedRect(mx - 50, my + 142, 100, 8, 3);

    // Screen reflection
    g.fillStyle(0xffffff, 0.02);
    g.fillRect(mx - 160, my - 90, 160, 100);

    this.monitorCallsText = this.add.text(mx - 155, my - 85 + 3 * 22, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      color: '#00cc66',
      alpha: 0.6
    });
  }

  _drawNotebook(width, height) {
    const nx = width - 200;
    const ny = height * 0.68;
    const g = this.add.graphics();

    // Notebook body
    g.fillStyle(0x222233);
    g.fillRoundedRect(nx - 60, ny, 120, 150, 4);

    // Pages
    g.fillStyle(0x2a2a3a);
    g.fillRoundedRect(nx - 55, ny + 5, 110, 140, 3);

    // Lines on page
    g.lineStyle(1, 0x333344, 0.4);
    for (let i = 0; i < 8; i++) {
      g.lineBetween(nx - 45, ny + 25 + i * 16, nx + 45, ny + 25 + i * 16);
    }

    // "Notes" scribbles
    const notes = ['script notes', '--------', 'be polite', 'stay calm', 'close deal'];
    notes.forEach((note, i) => {
      this.add.text(nx - 40, ny + 15 + i * 16, note, {
        fontFamily: '"Courier New", monospace',
        fontSize: '8px',
        color: '#556677',
        alpha: 0.5
      });
    });

    // Pen
    g.lineStyle(2, 0x4444aa);
    g.lineBetween(nx + 50, ny + 10, nx + 70, ny + 140);
    g.fillStyle(0x6666cc);
    g.fillCircle(nx + 50, ny + 10, 3);
  }

  _drawPhone(width, height) {
    const px = 180;
    const py = height * 0.72;

    // Phone container
    this.phoneContainer = this.add.container(px, py);

    // Phone body
    const phoneBody = this.add.graphics();
    phoneBody.fillStyle(0x222238);
    phoneBody.fillRoundedRect(-45, -30, 90, 110, 8);
    phoneBody.lineStyle(1, 0x333355, 0.6);
    phoneBody.strokeRoundedRect(-45, -30, 90, 110, 8);
    this.phoneContainer.add(phoneBody);

    // Handset cradle
    const handset = this.add.graphics();
    handset.fillStyle(0x1a1a2e);
    handset.fillRoundedRect(-35, -25, 70, 22, 4);
    this.phoneContainer.add(handset);

    // Handset
    const handsetPiece = this.add.graphics();
    handsetPiece.fillStyle(0x111122);
    handsetPiece.fillRoundedRect(-30, -28, 60, 16, 6);
    // Ear piece
    handsetPiece.fillStyle(0x0a0a18);
    handsetPiece.fillRoundedRect(-28, -30, 18, 20, 4);
    // Mouth piece
    handsetPiece.fillRoundedRect(10, -30, 18, 20, 4);
    this.phoneContainer.add(handsetPiece);

    // Keypad buttons
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const btn = this.add.graphics();
        btn.fillStyle(0x333355);
        btn.fillRoundedRect(-28 + col * 22, 8 + row * 18, 16, 12, 2);
        this.phoneContainer.add(btn);
      }
    }

    // LED indicator on phone
    this.phoneLED = this.add.graphics();
    this.phoneContainer.add(this.phoneLED);

    // Phone label
    this.phoneLabel = this.add.text(0, 90, 'PHONE', {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      color: '#445566'
    }).setOrigin(0.5);
    this.phoneContainer.add(this.phoneLabel);

    // Ringing glow (hidden until phone rings)
    this.phoneGlow = this.add.graphics();
    this.phoneGlow.fillStyle(0x00ff88, 0.15);
    this.phoneGlow.fillRoundedRect(px - 55, py - 40, 110, 130, 12);
    this.phoneGlow.setAlpha(0);

    // Make phone interactive
    const phoneZone = this.add.zone(px, py + 20, 90, 110).setInteractive({ useHandCursor: true });
    phoneZone.on('pointerup', () => {
      if (this.phoneRinging && !this.callInProgress) {
        this._answerPhone();
      }
    });

    this.phoneRinging = false;
  }

  // =========================================================================
  //  UI ELEMENTS
  // =========================================================================

  _createUIMeters(width, height) {
    // Suspicion meter (right side, red)
    this.suspicionMeter = new Meter(this, width - 60, 120, {
      label: 'SUSPICION',
      color: 0xff2244,
      maxValue: 100,
      width: 28,
      height: 180
    });
    this.suspicionMeter.setValue(gameState.suspicion);

    // Compliance meter (right side, green)
    this.complianceMeter = new Meter(this, width - 110, 120, {
      label: 'COMPLIANCE',
      color: 0x00ff88,
      maxValue: 100,
      width: 28,
      height: 180
    });
    this.complianceMeter.setValue(gameState.compliance);

    // Initially hide meters until call starts
    this.suspicionMeter.setAlpha(0.3);
    this.complianceMeter.setAlpha(0.3);
  }

  _createMoneyCounter(width, height) {
    this.moneyContainer = this.add.container(width - 90, 30);

    const bg = this.add.graphics();
    bg.fillStyle(0x111122, 0.9);
    bg.fillRoundedRect(-80, -15, 160, 32, 4);
    bg.lineStyle(1, 0x00ff88, 0.4);
    bg.strokeRoundedRect(-80, -15, 160, 32, 4);
    this.moneyContainer.add(bg);

    this.add.text(width - 165, 18, '$', {
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#00ff88'
    });

    this.moneyText = this.add.text(width - 90, 30, '$0', {
      fontFamily: '"Courier New", monospace',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#00ff88',
      stroke: '#003322',
      strokeThickness: 1
    }).setOrigin(0.5);
  }

  _createCallTimer(width, height) {
    this.callTimerContainer = this.add.container(width / 2, 30);
    this.callTimerContainer.setAlpha(0);

    const bg = this.add.graphics();
    bg.fillStyle(0x111122, 0.9);
    bg.fillRoundedRect(-70, -15, 140, 32, 4);
    bg.lineStyle(1, 0x00ccff, 0.4);
    bg.strokeRoundedRect(-70, -15, 140, 32, 4);
    this.callTimerContainer.add(bg);

    this.callTimerText = this.add.text(0, 0, '00:00', {
      fontFamily: '"Courier New", monospace',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#00ccff'
    }).setOrigin(0.5);
    this.callTimerContainer.add(this.callTimerText);

    // Timer update event
    this.callTimerEvent = null;
  }

  _createQuotaBar(width, height) {
    const barY = height - 40;
    const barWidth = width - 200;
    const barX = 100;

    // Background
    const quotaBg = this.add.graphics();
    quotaBg.fillStyle(0x111122, 0.8);
    quotaBg.fillRoundedRect(barX - 10, barY - 8, barWidth + 20, 28, 4);
    quotaBg.lineStyle(1, 0xffcc00, 0.3);
    quotaBg.strokeRoundedRect(barX - 10, barY - 8, barWidth + 20, 28, 4);

    // Label
    this.add.text(barX - 5, barY - 22, 'QUOTA PROGRESS', {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      color: '#ffcc00',
      alpha: 0.7
    });

    // Bar frame
    const quotaFrame = this.add.graphics();
    quotaFrame.fillStyle(0x0a0a15, 0.9);
    quotaFrame.fillRoundedRect(barX, barY, barWidth, 12, 3);
    quotaFrame.lineStyle(1, 0x333344, 0.6);
    quotaFrame.strokeRoundedRect(barX, barY, barWidth, 12, 3);

    // Bar fill (will be updated)
    this.quotaFill = this.add.graphics();
    this.quotaBarX = barX;
    this.quotaBarY = barY;
    this.quotaBarWidth = barWidth;

    // Quota text
    const config = LEVEL_CONFIG[this.levelNum];
    this.quotaText = this.add.text(barX + barWidth + 10, barY + 6,
      `$0 / $${config.quota}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0, 0.5);

    this._updateQuotaBar();
  }

  _createShiftInfo(width, height) {
    // Shift / calls info at top left
    const config = LEVEL_CONFIG[this.levelNum];
    this.shiftInfoText = this.add.text(20, 15, `SHIFT ${this.levelNum}: ${config.name}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#00ccff',
      stroke: '#000000',
      strokeThickness: 2
    });

    this.callCountText = this.add.text(20, 38, `CALLS: 0/${config.callsTotal}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      color: '#667788'
    });

    // Emotion indicator
    this.emotionText = this.add.text(20, 56, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#ccaa44'
    });
  }

  // =========================================================================
  //  PHONE INTERACTIONS
  // =========================================================================

  _startRingSound() {
    try {
      this._ringCtx = new (window.AudioContext || window.webkitAudioContext)();
      this._ringGain = this._ringCtx.createGain();
      this._ringGain.gain.value = 0.15;
      this._ringGain.connect(this._ringCtx.destination);

      // Classic phone ring: two tones (440Hz + 480Hz), 2s on / 4s off
      const playRingBurst = () => {
        if (!this.phoneRinging || !this._ringCtx) return;
        const ctx = this._ringCtx;
        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.value = 440;
        osc2.frequency.value = 480;

        const burstGain = ctx.createGain();
        burstGain.gain.setValueAtTime(1, now);
        burstGain.gain.setValueAtTime(1, now + 0.8);
        burstGain.gain.setValueAtTime(0, now + 0.8);
        burstGain.gain.setValueAtTime(1, now + 1.2);
        burstGain.gain.setValueAtTime(1, now + 2.0);
        burstGain.gain.setValueAtTime(0, now + 2.0);

        osc1.connect(burstGain);
        osc2.connect(burstGain);
        burstGain.connect(this._ringGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 2.0);
        osc2.stop(now + 2.0);

        this._ringTimeout = setTimeout(() => playRingBurst(), 4000);
      };
      playRingBurst();
    } catch (e) {
      console.warn('[OfficeScene] Could not create ring sound:', e.message);
    }
  }

  _stopRingSound() {
    if (this._ringTimeout) {
      clearTimeout(this._ringTimeout);
      this._ringTimeout = null;
    }
    if (this._ringCtx) {
      this._ringCtx.close().catch(() => {});
      this._ringCtx = null;
    }
  }

  _startPhoneRinging() {
    if (this.shiftEnded || this.callInProgress) return;

    this.phoneRinging = true;
    this.phoneLabel.setText('RINGING...');
    this.phoneLabel.setColor('#00ff88');

    // Start ring sound
    this._startRingSound();

    // Pulsing glow animation
    this.ringTween = this.tweens.add({
      targets: this.phoneGlow,
      alpha: { from: 0, to: 0.8 },
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Phone LED blink
    this.ledTween = this.tweens.add({
      targets: this.phoneLED,
      alpha: { from: 0, to: 1 },
      duration: 300,
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        this.phoneLED.clear();
        this.phoneLED.fillStyle(0x00ff88, 0.9);
        this.phoneLED.fillCircle(30, -25, 4);
      }
    });

    // Vibrate effect
    this.vibrateTween = this.tweens.add({
      targets: this.phoneContainer,
      x: this.phoneContainer.x + 2,
      duration: 60,
      yoyo: true,
      repeat: -1
    });
  }

  _stopPhoneRinging() {
    this.phoneRinging = false;
    this.phoneLabel.setText('PHONE');
    this.phoneLabel.setColor('#445566');

    if (this.ringTween) this.ringTween.stop();
    if (this.ledTween) this.ledTween.stop();
    if (this.vibrateTween) this.vibrateTween.stop();

    this._stopRingSound();

    this.phoneGlow.setAlpha(0);
    this.phoneLED.clear();
  }

  async _answerPhone() {
    this._stopPhoneRinging();
    this.callInProgress = true;

    // Start VoiceManager call (victim is generated client-side)
    const vm = VoiceManager.getInstance();
    try {
      await vm.startCall(this.levelNum);
    } catch (e) {
      console.warn('[OfficeScene] VoiceManager not available:', e.message);
    }

    // Use victim from VoiceManager (generated during startCall), or pick locally as fallback
    const victim = vm.currentVictim || getRandomVictim(this.levelNum);

    // Assign a portrait texture key based on level
    const portraitCounts = { 1: 5, 2: 4, 3: 4, 4: 4, 5: 3 };
    const maxPortraits = portraitCounts[this.levelNum] || 3;
    const portraitIdx = Phaser.Math.Between(1, maxPortraits);
    victim.portraitKey = `l${this.levelNum}_victim_${portraitIdx}`;

    // Start the call in GameState
    gameState.startCall(victim);

    // Show meters
    this.suspicionMeter.setAlpha(1);
    this.complianceMeter.setAlpha(1);
    this.suspicionMeter.setValue(gameState.suspicion);
    this.complianceMeter.setValue(gameState.compliance);

    // Show call timer
    this.callTimerContainer.setAlpha(1);
    this._startCallTimer();

    // Update call count
    this._updateCallCount();

    // Launch CallScene as overlay
    this.scene.launch('call', { victim, level: this.levelNum });

    // If level 3, also launch TechDesktop
    if (this.levelNum === 3) {
      this.scene.launch('tech-desktop');
    }

    // Flash "CONNECTED" on phone
    this.phoneLabel.setText('ON CALL');
    this.phoneLabel.setColor('#ff2244');
  }

  _tryEndVoice() {
    try {
      VoiceManager.getInstance().endCall();
    } catch (e) {
      // Silent fail
    }
  }

  // =========================================================================
  //  CALL TIMER
  // =========================================================================

  _startCallTimer() {
    if (this.callTimerEvent) this.callTimerEvent.remove();

    this.callTimerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (!gameState.callActive) return;
        const elapsed = gameState.getCallElapsedSec();
        const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const secs = (elapsed % 60).toString().padStart(2, '0');
        this.callTimerText.setText(`${mins}:${secs}`);

        // Check time limit
        if (gameState.isCallOverTime()) {
          gameState.endCall('time_expired');
        }
      }
    });
  }

  _stopCallTimer() {
    if (this.callTimerEvent) {
      this.callTimerEvent.remove();
      this.callTimerEvent = null;
    }
  }

  // =========================================================================
  //  GAMESTATE EVENT HANDLERS
  // =========================================================================

  _bindGameStateEvents() {
    // Remove any old listeners from previous scene starts
    gameState.off('suspicion_change', this._onSuspicionChange, this);
    gameState.off('compliance_change', this._onComplianceChange, this);
    gameState.off('emotion_change', this._onEmotionChange, this);
    gameState.off('call_end', this._onCallEnd, this);
    gameState.off('game_event', this._onGameEvent, this);
    gameState.off('money_change', this._onMoneyChange, this);
    gameState.off('shift_end', this._onShiftEnd, this);

    gameState.on('suspicion_change', this._onSuspicionChange, this);
    gameState.on('compliance_change', this._onComplianceChange, this);
    gameState.on('emotion_change', this._onEmotionChange, this);
    gameState.on('call_end', this._onCallEnd, this);
    gameState.on('game_event', this._onGameEvent, this);
    gameState.on('money_change', this._onMoneyChange, this);
    gameState.on('shift_end', this._onShiftEnd, this);
  }

  _onSuspicionChange({ current }) {
    this.suspicionMeter.setValue(current);
  }

  _onComplianceChange({ current }) {
    this.complianceMeter.setValue(current);
  }

  _onEmotionChange({ current }) {
    const emotionColors = {
      calm: '#88aacc',
      nervous: '#ffcc00',
      angry: '#ff4444',
      scared: '#ff8800',
      trusting: '#00ff88',
      confused: '#cc88ff',
      crying: '#4488ff',
    };
    this.emotionText.setText(`VICTIM EMOTION: ${current.toUpperCase()}`);
    this.emotionText.setColor(emotionColors[current] || '#cccccc');
  }

  _onCallEnd({ reason, score, callResult }) {
    this.callInProgress = false;
    this._stopCallTimer();
    this._tryEndVoice();

    // Stop CallScene overlay
    if (this.scene.isActive('call')) {
      this.scene.stop('call');
    }
    if (this.scene.isActive('tech-desktop')) {
      this.scene.stop('tech-desktop');
    }

    // Hide call timer
    this.callTimerContainer.setAlpha(0);

    // Dim meters
    this.suspicionMeter.setAlpha(0.3);
    this.complianceMeter.setAlpha(0.3);

    // Reset phone label
    this.phoneLabel.setText('PHONE');
    this.phoneLabel.setColor('#445566');

    // Clear emotion
    this.emotionText.setText('');

    // Show result flash
    this._showCallResult(callResult);

    // Update call count
    this._updateCallCount();
    this._updateQuotaBar();

    // Update monitor display
    if (this.monitorCallsText) {
      this.monitorCallsText.setText(
        `> CALLS REMAINING: ${gameState.callsTotal - gameState.callsCompleted}`
      );
    }

    // Queue next call if shift not over
    if (!this.shiftEnded && gameState.callsCompleted < gameState.callsTotal) {
      this.time.delayedCall(3000, () => {
        if (!this.shiftEnded) {
          this._startPhoneRinging();
        }
      });
    }
  }

  _onGameEvent({ event }) {
    // Show event flash
    const eventMessages = {
      threatens_police: '!! VICTIM THREATENED POLICE !!',
      hangs_up: 'VICTIM HUNG UP',
      agrees_to_pay: 'VICTIM AGREED TO PAY!',
      gives_gift_card_code: 'GOT THE GIFT CARD CODE!',
    };

    const msg = eventMessages[event];
    if (msg) {
      const isGood = event === 'agrees_to_pay' || event === 'gives_gift_card_code';
      this._showEventFlash(msg, isGood);
    }
  }

  _onMoneyChange({ current }) {
    this.moneyText.setText(`$${current}`);

    // Pop animation on money text
    this.tweens.add({
      targets: this.moneyText,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 150,
      yoyo: true,
      ease: 'Back.easeOut'
    });

    this._updateQuotaBar();
  }

  _onShiftEnd({ totalMoney, quota, passed, shiftResults }) {
    this.shiftEnded = true;
    this._stopPhoneRinging();
    this._stopCallTimer();

    // Clean up event listeners
    gameState.off('suspicion_change', this._onSuspicionChange, this);
    gameState.off('compliance_change', this._onComplianceChange, this);
    gameState.off('emotion_change', this._onEmotionChange, this);
    gameState.off('call_end', this._onCallEnd, this);
    gameState.off('game_event', this._onGameEvent, this);
    gameState.off('money_change', this._onMoneyChange, this);
    gameState.off('shift_end', this._onShiftEnd, this);

    // Delay before going to results
    this.time.delayedCall(2000, () => {
      this.scene.start('results', {
        level: this.levelNum,
        totalMoney,
        quota,
        passed,
        shiftResults
      });
    });
  }

  // =========================================================================
  //  UI UPDATES
  // =========================================================================

  _updateCallCount() {
    const config = LEVEL_CONFIG[this.levelNum];
    this.callCountText.setText(`CALLS: ${gameState.callsCompleted}/${config.callsTotal}`);
  }

  _updateQuotaBar() {
    const config = LEVEL_CONFIG[this.levelNum];
    const progress = Math.min(gameState.money / config.quota, 1);

    this.quotaFill.clear();
    if (progress > 0) {
      const fillWidth = this.quotaBarWidth * progress;
      const color = progress >= 1 ? 0x00ff88 : 0xffcc00;
      this.quotaFill.fillStyle(color, 0.8);
      this.quotaFill.fillRoundedRect(this.quotaBarX + 1, this.quotaBarY + 1, fillWidth - 2, 10, 2);
      // Highlight
      this.quotaFill.fillStyle(0xffffff, 0.2);
      this.quotaFill.fillRect(this.quotaBarX + 1, this.quotaBarY + 1, fillWidth - 2, 3);
    }

    this.quotaText.setText(`$${gameState.money} / $${config.quota}`);
  }

  _showCallResult(callResult) {
    const { width, height } = this.scale;
    const success = callResult.success;

    const resultBg = this.add.graphics();
    resultBg.fillStyle(success ? 0x003322 : 0x330011, 0.9);
    resultBg.fillRoundedRect(width / 2 - 180, height / 2 - 40, 360, 80, 8);
    resultBg.lineStyle(2, success ? 0x00ff88 : 0xff2244, 0.8);
    resultBg.strokeRoundedRect(width / 2 - 180, height / 2 - 40, 360, 80, 8);

    const resultText = this.add.text(width / 2, height / 2 - 15,
      success ? 'CALL SUCCESSFUL' : 'CALL FAILED', {
      fontFamily: '"Courier New", monospace',
      fontSize: '22px',
      fontStyle: 'bold',
      color: success ? '#00ff88' : '#ff2244',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    const detailText = this.add.text(width / 2, height / 2 + 15,
      success ? `+$${callResult.score}` : `Reason: ${callResult.reason.replace(/_/g, ' ')}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      color: success ? '#aaffcc' : '#ff8888'
    }).setOrigin(0.5);

    // Fade out after 2.5 seconds
    this.time.delayedCall(2500, () => {
      this.tweens.add({
        targets: [resultBg, resultText, detailText],
        alpha: 0,
        duration: 500,
        onComplete: () => {
          resultBg.destroy();
          resultText.destroy();
          detailText.destroy();
        }
      });
    });
  }

  _showEventFlash(message, isGood) {
    const { width } = this.scale;

    const flash = this.add.text(width / 2, 70, message, {
      fontFamily: '"Courier New", monospace',
      fontSize: '16px',
      fontStyle: 'bold',
      color: isGood ? '#00ff88' : '#ff2244',
      stroke: '#000000',
      strokeThickness: 3,
      shadow: {
        offsetX: 0, offsetY: 0,
        color: isGood ? '#00ff88' : '#ff2244',
        blur: 10, fill: true
      }
    }).setOrigin(0.5).setDepth(100);

    this.tweens.add({
      targets: flash,
      y: flash.y - 30,
      alpha: 0,
      duration: 2000,
      ease: 'Cubic.easeOut',
      onComplete: () => flash.destroy()
    });
  }

  // =========================================================================
  //  BOSS WALK-BY
  // =========================================================================

  _setupBossWalkBy(width, height) {
    // Boss occasionally walks across the background
    this.bossWalkTimer = this.time.addEvent({
      delay: Phaser.Math.Between(15000, 30000),
      loop: true,
      callback: () => {
        this._doBossWalkBy(width, height);
      }
    });
  }

  _doBossWalkBy(width, height) {
    const bossY = height * 0.45;
    const g = this.add.graphics();

    // Simple boss silhouette
    g.fillStyle(0x0a0a18, 0.8);
    // Body
    g.fillRoundedRect(-15, -20, 30, 50, 5);
    // Head
    g.fillCircle(0, -32, 12);

    g.setPosition(-40, bossY);

    this.tweens.add({
      targets: g,
      x: width + 40,
      duration: 6000,
      ease: 'Linear',
      onComplete: () => g.destroy()
    });
  }

  // =========================================================================
  //  CLEANUP
  // =========================================================================

  shutdown() {
    this._stopCallTimer();
    this._stopRingSound();
    if (this.bossWalkTimer) this.bossWalkTimer.remove();

    // Remove GameState listeners
    gameState.off('suspicion_change', this._onSuspicionChange, this);
    gameState.off('compliance_change', this._onComplianceChange, this);
    gameState.off('emotion_change', this._onEmotionChange, this);
    gameState.off('call_end', this._onCallEnd, this);
    gameState.off('game_event', this._onGameEvent, this);
    gameState.off('money_change', this._onMoneyChange, this);
    gameState.off('shift_end', this._onShiftEnd, this);
  }
}
