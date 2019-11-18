/* globals __DEV__ */
import Phaser from 'phaser'

import Player from '../entities/Player'
import ScrollingBackground from '../entities/ScrollingBackground'
import CarrierShip from '../entities/CarrierShip'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }

  init () {}

  preload () {}

  create () {
    this.anims.create({
      key: "sprExplosion",
      frames: this.anims.generateFrameNumbers("sprExplosion"),
      frameRate: 40,
      repeat: 0
    })

    this.anims.create({
      key: "shipWithMotor",
      frames: this.anims.generateFrameNumbers("shipWithMotor"),
      frameRate: 20,
      repeat: -1
    })

    this.player = new Player(
      this,
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      'shipWithMotor'
    )

    this.player.play('shipWithMotor')

    this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    this.backgrounds = [];
    for (let i = 1; i < 3; i++) {
      this.backgrounds.push(
        new ScrollingBackground(this, "sprBg0", i * 20)
      )
    }

    this.enemies = this.add.group()
    this.enemyLasers = this.add.group()
    this.playerLasers = this.add.group()

    this.add.bitmapText(3, 2, 'font', 'SCORE', 8)

    this.ui = {
      score: this.add.bitmapText(45, 2, 'font', '0', 8),
    }

    this.sfx = {
      explosions: [
        this.sound.add("sndExplode0"),
        this.sound.add("sndExplode1")
      ],
      laser: this.sound.add("sndLaser", { volume: 0.4 })
    }

   this.time.addEvent({
      delay: 1000,
      callback: function() {
        let enemy = new CarrierShip(
          this,
          Phaser.Math.Between(0, this.game.config.width),
          0
        )
        this.enemies.add(enemy)
      },
      callbackScope: this,
      loop: true
    })

    var scene = this;

    this.physics.add.collider(this.playerLasers, this.enemies, function(playerLaser, enemy) {
      if (enemy) {
        if (enemy.onDestroy !== undefined) enemy.onDestroy()
        enemy.explode(true)
        playerLaser.destroy()
        scene.ui.score.text++
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
        player.explode(false);
        player.onDestroy();
        laser.destroy();
      }
    });

    this.bgm = this.sound.add('bgm')
    this.bgm.play()
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
    }

    for (let i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update()
    }
   }
}
