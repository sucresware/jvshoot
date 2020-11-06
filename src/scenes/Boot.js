import Phaser from 'phaser'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    // Scaling
    this.scale.setGameSize(this.game.config.width, this.game.config.height)

    if (window.platform == 'mobile' || window.settings.zoom == -0.5) {
      let scaleFactor = window.innerHeight / this.game.config.height;
      let width = window.innerWidth / scaleFactor;
      this.game.config.width = width;

      this.scale.setGameSize(width, this.game.config.height)
      this.scale.setZoom(scaleFactor)
    } else if (window.settings.zoom == 0) {
      let scaleFactor = (window.innerHeight - 60) / this.game.config.height;
      this.scale.setZoom(scaleFactor)
    } else {
      this.scale.setZoom(window.settings.zoom)
    }

    this.scene.start('SplashScene')
  }
}
