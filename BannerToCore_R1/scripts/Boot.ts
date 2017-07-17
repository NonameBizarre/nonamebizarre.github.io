/**
 * Created by DEaDA on 3/25/17.
 */
/// <reference path="../lib/phaser.d.ts" />
/// <reference path="Preloader.ts" />
/// <reference path="PlayState.ts" />
/// <reference path="Controller.ts" />
/// <reference path="PlayState.ts" />
/// <reference path="Lang.ts" />
module mygame {
    export class Boot extends Phaser.State {
        preload() {
            this.load.crossOrigin = 'anonymous';
            let baseURL = window['baseURL'];
            this.game.load.image('connect', baseURL + "assets/connect.png");
            this.game.load.image('preloaderBar', baseURL + "assets/loadingBarOnly.png");
            this.game.load.image('preloaderBarEmpty', baseURL + "assets/loadingBarEmpty.png");
        }

        create() {
            this.game.renderer.resolution = window.devicePixelRatio;
            if (this.game.renderer.resolution < 2)
                this.game.renderer.resolution = 2;
            if (document.documentElement.clientWidth > document.documentElement.clientHeight) {
                Controller.Instance.orientation = Controller.LANDSCAPE;
            } else {
                Controller.Instance.orientation = Controller.PORTRAIT;
            }
            this.game.input.touch.preventDefault = false;
            this.game.scale.bounds.setTo(0, 0, window.innerWidth, window.innerHeight);
            this.game.stage.backgroundColor = 0x1d1d1d;// 0x5e3f6b;
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            this.game.state.start('Preloader');
        }
    }
}