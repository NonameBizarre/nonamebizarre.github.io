/**
 * Created by User on 6/14/2017.
 */
class FxSplash extends Phaser.Group {

    splash;

    constructor(game: Phaser.Game, w, h, r, debug = false) {
        super(game);

        var graphics = game.add.graphics(0, 0);
        if (debug)
            graphics.beginFill(0x000000, 0.5);
        else
            graphics.beginFill(0x000000);

        graphics.drawRoundedRect(0, 0, w, h, r);
        graphics.endFill();
        this.addChild(graphics);

        let splash = this.game.add.sprite(0, 0, 'images', 'splash.png');
        if (!debug)
            splash.mask = graphics;
        this.addChild(splash);
        splash.x = -400;
        this.splash = splash;
    }

    public playLoop(speed = 1000, delay = 500, yoyo = false) {
        this.game.add.tween(this.splash).to({
            x: 500
        }, speed, Phaser.Easing.Sinusoidal.Out, true, delay).loop(true).yoyo(yoyo);
    }

    public playOnce() {
        this.game.add.tween(this.splash).to({
            x: 500
        }, 1000, Phaser.Easing.Sinusoidal.Out, true, 500);
    }
}