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
    // класс, в котором осуществляются основные анимации
    // пока в состоянии крайнего дебага
    var BasketBallAnimations = (function (_super) {
        __extends(BasketBallAnimations, _super);
        function BasketBallAnimations(game, x, y, cb) {
            _super.call(this, game, x, y);
            this._cb = cb;
            this._containerLeft = this.game.add.sprite(0, 0);
            this._containerRight = this.game.add.sprite(20, 10);
            this.addChild(this._containerLeft);
            this.addChild(this._containerRight);
            // левый беграунд
            this._bgL = this.game.add.sprite(-90, -60 + 20, "bg");
            this._floorLeft = this.game.add.sprite(20, 405 + 20, "floor_left");
            this._containerLeft.addChild(this._bgL);
            this._containerLeft.addChild(this._floorLeft);
            // правый беграунд
            this._bgR = this.game.add.sprite(400, -50, "bg");
            this._bgR.scale.set(0.5);
            this._floorRight = this.game.add.sprite(470, 180, "floor_right");
            this._containerRight.addChild(this._bgR);
            this._containerRight.addChild(this._floorRight);
            // левыая анимация
            this._spineL = this.game.add.spine(250, 330 - 5, "idleLeft");
            this._currentAnimationL = this._spineL.setAnimationByName(0, "animation", true);
            this._currentAnimationL.timeScale = 0.6;
            this._spineL.setToSetupPose();
            this._containerLeft.addChild(this._spineL);
            // правая
            this._spineR = this.game.add.spine(550, 150, "idleRight");
            this._currentAnimationR = this._spineR.setAnimationByName(0, "animation", true);
            this._currentAnimationR.timeScale = 0.6;
            this._spineR.setToSetupPose();
            this._containerRight.addChild(this._spineR);
            this._maskLeft = new Phaser.Graphics(this.game, 200, 300);
            this._maskRight = new Phaser.Graphics(this.game, 600, 125);
            this._containerLeft.addChild(this._maskLeft);
            this._containerRight.addChild(this._maskRight);
            this.initMask();
            this.initSpine();
            this.startAnimation();
            // включаем анимацию победы/поражения
        }
        // функция, которая будет вызываться при правильном ответе
        BasketBallAnimations.prototype.correctAnswerAnimation = function () {
            var _this = this;
            var tween = this.game.add.tween(this._maskLeft.scale).to({ x: 0, y: 0 }, 300, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                var tweenRight = _this.game.add.tween(_this._maskRight.scale).to({ x: 0, y: 0 }, 300, Phaser.Easing.Linear.None, true);
                _this.initAttack(_this.goodAttackAnimation.bind(_this));
            });
        };
        // функция, которая будет вызываться при неправильном ответе
        BasketBallAnimations.prototype.wrongAnswerAnimation = function () {
            var _this = this;
            var tween = this.game.add.tween(this._maskLeft.scale).to({ x: 0, y: 0 }, 300, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                var tweenRight = _this.game.add.tween(_this._maskRight.scale).to({ x: 0, y: 0 }, 300, Phaser.Easing.Linear.None, true);
                _this.initAttack(_this.badAttackAnimation.bind(_this));
            });
        };
        BasketBallAnimations.prototype.restart = function () {
            var _this = this;
            this.hide();
            setTimeout(function () {
                _this.setIdleState();
            }, 100);
        };
        BasketBallAnimations.prototype.initSpine = function () {
            this._attackSpine = this.game.add.spine(370, 270 - 5, "Attack");
            this._goodAttackSpine = this.game.add.spine(490, 145, "GoodAttack");
            this._badAttackSpine = this.game.add.spine(490, 125, "BadAttack");
            this._attackSpine.visible = false;
            this._goodAttackSpine.visible = false;
            this._badAttackSpine.visible = false;
        };
        BasketBallAnimations.prototype.hide = function () {
            this._maskLeft.scale.set(0, 0);
            this._maskRight.scale.set(0, 0);
            this._attackSpine.visible = false;
            this._badAttackSpine.visible = false;
            this._goodAttackSpine.visible = false;
        };
        BasketBallAnimations.prototype.setIdleState = function () {
            this._bgL.x = -90;
            this._bgL.y = -60 + 20;
            this._bgR.x = 400;
            this._bgR.y = -50;
            this._bgR.scale.set(0.5);
            this._floorLeft.visible = true;
            this._floorRight.visible = true;
            this._spineL.visible = true;
            this._spineR.visible = true;
            this.startAnimation();
        };
        // тут инициализируются маски
        BasketBallAnimations.prototype.initMask = function () {
            this._maskLeft.beginFill(0xFFFFFF);
            this._maskRight.beginFill(0xFFFFFF);
            this._maskLeft.scale.set(0, 0);
            this._maskRight.scale.set(0, 0);
            // left circle
            this._maskLeft.drawCircle(0, 0, 370);
            // right circle
            this._maskRight.drawCircle(0, 0, 250);
            this._containerLeft.mask = this._maskLeft;
            this._containerRight.mask = this._maskRight;
        };
        // здесь происходит анимация аттаки
        BasketBallAnimations.prototype.initAttack = function (onEndCallback) {
            var _this = this;
            this._spineL.visible = false;
            this._spineR.visible = false;
            this._maskLeft.scale.set(0, 0);
            this._bgL.y = 70;
            this._floorLeft.visible = false;
            var tween = this.game.add.tween(this._maskLeft.scale).to({ x: 0.6, y: 0.6 }, 300, Phaser.Easing.Linear.None, true);
            this._attackSpine.visible = true;
            this._currentAnimationAttack = this._attackSpine.setAnimationByName(0, "animation", false);
            this._currentAnimationAttack.timeScale = 0.6;
            this._attackSpine.setToSetupPose();
            this._containerLeft.addChild(this._attackSpine);
            this._currentAnimationAttack.onEvent = function (trackIndex, event) {
                if (event.data.name == "Vjuh") {
                    TProject.Config.audio.play("vjuh", 0.6);
                    _this._bgL.y = 170;
                    _this._currentAnimationAttack.timeScale = 0.8;
                }
            };
            this._currentAnimationAttack.onEnd = function () {
                _this._cb("attackAtimationCompleted");
                onEndCallback();
            };
        };
        // анимация победы
        BasketBallAnimations.prototype.goodAttackAnimation = function () {
            var _this = this;
            //Config.audio.play("goodCatch", 0.8);
            setTimeout(function () {
                TProject.Config.audio.play("goodCatch", 0.8);
            }, 300);
            this._maskRight.scale.set(0, 0);
            this._spineR.visible = false;
            this._bgR.scale.set(1, 1);
            this._floorRight.visible = false;
            var tween = this.game.add.tween(this._maskRight.scale).to({ x: 0.9, y: 0.9 }, 200, Phaser.Easing.Linear.None, true);
            this._goodAttackSpine.visible = true;
            this._currentAnimationGoodAttack = this._goodAttackSpine.setAnimationByName(0, "animation", false);
            this._currentAnimationGoodAttack.timeScale = 0.8;
            this._goodAttackSpine.setToSetupPose();
            this._containerRight.addChild(this._goodAttackSpine);
            this._currentAnimationGoodAttack.onEvent = function (trackIndex, event) {
                if (event.data.name == "startSound") {
                    setTimeout(function () {
                        TProject.Config.audio.play("good", 0.6);
                    }, 300);
                }
            };
            this._currentAnimationGoodAttack.onEnd = function () {
                _this._cb("finalAnimationCompleted");
            };
        };
        // анимация поражения
        BasketBallAnimations.prototype.badAttackAnimation = function () {
            var _this = this;
            this._maskRight.scale.set(0, 0);
            this._spineR.visible = false;
            this._bgR.scale.set(1, 1);
            this._floorRight.visible = false;
            var tween = this.game.add.tween(this._maskRight.scale).to({ x: 1, y: 1 }, 200, Phaser.Easing.Linear.None, true);
            this._badAttackSpine.visible = true;
            this._badAttackSpine.scale.set(0.8, 0.8);
            this._currentAnimationBadAttack = this._badAttackSpine.setAnimationByName(0, "animation", false);
            this._currentAnimationBadAttack.timeScale = 0.8;
            this._badAttackSpine.setToSetupPose();
            this._containerRight.addChild(this._badAttackSpine);
            this._currentAnimationBadAttack.onEvent = function (trackIndex, event) {
                if (event.data.name == "startSound") {
                    TProject.Config.audio.play("badCatch", 0.8);
                    setTimeout(function () {
                        TProject.Config.audio.play("bad", 0.6);
                    }, 300);
                }
            };
            this._currentAnimationBadAttack.onEnd = function () {
                _this._cb("finalAnimationCompleted");
            };
        };
        // тут идет начальная анимация
        BasketBallAnimations.prototype.startAnimation = function () {
            var _this = this;
            var tween = this.game.add.tween(this._maskLeft.scale).to({ x: 1.1, y: 1.1 }, 500, Phaser.Easing.Sinusoidal.Out, true);
            tween.onComplete.add(function () {
                _this._cb("firstLeftMaskOpen");
                var tweenLeftSmall = _this.game.add.tween(_this._maskLeft.scale).to({ x: 1, y: 1 }, 100, Phaser.Easing.Sinusoidal.Out, true);
                var tweenRight = _this.game.add.tween(_this._maskRight.scale).to({ x: 1.1, y: 1.1 }, 500, Phaser.Easing.Sinusoidal.Out, true);
                tweenRight.onComplete.add(function () {
                    var tweenRightSmall = _this.game.add.tween(_this._maskRight.scale).to({ x: 1, y: 1 }, 100, Phaser.Easing.Sinusoidal.Out, true);
                    _this._cb("firstRightMaskOpen");
                }, _this);
            }, this);
        };
        return BasketBallAnimations;
    })(Phaser.Sprite);
    TProject.BasketBallAnimations = BasketBallAnimations;
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
            if (!Config._canSaveProress) {
                return;
            }
            localStorage.setItem(this.SAVE_DATA_NAME, JSON.stringify(this._savedata));
        };
        Config.load = function () {
            Config._canSaveProress = false;
            if (!Config.isLocalStorageNameSupported()) {
                Config.reset();
                return;
            }
            Config._canSaveProress = true;
            this._savedata = JSON.parse(localStorage.getItem(this.SAVE_DATA_NAME));
            if (this._savedata == null) {
                this.reset();
                localStorage.setItem(this.SAVE_DATA_NAME, JSON.stringify(this._savedata));
            }
        };
        Config.reset = function () {
            if (this._savedata == null) {
            }
            else {
            }
        };
        // system
        Config.isLocalStorageNameSupported = function () {
            var testKey = "test", storage = window.localStorage;
            try {
                storage.setItem(testKey, "1");
                storage.removeItem(testKey);
                return true;
            }
            catch (error) {
                return false;
            }
        };
        Config.SAVE_DATA_NAME = "SAVE_NAME";
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
            _super.call(this, game, 0.0, 0.0);
            this._cb = cb;
            this._btnIsOver = false;
            this._btnIsDown = false;
            this._upperTxt = game.add.text(250, 65, "INBOUND THE BALL TO YOUR TEAMMATE!", { font: "Poppins", fontSize: "36px", fontWeight: "bold", fill: "#ff6600", align: "center", wordWrap: true, wordWrapWidth: 450 });
            this._upperTxt.lineSpacing = -10;
            this._upperTxt.anchor.set(0.5);
            this._solveTxt = game.add.text(game.width, game.world.centerY + 80, "SOLVE THIS PROBLEM: ", { font: "Poppins", fontSize: "30px", fontWeight: "bold", fill: "#ff6600" });
            this._solveTxt.anchor.set(1, 1);
            this._question = this.game.add.text(this._solveTxt.centerX, game.world.centerY + 80, "213123", { font: "Poppins", fontSize: "30px", fontWeight: "bold", fill: "#000000" });
            this._question.anchor.set(0.5, 0);
            this._ballShadow = game.add.sprite(this.game.width - 80, this.game.height - 7, "ball_shadow");
            this._ballShadow.anchor.set(0.5);
            this._throwBtn = this.game.add.sprite(this.game.width + 60, game.height - 55);
            this._throwBtn.anchor.set(0.5);
            this._ball = game.add.sprite(0, 0, "ball_throw");
            this._ball.anchor.set(0.5);
            this._throwText = this.game.add.text(0, 0, "Throw", { font: "Poppins", fontSize: "32px", fontWeight: "bold", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: 100 });
            this._throwText.anchor.set(0.5);
            this._throwText.lineSpacing = -10;
            this._problemString = this.game.add.text(0, 20, "PROBLEM", { font: "Poppins", fontSize: "24px", fontWeight: "bold", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: 100 });
            this._problemString.anchor.set(0.5);
            // this._throwBtn.events.onInputOver.add(() => {
            //     if (this._answer.text._text) {
            //         this._btnIsOver = true;
            //         this._throwText.fill = "#F7F21A";
            //         if (this._btnIsDown) {
            //             this._ball.scale.set(0.85);
            //         }
            //     }
            // }, this);
            // this._throwBtn.events.onInputOut.add(() => {
            //     if (this._answer.text._text) {
            //         this._btnIsOver = false;
            //         this._throwText.fill = this._problemString.alpha? "#00FF00":"#FFFFFF";
            //         if (this._btnIsDown) {
            //             this._ball.scale.set(1);
            //         }
            //     }
            // }, this);
            // this._throwBtn.events.onInputDown.add(() => {
            //     if (this._answer.text._text) {
            //         this._btnIsDown = true;
            //         this._ball.scale.set(0.85);
            //     }
            // }, this);
            // this._throwBtn.events.onInputUp.add(() => {
            //     this._btnIsDown = false;
            //     if (this._btnIsOver) {
            //         this._ball.scale.set(1);
            //         this.submit(this._restart);
            //     }
            // }, this); 
            this.addText();
            this._answerTxt = game.add.text(this._answer.centerX + 10, this.game.height - 65, "ANSWER:", { font: "Poppins", fontSize: "30px", fontWeight: "bold", fill: "#666666" });
            this._answerTxt.anchor.set(0.5, 1);
            this._correctAnswerTxt = game.add.text(250, 120, "", { font: "Poppins", fontSize: "24px", fontWeight: "bold", fill: "#000000", align: "center", wordWrap: true, wordWrapWidth: 450 });
            this._correctAnswerTxt.anchor.set(0.5);
            this.addChild(this._upperTxt);
            this.addChild(this._solveTxt);
            this.addChild(this._question);
            this.addChild(this._ballShadow);
            this.addChild(this._throwBtn);
            this._throwBtn.addChild(this._ball);
            this._throwBtn.addChild(this._throwText);
            this._throwBtn.addChild(this._problemString);
            this.addChild(this._correctAnswerTxt);
            ;
            this._btmGroup = game.add.group();
            this._btmGroup.add(this._solveTxt);
            this._btmGroup.add(this._question);
            this._btmGroup.add(this._answerTxt);
            this._btmGroup.add(this._answer);
            this.init();
            //this.showUpperUI();
            //this.showLowerUI();
        }
        GameUI.prototype.init = function () {
            var _this = this;
            this._answer.inputEnabled = false;
            this._upperTxt.alpha = 0;
            this._upperTxt.scale.set(0.8);
            this._btmGroup.alpha = 0;
            this._answer.inputEnabled = false;
            this._answer.blockInput = true;
            this._throwBtn.inputEnabled = false;
            this._correctAnswerTxt.alpha = 0;
            // this._throwBtn.visible = false;
            this._ballShadow.scale.set(0);
            this._upperTxt.setText("INBOUND THE BALL TO YOUR TEAMMATE!");
            this._upperTxt.y = 65;
            this._upperTxt.fontSize = 36;
            this._upperTxt.lineSpacing = -10;
            this._throwBtn.position.set(this.game.width + 60, this.game.height - 55);
            this._ball.scale.set(1);
            this._throwText.setText("Throw");
            this._throwText.fontSize = 32;
            this._throwText.fill = "#ffffff";
            this._throwText.y = 0;
            this._problemString.alpha = 0;
            this._throwBtn.events.onInputUp.removeAll();
            this._throwBtn.events.onInputDown.removeAll();
            this._throwBtn.events.onInputOver.removeAll();
            this._throwBtn.events.onInputOut.removeAll();
            this._throwBtn.events.onInputUp.add(function () {
                if (_this._answer.text._text) {
                    _this._btnIsDown = false;
                    if (_this._btnIsOver) {
                        _this._ball.scale.set(1);
                        _this.submit();
                    }
                }
            }, this);
            this._throwBtn.events.onInputOver.add(function () {
                if (_this._answer.text._text) {
                    _this._btnIsOver = true;
                    _this._throwText.fill = "#F7F21A";
                    if (_this._btnIsDown) {
                        _this._ball.scale.set(0.85);
                    }
                }
            }, this);
            this._throwBtn.events.onInputOut.add(function () {
                if (_this._answer.text._text) {
                    _this._btnIsOver = false;
                    _this._throwText.fill = _this._problemString.alpha ? "#00FF00" : "#FFFFFF";
                    if (_this._btnIsDown) {
                        _this._ball.scale.set(1);
                    }
                }
            }, this);
            this._throwBtn.events.onInputDown.add(function () {
                if (_this._answer.text._text) {
                    _this._btnIsDown = true;
                    _this._ball.scale.set(0.85);
                }
            }, this);
        };
        GameUI.prototype.showUpperUI = function () {
            TProject._.log(this._answer.text._text);
            this.game.add.tween(this._upperTxt.scale).to({ x: 1, y: 1 }, 400, Phaser.Easing.Linear.None, true);
            this.game.add.tween(this._upperTxt).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true);
        };
        GameUI.prototype.showLowerUI = function () {
            var _this = this;
            var tween = this.game.add.tween(this._btmGroup).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                _this._answer.inputEnabled = true;
            });
            this.game.add.tween(this._throwBtn).to({ x: this.game.width - 80 }, 300, Phaser.Easing.Linear.None, true).
                onComplete.add(function () {
                _this._throwBtn.inputEnabled = true;
            });
        };
        GameUI.prototype.setQuestion = function (question) {
            this._question.setText(question);
            TProject._.log(question);
        };
        // обработка нажатия на "throw"
        GameUI.prototype.submit = function () {
            var _this = this;
            this._answer.inputEnabled = false;
            var value = this._answer.text._text;
            // if (value == "") {
            //     return;
            // }
            TProject.Config.audio.play("button", 0.6);
            this._throwBtn.inputEnabled = false;
            if (this._cb) {
                this._cb(value);
            }
            this._answer.setText("");
            this.game.add.tween(this._upperTxt).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
            var tween = this.game.add.tween(this._throwBtn).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                _this._throwBtn.y = -60;
                _this._throwBtn.alpha = 1;
                _this._throwText.fill = "#FFFFFF";
                _this._upperTxt.scale.set(0);
                _this._upperTxt.alpha = 1;
            });
            this._throwBtn.events.onInputUp.removeAll();
            this._throwBtn.events.onInputDown.removeAll();
            this._throwBtn.events.onInputOver.removeAll();
            this._throwBtn.events.onInputOut.removeAll();
            this._throwBtn.events.onInputUp.add(function () {
                _this._btnIsDown = false;
                if (_this._btnIsOver) {
                    _this._restartCallback();
                    TProject.Config.audio.play("button", 0.6);
                }
            }, this);
            this._throwBtn.events.onInputOver.add(function () {
                _this._btnIsOver = true;
                _this._throwText.fill = "#F7F21A";
                if (_this._btnIsDown) {
                    _this._ball.scale.set(0.85);
                }
            }, this);
            this._throwBtn.events.onInputOut.add(function () {
                _this._btnIsOver = false;
                _this._throwText.fill = _this._problemString.alpha ? "#00FF00" : "#FFFFFF";
                if (_this._btnIsDown) {
                    _this._ball.scale.set(1);
                }
            }, this);
            this._throwBtn.events.onInputDown.add(function () {
                _this._btnIsDown = true;
                _this._ball.scale.set(0.85);
            }, this);
        };
        GameUI.prototype.updateLowerUI = function (isRightAnswer, rightAnswer) {
            var _this = this;
            if (!isRightAnswer && rightAnswer) {
                this._correctAnswerTxt.setText("correct answer: " + rightAnswer);
                this._throwText.setText("NEW PROBLEM");
                this._throwText.fontSize = 26;
                TProject._.log(this._answer.text._text);
                this.game.add.tween(this._correctAnswerTxt).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
            }
            else if (isRightAnswer) {
                this._throwText.setText("NEXT");
                this._throwText.fontSize = 36;
                this._throwText.y -= 5;
                this._throwText.fill = "#00ff00";
                this._problemString.alpha = 1;
                TProject._.log(this._answer.text._text);
            }
            this.game.add.tween(this._ballShadow.scale).to({ y: 1, x: 1 }, 300, Phaser.Easing.Linear.None, true);
            var tween = this.game.add.tween(this._throwBtn).to({ y: this.game.height - 55 }, 300, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                TProject.Config.audio.play("buttonFallDown", 0.6).allowMultiple = true;
                _this.game.add.tween(_this._ballShadow.scale).to({ y: 0.7, x: 0.7 }, 100, Phaser.Easing.Linear.None, true);
                _this.game.add.tween(_this._throwBtn).to({ y: _this._throwBtn.y - 50 }, 100, Phaser.Easing.Linear.None, true).onComplete.add(function () {
                    _this.game.add.tween(_this._ballShadow.scale).to({ y: 1, x: 1 }, 600, Phaser.Easing.Bounce.Out, true);
                    //Config.audio.play("buttonFallDown", 0.6).allowMultiple = true;
                    setTimeout(function () {
                        TProject.Config.audio.play("buttonFallDown", 0.6).allowMultiple = true;
                        setTimeout(function () {
                            TProject.Config.audio.play("buttonFallDown", 0.6).allowMultiple = true;
                        }, 200);
                    }, 250);
                    _this.game.add.tween(_this._throwBtn).to({ y: _this._throwBtn.y + 50 }, 600, Phaser.Easing.Bounce.Out, true).onComplete.add(function () {
                        _this._throwBtn.inputEnabled = true;
                    });
                });
            });
        };
        Object.defineProperty(GameUI.prototype, "restartCallback", {
            set: function (cb) {
                this._restartCallback = cb;
            },
            enumerable: true,
            configurable: true
        });
        GameUI.prototype.updateUpperUI = function (isRightAnswer) {
            var _this = this;
            if (!isRightAnswer) {
                this._upperTxt.setText("PICKED OFF!");
                this._upperTxt.fontSize = 52;
            }
            else {
                this._upperTxt.setText("GREAT CATCH!");
                this._upperTxt.lineSpacing = -20;
                this._upperTxt.fontSize = 60;
                this._upperTxt.y = 100;
            }
            this.game.add.tween(this._upperTxt.scale).to({ x: 1.1, y: 1.1 }, 400, Phaser.Easing.Linear.None, true).onComplete.add(function () {
                _this.game.add.tween(_this._upperTxt.scale).to({ x: 1, y: 1 }, 100, Phaser.Easing.Linear.None, true);
            });
        };
        GameUI.prototype.addText = function () {
            this._answer = this.game.add.inputField(55 + this.game.world.centerX, this.game.height - 70, {
                font: "30px Poppins",
                fill: "#000000",
                fillAlpha: 1,
                fontWeight: "bold",
                width: 140,
                padding: 8,
                borderWidth: 1,
                borderColor: "#000000",
                borderRadius: 0,
                textAlign: "center",
                type: 2,
                zoom: false,
                cursorColor: "#000"
            });
            this._answer.scale.set(1, 1.2);
            //this.addChild(this.answer);
            this._answer.setText("");
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
            // this.currentQ ++
            if (this.currentQ > this.aqArray.length - 1) {
                this.shuffleArray();
            }
            return rightAns;
        };
        ParsingText.prototype.nextQuestion = function () {
            this.currentQ = (this.currentQ + 1) % this.aqArray.length;
        };
        ParsingText.prototype.shuffleArray = function () {
            this.currentQ = 0;
            Phaser.ArrayUtils.shuffle(this.aqArray);
        };
        ParsingText.prototype.loadAndParseText = function () {
            var qArray = [];
            var aArray = [];
            var text = this.game.cache.getText("questions").split('&');
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
            this._gameBody = body;
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
                _this._play.inputEnabled = false;
                _this._gameBody.replay(WinLosePanel.BEFORE_HIDE, _this._winMode);
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
            this._winMode = win;
            this._play.setNewFrames(win ? ["btnPLayOff", "btnPLayOn", "btnPLayOn"] : ["btnTryOff", "btnTryOn", "btnTryOn"]);
            this._play.inputEnabled = true;
            this._visual.alpha = 0;
            this._backRect.alpha = 0;
            this.game.add.tween(this._visual).to({ alpha: 1 }, 200, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(this._backRect).to({ alpha: 0.7 }, 200, Phaser.Easing.Sinusoidal.Out, true);
            this._gameBody.replay(WinLosePanel.BEGIN, this._winMode);
        };
        WinLosePanel.prototype.hide = function () {
            var _this = this;
            this.game.add.tween(this._visual).to({ alpha: 0 }, 200, Phaser.Easing.Sinusoidal.Out, true).
                onComplete.add(function () {
                _this.visible = false;
                _this._gameBody.replay(WinLosePanel.HIDE, _this._winMode);
            });
        };
        WinLosePanel.BEGIN = "begin";
        WinLosePanel.BEFORE_HIDE = "before hide";
        WinLosePanel.HIDE = "hide";
        return WinLosePanel;
    })(Phaser.Sprite);
    TProject.WinLosePanel = WinLosePanel;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var Main = (function () {
        function Main() {
            this.game = new Phaser.Game(760, 510, Phaser.AUTO, "game_container", null, false);
            this.game.state.add("Boot", TProject.Boot, true);
            this.game.state.add("Body", TProject.Body);
            this.game.state.add("MainMenu", TProject.MainMenu);
        }
        Main.gotoFunction = function (name) {
            var fnc = window[name];
            if (typeof fnc === "function") {
                fnc();
            }
        };
        Main.DEBUG = true;
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
            if (TProject.Main.DEBUG) {
                this.game.time.advancedTiming = true;
            }
            this._isRightAns = false;
            this.game.stage.setBackgroundColor("#ffcc33");
            // this._bg = this.game.add.sprite(0, 0, "bg");
            this._pasrsingText = new TProject.ParsingText(this.game);
            this._basketBallAnimations = new TProject.BasketBallAnimations(this.game, 0, 0, this.onAnimation.bind(this));
            this.game.stage.addChild(this._basketBallAnimations);
            this._gameUI = new TProject.GameUI(this.game, this.onThrow.bind(this));
            this.game.stage.addChild(this._gameUI);
            this.myinit();
            this._gameUI.restartCallback = this.restart.bind(this);
        };
        // тут инициализация каких-то штук важный,
        // который будут использоваться при replay
        Body.prototype.myinit = function () {
            this._gameUI.setQuestion(this._pasrsingText.getCurrentQ());
        };
        // Работает при наличии WinLosePanel
        Body.prototype.replay = function (phase, win) {
            switch (phase) {
                case TProject.WinLosePanel.BEGIN:
                    // ...
                    break;
                case TProject.WinLosePanel.BEFORE_HIDE:
                    // ...
                    break;
                case TProject.WinLosePanel.HIDE:
                    // ...
                    break;
            }
        };
        // обработка клика на "throw"
        Body.prototype.onThrow = function (answer) {
            TProject._.log("THROW!");
            var currA = this._pasrsingText.getCurrentA();
            //Нужно передавать в GameUI информацию о том, правильный был ответ или нет
            //для того, чтобы корректно отображать информацию вызовом функции без аргументов
            if (currA == answer) {
                TProject._.log("correct answer");
                this._isRightAns = true;
                this._basketBallAnimations.correctAnswerAnimation();
            }
            else {
                TProject._.log("wrong answer " + currA + " : " + answer);
                // Также, передаём в GameUI информацию о том, какой был правильный ответ
                this._isRightAns = false;
                this._basketBallAnimations.wrongAnswerAnimation();
            }
            // устанвливаем новый вопрос
            // this._pasrsingText.nextQuestion();
            // this._gameUI.setQuestion(this._pasrsingText.getCurrentQ());
        };
        Body.prototype.restart = function () {
            this._basketBallAnimations.restart();
            this._pasrsingText.nextQuestion();
            this._gameUI.init();
            this._gameUI.setQuestion(this._pasrsingText.getCurrentQ());
        };
        // обработка калбэков от анимации
        Body.prototype.onAnimation = function (stage) {
            var _this = this;
            switch (stage) {
                case "firstLeftMaskOpen":
                    TProject._.log("left animation has finished");
                    this._gameUI.showUpperUI();
                    break;
                case "firstRightMaskOpen":
                    TProject._.log("right animation has finished");
                    //this._gameUI.updateLowerUI(true);
                    this.game.time.events.add(500, function () {
                        _this._gameUI.showLowerUI();
                    });
                    break;
                case "attackAtimationCompleted":
                    TProject._.log("attack animation has finished");
                    this._gameUI.updateUpperUI(this._isRightAns);
                    break;
                case "finalAnimationCompleted":
                    TProject._.log("final animation has finished");
                    this._gameUI.updateLowerUI(this._isRightAns, this._pasrsingText.getCurrentA());
                    break;
            }
        };
        // Если мы хотим резко удалить со сцены какую-нибудь хуйню перед закрытием, то лучше делать это тут.
        Body.prototype.shutdown = function () {
        };
        Body.prototype.gameOver = function () {
            // this.gotoFunction("WIN_FUNC" / "LOSE_FUNC");
        };
        Body.prototype.update = function () {
        };
        Body.prototype.render = function () {
            if (TProject.Main.DEBUG) {
                this.game.debug.text("" + this.game.time.fps, 2, 14, "#00ff00");
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
            //Config.load();
            this.fontloading();
            this.game.plugins.add(PhaserSpine.SpinePlugin);
            this.game.load.onFileComplete.add(this.loadingUpdate, this);
            this.game.load.atlas("ui", "assets/images/ui.png", "assets/images/ui.json");
            this.game.load.image("mainMenu", "assets/images/mainMenu.png");
            this.game.load.image("bg", "assets/images/Background.png");
            this.game.load.image("ball_throw", "assets/images/P1_Attack_Ball.png");
            this.game.load.image("ball_shadow", "assets/images/BallShadow.png");
            this.game.load.image("floor_left", "assets/images/Floor.png");
            this.game.load.image("floor_right", "assets/images/Floor2.png");
            //Spine
            this.game.load.spine("idleLeft", "assets/images/idleLeft.json");
            this.game.load.spine("idleRight", "assets/images/idleRight.json");
            this.game.load.spine("Attack", "assets/images/Attack.json");
            this.game.load.spine("GoodAttack", "assets/images/GoodAttack.json");
            this.game.load.spine("BadAttack", "assets/images/BadAttack.json");
            //
            this.game.load.text('questions', 'assets/questions.txt');
            //Загружаем звуки
            this.game.load.audiosprite("sfx", ["assets/sounds/sfx.mp3", "assets/sounds/sfx.ogg"], "assets/sounds/sfx.json");
        };
        Boot.prototype.create = function () {
            var _this = this;
            this.enabledMultitouch(false);
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
        Boot.prototype.enabledMultitouch = function (value) {
            if (value) {
                this.game.input.maxPointers = 2;
                this.game.input.addPointer();
                this.game.input.addPointer();
            }
            else {
                this.game.input.maxPointers = 1;
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
                _this._play.inputEnabled = false;
            });
            this._play.x = 145;
            this._play.y = 380;
            this._bg.addChild(this._play);
        };
        return MainMenu;
    })(Phaser.State);
    TProject.MainMenu = MainMenu;
})(TProject || (TProject = {}));
