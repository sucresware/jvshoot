const { version } = require('../../package.json');
import Phaser from 'phaser'

const slideDelay = 2000;

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'SplashScene' })
  }

  preload () {
    this.cameras.main.setBackgroundColor(0x000000)
  }

  create () {
    let explode = this.sound.add("explode")
    let explode_alt = this.sound.add("explode_alt")

    let background = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'space')
    // background.setScale(2)
    background.setAlpha(0)

    this.slides = {
      intro: this.add.group(),
      credits: this.add.group(),
    }

    this.cameras.main.shake(200, 0.01)
    explode_alt.play()

    // Intro
    let text = this.add.bitmapText(this.game.config.width / 2, this.game.config.height / 2, 'white_shadow', 'SUCRESWARE', 16).setOrigin(0.5)
    this.slides.intro.add(text);

    // Credits
    let left = 20;
    let top = 110;

    text = this.add.bitmapText(left, top, 'white', 'THIS IS ANOTHER', 8)
    this.slides.credits.add(text)
    top += 15;
    text = this.add.bitmapText(left, top, 'white', 'OPEN-SOURCE PROJECT FROM', 8)
    this.slides.credits.add(text)
    top += 15;
    text = this.add.bitmapText(left, top, 'white_shadow', '4SUCRES.ORG', 16)
    this.slides.credits.add(text)
    top += 60;

    text = this.add.bitmapText(left, top, 'indigo', 'DEVELOPED BY', 8)
    this.slides.credits.add(text)
    top += 15;
    text = this.add.bitmapText(left, top, 'white_shadow', 'MGK', 16)
    this.slides.credits.add(text)
    top += 30;
    text = this.add.bitmapText(left, top, 'indigo', 'DESIGNED BY', 8)
    this.slides.credits.add(text)
    top += 15;
    text = this.add.bitmapText(left, top, 'white_shadow', 'BLOOD', 16)
    this.slides.credits.add(text)
    top += 30;
    text = this.add.bitmapText(left, top, 'indigo', 'MUSIC FROM', 8)
    this.slides.credits.add(text)
    top += 15;
    text = this.add.bitmapText(left, top, 'white_shadow', 'DUBMOOD', 16)
    this.slides.credits.add(text)
    // top += 30;

    Phaser.Actions.SetAlpha(this.slides.credits.getChildren(), 0);

    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    this.time.addEvent({
      delay: slideDelay,
      callback: () => {
        this.cameras.main.shake(200, 0.05)
        explode.play()

        Phaser.Actions.SetAlpha(this.slides.intro.getChildren(), 0);
        Phaser.Actions.SetAlpha(this.slides.credits.getChildren(), 1);
        background.setAlpha(1)

        this.time.addEvent({
          delay: slideDelay * 2,
          callback: () => this.scene.start('MenuScene'),
          callbackScope: this,
          loop: false
        })
      },
      callbackScope: this,
      loop: false
    })
  }
  update () {
    if (this.keySpace.isDown) {
      this.scene.start('MenuScene')
    }
  }
}
