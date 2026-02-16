import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { BriefingScene } from './scenes/BriefingScene.js';
import { OfficeScene } from './scenes/OfficeScene.js';
import { CallScene } from './scenes/CallScene.js';
import { TechDesktopScene } from './scenes/TechDesktopScene.js';
import { ResultsScene } from './scenes/ResultsScene.js';
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
    BriefingScene,
    OfficeScene,
    CallScene,
    TechDesktopScene,
    ResultsScene,
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
