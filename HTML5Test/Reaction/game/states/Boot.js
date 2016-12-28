var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game;
(function (Game) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
        };
        Boot.prototype.create = function () {
            console.log("Boot");
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            //  this.game.scale.onOrientationChange.add(this.changeOrientation, this);
            //   this.game.scale.onSizeChange.add(this.changeOrientation, this);
            window.addEventListener("resize", this.changeOrientation.bind(this), false);
            this.game.scale.onOrientationChange.add(this.changeOrientation, this);
            // Загрузка прелоадера
            this.game.state.start("Preloader", true);
            this.changeOrientation();
        };
        Boot.prototype.changeOrientation = function () {
            Game.Config.changeScale(this.game);
            var event = new Event('changeOrientationAndResize');
            window.dispatchEvent(event);
        };
        return Boot;
    }(Phaser.State));
    Game.Boot = Boot;
})(Game || (Game = {}));
//# sourceMappingURL=Boot.js.map