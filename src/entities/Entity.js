import Phaser from 'phaser'
// import rexShake from './plugins/shakeposition.js';

export default class extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, asset, type, health) {
    super(scene, x, y, asset)

    this.depth = 20;
    this.asset = asset
    this.scene = scene
    this.scene.add.existing(this)
    this.scene.physics.world.enableBody(this, 0)
    // this.shake = scene.plugins.get('rexShake').add(this);

    this.setData("type", type)
    this.isDead = false

    if (health) {
      this.healthBorder = this.scene.add.graphics()
      this.healthBackground = this.scene.add.graphics()
      this.healthInner = this.scene.add.graphics()

      this.setData("maxHealth", health)
      this.setData("health", health)
      this.health = health;
    } else {
      this.setData("health", 1)
      this.health = 1;
    }
  }

  update() {
    if (this.healthBorder !== undefined) {
      this.healthBorder.clear()
      this.healthBackground.clear()
      this.healthInner.clear()

      if (this.getData('health') == this.getData('maxHealth')) return;

      let x = this.x - (this.width / 2);
      let y = this.y - (this.height / 2) - 6;

      this.healthBorder.fillStyle(0xFFFFFF)
      this.healthBorder.fillRect(x, y, this.width, 8)
      this.healthBackground.fillStyle(0x050710)
      this.healthBackground.fillRect(x + 1, y + 1, this.width - 2, 6)

      let percentKilled = this.getData('health') / this.getData('maxHealth') * 100;

      if (percentKilled > 50) {
        this.healthInner.fillStyle(0x00FF00)
      } else if (percentKilled > 25) {
        this.healthInner.fillStyle(0xFFC803)
      } else {
        this.healthInner.fillStyle(0xFF0000)
      }

      this.healthInner.fillRect(x + 1, y + 1, (this.getData('health') * (this.width - 2)) / this.getData('maxHealth'), 6)
    }
  }

  damage(canDestroy) {
    let health = this.getData('health')
    health -= this.scene.state.damage;
    this.setData('health', health)
    this.health = health;

    if (health <= 0) {
      if (this.onDestroy !== undefined) this.onDestroy()
      this.explode(canDestroy)
      return true;
    }

    return false;
  }

  explode(canDestroy) {
    if (!this.isDead) {
      if (this.healthBackground !== undefined) {
        this.healthBorder.destroy()
        this.healthBackground.destroy()
        this.healthInner.destroy()
      }

      // Create an explosion in place
      this.scene.add.sprite(this.x, this.y, 'explosion')
          .setScale(this.scale)
          .play('explosion')
          .on('animationcomplete', (animation, frame, sprite) => sprite.destroy());

      // Play sound
      this.scene.sfx.explosions[Phaser.Math.Between(0, this.scene.sfx.explosions.length - 1)].play({ volume: window.settings.volumes.sfx });

      // if (this.shootTimer !== undefined) {
      //   if (this.shootTimer) {
      //     this.shootTimer.remove(false)
      //   }
      // }

      if (canDestroy) this.destroy()
      else this.setVisible(false)

      this.isDead = true;

      // if (this.scene.state.combo > 50) {
      //   this.scene.cameras.main.shake(200, 0.01)
      //   if (window.mobile) navigator.vibrate(100)
      // } else if (this.scene.state.combo > 10) {
      //   if (window.mobile) navigator.vibrate(50)
      // }

    }
  }
}