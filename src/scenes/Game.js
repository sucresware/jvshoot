/* globals __DEV__ */

import Phaser from 'phaser'
import Player from '../entities/Player'
import ScrollingBackground from '../entities/ScrollingBackground'
import CarrierShip from '../entities/CarrierShip'
import DDoSItem from '../items/DDoSItem'

import WatchJS from 'melanke-watchjs';

var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;

const EXPECTED_INTRO_KILLS = 3;
const COMBO_MULTIPLIER = 0.1;
const GOD = true;

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }

  init () {}

  preload () {
    this.cameras.main.setBackgroundColor(0x000000)

    this.anims.create({
      key: "explosion",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 40,
      repeat: 0
    })

    this.anims.create({
      key: "ship",
      frames: this.anims.generateFrameNumbers("ship"),
      frameRate: 20,
      repeat: -1
    })
  }

  create () {
    this.player = new Player(
      this,
      this.game.config.width / 2,
      this.game.config.height - 120,
      'ship'
    )

    this.player.play('ship')

    this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)

    this.backgrounds = [];
    for (let i = 1; i <= 5; i++) {
      this.backgrounds.push(
        new ScrollingBackground(this, "space", i)
      )
    }

    for (let i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].setAlpha(0)
    }

    this.backgrounds[0].setAlpha(1)

    this.enemies = this.add.group()
    this.items = this.add.group()
    this.enemyLasers = this.add.group()
    this.playerLasers = this.add.group()

    let header = this.add.sprite(0, 0, 'scoreboard').setOrigin(0);

    // this.add.bitmapText(10, 10, 'white', 'KILLS', 8)
    // this.add.bitmapText(60, 10, 'white', 'SCORE', 8)
    // this.add.bitmapText(110, 10, 'white', 'COMBO', 8)

    this.state = {
      kills: 0,
      score: 0,
      combo: 0,
      damage: 1,
      multiplier: 0,
      introPhase: true,
    }

    this.ui = {
      kills: this.add.bitmapText(this.game.config.width-10, 20, 'white', '0', 16).setOrigin(1, 0),
      score: this.add.bitmapText(10, 20, 'white', '0', 16),
      combo: this.add.bitmapText(this.game.config.width / 2, this.game.config.height -20, 'white', '0', 16).setOrigin(0.5),
      multiplier: this.add.graphics(),
      hero: this.add.bitmapText(this.game.config.width / 2, this.game.config.height / 2, 'white', EXPECTED_INTRO_KILLS, 32).setOrigin(0.5),
    }

    this.ui.kills.setDepth(20);
    this.ui.hero.setDepth(-1);

    var that = this;

    watch(this.state, "kills", function(){
      that.ui.kills.text = that.state.kills;

      if (that.state.kills <= EXPECTED_INTRO_KILLS) {
        that.ui.hero.text = EXPECTED_INTRO_KILLS - that.state.kills;
      }

      if (that.state.kills >= 3) {
        that.state.introPhase = false;
      }

      if (that.state.kills == 10) {
        that.items.add(new DDoSItem(that))
      }
    })

    watch(this.state, "score", function(){
      that.ui.score.text = that.state.score;
    })

    watch(this.state, "combo", function(attribute, action, newValue, oldValue){
      that.ui.combo.text = 'X' + that.state.combo;

      if (that.state.combo == 100) {
        that.bgm.stop()
        that.bgm_mbr.play('game')
      }

      if (that.state.combo == 0
        && !that.state.introPhase
        && oldValue >= 100) {
        that.bgm_mbr.stop()
        that.bgm.play('game')
      }
    })

    watch(this.state, "multiplier", function(){
      that.ui.multiplier.clear()
      that.ui.multiplier.fillStyle(0x3D3DAD)
      that.ui.multiplier.fillRect(0, 0, (that.state.multiplier * that.game.config.width) / 100, 6)

      if (that.state.multiplier <= 0) {
        that.state.combo = 0;
      }
    })

    watch(this.state, "introPhase", function(){
      if (that.state.introPhase == false) {
        for (let i = 0; i < that.backgrounds.length; i++) {
          that.backgrounds[i].setAlpha(1)
        }
        that.cameras.main.zoomTo(1, 200);
        that.cameras.main.setBackgroundColor(0x50710)
        that.bgm.play('game')
        that.ui.hero.text = '';
      }
    })

    this.sfx = {
      explosions: [
        this.sound.add("explode"),
        this.sound.add("explode_alt")
      ],
      laser: this.sound.add("laser", { volume: 0.4 })
    }

   this.time.addEvent({
      delay: 10,
      callback: function() {
        if (this.state.combo >= 50) {
          if (Phaser.Math.Between(0, 10) == 1) {
            let enemy = new CarrierShip(this, Phaser.Math.Between(0, this.game.config.width), 50)
            this.enemies.add(enemy)
          }
        } else if (this.state.combo >= 15) {
          if (Phaser.Math.Between(0, 30) == 1) {
            let enemy = new CarrierShip(this, Phaser.Math.Between(0, this.game.config.width), 50)
            this.enemies.add(enemy)
          }
        } else {
          if (Phaser.Math.Between(0, 50) == 1) {
            let enemy = new CarrierShip(this, Phaser.Math.Between(0, this.game.config.width), 50)
            this.enemies.add(enemy)
          }
        }
      },
      callbackScope: this,
      loop: true
    })

    this.time.addEvent({
      delay: 20,
      callback: function() {
        this.state.multiplier -= 1;
      },
      callbackScope: this,
      loop: true
    })

    var scene = this;

    this.physics.add.overlap(this.playerLasers, this.enemies, function(playerLaser, enemy) {
      if (enemy) {
        let isDead = enemy.damage(true)
        playerLaser.destroy()

        if (isDead) {
          scene.state.kills++;
          scene.state.score += 1 * scene.state.combo;
          scene.state.combo++;
        }

        scene.state.multiplier = 100; // Refill the multiplier
      }
    })

    this.physics.add.overlap(this.player, this.items, function(player, item) {


      if (!player.getData("isDead")) {
        // Search for other active items
        // Destroy them then pickup
        item.pickup()
      }
    })

    this.physics.add.overlap(this.player, this.enemies, function(player, enemy) {
      if (!player.getData("isDead") && !enemy.getData("isDead")) {
        player.explode(false)
        player.onDestroy();
        enemy.explode(true);
      }
    })

    this.physics.add.overlap(this.player, this.enemyLasers, function(player, laser) {
      if (!player.getData("isDead") &&
          !laser.getData("isDead")) {
        player.explode(false)
        player.onDestroy()
        laser.destroy()
      }
    });

    this.bgm = this.sound.add("votedisk")
    this.bgm_mbr = this.sound.add("votedisk_mbr")

    this.bgm.addMarker({
      name: 'intro',
      start: 9.2,
      duration: 14.7,
      config: {
        loop: -1,
        volume: 0.4
      }
    });

    this.bgm.addMarker({
      name: 'game',
      start: 38.3,
      config: {
        loop: -1,
        volume: 0.4
      }
    });

    this.bgm_mbr.addMarker({
      name: 'game',
      start: 34.4,
      config: { loop: -1 }
    });

    this.cameras.main.setZoom(2);
    this.bgm.play('intro')
  }

  update() {
    if (!this.player.getData("isDead")) {
      this.player.update()

      if (this.keyZ.isDown) this.player.moveUp()
      else if (this.keyS.isDown) this.player.moveDown()
      if (this.keyQ.isDown) this.player.moveLeft()
      else if (this.keyD.isDown) this.player.moveRight()

      if (this.keySpace.isDown) {
        this.player.setData("isShooting", true)
      } else {
        this.player.setData("timerShootTick", this.player.getData("timerShootDelay") - 1)
        this.player.setData("isShooting", false)
      }

      if (this.keyEnter.isDown) {
        console.log(this.items.getChildren())
        // Loop on the array, search for the current pickup, use it
      }
    }

    Phaser.Actions.Call(this.enemies.getChildren(), (entity) => { entity.update(); });
    Phaser.Actions.Call(this.items.getChildren(), (entity) => { entity.update(); });
    Phaser.Actions.Call(this.enemyLasers.getChildren(), (entity) => { entity.update(); });
    Phaser.Actions.Call(this.playerLasers.getChildren(), (entity) => { entity.update(); });

    for (let i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update()
    }
  }
}
