/**
 * Created by DEaDA on 5/20/17.
 */

class BackGround extends Phaser.Group {

    private bg;

    constructor(game: Phaser.Game) {
        super(game);
        this.bg = this.game.add.image(0, 0, 'background');
        this.addChild(this.bg);

        if (Controller.Instance.orientation == Controller.LANDSCAPE) {
            this.bg.height = Controller.Instance.width;
            this.bg.scale.x = this.bg.scale.y;
            this.x = 0;
        } else {
            this.bg.height = Controller.Instance.height;
            this.bg.scale.x = this.bg.scale.y;
            this.x = (Controller.Instance.width - this.bg.width) / 2;
        }
    }
}