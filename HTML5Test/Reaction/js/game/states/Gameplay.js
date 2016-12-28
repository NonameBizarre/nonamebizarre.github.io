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
            this._GameElementContainer = new Game.OSprite(this.game, 600, 800 + 100);
            this._GameElementContainer.setLandscapePosition(800, 600);
            //this._GameElementContainer.setCustomScale(1.0, 0.75, true);
            this._plank = this.game.add.image(this.world.width / 2, this.world.height / 2, 'bgPlane');
            this._plank.anchor.set(0.5);
            this._GameElementContainer.addChild(this._plank);
            this.player = this.game.add.image(this.world.width / 2, this.world.height / 2, 'player');
            this.player.anchor.set(0.5);
            this._GameElementContainer.addChild(this.player);
            this.player.inputEnabled = true;
            this.player.input.enableDrag();
        };
        Gameplay.prototype.update = function () {
        };
        return Gameplay;
    }(Phaser.State));
    Game.Gameplay = Gameplay;
})(Game || (Game = {}));
//# sourceMappingURL=Gameplay.js.map