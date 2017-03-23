var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game;
(function (Game) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            this.game.stage.backgroundColor = 0xffcc00;
            this.game.load.onFileComplete.add(this.LoadingUpdate, this);
            //  Загрузка ассетов
            //this.game.load.atlas( 'gameplay', "assets/atlass/gameplay.png", "assets/atlass/gameplay.json" );
            this.game.load.image('bgPlane', 'assets/BackPlank.png');
            this.game.load.image('player', 'assets/mrPlayer.png');
            this.game.load.image('enemyExtraBig', 'assets/enemyExtraBig.png');
            this.game.load.image('enemyBig', 'assets/enemyBig.png');
            this.game.load.image('enemyExtraLong', 'assets/enemyExtraLong.png');
            this.game.load.image('enemyLong', 'assets/enemyLong.png');
        };
        Preloader.prototype.create = function () {
            console.log("Preloader");
        };
        Preloader.prototype.start = function () {
        };
        Preloader.prototype.LoadingUpdate = function (progress, cacheKey, success, totalLoaded, totalFiles) {
            if (progress == 100) {
                this.game.state.start('Gameplay', true);
            }
        };
        return Preloader;
    }(Phaser.State));
    Game.Preloader = Preloader;
})(Game || (Game = {}));
//# sourceMappingURL=Preloader.js.map