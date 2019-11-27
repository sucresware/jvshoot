import Phaser from 'phaser'

export default class Item extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, asset, type) {
    super(scene, x, y, asset)

    this.type = type
    this.scene = scene
    this.picked = false;

    this.scene.add.existing(this)
    this.scene.physics.world.enableBody(this, 0)

    this.delay = 10 * 60; // In frames
  }

  update() {
    this.delay--;

    if (this.delay == 3 * 60) {
        this.scene.tweens.add({
          targets: this,
          alpha: 0,
          duration: 0,
          repeat: -1,
          repeatDelay: 100,
          hold: 100,
          yoyo: true
        });
    }

    if (this.delay == 0) {
      this.destroy()
    }
  }

  pickup() {
    // Player collision with item
    this.setAlpha(0) // Hide the sprite
    this.setY(-this.x) // Move it ouside of the screen

    // Play a sound and show it in the inventory
  }

  use() {
  }

  delete() {
    // Destroy this shit
    this.destroy()
  }
}