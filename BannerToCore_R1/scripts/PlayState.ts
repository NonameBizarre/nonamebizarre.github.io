/**
 * Created by DEaDA on 3/25/17.
 */
module mygame {
    import ScaleManager = Phaser.ScaleManager;
    import Sprite = Phaser.Sprite;
    import Game = Phaser.Game;
    import Group = Phaser.Group;
    import Tween = Phaser.Tween;
    import Sound = Phaser.Sound;
    import PhaserTextStyle = Phaser.PhaserTextStyle;
    import Point = Phaser.Point;

    let version: string = '1.0.0';
    let countTimer: Phaser.Timer;
    let txtClosebtn;
    let timer = 30;
    let closeBtnInner;
    let closeBtn;

    let table;
    let bg: BackGround;
    export class PlayState extends Phaser.State {
        create() {
            Lang.loc = window['lang'];

            Controller.Instance.reset();
            this.game.stage.smoothed = true;
            Controller.Instance.width = getSize().width;
            Controller.Instance.height = getSize().height;
            bg = new BackGround(this.game);
            table = new UITable(this.game);
            table.x = 0;
            Controller.Instance.addTable(this.game, table);
            this.ChangeSize();
        }

        ChangeSize() {
            this.game.scale.setGameSize(getSize().width, getSize().height);
            getSize(true);
            if (document && document.body) {
                document.body.style.margin = "0px 0px 0px 0px";
            }
            if (getSize().width > getSize().height) {
                setupLandscape();
            } else {
                setupPortrait();
            }
        }
    }

    function getSize(log = false) {
        let w = 0;
        let h = 0;
        let deW = 0;
        let deH = 0;
        if (!(document.documentElement.clientWidth == 0)) {
            deW = document.documentElement.clientWidth;
            deH = document.documentElement.clientHeight;
        }

        if (log)
            console.log(window.innerHeight + " " + deH, window.outerHeight);
        w = deW;
        h = deH;
        if (window.innerWidth > window.innerHeight) {
            w = window.innerWidth;
            h = window.innerHeight;
        }
        return {width: w, height: h};
    }

    function sendEvent(value, params = null) {
        window["trackEvent"](value, params);
    }

    function setupLandscape() {
        bg.x = (getSize().width - bg.width) / 2;
        let w = getSize().width;
        let s = ((w * 100) / 1280) / 100;
        console.log('scale', s);
        table.scale.set(s);
    }

    function setupPortrait() {
        console.log('setupPortrait', table.width);
        bg.x = (getSize().width - bg.width) / 2;
        let w = getSize().width;
        let h = getSize().height;
        let s = ((w * 100) / 720 ) / 100;

        if (s > 1) {
            let s = ((w * 100) / h ) / 100;
            table.scale.set(s);
            table.x = (w -720 * s) / 2;

        } else {
            table.scale.set(s);
            table.x = (w - 720 * s) / 2;
        }

    }

    function ClickInstall() {
        window["trackClick"]();
    }
}