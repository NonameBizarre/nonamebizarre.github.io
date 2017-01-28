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
