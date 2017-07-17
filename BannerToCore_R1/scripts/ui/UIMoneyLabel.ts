import BitmapText = Phaser.BitmapText;
/**
 * Created by DEaDA on 6/2/17.
 */
class UIMoneyLabel extends Phaser.Group {

    private label: BitmapText

    constructor(game: Phaser.Game, big = false) {
        super(game);

        let type = '';
        if (big)
            type = '2';

        let bg = this.game.add.image(0, 0, 'images', 'bank' + type + '.png');
        this.addChild(bg);

        let hint = this.game.add.bitmapText(0, 0, 'font_all', Lang.Instance.POT[Lang.loc], 30);

        this.addChild(hint);
        hint.x = Math.floor(bg.x + (bg.width - hint.width) / 2);
        hint.y = 9;


        let hint2 = this.game.add.bitmapText(0, 0, 'font_all', '$200', 30);
       // hint2.anchor.set(0.5);
        this.addChild(hint2);
        hint2.x = 200;
        hint2.y = 9;

        if (big) {
            hint.tint = 0xffee28;
            hint.x = 20;
            hint2.x = 100;
        } else {
            hint.text = Lang.Instance.BALANCE[Lang.loc];
            hint.fontSize = 24;

            hint.y = -31;
            hint.x = bg.x + (bg.width - hint.width) / 2;
            hint2.x = bg.x + (bg.width - hint2.width) / 2;
        }
        this.label = hint2;
    }

    public setValue(value: number) {
        this.label.text = "$" + value;
    }
}
