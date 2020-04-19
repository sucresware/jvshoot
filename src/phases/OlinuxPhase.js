import Phase from './Phase';
import DummyOlinux from '../entities/DummyOlinux';
import OlinuxBoss from '../entities/OlinuxBoss';
import WatchJS from 'melanke-watchjs';
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;

export default class extends Phase {
    constructor(params) {
        super(params);
    }

    mount() {
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

        this.olinux_boss = new OlinuxBoss(
            this.parent,
            this.parent.game.config.width + 150,
            150,
        )

        this.parent.enemies.add(this.olinux_boss);

        watch(this.olinux_boss, 'isDead', (attr, action, newValue) => {
            if (!this.parent.player.isDead && newValue == true) {
                // Player is god
                this.parent.player.setData('isGod', true)

                // Stop spawning
                for (let index = 0; index < this.events.length; index++) {
                    this.events[index].destroy();
                }

                this.unmount();
            }
        });

        super.mount();
    }

    update() {
        super.update();
    }

    unmount() {
        // Remove watchers
        unwatch(this.olinux_boss, "isDead");

        super.unmount();
    }
}