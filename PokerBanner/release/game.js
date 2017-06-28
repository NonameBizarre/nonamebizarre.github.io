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
            this.icon.x = this.preloadBar.x + this.preloadBar.width / 2;
            this.icon.y = this.preloadBar.y + this.preloadBar.height + 30;
            var timerEvt = this.game.time.events.loop(10, function () {
                this.icon.rotation += 0.1;
            }, this);
            var baseURL = window['baseURL'];
            this.game.load.image('shadow', baseURL + "assets/shadow.png");
            this.game.load.image('background', baseURL + "assets/background.jpg");
            this.game.load.atlasJSONHash("images", baseURL + "assets/images.png", baseURL + 'assets/images.json');
            this.game.load.atlas("banner", baseURL + "assets/banner_assets.png", baseURL + "assets/banner_assets.json");
            this.game.load.bitmapFont('font_all', baseURL + "assets/font_all.png", baseURL + "assets/font_all.fnt");
            this.game.load.audio('win', baseURL + "assets/sounds/win.mp3");
            this.game.load.audio('choose', baseURL + "assets/sounds/choose.mp3");
            this.game.load.audio('chips_bet', baseURL + "assets/sounds/chips_bet.mp3");
            this.game.load.audio('chips_move', baseURL + "assets/sounds/chips_move.mp3");
            this.game.load.audio('click', baseURL + "assets/sounds/click.mp3");
            this.game.load.audio('flop', baseURL + "assets/sounds/flop.mp3");
            this.game.load.audio('new_card', baseURL + "assets/sounds/new_card.mp3");
        };
        Preloader.prototype.create = function () {
            console.log("PRELOADER");
            this.game.state.start('PlayState');
        };
        Preloader.prototype.ChangeSize = function () {
        };
        return Preloader;
    }(Phaser.State));
    mygame.Preloader = Preloader;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var version = '1.0.0';
    var bg;
    var STATE_TYPE;
    (function (STATE_TYPE) {
        STATE_TYPE[STATE_TYPE["UPDATE_TEXT"] = 0] = "UPDATE_TEXT";
        STATE_TYPE[STATE_TYPE["IDLE"] = 1] = "IDLE";
    })(STATE_TYPE || (STATE_TYPE = {}));
    var PlayState = (function (_super) {
        __extends(PlayState, _super);
        function PlayState() {
            return _super.call(this, false) || this;
        }
        PlayState.prototype.create = function () {
            var _this = this;
            this._combinations = [];
            this._cards = [];
            console.log("plays state");
            this.game.stage.smoothed = true;
            this._state = STATE_TYPE.UPDATE_TEXT;
            mygame.Controller.Instance.width = getSize().width;
            mygame.Controller.Instance.height = getSize().height;
            this._currentBalance = 8000;
            if (mygame.Core.isLandscape) {
                this.onLandscape();
            }
            else {
                this.onPortret();
            }
            this._hand = new mygame.Hand();
            this._clicks = 1;
            this._bg = new mygame.OSprite(0, 0);
            this._bg1 = this.game.add.sprite(0, 0, "banner", "back");
            this._bg2 = this.game.add.sprite(this._bg1.width, 0, "banner", "back");
            this._bg1.addChild(this._bg2);
            this._bg.addChild(this._bg1);
            this._table = new mygame.OSprite(mygame.Core.centerX + 200, 0);
            this._table.otherXY(320, 0).end();
            this.game.world.addChild(this._table);
            var logoMain = this.game.add.sprite(200, 10, "banner", "logo_main");
            logoMain.anchor.set(0.5, 0);
            this._table.addChild(logoMain);
            this._tableSprite = this.game.add.sprite(0, 150, "banner", "table");
            this._tableSprite.anchor.set(1, 0);
            this.game.input.onDown.add(function (pointer) {
                console.log(pointer);
            });
            var tableSprite2 = this.game.add.sprite(this._tableSprite.width, 0, "banner", "table");
            tableSprite2.scale.set(-1, 1);
            this._tableSprite.addChild(tableSprite2);
            this._table.addChild(this._tableSprite);
            this.spawnRandomCards();
            var girl = this.game.add.sprite(0, -100, "banner", "girl");
            girl.anchor.set(0.5, 0);
            this._tableSprite.addChild(girl);
            var button = this.game.add.sprite(0, this._tableSprite.height / 2 + 60, "banner", "Button_up");
            button.anchor.set(0.5);
            this._tableSprite.addChild(button);
            button.inputEnabled = true;
            var rerollText = this.game.add.bitmapText(0, 0, "font_all", "Refresh", 35);
            rerollText.anchor.set(0.5);
            button.addChild(rerollText);
            button.events.onInputDown.add(function () {
                button.loadTexture("banner", "Button_down");
            }, this);
            button.events.onInputUp.add(function () {
                button.loadTexture("banner", "Button_up");
                _this.respawnCards();
            });
            for (var i = 0; i < 5; i++) {
                var blank = this.game.add.sprite(-200 + 100 * i, this._tableSprite.height + 25, "banner", "card_back");
                blank.anchor.set(0.5);
                this._tableSprite.addChild(blank);
            }
            var balanceBG = this.game.add.sprite(this._tableSprite.width - 100, 350, "banner", "balance_back");
            balanceBG.anchor.set(0.5);
            this._table.addChild(balanceBG);
            var balanceText = this.game.add.bitmapText(balanceBG.x, balanceBG.y - 40, "font_all", "BALANCE:", 25);
            balanceText.anchor.set(0.5);
            this._table.addChild(balanceText);
            this._currentBalanceText = this.game.add.bitmapText(0, 40, "font_all", "", 25);
            this._currentBalanceText.anchor.set(0.5);
            balanceText.addChild(this._currentBalanceText);
            this.initHelpDesk();
            this.game.scale.onOrientationChange.add(function (scale, prevOrientation, wasIncorrect) {
                if (prevOrientation == "portrait-primary") {
                    _this.onLandscape();
                    _this._helpDesk.resizeHeight = _this._helpHeight;
                    _this._helpDesk.resizeWidth = _this._helpWidth;
                    _this._helpDesk.redrawGraphics(_this._grahicsWidth, _this._graphicsHeight);
                }
                else {
                    _this.onPortret();
                    _this._helpDesk.resizeHeight = _this._helpHeight;
                    _this._helpDesk.resizeWidth = _this._helpWidth;
                    _this._helpDesk.redrawGraphics(_this._grahicsWidth, _this._graphicsHeight);
                }
            }, this);
        };
        PlayState.prototype.initHelpDesk = function () {
            this._helpDesk = new mygame.HelpDesk(10, 10);
            this._helpDesk.otherXY(0, this._tableSprite.height + 250).end();
            this._helpDesk.resizeHeight = this._helpHeight;
            this._helpDesk.resizeWidth = this._helpWidth;
            this._helpDesk.graphicsHeight = this._graphicsHeight;
            this._helpDesk.graphicsWidth = this._grahicsWidth;
            this._helpDesk.intialize();
            this.addHandTypes();
        };
        PlayState.prototype.addHandTypes = function () {
            var posy = 50;
            for (var i = 0; i < mygame.GameConfig.CARDS.length; i++) {
                this.generateCardSeq(mygame.GameConfig.CARDS[i], mygame.GameConfig.NAMES[i], mygame.GameConfig.PRICES[i], posy);
                posy += 65;
            }
        };
        PlayState.prototype.generateCardSeq = function (cards, name, price, posy) {
            var _this = this;
            var posx = 0;
            var combination = new mygame.Combination(40 + 10, posy + 10);
            if (this._combinations.length > 4) {
                combination.otherXY(300, 600 + posy);
            }
            else {
                combination.otherXY(40, 600 + posy);
            }
            this._combinations.push(combination);
            combination.yellowBorderWidth = this._frameWidth;
            this.game.world.addChild(combination);
            cards.split(' ').forEach(function (name) {
                var suit = _this.name2suit(name[1]);
                var card = new mygame.Card(_this.game, posx, 0, suit, name[0]);
                card.myScale = 0.5;
                combination.addCard(card);
                posx += 50;
            });
            var nameBitmapText = this.game.add.bitmapText(posx + 50, -30, "font_all", name, 21);
            nameBitmapText.anchor.set(0.5, 0);
            combination.addText(nameBitmapText);
            var str = "$";
            if (price < 1000) {
                str += price.toString();
            }
            else {
                var thousands = Math.floor(price / 1000).toString();
                var rest = (price % 1000).toString();
                while (rest.length < 3) {
                    rest += "0";
                }
                str += thousands + " " + rest;
            }
            var priceText = this.game.add.bitmapText(posx + 50, nameBitmapText.y + 25, "font_all", str, 21);
            priceText.anchor.set(0.5, 0);
            combination.addText(priceText);
        };
        PlayState.prototype.name2suit = function (name) {
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
                    suit = mygame.SUIT.DIAMONDS;
                    break;
                default:
                    break;
            }
            return suit;
        };
        PlayState.prototype.respawnCards = function () {
            var _this = this;
            var destroy = 0;
            var delay = 0;
            if (this._cards.length > 0) {
                this._cards.forEach(function (card) {
                    destroy++;
                    card.playDestroy(function () {
                        destroy--;
                        if (destroy == 0) {
                            _this.spawnRandomCards();
                        }
                    }, delay);
                    delay += 100;
                }, this);
                this._cards = [];
            }
            else {
                this.spawnRandomCards();
            }
        };
        PlayState.prototype.onPortret = function () {
            _super.prototype.onPortret.call(this);
            this._helpHeight = 11.44;
            this._helpWidth = 15.89;
            this._frameWidth = 131;
            this._grahicsWidth = 580;
            this._graphicsHeight = 430;
        };
        PlayState.prototype.onLandscape = function () {
            _super.prototype.onLandscape.call(this);
            console.log("landscape");
            this._helpHeight = 15.28;
            this._helpWidth = 9.61;
            this._frameWidth = 289;
            this._grahicsWidth = 360;
            this._graphicsHeight = 560;
        };
        PlayState.prototype.spawnRandomCards = function () {
            var _this = this;
            var posx = -135;
            var delay = 0;
            var _loop_1 = function (i) {
                var suit = void 0;
                var face = void 0;
                do {
                    suit = this_1.game.rnd.between(0, 3);
                    face = mygame.Card.FACES[this_1.game.rnd.between(0, mygame.Card.FACES.length - 1)];
                } while (this_1.isCardExists(suit, face));
                var card = new mygame.Card(this_1.game, 0, 30, suit, face);
                card.scale.set(0);
                card.scale.set(0.5);
                card.alpha = 0;
                this_1._cards.push(card);
                this_1._tableSprite.addChild(card);
                card.inputEnabled = true;
                card.events.onInputDown.add(function () {
                    if (_this._clicks <= 5) {
                        var id = _this._cards.indexOf(card);
                        _this._tableSprite.swapChildren(card, _this._tableSprite.children[_this._tableSprite.children.length - 1]);
                        _this._cards.splice(id, 1);
                        card.flyToHand(-300 + 100 * _this._clicks);
                        _this._clicks++;
                        card.onCompleteCallback = function () {
                            _this._hand.addCard(card);
                            if (_this._hand.amountOfCards == 5) {
                                var id_1 = mygame.GameConfig.PRICES.length - 1 - _this._hand.analyzeHand();
                                _this._currentBalance += mygame.GameConfig.PRICES[id_1];
                                _this._combinations[id_1].highlightAnimation();
                                _this._state = STATE_TYPE.UPDATE_TEXT;
                                _this.game.time.events.add(100, function () {
                                    _this._hand.clean(function () {
                                        _this._clicks = 1;
                                        _this.respawnCards();
                                    });
                                }, _this);
                            }
                        };
                    }
                    card.events.onInputDown.removeAll();
                }, this_1);
                this_1.game.add.tween(card).to({
                    x: posx,
                    y: 130,
                    alpha: 1
                }, 250, Phaser.Easing.Sinusoidal.InOut, true, delay);
                this_1.game.add.tween(card.scale).to({
                    x: 1,
                    y: 1
                }, 250, Phaser.Easing.Sinusoidal.InOut, true, delay);
                posx += 65;
                delay += 100;
            };
            var this_1 = this;
            for (var i = 0; i < 5; i++) {
                _loop_1(i);
            }
        };
        PlayState.prototype.isCardExists = function (suit, face) {
            var result = false;
            for (var i = 0; i < this._cards.length; i++) {
                var card = this._cards[i];
                result = (card.suit == suit && card.face == face);
                if (result) {
                    break;
                }
            }
            return this._hand.hasInHand(face, suit) || result;
        };
        PlayState.prototype.update = function () {
            switch (this._state) {
                case STATE_TYPE.UPDATE_TEXT:
                    {
                        var thousands = Math.floor(this._currentBalance / 1000).toString();
                        var rest = (this._currentBalance % 1000).toString();
                        while (rest.length < 3) {
                            rest = "0" + rest;
                        }
                        this._currentBalanceText.text = "$" + thousands + " " + rest;
                        this._state = STATE_TYPE.IDLE;
                    }
                    break;
                default:
                    break;
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
    function setupLandscape() {
        bg.x = (getSize().width - bg.width) / 2;
        var w = getSize().width;
        var s = ((w * 100) / 1280) / 100;
    }
    function setupPortrait() {
        bg.x = (getSize().width - bg.width) / 2;
        var w = getSize().width;
        var s = ((w * 100) / 720) / 100;
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
        Controller.prototype.playSound = function (soundName) {
            if (this.soundsEnabled) {
            }
        };
        Controller.prototype.addTable = function (game, table) {
        };
        Controller.prototype.selectHand = function (id) {
        };
        return Controller;
    }());
    Controller.LANDSCAPE = "landscape";
    Controller.PORTRAIT = "portrait";
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
            this.FLUSH_ROYAL = { en: 'FLUSH ROYAL', ru: 'FLUSH_ROYAL' };
            this.THREE_OF_A_KIND = { en: 'THREE OF A KIND', ru: 'THREE_OF_A_KIND' };
            this.FULL_HOUSE = { en: 'FULL HOUSE', ru: 'ФУЛЛ ХАУС' };
            this.STRAIGHT_FLUSH = { en: 'STRAIGHT FLUSH', ru: 'СТРИТ-ФЛЕШ' };
            this.FLUSH = { en: 'FLUSH', ru: 'ФЛЕШ' };
            this.PAIR = { en: 'PAIR', ru: 'ПАРА' };
            this.FOUR_OF_A_KIND = { en: 'FOUR OF A KIND', ru: 'КАРЕ' };
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
    var SUIT;
    (function (SUIT) {
        SUIT[SUIT["SPADES"] = 0] = "SPADES";
        SUIT[SUIT["HEARTS"] = 1] = "HEARTS";
        SUIT[SUIT["CLUBS"] = 2] = "CLUBS";
        SUIT[SUIT["DIAMONDS"] = 3] = "DIAMONDS";
    })(SUIT = mygame.SUIT || (mygame.SUIT = {}));
    var Card = (function (_super) {
        __extends(Card, _super);
        function Card(game, x, y, suit, face) {
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
            _this._sprite = _this.game.add.sprite(0, 0, "banner", _this._cardName.toLowerCase());
            _this._sprite.anchor.set(0.5);
            _this._sprite.scale.set(0.65);
            _this.addChild(_this._sprite);
            return _this;
        }
        Card.prototype.discard = function (x, y, dx, callback) {
            var _this = this;
            this.game.add.tween(this).to({
                x: this.x + dx
            }, 200, Phaser.Easing.Sinusoidal.InOut, true);
            this.game.add.tween(this._sprite.scale).to({
                x: 1.2,
                y: 1.2
            }, 200, Phaser.Easing.Sinusoidal.InOut, true).onComplete.add(function () {
                _this.game.add.tween(_this._sprite.scale).to({
                    x: 0.65,
                    y: 0.65
                }, 300, Phaser.Easing.Sinusoidal.InOut, true);
                _this.game.add.tween(_this).to({
                    x: x,
                    y: y,
                    alpha: 0
                }, 300, Phaser.Easing.Sinusoidal.InOut, true).onComplete.add(function () {
                    callback();
                    _this.destroy();
                }, _this);
            }, this);
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
            this.game.add.tween(this._sprite.scale).to({
                x: 1,
                y: 1
            }, 300, Phaser.Easing.Sinusoidal.InOut, true);
            var tween = this.game.add.tween(this).to({
                y: 380,
                x: posx
            }, 300, Phaser.Easing.Sinusoidal.InOut, true);
            tween.onComplete.add(function () {
                _this._cb();
            }, this);
            console.log("fly to hand");
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
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super.call(this, 1136, 640, Phaser.AUTO, 'mdsp-creative', null, false, true) || this;
            mygame.Core.init(1136, 640);
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
    var HAND_TYPE;
    (function (HAND_TYPE) {
        HAND_TYPE[HAND_TYPE["HIGH_CARD"] = 0] = "HIGH_CARD";
        HAND_TYPE[HAND_TYPE["ONE_PAIR"] = 1] = "ONE_PAIR";
        HAND_TYPE[HAND_TYPE["TWO_PAIR"] = 2] = "TWO_PAIR";
        HAND_TYPE[HAND_TYPE["THREE_OF_A_KIND"] = 3] = "THREE_OF_A_KIND";
        HAND_TYPE[HAND_TYPE["STRAIGHT"] = 4] = "STRAIGHT";
        HAND_TYPE[HAND_TYPE["FLUSH"] = 5] = "FLUSH";
        HAND_TYPE[HAND_TYPE["FULL_HOUSE"] = 6] = "FULL_HOUSE";
        HAND_TYPE[HAND_TYPE["FOUR_OF_A_KIND"] = 7] = "FOUR_OF_A_KIND";
        HAND_TYPE[HAND_TYPE["STRAIGHT_FLUSH"] = 8] = "STRAIGHT_FLUSH";
    })(HAND_TYPE || (HAND_TYPE = {}));
    var Hand = (function () {
        function Hand() {
            this._cards = [];
        }
        Object.defineProperty(Hand.prototype, "amountOfCards", {
            get: function () {
                return this._cards.length;
            },
            enumerable: true,
            configurable: true
        });
        Hand.prototype.addCard = function (card) {
            if (this._cards.length < 5) {
                this._cards.push(card);
            }
            else {
                throw new Error("Too many cards in hand");
            }
        };
        Hand.prototype.clean = function (callback) {
            var _this = this;
            var x, y;
            if (mygame.Core.isLandscape) {
                x = 0;
                y = 550;
            }
            else {
                x = 0;
                y = 700;
            }
            var discard = 0;
            this._cards.forEach(function (card) {
                discard++;
                card.discard(x, y, -15 + 10 * discard, function () {
                    discard--;
                    if (discard == 0) {
                        _this._cards.length = 0;
                        callback();
                    }
                });
            });
        };
        Hand.prototype.hasInHand = function (face, suit) {
            for (var i = 0; i < this._cards.length; i++) {
                var card = this._cards[i];
                if (card.suit == suit && card.face == face) {
                    return true;
                }
            }
            return false;
        };
        Hand.prototype.analyzeHand = function () {
            var result = HAND_TYPE.HIGH_CARD;
            var suitCount = new Array(4);
            var faceCount = new Array(13);
            for (var i = 0; i < suitCount.length; i++) {
                suitCount[i] = 0;
            }
            for (var i = 0; i < faceCount.length; i++) {
                faceCount[i] = 0;
            }
            this._cards.forEach(function (x) {
                var faceId = mygame.Card.FACES.indexOf(x.face);
                faceCount[faceId]++;
                suitCount[x.suit]++;
            });
            result = this.analyzeHandHelper(faceCount, suitCount);
            return result;
        };
        Hand.prototype.analyzeHandHelper = function (faceCount, suitCount) {
            var p1, p2, t, f, fl, st;
            p1 = p2 = t = f = fl = st = false;
            faceCount.forEach(function (x) {
                switch (x) {
                    case 2:
                        {
                            if (!p1) {
                                p1 = true;
                            }
                            else {
                                p2 = true;
                            }
                        }
                        break;
                    case 3:
                        {
                            t = true;
                        }
                        break;
                    case 4:
                        {
                            f = true;
                        }
                        break;
                    default:
                        break;
                }
            });
            suitCount.forEach(function (x) {
                if (x == 5) {
                    fl = true;
                }
            });
            if (!p1 && !p2 && !t && !f) {
                var s = 0;
                for (var i = 0; i < faceCount.length; i++) {
                    var fc = faceCount[i];
                    if (fc) {
                        s++;
                    }
                    else {
                        s = 0;
                    }
                    if (s == 5) {
                        break;
                    }
                }
                st = (s == 5) || (s == 4 && faceCount[0] && !faceCount[1]);
            }
            if (st && fl)
                return HAND_TYPE.STRAIGHT_FLUSH;
            else if (f)
                return HAND_TYPE.FOUR_OF_A_KIND;
            else if (p1 && t)
                return HAND_TYPE.FULL_HOUSE;
            else if (fl)
                return HAND_TYPE.FLUSH;
            else if (st)
                return HAND_TYPE.STRAIGHT;
            else if (t)
                return HAND_TYPE.THREE_OF_A_KIND;
            else if (p1 && p2)
                return HAND_TYPE.TWO_PAIR;
            else if (p1)
                return HAND_TYPE.ONE_PAIR;
            else
                return HAND_TYPE.HIGH_CARD;
        };
        return Hand;
    }());
    mygame.Hand = Hand;
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
var mygame;
(function (mygame) {
    var GameConfig = (function () {
        function GameConfig() {
        }
        return GameConfig;
    }());
    GameConfig.CARDS = [
        "9s 8s 7s 6s 5s",
        "7s 7h 7c 7d 3h",
        "jh jd js 5c 5h",
        "jc tc 8c 4c 2c",
        "5d 4s 3c 2h ac",
        "8d 8h 8s 5c 3s",
        "9h 9d 8c 8s 3s",
        "9h 9d 6s 3c 2s",
        "kh 9d 8s 5c 4d"
    ];
    GameConfig.NAMES = [
        "Straight flush",
        "Four of a kind",
        "Full house",
        "Flush",
        "Straight",
        "Three of a kind",
        "Two pair",
        "Pair",
        "High card"
    ];
    GameConfig.PRICES = [
        4000,
        2000,
        1500,
        1000,
        750,
        500,
        300,
        150,
        50
    ];
    mygame.GameConfig = GameConfig;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Combination = (function (_super) {
        __extends(Combination, _super);
        function Combination(x, y) {
            var _this = _super.call(this, x, y) || this;
            _this._cards = [];
            _this._texts = [];
            _this._container = _this.game.add.sprite(0, 0);
            _this.addChild(_this._container);
            _this._frameContainer = _this.game.add.sprite(-40, -50);
            _this.addChild(_this._frameContainer);
            _this._yellowBorder = _this.game.add.sprite(0, 0, "banner", "frame_big");
            _this._frameContainer.addChild(_this._yellowBorder);
            _this._framePart = _this.game.add.sprite(_this._yellowBorder.width, 0, "banner", "frame_part");
            _this._frameContainer.addChild(_this._framePart);
            var endBorder = _this.game.add.sprite(350, 0, "banner", "frame_big");
            endBorder.scale.set(-1, 1);
            endBorder.anchor.set(1, 0);
            _this._frameContainer.addChild(endBorder);
            _this._frameContainer.alpha = 0;
            return _this;
        }
        Object.defineProperty(Combination.prototype, "yellowBorderWidth", {
            set: function (val) {
                this._framePart.scale.x = val;
            },
            enumerable: true,
            configurable: true
        });
        Combination.prototype.addCard = function (val) {
            this._cards.push(val);
            this._container.addChild(val);
        };
        Combination.prototype.getBitmapText = function (val) {
            return this._texts[val];
        };
        Combination.prototype.addText = function (val) {
            this._texts.push(val);
            this._container.addChild(val);
        };
        Combination.prototype.highlight = function () {
            this._frameContainer.alpha = 1;
        };
        Combination.prototype.highlightAnimation = function () {
            var _this = this;
            this.game.add.tween(this._frameContainer).to({
                alpha: 1
            }, 200, Phaser.Easing.Sinusoidal.InOut, true).onComplete.add(function () {
                _this.game.add.tween(_this._frameContainer).to({
                    alpha: 0
                }, 200, Phaser.Easing.Sinusoidal.InOut, true);
            }, this);
        };
        return Combination;
    }(mygame.OSprite));
    mygame.Combination = Combination;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var HelpDesk = (function (_super) {
        __extends(HelpDesk, _super);
        function HelpDesk(x, y) {
            return _super.call(this, x, y) || this;
        }
        Object.defineProperty(HelpDesk.prototype, "resizeWidth", {
            set: function (val) {
                this._helpWidth = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HelpDesk.prototype, "resizeHeight", {
            set: function (val) {
                this._helpHeight = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HelpDesk.prototype, "graphicsWidth", {
            set: function (val) {
                this._graphicsWidth = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HelpDesk.prototype, "graphicsHeight", {
            set: function (val) {
                this._graphicsHeight = val;
            },
            enumerable: true,
            configurable: true
        });
        HelpDesk.prototype.redrawGraphics = function (width, height) {
            this._middleUp.scale.x = this._helpWidth;
            this._middleRight.scale.y = this._helpHeight;
            this._middleDOWN.scale.x = this._helpWidth;
            this._middleLeft.scale.y = this._helpHeight;
            this._graphicsHeight = height;
            this._graphicsWidth = width;
            this._middleUp.x = this._leftUp.width;
            this._rightUP.position.set(this._middleUp.width + this._leftUp.width, 0);
            this._middleRight.position.set(this._rightUP.x, this._rightUP.width);
            this._rightDown.position.set(this._rightUP.x, this._middleRight.height + this._rightUP.height);
            this._middleDOWN.position.set(this._leftUp.width, this._middleRight.height + this._rightDown.height);
            this._leftDown.position.set(0, this._middleDOWN.y);
            this._middleLeft.position.set(0, this._leftUp.width);
            this._graphics.clear();
            this._graphics.beginFill(0x003A66);
            this._graphics.drawRect(0, 0, this._graphicsWidth, this._graphicsHeight);
            this._graphics.endFill();
        };
        HelpDesk.prototype.intialize = function () {
            this._leftUp = this.game.add.sprite(0, 0, "banner", "LeftUp");
            this.addChild(this._leftUp);
            this._middleUp = this.game.add.sprite(this._leftUp.width, 0, "banner", "MiddleUp");
            this._middleUp.scale.x = this._helpWidth;
            this.addChild(this._middleUp);
            this._rightUP = this.game.add.sprite(this._middleUp.width + this._leftUp.width, 0, "banner", "RightUp");
            this.addChild(this._rightUP);
            this._middleRight = this.game.add.sprite(this._rightUP.x, this._rightUP.width, "banner", "RightMiddle");
            this._middleRight.scale.y = this._helpHeight;
            this.addChild(this._middleRight);
            this._rightDown = this.game.add.sprite(this._rightUP.x, this._middleRight.height + this._rightUP.height, "banner", "RightDown");
            this.addChild(this._rightDown);
            this._middleDOWN = this.game.add.sprite(this._leftUp.width, this._middleRight.height + this._rightDown.height, "banner", "MiddleDown");
            this._middleDOWN.scale.x = this._helpWidth;
            this.addChild(this._middleDOWN);
            this._leftDown = this.game.add.sprite(0, this._middleDOWN.y, "banner", "LeftDown");
            this.addChild(this._leftDown);
            this._middleLeft = this.game.add.sprite(0, this._leftUp.width, "banner", "LeftMiddle");
            this._middleLeft.scale.y = this._helpHeight;
            this.addChild(this._middleLeft);
            this._graphics = this.game.add.graphics(30, 30);
            this._graphics.beginFill(0x003A66);
            this._graphics.drawRect(0, 0, this._graphicsWidth, this._graphicsHeight);
            this._graphics.endFill();
            this.addChild(this._graphics);
        };
        return HelpDesk;
    }(mygame.OSprite));
    mygame.HelpDesk = HelpDesk;
})(mygame || (mygame = {}));
