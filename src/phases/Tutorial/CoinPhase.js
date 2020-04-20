import Phase from '../Phase';
import WatchJS from 'melanke-watchjs';
import meSpeak from 'mespeak';

var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;

export default class extends Phase {
    constructor(params) {
        super(params);
    }

    mount() {
        this.hero = this.parent.add.text(parent.game.config.width / 2, parent.game.config.height / 2,  'SOMETIMES, ENNEMIES DROPS COINS', {
            fontFamily: 'PressStart2P',
            fontSize: '12px',
            align: 'center'
        })
            .setOrigin(0.5)
            .setDepth(100);
        this.sprites.push(this.hero);

        // KILL SOME ENNEMIES TO GET AT LEAST 10 COINS
        // NICE. YOU CAN USE THEM LATER IN THE SHOP TO UPGRADE YOUR SHIP

        setTimeout(() => { this.unmount() }, 2000);

        super.mount();
    }

    update() {
        super.update();
    }

    unmount() {
        super.unmount();
    }
}