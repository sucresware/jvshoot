const { version } = require('../../package.json');
import Phaser from 'phaser'
import WatchJS from 'melanke-watchjs';
import meSpeak from 'mespeak';

var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'SplashScene' })
  }

  init (data) {
    this.loaded = data.loaded || false
  }

  loadAssets() {
    meSpeak.loadConfig(require("mespeak/src/mespeak_config.json"))
    meSpeak.loadVoice(require("mespeak/voices/en/en-us.json"))

    this.scene.start('LoadingScene', {
      nextScene: 'SplashScene',
      assetsFn: function(){
        // Bitmap Fonts
        let fonts = ['white', 'indigo', 'orange', 'red', 'green'];
        fonts.forEach(font => {
          this.load.bitmapFont(font, './assets/fonts/' + font + '.png', './assets/fonts/' + font + '.xml')
        })
      },
      assets: [
        { type: 'audio', key: "the_courier", path: "assets/sounds/the_courier.mp3"}
      ]
    })
  }

  preload () {
    if (!this.loaded) return this.loadAssets()

    this.cameras.main.setBackgroundColor(0x000000)
    this.bgm = this.sound.add("the_courier");
  }

  create () {
    if (!this.loaded) return

    let background = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'space')
    background.setAlpha(0)

    this.slides = [];
    let slide;

    // FIRST SLIDE
    slide = { container: this.add.container(0, 0) };

    // slide.container.add([]);

    slide.before = () => {
      this.bgm.play({ volume: window.settings.volumes.music })
    }

    this.slides.push(slide);

    // MGK
    slide = { container: this.add.container(this.game.config.width / 2, (this.game.config.height / 2) - 20) };

    slide.container.add([
      // this.add.text(0, 0, 'DEVELOPED BY', { fontFamily: 'PressStart2P', fontSize: '16px'}).setOrigin(0.5),
      // this.add.text(0, 30, 'MGK', { fontFamily: 'PressStart2P', fontSize: '24px'}).setOrigin(0.5),
      this.add.bitmapText(0, 0, 'white', 'DEVELOPED BY', 16).setOrigin(0.5),
      this.add.bitmapText(0, 30, 'orange', 'MGK', 32).setOrigin(0.5)
    ]);

    slide.before = () => {
      meSpeak.speak("developed by M G K", { volume: window.settings.volumes.sfx })
    }

    this.slides.push(slide);

    // BLOOD
    slide = { container: this.add.container(this.game.config.width / 2, (this.game.config.height / 2) - 20) };

    slide.container.add([
      this.add.bitmapText(0, 0, 'white', 'DESIGNED BY', 16).setOrigin(0.5),
      this.add.bitmapText(0, 30, 'orange', 'BLOOD', 32).setOrigin(0.5)
    ]);

    slide.before = () => meSpeak.speak("designed by Blud", { volume: window.settings.volumes.sfx })

    this.slides.push(slide);

    // SUCRESWARE
    slide = { container: this.add.container(this.game.config.width / 2, this.game.config.height / 2) };

    slide.container.add([
      this.add.bitmapText(0, 0, 'orange', 'SUCRESWARE', 32).setOrigin(0.5)
    ]);

    slide.before = () => {
      this.cameras.main.setZoom(0.1);
      this.cameras.main.zoomTo(1, 1000);
      meSpeak.speak("powered by", { volume: window.settings.volumes.sfx })
      setTimeout(() => {
          meSpeak.speak("seucruhWare",  { pitch: 10, speed: 125, wordgap: 3, volume: window.settings.volumes.sfx })
        }, 800);
    }

    slide.after = () => {
      this.cameras.main.setZoom(1)
    }

    this.slides.push(slide);

    // Credits
    slide = { container: this.add.container(this.game.config.width / 2, (this.game.config.height / 2) - 100) };
    var top = 0;

    slide.container.add([
      this.add.bitmapText(0, top += 30, 'white', 'THIS IS ANOTHER', 16).setOrigin(0.5),
      this.add.bitmapText(0, top += 30, 'white', 'OPEN-SOURCE PROJECT', 16).setOrigin(0.5),
      this.add.bitmapText(0, top += 30, 'white', 'FROM 4SUCRES.ORG', 16).setOrigin(0.5),
      this.add.bitmapText(0, top += 70, 'indigo', 'MUSIC BY DUBMOOD', 16).setOrigin(0.5)
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
    if (!this.loaded) return

    if (
      (this.bgm.seek >= 4.8 && this.currentSlide == 0)
      || (this.bgm.seek >= 8.8 && this.currentSlide == 1)
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
    this.scene.start('MenuScene')
  }
}
