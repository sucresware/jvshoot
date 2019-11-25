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

  preload () {}

  create () {
    if(localStorage.getItem('volEffect')) { // check if volEffect already exist in browser
      volEffect = localStorage.getItem('volEffect') // set volEffect to the volEffect storage's value
    } else {
      volEffect = 5 // set volEffect to 5 for default
      localStorage.setItem('volEffect', volEffect) // create a volEffect local storage var
    }
    this.bgm = this.sound.add("the_scene_is_dead");

    this.bgm.addMarker({
      name: 'intro',
      start: 4.3,
      duration: 46.5
    });

    this.bgm.play('intro', {volume: volEffect / 10})

    this.sound.add("explode").play()
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
    this.volEffectText = this.add.bitmapText(this.game.config.width / 2, top, 'white_shadow', volEffect, 8)
    
    this.selectedEffect = this.tweens.add({targets: this.effectText, alpha: 0, duration: 0, ease: 'Sine.easeInOut', repeat: -1, repeatDelay: 500, hold: 500, yoyo: true});
    
		this.lSelect = this.add.sprite(this.game.config.width / 2 - 10, top + 4, 'arrow').setScale(-1)
		this.rSelect = this.add.sprite(this.game.config.width / 2 + 17, top + 4, 'arrow')

    if(volEffect >= 10) {
      this.rSelect.setVisible(false)
      this.lSelect.setVisible(true)
    } else if (volEffect <= 0) {
      this.bgm.pause()
      this.rSelect.setVisible(true)
      this.lSelect.setVisible(false)
    }

    top += 20;
 
    this.musicText = this.add.bitmapText(left + 10, top, 'white_shadow', 'MUSIC', 8)
    this.add.bitmapText(this.game.config.width / 2, top, 'white_shadow', volMusic, 8)
    this.add.sprite(this.game.config.width / 2 - 10, top + 4, 'arrow').setScale(-1)
    this.add.sprite(this.game.config.width / 2 + 17, top + 4, 'arrow')

    top += 30;
    this.add.bitmapText(left, top, 'indigo_shadow', 'TWEAKS', 16)
    top += 28;

    this.particlesText = this.add.bitmapText(left + 10, top, 'white_shadow', 'PARTICLES', 8)
    this.particlesCB = this.add.sprite(this.game.config.width / 2 + 4, top + 4, 'checkbox')
    this.particlesCBOk = this.add.sprite(this.game.config.width / 2 + 4, top + 4, 'checkbox_ok')

    if (localStorage.getItem('particles')) { // check if particles already exist in browser
      particles = JSON.parse(localStorage.getItem('particles')) // set particles to the particles storage's value
    } else {
      localStorage.setItem('particles', particles) // create a particles local storage var
    }

    if (particles) {
      this.particlesCBOk.setVisible(true)
      this.particlesCB.setVisible(false)
    } else {
      this.particlesCBOk.setVisible(false)
      this.particlesCB.setVisible(true)
    }

    top += 20;
    this.oncheText = this.add.bitmapText(left + 10, top, 'white_shadow', 'ONCHECUCK', 8)


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
  }

  update () {
  }

  change (key) {
    if (key === 'right') {
      switch (selected) {
        case 0:
          if(volEffect < 10) {
            if (volEffect == 0) {this.bgm.resume()} 
            volEffect++; 
            this.lSelect.setVisible(true)
            if (volEffect == 10) {this.volEffectText.x = this.game.config.width / 2 - 5; this.rSelect.setVisible(false);}
          }    
          this.volEffectText.text = volEffect
          localStorage.setItem('volEffect', volEffect)
          this.bgm.setVolume(volEffect / 10)
        break;
      }
    } else if (key === 'left') {
      switch (selected) {
        case 0:
          if (volEffect > 0) {
            volEffect--; 
            this.volEffectText.x = this.game.config.width / 2;
            this.rSelect.setVisible(true)
          }
          if (volEffect == 0) {
            this.bgm.pause()
            this.lSelect.setVisible(false)
          }
          this.volEffectText.text = volEffect
          localStorage.setItem('volEffect', volEffect)
          this.bgm.setVolume(volEffect / 10)
        break;
      }
    } else if (key === 'space') {
      switch (selected) {
        case 2:
          particles = !particles
          localStorage.setItem('particles', particles)
          if (particles) {
            this.particlesCB.setVisible(false)
            this.particlesCBOk.setVisible(true)
          } else {
            this.particlesCB.setVisible(true)
            this.particlesCBOk.setVisible(false)
          }
        break;
      }
    }
  }

  select (key) {
    switch (key) {
      case 'up':
        if (selected > 0 && selected <= 3) {
          selected--;
          this.blinkSelected(selected);
        }
      break;
      case 'down':
        if (selected >= 0 && selected < 3) {
          selected++;
          this.blinkSelected(selected);
        }
      break;
      default:
        console.log('Error key not recognized' + key)
    }
  }

  blinkSelected (selected) {
    var selectedText = [this.effectText, this.musicText, this.particlesText, this.oncheText];

    this.selectedEffect.remove()

    for (var i = 0; i < selectedText.length; i++) { // reset alpha to 1 of all text in case tweens set alpha to 0
      selectedText[i].setAlpha(1) 
    }

    this.selectedEffect = this.tweens.add({
      targets: selectedText[selected], 
      alpha: 0,
      duration: 0, 
      ease: 'Sine.easeInOut', 
      repeat: -1, 
      repeatDelay: 500, 
      hold: 500, 
      yoyo: true
    });
  }
  goToMenu () {
    this.bgm.stop()
    this.scene.start('MenuScene')
  }
}
