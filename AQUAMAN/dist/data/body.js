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
    var Fish = (function (_super) {
        __extends(Fish, _super);
        function Fish(game, speed) {
            _super.call(this, game, 0, 0);
            this._speed = speed ? speed : 5.0 * 0.4;
            this._visual = this.game.add.sprite(0.0, 0.0, "fishes", "fishes0000");
            this._visual.anchor.set(0.5);
            this._ass = this.game.add.sprite(-this._visual.width * 0.5 + 10.0, 6.0, "fishes", "fishAsses0000");
            this._ass.anchor.set(1.0, 0.5);
            this._arg = 0.0;
            this.addChild(this._ass);
            this.addChild(this._visual);
        }
        // 1, 2, 3
        Fish.prototype.setType = function (value) {
            this._visual.frameName = "fishes000" + (value - 1);
            this._ass.frameName = "fishAsses000" + Math.min(value - 1, 1);
            this._ass.x = value == 1 ? -72.0 : -72.0 + 5.0;
        };
        Fish.prototype.update = function (randomType) {
            if (randomType === void 0) { randomType = true; }
            this._visual.rotation = Math.sin(this._arg += 0.2) / 60.0;
            this._ass.rotation = this._visual.rotation * 5;
            this.x += this._speed;
            if (this.x < -180.0 || this.x > this.game.width + 90.0) {
                this.scale.x *= -1;
                this._speed *= -1;
                if (randomType) {
                    this.setType(Math.round(1 + Math.random() * 2));
                }
            }
        };
        Fish.prototype.pointInBox = function (px, py, cx, cy, hWidth, hHeight) {
            return ((px >= (cx - hWidth) && px <= (cx + hWidth)) &&
                (py >= (cy - hHeight) && py <= (cy + hHeight)));
        };
        Fish.prototype.hit = function (heroX, heroY) {
            if (Math.abs(this.x - heroX) > 215)
                return false;
            if (Math.abs(this.y - heroY) > 180)
                return false;
            var wh = 65.0;
            var hh = 30.0;
            return this.pointInBox(this.x - wh, this.y - hh, heroX, heroY - 8.0, 26.0, 52.0) ||
                this.pointInBox(this.x + wh, this.y - hh, heroX, heroY - 8.0, 26.0, 52.0) ||
                this.pointInBox(this.x + wh, this.y + hh, heroX, heroY - 8.0, 26.0, 52.0) ||
                this.pointInBox(this.x - wh, this.y + hh, heroX, heroY - 8.0, 26.0, 52.0);
        };
        return Fish;
    })(Phaser.Sprite);
    TProject.Fish = Fish;
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
        function GameUI(game, x, y) {
            _super.call(this, game, x, y);
            this._currentGoldNumb = 0;
            this._currentHP = 3;
            this._star2 = this.game.add.sprite(this.game.width * 0.5, 45, "starAtlas", "StarPoint_10000");
            this._star2.anchor.set(0.5);
            this._star2.animations.add("start");
            this._star2.fixedToCamera = true;
            this._star1 = this.game.add.sprite(this.game.width * 0.5 - this._star2.width, 45, "starAtlas", "StarPoint_10000");
            this._star1.anchor.set(0.5);
            this._star1.animations.add("start");
            this._star1.fixedToCamera = true;
            this._star3 = this.game.add.sprite(this.game.width * 0.5 + this._star1.width, 45, "starAtlas", "StarPoint_10000");
            this._star3.anchor.set(0.5);
            this._star3.animations.add("start");
            this._star3.fixedToCamera = true;
            this._head1 = this.game.add.sprite(40, this.game.height - 40, "head");
            this._head1.anchor.set(0.5);
            this._head1.fixedToCamera = true;
            this._head2 = this.game.add.sprite(40 + this._head1.width + 10, this.game.height - 40, "head");
            this._head2.anchor.set(0.5);
            this._head2.fixedToCamera = true;
            this._head3 = this.game.add.sprite(40 + (this._head1.width + 10) * 2, this.game.height - 40, "head");
            this._head3.anchor.set(0.5);
            this._head3.fixedToCamera = true;
        }
        GameUI.prototype.addGold = function () {
            this._currentGoldNumb++;
            TProject.Config.audio.play("coinGet", 0.3);
            TProject.Config.audio.play("din", 0.3);
            switch (this._currentGoldNumb) {
                case 1:
                    this._star1.animations.play("start", 24, false, false);
                    break;
                case 2:
                    this._star2.animations.play("start", 24, false, false);
                    break;
                case 3:
                    this._star3.animations.play("start", 24, false, false);
                    break;
            }
        };
        GameUI.prototype.playerHit = function () {
            this._currentHP--;
            //this._star3.loadTexture("starAtlas", "StarPoint_10000");
            // this._star2.loadTexture("starAtlas", "StarPoint_10000");
            //this._star1.loadTexture("starAtlas", "StarPoint_10000");
            this._star1.frameName = "StarPoint_10000";
            this._star2.frameName = "StarPoint_10000";
            this._star3.frameName = "StarPoint_10000";
            this._currentGoldNumb = 0;
            switch (this._currentHP) {
                case 0:
                    this._head1.alpha = 0;
                    TProject._.log("GameOver!");
                    break;
                case 1:
                    this._head2.alpha = 0;
                    break;
                case 2:
                    this._head3.alpha = 0;
                    break;
            }
        };
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
    var MobileController = (function (_super) {
        __extends(MobileController, _super);
        function MobileController(game, cbLeft, cbRight, cbJump) {
            _super.call(this, game, 0.0, 0.0);
            this._left = new SimpleButton(this.game, "moveBtn0000", true, cbLeft);
            this.addChild(this._left);
            this._right = new SimpleButton(this.game, "moveBtn0000", true, cbRight);
            this._right.scale.x = -1;
            this._right.x = 120.0;
            this._right.defScale = -1.0;
            this.addChild(this._right);
            this._jump = new SimpleButton(this.game, "jumpBtn0000", false, cbJump);
            this._jump.x = game.width - 160.0;
            this.addChild(this._jump);
        }
        MobileController.prototype.update = function () {
            this._left.update();
            this._right.update();
        };
        return MobileController;
    })(Phaser.Sprite);
    TProject.MobileController = MobileController;
    var SimpleButton = (function (_super) {
        __extends(SimpleButton, _super);
        function SimpleButton(game, name, sticky, cb) {
            _super.call(this, game, 0.0, 0.0, "mobileButton", name);
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
        SimpleButton.prototype.up = function () {
            this._down = false;
            this.scale.set(this.defScale, 1.0);
            this.alpha = 0.6;
        };
        SimpleButton.prototype.down = function () {
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
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, goldLine) {
            _super.call(this, game, game.width * 0.5, 400 + 50);
            // Original game physics
            this._velX = 0.0;
            this._velY = 0.0;
            this._gravity = 0.2 * 0.5;
            this._friction = 0.954;
            this.anchor.set(0.5);
            this._spine = this.game.add.spine(0, 0, "diver");
            //this._heroAnimation = this._spine.setAnimationByName(0, "idle", true);   // idle, attack, gather, throw
            //this._heroAnimation.timeScale = 0.8;
            this._spine.setSkinByName("empty"); // empty, full
            this._spine.setToSetupPose();
            this.addChild(this._spine);
            this._canMovie = true;
            this._bottom = false;
            this._fullBag = false;
            this._canGetHit = true;
            this._playerFloated = false;
            this._goldLine = goldLine;
        }
        Player.prototype.update = function () {
            var _this = this;
            if (this.y >= this._goldLine && !this._bottom) {
                this._canMovie = false;
                this.y = this._goldLine;
                if (!this._fullBag) {
                    this._heroAnimation = this._spine.setAnimationByName(0, "gather", false);
                    this._spine.setSkinByName("full");
                    this._spine.setToSetupPose();
                    this._heroAnimation.timeScale = 0.8;
                    TProject.Config.audio.play("coinGet", 0.3);
                    this._heroAnimation.onComplete = function () {
                        _this._canMovie = true;
                    };
                }
                else {
                    this._canMovie = true;
                }
                this._fullBag = true;
                this._velY = 0.0;
                this._velX = 0.0;
                this._bottom = true;
            }
        };
        Player.prototype.movement = function (touchX, winCb) {
            //let dt: number = this.game.time.elapsedMS / 1000.0;
            var _this = this;
            if (!this._bottom) {
                this._velY += this._gravity;
                this._velY *= this._friction;
                this.y += (this._velY);
                if (touchX) {
                    this._velX = touchX / 66;
                }
                this._velX *= this._friction;
                this.x += (this._velX);
                if (this._fullBag && this.y < 480.0) {
                    this.game.time.events.add(Phaser.Timer.SECOND * 0.1, function () {
                        _this._spine.setSkinByName("empty");
                        _this._spine.setToSetupPose();
                        if (winCb) {
                            winCb();
                        }
                    });
                    this._heroAnimation = this._spine.setAnimationByName(0, "throw", false);
                    this._heroAnimation.onComplete = function () {
                        _this._canMovie = true;
                    };
                    this._heroAnimation.timeScale = 0.8;
                    this._fullBag = false;
                }
                if (this.y < 480 && !this._playerFloated) {
                    this._playerFloated = true;
                    TProject.Config.audio.play("outOfWhater", 0.3);
                }
                else if (this.y > 520 && this._playerFloated) {
                    this._playerFloated = false;
                }
                this.x = Math.min(Math.max(this.x, 50.0), this.game.width - 50.0);
            }
        };
        Player.prototype.horizontMovement = function (speed) {
            if (!this._bottom) {
                this._velX += speed;
            }
            if (this.x < 50.0 || this.x > this.game.width - 50.0) {
                this._velX = 0.0;
            }
            this.x = Math.min(Math.max(this.x, 50.0), this.game.width - 50.0);
        };
        Player.prototype.hit = function (cb) {
            var _this = this;
            if (this._canGetHit) {
                this._canGetHit = false;
                if (cb) {
                    cb();
                }
                this._heroAnimation = this._spine.setAnimationByName(0, "attack", false); // idle, attack, gather, throw
                this._canMovie = false;
                if (this._fullBag) {
                    this._fullBag = false;
                }
                TProject.Config.audio.play("attack", 0.3);
                this._spine.setSkinByName("empty");
                this._spine.setToSetupPose();
                this.game.add.tween(this).to({ alpha: 0.6 }, 100.0, Phaser.Easing.Linear.None, true, 0, 4, true).
                    onComplete.add(function () {
                    _this._canGetHit = true;
                });
                this._heroAnimation.onComplete = function () {
                    _this._canMovie = true;
                };
            }
        };
        Player.prototype.jump = function (topY) {
            var _this = this;
            if (topY === void 0) { topY = 480.0; }
            if (this._canMovie && this.y > topY) {
                this._canMovie = false;
                TProject.Config.audio.play("swimming", 0.3);
                this._bottom = false;
                //Original game physics
                this._velY -= 7;
                if (this._velY < -7) {
                    this._velY = -7;
                }
                this._heroAnimation = this._spine.setAnimationByName(0, "idle", false);
                this._heroAnimation.timeScale = 1.45;
                this._heroAnimation.onComplete = function () {
                    _this._canMovie = true;
                };
                return true;
            }
            return false;
        };
        Object.defineProperty(Player.prototype, "canGetHit", {
            get: function () {
                return this._canGetHit;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "fullBag", {
            get: function () {
                return this._fullBag;
            },
            enumerable: true,
            configurable: true
        });
        return Player;
    })(Phaser.Sprite);
    TProject.Player = Player;
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
            this.game = new Phaser.Game(760, 510, Phaser.AUTO, "game_container", null, false);
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
            _super.apply(this, arguments);
            // for movement
            this._touchX = 0;
        }
        Body.prototype.create = function () {
            var _this = this;
            TProject._.log("Start game!");
            this.game.time.advancedTiming = true;
            this._bg = this.game.add.sprite(0.0, 0.0, "bg");
            this.game.world.setBounds(0.0, 0.0, this.game.width, this._bg.height);
            this.game.camera.roundPx = false;
            this.createRope(this.game.width * 0.5, 400 + 50);
            // player
            this._player = new TProject.Player(this.game, this._bg.height * 0.855);
            this.game.world.addChild(this._player);
            this._fish = [];
            this._iCanGetHit = true;
            this._fish[0] = new TProject.Fish(this.game, 1.8);
            this.game.world.addChild(this._fish[0]);
            this._fish[0].x = this.game.world.centerX;
            this._fish[0].y = 800;
            this._fish[1] = new TProject.Fish(this.game, 2.6);
            this.game.world.addChild(this._fish[1]);
            this._fish[1].x = this.game.world.centerX;
            this._fish[1].y = 1100;
            this._fish[2] = new TProject.Fish(this.game, 1.2);
            this.game.world.addChild(this._fish[2]);
            this._fish[2].x = this.game.world.centerX;
            this._fish[2].y = 1430;
            this._water = this.game.add.sprite(0.0, 425.0, "water");
            this.game.camera.follow(this._player, Phaser.Camera.FOLLOW_LOCKON, 0.0, 0.1);
            // INPUT
            // for desktop
            this._bg.events.onInputOver.add(function () {
                _this._firstOver = true;
            }, this);
            this.createEmmiters();
            this._gameUI = new TProject.GameUI(this.game, 0, 0);
            if (!this.game.device.desktop) {
                this._mobileController = new TProject.MobileController(this.game, function () { _this._player.horizontMovement(-0.1); }, function () { _this._player.horizontMovement(0.1); }, function () { _this.onDown(null, null); });
                this.game.stage.addChild(this._mobileController);
                this._mobileController.x = 80.0;
                this._mobileController.y = this.game.height - 150.0;
            }
            else {
                this._bg.inputEnabled = true;
                this._bg.events.onInputDown.add(this.onDown, this);
            }
        };
        Body.prototype.update = function () {
            var _this = this;
            var touchX = (this.game.device.desktop ? this.game.input.mousePointer.x - this._player.x : null);
            if (!this._firstOver) {
                touchX = 0;
            }
            if (this._mobileController) {
                this._mobileController.update();
            }
            this._player.movement(touchX, function () {
                _this.addCoin();
                _this._gameUI.addGold();
            });
            var currentAttack = false;
            for (var i = 0; i < this._fish.length; i++) {
                this._fish[i].update();
                if (this._player.canGetHit) {
                    if (this._fish[i].hit(this._player.x, this._player.y)) {
                        this._player.hit(function () {
                            _this.playerGetHit();
                        });
                    }
                }
            }
            this.emittersCheck();
            this._player.update();
        };
        Body.prototype.onDown = function (sprite, pointer) {
            this._firstOver = true;
            if (this._player.jump()) {
                this.addBubbleActive();
            }
        };
        Body.prototype.createRope = function (hx, hy) {
            var _this = this;
            this._ropeArray = [];
            var segmentsCount = 30;
            var ropeVars = [];
            var segmentOffset = 8;
            for (var i = 0; i < segmentsCount; i++) {
                this._ropeArray.push(new Phaser.Point(hx, hy - i * segmentOffset));
                ropeVars.push(new Phaser.Point(0.0, 0.0));
            }
            // к кораблю цепляемся
            this._ropeArray.push(new Phaser.Point(hx - 50, hy - 120));
            this._currentRope = this.game.add.rope(0.0, 0.0, "rope", null, this._ropeArray);
            var count = 0;
            var koef = 2.5; //0.5;
            var damp = 0.1;
            this._currentRope.updateAnimation = function () {
                _this._ropeArray[0].set(_this._player.x, _this._player.y - 50);
                var delY = -segmentOffset;
                var yy;
                for (var i = 1; i < segmentsCount; i++) {
                    ropeVars[i].x = ((_this._ropeArray[i - 1].x) - _this._ropeArray[i].x) * koef;
                    ropeVars[i].y += ropeVars[i].x;
                    ropeVars[i].y *= damp;
                    yy = _this._ropeArray[i - 1].y + delY;
                    if (yy < 430.0) {
                        yy = 430.0;
                    }
                    _this._ropeArray[i].set(_this._ropeArray[i].x + ropeVars[i].y, yy);
                }
            };
        };
        Body.prototype.createEmmiters = function () {
            var time = 3900;
            this._bubbleActiveEmitter = this.game.add.emitter(0.0, 0.0, 50);
            this._bubbleActiveEmitter.gravity = -100;
            this._bubbleActiveEmitter.minParticleScale = 0.6;
            this._bubbleActiveEmitter.maxParticleScale = 1.5;
            this._bubbleActiveEmitter.setXSpeed(-100, 100);
            this._bubbleActiveEmitter.setYSpeed(60, 40);
            this._bubbleActiveEmitter.makeParticles("bubble");
            this._bubbleActiveEmitter.start(false, time, 35);
            this._bubbleActiveEmitter.on = false;
            this._bubbleActiveEmitter.minRotation = 0;
            this._bubbleActiveEmitter.maxRotation = 0;
            this._bubblePassiveEmitter = this.game.add.emitter(0.0, 0.0, 50);
            this._bubblePassiveEmitter.gravity = -100;
            this._bubblePassiveEmitter.minParticleScale = 0.9;
            this._bubblePassiveEmitter.maxParticleScale = 1.8;
            this._bubblePassiveEmitter.setXSpeed(-20, 20);
            this._bubblePassiveEmitter.setYSpeed(-30, -10);
            this._bubblePassiveEmitter.makeParticles("bubble");
            this._bubblePassiveEmitter.start(false, time, 50);
            this._bubblePassiveEmitter.on = false;
            this._bubblePassiveEmitter.minRotation = 0;
            this._bubblePassiveEmitter.maxRotation = 0;
            this._coinEmitter = this.game.add.emitter(0.0, 0.0, 50);
            this._coinEmitter.gravity = 500;
            this._coinEmitter.setScale(0.8, 1, 0.8, 1, time / 2);
            this._coinEmitter.setXSpeed(450, 500);
            this._coinEmitter.setYSpeed(-250, -600);
            this._coinEmitter.makeParticles("coin");
            this._coinEmitter.start(false, time / 2, 10);
            this._coinEmitter.on = false;
            this.addBubblePassive();
        };
        Body.prototype.addBubbleActive = function () {
            var _this = this;
            this._bubbleActiveEmitter.x = this._player.x;
            this._bubbleActiveEmitter.y = this._player.y - 40;
            if (this._bubbleActiveEmitter.y > 430.0) {
                TProject.Config.audio.play("bubbles", 0.5);
                this._bubbleActiveEmitter.on = true;
                this.game.time.events.add(Phaser.Timer.SECOND * 0.2, function () {
                    _this._bubbleActiveEmitter.on = false;
                });
            }
        };
        Body.prototype.addCoin = function () {
            var _this = this;
            this._coinEmitter.x = this._player.x + 70;
            this._coinEmitter.y = this._player.y - 15;
            this._coinEmitter.on = true;
            this.game.time.events.add(Phaser.Timer.SECOND * 0.2, function () {
                _this._coinEmitter.on = false;
            });
        };
        Body.prototype.addBubblePassive = function () {
            var _this = this;
            if (this._bubblePassiveEmitter.y > 430) {
                this._bubblePassiveEmitter.start(false, 3900, this.game.rnd.integerInRange(60, 150));
                TProject.Config.audio.play("bubble" + this.game.rnd.integerInRange(1, 3), 0.5);
                this._bubblePassiveEmitter.on = true;
                this.game.time.events.add(Phaser.Timer.SECOND * this.game.rnd.realInRange(0.1, 1.4), function () {
                    _this._bubblePassiveEmitter.on = false;
                    _this.game.time.events.add(Phaser.Timer.SECOND * _this.game.rnd.realInRange(0.1, 1.4), _this.addBubblePassive, _this);
                });
            }
            else {
                this.game.time.events.add(Phaser.Timer.SECOND * this.game.rnd.realInRange(0.1, 1.4), this.addBubblePassive, this);
            }
        };
        Body.prototype.emittersCheck = function () {
            this._bubblePassiveEmitter.x = this._player.x;
            this._bubblePassiveEmitter.y = this._player.y - 60;
            this._bubbleActiveEmitter.forEachAlive(function (bubble) {
                if (bubble.y < 435) {
                    bubble.kill();
                }
            }, this);
            this._bubblePassiveEmitter.forEachAlive(function (bubble) {
                if (bubble.y < 435) {
                    bubble.kill();
                }
            }, this);
        };
        Body.prototype.playerGetHit = function () {
            if (this._player.fullBag) {
                this.addCoin();
            }
            this._gameUI.playerHit();
        };
        // debug
        Body.prototype.render = function () {
            this.game.debug.text("" + this.game.time.fps, 2, 14, "#00ff00");
        };
        return Body;
    })(Phaser.State);
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
            this.game.plugins.add(PhaserSpine.SpinePlugin);
            this.game.stage.disableVisibilityChange = true;
            this.game.load.onFileComplete.add(this.loadingUpdate, this);
            this.game.load.image("bg", "assets/images/bg.png");
            this.game.load.image("water", "assets/images/water.png");
            this.game.load.image("rope", "assets/images/rope.png");
            this.game.load.atlas("fishes", "assets/images/fishes.png", "assets/images/fishes.json");
            this.game.load.image("bubble", "assets/images/bubble.png");
            this.game.load.image("coin", "assets/images/coin.png");
            this.game.load.atlas("starAtlas", "assets/images/starAtlas.png", "assets/images/starAtlas.json");
            this.game.load.image("head", "assets/images/head.png");
            this.game.load.atlas("mobileButton", "assets/images/mobileButton.png", "assets/images/mobileButton.json");
            this.game.load.spine("diver", "assets/images/diver.json");
            //Загружаем звуки
            this.game.load.audiosprite("sfx", ["assets/sounds/mygameaudio.mp3", "assets/sounds/mygameaudio.ogg"], "assets/sounds/mygameaudio.json");
        };
        Boot.prototype.create = function () {
            this.game.input.maxPointers = 1;
            //this.game.stage.disableVisibilityChange = true;
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            this.game.scale.refresh();
            this.game.input.touch.preventDefault = false;
        };
        Boot.prototype.loadingUpdate = function (progress, cacheKey, success, totalLoaded, totalFiles) {
            if (progress >= 100.0) {
                TProject.Config.audio = this.game.add.audioSprite("sfx");
                this.game.state.start("Body", true);
            }
        };
        return Boot;
    })(Phaser.State);
    TProject.Boot = Boot;
})(TProject || (TProject = {}));
