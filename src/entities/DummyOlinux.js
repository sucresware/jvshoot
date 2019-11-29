import Phaser from 'phaser'
import Entity from './Entity'

export default class extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'olinux', 'olinux', 0);
    this.body.velocity.y = Phaser.Math.Between(100, 200);
    this.setScale(Phaser.Math.Between(10, 20) / 10);
  }
}
