import Phase from './Phase';
import meSpeak from 'mespeak';

export default class extends Phase {
    constructor(params) {
        super(params);
    }

    mount() {
        super.mount();

        setTimeout(() => {
           this.unmount();
        }, 4500);
    }

    update() {
        super.update();
    }

    unmount() {
        super.unmount();
    }
}