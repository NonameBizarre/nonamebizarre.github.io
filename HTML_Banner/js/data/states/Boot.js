var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.game.load.image("bg", "assets/bg.png");
            //Графон. Полутестовый.
            this.game.load.image("Dragon", "assets/testDragon.png");
            this.game.load.image("Arm", "assets/testArm.png");
            this.game.load.image("Arrow", "assets/testArrow.png");
            this.game.load.image("attackIcon1", "assets/attackIcon1.png");
            this.game.load.image("attackIcon2", "assets/attackIcon2.png");
            this.game.load.image("attackIcon3", "assets/attackIcon3.png");
            this.game.load.image("attackPlaneIcon", "assets/attackPlaneIcon.png");
            this.game.load.image("attackPlank_empty", "assets/attackPlank_empty.png");
            this.game.load.image("attackPlank_green", "assets/attackPlank_green.png");
            this.game.load.image("attackPlank_red", "assets/attackPlank_red.png");
            this.game.load.image("livePlank_empty", "assets/livePlank_empty.png");
            this.game.load.image("livePlank_ginger", "assets/livePlank_ginger.png");
            this.game.load.image("livePlank_green", "assets/livePlank_green.png");
        };
        Boot.prototype.create = function () {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            window.addEventListener("resize", this.changeOrientation.bind(this), false);
            this.game.scale.onOrientationChange.add(this.changeOrientation, this);
            this.changeOrientation();
            this.game.state.start('Body', true);
        };
        Boot.prototype.changeOrientation = function () {
            Banner.Config.changeScale(this.game);
            Banner.Config.globalEvents.dispatch('changeOrientationAndResize');
        };
        return Boot;
    }(Phaser.State));
    Banner.Boot = Boot;
})(Banner || (Banner = {}));
//# sourceMappingURL=Boot.js.map