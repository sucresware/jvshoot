import Phaser from 'phaser'
import Entity from './Entity'

export default class extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'olinux_ah', 'olinux_ah', 150);
    this.scale = 1.5;
    this.depth = 50;
    this.healthBorder.setDepth(50);
    this.healthBackground.setDepth(50);
    this.healthInner.setDepth(50);

    scene.tweens.add({
        targets: this,
        y: 100,
        ease: 'Sine.easeInOut',
        duration: 2500,
        yoyo: true,
        repeat: 1,
    });

    this.tweens = [];

    this.tweens.push(scene.tweens.add({
        targets: this,
        x: 20,
        ease: 'Sine.easeInOut',
        duration: 500,
    }));

    setTimeout(() => {
      this.tweens.push(scene.tweens.add({
          targets: this,
          x: scene.game.config.width - 20,
          ease: 'Sine.easeInOut',
          duration: 10000,
          yoyo: true,
          repeat: 1,
      }));
    }, 500);
  }

  damage(canDestroy) {
    this.scene.cameras.main.shake(100, 0.01);
    if (window.mobile) navigator.vibrate(100)
    super.damage(canDestroy);
  }

  explode(canDestroy) {
    if (!this.isDead) {
      if (this.healthBackground !== undefined) {
        this.healthBorder.destroy()
        this.healthBackground.destroy()
        this.healthInner.destroy()
      }

      let quoi = this.scene.sound.add("quoi");
      quoi.play({
        volume: window.settings.volumes.sfx,
        rate: 1,
      });

      let that = this;

      this.interval = setInterval(() => {
        that.scene.sfx.explosions[Phaser.Math.Between(0, that.scene.sfx.explosions.length - 1)].play({ volume: window.settings.volumes.sfx });
        that.scene.cameras.main.shake(50, 0.02)
        if (window.mobile) navigator.vibrate(50)

        for (let index = 0; index < that.tweens.length; index++) {
            that.tweens[index].stop();
        }

        that.scene.add
          .sprite(
            Phaser.Math.Between(that.displayOriginX, that.displayOriginX + that.displayWidth),
            Phaser.Math.Between(that.displayOriginY, that.displayOriginY + that.displayHeight),
            'explosion'
          )
          .play('explosion')
          .on('animationcomplete', (animation, frame, sprite) => {
            sprite.destroy();
          });
      }, 100);

      setTimeout(() => {
        that.destroy();
        clearInterval(that.interval);
      }, 7000);

      this.isDead = true;
    }
  }
}
