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
        this.hero = this.parent.add.text(parent.game.config.width / 2, parent.game.config.height / 2,  'YOU CAN ALSO HAVE POWERUPS', {
            fontFamily: 'PressStart2P',
            fontSize: '12px',
            align: 'center'
        })
            .setOrigin(0.5)
            .setDepth(100);
        this.sprites.push(this.hero);

        // IT CAN HELP GET OUT OF DIFFICULT SITUATIONS

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