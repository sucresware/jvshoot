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
      kills: scene.add.bitmapText(78, 25, 'white', '0', 12),
      time: scene.add.bitmapText(78, 10, 'white', '0', 12),
      coins: scene.add.bitmapText(gameWidth - 10, 25, 'orange', window.state.coins + ' COINS', 12).setOrigin(1, 0),
    }

    let bottom = {
      multiplierBackground: scene.add.graphics(),
      multiplier: scene.add.graphics(),
      combo: scene.add.bitmapText(gameWidth - 10, gameHeight, 'indigo', '0', 12).setOrigin(1, 1),
    }

    this.scoreboard = scene.add.container(0, 0, [
      ...Object.values(top),
      scene.add.bitmapText(gameWidth - 10, 10, 'orange', 'JVSHOOT!', 12).setOrigin(1, 0),
      scene.add.bitmapText(10, 10, 'indigo', 'TIME', 12),
      scene.add.bitmapText(10, 25, 'indigo', 'KILLS', 12),
    ]);

    this.comboZone = scene.add.container(0, 0, [
      ...Object.values(bottom)
    ]);

    this.ui = {
      ...top,
      ...bottom,
    }

    Phaser.Actions.Call(Object.values(this.ui), (entity) => { entity.setDepth(90); }); // console.log(entity); });
    Phaser.Actions.Call(this.scoreboard.list, (entity) => { entity.setDepth(90); }); // console.log(entity); });
    Phaser.Actions.Call(this.comboZone.list, (entity) => { entity.setDepth(90); }); // console.log(entity); });
    this.scoreboard.setDepth(90);
    this.comboZone.setDepth(90);

    this.watch()
  }

  watch() {
    watch(this.scene.state, "kills", () => this.ui.kills.text = this.scene.state.kills);
    watch(this.scene.state, "time", () => this.ui.time.text = this.scene.state.time);
    watch(this.scene.state, "combo", () => this.ui.combo.text = 'X' + this.scene.state.combo);

    watch(this.scene.state, "multiplier", () => {
      this.ui.multiplierBackground.clear()
      this.ui.multiplierBackground.fillStyle(0x000000)
      this.ui.multiplierBackground.fillRect(0, this.scene.game.config.height - 13, this.scene.game.config.width, 13)

      this.ui.multiplier.clear()
      this.ui.multiplier.fillStyle(0x3D3DAD)
      this.ui.multiplier.fillRect(0, this.scene.game.config.height - 13, (this.scene.state.multiplier * (this.scene.game.config.width - this.ui.combo.width - 10 - 10)) / 100, 13)
    })

    watch(window.state, "coins", () => this.ui.coins.text = window.state.coins + " COINS");
  }

  unwatch() {
    unwatch(this.scene.state, "kills");
    unwatch(this.scene.state, "time");
    unwatch(this.scene.state, "combo");
    unwatch(window.state, "coins");
  }

  showUI(speed) {
    if (speed == undefined) speed = 0;
    this.moveUI(this.scoreboard, 0, 0, speed);
    this.moveUI(this.comboZone, 0, 0, speed);
  }

  hideUI(speed) {
    if (speed == undefined) speed = 0;
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
