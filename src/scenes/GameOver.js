import Phaser from 'phaser';
import ChooseLevelScene from './ChooseLevel';
import WatchJS from 'melanke-watchjs';
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'GameOverScene' })
  }

  init (data) {
    this.loaded = data.loaded || false
  }

  preload () {
    // Assets loaded by MenuScene
  }

  create () {
    /**
      Transition
    */
    this.cameras.main.shake(200, 0.01)
    this.cameras.main.setZoom(2);
    this.cameras.main.zoomTo(1, 50);

    let background = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'space')

    /**
      Draw GUI
    */
    let top = 90;
    let wCenter = this.game.config.width / 2;

    let title = this.add.bitmapText(wCenter, top, 'white', 'GAME OVER!', 16).setOrigin(0.5)
    this.tweens.add({targets: title, y: top - 10, duration: 2000, ease: 'Sine.easeInOut', repeat: -1, yoyo: true});

    if (window.platform == 'desktop') {
      this.add.bitmapText(wCenter, this.game.config.height - 40, 'white', 'PRESS ENTER TO RETRY', 8).setOrigin(0.5)
      this.add.bitmapText(wCenter, this.game.config.height - 20, 'white', 'PRESS A FOR MENU', 8).setOrigin(0.5)

      this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
      this.keyMenu = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)

      watch(this.keyEnter, "isDown", (key, action, value) => value ? this.retry() : '') // Watch if ENTER is pressed
      watch(this.keyMenu, "isDown", (key, action, value) => value ? this.goToMenu() : '') // Watch if A key is pressed
    } else {
      let next = this.add.bitmapText(wCenter, this.game.config.height - 60, 'white', 'RETRY', 16).setOrigin(0.5)
      let back = this.add.bitmapText(10, 10, 'white', 'BACK TO MENU', 8)

      next.setInteractive()
      next.on('pointerdown', () => this.retry());

      back.setInteractive()
      back.on('pointerdown', () => this.goToMenu());
    }
  }

  retry() {
    this.removeWatchers();

    this.scene.start('GameScene', { loaded : false }) // Force assets reload
  }

  goToMenu () {
    this.removeWatchers();
    this.scene.start('MenuScene')
  }

  removeWatchers() {
    if (window.platform == 'desktop') {
      unwatch(this.keyEnter, "isDown");
      unwatch(this.keyMenu, "isDown");
    }
  }
}
