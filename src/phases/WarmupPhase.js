import Phase from './Phase';
import Dummy from '../entities/Dummy';
import WatchJS from 'melanke-watchjs';
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;

export default class extends Phase {
    constructor(params) {
        super(params);
    }

    mount() {
        // Hide UI
        for (let i = 0; i < this.parent.backgrounds.length; i++) this.parent.backgrounds[i].setAlpha(0, 0);
        this.parent.background.y = this.parent.game.config.height;
        this.parent.scoreboard.hideUI()
        this.parent.cameras.main.setBackgroundColor(0x000000)
        this.parent.cameras.main.setZoom(1.5);

        watch(this.counters, "kills", (attr, action, newValue) => {
            if (newValue == 3) {
                this.unmount();
            }
        });

        this.events.push(
            this.parent.time.addEvent({
                delay: 2000,
                callback: () => {
                    this.parent.enemies.add(
                        new Dummy(
                            this.parent,
                            this.parent.game.config.width / 2,
                            this.parent.cameras.main.worldView.top - 10
                        )
                    );
                },
                callbackScope: this,
                loop: true
            })
        );

        super.mount();
    }

    update() {
        super.update();
    }

    unmount() {
        // Remove watchers
        unwatch(this.counters, "kills");

        // Remove events
        for (let index = 0; index < this.events.length; index++) {
            this.events[index].destroy();
        }

        // Show UI
        for (let i = 0; i < this.parent.backgrounds.length; i++) this.parent.backgrounds[i].resetAlpha(500);
        this.parent.tweens.add({ targets: this.parent.background, y: 0, duration: 500, ease: 'Sine.easeInOut' });
        setTimeout(() => this.parent.scoreboard.showUI(200), 1000);
        this.parent.cameras.main.zoomTo(1, 200);

        super.unmount();
    }
}