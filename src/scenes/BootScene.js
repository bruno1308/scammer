/**
 * BootScene.js - Boot & Asset Generation Scene
 *
 * Preloads all external image assets with a real progress bar,
 * then generates programmatic textures/sprites. Shows a neon-styled
 * loading bar and transitions to MenuScene when ready.
 */

import Phaser from 'phaser';
import SaveManager from '../state/SaveManager.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'boot' });
  }

  preload() {
    const { width, height } = this.scale;

    // ---- Dark background ----
    this.cameras.main.setBackgroundColor(0x0a0a1a);

    // ---- "LOADING..." text ----
    this.loadingText = this.add.text(width / 2, height / 2 - 60, 'LOADING ASSETS...', {
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

    const barFrame = this.add.graphics();
    // Outer glow
    barFrame.lineStyle(2, 0x00ff88, 0.4);
    barFrame.strokeRoundedRect(barX - 3, barY - 3, barWidth + 6, barHeight + 6, 4);
    // Inner border
    barFrame.lineStyle(1, 0x00ff88, 0.8);
    barFrame.strokeRoundedRect(barX, barY, barWidth, barHeight, 2);
    // Dark fill
    barFrame.fillStyle(0x0a0a1a, 0.9);
    barFrame.fillRoundedRect(barX + 1, barY + 1, barWidth - 2, barHeight - 2, 2);

    // ---- Loading bar fill ----
    this.barFill = this.add.graphics();

    // ---- Progress percentage text ----
    this.percentText = this.add.text(width / 2, barY + barHeight / 2, '0%', {
      fontFamily: '"Courier New", monospace',
      fontSize: '12px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // ---- Status text ----
    this.statusText = this.add.text(width / 2, barY + barHeight + 20, '', {
      fontFamily: '"Courier New", monospace',
      fontSize: '11px',
      color: '#338866',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5, 0);

    // ---- Real progress bar driven by Phaser's loader ----
    const progressFillW = barWidth - 4;

    this.load.on('progress', (value) => {
      this.barFill.clear();
      // Main fill
      this.barFill.fillStyle(0x00ff88, 0.9);
      this.barFill.fillRoundedRect(barX + 2, barY + 2, progressFillW * value, barHeight - 4, 2);
      // Highlight
      this.barFill.fillStyle(0xaaffcc, 0.3);
      this.barFill.fillRect(barX + 2, barY + 2, progressFillW * value, 3);

      this.percentText.setText(`${Math.round(value * 100)}%`);
    });

    this.load.on('fileprogress', (file) => {
      this.statusText.setText(`> Loading ${file.key}...`);
    });

    this.load.on('complete', () => {
      this.statusText.setText('> All assets loaded.');
      this.loadingText.setText('INITIALIZING SYSTEM...');
    });

    // ---- Queue all image assets ----

    // Victim portrait images for all levels (3 per floor)
    for (let level = 1; level <= 5; level++) {
      for (let v = 1; v <= 3; v++) {
        this.load.image(`l${level}_victim_${v}`, `assets/portraits/level${level}/victim_${v}.png`);
      }
    }

    // Boss
    this.load.image('boss_idle', 'assets/characters/boss_idle.png');
    this.load.image('boss_angry', 'assets/characters/boss_angry.png');

    // Office assets (legacy)
    this.load.image('office_bg', 'assets/office/office_bg.png');
    this.load.image('office_monitor', 'assets/office/monitor.png');
    this.load.image('office_phone', 'assets/office/phone.png');

    // Office v3 — angle-consistent assets (seated eye-level camera)
    this.load.image('back_wall', 'assets/office_v3/back_wall_empty.png');
    this.load.image('foreground_desk', 'assets/office_v3/foreground_desk.png');
    this.load.image('main_monitor', 'assets/office_v3/main_monitor.png');
    this.load.image('phone_body', 'assets/office_v3/phone.png');
    this.load.image('alarm_clock', 'assets/office_v3/alarm_clock.png');
    this.load.image('cash_register', 'assets/office_v3/cash_register.png');

    // Worker animated spritesheets (49 frames, 7x7 grid, 640x640 per frame)
    this.load.spritesheet('anim_worker_1', 'assets/spritesheets/worker_1_typing_spritesheet.png',
      { frameWidth: 640, frameHeight: 640 });
    this.load.spritesheet('anim_worker_2', 'assets/spritesheets/worker_2_phone_spritesheet.png',
      { frameWidth: 640, frameHeight: 640 });
    this.load.spritesheet('anim_worker_3', 'assets/spritesheets/worker_3_music_spritesheet.png',
      { frameWidth: 640, frameHeight: 640 });



    // Office v2 — retained overlays and props
    this.load.image('monitor_overlay', 'assets/office_v2/monitor_screen_overlay.png');
    this.load.image('grime_overlay', 'assets/office_v2/grime_overlay.png');
    this.load.image('coffee_mug', 'assets/office_v2/coffee_mug.png');
    this.load.spritesheet('anim_steam', 'assets/spritesheets/anim_steam.png',
      { frameWidth: 256, frameHeight: 256 });

    // Spritesheets — regenerated via Ludo.ai (49 frames, 7x7 grid, 640x640 per frame)
    this.load.spritesheet('anim_boss_walk', 'assets/spritesheets/boss_walk_cycle_spritesheet.png',
      { frameWidth: 640, frameHeight: 640 });
    this.load.spritesheet('anim_cable_sway', 'assets/spritesheets/cable_sway_spritesheet.png',
      { frameWidth: 73, frameHeight: 73 });
    this.load.spritesheet('anim_tape_recorder', 'assets/spritesheets/tape_recorder_reels_spritesheet.png',
      { frameWidth: 640, frameHeight: 640 });
    this.load.spritesheet('anim_receipt_tape', 'assets/spritesheets/receipt_tape_feed_spritesheet.png',
      { frameWidth: 560, frameHeight: 752 });

    // ---- Audio assets ----

    // SFX
    this.load.audio('sfx_phone_ring', 'assets/sfx/phone_ring.mp3');
    this.load.audio('sfx_phone_pickup', 'assets/sfx/phone_pickup.mp3');
    this.load.audio('sfx_phone_hangup', 'assets/sfx/phone_hangup.mp3');
    this.load.audio('sfx_button_click', 'assets/sfx/button_click.mp3');
    this.load.audio('sfx_money_chaching', 'assets/sfx/money_chaching.mp3');
    this.load.audio('sfx_paper_rustle', 'assets/sfx/paper_rustle.mp3');
    this.load.audio('sfx_stamp_press', 'assets/sfx/stamp_press.mp3');
    this.load.audio('sfx_page_flip', 'assets/sfx/page_flip.mp3');
    this.load.audio('sfx_drawer_open', 'assets/sfx/drawer_open.mp3');
    this.load.audio('sfx_drawer_close', 'assets/sfx/drawer_close.mp3');
    this.load.audio('sfx_keyboard_typing', 'assets/sfx/keyboard_typing.mp3');
    this.load.audio('sfx_phone_dial_tone', 'assets/sfx/phone_dial_tone.mp3');
    this.load.audio('sfx_notification_ding', 'assets/sfx/notification_ding.mp3');
    this.load.audio('sfx_suspicion_warning', 'assets/sfx/suspicion_warning.mp3');
    this.load.audio('sfx_level_complete', 'assets/sfx/level_complete.mp3');
    this.load.audio('sfx_game_over', 'assets/sfx/game_over.mp3');
    this.load.audio('sfx_tape_recorder_start', 'assets/sfx/tape_recorder_start.mp3');
    this.load.audio('sfx_adding_machine', 'assets/sfx/adding_machine.mp3');
    this.load.audio('sfx_mouse_click', 'assets/sfx/mouse_click.mp3');

    // Ambient loops
    this.load.audio('amb_office_ambience', 'assets/ambient/office_ambience.mp3');
    this.load.audio('amb_fluorescent_hum', 'assets/ambient/fluorescent_hum.mp3');
    this.load.audio('amb_night_office', 'assets/ambient/night_office.mp3');

    // Music tracks
    this.load.audio('music_menu_theme', 'assets/music/menu_theme.mp3');
    this.load.audio('music_office_gameplay', 'assets/music/office_gameplay.mp3');
    this.load.audio('music_call_active', 'assets/music/call_active.mp3');
    this.load.audio('music_results_success', 'assets/music/results_success.mp3');
    this.load.audio('music_results_failure', 'assets/music/results_failure.mp3');
    this.load.audio('music_briefing_theme', 'assets/music/briefing_theme.mp3');
    this.load.audio('music_game_over_theme', 'assets/music/game_over_theme.mp3');

    // ---- UI assets ----
    this.load.image('ui_gauge_frame', 'assets/ui/gauge_frame.png');
    this.load.image('ui_dossier_panel', 'assets/ui/dossier_panel.png');
    this.load.image('ui_portrait_frame', 'assets/ui/portrait_frame_polaroid.png');
    this.load.image('ui_script_panel', 'assets/ui/script_panel.png');
    this.load.image('ui_script_tab', 'assets/ui/script_tab.png');
    this.load.image('ui_quota_board', 'assets/ui/quota_board.png');
    this.load.image('ui_tape_recorder', 'assets/ui/tape_recorder.png');
    this.load.image('ui_money_machine', 'assets/ui/money_machine.png');
    this.load.image('ui_button_green', 'assets/ui/button_green.png');
    this.load.image('ui_button_red', 'assets/ui/button_red.png');
    this.load.image('ui_stamp_confirmed', 'assets/ui/stamp_confirmed.png');
    this.load.image('ui_receipt_tape', 'assets/ui/receipt_tape.png');
    this.load.image('ui_friendbook_logo', 'assets/ui/social_network_logo.png');

    // FriendBook avatars (family/friend profiles)
    const fbAvatars = {
      1: ['karen_mitchell', 'mike_mitchell', 'emma_mitchell',
          'richard_patterson', 'lisa_patterson', 'tyler_patterson',
          'ken_nakamura', 'yuki_nakamura_davis', 'marcus_davis',
          'denise_washington_taylor', 'jerome_taylor', 'marcus_taylor',
          'patrick_obrien', 'colleen_obrien', 'baby_fiona_obrien'],
      2: ['mei_chen', 'brandon_chen', 'lily_chen',
          'carlos_gonzalez', 'sofia_gonzalez', 'diego_morales',
          'angela_wilson', 'jason_wilson', 'tamara_wilson',
          'raj_patel', 'dev_patel', 'sunita_patel'],
      3: ['carmen_rodriguez', 'diego_rodriguez', 'tony_rodriguez',
          'brian_thompson', 'lily_thompson', 'diane_morrison',
          'rachel_anderson', 'zoe_anderson', 'walt_anderson',
          'david_lee', 'kevin_lee', 'janet_park'],
      4: ['tammy_crawford', 'dave_crawford', 'ashley_crawford',
          'daniel_kim', 'grace_kim', 'justin_kim',
          'rosa_martinez_herrera', 'chris_herrera',
          'megan_brooks', 'tyler_brooks', 'steve_hendricks'],
      5: ['robert_chen', 'diana_chen', 'mark_torres',
          'lisa_chen', 'amy_nakamura',
          'karen_chen', 'david_price'],
    };
    Object.entries(fbAvatars).forEach(([level, ids]) => {
      ids.forEach(id => {
        this.load.image(`fb_l${level}_${id}`, `assets/friendbook/avatars/level${level}/${id}.png`);
      });
    });

    // FriendBook post images
    const fbPosts = {
      1: ['tomatoes', 'church_sermon', 'fishing_lake', 'sunset_catalinas',
          'watercolor_card', 'bird_photo', 'hana_art_show', 'model_train',
          'japanese_garden', 'teddy_bears', 'earl_selfie', 'robot_project',
          'parade_family'],
      2: ['kings_game', 'soccer_goal', 'rangoli', 'cat_sweater',
          'hermann_park', 'oak_desk', 'open_house'],
      3: ['mustang_brakes', 'new_truck', 'family_drawing', 'watercolor_kerry',
          'digital_painting', 'bookshelf', 'sneaker_jordans',
          'salon_grand_opening', 'dog_shake'],
      4: ['sunset_porch', 'biscuit_gotcha', 'surfing_lajolla', 'new_surfboard',
          'film_photos_venice', 'baby_first_steps', 'baby_avocado', 'robot_arm',
          'gatlinburg_weekend'],
      5: ['dogs_dolores', 'dim_sum', 'kitchen_renovation', 'fenway_kids',
          'running_charles', 'cookies_office'],
    };
    Object.entries(fbPosts).forEach(([level, keys]) => {
      keys.forEach(key => {
        this.load.image(`fb_l${level}_post_${key}`, `assets/friendbook/posts/level${level}/${key}.png`);
      });
    });
  }

  create() {
    const { width, height } = this.scale;
    const barWidth = 400;
    const barHeight = 24;
    const barX = (width - barWidth) / 2;
    const barY = height / 2 - 12;

    // ---- Migrate old single-slot save to slot 1 ----
    SaveManager.migrateOldSave();

    // ---- Generate programmatic textures (fast, no network) ----
    const tasks = [
      { label: '> Generating button textures...', fn: () => this._generateButtonTextures() },
      { label: '> Initializing game state...', fn: () => {} },
      { label: '> Connecting to call center...', fn: () => {} },
      { label: '> System ready.', fn: () => {} },
    ];

    let taskIndex = 0;

    this.time.addEvent({
      delay: 150,
      repeat: tasks.length - 1,
      callback: () => {
        const task = tasks[taskIndex];
        this.statusText.setText(task.label);
        task.fn();
        taskIndex++;

        if (taskIndex >= tasks.length) {
          this.time.delayedCall(300, () => {
            this.loadingText.setText('SYSTEM ONLINE');
            this.percentText.setVisible(false);
            this.time.delayedCall(400, () => {
              this.scene.start('menu');
            });
          });
        }
      }
    });
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
