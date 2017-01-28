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
