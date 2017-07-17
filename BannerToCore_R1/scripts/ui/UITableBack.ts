/**
 * Created by DEaDA on 5/31/17.
 */


class UITableBack extends Phaser.Group {

    constructor(game: Phaser.Game) {
        super(game);
        if (Controller.Instance.orientation == Controller.LANDSCAPE) {
            let bg = this.game.add.image(0, 0, 'images', 'table_01.png');
            this.addChild(bg);
            let g = this.game.add.group(this);
            this.add(g);

            for (let i = 0; i < 52; i++) {
                let mid = this.game.add.image(0, 0, 'images', 'table_02.png');
                g.addChild(mid);
                mid.x = i * (mid.width);
            }
            g.x = bg.width;

            let bgr = this.game.add.image(0, 0, 'images', 'table_01.png');
            this.addChild(bgr);
            bgr.x = 1140;
            bgr.scale.x = -1;
        } else {
            let bg = this.game.add.image(0, 0, 'images', 'table_vert.png');
            this.addChild(bg);

            let bgr = this.game.add.image(0, 0, 'images', 'table_vert.png');
            this.addChild(bgr);
            bgr.x = 640;
            bgr.scale.x = -1;
        }
    }
}
