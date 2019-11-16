import Phaser from 'phaser'
import Entity from './Entity'

export default class extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprLaserPlayer");
    this.body.velocity.y = -270;
  }
}
