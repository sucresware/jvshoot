import Phaser from 'phaser'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
  }

  update () {
    this.scene.start('SplashScene')
  }
}
