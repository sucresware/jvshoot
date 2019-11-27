import Phaser from 'phaser';
import WatchJS from 'melanke-watchjs';

var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;

var selected = 0; // Selected setting (0: volumes.sfx, 1: volumes.music, 2: particlesCB)

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'SettingsScene' })
  }

  preload () {
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

    let top = 40;
    let left = 20;

    let title = this.add.bitmapText(this.game.config.width / 2, top, 'white', 'SETTINGS', 16).setOrigin(0.5)
    this.tweens.add({targets: title, y: top - 10, duration: 2000, ease: 'Sine.easeInOut', repeat: -1, yoyo: true});

    top += 40;
    this.test = this.add.bitmapText(left, top, 'indigo', 'SOUNDS', 16)
    top += 28;

    this.effectText = this.add.bitmapText(left + 10, top, 'white', 'EFFECT', 8)
    this.sfxText = this.add.bitmapText(this.game.config.width / 2, top, 'white', '', 8)

		this.lSelect = this.add.sprite(this.game.config.width / 2 - 10, top + 4, 'arrow').setScale(-1)
		this.rSelect = this.add.sprite(this.game.config.width / 2 + 17, top + 4, 'arrow')

    top += 20;

    this.musiK = this.add.bitmapText(left + 10, top, 'white', 'MUSIC', 8)
    this.musicText = this.add.bitmapText(this.game.config.width / 2, top, 'white', '', 8)
    this.lSelect2 = this.add.sprite(this.game.config.width / 2 - 10, top + 4, 'arrow').setScale(-1)
    this.rSelect2 = this.add.sprite(this.game.config.width / 2 + 17, top + 4, 'arrow')

    top += 30;
    this.add.bitmapText(left, top, 'indigo', 'TWEAKS', 16)
    top += 28;

    this.particlesText = this.add.bitmapText(left + 10, top, 'white', 'EFFECTS', 8)
    this.effectsText = this.add.bitmapText(this.game.config.width / 2, top, 'white', '', 8)
    this.lSelect3 = this.add.sprite(this.game.config.width / 2 - 10, top + 4, 'arrow').setScale(-1)
    this.rSelect3 = this.add.sprite(this.game.config.width / 2 + 95, top + 4, 'arrow')

    top += 20;

    this.scalingText = this.add.bitmapText(left + 10, top, 'white', 'SCALING', 8)
    this.scalingModeText = this.add.bitmapText(this.game.config.width / 2, top, 'white', '', 8)
    this.lSelect4 = this.add.sprite(this.game.config.width / 2 - 10, top + 4, 'arrow').setScale(-1)
    this.rSelect4 = this.add.sprite(this.game.config.width / 2 + 95, top + 4, 'arrow')

    // this.particlesCB = this.add.sprite(this.game.config.width / 2 + 4, top + 4, 'checkbox')

    top += 20;

    this.add.bitmapText(this.game.config.width / 2, this.game.config.height - 10, 'white', 'PRESS A FOR MENU', 8).setOrigin(0.5)

    this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
    this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
    this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.keyMenu = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)

    watch(this.keyRight, "isDown", (key, action, value) => value ? this.change('right') : '') // Watch if D key is pressed
    watch(this.keyLeft, "isDown", (key, action, value) => value ? this.change('left') : '') // Watch if Q key is pressed
    watch(this.keySpace, "isDown", (key, action, value) => value ? this.change('space') : '') // Watch if SPACE is pressed
    watch(this.keyUp, "isDown", (key, action, value) => value ? this.select('up') : '') // Watch if Z key is pressed
    watch(this.keyDown, "isDown", (key, action, value) => value ? this.select('down') : '') // Watch if S key is pressed
    watch(this.keyMenu, "isDown", (key, action, value) => value ? this.goToMenu() : '') // Watch if A key is pressed

    this.selectedText = [this.effectText, this.musiK, this.particlesText, this.scalingText];

    this.blinkSelected(0)
    this.refreshGui()
  }

  change (key) {
    switch (selected) {
      case 0:
        window.settings.volumes.sfx *= 10; // Javascript rulez

        if (key === 'right') window.settings.volumes.sfx++;
        else if (key === 'left') window.settings.volumes.sfx--;

        window.settings.volumes.sfx = Phaser.Math.Clamp(window.settings.volumes.sfx, 0, 10);

        window.settings.volumes.sfx /= 10;
        break;
      case 1:
        window.settings.volumes.music *= 10; // Javascript rulez

        if (key === 'right') window.settings.volumes.music++;
        else if (key === 'left') window.settings.volumes.music--;

        window.settings.volumes.music = Phaser.Math.Clamp(window.settings.volumes.music, 0, 10);

        if (window.settings.volumes.music == 0) this.bgm.pause()
        else this.bgm.resume()

        window.settings.volumes.music /= 10;

        this.bgm.setVolume(window.settings.volumes.music)
        break;
      case 2:
        if (key === 'right') window.settings.effects++
        else if (key === 'left') window.settings.effects--

        window.settings.effects = Phaser.Math.Clamp(window.settings.effects, 0, 2);
        break;
      case 3:
        if (key === 'right') window.settings.zoom += 0.5
        else if (key === 'left') window.settings.zoom -= 0.5

        window.settings.zoom = Phaser.Math.Clamp(window.settings.zoom, -0.5, 2);
        break;
      // case 3:
      //   if (key !== 'space') break;

      //   window.settings.effects = !window.settings.effects
      // break;
    }

    this.refreshGui()
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
    this.rSelect.setVisible(true)
    this.lSelect.setVisible(true)

    if (window.settings.volumes.sfx == 1) {
      this.rSelect.setVisible(false)
    } else if (window.settings.volumes.sfx == 0) {
      this.lSelect.setVisible(false)
    }

    this.rSelect2.setVisible(true)
    this.lSelect2.setVisible(true)

    if (window.settings.volumes.music == 1) {
      this.rSelect2.setVisible(false)
    } else if (window.settings.volumes.music == 0) {
      this.lSelect2.setVisible(false)
    }

    this.rSelect3.setVisible(true)
    this.lSelect3.setVisible(true)

    if (window.settings.effects == 2) {
      this.rSelect3.setVisible(false)
    } else if (window.settings.effects == 0) {
      this.lSelect3.setVisible(false)
    }

    this.rSelect4.setVisible(true)
    this.lSelect4.setVisible(true)

    if (window.settings.zoom == 2) {
      this.rSelect4.setVisible(false)
    } else if (window.settings.zoom == -0.5) {
      this.lSelect4.setVisible(false)
    }

    this.sfxText.setText(window.settings.volumes.sfx * 10)
    this.musicText.setText(window.settings.volumes.music * 10)

    if (window.settings.effects == 0) this.effectsText.setText('NONE')
    if (window.settings.effects == 1) this.effectsText.setText('MEDIUM')
    if (window.settings.effects == 2) this.effectsText.setText('ULTRA')

    this.scalingModeText.setText('X' + window.settings.zoom)
    if (window.settings.zoom == -0.5) this.scalingModeText.setText('MOBILE')
    if (window.settings.zoom == 0) this.scalingModeText.setText('FULLSCREEN')

    // Apply zoom :
    this.scale.setGameSize(this.game.config.width, this.game.config.height)

    if (window.settings.zoom == -0.5) {
      let scaleFactor = window.innerHeight / this.game.config.height;
      let width = window.innerWidth / scaleFactor;
      this.scale.setGameSize(width, this.game.config.height)
      this.scale.setZoom(scaleFactor)
    } else if (window.settings.zoom == 0) {
      let scaleFactor = (window.innerHeight - 60) / this.game.config.height;
      this.scale.setZoom(scaleFactor)
    } else {
      this.scale.setZoom(window.settings.zoom)
    }

    // this.particlesCB.setTexture(window.settings.effects ? 'checkbox' : 'checkbox_ok')
  }

  saveSettings(){
    localStorage.setItem('settings', JSON.stringify(window.settings));
  }

  goToMenu () {
    this.bgm.stop()
    this.saveSettings()
    this.scene.start('MenuScene')
  }
}
