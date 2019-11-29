export default class {
    constructor(params) {
        this.parent = params.parent;
        this.level = params.level;
        this.active = false;

        this.events = [];
        this.tweens = [];
        this.sprites = [];
        this.audio = [];

        this.counters = {
            kills: 0,
            time: 0,
        };
    }

    mount() {
        this.active = true;
    }

    update() {}

    unmount() {
        for (let index = 0; index < this.events.length; index++) {
            this.events[index].destroy();
        }

        for (let index = 0; index < this.tweens.length; index++) {
            this.tweens[index].stop();
        }

        for (let index = 0; index < this.sprites.length; index++) {
            this.sprites[index].destroy();
        }

        for (let index = 0; index < this.audio.length; index++) {
            this.audio[index].destroy();
        }

        this.level.nextPhase()
    }
}