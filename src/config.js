import Phaser from 'phaser'

export default {
  type: Phaser.WEBGL,
  width: 240,
  height: 400,
  backgroundColor: "#050710",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      fps: 120
    },
  },
  scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
  },
  pixelArt: true,
  roundPixels: true,
  parent: 'game'
}
