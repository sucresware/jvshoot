import Level from './Level'
import OlinuxPhase from '../phases/OlinuxPhase'
import OlinuxIntroPhase from '../phases/OlinuxIntroPhase'
import DummyPhase from '../phases/DummyPhase'

export default class extends Level {
    static key = 'Olinux-Level';

    constructor(params){
        super({ parent: params.parent })

        this.phases = [
            new OlinuxIntroPhase({ parent: params.parent, level: this }),
            new OlinuxPhase({ parent: params.parent, level: this }),
            new DummyPhase({ parent: params.parent, level: this, sleep: 7000 }),
        ];
    }

    start() {
        this.parent.background.y = this.parent.game.config.height;
        this.parent.background.setTexture('galerie_marchande');
        this.parent.bgm = this.parent.sound.add("la_galerie_marchande");

         // Hide UI
        for (let i = 0; i < this.parent.backgrounds.length; i++) this.parent.backgrounds[i].setAlpha(0, 0);
        this.parent.background.y = this.parent.game.config.height;
        this.parent.scoreboard.hideUI()
        this.parent.cameras.main.setBackgroundColor(0x000000)

        super.start();
    }

    end() {
        this.parent.bgm.stop();

        super.end();
    }
}