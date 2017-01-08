var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game;
(function (Game) {
    var GameManager = (function (_super) {
        __extends(GameManager, _super);
        function GameManager() {
            _super.apply(this, arguments);
        }
        GameManager.prototype.create = function () {
            this._GameElementContainer = new Game.OSprite(this.game, Game.Config.defaultWidth * 0.5 - 50, Game.Config.defaultHeight * 0.5 - 50);
            //this._GameElementContainer = new OSpritePortret(this.game, 0xffcc00, 1);
            this._GameElementContainer.setLandscapePosition(Game.Config.defaultHeight * 0.5, Game.Config.defaultWidth * 0.5 - 200);
            this._GameElementContainer.setCustomScale(1, 1, true);
            this._Conveyor = new Game.Сonveyor(this.game, 0, 0, this._GameElementContainer);
            this._Conveyor.setSpeed(1);
            this._Table = [];
            this._Table.length = 4;
            this._tableIsDone = 0;
            this._currentOrderNumber = 1; //1
            this._Table[0] = new Game.Table(this.game, -155, 300, this._GameElementContainer, this._Conveyor, this);
            this._Table[1] = new Game.Table(this.game, 255, 300, this._GameElementContainer, this._Conveyor, this);
            this._Table[2] = new Game.Table(this.game, -155, 600, this._GameElementContainer, this._Conveyor, this);
            this._Table[3] = new Game.Table(this.game, 255, 600, this._GameElementContainer, this._Conveyor, this);
            this._GameObjectArray = [];
            this._GameObjectArray.length = 8;
            //Помещаем объекты в массив
            this.addObjectsInArray();
            //Создаём заказы определённой длинны
            this.setOredersOnTable(this._currentOrderNumber);
        };
        GameManager.prototype.tableIsDone = function () {
            this._tableIsDone += 1;
            if (this._tableIsDone == 4) {
                this._tableIsDone = 0;
                for (var i = 0; i < this._Table.length; i++) {
                    this._Table[i].tableReady();
                }
                this._currentOrderNumber += 1; //1
                console.log('IS DONE!');
            }
        };
        GameManager.prototype.getOrderFromTable = function (currentTable) {
            this.addObjectsInArray();
            var tempObjectArray = this._GameObjectArray;
            var returnArray = [];
            for (var n = 0; n < this._currentOrderNumber + 1; n++) {
                returnArray[n] = Phaser.ArrayUtils.removeRandomItem(tempObjectArray);
            }
            currentTable.setOrder(returnArray);
            this.tableIsDone();
        };
        GameManager.prototype.addObjectsInArray = function () {
            this._GameObjectArray[0] = 'CellHat';
            this._GameObjectArray[1] = 'CellBat';
            this._GameObjectArray[2] = 'CellCoCoCo';
            this._GameObjectArray[3] = 'CellGamepad';
            this._GameObjectArray[4] = 'CellJoyS';
            this._GameObjectArray[5] = 'CellMOG';
            this._GameObjectArray[6] = 'CellPePe';
            this._GameObjectArray[7] = 'CellPommid';
        };
        GameManager.prototype.setOredersOnTable = function (orderLength) {
            var tempObjectArray = this._GameObjectArray;
            for (var i = 0; i < 4; i++) {
                var returnArray = [];
                for (var n = 0; n < orderLength; n++) {
                    returnArray[n] = Phaser.ArrayUtils.removeRandomItem(tempObjectArray);
                }
                this._Table[i].setOrder(returnArray);
            }
        };
        GameManager.prototype.update = function () {
            this._Conveyor.update();
        };
        GameManager.prototype.render = function () {
        };
        return GameManager;
    }(Phaser.State));
    Game.GameManager = GameManager;
})(Game || (Game = {}));
//# sourceMappingURL=GameManager.js.map