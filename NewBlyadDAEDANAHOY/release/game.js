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
            var currentBG = window["currentBG"];
            if (currentBG == 0) {
                currentBG = this.game.rnd.integerInRange(1, 3);
            }
            this.game.load.image('background', baseURL + "assets/background_" + currentBG + ".png");
            if (window["collectable"]) {
                this.game.load.atlas("objects", baseURL + "assets/collect.png", baseURL + "assets/collect.json");
            }
            else {
                this.game.load.atlas("objects", baseURL + "assets/no_collect.png", baseURL + "assets/no_collect.json");
            }
            if (window["myLang"] == "en") {
                this.game.load.image("play_free", baseURL + "assets/EngButton" + "_" + window["buttonPlayColor"] + ".png");
            }
            else {
                this.game.load.image("play_free", baseURL + "assets/DutButton" + "_" + window["buttonPlayColor"] + ".png");
            }
            mygame.Factories.loadFactory(this.game, "banner", mygame.Boot.PATH_IMAGES + "DB/banner/");
            this.game.load.bitmapFont('font', baseURL + "assets/font.png", baseURL + "assets/font.fnt");
        };
        Preloader.prototype.create = function () {
            var _this = this;
            mygame.Boot.GAME = mygame.Factories.createFactory(this.game, "banner");
            dragonBones.PhaserFactory.startLoop();
            setTimeout(function () {
                _this.game.state.start('PlayState');
            }, 100);
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
            _this._canRestart = false;
            return _this;
        }
        PlayState.prototype.create = function () {
            var _this = this;
            this.game.time.advancedTiming = true;
            this._canRestart = false;
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.stage.smoothed = true;
            mygame.Controller.Instance.width = getSize().width;
            mygame.Controller.Instance.height = getSize().height;
            this._background = new mygame.OSprite(mygame.Core.centerX, mygame.Core.centerY - 650, "background")
                .myScale(1.8)
                .otherScale(0.75)
                .otherXY(mygame.Core.centerY, mygame.Core.centerX)
                .enabledBgMode()
                .end();
            this.game.world.addChild(this._background);
            this._gameSprite = new mygame.OSprite(mygame.Core.centerX, mygame.Core.centerY)
                .myScale(1.55)
                .otherScale(1.6)
                .otherXY(mygame.Core.centerY, mygame.Core.centerX)
                .end();
            if (mygame.Core.isLandscape) {
                this._gameMatch = new mygame.DBSprite(mygame.Boot.GAME, "HOR", this.game);
                this.game.time.events.add(12000, function () {
                    console.log("END BLYAD");
                    _this.compliteHoriz();
                }, this);
                this._gameMatch.play("start", "idle");
                this._gameMatch.setPos(-70, -15);
                console.log(this._gameMatch.height);
                console.log(this._gameMatch.width);
                this._gameSprite.pivot.set(this._gameMatch.width / 2, this._gameMatch.height / 2);
                this._gameSprite.addChild(this._gameMatch);
                this._btnDownload = new mygame.DBSprite(mygame.Boot.GAME, "PLAY_FREE", this.game);
                this._btnDownload.play("stop");
                this._btnDownload.setPos(-25, -415);
                this._gameSprite.addChild(this._btnDownload);
                for (var i = 0; i < this.world.children.length; i++) {
                    if (i > 1) {
                        this.world.children[i].x = -10000;
                    }
                }
                this._canRestart = true;
            }
            else {
                this._gameMatch = new mygame.DBSprite(mygame.Boot.GAME, "VERT", this.game);
                this.game.time.events.add(12000, function () {
                    console.log("END BLYAD");
                    _this.compliteVert();
                }, this);
                this._gameMatch.play("start", "idle", function (e) {
                });
                this._gameMatch.setPos(20, -200);
                console.log(this._gameMatch.height);
                console.log(this._gameMatch.width);
                this._gameSprite.pivot.set(this._gameMatch.width / 2, this._gameMatch.height / 2);
                this._gameSprite.addChild(this._gameMatch);
                this._btnDownload = new mygame.DBSprite(mygame.Boot.GAME, "PLAY_FREE", this.game);
                this._btnDownload.play("stop");
                this._btnDownload.setPos(-25, -250);
                this._gameSprite.addChild(this._btnDownload);
                console.log(this.world.children.length);
                for (var i = 0; i < this.world.children.length; i++) {
                    if (i > 1) {
                        this.world.children[i].x = -10000;
                    }
                }
                this._canRestart = true;
            }
            this.game.time.events.add(2300, function () {
                _this._btnDownload.play("up", "loop", function (e) {
                    if (e.label == "loop") {
                        _this._btnDownload.getSlot("Layer 2").play("loop");
                    }
                });
            }, this);
        };
        PlayState.prototype.compliteVert = function () {
            var _this = this;
            this._gameMatch.stop();
            this._gameMatch.getSlot("Layer 4").stop();
            this._gameMatch.getSlot("Layer 2").stop();
            this._gameMatch.getSlot("Layer 1").stop();
            this._gameMatch.play("idle");
            this._gameMatch.getSlot("Layer 4").play("idle");
            this._gameMatch.getSlot("Layer 2").play("idle");
            this._gameMatch.getSlot("Layer 1").play("idle");
            this.game.time.events.add(11000, function () {
                _this.compliteVert();
            }, this);
        };
        PlayState.prototype.compliteHoriz = function () {
            var _this = this;
            this._gameMatch.stop();
            this._gameMatch.getSlot("Layer 4").stop();
            this._gameMatch.getSlot("Layer 3").stop();
            this._gameMatch.getSlot("Layer 1").stop();
            this._gameMatch.play("idle");
            this._gameMatch.getSlot("Layer 4").play("idle");
            this._gameMatch.getSlot("Layer 3").play("idle");
            this._gameMatch.getSlot("Layer 1").play("idle");
            this.game.time.events.add(11000, function () {
                _this.compliteHoriz();
            }, this);
        };
        PlayState.prototype.update = function () {
        };
        PlayState.prototype.onLandscape = function () {
            if (this._canRestart) {
                this._btnDownload.free();
                this.game.time.removeAll();
                this._gameMatch.free();
                this._gameSprite.destroy(true);
                this.game.state.restart(true);
            }
        };
        PlayState.prototype.onPortret = function () {
            if (this._canRestart) {
                this._btnDownload.free();
                this.game.time.removeAll();
                this._gameMatch.free();
                this._gameSprite.destroy(true);
                this.game.state.restart(true);
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
            this.game.load.image('connect', baseURL + "assets/connect.png");
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
    Boot.PATH_IMAGES = "./assets/";
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
    var DBSprite = (function (_super) {
        __extends(DBSprite, _super);
        function DBSprite(data, name, game) {
            var _this = _super.call(this) || this;
            _this._eventsBounds = null;
            if (data instanceof dragonBones.PhaserFactory) {
                game ? game.world.add(_this) : "";
                _this._visual = data.buildArmatureDisplay(name);
                _this.addChild(_this._visual);
            }
            else {
                _this._visual = data;
            }
            _this._pausedTime = -1;
            return _this;
        }
        DBSprite.prototype.free = function () {
            if (this._eventsBounds) {
                this._eventsBounds.destroy(true);
            }
            this._visual.dispose(true);
        };
        DBSprite.prototype.stopInteractive = function () {
            this._eventsBounds.inputEnabled = false;
        };
        DBSprite.prototype.addEvent = function (type, listener, target) {
            this._visual.addEvent(type, listener, target ? target : this);
        };
        DBSprite.prototype.removeEvent = function (type, listener) {
            this._visual.removeEvent(type, listener, null);
        };
        DBSprite.prototype.removeFromParent = function () {
            if (this.parent) {
                this.parent.removeChild(this);
            }
        };
        DBSprite.prototype._play = function (name, playTimes) {
            if (name == this._currentLabel && this._playTimes == 0 && this._visual.animation.isPlaying) {
                return;
            }
            this._currentLabel = name;
            this._pausedTime = -1;
            this._currentAnimState = this._visual.animation.play(name, playTimes);
            this._playTimes = this._currentAnimState.playTimes;
            return this._currentAnimState;
        };
        DBSprite.prototype.playEx = function (name, nextState, complete, context) {
            this._nextState = nextState;
            this._cb = complete;
            this._cbContext = context ? context : this;
            this._play(name);
            if (nextState || complete) {
                this.addEvent(this._playTimes == 1 ? "complete" : "loopComplete", this.completePlaying);
            }
            return this._currentAnimState;
        };
        DBSprite.prototype.play = function (name, a, b, c) {
            if (typeof a === "string") {
                return this.playEx(name, a, b, c);
            }
            else if (typeof a === "function") {
                return this.playEx(name, null, a, b);
            }
            else {
                return this._play(name);
            }
        };
        DBSprite.prototype.stop = function () {
            this._visual.animation.stop();
        };
        DBSprite.prototype.pause = function () {
            if (this._currentAnimState == null) {
                this._visual.animation.stop();
            }
            this._pausedTime = this._currentAnimState.currentTime;
            this._visual.animation.stop(this._currentLabel);
        };
        DBSprite.prototype.resume = function () {
            if (this._pausedTime == -1) {
                return;
            }
            this._pausedTime = -1;
            this._visual.animation.gotoAndPlayByTime(this._currentLabel, this._pausedTime);
        };
        DBSprite.prototype.completePlaying = function (e) {
            this.removeEvent("complete", this.completePlaying);
            this.removeEvent("loopComplete", this.completePlaying);
            e.label = this.currentLabel;
            if (typeof this._cb === "function") {
                this._cb.bind(this._cbContext)(e);
            }
            if (this._nextState) {
                this.playEx(this._nextState, null, this._cb, this._cbContext);
            }
            else {
                this._cb = null;
            }
        };
        DBSprite.prototype.getBone = function (name) {
            var slot = this._visual.armature.getSlot(name);
            if (slot.childArmature) {
                return slot.childArmature.display;
            }
            return slot.display;
        };
        DBSprite.prototype.getBoneArmature = function (name) {
            return this._visual.armature.getSlot(name).childArmature;
        };
        DBSprite.prototype.getSlot = function (name, nonChildArmature) {
            if (nonChildArmature === void 0) { nonChildArmature = false; }
            var slot = this._visual.armature.getSlot(name);
            if (slot == null) {
                return null;
            }
            if (!nonChildArmature && slot.childArmature == null) {
                return null;
            }
            return slot.childArmature ? slot.childArmature.animation : slot.armature.animation;
        };
        DBSprite.prototype.setPos = function (x, y) {
            this.x = x ? x : this.x;
            this.y = y ? y : this.y;
        };
        DBSprite.prototype.createBounds = function (game) {
            if (this._eventsBounds != null) {
                this.removeChild(this._eventsBounds);
                this._eventsBounds.destroy(true);
            }
            var b = this.getBounds();
            this._eventsBounds = new Phaser.Graphics(game, 0.0, 0.0);
            this._eventsBounds.beginFill(0xff0000, 0.0);
            this._eventsBounds.drawRect(-b.width * 0.5, -b.height * 0.5, b.width, b.height);
            this._eventsBounds.endFill();
            this.addChild(this._eventsBounds);
        };
        Object.defineProperty(DBSprite.prototype, "animation", {
            get: function () {
                return this._visual.animation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DBSprite.prototype, "armature", {
            get: function () {
                return this._visual._armature;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DBSprite.prototype, "sprites", {
            get: function () {
                return this._visual.children;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DBSprite.prototype, "events", {
            get: function () {
                if (!this._eventsBounds) {
                    return null;
                }
                return this._eventsBounds.events;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DBSprite.prototype, "input", {
            get: function () {
                if (!this._eventsBounds) {
                    return null;
                }
                return this._eventsBounds.input;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DBSprite.prototype, "inputEnabled", {
            get: function () {
                if (!this._eventsBounds) {
                    return false;
                }
                return this._eventsBounds.inputEnabled;
            },
            set: function (value) {
                this._eventsBounds.inputEnabled = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DBSprite.prototype, "currentLabel", {
            get: function () {
                return this._currentLabel;
            },
            enumerable: true,
            configurable: true
        });
        DBSprite.prototype.update = function () { };
        DBSprite.prototype.postUpdate = function () { };
        return DBSprite;
    }(PIXI.DisplayObjectContainer));
    mygame.DBSprite = DBSprite;
})(mygame || (mygame = {}));
var mygame;
(function (mygame) {
    var Factories = (function () {
        function Factories() {
        }
        Factories.loadFactory = function (game, name, path, texturePrefix, skeletonPrefix) {
            texturePrefix = texturePrefix ? texturePrefix : "_tex";
            skeletonPrefix = skeletonPrefix ? skeletonPrefix : "_ske";
            path += name;
            game.load.json(name + "textureData", path + texturePrefix + ".json");
            game.load.json(name + "dragonBonesData", path + skeletonPrefix + ".json");
            game.load.image(name + "texture", path + texturePrefix + ".png");
        };
        Factories.createFactory = function (game, name) {
            var f = new dragonBones.PhaserFactory(null, game);
            f.parseDragonBonesData(game.cache.getJSON(name + "dragonBonesData"));
            f.parseTextureAtlasData(game.cache.getJSON(name + "textureData"), game.cache.getBaseTexture(name + "texture"));
            return f;
        };
        return Factories;
    }());
    mygame.Factories = Factories;
})(mygame || (mygame = {}));
var dragonBones;
(function (dragonBones) {
    var PhaserArmatureDisplay = (function (_super) {
        __extends(PhaserArmatureDisplay, _super);
        function PhaserArmatureDisplay(game) {
            var _this = _super.call(this, game) || this;
            _this._eventDispatcher = new EventEmitter();
            return _this;
        }
        PhaserArmatureDisplay.prototype._onClear = function () {
            if (this._debugDrawer) {
            }
            this._armature = null;
            this._debugDrawer = null;
            this.destroy();
        };
        PhaserArmatureDisplay.prototype._debugDraw = function (isEnabled) {
        };
        PhaserArmatureDisplay.prototype.hasEvent = function (type) {
            return this._eventDispatcher.listeners(type, true);
        };
        PhaserArmatureDisplay.prototype.addEvent = function (type, listener, target) {
            this._eventDispatcher.addListener(type, listener, target);
        };
        PhaserArmatureDisplay.prototype.removeEvent = function (type, listener, target) {
            this._eventDispatcher.removeListener(type, listener, target);
        };
        PhaserArmatureDisplay.prototype._dispatchEvent = function (type, data) {
            this._eventDispatcher.emit(type, data);
        };
        PhaserArmatureDisplay.prototype.dispose = function (disposeProxy) {
            if (disposeProxy === void 0) { disposeProxy = true; }
            if (this._armature) {
                this._armature.dispose();
                this._armature = null;
            }
        };
        Object.defineProperty(PhaserArmatureDisplay.prototype, "armature", {
            get: function () {
                return this._armature;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PhaserArmatureDisplay.prototype, "animation", {
            get: function () {
                return this._armature.animation;
            },
            enumerable: true,
            configurable: true
        });
        PhaserArmatureDisplay.prototype.advanceTimeBySelf = function (on) {
            if (on) {
                this._armature.clock = dragonBones.PhaserFactory._clock;
            }
            else {
                this._armature.clock = null;
            }
        };
        return PhaserArmatureDisplay;
    }(Phaser.Group));
    dragonBones.PhaserArmatureDisplay = PhaserArmatureDisplay;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    var PhaserFactory = (function (_super) {
        __extends(PhaserFactory, _super);
        function PhaserFactory(dataParser, game) {
            if (dataParser === void 0) { dataParser = null; }
            var _this = _super.call(this, dataParser) || this;
            if (!PhaserFactory._eventManager) {
                PhaserFactory._eventManager = new dragonBones.PhaserArmatureDisplay(game);
                PhaserFactory._clock = new dragonBones.WorldClock();
                PhaserFactory._game = game;
            }
            return _this;
        }
        PhaserFactory._clockHandler = function (passedTime) {
            if (passedTime === void 0) { passedTime = -1; }
            if (PhaserFactory._clock == null) {
                return;
            }
            PhaserFactory._clock.advanceTime(passedTime);
        };
        Object.defineProperty(PhaserFactory, "clock", {
            get: function () {
                return PhaserFactory._clock;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PhaserFactory, "factory", {
            get: function () {
                if (!PhaserFactory._factory) {
                    PhaserFactory._factory = new PhaserFactory(null, this._game);
                }
                return PhaserFactory._factory;
            },
            enumerable: true,
            configurable: true
        });
        PhaserFactory.startLoop = function (interval) {
            if (interval === void 0) { interval = 20; }
            PhaserFactory._clockID = setInterval(function () {
                PhaserFactory._clockHandler();
            }, interval);
        };
        PhaserFactory.stopLoop = function () {
            if (PhaserFactory._clockID == -1) {
                return;
            }
            clearInterval(PhaserFactory._clockID);
            PhaserFactory._clockID = -1;
        };
        Object.defineProperty(PhaserFactory, "DBLooping", {
            get: function () {
                return PhaserFactory._clockID != -1;
            },
            enumerable: true,
            configurable: true
        });
        PhaserFactory.prototype._generateTextureAtlasData = function (textureAtlasData, textureAtlas) {
            if (textureAtlasData) {
                textureAtlasData.texture = textureAtlas;
            }
            else {
                textureAtlasData = dragonBones.BaseObject.borrowObject(dragonBones.PhaserTextureAtlasData);
            }
            return textureAtlasData;
        };
        PhaserFactory.prototype._generateArmature = function (dataPackage) {
            var armature = dragonBones.BaseObject.borrowObject(dragonBones.Armature);
            var armatureDisplay = new dragonBones.PhaserArmatureDisplay(PhaserFactory._game);
            armatureDisplay._armature = armature;
            armature._init(dataPackage.armature, dataPackage.skin, armatureDisplay, armatureDisplay, PhaserFactory._eventManager);
            return armature;
        };
        PhaserFactory.prototype._generateSlot = function (dataPackage, skinSlotData, armature) {
            var slot = dragonBones.BaseObject.borrowObject(dragonBones.PhaserSlot);
            slot._init(skinSlotData, new Phaser.Sprite(PhaserFactory._game, null, null), null);
            var displayList = [];
            for (var i = 0, l = skinSlotData.displays.length; i < l; ++i) {
                var displayData = skinSlotData.displays[i];
                switch (displayData.type) {
                    case 0:
                        if (!displayData.texture || dataPackage.textureAtlasName) {
                            displayData.texture = this._getTextureData(dataPackage.textureAtlasName || dataPackage.dataName, displayData.path);
                        }
                        displayList.push(slot.rawDisplay);
                        break;
                    case 2:
                        if (!displayData.texture || dataPackage.textureAtlasName) {
                            displayData.texture = this._getTextureData(dataPackage.textureAtlasName || dataPackage.dataName, displayData.path);
                        }
                        if (!displayData.mesh && displayData.share) {
                            displayData.mesh = skinSlotData.getMesh(displayData.share);
                        }
                        displayList.push(slot.meshDisplay);
                        break;
                    case 1:
                        var childArmature = this.buildArmature(displayData.path, dataPackage.dataName, null, dataPackage.textureAtlasName);
                        if (childArmature) {
                            childArmature.inheritAnimation = displayData.inheritAnimation;
                            if (!childArmature.inheritAnimation) {
                                var actions = skinSlotData.slot.actions.length > 0 ? skinSlotData.slot.actions : childArmature.armatureData.actions;
                                if (actions.length > 0) {
                                    for (var i_1 = 0, l_1 = actions.length; i_1 < l_1; ++i_1) {
                                        childArmature._bufferAction(actions[i_1]);
                                    }
                                }
                                else {
                                    childArmature.animation.play();
                                }
                            }
                            displayData.armature = childArmature.armatureData;
                        }
                        displayList.push(childArmature);
                        break;
                    default:
                        displayList.push(null);
                        break;
                }
            }
            slot._setDisplayList(displayList);
            return slot;
        };
        PhaserFactory.prototype.buildArmatureDisplay = function (armatureName, dragonBonesName, skinName, textureAtlasName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            if (skinName === void 0) { skinName = null; }
            if (textureAtlasName === void 0) { textureAtlasName = null; }
            var armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);
            if (armature) {
                var armatureDisplay = armature.display;
                PhaserFactory._clock.add(armature);
                return armatureDisplay;
            }
            return null;
        };
        PhaserFactory.prototype.getTextureDisplay = function (textureName, dragonBonesName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            var textureData = this._getTextureData(dragonBonesName, textureName);
            if (textureData) {
                if (!textureData.texture) {
                    var textureAtlasTexture = textureData.parent.texture;
                    var originSize = new PIXI.Rectangle(0, 0, textureData.region.width, textureData.region.height);
                    textureData.texture = new PIXI.Texture(textureAtlasTexture, null, textureData.region, originSize);
                }
                return new PIXI.Sprite(textureData.texture);
            }
            return null;
        };
        Object.defineProperty(PhaserFactory.prototype, "soundEventManater", {
            get: function () {
                return PhaserFactory._eventManager;
            },
            enumerable: true,
            configurable: true
        });
        return PhaserFactory;
    }(dragonBones.BaseFactory));
    PhaserFactory._factory = null;
    PhaserFactory._eventManager = null;
    PhaserFactory._clock = null;
    PhaserFactory._clockID = -1;
    dragonBones.PhaserFactory = PhaserFactory;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    var PhaserSlot = (function (_super) {
        __extends(PhaserSlot, _super);
        function PhaserSlot() {
            var _this = _super.call(this) || this;
            _this._renderDisplayX = 0;
            _this._renderDisplayY = 0;
            return _this;
        }
        PhaserSlot.toString = function () {
            return "[class dragonBones.PhaserSlot]";
        };
        PhaserSlot.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this._renderDisplay = null;
        };
        PhaserSlot.prototype._initDisplay = function (value) {
        };
        PhaserSlot.prototype._disposeDisplay = function (value) {
            if (value) {
                value.destroy();
            }
        };
        PhaserSlot.prototype._onUpdateDisplay = function () {
            this._renderDisplay = (this._display ? this._display : this._rawDisplay);
        };
        PhaserSlot.prototype._addDisplay = function () {
            var container = this._armature.display;
            container.addChild(this._renderDisplay);
            this._renderDisplayX = this.armature.getBone(this.name).origin.x * 0.0;
            this._renderDisplayY = this.armature.getBone(this.name).origin.y * 0.0;
        };
        PhaserSlot.prototype._replaceDisplay = function (value) {
            var container = this._armature.display;
            var prevDisplay = value;
            container.addChild(this._renderDisplay);
            container.swapChildren(this._renderDisplay, prevDisplay);
            container.removeChild(prevDisplay);
        };
        PhaserSlot.prototype._removeDisplay = function () {
            this._renderDisplay.parent.removeChild(this._renderDisplay);
        };
        PhaserSlot.prototype._updateZOrder = function () {
            var container = this._armature.display;
            container.addChildAt(this._renderDisplay, this._zOrder);
        };
        PhaserSlot.prototype._updateVisible = function () {
            this._renderDisplay.visible = this._parent.visible;
        };
        PhaserSlot.prototype._updateBlendMode = function () {
            switch (this._blendMode) {
                case 0:
                    this._renderDisplay.blendMode = PIXI.blendModes.NORMAL;
                    break;
                case 1:
                    this._renderDisplay.blendMode = PIXI.blendModes.ADD;
                    break;
                case 3:
                    this._renderDisplay.blendMode = PIXI.blendModes.DARKEN;
                    break;
                case 4:
                    this._renderDisplay.blendMode = PIXI.blendModes.DIFFERENCE;
                    break;
                case 6:
                    this._renderDisplay.blendMode = PIXI.blendModes.HARD_LIGHT;
                    break;
                case 9:
                    this._renderDisplay.blendMode = PIXI.blendModes.LIGHTEN;
                    break;
                case 10:
                    this._renderDisplay.blendMode = PIXI.blendModes.MULTIPLY;
                    break;
                case 11:
                    this._renderDisplay.blendMode = PIXI.blendModes.OVERLAY;
                    break;
                case 12:
                    this._renderDisplay.blendMode = PIXI.blendModes.SCREEN;
                    break;
                default:
                    break;
            }
        };
        PhaserSlot.prototype._updateColor = function () {
            this._renderDisplay.alpha = this._colorTransform.alphaMultiplier;
        };
        PhaserSlot.prototype._updateFrame = function () {
            var currentTextureData = this._textureData;
            if (this._displayIndex >= 0 && this._display && currentTextureData) {
                var currentTextureAtlasData = currentTextureData.parent;
                if (this._armature.replacedTexture && this._displayData && currentTextureAtlasData === this._displayData.texture.parent) {
                    currentTextureAtlasData = this._armature._replaceTextureAtlasData;
                    if (!currentTextureAtlasData) {
                        currentTextureAtlasData = dragonBones.BaseObject.borrowObject(dragonBones.PhaserTextureAtlasData);
                        currentTextureAtlasData.copyFrom(currentTextureData.parent);
                        currentTextureAtlasData.texture = this._armature.replacedTexture;
                        this._armature._replaceTextureAtlasData = currentTextureAtlasData;
                    }
                    currentTextureData = currentTextureAtlasData.getTexture(currentTextureData.name);
                }
                var currentTextureAtlas = currentTextureAtlasData.texture;
                if (currentTextureAtlas) {
                    if (!currentTextureData.texture) {
                        currentTextureData.texture = new PIXI.Texture(currentTextureAtlas, currentTextureData.region, currentTextureData.region, new PIXI.Rectangle(0, 0, currentTextureData.region.width, currentTextureData.region.height));
                    }
                    var normalDisplay_1 = this._renderDisplay;
                    normalDisplay_1.texture = currentTextureData.texture;
                    this._updateVisible();
                    return;
                }
            }
            var normalDisplay = this._renderDisplay;
            normalDisplay.visible = false;
            normalDisplay.texture = null;
            normalDisplay.x = 0.0;
            normalDisplay.y = 0.0;
        };
        PhaserSlot.prototype._updateMesh = function () {
            var hasFFD = this._ffdVertices.length > 0;
            if (this._meshData.skinned) {
                for (var i = 0, iF = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                    var iH = i / 2;
                    var boneIndices = this._meshData.boneIndices[iH];
                    var boneVertices = this._meshData.boneVertices[iH];
                    var weights = this._meshData.weights[iH];
                    var xG = 0.0, yG = 0.0;
                    for (var iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
                        var bone = this._meshBones[boneIndices[iB]];
                        var matrix = bone.globalTransformMatrix;
                        var weight = weights[iB];
                        var xL = 0.0, yL = 0.0;
                        if (hasFFD) {
                            xL = boneVertices[iB * 2] + this._ffdVertices[iF];
                            yL = boneVertices[iB * 2 + 1] + this._ffdVertices[iF + 1];
                        }
                        else {
                            xL = boneVertices[iB * 2];
                            yL = boneVertices[iB * 2 + 1];
                        }
                        xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
                        yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;
                        iF += 2;
                    }
                }
            }
            else if (hasFFD) {
                var vertices = this._meshData.vertices;
                for (var i = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                    var xG = vertices[i] + this._ffdVertices[i];
                    var yG = vertices[i + 1] + this._ffdVertices[i + 1];
                }
            }
        };
        PhaserSlot.prototype._updateTransform = function (isSkinnedMesh) {
            if (isSkinnedMesh) {
                this._renderDisplay.position.x = 0.0;
                this._renderDisplay.position.y = 0.0;
                this._renderDisplay.scale.x = 1.0;
                this._renderDisplay.scale.y = 1.0;
                this._renderDisplay.rotation = 0.0;
                this._renderDisplay.pivot.x = 0.0;
                this._renderDisplay.pivot.y = 0.0;
            }
            else {
                var x = this.globalTransformMatrix.tx - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
                var y = this.globalTransformMatrix.ty - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY);
                this.updateGlobalTransform();
                this._renderDisplay.position.x = this._renderDisplayX + this.globalTransformMatrix.tx -
                    (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
                this._renderDisplay.position.y = this._renderDisplayY + this.globalTransformMatrix.ty -
                    (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY);
                this._renderDisplay.scale.x = !this.global.scaleX ? 1 : this.global.scaleX;
                this._renderDisplay.scale.y = !this.global.scaleY ? 1 : this.global.scaleY;
                this._renderDisplay.rotation = this.global.skewX || 0;
            }
        };
        return PhaserSlot;
    }(dragonBones.Slot));
    dragonBones.PhaserSlot = PhaserSlot;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    var PhaserTextureAtlasData = (function (_super) {
        __extends(PhaserTextureAtlasData, _super);
        function PhaserTextureAtlasData() {
            return _super.call(this) || this;
        }
        PhaserTextureAtlasData.toString = function () {
            return "[class dragonBones.PhaserTextureAtlasData]";
        };
        PhaserTextureAtlasData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.texture) {
                this.texture = null;
            }
        };
        PhaserTextureAtlasData.prototype.generateTexture = function () {
            return dragonBones.BaseObject.borrowObject(PhaserTextureData);
        };
        return PhaserTextureAtlasData;
    }(dragonBones.TextureAtlasData));
    dragonBones.PhaserTextureAtlasData = PhaserTextureAtlasData;
    var PhaserTextureData = (function (_super) {
        __extends(PhaserTextureData, _super);
        function PhaserTextureData() {
            return _super.call(this) || this;
        }
        PhaserTextureData.toString = function () {
            return "[class dragonBones.PhaserTextureData]";
        };
        PhaserTextureData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.texture) {
                this.texture.destroy(true);
                this.texture = null;
            }
        };
        return PhaserTextureData;
    }(dragonBones.TextureData));
    dragonBones.PhaserTextureData = PhaserTextureData;
})(dragonBones || (dragonBones = {}));
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
