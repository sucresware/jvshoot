import Phaser from 'phaser'
import Entity from './Entity'

export default class extends Entity {
  constructor(scene, x, y, velocity) {
    super(scene, x, y, 'hap', 'hap', 0);
    this.body.velocity.y = 100

    if (typeof velocity != "undefined") {
      this.body.velocity.y = velocity;
    }
  }
}
