import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { SettingsScene } from './scenes/SettingsScene.js';
import { IntroScene } from './scenes/IntroScene.js';
import { BriefingScene } from './scenes/BriefingScene.js';
import { OfficeScene } from './scenes/OfficeScene.js';
import { CallScene } from './scenes/CallScene.js';
import { TechDesktopScene } from './scenes/TechDesktopScene.js';
import SocialNetworkScene from './scenes/SocialNetworkScene.js';
import { LedgerScene } from './scenes/LedgerScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  scene: [
    BootScene,
    MenuScene,
    SettingsScene,
    IntroScene,
    BriefingScene,
    OfficeScene,
    CallScene,
    TechDesktopScene,
    SocialNetworkScene,
    LedgerScene,
    GameOverScene
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  audio: {
    disableWebAudio: false
  }
};

const game = new Phaser.Game(config);

// Expose for dev tools / automated testing
window.__PHASER_GAME__ = game;
