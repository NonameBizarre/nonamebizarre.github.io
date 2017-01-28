var Banner;
(function (Banner) {
    var Main = (function () {
        function Main() {
            this.game = new Phaser.Game(Banner.Config.defaultWidth, Banner.Config.defaultHeight, Phaser.AUTO, 'banner', null, false);
            Banner.Config.globalEvents = new Banner.OEventDispatcher();
            this.game.state.add('Boot', Banner.Boot, true);
            this.game.state.add('Body', Banner.Body);
        }
        return Main;
    })();
    Banner.Main = Main;
})(Banner || (Banner = {}));
window.onload = function () {
    var game = new Banner.Main();
    console.log("Load");
    setTimeout("window.scrollTo(0, 1)", 10);
};
