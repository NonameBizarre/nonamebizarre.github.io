/**
 * Created by DEaDA on 5/31/17.
 */

class UILogo extends Phaser.Group {
    constructor(game: Phaser.Game) {
        super(game);
        let bg = this.game.add.image(0, 0, 'images', 'logo.png')
        let fx = new FxSplash(this.game, bg.width, bg.height-5,0);
        this.addChild(fx);

        this.addChild(bg);
        this.scale.set(0.75);

        fx.playLoop(1000, 2000);
    }
}
