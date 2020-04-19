const { version } = require('../../package.json');
import Phaser from 'phaser'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'MenuScene' })

    this.firstTime = true;
  }

  init (data) {
    this.loaded = data.loaded || false
  }

  loadAssets() {
    /* Load assets for
      - MenuScene
      - SettingsScene
      - ChooseLevelScene
      - LevelClearScene
    */
    this.scene.start('LoadingScene', {
      nextScene: 'MenuScene',
      assets: [
        { type: 'image', key: "space", path: "assets/images/space.png" },
        { type: 'image', key: 'logo', path: 'assets/images/logo.png' },
        { type: 'image', key: "arrow", path: "assets/images/arrow.png" },
        { type: 'image', key: "checkbox", path: "assets/images/checkbox.png" },
        { type: 'image', key: "checkbox_ok", path: "assets/images/checkbox_ok.png" },
        { type: 'spritesheet', key: "flare", path: "assets/images/flare.png", options: { frameWidth: 138, frameHeight: 64 } },
        { type: 'audio', key: "the_courier", path: "assets/sounds/the_courier.mp3" },
        { type: 'audio', key: "the_scene_is_dead", path: "assets/sounds/the_scene_is_dead.mp3" },
        { type: 'audio', key: "explode", path: "assets/sounds/explode.wav" },
      ]
    })
  }

  preload () {
    if (!this.loaded) return this.loadAssets()

    if (this.firstTime) {
      this.bgm = this.sound.add("the_courier");
      this.bgm.addMarker({ name: 'intro', start: 20.35 });
      this.sfx = { explode: this.sound.add("explode") }

      this.firstTime = false;
    }
  }

  create () {
    if (!this.loaded) return

    if (window.settings.effects >= 1) this.cameras.main.shake(200, 0.01);
    this.sfx.explode.play({ volume: window.settings.volumes.sfx })

    this.time.addEvent({
      delay: 70 * 1000,
      callback: function() {
        this.bgm.stop()
        this.scene.start("SplashScene");
      },
      callbackScope: this,
      loop: false
    });

    this.bgm.play('intro', { volume: window.settings.volumes.music })
    this.cameras.main.setZoom(2);
    this.cameras.main.zoomTo(1, 50);

    let background = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'space')

    this.add.bitmapText(this.game.config.width - 10, 10, 'orange', window.state.coins + ' COINS', 12).setOrigin(1, 0)

    let top = 170;

    let logo = this.add.sprite(this.game.config.width / 2, top, 'logo').setScale(2)
    let flare = this.add.sprite(this.game.config.width / 2, top, 'flare').setScale(2)

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

    top += 100;

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
    let start = this.add.bitmapText(this.game.config.width / 2, top, 'white', label, 16).setOrigin(0.5)

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

    top += 30;
    this.add.bitmapText(this.game.config.width / 2, top, 'white', '© 2019 SUCRESWARE', 8).setOrigin(0.5)
    top += 30;
    this.add.bitmapText(this.game.config.width / 2, top, 'white', 'V' + version, 8).setOrigin(0.5)

    this.add.bitmapText(this.game.config.width / 2, this.game.config.height - 20, 'white', 'PRESS S TO ENTER SETTINGS', 8).setOrigin(0.5)

    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.keySettings = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)

    this.input.addPointer(1);
  }

  update () {
    if (!this.loaded) return

    if (this.keySpace.isDown || this.input.pointer1.isDown) {
      this.bgm.stop()
      this.scene.start('ChooseLevelScene')
    } else if (this.keySettings.isDown) {
      this.bgm.stop()
      this.scene.start('SettingsScene')
    }
  }
}
