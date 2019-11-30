import Phaser from 'phaser'
import Entity from './Entity'

export default class extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "laser");
    this.body.velocity.y = -270;
    this.depth = 75;
  }

  update() {
    if (this.y <= 0) this.destroy()
  }
}
