var Game;
(function (Game) {
    var Config = (function () {
        function Config() {
        }
        Config.isLandscape = function () {
            return this.defaultHeight < this.defaultWidth;
        };
        Config.changeScale = function (game) {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            var dw = this.width;
            var dh = this.height;
            if (this.isLandscape() != game.scale.isLandscape) {
                dw = this.height;
                dh = this.width;
            }
            this.scale = Math.min(dw / this.defaultWidth, dh / this.defaultHeight);
            this.maxScale = Math.max(dw / this.defaultWidth, dh / this.defaultHeight) / this.scale;
            console.log("scale", this.scale, this.isLandscape() != game.scale.isLandscape, this.isLandscape(), game.scale.isLandscape);
            this.width /= this.scale;
            this.height /= this.scale;
            game.scale.setUserScale(this.scale, this.scale, 0, 0);
            game.scale.setGameSize(this.width, this.height);
            game.world.setBounds(0, 0, this.width, this.height);
            game.scale.refresh();
        };
        Config.defaultWidth = 800;
        Config.defaultHeight = 600;
        Config.scale = 1;
        Config.maxScale = 1;
        return Config;
    }());
    Game.Config = Config;
})(Game || (Game = {}));
//# sourceMappingURL=config.js.map