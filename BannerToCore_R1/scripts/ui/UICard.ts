/**
 * Created by DEaDA on 5/31/17.
 */

class UICard extends Phaser.Group {

    private card;
    private cover;
    private back;

    private  splash;
    constructor(game: Phaser.Game) {
        super(game);

        let view = this.game.add.image(0, 0, 'images', 'card_place.png');
        this.addChild(view);
        view.x = -1;
        view.y = -1;

        let card = this.game.add.image(0, 0, 'images', 'as.png');
        this.addChild(card);

        let cover = this.game.add.image(0, 0, 'images', 'back.png');
        this.addChild(cover);

        this.back = view;
        this.card = card;
        this.cover = cover;
        cover.visible = false;

        let splash = new FxSplash(this.game,  card.width-4, card.height-4, 5);
        this.addChild(splash);
        splash.x =  card.x+2;
        this.splash = splash;
    }

    public setValue(value = 'as', hideBack = false) {
        if (value != '') {
            this.card.visible = true;
            this.cover.visible = false;
            this.card.frameName = value.toLowerCase() + '.png';
        } else {
            this.card.visible = false;
            this.cover.visible = false;
        }
        if (hideBack)
            this.back.visible = false;
    }

    public playFX(){
        this.splash.playOnce();
    }
}
