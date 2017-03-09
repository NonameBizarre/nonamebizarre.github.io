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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TProject;
(function (TProject) {
    var BallAndGoal = (function (_super) {
        __extends(BallAndGoal, _super);
        function BallAndGoal(game, x, y, body) {
            _super.call(this, game, x, y);
            this.anchor.set(0.5);
            this._targetAlpha = (this.game.device.desktop ? 0 : 0.7);
            this._body = body;
            this._currentAnimationString = "";
            this._playerChoise = "";
            this._backNet = this.game.add.sprite(635, -160, "mainAsset", "Net0");
            this._backNet.anchor.set(0.5);
            this._freeGate = this.game.add.sprite(632, -157, "mainAsset", "FreeGate");
            this._freeGate.anchor.set(0.5);
            this._freeNet = this.game.add.sprite(692, -145, "mainAsset", "FreeNet");
            this._freeNet.anchor.set(0.5);
            this.addChild(this._backNet);
            this.addChild(this._freeGate);
            this.addChild(this._freeNet);
            this._target1 = this.game.add.sprite(557, -132, "mainAsset", "target1");
            this._target2 = this.game.add.sprite(560, -199, "mainAsset", "target2");
            this._target3 = this.game.add.sprite(632, -193, "mainAsset", "target3");
            this._target4 = this.game.add.sprite(628, -116, "mainAsset", "target4");
            this.setTargets(this._target1, "LeftDown");
            this.setTargets(this._target2, "LeftUp");
            this.setTargets(this._target3, "RightUp");
            this.setTargets(this._target4, "RightDown");
            this._arrow = this.game.add.sprite(600, -332, "mainAsset", "arrow");
            this._arrow.anchor.set(0.5);
            this._arrow.alpha = 0;
            this.addChild(this._arrow);
            this._spine = this.game.add.spine(0, 0, "ballAndGoalie");
            this._currentAnimation = this._spine.setAnimationByName(0, "idle", true);
            this._currentAnimation.timeScale = 0.6;
            this._spine.setSkinByName("Char1"); // empty, full
            this._spine.setToSetupPose();
            this.addChild(this._spine);
        }
        BallAndGoal.prototype.setTargets = function (currentTarget, targetAnimation) {
            var _this = this;
            currentTarget.anchor.set(0.5);
            currentTarget.alpha = 0;
            currentTarget.inputEnabled = false;
            currentTarget.events.onInputDown.add(function () {
                _this.freeTargets();
                _this._currentAnimationString = targetAnimation;
                _this._body.globalGameStateCount();
            });
            currentTarget.events.onInputOver.add(function () {
                _this.dropTargetAlpha();
                _this._currentTargetTween = _this.game.add.tween(currentTarget).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true);
            });
            currentTarget.events.onInputOut.add(function () {
                _this.dropTargetAlpha();
                currentTarget.alpha = 0;
            });
            this.addChild(currentTarget);
        };
        BallAndGoal.prototype.showTargets = function (playerChoise) {
            this._playerChoise = (playerChoise ? "Good" : "Bad"); //Переменная также будет влиять и на то, какой будем проигрывать звук. 
            this._target1.alpha = this._targetAlpha;
            this._target1.inputEnabled = true;
            this._target2.alpha = this._targetAlpha;
            this._target2.inputEnabled = true;
            this._target3.alpha = this._targetAlpha;
            this._target3.inputEnabled = true;
            this._target4.alpha = this._targetAlpha;
            this._target4.inputEnabled = true;
            this._arrow.alpha = 1;
            this._arrayTween = this.game.add.tween(this._arrow).to({ y: -292 }, 500, Phaser.Easing.Back.Out, true, 0, -1, true);
        };
        BallAndGoal.prototype.dropTargetAlpha = function () {
            this.game.tweens.remove(this._currentTargetTween);
            this._target1.alpha = 0;
            this._target2.alpha = 0;
            this._target3.alpha = 0;
            this._target4.alpha = 0;
        };
        BallAndGoal.prototype.freeTargets = function () {
            this.dropTargetAlpha();
            this.game.tweens.remove(this._arrayTween);
            this._arrow.alpha = 0;
            this._target1.inputEnabled = false;
            this._target2.inputEnabled = false;
            this._target3.inputEnabled = false;
            this._target4.inputEnabled = false;
        };
        BallAndGoal.prototype.kickAnimationStart = function () {
            var _this = this;
            this._currentAnimationString = this._currentAnimationString + this._playerChoise;
            this._currentAnimation = this._spine.setAnimationByName(0, this._currentAnimationString, false);
            if (this._currentAnimationString = "LeftUpBad") {
                this._currentAnimation.timeScale = 0.9;
            }
            this._currentAnimation.onEvent = function (trackIndex, event) {
                _this.eventManager(event.data.name, event.stringValue);
            };
        };
        BallAndGoal.prototype.eventManager = function (eventName, stringName) {
            if (eventName == "ballInNet") {
                this._backNet.loadTexture("mainAsset", stringName);
                if (stringName == "Net0") {
                    this._backNet.position.set(635, -160);
                }
                else if (stringName == "NetRightDown") {
                    this._backNet.position.set(645, -160);
                }
            }
            else if (eventName == "ballInGoalie") {
                TProject.Config.audio.play("goalCeep", 0.6);
            }
            //_.log(stringName);
            if (stringName == "coverUpGate3") {
                this.setChildIndex(this._spine, this.children.length - 8);
            }
            else if (stringName == "coverUpGate") {
                this.setChildIndex(this._freeNet, this.children.length - 1);
            }
        };
        BallAndGoal.prototype.refresh = function () {
            this._backNet.loadTexture("mainAsset", "Net0");
            this._currentAnimation = this._spine.setAnimationByName(0, "idle", true);
            this._spine.setToSetupPose();
            this._currentAnimation.timeScale = 0.6;
            this._arrow.alpha = 0;
            this._arrow.position.set(600, -332);
            this._backNet.position.set(635, -160);
            this.setChildIndex(this._backNet, this.children.length - 1);
            this.setChildIndex(this._freeGate, this.children.length - 1);
            this.setChildIndex(this._freeNet, this.children.length - 1);
            this.setChildIndex(this._target1, this.children.length - 1);
            this.setChildIndex(this._target2, this.children.length - 1);
            this.setChildIndex(this._target3, this.children.length - 1);
            this.setChildIndex(this._target4, this.children.length - 1);
            this.setChildIndex(this._arrow, this.children.length - 1);
            this.setChildIndex(this._spine, this.children.length - 1);
        };
        BallAndGoal.prototype.update = function () {
        };
        return BallAndGoal;
    })(Phaser.Sprite);
    TProject.BallAndGoal = BallAndGoal;
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
    var GameUI = (function (_super) {
        __extends(GameUI, _super);
        function GameUI(game, cb) {
            var _this = this;
            _super.call(this, game, 0.0, 0.0);
            this._cb = cb;
            this._submitBtn = game.add.sprite(125.0, 165.0);
            this._submitBtn.anchor.set(0.5);
            this.addChild(this._submitBtn);
            this._ball = game.add.sprite(0.0, 0.0, "ballBtn");
            this._ball.scale.set(0.7);
            this._ball.anchor.set(0.5);
            this._submitBtn.addChild(this._ball);
            this._captionBtn = this.game.add.text(0.0, 0.0, "SUMBIT", { font: "Poppins", fontSize: "25px", fontWeight: "bold", fill: "#33FF00" });
            this._captionBtn.anchor.set(0.5);
            this._submitBtn.addChild(this._captionBtn);
            this._captionBtn.stroke = "#000000";
            this._captionBtn.strokeThickness = 4;
            this._ball.animations.add("idle", [0]);
            this._ball.animations.add("action", [0, 1, 2, 3, 4, 5, 6], 20, true);
            if (this.game.device.desktop) {
                this._ball.play("idle");
                this._submitBtn.events.onInputOver.add(function () {
                    _this._ball.play("action");
                });
                this._submitBtn.events.onInputOut.add(function () {
                    _this._ball.play("idle");
                });
            }
            else {
                this._ball.play("action");
            }
            this._submitBtn.events.onInputDown.add(this.submit, this);
            this.addText();
            ///
            this._txtAnswer = this.game.add.text(-170.0, 165.0, "ANSWER:", { font: "Poppins", fontSize: "25px", fontWeight: "normal", fill: "#ffffff" });
            this._txtAnswer.anchor.set(0.5);
            this.addChild(this._txtAnswer);
            this._txtSolve = this.game.add.text(-59.0, 70.0, "SOLVE:", { font: "Poppins", fontSize: "25px", fontWeight: "normal", fill: "#ffffff" });
            this._txtSolve.anchor.set(0.5);
            this.addChild(this._txtSolve);
            // -59.0 + this.game.world.centerX, 110.0 + this.game.height - 200 + 165
            this._txtPickTarget = this.game.add.text(-59.0 + this.game.world.centerX, 430, "PICK\nYOUR\nTARGET", { font: "Poppins", fontSize: "28px", fontWeight: "normal", fill: "#ffffff" });
            this._txtPickTarget.anchor.set(0.5);
            this._txtPickTarget.align = "center";
            this._txtPickTarget.lineSpacing = -8;
            //this.addChild(this._txtPickTarget);
            this._question = this.game.add.text(-59.0, 110.0, "948 - 45", { font: "Poppins", fontSize: "30px", fontWeight: "bold", fill: "#000000" });
            this._question.anchor.set(0.5);
            this.addChild(this._question);
            this._txtCorrectAnswer = this.game.add.text(-9.0, 105.0, "CORRECT\nANSWER:", { font: "Poppins", fontSize: "25px", fontWeight: "normal", fill: "#ffffff" });
            this._txtCorrectAnswer.anchor.set(0.5);
            this._txtCorrectAnswer.align = "center";
            this._txtCorrectAnswer.lineSpacing = -8;
            this.addChild(this._txtCorrectAnswer);
            this._txtCorrectAnswerValue = this.game.add.text(-9.0, 165.0, "948 - 45", { font: "Poppins", fontSize: "30px", fontWeight: "bold", fill: "#000000" });
            this._txtCorrectAnswerValue.anchor.set(0.5);
            this.addChild(this._txtCorrectAnswerValue);
            this.init();
        }
        GameUI.prototype.init = function () {
            this.alpha = 0;
            this.answer.alpha = 0;
            this.answer.inputEnabled = false;
            this.answer.blockInput = true;
            this._txtPickTarget.alpha = 0;
            this._txtCorrectAnswer.visible = false;
            this._txtCorrectAnswerValue.visible = false;
            this._txtAnswer.visible = false;
            this._txtSolve.visible = false;
            this._txtPickTarget.visible = false;
            this._question.visible = false;
            this._submitBtn.visible = false;
            this.game.tweens.removeFrom(this);
            this.game.tweens.removeFrom(this.answer);
        };
        GameUI.prototype.showCorrectAnswer = function () {
            this.game.add.tween(this).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
            this._txtCorrectAnswer.visible = true;
            this._txtCorrectAnswerValue.visible = true;
        };
        GameUI.prototype.show = function () {
            var _this = this;
            this._txtAnswer.visible = true;
            this._txtSolve.visible = true;
            this._question.visible = true;
            this._submitBtn.visible = true;
            this.game.add.tween(this).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
            this.game.add.tween(this.answer).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
            this.answer.setText("");
            this._submitBtn.inputEnabled = true;
            this.answer.inputEnabled = true;
            this.answer.blockInput = false;
            if (this.game.device.desktop) {
                this.answer.startFocus();
            } // else {
            //    this.answer.endFocus();
            //}
            // let input: any = document.createElement('input'); 
            // input.type = "text"; 
            // input.setAttribute("style", "width:200px;top: 10px;");
            // //_.log();
            // this.game.parent.ap
            //.appendChild(input); 
            this.answer.events.onInputDown.add(function () {
                _this.game.input.enabled = false;
            }, this);
        };
        GameUI.prototype.setQuestion = function (text) {
            this._question.text = text;
        };
        GameUI.prototype.setCorrectAnswer = function (text) {
            this._txtCorrectAnswerValue.text = this._question.text + " = " + text;
        };
        GameUI.prototype.attack = function () {
            var _this = this;
            this.game.add.tween(this._txtPickTarget).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true)
                .onComplete.add(function () {
                _this._txtPickTarget.visible = false;
            });
        };
        GameUI.prototype.test = function (value) {
            this.answer.inputEnabled = value;
        };
        GameUI.prototype.submit = function () {
            var _this = this;
            var value = this.answer.text._text;
            if (value == "") {
                return;
            }
            if (this._cb) {
                this._cb(value);
            }
            this.answer.setText("");
            this._txtPickTarget.visible = true;
            this.game.add.tween(this._txtPickTarget).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
            this.game.add.tween(this).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
            this.game.add.tween(this.answer).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true)
                .onComplete.add(function () {
                _this._txtAnswer.visible = false;
                _this._txtSolve.visible = false;
                _this._question.visible = false;
                _this._submitBtn.inputEnabled = false;
                _this.answer.inputEnabled = false;
                _this.answer.blockInput = true;
                _this._submitBtn.visible = false;
            });
        };
        GameUI.prototype.addText = function () {
            this.answer = this.game.add.inputField(-110 + this.game.world.centerX, 140.0 + this.game.height - 200, {
                font: "30px Poppins",
                fill: "#000000",
                fillAlpha: 1,
                fontWeight: "bold",
                width: 150,
                padding: 8,
                borderWidth: 1,
                borderColor: "#000000",
                borderRadius: 0,
                textAlign: "center",
                type: 2,
                zoom: false,
                cursorColor: "#000"
            });
            //this.addChild(this.answer);
            this.answer.setText("");
        };
        return GameUI;
    })(Phaser.Sprite);
    TProject.GameUI = GameUI;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var MyCamera = (function () {
        function MyCamera(target) {
            this.target = target;
            this._target = target;
        }
        MyCamera.prototype.add = function (x, y, scale, delay, tweenTime) {
            if (tweenTime === void 0) { tweenTime = 0.1; }
            this._frame = new Frame(x, y, scale, delay, tweenTime);
            return this._frame;
        };
        MyCamera.prototype.set = function (x, y, scale) {
            this._target.position.set(x, y);
            this._target.scale.set(scale);
        };
        MyCamera.prototype.start = function () {
            this.nextFrame();
        };
        MyCamera.prototype.stop = function () {
            var g = this._target.game;
            g.tweens.removeFrom(this._target);
        };
        MyCamera.prototype.nextFrame = function () {
            var _this = this;
            if (this._frame == null || this._target == null) {
                return;
            }
            var g = this._target.game;
            var x = this._frame.x;
            var y = this._frame.y;
            var scale = this._frame.scale;
            var delay = this._frame.delay;
            var tweenTime = this._frame.tweenTime;
            this._frame = this._frame.nextFrame;
            g.add.tween(this._target).to({ x: x, y: y }, tweenTime, Phaser.Easing.Linear.None, true, delay);
            g.add.tween(this._target.scale).to({ x: scale, y: scale }, tweenTime, Phaser.Easing.Linear.None, true, delay)
                .onComplete.add(function () {
                _this.nextFrame();
            });
        };
        return MyCamera;
    })();
    TProject.MyCamera = MyCamera;
    var Frame = (function () {
        function Frame(x, y, scale, delay, tweenTime) {
            this.x = x;
            this.y = y;
            this.scale = scale;
            this.delay = delay;
            this.tweenTime = tweenTime;
            this.nextFrame = null;
        }
        Frame.prototype.add = function (x, y, scale, delay, tweenTime) {
            if (tweenTime === void 0) { tweenTime = 0.1; }
            this.nextFrame = new Frame(x, y, scale, delay, tweenTime);
            return this.nextFrame;
        };
        return Frame;
    })();
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
        ParsingText.prototype.getCurrentQ = function () {
            return this.aqArray[this.currentQ][0];
        };
        ParsingText.prototype.getCurrentA = function () {
            var rightAns = this.aqArray[this.currentQ][1];
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
            var text = this.game.cache.getText("settings").split('&');
            for (var i = 0; i < text.length; i++) {
                if (text[i].charAt(0) == "Q") {
                    qArray.push(text[i]);
                    qArray[qArray.length - 1] = qArray[qArray.length - 1].replace("Q" + qArray.length + "=", "");
                    qArray[qArray.length - 1] = qArray[qArray.length - 1].split("%2b").join("+");
                    qArray[qArray.length - 1] = qArray[qArray.length - 1].split("Š").join("/");
                }
                else if (text[i].charAt(0) == "A") {
                    aArray.push(text[i]);
                    aArray[aArray.length - 1] = aArray[aArray.length - 1].replace("A" + aArray.length + "=", "");
                }
            }
            for (var i = 0; i < qArray.length; i++) {
                this.aqArray[i] = [];
                this.aqArray[i][0] = qArray[i];
                this.aqArray[i][1] = aArray[i];
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TProject;
(function (TProject) {
    var Сharacter = (function (_super) {
        __extends(Сharacter, _super);
        function Сharacter(game, x, y, body) {
            _super.call(this, game, x, y);
            this.anchor.set(0.5);
            this._body = body;
            this._charSkin = this.game.rnd.integerInRange(1, 3);
            this._spine = this.game.add.spine(0, 0, "footballer");
            this._heroAnimation = this._spine.setAnimationByName(0, "Idle", true);
            //this._heroAnimation.timeScale = 0.8;
            this._spine.setSkinByName("Char" + this._charSkin); // empty, full
            this._spine.setToSetupPose();
            this.addChild(this._spine);
        }
        Сharacter.prototype.kickAnimationStart = function (playerWin) {
            var _this = this;
            this._heroAnimation = this._spine.setAnimationByName(0, "KickBall", false);
            //this._heroAnimation.timeScale = 0.1;
            this._heroAnimation.onEvent = function (trackIndex, event) {
                _this.eventManager(event.data.name);
            };
            this._heroAnimation.onComplete = function () {
                _this._heroAnimation = _this._spine.setAnimationByName(0, "Idle", true);
                _this._spine.x = 130;
                _this._spine.y = 5;
                _this.game.time.events.add(900, function () {
                    var currentAnim = (!playerWin ? "Lose_" + _this._charSkin : "Win2");
                    //_.log(currentAnim);
                    _this._heroAnimation = _this._spine.setAnimationByName(0, currentAnim, true); //Lose_3
                    _this._heroAnimation.timeScale = 0.8;
                    _this._body.globalGameStateCount();
                }, _this);
            };
        };
        Сharacter.prototype.eventManager = function (eventName) {
            if (eventName == "kick ball") {
                this._body.globalGameStateCount();
            }
        };
        Сharacter.prototype.refresh = function () {
            this._heroAnimation = this._spine.setAnimationByName(0, "Idle", true);
            this._spine.setToSetupPose();
            this._spine.x = 0;
            this._spine.y = 0;
        };
        Сharacter.prototype.update = function () {
        };
        return Сharacter;
    })(Phaser.Sprite);
    TProject.Сharacter = Сharacter;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var Main = (function () {
        function Main() {
            TProject._.log("Init Core!");
            this.game = new Phaser.Game(760, 510, Phaser.AUTO, "game", null, false);
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
            this.PASS_UPDATE = 2;
            this._passUpdateCounte = this.PASS_UPDATE;
        }
        Body.prototype.create = function () {
            var _this = this;
            TProject._.log("Start game!");
            this._parsingText = new TProject.ParsingText(this.game);
            this._container = this.game.add.sprite(0.0, 0.0);
            this._gameStateCount = 0;
            this.game.time.advancedTiming = true;
            this._bg = this.game.add.sprite(0, 0, "bg");
            this._mask = this.game.add.graphics(0, 0);
            this._mask.beginFill(0xff0000, 1);
            this._mask.alpha = 1;
            this._mask.drawRect(-266 * 0.5, 0, Body.BOARD_WIDTH, Body.BOARD_HEIGHT);
            this._mask.endFill();
            this._character = new TProject.Сharacter(this.game, 42.19, 367, this);
            this._ballAndGoal = new TProject.BallAndGoal(this.game, 0, 510, this);
            this._playerWin = false;
            this._bg.addChild(this._character);
            this._bg.addChild(this._ballAndGoal);
            //this._bg.inputEnabled = true;
            //this._bg.events.onInputDown.add(()=>{
            //    this._character.kickAnimationStart();
            //});
            this._renderTexture = new Phaser.RenderTexture(this.game, this.game.world.width, this.game.world.height, "rt");
            this._minimap = this.game.add.sprite(-Body.BOARD_WIDTH * 0.5, 0.0, this._renderTexture);
            //this._minimap.scale.set(1.45);
            this._minimap.anchor.set(0.0, 0.0);
            this._scoreboar = new Phaser.Sprite(this.game, this.game.world.centerX - 10.0, -5.0);
            this._scoreboar.addChild(this._mask);
            this._scoreboar.mask = this._mask;
            this._scoreboar.addChild(this._minimap);
            this.game.stage.addChild(this._scoreboar);
            this._finalText = this.game.add.text(this.game.world.centerX - 10.0, 40.0, "", //MISS! GOAL!
            { font: "Poppins", fontSize: "80px", fontWeight: "bold", fill: "#008000" }); //#ff0000 #008000
            this._finalText.anchor.set(0.5);
            this._finalText.align = "left";
            this.game.stage.addChild(this._finalText);
            this._scoreboardBorder = new Phaser.Image(this.game, this.game.world.centerX - 10.0, 0.0, "mainAsset", "scoreboard");
            this._scoreboardBorder.anchor.set(0.5, 0.0);
            this.game.stage.addChild(this._scoreboardBorder);
            // this.testText();
            this._myCamera = new TProject.MyCamera(this._minimap);
            this.startGameCameraAnimation();
            this._gameUi = new TProject.GameUI(this.game, function (value) { _this.globalGameStateCount(value); });
            this._gameUi.x = this.game.world.centerX;
            this._gameUi.y = this.game.height - 200;
            this.game.stage.addChild(this._gameUi);
            this._container.addChild(this._bg);
            this._renderTexture.renderXY(this._container, 0, 0, true);
            PhaserInput.onKeyboardOpen.add(function () {
            });
            PhaserInput.onKeyboardClose.add(function () {
            });
            this._winLosePanel = new TProject.WinLosePanel(this.game, this);
            this._winLosePanel.x = this.game.world.centerX;
            this._winLosePanel.y = 255;
            this.game.stage.addChild(this._winLosePanel);
        };
        Body.prototype.globalGameStateCount = function (value) {
            if (value === void 0) { value = undefined; }
            this._gameStateCount++;
            switch (this._gameStateCount) {
                case 1:
                    //ПОКАЗЫВАЕМ UI, ЖДЁМ ОТВЕТА ИГРОКА. Пока UI Нет выполняем следующий пункт. Но это UI отправляет команду и говорит правильно ли игрок ответил
                    this._gameUi.setQuestion(this._parsingText.getCurrentQ());
                    this._gameUi.show();
                    //this.globalGameStateCount(true);
                    break;
                case 2:
                    //Игрок ответил. Показываем таргеты для нападения. Тут-же и передаём Bad или Good приписку
                    TProject.Config.audio.play("buttonDown", 0.6);
                    var rightAns = this._parsingText.getCurrentA();
                    this._playerWin = ("" + value == "" + rightAns ? true : false);
                    this._gameUi.setCorrectAnswer(rightAns);
                    this._ballAndGoal.showTargets(this._playerWin);
                    break;
                case 3:
                    //Игрок выбрал таргет. Передаём персонажу команду стартовать анимацию, фокус камеры на мяч
                    this._character.kickAnimationStart(this._playerWin);
                    this._gameUi.attack();
                    this.cameraFocusOnBall();
                    break;
                case 4:
                    this._ballAndGoal.kickAnimationStart();
                    TProject.Config.audio.play("ballPunch", 0.6);
                    if (this._playerWin) {
                        this.game.time.events.add(100, function () {
                            TProject.Config.audio.play("GoodPunch", 0.6);
                        });
                    }
                    //Персонаж передал команду запустить анимацию мяча 
                    break;
                case 5:
                    //Персонаж радуется или грустит в зависимости от playerWin + если ответ неправильный, показываем правильный ответ. После всего этого
                    //Показываем WinLoose панель и тут-же обнуляем this._gameStateCount, фокус на персонажа
                    this.cameraFocusEndGame();
                    this._gameStateCount = 0;
            }
        };
        Body.prototype.cameraFocusOnBall = function () {
            this._myCamera.stop();
            this._myCamera.set(-240, -580, 1.6); //- удар по мячу
        };
        Body.prototype.cameraFocusEndGame = function () {
            var _this = this;
            if (this._playerWin) {
                this._myCamera.stop();
                TProject.Config.audio.play("Good", 0.6);
                this._myCamera.set(-330, -580, 1.9); //- выигрыш
                this._finalString = "GOAL!";
                this._finalTextCount = this._finalString.length;
                this._finalText.fill = "#008000";
                this.showTextInMinimap();
                this.game.time.events.add(1500, function () {
                    _this._winLosePanel.show(true);
                });
            }
            else {
                this._myCamera.stop();
                TProject.Config.audio.play("Bad", 0.6);
                this._myCamera.set(-330, -620, 1.9); //- проигрыш
                this._finalString = "MISS!";
                this._finalTextCount = this._finalString.length;
                this._finalText.fill = "#ff0000";
                this.showTextInMinimap();
                this._gameUi.showCorrectAnswer();
                this.game.time.events.add(1500, function () {
                    _this._winLosePanel.show(false);
                });
            }
        };
        Body.prototype.startGameCameraAnimation = function () {
            var _this = this;
            //Корректная анимация на начало игры
            this._myCamera.set(-960, -530, 1.7);
            this._myCamera.add(-140, -590, 1.9, 1700)
                .add(-140, -800, 2.5, 200, 1700)
                .add(-140, -200, 1.3, 350)
                .add(-280, -200, 1.3, 0, 1500)
                .add(-140, -340, 1.1, 200);
            // для того, чтобы перевод камеры сделать НЕМЕДЛЕННЫМ, оставть 5й параметр пустым
            //this._myCamera.add(-300, -500, 1.45, 1000)
            //.add(-600, -400, 1.45, 1500, 500);
            this._myCamera.start();
            this.game.time.events.add(5650, function () {
                //_.log("Show UI");
                _this.globalGameStateCount();
            });
        };
        Body.prototype.showTextInMinimap = function () {
            var _this = this;
            if (this._finalTextCount > 0) {
                this._finalText.text = this._finalText.text + this._finalString.charAt(this._finalText.text.length);
                this._finalTextCount--;
                //MISS! GOAL!
                //fill  #ff0000 #008000
                this.game.time.events.add(300, function () {
                    _this.showTextInMinimap();
                });
            }
        };
        Body.prototype.replay = function () {
            this._character.refresh();
            this._ballAndGoal.refresh();
            this._gameUi.init();
            this.startGameCameraAnimation();
            this._finalText.text = "";
        };
        Body.prototype.gameOver = function () {
            // this.gotoFunction("WIN_FUNC" / "LOSE_FUNC");
        };
        Body.prototype.update = function () {
            if (this._passUpdateCounte <= 0) {
                this._renderTexture.renderXY(this._container, 0, 0, true);
                // copy лучше не юзать, а то получишь вылет из-за недостатка памяти
                /*
                if (this._miniMapBitmap != null){
                    this._miniMapBitmap.copy(this._renderTexture1, 0, 0, this._bg.width, this._bg.height, null, null, 200, 200, null, null, null, 1, 1, 1);
                }
                //
                // может спасти ее принудительная очистка, но это дорого
                */
                this._passUpdateCounte = this.PASS_UPDATE;
            }
            else {
                this._passUpdateCounte--;
            }
            this._character.update();
            // this._minimap = this.game.add.sprite(200, 100, this._miniMapBitmap);
        };
        Body.prototype.render = function () {
            this.game.debug.text("" + this.game.time.fps, 2, 14, "#00ff00");
        };
        Body.prototype.gotoFunction = function (name) {
            var fnc = window[name];
            if (typeof fnc === "function") {
                fnc();
            }
        };
        Body.BOARD_WIDTH = 266;
        Body.BOARD_HEIGHT = 140;
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
            this.fontloading();
            this.game.plugins.add(PhaserSpine.SpinePlugin);
            this.game.load.onFileComplete.add(this.loadingUpdate, this);
            this.game.load.atlas("ui", "assets/images/ui.png", "assets/images/ui.json");
            this.game.load.atlas("mainAsset", "assets/images/mainAsset.png", "assets/images/mainAsset.json");
            this.game.load.atlas("ballBtn", "assets/images/ballBtn.png", "assets/images/ballBtn.json");
            this.game.load.image("mainMenu", "assets/images/mainMenu.png");
            this.game.load.image("bg", "assets/images/bg.png");
            /*
            this.game.load.image("scoreboard", "assets/images/scoreboard.png");

            this.game.load.image("target1", "assets/images/target1.png");
            this.game.load.image("target2", "assets/images/target2.png");
            this.game.load.image("target3", "assets/images/target3.png");
            this.game.load.image("target4", "assets/images/target4.png");

            this.game.load.image("arrow", "assets/images/arrow.png");

            this.game.load.image("FreeGate", "assets/images/FreeGate.png");
            this.game.load.image("FreeNet", "assets/images/FreeNet.png");

            this.game.load.image("Net0", "assets/images/Net0.png");
            this.game.load.image("NetLeftDown", "assets/images/NetLeftDown.png");
            this.game.load.image("NetLeftUp1", "assets/images/NetLeftUp1.png");
            this.game.load.image("NetLeftUp2", "assets/images/NetLeftUp2.png");
            this.game.load.image("NetRightDown", "assets/images/NetRightDown.png");
            this.game.load.image("NetRightUp1", "assets/images/NetRightUp1.png");
            this.game.load.image("NetRightUp2", "assets/images/NetRightUp2.png");

            */
            this.game.load.spine("footballer", "assets/images/footballer.json");
            this.game.load.spine("ballAndGoalie", "assets/images/ballAndGoalie.json");
            this.game.load.text('settings', 'assets/settings.txt');
            //Загружаем звуки
            this.game.load.audiosprite("sfx", ["assets/sounds/mygameaudio.mp3", "assets/sounds/mygameaudio.ogg"], "assets/sounds/mygameaudio.json");
        };
        Boot.prototype.create = function () {
            var _this = this;
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
            Phaser.Device.whenReady(function () {
                _this.game.plugins.add(PhaserInput.Plugin);
            });
            if (this.game.device.desktop) {
                this.game.input.mouse.enabled = true;
            }
            else {
                this.game.input.mouse.enabled = false;
            }
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
                TProject.Config.audio = this.game.add.audioSprite("sfx");
                if (window["SHOW_MENU"] == true) {
                    this.game.state.start("MainMenu", true);
                }
                else {
                    this.game.state.start("Body", true);
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
