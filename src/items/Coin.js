import Phaser from 'phaser'
import Item from './Item'

export default class extends Item {
  constructor(scene, x, y) {
    super(scene, x, y, 'coin', "Coin");

    this.delay = 5 * 60; // In frames
    this.body.velocity.x = Phaser.Math.Between(-5, 5);
    this.body.velocity.y = Phaser.Math.Between(-5, 5);
  }

  pickup () {
    window.state.coins++;
    this.scene.sfx.coin.play()
    // Play coin sound?

    this.destroy()
  }
}
