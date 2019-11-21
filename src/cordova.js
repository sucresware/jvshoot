import Game from './Game'
import config from './config'

document.addEventListener('deviceready', () => {
    let scaleFactor = window.innerHeight / config.height;
    let width = window.innerWidth / scaleFactor;

    window.mobile = true;
    window.game = new Game({
        type: Phaser.CANVAS,
        width: width,
        zoom: scaleFactor
    })
}, false);