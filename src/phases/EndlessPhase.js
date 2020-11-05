import Phase from './Phase';
import Carrier from '../entities/Carrier';
import WatchJS from 'melanke-watchjs';
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;

export default class extends Phase {
    constructor(params) {
        super(params);

        this.healthMultiplier = params.healthMultiplier || 1;
        this.velocityMultiplier = params.velocityMultiplier || 1;
        this.comboMultiplier = params.comboMultiplier || .1;
    }

    mount() {
        // TBD
        this.parent.bgm.play({ volume: window.settings.volumes.music, seek: 38.3 });

        this.events.push(
            this.parent.time.addEvent({
                delay: 10,
                callback: () => {
                    let spawn = false;

                    if (
                        (this.parent.state.combo >= 50 && Phaser.Math.Between(0, 10) == 1)
                        || (this.parent.state.combo >= 15 && Phaser.Math.Between(0, 30) == 1)
                        || (Phaser.Math.Between(0, 50) == 1)) {
                        spawn = true;
                    }

                    if (spawn) {
                        this.parent.enemies.add(
                            new Carrier({
                                parent: this.parent,
                                x: Phaser.Math.Between(this.parent.cameras.main.worldView.left + 20, this.parent.cameras.main.worldView.right - 20),
                                y: this.parent.cameras.main.worldView.top - 30,
                                healthMultiplier: this.healthMultiplier,
                                velocityMultiplier: this.velocityMultiplier,
                            })
                        );
                    }
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

        super.unmount();
    }
}