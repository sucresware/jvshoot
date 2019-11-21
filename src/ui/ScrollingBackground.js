import Phaser from 'phaser'

export default class {
  constructor(scene, key, layer) {
    this.scene = scene;
    this.key = key;

    this.velocity = 100 / layer;
    this.opacity = 1.1 - (layer / 10);

    this.layers = this.scene.add.group();

    let background = this.scene.textures.get('space').source[0];

    let x = Phaser.Math.Between(-background.width/2, background.width/2);
    let flipX = Phaser.Math.Between(0, 1) ? -1 : 1;
    let flipY = Phaser.Math.Between(0, 1) ? -1 : 1;

    for (let i = 0; i < 2; i++) {
      // Creating two backgrounds will allow a continuous flow giving the illusion that they are moving.

      let layer = this.scene.add.sprite(x, -background.height * i, 'space').setOrigin(0.5, 0);
      layer.setScale(flipX * 2, flipY * 2);
      layer.setDepth(-5);
      layer.setAlpha(this.opacity);

      this.scene.physics.world.enableBody(layer, 0);
      layer.body.velocity.y = this.velocity;
      // layer.body.velocity.y = 50;

      this.layers.add(layer);
    }
  }

  update() {
    if (this.layers.getChildren()[0].y >= 0) {
      for (let i = 0; i < 2; i++) {
        let layer = this.layers.getChildren()[i];
        layer.y = (-layer.height) + (layer.height * i);
      }
    }
  }

  setAlpha(alpha, speed) {
    let allLayers = []

    for (let i = 0; i < this.layers.getChildren().length; i++) {
      allLayers.push(this.layers.getChildren()[i])
    }

    this.scene.tweens.add({
        targets: allLayers,
        alpha: alpha,
        duration: speed,
        ease: 'Sine.easeInOut',
    });
  }

  resetAlpha(speed) {
    this.setAlpha(this.opacity, speed);
  }
}
