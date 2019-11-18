import Phaser from 'phaser'

import BootScene from './scenes/Boot'
import SplashScene from './scenes/Splash'
import MenuScene from './scenes/Menu'
import GameScene from './scenes/Game'

import config from './config'

const gameConfig = Object.assign(config, {
  scene: [BootScene, SplashScene, MenuScene, GameScene]
})

class Game extends Phaser.Game {
  constructor () {
    super(gameConfig)
  }
}

window.game = new Game()
