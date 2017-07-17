/**
 * Created by DEaDA on 6/13/17.
 */

class UIStripTitle extends Phaser.Group {

    private card;
    private cover;
    private back;

    constructor(game: Phaser.Game) {
        super(game);

        let left = this.game.add.image(0, 0, 'images', 'lenta.png');
        this.addChild(left);

        let right = this.game.add.image(0, 0, 'images', 'lenta.png');
        this.addChild(right);
        right.scale.x = -1;
        right.x = left.width * 2;




    }
}