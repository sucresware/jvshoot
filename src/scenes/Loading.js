import Phaser from 'phaser'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'LoadingScene' })
  }

  init (data) {
    this.nextScene = data.nextScene
    this.nextSceneOptions = data.nextSceneOptions || {}
    this.assets = data.assets || []
    this.assetsFn = data.assetsFn || function(){}
  }

  preload () {
    this.cameras.main.setBackgroundColor(0x000000)

    this.load.on('progress', (value) => {
        this.progressBar.clear()
        this.progressBar.fillStyle(0x3D3DAD, 1)
        this.progressBar.fillRect(40, (this.game.config.height / 2) - 8, (this.game.config.width - 80) * value, 16)
        this.progressPercentText.setText(Math.round((value * 100)) + '%')
    })

    this.load.on('fileprogress', (file) => {
        this.progressText.setText(file.url)
    })

    this.load.once('complete', () => {
      this.scene.start(this.nextScene, { loaded: true })
    })

    this.progressPercentText = this.add.text(this.game.config.width / 2, (this.game.config.height / 2), '0%', {
        fontFamily: 'PressStart2P',
        fontSize: '8px'
    })

    this.progressPercentText.setOrigin(0.5)
    this.progressPercentText.setDepth(10)

    let progressBox = this.add.graphics()
    progressBox.fillStyle(0x050710, 1)
    progressBox.fillRect(40, (this.game.config.height / 2) - 8, this.game.config.width - 80, 16)

    this.progressBar = this.add.graphics()

    this.progressText = this.add.text(this.game.config.width / 2, (this.game.config.height - 20), '', {
        fontFamily: 'PressStart2P',
        fontSize: '8px',
        color: '#3D3DAD',
    })
    this.progressText.setOrigin(0.5)
    this.progressText.setDepth(10);

    this.assetsFn()

    if (this.assets) {
      this.assets.forEach((asset) => {
        switch (asset.type) {
          case 'image':
            this.load.image(asset.key, asset.path)
            break
          case 'spritesheet':
            this.load.spritesheet(asset.key, asset.path, asset.options)
            break
          case 'audio':
            this.load.audio(asset.key, asset.path)
            break
        }
      })
    }

    this.load.start()
  }
}
