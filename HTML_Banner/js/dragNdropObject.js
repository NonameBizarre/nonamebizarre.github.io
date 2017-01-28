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
