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