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
            this.game.load.image('CellClean', 'assets/CellClean.png');
            this.game.load.image('TableClean', 'assets/TableClean.png');
            //Игровые объекты
            this.game.load.image('CellHat', 'assets/CellHat.png');
            this.game.load.image('CellBat', 'assets/CellBat.png');
            this.game.load.image('CellCoCoCo', 'assets/CellCoCoCo.png');
            this.game.load.image('CellGamepad', 'assets/CellGamepad.png');
            this.game.load.image('CellJoyS', 'assets/CellJoyS.png');
            this.game.load.image('CellMOG', 'assets/CellMOG.png');
            this.game.load.image('CellPePe', 'assets/CellPePe.png');
            this.game.load.image('CellPommid', 'assets/CellPommid.png');
        };
        Preloader.prototype.create = function () {
            console.log("Preloader");
        };
        Preloader.prototype.start = function () {
        };
        Preloader.prototype.LoadingUpdate = function (progress, cacheKey, success, totalLoaded, totalFiles) {
            if (progress == 100) {
                this.game.state.start('GameManager', true);
            }
        };
        return Preloader;
    }(Phaser.State));
    Game.Preloader = Preloader;
})(Game || (Game = {}));
//# sourceMappingURL=Preloader.js.map