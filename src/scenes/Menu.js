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
    this.bgm = this.sound.add("the_scene_is_dead");

    this.bgm.addMarker({
      name: 'intro',
      start: 4.3,
      duration: 46.5
    });

    this.time.addEvent({
      delay: 46.5 * 1000,
      callback: function() {
        this.scene.start("SplashScene");
      },
      callbackScope: this,
      loop: false
    });

    this.bgm.play('intro')
    this.cameras.main.setZoom(2);
    this.cameras.main.zoomTo(1, 50);

    let background = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'space')

    let top = 170;

    let logo = this.add.sprite(this.game.config.width / 2, top, 'logo').setScale(1.2)
    let flare = this.add.sprite(this.game.config.width / 2, top, 'flare').setScale(1.2)

    tween = this.tweens.add({
        targets: [ logo, flare ],
        y: top - 5,
        duration: 2000,
        ease: 'Sine.easeInOut',
        repeat: -1,
        repeatDelay: 1000,
        hold: 500,
        yoyo: true,
    });

    top += 50;

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

    let label = window.mobile ? 'TOUCH TO START' : 'PRESS SPACE TO START'
    let start = this.add.bitmapText(this.game.config.width / 2, top, 'white_shadow', label, 8).setOrigin(0.5)

    var tween = this.tweens.add({
        targets: [ start ],
        alpha: 0,
        duration: 0,
        ease: 'Sine.easeInOut',
        repeat: -1,
        repeatDelay: 1000,
        hold: 1000,
        yoyo: true,
    });

    top += 15;
    this.add.bitmapText(this.game.config.width / 2, top, 'white_shadow', '© 2019 SUCRESWARE', 8).setOrigin(0.5)
    top += 15;
    this.add.bitmapText(this.game.config.width / 2, top, 'white_shadow', 'V' + version, 8).setOrigin(0.5)

    this.add.bitmapText(this.game.config.width / 2, this.game.config.height - 10, 'white_shadow', 'PRESS S TO ENTER SETTINGS', 8).setOrigin(0.5)

    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.keySettings = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.input.addPointer(1);
  }
  update () {
    if (this.keySpace.isDown || this.input.pointer1.isDown) {
      this.bgm.stop()
      this.scene.start('GameScene')
    } else if (this.keySettings.isDown) {
      this.scene.start('SettingsScene')
    }
  }
}
