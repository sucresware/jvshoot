import Phaser from 'phaser'
import Entity from './Entity'
import Coin from '../items/Coin'

export default class extends Entity {
  constructor(scene, x, y) {
    let sprites = ['hap', 'noel'];
    super(scene, x, y, sprites[Phaser.Math.Between(0, 1)], "CarrierShip", Phaser.Math.Between(0, 2));

    this.body.velocity.y = Phaser.Math.Between(100, 200);
  }

  explode (canDestroy) {
    // Coins drop
    for (let index = 0; index < Phaser.Math.Between(0, 5); index++) {
      this.scene.items.add(
        new Coin(
          this.scene,
          this.x + Phaser.Math.Between(-20, 20),
          this.y + Phaser.Math.Between(-20, 20)
        )
      )
    }

    super.explode(canDestroy);
  }
}
