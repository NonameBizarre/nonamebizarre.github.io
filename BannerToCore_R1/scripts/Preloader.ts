/**
 * Created by DEaDA on 3/25/17.
 */
module mygame {
    export class Preloader extends Phaser.State {
        preloadBar;
        preloadBarBackground;
        icon;

        preload() {
            this.preloadBarBackground = this.add.image(0, 0, 'preloaderBarEmpty');
            this.preloadBar = this.add.image(0, 0, 'preloaderBar');
            this.preloadBarBackground.alignIn(this.game.world.bounds, Phaser.CENTER);
            this.preloadBar.x = Math.floor(this.preloadBarBackground.x);
            this.preloadBar.y = Math.floor(this.preloadBarBackground.y);
            this.load.setPreloadSprite(this.preloadBar);
            this.icon = this.add.image(0, 0, 'connect');
            this.icon.anchor.set(0.5);
            this.icon.scale.x = -1;
            this.icon.x = this.preloadBar.x + this.preloadBar.width / 2;
            this.icon.y = this.preloadBar.y + this.preloadBar.height + 30;

            var timerEvt = this.game.time.events.loop(10, function () {
                this.icon.rotation += 0.1;
            }, this);

            let baseURL = window['baseURL'];
            this.game.load.image('shadow', baseURL + "assets/shadow.png");
            this.game.load.image('background', baseURL + "assets/background.jpg");
            this.game.load.atlasJSONHash("images", baseURL + "assets/images.png", baseURL + 'assets/images.json');
            this.game.load.bitmapFont('font_all', baseURL + "assets/font_all.png", baseURL + "assets/font_all.fnt");
            this.game.load.audio('win', baseURL + "assets/sounds/win.mp3");
            this.game.load.audio('choose', baseURL + "assets/sounds/choose.mp3");
            this.game.load.audio('chips_bet', baseURL + "assets/sounds/chips_bet.mp3");
            this.game.load.audio('chips_move', baseURL + "assets/sounds/chips_move.mp3");
            this.game.load.audio('click', baseURL + "assets/sounds/click.mp3");
            this.game.load.audio('flop', baseURL + "assets/sounds/flop.mp3");
            this.game.load.audio('new_card', baseURL + "assets/sounds/new_card.mp3");
            this.ChangeSize();
        }

        create() {
            this.ChangeSize();
            this.game.state.start('PlayState');
        }

        ChangeSize() {
            this.game.scale.setGameSize(window.innerWidth, window.innerHeight);
            this.preloadBarBackground.width = window.innerWidth;
            this.preloadBarBackground.scale.x = this.preloadBarBackground.scale.x - 0.1;
            this.preloadBarBackground.scale.y = this.preloadBarBackground.scale.x;
            this.preloadBar.scale.set(this.preloadBarBackground.scale.x, this.preloadBarBackground.scale.y);
            if (this.game.scale.width > window.innerWidth) {
                this.game.canvas.style.marginLeft = '-' + (this.game.scale.width - window.innerWidth) / 2 + 'px';
            }
            this.preloadBarBackground.alignIn(this.game.world.bounds, Phaser.CENTER);
            this.preloadBar.x = this.preloadBarBackground.x;
            this.preloadBar.y = this.preloadBarBackground.y;

            this.icon.x = this.preloadBarBackground.x + this.preloadBarBackground.width / 2;
            this.icon.y = this.preloadBarBackground.y + this.preloadBarBackground.height + 30;
        }
    }
}