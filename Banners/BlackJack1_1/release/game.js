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
            this.game.load.image('picture', baseURL + "assets/logo/" + window["pictureID"] + ".png");
            this.game.load.atlas("objects", baseURL + "assets/atlas.png", baseURL + "assets/atlas.json");
            this.game.load.bitmapFont('font_all', baseURL + "assets/font_all.png", baseURL + "assets/font_all.fnt");
            this.game.load.bitmapFont('font_all_30', baseURL + "assets/font_all_30.png", baseURL + "assets/font_all_30.fnt");
            if (window["sounds"]) {
                this.game.load.audio('win', baseURL + "assets/sounds/win.mp3");
                this.game.load.audio('choose', baseURL + "assets/sounds/choose.mp3");
                this.game.load.audio('chips_bet', baseURL + "assets/sounds/chips_bet.mp3");
                this.game.load.audio('chips_move', baseURL + "assets/sounds/chips_move.mp3");
                this.game.load.audio('click', baseURL + "assets/sounds/click.mp3");
                this.game.load.audio('flop', baseURL + "assets/sounds/flop.mp3");
                this.game.load.audio('new_card', baseURL + "assets/sounds/new_card.mp3");
                this.game.load.audio('room', baseURL + "assets/sounds/poker-room.mp3");
            }
            this.ChangeSize();
        };
        Preloader.prototype.create = function () {
            mygame.Core.begin(this.game, !this.game.device.desktop);
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
    var STATES;
    (function (STATES) {
        STATES[STATES["IDLE"] = 0] = "IDLE";
        STATES[STATES["EXECUTE"] = 1] = "EXECUTE";
    })(STATES = mygame.STATES || (mygame.STATES = {}));
    var PlayState = (function (_super) {
        __extends(PlayState, _super);
        function PlayState() {
            var _this = _super.call(this, true) || this;
            _this._standEnabled = !window["tutorial"];
            _this._currentTutorialHint = 0;
            mygame.GameConfig.rnd = new mygame.MersenneTwister();
            _this._chips = [];
            _this._chipsOnTable = [];
            _this._tempElemts = [];
            _this._chipBacks = [];
            return _this;
        }
        PlayState.prototype.create = function () {
            var _this = this;
            this._openFinishScreen = false;
            this.game.time.advancedTiming = true;
            if (window["sounds"]) {
                this.game.sound.play('room', window["backSoundVal"], true);
            }
            this.game.stage.smoothed = true;
            this._background = new mygame.OSprite(mygame.Core.centerX, mygame.Core.centerY)
                .otherXY(mygame.Core.centerY, mygame.Core.centerX)
                .end();
            var bg = new mygame.BackGround(this.game, 0, 0);
            this._background.addChild(bg);
            this.game.world.addChild(this._background);
            var dy = 150;
            if (this.game.device.iPad) {
                dy = 100;
            }
            this._tableOSprite = new mygame.OSprite(mygame.Core.centerX, mygame.Core.centerY - dy)
                .myScale(1.156)
                .otherXY(mygame.Core.centerY, mygame.Core.centerX - 100)
                .end();
            this.game.world.addChild(this._tableOSprite);
            this.initButtons();
            this._tableContainer = new mygame.OSprite(mygame.Core.centerX, mygame.Core.centerY)
                .myScale(1.1)
                .otherXY(mygame.Core.centerY, mygame.Core.centerX - 35)
                .otherScale(1.07)
                .end();
            if (this.game.device.iPad) {
                this._tableContainer.myScale(1.2)
                    .otherScale(1.3)
                    .end();
            }
            this.game.world.addChild(this._tableContainer);
            var tableLeft = this.game.add.sprite(0, -170, "objects", "newTableV3.png");
            tableLeft.anchor.set(1, 0.5);
            tableLeft.scale.set(2, 2);
            this._tableOSprite.addChild(tableLeft);
            var tableRight = this.game.add.sprite(0, -170, "objects", "newTableV3.png");
            tableRight.anchor.set(1, 0.5);
            tableRight.scale.set(-2, 2);
            this._tableOSprite.addChild(tableRight);
            this.game.world.addChild(this._tableContainer);
            this._dealer = new mygame.Dealer(this.game);
            this._dealer.nextCommandCallback = function () {
            };
            this._dealer.checkWinLoseCallback = function () {
                _this.checkWinLose();
            };
            this._graphics = this.game.add.graphics(0, 0);
            this._tableContainer.addChild(this._graphics);
            this._graphics.alpha = 0;
            this._bmtTotalBid = this.game.add.bitmapText(0, 0, "font_all_30", "$ 10", 24);
            this._bmtTotalBid.anchor.set(0, 0.5);
            this._bmtTotalBid.alpha = 0;
            this._tableContainer.addChild(this._bmtTotalBid);
            this.initBots();
            this._safePicture = this.game.add.sprite(0, 0, "picture");
            this._safePicture.anchor.set(0.5);
            if (this.game.device.iPad) {
                this._safe = new mygame.OSprite(150 + 20, 530 + 50)
                    .myScale(0.75)
                    .otherXY(150, 980 + 50)
                    .end();
            }
            else {
                this._safe = new mygame.OSprite(150 + 20, 450 + 50)
                    .myScale(0.75)
                    .otherXY(150 + 40, 980 + 40)
                    .end();
            }
            this._safe.addChild(this._safePicture);
            if (window["animatePicture"]) {
                this.createSafeAnimation();
            }
            if (window["particlesPicture"]) {
                this.createEmitter();
            }
            this.game.world.addChild(this._safe);
            var freeTokensText = this.game.add.bitmapText(0, 125, "font_all", mygame.Lang.Instance.GRENN_BUTTON_TEXT[window["lang"]], 48);
            freeTokensText.anchor.set(0.5);
            this._safe.addChild(freeTokensText);
            if (this.game.device.iPad) {
                this._greenButton = new mygame.OSprite(150 + 20, 650 + 10 + 30)
                    .otherXY(150, 1180 + 50)
                    .end();
            }
            else {
                this._greenButton = new mygame.OSprite(150 + 20, 650 + 10)
                    .otherXY(150 + 40, 1180 + 40)
                    .end();
            }
            var btnGreen = this.game.make.sprite(0, 0, "objects", "119.png");
            btnGreen.anchor.set(0.5);
            this._greenButton.addChild(btnGreen);
            var installAndPlay = this.game.add.bitmapText(0, 0, "font_all", mygame.Lang.Instance.INSTALL_AND_PLAY[window["lang"]], 32);
            installAndPlay.anchor.set(0.5);
            this._greenButton.addChild(installAndPlay);
            var splash = new FxSplash(this.game, btnGreen.width - 10, btnGreen.height - 10, 10);
            this._greenButton.addChild(splash);
            splash.x += 5 - 125;
            splash.y += 3 - 38;
            splash.playLoop();
            btnGreen.inputEnabled = true;
            btnGreen.events.onInputDown.add(function () {
                btnGreen.loadTexture("objects", "114.png");
            });
            btnGreen.events.onInputUp.add(function () {
                btnGreen.loadTexture("objects", "119.png");
                window['trackClick']();
            });
            this.game.add.tween(this._greenButton.scale).to({
                x: 1.1,
                y: 1.1
            }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
            this.createLogo();
            this.initChips();
            if (window["tutorial"]) {
                this._overlayGraphics = this.game.add.graphics(0, 0);
                this._overlayGraphics.beginFill(0x00, 0.5);
                this._overlayGraphics.drawRect(-2360 / 2, -2360 / 2, 2360, 2560);
                this._overlayGraphics.endFill();
                this._tableOSprite.addChild(this._overlayGraphics);
                this._tutorial = new mygame.OSprite(250, mygame.Core.centerY - 50)
                    .otherXY(mygame.Core.centerY, 200)
                    .end();
                this._hint = this.game.add.bitmapText(0, -70, "font_all", mygame.Lang.Instance["TUTORIAL_STEP_1"][window["lang"]], 48);
                this._hint.anchor.set(0.5);
                this._hint.align = "center";
                this._hint.maxWidth = 450;
                this._tutorial.addChild(this._hint);
                this._pointer = this.game.add.sprite(40, -60, "objects", "pointer.png");
                this._pointer.anchor.set(0.2, 0);
                this._tableOSprite.addChild(this._pointer);
                this._pointerTween = this.game.add.tween(this._pointer).to({
                    y: 10
                }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
                this._timerInstall = 0;
                window['gameStarted']();
                this.game.time.events.loop(Phaser.Timer.SECOND, this.tick, this);
                this._leftButton.inputEnabled = false;
                this._rightButton.inputEnabled = false;
                this._leftButton.parent.alpha = 0;
                this._rightButton.parent.alpha = 0;
            }
            this._balance = this.game.add.sprite(10, 300 - 70 - 70);
            var balanceSprite = this.game.add.sprite(-10, 0, "objects", "bank2.png");
            this._balance.addChild(balanceSprite);
            balanceSprite.anchor.set(0.5);
            var bmtBalance = this.game.add.bitmapText(10, 0, "font_all_30", mygame.Lang.Instance.BALANCE[window["lang"]].toUpperCase(), 30);
            bmtBalance.anchor.set(1, 0.5);
            var total = this.game.add.bitmapText(10, 0, "font_all_30", this._player.balance.toString());
            total.anchor.set(0, 0.5);
            this._balance.data.text = total;
            this._balance.data.initialWidth = this._balance.width;
            this._balance.data.balanceWord = bmtBalance;
            var newWidth = Math.max(this._balance.width, bmtBalance.width + total.width + 60);
            balanceSprite.scale.set(1.3, 1);
            this._balance.addChild(bmtBalance);
            this._balance.addChild(total);
            this._tableOSprite.addChild(this._balance);
            if (window["tutorial"]) {
                this._tableOSprite.setChildIndex(this._overlayGraphics, this._tableOSprite.children.length - 1);
                this._tableOSprite.setChildIndex(this._chips[2], this._tableOSprite.children.length - 1);
                this._tableOSprite.setChildIndex(this._pointer, this._tableOSprite.children.length - 1);
            }
            this._chipstFallEmitter = this.game.add.emitter(0, 0, 200);
            this._chipstFallEmitter.makeParticles("objects", ["red@2x.png", "orange@2x.png", "green@2x.png", "blue@2x.png"]);
            this._chipstFallEmitter.gravity = 900 * 2 + 50;
            this._chipstFallEmitter.minParticleSpeed.setTo(-500, -2000);
            this._chipstFallEmitter.maxParticleSpeed.setTo(500, -2100);
            this._chipstFallEmitter.setAlpha(1, 0, 1350, Phaser.Easing.Sinusoidal.InOut);
            this._tableContainer.addChild(this._chipstFallEmitter);
            this._fireworksOverlay = this.game.add.graphics(0, 0);
            this._fireworksOverlay.visible = false;
            this._fireworksOverlay.beginFill(0x00, 0.5)
                .drawRect(-2600 / 2, -2600 / 2, 2600, 2600)
                .endFill();
            this._tableContainer.addChild(this._fireworksOverlay);
            this._chipstFallEmitter.emitX = 0,
                this._chipstFallEmitter.emitY = mygame.Core.centerY + 1100;
            this._winMessage = this.game.add.bitmapText(0, 0, "font_all", "", 90);
            this._winMessage.anchor.set(0.5);
            this._winMessage.tint = 0xD4AF37;
            this._winMessage.visible = false;
            this._tableContainer.addChild(this._winMessage);
            this.drawChips();
            if (!window["tutorial"]) {
                this.addClock();
            }
        };
        PlayState.prototype.createSafeAnimation = function () {
            var _this = this;
            this.game.add.tween(this._safePicture.scale).to({
                x: 1.1,
                y: 1.1
            }, 3000, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                _this.game.add.tween(_this._safePicture.scale).to({
                    x: 1,
                    y: 1
                }, 2000, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                    _this.createSafeAnimation();
                }, _this);
            }, this);
            this.game.add.tween(this._safePicture).to({
                angle: -3
            }, 1000, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                _this.game.add.tween(_this._safePicture).to({
                    angle: 3
                }, 1000, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                    _this.game.add.tween(_this._safePicture).to({
                        angle: 0
                    }, 1000, Phaser.Easing.Sinusoidal.InOut, true);
                });
            });
        };
        PlayState.prototype.createEmitter = function () {
            this._safeEmitter = this.game.add.emitter(0, 0, 70);
            this._safeEmitter.makeParticles("objects", ["particle.png"]);
            this._safeEmitter.setAlpha(1, 0, 1000);
            this._safeEmitter.setScale(0.6, 0.1, 0.6, 0.1, 1000);
            this._safeEmitter.setXSpeed(-50, 50);
            this._safeEmitter.setYSpeed(-50, 50);
            this._safeEmitter.gravity = 0;
            this._safeEmitter.start(false, 1000, 2);
            this._safeEmitter.width = this._safePicture.width;
            this._safeEmitter.height = this._safePicture.height;
            this._safe.addChild(this._safeEmitter);
        };
        PlayState.prototype.addClock = function () {
            var _this = this;
            this._clockOSprite = new mygame.OSprite(mygame.Core.centerX + 460 + 40 + 16, 600 - 50 + 36)
                .otherXY(mygame.Core.centerY + 200, mygame.Core.centerX + 350)
                .end();
            if (this.game.device.iPad) {
                this._clockOSprite.myBottomOffset(110)
                    .end();
            }
            this.game.world.addChild(this._clockOSprite);
            this._clock = new mygame.Clock(this.game, 0, 0, window["indicatorValue"]);
            this._clock.endGameCallback = function () {
                _this.openFinishScreen();
                if (window["sounds"]) {
                    _this.game.sound.play('win', 1);
                }
            };
            this._clockOSprite.addChild(this._clock);
            this._clockOSprite.alpha = window["showIndicator"] ? 1 : 0;
        };
        PlayState.prototype.drawChips = function () {
            this._chipBacks.forEach(function (x) { return x.destroy(); });
            this._chipBacks.length = 0;
            var b = this._player.balance;
            var chipsAmount = this.findChips(b);
            var total = chipsAmount.reduce(function (sum, val) {
                return sum + val;
            });
            var r = 260;
            var k = 29;
            var rho = 18;
            for (var j = 0; j < chipsAmount.length; j++) {
                for (var i = k; i > k - chipsAmount[j]; i--) {
                    var phi = 5 * i / 4.5 / 180 * Math.PI + Math.PI / 2;
                    var x = 480 * Math.cos(phi);
                    var y = 260 * Math.sin(phi);
                    var chipBack = this.game.add.sprite(x, y, "objects", "t_000" + (j + 1) + ".png");
                    chipBack.scale.set(0.6);
                    chipBack.anchor.set(0.5);
                    chipBack.angle = rho;
                    rho -= 0.65;
                    this._chipBacks.push(chipBack);
                    this._tableOSprite.addChild(chipBack);
                }
                k -= chipsAmount[j];
                if (k < -29) {
                    break;
                }
            }
        };
        PlayState.prototype.findChips = function (balance) {
            var prices = window["chipPrices"].slice(0);
            var ret = [];
            for (var i = 0; i < prices.length; i++) {
                ret[i] = Math.floor(balance / prices[i]);
                balance -= ret[i] * prices[i];
            }
            return ret;
        };
        PlayState.prototype.tick = function () {
            this._timerInstall++;
            window['playTime'] = this._timerInstall;
        };
        PlayState.prototype.createLogo = function () {
            if (this.game.device.iPad) {
                this._UILogo = new mygame.OSprite(162 + 60, 31);
                this._UILogo.otherXY(mygame.Core.centerY, 31).end();
            }
            else {
                this._UILogo = new mygame.OSprite(162 + 60, 31);
                this._UILogo.otherXY(mygame.Core.centerY, 31).end();
            }
            var logoMain = this.game.add.sprite(0, 0, "objects", "logo_main.png");
            logoMain.anchor.set(0.5, 0);
            this._UILogo.addChild(logoMain);
            var fx = new FxSplash(this.game, logoMain.width + 10, logoMain.height, 0);
            logoMain.addChild(fx);
            fx.x -= logoMain.width / 2 - 2;
            fx.playLoop(1000, 2000);
            if (window["tutorial"]) {
                this._UILogo.alpha = 0.5;
                this._UILogo.otherVisible(false).end();
            }
        };
        PlayState.prototype.onLandscape = function () {
            if (this._hint && this.game.device.iPad) {
                this._hint.maxWidth = 450;
            }
            if (this._chipstFallEmitter) {
                this._chipstFallEmitter.emitY = mygame.Core.centerY + 500;
            }
        };
        PlayState.prototype.onPortret = function () {
            if (this._hint && this.game.device.iPad) {
                switch (this._hint.text) {
                    case mygame.Lang.Instance.TUTORIAL_STEP_3[window["lang"]]:
                    case mygame.Lang.Instance.TUTORIAL_STEP_4[window["lang"]]:
                        this._hint.maxWidth = 850;
                        break;
                    default:
                        this._hint.maxWidth = 450;
                        break;
                }
            }
            if (this._chipstFallEmitter) {
                this._chipstFallEmitter.emitY = mygame.Core.centerX + 200;
            }
        };
        PlayState.prototype.hideTutorial = function () {
            this._overlayGraphics.visible = false;
            this._hint.visible = false;
            if (this._pointerTween) {
                this._pointerTween.stop();
            }
            this._pointer.visible = false;
        };
        PlayState.prototype.initChips = function () {
            var _this = this;
            this._totalBid = new mygame.CardCounter(this.game, 0, 80 - 90);
            this._totalBid.setRectangleSize(65, 40, 7, 0.6);
            this._totalBid.setFontSize(30);
            this._totalBid.visible = false;
            this._tableOSprite.addChild(this._totalBid);
            var chipNames = ["red@2x.png", "orange@2x.png", "green@2x.png", "blue@2x.png",];
            chipNames.forEach(function (x, i) {
                var chip = _this.game.add.sprite(-150 + 15 + 90 * i, 190 - 110, "objects", x);
                chip.width = 85;
                chip.height = 85;
                _this._chips.push(chip);
                chip.data = {
                    price: window["chipPrices"][i]
                };
                var counter = new mygame.CardCounter(_this.game, 0, -5);
                counter.setRectangleSize(65, 40, 7, 0.6);
                counter.setFontSize(30);
                counter.addNumber(window["chipPrices"][i]);
                chip.addChild(counter);
                chip.anchor.set(0.5);
                chip.inputEnabled = true;
                chip.events.onInputUp.add(function () {
                    _this.game.sound.play('chips_bet', 0.4);
                    if (_this._leftButton.alpha < 1) {
                        _this._leftButton.alpha = 1;
                        _this._rightButton.alpha = 1;
                        _this._leftButton.inputEnabled = true;
                        _this._rightButton.inputEnabled = true;
                    }
                    if (window["tutorial"] && _this._hint.text == mygame.Lang.Instance.TUTORIAL_STEP_6[window["lang"]]) {
                        window["tutorial"] = false;
                        _this._hint.visible = false;
                        if (window["endGameTimer"] > 0) {
                            _this.game.time.events.add(window["endGameTimer"], function () {
                                _this.openFinishScreen();
                                if (window["sounds"]) {
                                    _this.game.sound.play('win', 1);
                                }
                            }, _this);
                        }
                        _this.addClock();
                        if (!window["showIndicator"]) {
                            _this._clock.visible = false;
                        }
                    }
                    if (i != 2 && window["tutorial"]) {
                        return;
                    }
                    if (!_this._totalBid.visible) {
                        _this._totalBid.visible = true;
                    }
                    var newChip = _this.game.add.sprite(chip.x, chip.y, "objects", x);
                    _this._chipsOnTable.push(newChip);
                    newChip.width = 85;
                    newChip.height = 85;
                    newChip.anchor.set(0.5);
                    newChip.data.id = i;
                    _this._player.bid(window["chipPrices"][i]);
                    _this._totalBid.addNumber(window["chipPrices"][i]);
                    _this.toggleChips();
                    _this.updateBalanceText();
                    _this._tableOSprite.addChild(newChip);
                    var n = Math.min(_this._player.numberOfChips, 6);
                    _this.game.add.tween(newChip).to({
                        x: 0,
                        y: 27 - n * 10 - 90
                    }, 500, Phaser.Easing.Quadratic.Out, true);
                    if (i == 2 && window["tutorial"]) {
                        chip.inputEnabled = false;
                        _this._overlayGraphics.visible = false;
                        _this._pointer.visible = false;
                        _this._hint.visible = false;
                        _this._pointerTween.stop();
                        _this._rightButton.parent.alpha = 1;
                        _this.game.add.tween(_this._leftButton.parent).to({
                            alpha: 1
                        }, 500, Phaser.Easing.Quadratic.In, true).onComplete.addOnce(function () {
                            _this._leftButton.inputEnabled = true;
                            _this._overlayGraphics.visible = true;
                            _this._rightButton.parent.alpha = 0.5;
                            _this._hint.text = mygame.Lang.Instance.TUTORIAL_STEP_2[window["lang"]];
                            _this._hint.visible = true;
                            _this._tableOSprite.removeChild(_this._pointer);
                            _this._leftButton.addChild(_this._pointer);
                            _this._pointer.position.set(0, -90);
                            _this._pointer.visible = true;
                            _this._pointerTween = _this.game.add.tween(_this._pointer).to({
                                y: -130
                            }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
                            _this.setChildIndexTutorial();
                        }, _this);
                        _this.game.add.tween(_this._rightButton.parent).to({
                            alpha: 0.5
                        }, 500, Phaser.Easing.Quadratic.In, true);
                    }
                }, _this);
                _this._tableOSprite.addChild(chip);
            });
        };
        PlayState.prototype.setChildIndexTutorial = function () {
            this._tableOSprite.setChildIndex(this._overlayGraphics, this._tableOSprite.children.length - 1);
        };
        PlayState.prototype.updateBalanceText = function () {
            var _this = this;
            this.game.add.tween(this._balance.data.text).to({
                alpha: 0
            }, 200, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                _this._balance.data.text.text = _this._player.balance.toString();
                _this.game.add.tween(_this._balance.data.text).to({
                    alpha: 1
                }, 200, Phaser.Easing.Sinusoidal.InOut, true);
            }, this);
        };
        PlayState.prototype.initButtons = function () {
            var _this = this;
            var y = 650 + 10;
            var otherY = 1180 + 40;
            if (this.game.device.iPad) {
                y = 650 + 10 + 30;
                otherY = 1180 + 50;
            }
            this._leftButton = this.addButton(mygame.Core.centerX - 150, y, mygame.Core.centerY + 200, otherY - 100 + 20, mygame.Lang.Instance.PLAY[window["lang"]]);
            this._rightButton = this.addButton(mygame.Core.centerX + 150, y, mygame.Core.centerY + 200, otherY, mygame.Lang.Instance.RESET[window["lang"]]);
            this._leftButton.inputEnabled = true;
            this._leftButton.events.onInputDown.add(function () {
                if (_this._player.numberOfChips > 0) {
                    if (_this._leftButton.data.bitmapText.text == mygame.Lang.Instance.PLAY[window["lang"]]) {
                        if (window["tutorial"]) {
                            _this.hideTutorial();
                        }
                        _this.game.sound.play('chips_bet', 0.4);
                        _this._chipsOnTable.forEach(function (el) {
                            _this.game.add.tween(el).to({
                                x: 300 - 30,
                                y: el.y + 20
                            }, 500, Phaser.Easing.Sinusoidal.InOut, true);
                        });
                        _this.game.add.tween(_this._totalBid).to({
                            x: _this._totalBid.x + 300 - 30,
                            y: _this._totalBid.y + 20
                        }, 500, Phaser.Easing.Sinusoidal.InOut, true);
                        _this._chips.forEach(function (el) {
                            _this.game.add.tween(el).to({
                                y: 900
                            }, 500, Phaser.Easing.Sinusoidal.InOut, true);
                        });
                        _this.game.add.tween(_this._balance).to({
                            y: 900
                        }, 500, Phaser.Easing.Sinusoidal.InOut, true);
                        _this._dealer.giveCardTo(_this._player);
                        _this._leftButton.inputEnabled = false;
                        _this._rightButton.inputEnabled = false;
                        _this._leftButton.alpha = 0.5;
                        _this._rightButton.alpha = 0.5;
                        _this._dealer.addCardOnTanle(_this._tableContainer);
                        _this.game.time.events.add(300, function () {
                            _this._dealer.giveCardTo(_this._player).onComplete.addOnce(function () {
                                if (_this._player.points >= 21) {
                                    _this._dealer.revealLastCard();
                                    _this.checkWinLose();
                                }
                                else {
                                    _this._leftButton.alpha = 1;
                                    _this._rightButton.alpha = 1;
                                    _this._leftButton.inputEnabled = true;
                                    if (window["tutorial"]) {
                                        _this._rightButton.inputEnabled = false;
                                        _this._hint.text = mygame.Lang.Instance.TUTORIAL_STEP_3[window["lang"]];
                                        if (!mygame.Core.isLandscape) {
                                            if (_this.game.device.iPad) {
                                                _this._hint.maxWidth = 800;
                                                _this._hint.y -= 20;
                                            }
                                            else {
                                                _this._hint.maxWidth = 450;
                                            }
                                        }
                                        _this._overlayGraphics.visible = true;
                                        _this._hint.visible = true;
                                        _this._pointer.position.set(0, -90);
                                        _this._pointer.visible = true;
                                        _this._pointerTween = _this.game.add.tween(_this._pointer).to({
                                            y: -130
                                        }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
                                    }
                                    else {
                                        _this._rightButton.inputEnabled = true;
                                    }
                                }
                            }, _this);
                            _this._dealer.addCardOnTanle(_this._tableContainer);
                        }, _this);
                        _this._leftButton.data.bitmapText.text = mygame.Lang.Instance.HIT[window["lang"]];
                        _this._rightButton.data.bitmapText.text = mygame.Lang.Instance.STAND[window["lang"]];
                    }
                    else if (_this._leftButton.data.bitmapText.text == mygame.Lang.Instance.HIT[window["lang"]] && _this._player.points < 21) {
                        if (window["tutorial"]) {
                            _this.hideTutorial();
                            _this._leftButton.inputEnabled = false;
                            _this._rightButton.inputEnabled = true;
                            _this._hint.text = mygame.Lang.Instance.TUTORIAL_STEP_4[window["lang"]];
                            if (mygame.Core.isLandscape) {
                                _this._hint.maxWidth = 450;
                            }
                            else if (_this.game.device.iPad) {
                                _this._hint.maxWidth = 850;
                            }
                            _this._leftButton.removeChild(_this._pointer);
                            _this.game.add.tween(_this._leftButton.parent).to({
                                alpha: 0.5
                            }, 500, Phaser.Easing.Sinusoidal.InOut, true);
                            _this._rightButton.parent.alpha = 1;
                            _this._rightButton.addChild(_this._pointer);
                            _this._overlayGraphics.visible = true;
                            _this._hint.visible = true;
                            _this._pointer.visible = true;
                            _this._pointer.position.set(0, -90);
                            _this._pointerTween = _this.game.add.tween(_this._pointer).to({
                                y: -130
                            }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
                        }
                        _this._leftButton.inputEnabled = false;
                        _this._rightButton.inputEnabled = false;
                        _this._dealer.giveCardTo(_this._player).onComplete.addOnce(function () {
                            if (_this._player.points >= 21) {
                                _this._leftButton.alpha = 0.5;
                                _this._rightButton.alpha = 0.5;
                                _this._dealer.revealLastCard();
                                _this.checkWinLose();
                            }
                            else {
                                if (window["tutorial"]) {
                                    _this._leftButton.inputEnabled = false;
                                }
                                else {
                                    _this._leftButton.inputEnabled = true;
                                }
                                _this._rightButton.inputEnabled = true;
                            }
                        });
                    }
                }
            }, this);
            this._rightButton.inputEnabled = true;
            this._rightButton.events.onInputDown.add(function () {
                if (_this._rightButton.data.bitmapText.text == mygame.Lang.Instance.RESET[window["lang"]]) {
                    if (_this._chipsOnTable.length > 0) {
                        var len_1 = _this._chipsOnTable.length;
                        var _loop_1 = function (i) {
                            var tween = void 0;
                            var el = _this._chipsOnTable[i];
                            var x = _this._chips[el.data.id].x;
                            var y_1 = _this._chips[el.data.id].y;
                            tween = _this.game.add.tween(el).to({
                                x: x,
                                y: y_1
                            }, 400, Phaser.Easing.Quadratic.In, true, 100 * (_this._chipsOnTable.length - i - 1));
                            tween.onStart.addOnce(function () {
                                _this.game.sound.play('chips_bet', 0.4);
                            }, _this);
                            tween.onComplete.addOnce(function () {
                                el.destroy();
                            }, _this);
                        };
                        for (var i = 0; i < _this._chipsOnTable.length; i++) {
                            _loop_1(i);
                        }
                        _this.game.time.events.add(400 + 100 * (_this._chipsOnTable.length - 1), function () {
                            _this._chipsOnTable.splice(0, len_1);
                            _this.toggleChips();
                        }, _this);
                        _this.game.add.tween(_this._leftButton).to({
                            alpha: 0.5
                        }, 0.5, Phaser.Easing.Sinusoidal.InOut, true);
                        _this.game.add.tween(_this._rightButton).to({
                            alpha: 0.5
                        }, 0.5, Phaser.Easing.Sinusoidal.InOut, true);
                        _this.game.add.tween(_this._totalBid).to({
                            alpha: 0
                        }, 400, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                            _this._totalBid.visible = false;
                            _this._player.balance += _this._totalBid.amount;
                            _this._player.resetBid();
                            _this._totalBid.alpha = 1;
                            _this._totalBid.myreset();
                            _this._player.numberOfChips = 0;
                            _this.updateBalanceText();
                        }, _this);
                    }
                }
                else if (_this._rightButton.data.bitmapText.text == mygame.Lang.Instance.STAND[window["lang"]]) {
                    if (window["tutorial"]) {
                        _this.hideTutorial();
                        _this._leftButton.parent.alpha = 1;
                    }
                    _this._dealer.revealLastCard();
                    _this._rightButton.inputEnabled = false;
                    _this._leftButton.inputEnabled = false;
                    _this._leftButton.alpha = 0.5;
                    _this._rightButton.alpha = 0.5;
                    if (_this._dealer.points < 17) {
                        _this.game.time.events.add(500, function () {
                            _this._dealer.toMaxCards(_this._tableContainer);
                        }, _this);
                    }
                    else {
                        _this.checkWinLose();
                    }
                }
            }, this);
        };
        PlayState.prototype.myreset = function () {
            this._dealer.myreset();
            this._player.myreset();
            this._chipsOnTable.length = 0;
            if (window["tutorial"]) {
                this._chips.forEach(function (x) { return x.inputEnabled = true; });
            }
            this._tempElemts.length = 0;
            if (!window["tutorial"]) {
                this._clock.incRound();
            }
        };
        PlayState.prototype.checkWinLose = function () {
            var _this = this;
            if ((this._dealer.points <= this._player.points && this._player.points <= 21) || this._dealer.points > 21) {
                this._player.makeCounterGreen();
            }
            else {
                this._dealer.makeCounterGreen();
            }
            var wait = 1000;
            if (window["tutorial"]) {
                this._overlayGraphics.visible = true;
                this._hint.text = mygame.Lang.Instance.TUTORIAL_STEP_5[window["lang"]];
                this._hint.visible = true;
                wait = 2000;
            }
            this.game.time.events.add(wait, function () {
                _this.checkWinLose2();
                if (window["tutorial"]) {
                    _this._overlayGraphics.visible = false;
                    _this._UILogo.otherVisible(true).end();
                    _this._UILogo.alpha = 1;
                    _this._hint.visible = false;
                }
            }, this);
        };
        PlayState.prototype.checkWinLose2 = function () {
            var _this = this;
            this._leftButton.inputEnabled = false;
            this._rightButton.inputEnabled = false;
            if ((this._dealer.points <= this._player.points && this._player.points <= 21) || this._dealer.points > 21) {
                this._dealer.removeCards();
                var playerPoints_1 = this._player.points;
                this._player.balance += this._player.currentBid * 2;
                this._player.removeCards().onComplete.addOnce(function () {
                    var tween;
                    _this.game.add.tween(_this._totalBid).to({
                        alpha: 0
                    }, 400, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                        _this._totalBid.visible = false;
                        _this._totalBid.alpha = 1;
                        _this._totalBid.myreset();
                    }, _this);
                    _this._chipsOnTable.forEach(function (el, i) {
                        var y = _this._chips[el.data.id].y;
                        tween = _this.game.add.tween(el).to({
                            x: 0,
                            y: y
                        }, 400, Phaser.Easing.Quadratic.In, true, 100 * (_this._chipsOnTable.length - i - 1));
                        tween.onStart.addOnce(function () {
                            _this.game.sound.play('chips_bet', 0.4);
                        }, _this);
                        tween.onComplete.addOnce(function () {
                            el.destroy();
                        }, _this);
                        var newChip = _this.game.add.sprite(mygame.Core.width / 2, -50, "objects", el.frameName);
                        _this.game.world.addChild(newChip);
                        newChip.anchor.set(0.5);
                        _this._tempElemts.push(newChip);
                        tween = _this.game.add.tween(newChip).to({
                            y: mygame.Core.height + 100
                        }, 400, Phaser.Easing.Quadratic.In, true, 100 * (_this._chipsOnTable.length - i - 1));
                        tween.onComplete.addOnce(function () {
                            newChip.destroy();
                        });
                    });
                    tween.onComplete.addOnce(function () {
                        if (mygame.Core.isLandscape) {
                            _this._chipstFallEmitter.emitY = mygame.Core.centerY + 500;
                        }
                        else {
                            _this._chipstFallEmitter.emitY = mygame.Core.centerX + 200;
                        }
                        _this.game.world.setChildIndex(_this._tableContainer, _this.game.world.children.length - 1);
                        _this._tableContainer.setChildIndex(_this._fireworksOverlay, _this._tableContainer.children.length - 1);
                        _this._tableContainer.setChildIndex(_this._chipstFallEmitter, _this._tableContainer.children.length - 1);
                        _this._tableContainer.setChildIndex(_this._winMessage, _this._tableContainer.children.length - 1);
                        _this._fireworksOverlay.visible = true;
                        for (var i = 0; i < 5; i++) {
                            _this.game.time.events.add(300 * i, function () {
                                _this.game.sound.play('chips_move', 0.4);
                            }, _this);
                        }
                        _this._chipstFallEmitter.start(false, 1500, 50, 30);
                        _this._winMessage.visible = true;
                        _this._winMessageTween = _this.game.add.tween(_this._winMessage.scale).to({
                            x: 1.3,
                            y: 1.3
                        }, 500, Phaser.Easing.Back.Out, true, 0, -1, true);
                        if (playerPoints_1 == 21) {
                            _this._winMessage.text = mygame.Lang.Instance.BLACKJACK[window["lang"]] + "\n" + "+$" + (_this._player.currentBid * 2).toString();
                            _this._winMessage.align = "center";
                        }
                        else {
                            _this._winMessage.text = "+$" + (_this._player.currentBid * 2).toString();
                        }
                        _this.game.time.events.add(2000, function () {
                            _this._fireworksOverlay.visible = false;
                            _this._winMessage.visible = false;
                            _this._winMessageTween.stop();
                            _this._winMessage.scale.set(1, 1);
                            _this.yetAnotherReset();
                        }, _this);
                    });
                }, this);
            }
            else {
                this._dealer.removeCards();
                this._player.removeCards().onComplete.addOnce(function () {
                    var tween;
                    _this.game.add.tween(_this._totalBid).to({
                        alpha: 0
                    }, 400, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                        _this._totalBid.visible = false;
                        _this._totalBid.alpha = 1;
                        _this._totalBid.myreset();
                    }, _this);
                    _this._chipsOnTable.forEach(function (el, i) {
                        tween = _this.game.add.tween(el).to({
                            x: 0,
                            y: -800
                        }, 400, Phaser.Easing.Quadratic.In, true, 100 * (_this._chipsOnTable.length - i - 1));
                        tween.onStart.addOnce(function () {
                            _this.game.sound.play('chips_bet', 0.4);
                        }, _this);
                        tween.onComplete.addOnce(function () {
                            el.destroy();
                        }, _this);
                    });
                    tween.onComplete.addOnce(function () {
                        if (_this._player.balance <= 0) {
                            _this._player.resetBid();
                            _this.game.time.events.add(750, function () {
                                _this.openFinishScreen();
                            }, _this);
                        }
                        else {
                            _this.yetAnotherReset();
                        }
                    }, _this);
                }, this);
            }
        };
        PlayState.prototype.yetAnotherReset = function () {
            var _this = this;
            if (window["tutorial"]) {
                this._hint.text = mygame.Lang.Instance.TUTORIAL_STEP_6[window["lang"]];
                this._hint.visible = true;
                this._tutorial.otherXY(mygame.Core.centerY, 400 - 50).end();
            }
            this._balance.data.text.text = this._player.balance.toString();
            this.showChip();
            this._balance.scale.set(0.1);
            this.game.add.tween(this._balance.scale).to({
                x: 1,
                y: 1
            }, 500, Phaser.Easing.Back.Out, true, 150);
            this.game.add.tween(this._balance).to({
                x: 10,
                y: 250 - 20 - 70
            }, 400, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                _this._totalBid.position.set(0, 80 - 90);
                _this._totalBid.visible = false;
                _this.myreset();
            });
            this.game.add.tween(this._leftButton.data.bitmapText).to({
                alpha: 0
            }, 250, Phaser.Easing.Sinusoidal.Out, true).onComplete.addOnce(function () {
                _this._leftButton.data.bitmapText.text = mygame.Lang.Instance.PLAY[window["lang"]];
                _this.game.add.tween(_this._leftButton.data.bitmapText).to({
                    alpha: 0
                }, 250, Phaser.Easing.Sinusoidal.In, true);
                _this._leftButton.inputEnabled = true;
            }, this);
            this.resetButton(this._leftButton, mygame.Lang.Instance.PLAY[window["lang"]]);
            this.resetButton(this._rightButton, mygame.Lang.Instance.RESET[window["lang"]]);
        };
        PlayState.prototype.resetButton = function (button, text) {
            var _this = this;
            this.game.add.tween(button.data.bitmapText).to({
                alpha: 0
            }, 250, Phaser.Easing.Sinusoidal.Out, true).onComplete.addOnce(function () {
                button.data.bitmapText.text = text;
                _this.game.add.tween(button.data.bitmapText).to({
                    alpha: 1
                }, 250, Phaser.Easing.Sinusoidal.In, true);
                button.inputEnabled = true;
            }, this);
        };
        PlayState.prototype.showChip = function () {
            var _this = this;
            this._chips.forEach(function (el) {
                var scale = el.scale.x;
                el.scale.set(0.1);
                _this.game.add.tween(el.scale).to({
                    x: scale,
                    y: scale
                }, 500, Phaser.Easing.Back.InOut, true, 150).onComplete.addOnce(function () {
                }, _this);
                _this.game.add.tween(el).to({
                    y: 170 - 20 - 70
                }, 400, Phaser.Easing.Quadratic.In, true);
            });
            this.toggleChips();
        };
        PlayState.prototype.toggleChips = function () {
            var _this = this;
            this._chips.forEach(function (x) {
                if (x.data.price > _this._player.balance) {
                    x.inputEnabled = false;
                    x.alpha = 0.6;
                }
                else {
                    x.alpha = 1;
                    x.inputEnabled = true;
                }
            });
            this.drawChips();
        };
        PlayState.prototype.addButton = function (x, y, otherX, otherY, text) {
            var _this = this;
            var sprite = new mygame.OSprite(x, y)
                .otherXY(otherX, otherY)
                .end();
            var button = this.game.add.sprite(0, 0, "objects", "70.png");
            button.anchor.set(0.5);
            sprite.addChild(button);
            var btmText = this.game.add.bitmapText(0, 0, "font_all", text, 32);
            btmText.anchor.set(0.5);
            sprite.addChild(btmText);
            button.data.bitmapText = btmText;
            button.events.onInputDown.add(function () {
                if (button.alpha == 1) {
                    _this.game.sound.play('click', 1);
                    button.loadTexture("objects", "73.png");
                }
            });
            button.events.onInputUp.add(function () {
                if (button.alpha == 1) {
                    button.loadTexture("objects", "70.png");
                }
            });
            button.alpha = 0.5;
            this.game.world.addChild(sprite);
            return button;
        };
        PlayState.prototype.initBots = function () {
            var _this = this;
            this._player = new mygame.Player(this.game, 0, 0, window["playerStartBalance"]);
            if (!window["tutorial"]) {
                if (window["endGameTimer"] > 0) {
                    this.game.time.events.add(window["endGameTimer"], function () {
                        _this.openFinishScreen();
                        if (window["sounds"]) {
                            _this.game.sound.play('win', 1);
                        }
                    }, this);
                }
            }
            this._dealer.addBot(this._player);
            this._tableContainer.addChild(this._player);
        };
        PlayState.prototype.openFinishScreen = function () {
            if (this._openFinishScreen) {
                return;
            }
            this._openFinishScreen = true;
            if (this._tempElemts.length > 0) {
                this._tempElemts.forEach(function (x) { return x.alpha = 0; });
            }
            if (window["showIndicator"]) {
                this._clock.visible = false;
            }
            this._tableOSprite.alpha = 0;
            this._tableContainer.alpha = 0;
            this.game.tweens.removeAll();
            this._tableContainer.visible = false;
            this._player.visible = false;
            this._leftButton.parent.alpha = 0;
            this._rightButton.parent.alpha = 0;
            this._graphics.alpha = 0;
            this._bmtTotalBid.alpha = 0;
            this._tableContainer.alpha = 0;
            this._safe.alpha = 0;
            this._greenButton.alpha = 0;
            this._greenButton.visible = false;
            this._safe.visible = false;
            this._graphics.visible = false;
            this._bmtTotalBid.visible = false;
            var chips = [3, 3, 3, 0];
            var amount = this._player.balance + this._totalBid.amount;
            var orangeCounter = Math.floor(amount / 500);
            amount -= 500 * orangeCounter;
            var redCounter = Math.floor(amount / 100);
            amount -= 100 * redCounter;
            var greenCounter = Math.floor(amount / 50);
            amount -= 50 * greenCounter;
            var blueCounter = Math.floor(amount / 10);
            this._finishScreen = new mygame.FinishScreen(this.game, 0, 0, [blueCounter, greenCounter, redCounter, orangeCounter], this._player.balance + this._totalBid.amount);
        };
        PlayState.prototype.update = function () {
            this._chipstFallEmitter.update();
            if (!window["tutorial"]) {
                this._clock.update();
            }
            if (this._safeEmitter) {
                this._safeEmitter.update();
            }
        };
        PlayState.prototype.sendChipsToWinner = function () {
            if (window["sounds"]) {
                this.game.sound.play('chips_move', 0.45);
            }
            return 0;
        };
        PlayState.prototype.showPlayerControls = function () {
            this.showButton(this._standButton);
            this.showButton(this._hitButton);
        };
        PlayState.prototype.showButton = function (sprite) {
            this.game.add.tween(sprite.parent).to({
                alpha: 1
            }, 1000 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                sprite.inputEnabled = true;
            });
        };
        PlayState.prototype.hideButtons = function () {
            this.hideButton(this._standButton);
            this.hideButton(this._hitButton);
        };
        PlayState.prototype.hideButton = function (sprite) {
            sprite.inputEnabled = false;
            this.game.add.tween(sprite.parent).to({
                alpha: 0.5
            }, 200 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true);
        };
        PlayState.prototype.render = function () {
        };
        return PlayState;
    }(mygame.OState));
    mygame.PlayState = PlayState;
    function getSize() {
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
            this.width = 1136;
            this.height = 640;
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
        return Controller;
    }());
    Controller.LANDSCAPE = "landscape";
    Controller.PORTRAIT = "portrait";
    mygame.Controller = Controller;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    ;
    var Lang = (function () {
        function Lang() {
            this.BALANCE = { en: "Balance: ", ru: "Баланс: " };
            this.YOU_WIN = { en: 'YOU WIN', ru: 'ВЫИГРЫШ' };
            this.GOOD_TRY = { en: 'Good try!', ru: 'Хорошая попытка!' };
            this.HIT = { en: 'HIT', ru: 'ВЗЯТЬ' };
            this.BURST = { en: "Loose", ru: "Проиграл" };
            this.WINNER = { en: 'Winner', ru: "Выиграл" };
            this.STAND = { en: 'STAND', ru: 'ОСТАНОВИТЬСЯ' };
            this.INSTALL_AND_PLAY = { en: 'INSTALL & PLAY', ru: "ИГРАЙ СЕЙЧАС!" };
            this.GRENN_BUTTON_TEXT = { en: "get free tokens", ru: "бесплатные монеты" };
            this.BLACKJACK = { en: "BlackJack!", ru: "???" };
            this.STAND_TITLE = { en: "Stand", ru: "Остановился" };
            this.HIT_TITLE = { en: "Hit", ru: "Взял" };
            this.TIME_LEFT = { ru: "Осталось времени", en: "Time left" };
            this.ROUNDS_LEFT = { ru: "Осталось раундов", en: "Rounds left" };
            this.COMMENTS = [
                { en: "Watch\nand\nlearn.", ru: "Смотри\nи\nучись" },
                { en: "You done?", ru: "Готов?" },
                { en: "Gotchu!", ru: "Попался!" },
                { en: "Never had\na chance", ru: "Без\nшансов" },
                { en: "Well now", ru: "Отлично..." },
                { en: "Easy.", ru: "Легко!" },
                { en: "Hold up\nnow.", ru: "Подожди!" },
                { en: "Huh ho\nexcuse me.", ru: "Ха, нет уж\nизвини" },
                { en: "No river,\nno fish.", ru: "Нет реки\nнет рыбы" },
                { en: "Poker is\n100% skill\nand 50%\nluck.", ru: "Покер\nэто\nскилл" },
                { en: "Life is more\nfun if you\nplay games.", ru: "Играть\nвесело!" },
                { en: "Not bad!", ru: "Не плохо..." },
                { en: "Call me\nmaybe?", ru: "Может\nпозвонишь" },
                { en: "Astounding!", ru: "Невероятно" },
                { en: "Wow, cool!", ru: "Вау, круто!" },
                { en: "Unbelievable...", ru: "Вот это да!" },
            ];
            this.TUTORIAL_STEP_1 = { en: "To start the game, bet. Let's start with a small amount.", ru: "Чтобы начать игру, сделай ставку. Начнём с небольшой суммы." };
            this.TUTORIAL_STEP_2 = { en: "Great, it's time to play!", ru: "Отлично, пришло время играть!" };
            this.TUTORIAL_STEP_3 = { en: "To win, score points more than the dealer or 21. Take another card.", ru: "Чтобы выиграть, набери очков больше чем у диллера или 21. Возьми ещё карту. " };
            this.TUTORIAL_STEP_4 = { en: "Be careful, if you score more than 21 - you lose. Let's try to play with this hand.", ru: "Осторожно, если наберёшь больше 21 - проиграешь. Попробуем сыграть с этой рукой." };
            this.TUTORIAL_STEP_5 = { en: "20 more than 19 - you won!", ru: "20 больше 19 - ты победил! " };
            this.TUTORIAL_STEP_6 = { en: "Now play it yourself!", ru: "Теперь сыграй сам!" };
            this.PLAY = { en: "PLAY", ru: "ИГРАТЬ" };
            this.RESET = { en: "CANCEL", ru: "СБРОСИТЬ" };
            this.PLAYHINT = { en: 'PLAY', ru: 'ИГРАТЬ' };
            this.LIKE = { en: 'LIKE BLACKJACK?', ru: 'НРАВИТСЯ БЛЭКДЖЕК?' };
            this.GETAPP = {
                en: 'GET ON A NEW LEVEL WITH THIS APP!',
                ru: 'ДОСТИГНИТЕ НОВОГО УРОВНЯ С ЭТИМ ПРИЛОЖЕНИЕМ!'
            };
            this.GAMENAME = {
                en: 'Blackjack 21: Blackjackist',
                ru: 'Блэкджек 21: Blackjackist'
            };
            this.COPYRIGHT = { en: 'By KamaGames', ru: 'от KamaGames' };
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
    Lang.loc = 'ru';
    mygame.Lang = Lang;
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
            this.ChangeSize();
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
    var SUIT;
    (function (SUIT) {
        SUIT[SUIT["SPADES"] = 0] = "SPADES";
        SUIT[SUIT["HEARTS"] = 1] = "HEARTS";
        SUIT[SUIT["CLUBS"] = 2] = "CLUBS";
        SUIT[SUIT["DIAMONDS"] = 3] = "DIAMONDS";
    })(SUIT = mygame.SUIT || (mygame.SUIT = {}));
    var Card = (function (_super) {
        __extends(Card, _super);
        function Card(game, x, y, suit, face, hidden) {
            if (hidden === void 0) { hidden = true; }
            var _this = _super.call(this, game, x, y) || this;
            _this._suit = suit;
            _this._face = face;
            _this._cardName = face;
            switch (_this._suit) {
                case SUIT.DIAMONDS:
                    _this._cardName += "d";
                    break;
                case SUIT.CLUBS:
                    _this._cardName += "c";
                    break;
                case SUIT.HEARTS:
                    _this._cardName += "h";
                    break;
                case SUIT.SPADES:
                    _this._cardName += "s";
                    break;
                default:
                    break;
            }
            if (hidden) {
                _this._sprite = _this.game.add.sprite(0, 0, "objects", "back.png");
            }
            else {
                _this._sprite = _this.game.add.sprite(0, 0, "objects", _this._cardName.toLowerCase() + ".png");
            }
            _this._sprite.scale.set(1.2);
            _this._sprite.anchor.set(0.5);
            _this.addChild(_this._sprite);
            return _this;
        }
        Card.prototype.showCard = function () {
            this._sprite.loadTexture("objects", this._cardName.toLowerCase() + ".png");
        };
        Card.prototype.reveal = function (delay) {
            var _this = this;
            var firstTween = this.game.add.tween(this.scale).to({
                x: 0
            }, 200, Phaser.Easing.Sinusoidal.InOut, true, delay);
            if (window["sounds"]) {
                firstTween.onStart.addOnce(function () { _this.game.sound.play('choose', 0.4); }, this);
            }
            var lastTween = this.game.add.tween(this.scale).to({
                x: 1
            }, 200, Phaser.Easing.Sinusoidal.InOut, false);
            firstTween.onComplete.addOnce(function () {
                _this._sprite.loadTexture("objects", _this._cardName.toLowerCase() + ".png");
                lastTween.start();
            });
            return lastTween;
        };
        Object.defineProperty(Card.prototype, "onClick", {
            set: function (val) {
                this._onClick = val;
            },
            enumerable: true,
            configurable: true
        });
        Card.prototype.discard = function (delay) {
            return this.game.add.tween(this.scale).to({
                x: 0
            }, 500, Phaser.Easing.Sinusoidal.InOut, true, delay);
        };
        Object.defineProperty(Card.prototype, "myScale", {
            set: function (val) {
                this._sprite.scale.set(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Card.prototype, "onCompleteCallback", {
            set: function (val) {
                this._cb = val;
            },
            enumerable: true,
            configurable: true
        });
        Card.prototype.flyToHand = function (posx) {
            var _this = this;
            if (window["sounds"]) {
                this.game.sound.play('new_card', 0.35);
            }
            this.game.add.tween(this._sprite.scale).to({
                x: 1,
                y: 1
            }, 300, Phaser.Easing.Sinusoidal.InOut, true);
            var tween = this.game.add.tween(this).to({
                y: 380 + 31,
                x: posx
            }, 300, Phaser.Easing.Sinusoidal.InOut, true);
            tween.onComplete.add(function () {
                _this._cb();
            }, this);
        };
        Object.defineProperty(Card.prototype, "face", {
            get: function () {
                return this._face;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Card.prototype, "suit", {
            get: function () {
                return this._suit;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Card.prototype, "cardName", {
            get: function () {
                return this._cardName;
            },
            enumerable: true,
            configurable: true
        });
        Card.prototype.playDestroy = function (callback, delay) {
            var _this = this;
            this.game.add.tween(this._sprite.scale).to({
                x: 0
            }, 200, Phaser.Easing.Sinusoidal.InOut, true, delay).onComplete.add(function () {
                callback();
                _this.destroy();
            }, this);
        };
        return Card;
    }(Phaser.Sprite));
    Card.FACES = "A23456789TJQK";
    mygame.Card = Card;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Clock = (function (_super) {
        __extends(Clock, _super);
        function Clock(game, x, y, rounds) {
            if (rounds === void 0) { rounds = 0; }
            var _this = _super.call(this, game, x, y) || this;
            _this._sprite = _this.game.add.sprite(0, 0);
            _this.addChild(_this._sprite);
            var clock1 = _this.game.add.sprite(0, 0, "objects", "ClockBig.png");
            clock1.anchor.set(1, 1);
            var clock2 = _this.game.add.sprite(-1, 0, "objects", "ClockBig.png");
            clock2.anchor.set(1, 1);
            clock2.scale.set(-1, 1);
            var clock3 = _this.game.add.sprite(0, -1, "objects", "ClockBig.png");
            clock3.anchor.set(1, 1);
            clock3.scale.set(1, -1);
            var clock4 = _this.game.add.sprite(-1, -1, "objects", "ClockBig.png");
            clock4.anchor.set(1, 1);
            clock4.scale.set(-1, -1);
            _this._sprite.addChild(clock1);
            _this._sprite.addChild(clock2);
            _this._sprite.addChild(clock3);
            _this._sprite.addChild(clock4);
            _this._borderTimer = 0;
            _this._graphics = _this.game.add.graphics(0, 0);
            _this.addChild(_this._graphics);
            _this._run = rounds > 0;
            _this._radius = 85;
            _this._seconds = window["showSecondsOnIndicator"];
            _this._totalRounds = rounds;
            _this._roundCounter = 0;
            var message;
            var indicatorStartText;
            if (_this._seconds) {
                message = mygame.Lang.Instance.TIME_LEFT[window["lang"]];
                _this._total = rounds;
                indicatorStartText = Math.ceil(_this._total / 1000).toString();
            }
            else {
                message = mygame.Lang.Instance.ROUNDS_LEFT[window["lang"]];
                indicatorStartText = _this._totalRounds.toString();
                _this._total = 1000;
            }
            _this._bmText = _this.game.add.bitmapText(0, 0, "font_all", indicatorStartText, 70);
            _this._bmText.anchor.set(0.5);
            _this._bmText.align = "center";
            _this.addChild(_this._bmText);
            _this._clockColor = 0xF4990A;
            _this._description = _this.game.add.bitmapText(0, -clock1.height - 20, "font_all", message.toUpperCase(), 32);
            _this._description.anchor.set(0.5);
            _this.addChild(_this._description);
            _this._phi0 = -90 / 180 * Math.PI;
            return _this;
        }
        Object.defineProperty(Clock.prototype, "endGameCallback", {
            set: function (val) {
                this._endGameCallback = val;
            },
            enumerable: true,
            configurable: true
        });
        Clock.prototype.incRound = function () {
            var _this = this;
            if (!this._seconds && this._totalRounds > 0) {
                this._roundCounter += 1;
                var obj_1 = { x: this._borderTimer };
                var tween = this.game.add.tween(obj_1).to({
                    x: this._total / this._totalRounds * this._roundCounter + 35
                }, 400, Phaser.Easing.Linear.None, true);
                tween.onUpdateCallback(function () {
                    _this._borderTimer = obj_1["x"];
                }, this);
                this._bmText.text = (this._totalRounds - this._roundCounter).toString();
            }
        };
        Clock.prototype.update = function () {
            var _this = this;
            if (this._run) {
                var dt = this.game.time.elapsedMS;
                if (dt > 100) {
                    dt = 1000 / 60;
                }
                if (this._seconds) {
                    this._bmText.text = Math.ceil((this._total - this._borderTimer) / 1000).toString();
                    this._borderTimer += dt;
                }
                var angle = 360 * (this._borderTimer / this._total) * Math.PI / 180;
                if (Math.abs(this._borderTimer - this._total) <= dt) {
                    this._borderTimer = this._total + dt / 2;
                    this._run = false;
                    if (this._seconds) {
                        this._bmText.text = "0";
                    }
                    else {
                        this._bmText.text = "";
                    }
                    this._graphics.clear()
                        .beginFill(this._clockColor)
                        .drawCircle(0, 0, this._radius * 2)
                        .endFill();
                    this.game.time.events.add(500, function () {
                        _this._endGameCallback();
                    }, this);
                }
                else {
                    this._graphics.clear()
                        .beginFill(this._clockColor)
                        .arc(0, 0, this._radius, this._phi0 + angle, this._phi0, true)
                        .endFill();
                }
            }
        };
        return Clock;
    }(Phaser.Sprite));
    mygame.Clock = Clock;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var FinishScreen = (function (_super) {
        __extends(FinishScreen, _super);
        function FinishScreen(game, x, y, chips, balance) {
            var _this = _super.call(this, game, x, y) || this;
            _this._chips = chips;
            _this._balance = balance;
            _this._ipad = false;
            if (mygame.Core.isLandscape) {
                if (mygame.Core.height / mygame.Core.width > 0.63) {
                    _this._ipad = true;
                }
            }
            else {
                if (mygame.Core.width / mygame.Core.height > 0.73) {
                    _this._ipad = true;
                }
            }
            _this._shadowOsprite = new mygame.OSprite(0, 0).enabledBgMode().end();
            _this._shadowOsprite.otherXY(0, 0).end();
            _this._shadow = _this.game.add.sprite(0, 0, "objects", "shadow.png");
            _this._shadow.width = mygame.Core.defaultWidth;
            _this._shadow.height = mygame.Core.defaultHeight;
            _this._shadow.alpha = 0;
            _this._shadowOsprite.addChild(_this._shadow);
            _this._shadow.inputEnabled = true;
            _this._shadow.events.onInputDown.add(function () { });
            _this.createUIBottom();
            _this.createUITitle();
            _this.createUIPlay();
            _this.createLogo();
            _this.game.add.tween(_this._shadow).to({ alpha: 1 }, 500, Phaser.Easing.Sinusoidal.Out, true);
            return _this;
        }
        FinishScreen.prototype.createChips = function () {
            var _this = this;
            var timeoutNumber = 0;
            if (this._chips[2] > 0) {
                this.cerateCurrentChips("red@2x", this._chips[2]);
                setTimeout(function () {
                    if (window["sounds"]) {
                        _this.game.sound.play('chips_move', 0.45);
                    }
                }, 750 + 300 * timeoutNumber);
                timeoutNumber += 1;
            }
            if (this._chips[0] > 0) {
                this.cerateCurrentChips("blue@2x", this._chips[0]);
                setTimeout(function () {
                    if (window["sounds"]) {
                        _this.game.sound.play('chips_move', 0.45);
                    }
                }, 750 + 300 * timeoutNumber);
                timeoutNumber += 1;
            }
            if (this._chips[1] > 0) {
                this.cerateCurrentChips("green@2x", this._chips[1]);
                setTimeout(function () {
                    if (window["sounds"]) {
                        _this.game.sound.play('chips_move', 0.45);
                    }
                }, 750 + 300 * timeoutNumber);
                timeoutNumber += 1;
            }
            if (this._chips[3] > 0) {
                this.cerateCurrentChips("orange@2x", this._chips[3]);
                setTimeout(function () {
                    if (window["sounds"]) {
                        _this.game.sound.play('chips_move', 0.45);
                    }
                }, 750 + 300 * timeoutNumber);
                timeoutNumber += 1;
            }
        };
        FinishScreen.prototype.cerateCurrentChips = function (type, numberChips) {
            for (var i = 0; i < numberChips * 2; i++) {
                var xPos = 0;
                var yPos = 0;
                var deleyStart = 0;
                switch (type) {
                    case "blue@2x":
                        xPos = 24;
                        yPos = -188;
                        deleyStart = 500;
                        break;
                    case "green@2x":
                        xPos = -66;
                        yPos = -180;
                        deleyStart = 0;
                        break;
                    case "red@2x":
                        xPos = -30;
                        yPos = -226;
                        deleyStart = 400;
                        break;
                    case "orange@2x":
                        xPos = -20;
                        yPos = -150;
                        deleyStart = 200;
                        break;
                }
                var chip = this.game.add.sprite(xPos, yPos - 800, "objects", type + ".png");
                chip.scale.set(1);
                this.game.add.tween(chip).to({ y: yPos - 7 * i }, 500, Phaser.Easing.Sinusoidal.Out, true, 700 + deleyStart + (130 + deleyStart / 10) * i);
                this._UITitleSprite.addChild(chip);
            }
        };
        FinishScreen.prototype.createLogo = function () {
            if (this._ipad) {
                this._UILogo = new mygame.OSprite(162 + 60, 31);
                this._UILogo.otherXY(mygame.Core.centerY, 31).end();
            }
            else {
                this._UILogo = new mygame.OSprite(162 + 60, 31);
                this._UILogo.otherXY(mygame.Core.centerY, 31).end();
            }
            var logoMain = this.game.add.sprite(0, 0, "objects", "logo_main.png");
            logoMain.anchor.set(0.5, 0);
            this._UILogo.addChild(logoMain);
            var fx = new FxSplash(this.game, logoMain.width + 10, logoMain.height, 0);
            logoMain.addChild(fx);
            fx.x -= logoMain.width / 2 - 2;
            fx.playLoop(1000, 2000);
        };
        FinishScreen.prototype.createUIPlay = function () {
            var _this = this;
            if (this._ipad) {
                this._UIButtonPlay = new mygame.OSprite(mygame.Core.centerX, 460);
                this._UIButtonPlay.otherXY(mygame.Core.centerY, 895).end();
            }
            else {
                this._UIButtonPlay = new mygame.OSprite(mygame.Core.centerX, 535);
                this._UIButtonPlay.otherXY(mygame.Core.centerY, 880).end();
            }
            this._UIButtonPlaySprite = this.game.add.sprite(0, 0);
            this._UIButtonPlay.addChild(this._UIButtonPlaySprite);
            var viewRight = this.game.add.sprite(0, 0, 'objects', 'play.png');
            this._UIButtonPlaySprite.addChild(viewRight);
            viewRight.scale.set(1);
            viewRight.anchor.set(0.5, 0.5);
            var splash = new FxSplash(this.game, viewRight.width - 10, viewRight.height - 10, 10);
            this._UIButtonPlaySprite.addChild(splash);
            splash.x += 5 - 220;
            splash.y += 3 - 53;
            splash.playLoop();
            var title = this.game.add.bitmapText(0, 0, 'font_all', mygame.Lang.Instance.PLAYHINT[window["lang"]], 72);
            this._UIButtonPlaySprite.addChild(title);
            title.x = (viewRight.width - title.width) / 2 - 220;
            title.y = (viewRight.height - title.height) / 2 - 15 - 53;
            var yPos = this._UIButtonPlaySprite.y;
            this._UIButtonPlaySprite.y += 450;
            this._UIButtonPlaySprite.inputEnabled = false;
            this._UIButtonPlaySprite.events.onInputDown.add(function () {
                window['trackClick']();
            });
            this.game.add.tween(this._UIButtonPlaySprite).to({ y: yPos }, 500, Phaser.Easing.Sinusoidal.Out, true, 1200).onComplete.addOnce(function () {
                _this.game.add.tween(_this._UIButtonPlaySprite.scale).to({
                    x: 1.1,
                    y: 1.1
                }, 250, Phaser.Easing.Sinusoidal.Out, true).loop(true).yoyo(true, 250);
                _this._UIButtonPlaySprite.inputEnabled = true;
            }, this);
        };
        FinishScreen.prototype.createUIText = function () {
            if (this._ipad) {
                this._UIText = new mygame.OSprite(mygame.Core.centerX, mygame.Core.centerY - 75);
                this._UIText.otherXY(mygame.Core.centerY, mygame.Core.centerX - 48).end();
            }
            else {
                this._UIText = new mygame.OSprite(mygame.Core.centerX, mygame.Core.centerY - 48);
                this._UIText.otherXY(mygame.Core.centerY, mygame.Core.centerX - 48).end();
            }
            this._UITextLikeSprite = this.game.add.sprite(0, 0);
            this._UIText.addChild(this._UITextLikeSprite);
            this._UITextGetSprite = this.game.add.sprite(0, 0);
            this._UIText.addChild(this._UITextGetSprite);
            var copy = this.game.add.bitmapText(0, 75, 'font_all', mygame.Lang.Instance.LIKE[window["lang"]], 71);
            copy.anchor.set(0.5);
            this._UITextLikeSprite.addChild(copy);
            var copy2 = this.game.add.bitmapText(0, 125, 'font_all', mygame.Lang.Instance.GETAPP[window["lang"]], 50);
            copy2.anchor.set(0.5);
            this._UITextGetSprite.addChild(copy2);
            if (window["lang"] == "ru") {
                copy2.fontSize = 33;
            }
            var copy1Pos = this._UITextLikeSprite.x;
            var copy2Pos = this._UITextGetSprite.x;
            this._UITextLikeSprite.x -= 1000;
            this._UITextGetSprite.x += 1400;
            this.game.add.tween(this._UITextLikeSprite).to({ x: copy1Pos }, 500, Phaser.Easing.Sinusoidal.Out, true, 700);
            this.game.add.tween(this._UITextGetSprite).to({ x: copy2Pos }, 500, Phaser.Easing.Sinusoidal.Out, true, 800);
        };
        FinishScreen.prototype.createUITitle = function () {
            if (this._ipad) {
                this._UITitle = new mygame.OSprite(mygame.Core.centerX, mygame.Core.centerY - 75);
                this._UITitle.otherXY(mygame.Core.centerY, mygame.Core.centerX - 48).end();
            }
            else {
                this._UITitle = new mygame.OSprite(mygame.Core.centerX, mygame.Core.centerY - 48);
                this._UITitle.otherXY(mygame.Core.centerY, mygame.Core.centerX - 48).end();
            }
            this._UITitleSprite = this.game.add.sprite(0, 0);
            this._UITitle.addChild(this._UITitleSprite);
            this.createChips();
            var strip = this.game.add.sprite(0, 0);
            var left = this.game.add.image(0, 0, "objects", "lenta.png");
            left.anchor.set(1, 0.5);
            strip.addChild(left);
            var right = this.game.add.image(0, 0, "objects", "lenta.png");
            right.anchor.set(1, 0.5);
            strip.addChild(right);
            right.scale.x = -1;
            var tittleContainer = this.game.add.sprite(0, 0);
            if (this._balance <= 0) {
                var title = this.game.add.bitmapText(0, -40, 'font_all', mygame.Lang.Instance.GOOD_TRY[window["lang"]], 72);
                title.tint = 0xf7d501;
                title.anchor.set(0.5);
                tittleContainer.addChild(title);
            }
            else {
                var title = this.game.add.bitmapText(-60, -40, 'font_all', mygame.Lang.Instance.YOU_WIN[window["lang"]], 72);
                title.tint = 0xf7d501;
                tittleContainer.addChild(title);
                title.anchor.set(0.5);
                var win = this.game.add.bitmapText(0, 0, 'font_all', '$' + this._balance + '!', 72);
                tittleContainer.addChild(win);
                win.anchor.set(0.5);
                if (this._balance >= 1000) {
                    title.x -= 40;
                    win.x = title.x + title.width - 20;
                    win.y = title.y;
                }
                else if (this._balance < 1000 && this._balance >= 100) {
                    title.x -= 20;
                    win.x = title.x + title.width - 35;
                    win.y = title.y;
                }
                else {
                    win.x = title.x + title.width - 45;
                    win.y = title.y;
                }
            }
            this._UITitleSprite.addChild(strip);
            this._UITitleSprite.addChild(tittleContainer);
            this.createUIText();
            var yPos = this._UITitleSprite.y;
            this._UITitleSprite.y -= 800;
            this.game.add.tween(this._UITitleSprite).to({ y: yPos }, 500, Phaser.Easing.Sinusoidal.Out, true, 200);
        };
        FinishScreen.prototype.createUIBottom = function () {
            if (this._ipad) {
                this._UIBottom = new mygame.OSprite(0, mygame.Core.defaultHeight - 75);
                this._UIBottom.otherXY(0, mygame.Core.defaultWidth - 100).end();
            }
            else {
                this._UIBottom = new mygame.OSprite(0, mygame.Core.defaultHeight - 100);
                this._UIBottom.otherXY(0, mygame.Core.defaultWidth - 100).end();
            }
            var graphics = this.game.add.graphics(0, 0);
            graphics.beginFill(0x004577);
            graphics.drawRect(0, 0, 2280, 100);
            graphics.endFill();
            var icon = this.game.add.sprite(0, 0, "objects", 'icon2x.png');
            icon.anchor.set(0.5);
            icon.scale.set(0.75);
            icon.x = 100;
            icon.y = 0;
            var win = this.game.add.bitmapText(200, 10, 'font_all', mygame.Lang.Instance.GAMENAME[window["lang"]], 34);
            var by = this.game.add.bitmapText(200, 40, 'font_all', mygame.Lang.Instance.COPYRIGHT[window["lang"]], 34);
            this._UIBottomSprite = this.game.add.sprite(0, 0);
            this._UIBottomSprite.addChild(graphics);
            this._UIBottomSprite.addChild(icon);
            this._UIBottomSprite.addChild(by);
            this._UIBottomSprite.addChild(win);
            this._UIBottom.addChild(this._UIBottomSprite);
            var yPos = this._UIBottomSprite.y;
            this._UIBottomSprite.y += 230;
            this.game.add.tween(this._UIBottomSprite).to({ y: yPos }, 500, Phaser.Easing.Sinusoidal.Out, true, 2200);
        };
        return FinishScreen;
    }(Phaser.Sprite));
    mygame.FinishScreen = FinishScreen;
})(mygame || (mygame = {}));
var FxSplash = (function (_super) {
    __extends(FxSplash, _super);
    function FxSplash(game, w, h, r, debug) {
        if (debug === void 0) { debug = false; }
        var _this = _super.call(this, game) || this;
        var graphics = game.add.graphics(0, 0);
        if (debug)
            graphics.beginFill(0x000000, 0.5);
        else
            graphics.beginFill(0x000000);
        graphics.drawRoundedRect(0, 0, w, h, r);
        graphics.endFill();
        _this.addChild(graphics);
        var splash = _this.game.add.sprite(0, 0, 'objects', 'splash.png');
        if (!debug)
            splash.mask = graphics;
        _this.addChild(splash);
        splash.x = -400;
        _this.splash = splash;
        return _this;
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
        }, 1000, Phaser.Easing.Sinusoidal.Out, true);
    };
    return FxSplash;
}(Phaser.Group));
var mygame;
(function (mygame) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super.call(this, 1280, 720, Phaser.CANVAS, 'mdsp-creative', null, false, true) || this;
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
    var GameConfig = (function () {
        function GameConfig() {
        }
        GameConfig.name2suit = function (name) {
            var suit;
            switch (name.toLowerCase()) {
                case "s":
                    suit = mygame.SUIT.SPADES;
                    break;
                case "c":
                    suit = mygame.SUIT.CLUBS;
                    break;
                case "d":
                    suit = mygame.SUIT.DIAMONDS;
                    break;
                case "h":
                    suit = mygame.SUIT.HEARTS;
                    break;
                default:
                    break;
            }
            return suit;
        };
        GameConfig.enableDrag = function (el) {
            el.inputEnabled = true;
            el.input.enableDrag();
            el.events.onDragUpdate.add(function () {
                console.log(el.x, el.y);
            }, this);
        };
        return GameConfig;
    }());
    GameConfig.CARD_SCALE_TIME = 150;
    GameConfig.CARD_FLY_TIME = 500;
    GameConfig.TUTORIAL_CARDS = [
        "qh", "5h", "4d", "7s", "6s", "7h"
    ];
    GameConfig.CARDS = [
        "2c", "2d", "2h", "2s", "ac", "3d", "3h", "as", "4c", "4d", "4h", "4s", "5c", "5d", "5h",
        "5s", "6c", "6d", "6h", "6s", "7c", "7d", "7h", "7s", "8c", "8d", "8h", "8s", "9c", "9d",
        "9h", "9s", "ac", "ad", "ah", "as", "jc", "jd", "jh", "js", "kc", "kd", "kh", "ks", "qc",
        "qd", "qh", "qs", "tc", "td", "th", "ts"
    ];
    GameConfig.GIFT = -1;
    GameConfig.HINT_INITIAL_MAX_WIDTH = 300;
    GameConfig.TIME_MULTIPLAYER = 0.5;
    GameConfig.BID_WAITING_MAX = window["playerWaintingTime"];
    mygame.GameConfig = GameConfig;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.getRandomItem = function (arr) {
            var n = Math.floor(mygame.GameConfig.rnd.random() * arr.length);
            return arr[n];
        };
        Utils.removeRandomItem = function (arr) {
            if (window["tutorial"]) {
                return mygame.GameConfig.TUTORIAL_CARDS.shift();
            }
            var n = Math.floor(mygame.GameConfig.rnd.random() * arr.length);
            return arr.splice(n, 1)[0];
        };
        return Utils;
    }());
    mygame.Utils = Utils;
    var MersenneTwister = (function () {
        function MersenneTwister(seed) {
            this.N = 624;
            this.M = 397;
            this.MATRIX_A = 0x9908b0df;
            this.UPPER_MASK = 0x80000000;
            this.LOWER_MASK = 0x7fffffff;
            this.mt = new Array(this.N);
            this.mti = this.N + 1;
            if (seed == undefined) {
                seed = new Date().getTime();
            }
            this.init_genrand(seed);
        }
        MersenneTwister.prototype.init_genrand = function (s) {
            this.mt[0] = s >>> 0;
            for (this.mti = 1; this.mti < this.N; this.mti++) {
                s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
                this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
                    + this.mti;
                this.mt[this.mti] >>>= 0;
            }
        };
        MersenneTwister.prototype.init_by_array = function (init_key, key_length) {
            var i, j, k;
            this.init_genrand(19650218);
            i = 1;
            j = 0;
            k = (this.N > key_length ? this.N : key_length);
            for (; k; k--) {
                var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
                this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
                    + init_key[j] + j;
                this.mt[i] >>>= 0;
                i++;
                j++;
                if (i >= this.N) {
                    this.mt[0] = this.mt[this.N - 1];
                    i = 1;
                }
                if (j >= key_length)
                    j = 0;
            }
            for (k = this.N - 1; k; k--) {
                var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
                this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
                    - i;
                this.mt[i] >>>= 0;
                i++;
                if (i >= this.N) {
                    this.mt[0] = this.mt[this.N - 1];
                    i = 1;
                }
            }
            this.mt[0] = 0x80000000;
        };
        MersenneTwister.prototype.genrand_int32 = function () {
            var y;
            var mag01 = new Array(0x0, this.MATRIX_A);
            if (this.mti >= this.N) {
                var kk;
                if (this.mti == this.N + 1)
                    this.init_genrand(5489);
                for (kk = 0; kk < this.N - this.M; kk++) {
                    y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                    this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
                }
                for (; kk < this.N - 1; kk++) {
                    y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                    this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
                }
                y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
                this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];
                this.mti = 0;
            }
            y = this.mt[this.mti++];
            y ^= (y >>> 11);
            y ^= (y << 7) & 0x9d2c5680;
            y ^= (y << 15) & 0xefc60000;
            y ^= (y >>> 18);
            return y >>> 0;
        };
        MersenneTwister.prototype.genrand_int31 = function () {
            return (this.genrand_int32() >>> 1);
        };
        MersenneTwister.prototype.genrand_real1 = function () {
            return this.genrand_int32() * (1.0 / 4294967295.0);
        };
        MersenneTwister.prototype.random = function () {
            return this.genrand_int32() * (1.0 / 4294967296.0);
        };
        MersenneTwister.prototype.genrand_real3 = function () {
            return (this.genrand_int32() + 0.5) * (1.0 / 4294967296.0);
        };
        MersenneTwister.prototype.genrand_res53 = function () {
            var a = this.genrand_int32() >>> 5, b = this.genrand_int32() >>> 6;
            return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
        };
        return MersenneTwister;
    }());
    mygame.MersenneTwister = MersenneTwister;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var BotState;
    (function (BotState) {
        BotState[BotState["IDLE"] = 0] = "IDLE";
        BotState[BotState["WAITING"] = 1] = "WAITING";
    })(BotState = mygame.BotState || (mygame.BotState = {}));
    ;
    var Bot = (function (_super) {
        __extends(Bot, _super);
        function Bot(game, x, y, flipVertical, flipHorizontal) {
            var _this = _super.call(this, game, x, y) || this;
            _this._cards = [];
            _this._gender = 0;
            _this._actionWasFired = false;
            _this._cardsInHand = 0;
            _this._burst = false;
            _this._state = BotState.IDLE;
            _this._bg = _this.game.add.sprite(0, 0, "objects", "userIcon0002.png");
            _this._bg.anchor.set(0.5);
            _this._bg.scale.set(0.8);
            _this.addChild(_this._bg);
            _this._graphics = _this.game.add.graphics(0, 0);
            _this.addChild(_this._graphics);
            _this._graphics.alpha = 0;
            _this._graphics.beginFill(0x00);
            _this._graphics.drawRect(-60, -60, 120, 120);
            _this._graphics.endFill();
            _this._balance = 2000 + Math.floor(-300 + 600 * Math.random());
            _this._btmTextName = _this.game.add.bitmapText(0, -70, "font_all_30", "", 24);
            _this._btmTextName.anchor.set(0.5);
            _this.addChild(_this._btmTextName);
            _this._btmTextBalance = _this.game.add.bitmapText(0, 74, "font_all_30", "$" + _this._balance.toString(), 24);
            _this._btmTextBalance.anchor.set(0.5);
            _this.addChild(_this._btmTextBalance);
            _this._bid = 0;
            _this._chip = _this.game.add.sprite(0, 0);
            _this._chip.anchor.set(0.5);
            _this._chip.visible = false;
            _this._graphicsBid = _this.game.add.graphics(0, 0);
            _this._graphicsBid.beginFill(0x000000, 0.5);
            _this._graphicsBid.drawRoundedRect(-20, 40, 80, 30, 10);
            _this._graphicsBid.endFill();
            _this._chip.addChild(_this._graphicsBid);
            _this._chipSprite = _this.game.add.sprite(0, 0, "objects", "blue_chip.png");
            _this._chip.addChild(_this._chipSprite);
            _this.game.world.addChild(_this._chip);
            _this._btmTextBid = _this.game.add.bitmapText(40 - 20, 57, "font_all_30", "", 24);
            _this._btmTextBid.anchor.set(0.5);
            _this._chip.addChild(_this._btmTextBid);
            _this._pass = false;
            var angle = Math.atan2(_this.y, _this.x);
            var unitVector = new Phaser.Point(Math.cos(angle), Math.sin(angle));
            var scale = new Phaser.Point(0.35, 0.35);
            if (flipHorizontal) {
                scale.x = -0.35;
            }
            if (flipVertical) {
                scale.y = -0.35;
            }
            _this._myMask = _this.game.add.graphics(0, 0);
            _this._myMask.beginFill(0xffffff);
            _this._myMask.arc(0, 0, 110, -90 / 180 * Math.PI + 0.1, 0, true);
            _this._myMask.endFill();
            _this.addChild(_this._myMask);
            _this._greenBorder = _this.game.add.sprite(0, 0, "objects", "userIcon0004_w.png");
            _this._greenBorder.anchor.set(0.5);
            _this._greenBorder.scale.set(0.8);
            _this._greenBorder.alpha = 0;
            _this.addChild(_this._greenBorder);
            _this._greenBorder.mask = _this._myMask;
            _this._cardsAvatar = [];
            var card1 = _this.game.add.sprite(-60, -60 + 5, "objects", "2d.png");
            card1.alpha = 0;
            _this._cardsAvatar.push(card1);
            _this.addChild(card1);
            _this._highlightBorderBot = [];
            _this._highlightBorderBot.push(_this.game.add.sprite(-10, -10, "objects", "cardFrame.png"));
            _this._highlightBorderBot.push(_this.game.add.sprite(-10, -10, "objects", "cardFrame.png"));
            _this._highlightBorderBot[0].scale.set(1.3);
            _this._highlightBorderBot[1].scale.set(1.3);
            _this._highlightBorderBot[0].alpha = 0;
            _this._highlightBorderBot[1].alpha = 0;
            card1.addChild(_this._highlightBorderBot[0]);
            var card2 = _this.game.add.sprite(30, 0, "objects", "2d.png");
            _this._cardsAvatar.push(card2);
            card1.addChild(card2);
            card2.addChild(_this._highlightBorderBot[1]);
            _this._comment = _this.game.add.bitmapText(0, 65, "font_all_30", "", 24);
            _this._comment.anchor.set(0.5);
            _this._comment.alpha = 0;
            _this._comment.align = "center";
            _this.addChild(_this._comment);
            1;
            _this._hasPresent = false;
            var xPos;
            var yPos;
            if (flipVertical) {
                yPos = 20;
            }
            else {
                yPos = -40;
            }
            if (flipHorizontal) {
                xPos = -120;
            }
            else {
                xPos = 30;
            }
            _this._present = _this.game.add.sprite(xPos, yPos, "objects", "gift_7.png");
            _this._present.visible = false;
            _this.addChild(_this._present);
            if (flipVertical) {
                yPos = -40;
                xPos = 100;
                if (flipHorizontal) {
                    xPos = -100;
                }
            }
            else {
                yPos = 120;
                xPos = 0;
            }
            var emojiID = _this.game.rnd.between(1, 20);
            _this._emoji = _this.game.add.sprite(xPos, yPos, "emoji", "image_part_" + emojiID + ".png");
            _this._emoji.anchor.set(0.5);
            _this._emoji.alpha = 0;
            _this.addChild(_this._emoji);
            _this._cardsContainer = _this.game.add.sprite(0, -100);
            _this.addChild(_this._cardsContainer);
            _this._cardCounter = new mygame.CardCounter(_this.game, -10, 60);
            _this._cardCounter.visible = false;
            _this._cardsContainer.addChild(_this._cardCounter);
            return _this;
        }
        Bot.prototype.hideBorder = function () {
            this._state = BotState.IDLE;
            this._greenBorder.alpha = 0;
        };
        Object.defineProperty(Bot.prototype, "gender", {
            set: function (val) {
                this._gender = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bot.prototype, "cardsInHand", {
            get: function () {
                return this._cardsInHand;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bot.prototype, "hasPresent", {
            get: function () {
                return this._hasPresent;
            },
            enumerable: true,
            configurable: true
        });
        Bot.prototype.sendPresent = function (bot) {
            var presentId = this.game.rnd.between(1, 7);
            if (mygame.GameConfig.GIFT < 0) {
                mygame.GameConfig.GIFT = presentId;
            }
            else {
                if (mygame.GameConfig.GIFT == presentId) {
                    if (presentId == 1) {
                        presentId = 2;
                    }
                    else {
                        presentId--;
                    }
                }
            }
            var present = this.game.add.sprite(this.x + this._present.x, this.y + this._present.y, "objects", "gift_" + presentId + ".png");
            this.parent.addChild(present);
            var p = bot.presentCoordinates;
            p.x += bot.x,
                p.y += bot.y;
            this.game.add.tween(present).to({
                x: p.x,
                y: p.y
            }, 800 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                bot.present = presentId;
                present.destroy();
            });
        };
        Object.defineProperty(Bot.prototype, "present", {
            set: function (val) {
                this._present.loadTexture("objects", "gift_" + val + ".png");
                this._present.visible = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bot.prototype, "presentCoordinates", {
            get: function () {
                return new Phaser.Point(this._present.x, this._present.y);
            },
            enumerable: true,
            configurable: true
        });
        Bot.prototype.initBotCards = function () {
            var angle = Math.atan2(this.y, this.x);
            var unitVector = new Phaser.Point(Math.cos(angle), Math.sin(angle));
            var scale = new Phaser.Point(0.35, 0.35);
            this._cardBacks = this.game.add.sprite(this.x - unitVector.x * 120, this.y - unitVector.y * 120, "objects", "back.png");
            this._cardBacks.anchor.set(0.5);
            this._cardBacks.scale.set(scale.x, scale.y);
            this._cardBacks.alpha = 0;
            var secondCard = this.game.add.sprite(50, 0, "objects", "back.png");
            secondCard.anchor.set(0.5);
            secondCard.angle = 13;
            this._cardBacks.addChild(secondCard);
            this.parent.addChild(this._cardBacks);
        };
        Bot.prototype.setChipPoisition = function (x, y) {
            this._chipPosition = new Phaser.Point(x, y);
        };
        Object.defineProperty(Bot.prototype, "nextCommandCallback", {
            set: function (val) {
                this._nextCommandCallback = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bot.prototype, "currentBid", {
            get: function () {
                return this._bid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bot.prototype, "getGirlPositionCallback", {
            set: function (val) {
                this._girlPositionCallback = val;
            },
            enumerable: true,
            configurable: true
        });
        Bot.prototype.hideCardBorder = function (id) {
            if (this._highlightBorderBot[id].alpha > 0) {
                this.game.add.tween(this._highlightBorderBot[id]).to({
                    alpha: 0
                }, 400 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true);
            }
        };
        Bot.prototype.highlightCard = function (id) {
            if (this._highlightBorderBot[id].alpha < 1) {
                this.game.add.tween(this._highlightBorderBot[id]).to({
                    alpha: 1
                }, 400 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true);
            }
        };
        Bot.prototype.showComment = function () {
            var _this = this;
            this._comment.text = Phaser.ArrayUtils.getRandomItem(mygame.Lang.Instance.COMMENTS)[window["lang"]];
            if (!this._pass) {
                this.game.add.tween(this._graphics).to({
                    alpha: 0.5
                }, 400 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                    _this.game.add.tween(_this._graphics).to({
                        alpha: 0
                    }, 400 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true, window["commentDelay"]);
                });
            }
            this.game.add.tween(this._comment).to({
                alpha: 1,
                y: 0
            }, 400 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                _this.game.add.tween(_this._comment).to({
                    alpha: 0,
                    y: -65
                }, 400 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true, window["commentDelay"]);
            });
        };
        Bot.prototype.fold = function () {
            var _this = this;
            this._actionWasFired = true;
            this._state = BotState.IDLE;
            this._greenBorder.alpha = 0;
            this._btmTextName.tint = 0xaaaaaa;
            this._btmTextBalance.tint = 0xaaaaaa;
            this._pass = true;
            if (window["sounds"]) {
                this.game.sound.play('choose', 0.4);
            }
            this.game.add.tween(this._graphics).to({
                alpha: 0.6
            }, 800 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                _this._nextCommandCallback();
            }, this);
            this.hideCards();
        };
        Object.defineProperty(Bot.prototype, "pass", {
            get: function () {
                return this._pass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bot.prototype, "balance", {
            get: function () {
                return this._balance;
            },
            set: function (val) {
                this._balance = val;
            },
            enumerable: true,
            configurable: true
        });
        Bot.prototype.showWinnerBorder = function () {
        };
        Bot.prototype.bid = function (amount) {
            var _this = this;
            this._actionWasFired = true;
            if (window["sounds"]) {
                this.game.sound.play('chips_bet', 0.4);
            }
            this._graphicsBid.visible = true;
            this.game.world.removeChild(this._chip);
            this.addChild(this._chip);
            var angle = Math.atan2(this.y, this.x);
            var unitVector = new Phaser.Point(Math.cos(angle), Math.sin(angle));
            if (amount >= 500) {
                this._chipSprite.loadTexture("objects", "orange_chip.png");
            }
            else if (amount >= 100) {
                this._chipSprite.loadTexture("objects", "red_chip.png");
            }
            else if (amount >= 50) {
                this._chipSprite.loadTexture("objects", "green_chip.png");
            }
            else {
                this._chipSprite.loadTexture("objects", "blue_chip.png");
            }
            this._chip.visible = true;
            this.game.add.tween(this._chip).to({
                x: this._chipPosition.x,
                y: this._chipPosition.y
            }, 200, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                _this._nextCommandCallback();
            }, this);
            this._balance -= amount - this._bid;
            if (this._balance <= 0) {
                this._balance = Math.floor(1500 + Math.random() * 700);
            }
            this.updateBalanceText();
            this._bid = amount;
            this._btmTextBid.text = "$" + this._bid.toString();
            this._btmTextBid.visible = true;
        };
        Bot.prototype.waiting = function (delay) {
            var _this = this;
            this.tweenTint(this._greenBorder, "#6be537", "#f2fa2c", delay / 2);
            this.game.time.events.add(delay / 2, function () {
                _this.tweenTint(_this._greenBorder, "#f2fa2c", "#df3d3d", delay / 2);
            }, this);
            this._greenBorder.alpha = 1;
            this._greenBorder.visible = true;
            this._myMask.clear();
            this._myMask.beginFill(0xffffff);
            this._myMask.drawCircle(0, 0, 210);
            this._myMask.endFill();
            this._timer = delay;
            this._borderTimer = window["playerWaintingTime"];
            this._state = BotState.WAITING;
        };
        Bot.prototype.returnChips = function () {
            this._chip.visible = false;
            this.generateChips(this._bid, new Phaser.Point(this.x, this.y));
        };
        Bot.prototype.moneyToDealer = function () {
            if (!this._pass || this._graphicsBid.visible) {
                this._graphicsBid.visible = false;
                this._btmTextBid.visible = false;
                var xPos = this._chip.worldPosition.x;
                var yPos = this._chip.worldPosition.y;
                this.removeChild(this._chip);
                this._chip.position.set(xPos, yPos);
                this.game.world.addChild(this._chip);
                this._chip.visible = false;
                var pos = new Phaser.Point(0, -210 + 90 + 20);
                return this.generateChips(this._bid, pos);
            }
            return null;
        };
        Bot.prototype.dCard = function (x, y) {
            this._dCard = new Phaser.Point(x, y);
            this._cardsContainer.x = x;
            this._cardsContainer.y = y;
        };
        Bot.prototype.generateChips = function (amount, p) {
            var orangeCounter = Math.floor(amount / 500);
            amount -= 500 * orangeCounter;
            var redCounter = Math.floor(amount / 100);
            amount -= 100 * redCounter;
            var greenCounter = Math.floor(amount / 50);
            amount -= 50 * greenCounter;
            var blueCounter = Math.ceil(amount / 10);
            var k = 0;
            var tween;
            var tmpTween;
            for (var i = 0; i < orangeCounter; i++) {
                tmpTween = this.generateChip("orange_chip.png", p, 150 * k);
                if (tmpTween != null) {
                    tween = tmpTween;
                }
                k++;
            }
            for (var i = 0; i < redCounter; i++) {
                tmpTween = this.generateChip("red_chip.png", p, 150 * k);
                if (tmpTween != null) {
                    tween = tmpTween;
                }
                k++;
            }
            for (var i = 0; i < greenCounter; i++) {
                tmpTween = this.generateChip("green_chip.png", p, 150 * k);
                if (tmpTween != null) {
                    tween = tmpTween;
                }
                k++;
            }
            for (var i = 0; i < blueCounter; i++) {
                tmpTween = this.generateChip("blue_chip.png", p, 150 * k);
                if (tmpTween != null) {
                    tween = tmpTween;
                }
                k++;
            }
            return tween;
        };
        Bot.prototype.generateChip = function (spriteName, p, delay) {
            var _this = this;
            var sprite = this.game.add.sprite(this.x + this._chipPosition.x + this._chipSprite.width / 2, this.y + this._chipPosition.y + this._chipSprite.height / 2, "objects", spriteName);
            sprite.anchor.set(0.5);
            this.parent.addChild(sprite);
            var tween = this.game.add.tween(sprite).to({
                x: p.x,
                y: p.y
            }, 500 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true, delay);
            tween.onComplete.addOnce(function () {
                _this.game.add.tween(sprite).to({
                    alpha: 0
                }, 150 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                    sprite.destroy();
                });
            }, this);
            return tween;
        };
        Bot.prototype.myCheck = function (val, changeName) {
            var _this = this;
            if (changeName === void 0) { changeName = true; }
            if (this._bid == val) {
                this._nextCommandCallback();
            }
            else {
                if (changeName) {
                    this.changeName(mygame.Lang.Instance.STAND_TITLE[window["lang"]], 0xf2fa2c);
                }
                var chip_1 = this.game.add.sprite(0, 0);
                var amount = val;
                var chipSpriteName = void 0;
                var dv = val - this._bid;
                if (dv >= 500) {
                    chipSpriteName = "orange_chip.png";
                }
                else if (dv >= 100) {
                    chipSpriteName = "red_chip.png";
                }
                else if (dv >= 50) {
                    chipSpriteName = "green_chip.png";
                }
                else {
                    chipSpriteName = "blue_chip.png";
                }
                var graphicsBid = this.game.add.graphics(0, 0);
                graphicsBid.beginFill(0x000000, 0.5);
                graphicsBid.drawRoundedRect(20, 2, 80, 30, 10);
                graphicsBid.endFill();
                chip_1.addChild(graphicsBid);
                chip_1.addChild(this.game.add.sprite(0, 0, "objects", chipSpriteName));
                this.addChild(chip_1);
                var btmTextBid = this.game.add.bitmapText(40, 5, "font_all_30", "", 24);
                chip_1.addChild(btmTextBid);
                this._state = BotState.IDLE;
                this._greenBorder.alpha = 0;
                this._actionWasFired = true;
                btmTextBid.text = "$" + (val - this._bid).toString();
                this.game.add.tween(chip_1).to({
                    x: this._chipPosition.x,
                    y: this._chipPosition.y
                }, 500 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                    _this.game.add.tween(chip_1).to({
                        alpha: 0
                    }, 150 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                        chip_1.destroy();
                    }, _this);
                });
                this._balance -= val - this._bid;
                if (this._balance <= 0) {
                    this._balance = Math.floor(1500 + Math.random() * 700);
                }
                this.updateBalanceText();
                this._bid = val;
                if (this._bid >= 500) {
                    this._chipSprite.loadTexture("objects", "orange_chip.png");
                }
                else if (this._bid >= 100) {
                    this._chipSprite.loadTexture("objects", "red_chip.png");
                }
                else if (this._bid >= 50) {
                    this._chipSprite.loadTexture("objects", "green_chip.png");
                }
                else {
                    this._chipSprite.loadTexture("objects", "blue_chip.png");
                }
                if (window["sounds"]) {
                    this.game.sound.play('chips_bet', 0.4);
                }
                this.game.add.tween(this._btmTextBid).to({
                    alpha: 0
                }, 500 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Linear.None, true).onComplete.addOnce(function () {
                    _this._btmTextBid.text = "$" + _this._bid.toString();
                    _this.game.add.tween(_this._btmTextBid).to({
                        alpha: 1
                    }, 400 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Linear.None, true).onComplete.addOnce(function () {
                        _this._nextCommandCallback();
                    }, _this);
                }, this);
            }
        };
        Object.defineProperty(Bot.prototype, "cardsAngle", {
            set: function (val) {
                this._cardsContainer.angle = val;
            },
            enumerable: true,
            configurable: true
        });
        Bot.prototype.resetBid = function () {
            this._bid = 0;
            this._chip.position.set(0, 0);
            this._chip.visible = false;
        };
        Bot.prototype.showCards = function () {
            var _this = this;
            this.game.add.tween(this._cardsAvatar[0]).to({
                alpha: 1
            }, 400 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                _this.game.add.tween(_this._cardsAvatar[0]).to({
                    alpha: 0
                }, 400 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true, 2000);
            }, this);
            this.hideCards();
        };
        Bot.prototype.sendChipsToWinnet = function (pos) {
            if (!this._pass) {
                this.game.add.tween(this._chip).to({
                    x: pos.x,
                    y: pos.y
                }, 800 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true);
                this._bid = 0;
            }
        };
        Bot.prototype.updateBalance = function (val) {
            this._balance += val;
        };
        Bot.prototype.updateBalanceText = function () {
            this._btmTextBalance.text = "$" + this._balance;
        };
        Bot.prototype.setOriginalName = function () {
            this._btmTextName.text = "";
            this._btmTextName.tint = 0xffffff;
        };
        Bot.prototype.changeName = function (newName, newColor) {
            if (this._gender > 0 && window["lang"] == "ru" && (newName == mygame.Lang.Instance.STAND_TITLE["ru"] || newName == mygame.Lang.Instance.HIT_TITLE["ru"])) {
            }
            this._btmTextName.text = newName;
            this._btmTextName.tint = newColor;
        };
        Bot.prototype.tweenTint = function (obj, startColor, endColor, time, callback) {
            if (time === void 0) { time = 250; }
            if (callback === void 0) { callback = null; }
            if (obj) {
                var startRGB_1 = Phaser.Color.hexToColor(startColor);
                var endRGB_1 = Phaser.Color.hexToColor(endColor);
                var colorBlend_1 = { step: 0 };
                this._colorTween = this.game.add.tween(colorBlend_1).to({ step: 100 }, time);
                this._colorTween.onUpdateCallback(function () {
                    obj.tint = Phaser.Color.interpolateRGB(startRGB_1.r, startRGB_1.g, startRGB_1.b, endRGB_1.r, endRGB_1.g, endRGB_1.b, 100, colorBlend_1.step);
                });
                if (callback) {
                    this._colorTween.onComplete.add(function () {
                        callback();
                    });
                }
                this._colorTween.start();
            }
        };
        Bot.prototype.myReset = function () {
            this.hideCards();
            this._burst = false;
            this._cardsInHand = 0;
            this._btmTextBalance.tint = 0xffffff;
            this._actionWasFired = false;
            this._bid = 0;
            this.updateBalanceText();
            this._pass = false;
            this._chip.position.set(0, 0);
            this._chip.visible = false;
            if (this._cardBacks) {
                this._cardBacks.alpha = 0;
            }
            this.hideCardBorder(0);
            this.hideCardBorder(1);
            this._graphics.alpha = 0;
            this._cards.length = 0;
            this._cardCounter.myreset();
            this._cardCounter.visible = false;
            var angle = Math.atan2(this.y, this.x);
            var unitVector = new Phaser.Point(Math.cos(angle), Math.sin(angle));
        };
        Bot.prototype.hideCards = function (autostart) {
            var _this = this;
            if (autostart === void 0) { autostart = true; }
            var tween;
            var tweenArray = [];
            this._cardCounter.visible = false;
            if (this._cards.length > 0) {
                var _loop_2 = function (i) {
                    var c = this_1._cards[i];
                    this_1._cardsContainer.removeChild(c);
                    this_1.parent.addChild(c);
                    var x = this_1.x + this_1._cardsContainer.x + Bot.CARD_POSITIONS[i].x * Math.cos(this_1._cardsContainer.rotation) - Bot.CARD_POSITIONS[i].y * Math.sin(this_1._cardsContainer.rotation);
                    var y = this_1.y + this_1._cardsContainer.y + Bot.CARD_POSITIONS[i].y * Math.cos(this_1._cardsContainer.rotation) + Bot.CARD_POSITIONS[i].x * Math.sin(this_1._cardsContainer.rotation);
                    c.position.set(x, y);
                    c.angle = this_1._cardsContainer.angle;
                    tween = this_1.game.add.tween(c).to({
                        x: -20,
                        y: -210 + 60,
                        alpha: 0,
                        angle: 0
                    }, 400 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, autostart, 100 * i);
                    tween.onComplete.addOnce(function () {
                        c.destroy();
                    });
                };
                var this_1 = this;
                for (var i = 0; i < this._cards.length; i++) {
                    _loop_2(i);
                }
                tween.onComplete.addOnce(function () {
                    _this._cards.length = 0;
                });
                if (!autostart) {
                    tweenArray.push(tween);
                }
            }
            return tweenArray;
        };
        Bot.prototype.showEmoji = function () {
            this.game.add.tween(this._emoji).to({
                alpha: 1
            }, 400 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true);
        };
        Bot.prototype.hideEmoji = function () {
            this._emoji.alpha = 0;
        };
        Bot.prototype.hideEverything = function () {
            this._chip.visible = false;
            if (this._cardBacks) {
                this._cardBacks.visible = false;
                this.hideEmoji();
                this.hideCardBorder(0);
                this.hideCardBorder(1);
            }
            this._bg.visible = false;
        };
        Object.defineProperty(Bot.prototype, "burst", {
            get: function () {
                return this._burst;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bot.prototype, "points", {
            get: function () {
                return this._cardCounter.amount;
            },
            enumerable: true,
            configurable: true
        });
        Bot.prototype.win = function () {
            this.changeName(mygame.Lang.Instance.WINNER[window["lang"]], 0xf2fa2c);
            this._burst = true;
            this.game.add.tween(this._cardsContainer.scale).to({
                x: 1.2,
                y: 1.2
            }, 500 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, true);
        };
        Bot.prototype.loose = function () {
            this.changeName(mygame.Lang.Instance.BURST[window["lang"]], 0xff0000);
            this._burst = true;
            this.game.add.tween(this._cardsContainer.scale).to({
                x: 1.2,
                y: 1.2
            }, 500 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, true);
        };
        Bot.prototype.addCards = function (cardName, delay) {
            var _this = this;
            if (delay === void 0) { delay = 0; }
            var card = this.game.add.sprite(Bot.CARD_POSITIONS[this._cardsInHand].x, Bot.CARD_POSITIONS[this._cardsInHand].y, "objects", cardName + ".png");
            this._cards.push(card);
            card.alpha = 0;
            card.scale.set(0.45);
            card.anchor.set(0.5);
            this.parent.addChild(card);
            var pos = this._girlPositionCallback();
            var angle = Math.atan2(this.y, this.x);
            var unitVector = new Phaser.Point(Math.cos(angle), Math.sin(angle));
            var currentId = this._cardsInHand;
            card.angle = 180 + this._cardsContainer.angle;
            card.position.set(-20, -210 + 60);
            var tween = this.game.add.tween(card).to({
                x: this.x + this._cardsContainer.x + Bot.CARD_POSITIONS[currentId].x * Math.cos(this._cardsContainer.rotation) - Bot.CARD_POSITIONS[currentId].y * Math.sin(this._cardsContainer.rotation),
                y: this.y + this._cardsContainer.y + Bot.CARD_POSITIONS[currentId].y * Math.cos(this._cardsContainer.rotation) + Bot.CARD_POSITIONS[currentId].x * Math.sin(this._cardsContainer.rotation),
                angle: 360 + this._cardsContainer.angle,
                alpha: 1
            }, 600 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true, delay);
            this._cardCounter.addCard(cardName, true);
            var lastTween;
            var tweenArray;
            if (this._cardCounter.amount > 21) {
                this._burst = true;
            }
            tween.onComplete.add(function () {
                card.angle = 0;
                card.position.set(Bot.CARD_POSITIONS[currentId].x, Bot.CARD_POSITIONS[currentId].y);
                _this.parent.removeChild(card);
                if (!_this._cardCounter.visible) {
                    _this._cardCounter.visible = true;
                }
                _this._cardsContainer.addChild(card);
                _this._cardCounter.updateText();
                if (_this._cardCounter.amount > 21) {
                    _this.loose();
                    _this.game.time.events.add(750, function () {
                        _this.hideCards();
                        _this.game.time.events.add(750, function () {
                            _this.moneyToDealer();
                        }, _this);
                    }, _this);
                }
            });
            this._cardsInHand++;
            return tween;
        };
        return Bot;
    }(Phaser.Sprite));
    Bot.CARD_POSITIONS = [
        { x: -40, y: 20 },
        { x: -20, y: 0 },
        { x: 0, y: 0 },
        { x: 20, y: 20 }
    ];
    mygame.Bot = Bot;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var CardCounter = (function (_super) {
        __extends(CardCounter, _super);
        function CardCounter(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this._counter = 0;
            _this._graphics = _this.game.add.graphics(0, 0);
            _this._graphics.beginFill(0x00, 0.5)
                .drawRoundedRect(-25, -12, 50, 24, 5)
                .endFill();
            _this.addChild(_this._graphics);
            _this._bmText = _this.game.add.bitmapText(0, 0, "font_all_30", "", 20);
            _this._bmText.anchor.set(0.5);
            _this.addChild(_this._bmText);
            _this._amountOfCard = 0;
            _this._ace = false;
            _this._wasDec = false;
            return _this;
        }
        Object.defineProperty(CardCounter.prototype, "cardsNumber", {
            get: function () {
                return this._amountOfCard;
            },
            enumerable: true,
            configurable: true
        });
        CardCounter.prototype.makeMeGreen = function () {
            this._bmText.tint = 0x00ff00;
        };
        CardCounter.prototype.addNumber = function (val) {
            this._counter += val;
            if (this._counter >= 10000) {
                this._bmText.text = Math.floor(this._counter / 1000) + "k";
            }
            else {
                this._bmText.text = this._counter.toString();
            }
        };
        CardCounter.prototype.setRectangleSize = function (w, h, r, alpha) {
            this._graphics.clear()
                .beginFill(0x00, alpha)
                .drawRoundedRect(-w / 2, -h / 2, w, h, r)
                .endFill();
        };
        CardCounter.prototype.setFontSize = function (val) {
            this._bmText.fontSize = val;
        };
        CardCounter.prototype.addCard = function (card, delay) {
            if (delay === void 0) { delay = false; }
            this._amountOfCard++;
            var id = card[0].toLowerCase();
            if (id >= '2' && id <= '9') {
                this._counter += +id;
            }
            else if (id == 'a') {
                this._ace = true;
                this._counter += 11;
            }
            else {
                this._counter += 10;
            }
            if (this._counter > 21 && this._ace && !this._wasDec) {
                this._counter -= 10;
                this._wasDec = true;
            }
            if (!delay) {
                this.updateText();
            }
        };
        CardCounter.prototype.updateText = function () {
            this._bmText.text = this._counter.toString();
            if (this._counter > 21) {
                this._bmText.tint = 0xff0000;
            }
            else if (this._counter == 21) {
                this._bmText.tint = 0x00ff00;
            }
        };
        CardCounter.prototype.myreset = function () {
            this._counter = 0;
            this._amountOfCard = 0;
            this._ace = false;
            this._wasDec = false;
            this._bmText.tint = 0xffffff;
        };
        Object.defineProperty(CardCounter.prototype, "amount", {
            get: function () {
                return this._counter;
            },
            enumerable: true,
            configurable: true
        });
        return CardCounter;
    }(Phaser.Sprite));
    mygame.CardCounter = CardCounter;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Dealer = (function () {
        function Dealer(game) {
            this._cards = mygame.GameConfig.CARDS.slice(0);
            this._game = game;
            this._bots = [];
            this._currentCardsOnTable = [];
            this._highestBid = 0;
            this._cardCounter = null;
        }
        Object.defineProperty(Dealer.prototype, "nextCommandCallback", {
            set: function (val) {
                this._nextCommandCallback = val;
            },
            enumerable: true,
            configurable: true
        });
        Dealer.prototype.addBot = function (val) {
            this._bots.push(val);
        };
        Dealer.prototype.toMaxCards = function (table) {
            var _this = this;
            if (this._cardCounter.amount < 17) {
                var tween = this.addCardOnTanle(table).onComplete.addOnce(function () {
                    _this.toMaxCards(table);
                });
            }
            else {
                this._checkWinLooseCallback();
            }
            this._cardCounter.updateText();
        };
        Dealer.prototype.addCardOnTanle = function (table, wait) {
            var _this = this;
            if (wait === void 0) { wait = 0; }
            if (this._cardCounter == null) {
                this._cardCounter = new mygame.CardCounter(table.game, 0, 55 - 200 + 10);
                this._cardCounter.setRectangleSize(100, 50, 10, 0.7);
                this._cardCounter.setFontSize(30);
                table.addChild(this._cardCounter);
            }
            else {
                this._cardCounter.visible = true;
            }
            var cardName;
            cardName = mygame.Utils.removeRandomItem(this._cards);
            var card;
            var delay = 0;
            var newX = 0;
            if (this._currentCardsOnTable.length > 1) {
                for (var i = 0; i < this._currentCardsOnTable.length; i++) {
                    var c = this._currentCardsOnTable[i];
                    newX = c.x - 40;
                    table.game.add.tween(c).to({
                        x: newX
                    }, 200 * mygame.GameConfig.TIME_MULTIPLAYER, Phaser.Easing.Sinusoidal.InOut, true, wait);
                }
                ;
                var n = this._currentCardsOnTable.length;
                card = new mygame.Card(table.game, newX + 60, -50 - 200 + 10, mygame.GameConfig.name2suit(cardName[1]), cardName[0], false);
                delay = 200;
            }
            else {
                card = new mygame.Card(table.game, -20 + 60 * this._currentCardsOnTable.length, -50 - 200 + 10, mygame.GameConfig.name2suit(cardName[1]), cardName[0], this._currentCardsOnTable.length > 0);
            }
            card.x += 500;
            card.y += 100;
            var tween = table.game.add.tween(card).to({
                x: card.x - 500,
                y: card.y - 100
            }, mygame.GameConfig.CARD_FLY_TIME, Phaser.Easing.Sinusoidal.Out, true, wait);
            tween.onComplete.addOnce(function () {
                if (window["sounds"]) {
                    _this._game.sound.play('new_card', 0.4);
                }
            });
            if (this._currentCardsOnTable.length != 1) {
                table.game.add.tween(card.scale).to({
                    x: 0.1
                }, mygame.GameConfig.CARD_SCALE_TIME, Phaser.Easing.Quadratic.In, true, 100 + wait).onComplete.addOnce(function () {
                    card.showCard();
                    table.game.add.tween(card.scale).to({
                        x: 1
                    }, mygame.GameConfig.CARD_SCALE_TIME, Phaser.Easing.Quadratic.Out, true);
                });
            }
            table.addChild(card);
            this._currentCardsOnTable.push(card);
            this._cardCounter.addCard(cardName, this._currentCardsOnTable.length != 1);
            return tween;
        };
        Object.defineProperty(Dealer.prototype, "checkWinLoseCallback", {
            set: function (val) {
                this._checkWinLooseCallback = val;
            },
            enumerable: true,
            configurable: true
        });
        Dealer.prototype.makeCounterGreen = function () {
            this._cardCounter.makeMeGreen();
        };
        Dealer.prototype.addCardsOnTable = function (table, wait) {
            var _this = this;
            var tween;
            tween = this.addCardOnTanle(table, 0);
            tween.onComplete.addOnce(function () {
                table.game.time.events.add(wait, function () {
                    _this._nextCommandCallback();
                }, _this);
            }, this);
        };
        Object.defineProperty(Dealer.prototype, "highestBid", {
            get: function () {
                return this._highestBid;
            },
            set: function (val) {
                this._highestBid = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dealer.prototype, "cardsOnTable", {
            get: function () {
                return this._currentCardsOnTable;
            },
            enumerable: true,
            configurable: true
        });
        Dealer.prototype.loadCards = function () {
            this._cards = mygame.GameConfig.CARDS.slice(0);
        };
        Dealer.prototype.hideCards = function () {
            var _this = this;
            this._cardCounter.visible = false;
            var tween;
            this._currentCardsOnTable.forEach(function (x, i) {
                tween = x.discard(i * 300);
            });
            tween.onComplete.addOnce(function () {
                _this.removeCards();
            }, this);
        };
        Dealer.prototype.myreset = function () {
            this._cardCounter.myreset();
            this._cardCounter.visible = false;
            this._cardCounter.alpha = 1;
            this._currentCardsOnTable.length = 0;
            this._cards = mygame.GameConfig.CARDS.slice(0);
        };
        Dealer.prototype.revealLastCard = function () {
            var _this = this;
            if (window["sounds"]) {
                this._game.sound.play('choose', 0.4);
            }
            var card = this._currentCardsOnTable[this._currentCardsOnTable.length - 1];
            card.game.add.tween(card.scale).to({
                x: 0.1
            }, mygame.GameConfig.CARD_SCALE_TIME, Phaser.Easing.Quadratic.In, true).onComplete.addOnce(function () {
                _this._cardCounter.updateText();
                card.showCard();
                card.game.add.tween(card.scale).to({
                    x: 1
                }, mygame.GameConfig.CARD_SCALE_TIME, Phaser.Easing.Quadratic.Out, true);
            }, this);
        };
        Dealer.prototype.revealCards = function () {
            var _this = this;
            var delay = 0;
            var tween;
            this._currentCardsOnTable.forEach(function (x) {
                tween = x.reveal(delay);
                delay += 100;
            });
            tween.onComplete.addOnce(function () {
                _this._nextCommandCallback();
            });
        };
        Object.defineProperty(Dealer.prototype, "points", {
            get: function () {
                return this._cardCounter.amount;
            },
            enumerable: true,
            configurable: true
        });
        Dealer.prototype.giveCardTo = function (bot) {
            var tween = bot.addCards(mygame.Utils.removeRandomItem(this._cards));
            return tween;
        };
        Dealer.prototype.removeCards = function () {
            var _this = this;
            var tween;
            this._currentCardsOnTable.forEach(function (el, i) {
                tween = el.game.add.tween(el).to({
                    x: 0,
                    y: el.y - 500,
                    alpha: 0
                }, mygame.GameConfig.CARD_FLY_TIME + 500, Phaser.Easing.Sinusoidal.Out, true, i * 200);
                tween.onStart.addOnce(function () {
                    _this._game.sound.play('new_card', 0.4);
                }, _this);
                tween.onComplete.addOnce(function () {
                    el.destroy();
                }, _this);
            });
            this._game.add.tween(this._cardCounter).to({
                alpha: 0
            }, 500, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                _this._cardCounter.myreset();
                _this._cardCounter.visible = false;
                _this._cardCounter.alpha = 1;
            });
        };
        Dealer.prototype.giveCards = function () {
            var _this = this;
            var tween;
            for (var i = 0; i < this._bots.length; i++) {
                tween = this._bots[i % this._bots.length].addCards(mygame.Utils.removeRandomItem(this._cards));
            }
            tween.onComplete.addOnce(function () {
                _this._nextCommandCallback();
            }, this);
        };
        return Dealer;
    }());
    mygame.Dealer = Dealer;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Hint = (function (_super) {
        __extends(Hint, _super);
        function Hint(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this._startXY = new Phaser.Point(x, y);
            _this._otherXY = new Phaser.Point(0, 0);
            _this._message = "";
            _this._pixel = _this.game.add.sprite(0, 0, "objects", "pixel.png");
            _this._pixel.anchor.set(0, 0.5);
            _this.addChild(_this._pixel);
            _this._leftBorder = _this.game.add.sprite(0, 0, "objects", "left.png");
            _this._leftBorder.anchor.set(0, 0.5);
            _this.addChild(_this._leftBorder);
            _this._rightBorder = _this.game.add.sprite(0, 0, "objects", "left.png");
            _this._rightBorder.anchor.set(1, 0.5);
            _this._rightBorder.scale.set(-1, 1);
            _this.addChild(_this._rightBorder);
            _this._messageBtmText = _this.game.add.bitmapText(0, 0, "font_all_30", "Садись за кресло, чтобы присоединиться к игре.", 24);
            _this._messageBtmText.anchor.set(0, 0.5);
            _this._messageBtmText.maxWidth = mygame.GameConfig.HINT_INITIAL_MAX_WIDTH;
            _this._messageBtmText.align = "center";
            _this.addChild(_this._messageBtmText);
            _this.setLandscape();
            _this.renderBackground();
            return _this;
        }
        Hint.prototype.setStart = function (x, y) {
            this._startXY.x = x;
            this._startXY.y = y;
        };
        Hint.prototype.setOther = function (x, y) {
            this._otherXY.x = x;
            this._otherXY.y = y;
        };
        Hint.prototype.setLandscape = function () {
            this.x = this._startXY.x;
            this.y = this._startXY.y;
            this._isLandscape = true;
            this._renderBackground = this.renderLandscape.bind(this);
            this.renderBackground();
        };
        Hint.prototype.setPortrait = function () {
            this.x = this._otherXY.x;
            this.y = this._otherXY.y;
            this._isLandscape = false;
            this._renderBackground = this.renderPortrait.bind(this);
            this.renderBackground();
        };
        Object.defineProperty(Hint.prototype, "isLandscape", {
            get: function () {
                return this._isLandscape;
            },
            enumerable: true,
            configurable: true
        });
        Hint.prototype.renderPortrait = function () {
            var scaleY = 1;
            var scaleX = Math.max(200, this._messageBtmText.width);
            this._messageBtmText.x = 0;
            this._messageBtmText.anchor.set(0.5, 0.5);
            this._leftBorder.anchor.set(1, 1);
            this._leftBorder.x = -scaleX / 2;
            this._leftBorder.y = 0;
            this._pixel.anchor.set(0, 1);
            this._pixel.x = -scaleX / 2;
            this._rightBorder.anchor.set(1, 1);
            this._rightBorder.x = scaleX / 2;
            if (this._messageBtmText.height > 50) {
                scaleY = (this._messageBtmText.height + 50) / 60;
                this._leftBorder.height = (this._messageBtmText.height + 50);
                this._rightBorder.height = (this._messageBtmText.height + 50);
            }
            else {
                this._leftBorder.height = 60;
                this._rightBorder.height = 60;
            }
            this._pixel.scale.set(scaleX, scaleY);
            this._messageBtmText.y = -this._leftBorder.height / 2;
        };
        Hint.prototype.renderLandscape = function () {
            this._rightBorder.x = this._rightBorder.width;
            this._rightBorder.anchor.set(0, 0.5);
            var scaleY = 1;
            var scaleX = Math.max(200, this._messageBtmText.width);
            this._pixel.anchor.set(0, 0.5);
            this._messageBtmText.anchor.set(0, 0.5);
            this._messageBtmText.y = 0;
            this._messageBtmText.x = this._rightBorder.width;
            this._pixel.x = this._rightBorder.width;
            this._leftBorder.anchor.set(0, 0.5);
            this._leftBorder.x = this._rightBorder.width * 2;
            this._rightBorder.x = this._pixel.x + scaleX - this._rightBorder.width;
            if (this._messageBtmText.height > 50) {
                scaleY = (this._messageBtmText.height + 50) / 60;
                this._leftBorder.height = (this._messageBtmText.height + 50);
                this._rightBorder.height = (this._messageBtmText.height + 50);
            }
            else {
                this._leftBorder.height = 60;
                this._rightBorder.height = 60;
            }
            this._pixel.scale.set(scaleX, scaleY);
        };
        Hint.prototype.show = function () {
            this.alpha = 1;
        };
        Hint.prototype.hide = function () {
            this.alpha = 0;
        };
        Object.defineProperty(Hint.prototype, "maxWidth", {
            set: function (val) {
                this._messageBtmText.maxWidth = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Hint.prototype, "fontSize", {
            set: function (val) {
                this._messageBtmText.fontSize = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Hint.prototype, "message", {
            set: function (val) {
                this._message = val;
                this._messageBtmText.text = this._message;
                this.renderBackground();
            },
            enumerable: true,
            configurable: true
        });
        Hint.prototype.renderBackground = function () {
            this._renderBackground();
        };
        return Hint;
    }(Phaser.Sprite));
    mygame.Hint = Hint;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y, balance) {
            var _this = _super.call(this, game, x, y) || this;
            _this._balance = balance;
            _this._numberOfChips = 0;
            _this._cardCounter = new mygame.CardCounter(_this.game, 0, 100 - 10);
            _this._cardCounter.setRectangleSize(100, 50, 10, 0.7);
            _this._cardCounter.setFontSize(30);
            _this.addChild(_this._cardCounter);
            _this._burst = false;
            _this._cards = [];
            _this._cardsContainer = _this.game.add.sprite(0, 170 + 20);
            _this._cardCounter.visible = false;
            _this.addChild(_this._cardsContainer);
            _this._totalBid = 0;
            return _this;
        }
        Object.defineProperty(Player.prototype, "balance", {
            get: function () {
                return this._balance;
            },
            set: function (val) {
                this._balance = val;
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.myreset = function () {
            this._numberOfChips = 0;
            this._burst = false;
            this._cards.length = 0;
            this._cardCounter.myreset();
            this._cardCounter.visible = false;
            this._cardCounter.alpha = 1;
            this._totalBid = 0;
        };
        Object.defineProperty(Player.prototype, "burst", {
            get: function () {
                return this._burst;
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.bid = function (val) {
            this._balance -= val;
            this._totalBid += val;
            this._numberOfChips++;
        };
        Player.prototype.makeCounterGreen = function () {
            this._cardCounter.makeMeGreen();
        };
        Object.defineProperty(Player.prototype, "currentBid", {
            get: function () {
                return this._totalBid;
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.resetBid = function () {
            this._totalBid = 0;
        };
        Object.defineProperty(Player.prototype, "numberOfChips", {
            get: function () {
                return this._numberOfChips;
            },
            set: function (val) {
                this._numberOfChips = val;
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.addCards = function (cardName) {
            var _this = this;
            var tween;
            var r = 200;
            var dy = 200;
            if (this._cards.length >= 2) {
                for (var i = 0; i < this._cards.length; i++) {
                    var el = this._cards[i];
                    var phi0_1 = -0.15 + 2 * i * 0.15;
                    var len = this._cards.length;
                    var rho_1 = Math.PI / 25 * Math.floor(len) - Math.PI;
                    var newX_1 = (r + 100) * Math.sin(-phi0_1 + rho_1);
                    var newY_1 = r * Math.cos(-phi0_1 + rho_1);
                    var total_1 = 7.5 * this._cards.length;
                    this.game.add.tween(el).to({
                        x: newX_1,
                        angle: -total_1 / 2 + 7.5 * i,
                        y: newY_1
                    }, 300, Phaser.Easing.Sinusoidal.Out, true);
                }
            }
            var phi0 = -0.15 + 2 * this._cards.length * 0.15;
            var rho = Math.PI / 25 * Math.floor(this._cards.length) - Math.PI;
            var newX = (r + 100) * Math.sin(-phi0 + rho);
            var newY = r * Math.cos(-phi0 + rho);
            this._cardCounter.addCard(cardName, false);
            if (this._cardCounter.amount > 21) {
                this._burst = true;
            }
            var card = this.game.add.sprite(500, -300, "objects", "back.png");
            this._cardsContainer.addChild(card);
            card.anchor.set(0.5, 0.5);
            card.scale.set(1.2, 1.2);
            var total = 7.5 * this._cards.length;
            this.game.add.tween(card.scale).to({
                x: 0.1
            }, mygame.GameConfig.CARD_SCALE_TIME, Phaser.Easing.Quadratic.In, true, 100).onComplete.addOnce(function () {
                card.loadTexture("objects", cardName + ".png");
                if (!_this._cardCounter.visible) {
                    _this._cardCounter.visible = true;
                }
                _this.game.add.tween(card.scale).to({
                    x: 1.25
                }, mygame.GameConfig.CARD_SCALE_TIME, Phaser.Easing.Quadratic.Out, true).onComplete.addOnce(function () {
                    if (window["sounds"]) {
                        _this.game.sound.play('new_card', 0.4);
                    }
                }, _this);
            }, this);
            if (this._cards.length >= 2) {
                var phi = -total / 2 + 7.5 * (this._cards.length);
                tween = this.game.add.tween(card).to({
                    x: newX,
                    y: newY,
                    angle: -total / 2 + 7.5 * (this._cards.length)
                }, mygame.GameConfig.CARD_FLY_TIME, Phaser.Easing.Sinusoidal.Out, true);
            }
            else {
                tween = this.game.add.tween(card).to({
                    x: newX + this._cards.length * 30,
                    y: newY,
                    angle: -5 + 10 * (this._cards.length)
                }, mygame.GameConfig.CARD_FLY_TIME, Phaser.Easing.Sinusoidal.Out, true);
            }
            this._cards.push(card);
            return tween;
        };
        Player.prototype.removeCards = function () {
            var _this = this;
            var tween;
            this._cards.forEach(function (el, i) {
                tween = _this.game.add.tween(el).to({
                    x: 0,
                    y: el.y - 500,
                    alpha: 0
                }, mygame.GameConfig.CARD_FLY_TIME, Phaser.Easing.Sinusoidal.Out, true, i * 200);
                tween.onStart.addOnce(function () {
                    _this.game.sound.play('new_card', 0.35);
                }, _this);
                tween.onComplete.addOnce(function () {
                    el.destroy();
                }, _this);
            });
            this.game.add.tween(this._cardCounter).to({
                alpha: 0
            }, 500, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                _this._cardCounter.myreset();
                _this._cardCounter.visible = false;
                _this._cardCounter.alpha = 1;
            });
            return tween;
        };
        Object.defineProperty(Player.prototype, "points", {
            get: function () {
                return this._cardCounter.amount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "cardsInHand", {
            get: function () {
                return this._cardCounter.cardsNumber;
            },
            enumerable: true,
            configurable: true
        });
        return Player;
    }(Phaser.Sprite));
    mygame.Player = Player;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var BackGround = (function (_super) {
        __extends(BackGround, _super);
        function BackGround(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            for (var i = -5; i < 6; i++) {
                for (var j = -5; j < 6; j++) {
                    var bg = _this.game.add.sprite(200 * i, 200 * j, "objects", 'bg.jpg');
                    bg.anchor.set(0.5);
                    _this.addChild(bg);
                }
            }
            return _this;
        }
        return BackGround;
    }(Phaser.Sprite));
    mygame.BackGround = BackGround;
})(mygame || (mygame = {}));
