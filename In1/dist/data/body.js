var TProject;
(function (TProject) {
    var _ = (function () {
        function _() {
        }
        _.randomInt = function (min, max) {
            return Math.floor((max - min + 0.1) * Math.random()) + min;
        };
        _.degToRad = function (value) {
            return value / 180.0 * Math.PI;
        };
        _.log = console.log;
        return _;
    })();
    TProject._ = _;
    var Point = (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        return Point;
    })();
    TProject.Point = Point;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var Config = (function () {
        function Config() {
        }
        Config.save = function () {
            if (window["SAVE_PROGRESS"] != true) {
                return;
            }
            localStorage.setItem(this.SAVE_DATA_NAME, JSON.stringify(this._savedata));
        };
        Config.load = function () {
            this._savedata = JSON.parse(localStorage.getItem(this.SAVE_DATA_NAME));
            if (this._savedata == null) {
                this._savedata = { "playerLive": 0,
                    "rightAnswer": 0 };
                localStorage.setItem(this.SAVE_DATA_NAME, JSON.stringify(this._savedata));
            }
        };
        Config.reset = function () {
            if (this._savedata == null) {
                this._savedata = { "playerLive": 0,
                    "rightAnswer": 0 };
            }
            else {
                this._savedata.playerLive = 0;
                this._savedata.rightAnswer = 0;
            }
        };
        Object.defineProperty(Config, "playerLive", {
            get: function () {
                return this._savedata.playerLive;
            },
            set: function (value) {
                if (value > 3)
                    value = 3;
                if (value < 0)
                    value = 0;
                this._savedata.playerLive = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Config, "rightAnswer", {
            get: function () {
                return this._savedata.rightAnswer;
            },
            set: function (value) {
                if (value > 4)
                    value = 4;
                if (value < 0)
                    value = 0;
                this._savedata.rightAnswer = value;
            },
            enumerable: true,
            configurable: true
        });
        Config.SAVE_DATA_NAME = "Inkster";
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
    var Crab = (function (_super) {
        __extends(Crab, _super);
        function Crab(game, left) {
            if (left === void 0) { left = false; }
            _super.call(this, game, 0.0, 0.0, "main", "crab0000");
            // original game
            this._secsPerStep = 0.1;
            this._acceleration = 1.75;
            this.animations.add("idle", Phaser.Animation.generateFrameNames("crab00", 0, 17, "", 2), 24, true);
            this.animations.play("idle");
            this.anchor.set(0.5);
            this.game.physics.arcade.enable(this);
            this.body.setSize(70, 70, 0, 15);
            if (left) {
                this._leftBoundary = -310;
                this._rightBoundary = 185;
                this._velocity = new TProject.Point(-Crab.SPEED, 0.0);
                this.scale.x = 1;
                this.x = this._rightBoundary;
            }
            else {
                this._leftBoundary = 440;
                this._rightBoundary = 1000;
                this.scale.x = -1;
                this._velocity = new TProject.Point(Crab.SPEED, 0.0);
                this.x = this._leftBoundary;
            }
            this.y = Crab.BOTTOM;
        }
        Crab.prototype.update = function () {
            this.x += this._velocity.x;
            this.y += this._velocity.y;
            this._velocity.y += (this._acceleration * this._secsPerStep);
            if (this.y >= Crab.BOTTOM) {
                this.y = Crab.BOTTOM;
            }
            if (TProject._.randomInt(0, 150) == 1 && this.y == Crab.BOTTOM &&
                TProject.Config.rightAnswer >= 1) {
                this._velocity.y = -4;
                TProject.Config.audio.play("unknowBounce", 0.6);
            }
            if (this.x < this._leftBoundary) {
                this._velocity.x = Crab.SPEED;
                this.scale.x = -1;
            }
            if (this.x > this._rightBoundary) {
                this._velocity.x = -Crab.SPEED;
                this.scale.x = 1;
            }
        };
        Crab.BOTTOM = 440;
        Crab.SPEED = 1.6;
        return Crab;
    })(Phaser.Sprite);
    TProject.Crab = Crab;
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
        function Fish(game, left) {
            if (left === void 0) { left = false; }
            _super.call(this, game, 0.0, 0.0, "main", "fish_tail0000");
            // original game
            this._secsPerStep = 0.1;
            this._acceleration = 1.75;
            this.anchor.set(0.5);
            this.scale.set(0.8);
            this.game.physics.arcade.enable(this);
            this.body.setSize(50, 50, -35, 15);
            this.x = 1200.0;
            this._beginY = this.y = 200;
            this._velocity = -Fish.SPEED;
            this._leftBoundary = -415;
            this._rightBoundary = 1105;
            this.animations.add("idle", Phaser.Animation.generateFrameNames("fish_tail000", 0, 7), 24, true);
            this.animations.play("idle");
            this._headVisual = this.game.add.sprite(-31.0, 0.0, "main", "fish_head0000");
            this._headVisual.anchor.set(0.5);
            this.addChild(this._headVisual);
            this._headVisual.animations.add("idle", ["fish_head0000"]);
            this._headVisual.animations.add("blink", ["fish_head0001", "fish_head0000"], 12);
            this._eyesTimer = Fish.BLINK_TIME;
            this._arg = 0;
        }
        Fish.prototype.update = function () {
            if (this._eyesTimer <= 0) {
                this._headVisual.animations.play("blink");
                this._eyesTimer = Fish.BLINK_TIME + Math.random() * 100;
            }
            else {
                this._eyesTimer--;
            }
            this.x += this._velocity;
            this.y = this._beginY + Math.sin(this._arg += 0.1) * 10.0;
            if (this.x < this._leftBoundary) {
                this._velocity = Fish.SPEED;
                this.scale.x = -1;
                this._beginY = 200 + TProject._.randomInt(-80, 80);
            }
            if (this.x > this._rightBoundary) {
                this._velocity = -Fish.SPEED;
                this.scale.x = 1;
                this._beginY = 200 + TProject._.randomInt(-80, 80);
            }
        };
        Fish.BOTTOM = 440;
        Fish.SPEED = 1.8;
        Fish.BLINK_TIME = 100;
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
        function GameUI(game, body) {
            var _this = this;
            _super.call(this, game, 0.0, 0.0);
            this._body = body;
            this._parsingText = new TProject.ParsingText(this.game);
            this._currentQNumb = 0;
            this._playerError = TProject.Config.playerLive;
            this._correctAnNumber = TProject.Config.rightAnswer;
            this._endGame = false;
            this._blockNumberColision = false;
            this._correctA = "";
            this._correctQ = "";
            this._numberArray = [];
            this._numberArray[0] = new NumberObject(this.game, -150, 340, "");
            this._numberArray[1] = new NumberObject(this.game, 150, 120, "");
            this._numberArray[2] = new NumberObject(this.game, 650, 340, "");
            this._numberArray[3] = new NumberObject(this.game, 950, 120, "");
            this.addChild(this._numberArray[0]);
            this.addChild(this._numberArray[1]);
            this.addChild(this._numberArray[2]);
            this.addChild(this._numberArray[3]);
            this._question = this.game.add.text(this.game.world.width / 2, 460, "", { font: "Poppins", fontSize: "45px", fontWeight: "bold", fill: "#ffffff" });
            this._question.anchor.set(0.5);
            this.addChild(this._question);
            this._question.alpha = 0;
            this._question.tint = 0xaaaaff;
            this._result = this.game.add.text(this.game.world.width / 2, 420, "correct", { font: "Poppins", fontSize: "45px", fontWeight: "bold", fill: "#757500" });
            this._result.anchor.set(0.5);
            this.addChild(this._result);
            this._result.alpha = 0;
            this.game.physics.arcade.enable(this);
            this.body.setSize(200, 70, this._question.x - 100, this._question.y - 20);
            this.game.time.events.add(2500, function () {
                _this.setCurrentGoal();
            });
            this._playerLiveSprite = [];
            this._playerLiveSprite[0] = this.game.add.sprite(this.game.world.width - 150, 15, "main", "levelCross0000");
            this._playerLiveSprite[1] = this.game.add.sprite(this.game.world.width - 100, 15, "main", "levelCross0000");
            this._playerLiveSprite[2] = this.game.add.sprite(this.game.world.width - 50, 15, "main", "levelCross0000");
            for (var i = 0; i < 3; i++) {
                if (this._playerError <= i) {
                    this._playerLiveSprite[i].frameName = "levelCross0000";
                }
                else {
                    this._playerLiveSprite[i].frameName = "levelCross0001";
                }
            }
        }
        GameUI.prototype.restart = function () {
            this._playerLiveSprite[0].frameName = "levelCross0000";
            this._playerLiveSprite[1].frameName = "levelCross0000";
            this._playerLiveSprite[2].frameName = "levelCross0000";
            this._numberArray[0].alpha = 0;
            this._numberArray[1].alpha = 0;
            this._numberArray[2].alpha = 0;
            this._numberArray[3].alpha = 0;
            this._currentQNumb = 0;
            this._correctAnNumber = 0;
            this._endGame = false;
            this._blockNumberColision = false;
            this._correctA = "";
            this._correctQ = "";
            this._question.alpha = 0;
            this._question.tint = 0xaaaaff;
            this._result.alpha = 0;
            this.setCurrentGoal();
        };
        GameUI.prototype.playerError = function () {
            if (!this._endGame) {
                //this.game.add.tween(this._playerLiveSprite[this._playerError]).to({alpha: 1}, 300, Phaser.Easing.Sinusoidal.Out, true);
                this._playerLiveSprite[this._playerError].frameName = "levelCross0001";
                this._playerError++;
                TProject.Config.playerLive++;
                TProject.Config.save();
                if (this._playerError > 2) {
                    //_.log("EndGame");
                    this._endGame = true;
                    this._body.gameOver(false);
                    this._playerError = 0;
                    TProject.Config.reset();
                    TProject.Config.save();
                }
            }
        };
        GameUI.prototype.correctResult = function () {
            var _this = this;
            if (!this._endGame) {
                this._result.text = "correct";
                this._result.fill = "#a7bc4b";
                TProject.Config.audio.play("rightAn", 0.6);
                this._body.showFish();
                this._blockNumberColision = true;
                this.game.add.tween(this._result).to({ alpha: 1 }, 300, Phaser.Easing.Sinusoidal.Out, true);
                this._question.text = this._question.text.replace("_", this._correctA + " ");
                this.tweenTint(this._question, this._question.tint, 0xa7bc4b, 600);
                this._correctAnNumber++;
                TProject.Config.rightAnswer++;
                TProject.Config.save();
                this.game.add.tween(this._question).to({ y: 380 }, 1200, Phaser.Easing.Sinusoidal.Out, true, 300)
                    .onComplete.add(function () {
                    _this.game.add.tween(_this._result).to({ alpha: 0 }, 300, Phaser.Easing.Sinusoidal.Out, true);
                    _this.game.add.tween(_this._question).to({ alpha: 0 }, 600, Phaser.Easing.Sinusoidal.Out, true)
                        .onComplete.add(function () {
                        _this._question.y = 460;
                        _this._numberArray[0].showText(false);
                        _this._numberArray[1].showText(false);
                        _this._numberArray[2].showText(false);
                        _this._numberArray[3].showText(false);
                        _this._question.tint = 0xaaaaff;
                        if (_this._correctAnNumber > 3) {
                            if (!_this._endGame) {
                                TProject.Config.reset();
                                TProject.Config.save();
                                _this._endGame = true;
                                _this._body.gameOver(true);
                            }
                        }
                        else {
                            _this.setCurrentGoal();
                        }
                    });
                });
            }
        };
        GameUI.prototype.incorrectResult = function () {
            var _this = this;
            if (!this._endGame) {
                this._result.text = "incorrect";
                this._result.fill = "#fd5b58";
                TProject.Config.audio.play("error", 0.6);
                this.tweenTint(this._question, 0x3dc9c3, 0xfd5b58, 600);
                this.game.add.tween(this._result).to({ alpha: 1 }, 650, Phaser.Easing.Sinusoidal.Out, true).onComplete.add(function () {
                    _this.game.add.tween(_this._result).to({ alpha: 0 }, 300, Phaser.Easing.Sinusoidal.Out, true, 300);
                    //this._result.alpha = 0;
                    _this.playerError();
                    _this._numberArray[0].showText(true);
                    _this._numberArray[1].showText(true);
                    _this._numberArray[2].showText(true);
                    _this._numberArray[3].showText(true);
                    _this.tweenTint(_this._question, 0xfd5b58, 0x3dc9c3, 300); //this._question.tint = 0xaaaaff;
                });
            }
        };
        GameUI.prototype.tweenTint = function (obj, startColor, endColor, time, callback) {
            if (time === void 0) { time = 250; }
            if (callback === void 0) { callback = null; }
            if (obj) {
                //console.log(callback);
                var colorBlend = { step: 0 };
                var colorTween = this.game.add.tween(colorBlend).to({ step: 100 }, time);
                colorTween.onUpdateCallback(function () {
                    obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
                });
                obj.tint = startColor;
                if (callback) {
                    colorTween.onComplete.add(function () {
                        callback();
                    });
                }
                colorTween.start();
            }
        };
        GameUI.prototype.checkNumberColision = function (object, number) {
            if (this.game.physics.arcade.collide(object, this) && !this._endGame) {
                if (this._correctA == number) {
                    //_.log("Correct!");
                    this.correctResult();
                }
                else {
                    // _.log("Incorrect!");
                    this.incorrectResult();
                }
            }
            else {
                for (var i = 0; i < this._numberArray.length; i++) {
                    if (this._numberArray[i].getText() == number)
                        this._numberArray[i].showText(true);
                }
            }
        };
        GameUI.prototype.setCurrentGoal = function () {
            var aArray = this._parsingText.getCurrentQA();
            this._question.text = aArray[0];
            this._blockNumberColision = false;
            this._correctQ = aArray[1];
            this._correctA = aArray[2];
            Phaser.ArrayUtils.shuffle(this._numberArray);
            var randomMode = this.game.rnd.integerInRange(0, 2);
            if (randomMode == 0) {
                this._numberArray[0].changeText(aArray[2]);
                this._numberArray[1].changeText(aArray[3]);
                this._numberArray[2].changeText(aArray[4]);
                this._numberArray[3].changeText(aArray[5]);
            }
            else if (randomMode == 1) {
                this._numberArray[0].changeText(aArray[3]);
                this._numberArray[1].changeText(aArray[2]);
                this._numberArray[2].changeText(aArray[5]);
                this._numberArray[3].changeText(aArray[4]);
            }
            else if (randomMode == 2) {
                this._numberArray[0].changeText(aArray[5]);
                this._numberArray[1].changeText(aArray[4]);
                this._numberArray[2].changeText(aArray[3]);
                this._numberArray[3].changeText(aArray[2]);
            }
            this._numberArray[0].showText(true);
            this._numberArray[1].showText(true);
            this._numberArray[2].showText(true);
            this._numberArray[3].showText(true);
            this.game.add.tween(this._question).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true);
        };
        GameUI.prototype.playerCollideCheck = function (player) {
            for (var i = 0; i < this._numberArray.length; i++) {
                if (this.game.physics.arcade.collide(player, this._numberArray[i]) && this._numberArray[i].alpha != 0 && !this._endGame && !this._blockNumberColision) {
                    player.setGrabNumber(this._numberArray[i].getText());
                    this._numberArray[i].showText(false);
                }
            }
        };
        GameUI.prototype.playerQuestionCheck = function (player) {
            if (this.game.physics.arcade.collide(player, this) && !this._endGame) {
                var playerNumber = player.getGrabNumber();
                if (this._correctA == playerNumber) {
                    //_.log("Correct!");
                    this.correctResult();
                }
                else {
                    //_.log("Incorrect!");
                    this.incorrectResult();
                }
            }
        };
        return GameUI;
    })(Phaser.Sprite);
    TProject.GameUI = GameUI;
    var NumberObject = (function (_super) {
        __extends(NumberObject, _super);
        function NumberObject(game, x, y, currentNumber) {
            _super.call(this, game, x, y);
            this._currentNumber = currentNumber;
            this.alpha = 0;
            this._currentText = this.game.add.text(0, 0, this._currentNumber, { font: "Poppins", fontSize: "45px", fontWeight: "bold", fill: "#dcd740" });
            this._currentText.anchor.set(0.5);
            this.addChild(this._currentText);
            this.game.physics.arcade.enable(this);
            this.body.immovable = true;
        }
        NumberObject.prototype.changeText = function (text) {
            this._currentNumber = text;
            this._currentText.text = this._currentNumber;
        };
        NumberObject.prototype.showText = function (mode) {
            if (mode) {
                this.game.add.tween(this).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true);
            }
            else {
                this.alpha = 0;
            }
        };
        NumberObject.prototype.getText = function () {
            return this._currentNumber;
        };
        return NumberObject;
    })(Phaser.Sprite);
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
        function MobileController(game, cbLeft, cbRight, cbJump, cbDrop) {
            _super.call(this, game, 0.0, 0.0);
            this._left = new SimpleButton(this.game, "moveBtn0000", true, cbLeft);
            this._left.tint = 0x000000;
            this.addChild(this._left);
            this._right = new SimpleButton(this.game, "moveBtn0000", true, cbRight);
            this._right.scale.x = -1;
            this._right.defScale = -1.0;
            this._right.tint = 0x000000;
            this._right.x = 130.0;
            this.addChild(this._right);
            this._jump = new SimpleButton(this.game, "jumpBtn0000", true, cbJump);
            this._jump.tint = 0x000000;
            this._jump.x = game.width - 160.0;
            this.addChild(this._jump);
            this._drop = new SimpleButton(this.game, "dropBtn0000", false, cbDrop);
            this._drop.scale.y = -1;
            this._drop.tint = 0x000000;
            this._drop.x = game.width - 290.0;
            this._drop.currentYscale = -1;
            this.addChild(this._drop);
            this.dropEnabled(false);
        }
        MobileController.prototype.update = function () {
            this._left.update();
            this._right.update();
            this._jump.update();
            this._drop.update();
        };
        MobileController.prototype.up = function () {
            this._left.testUp();
            this._right.testUp();
            this._jump.testUp();
            this._drop.testUp();
        };
        MobileController.prototype.dropEnabled = function (value) {
            if (value && this._drop.inputEnabled == false) {
                this._drop.inputEnabled = value;
                this._drop.visible = true;
            }
            else if (!value && this._drop.inputEnabled == true) {
                this._drop.inputEnabled = value;
                this._drop.visible = false;
                this._drop.up();
            }
        };
        return MobileController;
    })(Phaser.Sprite);
    TProject.MobileController = MobileController;
    var SimpleButton = (function (_super) {
        __extends(SimpleButton, _super);
        function SimpleButton(game, name, sticky, cb) {
            _super.call(this, game, 0.0, 0.0, "ui", name);
            this.currentYscale = 1;
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
                this.up();
            }
        };
        SimpleButton.prototype.up = function () {
            this._down = false;
            this.scale.set(this.defScale, this.currentYscale);
            this.alpha = 0.6;
        };
        SimpleButton.prototype.down = function () {
            if (this._down) {
                return;
            }
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

var TProject;
(function (TProject) {
    var ParsingText = (function () {
        function ParsingText(game) {
            this.aqArray = [];
            this.game = game;
            this.loadAndParseText();
        }
        ParsingText.prototype.getCurrentQA = function () {
            var rightAns = this.aqArray[this.currentQ];
            this.currentQ++;
            if (this.currentQ > this.aqArray.length - 1) {
                this.shuffleArray();
            }
            return rightAns;
        };
        ParsingText.prototype.shuffleArray = function () {
            this.currentQ = 0;
            Phaser.ArrayUtils.shuffle(this.aqArray);
        };
        ParsingText.prototype.loadAndParseText = function () {
            var qArray = [];
            var aArray = [];
            var firstAArray = [];
            var secondAArray = [];
            var thirdAArray = [];
            var fourthAArray = [];
            var text = this.game.cache.getText("settings").split('&');
            for (var i = 0; i < text.length; i++) {
                if (text[i].charAt(0) == "Q") {
                    qArray.push(text[i]);
                    qArray[qArray.length - 1] = qArray[qArray.length - 1].replace("Q" + qArray.length + "=", "");
                    qArray[qArray.length - 1] = qArray[qArray.length - 1].split("%2b").join("+");
                    qArray[qArray.length - 1] = qArray[qArray.length - 1].split("Š").join("÷");
                    qArray[qArray.length - 1] = qArray[qArray.length - 1].split("x").join("×");
                    qArray[qArray.length - 1] = qArray[qArray.length - 1].replace("__", "_");
                }
                else if (text[i].charAt(0) == "A") {
                    aArray.push(text[i]);
                    aArray[aArray.length - 1] = aArray[aArray.length - 1].replace("A" + aArray.length + "=", "");
                    aArray[aArray.length - 1] = aArray[aArray.length - 1].split("%2b").join("+");
                    aArray[aArray.length - 1] = aArray[aArray.length - 1].split("Š").join("÷");
                }
                else if (text[i].charAt(0) == "C") {
                    //_.log(text[i]);
                    for (var n = text[i].length; n > 0; n--) {
                        if (text[i].charAt(n) == "=") {
                            if (text[i].charAt(n - 1) == "1") {
                                firstAArray.push(text[i]);
                                firstAArray[firstAArray.length - 1] = firstAArray[firstAArray.length - 1].replace("C" + firstAArray.length + "_1=", "");
                                firstAArray[firstAArray.length - 1] = firstAArray[firstAArray.length - 1].split("%2b").join("+");
                                firstAArray[firstAArray.length - 1] = firstAArray[firstAArray.length - 1].split("Š").join("÷");
                                firstAArray[firstAArray.length - 1] = firstAArray[firstAArray.length - 1].split("x").join("×");
                            }
                            else if (text[i].charAt(n - 1) == "2") {
                                secondAArray.push(text[i]);
                                secondAArray[secondAArray.length - 1] = secondAArray[secondAArray.length - 1].replace("C" + secondAArray.length + "_2=", "");
                                secondAArray[secondAArray.length - 1] = secondAArray[secondAArray.length - 1].split("%2b").join("+");
                                secondAArray[secondAArray.length - 1] = secondAArray[secondAArray.length - 1].split("Š").join("÷");
                                secondAArray[secondAArray.length - 1] = secondAArray[secondAArray.length - 1].split("x").join("×");
                            }
                            else if (text[i].charAt(n - 1) == "3") {
                                thirdAArray.push(text[i]);
                                thirdAArray[thirdAArray.length - 1] = thirdAArray[thirdAArray.length - 1].replace("C" + thirdAArray.length + "_3=", "");
                                thirdAArray[thirdAArray.length - 1] = thirdAArray[thirdAArray.length - 1].split("%2b").join("+");
                                thirdAArray[thirdAArray.length - 1] = thirdAArray[thirdAArray.length - 1].split("Š").join("÷");
                                thirdAArray[thirdAArray.length - 1] = thirdAArray[thirdAArray.length - 1].split("x").join("×");
                            }
                            else if (text[i].charAt(n - 1) == "4") {
                                fourthAArray.push(text[i]);
                                fourthAArray[fourthAArray.length - 1] = fourthAArray[fourthAArray.length - 1].replace("C" + fourthAArray.length + "_4=", "");
                                fourthAArray[fourthAArray.length - 1] = fourthAArray[fourthAArray.length - 1].split("%2b").join("+");
                                fourthAArray[fourthAArray.length - 1] = fourthAArray[fourthAArray.length - 1].split("Š").join("÷");
                                fourthAArray[fourthAArray.length - 1] = fourthAArray[fourthAArray.length - 1].split("x").join("×");
                            }
                        }
                    }
                }
            }
            for (var i = 0; i < qArray.length; i++) {
                this.aqArray[i] = [];
                this.aqArray[i][0] = qArray[i];
                this.aqArray[i][1] = aArray[i];
                this.aqArray[i][2] = firstAArray[i];
                this.aqArray[i][3] = secondAArray[i];
                this.aqArray[i][4] = thirdAArray[i];
                this.aqArray[i][5] = fourthAArray[i];
            }
            this.shuffleArray();
        };
        return ParsingText;
    })();
    TProject.ParsingText = ParsingText;
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
        function Player(game, x, y, cnt, body) {
            _super.call(this, game, x, y, "main", "player_body0000");
            // original game
            this._secsPerStep = 0.1;
            this._acceleration = 1.75;
            this.anchor.set(0.5);
            this._gameOver = false;
            this._body = body;
            this.game.physics.arcade.enable(this);
            this.body.setSize(60, 60, 30, 8);
            this._buttomCount = 0;
            this._eyesVisual = game.add.sprite(0.0, -15.0, "main", "player_eyes0000");
            this._eyesVisual.anchor.set(0.5);
            this._eyesVisual.animations.add("idle", ["player_eyes0000"]);
            this._eyesVisual.animations.add("blink", ["player_eyes0001", "player_eyes0000"], 12);
            this.addChild(this._eyesVisual);
            this._eyesTimer = Player.BLINK_TIME;
            this._velocity = new TProject.Point();
            this._lastPosition = new TProject.Point(x, y);
            this._container = cnt;
            this._smoke = new TProject.SmokeObject(game);
            this._ink = new Phaser.Sprite(game, 0, 0, "main", "ink0000");
            this._ink.animations.add("idle", ["ink0000"]);
            this._ink.animations.add("puff", Phaser.Animation.generateFrameNames("ink00", 0, 25, "", 2), 26);
            this._ink.anchor.set(0.5, 0.8);
            //this._ink.visible = false;
            this._inkAnimation = this._ink.animations.play("idle");
            this._container.addChildAt(this._ink, 3);
            this._stars = this.game.add.sprite(0.0, -60.0, "main", "stars0000");
            this._stars.anchor.set(0.5);
            this._stars.animations.add("hit", Phaser.Animation.generateFrameNames("stars00", 0, 18, "", 2), 24);
            this._stars.visible = false;
            this.addChild(this._stars);
            this._grabTextObject = this.game.add.text(0, this.height - 40, "", { font: "Poppins", fontSize: "45px", fontWeight: "bold", fill: "#dcd740" });
            this._grabTextObject.anchor.set(0.5);
            this.addChild(this._grabTextObject);
            this._textObjectDropContainer = new Phaser.Sprite(game, 0, 0);
            this._container.addChild(this._textObjectDropContainer);
            this._textObjectDropContainer.alpha = 0;
            this._textObjectText = this.game.add.text(0, 0, "", { font: "Poppins", fontSize: "45px", fontWeight: "bold", fill: "#dcd740" });
            this._textObjectText.anchor.set(0.5);
            this._textObjectDropContainer.addChild(this._textObjectText);
            this._smoke2 = new TProject.SmokeObject(game, 0.8);
            this._container.addChild(this._smoke2);
            this.game.physics.arcade.enable(this._textObjectDropContainer);
            this._bubbleEmitter = this.game.add.emitter(0, 0, 30);
            this._bubbleEmitter.makeParticles("main", "bubble0000");
            this._bubbleEmitter.gravity = 0;
            this._bubbleEmitter.setYSpeed(-50, -50);
            this._bubbleEmitter.start(false, 500, 75, null);
            this._bubbleEmitter.width = 20;
            this._bubbleEmitter.on = false;
            this._redropTextObject = false;
            this._container.addChild(this._bubbleEmitter);
            this._hitTime = 0;
        }
        Player.prototype.restart = function () {
            this._bubbleEmitter.on = false;
            this._stars.animations.stop();
            this._stars.visible = false;
            this._stars.frameName = "stars0000";
            this.rotation = 0;
            this._ink.rotation = 0;
            this._buttomCount = 0;
            this._redropTextObject = false;
            this._velocity.x = 0;
            this._velocity.y = 0;
            this._lastPosition.x = this.game.world.centerX;
            this._lastPosition.y = 20.0;
            this._grabTextObject.text = "";
            this._textObjectText.text = "";
            this._grabString = "";
            this._textObjectDropContainer.alpha = 0;
            this._gameOver = false;
            this._hitTime = 1;
        };
        Player.prototype.gameOver = function () {
            this._gameOver = true;
            this._stars.animations.stop();
        };
        Player.prototype.dropKeyIsVisible = function () {
            return this.isGrabNumber() && !this._redropTextObject;
        };
        Player.prototype.isGrabNumber = function () {
            return this._grabTextObject.text != "";
        };
        Player.prototype.setGrabNumber = function (textNumber) {
            this._grabTextObject.text = textNumber;
        };
        Player.prototype.getGrabNumber = function () {
            var currentGrab = this._grabTextObject.text;
            this._grabTextObject.text = "";
            return currentGrab;
        };
        Player.prototype.update = function () {
            var _this = this;
            if (!this._gameOver) {
                if (this._eyesTimer <= 0) {
                    this._eyesVisual.animations.play("blink");
                    this._eyesTimer = Player.BLINK_TIME + Math.random() * 100;
                }
                else {
                    this._eyesTimer--;
                }
                if (this._hitTime >= 0) {
                    this._hitTime--;
                }
                this.x += this._velocity.x;
                this.y += this._velocity.y;
                var soundDir = 3.5; // 7
                if (this._lastPosition.y - this.y > 7.2) {
                    if (this.y < 280 * 2 && this._inkAnimation.isFinished) {
                        this._ink.x = this.x - this._container.x;
                        this._ink.y = this.y;
                        this._ink.visible = true;
                        this._ink.rotation = this.rotation * 2.5;
                        this._inkAnimation = this._ink.animations.play("puff");
                        TProject.Config.audio.play("link", 0.6);
                        this._inkAnimation.onComplete.addOnce(function () {
                            _this._ink.visible = false;
                        });
                        // sound
                        if (this._velocity.x > soundDir && this._velocity.y < -soundDir) {
                        }
                        else if (this._velocity.x < -soundDir) {
                        }
                        else {
                        }
                    }
                }
                // hit bottom
                if (this._textObjectDropContainer.alpha == 1) {
                    this._textObjectDropContainer.y += 3.5;
                    this._bubbleEmitter.x = this._textObjectDropContainer.x;
                    this._bubbleEmitter.y = this._textObjectDropContainer.y - 20;
                    if (this._textObjectDropContainer.y > Player.BOTTOM + 20) {
                        this._textObjectDropContainer.alpha = 0;
                        this._smoke2.boom(this._textObjectDropContainer.x, this._textObjectDropContainer.y);
                        TProject.Config.audio.play("playerDown", 0.6);
                        this._body.checkNumberPosition(this._textObjectDropContainer, this._textObjectText.text);
                        this._redropTextObject = false;
                    }
                }
                if (this.y > Player.BOTTOM) {
                    this._velocity.y *= -0.5;
                    this.y -= 10;
                    this._smoke.boom(this.x, this.y + 20.0);
                    if (this._buttomCount < 2) {
                        TProject.Config.audio.play("playerDown", 0.6);
                        this._buttomCount++;
                    }
                }
                else if (this.y < Player.BOTTOM - 40) {
                    if (this._buttomCount != 0) {
                        this._buttomCount = 0;
                    }
                }
                this._lastPosition.x = this.x;
                this._lastPosition.y = this.y;
                this._velocity.y += (this._acceleration * this._secsPerStep);
                var offset = 20 * 2;
                if (this.x > this.game.width - offset) {
                    this.x -= 3;
                    this._velocity.x = -3 * 0.25;
                    this.rotation = -TProject._.degToRad(2);
                }
                else if (this.x < offset) {
                    this.x += 5;
                    this._velocity.x = 3 * 0.25;
                    this.rotation = TProject._.degToRad(2);
                }
                if (this.y < 0) {
                    this.y = 0;
                    this._velocity.y = 2;
                }
                this._container.x = this.game.world.centerX - this.x;
            }
        };
        Player.prototype.hit = function (obj) {
            var _this = this;
            if (this._stars.visible) {
                return false;
            }
            if (this._hitTime >= 0) {
                return false;
            }
            if (this.game.physics.arcade.collide(this, obj)) {
                TProject.Config.audio.play("playerHit", 0.6);
                TProject.Config.audio.play("error", 0.6);
                this._stars.visible = true;
                this._velocity.x *= 1.12;
                this._velocity.y = -7.1;
                this._stars.animations.play("hit")
                    .onComplete.addOnce(function () {
                    _this._stars.visible = false;
                });
                this._hitTime = Player.HIT_TIME;
                return true;
            }
            return false;
        };
        Player.prototype.gotoLeft = function () {
            if (this._velocity.x > -24) {
                this._velocity.x -= 0.5 * this._secsPerStep;
            }
            if (this.rotation > -TProject._.degToRad(25)) {
                this.rotation -= TProject._.degToRad(0.5) * 0.5;
            }
        };
        Player.prototype.gotoRight = function () {
            if (this._velocity.x < 24) {
                this._velocity.x += 0.5 * this._secsPerStep;
            }
            if (this.rotation < TProject._.degToRad(25)) {
                this.rotation += TProject._.degToRad(0.5) * 0.5;
            }
        };
        Player.prototype.gotoUp = function () {
            if (this.y > 50) {
                this._velocity.y -= 0.43;
            }
        };
        Player.prototype.gotoDown = function () {
            var _this = this;
            if (this.isGrabNumber() && !this._redropTextObject) {
                this._velocity.y = -5.43;
                this._grabString = this._grabTextObject.text;
                this._grabTextObject.text = "";
                this._textObjectDropContainer.x = this.x - this._container.x;
                this._textObjectDropContainer.y = this.y - this._container.y + 35;
                this._textObjectDropContainer.alpha = 1;
                this._redropTextObject = true;
                this._bubbleEmitter.on = true;
                TProject.Config.audio.play("bubble", 0.6);
                this.game.time.events.add(300, function () {
                    _this._bubbleEmitter.on = false;
                });
                this._textObjectText.text = this._grabString;
            }
        };
        Player.BLINK_TIME = 100;
        Player.BOTTOM = 440;
        Player.HIT_TIME = 150;
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
    var SmokeObject = (function (_super) {
        __extends(SmokeObject, _super);
        function SmokeObject(game, scale) {
            if (scale === void 0) { scale = 1.0; }
            _super.call(this, game, 0.0, 0.0, "main", "smoke0000");
            this.anchor.set(0.5);
            this.scale.set(scale);
            game.world.addChildAt(this, 3);
            this.visible = false;
        }
        SmokeObject.prototype.boom = function (x, y) {
            var _this = this;
            if (this.visible) {
                return;
            }
            var offsetY = 25 * this.scale.x;
            this.x = x;
            this.y = y;
            this.visible = true;
            this.alpha = 1.0;
            this.game.add.tween(this).to({ y: y - offsetY, alpha: 0 }, 800, Phaser.Easing.Linear.None, true)
                .onComplete.addOnce(function () {
                _this.visible = false;
            });
        };
        return SmokeObject;
    })(Phaser.Image);
    TProject.SmokeObject = SmokeObject;
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
            this._backRect = this.game.add.graphics(0, 0);
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
            this.game.state.add("Body", TProject.Body);
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
    var Body = (function (_super) {
        __extends(Body, _super);
        function Body() {
            _super.apply(this, arguments);
        }
        Body.prototype.create = function () {
            var _this = this;
            TProject._.log("Start game!");
            this.game.time.advancedTiming = true;
            this._gameOver = false;
            //let floor = this.game.add.image(this.world.centerX, this.game.height, "main", "floor0000");
            //floor.anchor.set(0.5, 1.0);
            //floor.scale.set(this.game.width / 45.0, 1.0);
            var bg = this.game.add.image(0, 0, "bg");
            var container = this.game.add.sprite(0.0, 0.0);
            // decor
            var decor;
            decor = this.game.add.image(184.0, 460.0, "main", "decor0000");
            decor.anchor.set(0.5);
            container.addChild(decor);
            decor = this.game.add.image(580.0, 460.0, "main", "decor0001");
            decor.anchor.set(0.5);
            container.addChild(decor);
            decor = this.game.add.image(-125.0, 480.0, "main", "decor0003");
            decor.anchor.set(0.5);
            container.addChild(decor);
            decor = this.game.add.image(947.0, 460.0, "main", "decor0002");
            decor.anchor.set(0.5);
            container.addChild(decor);
            /////////////
            this._playerShadow = this.game.add.image(0.0, 485.0, "main", "shadow0000");
            this._playerShadow.anchor.set(0.5);
            this._playerShadow.alpha = 0.7;
            this._player = new TProject.Player(this.game, this.world.centerX, 20.0, container, this);
            this.world.addChild(this._player);
            this._enemies = [];
            this._enemies.push(new TProject.Crab(this.game));
            container.addChild(this._enemies[0]);
            this._enemies.push(new TProject.Crab(this.game, true));
            container.addChild(this._enemies[1]);
            this._enemies.push(new TProject.Fish(this.game));
            if (TProject.Config.rightAnswer < 1) {
                this._enemies[2].visible = false;
            }
            container.addChild(this._enemies[2]);
            /////////////
            this._gameUI = new TProject.GameUI(this.game, this);
            container.addChildAt(this._gameUI, 3);
            if (!this.game.device.desktop) {
                this._mobileController = new TProject.MobileController(this.game, function () { _this._player.gotoLeft(); }, function () { _this._player.gotoRight(); }, function () { _this._player.gotoUp(); }, function () { _this._player.gotoDown(); });
                this.game.stage.addChild(this._mobileController);
                this._mobileController.x = 80.0;
                this._mobileController.y = this.game.height - 70.0;
                this.game.input.onUp.add(function () {
                    if (_this._mobileController) {
                        _this._mobileController.up();
                    }
                }, this);
            }
            this._winLosePanel = new TProject.WinLosePanel(this.game, this);
            this._winLosePanel.x = this.game.world.centerX;
            this._winLosePanel.y = 255;
            this.game.stage.addChild(this._winLosePanel);
        };
        Body.prototype.replay = function () {
            var _this = this;
            this._player.x = this.world.centerX;
            this._player.y = 20.0;
            this._playerShadow.x = 0;
            this._playerShadow.y = 485.0;
            for (var i = 0; i < this._enemies.length; i++) {
                this._enemies[i].animations.play("idle");
            }
            this._enemies[2].x = 1200;
            this._enemies[2].y = 200;
            this._enemies[2].visible = false;
            this._player.restart();
            this._gameUI.restart();
            //_.log(Config.playerLive);
            //_.log(Config.rightAnswer);        
            this.game.time.events.add(100, function () {
                if (_this._mobileController)
                    _this._mobileController.visible = true;
                _this._gameOver = false;
            });
        };
        Body.prototype.checkNumberPosition = function (textObject, number) {
            //_.log(number);
            this._gameUI.checkNumberColision(textObject, number);
        };
        Body.prototype.gameOver = function (gameOver) {
            this._winLosePanel.show(gameOver);
            this._player.gameOver();
            this._gameOver = true;
            if (this._mobileController)
                this._mobileController.visible = false;
            for (var i = 0; i < this._enemies.length; i++) {
                this._enemies[i].animations.stop();
            }
            if (gameOver) {
                this.gotoFunction("WIN_FUNC");
            }
            else {
                this.gotoFunction("LOSE_FUNC");
            }
        };
        Body.prototype.gotoDown = function () {
            if (this._player.isGrabNumber()) {
                var playerGrabText = this._player.getGrabNumber();
            }
        };
        Body.prototype.showFish = function () {
            this._enemies[2].visible = true;
        };
        Body.prototype.update = function () {
            if (!this._gameOver) {
                if (this._mobileController) {
                    this._mobileController.dropEnabled(this._player.dropKeyIsVisible());
                }
                this._playerShadow.x = this._player.x;
                this._playerShadow.scale.set(this._player.y / this.world.centerY);
                if (!this.game.device.desktop) {
                }
                else {
                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                        this._player.gotoLeft();
                    }
                    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                        this._player.gotoRight();
                    }
                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                        this._player.gotoUp();
                    }
                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                        this._player.gotoDown();
                    }
                }
                for (var i = 0; i < this._enemies.length; i++) {
                    if (this._enemies[i].visible) {
                        this._enemies[i].update();
                        if (this._player.hit(this._enemies[i])) {
                            // меняем индикатор ui, отнимаем жизнь
                            this._gameUI.playerError();
                        }
                    }
                }
                if (!this._player.isGrabNumber()) {
                    this._gameUI.playerCollideCheck(this._player);
                }
                else {
                    this._gameUI.playerQuestionCheck(this._player);
                }
            }
        };
        Body.prototype.render = function () {
            /*
            this.game.debug.text("" + this.game.time.fps, 2, 14, "#00ff00");

            this.game.debug.body(this._player);

            for (let i: int = 0; i < this._enemies.length; i++) {
                this.game.debug.body(this._enemies[i]);
            }
            */
        };
        Body.prototype.gotoFunction = function (name) {
            var fnc = window[name];
            if (typeof fnc === "function") {
                fnc();
            }
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
            this._loadedAssets = false;
            this._loadedFont = false;
        }
        Boot.prototype.preload = function () {
            TProject._.log("Loading...");
            TProject.Config.load();
            this.fontloading();
            this.game.load.onFileComplete.add(this.loadingUpdate, this);
            this.game.load.atlas("ui", "assets/images/ui.png", "assets/images/ui.json");
            this.game.load.image("mainMenu", "assets/images/mainMenu.png");
            this.game.load.image("bg", "assets/images/background.png");
            this.game.load.atlas("main", "assets/images/main.png", "assets/images/main.json");
            this.game.load.text("settings", "assets/questions.txt");
            //Загружаем звуки
            this.game.load.audiosprite("sfx", ["assets/sounds/sfx.mp3", "assets/sounds/sfx.ogg"], "assets/sounds/sfx.json");
        };
        Boot.prototype.create = function () {
            this.game.input.maxPointers = 2;
            this.game.stage.backgroundColor = "#1b1b1b";
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
                TProject.Config.audio = this.game.add.audioSprite("sfx");
                if (window["SKIP_MENU"] == true) {
                    this.game.state.start("Body", true);
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
                _this.game.state.start("Body", true);
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
