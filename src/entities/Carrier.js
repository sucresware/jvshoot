import Phaser from 'phaser'
import Entity from './Entity'
import Coin from '../items/Coin'

export default class extends Entity {
  constructor(params) {
    let ennemies = [
      { key: 'hap', life: 1 * params.healthMultiplier },
      { key: 'noel', life: 2 * params.healthMultiplier },
    ];
    let ennemy = ennemies[Phaser.Math.Between(0, ennemies.length - 1)];
    super(params.parent, params.x, params.y, ennemy.key, ennemy.key, ennemy.life);
    this.body.velocity.y = Phaser.Math.Between(50 * params.velocityMultiplier, 100 * params.velocityMultiplier);
  }

  explode (canDestroy) {
    // Coins drop
    for (let index = 0; index < Phaser.Math.Between(0, 5); index++) {
      this.scene.items.add(
        new Coin(this.scene, this.x + Phaser.Math.Between(-20, 20), this.y + Phaser.Math.Between(-20, 20))
      )
    }

    super.explode(canDestroy);
  }
}
