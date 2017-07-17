/**
 * Created by DEaDA on 6/2/17.
 */
class UIToken extends Phaser.Group {

    icon;
    constructor(game: Phaser.Game, color  = 'blue') {
        super(game);
        let bg = this.game.add.image(0, 0, 'images', color+'.png');
        this.addChild(bg);
        this.icon = bg;
    }

    public select(color = 0xff00ff) {
        this.icon.tint = color;
    }
}
