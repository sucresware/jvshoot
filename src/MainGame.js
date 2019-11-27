import Phaser from 'phaser'

import BootScene from './scenes/Boot'
import SplashScene from './scenes/Splash'
import MenuScene from './scenes/Menu'
import GameScene from './scenes/Game'
import SettingsScene from './scenes/Settings'

import config from './config'

export default class MainGame extends Phaser.Game {
  constructor (appendConfig, isMobile) {
    if (isMobile === undefined) isMobile = false;
    window.mobile = isMobile;

    let gameConfig = {
      ...config,
      scene: [BootScene, SplashScene, MenuScene, GameScene, SettingsScene],
    }

    let defaultSettings = {
      volumes: {
        music: 0.5,
        sfx: 0.5
      },
      effects: 2
    }

    // Pick "zoom" default value :
    defaultSettings.zoom = 1;
    if (gameConfig.height >= window.innerHeight) defaultSettings.zoom = 0; // Fullscreen (desktop)
    if (isMobile) defaultSettings.zoom = -0.5; // Fit (mobile)

    window.settings = {
      ...defaultSettings,
      ...JSON.parse(localStorage.getItem('settings')),
    };

    if (appendConfig) gameConfig = { ...gameConfig, ...appendConfig }
    super(gameConfig)
  }
}