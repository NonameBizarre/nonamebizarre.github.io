/**
 * Created by DEaDA on 5/31/17.
 */

class UICardSelect extends Phaser.Group {
    constructor(game: Phaser.Game) {
        super(game);

        let view = this.game.add.image(0, 0, 'images', 'ramka.png');
        this.addChild(view);

        let view2 = this.game.add.image(0, 0, 'images', 'ramka.png');
        view2.scale.x = -1;
        view2.x = view.width*2;
        this.addChild(view2);

        this.scale.set(1.05,1.05);
    }
}
