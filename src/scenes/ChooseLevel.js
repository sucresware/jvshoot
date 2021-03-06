import Phaser from 'phaser';
import WatchJS from 'melanke-watchjs';

import TutorialLevel from '../levels/TutorialLevel';
import Level1 from '../levels/Level1';
import Level2 from '../levels/Level2';
import OlinuxLevel from '../levels/OlinuxLevel';
import ArcadeLevel from '../levels/ArcadeLevel';

var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;

var selected = 0; // Selected setting (0: volumes.sfx, 1: volumes.music, 2: particlesCB)

export default class ChooseLevelScene extends Phaser.Scene {
  static levels = [TutorialLevel, Level1, Level2, OlinuxLevel, ArcadeLevel];

  constructor () {
    super({ key: 'ChooseLevelScene' })
  }

  init (data) {
    this.loaded = data.loaded || false
  }

  preload () {
    // Assets loaded by MenuScene

    this.bgm = this.sound.add("the_scene_is_dead");

    this.bgm.addMarker({
      name: 'intro',
      start: 4.3,
      duration: 46.5
    });
  }

  create () {
    this.bgm.play('intro', { volume: window.settings.volumes.music })
    this.sound.add("explode").play({ volume: window.settings.volumes.sfx })

    this.cameras.main.shake(200, 0.01)
    this.cameras.main.setZoom(2);
    this.cameras.main.zoomTo(1, 50);

    let background = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'space')

    let top = 90;
    let wCenter = this.game.config.width / 2;

    let title = this.add.bitmapText(wCenter, top, 'white', 'CHOOSE A LEVEL', 16).setOrigin(0.5)
    this.tweens.add({targets: title, y: top - 10, duration: 2000, ease: 'Sine.easeInOut', repeat: -1, yoyo: true});

    this.levelValueText = this.add.bitmapText(wCenter, top += 60, 'white', '', 8).setOrigin(0.5);
		this.levelSelectL = this.add.sprite(wCenter - 100, top, 'arrow').setScale(-1);
		this.levelSelectR = this.add.sprite(wCenter + 100, top, 'arrow');

    this.levelValue = window.selectedLevel || 0;

    if (window.platform == 'desktop') {
      this.add.bitmapText(wCenter, this.game.config.height - 40, 'white', 'PRESS SPACE TO START', 8).setOrigin(0.5)
      this.add.bitmapText(wCenter, this.game.config.height - 20, 'white', 'PRESS A FOR MENU', 8).setOrigin(0.5)
    } else {
      let start = this.add.bitmapText(wCenter, this.game.config.height - 60, 'white', 'START', 16).setOrigin(0.5)
      let back = this.add.bitmapText(10, 10, 'white', 'BACK TO MENU', 8)

      start.setInteractive()
      start.on('pointerdown', () => this.start());

      back.setInteractive()
      back.on('pointerdown', () => this.goToMenu());
    }

    /**
      Events
    */
    this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.keyMenu = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)

    watch(this.keyRight, "isDown", (key, action, value) => value ? this.change('right') : '') // Watch if D key is pressed
    watch(this.keyLeft, "isDown", (key, action, value) => value ? this.change('left') : '') // Watch if Q key is pressed
    watch(this.keySpace, "isDown", (key, action, value) => value ? this.start() : '') // Watch if SPACE is pressed
    watch(this.keyMenu, "isDown", (key, action, value) => value ? this.goToMenu() : '') // Watch if A key is pressed

    this.levelSelectL.setInteractive()
    this.levelSelectL.on('pointerdown', () => this.change('left'));

    this.levelSelectR.setInteractive()
    this.levelSelectR.on('pointerdown', () => this.change('right'));

    this.selectedText = [this.levelTextValue];
    this.refreshGui()
  }

  change (key) {
    switch (selected) {
      case 0:
        if (key === 'right') this.levelValue++;
        else if (key === 'left') this.levelValue--;

        this.levelValue = Phaser.Math.Clamp(this.levelValue, 0, ChooseLevelScene.levels.length - 1);
        break;
    }

    this.refreshGui()
  }

  start() {
    this.removeWatchers()
    this.bgm.stop()
    window.selectedLevel = this.levelValue
    this.scene.start('GameScene', { loaded : false }) // Force assets reload
  }

  select (key) {
    switch (key) {
      case 'up':
        if (selected > 0 && selected <= this.selectedText.length - 1) {
          selected--;
          this.blinkSelected(selected);
        }
      break;
      case 'down':
        if (selected >= 0 && selected < this.selectedText.length - 1) {
          selected++;
          this.blinkSelected(selected);
        }
      break;
      default:
        console.log('Error key not recognized' + key)
    }
  }

  blinkSelected (selected) {
    if (this.selectedEffect !== undefined) this.selectedEffect.remove()

    for (var i = 0; i < this.selectedText.length; i++) { // reset alpha to 1 of all text in case tweens set alpha to 0
      this.selectedText[i].setAlpha(1)
    }

    this.selectedEffect = this.tweens.add({
      targets: this.selectedText[selected],
      alpha: 0,
      duration: 0,
      ease: 'Sine.easeInOut',
      repeat: -1,
      repeatDelay: 500,
      hold: 500,
      yoyo: true
    });
  }

  refreshGui() {
    this.levelSelectL.setVisible(true)
    this.levelSelectR.setVisible(true)

    if (this.levelValue == ChooseLevelScene.levels.length - 1) {
      this.levelSelectR.setVisible(false)
    } else if (this.levelValue == 0) {
      this.levelSelectL.setVisible(false)
    }

    this.levelValueText.setText((ChooseLevelScene.levels[this.levelValue].key).toUpperCase());
  }

  goToMenu () {
    this.removeWatchers()
    this.bgm.stop()
    this.scene.start('MenuScene')
  }

  removeWatchers() {
    unwatch(this.keyRight, "isDown");
    unwatch(this.keyLeft, "isDown");
    unwatch(this.keySpace, "isDown");
    unwatch(this.keyMenu, "isDown");
  }
}
