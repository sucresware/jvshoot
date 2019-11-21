import Phaser from 'phaser'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.cameras.main.setBackgroundColor(0x000000)

    this.load.on('progress', (value) => {
        progressBar.clear()
        progressBar.fillStyle(0x3D3DAD, 1)
        progressBar.fillRect(40, this.game.config.height / 2, (this.game.config.width - 80) * value, 8)
    })

    this.load.on('complete', () => {
        progressBar.destroy()
        progressBox.destroy()
    })

    let progressBox = this.add.graphics()
    let progressBar = this.add.graphics()
    progressBox.fillStyle(0x050710, 1)
    progressBox.fillRect(40, this.game.config.height / 2, this.game.config.width - 80, 8)

    // Fonts
    let fonts = ['white', 'indigo', 'orange', 'red', 'green'];
    fonts.forEach(font => {
      this.load.bitmapFont(font, './assets/fonts/' + font + '.png', './assets/fonts/' + font + '.xml')
      this.load.bitmapFont(font + '_shadow', './assets/fonts/' + font + '_shadow.png', './assets/fonts/' + font + '_shadow.xml')
    })

    // Images
    this.load.image("space", "assets/images/space.png")
    this.load.image('logo', 'assets/images/logo.png')
    this.load.image('hap', 'assets/images/hap.png')
    this.load.image('noel', 'assets/images/noel.png')
    this.load.image("laser", "assets/images/laser.png")
    this.load.image("computer", "assets/images/computer.png")
    this.load.image("background", "assets/images/background.png")

    this.load.spritesheet("explosion", "assets/images/boom.png", {
      frameWidth: 32,
      frameHeight: 32
    })

    this.load.spritesheet("ship", "assets/images/ship.png", {
      frameWidth: 16,
      frameHeight: 24
    })

    this.load.spritesheet("flare", "assets/images/flare.png", {
      frameWidth: 138,
      frameHeight: 64
    })

    // Sounds
    this.load.audio("the_courier", "assets/sounds/the_courier.mp3")
    this.load.audio("votedisk", "assets/sounds/votedisk.mp3")
    this.load.audio("votedisk_mbr", "assets/sounds/votedisk_mbr.mp3")
    this.load.audio("the_scene_is_dead", "assets/sounds/the_scene_is_dead.mp3")
    this.load.audio("explode", "assets/sounds/explode.wav")
    this.load.audio("explode_alt", "assets/sounds/explode_alt.wav")
    this.load.audio("laser", "assets/sounds/laser.wav")
  }

  update () {
    this.scene.start('SplashScene')
  }
}
