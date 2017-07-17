var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mygame;
(function (mygame) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            this.preloadBarBackground = this.add.image(0, 0, 'preloaderBarEmpty');
            this.preloadBar = this.add.image(0, 0, 'preloaderBar');
            this.preloadBarBackground.alignIn(this.game.world.bounds, Phaser.CENTER);
            this.preloadBar.x = Math.floor(this.preloadBarBackground.x);
            this.preloadBar.y = Math.floor(this.preloadBarBackground.y);
            this.load.setPreloadSprite(this.preloadBar);
            this.icon = this.add.image(0, 0, 'connect');
            this.icon.anchor.set(0.5);
            this.icon.scale.x = -1;
            this.icon.x = this.preloadBar.x + this.preloadBar.width / 2;
            this.icon.y = this.preloadBar.y + this.preloadBar.height + 30;
            var timerEvt = this.game.time.events.loop(10, function () {
                this.icon.rotation += 0.1;
            }, this);
            var baseURL = window['baseURL'];
            this.game.load.image('shadow', baseURL + "assets/shadow.png");
            this.game.load.image('background', baseURL + "assets/background.jpg");
            this.game.load.atlasJSONHash("images", baseURL + "assets/images.png", baseURL + 'assets/images.json');
            this.game.load.bitmapFont('font_all', baseURL + "assets/font_all.png", baseURL + "assets/font_all.fnt");
            this.game.load.audio('win', baseURL + "assets/sounds/win.mp3");
            this.game.load.audio('choose', baseURL + "assets/sounds/choose.mp3");
            this.game.load.audio('chips_bet', baseURL + "assets/sounds/chips_bet.mp3");
            this.game.load.audio('chips_move', baseURL + "assets/sounds/chips_move.mp3");
            this.game.load.audio('click', baseURL + "assets/sounds/click.mp3");
            this.game.load.audio('flop', baseURL + "assets/sounds/flop.mp3");
            this.game.load.audio('new_card', baseURL + "assets/sounds/new_card.mp3");
            this.ChangeSize();
        };
        Preloader.prototype.create = function () {
            this.ChangeSize();
            this.game.state.start('PlayState');
        };
        Preloader.prototype.ChangeSize = function () {
            this.game.scale.setGameSize(window.innerWidth, window.innerHeight);
            this.preloadBarBackground.width = window.innerWidth;
            this.preloadBarBackground.scale.x = this.preloadBarBackground.scale.x - 0.1;
            this.preloadBarBackground.scale.y = this.preloadBarBackground.scale.x;
            this.preloadBar.scale.set(this.preloadBarBackground.scale.x, this.preloadBarBackground.scale.y);
            if (this.game.scale.width > window.innerWidth) {
                this.game.canvas.style.marginLeft = '-' + (this.game.scale.width - window.innerWidth) / 2 + 'px';
            }
            this.preloadBarBackground.alignIn(this.game.world.bounds, Phaser.CENTER);
            this.preloadBar.x = this.preloadBarBackground.x;
            this.preloadBar.y = this.preloadBarBackground.y;
            this.icon.x = this.preloadBarBackground.x + this.preloadBarBackground.width / 2;
            this.icon.y = this.preloadBarBackground.y + this.preloadBarBackground.height + 30;
        };
        return Preloader;
    }(Phaser.State));
    mygame.Preloader = Preloader;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var version = '1.0.0';
    var countTimer;
    var txtClosebtn;
    var timer = 30;
    var closeBtnInner;
    var closeBtn;
    var table;
    var bg;
    var PlayState = (function (_super) {
        __extends(PlayState, _super);
        function PlayState() {
            _super.apply(this, arguments);
        }
        PlayState.prototype.create = function () {
            mygame.Lang.loc = window['lang'];
            mygame.Controller.Instance.reset();
            this.game.stage.smoothed = true;
            mygame.Controller.Instance.width = getSize().width;
            mygame.Controller.Instance.height = getSize().height;
            bg = new BackGround(this.game);
            table = new UITable(this.game);
            table.x = 0;
            mygame.Controller.Instance.addTable(this.game, table);
            this.ChangeSize();
        };
        PlayState.prototype.ChangeSize = function () {
            this.game.scale.setGameSize(getSize().width, getSize().height);
            getSize(true);
            if (document && document.body) {
                document.body.style.margin = "0px 0px 0px 0px";
            }
            if (getSize().width > getSize().height) {
                setupLandscape();
            }
            else {
                setupPortrait();
            }
        };
        return PlayState;
    }(Phaser.State));
    mygame.PlayState = PlayState;
    function getSize(log) {
        if (log === void 0) { log = false; }
        var w = 0;
        var h = 0;
        var deW = 0;
        var deH = 0;
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
        return { width: w, height: h };
    }
    function sendEvent(value, params) {
        if (params === void 0) { params = null; }
        window["trackEvent"](value, params);
    }
    function setupLandscape() {
        bg.x = (getSize().width - bg.width) / 2;
        var w = getSize().width;
        var s = ((w * 100) / 1280) / 100;
        console.log('scale', s);
        table.scale.set(s);
    }
    function setupPortrait() {
        console.log('setupPortrait', table.width);
        bg.x = (getSize().width - bg.width) / 2;
        var w = getSize().width;
        var h = getSize().height;
        var s = ((w * 100) / 720) / 100;
        if (s > 1) {
            var s_1 = ((w * 100) / h) / 100;
            table.scale.set(s_1);
            table.x = (w - 720 * s_1) / 2;
        }
        else {
            table.scale.set(s);
            table.x = (w - 720 * s) / 2;
        }
    }
    function ClickInstall() {
        window["trackClick"]();
    }
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Controller = (function () {
        function Controller() {
            this.balance = 500;
            this.dealTime = 5;
            this.playerMoney = 3000;
            this.soundsEnabled = true;
            this.width = 1280;
            this.height = 720;
            this.orientation = Controller.LANDSCAPE;
        }
        Object.defineProperty(Controller, "Instance", {
            get: function () {
                if (this.instance === null || this.instance === undefined) {
                    this.instance = new Controller();
                }
                return this.instance;
            },
            enumerable: true,
            configurable: true
        });
        Controller.prototype.playSound = function (soundName) {
            if (this.soundsEnabled) {
            }
        };
        Controller.prototype.addTable = function (game, table) {
            this.game = game;
            this.table = table;
        };
        Controller.prototype.reset = function () {
            this.balance = 500;
            this.playerMoney = 3000;
        };
        Controller.prototype.selectHand = function (id) {
            this.table.selectTable(id);
        };
        Controller.LANDSCAPE = "landscape";
        Controller.PORTRAIT = "portrait";
        return Controller;
    }());
    mygame.Controller = Controller;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Lang = (function () {
        function Lang() {
            this.CHOOSE = { en: 'CHOOSE', ru: 'ВЫБРАТЬ' };
            this.HINT = { en: 'CHOOSE THE BEST COMBINATION:', ru: 'ВЫБЕРИТЕ ЛУЧШУЮ КОМБИНАЦИЮ:' };
            this.POT = { en: 'POT:', ru: 'БАНК:' };
            this.BALANCE = { en: 'BALANCE:', ru: 'ВАШ БАЛАНС:' };
            this.YOU_WIN = { en: 'YOU WIN', ru: 'ВЫ ВЫИГРАЛИ' };
            this.STRAIGHT = { en: 'STRAIGHT', ru: 'СТРИТ' };
            this.FLUSH_ROYAL = { en: 'FLUSH ROYAL', ru: 'РОЯЛ-ФЛЕШ' };
            this.THREE_OF_A_KIND = { en: 'THREE OF A KIND', ru: 'СЕТ' };
            this.FULL_HOUSE = { en: 'FULL HOUSE', ru: 'ФУЛЛ-ХАУС' };
            this.STRAIGHT_FLUSH = { en: 'STRAIGHT FLUSH', ru: 'СТРИТ-ФЛЕШ' };
            this.FLUSH = { en: 'FLUSH', ru: 'ФЛЕШ' };
            this.PAIR = { en: 'PAIR', ru: 'ПАРА' };
            this.FOUR_OF_A_KIND = { en: 'FOUR OF A KIND', ru: 'КАРЕ' };
            this.PLAYHINT = { en: 'PLAY', ru: 'ИГРАТЬ' };
            this.LIKE = { en: 'LIKE POKER?', ru: 'НРАВИТСЯ ПОКЕР?' };
            this.GETAPP = {
                en: 'GET ON A NEW LEVEL WITH THIS APP!',
                ru: 'ЛУЧШИЙ ПОКЕР В МИРЕ!'
            };
            this.GAMENAME = {
                en: 'Pokerist: Texas Holdem Poker Online!',
                ru: 'Pokerist: Техасский Покер Онлайн!'
            };
            this.COPYRIGHT = { en: 'By KamaGames', ru: 'KamaGames' };
        }
        Object.defineProperty(Lang, "Instance", {
            get: function () {
                if (this.instance === null || this.instance === undefined) {
                    this.instance = new Lang();
                }
                return this.instance;
            },
            enumerable: true,
            configurable: true
        });
        Lang.loc = 'ru';
        return Lang;
    }());
    mygame.Lang = Lang;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.crossOrigin = 'anonymous';
            var baseURL = window['baseURL'];
            this.game.load.image('connect', baseURL + "assets/connect.png");
            this.game.load.image('preloaderBar', baseURL + "assets/loadingBarOnly.png");
            this.game.load.image('preloaderBarEmpty', baseURL + "assets/loadingBarEmpty.png");
        };
        Boot.prototype.create = function () {
            this.game.renderer.resolution = window.devicePixelRatio;
            if (this.game.renderer.resolution < 2)
                this.game.renderer.resolution = 2;
            if (document.documentElement.clientWidth > document.documentElement.clientHeight) {
                mygame.Controller.Instance.orientation = mygame.Controller.LANDSCAPE;
            }
            else {
                mygame.Controller.Instance.orientation = mygame.Controller.PORTRAIT;
            }
            this.game.input.touch.preventDefault = false;
            this.game.scale.bounds.setTo(0, 0, window.innerWidth, window.innerHeight);
            this.game.stage.backgroundColor = 0x1d1d1d;
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            this.game.state.start('Preloader');
        };
        return Boot;
    }(Phaser.State));
    mygame.Boot = Boot;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 1280, 720, Phaser.CANVAS, 'mdsp-creative', null, false, true);
            this.state.add('Boot', mygame.Boot, false);
            this.state.add('Preloader', mygame.Preloader, false);
            this.state.add('PlayState', mygame.PlayState, false);
            this.state.start('Boot');
        }
        return Game;
    }(Phaser.Game));
    mygame.Game = Game;
})(mygame || (mygame = {}));
var FxSplash = (function (_super) {
    __extends(FxSplash, _super);
    function FxSplash(game, w, h, r, debug) {
        if (debug === void 0) { debug = false; }
        _super.call(this, game);
        var graphics = game.add.graphics(0, 0);
        if (debug)
            graphics.beginFill(0x000000, 0.5);
        else
            graphics.beginFill(0x000000);
        graphics.drawRoundedRect(0, 0, w, h, r);
        graphics.endFill();
        this.addChild(graphics);
        var splash = this.game.add.sprite(0, 0, 'images', 'splash.png');
        if (!debug)
            splash.mask = graphics;
        this.addChild(splash);
        splash.x = -400;
        this.splash = splash;
    }
    FxSplash.prototype.playLoop = function (speed, delay, yoyo) {
        if (speed === void 0) { speed = 1000; }
        if (delay === void 0) { delay = 500; }
        if (yoyo === void 0) { yoyo = false; }
        this.game.add.tween(this.splash).to({
            x: 500
        }, speed, Phaser.Easing.Sinusoidal.Out, true, delay).loop(true).yoyo(yoyo);
    };
    FxSplash.prototype.playOnce = function () {
        this.game.add.tween(this.splash).to({
            x: 500
        }, 1000, Phaser.Easing.Sinusoidal.Out, true, 500);
    };
    return FxSplash;
}(Phaser.Group));
var ResultWindow = (function (_super) {
    __extends(ResultWindow, _super);
    function ResultWindow(game) {
        _super.call(this, game);
        var view = this.game.add.image(0, 0, 'shadow');
        this.addChild(view);
        view.visible = false;
        var tokensSetRed = new UITokensWin(this.game, Math.floor(3 + Math.random() * 10), 'red');
        this.addChild(tokensSetRed);
        tokensSetRed.visible = false;
        var tokensSetGreen = new UITokensWin(this.game, Math.floor(3 + Math.random() * 10), 'green');
        this.addChild(tokensSetGreen);
        tokensSetGreen.visible = false;
        var tokensSetBlue = new UITokensWin(this.game, Math.floor(3 + Math.random() * 10));
        this.addChild(tokensSetBlue);
        tokensSetBlue.visible = false;
        var tokensSetOrange = new UITokensWin(this.game, Math.floor(3 + Math.random() * 10), 'orange');
        this.addChild(tokensSetOrange);
        tokensSetOrange.visible = false;
        var strip = new UIResultTitle(this.game);
        this.addChild(strip);
        strip.visible = false;
        var copy = this.game.add.bitmapText(200, 10, 'font_all', Lang.Instance.LIKE[Lang.loc], 71);
        this.addChild(copy);
        copy.visible = false;
        var copy2 = this.game.add.bitmapText(200, 10, 'font_all', Lang.Instance.GETAPP[Lang.loc], 50);
        this.addChild(copy2);
        copy2.visible = false;
        var btnPlay = new UIButtonPlay(this.game);
        this.addChild(btnPlay);
        btnPlay.visible = false;
        var bottom = new UIBottomPanel(this.game);
        this.addChild(bottom);
        bottom.visible = false;
        this.shadow = view;
        this.tokensSetRed = tokensSetRed;
        this.tokensSetGreen = tokensSetGreen;
        this.tokensSetOrange = tokensSetOrange;
        this.tokensSetBlue = tokensSetBlue;
        this.timer = this.game.time.create(false);
        var del = 500;
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
            this.game.add.tween(this.shadow).to({ alpha: 1 }, 500, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(bottom).to({ y: 620 }, 500, Phaser.Easing.Sinusoidal.Out, true, 2200);
            strip.y = -strip.height;
            this.game.add.tween(strip).to({ y: (720 - strip.height) / 2 - 50 }, 500, Phaser.Easing.Sinusoidal.Out, true, 200);
            btnPlay.y = 800;
            this.btnPlay = btnPlay;
            this.game.add.tween(btnPlay).to({ y: copy2.y + copy2.height + 40 }, 500, Phaser.Easing.Sinusoidal.Out, true, 1200).onComplete.add(this.showPlay, this);
            copy.x = -copy.width;
            copy2.x = 1280;
            this.game.add.tween(copy).to({ x: (1280 - copy.width) / 2 }, 500, Phaser.Easing.Sinusoidal.Out, true, del + 200);
            this.game.add.tween(copy2).to({ x: (1280 - copy2.width) / 2 }, 500, Phaser.Easing.Sinusoidal.Out, true, del + 300);
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
            this.game.add.tween(this.shadow).to({ alpha: 1 }, 500, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(bottom).to({ y: 1180 }, 500, Phaser.Easing.Sinusoidal.Out, true, 2200);
            strip.y = -strip.height;
            this.game.add.tween(strip).to({ y: (1280 - strip.height) / 2 - 50 }, 500, Phaser.Easing.Sinusoidal.Out, true, 200);
            btnPlay.y = 1280;
            this.btnPlay = btnPlay;
            this.game.add.tween(btnPlay).to({ y: copy2.y + copy2.height + 100 }, 500, Phaser.Easing.Sinusoidal.Out, true, 1200).onComplete.add(this.showPlay, this);
            copy.x = -copy.width;
            copy2.x = 720;
            this.game.add.tween(copy).to({ x: (720 - copy.width) / 2 }, 500, Phaser.Easing.Sinusoidal.Out, true, del + 200);
            this.game.add.tween(copy2).to({ x: (720 - copy2.width) / 2 }, 500, Phaser.Easing.Sinusoidal.Out, true, del + 300);
        }
    }
    ResultWindow.prototype.showPlay = function () {
        var posx = this.btnPlay.x - 24;
        var posy = this.btnPlay.y - 10;
        var speed = 250;
        var delay = 250;
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
    };
    ResultWindow.prototype.show1 = function () {
        this.tokensSetOrange.show();
    };
    ResultWindow.prototype.show2 = function () {
        this.tokensSetGreen.show();
    };
    ResultWindow.prototype.show3 = function () {
        this.tokensSetRed.show();
    };
    ResultWindow.prototype.show4 = function () {
        this.tokensSetBlue.show();
    };
    return ResultWindow;
}(Phaser.Group));
var BackGround = (function (_super) {
    __extends(BackGround, _super);
    function BackGround(game) {
        _super.call(this, game);
        this.bg = this.game.add.image(0, 0, 'background');
        this.addChild(this.bg);
        if (Controller.Instance.orientation == Controller.LANDSCAPE) {
            this.bg.height = Controller.Instance.width;
            this.bg.scale.x = this.bg.scale.y;
            this.x = 0;
        }
        else {
            this.bg.height = Controller.Instance.height;
            this.bg.scale.x = this.bg.scale.y;
            this.x = (Controller.Instance.width - this.bg.width) / 2;
        }
    }
    return BackGround;
}(Phaser.Group));
var UIBottomPanel = (function (_super) {
    __extends(UIBottomPanel, _super);
    function UIBottomPanel(game) {
        _super.call(this, game);
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0x004577);
        graphics.drawRect(0, 0, 1280, 100);
        graphics.endFill();
        this.addChild(graphics);
        var icon = this.game.add.image(0, 0, 'images', 'icon@2x.png');
        this.addChild(icon);
        icon.anchor.set(0.5);
        icon.scale.set(0.75);
        icon.x = 100;
        icon.y = 0;
        var win = this.game.add.bitmapText(200, 10, 'font_all', Lang.Instance.GAMENAME[Lang.loc], 34);
        this.addChild(win);
        var by = this.game.add.bitmapText(200, 40, 'font_all', Lang.Instance.COPYRIGHT[Lang.loc], 34);
        this.addChild(by);
    }
    return UIBottomPanel;
}(Phaser.Group));
var UIButtonPlay = (function (_super) {
    __extends(UIButtonPlay, _super);
    function UIButtonPlay(game) {
        _super.call(this, game);
        var viewRight = this.game.add.sprite(0, 0, 'images', 'play.png');
        this.addChild(viewRight);
        viewRight.scale.set(1);
        var splash = new FxSplash(this.game, viewRight.width, viewRight.height - 6, 10);
        this.addChild(splash);
        splash.x = 0;
        splash.y = 0;
        splash.playLoop();
        var title = this.game.add.bitmapText(0, 0, 'font_all', Lang.Instance.PLAYHINT[Lang.loc], 72);
        this.addChild(title);
        title.x = viewRight.x + (viewRight.width - title.width) / 2;
        title.y = viewRight.y + (viewRight.height - title.height) / 2 - 15;
        viewRight.inputEnabled = true;
        viewRight.events.onInputUp.add(this.onClick, this);
    }
    UIButtonPlay.prototype.onClick = function () {
        window['trackClick']();
    };
    return UIButtonPlay;
}(Phaser.Group));
var Lang = mygame.Lang;
var UIButtonSelect = (function (_super) {
    __extends(UIButtonSelect, _super);
    function UIButtonSelect(game) {
        _super.call(this, game);
        var viewSelect = this.game.add.sprite(0, 0, 'images', 'select.png');
        this.addChild(viewSelect);
        var txt = this.game.add.bitmapText(0, 0, 'font_all', Lang.Instance.CHOOSE[Lang.loc], 31);
        txt.smoothed = true;
        this.addChild(txt);
        txt.x = viewSelect.x + (viewSelect.width - txt.width) / 2;
        txt.y = 25;
        var viewFalse = this.game.add.sprite(0, 0, 'images', 'false.png');
        this.addChild(viewFalse);
        var viewRight = this.game.add.sprite(0, 0, 'images', 'right.png');
        this.addChild(viewRight);
        viewRight.x = 4;
        this.selectState = viewSelect;
        this.falseState = viewFalse;
        this.rightState = viewRight;
        var splash = new FxSplash(this.game, viewSelect.width - 24, viewSelect.height - 24, 10);
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
    UIButtonSelect.prototype.setStatus = function (value) {
        this.splash.visible = false;
        this.selectState.visible = false;
        this.falseState.visible = false;
        this.rightState.visible = false;
        if (value == 0) {
            this.selectState.visible = true;
            this.splash.visible = true;
        }
        else if (value == 1) {
            this.falseState.visible = true;
        }
        else
            this.rightState.visible = true;
    };
    UIButtonSelect.prototype.onClick = function () {
        this.game.sound.play('click');
        if (this.callback != null)
            this.callback();
    };
    return UIButtonSelect;
}(Phaser.Group));
var UICard = (function (_super) {
    __extends(UICard, _super);
    function UICard(game) {
        _super.call(this, game);
        var view = this.game.add.image(0, 0, 'images', 'card_place.png');
        this.addChild(view);
        view.x = -1;
        view.y = -1;
        var card = this.game.add.image(0, 0, 'images', 'as.png');
        this.addChild(card);
        var cover = this.game.add.image(0, 0, 'images', 'back.png');
        this.addChild(cover);
        this.back = view;
        this.card = card;
        this.cover = cover;
        cover.visible = false;
        var splash = new FxSplash(this.game, card.width - 4, card.height - 4, 5);
        this.addChild(splash);
        splash.x = card.x + 2;
        this.splash = splash;
    }
    UICard.prototype.setValue = function (value, hideBack) {
        if (value === void 0) { value = 'as'; }
        if (hideBack === void 0) { hideBack = false; }
        if (value != '') {
            this.card.visible = true;
            this.cover.visible = false;
            this.card.frameName = value.toLowerCase() + '.png';
        }
        else {
            this.card.visible = false;
            this.cover.visible = false;
        }
        if (hideBack)
            this.back.visible = false;
    };
    UICard.prototype.playFX = function () {
        this.splash.playOnce();
    };
    return UICard;
}(Phaser.Group));
var Button = Phaser.Button;
var Controller = mygame.Controller;
var UIHand = (function (_super) {
    __extends(UIHand, _super);
    function UIHand(game, count) {
        if (count === void 0) { count = 2; }
        _super.call(this, game);
        this.cards = [];
        this.handID = -1;
        this.cardWidth = 90;
        this.values = [];
        this.main = this;
        var selecter = new UICardSelect(this.game);
        this.addChild(selecter);
        var cards = [];
        for (var i = 0; i < count; i++) {
            var cover = new UICard(this.game);
            this.addChild(cover);
            if (Controller.Instance.orientation == Controller.LANDSCAPE) {
                cover.x = (this.cardWidth + 10) * i;
            }
            else {
                cover.x = 100 * i;
                if (i > 2) {
                    cover.x = 50 + 100 * (i - 3);
                    cover.y = 130;
                }
            }
            cards[i] = cover;
        }
        var btn;
        if (count == 2) {
            var w = 190;
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
    UIHand.prototype.showSelector = function () {
        this.selecter.alpha = 0;
        this.selecter.visible = true;
        this.game.add.tween(this.selecter).to({
            alpha: 1
        }, 200, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(this.hideSelector, this);
    };
    UIHand.prototype.hideSelectorInstant = function () {
        this.selecter.alpha = 0;
        this.selecter.visible = false;
    };
    UIHand.prototype.hideSelector = function () {
        this.game.add.tween(this.selecter).to({
            alpha: 0
        }, 200, Phaser.Easing.Sinusoidal.InOut, true, 500);
    };
    UIHand.prototype.clickButton = function () {
        var h = this.parent;
        Controller.Instance.selectHand(h.handID);
    };
    UIHand.prototype.setCards = function (params, hideBack, repos) {
        if (hideBack === void 0) { hideBack = false; }
        if (repos === void 0) { repos = false; }
        for (var i = 0; i < params.length; i++) {
            var card = this.cards[i];
            if (repos) {
                card.x = 100 * i;
                if (Controller.Instance.orientation == Controller.LANDSCAPE) {
                    card.y = -280;
                }
                else {
                    if (i > 2) {
                        card.x = 50 + 100 * (i - 3);
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
    };
    UIHand.prototype.isWin = function (winCards) {
        for (var i = 0; i < winCards.length; i++)
            if (winCards[i] != this.values[i])
                return false;
        return true;
    };
    UIHand.prototype.startRound = function (delay) {
        if (delay === void 0) { delay = 0; }
        var speed = 250;
        for (var i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
            if (Controller.Instance.orientation == Controller.LANDSCAPE) {
                card.y = -330;
                if (delay != 0)
                    card.y = -600;
            }
            else {
                card.y = -330 - 200;
                if (delay != 0)
                    card.y = 1280;
            }
            this.game.add.tween(card).to({ y: 0 }, speed, Phaser.Easing.Sinusoidal.InOut, true, delay + i * 100).onStart.add(function () {
            });
        }
        if (this.btn) {
            this.btn.y = 300;
            this.game.add.tween(this.btn).to({ y: this.btnYDef }, speed, Phaser.Easing.Sinusoidal.InOut, true, 400);
        }
    };
    UIHand.prototype.hide = function () {
        this.game.sound.play('new_card');
        for (var i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
            this.game.add.tween(card).to({ y: -600, x: 100 }, 500, Phaser.Easing.Sinusoidal.InOut, true);
        }
    };
    UIHand.prototype.prepareWinCars = function (params) {
        for (var i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
            card.x = 100 * i;
            card.y = 0;
            card.setValue(params[i], true);
            this.values[i] = params[i];
        }
    };
    UIHand.prototype.prepare = function (delay) {
        if (delay === void 0) { delay = 0; }
        this.visible = true;
        for (var i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
            if (Controller.Instance.orientation == Controller.LANDSCAPE) {
                card.y = -330;
                if (delay != 0)
                    card.y = -600;
            }
            else {
                card.y = -330 - 600;
                if (delay != 0)
                    card.y = -600 - 600;
            }
        }
    };
    UIHand.prototype.init = function () {
        this.btn.setStatus(0);
    };
    UIHand.prototype.playFX = function () {
        for (var i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
            card.playFX();
        }
    };
    UIHand.prototype.win = function () {
        var speed = 500;
        this.showSelector();
        this.btn.setStatus(2);
        this.selecter.visible = true;
        var posX = 440;
        var posY = -280;
        if (this.handID == 1)
            posX = 440 - 300;
        if (this.handID == 2)
            posX = 440 - 600;
        if (Controller.Instance.orientation == Controller.PORTRAIT) {
            var off = 320;
            posX = off;
            if (this.handID == 0)
                posX = off - 75;
            if (this.handID == 1)
                posX = off - 315;
            if (this.handID == 2)
                posX = off - 555;
            posY = -550;
        }
        for (var i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
            if (i == 0) {
                this.game.add.tween(card).to({ x: posX, y: posY }, speed, Phaser.Easing.Sinusoidal.InOut, true);
            }
            else
                this.game.add.tween(card).to({ x: posX + 100, y: posY }, speed, Phaser.Easing.Sinusoidal.InOut, true);
        }
        if (Controller.Instance.orientation == Controller.LANDSCAPE) {
            this.game.add.tween(this.selecter).to({
                x: posX - 47,
                y: -328
            }, speed, Phaser.Easing.Sinusoidal.InOut, true);
        }
        else {
            this.game.add.tween(this.selecter).to({
                x: posX - 47,
                y: -328 - 270
            }, speed, Phaser.Easing.Sinusoidal.InOut, true);
        }
        this.game.add.tween(this.btn).to({ y: 300 }, speed, Phaser.Easing.Sinusoidal.InOut, true, 500);
    };
    UIHand.prototype.lose = function () {
        this.btn.setStatus(1);
        var speed = 500;
        this.game.add.tween(this.btn).to({ y: 300 }, speed, Phaser.Easing.Sinusoidal.InOut, true, 500);
        for (var i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
            this.game.add.tween(card).to({ y: 300 }, speed, Phaser.Easing.Sinusoidal.InOut, true, 750 + i * 100);
        }
    };
    return UIHand;
}(Phaser.Group));
var UIHands = (function (_super) {
    __extends(UIHands, _super);
    function UIHands(game) {
        _super.call(this, game);
        this.hands = [];
        var hands = [];
        var hand;
        for (var i = 0; i < 3; i++) {
            hand = new UIHand(this.game);
            this.addChild(hand);
            if (Controller.Instance.orientation == Controller.LANDSCAPE)
                hand.x = 300 * i;
            else
                hand.x = 240 * i;
            hand.handID = i;
            hands[i] = hand;
        }
        this.hands = hands;
    }
    UIHands.prototype.startRound = function () {
        var hand;
        for (var i = 0; i < 3; i++) {
            hand = this.hands[i];
            hand.startRound(100 + i * 200);
        }
    };
    UIHands.prototype.showSelectors = function () {
        var hand;
        for (var i = 0; i < 3; i++) {
            hand = this.hands[i];
            hand.showSelector();
        }
    };
    UIHands.prototype.hideSelectors = function () {
        var hand;
        for (var i = 0; i < 3; i++) {
            hand = this.hands[i];
            hand.hideSelectorInstant();
        }
    };
    UIHands.prototype.setCards = function (params, repos) {
        if (repos === void 0) { repos = false; }
        var hand;
        for (var i = 0; i < 3; i++) {
            hand = this.hands[i];
            hand.init();
            hand.setCards(params[i], true, repos);
        }
    };
    UIHands.prototype.win = function (cards) {
        var hand;
        var win = -1;
        for (var i = 0; i < 3; i++) {
            hand = this.hands[i];
            if (hand.isWin(cards)) {
                hand.win();
                win = i;
                this.bringToTop(hand);
            }
            else {
                hand.lose();
            }
        }
        return win;
    };
    return UIHands;
}(Phaser.Group));
var UICardSelect = (function (_super) {
    __extends(UICardSelect, _super);
    function UICardSelect(game) {
        _super.call(this, game);
        var view = this.game.add.image(0, 0, 'images', 'ramka.png');
        this.addChild(view);
        var view2 = this.game.add.image(0, 0, 'images', 'ramka.png');
        view2.scale.x = -1;
        view2.x = view.width * 2;
        this.addChild(view2);
        this.scale.set(1.05, 1.05);
    }
    return UICardSelect;
}(Phaser.Group));
var UILogo = (function (_super) {
    __extends(UILogo, _super);
    function UILogo(game) {
        _super.call(this, game);
        var bg = this.game.add.image(0, 0, 'images', 'logo.png');
        var fx = new FxSplash(this.game, bg.width, bg.height - 5, 0);
        this.addChild(fx);
        this.addChild(bg);
        this.scale.set(0.75);
        fx.playLoop(1000, 2000);
    }
    return UILogo;
}(Phaser.Group));
var BitmapText = Phaser.BitmapText;
var UIMoneyLabel = (function (_super) {
    __extends(UIMoneyLabel, _super);
    function UIMoneyLabel(game, big) {
        if (big === void 0) { big = false; }
        _super.call(this, game);
        var type = '';
        if (big)
            type = '2';
        var bg = this.game.add.image(0, 0, 'images', 'bank' + type + '.png');
        this.addChild(bg);
        var hint = this.game.add.bitmapText(0, 0, 'font_all', Lang.Instance.POT[Lang.loc], 30);
        this.addChild(hint);
        hint.x = Math.floor(bg.x + (bg.width - hint.width) / 2);
        hint.y = 9;
        var hint2 = this.game.add.bitmapText(0, 0, 'font_all', '$200', 30);
        this.addChild(hint2);
        hint2.x = 200;
        hint2.y = 9;
        if (big) {
            hint.tint = 0xffee28;
            hint.x = 20;
            hint2.x = 100;
        }
        else {
            hint.text = Lang.Instance.BALANCE[Lang.loc];
            hint.fontSize = 24;
            hint.y = -31;
            hint.x = bg.x + (bg.width - hint.width) / 2;
            hint2.x = bg.x + (bg.width - hint2.width) / 2;
        }
        this.label = hint2;
    }
    UIMoneyLabel.prototype.setValue = function (value) {
        this.label.text = "$" + value;
    };
    return UIMoneyLabel;
}(Phaser.Group));
var UIResultTitle = (function (_super) {
    __extends(UIResultTitle, _super);
    function UIResultTitle(game) {
        _super.call(this, game);
        var strip = new UIStripTitle(this.game);
        this.addChild(strip);
        var title = new UITitleWin(this.game);
        this.addChild(title);
        title.x = (strip.width - title.width) / 2;
        title.y = (strip.height - title.height) / 2 - 55;
    }
    return UIResultTitle;
}(Phaser.Group));
var UIStripTitle = (function (_super) {
    __extends(UIStripTitle, _super);
    function UIStripTitle(game) {
        _super.call(this, game);
        var left = this.game.add.image(0, 0, 'images', 'lenta.png');
        this.addChild(left);
        var right = this.game.add.image(0, 0, 'images', 'lenta.png');
        this.addChild(right);
        right.scale.x = -1;
        right.x = left.width * 2;
    }
    return UIStripTitle;
}(Phaser.Group));
var Timer = Phaser.Timer;
var ArrayUtils = Phaser.ArrayUtils;
var UITable = (function (_super) {
    __extends(UITable, _super);
    function UITable(game) {
        _super.call(this, game);
        this.currentWin = 0;
        this.isWin = false;
        this.firstTime = true;
        this.level = 0;
        this.gameIsEnded = false;
        this.startTime = 0;
        this.combinations = [
            {
                win: ['ks', 'kh', 'kd', 'kc', 'as'],
                table: ['ks', 'kh', 'kd'],
                hands: [['kc', 'as'], ['qc', 'jh'], ['qh', 'jc']],
                name: Lang.Instance.FOUR_OF_A_KIND[Lang.loc],
                winHand: ['kc', 'as']
            },
            {
                win: ['qs', 'qh', 'ts', 'qc', 'qd'],
                table: ['qs', 'qh', 'ts'],
                hands: [['qc', 'qd'], ['th', 'tc'], ['as', '5h']],
                name: Lang.Instance.FOUR_OF_A_KIND[Lang.loc],
                winHand: ['qc', 'qd']
            },
            {
                win: ['jc', '2s', 'js', 'jh', 'jd'],
                table: ['jc', '2s', 'js'],
                hands: [['jh', 'jd'], ['kd', 'ad'], ['ks', 'as']],
                name: Lang.Instance.FOUR_OF_A_KIND[Lang.loc],
                winHand: ['jh', 'jd']
            },
            {
                win: ['7d', 'ad', 'ac', 'ah', 'as'],
                table: ['7d', 'ad', 'ac'],
                hands: [['ah', 'as'], ['2c', '5h'], ['kc', 'kd']],
                name: Lang.Instance.FOUR_OF_A_KIND[Lang.loc],
                winHand: ['ah', 'as']
            },
            {
                win: ['7d', '7s', '7h', 'ks', '7c'],
                table: ['7d', '7s', '7h'],
                hands: [['ks', '7c'], ['2d', '2h'], ['as', 'ah']],
                name: Lang.Instance.FOUR_OF_A_KIND[Lang.loc],
                winHand: ['ks', '7c']
            },
            {
                win: ['3d', '3s', '3h', 'ks', 'kc'],
                table: ['3d', '3s', '3h'],
                hands: [['ks', 'kc'], ['ts', 'tc'], ['2h', '4d']],
                name: Lang.Instance.FULL_HOUSE[Lang.loc],
                winHand: ['ks', 'kc']
            },
            {
                win: ['7c', '7h', '7s', '3s', '3c'],
                table: ['7c', '7h', '7s'],
                hands: [['3s', '3c'], ['5h', '2d'], ['ks', 'ac']],
                name: Lang.Instance.FULL_HOUSE[Lang.loc],
                winHand: ['3s', '3c']
            },
            {
                win: ['qd', 'qs', '3h', 'qh', '3c'],
                table: ['qd', 'qs', '3h'],
                hands: [['qh', '3c'], ['3d', 'as'], ['9d', 'tc']],
                name: Lang.Instance.FULL_HOUSE[Lang.loc],
                winHand: ['qh', '3c']
            },
            {
                win: ['tc', '5h', '5d', 'th', 'ts'],
                table: ['tc', '5h', '5d'],
                hands: [['th', 'ts'], ['5c', 'td'], ['3h', '3h']],
                name: Lang.Instance.FULL_HOUSE[Lang.loc],
                winHand: ['th', 'ts']
            },
            {
                win: ['ah', 'as', 'ad', 'ks', 'kc'],
                table: ['ah', 'as', 'ad'],
                hands: [['ks', 'kc'], ['qh', 'qd'], ['3s', '7c']],
                name: Lang.Instance.FULL_HOUSE[Lang.loc],
                winHand: ['ks', 'kc']
            },
            {
                win: ['2s', '5s', 'as', 'ks', '3s'],
                table: ['2s', '5s', 'as'],
                hands: [['ks', '3s'], ['qs', '2d'], ['3s', '3c']],
                name: Lang.Instance.FLUSH[Lang.loc],
                winHand: ['ks', '3s']
            },
            {
                win: ['9h', 'th', 'qh', '2h', '5h'],
                table: ['9h', 'th', 'qh'],
                hands: [['2h', '5h'], ['kh', 'jd'], ['3s', '7c']],
                name: Lang.Instance.FLUSH[Lang.loc],
                winHand: ['2h', '5h']
            },
            {
                win: ['td', 'qd', '7d', '2d', '3d'],
                table: ['td', 'qd', '7d'],
                hands: [['2d', '3d'], ['7s', '7c'], ['ah', 'ac']],
                name: Lang.Instance.FLUSH[Lang.loc],
                winHand: ['2d', '3d']
            },
            {
                win: ['jc', 'qc', 'ac', '2c', '3c'],
                table: ['jc', 'qc', 'ac'],
                hands: [['2c', '3c'], ['qs', 'as'], ['ad', 'ah']],
                name: Lang.Instance.FLUSH[Lang.loc],
                winHand: ['2c', '3c']
            },
            {
                win: ['qs', 'ks', 'as', 'ts', 'js'],
                table: ['qs', 'ks', 'as'],
                hands: [['ts', 'js'], ['ad', 'ac'], ['kd', 'ah']],
                name: Lang.Instance.FLUSH_ROYAL[Lang.loc],
                winHand: ['ts', 'js']
            },
            {
                win: ['4s', '5d', '6c', '7s', '8h'],
                table: ['4s', '5d', '6c'],
                hands: [['7s', '8h'], ['3d', '7c'], ['ah', 'kh']],
                name: Lang.Instance.STRAIGHT[Lang.loc],
                winHand: ['7s', '8h']
            },
            {
                win: ['js', 'kc', 'qs', 'ad', 'th'],
                table: ['js', 'kc', 'qs'],
                hands: [['ad', 'th'], ['5c', '7d'], ['as', 'ks']],
                name: Lang.Instance.STRAIGHT[Lang.loc],
                winHand: ['ad', 'th']
            },
            {
                win: ['5c', '6d', '7d', '8c', '9c'],
                table: ['5c', '6d', '7d'],
                hands: [['8c', '9c'], ['9d', 'td'], ['kd', 'ad']],
                name: Lang.Instance.STRAIGHT[Lang.loc],
                winHand: ['8c', '9c']
            },
            {
                win: ['th', 'jh', 'qh', 'ks', 'as'],
                table: ['th', 'jh', 'qh'],
                hands: [['ks', 'as'], ['ah', '7s'], ['kc', '3c']],
                name: Lang.Instance.STRAIGHT[Lang.loc],
                winHand: ['ks', 'as']
            },
            {
                win: ['2h', '3h', '4h', 'ah', '5h'],
                table: ['2h', '3h', '4h'],
                hands: [['ah', '5h'], ['5s', '6s'], ['kc', '3c']],
                name: Lang.Instance.STRAIGHT_FLUSH[Lang.loc],
                winHand: ['ah', '5h']
            },
            {
                win: ['as', 'ad', 'kc', 'ah', '7d'],
                table: ['as', 'ad', 'kc'],
                hands: [['ah', '7d'], ['ks', '8c'], ['qs', '2c']],
                name: Lang.Instance.THREE_OF_A_KIND[Lang.loc],
                winHand: ['ah', '7d']
            },
            {
                win: ['as', 'kh', 'kc', '5c', 'kd'],
                table: ['as', 'kh', 'kc'],
                hands: [['5c', 'kd'], ['qs', '3s'], ['js', '2s']],
                name: Lang.Instance.THREE_OF_A_KIND[Lang.loc],
                winHand: ['5c', 'kd']
            },
            {
                win: ['qs', '2c', '3d', 'qd', 'qc'],
                table: ['qs', '2c', '3d'],
                hands: [['qd', 'qc'], ['2s', '3s'], ['ac', 'kc']],
                name: Lang.Instance.THREE_OF_A_KIND[Lang.loc],
                winHand: ['qd', 'qc']
            },
            {
                win: ['as', '7c', 'td', 'ac', 'ad'],
                table: ['as', '7c', 'td'],
                hands: [['ac', 'ad'], ['5d', 'tc'], ['2h', 'js']],
                name: Lang.Instance.THREE_OF_A_KIND[Lang.loc],
                winHand: ['ac', 'ad']
            },
            {
                win: ['2h', '2c', 'ad', '2c', 'ac'],
                table: ['2h', '2c', 'ad'],
                hands: [['2c', 'ac'], ['qh', '3s'], ['5c', '7d']],
                name: Lang.Instance.THREE_OF_A_KIND[Lang.loc],
                winHand: ['2c', 'ac']
            }
        ];
        this.combinations = ArrayUtils.shuffle(this.combinations);
        var bg = new UITableBack(this.game);
        this.addChild(bg);
        var oval = this.game.add.image(0, 0, 'images', 'oval.png');
        this.addChild(oval);
        var bank = new UIMoneyLabel(this.game, true);
        this.addChild(bank);
        var tokens = new UITokens(this.game, 2, 10);
        this.addChild(tokens);
        var balance = new UIMoneyLabel(this.game);
        this.addChild(balance);
        var tableCardsBack = new UIHand(this.game, 5);
        this.addChild(tableCardsBack);
        var tableHands = new UIHand(this.game, 3);
        this.addChild(tableHands);
        var hands = new UIHands(this.game);
        this.addChild(hands);
        var hint = this.game.add.bitmapText(0, 0, 'font_all', Lang.Instance.HINT[Lang.loc], 50);
        this.addChild(hint);
        var logo = new UILogo(this.game);
        this.addChild(logo);
        hint.anchor.set(0.5);
        this.tableCardsBack = tableCardsBack;
        this.hint = hint;
        this.bank = bank;
        this.oval = oval;
        this.balance = balance;
        this.token = tokens;
        this.hands = hands;
        this.tableHands = tableHands;
        this.timer = this.game.time.create(false);
        this.logo = logo;
        this.hands = hands;
        tableHands.setCards(this.combinations[this.level]["table"], true);
        hands.setCards(ArrayUtils.shuffle(this.combinations[this.level]["hands"]));
        if (Controller.Instance.orientation == Controller.LANDSCAPE) {
            bg.width = 1280;
            bg.scale.y = bg.scale.x;
            oval.scale.set(0.85, 0.85);
            oval.x = 500;
            oval.y = 115;
            bank.x = oval.x + oval.width + 30;
            bank.y = oval.y + 10;
            tokens.x = oval.x + 4;
            tokens.y = oval.y - 5;
            balance.x = 1000 - 30;
            balance.y = oval.y + 50 + 100;
            tableCardsBack.x = (1280 - 500) / 2;
            tableCardsBack.y = 200;
            tableCardsBack.setCards(['', '', '', '', '']);
            tableHands.x = (1280 - 500) / 2;
            tableHands.y = 200;
            hands.x = 250;
            hands.y = 480;
            hint.tint = 0xffee28;
            hint.x = tableCardsBack.x + 250;
            hint.y = tableCardsBack.y + 190;
            logo.x = 30;
            logo.y = 30;
        }
        else {
            bg.width = 720;
            bg.scale.y = bg.scale.x;
            bg.y = 100;
            oval.scale.set(0.85, 0.85);
            oval.x = 210;
            oval.y = 280;
            tokens.x = oval.x + 4;
            tokens.y = oval.y - 5;
            bank.x = oval.x + oval.width + 30;
            bank.y = oval.y + 10;
            balance.x = 320 + 50;
            balance.y = 700;
            tableCardsBack.x = (720 - 290) / 2;
            tableCardsBack.y = 370;
            tableCardsBack.setCards(['', '', '', '', '']);
            tableHands.x = (720 - 290) / 2;
            tableHands.y = 370;
            hands.x = 20;
            hands.y = 1050;
            hint.tint = 0xffee28;
            hint.x = 720 / 2;
            hint.y = hands.y - 45;
            logo.scale.set(1);
            logo.x = 180;
            logo.y = 30;
        }
        this.timerEnd = this.game.time.create(false);
        var endGameTimer = window["endGameTimer"];
        if (endGameTimer == null)
            endGameTimer = 45000;
        this.timerEnd.add(endGameTimer, this.endGame, this);
        this.timerEnd.start();
        this.startRound();
    }
    UITable.prototype.startRound = function () {
        if (!this.gameIsEnded) {
            if (this.winCards != null)
                this.remove(this.winCards, true);
            var winCards = new UIHand(this.game, 5);
            winCards.setCards(this.combinations[this.level]["win"], true, false);
            this.addChild(winCards);
            if (Controller.Instance.orientation == Controller.LANDSCAPE) {
                winCards.x = (1280 - 500) / 2;
                winCards.y = 200;
            }
            else {
                winCards.x = (720 - 290) / 2;
                winCards.y = 370;
            }
            winCards.visible = false;
            this.winCards = winCards;
            var tokens = new UITokens(this.game, 2, this.token.tokensBalance.length);
            this.addChild(tokens);
            tokens.x = this.token.x;
            tokens.y = this.token.y;
            this.remove(this.token, true);
            this.token = tokens;
            this.hands.visible = true;
            this.currentWin = this.combinations[this.level]["winHand"];
            this.hint.visible = false;
            this.bank.setValue(0);
            this.balance.setValue(Controller.Instance.balance);
            this.timer.add(400, this.newBankValue, this);
            this.timer.start();
            this.token.prepare(0, this.firstTime);
            this.tableHands.prepare(0);
            this.hands.startRound();
            this.bringToTop(this.hands);
            this.game.sound.play('flop');
        }
    };
    UITable.prototype.newBankValue = function () {
        if (!this.gameIsEnded) {
            this.tableHands.startRound();
            this.timer.add(750, this.newBankValue2, this);
        }
    };
    UITable.prototype.newBankValue2 = function () {
        if (!this.gameIsEnded) {
            this.token.startRound();
            this.bank.setValue(100);
            this.game.add.tween(this.bank).to({ alpha: 1 }, 200, Phaser.Easing.Sinusoidal.In, true);
            this.bank.visible = true;
            this.timer.add(750, this.newBankValue3, this);
        }
    };
    UITable.prototype.newBankValue3 = function () {
        if (!this.gameIsEnded) {
            this.bank.setValue(200);
            Controller.Instance.balance -= 100;
            this.balance.setValue(Controller.Instance.balance);
            this.hint.visible = true;
            if (this.firstTime) {
                this.hands.showSelectors();
                this.timer.add(1000, this.ready, this);
            }
            else
                this.ready();
        }
    };
    UITable.prototype.ready = function () {
        this.firstTime = false;
        this.isReady = true;
    };
    UITable.prototype.selectTable = function (id) {
        if (!this.gameIsEnded) {
            this.game.add.tween(this.hint).to({ alpha: 0 }, 200, Phaser.Easing.Sinusoidal.In, true);
            if (this.isReady) {
                this.hands.hideSelectors();
                this.isReady = false;
                this.game.sound.play('choose');
                this.currentWin = this.hands.win(this.combinations[this.level]["winHand"]);
                this.timer.add(1200, this.showResult, this);
                this.timer.start();
                if (this.currentWin == id && this.currentWin >= 0) {
                    this.isWin = true;
                }
                else {
                    this.isWin = false;
                }
            }
        }
    };
    UITable.prototype.showResult = function () {
        if (!this.gameIsEnded) {
            this.tableHands.visible = false;
            this.hands.visible = false;
            this.winCards.visible = true;
            var posX = this.winCards.x;
            var posY = this.winCards.y;
            this.tableCardsBack.visible = false;
            if (Controller.Instance.orientation == Controller.LANDSCAPE) {
                this.game.add.tween(this.winCards.scale).to({
                    x: 1.2,
                    y: 1.2
                }, 500, Phaser.Easing.Sinusoidal.InOut, true, 200);
                this.game.add.tween(this.winCards).to({
                    x: posX - 48,
                    y: posY - 10
                }, 500, Phaser.Easing.Sinusoidal.InOut, true, 200);
            }
            else {
                this.game.add.tween(this.winCards.scale).to({
                    x: 1.2,
                    y: 1.2
                }, 500, Phaser.Easing.Sinusoidal.InOut, true, 200);
                this.game.add.tween(this.winCards).to({
                    x: posX - 24,
                    y: posY - 10
                }, 500, Phaser.Easing.Sinusoidal.InOut, true, 200);
            }
            this.game.sound.play('win');
            this.winCards.playFX();
            this.hint.text = this.combinations[this.level]["name"];
            this.hint.alpha = 0;
            this.hint.visible = true;
            this.game.add.tween(this.hint).to({ alpha: 1 }, 500, Phaser.Easing.Sinusoidal.InOut, true);
            this.timer.add(1000, this.showWinToken, this);
            this.timer.start();
        }
    };
    UITable.prototype.showWinToken = function () {
        if (!this.gameIsEnded) {
            this.token.showWin(this.isWin);
            if (this.isWin)
                Controller.Instance.balance += 200;
            this.bank.setValue(0);
            this.game.add.tween(this.bank).to({ alpha: 0 }, 200, Phaser.Easing.Sinusoidal.In, true);
            this.balance.setValue(Controller.Instance.balance);
            if (Controller.Instance.orientation == Controller.LANDSCAPE) {
                if (Controller.Instance.balance > 400)
                    this.game.add.tween(this.balance).to({ x: 1000 - 30 - 60 }, 200, Phaser.Easing.Sinusoidal.In, true);
                else
                    this.game.add.tween(this.balance).to({ x: 1000 - 30 - 30 }, 200, Phaser.Easing.Sinusoidal.In, true);
            }
            this.timer.add(500, this.newRound, this);
            this.timer.start();
        }
    };
    UITable.prototype.newRound = function () {
        if (!this.gameIsEnded) {
            this.tableCardsBack.visible = true;
            this.game.add.tween(this.hint).to({ alpha: 0 }, 500, Phaser.Easing.Sinusoidal.InOut, true);
            this.winCards.hide();
            this.level++;
            if (this.level >= this.combinations.length)
                this.level = 0;
            this.hint.visible = false;
            this.tableHands.setCards(this.combinations[this.level]["table"], true);
            this.hint.text = Lang.Instance.HINT["en"];
            this.hands.setCards(ArrayUtils.shuffle(this.combinations[this.level]["hands"]), true);
            if (!this.gameIsEnded)
                this.bringToTop(this.hands);
            if (Controller.Instance.balance >= 100) {
                this.timer.add(500, this.startRound, this);
                this.timer.start();
            }
            else {
                this.endGame();
            }
        }
    };
    UITable.prototype.endGame = function () {
        this.timerEnd.stop();
        this.gameIsEnded = true;
        this.hands.visible = false;
        var bg = new UITableBack(this.game);
        this.addChild(bg);
        bg.alpha = 0;
        if (Controller.Instance.orientation == Controller.LANDSCAPE) {
            bg.width = 1280;
            bg.scale.y = bg.scale.x;
        }
        else {
            bg.width = 720;
            bg.scale.y = bg.scale.x;
            bg.y = 100;
        }
        this.game.add.tween(bg).to({ alpha: 1 }, 200, Phaser.Easing.Sinusoidal.In, true);
        this.resultWindow = new ResultWindow(this.game);
        this.addChild(this.resultWindow);
        this.bringToTop(this.logo);
    };
    return UITable;
}(Phaser.Group));
var UITableBack = (function (_super) {
    __extends(UITableBack, _super);
    function UITableBack(game) {
        _super.call(this, game);
        if (Controller.Instance.orientation == Controller.LANDSCAPE) {
            var bg = this.game.add.image(0, 0, 'images', 'table_01.png');
            this.addChild(bg);
            var g = this.game.add.group(this);
            this.add(g);
            for (var i = 0; i < 52; i++) {
                var mid = this.game.add.image(0, 0, 'images', 'table_02.png');
                g.addChild(mid);
                mid.x = i * (mid.width);
            }
            g.x = bg.width;
            var bgr = this.game.add.image(0, 0, 'images', 'table_01.png');
            this.addChild(bgr);
            bgr.x = 1140;
            bgr.scale.x = -1;
        }
        else {
            var bg = this.game.add.image(0, 0, 'images', 'table_vert.png');
            this.addChild(bg);
            var bgr = this.game.add.image(0, 0, 'images', 'table_vert.png');
            this.addChild(bgr);
            bgr.x = 640;
            bgr.scale.x = -1;
        }
    }
    return UITableBack;
}(Phaser.Group));
var UITitleWin = (function (_super) {
    __extends(UITitleWin, _super);
    function UITitleWin(game) {
        _super.call(this, game);
        if (Controller.Instance.balance <= 0) {
            var title = this.game.add.bitmapText(0, 0, 'font_all', 'Good try!', 72);
            title.tint = 0xf7d501;
            this.addChild(title);
        }
        else {
            var title = this.game.add.bitmapText(0, 0, 'font_all', Lang.Instance.YOU_WIN[Lang.loc], 60);
            title.tint = 0xf7d501;
            this.addChild(title);
            var win = this.game.add.bitmapText(0, 0, 'font_all', '$' + Controller.Instance.balance + '!', 60);
            this.addChild(win);
            win.x = title.x + title.width + 10;
            win.y = title.y;
        }
    }
    return UITitleWin;
}(Phaser.Group));
var UIToken = (function (_super) {
    __extends(UIToken, _super);
    function UIToken(game, color) {
        if (color === void 0) { color = 'blue'; }
        _super.call(this, game);
        var bg = this.game.add.image(0, 0, 'images', color + '.png');
        this.addChild(bg);
        this.icon = bg;
    }
    UIToken.prototype.select = function (color) {
        if (color === void 0) { color = 0xff00ff; }
        this.icon.tint = color;
    };
    return UIToken;
}(Phaser.Group));
var UITokens = (function (_super) {
    __extends(UITokens, _super);
    function UITokens(game, countBank, countBalance) {
        if (countBank === void 0) { countBank = 2; }
        if (countBalance === void 0) { countBalance = 8; }
        _super.call(this, game);
        this.tokensBank = [];
        this.tokensBalance = [];
        this.tokenOffset = 8;
        this.limitToken = 8;
        for (var i = 0; i < countBank; i++) {
            var token = new UIToken(this.game);
            this.addChild(token);
            token.y = -this.tokenOffset * i;
            this.tokensBank[i] = token;
        }
        for (var i = 0; i < countBalance; i++) {
            var token = new UIToken(this.game);
            this.addChild(token);
            if (Controller.Instance.orientation == Controller.LANDSCAPE) {
                token.y = 50 - this.tokenOffset * i;
                token.x = 494;
                if (i > 7) {
                    token.x = 494 - 75;
                    token.y = 50 - this.tokenOffset * (i - 8);
                }
            }
            else {
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
    UITokens.prototype.showWin = function (isWin) {
        console.log("show win");
        var speed = 100;
        var delay = 0;
        if (isWin) {
            for (var i = 0; i < 4; i++) {
                var token = this.tokensBank[i];
                this.bringToTop(token);
                var posY = 50 - this.tokenOffset * this.tokensBalance.length - this.tokenOffset * i;
                var posX = 494;
                if (Controller.Instance.orientation == Controller.PORTRAIT) {
                    posY = 410 - this.tokenOffset * this.tokensBalance.length - this.tokenOffset * i;
                    posX = 70;
                }
                if (i + this.tokensBalance.length > 7) {
                    posX = 494 - 75;
                    posY = 50 - this.tokenOffset * (this.tokensBalance.length) - this.tokenOffset * (i - 8);
                    if (Controller.Instance.orientation == Controller.PORTRAIT) {
                        posX = 70 - 75;
                        posY = 410 - this.tokenOffset * (this.tokensBalance.length) - this.tokenOffset * (i - 8);
                    }
                }
                if (i == 0) {
                    this.game.add.tween(token).to({
                        x: posX,
                        y: posY
                    }, speed + 200, Phaser.Easing.Sinusoidal.Out, true, delay + i * 100).onStart.add(function () {
                        this.game.sound.play('chips_bet', 0.5);
                    });
                }
                else {
                    this.game.add.tween(token).to({
                        x: posX,
                        y: posY
                    }, speed + 200, Phaser.Easing.Sinusoidal.Out, true, delay + i * 100);
                }
            }
            for (var i = this.tokensBank.length - 1; i > this.tokensBank.length - 3; i--) {
                var token = this.tokensBank[i];
                this.tokensBalance[this.tokensBalance.length + 1] = token;
            }
        }
        else {
            speed = 200;
            delay = 0;
            this.game.sound.play('chips_bet', 0.5);
            for (var i = 0; i < this.tokensBank.length; i++) {
                var token = this.tokensBank[i];
                var posY = -200 - this.tokenOffset * i;
                if (Controller.Instance.orientation == Controller.PORTRAIT) {
                    posY = -350 - this.tokenOffset * i;
                }
                this.game.add.tween(token).to({
                    y: posY
                }, speed, Phaser.Easing.Sinusoidal.In, true, i * 50);
            }
        }
    };
    UITokens.prototype.startRound = function () {
        this.game.sound.play('chips_move', 0.5);
        var speed = 250;
        for (var i = 0; i < this.tokensBank.length; i++) {
            var token = this.tokensBank[i];
            token.y = -500;
            this.game.add.tween(token).to({ y: -this.tokenOffset * i }, speed, Phaser.Easing.Sinusoidal.Out, true, i * 100);
        }
        for (var i = 2; i > 0; i--) {
            var token = this.tokensBalance[this.tokensBalance.length - 3 + i];
            if (i == 1) {
                this.game.add.tween(token).to({
                    x: 0,
                    y: -this.tokenOffset * (i + 1)
                }, speed + 200, Phaser.Easing.Sinusoidal.Out, true, 350 + i * 100).onStart.add(function () {
                    this.game.sound.play('chips_bet', 0.5);
                });
            }
            else {
                this.game.add.tween(token).to({
                    x: 0,
                    y: -this.tokenOffset * (i + 1)
                }, speed + 200, Phaser.Easing.Sinusoidal.Out, true, 350 + i * 100);
            }
        }
        for (var i = this.tokensBalance.length - 1; i > this.tokensBalance.length - 3; i--) {
            var token = this.tokensBalance[i];
            this.tokensBank[this.tokensBank.length] = token;
        }
        this.tokensBalance.length = this.tokensBalance.length - 2;
    };
    UITokens.prototype.prepare = function (delay, need) {
        if (delay === void 0) { delay = 0; }
        if (need === void 0) { need = false; }
        var speed = 500;
        for (var i = 0; i < this.tokensBank.length; i++) {
            var token = this.tokensBank[i];
            token.y = -500;
        }
        if (need) {
            for (var i = 0; i < this.tokensBalance.length; i++) {
                var token = this.tokensBalance[i];
                if (Controller.Instance.orientation == Controller.LANDSCAPE) {
                    token.y = 50 - this.tokenOffset * i;
                    token.x = 494;
                    if (i > 7) {
                        token.x = 494 - 75;
                        token.y = 50 - this.tokenOffset * (i - 8);
                    }
                }
                else {
                    token.y = 410 - this.tokenOffset * i;
                    token.x = 70;
                    if (i > 7) {
                        token.x = 70 - 75;
                        token.y = 410 - this.tokenOffset * (i - 8);
                    }
                }
            }
        }
    };
    return UITokens;
}(Phaser.Group));
var UITokensWin = (function (_super) {
    __extends(UITokensWin, _super);
    function UITokensWin(game, count, color) {
        if (color === void 0) { color = 'blue'; }
        _super.call(this, game);
        this.tokensBank = [];
        this.tokenOffset = 8;
        for (var i = 0; i < count; i++) {
            var token = new UIToken(this.game, color);
            this.addChild(token);
            token.y = -this.tokenOffset * i;
            this.tokensBank[i] = token;
        }
        this.prepare();
    }
    UITokensWin.prototype.prepare = function () {
        for (var i = 0; i < this.tokensBank.length; i++) {
            var token = this.tokensBank[i];
            token.y = -500;
        }
    };
    UITokensWin.prototype.show = function () {
        this.game.sound.play('chips_move', 0.5);
        var speed = 250;
        for (var i = 0; i < this.tokensBank.length; i++) {
            var token = this.tokensBank[i];
            token.y = -500;
            this.game.add.tween(token).to({ y: -this.tokenOffset * i }, speed, Phaser.Easing.Sinusoidal.Out, true, i * 100);
        }
    };
    return UITokensWin;
}(Phaser.Group));
