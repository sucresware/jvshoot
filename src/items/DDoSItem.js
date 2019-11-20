import Phaser from 'phaser'
import Item from './Item'

export default class extends Item {
  constructor (scene) {
    let position = {
      x: Phaser.Math.Between(0, 240),
      y: Phaser.Math.Between(50, 130),
    }

    super(scene, position.x, position.y, 'computer', 'DDoSItem')
  }

  update() {
    super.update()
  }

  pickup() {
    super.pickup()
  }

  use() {
    // Do something, for example :
    scene.player.anims.stop()

    super.use()
    this.delete()
  }

  delete() {
    super.delete()
  }
}