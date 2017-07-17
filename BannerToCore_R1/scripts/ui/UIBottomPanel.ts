/**
 * Created by DEaDA on 6/13/17.
 */

class UIBottomPanel extends Phaser.Group {

    constructor(game: Phaser.Game) {
        super(game);

        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0x004577);
        graphics.drawRect(0, 0, 1280, 100);
        graphics.endFill();
        this.addChild(graphics);

        let icon = this.game.add.image(0, 0, 'images', 'icon@2x.png');
        this.addChild(icon);
        icon.anchor.set(0.5);
        icon.scale.set(0.75);
        icon.x = 100;
        icon.y = 0;

        let win = this.game.add.bitmapText(200, 10, 'font_all', Lang.Instance.GAMENAME[Lang.loc], 34);
        this.addChild(win);

        let by = this.game.add.bitmapText(200, 40, 'font_all', Lang.Instance.COPYRIGHT[Lang.loc], 34);
        this.addChild(by);
    }
}