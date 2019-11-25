import Phaser from 'phaser'

import WatchJS from 'melanke-watchjs';
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;

// TODO: Use ../Game constant
const EXPECTED_INTRO_KILLS = 3;

export default class {
  constructor(scene) {
    this.scene = scene;

    // let border = this.scene.add.rectangle(0, 0, this.scene.game.config.width, this.scene.game.config.height, 0x000000, 0).setOrigin(0);
    // border.setStrokeStyle(2, 0x3D3DAD);

    let gameWidth = scene.game.config.width;
    let gameHeight = scene.game.config.height;

    let top = {
      kills: scene.add.bitmapText(56, 20, 'white_shadow', '0', 8),
      score: scene.add.bitmapText(56, 10, 'white_shadow', '0', 8),
    }

    let bottom = {
      multiplierBackground: scene.add.graphics(),
      multiplier: scene.add.graphics(),
      combo: scene.add.bitmapText(gameWidth - 10, gameHeight, 'indigo', '0', 8).setOrigin(1, 1),
    }

    this.scoreboard = scene.add.container(0, 0, [
      ...Object.values(top),
      scene.add.bitmapText(gameWidth - 10, 10, 'orange', 'JVSHOOT!', 8).setOrigin(1, 0),
      scene.add.bitmapText(10, 10, 'indigo', 'SCORE', 8),
      scene.add.bitmapText(10, 20, 'indigo', 'KILLS', 8),
    ]);

    this.comboZone = scene.add.container(0, 0, [
      ...Object.values(bottom)
    ]);

    this.ui = {
      ...top,
      ...bottom,
      hero: scene.add.bitmapText(gameWidth / 2, gameHeight / 2, 'white_shadow', EXPECTED_INTRO_KILLS, 32).setOrigin(0.5),
    }

    Phaser.Actions.SetDepth(Object.values(this.ui), 50)

    // Hide the scoreboard
    this.hideUI(0)

    this.watch()
  }

  watch() {
    watch(this.scene.state, "kills", () => {
      if (this.scene.state.kills <= EXPECTED_INTRO_KILLS) {
        this.ui.hero.text = EXPECTED_INTRO_KILLS - this.scene.state.kills;
        if (EXPECTED_INTRO_KILLS - this.scene.state.kills == 0) {
          this.ui.hero.text = '';
        }
      }

      this.ui.kills.text = this.scene.state.kills
    });
    watch(this.scene.state, "score", () => this.ui.score.text = this.scene.state.score);
    watch(this.scene.state, "combo", () => this.ui.combo.text = 'X' + this.scene.state.combo);

    watch(this.scene.state, "multiplier", () => {
      this.ui.multiplierBackground.clear()
      this.ui.multiplierBackground.fillStyle(0x000000)
      this.ui.multiplierBackground.fillRect(0, this.scene.game.config.height - 9, this.scene.game.config.width, 9)

      this.ui.multiplier.clear()
      this.ui.multiplier.fillStyle(0x3D3DAD)
      this.ui.multiplier.fillRect(0, this.scene.game.config.height - 9, (this.scene.state.multiplier * (this.scene.game.config.width - this.ui.combo.width - 10 - 10)) / 100, 9)
    })
  }

  unwatch() {
    unwatch(this.scene.state, "kills");
    unwatch(this.scene.state, "score");
    unwatch(this.scene.state, "combo");
  }

  showUI(speed) {
    if (speed == undefined) speed = 500;
    this.moveUI(this.scoreboard, 0, 0, speed);
    this.moveUI(this.comboZone, 0, 0, speed);
  }

  hideUI(speed) {
    if (speed == undefined) speed = 500;
    this.moveUI(this.scoreboard, 0, -48, speed);
    this.moveUI(this.comboZone, 0, this.scene.game.config.height, speed);
  }

  moveUI(targets, x, y, speed) {
    this.scene.tweens.add({
        targets: targets,
        x: x,
        y: y,
        duration: speed,
        ease: 'Sine.easeInOut',
    });
  }

  update() {}
}