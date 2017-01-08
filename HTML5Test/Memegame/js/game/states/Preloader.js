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
            //this.game.load.image('CellClean', 'assets/CellClean.png');
            this.game.load.image('CellClean', 'assets/CellClean2.png');
            this.game.load.image('TableClean', 'assets/TableClean.png');
            //Игровые объекты
            /*
            this.game.load.image('CellHat', 'assets/CellHat.png');
            this.game.load.image('CellBat', 'assets/CellBat.png');
            this.game.load.image('CellCoCoCo', 'assets/CellCoCoCo.png');
            this.game.load.image('CellGamepad', 'assets/CellGamepad.png');
            this.game.load.image('CellJoyS', 'assets/CellJoyS.png');
            this.game.load.image('CellMOG', 'assets/CellMOG.png');
            this.game.load.image('CellPePe', 'assets/CellPePe.png');
            this.game.load.image('CellPommid', 'assets/CellPommid.png');

            this.game.load.image('DuDec', 'assets/DuDec.png');
            this.game.load.image('DyBovSky', 'assets/DyBovSky.png');
            this.game.load.image('GodBen', 'assets/GodBen.png');
            this.game.load.image('hehehe', 'assets/hehehe.png');
            this.game.load.image('Kama', 'assets/Kama.png');
            this.game.load.image('Kanobu', 'assets/Kanobu.png');
            this.game.load.image('KotLetKi', 'assets/KotLetKi.png');
            this.game.load.image('Kovrizjka', 'assets/Kovrizjka.png');
            this.game.load.image('Mouse', 'assets/Mouse.png');
            this.game.load.image('NoFact', 'assets/NoFact.png');
            this.game.load.image('PhillPhish', 'assets/PhillPhish.png');
            this.game.load.image('Smoke', 'assets/Smoke.png');
            */
            //Игровые объекты
            this.game.load.image('CellHat', 'assets/ammonite.png');
            this.game.load.image('CellBat', 'assets/angler-fish.png');
            this.game.load.image('CellCoCoCo', 'assets/bear-head.png');
            this.game.load.image('CellGamepad', 'assets/chicken.png');
            this.game.load.image('CellJoyS', 'assets/dolphin.png');
            this.game.load.image('CellMOG', 'assets/duck.png');
            this.game.load.image('CellPePe', 'assets/eagle-emblem.png');
            this.game.load.image('CellPommid', 'assets/elephant-head.png');
            this.game.load.image('DuDec', 'assets/feline.png');
            this.game.load.image('DyBovSky', 'assets/gecko.png');
            this.game.load.image('GodBen', 'assets/octopus.png');
            this.game.load.image('hehehe', 'assets/parrot-head.png');
            this.game.load.image('Kama', 'assets/polar-bear.png');
            this.game.load.image('Kanobu', 'assets/rabbit.png');
            this.game.load.image('KotLetKi', 'assets/snail.png');
            this.game.load.image('Kovrizjka', 'assets/snake.png');
            this.game.load.image('Mouse', 'assets/sperm-whale.png');
            this.game.load.image('NoFact', 'assets/squid-head.png');
            this.game.load.image('PhillPhish', 'assets/swan.png');
            this.game.load.image('Smoke', 'assets/tiger.png');
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