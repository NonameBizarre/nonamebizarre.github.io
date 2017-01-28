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
