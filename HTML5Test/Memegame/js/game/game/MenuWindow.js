var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game;
(function (Game) {
    var MenuWindow = (function (_super) {
        __extends(MenuWindow, _super);
        function MenuWindow(game, x, y, gameElementContainer, GameManager) {
            _super.call(this, game, x, y, 'pauseMenu');
            this.anchor.set(0.5, 0);
            this._gameManager = GameManager;
            this._GameElementContainer = gameElementContainer;
            this._GameElementContainer.addChild(this);
            this.angle = 90;
            //this.scale.set(0.1,0.1);
            this.game.add.tween(this).to({ angle: 0 }, 600, Phaser.Easing.Elastic.Out, true).onComplete.add(this.newGameStart, this);
            //this.game.add.tween(this).to({angle:-90},800,Phaser.Easing.Elastic.Out,true,1200)
            //this.game.add.tween(this).to({x:[this.x,this.x+500],y:[this.y,this.y+500]},900,Phaser.Easing.Back.Out,true,1200);
            //this.game.add.tween(this.scale).to({x:[this.scale.x,1],y:[this.scale.y,1]},100,Phaser.Easing.Back.Out,true,450)
            console.log('MenuWindow create!');
            // this._timeBarLine = this.game.add.sprite(this.x,this.y,'LineFromTimePlank')
            //this._timeBarLine.anchor.set(0,0.5);
        }
        MenuWindow.prototype.newGameStart = function () {
            //this.anchor.set(0.5,1);
            //this.position.y = this.position.y+this.height;
            //this.updateTransform.
            //this.game.add.tween(this.scale).to({x:[this.scale.x,1],y:[this.scale.y,-1]},1600,Phaser.Easing.Bounce.Out,true,200)
            this._tween = this.game.add.tween(this).to({ x: [this.x, this.x + 100, this.x - 1500], y: [this.y, this.y + 200, this.y + 1000], angle: [this.angle, -40, 145] }, 600);
            this._tween.interpolation(function (v, k) { return Phaser.Math.catmullRomInterpolation(v, k); });
            this._tween.start();
            this.game.add.tween(this.scale).to({ x: [1, 1.4, 2], y: [1, 1.4, 2] }, 600, Phaser.Easing.Linear.None, true);
        };
        MenuWindow.prototype.pauseExit = function () {
        };
        return MenuWindow;
    }(Phaser.Sprite));
    Game.MenuWindow = MenuWindow;
})(Game || (Game = {}));
//# sourceMappingURL=MenuWindow.js.map