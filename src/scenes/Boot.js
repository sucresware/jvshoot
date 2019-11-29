import Phaser from 'phaser'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    /** Scaling **/
    this.scale.setGameSize(this.game.config.width, this.game.config.height)

    if (window.mobile || window.settings.zoom == -0.5) {
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

    let progressPercentText = this.add.text(this.game.config.width / 2, (this.game.config.height / 2), '0%', {
        fontFamily: 'PressStart2P',
        fontSize: '8px'
    }).setOrigin(0.5).setDepth(10);

    this.progressText = this.add.text(this.game.config.width / 2, (this.game.config.height - 20), '', {
        fontFamily: 'PressStart2P',
        fontSize: '8px',
        color: '#3D3DAD',
    }).setOrigin(0.5).setDepth(10);

    this.cameras.main.setBackgroundColor(0x000000)

    this.load.on('progress', (value) => {
        progressBar.clear()
        progressBar.fillStyle(0x3D3DAD, 1)
        progressBar.fillRect(40, (this.game.config.height / 2) - 8, (this.game.config.width - 80) * value, 16)
        progressPercentText.setText(Math.round((value * 100)) + '%')
    })

    this.load.on('filecomplete', (name, type) => {
        this.progressText.setText(type + '/' + name)
    })

    this.load.on('complete', () => {
      progressPercentText.setText('COMPLETE');
      setTimeout(() => {
        this.scene.start('SplashScene')
      }, 1000);
    })

    let progressBox = this.add.graphics()
    let progressBar = this.add.graphics()
    progressBox.fillStyle(0x050710, 1)
    progressBox.fillRect(40, (this.game.config.height / 2) - 8, this.game.config.width - 80, 16)

    // Bitmap Fonts
    let fonts = ['white', 'indigo', 'orange', 'red', 'green'];
    fonts.forEach(font => {
      this.load.bitmapFont(font, './assets/fonts/' + font + '.png', './assets/fonts/' + font + '.xml')
    })

    // Images
    this.load.image("space", "assets/images/space.png")
    this.load.image('logo', 'assets/images/logo.png')
    this.load.image('hap', 'assets/images/hap.png')
    this.load.image('olinux', 'assets/images/olinux.png')
    this.load.image('noel', 'assets/images/noel.png')
    this.load.image('coin', 'assets/images/coin.png')
    this.load.image("laser", "assets/images/laser.png")
    this.load.image("computer", "assets/images/computer.png")
    this.load.image("background", "assets/images/background.png")
    this.load.image("arrow", "assets/images/arrow.png")
    this.load.image("checkbox", "assets/images/checkbox.png")
    this.load.image("checkbox_ok", "assets/images/checkbox_ok.png")
    this.load.image("galerie_marchande", "assets/images/galerie_marchande.jpg")

    // Spritesheets
    this.load.spritesheet("explosion", "assets/images/boom.png", { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet("ship", "assets/images/ship.png", { frameWidth: 32, frameHeight: 48 })
    this.load.spritesheet("flare", "assets/images/flare.png", { frameWidth: 138, frameHeight: 64 })

    // Sounds
    this.load.audio("the_courier", "assets/sounds/the_courier.mp3")
    this.load.audio("votedisk", "assets/sounds/votedisk.mp3")
    this.load.audio("votedisk_mbr", "assets/sounds/votedisk_mbr.mp3")
    this.load.audio("the_scene_is_dead", "assets/sounds/the_scene_is_dead.mp3")
    this.load.audio("la_galerie_marchande", "assets/sounds/la_galerie_marchande.mp3")
    this.load.audio("explode", "assets/sounds/explode.wav")
    this.load.audio("explode_alt", "assets/sounds/explode_alt.wav")
    this.load.audio("laser", "assets/sounds/laser.wav")
    this.load.audio("coin", "assets/sounds/coin.wav")
  }
}
