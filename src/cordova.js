import MainGame from './MainGame'
import config from './config'

document.addEventListener('deviceready', () => {
    window.game = new MainGame({ type: Phaser.CANVAS, }, 'mobile')
}, false);