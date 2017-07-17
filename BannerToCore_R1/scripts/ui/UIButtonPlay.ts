/**
 * Created by DEaDA on 6/13/17.
 */
class UIButtonPlay extends Phaser.Group {

    constructor(game: Phaser.Game) {
        super(game);

        let viewRight = this.game.add.sprite(0, 0, 'images', 'play.png');
        this.addChild(viewRight);
        viewRight.scale.set(1);

        let splash = new FxSplash(this.game, viewRight.width, viewRight.height - 6, 10);
        this.addChild(splash);
        splash.x = 0;
        splash.y = 0;
        splash.playLoop();

        let title = this.game.add.bitmapText(0, 0, 'font_all', Lang.Instance.PLAYHINT[Lang.loc], 72);
        this.addChild(title);

        title.x = viewRight.x + (viewRight.width - title.width) / 2;
        title.y = viewRight.y + (viewRight.height - title.height) / 2 - 15;

        viewRight.inputEnabled = true;
        viewRight.events.onInputUp.add(this.onClick, this);
    }

    onClick() {
        window['trackClick']();
    }
}
