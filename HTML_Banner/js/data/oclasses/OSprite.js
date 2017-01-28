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