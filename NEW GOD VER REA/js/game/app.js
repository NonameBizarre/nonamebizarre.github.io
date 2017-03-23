var Game;
(function (Game) {
    var GameApp = (function () {
        function GameApp() {
            this.game = new Phaser.Game(Game.Config.defaultWidth, Game.Config.defaultHeight, Phaser.AUTO, 'content', null, false);
            console.log("Game", this.game);
            this.game.state.add('Boot', Game.Boot, true);
            this.game.state.add('Preloader', Game.Preloader);
            this.game.state.add('Gameplay', Game.Gameplay);
        }
        return GameApp;
    }());
    Game.GameApp = GameApp;
})(Game || (Game = {}));
window.onload = function () {
    var game = new Game.GameApp();
    console.log("Load");
    setTimeout("window.scrollTo(0, 1)", 10);
};
//# sourceMappingURL=app.js.map