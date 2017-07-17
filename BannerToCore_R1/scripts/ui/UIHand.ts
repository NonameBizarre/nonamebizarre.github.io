import Button = Phaser.Button;
import Controller = mygame.Controller;
/**
 * Created by DEaDA on 6/2/17.
 */
class UIHand extends Phaser.Group {

    private cards = [];
    private btn;
    public handID = -1;
    private selecter;

    private cardWidth = 90;
    private main;
    private btnYDef;

    constructor(game: Phaser.Game, count = 2) {
        super(game);
        this.main = this;
        let selecter = new UICardSelect(this.game);
        this.addChild(selecter);

        let cards = [];
        for (let i = 0; i < count; i++) {
            let cover = new UICard(this.game);
            this.addChild(cover);
            if (Controller.Instance.orientation == Controller.LANDSCAPE) {
                cover.x = (this.cardWidth + 10) * i;
            } else {
                cover.x = 100 * i;
                if (i > 2) {
                    cover.x = 50 + 100 * ( i - 3);
                    cover.y = 130;
                }
            }

            cards[i] = cover;
        }
        let btn;
        if (count == 2) {
            let w = 190;
            btn = new UIButtonSelect(this.game);
            this.add(btn);
            btn.callback = this.clickButton;
            btn.x = (w - 250) / 2;
            btn.y = cards[0].y + 138;
            this.btnYDef = btn.y;
        }
        this.btn = btn;
        this.cards = cards;
        selecter.x = -47;
        selecter.y = -51;
        selecter.visible = false;
        this.selecter = selecter;
    }

    public showSelector() {
        this.selecter.alpha = 0;
        this.selecter.visible = true;
        this.game.add.tween(this.selecter).to({
            alpha: 1
        }, 200, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(this.hideSelector, this);
    }

    public hideSelectorInstant() {
        this.selecter.alpha = 0;
        this.selecter.visible = false;
    }

    public hideSelector() {
        this.game.add.tween(this.selecter).to({
            alpha: 0
        }, 200, Phaser.Easing.Sinusoidal.InOut, true, 500);
    }

    clickButton() {
        let h = this.parent as UIHand;
        Controller.Instance.selectHand(h.handID);
    }

    values: Array<String> = [];

    public setCards(params, hideBack = false, repos = false) {
        for (let i = 0; i < params.length; i++) {
            let card = this.cards[i];
            if (repos) {
                card.x = 100 * i;
                if (Controller.Instance.orientation == Controller.LANDSCAPE) {
                    card.y = -280;
                } else {
                    if (i > 2) {
                        card.x = 50 + 100 * ( i - 3);
                        card.y = -280 + 130;
                    }
                }
            }
            card.setValue(params[i], hideBack);
            this.values[i] = params[i];
        }
        if (repos) {
            this.selecter.x = -47;
            this.selecter.y = -51;
        }
    }

    public isWin(winCards: Array<String>) {
        for (let i = 0; i < winCards.length; i++)
            if (winCards[i] != this.values[i])
                return false;
        return true;
    }

    public startRound(delay: number = 0) {
        let speed = 250;
        for (let i = 0; i < this.cards.length; i++) {
            let card = this.cards[i];
            if (Controller.Instance.orientation == Controller.LANDSCAPE) {
                card.y = -330;
                if (delay != 0)
                    card.y = -600;
            } else {
                card.y = -330 - 200;
                if (delay != 0)
                    card.y = 1280;
            }
            this.game.add.tween(card).to({y: 0}, speed, Phaser.Easing.Sinusoidal.InOut, true, delay + i * 100).onStart.add(function () {
            });
        }
        if (this.btn) {
            this.btn.y = 300;
            this.game.add.tween(this.btn).to({y: this.btnYDef}, speed, Phaser.Easing.Sinusoidal.InOut, true, 400);
        }
    }

    public hide() {
        this.game.sound.play('new_card');
        for (let i = 0; i < this.cards.length; i++) {
            let card = this.cards[i];
            this.game.add.tween(card).to({y: -600, x: 100}, 500, Phaser.Easing.Sinusoidal.InOut, true);
        }
    }

    public prepareWinCars(params) {
        for (let i = 0; i < this.cards.length; i++) {
            let card = this.cards[i];
            card.x = 100 * i;
            card.y = 0;
            card.setValue(params[i], true);
            this.values[i] = params[i];
        }
    }

    public prepare(delay: number = 0) {
        this.visible = true;
        for (let i = 0; i < this.cards.length; i++) {
            let card = this.cards[i];

            if (Controller.Instance.orientation == Controller.LANDSCAPE) {
                card.y = -330;
                if (delay != 0)
                    card.y = -600;
            } else {
                card.y = -330 - 600;
                if (delay != 0)
                    card.y = -600 - 600;

            }
        }
    }

    public init() {
        this.btn.setStatus(0);
    }

    public playFX() {
        for (let i = 0; i < this.cards.length; i++) {
            let card = this.cards[i];
            card.playFX();
        }
    }

    public win() {
        let speed = 500;
        this.showSelector();
        this.btn.setStatus(2);
        this.selecter.visible = true;

        let posX = 440;
        let posY = -280;

        if (this.handID == 1)
            posX = 440 - 300;
        if (this.handID == 2)
            posX = 440 - 600;

        if (Controller.Instance.orientation == Controller.PORTRAIT) {
            let off = 320;
            posX = off;
            if (this.handID == 0)
                posX = off - 75;
            if (this.handID == 1)
                posX = off - 315;
            if (this.handID == 2)
                posX = off - 555;
            posY = -550;
        }

        for (let i = 0; i < this.cards.length; i++) {
            let card = this.cards[i];
            if (i == 0) {
                this.game.add.tween(card).to({x: posX, y: posY}, speed, Phaser.Easing.Sinusoidal.InOut, true);
            }
            else
                this.game.add.tween(card).to({x: posX + 100, y: posY}, speed, Phaser.Easing.Sinusoidal.InOut, true);
        }
        if (Controller.Instance.orientation == Controller.LANDSCAPE) {
            this.game.add.tween(this.selecter).to({
                x: posX - 47,
                y: -328
            }, speed, Phaser.Easing.Sinusoidal.InOut, true);
        } else {
            this.game.add.tween(this.selecter).to({
                x: posX - 47,
                y: -328 - 270
            }, speed, Phaser.Easing.Sinusoidal.InOut, true);
        }


        this.game.add.tween(this.btn).to({y: 300}, speed, Phaser.Easing.Sinusoidal.InOut, true, 500);
    }

    public lose() {
        this.btn.setStatus(1);
        let speed = 500;
        this.game.add.tween(this.btn).to({y: 300}, speed, Phaser.Easing.Sinusoidal.InOut, true, 500);
        for (let i = 0; i < this.cards.length; i++) {
            let card = this.cards[i];
            this.game.add.tween(card).to({y: 300}, speed, Phaser.Easing.Sinusoidal.InOut, true, 750 + i * 100);
        }
    }
}
