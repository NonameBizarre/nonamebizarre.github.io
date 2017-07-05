var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var mygame;
(function (mygame) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            return _super !== null && _super.apply(this, arguments) || this;
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
            this.icon.x = this.preloadBarBackground.x + this.preloadBarBackground.width / 2;
            this.icon.y = this.preloadBarBackground.y + this.preloadBarBackground.height + 25;
            var timerEvt = this.game.time.events.loop(10, function () {
                this.icon.rotation += 0.1;
            }, this);
            var baseURL = window['baseURL'];
            this.game.load.image('background', baseURL + "assets/background_1.png");
            this.game.load.atlas("objects", baseURL + "assets/objects.png", baseURL + "assets/objects.json");
            if (window["myLang"] == "en") {
                this.game.load.image("play_free", baseURL + "assets/EngButton.png");
            }
            else {
                this.game.load.image("play_free", baseURL + "assets/DutButton.png");
            }
            this.game.load.atlasJSONHash("images", baseURL + "assets/images.png", baseURL + 'assets/images.json');
            this.game.load.bitmapFont('font', baseURL + "assets/font.png", baseURL + "assets/font.fnt");
        };
        Preloader.prototype.create = function () {
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
    var PlayState = (function (_super) {
        __extends(PlayState, _super);
        function PlayState() {
            var _this = _super.call(this, true) || this;
            _this._winTweens = [];
            return _this;
        }
        PlayState.prototype.create = function () {
            var _this = this;
            this.game.time.advancedTiming = true;
            console.log("222");
            this.game.stage.smoothed = true;
            this._canShowEndScreen = false;
            mygame.Controller.Instance.width = getSize().width;
            mygame.Controller.Instance.height = getSize().height;
            this._container = new mygame.OSprite(mygame.Core.centerX, 0)
                .otherXY(mygame.Core.centerY, 0)
                .end();
            this._background = new mygame.OSprite(mygame.Core.centerX, mygame.Core.centerY - 650, "background")
                .myScale(1.8)
                .otherScale(0.75)
                .otherXY(mygame.Core.centerY, mygame.Core.centerX)
                .enabledBgMode()
                .end();
            this.game.world.addChild(this._background);
            this._playFreeBtnOsprite = new mygame.OSprite(mygame.Core.centerX, 0).myBottomOffset(70).myScale(0.65).end();
            this._playFreeBtnOsprite.otherXY(mygame.Core.centerY, 0).otherBottomOffset(70).otherScale(0.65).end();
            this._playFree = this.game.add.sprite(0, 0, "play_free");
            this._playFree.scale.set(1.3);
            this._playFree.anchor.set(0.5, 0.5);
            this._playFree.inputEnabled = true;
            this._playFree.events.onInputDown.add(function () {
                window["trackClick"]();
            }, this);
            this._playFreeBtnOsprite.addChild(this._playFree);
            if (!window["collectable"]) {
                this._playFree.alpha = 0;
                this._playFree.y = 300;
            }
            this.game.add.tween(this._playFree.scale).to({ x: 1.45, y: 1.45 }, 900, Phaser.Easing.Sinusoidal.Out, true, 0, -1, true);
            if (window["collectable"]) {
                this._gamePanelOsprite = new mygame.OSprite(mygame.Core.centerX, 0).myTopOffset(160).myScale(0.9).end();
                this._gamePanelOsprite.otherXY(mygame.Core.centerY, 0).otherTopOffset(230).otherScale(1.1).end();
                this._panel = new mygame.Panel(this.game, 0, 0);
                this._gamePanelOsprite.addChild(this._panel);
                this._panel.initFruits();
            }
            var startX;
            if (mygame.Core.isLandscape) {
                startX = -400;
                mygame.GameConfig.gameArray = mygame.GameConfig.deepClone(mygame.GameConfig.gameArrayLandscape);
                if (mygame.GameConfig.gameArray.length > 6) {
                    mygame.GameConfig.gameArray = mygame.GameConfig.transpose(mygame.GameConfig.gameArray);
                }
            }
            else {
                mygame.GameConfig.gameArray = mygame.GameConfig.deepClone(mygame.GameConfig.gameArrayPortret);
                startX = -300;
                if (mygame.GameConfig.gameArray.length < 8) {
                    mygame.GameConfig.gameArray = mygame.GameConfig.transpose(mygame.GameConfig.gameArray);
                }
            }
            if (window["collectable"]) {
                this._container = new mygame.OSprite(mygame.Core.centerX, mygame.Core.centerY + 30)
                    .otherXY(mygame.Core.centerY, mygame.Core.centerX - 30)
                    .end();
                this._field = new mygame.Field(this.game, 0, 0, this);
                this._container.addChild(this._field);
                this._field.destroyCallback = function (type, delta) {
                    _this._panel.updateCounter(type, delta);
                };
                this._field.finalCallback = this.showWinScreen.bind(this);
                this._container.myScale(0.95).otherScale(1.05).end();
            }
            else {
                this._container = new mygame.OSprite(mygame.Core.centerX, mygame.Core.centerY)
                    .otherXY(mygame.Core.centerY, mygame.Core.centerX - 80)
                    .end();
                this._field = new mygame.Field(this.game, 0, 0, this);
                this._container.addChild(this._field);
                this._field.destroyCallback = function (type, delta) {
                    type + 1;
                };
                this._field.firstMatchCallback = function () {
                    var tween = _this.game.add.tween(_this._playFree).to({
                        y: 0,
                    }, 500, Phaser.Easing.Sinusoidal.InOut, true, window["playfreeTime"]);
                    tween.onStart.add(function () {
                        _this._playFree.alpha = 1;
                    }, _this);
                };
                this._container.myScale(1).otherScale(1.15).end();
            }
            if (mygame.Core.isLandscape) {
                this._field.pivot.set(100 * mygame.GameConfig.gameArray[0].length / 2, 100 * mygame.GameConfig.gameArray[1].length / 5);
            }
            else {
                this._field.pivot.set(100 * mygame.GameConfig.gameArray[0].length / 2, 100 * mygame.GameConfig.gameArray[1].length / 2);
            }
            this._finalContainer = this.game.add.sprite(0, 0);
            this.initWinScreen();
            this._logoOsprite = new mygame.OSprite(mygame.Core.centerX, 0).myTopOffset(10).myScale(0.65).end();
            this._logoOsprite.otherXY(mygame.Core.centerY, 0).otherTopOffset(15).otherScale(0.95).end();
            this._logo = this.game.add.sprite(0, 0, "objects", "logo.png");
            this._logo.anchor.set(0.5, 0);
            this._logoOsprite.addChild(this._logo);
        };
        PlayState.prototype.readyToEndScreen = function () {
            this._canShowEndScreen = true;
        };
        PlayState.prototype.checkShowEndScreen = function () {
            if (this._canShowEndScreen) {
                this.showWinScreen();
            }
        };
        PlayState.prototype.getGurrentElementPosition = function (type) {
            return this._panel.getElementPosition(type);
        };
        PlayState.prototype.initWinScreen = function () {
            var _this = this;
            this._winScreen = new mygame.OSprite(mygame.Core.centerX, 20)
                .otherXY(mygame.Core.centerY, 20)
                .end();
            this._finalContainer.addChild(this._winScreen);
            this._winBG = this.game.add.sprite(0, -40, "objects", "bg_final.png");
            this._winBG.anchor.set(0.5, 0);
            this._winScreen.addChild(this._winBG);
            this._ostinClap = new mygame.OSprite(0, 0)
                .myBottomOffset(480)
                .myLeftOffset(25)
                .otherBottomOffset(530)
                .otherLeftOffset(25)
                .myScale(2.25)
                .otherScale(2.65)
                .otherXY(20, 700)
                .end();
            this._ostinClapSprite = this.game.add.sprite(0, 0, "objects", "ostin_clap_1.png");
            this._ostinClap.addChild(this._ostinClapSprite);
            this._ostinClapSprite.animations.add("clap", ["ostin_clap_1.png", "ostin_clap_2.png"], 6, true);
            this._finalContainer.addChild(this._ostinClap);
            this._winBG.scale.set(6);
            this._sunray = this.game.add.sprite(0, 300 - 20, "objects", "stars_bg.png");
            this._sunray.anchor.set(0.5, 0.5);
            this._sunray.y += this._sunray.height / 2;
            this._winScreen.addChild(this._sunray);
            this._backStars = this.game.add.sprite(0, 500, "objects", "back_stars.png");
            this._backStars.anchor.set(0.5, 0.5);
            this._winScreen.addChild(this._backStars);
            this._star = this.game.add.sprite(-10, 500, "objects", "final_star.png");
            this._star.anchor.set(0.5, 0.5);
            this._winScreen.addChild(this._star);
            this._welldone = this.game.add.sprite(0, 180, "objects", "well_done_final.png");
            this._welldone.anchor.set(0.5, 0);
            this._winScreen.addChild(this._welldone);
            this._installNowSpriteOriginal = this.game.add.sprite(0, 0, "objects", "install_final.png");
            this._installNowSpriteOriginal.anchor.set(0.5, 0.5);
            this._installNowSprite = new mygame.OSprite(1100 - 20, 520)
                .otherXY(600 - 50, 1035)
                .myScale(1.5)
                .otherScale(1.25)
                .end();
            this._finalContainer.addChild(this._installNowSprite);
            this._installNowSprite.events.onInputDown.add(function () {
                window["trackClick"]();
            }, this);
            this._installNowSprite.addChild(this._installNowSpriteOriginal);
            this._replaySprite = new mygame.OSprite(1100 - 20, 650, "objects", "replay_final.png")
                .otherXY(600 - 50, 1150)
                .myScale(1.35)
                .otherScale(1.2)
                .end();
            this._replaySprite.events.onInputDown.add(function () {
                _this._field.replay();
                if (window["collectable"]) {
                    _this._panel.replay();
                }
                _this.hideWinScreen();
            }, this);
            this._finalContainer.addChild(this._replaySprite);
            if (mygame.Core.isLandscape) {
                this._welldone.scale.set(1.25);
                this._sunray.scale.set(1.2);
            }
            else {
                this._welldone.scale.set(1.5);
                this._sunray.scale.set(1.3);
            }
            this._finalContainer.x = -1800;
            if (this._winScreen.children.indexOf(this._logo) > 0) {
            }
            this._installNowSpriteOriginal.scale.set(0.85, 0.85);
            this._installNowSpriteOriginal.angle = 3;
            this._installNowSprite.alpha = 0;
            this._replaySprite.alpha = 0;
            this._container.alpha = 1;
            this._ostinClap.alpha = 0;
            this._winScreen.alpha = 0;
            this._installNowSprite.inputEnabled = false;
            this._replaySprite.inputEnabled = false;
            this._canShowEndScreen = false;
        };
        PlayState.prototype.hideWinScreen = function () {
            var _this = this;
            if (this._winScreen.children.indexOf(this._logo) > 0) {
            }
            this._logoOsprite.otherScale(0.95).end();
            this.game.add.tween(this._logo.scale).to({ x: 1, y: 1 }, 500, Phaser.Easing.Sinusoidal.Out, true);
            this._installNowSprite.inputEnabled = false;
            this._replaySprite.inputEnabled = false;
            this._canShowEndScreen = false;
            this.game.add.tween(this._finalContainer).to({
                x: -1800
            }, 500, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                _this._installNowSprite.alpha = 0;
                _this._replaySprite.alpha = 0;
                _this._container.alpha = 1;
                _this._ostinClap.alpha = 0;
                _this._winScreen.alpha = 0;
                _this._installNowSpriteOriginal.scale.set(0.85, 0.85);
                _this._installNowSpriteOriginal.angle = 3;
                for (var i = 0; i < _this._winTweens.length; i++) {
                    _this.game.tweens.remove(_this._winTweens[i]);
                }
                _this._winTweens = [];
            });
        };
        PlayState.prototype.render = function () {
        };
        PlayState.prototype.update = function () {
            if (window["collectable"]) {
                this._panel.update();
            }
        };
        PlayState.prototype.showWinScreen = function () {
            var _this = this;
            this.game.add.tween(this._finalContainer).to({
                x: 0
            }, 500, Phaser.Easing.Sinusoidal.InOut, true);
            this._ostinClapSprite.play("clap");
            this._field.disableField = true;
            this._sunray.angle = 0;
            this._star.angle = 0;
            this._installNowSpriteOriginal.angle = 3;
            this._backStars.scale.set(1, 1);
            this._installNowSpriteOriginal.scale.set(0.85, 0.85);
            this._winScreen.alpha = 1;
            this._ostinClap.alpha = 1;
            this._installNowSprite.alpha = 1;
            this._replaySprite.alpha = 1;
            this._installNowSprite.inputEnabled = true;
            this._replaySprite.inputEnabled = true;
            this._winTweens.push(this.game.add.tween(this._sunray).to({ angle: 360 }, 18500, Phaser.Easing.Linear.None, true, 0, -1));
            this._winTweens[0].onComplete.addOnce(function () {
                _this._sunray.angle = 0;
            });
            this._winTweens.push(this.game.add.tween(this._backStars.scale).to({ x: this._backStars.scale.x + 0.25, y: this._backStars.scale.y + 0.25 }, 2800, Phaser.Easing.Sinusoidal.InOut, true, 0, -1));
            this._winTweens[1].yoyo(true);
            this._winTweens.push(this.game.add.tween(this._star).to({ angle: 15 }, 3400, Phaser.Easing.Sinusoidal.Out, true, 0, -1));
            this._winTweens[2].yoyo(true);
            this._winTweens.push(this.game.add.tween(this._installNowSpriteOriginal.scale).to({ x: 1, y: 1 }, 3400, Phaser.Easing.Sinusoidal.Out, true, 0, -1));
            this._winTweens[3].yoyo(true, 3600);
            this._winTweens.push(this.game.add.tween(this._installNowSpriteOriginal).to({ angle: -3 }, 1200, Phaser.Easing.Sinusoidal.Out, true, 0, -1));
            this._winTweens[4].yoyo(true, 0);
            this.game.add.tween(this._logo.scale).to({ x: 1.6, y: 1.6 }, 600, Phaser.Easing.Sinusoidal.Out, true);
            this._logoOsprite.otherScale(0.65).end();
        };
        PlayState.prototype.onLandscape = function () {
            var _this = this;
            if (this._welldone) {
                this._welldone.scale.set(1.25);
                this._sunray.scale.set(1.2);
            }
            if (this._playFree && this.game.device.iPad) {
            }
            if (this._field && mygame.GameConfig.gameArray.length != 4) {
                mygame.GameConfig.gameArray = mygame.GameConfig.deepClone(mygame.GameConfig.gameArrayLandscape);
                var y = this._field.y;
                this._field.destroy();
                this._field = new mygame.Field(this.game, 0, 0, this);
                this._field.pivot.set(100 * mygame.GameConfig.gameArray[0].length / 2, 100 * mygame.GameConfig.gameArray[1].length / 5);
                this._container.addChild(this._field);
                if (window["collectable"]) {
                    this._field.destroyCallback = function (type, delta) {
                        _this._panel.updateCounter(type, delta);
                    };
                    this._field.finalCallback = this.showWinScreen.bind(this);
                }
                else {
                    this._field.destroyCallback = function (type, delta) {
                        type + 1;
                    };
                }
            }
        };
        PlayState.prototype.onPortret = function () {
            var _this = this;
            if (this._welldone) {
                this._welldone.scale.set(1.5);
                this._sunray.scale.set(1.3);
            }
            if (this._playFree && this.game.device.iPad) {
            }
            if (this._field && mygame.GameConfig.gameArray.length != 8) {
                mygame.GameConfig.gameArray = mygame.GameConfig.deepClone(mygame.GameConfig.gameArrayPortret);
                var y = this._field.y;
                this._field.destroy();
                this._field = new mygame.Field(this.game, 0, 0, this);
                this._field.pivot.set(100 * mygame.GameConfig.gameArray[0].length / 2, 100 * mygame.GameConfig.gameArray[1].length / 2);
                this._container.addChild(this._field);
                if (window["collectable"]) {
                    this._field.destroyCallback = function (type, delta) {
                        _this._panel.updateCounter(type, delta);
                    };
                    this._field.finalCallback = this.showWinScreen.bind(this);
                }
                else {
                    this._field.destroyCallback = function (type, delta) {
                        type + 1;
                    };
                }
            }
        };
        PlayState.prototype.ChangeSize = function () {
        };
        return PlayState;
    }(mygame.OState));
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
    }
    function setupPortrait() {
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
        return Controller;
    }());
    Controller.LANDSCAPE = "landscape";
    Controller.PORTRAIT = "portrait";
    mygame.Controller = Controller;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Boot.prototype.preload = function () {
            this.load.crossOrigin = 'anonymous';
            var baseURL = window['baseURL'];
            this.game.load.image('connect', baseURL + "assets/connect.png");
            this.game.load.image('preloaderBar', baseURL + "assets/loadingBarOnly.png");
            this.game.load.image('preloaderBarEmpty', baseURL + "assets/loadingBarEmpty.png");
        };
        Boot.prototype.create = function () {
            mygame.Controller.Instance.orientation = mygame.Controller.LANDSCAPE;
            if (window["orientation"] == "p")
                mygame.Controller.Instance.orientation = mygame.Controller.PORTRAIT;
            this.game.input.touch.preventDefault = false;
            this.game.stage.backgroundColor = 0x1d1d1d;
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            mygame.Core.begin(this.game, !this.game.device.desktop);
            this.game.state.start('Preloader');
        };
        Boot.prototype.ChangeSize = function () {
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
            var _this = _super.call(this, 1280, 720, Phaser.AUTO, 'mdsp-creative', null, false, true) || this;
            mygame.Core.init(1280, 720);
            _this.state.add('Boot', mygame.Boot, false);
            _this.state.add('Preloader', mygame.Preloader, false);
            _this.state.add('PlayState', mygame.PlayState, false);
            _this.state.start('Boot');
            return _this;
        }
        return Game;
    }(Phaser.Game));
    mygame.Game = Game;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var BlockTypes;
    (function (BlockTypes) {
        BlockTypes[BlockTypes["DISABLED"] = 0] = "DISABLED";
        BlockTypes[BlockTypes["ACTIVE"] = 1] = "ACTIVE";
    })(BlockTypes = mygame.BlockTypes || (mygame.BlockTypes = {}));
    ;
    ;
    ;
    var Field = (function (_super) {
        __extends(Field, _super);
        function Field(game, x, y, playState) {
            var _this = _super.call(this, game, x, y) || this;
            _this._fieldUpperBound = [];
            _this._playState = playState;
            _this._destroyed = 0;
            _this._turnOffMask = false;
            _this._firstMatch = false;
            _this._finalWasFired = false;
            _this._gameArray = mygame.GameConfig.gameArray;
            _this._fieldUpperBound = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            _this._streak = [];
            for (var i = 0; i < 6; i++) {
                _this._streak.push(0);
            }
            _this._disabled = false;
            _this._bgContainer = _this.game.add.sprite(0, 0);
            _this._bgContainer.anchor.set(0.5, 0);
            _this.addChild(_this._bgContainer);
            _this._container = _this.game.add.sprite(0, 0);
            _this._container.anchor.set(0.5, 0);
            _this.addChild(_this._container);
            _this._myMask = _this.game.add.graphics(0, 0);
            _this.addChild(_this._myMask);
            _this._container.mask = _this._myMask;
            _this._myMask.beginFill(0xffffff);
            _this._myMask.drawRect(0, 0, 100 * 10, 100 * 8);
            _this._myMask.endFill();
            _this.drawField();
            _this._selectedGem = null;
            if (window["collectable"]) {
                _this._counters = mygame.GameConfig.COUNTERS_PUBLIC;
            }
            else {
                _this._counters = [-1, -1, -1, -1, -1, -1, -1];
            }
            _this.game.input.onUp.add(function () {
                try {
                    _this.game.input.deleteMoveCallback(_this.gemMove, _this);
                }
                catch (e) {
                    console.log("error");
                }
            }, _this);
            _this._canClick = true;
            return _this;
        }
        Object.defineProperty(Field.prototype, "firstMatchCallback", {
            set: function (val) {
                this._firstMatchCallback = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Field.prototype, "endMatchCallback", {
            set: function (val) {
                this._endMatchCallback = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Field.prototype, "disableField", {
            set: function (val) {
                this._disabled = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Field.prototype, "destroyCallback", {
            set: function (val) {
                this._cb = val;
            },
            enumerable: true,
            configurable: true
        });
        Field.prototype.mydebug = function () {
        };
        Object.defineProperty(Field.prototype, "finalCallback", {
            set: function (val) {
                this._finalCallback = val;
            },
            enumerable: true,
            configurable: true
        });
        Field.prototype.gemMove = function (event, pX, pY) {
            var distX = pX - this._selectedPoint.x;
            var distY = pY - this._selectedPoint.y;
            var deltaRow = 0;
            var deltaCol = 0;
            if (Math.abs(distX) > mygame.GameConfig.BLOCK_SIZE / 2) {
                if (distX > 0) {
                    deltaCol = 1;
                }
                else {
                    deltaCol = -1;
                }
            }
            else {
                if (Math.abs(distY) > mygame.GameConfig.BLOCK_SIZE / 2) {
                    if (distY > 0) {
                        deltaRow = 1;
                    }
                    else {
                        deltaRow = -1;
                    }
                }
            }
            if (deltaRow + deltaCol != 0) {
                this._pickedGem = this._gameArray[this._selectedGem.row + deltaRow][this._selectedGem.col + deltaCol];
                if (this._pickedGem.mytype > 0) {
                    this._selectedGem.deselect();
                    this.swapGems(true);
                    this.game.input.deleteMoveCallback(this.gemMove, this);
                }
                else {
                    this._pickedGem = null;
                }
            }
        };
        Field.prototype.drawField = function () {
            var _this = this;
            for (var i = 0; i < this._gameArray.length; i++) {
                var _loop_1 = function (j) {
                    var type = this_1._gameArray[i][j];
                    var x = mygame.GameConfig.BLOCK_SIZE * (j + 0.5);
                    var y = mygame.GameConfig.BLOCK_SIZE * (i + 0.5);
                    if (type > 0) {
                        var sprite_1 = new mygame.Gem(this_1.game, x, y, type);
                        var gemBG = this_1.game.add.sprite(x, y, "objects", "tile.png");
                        gemBG.anchor.set(0.5);
                        this_1._bgContainer.addChild(gemBG);
                        this_1._container.addChild(sprite_1);
                        sprite_1.inputEnabled = true;
                        sprite_1.row = i;
                        sprite_1.col = j;
                        sprite_1.events.onInputDown.add(function (obj, pointer) {
                            var tutorialCondition;
                            if (_this._gameArray.length == 8) {
                                tutorialCondition = window["tutorial"] && (sprite_1.row == 1) && (sprite_1.mytype == 1) || !window["tutorial"];
                            }
                            else {
                                tutorialCondition = window["tutorial"] && (sprite_1.row == 0) && (sprite_1.mytype == 1) || !window["tutorial"];
                            }
                            if (_this._canClick && tutorialCondition && !_this._disabled) {
                                if (_this._selectedGem == null) {
                                    _this._selectedGem = sprite_1;
                                    _this._selectedPoint = new Phaser.Point(pointer.x, pointer.y);
                                    sprite_1.select();
                                    _this.game.input.addMoveCallback(_this.gemMove, _this);
                                }
                                else {
                                    _this.gemSelect(sprite_1);
                                }
                            }
                        }, this_1);
                        if (this_1._gameArray.length == 8) {
                            if (!((i == 1 || i == 2) && sprite_1.mytype == 1) && window["tutorial"]) {
                                sprite_1.alpha = 0.2;
                            }
                        }
                        else {
                            if (!((i == 1 || i == 0) && sprite_1.mytype == 1) && window["tutorial"]) {
                                sprite_1.alpha = 0.2;
                            }
                        }
                        this_1._gameArray[i][j] = sprite_1;
                    }
                    else {
                        var grass = this_1.game.add.sprite(x, y, "grass");
                        grass.width = grass.height = mygame.GameConfig.BLOCK_SIZE;
                        grass.anchor.set(0.5);
                        this_1.addChild(grass);
                        this_1._gameArray[i][j] = new mygame.Gem(this_1.game, x, y, 0);
                        this_1._gameArray[i][j].row = i;
                        this_1._gameArray[i][j].col = j;
                    }
                };
                var this_1 = this;
                for (var j = 0; j < this._gameArray[i].length; j++) {
                    _loop_1(j);
                }
            }
            if (window["tutorial"]) {
                console.log("henlo");
                this._hand = this.game.add.sprite(100 * 4 - 20, 100 * 2 - 20, "objects", "hand.png");
                this._hand.anchor.set(0.5);
                if (this._gameArray.length == 8) {
                    this._handTween = this.game.add.tween(this._hand).to({
                        y: 280
                    }, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
                }
                else {
                    this._handTween = this.game.add.tween(this._hand).to({
                        y: 80
                    }, 500, Phaser.Easing.Linear.None, true, 0, -1, true);
                }
                this.addChild(this._hand);
            }
        };
        Field.prototype.replay = function () {
            this._disabled = false;
            this._finalWasFired = false;
            if (window["collectable"]) {
                this._counters = mygame.GameConfig.COUNTERS.slice();
            }
            else {
                this._counters = [-1, -1, -1, -1, -1, -1, -1];
            }
        };
        Field.prototype.gemSelect = function (gem) {
            if (this._selectedGem == null) {
                console.log("something strange");
                return;
            }
            if (this._selectedGem.isSame(gem)) {
                this._selectedGem.deselect();
                this._selectedGem = null;
                return;
            }
            if (this._selectedGem.isNext(gem)) {
                this._selectedGem.deselect();
                this._pickedGem = gem;
                this.swapGems();
                console.log("swap!");
            }
            else {
                this._selectedGem.deselect();
                this._selectedGem = gem;
                gem.select();
            }
        };
        Field.prototype.swapGems = function (swapBack) {
            var _this = this;
            if (swapBack === void 0) { swapBack = true; }
            if (window["tutorial"]) {
                if (this._pickedGem.row - this._selectedGem.row != 1) {
                    return;
                }
                else {
                    window["tutorial"] = false;
                    for (var i = 0; i < this._gameArray.length; i++) {
                        for (var j = 0; j < this._gameArray[i].length; j++) {
                            this._gameArray[i][j].alpha = 1;
                            this._handTween.stop();
                            this._hand.destroy();
                        }
                    }
                }
            }
            this._canClick = false;
            this._coolAnimation = true;
            this._verticalAnimation = false;
            this._gameArray[this._selectedGem.row][this._selectedGem.col] = this._pickedGem;
            this._gameArray[this._pickedGem.row][this._pickedGem.col] = this._selectedGem;
            var rowSel = this._selectedGem.row;
            var colSel = this._selectedGem.col;
            var rowPic = this._pickedGem.row;
            var colPic = this._pickedGem.col;
            this._selectedGem.row = rowPic;
            this._selectedGem.col = colPic;
            this._pickedGem.row = rowSel;
            this._pickedGem.col = colSel;
            var posPicked = new Phaser.Point((colPic + 0.5) * mygame.GameConfig.BLOCK_SIZE, (rowPic + 0.5) * mygame.GameConfig.BLOCK_SIZE);
            var posSelected = new Phaser.Point((colSel + 0.5) * mygame.GameConfig.BLOCK_SIZE, (rowSel + 0.5) * mygame.GameConfig.BLOCK_SIZE);
            var tweenSelected = this.game.add.tween(this._selectedGem).to({
                x: posPicked.x,
                y: posPicked.y
            }, mygame.GameConfig.SWAP_TIME, Phaser.Easing.Linear.None, false);
            var tweenPicked = this.game.add.tween(this._pickedGem).to({
                x: posSelected.x,
                y: posSelected.y
            }, mygame.GameConfig.SWAP_TIME, Phaser.Easing.Linear.None, false);
            var type1 = this._selectedGem.mytype;
            var type2 = this._pickedGem.mytype;
            tweenPicked.onComplete.add(function () {
                if (_this.isMatchOnBoard(rowPic, colPic, type1, rowSel, colSel, type2)) {
                    console.log("DESTROY!!!");
                    _this.handleMatches();
                    _this._selectedGem = null;
                    _this._pickedGem = null;
                }
                else if (swapBack) {
                    _this.swapGems(false);
                }
            }, this);
            tweenPicked.start();
            tweenSelected.start();
            if (!swapBack) {
                this._selectedGem.deselect();
                this._selectedGem = null;
                this._pickedGem = null;
                this._canClick = true;
            }
        };
        Field.prototype.isMatchOnBoard = function (row1, col1, type1, row2, col2, typr2) {
            return this.isMatch(row1, col1, type1) || this.isMatch(row2, col2, typr2);
        };
        Field.prototype.isMatch = function (row, col, type) {
            return this.isHorizontal(row, col, type) || this.isVertical(row, col, type);
        };
        Field.prototype.isHorizontal = function (row, col, type) {
            var start;
            var end;
            var streak = 0;
            for (var i = 0; i < 3; i++) {
                streak = 0;
                start = col + i;
                end = start - 2;
                if (start >= this._gameArray[0].length) {
                    continue;
                }
                if (end < 0) {
                    continue;
                }
                for (var j = start; j >= end; j--) {
                    if (this._gameArray[row][j].mytype == type) {
                        streak++;
                    }
                }
                if (streak > 2) {
                    return true;
                }
            }
            return false;
        };
        Field.prototype.isVertical = function (row, col, type) {
            var start;
            var end;
            var streak = 0;
            for (var j = 0; j < 3; j++) {
                streak = 0;
                start = row + j;
                end = start - 2;
                if (start >= this._gameArray.length) {
                    continue;
                }
                if (end < 0) {
                    continue;
                }
                for (var i = start; i >= end; i--) {
                    if (this._gameArray[i][col].mytype == type) {
                        streak++;
                    }
                }
                if (streak > 2) {
                    return true;
                }
            }
            return false;
        };
        Field.prototype.debugShow = function () {
            for (var i = 0; i < this._gameArray.length; i++) {
                var str = "";
                for (var j = 0; j < this._gameArray[i].length; j++) {
                    if (this._gameArray[i][j] !== -1) {
                        str += this._gameArray[i][j].mytype + " ";
                    }
                    else {
                        str += " -1 ";
                    }
                }
                console.log(str);
            }
        };
        Field.prototype.handleMatches = function () {
            if (!this._firstMatch && !window["collectable"]) {
                this._firstMatch = true;
                this._firstMatchCallback();
            }
            this._removeMap = [];
            for (var i = 0; i < this._gameArray.length; i++) {
                this._removeMap[i] = [];
                for (var j = 0; j < this._gameArray[i].length; j++) {
                    this._removeMap[i].push(0);
                }
            }
            this.handleHorizontalMatches();
            this.handleVerticalMatches();
            this.destroyGems();
            this._coolAnimation = false;
        };
        Field.prototype.destroyGems = function () {
            var _this = this;
            if (this._destroyed > 0) {
            }
            this._destroyed = 0;
            var condensationPoint;
            var condensationType;
            if (this._selectedGem != null) {
                if (this._removeMap[this._selectedGem.row][this._selectedGem.col] > 0) {
                    condensationPoint = new Phaser.Point(this._selectedGem.x, this._selectedGem.y);
                    condensationType = this._selectedGem.mytype;
                }
                else if (this._removeMap[this._pickedGem.row][this._pickedGem.col] > 0) {
                    condensationPoint = new Phaser.Point(this._pickedGem.x, this._pickedGem.y);
                    condensationType = this._pickedGem.mytype;
                }
                else {
                    condensationPoint = new Phaser.Point(1, 1);
                    condensationType = 0;
                    console.log("something went wrong");
                }
            }
            this._coolAnimation = false;
            if (this._coolAnimation) {
                console.log("create cool animation");
                this.condensate(condensationPoint);
            }
            else {
                console.log("create cool animation");
                var gemsToDestroy = [];
                var tweens = [];
                var delay = 0;
                for (var i = 0; i < this._removeMap.length; i++) {
                    var _loop_2 = function (j) {
                        if (this_2._removeMap[i][j] > 0) {
                            this_2._destroyed++;
                            var gem_1 = this_2._gameArray[i][j];
                            if ((gem_1.mytype == 1 || gem_1.mytype == 2) && this_2._counters[gem_1.mytype] > 0) {
                                var point = void 0;
                                if (gem_1.mytype == 1) {
                                    point = this_2._playState.getGurrentElementPosition("first");
                                }
                                else {
                                    point = this_2._playState.getGurrentElementPosition("second");
                                }
                                var xPos = gem_1.worldPosition.x;
                                var yPos = gem_1.worldPosition.y;
                                this_2._container.removeChild(gem_1);
                                this_2.game.world.addChild(gem_1);
                                gem_1.position.set(xPos, yPos);
                                var flyTween = this_2.createFlyTween(gem_1, point, delay);
                                delay += 100;
                                tweens.push(flyTween);
                            }
                            else {
                                gem_1.onDestroy = function () {
                                    _this._destroyed--;
                                    _this._counters[gem_1.mytype] -= 1;
                                    _this._cb(gem_1.mytype, 1);
                                    if (_this._destroyed == 0) {
                                        _this.makeGemsFall();
                                    }
                                };
                                gemsToDestroy.push(gem_1);
                            }
                        }
                    };
                    var this_2 = this;
                    for (var j = 0; j < this._removeMap[i].length; j++) {
                        _loop_2(j);
                    }
                }
                gemsToDestroy.forEach(function (x) { return x.playDestroy(); });
                tweens.forEach(function (x) { return x.start(); });
            }
        };
        Field.prototype.handleHorizontalMatches = function () {
            for (var i = 0; i < this._gameArray.length; i++) {
                var colorStreak = 1;
                var currentColor = -100500;
                var startStreak = 0;
                for (var j = 0; j < this._gameArray[i].length; j++) {
                    if (this._gameArray[i][j].mytype == currentColor && this._gameArray[i][j].mytype > 0) {
                        colorStreak++;
                    }
                    if (this._gameArray[i][j].mytype != currentColor || j == this._gameArray[i].length - 1) {
                        if (colorStreak >= 3) {
                            console.log("HORIZONTAL :: Length = " + colorStreak + " :: Start = (" + i + "," + startStreak + ") :: Color = " + currentColor);
                            if (this._counters[currentColor] <= 0 || !this._coolAnimation) {
                                this._coolAnimation = false;
                            }
                            for (var k = 0; k < colorStreak; k++) {
                                this._removeMap[i][startStreak + k]++;
                            }
                        }
                        startStreak = j;
                        colorStreak = 1;
                        currentColor = this._gameArray[i][j].mytype;
                    }
                }
            }
        };
        Field.prototype.handleVerticalMatches = function () {
            for (var i = 0; i < this._gameArray[0].length; i++) {
                var colorStreak = 1;
                var currentColor = -100500;
                var startStreak = 0;
                for (var j = 0; j < this._gameArray.length; j++) {
                    try {
                        if (this._gameArray[j][i].mytype == currentColor && this._gameArray[j][i].mytype > 0) {
                            colorStreak++;
                        }
                    }
                    catch (e) {
                    }
                    if (this._gameArray[j][i].mytype != currentColor || j == this._gameArray.length - 1) {
                        if (colorStreak >= 3) {
                            console.log("VERTICAL :: Length = " + colorStreak + " :: Start = (" + startStreak + "," + i + ") :: Color = " + currentColor);
                            if (this._counters[currentColor] <= 0 || !this._coolAnimation) {
                                this._coolAnimation = false;
                            }
                            else {
                                this._verticalAnimation = true;
                            }
                            for (var k = 0; k < colorStreak; k++) {
                                this._removeMap[startStreak + k][i]++;
                            }
                        }
                        startStreak = j;
                        colorStreak = 1;
                        currentColor = this._gameArray[j][i].mytype;
                    }
                }
            }
        };
        Field.prototype.checkGlobalMatch = function () {
            for (var i = 0; i < this._gameArray.length; i++) {
                for (var j = 0; j < this._gameArray[i].length; j++) {
                    if (this._gameArray[i][j].mytype <= 0) {
                        continue;
                    }
                    if (this.isMatch(i, j, this._gameArray[i][j].mytype)) {
                        return true;
                    }
                }
            }
            return false;
        };
        Field.prototype.swap = function (x1, y1, x2, y2, dx) {
            if (dx === void 0) { dx = 0; }
            var temp = this._gameArray[x1][y1];
            temp.row = x2 - dx;
            temp.col = y2;
            this._gameArray[x1][y1] = this._gameArray[x2][y2];
            this._gameArray[x1][y1].row = x1 - dx;
            this._gameArray[x1][y1].col = y1;
            this._gameArray[x2][y2] = temp;
        };
        Field.prototype.makeGemsFall = function () {
            var _this = this;
            if (this._destroyed > 0) {
                this.game.time.events.add(200, this.makeGemsFall, this);
            }
            if (this._turnOffMask) {
                this._turnOffMask = false;
                this._container.mask = this._myMask;
            }
            var holes = this.findHoles();
            var tweens = [];
            var fallen = 0;
            for (var k = 0; k < holes.length; k++) {
                var hole = holes[k];
                var above = void 0;
                var start = void 0;
                var end = void 0;
                if (hole.hasHoleAbove) {
                    above = holes[k + 1];
                    start = above.row + above.length - hole.length;
                    end = hole.row - start;
                }
                else {
                    start = 0;
                    end = hole.row - this._fieldUpperBound[hole.col];
                }
                for (var i = 0; i < end; i++) {
                    this.swap(hole.row - 1 - i, hole.col, hole.row + hole.length - 1 - i, hole.col);
                }
                if (!hole.hasHoleAbove) {
                    for (var i = this._fieldUpperBound[hole.col]; i < this._fieldUpperBound[hole.col] + hole.length; i++) {
                        var gem = this._gameArray[i][hole.col];
                        var rnd = this.game.rnd.between(1, 5);
                        gem.mytype = rnd;
                        gem.x = (hole.col + 0.5) * mygame.GameConfig.BLOCK_SIZE;
                        gem.y = (gem.row - hole.length + 0.5) * mygame.GameConfig.BLOCK_SIZE;
                    }
                    start = this._fieldUpperBound[hole.col];
                    end = hole.row + hole.length;
                }
                else {
                    var len = hole.row - (above.row + above.length - hole.length);
                    start = hole.row + hole.length - len;
                    end = hole.row + hole.length;
                }
                var _loop_3 = function (i) {
                    try {
                        this_3._gameArray[i][hole.col];
                    }
                    catch (e) {
                    }
                    var gem = this_3._gameArray[i][hole.col];
                    fallen++;
                    var tween = this_3.game.add.tween(gem).to({
                        y: gem.y + hole.length * mygame.GameConfig.BLOCK_SIZE
                    }, mygame.GameConfig.FALLDOWN_TIME, Phaser.Easing.Back.Out, false);
                    tween.onComplete.add(function () {
                        _this._gameArray[gem.row][gem.col] = gem;
                        fallen--;
                        if (fallen == 0) {
                            if (_this.checkGlobalMatch()) {
                                _this.handleMatches();
                            }
                            else {
                                _this._canClick = true;
                                _this._selectedGem = null;
                                if (!_this._finalWasFired) {
                                    var counter = 0;
                                    for (var i_1 = 0; i_1 < _this._counters.length; i_1++) {
                                        if (_this._counters[i_1] <= 0) {
                                            counter++;
                                        }
                                        if (counter == _this._counters.length) {
                                            _this._finalWasFired = true;
                                            mygame.GameConfig.COUNTERS_PUBLIC = mygame.GameConfig.COUNTERS.slice();
                                            if (_this._finalCallback)
                                                _this._finalCallback();
                                        }
                                    }
                                }
                                for (var i_2 = 0; i_2 < _this._gameArray.length; i_2++) {
                                    var str = "";
                                    for (var j = 0; j < _this._gameArray[i_2].length; j++) {
                                        str += _this._gameArray[i_2][j].mytype + "\t";
                                    }
                                    console.log(str);
                                }
                            }
                        }
                    });
                    tweens.push(tween);
                };
                var this_3 = this;
                for (var i = start; i < end; i++) {
                    _loop_3(i);
                }
            }
            tweens.forEach(function (x) { return x.start(); });
        };
        Field.prototype.createFlyTween = function (gem, flyawayPoint, delay) {
            var _this = this;
            var scaleTween = this.game.add.tween(gem.scale).to({
                x: mygame.GameConfig.PANEL_GEM_SCALE,
                y: mygame.GameConfig.PANEL_GEM_SCALE
            }, mygame.GameConfig.FLY_TIME, Phaser.Easing.Sinusoidal.InOut, false);
            scaleTween.onComplete.addOnce(function () {
                gem.scale.setTo(1);
            }, this);
            var flyTween = this.game.add.tween(gem).to({
                x: flyawayPoint.x,
                y: flyawayPoint.y
            }, mygame.GameConfig.FLY_TIME, Phaser.Easing.Linear.None, false, delay);
            flyTween.onStart.addOnce(function () {
                scaleTween.start();
            });
            flyTween.onComplete.add(function (obj, tween) {
                _this.game.world.removeChild(gem);
                _this._container.addChild(gem);
                gem.position.set(-1500, -1500);
                _this._destroyed--;
                _this._cb(gem.mytype, 1);
                _this._counters[gem.mytype]--;
                if (_this._destroyed == 0) {
                    _this.makeGemsFall();
                }
            }, this);
            return flyTween;
        };
        Object.defineProperty(Field.prototype, "gameArray", {
            get: function () {
                var result = [];
                for (var i = 0; i < this._gameArray.length; i++) {
                    result.push([]);
                    for (var j = 0; j < this._gameArray[i].length; j++) {
                        result[i][j] = this._gameArray[i][j].mytype;
                    }
                }
                return result;
            },
            enumerable: true,
            configurable: true
        });
        Field.prototype.generateFlyAwayTween = function (block, condensationPoint, flyawayPoint, delay) {
            this._container.removeChild(block);
            this.addChild(block);
            var flyAwayTween = this.createFlyTween(block, flyawayPoint, delay);
            if (this._verticalAnimation) {
                return flyAwayTween;
            }
            else {
                var condensateTween = this.game.add.tween(block).to({
                    x: condensationPoint.x
                }, mygame.GameConfig.CONDENSATION_TIME, Phaser.Easing.Linear.None, false);
                condensateTween.onComplete.add(function (sprite, tween) {
                    flyAwayTween.start();
                });
                return condensateTween;
            }
        };
        Field.prototype.condensate = function (point) {
            var condenstationStack = [];
            var delay = 0;
            for (var i = 0; i < this._removeMap.length; i++) {
                for (var j = 0; j < this._removeMap[i].length; j++) {
                    if (this._removeMap[i][j] > 0) {
                        this._destroyed++;
                        var block = this._gameArray[i][j];
                        var flyAwayPoint = void 0;
                        if (block.mytype == 2) {
                            flyAwayPoint = this._playState.getGurrentElementPosition("second");
                        }
                        else {
                            flyAwayPoint = this._playState.getGurrentElementPosition("first");
                        }
                        condenstationStack.push(this.generateFlyAwayTween(block, point, flyAwayPoint, delay));
                        condenstationStack[condenstationStack.length - 1].onStart.addOnce(function () {
                        });
                        delay += 100;
                    }
                }
            }
            condenstationStack.forEach(function (el) {
                el.start();
            });
        };
        Field.prototype.findHoles = function () {
            var result = [];
            for (var j = 0; j < this._gameArray[0].length; j++) {
                for (var i = this._gameArray.length - 1; i >= 0; i--) {
                    if (this._removeMap[i][j] > 0) {
                        var length_1 = 1;
                        var row = i;
                        var found = true;
                        var wasPushed = false;
                        for (var k = i - 1; k >= 0; k--) {
                            if (this._removeMap[k][j] > 0) {
                                length_1++;
                                row = k;
                                found = true;
                                wasPushed = false;
                            }
                            else if (found) {
                                result.push({ row: row, col: j, length: length_1, hasHoleAbove: false });
                                found = false;
                                wasPushed = true;
                                var id = result.length - 2;
                                if (id >= 0 && result[id].col == result[id + 1].col) {
                                    result[id].hasHoleAbove = true;
                                }
                            }
                        }
                        if (!wasPushed) {
                            result.push({ row: row, col: j, length: length_1, hasHoleAbove: false });
                            var id = result.length - 2;
                            if (id >= 0 && result[id].col == result[id + 1].col) {
                                result[id].hasHoleAbove = true;
                            }
                        }
                        break;
                    }
                }
            }
            return result;
        };
        Field.prototype.destroy = function () {
            this.game.input.onUp.removeAll();
            _super.prototype.destroy.call(this);
        };
        return Field;
    }(Phaser.Sprite));
    mygame.Field = Field;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var GameConfig = (function () {
        function GameConfig() {
        }
        GameConfig.deepClone = function (m) {
            var result = [];
            for (var i = 0; i < m.length; i++) {
                result.push([]);
                for (var j = 0; j < m[0].length; j++) {
                    result[i].push(m[i][j]);
                }
            }
            return result;
        };
        GameConfig.transpose = function (m) {
            var result = [];
            for (var i = 0; i < m[0].length; i++) {
                result.push([]);
                for (var j = 0; j < m.length; j++) {
                    result[i].push(m[j][i]);
                }
            }
            return result;
        };
        return GameConfig;
    }());
    GameConfig.BLOCK_SIZE = 100;
    GameConfig.SWAP_TIME = 150;
    GameConfig.DESTROY_TIME = 150;
    GameConfig.FALLDOWN_TIME = 400;
    GameConfig.FLY_TIME = 300;
    GameConfig.CONDENSATION_TIME = 300;
    GameConfig.COUNTERS = [0, 2, 1, 0, 0, 0];
    GameConfig.COUNTERS_PUBLIC = [0, 2, 1, 0, 0, 0];
    GameConfig.NAMES = ["apple", "apple", "grapes", "flower", "pear", "leaf"];
    GameConfig.PANEL_GEM_SCALE = 0.8;
    GameConfig.APPLE_POS = new Phaser.Point(100, -60);
    GameConfig.GRAPES_POS = new Phaser.Point(370, -60);
    GameConfig.UNLOCK_OBJ_PER_FRUITS = 3;
    GameConfig.gameArrayLandscape = [
        [2, 3, 4, 1, 3, 2, 2, 3, 4, 4],
        [3, 5, 1, 4, 1, 3, 1, 2, 3, 5],
        [2, 5, 1, 3, 1, 1, 2, 3, 4, 4],
        [1, 3, 2, 4, 1, 3, 2, 4, 1, 3]
    ];
    GameConfig.gameArrayPortret = [
        [1, 2, 5, 3, 4, 2],
        [3, 4, 3, 1, 3, 5],
        [3, 5, 1, 5, 1, 1],
        [5, 3, 2, 2, 5, 5],
        [2, 2, 4, 1, 2, 1],
        [4, 3, 3, 1, 5, 2],
        [4, 1, 2, 3, 2, 5],
        [5, 5, 2, 4, 1, 1]
    ];
    mygame.GameConfig = GameConfig;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Gem = (function (_super) {
        __extends(Gem, _super);
        function Gem(game, x, y, type) {
            var _this = _super.call(this, game, x, y) || this;
            _this._mytype = type;
            _this._spriteName = mygame.GameConfig.NAMES[_this._mytype];
            if (type > 0) {
                _this._sprite = _this.game.add.sprite(0, 0, "objects", "F_" + _this._mytype + ".png");
                _this._sprite.anchor.set(0.5);
                _this.addChild(_this._sprite);
                _this._destroyAnimation = _this._sprite.animations.add("set off", Phaser.Animation.generateFrameNames("e_", 1, 7, ".png"), 18, false);
                _this._destroyAnimation.onComplete.add(function () {
                    if (!_this._onCompleteFired) {
                        _this._onCompleteFired = true;
                        _this._sprite.alpha = 0;
                        if (_this._destroyCallback) {
                            _this._destroyCallback();
                        }
                    }
                }, _this);
            }
            return _this;
        }
        Object.defineProperty(Gem.prototype, "row", {
            get: function () {
                return this._row;
            },
            set: function (val) {
                this._row = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gem.prototype, "col", {
            get: function () {
                return this._col;
            },
            set: function (val) {
                this._col = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gem.prototype, "mytype", {
            get: function () {
                return this._mytype;
            },
            set: function (val) {
                if (!this._onCompleteFired) {
                    this._destroyAnimation.stop();
                    this._onCompleteFired = true;
                    console.log("TRIGGERED!!!");
                }
                this._destroyAnimation.stop();
                this._mytype = val;
                this._spriteName = mygame.GameConfig.NAMES[this._mytype];
                this._sprite.loadTexture("objects", "F_" + this._mytype + ".png");
                this._sprite.alpha = 1;
                this._onCompleteFired = false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gem.prototype, "onDestroy", {
            set: function (val) {
                this._destroyCallback = val;
            },
            enumerable: true,
            configurable: true
        });
        Gem.prototype.playDestroy = function () {
            var _this = this;
            this.game.add.tween(this._sprite.scale).to({ x: 0.15, y: 0.15 }, 100, Phaser.Easing.Sinusoidal.Out, true).onComplete.addOnce(function () {
                _this._sprite.scale.set(1);
                _this._destroyAnimation.play();
            });
        };
        Gem.prototype.select = function () {
            this._sprite.scale.set(1.2);
        };
        Gem.prototype.deselect = function () {
            this._sprite.scale.set(1);
        };
        Gem.prototype.isSame = function (a) {
            return (this._row == a.row) && (this._col == a.col);
        };
        Gem.prototype.isNext = function (gem2) {
            return Math.abs(this.row - gem2.row) + Math.abs(this.col - gem2.col) == 1;
        };
        Gem.prototype.update = function () {
            console.log("it works");
        };
        return Gem;
    }(Phaser.Sprite));
    mygame.Gem = Gem;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Panel = (function (_super) {
        __extends(Panel, _super);
        function Panel(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this._sprite = _this.game.add.sprite(0, 0, "objects", "panel.png");
            _this._sprite.anchor.set(0.5);
            _this.addChild(_this._sprite);
            _this._fruitsCounter = 0;
            _this._finishWasFired = false;
            _this._fruitScale = 0.8;
            _this._counters = mygame.GameConfig.COUNTERS.slice();
            _this._appleText = _this.game.add.bitmapText(-140, 5, "font", _this._counters[1].toString(), 32);
            _this._appleText.anchor.setTo(0, 0.5);
            _this.addChild(_this._appleText);
            _this._grapeText = _this.game.add.bitmapText(140, 5, "font", _this._counters[2].toString(), 32);
            _this._grapeText.anchor.setTo(0, 0.5);
            _this.addChild(_this._grapeText);
            _this._delta = new Array(_this._counters.length);
            for (var i = 0; i < _this._delta.length; i++) {
                _this._delta[i] = 0;
            }
            _this._timer = 0;
            _this._sleepTime = 1;
            return _this;
        }
        Panel.prototype.scaleFruits = function (val) {
            this._apple.scale.set(val);
            this._fruitScale = val;
            this._grapes.scale.set(val);
        };
        Object.defineProperty(Panel.prototype, "finishScreenCallback", {
            set: function (val) {
                this._finishCallback = val;
            },
            enumerable: true,
            configurable: true
        });
        Panel.prototype.replay = function () {
            this._finishWasFired = false;
            this._counters = mygame.GameConfig.COUNTERS.slice();
            this._delta = new Array(this._counters.length);
            for (var i = 0; i < this._delta.length; i++) {
                this._delta[i] = 0;
            }
            this._appleText.text = this._counters[1].toString();
            this._grapeText.text = this._counters[2].toString();
        };
        Panel.prototype.updateCounter = function (type, delta) {
            if (window["collectable"]) {
                if ((type == 1 || type == 2) && this._counters[type] > 0) {
                    console.log("UPDATE COUNTER = " + type + " : " + delta);
                    this._delta[type] += delta;
                    this._sleepTime = 200;
                }
            }
        };
        Panel.prototype.getElementPosition = function (type) {
            if (type == "first") {
                console.log(this._apple.worldPosition.x, this._apple.worldPosition.y);
                return new Phaser.Point(this._apple.worldPosition.x, this._apple.worldPosition.y);
            }
            else {
                console.log(this._grapes.worldPosition.x, this._grapes.worldPosition.y);
                return new Phaser.Point(this._grapes.worldPosition.x, this._grapes.worldPosition.y);
            }
        };
        Panel.prototype.initFruits = function () {
            var _this = this;
            this._apple = this.game.add.sprite(this.x - this._sprite.width / 2 + 45 * 2.35, this.y - 2, "objects", "F_1.png");
            this._apple.scale.setTo(0.8);
            this._apple.anchor.setTo(0.5);
            this.parent.addChild(this._apple);
            this._grapes = this.game.add.sprite(this.x + 80, this.y - 2, "objects", "F_2.png");
            this._grapes.scale.setTo(0.8);
            this._grapes.anchor.setTo(0.5);
            this.parent.addChild(this._grapes);
            this._appleTween = this.game.add.tween(this._apple.scale).to({
                x: this._fruitScale + 0.2,
                y: this._fruitScale + 0.2
            }, 150, Phaser.Easing.Linear.None, false);
            this._appleTween.onComplete.add(function () {
                _this._apple.scale.set(_this._fruitScale);
            });
            this._grapesTween = this.game.add.tween(this._grapes.scale).to({
                x: this._fruitScale + 0.2,
                y: this._fruitScale + 0.2
            }, 150, Phaser.Easing.Linear.None, false);
            this._grapesTween.onComplete.add(function () {
                _this._grapes.scale.set(_this._fruitScale);
            }, this);
        };
        Panel.prototype.checkFruitCounter = function () {
        };
        Panel.prototype.update = function () {
            var dt = this.game.time.elapsedMS;
            if (this._timer > 0) {
                this._timer -= dt;
            }
            if ((this._delta[1] > 0 || this._delta[2] > 0)) {
                this._timer = this._sleepTime;
                this._fruitsCounter++;
                if (this._delta[1] > 0) {
                    this._delta[1]--;
                    this._counters[1]--;
                    if (this._counters[1] <= 0) {
                        this._appleText.text = "finish";
                    }
                    else {
                        this._appleTween.start();
                        this._appleText.text = this._counters[1].toString();
                    }
                }
                if (this._delta[2] > 0) {
                    this._delta[2]--;
                    this._counters[2]--;
                    if (this._counters[2] <= 0) {
                        this._grapeText.text = "finish";
                    }
                    else {
                        this._grapesTween.start();
                        this._grapeText.text = this._counters[2].toString();
                    }
                }
            }
        };
        return Panel;
    }(Phaser.Sprite));
    mygame.Panel = Panel;
})(mygame || (mygame = {}));
var Controller = mygame.Controller;
var BackGround = (function (_super) {
    __extends(BackGround, _super);
    function BackGround(game) {
        var _this = _super.call(this, game) || this;
        _this.bg = _this.game.add.image(0, 0, 'background');
        _this.addChild(_this.bg);
        if (Controller.Instance.orientation == Controller.LANDSCAPE) {
            _this.bg.height = Controller.Instance.width;
            _this.bg.scale.x = _this.bg.scale.y;
            _this.x = 0;
        }
        else {
            _this.bg.height = Controller.Instance.height;
            _this.bg.scale.x = _this.bg.scale.y;
            _this.x = (Controller.Instance.width - _this.bg.width) / 2;
        }
        return _this;
    }
    return BackGround;
}(Phaser.Group));
