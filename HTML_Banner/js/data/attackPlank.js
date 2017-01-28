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