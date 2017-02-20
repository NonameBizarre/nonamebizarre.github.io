var TProject;
(function (TProject) {
    var _ = (function () {
        function _() {
        }
        _.log = console.log;
        return _;
    })();
    TProject._ = _;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TProject;
(function (TProject) {
    var GameUI = (function (_super) {
        __extends(GameUI, _super);
        function GameUI(x, y) {
            _super.call(this, TProject.Core.game, 0, 0);
            var starXOffset = -345;
            var starYOffset = -215;
            this.star1 = this.game.add.sprite(starXOffset, starYOffset, "Star", "StarPoint0001.png");
            this.star1.anchor.set(0.5);
            this.star1.animations.add("start");
            /*
            this.star1.animations.play("start", 24, false, false);

            this.game.time.events.add(Phaser.Timer.SECOND * 2.6, ()=>{
                    this.star1.loadTexture("Star", "StarPoint0001.png");
                });
            */
            this.star2 = this.game.add.sprite(this.star1.width - 3 + starXOffset, starYOffset, "Star", "StarPoint0001.png");
            this.star2.anchor.set(0.5);
            this.star2.animations.add("start");
            this.star3 = this.game.add.sprite(this.star1.width * 2 - 6 + starXOffset, starYOffset, "Star", "StarPoint0001.png");
            this.star3.anchor.set(0.5);
            this.star3.animations.add("start");
            // draw order
            this.addChild(this.star1);
            this.addChild(this.star2);
            this.addChild(this.star3);
        }
        return GameUI;
    })(Phaser.Sprite);
    TProject.GameUI = GameUI;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TProject;
(function (TProject) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(x, y, parent) {
            _super.call(this, TProject.Core.game, x, y, "Char", "Char0001.png");
            //this._gravity = 0.8;
            this._parentBG = parent;
        }
        return Player;
    })(Phaser.Sprite);
    TProject.Player = Player;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var Core = (function () {
        function Core() {
        }
        Core.init = function (width, height) {
            this.globalEvents = new TProject.OEventDispatcher();
            this.defaultWidth = width;
            this.defaultHeight = height;
            this.centerX = width * 0.5;
            this.centerY = height * 0.5;
        };
        Core.begin = function (game) {
            this.game = game;
            this.game.input.maxPointers = 1;
            this.game.stage.disableVisibilityChange = true;
            this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            this.game.input.touch.preventDefault = false;
            window.addEventListener("resize", this.checkScreenStatus.bind(this), false);
            this.game.scale.onOrientationChange.add(this.checkScreenStatus, this);
            this.checkScreenStatus();
        };
        Core.checkScreenStatus = function () {
            if (this.fullWidth == window.innerWidth &&
                this.fullHeight == window.innerHeight) {
                return;
            }
            this.changeScale(this.game);
            this.globalEvents.dispatch("changeOrientationAndResize");
        };
        Core.changeScale = function (game) {
            this.fullWidth = this.width = window.innerWidth;
            this.fullHeight = this.height = window.innerHeight;
            var dw = this.width;
            var dh = this.height;
            if (this.isLandscape != this.isDefaultLandscape) {
                dw = this.height;
                dh = this.width;
            }
            this.scale = Math.min(dw / this.defaultWidth, dh / this.defaultHeight);
            this.bgModeScale = Math.max(this.width / this.defaultWidth, this.height / this.defaultHeight) / this.scale;
            this.width /= this.scale;
            this.height /= this.scale;
            game.scale.setUserScale(this.scale, this.scale, 0, 0);
            game.scale.setGameSize(this.width, this.height);
            game.world.setBounds(0, 0, this.width, this.height);
            game.scale.refresh();
        };
        Core.gotoSponsor = function () {
            var fnc = window["GOTO_SPONSOR"];
            if (typeof fnc === "function") {
                fnc();
            }
        };
        Object.defineProperty(Core, "isDesktop", {
            get: function () {
                return this.game.device.desktop;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Core, "isLandscape", {
            get: function () {
                return this.height < this.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Core, "isDefaultLandscape", {
            get: function () {
                return this.defaultHeight < this.defaultWidth;
            },
            enumerable: true,
            configurable: true
        });
        Core.scale = 1;
        Core.bgModeScale = 1;
        return Core;
    })();
    TProject.Core = Core;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TProject;
(function (TProject) {
    var OButton = (function (_super) {
        __extends(OButton, _super);
        function OButton(key, frame, cb) {
            if (cb === void 0) { cb = null; }
            var up = null;
            var over = null;
            var down = null;
            if (frame.length > 0) {
                up = frame[0];
                if (frame.length > 1) {
                    over = frame[1];
                    if (frame.length > 2)
                        down = frame[2];
                    else
                        down = frame[0];
                }
                else {
                    over = frame[0];
                    down = frame[0];
                }
            }
            _super.call(this, TProject.Core.game, 0, 0, key, null, null, over, up, down, null);
            this._framesString = [up, over, down];
            this.soundOver = "over";
            this.soundDown = "click";
            this.anchor.setTo(0.5);
            this._cb = cb;
            this._deltaScale = 0.1;
            this._defaultScale = 1.0;
            this._isDown = false;
            this._isOver = false;
            this.onInputOver.add(this.over, this);
            this.onInputOut.add(this.out, this);
            this.onInputDown.add(this.down, this);
            this.onInputUp.add(this.up, this);
        }
        OButton.prototype.setCBContext = function (cntx) {
            this._cntxt = cntx;
        };
        OButton.prototype.setAnimationScale = function (delta, defaultScale) {
            if (delta === void 0) { delta = 0; }
            if (defaultScale === void 0) { defaultScale = 1; }
            this._deltaScale = delta;
            this._defaultScale = defaultScale;
        };
        OButton.prototype.over = function () {
            if (!this._isDown) {
                this.scale.set(this._defaultScale + this._deltaScale);
            }
            this._isOver = true;
        };
        OButton.prototype.out = function () {
            if (!this._isDown) {
                this.scale.set(this._defaultScale);
            }
            this._isOver = false;
        };
        OButton.prototype.up = function () {
            var _this = this;
            if (!this._isDown) {
                return;
            }
            if (!TProject.Core.isDesktop) {
                if (!this._isDown && !this.input.pointerDown()) {
                    return;
                }
            }
            this.scale.set(this._isOver ? this._defaultScale + this._deltaScale : this._defaultScale);
            var tap = (this.game.device.desktop ? this._isOver : this.input.pointerOver());
            if (this._isOver) {
                this.frameName = this._framesString[1];
            }
            else {
                if (tap) {
                    setTimeout(function () {
                        _this.frameName = _this._framesString[0];
                    }, 5);
                }
            }
            this._isDown = false;
            if (tap && this._cb != null) {
                // this.setCheck(!this._check);
                //soundClick
                //Config.audio.play(this.soundClick);
                if (this._cntxt)
                    this._cb.bind(this._cntxt)();
                else
                    this._cb();
                this.frameName = this._framesString[0];
            }
            else {
                if (tap == false)
                    this.scale.set(this._defaultScale);
            }
        };
        OButton.prototype.down = function () {
            TProject._.log(this._isDown, this.input.pointerDown());
            if (this._isDown) {
                return;
            }
            if (!TProject.Core.isDesktop) {
                if (this.input.pointerDown()) {
                    return;
                }
            }
            this.scale.set(this._defaultScale - this._deltaScale);
            this._isDown = true;
        };
        OButton.prototype.deleteFromParent = function () {
            if (this.parent) {
                this.parent.removeChild(this);
            }
            this.onInputOver.remove(this.over, this);
            this.onInputOut.remove(this.out, this);
            this.onInputDown.remove(this.down, this);
            this.onInputUp.remove(this.up, this);
        };
        Object.defineProperty(OButton.prototype, "enabled", {
            set: function (value) {
                var _this = this;
                this.inputEnabled = value;
                if (!value) {
                    setTimeout(function () {
                        _this.frameName = _this._framesString[0];
                        _this.scale.set(_this._defaultScale);
                    }, 5);
                }
            },
            enumerable: true,
            configurable: true
        });
        return OButton;
    })(Phaser.Button);
    TProject.OButton = OButton;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TProject;
(function (TProject) {
    var OButtonCheck = (function (_super) {
        __extends(OButtonCheck, _super);
        function OButtonCheck(key, frameOn, frameOff, cb) {
            if (cb === void 0) { cb = null; }
            var upOn = null;
            var overOn = null;
            var downOn = null;
            var upOff = null;
            var overOff = null;
            var downOff = null;
            if (frameOn.length > 0) {
                upOn = frameOn[0];
                if (frameOn.length > 1) {
                    overOn = frameOn[1];
                    if (frameOn.length > 2)
                        downOn = frameOn[2];
                    else
                        downOn = frameOn[0];
                }
                else {
                    overOn = frameOn[0];
                    downOn = frameOn[0];
                }
            }
            if (frameOff.length > 0) {
                upOff = frameOff[0];
                if (frameOff.length > 1) {
                    overOff = frameOff[1];
                    if (frameOff.length > 2)
                        downOff = frameOff[2];
                    else
                        downOff = frameOff[0];
                }
                else {
                    overOff = frameOff[0];
                    downOff = frameOff[0];
                }
            }
            _super.call(this, TProject.Core.game, 0, 0, key, null, null, overOn, upOn, downOn, null);
            this._framesString = [upOn, overOn, downOn, upOff, overOff, downOff];
            this._check = true;
            this.soundOver = "over";
            this.soundDown = "click";
            this.anchor.setTo(0.5);
            this._cb = cb;
            this._deltaScale = 0.1;
            this._defaultScale = 1.0;
            this._isDown = false;
            this._isOver = false;
            this.onInputOver.add(this.over, this);
            this.onInputOut.add(this.out, this);
            this.onInputDown.add(this.down, this);
            this.onInputUp.add(this.up, this);
            //this.onInputOverHandler.add(this.over, this);
        }
        OButtonCheck.prototype.setCheck = function (value) {
            if (this._check == value) {
                return;
            }
            this._check = value;
            var delta = 0;
            if (!value) {
                delta = 3;
            }
            this.setFrames(this._framesString[delta + 1], this._framesString[delta], this._framesString[delta + 2], this._framesString[delta]);
        };
        Object.defineProperty(OButtonCheck.prototype, "check", {
            get: function () {
                return this._check;
            },
            enumerable: true,
            configurable: true
        });
        OButtonCheck.prototype.setCBContext = function (cntx) {
            this._cntxt = cntx;
        };
        OButtonCheck.prototype.setAnimationScale = function (delta, defaultScale) {
            if (delta === void 0) { delta = 0; }
            if (defaultScale === void 0) { defaultScale = 1; }
            this._deltaScale = delta;
            this._defaultScale = defaultScale;
        };
        OButtonCheck.prototype.over = function () {
            if (!this._isDown) {
                this.scale.set(this._defaultScale + this._deltaScale);
            }
            this._isOver = true;
            console.log("OVER");
        };
        OButtonCheck.prototype.out = function () {
            if (!this._isDown) {
                this.scale.set(this._defaultScale);
            }
            this._isOver = false;
        };
        OButtonCheck.prototype.up = function () {
            var _this = this;
            if (!this._isDown) {
                return;
            }
            if (!TProject.Core.isDesktop) {
                if (!this._isDown && !this.input.pointerDown()) {
                    return;
                }
            }
            this.scale.set(this._isOver ? this._defaultScale + this._deltaScale : this._defaultScale);
            var tap = (this.game.device.desktop ? this._isOver : this.input.pointerOver());
            if (this._isOver) {
                this.frameName = this._framesString[1 + (this._check ? 0 : 3)];
            }
            else {
                if (tap) {
                    setTimeout(function () {
                        _this.frameName = _this._framesString[(_this._check ? 0 : 3)];
                    }, 5);
                }
            }
            this._isDown = false;
            if (tap && this._cb != null) {
                // this.setCheck(!this._check);
                //soundClick
                //Config.audio.play(this.soundClick);
                this.setCheck(!this.check);
                if (this._cntxt)
                    this._cb.bind(this._cntxt)();
                else
                    this._cb();
                this.frameName = this._framesString[(this._check ? 0 : 3)];
            }
            else {
                if (tap == false)
                    this.scale.set(this._defaultScale);
            }
        };
        OButtonCheck.prototype.down = function () {
            if (this._isDown) {
                return;
            }
            if (!TProject.Core.isDesktop) {
                if (this.input.pointerDown()) {
                    return;
                }
            }
            this.scale.set(this._defaultScale - this._deltaScale);
            this._isDown = true;
        };
        OButtonCheck.prototype.deleteFromParent = function () {
            if (this.parent) {
                this.parent.removeChild(this);
            }
            this.onInputOver.remove(this.over, this);
            this.onInputOut.remove(this.out, this);
            this.onInputDown.remove(this.down, this);
            this.onInputUp.remove(this.up, this);
        };
        Object.defineProperty(OButtonCheck.prototype, "enabled", {
            set: function (value) {
                var _this = this;
                this.inputEnabled = value;
                if (!value) {
                    setTimeout(function () {
                        _this.frameName = _this._framesString[(_this._check ? 0 : 3)];
                        _this.scale.set(_this._defaultScale);
                    }, 5);
                }
            },
            enumerable: true,
            configurable: true
        });
        return OButtonCheck;
    })(Phaser.Button);
    TProject.OButtonCheck = OButtonCheck;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var OEvent = (function () {
        function OEvent(name, cb, useCapture) {
            if (useCapture === void 0) { useCapture = false; }
            this.name = name;
            this.cb = cb;
            this.useCapture = useCapture;
        }
        return OEvent;
    })();
    var OEventDispatcher = (function () {
        function OEventDispatcher() {
            this._listeners = [];
        }
        OEventDispatcher.prototype.on = function (msg, cb, useCapture) {
            if (cb == null)
                return;
            for (var i = 0; i < this._listeners.length; i++) {
                if (msg == this._listeners[i].name) {
                    if (cb == this._listeners[i].cb) {
                        return;
                    }
                }
            }
            this._listeners.push(new OEvent(msg, cb, useCapture));
        };
        OEventDispatcher.prototype.off = function (msg, cb) {
            var i = 0;
            while (i < this._listeners.length) {
                if (msg == this._listeners[i].name) {
                    if (cb == null || cb == this._listeners[i].cb) {
                        this._listeners.splice(i, 1);
                        continue;
                    }
                }
                i++;
            }
        };
        OEventDispatcher.prototype.dispatch = function (msg) {
            for (var i = 0; i < this._listeners.length; i++) {
                if (msg == this._listeners[i].name) {
                    this._listeners[i].cb();
                    if (this._listeners[i].useCapture) {
                        return;
                    }
                }
            }
        };
        return OEventDispatcher;
    })();
    TProject.OEventDispatcher = OEventDispatcher;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TProject;
(function (TProject) {
    var OSprite = (function (_super) {
        __extends(OSprite, _super);
        // private _factory: OFactory;
        function OSprite(x, y, key, frame) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            _super.call(this, TProject.Core.game, 0, 0, key, frame);
            this.anchor.set(0.5);
            //this.game.stage.addChild(this);
            this.game.world.addChild(this);
            this._landscapeScale = 1.0;
            this._portretScale = 1.0;
            this._bgMode = false;
            //this._leftOffset = null;
            //this._bottomOffset = null;
            this._landscapeVisible = true;
            this._portretVisible = true;
            this._screenScreenCompress = false;
            this._customMask = null;
            if (!TProject.Core.isDefaultLandscape) {
                this.setPortretPosition(x, y);
                this.setLandscapePosition(y, x);
            }
            else {
                this.setPortretPosition(y, x);
                this.setLandscapePosition(x, y);
            }
            this.changeOrientation();
            TProject.Core.globalEvents.on("changeOrientationAndResize", this.changeOrientation.bind(this), false);
        }
        OSprite.prototype.add = function (child) {
            this.addChild(child);
        };
        /*
            Устанавливаем ОТНОСИТЕЛЬНУЮ позицию. На разных устройствах визуальное положение компонента
            может слегка отличаться
        */
        OSprite.prototype.otherXY = function (x, y) {
            if (!TProject.Core.isDefaultLandscape) {
                this.setLandscapePosition(x, y);
            }
            else {
                this.setPortretPosition(x, y);
            }
            return this;
        };
        OSprite.prototype.end = function () {
            this.changeOrientation();
            return this;
        };
        OSprite.prototype.setSize = function (width, height) {
            this.width = width;
            this.height = height;
            return this;
        };
        OSprite.prototype.setPortretPosition = function (x, y) {
            this._portretX = x / TProject.Core.defaultWidth;
            this._portretY = y / TProject.Core.defaultHeight;
            //if (update) {
            //     this.changeOrientation();
            //}
        };
        OSprite.prototype.setLandscapePosition = function (x, y) {
            this._landscapeX = x / TProject.Core.defaultHeight;
            this._landscapeY = y / TProject.Core.defaultWidth;
        };
        /*
            Можно установить дополнительные модификаторы для скейла в определенных ориентациях
        */
        OSprite.prototype.myScale = function (value) {
            if (TProject.Core.isDefaultLandscape) {
                this._landscapeScale = value;
            }
            else {
                this._portretScale = value;
            }
            return this;
        };
        OSprite.prototype.otherScale = function (value) {
            if (!TProject.Core.isDefaultLandscape) {
                this._landscapeScale = value;
            }
            else {
                this._portretScale = value;
            }
            return this;
        };
        OSprite.prototype.getCurrentScale = function () {
            if (TProject.Core.isLandscape) {
                return this._landscapeScale;
            }
            else {
                return this._portretScale;
            }
        };
        OSprite.prototype.myVisible = function (value) {
            if (TProject.Core.isDefaultLandscape) {
                this._landscapeVisible = value;
            }
            else {
                this._portretVisible = value;
            }
            return this;
        };
        OSprite.prototype.otherVisible = function (value) {
            if (!TProject.Core.isDefaultLandscape) {
                this._landscapeVisible = value;
            }
            else {
                this._portretVisible = value;
            }
            return this;
        };
        OSprite.prototype.enabledScreenCompress = function () {
            this._screenScreenCompress = true;
            return this;
        };
        OSprite.prototype.enabledBgMode = function () {
            this._bgMode = true;
            return this;
        };
        OSprite.prototype.enabledMask = function (offsetX, offsetY, width, height, testMode) {
            this._customMask = new Phaser.Graphics(this.game, 0, 0);
            this._customMask.beginFill(0xff0000, 0.5);
            var ww = width ? width : TProject.Core.defaultWidth;
            var hh = height ? height : TProject.Core.defaultHeight;
            this._customMask.drawRect(-ww * 0.5 + (offsetX ? offsetX : 0), -hh * 0.5 + (offsetY ? offsetY : 0), ww, hh);
            this._customMask.endFill();
            if (testMode != true) {
                this.mask = this._customMask;
            }
            this.addChild(this._customMask);
            return this;
        };
        /*
            А тут творится магия.
        */
        OSprite.prototype.changeOrientation = function () {
            var varscale = 1;
            if (this._bgMode) {
                varscale = TProject.Core.bgModeScale;
            }
            else {
                varscale = TProject.Core.isLandscape ? this._landscapeScale : this._portretScale;
            }
            /*
            let offsetX = this._leftOffset;
            if (this._rigthOffset) offsetX = this._rigthOffset + Core.width;

            let offsetY = this._topOffset;
            if (this._bottomOffset) offsetY = this._bottomOffset + Core.height;
            */
            var dw = TProject.Core.defaultWidth;
            var dh = TProject.Core.defaultHeight;
            if (this._screenScreenCompress) {
                varscale = Math.min(TProject.Core.width / dw, TProject.Core.height / dh);
            }
            if (TProject.Core.isLandscape) {
                this.x = (TProject.Core.width * this._landscapeX);
                this.y = (TProject.Core.height * this._landscapeY);
                this.visible = this._landscapeVisible;
            }
            else {
                this.x = (TProject.Core.width * this._portretX);
                this.y = (TProject.Core.height * this._portretY);
                this.visible = this._portretVisible;
            }
            this.scale.set(varscale);
        };
        return OSprite;
    })(Phaser.Sprite);
    TProject.OSprite = OSprite;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TProject;
(function (TProject) {
    var OState = (function (_super) {
        __extends(OState, _super);
        //private _containers: OSprite[];
        function OState(changeOrientation) {
            if (changeOrientation === void 0) { changeOrientation = false; }
            _super.call(this);
            if (changeOrientation) {
                TProject.Core.globalEvents.on("changeOrientationAndResize", this.changeOrientation.bind(this), false);
                this.changeOrientation();
            }
        }
        OState.prototype.changeOrientation = function () {
            if (TProject.Core.isLandscape) {
                this.onLandscape();
            }
            else {
                this.onPortret();
            }
        };
        OState.prototype.onPortret = function () {
        };
        OState.prototype.onLandscape = function () {
        };
        return OState;
    })(Phaser.State);
    TProject.OState = OState;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var Main = (function () {
        function Main() {
            TProject._.log("Init Core!");
            TProject.Core.init(760, 500);
            this.game = new Phaser.Game(TProject.Core.defaultWidth, TProject.Core.defaultHeight, Phaser.AUTO, "game", null, false);
            this.game.state.add("Boot", TProject.Boot, true);
            this.game.state.add("Body", TProject.Body);
        }
        return Main;
    })();
    TProject.Main = Main;
})(TProject || (TProject = {}));
window.onload = function () {
    var game = new TProject.Main();
    setTimeout("window.scrollTo(0, 1)", 10);
};

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TProject;
(function (TProject) {
    var Body = (function (_super) {
        __extends(Body, _super);
        function Body() {
            _super.call(this, false); // true - и будут отслеживаться повороты
        }
        Body.prototype.create = function () {
            TProject._.log("Start game!");
            this._gameContainer = new TProject.OSprite(TProject.Core.centerY, TProject.Core.centerX).
                enabledScreenCompress().
                //enabledMask().
                //enabledMask(null, null, null, null, true).
                end();
            this._bg = this.game.add.sprite(0.0, -TProject.Core.centerY - 200, "bg");
            this._bg.anchor.set(0.5, 0.0);
            this._player = new TProject.Player(0, 400, this._bg);
            this._player.anchor.set(0.5);
            this._gameUI = new TProject.GameUI(TProject.Core.centerY, TProject.Core.centerX);
            this._gameUI.anchor.set(0.5);
            // draw order
            this._gameContainer.add(this._bg);
            this._bg.addChild(this._player);
            this._gameContainer.add(this._gameUI);
            //
            this._gravity = 1.5;
            this._acceleration = 0;
        };
        Body.prototype.update = function () {
            if (this._acceleration > this._gravity) {
                this._acceleration -= this._gravity;
            }
            else {
                this._acceleration = this._gravity;
            }
            if (this._bg.y > -1100) {
                this._bg.y -= this._acceleration * 1.1;
            }
            if (this._player.y < 1225) {
                this._player.y += this._acceleration;
            }
        };
        Body.prototype.render = function () {
        };
        // а это то самое отслеживание поворотов
        Body.prototype.onPortret = function () {
            TProject._.log("Portret");
        };
        Body.prototype.onLandscape = function () {
            TProject._.log("Landscape");
        };
        return Body;
    })(TProject.OState);
    TProject.Body = Body;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TProject;
(function (TProject) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            TProject._.log("Loading...");
            // Здесь загружаем ресурсы для прелоудера
            this.game.load.image("bg", "assets/img/testBg.png");
            this.game.load.atlas("Char", "assets/img/Char.png", "assets/img/Char.json");
            this.game.load.atlas("Main", "assets/img/Main.png", "assets/img/Main.json");
            this.game.load.atlas("Star", "assets/img/Star.png", "assets/img/Star.json");
        };
        Boot.prototype.create = function () {
            TProject.Core.begin(this.game);
            this.game.state.start("Body", true);
        };
        return Boot;
    })(Phaser.State);
    TProject.Boot = Boot;
})(TProject || (TProject = {}));
