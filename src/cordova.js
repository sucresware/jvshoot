import Game from './Game'
import config from './config'

document.addEventListener('deviceready', () => {
    let scaleFactor = window.innerHeight / config.height;
    let width = window.innerWidth / scaleFactor;

    window.game = new Game({
    type: Phaser.CANVAS,
    width: width,
    zoom: scaleFactor,
    })
}, false);