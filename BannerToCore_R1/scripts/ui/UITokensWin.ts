/**
 * Created by DEaDA on 6/2/17.
 */
class UITokensWin extends Phaser.Group {

    private tokensBank: Array<UIToken> = [];
    private tokenOffset = 8;

    constructor(game: Phaser.Game, count, color = 'blue') {
        super(game);
        for (let i = 0; i < count; i++) {
            let token = new UIToken(this.game, color);
            this.addChild(token);
            token.y = -this.tokenOffset * i;
            this.tokensBank[i] = token;
        }
        this.prepare();
    }

    public prepare() {
        for (let i = 0; i < this.tokensBank.length; i++) {
            let token = this.tokensBank[i];
            token.y = -500;
        }
    }

    public show() {
        this.game.sound.play('chips_move', 0.5);
        let speed = 250;
        for (let i = 0; i < this.tokensBank.length; i++) {
            let token = this.tokensBank[i];
            token.y = -500;
            this.game.add.tween(token).to({y: -this.tokenOffset * i}, speed, Phaser.Easing.Sinusoidal.Out, true, i * 100);
        }
    }
}