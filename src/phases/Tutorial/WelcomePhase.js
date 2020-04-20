import Phase from '../Phase';
import WatchJS from 'melanke-watchjs';
import meSpeak from 'mespeak';

var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;

export default class extends Phase {
    constructor(params) {
        super(params);
    }

    mount() {
        this.hero = this.parent.add.bitmapText(parent.game.config.width / 2, parent.game.config.height / 2, 'white', 'WELCOME', 16)
            .setOrigin(0.5)
            .setDepth(100);
        this.sprites.push(this.hero);

        meSpeak.speak("Welcome to ", { volume: window.settings.volumes.sfx })
        setTimeout(() => { meSpeak.speak("je vayshot!",  { pitch: 10, speed: 125, wordgap: 3, volume: window.settings.volumes.sfx }) }, 600);
        setTimeout(() => { this.unmount() }, 2000);

        super.mount();
    }

    update() {
        super.update();
    }

    unmount() {
        super.unmount();
    }
}