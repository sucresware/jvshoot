import Phaser from 'phaser'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'SplashScene' })
  }

  preload () {
    this.load.bitmapFont('visitor', './assets/fonts/visitor.png', './assets/fonts/visitor.xml')

    this.load.image('logo', 'assets/images/logo.png')

// this.load.image('flare', 'assets/images/flare.png')
    this.load.spritesheet("flare", "assets/images/flare.png", {
      frameWidth: 138,
      frameHeight: 64
    })

    this.load.image('hap', 'assets/images/hap.png')
    this.load.image('noel', 'assets/images/noel.png')

    this.load.image("sprBg0", "assets/images/sprBg0.png")

    this.load.image("sprLaserPlayer", "assets/images/sprLaserPlayer.png")

    this.load.spritesheet("sprExplosion", "assets/images/boom.png", {
      frameWidth: 32,
      frameHeight: 32
    })

    this.load.spritesheet("shipWithMotor", "assets/images/shipWithMotor.png", {
      frameWidth: 16,
      frameHeight: 24
    })

    let bgm = this.load.audio("bgm", "assets/sounds/nebula.mp3")

    this.load.audio("sndExplode0", "assets/sounds/sndExplode0.wav")
    this.load.audio("sndExplode1", "assets/sounds/sndExplode1.wav")
    this.load.audio("sndLaser", "assets/sounds/sndLaser.wav")
  }

  create () {
    let background = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'sprBg0')
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

    this.add.bitmapText(this.game.config.width/2, 200, 'visitor', 'PRESS SPACE TO START', 10).setOrigin(0.5)
    this.add.bitmapText(this.game.config.width/2, 250, 'visitor', 'HIGH SCORE: 0', 10).setOrigin(0.5)

    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  }

  update () {
    if (this.keySpace.isDown) {
      this.scene.start('GameScene')
    }
  }
}
