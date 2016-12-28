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
            this._player = this.game.add.image(this.world.width / 2, this.world.height / 2, 'player');
            this._player.anchor.set(0.5);
            this._GameElementContainer.addChild(this._player);
            this._player.inputEnabled = true;
            this._player.input.enableDrag();
            //this._player.body.velocity.x = -100;
        };
        Gameplay.prototype.update = function () {
            if (!this.checkOverlap(this._plank, this._player)) {
                this.game.stage.backgroundColor = 0x992d2d;
            }
            else {
                this.game.stage.backgroundColor = 0xffcc00;
            }
        };
        Gameplay.prototype.checkOverlap = function (obj1, obj2) {
            var obj2 = obj2.getBounds();
            var obj1 = new Phaser.Rectangle(0, 0, this._plank.width - this._player.width * 2, this._plank.height - this._player.height * 2); //obj2.getBounds();
            obj1.x = this._plank.x - this._plank.width / 2 + this._player.width;
            obj1.y = this._plank.y - this._plank.height / 2 + this._player.height;
            return Phaser.Rectangle.intersects(obj1, obj2);
        };
        return Gameplay;
    }(Phaser.State));
    Game.Gameplay = Gameplay;
})(Game || (Game = {}));
//# sourceMappingURL=Gameplay.js.map