import Level from './Level'
import RandomOlinuxPhase from '../phases/RandomOlinuxPhase'
import WarmupPhase from '../phases/WarmupPhase'

export default class extends Level {
    static key = 'Special-Level';

    constructor(params){
        super({ parent: params.parent })

        this.phases = [
            new WarmupPhase({ parent: params.parent, level: this }),
            new RandomOlinuxPhase({ parent: params.parent, level: this })
        ];
    }

    start() {
        this.parent.background.y = this.parent.game.config.height;
        this.parent.background.setTexture('galerie_marchande');
        this.parent.bgm = this.parent.sound.add("la_galerie_marchande");

        super.start();
    }

    end() {
        this.parent.bgm.stop();

        super.end();
    }
}