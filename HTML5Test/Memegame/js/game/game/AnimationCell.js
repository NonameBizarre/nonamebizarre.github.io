var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game;
(function (Game) {
    var AnimationCell = (function (_super) {
        __extends(AnimationCell, _super);
        function AnimationCell(game, x, y, gameElementContainer, elementKey, tableObject, currentCell, objectTint) {
            _super.call(this, game, x, y, elementKey);
            this.anchor.set(0.5);
            this.tint = objectTint;
            this._GameElementContainer = gameElementContainer;
            this._GameElementContainer.addChild(this);
            this._tableObject = tableObject;
            this._currentCell = currentCell;
            this._tween = this.game.add.tween(this).to({ x: [this.x, this._currentCell.x + 50, this._currentCell.x], y: [this.y, this._currentCell.y, this._currentCell.y] }, 400);
            //this._tween = this.game.add.tween(this).to({x:[this.x,this._currentCell.x],y:[this.y,this._currentCell.y]},400);
            this._tween.interpolation(function (v, k) { return Phaser.Math.catmullRomInterpolation(v, k); });
            this._tween.onComplete.add(this.onCompliteMove, this);
            this._tween.start();
            this.game.add.tween(this.scale).to({ x: [this.scale.x, 1.5], y: [this.scale.y, 1.5] }, 100, Phaser.Easing.Linear.None, true);
            this.game.add.tween(this.scale).to({ x: [this.scale.x, 0.7], y: [this.scale.y, 0.7] }, 100, Phaser.Easing.Linear.None, true, 300);
        }
        AnimationCell.prototype.onCompliteMove = function () {
            this.alpha = 0;
            this._currentCell.hideShowCell('hide');
            this._GameElementContainer.removeChild(this);
            //КАК УБИТЬ СЕБЯ ?
        };
        return AnimationCell;
    }(Phaser.Sprite));
    Game.AnimationCell = AnimationCell;
})(Game || (Game = {}));
//# sourceMappingURL=AnimationCell.js.map