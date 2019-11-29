import Level from './Level'
import DummyPhase from '../phases/DummyPhase'

export default class extends Level {
    static key = 'Level-2';

    constructor(params){
        super({ parent: params.parent })

        this.phases = [
            new DummyPhase({ parent: params.parent, level: this })
        ];
    }

    start() {
        this.parent.bgm = this.parent.sound.add("the_scene_is_dead")
        this.parent.bgm.play({ volume: window.settings.volumes.music })

        super.start()
    }

    end() {
        this.parent.bgm.stop();
        super.end()
    }
}