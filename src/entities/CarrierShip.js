import Phaser from 'phaser'
import Entity from './Entity'

export default class extends Entity {
  constructor(scene, x, y) {

      let sprites = ['hap', 'noel'];

    super(scene, x, y, sprites[Phaser.Math.Between(0, 1)], "CarrierShip");
    // this.play("hap");

    this.body.velocity.y = Phaser.Math.Between(50, 100);
  }
}
