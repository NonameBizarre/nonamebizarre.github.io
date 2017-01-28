var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var attackButtons = (function (_super) {
        __extends(attackButtons, _super);
        function attackButtons(game, x, y) {
            _super.call(this, game, x, y, 'attackPlaneIcon');
            this.anchor.set(0.5, 0.5);
            this.scale.set(0); // = 0;
            this._btnAttack1 = new Banner.OButtonFromDragon(this.game, 'attackIcon1', this.btn1Start, this.btn1End); //this.game.add.sprite(0,0,'attackIcon1');
            this._btnAttack1.x = 5;
            this._btnAttack1.y = -50;
            //this._btnAttack1.alpha = 0;
            this._btnAttack1.scale.set(0);
            this._btnAttack1.setCBContext(this);
            this.addChild(this._btnAttack1);
            this._btnAttack2 = new Banner.OButtonFromDragon(this.game, 'attackIcon2', this.btn2Start, this.btn2End); //this.game.add.sprite(0,0,'attackIcon1');
            this._btnAttack2.x = 25;
            this._btnAttack2.y = 15;
            //this._btnAttack2.alpha = 0;
            this._btnAttack2.scale.set(0);
            this._btnAttack2.setCBContext(this);
            this.addChild(this._btnAttack2);
            this._btnAttack3 = new Banner.OButtonFromDragon(this.game, 'attackIcon3', this.btn3Start, this.btn3End); //this.game.add.sprite(0,0,'attackIcon1');
            this._btnAttack3.x = 5;
            this._btnAttack3.y = 80;
            //this._btnAttack3.alpha = 0;
            this._btnAttack3.scale.set(0);
            this._btnAttack3.setCBContext(this);
            this.addChild(this._btnAttack3);
            this._dragNdropObject = new Banner.dragNdropObject(this.game, 0, 0);
            this.addChild(this._dragNdropObject);
            this.startTween();
        }
        attackButtons.prototype.startTween = function () {
            this.game.add.tween(this.scale).to({ x: [this.scale.x, 1], y: [this.scale.y, 1] }, 250, Phaser.Easing.Back.Out, true, 100);
            this.game.add.tween(this._btnAttack1.scale).to({ x: [this._btnAttack1.scale.x, 1], y: [this._btnAttack1.scale.y, 1] }, 250, Phaser.Easing.Back.Out, true, 100);
            this.game.add.tween(this._btnAttack2.scale).to({ x: [this._btnAttack2.scale.x, 1], y: [this._btnAttack2.scale.y, 1] }, 250, Phaser.Easing.Back.Out, true, 100);
            this.game.add.tween(this._btnAttack3.scale).to({ x: [this._btnAttack3.scale.x, 1], y: [this._btnAttack3.scale.y, 1] }, 250, Phaser.Easing.Back.Out, true, 100);
        };
        attackButtons.prototype.btn1Start = function () {
            console.log('StartDrop');
            //Объекту, который драгндропится задаём тексутру кнопки и альфу 1
            this._dragNdropObject.showSprite('attackIcon1');
        };
        attackButtons.prototype.btn1End = function () {
            console.log('EndDrop');
            //Проверяем, куда положили объект. Если не на дракона, то убираем альфу драгндроп-объекта
            //Если на дракона, то всё ок - убираем меню, драгндроп объетка и показываем шкалу атаки 
            this._dragNdropObject.hideSprite();
        };
        attackButtons.prototype.btn2Start = function () {
            //this._btnAttack1.loadTexture('attackIcon2');
            this._dragNdropObject.showSprite('attackIcon2');
        };
        attackButtons.prototype.btn2End = function () {
            //this._btnAttack1.loadTexture('attackIcon2');
            this._dragNdropObject.hideSprite();
        };
        attackButtons.prototype.btn3Start = function () {
            //this._btnAttack1.loadTexture('attackIcon2');
            this._dragNdropObject.showSprite('attackIcon3');
        };
        attackButtons.prototype.btn3End = function () {
            //this._btnAttack1.loadTexture('attackIcon2');
            this._dragNdropObject.hideSprite();
        };
        return attackButtons;
    })(Phaser.Sprite);
    Banner.attackButtons = attackButtons;
})(Banner || (Banner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var attackPlank = (function (_super) {
        __extends(attackPlank, _super);
        function attackPlank(game, x, y) {
            _super.call(this, game, x, y, 'testDragon');
            this.anchor.set(0.5, 0.5);
            console.log('FEF');
        }
        return attackPlank;
    })(Phaser.Sprite);
    Banner.attackPlank = attackPlank;
})(Banner || (Banner = {}));

var Banner;
(function (Banner) {
    var Config = (function () {
        function Config() {
        }
        Config.isLandscape = function () {
            return this.height < this.width;
        };
        Config.isDefaultLandscape = function () {
            return this.defaultHeight < this.defaultWidth;
        };
        Config.changeScale = function (game) {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            var dw = this.width;
            var dh = this.height;
            if (this.isLandscape() != this.isDefaultLandscape()) {
                dw = this.height;
                dh = this.width;
            }
            this.scale = Math.min(dw / this.defaultWidth, dh / this.defaultHeight);
            this.maxScale = Math.max(dw / this.defaultWidth, dh / this.defaultHeight) / this.scale;
            //console.log("scale", this.scale, this.isLandscape() != game.scale.isLandscape, this.isLandscape() , game.scale.isLandscape)
            this.width /= this.scale;
            this.height /= this.scale;
            game.scale.setUserScale(this.scale, this.scale, 0, 0);
            game.scale.setGameSize(this.width, this.height);
            game.world.setBounds(0, 0, this.width, this.height);
            game.scale.refresh();
        };
        Object.defineProperty(Config, "halfWidth", {
            get: function () {
                return Config.width * 0.5;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Config, "halfHeight", {
            get: function () {
                return Config.height * 0.5;
            },
            enumerable: true,
            configurable: true
        });
        Config.defaultWidth = 1024;
        Config.defaultHeight = 512;
        Config.scale = 1;
        Config.maxScale = 1;
        return Config;
    })();
    Banner.Config = Config;
})(Banner || (Banner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var attackPlank = (function (_super) {
        __extends(attackPlank, _super);
        function attackPlank(game, x, y) {
            _super.call(this, game, x, y, 'Dragon');
            //this._btnAttack1 = this.game.add.sprite(0,0,'attackIcon1');
            //this._btnAttack1.anchor.set(0.5,0.5);
            //this.addChild(this._btnAttack1);
        }
        return attackPlank;
    }(Phaser.Sprite));
    Banner.attackPlank = attackPlank;
})(Banner || (Banner = {}));
//# sourceMappingURL=attackPlank.js.map
var Banner;
(function (Banner) {
    var Config = (function () {
        function Config() {
        }
        Config.isLandscape = function () {
            return this.height < this.width;
        };
        Config.isDefaultLandscape = function () {
            return this.defaultHeight < this.defaultWidth;
        };
        Config.changeScale = function (game) {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            var dw = this.width;
            var dh = this.height;
            if (this.isLandscape() != this.isDefaultLandscape()) {
                dw = this.height;
                dh = this.width;
            }
            this.scale = Math.min(dw / this.defaultWidth, dh / this.defaultHeight);
            this.maxScale = Math.max(dw / this.defaultWidth, dh / this.defaultHeight) / this.scale;
            //console.log("scale", this.scale, this.isLandscape() != game.scale.isLandscape, this.isLandscape() , game.scale.isLandscape)
            this.width /= this.scale;
            this.height /= this.scale;
            game.scale.setUserScale(this.scale, this.scale, 0, 0);
            game.scale.setGameSize(this.width, this.height);
            game.world.setBounds(0, 0, this.width, this.height);
            game.scale.refresh();
        };
        Object.defineProperty(Config, "halfWidth", {
            get: function () {
                return Config.width * 0.5;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Config, "halfHeight", {
            get: function () {
                return Config.height * 0.5;
            },
            enumerable: true,
            configurable: true
        });
        Config.defaultWidth = 1024;
        Config.defaultHeight = 512;
        Config.scale = 1;
        Config.maxScale = 1;
        return Config;
    }());
    Banner.Config = Config;
})(Banner || (Banner = {}));
//# sourceMappingURL=config.js.map
var Banner;
(function (Banner) {
    var Main = (function () {
        function Main() {
            this.game = new Phaser.Game(Banner.Config.defaultWidth, Banner.Config.defaultHeight, Phaser.AUTO, 'banner', null, false);
            Banner.Config.globalEvents = new Banner.OEventDispatcher();
            this.game.state.add('Boot', Banner.Boot, true);
            this.game.state.add('Body', Banner.Body);
        }
        return Main;
    }());
    Banner.Main = Main;
})(Banner || (Banner = {}));
window.onload = function () {
    var game = new Banner.Main();
    console.log("Load");
    setTimeout("window.scrollTo(0, 1)", 10);
};
//# sourceMappingURL=main.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
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
            //this.onInputOverHandler.add(this.over, this);
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
            console.log("OVER");
        };
        OButton.prototype.out = function () {
            if (!this._isDown) {
                this.scale.set(this._defaultScale);
            }
            this._isOver = false;
        };
        OButton.prototype.up = function () {
            var _this = this;
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
    }(Phaser.Button));
    Banner.OButton = OButton;
})(Banner || (Banner = {}));
//# sourceMappingURL=OButton.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
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
    }(Phaser.Button));
    Banner.OButtonCheck = OButtonCheck;
})(Banner || (Banner = {}));
//# sourceMappingURL=OButtonCheck.js.map
var Banner;
(function (Banner) {
    var OEvent = (function () {
        function OEvent(name, cb, useCapture) {
            if (useCapture === void 0) { useCapture = false; }
            this.name = name;
            this.cb = cb;
            this.useCapture = useCapture;
        }
        return OEvent;
    }());
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
    }());
    Banner.OEventDispatcher = OEventDispatcher;
})(Banner || (Banner = {}));
//# sourceMappingURL=OEventDispatcher.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var OSprite = (function (_super) {
        __extends(OSprite, _super);
        function OSprite(game, x, y, key, frame) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            _super.call(this, game, 0, 0, key, frame);
            this.anchor.set(0.5);
            game.stage.addChild(this);
            this._landscapeScale = 1.0;
            this._portretScale = 1.0;
            this._wideMode = false;
            this._leftOffset = null;
            this._bottomOffset = null;
            this.setPortretPosition(x, y);
            this.setLandscapePosition(x, y);
            this._factory = new OFactory(game, this);
            Banner.Config.globalEvents.on("changeOrientationAndResize", this.changeOrientation.bind(this), false);
            //window.addEventListener("changeOrientationAndResize", this.changeOrientation.bind(this), false)
        }
        /*
            Устанавливаем ОТНОСИТЕЛЬНУЮ позицию. На разных устройствах визуальное положение компонента
            может слегка отличаться
        */
        OSprite.prototype.setPortretPosition = function (x, y, update) {
            this._portretX = x / Banner.Config.defaultWidth;
            this._portretY = y / Banner.Config.defaultHeight;
            this._leftOffset = null;
            if (update) {
                this.changeOrientation();
            }
        };
        OSprite.prototype.setLandscapePosition = function (x, y, update) {
            this._landscapeX = x / Banner.Config.defaultHeight;
            this._landscapeY = y / Banner.Config.defaultWidth;
            this._bottomOffset = null;
            if (update) {
                this.changeOrientation();
            }
        };
        /*
            Устанавливаем сдвиги, относительно краев текущего экрана.
        */
        OSprite.prototype.setLeftOffset = function (value, update) {
            this._leftOffset = value;
            this._portretX = null;
            this._rigthOffset = null;
            if (update) {
                this.changeOrientation();
            }
        };
        OSprite.prototype.setBottomOffset = function (value, update) {
            this._bottomOffset = value;
            this._landscapeY = null;
            this._topOffset = null;
            if (update) {
                this.changeOrientation();
            }
        };
        OSprite.prototype.setRightOffset = function (value, update) {
            this._rigthOffset = value;
            this._portretX = null;
            this._leftOffset = null;
            if (update) {
                this.changeOrientation();
            }
        };
        OSprite.prototype.setTopOffset = function (value, update) {
            this._topOffset = value;
            this._landscapeY = null;
            this._bottomOffset = null;
            if (update) {
                this.changeOrientation();
            }
        };
        /*
            Можно установить дополнительные модификаторы для скейла в определенных ориентациях
        */
        OSprite.prototype.setCustomScale = function (portret, landscape, update) {
            if (portret === void 0) { portret = 1; }
            if (landscape === void 0) { landscape = 1; }
            this._portretScale = portret;
            this._landscapeScale = landscape;
            if (update) {
                this.changeOrientation();
            }
        };
        OSprite.prototype.getCustomScale = function () {
            if (Banner.Config.isLandscape()) {
                return this._landscapeScale;
            }
            else {
                return this._portretScale;
            }
        };
        /*
            Общий скейл выбирается, как наименьшее среди частных соответствующих компонент размера текущего экрана и дефолтных.
            Эта опция позволяет для отдельно взятого спрайта устанавить такой скейл, будто бы выбирается максимальные значения.
            Имеет смысл применять только для тех вещей, которые растягиваются на весь экран.
        */
        OSprite.prototype.setWideMode = function (value, update) {
            this._wideMode = value;
            if (update) {
                this.changeOrientation();
            }
        };
        /*
            А тут творится магия.
        */
        OSprite.prototype.changeOrientation = function () {
            var coef = 1;
            if (this._wideMode) {
                coef = Banner.Config.maxScale;
            }
            var offsetX = this._leftOffset;
            if (this._rigthOffset)
                offsetX = this._rigthOffset + Banner.Config.width;
            var offsetY = this._topOffset;
            if (this._bottomOffset)
                offsetY = this._bottomOffset + Banner.Config.height;
            if (Banner.Config.isLandscape()) {
                this.x = offsetX ? offsetX : (Banner.Config.width * this._landscapeX);
                this.y = offsetY ? offsetY : (Banner.Config.height * this._landscapeY);
                this.scale.x = this.scale.y = this._landscapeScale * coef;
            }
            else {
                this.x = offsetX ? offsetX : (Banner.Config.width * this._portretX);
                this.y = offsetY ? offsetY : (Banner.Config.height * this._portretY);
                this.scale.x = this.scale.y = this._portretScale * coef;
            }
            //this.anchor.set(0.5);
        };
        OSprite.prototype.add = function () {
            return this._factory;
        };
        return OSprite;
    }(Phaser.Sprite));
    Banner.OSprite = OSprite;
    var OFactory = (function () {
        function OFactory(game, sprite) {
            this._game = game;
            this._parent = sprite;
        }
        OFactory.prototype.button = function (key, frame, cb) {
            var btn = new Banner.OButton(this._game, key, frame, cb);
            this._parent.addChild(btn);
            return btn;
        };
        return OFactory;
    }());
})(Banner || (Banner = {}));
//# sourceMappingURL=OSprite.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var OSpritePortret = (function (_super) {
        __extends(OSpritePortret, _super);
        function OSpritePortret(game, colorbg, alphabg) {
            _super.call(this, game, 0, 0);
            this.anchor.set(0.5);
            game.stage.addChild(this);
            if (colorbg) {
                this.setBackGround(colorbg, alphabg);
            }
            this.changeOrientation();
            Banner.Config.globalEvents.on("changeOrientationAndResize", this.changeOrientation.bind(this), false);
        }
        OSpritePortret.prototype.setBackGround = function (color, alpha) {
            alpha = alpha ? alpha : 1;
            var bg = this.game.add.graphics(0, 0);
            bg.beginFill(color, alpha);
            bg.drawRect(-Banner.Config.defaultWidth * 0.5, -Banner.Config.defaultHeight * 0.5, Banner.Config.defaultWidth, Banner.Config.defaultHeight);
            bg.endFill();
            this.addChild(bg);
        };
        OSpritePortret.prototype.onMask = function () {
            this._mask = this.game.add.graphics(0, 0);
            this._mask.beginFill(0, 1.0);
            this._mask.drawRect(-Banner.Config.defaultWidth * 0.5, -Banner.Config.defaultHeight * 0.5, Banner.Config.defaultWidth, Banner.Config.defaultHeight);
            this._mask.endFill();
            this.mask = this._mask;
            this.changeOrientation();
        };
        OSpritePortret.prototype.changeOrientation = function () {
            var scale = Math.min(Banner.Config.width / Banner.Config.defaultWidth, Banner.Config.height / Banner.Config.defaultHeight);
            this.x = Banner.Config.width * 0.5;
            this.y = Banner.Config.height * 0.5;
            if (this._mask) {
                this._mask.x = this.x;
                this._mask.y = this.y;
                this._mask.scale.x = this._mask.scale.y = scale;
            }
            this.scale.x = this.scale.y = scale;
        };
        return OSpritePortret;
    }(Phaser.Sprite));
    Banner.OSpritePortret = OSpritePortret;
})(Banner || (Banner = {}));
//# sourceMappingURL=OSpritePortret.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var playerDragon = (function (_super) {
        __extends(playerDragon, _super);
        function playerDragon(game, x, y) {
            _super.call(this, game, x, y, 'Dragon');
        }
        return playerDragon;
    }(Phaser.Sprite));
    Banner.playerDragon = playerDragon;
})(Banner || (Banner = {}));
//# sourceMappingURL=playerDragon.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var Body = (function (_super) {
        __extends(Body, _super);
        function Body() {
            _super.apply(this, arguments);
        }
        Body.prototype.create = function () {
            this._bg = this.game.add.sprite(Banner.Config.halfWidth, Banner.Config.halfHeight, "bg");
            this._bg.anchor.set(0.5, 0.5);
            this._dragon = new Banner.playerDragon(this.game, -350, 50);
            this._dragon.anchor.set(0.5, 0.5);
            this._bg.addChild(this._dragon);
            //this._attackPlank = new attackPlank(this.game,-120,40);
            //this._attackPlank.anchor.set(0.5,0.5);
            //this._bg.addChild(this._attackPlank);
            Banner.Config.globalEvents.on("changeOrientationAndResize", this.changeOrientation.bind(this), false);
            this.changeOrientation();
        };
        Body.prototype.changeOrientation = function () {
            var maxScale = Math.max(Banner.Config.width / Banner.Config.defaultWidth, Banner.Config.height / Banner.Config.defaultHeight);
            this._bg.x = Banner.Config.width * 0.5;
            this._bg.y = Banner.Config.height * 0.5;
            this._bg.scale.set(maxScale);
        };
        return Body;
    }(Phaser.State));
    Banner.Body = Body;
})(Banner || (Banner = {}));
//# sourceMappingURL=Body.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.game.load.image("bg", "assets/bg.png");
            //Графон. Полутестовый.
            this.game.load.image("Dragon", "assets/testDragon.png");
            this.game.load.image("Arm", "assets/testArm.png");
            this.game.load.image("Arrow", "assets/testArrow.png");
            this.game.load.image("attackIcon1", "assets/attackIcon1.png");
            this.game.load.image("attackIcon2", "assets/attackIcon2.png");
            this.game.load.image("attackIcon3", "assets/attackIcon3.png");
            this.game.load.image("attackPlaneIcon", "assets/attackPlaneIcon.png");
            this.game.load.image("attackPlank_empty", "assets/attackPlank_empty.png");
            this.game.load.image("attackPlank_green", "assets/attackPlank_green.png");
            this.game.load.image("attackPlank_red", "assets/attackPlank_red.png");
            this.game.load.image("livePlank_empty", "assets/livePlank_empty.png");
            this.game.load.image("livePlank_ginger", "assets/livePlank_ginger.png");
            this.game.load.image("livePlank_green", "assets/livePlank_green.png");
        };
        Boot.prototype.create = function () {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            window.addEventListener("resize", this.changeOrientation.bind(this), false);
            this.game.scale.onOrientationChange.add(this.changeOrientation, this);
            this.changeOrientation();
            this.game.state.start('Body', true);
        };
        Boot.prototype.changeOrientation = function () {
            Banner.Config.changeScale(this.game);
            Banner.Config.globalEvents.dispatch('changeOrientationAndResize');
        };
        return Boot;
    }(Phaser.State));
    Banner.Boot = Boot;
})(Banner || (Banner = {}));
//# sourceMappingURL=Boot.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var dragNdropObject = (function (_super) {
        __extends(dragNdropObject, _super);
        function dragNdropObject(game, x, y) {
            _super.call(this, game, x, y, 'attackIcon1');
            this.anchor.set(0.5, 0.5);
            this.alpha = 0;
        }
        dragNdropObject.prototype.showSprite = function (key) {
            this.alpha = 1;
            this.loadTexture(key);
        };
        dragNdropObject.prototype.hideSprite = function () {
            this.alpha = 0;
        };
        return dragNdropObject;
    })(Phaser.Sprite);
    Banner.dragNdropObject = dragNdropObject;
})(Banner || (Banner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var AttackButtons = (function (_super) {
        __extends(AttackButtons, _super);
        function AttackButtons(game, x, y) {
            _super.call(this, game, x, y, 'attackPlaneIcon');
            this.anchor.set(0.5, 0.5);
            this.scale.set(0); // = 0;
            this._btnAttack1 = new Banner.OButtonFromDragon(this.game, 'attackIcon1', this.btn1Start, this.btn1End); //this.game.add.sprite(0,0,'attackIcon1');
            this._btnAttack1.x = 5;
            this._btnAttack1.y = -50;
            //this._btnAttack1.alpha = 0;
            this._btnAttack1.scale.set(0);
            this._btnAttack1.setCBContext(this);
            this.addChild(this._btnAttack1);
            this._btnAttack2 = new Banner.OButtonFromDragon(this.game, 'attackIcon2', this.btn2Start, this.btn2End); //this.game.add.sprite(0,0,'attackIcon1');
            this._btnAttack2.x = 25;
            this._btnAttack2.y = 15;
            //this._btnAttack2.alpha = 0;
            this._btnAttack2.scale.set(0);
            this._btnAttack2.setCBContext(this);
            this.addChild(this._btnAttack2);
            this._btnAttack3 = new Banner.OButtonFromDragon(this.game, 'attackIcon3', this.btn3Start, this.btn3End); //this.game.add.sprite(0,0,'attackIcon1');
            this._btnAttack3.x = 5;
            this._btnAttack3.y = 80;
            //this._btnAttack3.alpha = 0;
            this._btnAttack3.scale.set(0);
            this._btnAttack3.setCBContext(this);
            this.addChild(this._btnAttack3);
            this._dragNdropObject = new Banner.DragNdropObject(this.game, 0, 0);
            this.addChild(this._dragNdropObject);
            this.startTween();
        }
        AttackButtons.prototype.startTween = function () {
            this.game.add.tween(this.scale).to({ x: [this.scale.x, 1], y: [this.scale.y, 1] }, 250, Phaser.Easing.Back.Out, true, 100);
            this.game.add.tween(this._btnAttack1.scale).to({ x: [this._btnAttack1.scale.x, 1], y: [this._btnAttack1.scale.y, 1] }, 250, Phaser.Easing.Back.Out, true, 100);
            this.game.add.tween(this._btnAttack2.scale).to({ x: [this._btnAttack2.scale.x, 1], y: [this._btnAttack2.scale.y, 1] }, 250, Phaser.Easing.Back.Out, true, 100);
            this.game.add.tween(this._btnAttack3.scale).to({ x: [this._btnAttack3.scale.x, 1], y: [this._btnAttack3.scale.y, 1] }, 250, Phaser.Easing.Back.Out, true, 100);
        };
        AttackButtons.prototype.btn1Start = function () {
            console.log('StartDrop');
            //Объекту, который драгндропится задаём тексутру кнопки и альфу 1
            this._dragNdropObject.showSprite('attackIcon1');
        };
        AttackButtons.prototype.btn1End = function () {
            console.log('EndDrop');
            //Проверяем, куда положили объект. Если не на дракона, то убираем альфу драгндроп-объекта
            //Если на дракона, то всё ок - убираем меню, драгндроп объетка и показываем шкалу атаки 
            this._dragNdropObject.hideSprite();
        };
        AttackButtons.prototype.btn2Start = function () {
            //this._btnAttack1.loadTexture('attackIcon2');
            this._dragNdropObject.showSprite('attackIcon2');
        };
        AttackButtons.prototype.btn2End = function () {
            //this._btnAttack1.loadTexture('attackIcon2');
            this._dragNdropObject.hideSprite();
        };
        AttackButtons.prototype.btn3Start = function () {
            //this._btnAttack1.loadTexture('attackIcon2');
            this._dragNdropObject.showSprite('attackIcon3');
        };
        AttackButtons.prototype.btn3End = function () {
            //this._btnAttack1.loadTexture('attackIcon2');
            this._dragNdropObject.hideSprite();
        };
        return AttackButtons;
    })(Phaser.Sprite);
    Banner.AttackButtons = AttackButtons;
})(Banner || (Banner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var DragNdropObject = (function (_super) {
        __extends(DragNdropObject, _super);
        function DragNdropObject(game, x, y) {
            _super.call(this, game, x, y, 'attackIcon1');
            this.anchor.set(0.5, 0.5);
            this.alpha = 0;
            this._parEmitter = this.game.add.emitter(this.x, this.y, 20);
        }
        DragNdropObject.prototype.showSprite = function (key) {
            this.alpha = 1;
            this.loadTexture(key);
        };
        DragNdropObject.prototype.hideSprite = function () {
            this.alpha = 0;
        };
        DragNdropObject.prototype.update = function () {
            //Вот тут обновляем позицию когда альфа 1
        };
        return DragNdropObject;
    })(Phaser.Sprite);
    Banner.DragNdropObject = DragNdropObject;
})(Banner || (Banner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var HpPlank = (function (_super) {
        __extends(HpPlank, _super);
        function HpPlank(game, x, y) {
            _super.call(this, game, x, y, 'livePlank_empty');
            this.anchor.set(0.5, 0.5);
        }
        return HpPlank;
    })(Phaser.Sprite);
    Banner.HpPlank = HpPlank;
})(Banner || (Banner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var PlayerDragon = (function (_super) {
        __extends(PlayerDragon, _super);
        function PlayerDragon(game, x, y) {
            _super.call(this, game, x, y, 'testDragon');
            this.anchor.set(0.5, 0.5);
            this._attackRound = 0;
            this._gameMode = "null";
            this._blockGame = false;
            //this._attackPlank = new AttackButtons(this.game,220,0);  
            //this.addChild(this._attackPlank);
            // Вот тут панель для кнопок атаки
            this._buttonAttackPanel = this.game.add.sprite(0, 0);
            this._buttonAttackPanel.scale.set(0);
            this.addChild(this._buttonAttackPanel);
            this._btnOne = new VAttackBut(game, 225, -50, "attackIcon1", this);
            this._buttonAttackPanel.addChild(this._btnOne);
            this._btnOne.scale.set(0);
            this._btnTwo = new VAttackBut(game, 245, 15, "attackIcon2", this);
            this._buttonAttackPanel.addChild(this._btnTwo);
            this._btnTwo.scale.set(0);
            this._btnThree = new VAttackBut(game, 225, 80, "attackIcon3", this);
            this._buttonAttackPanel.addChild(this._btnThree);
            this._btnThree.scale.set(0);
            this._btnOne.enabled = false;
            this._btnTwo.enabled = false;
            this._btnThree.enabled = false;
            // вот тут для других панелей место
            // ...
            this._progressAttackPanel = this.game.add.sprite(225, 0, "attackPlank_phase1");
            this._progressAttackPanel.anchor.set(0.5);
            this.addChild(this._progressAttackPanel);
            this._proAttPanStartX = this._progressAttackPanel.x;
            this._proAttPanStartY = this._progressAttackPanel.y;
            this._progressAttackPanel.visible = false;
            this._arg = 0;
            var radius = -200;
            this._arrow = game.add.image(radius - 50, 0, "testArrow");
            this._arrow.pivot.x = radius;
            this._progressAttackPanel.addChild(this._arrow);
            this._criticalAttack = false; // Если стрелка попала в ограничения
            this.game.input.onDown.add(this.onDownAttack, this);
            this._attackHelper = this.game.add.sprite(214, -29, "testArm");
            this._attackHelper.anchor.set(0.5);
            this._attackHelper.scale.set(1.8);
            this._attackHelper.alpha = 0;
            this.addChild(this._attackHelper);
            this._attackHelperActive = true;
            //Рука-помощник
            //Курсор нажимает на кнопку: x: 214, y:-29
            //Зелёные области
            //Первая итерация
            //Нижняя граница -0.060284060923254223
            //Верхняя граница -0.3381627507134902
            //Вторая итерация
            //Нижняя граница -0.18063722692808337
            //Верхняя граница -0.3045979556594794
            this.changeGameMode("attackBtnPanel");
        }
        PlayerDragon.prototype.update = function () {
            switch (this._gameMode) {
                case "progressAtackPanel":
                    if (this._blockGame) {
                        if (this._criticalAttack) {
                            var min = -4;
                            var max = 4;
                            this._progressAttackPanel.x += Math.floor(Math.random() * (max - min + 1)) + min;
                            this._progressAttackPanel.y += Math.floor(Math.random() * (max - min + 1)) + min;
                        }
                    }
                    else {
                        this._arrow.rotation = Math.sin(this._arg += 0.03) * 0.45 - 0.07;
                    }
                    break;
            }
        };
        PlayerDragon.prototype.onDownAttack = function () {
            if (this._gameMode == "progressAtackPanel" && !this._blockGame) {
                switch (this._attackRound) {
                    case 0:
                        if (this._arrow.rotation >= -0.3381627507134902 && this._arrow.rotation <= -0.060284060923254223) {
                            this._criticalAttack = true; // попали в зелёную!
                        }
                        break;
                    case 1:
                        if (this._arrow.rotation >= -0.3045979556594794 && this._arrow.rotation <= -0.18063722692808337) {
                            this._criticalAttack = true; // попали в зелёную!
                        }
                        break;
                }
                this.preEndTweenProgressPanel();
            }
        };
        PlayerDragon.prototype.refreshAttackButton = function (btn) {
            this._buttonAttackPanel.removeChild(btn);
            this._buttonAttackPanel.addChild(btn);
            if (this._attackHelperActive) {
                this._attackHelperActive = false;
                this.game.tweens.remove(this._tween);
                this._attackHelper.alpha = 0;
            }
        };
        PlayerDragon.prototype.hideAttackButons = function () {
            //this._buttonAttackPanel.visible = false;
            this._btnOne.enabled = false;
            this._btnTwo.enabled = false;
            this._btnThree.enabled = false;
            this._buttonAttackPanel.scale.set(0);
            this._btnOne.scale.set(0);
            this._btnTwo.scale.set(0);
            this._btnThree.scale.set(0);
            this._progressAttackPanel.visible = true;
        };
        PlayerDragon.prototype.changeGameMode = function (mode) {
            switch (mode) {
                case "attackBtnPanel":
                    this._gameMode = "attackBtnPanel";
                    this._blockGame = true;
                    this.startTweenAttackPanel();
                    break;
                case "progressAtackPanel":
                    this._gameMode = "progressAtackPanel";
                    this._blockGame = true;
                    this.hideAttackButons();
                    console.log(this._progressAttackPanel.alpha);
                    this.startTweenProgressPanel();
                    break;
                case "enemyAttack":
                    this._gameMode = "enemyAttack";
                    this._blockGame = true;
                    console.log("ВрагАтакует!");
                    this.changeGameMode("attackBtnPanel");
                    break;
            }
        };
        //Анимация для панели с заклинаниями
        PlayerDragon.prototype.startTweenAttackPanel = function () {
            if (this._blockGame) {
                this.game.add.tween(this._buttonAttackPanel.scale).to({ x: 1, y: 1 }, 330, Phaser.Easing.Elastic.Out, true, 100).onComplete.add(this.endTweenAttackPanel, this);
                this.game.add.tween(this._btnOne.scale).to({ x: 1, y: 1 }, 330, Phaser.Easing.Elastic.Out, true, 100);
                this.game.add.tween(this._btnTwo.scale).to({ x: 1, y: 1 }, 330, Phaser.Easing.Elastic.Out, true, 100);
                this.game.add.tween(this._btnThree.scale).to({ x: 1, y: 1 }, 330, Phaser.Easing.Elastic.Out, true, 100);
                this._blockGame = false;
            }
        };
        PlayerDragon.prototype.endTweenAttackPanel = function () {
            this._btnOne.enabled = true;
            this._btnTwo.enabled = true;
            this._btnThree.enabled = true;
            this.showArmHelper();
        };
        // Анимация для руки-помощника
        PlayerDragon.prototype.showArmHelper = function () {
            if (this._attackHelperActive) {
                this._attackHelper.alpha = 1;
                this.game.add.tween(this._attackHelper.scale).to({ x: 1, y: 1 }, 640, Phaser.Easing.Elastic.Out, true).onComplete.add(this.startMoveArmHelper, this);
            }
        };
        PlayerDragon.prototype.startMoveArmHelper = function () {
            if (this._attackHelperActive) {
                this.game.add.tween(this._attackHelper).to({ x: [this._attackHelper.x, this._attackHelper.x + 320, this._attackHelper.x + 520], y: [this._attackHelper.y, this._attackHelper.y - 60, this._attackHelper.y] }, 850, Phaser.Easing.Linear.None, true, 100).interpolation(function (v, k) { return Phaser.Math.catmullRomInterpolation(v, k); }).onComplete.add(this.endMoveArmHepler, this);
                this._tween = this.game.add.tween(this._attackHelper).to({ alpha: 0 }, 200, Phaser.Easing.Sinusoidal.Out, true, 750);
            }
        };
        PlayerDragon.prototype.endMoveArmHepler = function () {
            if (this._attackHelperActive) {
                this._tween = this.game.add.tween(this._attackHelper).to({ alpha: 0 }, 50, Phaser.Easing.Sinusoidal.Out, true, 550);
                this._tween.onComplete.add(this.showArmHelper, this);
                this._attackHelper.x = 214;
                this._attackHelper.y = -29;
                this._attackHelper.scale.set(1.8);
            }
        };
        //Анимация для атакующей панели
        PlayerDragon.prototype.startTweenProgressPanel = function () {
            this._blockGame = false;
            //this.game.add.tween(this._progressAttackPanel.scale).to({x:1,y:1},430,Phaser.Easing.Sinusoidal.Out,true,100).onComplete.add(this.preEndTweenProgressPanel,this);    
            //this.game.input inputEnabled = true;        
        };
        PlayerDragon.prototype.preEndTweenProgressPanel = function () {
            this._blockGame = true;
            var curDellay;
            if (this._criticalAttack) {
                curDellay = 200;
            }
            else {
                curDellay = 0;
            }
            this.game.add.tween(this._progressAttackPanel.scale).to({ x: 1.5, y: 1.5 }, 640, Phaser.Easing.Sinusoidal.Out, true, curDellay).onComplete.add(this.endTweenProgressPanel, this);
            this.game.add.tween(this._progressAttackPanel).to({ alpha: 0 }, 630, Phaser.Easing.Sinusoidal.Out, true, curDellay);
        };
        PlayerDragon.prototype.endTweenProgressPanel = function () {
            this._progressAttackPanel.x = this._proAttPanStartX;
            this._progressAttackPanel.y = this._proAttPanStartY;
            this._progressAttackPanel.visible = false;
            this._progressAttackPanel.scale.set(1);
            this._progressAttackPanel.alpha = 1;
            this._criticalAttack = false;
            this._progressAttackPanel.loadTexture("attackPlank_phase2");
            this._attackRound += 1;
            this._arg = 0;
            this.changeGameMode("enemyAttack");
        };
        return PlayerDragon;
    })(Phaser.Sprite);
    Banner.PlayerDragon = PlayerDragon;
    // классы которые нахуй никому не нужны, потому мы их просто набрасываем вниз и не экспортим
    var VAttackBut = (function (_super) {
        __extends(VAttackBut, _super);
        //private _parEmitter: any;
        function VAttackBut(game, x, y, iconPic, dragon) {
            if (iconPic === void 0) { iconPic = "attackIcon1"; }
            _super.call(this, game, x, y);
            this._dragon = dragon;
            this._bg = game.add.image(0, 0, "attackIconEmpty");
            this._bg.anchor.set(0.5, 0.5);
            this._bg.alpha = 0;
            this._icon = game.add.image(0, 0, iconPic);
            this._icon.anchor.set(0.5, 0.5);
            //this._parEmitter = this.game.add.emitter(this._icon.x,this._icon.y,20);
            //this._parEmitter.gravity = 200;
            //this._parEmitter.makeParticles('fx_sparks2');
            //this.addChild(this._parEmitter);
            this.enabled = true;
            this._icon.events.onInputOver.add(this.over, this);
            this._icon.events.onInputOut.add(this.out, this);
            this._icon.events.onInputDown.add(this.down, this);
            this._icon.events.onDragStop.add(this.dragStop, this);
            this._icon.events.onDragUpdate.add(this.dragUpdate, this);
            this.addChild(this._bg);
            this.addChild(this._icon);
        }
        VAttackBut.prototype.over = function () {
            this._icon.scale.set(1.1);
        };
        VAttackBut.prototype.out = function () {
            this._icon.scale.set(1.0);
        };
        VAttackBut.prototype.down = function () {
            this._icon.scale.set(0.9);
            this._bg.alpha = 1;
            this._dragon.refreshAttackButton(this);
        };
        VAttackBut.prototype.checkHit = function (x) {
            return x > Banner.Config.width * 0.6;
        };
        VAttackBut.prototype.dragUpdate = function (sprite, pointer, dragX, dragY, snapPoin) {
            // Тут мы подсвечиваем атаку, если это необходимо. Можешь поменять на хитбокс врага
            if (this.checkHit(pointer.x)) {
                this._icon.alpha = 0.5;
                this._icon.scale.set(1.3);
            }
            else {
                this._icon.alpha = 1;
                this._icon.scale.set(0.9);
            }
            //this._parEmitter.x = this._icon.x;
            //this._parEmitter.y = this._icon.y;                
            //if(this._parEmitter.length <= 7){
            //this._parEmitter.start(false, 500,null, 3);
            //}                
            //console.log(this._parEmitter.length)
        };
        VAttackBut.prototype.dragStop = function (sprite, pointer, dragX, dragY, snapPoin) {
            // Сбрасываем параметры и, если попадаем по врагу, то скрываем кнопки и показываем карусель
            this._icon.x = 0;
            this._icon.y = 0;
            this._icon.alpha = 1;
            this._icon.scale.set(1.0);
            this._bg.alpha = 0;
            if (this.checkHit(pointer.x)) {
                this._dragon.changeGameMode("progressAtackPanel");
            }
        };
        Object.defineProperty(VAttackBut.prototype, "enabled", {
            set: function (value) {
                this._icon.inputEnabled = value;
                if (value) {
                    this._icon.input.enableDrag();
                }
                else {
                    this._icon.input.disableDrag();
                }
            },
            enumerable: true,
            configurable: true
        });
        return VAttackBut;
    })(Phaser.Sprite);
})(Banner || (Banner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var hpPlank = (function (_super) {
        __extends(hpPlank, _super);
        function hpPlank(game, x, y) {
            _super.call(this, game, x, y, 'livePlank_empty');
            this.anchor.set(0.5, 0.5);
        }
        return hpPlank;
    })(Phaser.Sprite);
    Banner.hpPlank = hpPlank;
})(Banner || (Banner = {}));

var Banner;
(function (Banner) {
    var Main = (function () {
        function Main() {
            this.game = new Phaser.Game(Banner.Config.defaultWidth, Banner.Config.defaultHeight, Phaser.AUTO, 'banner', null, false);
            Banner.Config.globalEvents = new Banner.OEventDispatcher();
            this.game.state.add('Boot', Banner.Boot, true);
            this.game.state.add('Body', Banner.Body);
        }
        return Main;
    })();
    Banner.Main = Main;
})(Banner || (Banner = {}));
window.onload = function () {
    var game = new Banner.Main();
    console.log("Load");
    setTimeout("window.scrollTo(0, 1)", 10);
};

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
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
            //this.onInputOverHandler.add(this.over, this);
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
            console.log("OVER");
        };
        OButton.prototype.out = function () {
            if (!this._isDown) {
                this.scale.set(this._defaultScale);
            }
            this._isOver = false;
        };
        OButton.prototype.up = function () {
            var _this = this;
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
    Banner.OButton = OButton;
})(Banner || (Banner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
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
    Banner.OButtonCheck = OButtonCheck;
})(Banner || (Banner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var OButtonFromDragon = (function (_super) {
        __extends(OButtonFromDragon, _super);
        function OButtonFromDragon(game, key, onDownCB, cb) {
            if (onDownCB === void 0) { onDownCB = null; }
            if (cb === void 0) { cb = null; }
            var up = null;
            var over = null;
            var down = null;
            _super.call(this, game, 0, 0, key, null, null, null, null, null, null);
            this.soundOver = "over";
            this.soundDown = "click";
            this.anchor.setTo(0.5);
            this._cb = cb;
            this._onDownCB = onDownCB;
            this._deltaScale = 0.1;
            this._defaultScale = 1.0;
            this._isDown = false;
            this._isOver = false;
            this.onInputOver.add(this.over, this);
            this.onInputOut.add(this.out, this);
            this.onInputDown.add(this.down, this);
            this.onInputUp.add(this.up, this);
            //this.onInputOverHandler.add(this.over, this);
            this._currentKey = key;
        }
        OButtonFromDragon.prototype.setCBContext = function (cntx) {
            this._cntxt = cntx;
        };
        OButtonFromDragon.prototype.setAnimationScale = function (delta, defaultScale) {
            if (delta === void 0) { delta = 0; }
            if (defaultScale === void 0) { defaultScale = 1; }
            this._deltaScale = delta;
            this._defaultScale = defaultScale;
        };
        OButtonFromDragon.prototype.over = function () {
            if (!this._isDown) {
                this.scale.set(this._defaultScale + this._deltaScale);
            }
            this._isOver = true;
            console.log("OVER");
        };
        OButtonFromDragon.prototype.out = function () {
            if (!this._isDown) {
                this.scale.set(this._defaultScale);
            }
            this._isOver = false;
        };
        OButtonFromDragon.prototype.up = function () {
            var _this = this;
            this.scale.set(this._isOver ? this._defaultScale + this._deltaScale : this._defaultScale);
            var tap = (this.game.device.desktop ? this._isOver : this.input.pointerOver());
            if (this._isOver) {
                //this._framesString[1];
                this.loadTexture(this._currentKey);
            }
            else {
                if (tap) {
                    setTimeout(function () {
                        console.log('UpOnPlank2');
                        _this.loadTexture(_this._currentKey);
                        //Кладём объект обратно на планку. Объекту который драгндропится делаем альфу = 0
                    }, 5);
                }
                else {
                    console.log('UpOnPlank3');
                }
            }
            this._isDown = false;
            if (tap && this._cb != null) {
            }
            else {
                if (tap == false)
                    this.scale.set(this._defaultScale);
                if (this._cntxt)
                    this._cb.bind(this._cntxt)();
                else
                    this._cb();
                this.loadTexture(this._currentKey);
            }
        };
        OButtonFromDragon.prototype.down = function () {
            this.loadTexture('attackIconEmpty');
            this._isDown = true;
            if (this._cntxt)
                this._onDownCB.bind(this._cntxt)();
            else
                this._onDownCB();
        };
        OButtonFromDragon.prototype.deleteFromParent = function () {
            if (this.parent) {
                this.parent.removeChild(this);
            }
            this.onInputOver.remove(this.over, this);
            this.onInputOut.remove(this.out, this);
            this.onInputDown.remove(this.down, this);
            this.onInputUp.remove(this.up, this);
        };
        Object.defineProperty(OButtonFromDragon.prototype, "enabled", {
            set: function (value) {
                var _this = this;
                this.inputEnabled = value;
                if (!value) {
                    setTimeout(function () {
                        _this.scale.set(_this._defaultScale);
                    }, 5);
                }
            },
            enumerable: true,
            configurable: true
        });
        return OButtonFromDragon;
    })(Phaser.Button);
    Banner.OButtonFromDragon = OButtonFromDragon;
})(Banner || (Banner = {}));

var Banner;
(function (Banner) {
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
    Banner.OEventDispatcher = OEventDispatcher;
})(Banner || (Banner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var OSprite = (function (_super) {
        __extends(OSprite, _super);
        function OSprite(game, x, y, key, frame) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            _super.call(this, game, 0, 0, key, frame);
            this.anchor.set(0.5);
            game.stage.addChild(this);
            this._landscapeScale = 1.0;
            this._portretScale = 1.0;
            this._wideMode = false;
            this._leftOffset = null;
            this._bottomOffset = null;
            this.setPortretPosition(x, y);
            this.setLandscapePosition(x, y);
            this._factory = new OFactory(game, this);
            Banner.Config.globalEvents.on("changeOrientationAndResize", this.changeOrientation.bind(this), false);
            //window.addEventListener("changeOrientationAndResize", this.changeOrientation.bind(this), false)
        }
        /*
            Устанавливаем ОТНОСИТЕЛЬНУЮ позицию. На разных устройствах визуальное положение компонента
            может слегка отличаться
        */
        OSprite.prototype.setPortretPosition = function (x, y, update) {
            this._portretX = x / Banner.Config.defaultWidth;
            this._portretY = y / Banner.Config.defaultHeight;
            this._leftOffset = null;
            if (update) {
                this.changeOrientation();
            }
        };
        OSprite.prototype.setLandscapePosition = function (x, y, update) {
            this._landscapeX = x / Banner.Config.defaultHeight;
            this._landscapeY = y / Banner.Config.defaultWidth;
            this._bottomOffset = null;
            if (update) {
                this.changeOrientation();
            }
        };
        /*
            Устанавливаем сдвиги, относительно краев текущего экрана.
        */
        OSprite.prototype.setLeftOffset = function (value, update) {
            this._leftOffset = value;
            this._portretX = null;
            this._rigthOffset = null;
            if (update) {
                this.changeOrientation();
            }
        };
        OSprite.prototype.setBottomOffset = function (value, update) {
            this._bottomOffset = value;
            this._landscapeY = null;
            this._topOffset = null;
            if (update) {
                this.changeOrientation();
            }
        };
        OSprite.prototype.setRightOffset = function (value, update) {
            this._rigthOffset = value;
            this._portretX = null;
            this._leftOffset = null;
            if (update) {
                this.changeOrientation();
            }
        };
        OSprite.prototype.setTopOffset = function (value, update) {
            this._topOffset = value;
            this._landscapeY = null;
            this._bottomOffset = null;
            if (update) {
                this.changeOrientation();
            }
        };
        /*
            Можно установить дополнительные модификаторы для скейла в определенных ориентациях
        */
        OSprite.prototype.setCustomScale = function (portret, landscape, update) {
            if (portret === void 0) { portret = 1; }
            if (landscape === void 0) { landscape = 1; }
            this._portretScale = portret;
            this._landscapeScale = landscape;
            if (update) {
                this.changeOrientation();
            }
        };
        OSprite.prototype.getCustomScale = function () {
            if (Banner.Config.isLandscape()) {
                return this._landscapeScale;
            }
            else {
                return this._portretScale;
            }
        };
        /*
            Общий скейл выбирается, как наименьшее среди частных соответствующих компонент размера текущего экрана и дефолтных.
            Эта опция позволяет для отдельно взятого спрайта устанавить такой скейл, будто бы выбирается максимальные значения.
            Имеет смысл применять только для тех вещей, которые растягиваются на весь экран.
        */
        OSprite.prototype.setWideMode = function (value, update) {
            this._wideMode = value;
            if (update) {
                this.changeOrientation();
            }
        };
        /*
            А тут творится магия.
        */
        OSprite.prototype.changeOrientation = function () {
            var coef = 1;
            if (this._wideMode) {
                coef = Banner.Config.maxScale;
            }
            var offsetX = this._leftOffset;
            if (this._rigthOffset)
                offsetX = this._rigthOffset + Banner.Config.width;
            var offsetY = this._topOffset;
            if (this._bottomOffset)
                offsetY = this._bottomOffset + Banner.Config.height;
            if (Banner.Config.isLandscape()) {
                this.x = offsetX ? offsetX : (Banner.Config.width * this._landscapeX);
                this.y = offsetY ? offsetY : (Banner.Config.height * this._landscapeY);
                this.scale.x = this.scale.y = this._landscapeScale * coef;
            }
            else {
                this.x = offsetX ? offsetX : (Banner.Config.width * this._portretX);
                this.y = offsetY ? offsetY : (Banner.Config.height * this._portretY);
                this.scale.x = this.scale.y = this._portretScale * coef;
            }
            //this.anchor.set(0.5);
        };
        OSprite.prototype.add = function () {
            return this._factory;
        };
        return OSprite;
    })(Phaser.Sprite);
    Banner.OSprite = OSprite;
    var OFactory = (function () {
        function OFactory(game, sprite) {
            this._game = game;
            this._parent = sprite;
        }
        OFactory.prototype.button = function (key, frame, cb) {
            var btn = new Banner.OButton(this._game, key, frame, cb);
            this._parent.addChild(btn);
            return btn;
        };
        return OFactory;
    })();
})(Banner || (Banner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var OSpritePortret = (function (_super) {
        __extends(OSpritePortret, _super);
        function OSpritePortret(game, colorbg, alphabg) {
            _super.call(this, game, 0, 0);
            this.anchor.set(0.5);
            game.stage.addChild(this);
            if (colorbg) {
                this.setBackGround(colorbg, alphabg);
            }
            this.changeOrientation();
            Banner.Config.globalEvents.on("changeOrientationAndResize", this.changeOrientation.bind(this), false);
        }
        OSpritePortret.prototype.setBackGround = function (color, alpha) {
            alpha = alpha ? alpha : 1;
            var bg = this.game.add.graphics(0, 0);
            bg.beginFill(color, alpha);
            bg.drawRect(-Banner.Config.defaultWidth * 0.5, -Banner.Config.defaultHeight * 0.5, Banner.Config.defaultWidth, Banner.Config.defaultHeight);
            bg.endFill();
            this.addChild(bg);
        };
        OSpritePortret.prototype.onMask = function () {
            this._mask = this.game.add.graphics(0, 0);
            this._mask.beginFill(0, 1.0);
            this._mask.drawRect(-Banner.Config.defaultWidth * 0.5, -Banner.Config.defaultHeight * 0.5, Banner.Config.defaultWidth, Banner.Config.defaultHeight);
            this._mask.endFill();
            this.mask = this._mask;
            this.changeOrientation();
        };
        OSpritePortret.prototype.changeOrientation = function () {
            var scale = Math.min(Banner.Config.width / Banner.Config.defaultWidth, Banner.Config.height / Banner.Config.defaultHeight);
            this.x = Banner.Config.width * 0.5;
            this.y = Banner.Config.height * 0.5;
            if (this._mask) {
                this._mask.x = this.x;
                this._mask.y = this.y;
                this._mask.scale.x = this._mask.scale.y = scale;
            }
            this.scale.x = this.scale.y = scale;
        };
        return OSpritePortret;
    })(Phaser.Sprite);
    Banner.OSpritePortret = OSpritePortret;
})(Banner || (Banner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var playerDragon = (function (_super) {
        __extends(playerDragon, _super);
        function playerDragon(game, x, y) {
            _super.call(this, game, x, y, 'testDragon');
            this.anchor.set(0.5, 0.5);
            this._attackPlank = new Banner.attackButtons(this.game, 220, 0);
            this.addChild(this._attackPlank);
        }
        return playerDragon;
    })(Phaser.Sprite);
    Banner.playerDragon = playerDragon;
})(Banner || (Banner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var attackPlank = (function (_super) {
        __extends(attackPlank, _super);
        function attackPlank(game, x, y) {
            _super.call(this, game, x, y, 'attackPlaneIcon');
            //this._plankBase = this.game.add.sprite(0, 0, "attackPlaneIcon");
            //this._plankBase.anchor.set(0.5, 0.5);
        }
        return attackPlank;
    })(Phaser.Sprite);
    Banner.attackPlank = attackPlank;
})(Banner || (Banner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var Body = (function (_super) {
        __extends(Body, _super);
        function Body() {
            _super.apply(this, arguments);
        }
        Body.prototype.create = function () {
            this._bg = this.game.add.sprite(Banner.Config.halfWidth, Banner.Config.halfHeight, "bg");
            this._bg.anchor.set(0.5, 0.5);
            this._ospritePlayerDragon = new Banner.OSprite(this.game, 80, 300);
            this._ospritePlayerDragon.setLandscapePosition(100, 560, true);
            this._dragon = new Banner.PlayerDragon(this.game, 0, 0);
            this._ospritePlayerDragon.addChild(this._dragon);
            //this._attackPlank = new attackPlank(this.game,-120,40);            
            //this._bg.addChild(this._attackPlank);
            Banner.Config.globalEvents.on("changeOrientationAndResize", this.changeOrientation.bind(this), false);
            this.changeOrientation();
        };
        Body.prototype.update = function () {
            this._dragon.update();
        };
        Body.prototype.changeOrientation = function () {
            var maxScale = Math.max(Banner.Config.width / Banner.Config.defaultWidth, Banner.Config.height / Banner.Config.defaultHeight);
            this._bg.x = Banner.Config.width * 0.5;
            this._bg.y = Banner.Config.height * 0.5;
            this._bg.scale.set(maxScale);
        };
        return Body;
    })(Phaser.State);
    Banner.Body = Body;
})(Banner || (Banner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.game.load.image("bg", "assets/bg.png");
            //Графон. Полутестовый.
            this.game.load.image("testDragon", "assets/testDragon.png");
            this.game.load.image("testArm", "assets/testArm.png");
            this.game.load.image("testArrow", "assets/testArrow.png");
            this.game.load.image("attackIcon1", "assets/attackIcon1.png");
            this.game.load.image("attackIcon2", "assets/attackIcon2.png");
            this.game.load.image("attackIcon3", "assets/attackIcon3.png");
            this.game.load.image("attackIconEmpty", "assets/attackIconEmpty.png");
            this.game.load.image("attackPlaneIcon", "assets/attackPlaneIcon.png");
            this.game.load.image("attackPlank_phase1", "assets/attackPlank_phase1.png");
            this.game.load.image("attackPlank_phase2", "assets/attackPlank_phase2.png");
            //this.game.load.image("attackPlank_empty", "assets/attackPlank_empty.png")
            // this.game.load.image("attackPlank_green", "assets/attackPlank_green.png")
            //this.game.load.image("attackPlank_red", "assets/attackPlank_red.png")fx_sparks2
            this.game.load.image("fx_sparks2", "assets/fx_sparks2.png");
            this.game.load.image("livePlank_empty", "assets/livePlank_empty.png");
            this.game.load.image("livePlank_ginger", "assets/livePlank_ginger.png");
            this.game.load.image("livePlank_green", "assets/livePlank_green.png");
        };
        Boot.prototype.create = function () {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            window.addEventListener("resize", this.changeOrientation.bind(this), false);
            this.game.scale.onOrientationChange.add(this.changeOrientation, this);
            this.changeOrientation();
            this.game.state.start('Body', true);
        };
        Boot.prototype.changeOrientation = function () {
            Banner.Config.changeScale(this.game);
            Banner.Config.globalEvents.dispatch('changeOrientationAndResize');
        };
        return Boot;
    })(Phaser.State);
    Banner.Boot = Boot;
})(Banner || (Banner = {}));
