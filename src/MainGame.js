import Phaser from 'phaser'

import BootScene from './scenes/Boot'
import SplashScene from './scenes/Splash'
import MenuScene from './scenes/Menu'
import GameScene from './scenes/Game'
import SettingsScene from './scenes/Settings'

import config from './config'

let gameConfig = {
  ...config,
  scene: [BootScene, SplashScene, MenuScene, GameScene, SettingsScene]
}

let defaultSettings = {
  volumes: {
    music: 0.5,
    sfx: 0.5
  },
  effects: 2
}

window.settings = {
  ...defaultSettings,
  ...JSON.parse(localStorage.getItem('settings')),
};

export default class MainGame extends Phaser.Game {
  constructor (appendConfig) {
    if (appendConfig) gameConfig = { ...gameConfig, ...appendConfig }
    super(gameConfig)
  }
}