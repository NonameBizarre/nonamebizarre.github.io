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
