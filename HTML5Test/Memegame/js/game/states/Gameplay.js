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
            this._isGameOver = false;
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this._GameElementContainer = new Game.OSprite(this.game, Game.Config.defaultWidth * 0.5, Game.Config.defaultHeight * 0.5);
            this._GameElementContainer.setLandscapePosition(Game.Config.defaultHeight * 0.5, Game.Config.defaultWidth * 0.5);
            this._GameElementContainer.setCustomScale(1.0, 1.0, true);
            this._plank = this.game.add.sprite(0, 0, 'bgPlane');
            this._plank.anchor.set(0.5);
            this._plankHalfWidth = this._plank.width / 2;
            this._plankHalfHeight = this._plank.height / 2;
            this._GameElementContainer.addChild(this._plank);
            this._player = this.game.add.sprite(0, 0, 'player');
            this._player.anchor.set(0.5);
            this._GameElementContainer.addChild(this._player);
            this._playerHalfWidth = this._player.width / 2;
            this._playerHalfHeight = this._player.height / 2;
            this._player.inputEnabled = true;
            this._player.input.enableDrag();
            this.game.physics.enable(this._player, Phaser.Physics.ARCADE);
            //this.game.physics.arcade.enable(this._player);
            //this._player.body.collideWorldBounds = true;
            this._player.body.immovable = true;
            this._enemyGroup = this.game.add.group();
            //№1
            this._enemyExtraBig = this.game.add.sprite(-this._plankHalfWidth, -this._plankHalfHeight, 'enemyExtraBig');
            this._enemyExtraBig.anchor.set(0.5);
            this._enemyGroup.add(this._enemyExtraBig);
            this._GameElementContainer.addChild(this._enemyExtraBig);
            this._enemyExtraBig.x += this._enemyExtraBig.width / 2 + 20;
            this._enemyExtraBig.y += this._enemyExtraBig.height / 2 + 20;
            this.game.physics.enable(this._enemyExtraBig, Phaser.Physics.ARCADE);
            this._enemyExtraBig.body.collideWorldBounds = true;
            this._enemyExtraBig.body.bounce.set(1);
            this._enemyExtraBig.body.velocity.setTo(300, 300);
            //№2
            this._enemyBig = this.game.add.sprite(this._plankHalfWidth, -this._plankHalfHeight, 'enemyBig');
            this._enemyBig.anchor.set(0.5);
            this._enemyGroup.add(this._enemyBig);
            this._GameElementContainer.addChild(this._enemyBig);
            this._enemyBig.x -= this._enemyBig.width / 2 + 20;
            this._enemyBig.y += this._enemyBig.height / 2 + 20;
            this.game.physics.enable(this._enemyBig, Phaser.Physics.ARCADE);
            this._enemyBig.body.collideWorldBounds = true;
            this._enemyBig.body.bounce.set(1);
            this._enemyBig.body.velocity.setTo(-300, 300);
            //№3
            this._enemyExtraLong = this.game.add.sprite(-this._plankHalfWidth, this._plankHalfHeight, 'enemyExtraLong');
            this._enemyExtraLong.anchor.set(0.5);
            this._enemyGroup.add(this._enemyExtraLong);
            this._GameElementContainer.addChild(this._enemyExtraLong);
            this._enemyExtraLong.x += this._enemyExtraLong.width / 2 + 20;
            this._enemyExtraLong.y -= this._enemyExtraLong.height / 2 + 20;
            this.game.physics.enable(this._enemyExtraLong, Phaser.Physics.ARCADE);
            this._enemyExtraLong.body.collideWorldBounds = true;
            this._enemyExtraLong.body.bounce.set(1);
            this._enemyExtraLong.body.velocity.setTo(300, -300);
            //№4
            this._enemyLong = this.game.add.sprite(this._plankHalfWidth, this._plankHalfHeight, 'enemyLong');
            this._enemyLong.anchor.set(0.5);
            this._enemyGroup.add(this._enemyLong);
            this._GameElementContainer.addChild(this._enemyLong);
            this._enemyLong.x -= this._enemyLong.width / 2 + 20;
            this._enemyLong.y -= this._enemyLong.height / 2 + 20;
            this.game.physics.enable(this._enemyLong, Phaser.Physics.ARCADE);
            this._enemyLong.body.collideWorldBounds = true;
            this._enemyLong.body.bounce.set(1);
            this._enemyLong.body.velocity.setTo(-300, -300);
            //this._player.body.velocity.x = -100;
        };
        Gameplay.prototype.update = function () {
            if (!this._isGameOver) {
                if (this.checkPlankOverlap()) {
                    this.GameOver();
                }
                if (this.EnemyOverlap(this._player, this._enemyLong) || this.EnemyOverlap(this._player, this._enemyExtraLong) || this.EnemyOverlap(this._player, this._enemyBig) || this.EnemyOverlap(this._player, this._enemyExtraBig)) {
                    this.GameOver();
                }
            }
            /*
             if (//НАЖИМАЕМ НА КНОПКУ//)
             {
                this.Restart();
             }
            */
        };
        Gameplay.prototype.EnemyOverlap = function (obj1, obj2) {
            return Phaser.Rectangle.intersects(obj1.body, obj2.body);
        };
        Gameplay.prototype.GameOver = function () {
            this.game.stage.backgroundColor = 0x992d2d;
            this._player.input.disableDrag();
            this._isGameOver = true;
            this._enemyLong.body.velocity.setTo(0, 0);
            this._enemyExtraLong.body.velocity.setTo(0, 0);
            this._enemyBig.body.velocity.setTo(0, 0);
            this._enemyExtraBig.body.velocity.setTo(0, 0);
        };
        Gameplay.prototype.Restart = function () {
            if (this._isGameOver) {
                this._isGameOver = false;
                this._player.input.enableDrag();
                this._player.x = 0;
                this._player.y = 0;
                this.game.stage.backgroundColor = 0xffcc00;
            }
        };
        Gameplay.prototype.checkPlankOverlap = function () {
            if (this._player.x - this._playerHalfWidth < -this._plankHalfWidth || this._player.x + this._playerHalfWidth > this._plankHalfWidth || this._player.y - this._playerHalfHeight < -this._plankHalfHeight || this._player.y + this._playerHalfHeight > this._plankHalfHeight) {
                return true;
            }
            else {
                return false;
            }
            /*
            let rawRObj2:PIXI.Rectangle = obj2.getBounds();
            let rObj2:Phaser.Rectangle = new Phaser.Rectangle(rawRObj2.x+this._GameElementContainer.x, rawRObj2.y+this._GameElementContainer.y, rawRObj2.width, rawRObj2.height);

            let rObj1:Phaser.Rectangle = new Phaser.Rectangle(0, 0, this._plank.width-this._player.width*2, this._plank.height-this._player.height*2);//obj2.getBounds();
            rObj1.x = this._plank.x+this._GameElementContainer.x - this._plank.width/2+this._player.width;
            rObj1.y = this._plank.y+this._GameElementContainer.y - this._plank.height/2+this._player.height;

            return Phaser.Rectangle.intersects(rObj1, rObj2); */
        };
        return Gameplay;
    }(Phaser.State));
    Game.Gameplay = Gameplay;
})(Game || (Game = {}));
//# sourceMappingURL=Gameplay.js.map