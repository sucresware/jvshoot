import MainGame from './MainGame'
import config from './config'

FBInstant.initializeAsync().then(function() {
    window.game = new MainGame({ type: Phaser.CANVAS, }, 'facebook');
}).catch(function(error) {
    console.log(error.message);
});
