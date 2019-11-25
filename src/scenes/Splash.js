const { version } = require('../../package.json');
import Phaser from 'phaser'
import WatchJS from 'melanke-watchjs';
import meSpeak from 'mespeak';

var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;

const slideDelay = 3000;

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'SplashScene' })
  }

  preload () {
    this.cameras.main.setBackgroundColor(0x000000)
    this.sfx = {
      explode: this.sound.add("explode")
    }

    meSpeak.loadConfig(require("mespeak/src/mespeak_config.json"))
    meSpeak.loadVoice(require("mespeak/voices/en/en-us.json"))
  }

  create () {
    let background = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'space')
    background.setAlpha(0)

    this.slides = [];
    let slide;

    // MGK
    slide = { container: this.add.container(this.game.config.width / 2, this.game.config.height / 2) };

    slide.container.add([
      this.add.bitmapText(0, 0, 'white', 'DEVELOPED BY', 8).setOrigin(0.5),
      this.add.bitmapText(0, 15, 'orange_shadow', 'MGK', 16).setOrigin(0.5)
    ]);

    slide.before = () => {
      meSpeak.speak("developed by M G K")
    }

    this.slides.push(slide);

    // BLOOD
    slide = { container: this.add.container(this.game.config.width / 2, this.game.config.height / 2) };

    slide.container.add([
      this.add.bitmapText(0, 0, 'white', 'DESIGNED BY', 8).setOrigin(0.5),
      this.add.bitmapText(0, 15, 'orange_shadow', 'BLOOD', 16).setOrigin(0.5)
    ]);

    slide.before = () => {
      meSpeak.speak("designed by Blud")
    }

    this.slides.push(slide);

    // Credits
    slide = { container: this.add.container(this.game.config.width / 2, 130) };
    let top = 0;

    slide.container.add([
      this.add.bitmapText(0, top += 15, 'white_shadow', 'THIS IS ANOTHER', 8).setOrigin(0.5),
      this.add.bitmapText(0, top += 15, 'white_shadow', 'OPEN-SOURCE PROJECT', 8).setOrigin(0.5),
      this.add.bitmapText(0, top += 15, 'white_shadow', 'FROM 4SUCRES.ORG', 8).setOrigin(0.5),
      this.add.bitmapText(0, top += 45, 'indigo', 'MUSIC BY DUBMOOD', 8).setOrigin(0.5),
      this.add.bitmapText(0, top += 15, 'orange', 'POWERED BY SUCRESWARE', 8).setOrigin(0.5)
    ]);

    slide.before = () => {
      meSpeak.speak("seucraeiWare!",  {
        pitch: 20,
        speed: 125,
        wordgap: 3
      })
    }

    this.slides.push(slide);
    this.slides.forEach((slide) => slide.container.setAlpha(0));

    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.input.addPointer(1);

    watch(this.input.pointer1, "isDown", (key, action, value) => value ? this.skip() : '')
    watch(this.keySpace, "isDown", (key, action, value) => value ? this.skip() : '')

    this.time.addEvent({
      delay: slideDelay,
      callback: () => this.next(this.currentSlide + 1),
      callbackScope: this,
      loop: true
    })

    this.currentSlide = -1;
    this.next(0);
  }

  next(nextSlide) {
    if (nextSlide == this.slides.length) return this.skip()

    this.slides.forEach((slide) => slide.container.setAlpha(0))
    this.slides[nextSlide].container.setAlpha(1)

    if (this.slides[nextSlide].before !== undefined) {
      this.slides[nextSlide].before();
    }

    this.sfx.explode.play()
    this.cameras.main.shake(200, 0.05)

    this.currentSlide++;
  }

  skip() {
    unwatch(this.input.pointer1, 'isDown');
    unwatch(this.keySpace, 'isDown');
    this.scene.start('MenuScene');
  }
}
