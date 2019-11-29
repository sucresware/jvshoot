import Phase from './Phase';

export default class extends Phase {
    constructor(params) {
        super(params);
    }

    mount() {
        super.mount();

        let olinux_ah = this.parent.add.sprite(
            this.parent.game.config.width + 100,
            this.parent.game.config.height / 2,
            'olinux_ah'
        );

        olinux_ah.angle = 10;
        this.sprites.push(olinux_ah);

        this.tweens.push(
            this.parent.tweens.add({
                targets: olinux_ah,
                x: this.parent.game.config.width / 2,
                ease: 'Sine.easeInOut',
                duration: 1000,
            })
        );

        this.tweens.push(
            this.parent.tweens.add({
                targets: olinux_ah,
                angle: -10,
                ease: 'Sine.easeInOut',
                duration: 1000,
                repeat: -1,
                yoyo: true,
            })
        );

        let t_ki_toi = this.parent.sound.add("t_ki_toi");
        let tu_tcroi_malin = this.parent.sound.add("tu_tcroi_malin");

        this.audio.push(t_ki_toi);
        this.audio.push(tu_tcroi_malin);

        setTimeout(() => {
            setTimeout(() => {
                this.parent.tweens.add({
                    targets: olinux_ah,
                    y: (this.parent.game.config.height / 2) - 10,
                    ease: 'Sine.easeInOut',
                    duration: 100,
                    yoyo: true,
                })
            }, 250);
            t_ki_toi.play({ volume: window.settings.volumes.sfx });
        }, 1000);

        setTimeout(() => {
            setTimeout(() => {
                this.parent.tweens.add({
                    targets: olinux_ah,
                    y: (this.parent.game.config.height / 2) - 10,
                    ease: 'Sine.easeInOut',
                    duration: 100,
                    yoyo: true,
                })
            }, 250);
            tu_tcroi_malin.play({ volume: window.settings.volumes.sfx });
        }, 2000);

        setTimeout(() => {
            this.unmount();
        }, 3000);
    }

    unmount() {
        this.tweens.push(
            this.parent.tweens.add({
                targets: this.sprites[0],
                x: 0 - 100,
                ease: 'Sine.easeInOut',
                duration: 1000,
                repeat: false
            })
        );

        setTimeout(() => {
            // Show UI
            for (let i = 0; i < this.parent.backgrounds.length; i++) this.parent.backgrounds[i].resetAlpha(500);
            this.parent.scoreboard.showUI(200)
            this.parent.tweens.add({ targets: this.parent.background, y: 0, duration: 500, ease: 'Sine.easeInOut' });
            this.parent.bgm.play({ volume: window.settings.volumes.music, seek: 16 });
            super.unmount();
        }, 1000);
    }
}