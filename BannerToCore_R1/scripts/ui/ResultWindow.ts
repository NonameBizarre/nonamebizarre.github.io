/**
 * Created by DEaDA on 6/13/17.
 */
class ResultWindow extends Phaser.Group {

    private timer: Timer;
    private tokensSetRed;
    private tokensSetGreen;
    private tokensSetOrange;
    private tokensSetBlue;
    private shadow;
    private btnPlay;

    constructor(game: Phaser.Game) {
        super(game);

        let view = this.game.add.image(0, 0, 'shadow');
        this.addChild(view);
        view.visible = false;

        let tokensSetRed = new UITokensWin(this.game, Math.floor(3 + Math.random() * 10), 'red');
        this.addChild(tokensSetRed);
        tokensSetRed.visible = false;

        let tokensSetGreen = new UITokensWin(this.game, Math.floor(3 + Math.random() * 10), 'green');
        this.addChild(tokensSetGreen);
        tokensSetGreen.visible = false;

        let tokensSetBlue = new UITokensWin(this.game, Math.floor(3 + Math.random() * 10));
        this.addChild(tokensSetBlue);
        tokensSetBlue.visible = false;

        let tokensSetOrange = new UITokensWin(this.game, Math.floor(3 + Math.random() * 10), 'orange');
        this.addChild(tokensSetOrange);
        tokensSetOrange.visible = false;

        let strip = new UIResultTitle(this.game);
        this.addChild(strip);
        strip.visible = false;

        let copy = this.game.add.bitmapText(200, 10, 'font_all', Lang.Instance.LIKE[Lang.loc], 71);
        this.addChild(copy);
        copy.visible = false;

        let copy2 = this.game.add.bitmapText(200, 10, 'font_all', Lang.Instance.GETAPP[Lang.loc], 50);
        this.addChild(copy2);
        copy2.visible = false;

        let btnPlay = new UIButtonPlay(this.game);
        this.addChild(btnPlay);
        btnPlay.visible = false;

        let bottom = new UIBottomPanel(this.game);
        this.addChild(bottom);
        bottom.visible = false;

        this.shadow = view;
        this.tokensSetRed = tokensSetRed;
        this.tokensSetGreen = tokensSetGreen;
        this.tokensSetOrange = tokensSetOrange;
        this.tokensSetBlue = tokensSetBlue;
        this.timer = this.game.time.create(false);
        let del = 500;
        this.timer.add(del + 200, this.show1, this);
        this.timer.add(del + 500, this.show2, this);
        this.timer.add(del + 1000, this.show3, this);
        this.timer.add(del + 1500, this.show4, this);
        this.timer.start();
        this.shadow.alpha = 0;

        if (Controller.Instance.orientation == Controller.LANDSCAPE) {

            view.width = 1280;
            view.height = 720;

            strip.x = (1280 - strip.width) / 2;
            strip.y = (720 - strip.height) / 2 - 50;

            copy.x = (1280 - copy.width) / 2;
            copy.y = strip.y + strip.height - 80;

            copy2.x = (1280 - copy2.width) / 2;
            copy2.y = copy.y + copy.height + 10;

            btnPlay.x = 430;
            btnPlay.y = copy2.y + copy2.height + 40;

            bottom.y = 850;

            tokensSetOrange.x = strip.x + strip.width / 2 - tokensSetRed.width / 2;
            tokensSetOrange.y = strip.y - 30;

            tokensSetGreen.x = strip.x + strip.width / 2 - tokensSetGreen.width / 2 - 50;
            tokensSetGreen.y = strip.y - 60;

            tokensSetRed.x = strip.x + strip.width / 2 - tokensSetGreen.width / 2 - 10;
            tokensSetRed.y = strip.y - 90;

            tokensSetBlue.x = strip.x + strip.width / 2 + tokensSetGreen.width / 2 - 30;
            tokensSetBlue.y = strip.y - 70;

            view.visible = true;
            tokensSetRed.visible = true;
            tokensSetGreen.visible = true;
            tokensSetBlue.visible = true;
            tokensSetOrange.visible = true;
            strip.visible = true;
            copy.visible = true;
            copy2.visible = true;
            btnPlay.visible = true;
            bottom.visible = true;

            this.game.add.tween(this.shadow).to({alpha: 1}, 500, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(bottom).to({y: 620}, 500, Phaser.Easing.Sinusoidal.Out, true, 2200);

            strip.y = -strip.height;
            this.game.add.tween(strip).to({y: (720 - strip.height) / 2 - 50}, 500, Phaser.Easing.Sinusoidal.Out, true, 200);

            btnPlay.y = 800;
            this.btnPlay = btnPlay;
            this.game.add.tween(btnPlay).to({y: copy2.y + copy2.height + 40}, 500, Phaser.Easing.Sinusoidal.Out, true, 1200).onComplete.add(this.showPlay, this);

            copy.x = -copy.width;
            copy2.x = 1280;
            this.game.add.tween(copy).to({x: (1280 - copy.width) / 2}, 500, Phaser.Easing.Sinusoidal.Out, true, del + 200);
            this.game.add.tween(copy2).to({x: (1280 - copy2.width) / 2}, 500, Phaser.Easing.Sinusoidal.Out, true, del + 300);

        }
        else {
            view.width = 720;
            view.height = 1280;

            strip.x = (720 - strip.width) / 2;
            strip.y = (1280 - strip.height) / 2 - 50;

            copy.x = (720 - copy.width) / 2;
            copy.y = strip.y + strip.height - 80;

            copy2.x = (720 - copy2.width) / 2;
            copy2.y = copy.y + copy.height + 30;

            btnPlay.x = 150;
            btnPlay.y = copy2.y + copy2.height + 100;

            bottom.y = 1400;

            tokensSetOrange.x = strip.x + strip.width / 2 - tokensSetRed.width / 2;
            tokensSetOrange.y = strip.y - 30;

            tokensSetGreen.x = strip.x + strip.width / 2 - tokensSetGreen.width / 2 - 50;
            tokensSetGreen.y = strip.y - 60;

            tokensSetRed.x = strip.x + strip.width / 2 - tokensSetGreen.width / 2 - 10;
            tokensSetRed.y = strip.y - 90;

            tokensSetBlue.x = strip.x + strip.width / 2 + tokensSetGreen.width / 2 - 30;
            tokensSetBlue.y = strip.y - 70;

            view.visible = true;
            tokensSetRed.visible = true;
            tokensSetGreen.visible = true;
            tokensSetBlue.visible = true;
            tokensSetOrange.visible = true;
            strip.visible = true;
            copy.visible = true;
            copy2.visible = true;
            btnPlay.visible = true;
            bottom.visible = true;


            this.game.add.tween(this.shadow).to({alpha: 1}, 500, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(bottom).to({y: 1180}, 500, Phaser.Easing.Sinusoidal.Out, true, 2200);

            strip.y = -strip.height;
            this.game.add.tween(strip).to({y: (1280 - strip.height) / 2 - 50}, 500, Phaser.Easing.Sinusoidal.Out, true, 200);

            btnPlay.y = 1280;
            this.btnPlay = btnPlay;
            this.game.add.tween(btnPlay).to({y: copy2.y + copy2.height + 100}, 500, Phaser.Easing.Sinusoidal.Out, true, 1200).onComplete.add(this.showPlay, this);

            copy.x = -copy.width;
            copy2.x = 720;
            this.game.add.tween(copy).to({x: (720 - copy.width) / 2}, 500, Phaser.Easing.Sinusoidal.Out, true, del + 200);
            this.game.add.tween(copy2).to({x: (720 - copy2.width) / 2}, 500, Phaser.Easing.Sinusoidal.Out, true, del + 300);
        }
    }

    showPlay() {
        let posx = this.btnPlay.x - 24;
        let posy = this.btnPlay.y - 10;
        let speed = 250;
        let delay = 250;

        if (Controller.Instance.orientation == Controller.LANDSCAPE) {
            posx = this.btnPlay.x - 24;
            posy = this.btnPlay.y - 10;
        }

        this.game.add.tween(this.btnPlay.scale).to({
            x: 1.1,
            y: 1.1
        }, speed, Phaser.Easing.Sinusoidal.Out, true).loop(true).yoyo(true, delay);

        this.game.add.tween(this.btnPlay).to({
            x: posx,
            y: posy
        }, speed, Phaser.Easing.Sinusoidal.Out, true).loop(true).yoyo(true, delay);
    }

    show1() {
        this.tokensSetOrange.show();
    }

    show2() {
        this.tokensSetGreen.show();
    }

    show3() {
        this.tokensSetRed.show();
    }

    show4() {
        this.tokensSetBlue.show();
    }
}