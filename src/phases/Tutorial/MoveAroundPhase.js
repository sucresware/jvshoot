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
        let label = !window.mobile ? 'USE ZQSD\nTO MOVE AROUND' : 'USE YOUR FINGER\nTO MOVE AROUND'

        this.hero = this.parent.add.text(parent.game.config.width / 2, parent.game.config.height / 2,  label, {
            fontFamily: 'PressStart2P',
            fontSize: '12px',
            align: 'center'
        })
            .setOrigin(0.5)
            .setDepth(100);
        this.sprites.push(this.hero);

        this.pos = this.parent.player.x + this.parent.player.y

        watch(this, "pos", (key, action, value) => {
            unwatch(this, "pos")
            this.hero.text = 'CONGRATS!'
            setTimeout(() => this.unmount(), 2000);
        })

        super.mount();
    }

    update() {
        this.pos = this.parent.player.x + this.parent.player.y

        super.update();
    }

    unmount() {
        super.unmount();
    }
}