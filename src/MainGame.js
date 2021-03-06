import Phaser from 'phaser'

import BootScene from './scenes/Boot'
import LoadingScene from './scenes/Loading'
import SplashScene from './scenes/Splash'
import MenuScene from './scenes/Menu'
import GameScene from './scenes/Game'
import ChooseLevelScene from './scenes/ChooseLevel'
import LevelClearScene from './scenes/LevelClear'
import GameOverScene from './scenes/GameOver'
import SettingsScene from './scenes/Settings'

// Facebook Scenes
import FacebookPreloadScene from './scenes/FacebookPreload'
import FacebookMenuScene from './scenes/FacebookMenu'
import FacebookGameOverScene from './scenes/FacebookGameOver'

import config from './config'

export default class MainGame extends Phaser.Game {
    constructor (appendConfig, platform) {
      if (platform === undefined) platform = 'desktop';
      window.platform = platform;

      let prependScenes = [];
      if (window.platform == 'facebook') {
          prependScenes = [ FacebookPreloadScene, FacebookMenuScene, FacebookGameOverScene ];
      }

      let gameConfig = {
        ...config,
        scene: [
            ...prependScenes,
            BootScene,
            LoadingScene,
            SplashScene,
            MenuScene,
            GameScene,
            ChooseLevelScene,
            SettingsScene,
            LevelClearScene,
            GameOverScene,
          ],
      }

      let defaultSettings = {
          volumes: {
            music: 0.5,
            sfx: 0.5
          },
          effects: 2
      }

      let defaultState = {
          coins: 0,
      }

      // Pick "zoom" default value :
      defaultSettings.zoom = 1;
      if (gameConfig.height >= window.innerHeight) defaultSettings.zoom = 0; // Fullscreen (desktop)
      if (window.platform == 'mobile') defaultSettings.zoom = -0.5; // Fit (mobile)

      window.settings = {
          ...defaultSettings,
          ...JSON.parse(localStorage.getItem('settings')),
      };

      window.state = {
          ...defaultState,
          ...JSON.parse(localStorage.getItem('state')),
      };

      if (appendConfig) gameConfig = { ...gameConfig, ...appendConfig }
      super(gameConfig)
    }
}