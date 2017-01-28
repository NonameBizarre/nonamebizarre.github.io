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
