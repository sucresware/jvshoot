import Level from './Level'
import WelcomePhase from '../phases/Tutorial/WelcomePhase'
import MoveAroundPhase from '../phases/Tutorial/MoveAroundPhase'
import ShootPhase from '../phases/Tutorial/ShootPhase'
import CoinPhase from '../phases/Tutorial/CoinPhase'
import PowerUpPhase from '../phases/Tutorial/PowerUpPhase'
import EndPhase from '../phases/Tutorial/EndPhase'

export default class extends Level {
    static key = 'Tutorial-Level'

    constructor(params){
        super({ parent: params.parent })

        this.phases = [
            new WelcomePhase({ parent: params.parent, level: this }),
            new MoveAroundPhase({ parent: params.parent, level: this }),
            new ShootPhase({ parent: params.parent, level: this }),
            // new CoinPhase({ parent: params.parent, level: this }),
            // new PowerUpPhase({ parent: params.parent, level: this }),
            new EndPhase({ parent: params.parent, level: this }),
        ];
    }

    start() {
        this.parent.bgm = this.parent.sound.add("votedisk")

        // Hide UI
        for (let i = 0; i < this.parent.backgrounds.length; i++) this.parent.backgrounds[i].setAlpha(0, 0);
        this.parent.background.y = this.parent.game.config.height;
        this.parent.scoreboard.hideUI()
        this.parent.cameras.main.setBackgroundColor(0x000000)

        // Player is god
        this.parent.player.setData('isGod', true)

        super.start()
    }

    end() {
        this.parent.bgm.stop();

        // Player is !god
        this.parent.player.setData('isGod', false)

        super.end()
    }

    assets() {
        return [
            { type: 'audio', key: "votedisk", path: "assets/sounds/votedisk.mp3" },
        ]
    }
}