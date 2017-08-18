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
            var baseURL = window['baseURL'];
            this.game.load.atlas("boom_anim", baseURL + "assets/boom_anim.png", baseURL + "assets/boom_anim.json");
            this.game.load.atlas("atlas", baseURL + "assets/atlas.png", baseURL + "assets/atlas.json");
            this.game.load.image("character", baseURL + "assets/" + window["characterName"] + ".png");
            if (window["lang"] == "en") {
                this.game.load.image("play_free", baseURL + "assets/Button_Eng_" + window["buttonPlayColor"] + ".png");
            }
            else if (window["lang"] == "de") {
                this.game.load.image("play_free", baseURL + "assets/Button_Ger_" + window["buttonPlayColor"] + ".png");
            }
            this.game.load.bitmapFont('font', baseURL + "assets/font.png", baseURL + "assets/font.fnt");
            this.game.load.bitmapFont('font2', baseURL + "assets/font2.png", baseURL + "assets/font2.fnt");
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
            mygame.GameConfig.COUNTERS_PUBLIC = [0, window["firstElement"], 0, window["secondElement"], window["thirdElement"], 0, 100, 100];
            this.game.time.advancedTiming = true;
            this.game.stage.backgroundColor = "#64941A";
            this._winscreenShowed = false;
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.stage.smoothed = true;
            this._canShowEndScreen = false;
            mygame.Controller.Instance.width = getSize().width;
            mygame.Controller.Instance.height = getSize().height;
            this._container = new mygame.OSprite(mygame.Core.centerX + 200, 0)
                .otherXY(mygame.Core.centerY, 0)
                .end();
            this.game.world.addChild(this._container);
            this._bushes = [];
            this._bushes[0] = this.game.add.sprite(mygame.Core.width, mygame.Core.height, "atlas", "Back-03");
            this._bushes[0].anchor.set(1, 1);
            this._bushes[1] = this.game.add.sprite(this._bushes[0].width, this._bushes[0].height, "atlas", "Back-03");
            this._bushes[1].scale.set(-1, -1);
            this._bushes[3] = this.game.add.sprite(mygame.Core.width - this._bushes[0].width, this._bushes[0].height, "atlas", "Back-03");
            this._bushes[3].scale.set(1, -1);
            this._bushes[2] = this.game.add.sprite(this._bushes[0].width, mygame.Core.height - this._bushes[0].height, "atlas", "Back-03");
            this._bushes[2].scale.set(-1, 1);
            this._bench = this.game.add.sprite(mygame.Core.width, 0, "atlas", "Back-04");
            this._bench.anchor.set(1, 0);
            this.game.world.addChild(this._bench);
            this._rake = this.game.add.sprite(mygame.Core.width, mygame.Core.height, "atlas", "Back-05");
            this._rake.anchor.set(1, 1);
            this.game.world.addChild(this._rake);
            this._bushes.forEach(function (x) { return _this.game.world.addChild(x); });
            this._playFreeBtnOsprite = new mygame.OSprite(mygame.Core.centerX + 250, 0).myBottomOffset(70).myScale(0.65).end();
            this.game.world.addChild(this._playFreeBtnOsprite);
            this._playFreeBtnOsprite.otherXY(mygame.Core.centerY, 0).otherBottomOffset(73).otherScale(0.65).end();
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
            if (window["collectable"]) {
                this._gamePanelOsprite = new mygame.OSprite(0, 0)
                    .myTopOffset(640)
                    .otherXY(mygame.Core.centerY, 0)
                    .otherTopOffset(230 + 400 - 20)
                    .myLeftOffset(300)
                    .end();
                this._panel = new mygame.Panel(this.game, 0, 0);
                if (this.game.device.iPad) {
                    this._gamePanelOsprite.myTopOffset(750).end();
                }
                this._gamePanelOsprite.addChild(this._panel);
                this._panel.initFruits();
            }
            mygame.GameConfig.gameArray = mygame.GameConfig.deepClone(mygame.GameConfig.gameArrayLandscape);
            this._logoOsprite = new mygame.OSprite(900, 0)
                .myTopOffset(10)
                .myScale(0.65)
                .otherXY(mygame.Core.centerY, 0)
                .otherTopOffset(10)
                .otherScale(0.6)
                .end();
            this._logo = this.game.add.sprite(0, 0, "atlas", "Logo-01");
            this._logo.anchor.set(0.5, 0);
            this._logoOsprite.addChild(this._logo);
            if (window["collectable"]) {
                this._container = new mygame.OSprite(mygame.Core.centerX + 400 - 85, mygame.Core.centerY - 70)
                    .otherXY(mygame.Core.centerY + 50 - 2, mygame.Core.centerX + 220)
                    .end();
                this._field = new mygame.Field(this.game, 0, 0, this);
                this._container.addChild(this._field);
                this._field.destroyCallback = function (type, delta) {
                    _this._panel.updateCounter(type, delta);
                };
                this._field.finalCallback = this.showWinScreen.bind(this);
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
                this._container.myScale(1).otherScale(1.15).end();
            }
            this._field.firstMatchCallback = function () {
                _this.game.add.tween(_this._playFree.scale).to({ x: 1.45, y: 1.45 }, window["buttonPlaySpeed"], Phaser.Easing.Sinusoidal.Out, true, 0, -1, true);
            };
            this._field.pivot.set(100 * mygame.GameConfig.gameArray[0].length / 2, 100 * mygame.GameConfig.gameArray[1].length / 5);
            this._fruitFallEmitter = this.game.add.emitter(0, -50, Math.ceil(3600 / window["fruitSpawRate"]));
            this._fruitFallEmitter.makeParticles("atlas", ["F_1", "F_2", "F_3", "F_4", "F_5"]);
            this._fruitFallEmitter.setYSpeed(200 * window["fruitSpawSpeed"], 300 * window["fruitSpawSpeed"]);
            if (!mygame.Core.isLandscape) {
                this.onPortret();
            }
            if (window["tutorial"]) {
                this._tutorialOver = this.game.make.sprite(-630, -160, "atlas", "bannerMask");
                this._tutorialOver.scale.set(10);
                this._tutorialOver.alpha = 0.8;
                this._field.addChild(this._tutorialOver);
                var tutorialUP = this.game.add.graphics(0, -128);
                this._tutorialOver.addChild(tutorialUP);
                tutorialUP.beginFill(0x000000, 1);
                tutorialUP.drawRect(0, 0, 256, 128);
                tutorialUP.endFill();
                var tutorialDOWN = this.game.add.graphics(0, 72);
                this._tutorialOver.addChild(tutorialDOWN);
                tutorialDOWN.beginFill(0x000000, 1);
                tutorialDOWN.drawRect(0, 0, 128, 128);
                tutorialDOWN.endFill();
                var tutorialLEFT = this.game.add.graphics(-128, 0);
                this._tutorialOver.addChild(tutorialLEFT);
                tutorialLEFT.beginFill(0x000000, 1);
                tutorialLEFT.drawRect(0, 0, 128, 128);
                tutorialLEFT.endFill();
                var tutorialRIGHT = this.game.add.graphics(128, 0);
                this._tutorialOver.addChild(tutorialRIGHT);
                tutorialRIGHT.beginFill(0x000000, 1);
                tutorialRIGHT.drawRect(0, 0, 128, 128);
                tutorialRIGHT.endFill();
                this._hand = this.game.add.sprite(100 * 4 - 20 - mygame.GameConfig.BLOCK_SIZE * 2, 100 * 2 - 60, "atlas", "Help-Arrow-01");
                this._hand.anchor.set(0.5);
                this._handTween = this.game.add.tween(this._hand).to({
                    y: 80
                }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
                this._field.addChild(this._hand);
                this._tutorialContainer = new mygame.OSprite(mygame.Core.centerX, mygame.Core.centerY)
                    .myBottomOffset(0)
                    .myLeftOffset(35)
                    .otherXY(mygame.Core.centerY, mygame.Core.centerX)
                    .otherLeftOffset(10)
                    .otherBottomOffset(0)
                    .otherScale(0.8)
                    .end();
                this.game.world.addChild(this._tutorialContainer);
                this._charTutorialSprite = this.game.make.sprite(0, 0, "character");
                this._charTutorialSprite.anchor.set(0, 1);
                this._tutorialContainer.addChild(this._charTutorialSprite);
                this._bubbleTutorialSprite = this.game.make.sprite(window["bubbleX"], window["bubbleY"], "atlas", "tutor_bubble");
                this._bubbleTutorialSprite.anchor.set(0, 0.5);
                this._charTutorialSprite.addChild(this._bubbleTutorialSprite);
                this._bubbleTutorialText = this.game.add.bitmapText(this._bubbleTutorialSprite.width / 2 + 10, 0, "font2", mygame.Lang.Instance.TUTORIAL[window["lang"]], 32);
                this._bubbleTutorialText.anchor.setTo(0.5, 0.5);
                this._bubbleTutorialText.align = "center";
                this._bubbleTutorialText.tint = 0x8a5b27;
                this._bubbleTutorialSprite.addChild(this._bubbleTutorialText);
            }
            setTimeout(function () { _this._field.endGame(); }, window["endGameTimer"]);
            this._timerInstall = 0;
            window['gameStarted'];
            this.game.time.events.loop(Phaser.Timer.SECOND, this.tick, this);
        };
        PlayState.prototype.tick = function () {
            this._timerInstall++;
            window['playTime'] = this._timerInstall;
        };
        PlayState.prototype.getGurrentElementPosition = function (type) {
            return this._panel.getElementPosition(type);
        };
        PlayState.prototype.update = function () {
            if (window["collectable"]) {
                this._panel.update();
            }
            if (this._field) {
                this._field.update();
            }
        };
        PlayState.prototype.destroyTutorial = function () {
            this._handTween.stop();
            this._hand.destroy();
            this._tutorialOver.destroy(true);
            this._tutorialContainer.destroy(true);
        };
        PlayState.prototype.repositionEmitter = function () {
            var dx;
            if (mygame.Core.isLandscape) {
                dx = mygame.Core.centerX - 20;
            }
            else {
                dx = mygame.Core.centerY - 20;
            }
            this._fruitFallEmitter.emitX = this.game.rnd.between(-dx, dx);
            this.game.time.events.add(window["fruitSpawRate"], this.repositionEmitter.bind(this));
        };
        PlayState.prototype.showWinScreen = function () {
            if (!this._winscreenShowed) {
                this._winscreenShowed = true;
                this._playFree.visible = false;
                this._playFree.inputEnabled = false;
                this._playFreeBtnOsprite.removeChild(this._playFree);
                this._panelContainer = new mygame.OSprite(mygame.Core.centerX, mygame.Core.centerY)
                    .otherXY(mygame.Core.centerY, mygame.Core.centerX)
                    .end();
                this.game.stage.addChild(this._panelContainer);
                this._backOverlay = this.game.add.graphics(0, 0);
                this._panelContainer.addChild(this._backOverlay);
                this._backOverlay.beginFill(0x251d1a, 0.8);
                this._backOverlay.drawRect(-1024, -1024, 2048, 2048);
                this._backOverlay.endFill();
                this._panelContainer.addChild(this._fruitFallEmitter);
                if (mygame.Core.isLandscape) {
                    this._fruitFallEmitter.emitY = -mygame.Core.centerY - 50;
                }
                else {
                    this._fruitFallEmitter.emitY = -mygame.Core.centerX - 50;
                }
                this._fruitFallEmitter.start(false, 3600, window["fruitSpawRate"]);
                this.repositionEmitter();
                this._panelSprite = this.game.make.sprite(-7, 0, "atlas", "Popup-Back-01");
                this._panelSprite.anchor.set(0.5);
                this._panelContainer.addChild(this._panelSprite);
                this._sunraySprite = this.game.make.sprite(190, 0, "atlas", "Popup-Back-02");
                this._sunraySprite.anchor.set(0.5);
                this._panelSprite.addChild(this._sunraySprite);
                this.game.add.tween(this._sunraySprite).to({ angle: 360 }, 18500, Phaser.Easing.Linear.None, true, 0, -1);
                this._panelSprite.addChild(this._playFree);
                this._playFree.position.set(0, 177);
                this._playFree.anchor.x = 0.5;
                this._playFree.scale.set(0.85, 0.85);
                this._playFree.visible = true;
                this._playFree.inputEnabled = true;
                this._congrateText = this.game.add.bitmapText(10, -195, "font2", mygame.Lang.Instance.CONGRAT[window["lang"]], 42);
                this._congrateText.anchor.setTo(0.5, 0.5);
                this._congrateText.align = "center";
                this._congrateText.tint = 0xfdf1eb;
                this._panelSprite.addChild(this._congrateText);
                this._plotText = this.game.add.bitmapText(190, 0, "font2", mygame.Lang.Instance.PLOT[window["lang"]], 32);
                this._plotText.anchor.setTo(0.5, 0.5);
                this._plotText.align = "center";
                this._plotText.tint = 0xb87b52;
                this._panelSprite.addChild(this._plotText);
                this.game.add.tween(this._playFree.scale).to({ x: 0.9, y: 0.9 }, window["buttonPlaySpeed"], Phaser.Easing.Sinusoidal.Out, true, 0, -1, true);
                this._panelContainer.alpha = 0;
                this._panelSprite.scale.set(0.1, 0.1);
                this.game.add.tween(this._panelSprite.scale).to({ x: 1, y: 1 }, 700, Phaser.Easing.Back.Out, true);
                this.game.add.tween(this._panelContainer).to({ alpha: 1 }, 700, Phaser.Easing.Sinusoidal.Out, true);
            }
        };
        PlayState.prototype.onLandscape = function () {
            if (this._rake) {
                this._rake.position.set(mygame.Core.width - 50, mygame.Core.height);
                this._rake.angle = 0;
                this.game.world.setChildIndex(this._rake, 0);
                this._bench.position.set(mygame.Core.width, 0);
                this._bench.scale.set(1, 1);
                this._bushes[2].position.set(this._bushes[0].width, mygame.Core.height - this._bushes[0].height);
                this._bushes[1].position.set(this._bushes[0].width, this._bushes[0].height);
                this._bushes[0].position.set(mygame.Core.width, mygame.Core.height);
                this._bushes[3].alpha = 0;
                this._bushes[0].alpha = 1;
            }
            if (this._panel) {
                this._panel.setLandscape();
                this._fruitFallEmitter.emitY = -mygame.Core.centerY - 50;
            }
        };
        PlayState.prototype.onPortret = function () {
            if (this._rake) {
                this._rake.position.set(0, 1200);
                this.game.world.setChildIndex(this._rake, this.game.world.children.length - 6);
                this._rake.angle = 90;
                this._bench.position.set(mygame.Core.width, mygame.Core.height);
                this._bench.scale.set(1, -1);
                this._bushes[2].position.set(this._bushes[0].width, mygame.Core.height - this._bushes[0].height);
                this._bushes[1].position.set(this._bushes[0].width, this._bushes[0].height);
                this._bushes[0].position.set(mygame.Core.width, mygame.Core.height);
                this._bushes[3].alpha = 1;
                this._bushes[0].alpha = 0;
            }
            if (this._panel) {
                this._panel.setPortrait();
                this._fruitFallEmitter.emitY = -mygame.Core.centerX - 50;
            }
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
            this.game.load.image('preloaderBar', baseURL + "assets/Loader-Front.png");
            this.game.load.image('preloaderBarEmpty', baseURL + "assets/Loader-Back.png");
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
            if (window["innerMode"] == "client") {
                window["customClientWidth"] = function () {
                    return document.documentElement.clientWidth;
                };
                window["customClienHeight"] = function () {
                    return document.documentElement.clientHeight;
                };
            }
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
            _this._followGem1 = false;
            _this._followGem2 = false;
            _this._followGem3 = false;
            _this._background = _this.game.add.sprite(600 - 5, -15, "atlas", "Field-01");
            _this._background.inputEnabled = true;
            _this._background.anchor.set(1, 0);
            _this.addChild(_this._background);
            _this._maxColorStreak = 0;
            _this._boomAnimation = false;
            _this._sequences = [];
            _this._playState = playState;
            _this._tweenArray = [];
            _this._tempSprite = [];
            _this._destroyed = 0;
            _this._turnOffMask = false;
            _this._firstMatch = false;
            _this._finalWasFired = false;
            _this._gameArray = mygame.GameConfig.gameArray;
            _this._fieldUpperBound = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0];
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
            _this._myMask.drawRect(mygame.GameConfig.BLOCK_SIZE, 0, 5 * mygame.GameConfig.BLOCK_SIZE, mygame.GameConfig.BLOCK_SIZE);
            _this._myMask.drawRect(0, mygame.GameConfig.BLOCK_SIZE, 7 * mygame.GameConfig.BLOCK_SIZE, mygame.GameConfig.BLOCK_SIZE * 3);
            _this._myMask.drawRect(mygame.GameConfig.BLOCK_SIZE, mygame.GameConfig.BLOCK_SIZE * 4, 5 * mygame.GameConfig.BLOCK_SIZE, mygame.GameConfig.BLOCK_SIZE);
            _this._myMask.endFill();
            _this.drawField();
            _this._selectedGem = null;
            if (window["collectable"]) {
                _this._counters = [0, window["firstElement"], 0, window["secondElement"], window["thirdElement"], 0, 100, 100];
            }
            else {
                _this._counters = [-1, -1, -1, -1, -1, -1, -1, -1];
            }
            _this.game.input.onUp.add(function () {
                _this.game.input.deleteMoveCallback(_this.gemMove, _this);
                if ((_this._selectedGem !== null && _this._selectedGem !== undefined) && _this._selectedGem.isBomb && (_this._pickedGem == null)) {
                    _this._removeMap = [];
                    for (var i = 0; i < _this._gameArray.length; i++) {
                        _this._removeMap[i] = [];
                        for (var j = 0; j < _this._gameArray[i].length; j++) {
                            _this._removeMap[i].push(0);
                        }
                    }
                    _this.setOff(_this._selectedGem.mytype - 5);
                    _this.destroyGems();
                }
            }, _this);
            _this._canClick = true;
            if (window["particleOn"]) {
                _this._fruit1Emmiter = _this.game.add.emitter(0, 0, 50);
                _this.addChild(_this._fruit1Emmiter);
                _this._fruit1Emmiter.makeParticles("atlas", "F_1");
                _this._fruit1Emmiter.gravity = 0;
                _this._fruit1Emmiter.minParticleSpeed.setTo(-300, -300);
                _this._fruit1Emmiter.maxParticleSpeed.setTo(300, 300);
                _this._fruit1Emmiter.setAlpha(1, 0.1, 1200);
                _this._fruit1Emmiter.setScale(1.2, 0.1, 1.2, 0.1, 1200, Phaser.Easing.Quintic.Out);
                _this._fruit2Emmiter = _this.game.add.emitter(0, 0, 50);
                _this.addChild(_this._fruit2Emmiter);
                _this._fruit2Emmiter.makeParticles("atlas", "F_2");
                _this._fruit2Emmiter.gravity = 0;
                _this._fruit2Emmiter.minParticleSpeed.setTo(-300, -300);
                _this._fruit2Emmiter.maxParticleSpeed.setTo(300, 300);
                _this._fruit2Emmiter.setAlpha(1, 0.1, 1200);
                _this._fruit2Emmiter.setScale(1.2, 0.1, 1.2, 0.1, 1200, Phaser.Easing.Quintic.Out);
                _this._fruit3Emmiter = _this.game.add.emitter(0, 0, 50);
                _this.addChild(_this._fruit3Emmiter);
                _this._fruit3Emmiter.makeParticles("atlas", "F_3");
                _this._fruit3Emmiter.gravity = 0;
                _this._fruit3Emmiter.minParticleSpeed.setTo(-300, -300);
                _this._fruit3Emmiter.maxParticleSpeed.setTo(300, 300);
                _this._fruit3Emmiter.setAlpha(1, 0.1, 1200);
                _this._fruit3Emmiter.setScale(1.2, 0.1, 1.2, 0.1, 1200, Phaser.Easing.Quintic.Out);
                _this._fruit4Emmiter = _this.game.add.emitter(0, 0, 50);
                _this.addChild(_this._fruit4Emmiter);
                _this._fruit4Emmiter.makeParticles("atlas", "F_4");
                _this._fruit4Emmiter.gravity = 0;
                _this._fruit4Emmiter.minParticleSpeed.setTo(-300, -300);
                _this._fruit4Emmiter.maxParticleSpeed.setTo(300, 300);
                _this._fruit4Emmiter.setAlpha(1, 0.1, 1200);
                _this._fruit4Emmiter.setScale(1.2, 0.1, 1.2, 0.1, 1200, Phaser.Easing.Quintic.Out);
                _this._fruit5Emmiter = _this.game.add.emitter(0, 0, 50);
                _this.addChild(_this._fruit5Emmiter);
                _this._fruit5Emmiter.makeParticles("atlas", "F_5");
                _this._fruit5Emmiter.gravity = 0;
                _this._fruit5Emmiter.minParticleSpeed.setTo(-300, -300);
                _this._fruit5Emmiter.maxParticleSpeed.setTo(300, 300);
                _this._fruit5Emmiter.setAlpha(1, 0.1, 1200);
                _this._fruit5Emmiter.setScale(1.2, 0.1, 1.2, 0.1, 1200, Phaser.Easing.Quintic.Out);
                _this._fruitSpecialEmmiter1 = _this.game.add.emitter(0, 0, 250);
                _this.game.world.addChild(_this._fruitSpecialEmmiter1);
                _this._fruitSpecialEmmiter1.makeParticles("atlas", "F_1");
                _this._fruitSpecialEmmiter1.gravity = 0;
                _this._fruitSpecialEmmiter1.minParticleSpeed.setTo(-300, -300);
                _this._fruitSpecialEmmiter1.maxParticleSpeed.setTo(300, 300);
                _this._fruitSpecialEmmiter1.setAlpha(1, 0.1, 600);
                _this._fruitSpecialEmmiter1.setScale(1.2, 0.1, 1.2, 0.1, 600, Phaser.Easing.Quintic.Out);
                _this._fruitSpecialEmmiter1.start(false, 500, 5);
                _this._fruitSpecialEmmiter1.on = false;
                _this._fruitSpecialEmmiter2 = _this.game.add.emitter(0, 0, 250);
                _this.game.world.addChild(_this._fruitSpecialEmmiter2);
                _this._fruitSpecialEmmiter2.makeParticles("atlas", "F_3");
                _this._fruitSpecialEmmiter2.gravity = 0;
                _this._fruitSpecialEmmiter2.minParticleSpeed.setTo(-300, -300);
                _this._fruitSpecialEmmiter2.maxParticleSpeed.setTo(300, 300);
                _this._fruitSpecialEmmiter2.setAlpha(1, 0.1, 600);
                _this._fruitSpecialEmmiter2.setScale(1.2, 0.1, 1.2, 0.1, 600, Phaser.Easing.Quintic.Out);
                _this._fruitSpecialEmmiter2.start(false, 500, 5);
                _this._fruitSpecialEmmiter2.on = false;
                _this._fruitSpecialEmmiter3 = _this.game.add.emitter(0, 0, 250);
                _this.game.world.addChild(_this._fruitSpecialEmmiter3);
                _this._fruitSpecialEmmiter3.makeParticles("atlas", "F_4");
                _this._fruitSpecialEmmiter3.gravity = 0;
                _this._fruitSpecialEmmiter3.minParticleSpeed.setTo(-300, -300);
                _this._fruitSpecialEmmiter3.maxParticleSpeed.setTo(300, 300);
                _this._fruitSpecialEmmiter3.setAlpha(1, 0.1, 600);
                _this._fruitSpecialEmmiter3.setScale(1.2, 0.1, 1.2, 0.1, 600, Phaser.Easing.Quintic.Out);
                _this._fruitSpecialEmmiter3.start(false, 500, 5);
                _this._fruitSpecialEmmiter3.on = false;
            }
            _this._createBomb = false;
            _this._condensationPoint = new Phaser.Point(0, 0);
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
                var k = this._selectedGem.row + deltaRow;
                var h = this._selectedGem.col + deltaCol;
                if (k >= 0 && k < this._gameArray.length && h >= 0 && h < this._gameArray[0].length) {
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
                        this_1._container.addChild(sprite_1);
                        sprite_1.inputEnabled = true;
                        sprite_1.row = i;
                        sprite_1.col = j;
                        sprite_1.events.onInputDown.add(function (obj, pointer) {
                            var tutorialCondition;
                            tutorialCondition = window["tutorial"] && (sprite_1.row == 2) && (sprite_1.mytype == 2) || !window["tutorial"];
                            tutorialCondition = tutorialCondition || window["tutorial"] && (sprite_1.col == 3) && (sprite_1.mytype == 4);
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
                        this_1._gameArray[i][j] = sprite_1;
                    }
                    else {
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
                this._border = this.game.add.sprite(2.5 * mygame.GameConfig.BLOCK_SIZE, 2.5 * mygame.GameConfig.BLOCK_SIZE, "atlas", "Help-Frame-01");
                this._border.anchor.set(0.5);
                this._borderTween = this.game.add.tween(this._border.scale).to({
                    x: 1.2,
                    y: 1.2
                }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
                this._container.addChild(this._border);
            }
        };
        Field.prototype.endGame = function () {
            var _this = this;
            for (var i = 0; i < this._gameArray.length; i++) {
                for (var j = 0; j < this._gameArray[i].length; j++) {
                    this._gameArray[i][j].inputEnabled = false;
                }
            }
            setTimeout(function () { _this._finalCallback(); }, 1000);
        };
        Field.prototype.clearTweens = function () {
            if (this._tweenArray.length > 0) {
                for (var i = 0; i < this._tweenArray.length; i++) {
                    if (this._tweenArray[i] != null)
                        this.game.tweens.remove(this._tweenArray[i]);
                }
            }
            this._tweenArray = [];
            if (this._tempSprite.length > 0) {
                for (var i = 0; i < this._tempSprite.length; i++) {
                    if (this._tempSprite[i] != null)
                        this._tempSprite[i].destroy(true);
                }
            }
            this._tempSprite = [];
            for (var i = 0; i < this._gameArray.length; i++) {
                for (var j = 0; j < this._gameArray[i].length; j++) {
                    if (this._gameArray[i][j] != null) {
                        this._gameArray[i][j].clearTweens();
                    }
                }
            }
        };
        Field.prototype.replay = function () {
            this._disabled = false;
            this._finalWasFired = false;
            if (window["collectable"]) {
                this._counters = [0, window["firstElement"], 0, window["secondElement"], window["thirdElement"], 0, 100, 100];
            }
            else {
                this._counters = [-1, -1, -1, -1, -1, -1, -1, -1];
            }
        };
        Field.prototype.gemSelect = function (gem) {
            if (this._selectedGem == null) {
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
            }
            else {
                this._selectedGem.deselect();
                this._selectedGem = gem;
                gem.select();
            }
        };
        Field.prototype.resetBoard = function () {
            for (var i = 0; i < this._gameArray.length; i++) {
                for (var j = 0; j < this._gameArray[0].length; j++) {
                    if (this._gameArray[i][j].mytype > 0) {
                        this._gameArray[i][j].mytype = mygame.GameConfig.gameArrayLandscape[i][j];
                    }
                }
            }
            this._canClick = true;
        };
        Field.prototype.moveExists = function () {
            var str = "";
            var k = 6;
            for (var i = 0; i < this._gameArray.length; i++) {
                for (var j = 0; j < this._gameArray[i].length; j++) {
                    if (this._gameArray[i][j].mytype < 0) {
                        str += "0";
                    }
                    else {
                        str += this._gameArray[i][j].mytype;
                    }
                    if (this._gameArray[i][j].mytype > 5) {
                        return true;
                    }
                }
                str += k;
                k++;
                if (k > 9) {
                    k = 6;
                }
                str += "\n";
            }
            var myRe = /(\d)(?:.|(?:.|\n){9}|(?:.|\n){6})?\1\1|(\d)\2(?:.|(?:.|\n){9}|(?:.|\n){6})?\2|(\d)(?:.|\n){7}\3(?:.|(?:.|\n){9})\3|(\d)(?:.|(?:.|\n){9})\4(?:.|\n){7}\4|(\d)(?:(?:.|\n){7,9}|(?:.|\n){17})\5(?:.|\n){8}\5|(\d)(?:.|\n){8}\6(?:(?:.|\n){7,9}|(?:.|\n){17})\6/;
            if (myRe.exec(str) == null) {
                return false;
            }
            return true;
        };
        Field.prototype.swapGems = function (swapBack) {
            var _this = this;
            if (swapBack === void 0) { swapBack = true; }
            if (window["tutorial"]) {
                var minCol = Math.min(this._selectedGem.col, this._pickedGem.col);
                var maxCol = Math.max(this._selectedGem.col, this._pickedGem.col);
                if (Math.abs(this._pickedGem.col - this._selectedGem.col) != 1 || (minCol != 2 && maxCol != 3)) {
                    this._selectedGem = null;
                    this._pickedGem = null;
                    return;
                }
                else {
                    window["tutorial"] = false;
                    for (var i = 0; i < this._gameArray.length; i++) {
                        for (var j = 0; j < this._gameArray[i].length; j++) {
                            this._playState.destroyTutorial();
                            this._borderTween.stop();
                            this._border.destroy();
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
            this._tweenArray.push(tweenSelected);
            var tweenPicked = this.game.add.tween(this._pickedGem).to({
                x: posSelected.x,
                y: posSelected.y
            }, mygame.GameConfig.SWAP_TIME, Phaser.Easing.Linear.None, false);
            this._tweenArray.push(tweenPicked);
            var type1 = this._selectedGem.mytype;
            var type2 = this._pickedGem.mytype;
            tweenPicked.onComplete.add(function () {
                if (_this._selectedGem !== null && _this._selectedGem !== undefined && _this._pickedGem !== undefined && _this._pickedGem !== null && (_this._selectedGem.isBomb || _this._pickedGem.isBomb)) {
                    _this._removeMap = [];
                    for (var i = 0; i < _this._gameArray.length; i++) {
                        _this._removeMap[i] = [];
                        for (var j = 0; j < _this._gameArray[i].length; j++) {
                            _this._removeMap[i].push(0);
                        }
                    }
                    if (_this._selectedGem.isBomb) {
                        _this.setOff(_this._selectedGem.mytype - 5, _this._selectedGem.row, _this._selectedGem.col);
                        _this.destroyGems();
                    }
                    else {
                        _this._selectedGem = _this._pickedGem;
                        _this.setOff(_this._selectedGem.mytype - 5, _this._selectedGem.row, _this._selectedGem.col);
                        _this.destroyGems();
                    }
                }
                else {
                    if (_this.isMatchOnBoard(rowPic, colPic, type1, rowSel, colSel, type2)) {
                        _this.handleMatches();
                        _this._selectedGem = null;
                        _this._pickedGem = null;
                    }
                    else if (swapBack) {
                        _this.swapGems(false);
                    }
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
        Field.prototype.setOff = function (range, x, y) {
            if (x == null) {
                if (!this._selectedGem.isBomb || range < 1) {
                    return;
                }
                if (!this._canClick) {
                    return;
                }
            }
            this._canClick = false;
            this._boomAnimation = true;
            var p;
            if (x !== undefined && x !== null) {
                p = new Phaser.Point(x, y);
            }
            else {
                p = new Phaser.Point(this._selectedGem.row, this._selectedGem.col);
                this._selectedGem.stopTween();
            }
            this._selectedGem = null;
            this._pickedGem = null;
            switch (range) {
                case 1:
                    {
                        for (var i = -1; i < 2; i++) {
                            var k = void 0;
                            var h = void 0;
                            if (p.x + i >= 0 && p.x + i < this._gameArray.length) {
                                k = p.x + i;
                                h = p.y;
                                if (this._gameArray[k][h].isBomb && (k != p.x || h != p.y) && this._removeMap[k][h] == 0) {
                                    this.setOff(this._gameArray[k][h].mytype - 5, k, h);
                                }
                                if (this._gameArray[k][h].mytype > 0) {
                                    this._removeMap[k][h] = 1;
                                }
                            }
                            if (p.y + i >= 0 && p.y + i < this._gameArray[0].length) {
                                k = p.x;
                                h = p.y + i;
                                if (this._gameArray[k][h].isBomb && (k != p.x || h != p.y) && this._removeMap[k][h] == 0) {
                                    this.setOff(this._gameArray[k][h].mytype - 5, k, h);
                                }
                                if (this._gameArray[k][h].mytype > 0) {
                                    this._removeMap[k][h] = 1;
                                }
                            }
                        }
                    }
                    break;
                case 2:
                    {
                        var k = void 0;
                        var h = void 0;
                        for (var i = -2; i < 3; i++) {
                            if (p.x + i >= 0 && p.x + i < this._gameArray.length) {
                                k = p.x + i;
                                h = p.y;
                                if (this._gameArray[k][h].isBomb && (k != p.x || h != p.y) && this._removeMap[k][h] == 0) {
                                    this.setOff(this._gameArray[k][h].mytype - 5, k, h);
                                }
                                if (this._gameArray[k][h].mytype > 0) {
                                    this._removeMap[k][h] = 1;
                                }
                            }
                            if (p.y + i >= 0 && p.y + i < this._gameArray[0].length) {
                                k = p.x;
                                h = p.y + i;
                                if (this._gameArray[k][h].isBomb && (k != p.x || h != p.y) && this._removeMap[k][h] == 0) {
                                    this.setOff(this._gameArray[k][h].mytype - 5, k, h);
                                }
                                if (this._gameArray[k][h].mytype > 0) {
                                    this._removeMap[k][h] = 1;
                                }
                            }
                        }
                        for (var i = -1; i < 2; i++) {
                            for (var j = -1; j < 2; j++) {
                                if (p.x + i >= 0 && p.x + i < this._gameArray.length) {
                                    if (p.y + j >= 0 && p.y + j < this._gameArray[0].length) {
                                        k = p.x + i;
                                        h = p.y + j;
                                        if (this._gameArray[k][h].isBomb && (k != p.x || h != p.y) && this._removeMap[k][h] == 0) {
                                            this.setOff(this._gameArray[k][h].mytype - 5, k, h);
                                        }
                                        if (this._gameArray[k][h].mytype > 0) {
                                            this._removeMap[k][h] = 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break;
            }
            this._coolAnimation = false;
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
        Field.prototype.handleMatches = function () {
            var _this = this;
            if (!this._firstMatch) {
                this._firstMatch = true;
                if (this._firstMatchCallback) {
                    this._firstMatchCallback();
                }
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
            this._sequences.forEach(function (x) {
                for (var i = 0; i < x.length; i++) {
                    var p = x.get(i);
                    _this._removeMap[p.x][p.y] = 1;
                }
            });
            this.destroyGems();
            this._coolAnimation = false;
        };
        Field.prototype.destroyGems = function () {
            var _this = this;
            this._destroyed = 0;
            var condensationPoint;
            var condensationType;
            if (this._selectedGem != null) {
                if (this._removeMap[this._selectedGem.row][this._selectedGem.col] > 0) {
                    condensationPoint = new Phaser.Point(this._selectedGem.x, this._selectedGem.y);
                    condensationType = this._selectedGem.mytype;
                    this._condensationPoint.set(this._selectedGem.row, this._selectedGem.col);
                    var i = 0;
                    while (i < this._sequences.length) {
                        var s = this._sequences[i];
                        if (s.contains(this._condensationPoint.x, this._condensationPoint.y)) {
                            if (s.isBomb) {
                                s.setBombPosition(this._condensationPoint.x, this._condensationPoint.y);
                            }
                            break;
                        }
                        i++;
                    }
                }
                else if (this._removeMap[this._pickedGem.row][this._pickedGem.col] > 0) {
                    condensationPoint = new Phaser.Point(this._pickedGem.x, this._pickedGem.y);
                    condensationType = this._pickedGem.mytype;
                    this._condensationPoint.set(this._pickedGem.row, this._pickedGem.col);
                    var i = 0;
                    while (i < this._sequences.length) {
                        var s = this._sequences[i];
                        if (s.contains(this._condensationPoint.x, this._condensationPoint.y)) {
                            if (s.isBomb) {
                                s.setBombPosition(this._condensationPoint.x, this._condensationPoint.y);
                            }
                            break;
                        }
                        i++;
                    }
                }
                else {
                    condensationPoint = new Phaser.Point(1, 1);
                    condensationType = 0;
                }
            }
            this._coolAnimation = false;
            if (this._coolAnimation) {
                this.condensate(condensationPoint);
            }
            else {
                setTimeout(function () {
                    var gemsToDestroy = [];
                    var tweens = [];
                    var delay = 0;
                    for (var i = 0; i < _this._removeMap.length; i++) {
                        var _loop_2 = function (j) {
                            if (_this._removeMap[i][j] > 0) {
                                _this._destroyed++;
                                var gem_1 = _this._gameArray[i][j];
                                if ((gem_1.mytype == 1 || gem_1.mytype == 3 || gem_1.mytype == 4) && _this._counters[gem_1.mytype] > 0) {
                                    var point = void 0;
                                    if (gem_1.mytype == 1) {
                                        point = _this._playState.getGurrentElementPosition("first");
                                    }
                                    else if (gem_1.mytype == 3) {
                                        point = _this._playState.getGurrentElementPosition("second");
                                    }
                                    else if (gem_1.mytype == 4) {
                                        point = _this._playState.getGurrentElementPosition("third");
                                    }
                                    var xPos = gem_1.worldPosition.x;
                                    var yPos = gem_1.worldPosition.y;
                                    _this._container.removeChild(gem_1);
                                    _this.game.world.addChild(gem_1);
                                    _this._tempSprite.push(gem_1);
                                    gem_1.position.set(xPos, yPos);
                                    var flyTween = _this.createFlyTween(gem_1, point, delay);
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
                                            if (_this._boomAnimation) {
                                                _this._boomAnimation = false;
                                            }
                                        }
                                    };
                                    gemsToDestroy.push(gem_1);
                                }
                            }
                        };
                        for (var j = 0; j < _this._removeMap[i].length; j++) {
                            _loop_2(j);
                        }
                    }
                    var deleyForParticle = 0;
                    gemsToDestroy.forEach(function (x) {
                        if (_this._boomAnimation) {
                            x.boomAnimation();
                        }
                        else {
                            x.playDestroy();
                            if (window["particleOn"]) {
                                switch (x.mytype) {
                                    case 1:
                                        _this._fruit1Emmiter.x = x.x;
                                        _this._fruit1Emmiter.y = x.y;
                                        _this._fruit1Emmiter.start(true, 1100, null, 7);
                                        break;
                                    case 2:
                                        _this._fruit2Emmiter.x = x.x;
                                        _this._fruit2Emmiter.y = x.y;
                                        _this._fruit2Emmiter.start(true, 1100, null, 7);
                                        break;
                                    case 3:
                                        _this._fruit3Emmiter.x = x.x;
                                        _this._fruit3Emmiter.y = x.y;
                                        _this._fruit3Emmiter.start(true, 1100, null, 7);
                                        break;
                                    case 4:
                                        _this._fruit4Emmiter.x = x.x;
                                        _this._fruit4Emmiter.y = x.y;
                                        _this._fruit4Emmiter.start(true, 1100, null, 7);
                                        break;
                                    case 5:
                                        _this._fruit5Emmiter.x = x.x;
                                        _this._fruit5Emmiter.y = x.y;
                                        _this._fruit5Emmiter.start(true, 1100, null, 7);
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    });
                    tweens.forEach(function (x) { return x.start(); });
                }, 10);
            }
        };
        Field.prototype.handleHorizontalMatches = function () {
            var _loop_3 = function (i) {
                var colorStreak = 1;
                var currentColor = -100500;
                var startStreak = 0;
                for (var j = 0; j < this_2._gameArray[i].length; j++) {
                    if (this_2._gameArray[i][j].mytype == currentColor && this_2._gameArray[i][j].mytype > 0) {
                        colorStreak++;
                        if (colorStreak >= 4) {
                            this_2._createBomb = true;
                            this_2._maxColorStreak = Math.max(this_2._maxColorStreak, colorStreak);
                        }
                    }
                    if (this_2._gameArray[i][j].mytype != currentColor || j == this_2._gameArray[i].length - 1) {
                        if (colorStreak >= 3) {
                            var seq = new mygame.Sequence();
                            this_2._sequences.push(seq);
                            if (this_2._counters[currentColor] <= 0 || !this_2._coolAnimation) {
                                this_2._coolAnimation = false;
                            }
                            var currentId = this_2._sequences.length - 1;
                            var _loop_4 = function (k) {
                                var id = currentId;
                                this_2._sequences.forEach(function (s, n) {
                                    if (s.contains(i, startStreak + k)) {
                                        id = n;
                                    }
                                });
                                if (id != currentId) {
                                    this_2._sequences[id].merge(seq);
                                    seq = this_2._sequences[id];
                                    currentId = id;
                                }
                                else {
                                    seq.add(i, startStreak + k);
                                }
                            };
                            for (var k = 0; k < colorStreak; k++) {
                                _loop_4(k);
                            }
                        }
                        startStreak = j;
                        colorStreak = 1;
                        currentColor = this_2._gameArray[i][j].mytype;
                    }
                }
            };
            var this_2 = this;
            for (var i = 0; i < this._gameArray.length; i++) {
                _loop_3(i);
            }
        };
        Field.prototype.handleVerticalMatches = function () {
            var _loop_5 = function (i) {
                var colorStreak = 1;
                var currentColor = -100500;
                var startStreak = 0;
                for (var j = 0; j < this_3._gameArray.length; j++) {
                    if (this_3._gameArray[j][i].mytype == currentColor && this_3._gameArray[j][i].mytype > 0) {
                        colorStreak++;
                        if (colorStreak >= 4) {
                            this_3._createBomb = true;
                            this_3._maxColorStreak = Math.max(this_3._maxColorStreak, colorStreak);
                        }
                    }
                    if (this_3._gameArray[j][i].mytype != currentColor || j == this_3._gameArray.length - 1) {
                        if (colorStreak >= 3) {
                            var seq = new mygame.Sequence();
                            this_3._sequences.push(seq);
                            var currentId = this_3._sequences.length - 1;
                            if (this_3._counters[currentColor] <= 0 || !this_3._coolAnimation) {
                                this_3._coolAnimation = false;
                            }
                            else {
                                this_3._verticalAnimation = true;
                            }
                            var _loop_6 = function (k) {
                                var id = currentId;
                                this_3._sequences.forEach(function (s, n) {
                                    if (s.contains(startStreak + k, i)) {
                                        id = n;
                                    }
                                });
                                if (id != currentId) {
                                    this_3._sequences[id].merge(seq);
                                    seq = this_3._sequences[id];
                                    currentId = id;
                                }
                                else {
                                    seq.add(startStreak + k, i);
                                }
                            };
                            for (var k = 0; k < colorStreak; k++) {
                                _loop_6(k);
                            }
                        }
                        startStreak = j;
                        colorStreak = 1;
                        currentColor = this_3._gameArray[j][i].mytype;
                    }
                }
            };
            var this_3 = this;
            for (var i = 0; i < this._gameArray[0].length; i++) {
                _loop_5(i);
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
            this._sequences.forEach(function (seq) {
                if (seq.isBomb) {
                    var p = seq.bombPosition;
                    _this._removeMap[p.x][p.y] = 0;
                    var gem = _this._gameArray[p.x][p.y];
                    try {
                        _this.game.world.removeChild(gem);
                        _this._container.addChild(gem);
                    }
                    catch (e) {
                    }
                    gem.x = (gem.col + 0.5) * mygame.GameConfig.BLOCK_SIZE;
                    gem.y = (gem.row + 0.5) * mygame.GameConfig.BLOCK_SIZE;
                    gem.spawnBoom(seq.length);
                    _this._maxColorStreak = 0;
                    _this._createBomb = false;
                    _this._boomAnimation = false;
                }
            });
            if (this._turnOffMask) {
                this._turnOffMask = false;
                this._container.mask = this._myMask;
            }
            this._sequences.length = 0;
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
                var _loop_7 = function (i) {
                    var gem = this_4._gameArray[i][hole.col];
                    fallen++;
                    var tween = this_4.game.add.tween(gem).to({
                        y: gem.y + hole.length * mygame.GameConfig.BLOCK_SIZE
                    }, mygame.GameConfig.FALLDOWN_TIME, Phaser.Easing.Back.Out, false);
                    this_4._tweenArray.push(tween);
                    tween.onComplete.add(function () {
                        _this._gameArray[gem.row][gem.col] = gem;
                        fallen--;
                        if (fallen == 0) {
                            if (_this.checkGlobalMatch()) {
                                _this.handleMatches();
                            }
                            else {
                                if (!_this.moveExists()) {
                                    _this.resetBoard();
                                }
                                else {
                                    _this._canClick = true;
                                }
                                _this._selectedGem = null;
                                if (!_this._finalWasFired) {
                                    var counter = 0;
                                    for (var i_1 = 0; i_1 < _this._counters.length; i_1++) {
                                        if (_this._counters[i_1] <= 0) {
                                            counter++;
                                        }
                                        if (counter == _this._counters.length - 2) {
                                            _this._finalWasFired = true;
                                            mygame.GameConfig.COUNTERS_PUBLIC = [0, window["firstElement"], 0, window["secondElement"], window["thirdElement"], 0, 100, 100];
                                            _this.endGame();
                                        }
                                    }
                                }
                            }
                        }
                    });
                    tweens.push(tween);
                };
                var this_4 = this;
                for (var i = start; i < end; i++) {
                    _loop_7(i);
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
            this._tweenArray.push(scaleTween);
            scaleTween.onComplete.addOnce(function () {
                gem.scale.setTo(1);
            }, this);
            var flyTween = this.game.add.tween(gem).to({
                x: flyawayPoint.x,
                y: flyawayPoint.y
            }, mygame.GameConfig.FLY_TIME, Phaser.Easing.Sinusoidal.InOut, false, delay);
            this._tweenArray.push(flyTween);
            if (gem.mytype == 1) {
                this._gem1ToFollow = gem;
            }
            else if (gem.mytype == 3) {
                this._gem2ToFollow = gem;
            }
            else if (gem.mytype == 4) {
                this._gem3ToFollow = gem;
            }
            flyTween.onStart.addOnce(function () {
                if (window["particleOn"]) {
                    if (gem.mytype == 1) {
                        if (_this._gem1ToFollow == gem) {
                            _this._fruitSpecialEmmiter1.x = _this._gem1ToFollow.x;
                            _this._fruitSpecialEmmiter1.y = _this._gem1ToFollow.y;
                            _this._fruitSpecialEmmiter1.on = true;
                            _this._followGem1 = true;
                        }
                    }
                    else if (gem.mytype == 3) {
                        if (_this._gem2ToFollow == gem) {
                            _this._fruitSpecialEmmiter2.x = _this._gem2ToFollow.x;
                            _this._fruitSpecialEmmiter2.y = _this._gem2ToFollow.y;
                            _this._fruitSpecialEmmiter2.on = true;
                            _this._followGem2 = true;
                        }
                    }
                    else if (gem.mytype == 4) {
                        if (_this._gem3ToFollow == gem) {
                            _this._fruitSpecialEmmiter3.x = _this._gem3ToFollow.x;
                            _this._fruitSpecialEmmiter3.y = _this._gem3ToFollow.y;
                            _this._fruitSpecialEmmiter3.on = true;
                            _this._followGem3 = true;
                        }
                    }
                }
                scaleTween.start();
            });
            flyTween.onComplete.add(function (obj, tween) {
                if (gem) {
                    if (window["particleOn"]) {
                        if (gem.mytype == 1) {
                            if (_this._gem1ToFollow == gem) {
                                _this._fruitSpecialEmmiter1.on = false;
                                _this._followGem1 = false;
                            }
                        }
                        else if (gem.mytype == 3) {
                            if (_this._gem2ToFollow == gem) {
                                _this._fruitSpecialEmmiter2.on = false;
                                _this._followGem2 = false;
                            }
                        }
                        else if (gem.mytype == 4) {
                            if (_this._gem3ToFollow == gem) {
                                _this._fruitSpecialEmmiter3.on = false;
                                _this._followGem3 = false;
                            }
                        }
                        for (var i = void 0; i < _this._tempSprite.length; i++) {
                            if (_this._tempSprite[i] == gem) {
                                _this._tempSprite.splice(i, 1);
                                break;
                            }
                        }
                    }
                    _this.game.world.removeChild(gem);
                    _this._container.addChild(gem);
                    gem.position.set(-1500, -1500);
                    _this._destroyed--;
                    _this._cb(gem.mytype, 1);
                    _this._counters[gem.mytype]--;
                    if (_this._boomAnimation) {
                        _this._boomAnimation = false;
                    }
                    if (_this._destroyed == 0) {
                        _this.makeGemsFall();
                    }
                }
            }, this);
            return flyTween;
        };
        Field.prototype.updateSpecialGemEmmiter = function () {
            if (window["particleOn"]) {
                if (this._followGem1) {
                    this._fruitSpecialEmmiter1.x = this._gem1ToFollow.x;
                    this._fruitSpecialEmmiter1.y = this._gem1ToFollow.y;
                }
                if (this._followGem2) {
                    this._fruitSpecialEmmiter2.x = this._gem2ToFollow.x;
                    this._fruitSpecialEmmiter2.y = this._gem2ToFollow.y;
                }
                if (this._followGem3) {
                    this._fruitSpecialEmmiter3.x = this._gem3ToFollow.x;
                    this._fruitSpecialEmmiter3.y = this._gem3ToFollow.y;
                }
            }
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
                this._tweenArray.push(condensateTween);
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
        Field.prototype.update = function () {
            this.updateSpecialGemEmmiter();
        };
        Field.prototype.destroy = function () {
            var _this = this;
            this.clearTweens();
            setTimeout(function () {
                _this.game.input.onUp.removeAll(_this);
                _this.game.tweens.removeFrom(_this, true);
                _super.prototype.destroy.call(_this, true);
            }, 10);
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
        GameConfig.enableDrag = function (sprite) {
            return;
        };
        return GameConfig;
    }());
    GameConfig.BLOCK_SIZE = 84;
    GameConfig.SWAP_TIME = 150;
    GameConfig.DESTROY_TIME = 150;
    GameConfig.FALLDOWN_TIME = 400;
    GameConfig.FLY_TIME = 500 * 1.15;
    GameConfig.CONDENSATION_TIME = 300;
    GameConfig.COUNTERS = [0, 2, 1, 0, 0, 0, 0, 0];
    GameConfig.COUNTERS_PUBLIC = [0, 2, 1, 0, 0, 0, 0, 0];
    GameConfig.NAMES = ["apple", "apple", "grapes", "flower", "pear", "leaf"];
    GameConfig.PANEL_GEM_SCALE = 0.8;
    GameConfig.APPLE_POS = new Phaser.Point(100, -60);
    GameConfig.GRAPES_POS = new Phaser.Point(370, -60);
    GameConfig.UNLOCK_OBJ_PER_FRUITS = 3;
    GameConfig.GEM_DEFAULT_SCALE = 0.9;
    GameConfig.gameArrayLandscape = [
        [-1, 5, 3, 2, 4, 1, -1],
        [2, 3, 3, 2, 1, 1, 5],
        [3, 1, 2, 4, 4, 5, 1],
        [4, 3, 5, 2, 4, 5, 1],
        [-1, 5, 4, 1, 5, 4, -1]
    ];
    mygame.GameConfig = GameConfig;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Gem = (function (_super) {
        __extends(Gem, _super);
        function Gem(game, x, y, type) {
            var _this = _super.call(this, game, x, y) || this;
            _this._tempTweenArray = [];
            _this._mytype = type;
            _this._spriteName = mygame.GameConfig.NAMES[_this._mytype];
            if (type > 0) {
                _this._sprite = _this.game.add.sprite(0, 0, "atlas", "F_" + _this._mytype);
                _this._sprite.anchor.set(0.5);
                _this._sprite.scale.set(mygame.GameConfig.GEM_DEFAULT_SCALE);
                _this.addChild(_this._sprite);
                _this._boom = _this.game.add.sprite(0, 0, "boom_anim", "b_1");
                _this._boom.anchor.set(0.5);
                _this._boom.visible = false;
                _this.addChild(_this._boom);
                _this._destroyAnimation = _this._sprite.animations.add("set off", Phaser.Animation.generateFrameNames("e_", 1, 7), 18, false);
                _this._destroyAnimation.onStart.add(function () {
                    _this._sprite.alpha = 1;
                }, _this);
                _this._boomAnimation = _this._boom.animations.add("bomb", Phaser.Animation.generateFrameNames("b_", 1, 10), 18, false);
                _this._boomAnimation.onComplete.add(function () {
                    _this._boom.visible = false;
                    _this.animationEnd();
                }, _this);
                _this._bombBoomAnimation = _this._boom.animations.add("b_bomb", Phaser.Animation.generateFrameNames("bb_", 1, 10), 18, false);
                _this._bombBoomAnimation.onComplete.add(function () {
                    _this._boom.visible = false;
                    _this.animationEnd();
                }, _this);
                _this._border = _this.game.add.sprite(0, 0, "atlas", "Help-Frame-01");
                _this._border.anchor.set(0.5);
                _this._border.scale.set(1);
                _this.addChild(_this._border);
                _this._border.alpha = 0;
                _this._destroyAnimation.onComplete.add(function () {
                    _this.animationEnd();
                }, _this);
                _this._bombTween = _this.game.add.tween(_this._sprite.scale).to({
                    x: 1.1,
                    y: 1.1
                }, 500, Phaser.Easing.Sinusoidal.InOut, false, 0, -1, true);
            }
            return _this;
        }
        Gem.prototype.animationEnd = function () {
            if (!this._onCompleteFired) {
                this._onCompleteFired = true;
                this._sprite.alpha = 0;
                if (this._destroyCallback) {
                    this._onCompleteFired = true;
                    this._destroyCallback();
                }
            }
        };
        Gem.prototype.boomAnimation = function () {
            this._boom.visible = true;
            this._sprite.alpha = 0;
            if (this._mytype >= 6) {
                this._bombBoomAnimation.play();
            }
            else {
                this._boomAnimation.play();
            }
        };
        Gem.prototype.spawnBoom = function (streakCounter) {
            var _this = this;
            if (streakCounter > 3) {
                this._border.alpha = 0;
                this._sprite.scale.set(0.1);
                if (streakCounter == 4) {
                    this._sprite.loadTexture("atlas", "rocket");
                    this._mytype = 6;
                }
                else {
                    this._sprite.loadTexture("atlas", "bomb");
                    this._mytype = 7;
                }
                this.game.add.tween(this._sprite.scale).to({
                    x: 0.7,
                    y: 0.7
                }, 400, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                    _this._sprite.scale.set(0.7);
                    _this._bombTween = _this.game.add.tween(_this._sprite.scale).to({
                        x: 1.1,
                        y: 1.1
                    }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
                }, this);
                this._sprite.alpha = 1;
                this._onCompleteFired = false;
                this._destroyAnimation.stop();
            }
        };
        Gem.prototype.stopTween = function () {
            this._bombTween.pause();
            this._sprite.loadTexture("atlas", "F_2");
            this._sprite.alpha = 0;
        };
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
                this._border.alpha = 0;
                if (!this._onCompleteFired) {
                    this._destroyAnimation.stop();
                    this._onCompleteFired = true;
                }
                this._destroyAnimation.stop();
                this._mytype = val;
                if (val < 6) {
                    this._bombTween.pause();
                    this._sprite.position.set(0, 0);
                    this._sprite.scale.set(mygame.GameConfig.GEM_DEFAULT_SCALE, mygame.GameConfig.GEM_DEFAULT_SCALE);
                    this._spriteName = mygame.GameConfig.NAMES[this._mytype];
                    this._sprite.loadTexture("atlas", "F_" + this._mytype);
                }
                else {
                    this._bombTween.start();
                    this._spriteName = "rocket";
                    this._sprite.loadTexture("atlas", "rocket");
                    this._sprite.scale.set(2, 2);
                }
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
        Object.defineProperty(Gem.prototype, "isBomb", {
            get: function () {
                return this._mytype >= 6;
            },
            enumerable: true,
            configurable: true
        });
        Gem.prototype.playDestroy = function () {
            var _this = this;
            this._border.alpha = 0;
            if (this.mytype == 6) {
                this._bombTween.pause();
            }
            var tween = this.game.add.tween(this._sprite.scale).to({ x: 0.15, y: 0.15 }, 100, Phaser.Easing.Sinusoidal.Out, true);
            this._tempTweenArray.push(tween);
            tween.onComplete.addOnce(function () {
                _this._sprite.scale.set(mygame.GameConfig.GEM_DEFAULT_SCALE);
                _this._destroyAnimation.play();
            });
        };
        Gem.prototype.select = function () {
            if (!window["tutorial"]) {
                this._sprite.scale.set(mygame.GameConfig.GEM_DEFAULT_SCALE + 0.2);
                if (this.mytype < 6) {
                    this._border.alpha = 1;
                }
            }
        };
        Gem.prototype.deselect = function () {
            this._sprite.scale.set(mygame.GameConfig.GEM_DEFAULT_SCALE);
            this._border.alpha = 0;
        };
        Gem.prototype.isSame = function (a) {
            return (this._row == a.row) && (this._col == a.col);
        };
        Gem.prototype.isNext = function (gem2) {
            return Math.abs(this.row - gem2.row) + Math.abs(this.col - gem2.col) == 1;
        };
        return Gem;
    }(Phaser.Sprite));
    mygame.Gem = Gem;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Lang = (function () {
        function Lang() {
            this.CONGRAT = { en: 'Congratulations!', de: '  Herzlichen Gluckwunsch !' };
            this.PLOT = { en: 'The plot\nis restored!', de: 'Ein Grundstuck\nrestauriert!' };
            this.TUTORIAL = { en: 'Collect fruits to upgrade garden!', de: 'Sammeln Sie Fruchte,\num den Garten zu verbessern!' };
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
        return Lang;
    }());
    Lang.loc = 'en';
    mygame.Lang = Lang;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Panel = (function (_super) {
        __extends(Panel, _super);
        function Panel(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this._unclocksCounter = 0;
            _this._benches = new Array(2);
            _this._brightBenches = new Array(2);
            _this._fontains = new Array(2);
            _this._leafs = [];
            _this._leafs[0] = _this.game.add.sprite(240, -450, "atlas", "Back-02");
            _this._leafs[0].angle = 25;
            _this._leafs[1] = _this.game.add.sprite(240, 0, "atlas", "Back-02");
            _this._leafs[1].angle = 25;
            _this._leafs[2] = _this.game.add.sprite(0, 100, "atlas", "Back-02");
            _this._leafs[2].angle = -45;
            _this._leafs.forEach(function (x) { return _this.addChild(x); });
            _this._myMask = _this.game.add.graphics(-23, -16);
            _this.addChild(_this._myMask);
            _this._myMask.beginFill(0xffffff);
            _this._myMask.drawRoundedRect(-500 / 2, -600, 545, 688 - 2, 30);
            _this._myMask.endFill();
            _this._fountain = _this.game.add.sprite(0, 110, "atlas", "Build-05");
            _this._fountain.anchor.set(0.5, 1);
            _this._fountain.mask = _this._myMask;
            _this.addChild(_this._fountain);
            var bench = _this.game.add.sprite(180, -505, "atlas", "Build-02");
            bench.alpha = 0;
            bench.anchor.set(0.5);
            _this._benches[0] = bench;
            _this._fountain.addChild(bench);
            var bench2 = _this.game.add.sprite(-200, -505, "atlas", "Build-02");
            bench2.scale.set(-1, 1);
            bench2.alpha = 0;
            bench2.anchor.set(0.5);
            _this._fountain.addChild(bench2);
            _this._benches[1] = bench2;
            var bench3 = _this.game.add.sprite(0, 0, "atlas", "Build-02");
            bench3.anchor.set(0.5);
            bench3.blendMode = PIXI.blendModes.ADD;
            bench.addChild(bench3);
            var bench4 = _this.game.add.sprite(0, 0, "atlas", "Build-02");
            bench4.anchor.set(0.5);
            bench4.blendMode = PIXI.blendModes.ADD;
            bench2.addChild(bench4);
            _this._brightBenches[0] = bench3;
            _this._brightBenches[1] = bench4;
            _this._border = _this.game.add.sprite(0, 70 - 688 / 2, "atlas", "Build-01");
            _this._border.anchor.set(0.5, 0.5);
            _this.addChild(_this._border);
            _this._fontains[0] = _this.game.add.sprite(-115 + 221 / 2, -455 + 120 / 2, "atlas", "Build-03");
            _this._fontains[0].anchor.set(0.5);
            _this._fontains[0].alpha = 0;
            _this._fountain.addChild(_this._fontains[0]);
            _this._fontains[1] = _this.game.add.sprite(0, 0, "atlas", "Build-03");
            _this._fontains[1].anchor.set(0.5);
            _this._fontains[1].blendMode = PIXI.blendModes.ADD;
            _this._fontains[1].alpha = 0;
            _this._fontains[0].addChild(_this._fontains[1]);
            _this._fountain.addChild(_this._fontains[0]);
            _this._trash = _this.game.add.sprite(35, -395, "atlas", "Build-04");
            _this._trash.anchor.set(0.5);
            _this._fountain.addChild(_this._trash);
            _this._trash2 = _this.game.add.sprite(35, -395, "atlas", "Build-04");
            _this._trash2.anchor.set(0.5);
            _this._trash2.blendMode = PIXI.blendModes.ADD;
            _this._trash2.alpha = 0;
            _this._fountain.addChild(_this._trash2);
            _this._sprite = _this.game.add.sprite(0, 0, "atlas", "Quest-Board-01");
            _this._sprite.anchor.set(0.5);
            _this.addChild(_this._sprite);
            _this._fruitsCounter = 0;
            _this._finishWasFired = false;
            _this._fruitScale = 0.8;
            _this._leaf1 = _this.game.add.sprite(-300, -200, "atlas", "Back-01");
            _this._border.addChild(_this._leaf1);
            _this._myCounter = [0, window["firstElement"], 0, window["secondElement"], window["thirdElement"], 0];
            mygame.GameConfig.COUNTERS_PUBLIC = _this._myCounter.slice();
            _this._appleText = _this.game.add.bitmapText(-140 - 30, 10, "font", "0/" + _this._myCounter[1].toString(), 32);
            _this._appleText.anchor.setTo(0, 0.5);
            _this.addChild(_this._appleText);
            _this._leafText = _this.game.add.bitmapText(-5, 10, "font", "0/" + _this._myCounter[3].toString(), 32);
            _this._leafText.anchor.setTo(0, 0.5);
            _this.addChild(_this._leafText);
            _this._grapeText = _this.game.add.bitmapText(5 + 125 + 30, 10, "font", "0/" + _this._myCounter[4].toString(), 32);
            _this._grapeText.anchor.setTo(0, 0.5);
            _this.addChild(_this._grapeText);
            _this._delta = new Array(_this._myCounter.length);
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
            this._myCounter = [0, window["firstElement"], 0, window["secondElement"], 0, 0];
            this._delta = new Array(this._myCounter.length);
            for (var i = 0; i < this._delta.length; i++) {
                this._delta[i] = 0;
            }
            this._appleText.text = "0/" + window["firstElement"].toString();
            this._grapeText.text = "0/" + window["secondElement"].toString();
        };
        Panel.prototype.updateCounter = function (type, delta) {
            if (window["collectable"]) {
                if ((type == 1 || type == 3 || type == 4) && this._myCounter[type] > 0) {
                    this._delta[type] += delta;
                    this._sleepTime = 200;
                }
            }
        };
        Panel.prototype.setLandscape = function () {
            this._border.angle = 0;
            this._myMask.clear();
            this._trash.scale.set(1);
            this._trash2.scale.set(1);
            this._fountain.y = 110;
            this._myMask.beginFill(0xffffff);
            this._myMask.drawRoundedRect(-500 / 2, -600, 545, 688 - 2, 30);
            this._myMask.endFill();
            this._border.position.set(0, 70 - 688 / 2);
            this._leaf1.position.set(-300, -200);
            this._leaf1.angle = 0;
        };
        Panel.prototype.setPortrait = function () {
            this._border.angle = 90;
            this._trash.scale.set(1.2);
            this._trash2.scale.set(1.2);
            this._fountain.y = 185;
            ;
            this._border.position.set(0, 70 - 688 / 2 + 65 + 10);
            this._myMask.clear();
            this._myMask.beginFill(0xffffff);
            this._myMask.drawRoundedRect(-500 / 2 - 70 + 1, -600 + 57 + 90, 688 - 5, 545 - 2, 30);
            this._myMask.endFill();
            this._leaf1.position.set(-230, 360);
            this._leaf1.angle = -90;
        };
        Panel.prototype.getElementPosition = function (type) {
            if (type == "first") {
                return new Phaser.Point(this._apple.worldPosition.x, this._apple.worldPosition.y);
            }
            else if (type == "second") {
                return new Phaser.Point(this._leaf.worldPosition.x, this._leaf.worldPosition.y);
            }
            else {
                return new Phaser.Point(this._grapes.worldPosition.x, this._grapes.worldPosition.y);
            }
        };
        Panel.prototype.initFruits = function () {
            var _this = this;
            this._apple = this.game.add.sprite(this.x - this._sprite.width / 2 + 50, this.y + 2, "atlas", "F_1");
            this._apple.scale.setTo(0.8);
            this._apple.anchor.setTo(0.5);
            this.parent.addChild(this._apple);
            this._grapes = this.game.add.sprite(this.x - 40 + (this._sprite.width / 2 - 90), this.y + 2, "atlas", "F_4");
            this._grapes.scale.setTo(0.8);
            this._grapes.anchor.setTo(0.5);
            this.parent.addChild(this._grapes);
            this._leaf = this.game.add.sprite(this.x - 40, this.y + 2, "atlas", "F_3");
            this._leaf.scale.set(0.8);
            this._leaf.anchor.set(0.5);
            this.parent.addChild(this._leaf);
            this._appleTween = this.game.add.tween(this._apple.scale).to({
                x: this._fruitScale + 0.2,
                y: this._fruitScale + 0.2
            }, 150, Phaser.Easing.Linear.None, false);
            this._appleTween.onComplete.add(function () {
                _this._apple.scale.set(_this._fruitScale);
            });
            this._leafTween = this.game.add.tween(this._leaf.scale).to({
                x: this._fruitScale + 0.2,
                y: this._fruitScale + 0.2
            }, 150, Phaser.Easing.Linear.None, false);
            this._leafTween.onComplete.add(function () {
                _this._leaf.scale.set(_this._fruitScale);
            });
            this._grapesTween = this.game.add.tween(this._grapes.scale).to({
                x: this._fruitScale + 0.2,
                y: this._fruitScale + 0.2
            }, 150, Phaser.Easing.Linear.None, false);
            this._grapesTween.onComplete.add(function () {
                _this._grapes.scale.set(_this._fruitScale);
            }, this);
        };
        Panel.prototype.unlockObject = function () {
            var _this = this;
            switch (this._unclocksCounter) {
                case 0:
                    {
                        this.game.add.tween(this._trash2).to({
                            alpha: 0.7
                        }, 1000, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                            _this.game.add.tween(_this._trash).to({
                                alpha: 0
                            }, 750, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                                _this._trash.visible = false;
                            }, _this);
                            _this.game.add.tween(_this._trash2).to({
                                alpha: 0
                            }, 750, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                                _this._trash2.blendMode = PIXI.blendModes.NORMAL;
                            });
                        }, this);
                    }
                    break;
                case 1:
                    {
                        this._benches.forEach(function (el, i) {
                            el.scale.multiply(1.3, 1.3);
                            el.alpha = 1;
                            _this.game.add.tween(el.scale).to({
                                x: 1 - 2 * i,
                                y: 1
                            }, 1000, Phaser.Easing.Back.Out, true);
                            _this.game.add.tween(_this._brightBenches[i]).to({
                                alpha: 0
                            }, 1000, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                                _this._brightBenches[i].blendMode = PIXI.blendModes.NORMAL;
                            });
                        });
                    }
                    break;
                case 2:
                    {
                        var el = this._fontains[0];
                        el.alpha = 1;
                        el.scale.set(1.3);
                        this._fontains[1].alpha = 0.7;
                        this.game.add.tween(el.scale).to({
                            x: 1,
                            y: 1
                        }, 1000, Phaser.Easing.Back.Out, true);
                        this.game.add.tween(this._fontains[1]).to({
                            alpha: 0
                        }, 1000, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                            _this._fontains[1].blendMode = PIXI.blendModes.NORMAL;
                        }, this);
                    }
                    break;
            }
            this._unclocksCounter++;
        };
        Panel.prototype.hideText = function (text) {
            var _this = this;
            if (text.alpha > 0) {
                this.game.add.tween(text).to({
                    alpha: 0
                }, 500, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                    var checkMark = _this.game.add.sprite(text.x + 30, text.y - 10, "atlas", "Quest-Board-02");
                    checkMark.alpha = 0;
                    _this.game.add.tween(checkMark).to({
                        alpha: 1
                    }, 200, Phaser.Easing.Sinusoidal.InOut, true);
                    checkMark.anchor.set(0.5);
                    _this.addChild(checkMark);
                });
            }
        };
        Panel.prototype.update = function () {
            var dt = this.game.time.elapsedMS;
            if (this._timer > 0) {
                this._timer -= dt;
            }
            if (this._delta[1] > 0 || this._delta[3] > 0 || this._delta[4]) {
                this._timer = this._sleepTime;
                this._fruitsCounter++;
                if (this._delta[1] > 0) {
                    this._delta[1]--;
                    this._myCounter[1]--;
                    if (this._myCounter[1] <= 0) {
                        this._appleText.text = window["firstElement"].toString() + "/" + window["firstElement"].toString();
                        this.hideText(this._appleText);
                        this.unlockObject();
                    }
                    else {
                        this._appleTween.start();
                        this._appleText.text = (window["firstElement"] - this._myCounter[1]).toString() + "/" + window["firstElement"].toString();
                    }
                }
                if (this._delta[3] > 0) {
                    this._delta[3]--;
                    this._myCounter[3]--;
                    if (this._myCounter[3] <= 0) {
                        this._leafText.text = window["secondElement"].toString() + "/" + window["secondElement"].toString();
                        this.unlockObject();
                        this.hideText(this._leafText);
                    }
                    else {
                        this._leafTween.start();
                        this._leafText.text = (window["secondElement"].toString() - this._myCounter[3]).toString() + "/" + window["secondElement"].toString();
                    }
                }
                if (this._delta[4] > 0) {
                    this._delta[4]--;
                    this._myCounter[4]--;
                    if (this._myCounter[4] <= 0) {
                        this._grapeText.text = window["thirdElement"].toString() + "/" + window["thirdElement"].toString();
                        this.unlockObject();
                        this.hideText(this._grapeText);
                    }
                    else {
                        this._grapesTween.start();
                        this._grapeText.text = (window["thirdElement"].toString() - this._myCounter[4]).toString() + "/" + window["thirdElement"].toString();
                    }
                }
            }
        };
        return Panel;
    }(Phaser.Sprite));
    mygame.Panel = Panel;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Sequence = (function () {
        function Sequence() {
            this._array = [];
            this._bombPosition = null;
        }
        Sequence.prototype.add = function (x, y) {
            if (!this.contains(x, y)) {
                this._array.push(new Phaser.Point(x, y));
            }
        };
        Object.defineProperty(Sequence.prototype, "bombPosition", {
            get: function () {
                return this._bombPosition;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sequence.prototype, "isBomb", {
            get: function () {
                if (this._array.length > 3) {
                    var n = Math.floor(this._array.length / 2);
                    if (this._bombPosition == null) {
                        this._bombPosition = new Phaser.Point(this._array[n].x, this._array[n].y);
                    }
                    return true;
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Sequence.prototype.setBombPosition = function (x, y) {
            this._bombPosition = new Phaser.Point(x, y);
        };
        Sequence.prototype.contains = function (x, y) {
            for (var i = 0; i < this._array.length; i++) {
                var p = this._array[i];
                if (p.x == x && p.y == y) {
                    return true;
                }
            }
            return false;
        };
        Sequence.prototype.get = function (i) {
            return this._array[i];
        };
        Sequence.prototype.push = function (x, y) {
            this.add(x, y);
        };
        Sequence.prototype.merge = function (other) {
            var len = other.length;
            for (var i = 0; i < len; i++) {
                this._array.push(other.pop());
            }
        };
        Object.defineProperty(Sequence.prototype, "length", {
            get: function () {
                return this._array.length;
            },
            enumerable: true,
            configurable: true
        });
        Sequence.prototype.pop = function () {
            return this._array.pop();
        };
        return Sequence;
    }());
    mygame.Sequence = Sequence;
})(mygame || (mygame = {}));
