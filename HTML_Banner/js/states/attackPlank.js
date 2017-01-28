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
