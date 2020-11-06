const { version } = require('../../package.json');
import Phaser from 'phaser'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'FacebookMenuScene' })

    this.firstTime = true;
  }

  init (data) {
    this.loaded = data.loaded || false
  }

  preload () {
   if (this.firstTime) {
      this.bgm = this.sound.add("exciter");
      this.sfx = { explode: this.sound.add("explode") }

      this.firstTime = false;
    }
  }

  create () {
    if (window.settings.effects >= 1) this.cameras.main.shake(200, 0.01);
    this.sfx.explode.play({ volume: window.settings.volumes.sfx })

    this.bgm.play({
      volume: window.settings.volumes.music,
    })

    this.cameras.main.setZoom(2);
    this.cameras.main.zoomTo(1, 50);

    let background = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'space')
    let top = 260;

    let logo = this.add.sprite(this.game.config.width / 2, top, 'logo').setScale(2)
    let flare = this.add.sprite(this.game.config.width / 2, top, 'flare').setScale(2)

    this.tweens.add({
        targets: [ logo, flare ],
        y: top - 5,
        duration: 2000,
        ease: 'Sine.easeInOut',
        repeat: -1,
        repeatDelay: 1000,
        hold: 500,
        yoyo: true,
    });

    this.anims.create({
      key: "flare",
      frames: this.anims.generateFrameNumbers("flare"),
      frameRate: 30
    })

    this.time.addEvent({
      delay: 5000,
      callback: function() {
        flare.anims.play('flare')
        flare.anims.restart('flare')
      },
      callbackScope: this,
      loop: true
    });

    if (window.platform == 'desktop') {
      let start = this.add.bitmapText(this.game.config.width / 2, top += 200, 'white', 'PRESS SPACE TO START', 16).setOrigin(0.5)

      this.tweens.add({
          targets: [ start ],
          alpha: 0,
          duration: 0,
          ease: 'Sine.easeInOut',
          repeat: -1,
          repeatDelay: 1000,
          hold: 1000,
          yoyo: true,
      });

      this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      this.keySettings = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)

      this.add.bitmapText(this.game.config.width / 2, top += 30, 'white', 'PRESS S TO ENTER SETTINGS', 8).setOrigin(0.5)
    } else {
      let start = this.add.bitmapText(this.game.config.width / 2, top += 200, 'white', 'PLAY', 16).setOrigin(0.5)
      // let settings = this.add.bitmapText(this.game.config.width / 2, top += 50, 'white', 'SETTINGS', 16).setOrigin(0.5)

      start.setInteractive()
      start.on('pointerdown', () => this.play());

      // settings.setInteractive()
      // settings.on('pointerdown', () => this.settings());
    }

    this.add.bitmapText(this.game.config.width / 2, this.game.config.height - 20, 'white', '© SUCRESWARE' + ' - V' + version + ' - P.' + window.platform.toUpperCase(), 8).setOrigin(0.5)
  }

  update () {
    if (window.platform == 'desktop') {
      if (this.keySpace.isDown) {
        this.play()
      } else if (this.keySettings.isDown) {
        this.settings()
      }
    }
  }

  play() {
    this.bgm.stop()

    window.selectedLevel = 4 // ArcadeLevel
    this.scene.start('GameScene', { loaded : true }) // Assets loaded
  }
}
