import Phaser from 'phaser'
import Entity from './Entity'
import PlayerLaser from './PlayerLaser'

export default class extends Entity {
  constructor (scene, x, y, asset) {
    super(scene, x, y, asset, 'Player')

    this.setData("speed", 200)
    this.setData("isShooting", false)
    this.setData("timerShootDelay", 10)
    this.setData("timerShootTick", this.getData("timerShootDelay") - 1)
  }

  update() {
    this.body.setVelocity(0);

    this.x = Phaser.Math.Clamp(
      this.x,
      this.scene.cameras.main.worldView.left,
      this.scene.cameras.main.worldView.right
    );

    this.y = Phaser.Math.Clamp(
      this.y,
      this.scene.cameras.main.worldView.top,
      this.scene.cameras.main.worldView.bottom
    );

    if (this.getData("isShooting")) {
      if (this.getData("timerShootTick") < this.getData("timerShootDelay")) {
        this.setData("timerShootTick", this.getData("timerShootTick") + 1); // Every game update, increase timerShootTick by one until we reach the value of timerShootDelay
      } else { // When the "manual timer" is triggered:
        if (this.scene.state.combo >= 50) {
          this.scene.playerLasers.add(new PlayerLaser(this.scene, this.x - 8, this.y))
          this.scene.playerLasers.add(new PlayerLaser(this.scene, this.x - 4, this.y))
          this.scene.playerLasers.add(new PlayerLaser(this.scene, this.x + 4, this.y))
          this.scene.playerLasers.add(new PlayerLaser(this.scene, this.x + 8, this.y))
        } else if (this.scene.state.combo >= 15) {
          this.scene.playerLasers.add(new PlayerLaser(this.scene, this.x - 4, this.y))
          this.scene.playerLasers.add(new PlayerLaser(this.scene, this.x + 4, this.y))
        } else {
          this.scene.playerLasers.add(new PlayerLaser(this.scene, this.x, this.y))
        }

        this.scene.sfx.laser.play()
        this.setData("timerShootTick", 0);
      }
    }
  }

  moveUp() {
    this.body.setVelocityY(-this.getData("speed"))
  }

  moveDown() {
    this.body.setVelocityY(this.getData("speed"))
  }

  moveLeft() {
    this.body.setVelocityX(-this.getData("speed"))
  }

  moveRight() {
    this.body.setVelocityX(this.getData("speed"))
  }

  onDestroy() {
    this.scene.bgm.stop()
    this.scene.bgm_mbr.stop()

    this.scene.time.addEvent({
      delay: 400,
      callback: function() {
        this.scene.scene.start("MenuScene");
      },
      callbackScope: this,
      loop: false
    });
  }
}
