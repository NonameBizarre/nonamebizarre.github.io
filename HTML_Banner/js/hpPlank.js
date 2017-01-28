var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var hpPlank = (function (_super) {
        __extends(hpPlank, _super);
        function hpPlank(game, x, y) {
            _super.call(this, game, x, y, 'livePlank_empty');
            this.anchor.set(0.5, 0.5);
        }
        return hpPlank;
    })(Phaser.Sprite);
    Banner.hpPlank = hpPlank;
})(Banner || (Banner = {}));
