/**
 * Created by DEaDA on 3/25/17.
 */

module mygame {
    export class Game extends Phaser.Game {
        constructor() {
            super(1280, 720, Phaser.CANVAS, 'mdsp-creative', null, false, true);
            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('PlayState', PlayState, false);
            this.state.start('Boot');
        }
    }
}
