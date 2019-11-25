import Phaser from 'phaser'

export default class extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, asset, type, health) {
    super(scene, x, y, asset)

    this.asset = asset
    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.world.enableBody(this, 0)

    this.setData("type", type)
    this.setData("isDead", false)

    if (health) {
      this.healthBackground = this.scene.add.graphics()
      this.healthInner = this.scene.add.graphics()

      this.setData("maxHealth", health)
      this.setData("health", health)
    } else {
      this.setData("health", 1)
    }
  }

  update() {
    if (this.healthBackground !== undefined) {
      this.healthBackground.clear()
      this.healthInner.clear()

      if (this.getData('health') == this.getData('maxHealth')) return;

      let x = this.x - (this.width / 2);
      let y = this.y - (this.height / 2) - 6;

      this.healthBackground.fillStyle(0xFFFFFF)
      this.healthBackground.fillRect(x, y, this.width, 4)

      let percentKilled = this.getData('health') / this.getData('maxHealth') * 100;

      if (percentKilled > 50) {
        this.healthInner.fillStyle(0x00FF00)
      } else if (percentKilled > 25) {
        this.healthInner.fillStyle(0xFFC803)
      } else {
        this.healthInner.fillStyle(0xFF0000)
      }

      this.healthInner.fillRect(x + 1, y + 1, (this.getData('health') * (this.width - 2)) / this.getData('maxHealth'), 2)
    }
  }

  damage(canDestroy) {
    let health = this.getData('health')
    health -= this.scene.state.damage;
    this.setData('health', health)

    if (health <= 0) {
      if (this.onDestroy !== undefined) this.onDestroy()
      this.explode(canDestroy)
      return true;
    }

    return false;
  }

  explode(canDestroy) {
    if (!this.getData("isDead")) {
      if (this.healthBackground !== undefined) {
        this.healthBackground.destroy()
        this.healthInner.destroy()
      }

      this.setTexture("explosion")
      this.play("explosion")

      this.scene.sfx.explosions[Phaser.Math.Between(0, this.scene.sfx.explosions.length - 1)].play({ volume: window.settings.volumes.sfx });
      if (this.shootTimer !== undefined) {
        if (this.shootTimer) {
          this.shootTimer.remove(false)
        }
      }

      this.setAngle(0)
      this.body.setVelocity(0, 0)
      this.on('animationcomplete', function() {
        if (canDestroy) {
          this.destroy()
        } else {
          this.setVisible(false)
        }
      }, this)
      this.setData("isDead", true)

      if (this.scene.state.combo > 50) {
        this.scene.cameras.main.shake(200, 0.01)
        if (window.mobile) navigator.vibrate(100)
      } else if (this.scene.state.combo > 10) {
        if (window.mobile) navigator.vibrate(50)
      }

    }
  }
}