import Phase from './Phase';
import DummyOlinux from '../entities/DummyOlinux';
import WatchJS from 'melanke-watchjs';
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;

export default class extends Phase {
    constructor(params) {
        super(params);
    }

    mount() {
        // TBD
        this.parent.bgm.play({ volume: window.settings.volumes.music, seek: 1 });

        watch(this.counters, "kills", (attr, action, newValue) => {
            if (newValue == 100) {
                this.unmount();
            }
        });

        this.events.push(
            this.parent.time.addEvent({
                delay: 500,
                callback: () => {
                    this.parent.enemies.add(
                        new DummyOlinux(
                            this.parent,
                            Phaser.Math.Between(
                                this.parent.cameras.main.worldView.left + 20,
                                this.parent.cameras.main.worldView.right - 20
                            ),
                            this.parent.cameras.main.worldView.top - 30
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

        super.unmount();
    }
}