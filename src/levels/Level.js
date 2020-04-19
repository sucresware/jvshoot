import StartPhase from '../phases/StartPhase'
import EndPhase from '../phases/EndPhase'

export default class {
    constructor(params){
        this.parent = params.parent;
        this.key = params.key;
        this.phases = params.phases;
        this.currentPhase = 0;
    }

    start() {
        console.log('start', this.currentPhase)
        this.phases[this.currentPhase].mount();
    }

    update() {
        if (this.phases[this.currentPhase].active) {
            this.phases[this.currentPhase].update()
        }
    }

    nextPhase() {
        console.log('nextPhase', this.currentPhase + 1)
        // this.phases[this.currentPhase].unmount();

        if (this.currentPhase + 1 >= this.phases.length) {
            return this.end();
        }

        this.currentPhase++;
        this.phases[this.currentPhase].mount();
    }

    end() {
        console.log('This is the end.');
        this.parent.scene.start('LevelClearScene')
    }
}