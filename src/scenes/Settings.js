import Phaser from 'phaser';
import WatchJS from 'melanke-watchjs';

var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;

var volEffect; // Effect volume var 0-10
var volMusic; // Music volume var 0-10
var selected = 0; // Selected setting (0:VolEffect, 1:volMusic, 2:particlesCB, 3: NTM)

var particles = true;

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
    this.bgm.play('intro', { volume: window.settings.volMusic })
    this.sound.add("explode").play({ volume: window.settings.volEffect })

    this.cameras.main.shake(200, 0.01)
    this.cameras.main.setZoom(2);
    this.cameras.main.zoomTo(1, 50);

    let background = this.add.sprite(this.game.config.width / 2, this.game.config.height / 2, 'space')

    let top = 40;
    let left = 20;

    let title = this.add.bitmapText(this.game.config.width / 2, top, 'white_shadow', 'SETTINGS', 16).setOrigin(0.5)
    this.tweens.add({targets: title, y: top - 10, duration: 2000, ease: 'Sine.easeInOut', repeat: -1, yoyo: true});

    top += 40;
    this.test = this.add.bitmapText(left, top, 'indigo_shadow', 'SOUNDS', 16)
    top += 28;

    this.effectText = this.add.bitmapText(left + 10, top, 'white_shadow', 'EFFECT', 8)
    this.volEffectText = this.add.bitmapText(this.game.config.width / 2, top, 'white_shadow', '', 8)

		this.lSelect = this.add.sprite(this.game.config.width / 2 - 10, top + 4, 'arrow').setScale(-1)
		this.rSelect = this.add.sprite(this.game.config.width / 2 + 17, top + 4, 'arrow')

    top += 20;

    this.musicText = this.add.bitmapText(left + 10, top, 'white_shadow', 'MUSIC', 8)
    this.volMusicText = this.add.bitmapText(this.game.config.width / 2, top, 'white_shadow', '', 8)
    this.lSelect2 = this.add.sprite(this.game.config.width / 2 - 10, top + 4, 'arrow').setScale(-1)
    this.rSelect2 = this.add.sprite(this.game.config.width / 2 + 17, top + 4, 'arrow')

    top += 30;
    this.add.bitmapText(left, top, 'indigo_shadow', 'TWEAKS', 16)
    top += 28;

    this.particlesText = this.add.bitmapText(left + 10, top, 'white_shadow', 'PARTICLES', 8)
    this.particlesCB = this.add.sprite(this.game.config.width / 2 + 4, top + 4, 'checkbox')

    top += 20;

    this.add.bitmapText(this.game.config.width / 2, this.game.config.height - 10, 'white_shadow', 'PRESS A FOR MENU', 8).setOrigin(0.5)

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

    this.selectedText = [this.effectText, this.musicText, this.particlesText];

    this.blinkSelected(0)
    this.refreshGui()
  }

  change (key) {
    switch (selected) {
      case 0:
        window.settings.volEffect *= 10; // Javascript rulez

        if (key === 'right') window.settings.volEffect++;
        else if (key === 'left') window.settings.volEffect--;

        window.settings.volEffect = Phaser.Math.Clamp(window.settings.volEffect, 0, 10);

        window.settings.volEffect /= 10;
        break;
      case 1:
          window.settings.volMusic *= 10; // Javascript rulez

          if (key === 'right') window.settings.volMusic++;
          else if (key === 'left') window.settings.volMusic--;

          window.settings.volMusic = Phaser.Math.Clamp(window.settings.volMusic, 0, 10);

          if (window.settings.volMusic == 0) this.bgm.pause()
          else this.bgm.resume()

          window.settings.volMusic /= 10;

          this.bgm.setVolume(window.settings.volMusic)
        break;
      case 2:
        if (key !== 'space') break;

        window.settings.particles = !window.settings.particles
        break;
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

    if (window.settings.volEffect == 1) {
      this.rSelect.setVisible(false)
    } else if (window.settings.volEffect == 0) {
      this.lSelect.setVisible(false)
    }

    this.rSelect2.setVisible(true)
    this.lSelect2.setVisible(true)

    if (window.settings.volMusic == 1) {
      this.rSelect2.setVisible(false)
    } else if (window.settings.volMusic == 0) {
      this.lSelect2.setVisible(false)
    }

    this.volEffectText.setText(window.settings.volEffect * 10)
    this.volMusicText.setText(window.settings.volMusic * 10)

    this.particlesCB.setTexture(window.settings.particles ? 'checkbox' : 'checkbox_ok')
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
