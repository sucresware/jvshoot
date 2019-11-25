const { version } = require('../../package.json');
import Phaser from 'phaser'
import WatchJS from 'melanke-watchjs';
import meSpeak from 'mespeak';

var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;

var loaded = false;

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'SplashScene' })
  }

  preload () {
    this.cameras.main.setBackgroundColor(0x000000)

    if (!loaded) {
      meSpeak.loadConfig(require("mespeak/src/mespeak_config.json"))
      meSpeak.loadVoice(require("mespeak/voices/en/en-us.json"))
      loaded = true;
    }

    this.bgm = this.sound.add("the_courier");
  }

  create () {
    let background = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'space')
    background.setAlpha(0)

    this.slides = [];
    let slide;

    // SEIZURES
    slide = { container: this.add.container(this.game.config.width / 2, 120) };
    var top = 0;

    slide.container.add([
      this.add.bitmapText(0, top += 40, 'red', 'WARNING', 16).setOrigin(0.5),
      this.add.bitmapText(0, top += 40, 'white', 'THIS GAME HAS BEEN', 8).setOrigin(0.5),
      this.add.bitmapText(0, top += 15, 'white', 'IDENTIFIED TO POTENTIALLY', 8).setOrigin(0.5),
      this.add.bitmapText(0, top += 15, 'white', 'TRIGGER SEIZURES', 8).setOrigin(0.5),
      this.add.bitmapText(0, top += 15, 'white', 'FOR PEOPLE WITH', 8).setOrigin(0.5),
      this.add.bitmapText(0, top += 15, 'white', 'PHOTOSENSITIVE EPILEPSY', 8).setOrigin(0.5)
    ]);

    slide.before = () => this.bgm.play({ volume: window.settings.volMusic })

    this.slides.push(slide);

    // MGK
    slide = { container: this.add.container(this.game.config.width / 2, 200) };

    slide.container.add([
      this.add.bitmapText(0, 0, 'white', 'DEVELOPED BY', 8).setOrigin(0.5),
      this.add.bitmapText(0, 15, 'orange_shadow', 'MGK', 16).setOrigin(0.5)
    ]);

    slide.before = () => meSpeak.speak("developed by M G K")

    this.slides.push(slide);

    // BLOOD
    slide = { container: this.add.container(this.game.config.width / 2, 200) };

    slide.container.add([
      this.add.bitmapText(0, 0, 'white', 'DESIGNED BY', 8).setOrigin(0.5),
      this.add.bitmapText(0, 15, 'orange_shadow', 'BLOOD', 16).setOrigin(0.5)
    ]);

    slide.before = () => meSpeak.speak("designed by Blud")

    this.slides.push(slide);

    // SUCRESWARE
    slide = { container: this.add.container(this.game.config.width / 2, this.game.config.height / 2) };

    slide.container.add([
      this.add.bitmapText(0, 0, 'orange_shadow', 'SUCRESWARE', 16).setOrigin(0.5)
    ]);

    slide.before = () => {
      this.cameras.main.setZoom(0.1);
      this.cameras.main.zoomTo(1, 300);
      this.cameras.main.setBackgroundColor(0x050710)

      meSpeak.speak("seucruhWare!",  {
        pitch: 10,
        speed: 125,
        wordgap: 3
      })
    }

    slide.after = () => {
      this.cameras.main.setZoom(1, 300);
      this.cameras.main.setBackgroundColor(0x000000)
    }

    this.slides.push(slide);

    // Credits
    slide = { container: this.add.container(this.game.config.width / 2, 150) };
    var top = 0;

    slide.container.add([
      this.add.bitmapText(0, top += 15, 'white_shadow', 'THIS IS ANOTHER', 8).setOrigin(0.5),
      this.add.bitmapText(0, top += 15, 'white_shadow', 'OPEN-SOURCE PROJECT', 8).setOrigin(0.5),
      this.add.bitmapText(0, top += 15, 'white_shadow', 'FROM 4SUCRES.ORG', 8).setOrigin(0.5),
      this.add.bitmapText(0, top += 45, 'indigo', 'MUSIC BY DUBMOOD', 8).setOrigin(0.5)
    ]);

    this.slides.push(slide);

    this.slides.forEach((slide) => slide.container.setAlpha(0));

    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.input.addPointer(1);

    watch(this.input.pointer1, "isDown", (key, action, value) => value ? this.skip() : '')
    watch(this.keySpace, "isDown", (key, action, value) => value ? this.skip() : '')

    this.currentSlide = -1;
    this.next(0);
  }

  update() {
    if (
      (this.bgm.seek >= 4.4 && this.currentSlide == 0)
      || (this.bgm.seek >= 8.6 && this.currentSlide == 1)
      || (this.bgm.seek >= 12.8 && this.currentSlide == 2)
      || (this.bgm.seek >= 16.8 && this.currentSlide == 3)
      || (this.bgm.seek >= 20.5 && this.currentSlide == 4)
    ) this.next(this.currentSlide + 1)
  }

  next(nextSlide) {
    if (nextSlide == this.slides.length) return this.skip()

    if (this.slides[this.currentSlide] !== undefined && this.slides[this.currentSlide].after !== undefined) {
      this.slides[this.currentSlide].after();
    }

    this.slides.forEach((slide) => slide.container.setAlpha(0))
    this.slides[nextSlide].container.setAlpha(1)

    if (this.slides[nextSlide].before !== undefined) {
      this.slides[nextSlide].before();
    }

    this.currentSlide++;
  }

  skip() {
    unwatch(this.input.pointer1, 'isDown');
    unwatch(this.keySpace, 'isDown');
    this.bgm.stop();
    this.scene.start('MenuScene');
  }
}
