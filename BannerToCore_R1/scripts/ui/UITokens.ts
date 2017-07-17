/**
 * Created by DEaDA on 6/2/17.
 */
class UITokens extends Phaser.Group {

    private tokensBank: Array<UIToken> = [];
    public tokensBalance: Array<UIToken> = [];
    private tokenOffset = 8;
    private limitToken = 8;

    constructor(game: Phaser.Game, countBank = 2, countBalance = 8) {
        super(game);
        for (let i = 0; i < countBank; i++) {
            let token = new UIToken(this.game);
            this.addChild(token);
            token.y = -this.tokenOffset * i;
            this.tokensBank[i] = token;
        }
        for (let i = 0; i < countBalance; i++) {
            let token = new UIToken(this.game);
            this.addChild(token);

            if (Controller.Instance.orientation == Controller.LANDSCAPE) {
                token.y = 50 - this.tokenOffset * i;
                token.x = 494;
                if (i > 7) {
                    token.x = 494 - 75;
                    token.y = 50 - this.tokenOffset * (i - 8);
                }
            } else {
                token.y = 410 - this.tokenOffset * i;
                token.x = 70;
                if (i > 7) {
                    token.x = 70 - 75;
                    token.y = 410 - this.tokenOffset * (i - 8);
                }
            }

            this.tokensBalance[i] = token;
        }
    }

    public showWin(isWin: boolean) {
        console.log("show win");
        let speed = 100;
        let delay = 0;
        if (isWin) {
            for (let i = 0; i < 4; i++) {
                let token = this.tokensBank[i];
                this.bringToTop(token);

                let posY = 50 - this.tokenOffset * this.tokensBalance.length - this.tokenOffset * i;
                let posX = 494;

                if (Controller.Instance.orientation == Controller.PORTRAIT) {
                    posY = 410 - this.tokenOffset * this.tokensBalance.length - this.tokenOffset * i;
                    posX = 70;
                }

                if (i + this.tokensBalance.length > 7) {
                    posX = 494 - 75;
                    posY = 50 - this.tokenOffset * (this.tokensBalance.length ) - this.tokenOffset * (i - 8);

                    if (Controller.Instance.orientation == Controller.PORTRAIT) {
                        posX = 70 - 75;
                        posY = 410 - this.tokenOffset * (this.tokensBalance.length ) - this.tokenOffset * (i - 8);
                    }
                }

                if (i == 0) {
                    this.game.add.tween(token).to({
                        x: posX,
                        y: posY
                    }, speed + 200, Phaser.Easing.Sinusoidal.Out, true, delay + i * 100).onStart.add(function () {
                        this.game.sound.play('chips_bet', 0.5);
                    });
                } else {
                    this.game.add.tween(token).to({
                        x: posX,
                        y: posY
                    }, speed + 200, Phaser.Easing.Sinusoidal.Out, true, delay + i * 100);
                }
            }
            for (let i = this.tokensBank.length - 1; i > this.tokensBank.length - 3; i--) {
                let token = this.tokensBank[i];
                this.tokensBalance[this.tokensBalance.length + 1] = token;
            }
        } else {

            speed = 200;
            delay = 0;
            this.game.sound.play('chips_bet', 0.5);
            for (let i = 0; i < this.tokensBank.length; i++) {
                let token = this.tokensBank[i];
                let posY = -200 - this.tokenOffset * i;

                if (Controller.Instance.orientation == Controller.PORTRAIT) {
                    posY = -350 - this.tokenOffset * i;
                }

                this.game.add.tween(token).to({
                    y: posY
                }, speed, Phaser.Easing.Sinusoidal.In, true, i * 50);
            }
        }
    }

    public startRound() {
        this.game.sound.play('chips_move', 0.5);
        let speed = 250;
        for (let i = 0; i < this.tokensBank.length; i++) {
            let token = this.tokensBank[i];
            token.y = -500;
            this.game.add.tween(token).to({y: -this.tokenOffset * i}, speed, Phaser.Easing.Sinusoidal.Out, true, i * 100);
        }

        for (let i = 2; i > 0; i--) {
            let token = this.tokensBalance[this.tokensBalance.length - 3 + i];
            if (i == 1) {
                this.game.add.tween(token).to({
                    x: 0,
                    y: -this.tokenOffset * (i + 1)
                }, speed + 200, Phaser.Easing.Sinusoidal.Out, true, 350 + i * 100).onStart.add(function () {
                    this.game.sound.play('chips_bet', 0.5);
                });
            } else {
                this.game.add.tween(token).to({
                    x: 0,
                    y: -this.tokenOffset * (i + 1)
                }, speed + 200, Phaser.Easing.Sinusoidal.Out, true, 350 + i * 100);
            }
        }

        for (let i = this.tokensBalance.length - 1; i > this.tokensBalance.length - 3; i--) {
            let token = this.tokensBalance[i];
            this.tokensBank[this.tokensBank.length] = token;
        }
        this.tokensBalance.length = this.tokensBalance.length - 2;
    }

    public prepare(delay: number = 0, need = false) {
        let speed = 500;
        for (let i = 0; i < this.tokensBank.length; i++) {
            let token = this.tokensBank[i];
            token.y = -500;
        }

        if (need) {
            for (let i = 0; i < this.tokensBalance.length; i++) {
                let token = this.tokensBalance[i];

                if (Controller.Instance.orientation == Controller.LANDSCAPE) {
                    token.y = 50 - this.tokenOffset * i;
                    token.x = 494;
                    if (i > 7) {
                        token.x = 494 - 75;
                        token.y = 50 - this.tokenOffset * (i - 8);
                    }
                } else {
                    token.y = 410 - this.tokenOffset * i;
                    token.x = 70;
                    if (i > 7) {
                        token.x = 70 - 75;
                        token.y = 410 - this.tokenOffset * (i - 8);
                    }
                }

            }
        }
    }
}
