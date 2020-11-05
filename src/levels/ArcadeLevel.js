import Level from './Level'
import WarmupPhase from '../phases/WarmupPhase'
import EndlessPhase from '../phases/EndlessPhase'

export default class extends Level {
    static key = 'Arcade-Level'

    constructor(params){
        super({ parent: params.parent })

        this.phases = [
            new WarmupPhase({ parent: params.parent, level: this, expectedKills: 3 }),
            new EndlessPhase({ parent: params.parent, level: this })
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

    assets() {
        return [
            { type: 'audio', key: "votedisk", path: "assets/sounds/votedisk.mp3" },
        ]
    }
}