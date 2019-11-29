import Phase from './Phase';
import meSpeak from 'mespeak';

export default class extends Phase {
    constructor(params) {
        super(params);

        this.sleep = params.sleep;
    }

    mount() {
        super.mount();

        setTimeout(() => {
           this.unmount();
        }, this.sleep);
    }

    update() {
        super.update();
    }

    unmount() {
        super.unmount();
    }
}