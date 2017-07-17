/**
 * Created by DEaDA on 6/13/17.
 */

class UIResultTitle extends Phaser.Group {

    constructor(game: Phaser.Game) {
        super(game);

        let strip = new UIStripTitle(this.game);
        this.addChild(strip);

        let title = new UITitleWin(this.game);
        this.addChild(title);

        title.x = (strip.width - title.width) / 2;
        title.y = (strip.height - title.height) / 2 - 55;



    }
}