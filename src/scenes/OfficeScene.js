/**
 * OfficeScene.js - Main Gameplay Scene
 *
 * First-person view of a call center desk. Contains the phone (clickable),
 * monitor, notebook, background scammers, UI meters, and quota tracker.
 * Manages the call lifecycle and listens to GameState events.
 */

import Phaser from 'phaser';
import gameState from '../state/GameState.js';
import { FLOORS } from '../config/levels.js';
import VoiceManager from '../voice/VoiceManager.js';
import { getFriendBookData } from '../config/friendbook/index.js';
import { getPierogiConfig } from '../config/prompts/pierogi_reveal.js';

export class OfficeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'office' });
  }

  init(data) {
    this.levelNum = data?.level || this.registry.get('currentLevel') || 1;
    this.callInProgress = false;
    this.shiftEnded = false;
    this.endShiftAfterCall = false;
    this._preSelectedVictim = null;
    this.phoneReady = false;
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(0x0d0d1a);

    // ---- Audio ----
    this.sound.stopAll();
    this.sound.play('music_office_gameplay', { loop: true, volume: 0.3 });
    this.sound.play('amb_office_ambience', { loop: true, volume: 0.15 });
    this.sound.play('amb_fluorescent_hum', { loop: true, volume: 0.08 });

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
    vm.onConnected = () => {
      // AI has picked up — re-enable phone so the player can hang up
      if (this.phoneZone) this.phoneZone.setInteractive({ useHandCursor: true });
    };
    vm.onCallEnd = (reason) => {
      gameState.endCall(reason);
    };
    vm.onError = (err) => {
      console.error('[OfficeScene] VoiceManager error:', err);
      if (this.callInProgress) {
        gameState.endCall('voice_error');
      }
      // Re-enable phone on error so it's not permanently stuck
      if (this.phoneZone) this.phoneZone.setInteractive({ useHandCursor: true });
    };

    // ---- Build the office environment ----
    this._drawOfficeBackground(width, height);
    this._drawMonitor(width, height);
    this._drawPhone(width, height);
    this._drawDeskClock(width, height);
    this._drawCashRegister(width, height);

    // ---- UI Elements ----
    this._createMoneyCounter(width, height);
    this._createCallTimer(width, height);
    this._createShiftInfo(width, height);

    // ---- Ambient animations ----
    this._setupAmbientEffects(width, height);

    // ---- Event listeners ----
    this._bindGameStateEvents();

    // ---- Research phase — timer starts when player picks up phone ----
    this._showResearchModeUI();

    // ---- Phone starts idle — player clicks to initiate call ----
    this._setPhoneReady();

    // ---- Debug drag mode (press D to toggle) ----
    this._setupDebugDragMode(width, height);
  }

  // =========================================================================
  //  ENVIRONMENT DRAWING
  // =========================================================================

  _drawOfficeBackground(width, height) {
    // ---- Layer 0: Back wall (v3 — workers drawn in, no foreground furniture) ----
    if (this.textures.exists('back_wall')) {
      const tex = this.textures.get('back_wall').getSourceImage();
      const coverScale = Math.max(width / tex.width, height / tex.height);
      this.add.image(width / 2, height / 2, 'back_wall')
        .setScale(coverScale).setDepth(0);
    } else {
      const g = this.add.graphics().setDepth(0);
      g.fillStyle(0x0d0d1a);
      g.fillRect(0, 0, width, height);
    }

    // ---- Layer 1: Animated worker sprites (behind desk) ----
    const workerDefs = [
      { key: 'anim_worker_1', anim: 'worker_1_idle', x: 0.2038, y: 0.7231, scale: 0.61 },
      { key: 'anim_worker_2', anim: 'worker_2_idle', x: 0.3636, y: 0.6565, scale: 0.51 },
      { key: 'anim_worker_3', anim: 'worker_3_idle', x: 0.783, y: 0.7107, scale: 0.785 },
    ];
    workerDefs.forEach(({ key, anim, x, y, scale }) => {
      if (this.textures.exists(key)) {
        if (!this.anims.exists(anim)) {
          this.anims.create({
            key: anim,
            frames: this.anims.generateFrameNumbers(key, { start: 0, end: 48 }),
            frameRate: 12,
            repeat: -1
          });
        }
        this.add.sprite(width * x, height * y, key)
          .setScale(scale).setDepth(1).play(anim);
      }
    });

    // ---- Layer 5: Foreground desk (empty, surface at monitor/phone Y level) ----
    if (this.textures.exists('foreground_desk')) {
      const tex = this.textures.get('foreground_desk').getSourceImage();
      const deskScale = (width * 0.65) / tex.width;
      // Push desk down so the surface aligns with monitor/phone
      this.add.image(width / 2, height * 0.98, 'foreground_desk')
        .setScale(deskScale).setDepth(5);
    }

    // ---- Layer 6: Coffee mug on desk, left of monitor ----
    if (this.textures.exists('coffee_mug')) {
      this.add.image(width * 0.3152, height * 0.7583, 'coffee_mug')
        .setScale(0.08).setDepth(6);
    }

    // ---- Steam animation rising from coffee mug ----
    if (this.textures.exists('anim_steam')) {
      if (!this.anims.exists('steam_rise_anim')) {
        this.anims.create({
          key: 'steam_rise_anim',
          frames: this.anims.generateFrameNumbers('anim_steam', { start: 0, end: 48 }),
          frameRate: 10,
          repeat: -1
        });
      }
      this.add.sprite(width * 0.3136, height * 0.6664, 'anim_steam')
        .setScale(0.415).setDepth(6).setAlpha(0.5).play('steam_rise_anim');
    }

    // ---- Layer 0: Grime overlay for atmosphere (behind workers/characters) ----
    if (this.textures.exists('grime_overlay')) {
      const tex = this.textures.get('grime_overlay').getSourceImage();
      const coverScale = Math.max(width / tex.width, height / tex.height);
      this.add.image(width / 2, height / 2, 'grime_overlay')
        .setScale(coverScale).setDepth(0).setAlpha(0.15);
    }
  }

  _drawMonitor(width, height) {
    const mx = width * 0.475;
    const my = height * 0.72;

    // Monitor container for hover scale effect
    this.monitorContainer = this.add.container(mx, my).setDepth(7);

    // Static CRT monitor (v3 — proper perspective, solid)
    if (this.textures.exists('main_monitor')) {
      this.monitorContainer.add(this.add.image(0, 0, 'main_monitor').setScale(0.31));
    } else {
      const g = this.add.graphics();
      g.fillStyle(0x1a1a2e);
      g.fillRoundedRect(-180, -110, 360, 230, 8);
      g.fillStyle(0x0a0e14);
      g.fillRoundedRect(-168, -98, 336, 206, 4);
      this.monitorContainer.add(g);
    }

    // Render app icons directly on the monitor screen
    const floor = FLOORS[this.levelNum];
    const apps = floor?.availableApps || ['friendbook'];

    const appConfigs = {
      friendbook: { icon: '\u{1F4D8}', label: 'FriendBook', texture: 'ui_friendbook_logo', action: () => this._openFriendBook() },
      notebook: { icon: '\u{1F4D3}', label: 'Notebook', action: () => this._openNotebook() },
      webmail: { icon: '\u{1F4E7}', label: 'WebMail', action: () => this._openWebMail() },
      searchr: { icon: '\u{1F50D}', label: 'Searchr', action: () => {} },
    };

    const iconSize = 44;
    const cols = Math.min(apps.length, 3);
    const rows = Math.ceil(apps.length / 3);
    const spacingX = 70;
    const spacingY = 68;
    const gridW = (cols - 1) * spacingX;
    const gridH = (rows - 1) * spacingY;
    const startX = -gridW / 2;
    const startY = -gridH / 2 - 6;

    apps.forEach((appId, idx) => {
      const cfg = appConfigs[appId];
      if (!cfg) return;

      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const ax = startX + col * spacingX;
      const ay = startY + row * spacingY;

      // Invisible hit area for click/hover (no visible background)
      const iconBg = this.add.rectangle(ax, ay, iconSize, iconSize, 0x000000, 0)
        .setInteractive({ useHandCursor: true }).setDepth(9);

      iconBg.on('pointerover', () => {
        const siblings = iconBg.getData('siblings') || [];
        [iconBg, ...siblings].forEach(obj => {
          const bx = obj.getData('baseScaleX') ?? obj.scaleX;
          const by = obj.getData('baseScaleY') ?? obj.scaleY;
          obj.setData('baseScaleX', bx);
          obj.setData('baseScaleY', by);
          this.tweens.add({ targets: obj, scaleX: bx * 1.15, scaleY: by * 1.15, duration: 100, ease: 'Back.easeOut' });
        });
      });
      iconBg.on('pointerout', () => {
        const siblings = iconBg.getData('siblings') || [];
        [iconBg, ...siblings].forEach(obj => {
          const bx = obj.getData('baseScaleX') ?? 1;
          const by = obj.getData('baseScaleY') ?? 1;
          this.tweens.add({ targets: obj, scaleX: bx, scaleY: by, duration: 100, ease: 'Sine.easeOut' });
        });
      });
      iconBg.on('pointerdown', () => {
        // Notebook can coexist with other overlays; block only for non-notebook apps when an overlay is up
        const snActive = this.scene.isActive('social-network');
        const nbActive = this.scene.isActive('notebook');
        const wmActive = this.scene.isActive('webmail');
        if (appId === 'notebook') {
          if (nbActive) return; // already open
        } else {
          if (snActive || wmActive) return; // block opening another full overlay
        }
        this.sound.play('sfx_mouse_click', { volume: 0.3 });
        cfg.action();
      });
      this.monitorContainer.add(iconBg);

      // Icon — use texture for FriendBook, emoji for others
      let iconObj;
      if (cfg.texture && this.textures.exists(cfg.texture)) {
        iconObj = this.add.image(ax, ay - 2, cfg.texture).setDisplaySize(28, 28).setDepth(10);
      } else {
        iconObj = this.add.text(ax, ay - 4, cfg.icon, { fontSize: '22px' }).setOrigin(0.5).setDepth(10);
      }
      this.monitorContainer.add(iconObj);

      // Label
      const label = this.add.text(ax, ay + 24, cfg.label, {
        fontFamily: '"Courier New", monospace', fontSize: '11px',
        fontStyle: 'bold', color: '#ffffff',
        stroke: '#000000', strokeThickness: 3
      }).setOrigin(0.5).setDepth(10);
      this.monitorContainer.add(label);

      // Store siblings for grouped hover scaling
      iconBg.setData('siblings', [iconObj, label]);
    });

  }

  _drawPhone(width, height) {
    // Position phone on desk surface, right of center
    const px = width * 0.68;
    const py = height * 0.82;

    // Phone container
    this.phoneContainer = this.add.container(px, py).setDepth(6);

    // Use phone_body image (original with background, pre-transparency)
    if (this.textures.exists('phone_body')) {
      const phoneSprite = this.add.image(0, 0, 'phone_body').setScale(0.17);
      this.phoneContainer.add(phoneSprite);
    } else if (this.textures.exists('office_phone')) {
      this.phoneContainer.add(this.add.image(0, 0, 'office_phone').setScale(0.18));
    } else {
      const phoneBody = this.add.graphics();
      phoneBody.fillStyle(0x222238);
      phoneBody.fillRoundedRect(-45, -30, 90, 110, 8);
      phoneBody.lineStyle(1, 0x333355, 0.6);
      phoneBody.strokeRoundedRect(-45, -30, 90, 110, 8);
      this.phoneContainer.add(phoneBody);
    }


    // Make phone interactive
    this.phoneZone = this.add.zone(px, py + 10, 110, 120).setInteractive({ useHandCursor: true }).setDepth(6);
    this.phoneZone.on('pointerover', () => {
      if (!this.callInProgress) {
        this.tweens.add({
          targets: this.phoneContainer,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 150,
          ease: 'Back.easeOut'
        });
      }
    });
    this.phoneZone.on('pointerout', () => {
      this.tweens.add({
        targets: this.phoneContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: 'Sine.easeOut'
      });
    });
    this.phoneZone.on('pointerup', () => {
      if (this.callInProgress) {
        this._hangUpCall();
      } else if (this.phoneReady && !this.phoneRinging) {
        this._initiateCall();
      }
    });

    this.phoneRinging = false;
    this.phoneReady = false;
  }

  _drawDeskClock(width, height) {
    // Position left of monitor — adjusted via debug drag mode
    const cx = width * 0.3441;
    const cy = height * 0.8478;

    // Shift maps to game time: 9:00 PM (21:00) → 2:00 AM (26:00 = 5 game hours)
    this._gameTimeStartHour = 21; // 9 PM
    this._gameTimeTotalHours = 5;  // 5 game hours over the shift

    this.clockContainer = this.add.container(cx, cy).setDepth(6);

    // Alarm clock image
    if (this.textures.exists('alarm_clock')) {
      const clockImg = this.add.image(0, 0, 'alarm_clock').setScale(0.092);
      this.clockContainer.add(clockImg);
    } else {
      // Fallback: simple dark rectangle
      const body = this.add.graphics();
      body.fillStyle(0x181828, 0.95);
      body.fillRoundedRect(-40, -18, 80, 36, 4);
      body.lineStyle(1, 0x333355, 0.6);
      body.strokeRoundedRect(-40, -18, 80, 36, 4);
      this.clockContainer.add(body);
    }

    // Digital time text overlay on the LCD screen — rotated to match perspective
    this.clockTimeText = this.add.text(5, 1, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#00ff88',
      stroke: '#003322',
      strokeThickness: 1
    }).setOrigin(0.5).setRotation(-0.155);
    this.clockContainer.add(this.clockTimeText);

    // Initial draw
    this._updateClockTime();

    // Update every second
    this._clockTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this._updateClockTime()
    });
  }

  _updateClockTime() {
    // Map shift elapsed time to game clock (9 PM → 2 AM over the shift duration)
    const totalShiftSec = gameState.shiftDurationSec || 300;
    const elapsed = totalShiftSec - gameState.getShiftRemainingSec();
    const progress = Math.min(1, Math.max(0, elapsed / totalShiftSec));

    // Convert progress to game hours past 9 PM
    const gameMinutesElapsed = progress * this._gameTimeTotalHours * 60;
    const totalGameMinutes = this._gameTimeStartHour * 60 + gameMinutesElapsed;

    const gameHour24 = Math.floor(totalGameMinutes / 60) % 24;
    const gameMin = Math.floor(totalGameMinutes % 60);
    const displayHour = gameHour24 % 12 || 12;
    const ampm = gameHour24 < 12 ? 'AM' : 'PM';

    this.clockTimeText.setText(`${displayHour}:${gameMin.toString().padStart(2, '0')} ${ampm}`);

    // Tint text red in the last game-hour (shift almost over)
    if (progress > 0.8) {
      this.clockTimeText.setColor('#ff4444');
    }
  }

  _drawCashRegister(width, height) {
    // Position adjusted via debug drag mode
    const cx = width * 0.6246;
    const cy = height * 0.6811;

    this.cashRegisterContainer = this.add.container(cx, cy).setDepth(5.5);

    if (this.textures.exists('cash_register')) {
      const img = this.add.image(0, 0, 'cash_register').setScale(0.2);
      this.cashRegisterContainer.add(img);
    } else {
      const body = this.add.graphics();
      body.fillStyle(0x1a1a2e, 0.95);
      body.fillRoundedRect(-50, -40, 100, 80, 4);
      this.cashRegisterContainer.add(body);
    }

    // Money progress text overlay on the display
    const floor = FLOORS[this.levelNum];
    const expenses = floor?.totalExpenses ?? 0;
    this.cashRegisterText = this.add.text(5, -48, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#00ff88',
      stroke: '#003322',
      strokeThickness: 1,
      align: 'center',
      fixedWidth: 120
    }).setOrigin(0.5).setRotation(0.10);
    this.cashRegisterContainer.add(this.cashRegisterText);

    this._updateCashRegister();
  }

  _updateCashRegister() {
    if (!this.cashRegisterText) return;
    const floor = FLOORS[this.levelNum];
    const expenseObj = floor?.expenses || {};
    const totalExpenses = Object.values(expenseObj).reduce((sum, v) => sum + (v || 0), 0);
    const wallet = gameState.wallet + gameState.shiftEarnings;
    this.cashRegisterText.setText(`$${wallet} / $${totalExpenses}`);

    // Color based on whether earnings cover tonight's expenses
    if (wallet >= totalExpenses) {
      this.cashRegisterText.setColor('#00ff88');
    } else if (wallet >= totalExpenses * 0.5) {
      this.cashRegisterText.setColor('#ffcc00');
    } else {
      this.cashRegisterText.setColor('#ff4444');
    }
  }

  // =========================================================================
  //  UI ELEMENTS
  // =========================================================================

  _createMoneyCounter(width, height) {
    this.moneyContainer = this.add.container(width - 90, 30).setDepth(50);

    // Dark background for readability
    const bg = this.add.graphics();
    bg.fillStyle(0x111122, 0.9);
    bg.fillRoundedRect(-80, -15, 160, 32, 4);
    bg.lineStyle(1, 0x00ff88, 0.4);
    bg.strokeRoundedRect(-80, -15, 160, 32, 4);
    this.moneyContainer.add(bg);

    // Dollar bill icon (left of text)
    const billIcon = this.add.graphics().setDepth(50);
    const bx = width - 168, by = 28;
    // Bill body
    billIcon.fillStyle(0x1a6b3c, 0.9);
    billIcon.fillRoundedRect(bx - 16, by - 10, 32, 20, 3);
    billIcon.lineStyle(1.5, 0x2ecc71, 0.8);
    billIcon.strokeRoundedRect(bx - 16, by - 10, 32, 20, 3);
    // Inner border
    billIcon.lineStyle(0.5, 0x2ecc71, 0.4);
    billIcon.strokeRoundedRect(bx - 13, by - 7, 26, 14, 2);
    // Dollar sign
    this.add.text(bx, by, '$', {
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#2ecc71'
    }).setOrigin(0.5).setDepth(50);

    this.moneyText = this.add.text(width - 90, 30, `$${gameState.wallet}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#00ff88',
      stroke: '#003322',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(50);
  }

  _createCallTimer(width, height) {
    this.callTimerContainer = this.add.container(width / 2, 30).setDepth(50);
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

  _createShiftInfo(width, height) {
    const floor = FLOORS[this.levelNum];
    this.shiftInfoText = this.add.text(20, 15, `FLOOR ${this.levelNum}: ${floor?.name || 'Unknown'}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#00ccff',
      stroke: '#000000',
      strokeThickness: 2
    }).setDepth(50);

    this.callCountText = this.add.text(20, 38, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      color: '#667788'
    }).setDepth(50);
    this._updateCallCount();

    // Emotion indicator
    this.emotionText = this.add.text(20, 56, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#ccaa44'
    }).setDepth(50);
  }

  // =========================================================================
  //  FRIENDBOOK
  // =========================================================================

  _openFriendBook() {
    if (this.scene.isActive('social-network')) return;

    const data = this._getFriendBookLaunchData();
    if (!data) return;

    this.scene.launch('social-network', {
      friendbookData: data.friendbookData,
      targetProfileId: data.targetProfileId,
      level: this.levelNum
    });

    if (!gameState.hasTutorialSeen('friendbook_intro') && this.levelNum === 1) {
      gameState.markTutorialSeen('friendbook_intro');
      this.time.delayedCall(500, () => {
        const snScene = this.scene.get('social-network');
        if (snScene && snScene.scene.isActive()) {
          const { width } = snScene.scale;
          const tip = snScene.add.text(width / 2, 640,
            "\u{1F4A1} TIP: This is FriendBook. Your targets and their friends post here.\nDig through their network for details you can use on the call.",
            {
              fontFamily: '"Courier New", monospace', fontSize: '12px',
              color: '#44bbff', backgroundColor: '#0a0a2e',
              padding: { x: 12, y: 8 }, wordWrap: { width: 500 }
            }
          ).setOrigin(0.5).setDepth(300);
          snScene.time.delayedCall(6000, () => {
            snScene.tweens.add({ targets: tip, alpha: 0, duration: 500, onComplete: () => tip.destroy() });
          });
        }
      });
    }
  }


  _openNotebook() {
    if (this.scene.isActive('notebook')) return;
    const victim = this.callInProgress && gameState.currentVictim
      ? gameState.currentVictim
      : this._getOrPreSelectVictim();
    this.scene.launch('notebook', {
      victimName: victim ? victim.name : 'General Notes',
      level: this.levelNum
    });
  }

  _openWebMail() {
    if (this.scene.isActive('webmail')) return;
    const victim = this.callInProgress && gameState.currentVictim
      ? gameState.currentVictim
      : this._getOrPreSelectVictim();
    if (!victim) return;
    this.scene.launch('webmail', {
      victim,
      level: this.levelNum
    });
  }

  _getFriendBookLaunchData() {
    // During a call, use the current victim
    const victim = this.callInProgress && gameState.currentVictim
      ? gameState.currentVictim
      : this._getOrPreSelectVictim();

    if (!victim) return null;

    const friendbookData = getFriendBookData(this.levelNum, victim.name);
    if (!friendbookData) return null;

    const targetProfileId = Object.keys(friendbookData.profiles)
      .find(id => friendbookData.profiles[id].isTarget);

    return { friendbookData, targetProfileId };
  }

  _getOrPreSelectVictim() {
    if (gameState.currentVictim) return gameState.currentVictim;
    // During research phase, peek at the next victim without dequeuing
    const queue = gameState.currentNightVictimQueue;
    if (queue && queue.length > 0) {
      // Find first victim not already attempted or completed
      const next = queue.find(v =>
        !gameState.attemptedTonight.includes(v.name) && !gameState.completedVictims[v.name]
      );
      return next || null;
    }
    return null;
  }

  // =========================================================================
  //  PHONE INTERACTIONS
  // =========================================================================

  /**
   * Set the phone to "ready" state — player can click to initiate a call.
   */
  _setPhoneReady() {
    if (this.shiftEnded) return;
    if (this.endShiftAfterCall) return;

    // Check if there are victims left to call tonight
    const nextVictim = gameState.getNextVictimTonight();
    if (!nextVictim) return;

    this.phoneReady = true;
    if (this.phoneZone) this.phoneZone.setInteractive({ useHandCursor: true });
  }

  /**
   * Player clicked the phone — start the outgoing call sequence.
   * Ring for ~2 seconds, then connect to the AI victim.
   */
  _initiateCall() {
    // Exit research phase and start shift timer on first call
    if (gameState.researchPhase) {
      gameState.exitResearchPhase();
      this._startShiftTimer();
      if (this.researchBanner) {
        this.researchBanner.destroy();
        this.researchBanner = null;
      }
    }

    this.phoneReady = false;
    if (this.readyPulseTween) {
      this.readyPulseTween.stop();
    }

    // Disable phone interaction until the AI connects
    if (this.phoneZone) this.phoneZone.disableInteractive();

    // Start ringing (outgoing call dialing)
    this._startPhoneRinging();

    // After ~2 seconds of ringing, auto-connect
    this.time.delayedCall(2000, () => {
      if (!this.shiftEnded && !this.callInProgress) {
        this._answerPhone();
      }
    });
  }

  _startRingSound() {
    this._ringSound = this.sound.add('sfx_phone_ring', { loop: true, volume: 0.4 });
    this._ringSound.play();
  }

  _stopRingSound() {
    if (this._ringSound) {
      this._ringSound.stop();
      this._ringSound.destroy();
      this._ringSound = null;
    }
  }

  _startPhoneRinging() {
    if (this.shiftEnded || this.callInProgress) return;

    this.phoneRinging = true;

    // Start ring sound
    this._startRingSound();

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

    if (this.ledTween) this.ledTween.stop();
    if (this.vibrateTween) this.vibrateTween.stop();

    this._stopRingSound();
  }

  _hangUpCall() {
    if (!this.callInProgress) return;
    this.sound.play('sfx_phone_hangup', { volume: 0.5 });
    try { VoiceManager.getInstance().endCall(); } catch (e) { /* silent */ }
    gameState.endCall('player_hangup');
  }

  async _answerPhone() {
    this._stopPhoneRinging();
    this.sound.play('sfx_phone_pickup', { volume: 0.6 });
    this.callInProgress = true;

    // Use pre-selected victim (player may have browsed FriendBook) or pick from queue
    const victim = this._preSelectedVictim || gameState.getNextVictimTonight();
    this._preSelectedVictim = null; // Clear for next call

    if (!victim) {
      this.callInProgress = false;
      return;
    }

    // Start VoiceManager call, passing the victim so the AI prompt matches
    const vm = VoiceManager.getInstance();
    try {
      await vm.startCall(this.levelNum, victim);
    } catch (e) {
      console.warn('[OfficeScene] VoiceManager not available:', e.message);
    }

    // Assign a portrait texture key based on victim's mapped portrait
    const portraitIdx = victim.portraitIdx || 1;
    victim.portraitKey = `l${this.levelNum}_victim_${portraitIdx}`;

    // Start the call in GameState
    gameState.startCall(victim);

    // Initialize intel from FriendBook data
    const friendbookData = getFriendBookData(this.levelNum, victim.name);
    if (friendbookData) {
      gameState.initIntel(friendbookData.intelKeys);
    }

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

  _showResearchModeUI() {
    const { width } = this.scale;

    // Container for the entire research HUD strip
    this.researchBanner = this.add.container(width / 2, 6).setDepth(50);

    // Look up the next victim for the preview
    const nextVictim = this._getOrPreSelectVictim();
    const victimName = nextVictim ? nextVictim.name : 'Unknown';
    const portraitIdx = nextVictim ? (nextVictim.portraitIdx || 1) : 1;
    const portraitKey = `l${this.levelNum}_victim_${portraitIdx}`;

    // --- Layout: two rows stacked ---
    const barW = 620;
    const row1Y = 12;  // research text row
    const row2Y = 34;  // victim info row
    const barH = 54;

    // Background
    const bar = this.add.rectangle(0, barH / 2, barW, barH, 0x0a1a2e, 0.92)
      .setOrigin(0.5);
    this.researchBanner.add(bar);

    // Row 1: Research phase instruction (centered)
    const researchText = this.add.text(0, row1Y, '\u{1F50D} RESEARCH PHASE \u2014 Browse the computer, then pick up the phone when ready', {
      fontFamily: '"Courier New", monospace', fontSize: '13px',
      color: '#44bbff'
    }).setOrigin(0.5);
    this.researchBanner.add(researchText);

    // Row 2: Portrait + victim name (centered)
    const thumbSize = 22;
    const nameLabel = this.add.text(0, row2Y, `YOUR NEXT TARGET:  ${victimName}`, {
      fontFamily: '"Courier New", monospace', fontSize: '14px',
      fontStyle: 'bold', color: '#ffcc44'
    }).setOrigin(0.5);
    // Shift name right to make room for portrait
    const totalW = thumbSize + 6 + nameLabel.width;
    const portraitCenterX = -totalW / 2 + thumbSize / 2;
    nameLabel.setX(portraitCenterX + thumbSize / 2 + 6 + nameLabel.width / 2);
    this.researchBanner.add(nameLabel);

    if (this.textures.exists(portraitKey)) {
      const portrait = this.add.image(portraitCenterX, row2Y, portraitKey)
        .setDisplaySize(thumbSize, thumbSize).setOrigin(0.5);

      // Circular mask (needs world coords)
      const maskShape = this.make.graphics({ x: 0, y: 0 });
      const worldX = (width / 2) + portraitCenterX;
      const worldY = 6 + row2Y;
      maskShape.fillCircle(worldX, worldY, thumbSize / 2);
      portrait.setMask(maskShape.createGeometryMask());
      this.researchBanner.add(portrait);

      // Circle border
      const border = this.add.circle(portraitCenterX, row2Y, thumbSize / 2 + 1)
        .setStrokeStyle(1.5, 0xffcc44).setFillStyle();
      this.researchBanner.add(border);
    }

    // Pulse animation
    this.tweens.add({
      targets: this.researchBanner, alpha: { from: 1, to: 0.7 }, duration: 1200,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });
  }

  _startShiftTimer() {
    if (this.shiftTimerEvent) this.shiftTimerEvent.remove();

    this.shiftTimerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this._updateShiftTimerDisplay();

        // Check if shift time is up
        if (gameState.isShiftTimeUp()) {
          this._stopShiftTimer();
          if (this.callInProgress) {
            // Let current call finish, then end shift
            this.endShiftAfterCall = true;
          } else {
            gameState.endShift();
          }
        }
      }
    });
  }

  _stopShiftTimer() {
    if (this.shiftTimerEvent) {
      this.shiftTimerEvent.remove();
      this.shiftTimerEvent = null;
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
    gameState.off('no_victims_tonight', this._onNoVictimsTonight, this);

    gameState.on('suspicion_change', this._onSuspicionChange, this);
    gameState.on('compliance_change', this._onComplianceChange, this);
    gameState.on('emotion_change', this._onEmotionChange, this);
    gameState.on('call_end', this._onCallEnd, this);
    gameState.on('game_event', this._onGameEvent, this);
    gameState.on('money_change', this._onMoneyChange, this);
    gameState.on('shift_end', this._onShiftEnd, this);
    gameState.on('no_victims_tonight', this._onNoVictimsTonight, this);
  }

  _onSuspicionChange({ current }) {
    // Meters now handled by arc meters in CallScene
  }

  _onComplianceChange({ current }) {
    // Meters now handled by arc meters in CallScene
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
    this.sound.play('sfx_phone_hangup', { volume: 0.5 });
    this.callInProgress = false;
    this._stopCallTimer();
    this._tryEndVoice();

    // Stop overlay scenes
    if (this.scene.isActive('call')) {
      this.scene.stop('call');
    }
    if (this.scene.isActive('tech-desktop')) {
      this.scene.stop('tech-desktop');
    }
    if (this.scene.isActive('social-network')) {
      this.scene.stop('social-network');
    }

    // Hide call timer
    this.callTimerContainer.setAlpha(0);

    // Clear emotion
    this.emotionText.setText('');

    // Show result flash
    this._showCallResult(callResult);

    // Update displays
    this._updateCallCount();
    this._updateShiftTimerDisplay();

    // If shift timer ran out during this call, end shift now
    if (this.endShiftAfterCall) {
      this.time.delayedCall(2500, () => gameState.endShift());
      return;
    }

    // Set phone ready for next call (after brief delay)
    this.time.delayedCall(3000, () => {
      if (!this.shiftEnded) {
        this._setPhoneReady();
      }
    });
  }

  _onGameEvent({ event }) {
    // ---- Pierogi mid-call reveal ----
    if (event === 'pierogi_reveal') {
      this._handlePierogiReveal();
      return;
    }

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
      this.sound.play(isGood ? 'sfx_notification_ding' : 'sfx_suspicion_warning', { volume: 0.5 });
      this._showEventFlash(msg, isGood);
    }
  }

  async _handlePierogiReveal() {
    const { width, height } = this.scale;

    // Screen glitch — white flash + static burst
    const flash = this.add.graphics().setDepth(999);
    flash.fillStyle(0xffffff, 0.7);
    flash.fillRect(0, 0, width, height);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 500,
      onComplete: () => flash.destroy()
    });

    // Static burst sound
    this.sound.play('sfx_suspicion_warning', { volume: 0.8 });

    // Switch VoiceManager to Pierogi config
    const pierogiConfig = getPierogiConfig();
    try {
      await VoiceManager.getInstance().switchSession(this.levelNum, pierogiConfig);
    } catch (e) {
      console.warn('[OfficeScene] Pierogi voice switch failed:', e.message);
    }

    // Reset meters to Pierogi starting values
    gameState.suspicion = 70;
    gameState.compliance = 10;
    gameState.emit('suspicion_change', { previous: 0, current: 70, delta: 70 });
    gameState.emit('compliance_change', { previous: 0, current: 10, delta: 10 });

    // Show dramatic event flash
    this._showEventFlash('!! PIEROGI REVEALED !!', false);

    // Brief delay then show identity change flash
    this.time.delayedCall(1500, () => {
      this._showEventFlash('"Drop the act. I know what you are."', false);
    });
  }

  _onMoneyChange({ current }) {
    this.moneyText.setText(`$${current}`);
    this.sound.play('sfx_money_chaching', { volume: 0.4 });

    // Pop animation on money text
    this.tweens.add({
      targets: this.moneyText,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 150,
      yoyo: true,
      ease: 'Back.easeOut'
    });

    this._updateShiftTimerDisplay();
    this._updateCashRegister();
  }

  _onShiftEnd(shiftData) {
    this.shiftEnded = true;
    this._stopPhoneRinging();
    this._stopCallTimer();
    this._stopShiftTimer();

    // Clean up event listeners
    gameState.off('suspicion_change', this._onSuspicionChange, this);
    gameState.off('compliance_change', this._onComplianceChange, this);
    gameState.off('emotion_change', this._onEmotionChange, this);
    gameState.off('call_end', this._onCallEnd, this);
    gameState.off('game_event', this._onGameEvent, this);
    gameState.off('money_change', this._onMoneyChange, this);
    gameState.off('shift_end', this._onShiftEnd, this);
    gameState.off('no_victims_tonight', this._onNoVictimsTonight, this);

    // Delay before going to ledger
    this.time.delayedCall(2000, () => {
      this.scene.start('ledger', {
        floor: this.levelNum,
        ...shiftData
      });
    });
  }

  _onNoVictimsTonight() {
    // No more victims available tonight — end shift after current call or immediately
    if (this.callInProgress) {
      this.endShiftAfterCall = true;
    } else {
      this.time.delayedCall(1500, () => gameState.endShift());
    }
  }

  // =========================================================================
  //  UI UPDATES
  // =========================================================================

  _updateCallCount() {
    const remaining = gameState.currentNightVictimQueue.filter(v =>
      !gameState.attemptedTonight.includes(v.name) && !gameState.completedVictims[v.name]
    ).length;
    this.callCountText.setText(`TARGETS REMAINING: ${remaining}`);
  }

  _updateShiftTimerDisplay() {
    if (gameState.researchPhase) {
      // Don't show countdown during research
      if (this.shiftTimerText) {
        this.shiftTimerText.setText('RESEARCH');
        this.shiftTimerText.setColor('#44bbff');
      }
      return;
    }
    // Update the alarm clock game time
    this._updateClockTime();
  }

  _showCallResult(callResult) {
    const { width, height } = this.scale;
    const success = callResult.success;

    const resultBg = this.add.graphics().setDepth(50);
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
    }).setOrigin(0.5).setDepth(50);

    const detailText = this.add.text(width / 2, height / 2 + 15,
      success ? `+$${callResult.score}` : `Reason: ${callResult.reason.replace(/_/g, ' ')}`, {
      fontFamily: '"Courier New", monospace',
      fontSize: '14px',
      color: success ? '#aaffcc' : '#ff8888'
    }).setOrigin(0.5).setDepth(50);

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
  //  AMBIENT EFFECTS
  // =========================================================================

  _setupAmbientEffects(width, height) {
    this._ambientTimers = [];
    this._animatedSprites = [];

    // =====================================================================
    //  SPRITESHEET ANIMATIONS
    //  Only include sprites that work without baked-in environments.
    //  REMOVED: light fixture (doubles bg lights), workers (baked-in desks),
    //  monitor glow (floating CRT), fan/mug/steam (perspective mismatch
    //  with desk), smoke wisp (no source). The background image already
    //  provides office atmosphere with its drawn furniture and lighting.
    // =====================================================================

    const addAnim = (key, texture, endFrame, frameRate, repeat, x, y, scale, depth, alpha) => {
      if (!this.textures.exists(texture)) return null;
      const animKey = `${key}_anim`;
      if (!this.anims.exists(animKey)) {
        this.anims.create({
          key: animKey,
          frames: this.anims.generateFrameNumbers(texture, { start: 0, end: endFrame }),
          frameRate: frameRate,
          repeat: repeat
        });
      }
      const sprite = this.add.sprite(x, y, texture)
        .setScale(scale).setDepth(depth).setAlpha(alpha ?? 1);
      sprite.play(animKey);
      this._animatedSprites.push(sprite);
      return sprite;
    };

    // Cable sway — stays still, then plays a quick swing every ~20 seconds
    if (this.textures.exists('anim_cable_sway')) {
      if (!this.anims.exists('cable_sway_anim')) {
        this.anims.create({
          key: 'cable_sway_anim',
          frames: this.anims.generateFrameNumbers('anim_cable_sway', { start: 0, end: 47 }),
          frameRate: 30,
          repeat: 0
        });
      }
      const cableSprite = this.add.sprite(width * 0.5404, height * 0.369, 'anim_cable_sway')
        .setScale(1).setDepth(0);
      const playCableSway = () => {
        cableSprite.play('cable_sway_anim');
        cableSprite.once('animationcomplete', () => {
          this.time.delayedCall(20000, playCableSway);
        });
      };
      this.time.delayedCall(20000, playCableSway);
    }

    // ── Boss walk cycle ─────────────────────────────────────────────────
    // Boss walks across the mid-ground (behind desk, in front of wall)
    // Side-profile spritesheet, 7x7 grid, 49 frames (skip last for loop seam)
    if (this.textures.exists('anim_boss_walk')) {
      if (!this.anims.exists('boss_walk_anim')) {
        this.anims.create({
          key: 'boss_walk_anim',
          frames: this.anims.generateFrameNumbers('anim_boss_walk', { start: 0, end: 47 }),
          frameRate: 12,
          repeat: -1
        });
      }

      this._bossSprite = this.add.sprite(-100, height * 0.72, 'anim_boss_walk')
        .setScale(0.84).setDepth(2).setVisible(false);

      const startBossWalk = () => {
        if (!this._bossSprite || !this._bossSprite.active) return;

        const goingRight = Phaser.Math.Between(0, 1) === 0;
        const startX = goingRight ? -100 : width + 100;
        const endX = goingRight ? width + 100 : -100;

        this._bossSprite.setPosition(startX, height * 0.72);
        this._bossSprite.setFlipX(!goingRight);
        this._bossSprite.setVisible(true);
        this._bossSprite.play('boss_walk_anim');

        this.tweens.add({
          targets: this._bossSprite,
          x: endX,
          duration: Phaser.Math.Between(6000, 10000),
          ease: 'Linear',
          onComplete: () => {
            this._bossSprite.setVisible(false);
            this._bossSprite.stop();
            const nextDelay = Phaser.Math.Between(15000, 30000);
            this._bossWalkTimer = this.time.delayedCall(nextDelay, startBossWalk);
          }
        });
      };

      this._bossWalkTimer = this.time.delayedCall(
        Phaser.Math.Between(5000, 10000), startBossWalk
      );
    }

    // =====================================================================
    //  CODE-ONLY AMBIENT EFFECTS (no sprite assets = no mismatch issues)
    // =====================================================================

    // Subtle light beam from ceiling (reduced alpha so it doesn't overpower)
    this._lightBeam = this.add.graphics().setDepth(1).setAlpha(0);
    this._lightBeam.fillStyle(0x88ffcc, 0.03);
    this._lightBeam.fillTriangle(
      width / 2 - 80, 20,
      width / 2 + 80, 20,
      width / 2, height * 0.45
    );
    this.tweens.add({
      targets: this._lightBeam,
      alpha: { from: 0.15, to: 0.4 },
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Floating dust particles — confined to the two ceiling light cones
    const lights = [
      { cx: width * 0.30, topY: height * 0.12, botY: height * 0.55, halfW: 70 },
      { cx: width * 0.68, topY: height * 0.12, botY: height * 0.55, halfW: 70 },
    ];
    const spawnInLightCone = () => {
      const light = lights[Phaser.Math.Between(0, lights.length - 1)];
      const y = Phaser.Math.Between(light.topY, light.botY);
      const t = (y - light.topY) / (light.botY - light.topY);
      const halfW = light.halfW * (1 + t * 0.5); // widens toward bottom
      const x = light.cx + Phaser.Math.Between(-halfW, halfW);
      return { x, y };
    };

    this._dustParticles = [];
    for (let i = 0; i < 35; i++) {
      const pos = spawnInLightCone();
      const dust = this.add.circle(
        pos.x,
        pos.y,
        Phaser.Math.Between(1, 3),
        0xddfff0,
        Phaser.Math.FloatBetween(0.15, 0.4)
      ).setDepth(11);
      this._dustParticles.push(dust);

      this.tweens.add({
        targets: dust,
        x: dust.x + Phaser.Math.Between(-30, 30),
        y: dust.y + Phaser.Math.Between(20, 60),
        alpha: { from: dust.alpha, to: 0 },
        duration: Phaser.Math.Between(3000, 7000),
        delay: Phaser.Math.Between(0, 5000),
        repeat: -1,
        onRepeat: () => {
          const p = spawnInLightCone();
          dust.x = p.x;
          dust.y = p.y;
          dust.setAlpha(Phaser.Math.FloatBetween(0.15, 0.4));
        }
      });
    }

    // Scanline overlay
    this._scanlines = this.add.graphics().setDepth(12).setAlpha(0.03);
    for (let sy = 0; sy < height; sy += 3) {
      this._scanlines.fillStyle(0x000000, 1);
      this._scanlines.fillRect(0, sy, width, 1);
    }

    // Ambient vignette — dark edges
    const vignette = this.add.graphics().setDepth(15);
    vignette.fillStyle(0x000000, 0.4);
    vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.5, 0.5, 0, 0);
    vignette.fillRect(0, 0, width, 40);
    vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.4, 0.4);
    vignette.fillRect(0, height - 30, width, 30);
    vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.3, 0, 0.3, 0);
    vignette.fillRect(0, 0, 50, height);
    vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0.3, 0, 0.3);
    vignette.fillRect(width - 50, 0, 50, height);
  }

  // =========================================================================
  //  DEBUG DRAG MODE (press D to toggle, P to print positions)
  // =========================================================================

  _setupDebugDragMode(width, height) {
    this._debugMode = false;
    this._debugLabels = [];
    this._debugDraggables = [];

    this.input.keyboard.on('keydown-D', () => {
      this._debugMode = !this._debugMode;
      if (this._debugMode) {
        this._enableDragMode(width, height);
      } else {
        this._disableDragMode();
      }
    });

    this.input.keyboard.on('keydown-P', () => {
      if (!this._debugMode) return;
      console.log('\n=== SPRITE POSITIONS (copy-paste into code) ===');
      this._debugDraggables.forEach(({ name, sprite }) => {
        const xNorm = (sprite.x / width).toFixed(4);
        const yNorm = (sprite.y / height).toFixed(4);
        const s = typeof sprite.scaleX === 'number' ? sprite.scaleX.toFixed(4) : '?';
        console.log(`${name}: x=${xNorm} (${Math.round(sprite.x)}px), y=${yNorm} (${Math.round(sprite.y)}px), scale=${s}`);
      });
      console.log('===============================================\n');
    });
  }

  _enableDragMode(width, height) {
    console.log('[DEBUG] Drag mode ON — drag sprites, scroll to scale, P to print, D to exit');

    this._debugBanner = this.add.text(width / 2, 10,
      'DEBUG DRAG MODE  |  D=toggle  P=print  scroll=scale', {
      fontFamily: '"Courier New", monospace', fontSize: '14px',
      color: '#ff00ff', backgroundColor: '#000000',
      padding: { x: 10, y: 4 }
    }).setOrigin(0.5, 0).setDepth(200);

    // Collect targets
    const targets = [];
    const texMap = {
      'anim_worker_1': 'worker_1', 'anim_worker_2': 'worker_2',
      'anim_worker_3': 'worker_3', 'back_wall': 'back_wall',
      'foreground_desk': 'desk', 'coffee_mug': 'coffee_mug',
      'anim_steam': 'steam', 'anim_cable_sway': 'cable',
    };
    this.children.list.forEach(child => {
      const key = child.texture && child.texture.key;
      if (key && texMap[key]) targets.push({ name: texMap[key], sprite: child });
    });
    if (this.monitorContainer) targets.push({ name: 'monitor', sprite: this.monitorContainer });
    if (this.clockContainer) targets.push({ name: 'alarm_clock', sprite: this.clockContainer });
    if (this.cashRegisterContainer) targets.push({ name: 'cash_register', sprite: this.cashRegisterContainer });
    if (this.phoneContainer) targets.push({ name: 'phone', sprite: this.phoneContainer });
    if (this._bossSprite) targets.push({ name: 'boss', sprite: this._bossSprite });

    // Create labels for each target
    targets.forEach(t => {
      const s = t.sprite;
      t.label = this.add.text(s.x, s.y - 30,
        `${t.name} (${Math.round(s.x)},${Math.round(s.y)})`, {
        fontFamily: '"Courier New", monospace', fontSize: '10px',
        color: '#ffff00', backgroundColor: '#000000aa',
        padding: { x: 3, y: 1 }
      }).setOrigin(0.5, 1).setDepth(201);
      this._debugLabels.push(t.label);
    });

    this._debugDraggables = targets;
    this._debugHeld = null;
    this._debugOffset = { x: 0, y: 0 };

    // Custom hit test: check point inside sprite's display bounds
    const hitTest = (px, py, sprite) => {
      const w = sprite.displayWidth || 200;
      const h = sprite.displayHeight || 200;
      return px >= sprite.x - w / 2 && px <= sprite.x + w / 2 &&
             py >= sprite.y - h / 2 && py <= sprite.y + h / 2;
    };

    // Find topmost (highest depth) target under pointer
    const pickTarget = (px, py) => {
      let best = null;
      for (const t of targets) {
        if (hitTest(px, py, t.sprite)) {
          if (!best || (t.sprite.depth || 0) > (best.sprite.depth || 0)) best = t;
        }
      }
      return best;
    };

    const updateLabel = (t) => {
      const s = t.sprite;
      const xN = (s.x / width).toFixed(3);
      const yN = (s.y / height).toFixed(3);
      t.label.setText(`${t.name} x=${xN} y=${yN} s=${s.scaleX.toFixed(4)}`);
      t.label.setPosition(s.x, s.y - 30);
    };

    // Pointer handlers — bypass Phaser's interactive/drag system entirely
    this._debugOnDown = (pointer) => {
      const t = pickTarget(pointer.x, pointer.y);
      if (!t) return;
      this._debugHeld = t;
      this._debugOffset.x = t.sprite.x - pointer.x;
      this._debugOffset.y = t.sprite.y - pointer.y;
      t.label.setColor('#ff00ff');
    };
    this._debugOnMove = (pointer) => {
      if (!this._debugHeld || !pointer.isDown) return;
      const t = this._debugHeld;
      t.sprite.x = pointer.x + this._debugOffset.x;
      t.sprite.y = pointer.y + this._debugOffset.y;
      updateLabel(t);
    };
    this._debugOnUp = () => {
      if (this._debugHeld) {
        this._debugHeld.label.setColor('#ffff00');
        this._debugHeld = null;
      }
    };
    this._debugWheelHandler = (pointer, gameObjects, deltaX, deltaY) => {
      if (!this._debugHeld) return;
      const t = this._debugHeld;
      const step = deltaY > 0 ? -0.005 : 0.005;
      const newScale = Math.max(0.01, t.sprite.scaleX + step);
      t.sprite.setScale(newScale);
      updateLabel(t);
    };

    this.input.on('pointerdown', this._debugOnDown);
    this.input.on('pointermove', this._debugOnMove);
    this.input.on('pointerup', this._debugOnUp);
    this.input.on('wheel', this._debugWheelHandler);
  }

  _disableDragMode() {
    console.log('[DEBUG] Drag mode OFF');
    this._debugLabels.forEach(l => l.destroy());
    this._debugLabels = [];
    this._debugDraggables = [];
    this._debugHeld = null;
    if (this._debugOnDown) this.input.off('pointerdown', this._debugOnDown);
    if (this._debugOnMove) this.input.off('pointermove', this._debugOnMove);
    if (this._debugOnUp) this.input.off('pointerup', this._debugOnUp);
    if (this._debugWheelHandler) this.input.off('wheel', this._debugWheelHandler);
    this._debugOnDown = this._debugOnMove = this._debugOnUp = this._debugWheelHandler = null;
    if (this._debugBanner) { this._debugBanner.destroy(); this._debugBanner = null; }
  }

  // =========================================================================
  //  CLEANUP
  // =========================================================================

  shutdown() {
    this._stopCallTimer();
    this._stopShiftTimer();
    this._stopRingSound();
    if (this._ambientTimers) this._ambientTimers.forEach(t => t.remove());
    if (this._bossWalkTimer) this._bossWalkTimer.remove();
    if (this._bossSprite) this._bossSprite.destroy();
    if (this.readyPulseTween) this.readyPulseTween.stop();
    if (this._clockTimer) this._clockTimer.remove();
    if (this.researchBanner) { this.researchBanner.destroy(); this.researchBanner = null; }

    // Remove GameState listeners
    gameState.off('suspicion_change', this._onSuspicionChange, this);
    gameState.off('compliance_change', this._onComplianceChange, this);
    gameState.off('emotion_change', this._onEmotionChange, this);
    gameState.off('call_end', this._onCallEnd, this);
    gameState.off('game_event', this._onGameEvent, this);
    gameState.off('money_change', this._onMoneyChange, this);
    gameState.off('shift_end', this._onShiftEnd, this);
    gameState.off('no_victims_tonight', this._onNoVictimsTonight, this);
  }
}
