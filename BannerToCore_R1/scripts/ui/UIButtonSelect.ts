import Lang = mygame.Lang;
/**
 * Created by DEaDA on 6/2/17.
 */
class UIButtonSelect extends Phaser.Group {

    private selectState;
    private falseState;
    private rightState;
    private splash;

    constructor(game: Phaser.Game) {
        super(game);

        let viewSelect = this.game.add.sprite(0, 0, 'images', 'select.png');
        this.addChild(viewSelect);

        let txt = this.game.add.bitmapText(0, 0, 'font_all', Lang.Instance.CHOOSE[Lang.loc], 31);
        txt.smoothed = true;
        this.addChild(txt);
        txt.x = viewSelect.x + (viewSelect.width - txt.width) / 2;
        txt.y = 25;

        let viewFalse = this.game.add.sprite(0, 0, 'images', 'false.png');
        this.addChild(viewFalse);

        let viewRight = this.game.add.sprite(0, 0, 'images', 'right.png');
        this.addChild(viewRight);
        viewRight.x = 4;

        this.selectState = viewSelect;
        this.falseState = viewFalse;
        this.rightState = viewRight;

        let splash = new FxSplash(this.game, viewSelect.width - 24, viewSelect.height - 24, 10);
        this.addChild(splash);
        splash.x = 14;
        splash.y = 10;
        splash.playLoop(1000, 1000);
        this.splash = splash;
        this.splash.visible = false;

        var graphics = game.add.graphics(0, 0);
        graphics.inputEnabled = true;
        graphics.beginFill(0x000000, 0);
        graphics.drawRect(0, -150, 250, 300);
        graphics.endFill();
        this.addChild(graphics);

        graphics.events.onInputUp.add(this.onClick, this);
    }

    public setStatus(value: number) {
        this.splash.visible = false;
        this.selectState.visible = false;
        this.falseState.visible = false;
        this.rightState.visible = false;
        if (value == 0) {
            this.selectState.visible = true;
            this.splash.visible = true;
        } else if (value == 1) {
            this.falseState.visible = true;
        } else
            this.rightState.visible = true;
    }

    public callback;

    onClick() {
        this.game.sound.play('click');
        if (this.callback != null)
            this.callback();
    }
}
