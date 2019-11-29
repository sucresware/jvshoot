export default class {
    constructor(params) {
        this.parent = params.parent;
        this.level = params.level;
        this.active = false;
        this.events = [];

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
        this.level.nextPhase()
    }
}