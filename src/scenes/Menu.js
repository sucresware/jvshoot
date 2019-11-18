const { version } = require('../../package.json');
import Phaser from 'phaser'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'MenuScene' })
  }

  preload () {
  }

  create () {
    this.sound.add("explode").play()
    this.cameras.main.shake(200, 0.01)

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
