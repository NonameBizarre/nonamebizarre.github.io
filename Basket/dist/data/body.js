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
            var _this = this;
            _super.call(this, game, 0.0, 0.0);
            this._cb = cb;
            this._question = this.game.add.text(59.0, 110.0, "213123", { font: "Poppins", fontSize: "30px", fontWeight: "bold", fill: "#000000" });
            this.addChild(this._question);
            this._throwBtn = this.game.add.sprite(this.game.world.centerX + 75, 140.0 + this.game.height - 250, "ball_throw");
            this._throwText = this.game.add.text(this._throwBtn.width / 2, this._throwBtn.height / 2, "Throw", { font: "Poppins", fontSize: "30px", fontWeight: "bold", fill: "#FFFFFF" });
            this._throwText.anchor.set(0.5);
            this._throwBtn.addChild(this._throwText);
            this._throwBtn.inputEnabled = true;
            this._throwBtn.events.onInputOver.add(function () {
                _this._throwText.fill = "#FFEB3B";
            }, this);
            this._throwBtn.events.onInputUp.add(this.submit, this);
            this._throwBtn.events.onInputOut.add(function () {
                _this._throwText.fill = "#FFFFFF";
            });
            this.addChild(this._throwBtn);
            this.addText();
        }
        GameUI.prototype.setQuestion = function (question) {
            this._question.setText(question);
            TProject._.log(question);
        };
        // обработка нажатия на "throw"
        GameUI.prototype.submit = function () {
            var value = this._answer.text._text;
            if (value == "") {
                return;
            }
            if (this._cb) {
                this._cb(value);
            }
            this._answer.setText("");
            // тут, возможно, надо вставить всякие анимации
        };
        GameUI.prototype.addText = function () {
            this._answer = this.game.add.inputField(-110 + this.game.world.centerX, 140.0 + this.game.height - 200, {
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
            this.currentQ++;
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
            this._bg = this.game.add.sprite(0, 0, "bg");
            this._pasrsingText = new TProject.ParsingText(this.game);
            this._gameUI = new TProject.GameUI(this.game, this.onThrow.bind(this));
            this.game.stage.addChild(this._gameUI);
            this.myinit();
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
            if (this._pasrsingText.getCurrentA() == answer) {
                TProject._.log("correct answer");
            }
            else {
                TProject._.log("wrong answer " + this._pasrsingText.getCurrentA() + " : " + answer);
            }
            // устанвливаем новый вопрос
            this._pasrsingText.nextQuestion();
            this._gameUI.setQuestion(this._pasrsingText.getCurrentQ());
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
            //Spine
            this.game.load.spine("idleLeft", "assets/images/idleLeft.json");
            //
            this.game.load.text('questions', 'assets/questions.txt');
            //Загружаем звуки
            //this.game.load.audiosprite("sfx", ["assets/sounds/sfx.mp3","assets/sounds/sfx.ogg"], "assets/sounds/sfx.json");
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
                // Config.audio = this.game.add.audioSprite("sfx");
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
