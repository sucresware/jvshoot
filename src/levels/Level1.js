import Level from './Level'
import WarmupPhase from '../phases/WarmupPhase'
import RandomPhase from '../phases/RandomPhase'

export default class extends Level {
    static key = 'Level-1';

    constructor(params){
        super({ parent: params.parent })

        this.phases = [
            new WarmupPhase({ parent: params.parent, level: this, expectedKills: 3 }),
            new RandomPhase({ parent: params.parent, level: this })
        ];
    }

    start() {
        this.parent.bgm = this.parent.sound.add("votedisk")

        super.start()
    }

    end() {
        this.parent.bgm.stop();

        super.end()
    }
}