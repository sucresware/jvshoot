/* globals __DEV__ */

import Phaser from 'phaser'
import ChooseLevelScene from './ChooseLevel'
import Player from '../entities/Player'
import DDoSItem from '../items/DDoSItem'
import ScrollingBackground from '../ui/ScrollingBackground'
import Scoreboard from '../ui/Scoreboard'

import WatchJS from 'melanke-watchjs';
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }

  init (data) {
    this.level = new ChooseLevelScene.levels[window.selectedLevel]({ parent: this })
    this.loaded = data.loaded || false
  }

  loadAssets() {
    var levelAssets = this.level.assets() || []

    this.scene.start('LoadingScene', {
      nextScene: 'GameScene',
      assets: [
        { type: 'image', key: "space", path: "assets/images/space.png" },
        { type: 'image', key: 'logo', path: 'assets/images/logo.png' },
        { type: 'image', key: 'hap', path: 'assets/images/hap.png' },
        { type: 'image', key: 'noel', path: 'assets/images/noel.png' },
        { type: 'image', key: 'coin', path: 'assets/images/coin.png' },
        { type: 'image', key: "laser", path: "assets/images/laser.png" },
        { type: 'image', key: "computer", path: "assets/images/computer.png" },
        { type: 'image', key: "background", path: "assets/images/background.png" },
        { type: 'spritesheet', key: "explosion", path: "assets/images/boom.png", options: { frameWidth: 64, frameHeight: 64 } },
        { type: 'spritesheet', key: "ship", path: "assets/images/ship.png", options: { frameWidth: 32, frameHeight: 48 } },
        { type: 'audio', key: "explode_alt", path: "assets/sounds/explode_alt.wav"},
        { type: 'audio', key: "laser", path: "assets/sounds/laser.wav"},
        { type: 'audio', key: "coin", path: "assets/sounds/coin.mp3"},
        ...levelAssets,
      ]
    })
  }

  preload () {
    if (!this.loaded) return this.loadAssets()

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
    if (!this.loaded) return

    // Add elements
    this.background = this.add
      .sprite(0, 0, 'background')
      .setOrigin(0)
      .setDepth(-10)
      .setDisplaySize(this.game.config.width, this.game.config.height)

    this.player = new Player(this, this.game.config.width / 2, this.game.config.height - 120, 'ship')
    this.player.play('ship')

    this.backgrounds = [];
    for (let i = 1; i <= 5; i++) {
      this.backgrounds.push(new ScrollingBackground(this, "space", i))
    }

    this.state = { kills: 0, damage: 1, time: 0, shots: 0 }
    this.scoreboard = new Scoreboard(this);

    // Add groups
    this.enemies = this.add.group()
    this.items = this.add.group()
    this.enemyLasers = this.add.group()
    this.playerLasers = this.add.group()

    // Add logic
    this.level.start()

    // Register sounds
    this.sfx = {
      explosions: [
        this.sound.add("explode", { volume: window.settings.volumes.sfx }),
        this.sound.add("explode_alt", { volume: window.settings.volumes.sfx })
      ],
      coin: this.sound.add("coin", { volume: window.settings.volumes.sfx }),
      laser: this.sound.add("laser", { volume: window.settings.volumes.sfx })
    }

    // Register collisions
    var scene = this;

    this.physics.add.overlap(this.playerLasers, this.enemies, function(playerLaser, enemy) {
      if (enemy) {
        let isDead = enemy.damage(true)
        playerLaser.destroy()

        if (isDead) {
          scene.level.phases[scene.level.currentPhase].counters.kills++;
          scene.state.kills++;
        }
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
      if (player.getData('isGod')) return

      if (!player.getData("isDead") && !enemy.getData("isDead")) {
        player.explode(false)
        player.onDestroy();
        enemy.explode(true);
      }
    })

    this.physics.add.overlap(this.player, this.enemyLasers, function(player, laser) {
      if (player.getData('isGod')) return

      if (!player.getData("isDead") &&
          !laser.getData("isDead")) {
        player.explode(false)
        player.onDestroy()
        laser.destroy()
      }
    });

    // Add timer
    this.time.addEvent({ delay: 1000, callback: () => this.state.time++, callbackScope: this, loop: true });

    // Register controls
    this.input.addPointer(2);
    this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  update() {
    if (!this.loaded) return

    if (!this.player.getData("isDead")) {
      // Controls
      if (window.mobile) {
        if (this.input.pointer1.isDown) {
          this.player.x = this.input.pointer1.x
          this.player.y = this.input.pointer1.y - 25
        }
      }

      this.player.update()

      if (this.keyZ.isDown) this.player.moveUp()
      else if (this.keyS.isDown) this.player.moveDown()
      if (this.keyQ.isDown) this.player.moveLeft()
      else if (this.keyD.isDown) this.player.moveRight()

      // Keepshooting on hold
      if ((this.keySpace.isDown || (this.input.pointer1.isDown && this.input.pointer2.isDown))) {
        this.player.setData("isShooting", true)
      } else {
        this.player.setData("timerShootTick", this.player.getData("timerShootDelay") - 1)
        this.player.setData("isShooting", false)
      }

      // Pickup use
      if (this.keyEnter.isDown) {
        console.log(this.items.getChildren())
        // Loop on the array, search for the current pickup, use it
      }
    }

    // Level logic
    this.level.update()

    // Update entities
    Phaser.Actions.Call(this.enemies.getChildren(), (entity) => { entity.update(); });
    Phaser.Actions.Call(this.items.getChildren(), (entity) => { entity.update(); });
    Phaser.Actions.Call(this.enemyLasers.getChildren(), (entity) => { entity.update(); });
    Phaser.Actions.Call(this.playerLasers.getChildren(), (entity) => { entity.update(); });

    // Update background layers (reset position if needed)
    for (let i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update()
    }
  }
}
