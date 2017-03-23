var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game;
(function (Game) {
    var Gameplay = (function (_super) {
        __extends(Gameplay, _super);
        function Gameplay() {
            _super.apply(this, arguments);
        }
        Gameplay.prototype.create = function () {
            var newBG = this.game.add.sprite(0, 0, "player");
        };
        return Gameplay;
    }(Phaser.State));
    Game.Gameplay = Gameplay;
})(Game || (Game = {}));
//# sourceMappingURL=Gameplay.js.map