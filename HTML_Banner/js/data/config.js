var Banner;
(function (Banner) {
    var Config = (function () {
        function Config() {
        }
        Config.isLandscape = function () {
            return this.height < this.width;
        };
        Config.isDefaultLandscape = function () {
            return this.defaultHeight < this.defaultWidth;
        };
        Config.changeScale = function (game) {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            var dw = this.width;
            var dh = this.height;
            if (this.isLandscape() != this.isDefaultLandscape()) {
                dw = this.height;
                dh = this.width;
            }
            this.scale = Math.min(dw / this.defaultWidth, dh / this.defaultHeight);
            this.maxScale = Math.max(dw / this.defaultWidth, dh / this.defaultHeight) / this.scale;
            //console.log("scale", this.scale, this.isLandscape() != game.scale.isLandscape, this.isLandscape() , game.scale.isLandscape)
            this.width /= this.scale;
            this.height /= this.scale;
            game.scale.setUserScale(this.scale, this.scale, 0, 0);
            game.scale.setGameSize(this.width, this.height);
            game.world.setBounds(0, 0, this.width, this.height);
            game.scale.refresh();
        };
        Object.defineProperty(Config, "halfWidth", {
            get: function () {
                return Config.width * 0.5;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Config, "halfHeight", {
            get: function () {
                return Config.height * 0.5;
            },
            enumerable: true,
            configurable: true
        });
        Config.defaultWidth = 1024;
        Config.defaultHeight = 512;
        Config.scale = 1;
        Config.maxScale = 1;
        return Config;
    }());
    Banner.Config = Config;
})(Banner || (Banner = {}));
//# sourceMappingURL=config.js.map