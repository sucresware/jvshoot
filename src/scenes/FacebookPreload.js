import Phaser from 'phaser'

export default class extends Phaser.Scene {
    constructor () {
        super({ key: 'FacebookPreloadScene' })
    }

    preload () {
        // Scaling
        let scaleFactor = window.innerHeight / this.game.config.height;
        let width = window.innerWidth / scaleFactor;
        this.game.config.width = width;

        this.scale.setGameSize(width, this.game.config.height)
        this.scale.setZoom(scaleFactor)

        // Facebook code
        window.data = {};

        this.facebook.once('startgame', this.facebookStart, this);
        this.facebook.showLoadProgress(this);

        // Load assets
        let fonts = ['white', 'indigo', 'orange', 'red', 'green'];
        fonts.forEach(font => {
            this.load.bitmapFont(font, './assets/fonts/' + font + '.png', './assets/fonts/' + font + '.xml')
        })

        this.assets = [
            // Splash
            // { type: 'audio', key: "the_courier", path: "assets/sounds/the_courier.mp3" },
            // Menu
            { type: 'image', key: "space", path: "assets/images/space.png" },
            { type: 'image', key: 'logo', path: 'assets/images/logo.png' },
            { type: 'image', key: "arrow", path: "assets/images/arrow.png" },
            { type: 'image', key: "checkbox", path: "assets/images/checkbox.png" },
            { type: 'image', key: "checkbox_ok", path: "assets/images/checkbox_ok.png" },
            { type: 'spritesheet', key: "flare", path: "assets/images/flare.png", options: { frameWidth: 138, frameHeight: 64 } },
            // { type: 'audio', key: "the_scene_is_dead", path: "assets/sounds/the_scene_is_dead.mp3" },
            { type: 'audio', key: "explode", path: "assets/sounds/explode.wav" },
            // Game
            { type: 'image', key: "space", path: "assets/images/space.png" },
            { type: 'image', key: 'logo', path: 'assets/images/logo.png' },
            { type: 'image', key: 'hap', path: 'assets/images/hap.png' },
            { type: 'image', key: 'noel', path: 'assets/images/noel.png' },
            { type: 'image', key: 'coin', path: 'assets/images/coin.png' },
            { type: 'image', key: "laser", path: "assets/images/laser.png" },
            { type: 'image', key: "computer", path: "assets/images/computer.png" },
            { type: 'image', key: "background", path: "assets/images/background.png" },
            { type: 'spritesheet', key: "explosion", path: "assets/images/boom.png", options: { frameWidth: 64, frameHeight: 64 } },
            { type: 'spritesheet', key: "ship", path: "assets/images/ship.png", options: { frameWidth: 32, frameHeight: 48 } },
            { type: 'audio', key: "explode_alt", path: "assets/sounds/explode_alt.wav"},
            { type: 'audio', key: "laser", path: "assets/sounds/laser.wav"},
            { type: 'audio', key: "coin", path: "assets/sounds/coin.mp3"},
            // ArcadeLevel
            { type: 'audio', key: "exciter", path: "assets/sounds/exciter.mp3" },
        ];

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

    facebookStart() {
        this.scene.start('FacebookMenuScene')
    }
}
