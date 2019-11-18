const { version } = require('../../package.json');
import Phaser from 'phaser'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'SplashScene' })
  }

  preload () {
    this.load.bitmapFont('font', './assets/fonts/font.png', './assets/fonts/font.xml')

    this.load.image('logo', 'assets/images/logo.png')

// this.load.image('flare', 'assets/images/flare.png')
    this.load.spritesheet("flare", "assets/images/flare.png", {
      frameWidth: 138,
      frameHeight: 64
    })

    this.load.image('hap', 'assets/images/hap.png')
    this.load.image('noel', 'assets/images/noel.png')

    this.load.image("space", "assets/images/space.png")

    this.load.image("laser", "assets/images/laser.png")

    this.load.spritesheet("sprExplosion", "assets/images/boom.png", {
      frameWidth: 32,
      frameHeight: 32
    })

    this.load.spritesheet("ship", "assets/images/ship.png", {
      frameWidth: 8,
      frameHeight: 24
    })

    let bgm = this.load.audio("bgm", "assets/sounds/nebula.mp3")

    this.load.audio("explode", "assets/sounds/explode.wav")
    this.load.audio("explode_alt", "assets/sounds/explode_alt.wav")
    this.load.audio("laser", "assets/sounds/laser.wav")
  }

  create () {
    let background = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'space')
    background.setScale(2)

    let logo = this.add.sprite(this.game.config.width/2, 150, 'logo')
    let flare = this.add.sprite(this.game.config.width/2, 150, 'flare')

    this.anims.create({
      key: "flare",
      frames: this.anims.generateFrameNumbers("flare"),
      frameRate: 30,
      repeat: -1
    })

    flare.anims.play('flare')

    this.add.bitmapText(this.game.config.width/2, 200, 'font', 'PRESS SPACE TO START', 8).setOrigin(0.5)
    this.add.bitmapText(this.game.config.width/2, 250, 'font', 'HIGH SCORE: 0', 8).setOrigin(0.5)

    let padding = 5;
    this.add.bitmapText(this.game.config.width/2, this.game.config.height - padding, 'font', 'V' + version + ' COPYRIGHT 2019 SUCRESWARE', 4).setOrigin(.5, 1)

    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  }

  update () {
    if (this.keySpace.isDown) {
      this.scene.start('GameScene')
    }
  }
}
