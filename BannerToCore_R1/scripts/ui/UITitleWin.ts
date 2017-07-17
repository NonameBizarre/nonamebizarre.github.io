/**
 * Created by DEaDA on 6/13/17.
 */
class UITitleWin extends Phaser.Group {

    constructor(game: Phaser.Game) {
        super(game);

        if (Controller.Instance.balance <= 0) {
            let title = this.game.add.bitmapText(0, 0, 'font_all', 'Good try!', 72);
            title.tint = 0xf7d501;
            this.addChild(title);

        } else {
            let title = this.game.add.bitmapText(0, 0, 'font_all', Lang.Instance.YOU_WIN[Lang.loc], 60);
            title.tint = 0xf7d501;
            this.addChild(title);

            let win = this.game.add.bitmapText(0, 0, 'font_all', '$' + Controller.Instance.balance + '!', 60);
            this.addChild(win);

            win.x = title.x + title.width + 10;
            win.y = title.y;
        }
    }
}
