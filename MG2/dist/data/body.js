var TProject;
(function (TProject) {
    var _ = (function () {
        function _() {
        }
        _.randomInt = function (min, max) {
            return Math.floor((max - min + 0.1) * Math.random()) + min;
        };
        _.log = console.log;
        return _;
    })();
    TProject._ = _;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var Config = (function () {
        function Config() {
        }
        return Config;
    })();
    TProject.Config = Config;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TProject;
(function (TProject) {
    var MobileController = (function (_super) {
        __extends(MobileController, _super);
        function MobileController(game, cbLeft, cbRight, cbJump) {
            _super.call(this, game, 0.0, 0.0);
            this._left = new SimpleButton(this.game, "moveBtn0000", true, cbLeft);
            this._left.tint = 0x000000;
            this.addChild(this._left);
            this._right = new SimpleButton(this.game, "moveBtn0000", true, cbRight);
            this._right.scale.x = -1;
            this._right.x = 130.0;
            this._right.defScale = -1.0;
            this._right.tint = 0x000000;
            this.addChild(this._right);
            this._jump = new SimpleButton(this.game, "jumpBtn0000", false, cbJump);
            this._jump.x = game.width - 160.0;
            this._jump.tint = 0x000000;
            this.addChild(this._jump);
        }
        MobileController.prototype.update = function () {
            this._left.update();
            this._right.update();
        };
        MobileController.prototype.up = function () {
            this._left.testUp();
            this._right.testUp();
            this._jump.testUp();
        };
        MobileController.prototype.enabled = function (value) {
            this._left.inputEnabled = value;
            this._right.inputEnabled = value;
            this._jump.inputEnabled = value;
        };
        return MobileController;
    })(Phaser.Sprite);
    TProject.MobileController = MobileController;
    var SimpleButton = (function (_super) {
        __extends(SimpleButton, _super);
        function SimpleButton(game, name, sticky, cb) {
            _super.call(this, game, 0.0, 0.0, "mobileButton", name);
            this._name = name;
            this.anchor.set(0.5);
            this.inputEnabled = true;
            this.alpha = 0.6;
            this.defScale = 1.0;
            this._cb = cb;
            this._sticky = sticky;
            this.events.onInputDown.add(this.down, this);
            this.events.onInputUp.add(this.up, this);
        }
        SimpleButton.prototype.update = function () {
            if (this._down && this._sticky && this._cb) {
                this._cb();
            }
        };
        SimpleButton.prototype.testUp = function () {
            if (!this.input.pointerDown()) {
                return;
            }
            if (this._down) {
                //_.log("SUPER_UP", this.input.pointerDown(), this.input.pointerUp());
                this.up();
            }
        };
        SimpleButton.prototype.up = function () {
            this._down = false;
            this.scale.set(this.defScale, 1.0);
            this.alpha = 0.6;
            /*
            if (this._name == "moveBtn0000") {
                _.log("UP")
            }
            */
        };
        SimpleButton.prototype.down = function () {
            if (this._down) {
                return;
            }
            /*
            if (this._name == "moveBtn0000") {
                _.log("DOWN")
            }
            */
            this._down = true;
            this.scale.set(this.defScale * 0.9, 0.9);
            this.alpha = 1.0;
            if (this._cb) {
                this._cb();
            }
        };
        return SimpleButton;
    })(Phaser.Sprite);
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
        function OButton(game, key, frame, cb) {
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
            _super.call(this, game, 0, 0, key, null, null, over, up, down, null);
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
        OButton.prototype.setNewFrames = function (frame) {
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
            this._framesString = [up, over, down];
            this.setFrames(over, up, down);
        };
        OButton.prototype.over = function () {
            if (!this._isDown) {
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
            this.scale.set(this._defaultScale);
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
            if (this._isDown) {
                return;
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
        function OButtonCheck(game, key, frameOn, frameOff, cb) {
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
            _super.call(this, game, 0, 0, key, null, null, overOn, upOn, downOn, null);
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
;

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TProject;
(function (TProject) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y, onWhater, groundLine) {
            _super.call(this, game, x, y);
            this._onWhater = onWhater;
            this._ground = groundLine + 10;
            this._xSpeed = 0;
            this._ySpeed = 0;
            this._sinArg = 0;
            this._gravity = 0.25;
            this._isJump = true;
            this._isHit = false;
            this._setAnim = false;
            this._splashEmitter = this.game.add.emitter(0, 0, 40);
            this._splashEmitter.makeParticles("gameAsset", ["part_1", "part_2", "part_3", "part_4", "part_5", "part_6"]);
            this._splashEmitter.gravity = 775;
            //this._splashEmitter.setScale(0, 1, 0, 1, 300);
            this._splashEmitter.setAlpha(1, 0, 1200);
            this._splashEmitter.setXSpeed(-300, -50);
            this._splashEmitter.setYSpeed(-300, -355);
            this.addChild(this._splashEmitter);
            this._playerContainer = this.game.add.sprite(0, 0, "playerAsset", "waterBike_10002");
            this._playerContainer.anchor.set(0.5);
            this.addChild(this._playerContainer);
            this._splashEmitter.width = this._playerContainer.width / 2;
            this._splashEmitter.height = 2;
            this._bikeWhaterEmitter = this.game.add.emitter(0, 0, 30);
            this._bikeWhaterEmitter.makeParticles("gameAsset", ["part_3", "part_4", "part_5", "part_6"]);
            this._bikeWhaterEmitter.gravity = 350;
            //this._bikeWhaterEmitter.setAlpha(1, 0, 600);
            this._bikeWhaterEmitter.setScale(1, 0, 1, 0, 800);
            this._bikeWhaterEmitter.setXSpeed(-300, -300);
            this._bikeWhaterEmitter.setYSpeed(-100, -150);
            this._bikeWhaterEmitter.start(false, 800, 75, null);
            this.addChild(this._bikeWhaterEmitter);
            game.physics.arcade.enable(this._playerContainer);
            this._playerContainer.body.setSize(40, 20, 35, 55);
        }
        Player.prototype.hit = function () {
        };
        Player.prototype.addSpeed = function () {
            if (!this._isHit) {
                if (this._xSpeed < 6.5)
                    this._xSpeed += 0.5;
            }
        };
        Player.prototype.decreaseSpeed = function () {
            if (!this._isHit) {
                if (this._xSpeed > -6.5)
                    this._xSpeed -= 0.5;
            }
        };
        Player.prototype.jump = function () {
            var _this = this;
            if (!this._isJump) {
                this.game.tweens.remove(this._inWhaterTween);
                this._isJump = true;
                this._inWhaterTween = this.game.add.tween(this._playerContainer.body).to({ y: [this._ground] }, 50, Phaser.Easing.Sinusoidal.Out, true);
                this._inWhaterTween.onComplete.add(function () {
                    _this._playerContainer.body.y = _this._ground;
                    _this._ySpeed = -7.5;
                    _this._splashEmitter.x = _this._playerContainer.x;
                    _this._splashEmitter.y = _this._playerContainer.y + 30;
                    _this._splashEmitter.start(true, 1500, null, 20);
                    _this._bikeWhaterEmitter.on = false;
                    _this._setAnim = false;
                });
            }
        };
        Player.prototype.update = function () {
            var _this = this;
            if (!this._isHit) {
                this._playerContainer.body.x += this._xSpeed;
                this._bikeWhaterEmitter.x = this._playerContainer.x - 40;
                this._bikeWhaterEmitter.y = this._playerContainer.y + 10;
                this._playerContainer.body.rotation = -(this._playerContainer.worldPosition.x - 90) / 700 * 30;
                if (this._playerContainer.worldPosition.x > 700) {
                    this._xSpeed = 0;
                    this._playerContainer.body.x = this._playerContainer.body.x - (this._playerContainer.worldPosition.x - 700);
                }
                else if (this._playerContainer.worldPosition.x < 90) {
                    this._xSpeed = 0;
                    this._playerContainer.body.x = this._playerContainer.body.x + (90 - this._playerContainer.worldPosition.x);
                }
                if (!this._isJump) {
                    this._playerContainer.body.y += Math.sin(this._sinArg += 0.1) / 2;
                }
                else {
                    //_.log(this._playerContainer.body.y + " GROUND: " + this._ground + "UPDATE!");
                    if (this._playerContainer.body.y <= this._ground) {
                        this._playerContainer.body.y += this._ySpeed;
                        this._ySpeed += this._gravity;
                    }
                    else {
                        if (!this._setAnim) {
                            this._setAnim = true;
                            this._splashEmitter.x = this._playerContainer.x;
                            this._splashEmitter.y = this._playerContainer.y + 50;
                            this._splashEmitter.start(true, 1500, null, 20);
                            this._isJump = false;
                            this._bikeWhaterEmitter.on = true;
                            this._ySpeed = 0;
                            this._sinArg = 0;
                            this._inWhaterTween = this.game.add.tween(this._playerContainer.body).to({ y: [this._playerContainer.body.y + 32] }, 200, Phaser.Easing.Sinusoidal.Out, true);
                            this._inWhaterTween.onComplete.add(function () {
                                _this._inWhaterTween = _this.game.add.tween(_this._playerContainer.body).to({ y: [_this._ground] }, 500, Phaser.Easing.Sinusoidal.Out, true);
                                _this._inWhaterTween.onComplete.add(function () {
                                    //this._setAnim = false;
                                });
                            });
                        }
                    }
                }
            }
        };
        Player.prototype.render = function () {
            this.game.debug.body(this._playerContainer);
        };
        return Player;
    })(Phaser.Sprite);
    TProject.Player = Player;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TProject;
(function (TProject) {
    var WinLosePanel = (function (_super) {
        __extends(WinLosePanel, _super);
        function WinLosePanel(game, body) {
            var _this = this;
            _super.call(this, game, 0, 0);
            this.anchor.set(0.5);
            this._backRect = this.game.add.graphics(0, 60);
            this._backRect.beginFill(0x000000, 1);
            this._backRect.alpha = 0;
            this._backRect.drawRect(-this.game.world.width / 2, -this.game.world.height / 2, this.game.world.width, this.game.world.height);
            this._backRect.endFill();
            this.addChild(this._backRect);
            this._visual = game.add.image(0, -65, "ui", "panelWin");
            this._visual.anchor.set(0.5);
            this.addChild(this._visual);
            this._play = new TProject.OButton(game, "ui", ["btnPLayOff", "btnPLayOn", "btnPLayOn"], function () {
                body.replay();
                _this.hide();
            });
            this._play.y = 100;
            this._visual.addChild(this._play);
            this._play.setAnimationScale(0);
            this.visible = false;
        }
        WinLosePanel.prototype.show = function (win) {
            if (win === void 0) { win = true; }
            this._visual.frameName = (win ? "panelWin" : "panelLose");
            this.visible = true;
            this._play.setNewFrames(win ? ["btnPLayOff", "btnPLayOn", "btnPLayOn"] : ["btnTryOff", "btnTryOn", "btnTryOn"]);
            this._visual.alpha = 0;
            this._backRect.alpha = 0;
            this.game.add.tween(this._visual).to({ alpha: 1 }, 200, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(this._backRect).to({ alpha: 0.7 }, 200, Phaser.Easing.Sinusoidal.Out, true);
        };
        WinLosePanel.prototype.hide = function () {
            var _this = this;
            this.game.add.tween(this._visual).to({ alpha: 0 }, 200, Phaser.Easing.Sinusoidal.Out, true).
                onComplete.add(function () {
                _this.visible = false;
            });
        };
        return WinLosePanel;
    })(Phaser.Sprite);
    TProject.WinLosePanel = WinLosePanel;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var Main = (function () {
        function Main() {
            TProject._.log("Init Core!");
            this.game = new Phaser.Game(760, 510, Phaser.AUTO, "game_container", null, false);
            this.game.state.add("Boot", TProject.Boot, true);
            this.game.state.add("GameOne", TProject.GameOne);
            this.game.state.add("GameTwo", TProject.GameTwo);
            this.game.state.add("CutsceneOne", TProject.CutsceneOne);
            this.game.state.add("CutsceneTwo", TProject.CutsceneTwo);
            this.game.state.add("MainMenu", TProject.MainMenu);
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
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
            this._loadedAssets = false;
            this._loadedFont = false;
        }
        Boot.prototype.preload = function () {
            TProject._.log("Loading...");
            this.fontloading();
            this.game.load.onFileComplete.add(this.loadingUpdate, this);
            this.game.load.atlas("ui", "assets/images/ui.png", "assets/images/ui.json");
            this.game.load.atlas("mobileButton", "assets/images/mobileButton.png", "assets/images/mobileButton.json");
            this.game.load.atlas("gameAsset", "assets/images/gameAsset.png", "assets/images/gameAsset.json");
            this.game.load.atlas("enemyAsset", "assets/images/enemyAsset.png", "assets/images/enemyAsset.json");
            this.game.load.atlas("playerAsset", "assets/images/playerAsset.png", "assets/images/playerAsset.json");
            this.game.load.image("mainMenu", "assets/images/mainMenu.png");
            this.game.load.image("bg", "assets/images/gameBG.png");
            this.game.load.image("ground", "assets/images/ground.png");
            this.game.load.image("water", "assets/images/water.png");
            //Загружаем звуки
            //this.game.load.audiosprite("sfx", ["assets/sounds/sfx.mp3","assets/sounds/sfx.ogg"], "assets/sounds/sfx.json");
        };
        Boot.prototype.create = function () {
            this.game.input.maxPointers = 1;
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            this.game.scale.refresh();
            this.game.input.touch.preventDefault = false;
            if (this.game.device.desktop) {
                this.game.input.mouse.enabled = true;
            }
            else {
                this.game.input.mouse.enabled = false;
            }
            this.game.stage.disableVisibilityChange = true;
            //this.game.input.addPointer();
            //this.game.input.addPointer();
        };
        Boot.prototype.update = function () {
            if (this._loadedAssets && this._loadedFont) {
                this._loadedAssets = false;
                var text;
                text = this.game.add.text(-1000, -1000, ".  ", { font: "Poppins", fontSize: "28px", fontWeight: "bold", fill: "#00CC00" });
                text.parent.removeChild(text);
                text = this.game.add.text(-1000, -1000, ".  ", { font: "Poppins", fontSize: "28px", fontWeight: "normal", fill: "#00CC00" });
                text.parent.removeChild(text);
                text = null;
                // Config.audio = this.game.add.audioSprite("sfx");
                if (window["SKIP_MENU"] == true) {
                    this.game.state.start("CutsceneOne", true);
                }
                else {
                    this.game.state.start("MainMenu", true);
                }
            }
        };
        Boot.prototype.loadingUpdate = function (progress, cacheKey, success, totalLoaded, totalFiles) {
            if (progress >= 100.0) {
                this._loadedAssets = true;
            }
        };
        Boot.prototype.fontloading = function () {
            var _this = this;
            WebFont.load({
                custom: {
                    families: ["Poppins"],
                    urls: [
                        "assets/fonts/poppins/stylesheet.css"
                    ] },
                active: function () {
                    window.setTimeout(function () {
                        _this._loadedFont = true;
                    }, 100);
                }
            });
        };
        return Boot;
    })(Phaser.State);
    TProject.Boot = Boot;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TProject;
(function (TProject) {
    var CutsceneOne = (function (_super) {
        __extends(CutsceneOne, _super);
        function CutsceneOne() {
            _super.apply(this, arguments);
        }
        CutsceneOne.prototype.create = function () {
            this.game.state.start("GameOne", true); // сразу пиздуем на первую игру
        };
        CutsceneOne.prototype.update = function () {
        };
        return CutsceneOne;
    })(Phaser.State);
    TProject.CutsceneOne = CutsceneOne;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TProject;
(function (TProject) {
    var CutsceneTwo = (function (_super) {
        __extends(CutsceneTwo, _super);
        function CutsceneTwo() {
            _super.apply(this, arguments);
        }
        CutsceneTwo.prototype.create = function () {
        };
        CutsceneTwo.prototype.update = function () {
        };
        return CutsceneTwo;
    })(Phaser.State);
    TProject.CutsceneTwo = CutsceneTwo;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TProject;
(function (TProject) {
    var GameOne = (function (_super) {
        __extends(GameOne, _super);
        function GameOne() {
            _super.apply(this, arguments);
            this._bTime = [3, 6, 9, 12, 15, 15.2, 18, 18.2, 21, 22, 24, 26];
            this._sTime = [30, 33, 35, 39, 41];
        }
        GameOne.prototype.create = function () {
            var _this = this;
            TProject._.log("Start game!");
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.time.advancedTiming = true;
            this._bg = this.game.add.sprite(0, 0, "bg");
            if (!this.game.device.desktop) {
                this._mobileController = new TProject.MobileController(this.game, function () { _this._player.decreaseSpeed(); }, function () { _this._player.addSpeed(); }, function () { _this._player.jump(); });
                this.game.stage.addChild(this._mobileController);
                this._mobileController.x = 80.0;
                this._mobileController.y = this.game.height - 70.0;
                this._water = this.game.add.tileSprite(0, this.game.height - 160, 1918, 45, "water");
            }
            else {
                this._bg.inputEnabled = true;
                this._bg.events.onInputDown.add(this.onDown, this);
                this._water = this.game.add.tileSprite(0, this.game.height - 70, 1918, 45, "water");
            }
            this._player = new TProject.Player(this.game, this.game.world.width / 2, this.game.world.height / 2, true, this._water.y);
            this._bg.addChild(this._player);
            this.game.input.onUp.add(function () {
                if (_this._mobileController) {
                    _this._mobileController.up();
                }
            }, this);
            for (var _i = 0, _a = this._bTime; _i < _a.length; _i++) {
                var i = _a[_i];
                this.game.time.events.add(1000 * i, function () { _this.addBuoy(); });
            }
            for (var _b = 0, _c = this._sTime; _b < _c.length; _b++) {
                var i = _c[_b];
                this.game.time.events.add(1000 * i, function () { _this.addShark(); });
            }
            this.addRock();
        };
        GameOne.prototype.onDown = function () {
            TProject._.log("Mouse Down");
        };
        GameOne.prototype.replay = function () {
        };
        GameOne.prototype.gameOver = function () {
            // this.gotoFunction("WIN_FUNC" / "LOSE_FUNC");
        };
        GameOne.prototype.update = function () {
            if (this._mobileController) {
                this._mobileController.update();
            }
            else {
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                    this._player.decreaseSpeed();
                }
                else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                    this._player.addSpeed();
                }
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                    this._player.jump();
                }
            }
            this._water.tilePosition.x += -10;
            this._player.update();
        };
        GameOne.prototype.render = function () {
            this.game.debug.text("" + this.game.time.fps, 2, 14, "#00ff00");
            this._player.render();
        };
        GameOne.prototype.gotoFunction = function (name) {
            var fnc = window[name];
            if (typeof fnc === "function") {
                fnc();
            }
        };
        GameOne.prototype.addBuoy = function () {
            var t = this.game.add.sprite(this.game.width + 10, this.game.height - 80, "enemyAsset", "buoy_10001");
            t.scale.set(0.8);
            t.animations.add("buoyAnim", Phaser.Animation.generateFrameNames("buoy_", 10001, 10096));
            t.animations.play("buoyAnim", 50, true);
            this.game.physics.arcade.enable(t);
            t.body.velocity.x = -10 * 60;
        };
        GameOne.prototype.addShark = function () {
            var s = this.game.add.sprite(this.game.width + 10, this.game.height - 100, "enemyAsset", "shark_10001");
            s.scale.set(0.8);
            s.animations.add("buoyAnim", Phaser.Animation.generateFrameNames("shark_", 10001, 10027));
            s.animations.play("buoyAnim", 5, true);
            this.game.physics.arcade.enable(s);
            s.body.velocity.x = -10 * 60;
        };
        GameOne.prototype.addRock = function () {
            var m = this.game.add.sprite(this.game.width - 50, 50, "enemyAsset", "rock");
            m.anchor.set(0.5);
            this.game.add.tween(m).to({ angle: -360 }, 1000, Phaser.Easing.Linear.None, true, 0, -1, false);
            this.game.physics.arcade.enable(m);
            m.body.velocity.x = -5 * 60;
            m.body.velocity.y = 7 * 60;
        };
        return GameOne;
    })(Phaser.State);
    TProject.GameOne = GameOne;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TProject;
(function (TProject) {
    var GameTwo = (function (_super) {
        __extends(GameTwo, _super);
        function GameTwo() {
            _super.apply(this, arguments);
        }
        GameTwo.prototype.create = function () {
            TProject._.log("Start game!");
            this.game.time.advancedTiming = true;
        };
        GameTwo.prototype.replay = function () {
        };
        GameTwo.prototype.gameOver = function () {
            // this.gotoFunction("WIN_FUNC" / "LOSE_FUNC");
        };
        GameTwo.prototype.update = function () {
        };
        GameTwo.prototype.render = function () {
            this.game.debug.text("" + this.game.time.fps, 2, 14, "#00ff00");
        };
        GameTwo.prototype.gotoFunction = function (name) {
            var fnc = window[name];
            if (typeof fnc === "function") {
                fnc();
            }
        };
        return GameTwo;
    })(Phaser.State);
    TProject.GameTwo = GameTwo;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TProject;
(function (TProject) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            var _this = this;
            this._bg = new Phaser.Image(this.game, 0, 0, "mainMenu");
            this.game.world.addChild(this._bg);
            this._play = new TProject.OButton(this.game, "ui", ["btnStartOff", "btnStartOn", "btnStartOn"], function () {
                _this.game.state.start("CutsceneOne", true);
                _this._play.enabled = false;
            });
            this._play.x = 145;
            this._play.y = 380;
            this._bg.addChild(this._play);
        };
        return MainMenu;
    })(Phaser.State);
    TProject.MainMenu = MainMenu;
})(TProject || (TProject = {}));
