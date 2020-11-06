import Phase from '../Phase';
import Dummy from '../../entities/Dummy';
import WatchJS from 'melanke-watchjs';
import meSpeak from 'mespeak';

var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;

export default class extends Phase {
    constructor(params) {
        super(params);
    }

    mount() {
        let label = (window.platform == 'desktop') ? 'TAP OR HOLD\nSPACEBAR TO SHOOT' : 'TAP WITH YOUR\nSECOND FINGER TO SHOOT'

        this.hero = this.parent.add.text(parent.game.config.width / 2, parent.game.config.height / 2,  label, {
            fontFamily: 'PressStart2P',
            fontSize: '12px',
            align: 'center'
        })
            .setOrigin(0.5)
            .setDepth(100);
        this.sprites.push(this.hero);

        this.playerLasersLength = this.parent.playerLasers.getChildren().length

        watch(this, "playerLasersLength", (key, action, value) => {
            unwatch(this, "playerLasersLength")
            this.hero.text = 'PERFECT!\nNOW TRY TO KILL THE HAP'

            this.parent.enemies.add(
                new Dummy(
                    this.parent,
                    this.parent.game.config.width / 2,
                    this.parent.cameras.main.worldView.top + 100,
                    0
                )
            );

            watch(this.counters, "kills", (attr, action, newValue, oldValue) => {
                if (newValue) {
                    this.unmount();
                }
            });
        })

        super.mount();
    }

    update() {
        this.playerLasersLength = this.parent.playerLasers.getChildren().length

        super.update();
    }

    unmount() {
        // Remove watchers
        unwatch(this.counters, "kills");

        super.unmount();
    }
}