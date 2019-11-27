import Phaser from 'phaser'
import Entity from './Entity'
import Coin from '../items/Coin'

export default class extends Entity {
  constructor(scene, x, y) {
    let ennemies = [
      { key: 'v2', life: 1 },
      { key: 'onche_beta', life: 1, animated: true },
      { key: 'hap', life: 2 },
      { key: '4s', life: 3 },
      { key: 'noel', life: 4 },
    ];

    let ennemy = ennemies[Phaser.Math.Between(0, ennemies.length - 1)]

    super(scene, x, y, ennemy.key, ennemy.key, ennemy.life);
    if (ennemy.animated) this.play(ennemy.key);

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
