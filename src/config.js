import Phaser from 'phaser'

export default {
  type: Phaser.WEBGL,
  width: 480,
  height: 720,
  backgroundColor: "#050710",
  physics: {
    default: "arcade",
    arcade: { gravity: { x: 0, y: 0 }, fps: 120 },
  },
  scale: { mode: Phaser.Scale.NONE },
  antialias: false,
  roundPixels: true,
  parent: 'game'
}
