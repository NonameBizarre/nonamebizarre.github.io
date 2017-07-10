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
            this.game.load.image('shadow', baseURL + "assets/shadow.png");
            this.game.load.image('background', baseURL + "assets/" + window["bgName"]);
            this.game.load.image('table', baseURL + "assets/" + window["tableName"] + ".png");
            this.game.load.image("blue_chip", baseURL + "assets/blue_chip.png");
            this.game.load.atlas("banner", baseURL + "assets/banner_assets.png", baseURL + "assets/banner_assets.json");
            this.game.load.atlas("objects", baseURL + "assets/objects.png", baseURL + "assets/objects.json");
            this.game.load.bitmapFont('font_all', baseURL + "assets/font_all.png", baseURL + "assets/font_all.fnt");
            this.game.load.bitmapFont('font_all_30', baseURL + "assets/font_all_30.png", baseURL + "assets/font_all_30.fnt");
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
    var STATES;
    (function (STATES) {
        STATES[STATES["IDLE"] = 0] = "IDLE";
        STATES[STATES["EXECUTE"] = 1] = "EXECUTE";
    })(STATES = mygame.STATES || (mygame.STATES = {}));
    var PlayState = (function (_super) {
        __extends(PlayState, _super);
        function PlayState() {
            var _this = _super.call(this, false) || this;
            _this._bots = [];
            _this._state = STATES.IDLE;
            _this._actions = mygame.GameConfig.actions.slice();
            _this._totalBid = 0;
            _this._actors = [];
            _this._bidStack = [];
            return _this;
        }
        PlayState.prototype.create = function () {
            var _this = this;
            this._openFinishScreen = false;
            this.game.time.advancedTiming = true;
            console.log("plays state1234");
            this.game.stage.smoothed = true;
            this._background = new mygame.OSprite(mygame.Core.centerX, mygame.Core.centerY, "background")
                .myScale(2.53)
                .end();
            this.game.world.addChild(this._background);
            this._tableContainer = new mygame.OSprite(mygame.Core.centerX, mygame.Core.centerY);
            var tableLeft = this.game.add.sprite(0, 0, "table");
            tableLeft.anchor.set(1, 0.5);
            this._tableContainer.addChild(tableLeft);
            var tableRight = this.game.add.sprite(0, 0, "table");
            tableRight.anchor.set(1, 0.5);
            tableRight.scale.set(-1, 1);
            this._tableContainer.addChild(tableRight);
            var logo = this.game.add.sprite(0, -30, "objects", "logo_in_table.png");
            logo.anchor.set(0.5);
            this._tableContainer.addChild(logo);
            this._girl = this.game.add.sprite(0, -210, "objects", "girl.png");
            this._girl.anchor.set(0.5);
            this._tableContainer.addChild(this._girl);
            this.game.world.addChild(this._tableContainer);
            this._dealer = new mygame.Dealer();
            this._dealer.nextCommandCallback = function () {
                _this._state = STATES.EXECUTE;
            };
            this._graphics = this.game.add.graphics(0, 0);
            this.game.world.addChild(this._graphics);
            this._graphics.alpha = 0;
            this._bmtTotalBid = this.game.add.bitmapText(0, 0, "font_all_30", "$ 10", 24);
            this._bmtTotalBid.anchor.set(0, 0.5);
            this._bmtTotalBid.alpha = 0;
            this.game.world.addChild(this._bmtTotalBid);
            this.initBots();
            this.initButtons();
        };
        PlayState.prototype.initButtons = function () {
            var _this = this;
            this._foldButton = this.addButton(-200, 300, "Fold");
            this._foldButton.events.onInputDown.add(function () {
                _this._player.fold();
                _this.hideButtons();
            }, this);
            this._checkButton = this.addButton(-200 + 275, 300, "Check");
            this._checkButton.events.onInputDown.add(function () {
                _this._player.bid(_this._dealer.highestBid);
                _this._totalBid += _this._dealer.highestBid;
                _this.hideButtons();
            }, this);
            this._callButton = this.addButton(-200 + 275 * 2, 300, "Call");
            this._callButton.events.onInputDown.add(function () {
                _this._player.bid(_this._dealer.highestBid * 2);
                _this._dealer.highestBid = _this._dealer.highestBid * 2;
                _this._totalBid += _this._dealer.highestBid;
                _this.hideButtons();
            }, this);
        };
        PlayState.prototype.addButton = function (x, y, text) {
            var sprite = this.game.add.sprite(x, y, "objects", "btn_back.png");
            sprite.anchor.set(0.5);
            var btmText = this.game.add.bitmapText(0, 0, "font_all_30", text, 30);
            btmText.anchor.set(0.5);
            sprite.addChild(btmText);
            sprite.alpha = 0;
            this._tableContainer.addChild(sprite);
            return sprite;
        };
        PlayState.prototype.initBots = function () {
            var _this = this;
            var botIds = [2, 5, 4, 9];
            var xPositions = [-200, 200, -300, 300];
            var chipsPositions = [[-60, 100], [0, 95], [120, -60], [-130, -85]];
            var dCardPositions = [[0, 0], [0, 0], [10, 10], [-10, 10]];
            var flips = [[false, false], [false, true], [true, false], [true, true]];
            for (var i = 0; i < 2; i++) {
                var bot1 = new mygame.Bot(this.game, xPositions[i], -230, botIds[2 * i], flips[i][0], flips[i][1]);
                var bot2 = new mygame.Bot(this.game, xPositions[i + 2], 80, botIds[2 * i + 1], flips[i + 2][0], flips[i + 2][1]);
                bot1.setChipPoisition(chipsPositions[i][0], chipsPositions[i][1]);
                bot2.setChipPoisition(chipsPositions[i + 2][0], chipsPositions[i + 2][1]);
                bot1.dCard(dCardPositions[i][0], dCardPositions[i][1]);
                bot2.dCard(dCardPositions[i + 2][0], dCardPositions[i + 2][1]);
                this._tableContainer.addChild(bot1);
                this._tableContainer.addChild(bot2);
                this._bots.push(bot1);
                this._bots.push(bot2);
                this._dealer.addBot(bot1);
                this._dealer.addBot(bot2);
                bot1.nextCommandCallback = function () {
                    _this._state = STATES.EXECUTE;
                };
                bot2.nextCommandCallback = function () {
                    _this._state = STATES.EXECUTE;
                };
                bot1.getGirlPositionCallback = function () {
                    return _this._girl.worldPosition;
                };
                bot2.getGirlPositionCallback = function () {
                    return _this._girl.worldPosition;
                };
                this._actors.push(bot1);
                this._actors.push(bot2);
            }
            this._player = new mygame.Player(this.game, 0, 170);
            this._player.setChipPoisition(-10, -130);
            this._player.nextCommandCallback = function () {
                _this._state = STATES.EXECUTE;
            };
            this._player.getGirlPositionCallback = function () {
                return _this._girl.worldPosition;
            };
            this._player.startTimerCallback = function () {
                _this.game.time.events.add(window["waitingTime"] * 1000, function () {
                    _this.openFinishScreen();
                }, _this);
            };
            this._dealer.addBot(this._player);
            this._tableContainer.addChild(this._player);
            this._actors.push(this._player);
            this._state = STATES.IDLE;
        };
        PlayState.prototype.openFinishScreen = function () {
            if (this._openFinishScreen) {
                return;
            }
            this._openFinishScreen = true;
            this._finishScreen = new mygame.FinishScreen(this.game, 0, 0, [3, 3, 3, 0], this._player.balance);
        };
        PlayState.prototype.update = function () {
            var _this = this;
            if (this._state == STATES.IDLE && !this._openFinishScreen) {
                this._actors.forEach(function (x) { return x.update(); });
            }
            if (this._state == STATES.EXECUTE && this._actions.length > 0 && !this._openFinishScreen) {
                var command = this._actions.shift();
                switch (command[0]) {
                    case "g":
                        {
                            this._dealer.giveCards();
                            this._state = STATES.EXECUTE;
                        }
                        break;
                    case "a":
                        {
                            this._dealer.addCardsOnTable(this._tableContainer, 1000);
                            this._state = STATES.IDLE;
                        }
                        break;
                    case "b":
                        {
                            this._state = STATES.IDLE;
                            console.log(command);
                            var id = +command[1];
                            var amount = +command.slice(2);
                            try {
                                this._bidStack.push(id);
                                if (amount < 0) {
                                    amount = this._dealer.highestBid;
                                }
                                this._totalBid += amount;
                                this._bots[id].bid(amount);
                                if (amount > this._dealer.highestBid) {
                                    this._dealer.highestBid = amount;
                                }
                            }
                            catch (e) {
                                debugger;
                                console.log("undefined " + id + ", amount: " + amount);
                            }
                        }
                        break;
                    case "f":
                        {
                            this._state = STATES.IDLE;
                            var id = +command[1];
                            this._bots[id].fold();
                            console.log("pass");
                        }
                        break;
                    case "h":
                        {
                            this._state = STATES.IDLE;
                            this.showPlayerControls();
                            this._state = STATES.IDLE;
                            console.log("human = ", this._state);
                        }
                        break;
                    case "s":
                        {
                            this._state = STATES.IDLE;
                            this._dealer.revealCards();
                        }
                        break;
                    case "m":
                        {
                            console.log("wtf! = ", this._state);
                            this._graphics.clear();
                            this._graphics.beginFill(0x000000, 0.5);
                            this._graphics.drawRoundedRect(this._girl.worldPosition.x, this._girl.worldPosition.y + 65, 80, 30, 10);
                            this._graphics.endFill();
                            this._bmtTotalBid.position.set(this._girl.worldPosition.x + 30, this._girl.worldPosition.y + 65 + 15);
                            this._bmtTotalBid.text = "$" + this._totalBid;
                            var tween = void 0;
                            for (var i = 0; i < this._actors.length; i++) {
                                var tempTween = this._actors[i].moneyToDealer();
                                if (tempTween != null) {
                                    tween = tempTween;
                                }
                            }
                            this._state = STATES.IDLE;
                            tween.onComplete.addOnce(function () {
                                _this.game.add.tween(_this._graphics).to({
                                    alpha: 1
                                }, 400, Phaser.Easing.Sinusoidal.InOut, true);
                                _this.game.add.tween(_this._bmtTotalBid).to({
                                    alpha: 1
                                }, 400, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                                    _this.game.time.events.add(500, function () {
                                        _this._state = STATES.EXECUTE;
                                    }, _this);
                                }, _this);
                            });
                        }
                        break;
                    case "c":
                        {
                            var id = +command[5];
                        }
                        break;
                    case "r":
                        {
                            this._state = STATES.IDLE;
                            this._bots.forEach(function (x) { return x.myReset(); });
                            this._player.myReset();
                            this._dealer.hideCards();
                            this.game.time.events.add(2000, function () {
                                _this._state = STATES.EXECUTE;
                            });
                            this._bidStack.length = 0;
                        }
                        break;
                    case "w":
                        {
                            var winnerId = this._dealer.winner();
                            var winnerCoord_1;
                            winnerCoord_1 = new Phaser.Point(this._actors[winnerId].worldPosition.x, this._actors[winnerId].worldPosition.y);
                            this._actors[winnerId].updateBalance(this._totalBid);
                            this._totalBid = 0;
                            this.game.add.tween(this._graphics).to({
                                alpha: 0
                            }, 700, Phaser.Easing.Sinusoidal.InOut, true);
                            this.game.add.tween(this._bmtTotalBid).to({
                                alpha: 0
                            }, 700, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                                _this._actors.forEach(function (x) {
                                    x.sendChipsToWinnet(winnerCoord_1);
                                });
                                _this.game.time.events.add(1000, function () {
                                    _this._state = STATES.EXECUTE;
                                }, _this);
                            });
                            this._state = STATES.IDLE;
                        }
                        break;
                    default:
                        {
                            console.log(command);
                            debugger;
                        }
                        break;
                }
            }
        };
        PlayState.prototype.showPlayerControls = function () {
            this._state = STATES.IDLE;
            this.showButton(this._foldButton);
            this.showButton(this._checkButton);
            this.showButton(this._callButton);
        };
        PlayState.prototype.showButton = function (sprite) {
            this.game.add.tween(sprite).to({
                alpha: 1
            }, 1000, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                sprite.inputEnabled = true;
            });
        };
        PlayState.prototype.hideButtons = function () {
            this.hideButton(this._foldButton);
            this.hideButton(this._callButton);
            this.hideButton(this._checkButton);
        };
        PlayState.prototype.hideButton = function (sprite) {
            sprite.inputEnabled = false;
            this.game.add.tween(sprite).to({
                alpha: 0
            }, 200, Phaser.Easing.Sinusoidal.InOut, true);
        };
        PlayState.prototype.render = function () {
            this.game.debug.text("" + this.game.time.fps, 2, 15, "#00ff00");
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
            this.YOU_WIN = { en: 'YOU WIN', ru: 'ВЫИГРЫШ' };
            this.GOOD_TRY = { en: 'Good try!', ru: 'Хорошая попытка!' };
            this.REFRESH = { en: 'Refresh: ', ru: 'Раздачи: ' };
            this.TUTORIAL_STEP1 = { en: 'Collect cards from the table', ru: '  Соберите карты со стола' };
            this.TUTORIAL_STEP2 = { en: 'Now refresh the cards', ru: 'Теперь обновите карты' };
            this.TUTORIAL_STEP3 = { en: 'There is only one card left\nbefore the combination.', ru: 'Чтобы собрать комбинацию\nнужна ещё одна карта.' };
            this.STRAIGHT = { en: 'Straight', ru: 'Стрит' };
            this.HIGH_CARD = { en: 'High card', ru: 'Старшая карта' };
            this.THREE_OF_A_KIND = { en: 'Three of a kind', ru: 'Сет' };
            this.FULL_HOUSE = { en: 'Full house', ru: 'Фулл-хаус' };
            this.STRAIGHT_FLUSH = { en: "Straight flush", ru: 'Стрит-флеш' };
            this.FLUSH = { en: 'Flush', ru: 'Флеш' };
            this.PAIR = { en: 'Pair', ru: 'Пара' };
            this.TWO_PAIR = { en: 'Two pair', ru: 'Две пары' };
            this.FOUR_OF_A_KIND = { en: 'Four of a kind', ru: 'Каре' };
            this.PLAYHINT = { en: 'PLAY', ru: 'ИГРАТЬ' };
            this.LIKE = { en: 'LIKE POKER?', ru: 'НРАВИТСЯ ПОКЕР?' };
            this.GETAPP = {
                en: 'GET ON A NEW LEVEL WITH THIS APP!',
                ru: 'ДОСТИГНИТЕ НОВОГО УРОВНЯ С ЭТИМ ПРИЛОЖЕНИЕМ!'
            };
            this.GAMENAME = {
                en: 'Pokerist: Texas Holdem Poker Online!',
                ru: 'Pokerist: Техасский Покер Онлайн!'
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
            _this._sprite.scale.set(0.75);
            _this._sprite.anchor.set(0.5);
            _this.addChild(_this._sprite);
            return _this;
        }
        Card.prototype.reveal = function (delay) {
            var _this = this;
            var firstTween = this.game.add.tween(this.scale).to({
                x: 0
            }, 200, Phaser.Easing.Sinusoidal.InOut, true, delay);
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
            this.game.sound.play('new_card', 0.35);
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
    var Combination = (function (_super) {
        __extends(Combination, _super);
        function Combination(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this._cards = [];
            _this._texts = [];
            _this._myContainer = _this.game.add.sprite(0, 0);
            _this.addChild(_this._myContainer);
            _this._frameContainer = _this.game.add.sprite(-40, -48);
            _this.addChild(_this._frameContainer);
            _this._yellowBorder = _this.game.add.sprite(0, 0, "banner", "frame_big");
            _this._frameContainer.addChild(_this._yellowBorder);
            _this._framePart = _this.game.add.sprite(_this._yellowBorder.width, 0, "banner", "frame_part");
            _this._frameContainer.addChild(_this._framePart);
            _this._endBorder = _this.game.add.sprite(_this._framePart.width, 0, "banner", "frame_big");
            _this._endBorder.scale.set(-1, 1);
            _this._endBorder.anchor.set(1, 0);
            _this._frameContainer.addChild(_this._endBorder);
            _this._frameContainer.alpha = 0;
            return _this;
        }
        Object.defineProperty(Combination.prototype, "yellowBorderWidth", {
            set: function (val) {
                this._framePart.scale.x = val;
                this._endBorder.x = this._framePart.width - this._endBorder.width;
            },
            enumerable: true,
            configurable: true
        });
        Combination.prototype.addCard = function (val) {
            this._cards.push(val);
            this._myContainer.addChild(val);
        };
        Combination.prototype.getBitmapText = function (val) {
            return this._texts[val];
        };
        Combination.prototype.addText = function (val) {
            this._texts.push(val);
            this._myContainer.addChild(val);
        };
        Combination.prototype.highlight = function () {
            this._frameContainer.alpha = 1;
        };
        Object.defineProperty(Combination.prototype, "isPortrait", {
            set: function (val) {
                this._isPortrait = val;
                if (val) {
                    this.rearrangeTextsPortrait();
                }
                else {
                    this.rearrangeTextsLandscape();
                }
            },
            enumerable: true,
            configurable: true
        });
        Combination.prototype.rearrangeTextsLandscape = function () {
            this._texts[0].x = this._cards[this._cards.length - 1].x + 100;
            this._texts[0].y = -30;
            this._texts[1].x = this._cards[this._cards.length - 1].x + 100;
            this._texts[1].y = this._texts[0].y + 25;
        };
        Combination.prototype.rearrangeTextsPortrait = function () {
            this._texts[0].y = this._cards[0].y + 30;
            this._texts[0].x = this._cards[0].x + 50;
            this._texts[1].x = this._texts[0].x + 100;
            this._texts[1].y = this._cards[0].y + 30;
        };
        Combination.prototype.highlightAnimation = function () {
            var _this = this;
            this.game.add.tween(this._frameContainer).to({
                alpha: 1
            }, 600, Phaser.Easing.Sinusoidal.InOut, true).onComplete.add(function () {
                _this.game.add.tween(_this._frameContainer).to({
                    alpha: 0
                }, 600, Phaser.Easing.Sinusoidal.InOut, true, 200);
            }, this);
        };
        return Combination;
    }(Phaser.Sprite));
    mygame.Combination = Combination;
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
            _this._shadow = _this.game.add.sprite(0, 0, "shadow");
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
                this.cerateCurrentChips("red", this._chips[2]);
                setTimeout(function () {
                    _this.game.sound.play('chips_move', 0.45);
                }, 750 + 300 * timeoutNumber);
                timeoutNumber += 1;
            }
            if (this._chips[0] > 0) {
                this.cerateCurrentChips("blue", this._chips[0]);
                setTimeout(function () {
                    _this.game.sound.play('chips_move', 0.45);
                }, 750 + 300 * timeoutNumber);
                timeoutNumber += 1;
            }
            if (this._chips[1] > 0) {
                this.cerateCurrentChips("green", this._chips[1]);
                setTimeout(function () {
                    _this.game.sound.play('chips_move', 0.45);
                }, 750 + 300 * timeoutNumber);
                timeoutNumber += 1;
            }
            if (this._chips[3] > 0) {
                this.cerateCurrentChips("orange", this._chips[3]);
                setTimeout(function () {
                    _this.game.sound.play('chips_move', 0.45);
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
                    case "blue":
                        xPos = 24;
                        yPos = -188;
                        deleyStart = 500;
                        break;
                    case "green":
                        xPos = -66;
                        yPos = -180;
                        deleyStart = 0;
                        break;
                    case "red":
                        xPos = -30;
                        yPos = -226;
                        deleyStart = 400;
                        break;
                    case "orange":
                        xPos = -20;
                        yPos = -150;
                        deleyStart = 200;
                        break;
                }
                var chip = this.game.add.sprite(xPos, yPos - 800, "banner", type + "_chip");
                chip.scale.set(2);
                this.game.add.tween(chip).to({ y: yPos - 7 * i }, 500, Phaser.Easing.Sinusoidal.Out, true, 700 + deleyStart + (130 + deleyStart / 10) * i);
                this._UITitleSprite.addChild(chip);
            }
        };
        FinishScreen.prototype.createLogo = function () {
            if (this._ipad) {
                this._UILogo = new mygame.OSprite(162, 31);
                this._UILogo.otherXY(358, 30).otherScale(1.5, 1.5).end();
            }
            else {
                this._UILogo = new mygame.OSprite(162, 31);
                this._UILogo.otherXY(358, 30).otherScale(1.5, 1.5).end();
            }
            var logoMain = this.game.add.sprite(0, 0, "banner", "logo_main");
            logoMain.anchor.set(0.5, 0);
            this._UILogo.addChild(logoMain);
            var fx = new FxSplash(this.game, logoMain.width - 5, logoMain.height - 8, 0);
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
            var viewRight = this.game.add.sprite(0, 0, 'banner', 'play');
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
            var strip = this.game.add.sprite(0, 0);
            var left = this.game.add.image(0, 0, "banner", "lenta");
            left.anchor.set(1, 0.5);
            strip.addChild(left);
            var right = this.game.add.image(left.width, 0, "banner", "lenta");
            right.anchor.set(0, 0.5);
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
            var icon = this.game.add.sprite(0, 0, 'banner', 'icon2x');
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
        var splash = _this.game.add.sprite(0, 0, 'banner', 'splash');
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
        return GameConfig;
    }());
    GameConfig.CARDS = [
        "ah", "2c",
        "jd", "kc",
        "7h", "8h",
        "ts", "3d",
        "qc", "qh",
        "ks", "9h",
        "6h",
        "5h", "9s",
        "2d", "3h",
        "2s", "3c",
        "3d", "2s",
        "4d", "5d",
        "4s", "5c",
        "kh"
    ];
    GameConfig.BID_WAITING_MAX = 5300;
    GameConfig.actions = [
        "give_card",
        "add_three_card",
        "b010",
        "b110",
        "b225",
        "f3",
        "human",
        "money_to_dealer",
        "show_cards",
        "winner",
        "reset",
        "give_card",
        "add_three_card",
        "b110",
        "b210",
        "f0",
        "b310",
        "human",
        "money_to_dealer",
        "show_cards",
        "winner",
        "reset"
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
    GameConfig.BOT_NAMES = [
        "Jakob",
        "Michalis",
        "Victor",
        "Dewi",
        "dReAm",
        "Mary J.",
        "13.png",
        "15.png",
        "17.png",
        "19.png"
    ];
    GameConfig.BOT_SPRITE_NAMES = [
        "1.png",
        "3.png",
        "5.png",
        "7.png",
        "9.png",
        "11.png",
        "13.png",
        "15.png",
        "17.png",
        "19.png"
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
    })(HAND_TYPE = mygame.HAND_TYPE || (mygame.HAND_TYPE = {}));
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
        };
        Hand.prototype.display = function () {
            var str = "";
            var suits = "shcd";
            this._cards.forEach(function (x) { return str += " " + x.face + suits[x.suit]; });
            return str;
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
                var faceId = mygame.Card.FACES.indexOf(x.face.toUpperCase());
                faceCount[faceId]++;
                suitCount[x.suit]++;
            });
            return this.analyzeHandHelper(faceCount, suitCount);
        };
        Hand.prototype.hideCards = function () {
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
            var testGraph = this.game.add.graphics(0, 0);
            testGraph.beginFill(0x000000, 0);
            testGraph.drawRect(0, 0, this._graphicsWidth + 38, this._graphicsHeight + 38);
            testGraph.endFill();
            this._leftUp.addChild(testGraph);
            this._middleUp = this.game.add.sprite(this._leftUp.width, 0, "banner", "MiddleUp");
            this._middleUp.scale.x = this._helpWidth;
            this._leftUp.addChild(this._middleUp);
            this._rightUP = this.game.add.sprite(this._middleUp.width + this._leftUp.width, 0, "banner", "RightUp");
            this._leftUp.addChild(this._rightUP);
            this._middleRight = this.game.add.sprite(this._rightUP.x, this._rightUP.width, "banner", "RightMiddle");
            this._middleRight.scale.y = this._helpHeight;
            this._leftUp.addChild(this._middleRight);
            this._rightDown = this.game.add.sprite(this._rightUP.x, this._middleRight.height + this._rightUP.height, "banner", "RightDown");
            this._leftUp.addChild(this._rightDown);
            this._middleDOWN = this.game.add.sprite(this._leftUp.width, this._middleRight.height + this._rightDown.height, "banner", "MiddleDown");
            this._middleDOWN.scale.x = this._helpWidth;
            this._leftUp.addChild(this._middleDOWN);
            this._leftDown = this.game.add.sprite(0, this._middleDOWN.y, "banner", "LeftDown");
            this._leftUp.addChild(this._leftDown);
            this._middleLeft = this.game.add.sprite(0, this._leftUp.width, "banner", "LeftMiddle");
            this._middleLeft.scale.y = this._helpHeight;
            this._leftUp.addChild(this._middleLeft);
            this._graphics = this.game.add.graphics(30, 30);
            this._graphics.beginFill(0x003A66);
            this._graphics.drawRect(0, 0, this._graphicsWidth, this._graphicsHeight);
            this._graphics.endFill();
            this._leftUp.addChild(this._graphics);
        };
        return HelpDesk;
    }(mygame.OSprite));
    mygame.HelpDesk = HelpDesk;
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
        function Bot(game, x, y, id, flipVertical, flipHorizontal) {
            var _this = _super.call(this, game, x, y) || this;
            _this._cards = [];
            if (id < 0 || id > mygame.GameConfig.BOT_NAMES.length) {
                id = mygame.GameConfig.BOT_NAMES.length - 1;
            }
            _this._state = BotState.IDLE;
            _this._bg = _this.game.add.sprite(0, 0, "objects", "userIcon0002.png");
            _this._bg.anchor.set(0.5);
            _this._bg.scale.set(0.8);
            _this.addChild(_this._bg);
            _this._sprite = _this.game.add.sprite(0, 0, "objects", mygame.GameConfig.BOT_SPRITE_NAMES[id]);
            _this.addChild(_this._sprite);
            _this._sprite.width = 120;
            _this._sprite.height = 120;
            _this._sprite.anchor.set(0.5);
            _this._graphics = _this.game.add.graphics(0, 0);
            _this.addChild(_this._graphics);
            _this._graphics.alpha = 0;
            _this._graphics.beginFill(0x00);
            _this._graphics.drawRect(-60, -60, 120, 120);
            _this._graphics.endFill();
            _this._botName = mygame.GameConfig.BOT_NAMES[id];
            _this._balance = 1000 + Math.floor(-300 + 600 * Math.random());
            _this._btmTextName = _this.game.add.bitmapText(0, -70, "font_all_30", _this._botName, 24);
            _this._btmTextName.anchor.set(0.5);
            _this.addChild(_this._btmTextName);
            _this._btmTextBalance = _this.game.add.bitmapText(0, 74, "font_all_30", "$" + _this._balance.toString(), 24);
            _this._btmTextBalance.anchor.set(0.5);
            _this.addChild(_this._btmTextBalance);
            _this._bid = 0;
            _this._chip = _this.game.add.sprite(0, 0, "blue_chip");
            _this._chip.visible = false;
            _this.game.world.addChild(_this._chip);
            _this._btmTextBid = _this.game.add.bitmapText(_this._chip.width, 5, "font_all_30", "", 24);
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
            _this._cardBacks = _this.game.add.sprite(_this.x - unitVector.x * 120, _this.y - unitVector.y * 120, "objects", "back.png");
            _this._cardBacks.anchor.set(0.5);
            _this._cardBacks.scale.set(scale.x, scale.y);
            _this._cardBacks.alpha = 0;
            var secondCard = _this.game.add.sprite(50, 0, "objects", "back.png");
            secondCard.anchor.set(0.5);
            secondCard.angle = 13;
            _this._cardBacks.addChild(secondCard);
            _this.addChild(_this._cardBacks);
            _this._myMask = _this.game.add.graphics(0, 0);
            _this._myMask.beginFill(0xffffff);
            _this._myMask.arc(0, 0, 110, -90 / 180 * Math.PI + 0.1, 0, true);
            _this._myMask.endFill();
            _this.addChild(_this._myMask);
            _this._greenBorder = _this.game.add.sprite(0, 0, "objects", "userIcon0004.png");
            _this._greenBorder.anchor.set(0.5);
            _this._greenBorder.scale.set(0.8);
            _this._greenBorder.alpha = 0;
            _this.addChild(_this._greenBorder);
            _this._greenBorder.mask = _this._myMask;
            return _this;
        }
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
        Bot.prototype.fold = function () {
            var _this = this;
            this._pass = true;
            this.game.add.tween(this._graphics).to({
                alpha: 0.6
            }, 800, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                _this._nextCommandCallback();
            }, this);
            this._chip.visible = false;
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
        Bot.prototype.bid = function (amount, waiting) {
            var _this = this;
            if (waiting === void 0) { waiting = true; }
            if (waiting) {
                this._tempAmount = amount;
                this.waiting(500 + Math.random() * (5000 - 700));
            }
            else {
                this.game.world.removeChild(this._chip);
                this.addChild(this._chip);
                var angle = Math.atan2(this.y, this.x);
                var unitVector = new Phaser.Point(Math.cos(angle), Math.sin(angle));
                this._chip.visible = true;
                this.game.add.tween(this._chip).to({
                    x: this._chipPosition.x,
                    y: this._chipPosition.y
                }, 200, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                    _this._nextCommandCallback();
                }, this);
                this._bid += amount;
                this._btmTextBid.text = "$" + this._bid.toString();
                this._btmTextBid.visible = true;
            }
        };
        Bot.prototype.waiting = function (delay) {
            this._greenBorder.alpha = 1;
            this._myMask.clear();
            this._myMask.beginFill(0xffffff);
            this._myMask.drawCircle(0, 0, 210);
            this._myMask.endFill();
            this._timer = delay;
            this._borderTimer = 5000;
            this._state = BotState.WAITING;
        };
        Object.defineProperty(Bot.prototype, "ICards", {
            get: function () {
                return this._cards;
            },
            enumerable: true,
            configurable: true
        });
        Bot.prototype.moneyToDealer = function () {
            if (!this._pass) {
                this._btmTextBid.visible = false;
                var xPos = this._chip.worldPosition.x;
                var yPos = this._chip.worldPosition.y;
                this.removeChild(this._chip);
                this._chip.position.set(xPos, yPos);
                this.game.world.addChild(this._chip);
                var pos = this._girlPositionCallback();
                var tween = this.game.add.tween(this._chip).to({
                    x: pos.x - 20,
                    y: pos.y + 60
                }, 800, Phaser.Easing.Sinusoidal.InOut, true);
                return tween;
            }
            return null;
        };
        Bot.prototype.dCard = function (x, y) {
            this._dCard = new Phaser.Point(x, y);
        };
        Bot.prototype.myCheck = function (val) {
            this._bid = val;
            this._btmTextBid.text = "$" + this._bid.toString();
        };
        Bot.prototype.update = function () {
            var dt = this.game.time.elapsedMS;
            switch (this._state) {
                case BotState.WAITING:
                    {
                        if (this._timer > 0) {
                            this._timer -= dt;
                            this._borderTimer -= dt;
                            this._myMask.clear();
                            this._myMask.beginFill(0xffffff);
                            var phi0 = -90 / 180 * Math.PI + 0.1;
                            this._myMask.arc(0, 0, 110, phi0, phi0 - (360 * (this._borderTimer + 300) / mygame.GameConfig.BID_WAITING_MAX) / 180 * Math.PI, true);
                            this._myMask.endFill();
                        }
                        else {
                            this._myMask.clear();
                            this._greenBorder.alpha = 0;
                            this._state = BotState.IDLE;
                            this.bid(this._tempAmount, false);
                        }
                    }
                    break;
                default:
                    break;
            }
        };
        Bot.prototype.sendChipsToWinnet = function (pos) {
            if (!this._pass) {
                this.game.add.tween(this._chip).to({
                    x: pos.x,
                    y: pos.y
                }, 800, Phaser.Easing.Sinusoidal.InOut, true);
                this._balance -= this._bid;
                this._bid = 0;
            }
        };
        Bot.prototype.updateBalance = function (val) {
            this._balance += val;
        };
        Bot.prototype.updateBalanceText = function () {
            this._btmTextBalance.text = "$" + this._balance;
        };
        Bot.prototype.myReset = function () {
            this._bid = 0;
            this.updateBalanceText();
            this._pass = false;
            this._chip.position.set(0, 0);
            this._chip.visible = false;
            if (this._cardBacks) {
                this._cardBacks.alpha = 0;
            }
            this._graphics.alpha = 0;
            this._cards.length = 0;
            var angle = Math.atan2(this.y, this.x);
            var unitVector = new Phaser.Point(Math.cos(angle), Math.sin(angle));
        };
        Bot.prototype.addCards = function (cards) {
            var _this = this;
            cards.forEach(function (x) {
                try {
                    _this._cards.push({ face: x[0], suit: mygame.GameConfig.name2suit(x[1]) });
                }
                catch (e) {
                    debugger;
                }
            });
            var angle = Math.atan2(this.y, this.x);
            var unitVector = new Phaser.Point(Math.cos(angle), Math.sin(angle));
            this._cardBacks.position.set(-unitVector.x * 300, -unitVector.y * 300);
            this._cardBacks.alpha = 0;
            this.game.add.tween(this._cardBacks).to({
                x: -unitVector.x * 100 + this._dCard.x,
                y: -unitVector.y * 150 + this._dCard.y,
                angle: 360 / 2,
                alpha: 1
            }, 600, Phaser.Easing.Sinusoidal.InOut, true).onComplete.add(function () {
                _this._cardBacks.angle = 180;
            });
        };
        return Bot;
    }(Phaser.Sprite));
    mygame.Bot = Bot;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Dealer = (function () {
        function Dealer() {
            this._cards = mygame.GameConfig.CARDS.slice();
            this._bots = [];
            this._currentCardsOnTable = [];
            this._highestBid = 0;
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
        Dealer.prototype.addCardsOnTable = function (table, wait) {
            var _this = this;
            var tween;
            for (var i = 0; i < 3; i++) {
                var cardName = this._cards.shift();
                var card = new mygame.Card(table.game, -160 + 80 * i, -35, mygame.GameConfig.name2suit(cardName[1]), cardName[0]);
                card.scale.x = 0;
                card.alpha = 0;
                table.game.add.tween(card).to({
                    alpha: 1
                }, 500, Phaser.Easing.Sinusoidal.InOut, true, 300 * i);
                tween = table.game.add.tween(card.scale).to({
                    x: 1
                }, 500, Phaser.Easing.Sinusoidal.InOut, true, 300 * i);
                table.addChild(card);
                this._currentCardsOnTable.push(card);
            }
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
        Dealer.prototype.hideCards = function () {
            var _this = this;
            var tween;
            this._currentCardsOnTable.forEach(function (x, i) {
                tween = x.discard(i * 300);
            });
            tween.onComplete.addOnce(function () {
                _this.removeCards();
            }, this);
        };
        Dealer.prototype.removeCards = function () {
            this._currentCardsOnTable.forEach(function (x) { return x.destroy(); });
            this._currentCardsOnTable.length = 0;
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
        Dealer.prototype.winner = function () {
            var _this = this;
            var highestHandId = -1;
            var highestHand = -1;
            this._bots.forEach(function (x, id) {
                if (!x.pass) {
                    var hand_1 = new mygame.Hand();
                    hand_1.addCard(x.ICards[0]);
                    hand_1.addCard(x.ICards[1]);
                    _this.cardsOnTable.forEach(function (x) {
                        hand_1.addCard({ face: x.face, suit: x.suit });
                    });
                    var result = hand_1.analyzeHand();
                    if (result > highestHand) {
                        highestHand = result;
                        highestHandId = id;
                    }
                    console.log(hand_1.display());
                }
            });
            return highestHandId;
        };
        Dealer.prototype.giveCards = function () {
            for (var i = 0; i < this._bots.length; i++) {
                var cards = [];
                cards.push(this._cards.shift());
                cards.push(this._cards.shift());
                console.log(cards);
                this._bots[i].addCards(cards);
            }
        };
        return Dealer;
    }());
    mygame.Dealer = Dealer;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            var _this = _super.call(this, game, x, y, mygame.GameConfig.BOT_NAMES.length - 1, false, false) || this;
            _this._botName = "You";
            _this._balance = 800;
            _this._btmTextName.text = _this._botName;
            _this._btmTextBalance.text = "$" + _this._balance.toString();
            _this._cardSprite = [];
            _this.initCards();
            _this._sprite.loadTexture("objects", "lounge.png");
            _this._sprite.inputEnabled = true;
            _this._sprite.events.onInputDown.addOnce(function () {
                _this._sprite.loadTexture("objects", "19.png");
                _this._bg.alpha = 1;
                _this._btmTextName.alpha = 1;
                _this._btmTextBalance.alpha = 1;
                _this._sprite.inputEnabled = false;
                _this._nextCommandCallback();
                _this._startTimer();
            }, _this);
            _this._bg.alpha = 0;
            _this._btmTextName.alpha = 0;
            _this._btmTextBalance.alpha = 0;
            return _this;
        }
        Player.prototype.initCards = function () {
            var card = this.game.add.sprite(70, 0, "objects", "2d.png");
            card.scale.set(0.75);
            card.visible = false;
            this.addChild(card);
            this._cardSprite.push(card);
            card = this.game.add.sprite(70 + 70, 0, "objects", "2d.png");
            card.scale.set(0.75);
            card.visible = false;
            this.addChild(card);
            this._cardSprite.push(card);
        };
        Object.defineProperty(Player.prototype, "startTimerCallback", {
            set: function (val) {
                this._startTimer = val;
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.bid = function (amount) {
            var _this = this;
            this.game.world.removeChild(this._chip);
            this.addChild(this._chip);
            var angle = Math.atan2(this.y, this.x);
            var unitVector = new Phaser.Point(Math.cos(angle), Math.sin(angle));
            this._chip.visible = true;
            this.game.add.tween(this._chip).to({
                x: this._chipPosition.x,
                y: this._chipPosition.y
            }, 200, Phaser.Easing.Sinusoidal.InOut, true).onComplete.addOnce(function () {
                _this.game.time.events.add(1000, function () {
                    _this._nextCommandCallback();
                });
            }, this);
            this._bid += amount;
            this._btmTextBid.text = "$" + this._bid.toString();
            this._btmTextBid.visible = true;
        };
        Player.prototype.myReset = function () {
            _super.prototype.myReset.call(this);
            this._cardSprite.forEach(function (x) { return x.visible = false; });
        };
        Player.prototype.addCards = function (cards) {
            for (var i = 0; i < cards.length; i++) {
                this._cards.push({
                    face: cards[i][0],
                    suit: mygame.GameConfig.name2suit(cards[i][1])
                });
                this._cardSprite[i].visible = true;
                this._cardSprite[i].loadTexture("objects", cards[i] + ".png");
            }
        };
        return Player;
    }(mygame.Bot));
    mygame.Player = Player;
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
