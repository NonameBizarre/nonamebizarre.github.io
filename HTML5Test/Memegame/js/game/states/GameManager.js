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
            //this._GameElementContainer = new OSprite(this.game, Config.defaultWidth*0.5-50, Config.defaultHeight*0.5-50);
            this._GameElementContainer = new Game.OSpritePortret(this.game, 0x12e8ee, 1);
            //this._GameElementContainer.setLandscapePosition(Config.defaultHeight*0.5, Config.defaultWidth*0.5-200);
            //this._GameElementContainer.setCustomScale(1, 1, true);
            this._GameElementContainer.onMask();
            this._Conveyor = new Game.Сonveyor(this.game, -50, -50, this._GameElementContainer);
            this._Conveyor.setSpeed(1);
            this._Table = [];
            this._Table.length = 4;
            this._tableIsDone = 0;
            this._currentOrderNumber = 1; //1
            this._Table[0] = new Game.Table(this.game, -190, 195, this._GameElementContainer, this._Conveyor, this);
            this._Table[1] = new Game.Table(this.game, 190, 195, this._GameElementContainer, this._Conveyor, this);
            this._Table[2] = new Game.Table(this.game, -190, 480, this._GameElementContainer, this._Conveyor, this);
            this._Table[3] = new Game.Table(this.game, 190, 480, this._GameElementContainer, this._Conveyor, this);
            this._currentObjectArray = [];
            this._currentColorArray = [];
            this._tempCompliteObjects = [];
            this._GameObjectArray = [];
            this._GameObjectArray.length = 20;
            this._ObjectColorArray = [];
            this._ObjectColorArray.length = 7;
            //Формируем стартовые условия
            this.GameStart();
        };
        GameManager.prototype.GameStart = function () {
            //Помещаем объекты в массив
            this.addObjectsInArray();
            //Помещаем цвета в массив
            this.addColorsInArray();
            ////Впервые заполняем массив текущих объектов
            for (var i = 0; i < 4; i++) {
                this._currentObjectArray[i] = Phaser.ArrayUtils.removeRandomItem(this._GameObjectArray);
                this._currentColorArray[i] = Phaser.ArrayUtils.removeRandomItem(this._ObjectColorArray);
            }
            //Создаём темповый массив заказов для столов
            this.FillCurrentObjectsArray();
            //Создаём стартовые заказы определённой длинны
            this.setOredersOnTable(this._currentOrderNumber);
            this._currentOrderNumber += 1;
            //Создаём новые заказы для закрытых столов
            this.FillCurrentObjectsArray();
        };
        GameManager.prototype.DoSomthingWithObjColArray = function () {
            console.log(this._currentOrderNumber);
            if (this._currentOrderNumber == 3 || this._currentOrderNumber == 6 || this._currentOrderNumber == 9) {
                this.AddCurrentItems('color');
            }
            if (this._currentOrderNumber == 2 || this._currentOrderNumber == 4 || this._currentOrderNumber == 5 || this._currentOrderNumber == 7 || this._currentOrderNumber == 8 || this._currentOrderNumber == 10 || this._currentOrderNumber == 11 || this._currentOrderNumber == 12) {
                this.AddCurrentItems('object');
                console.log('prepare Add Object');
            }
            this.FillCurrentObjectsArray();
        };
        GameManager.prototype.AddCurrentItems = function (mode) {
            switch (mode) {
                case 'object':
                    console.log('ArrayLen^ ' + this._GameObjectArray.length);
                    if (this._GameObjectArray.length > 1) {
                        for (var i = 0; i < 2; i++) {
                            this._currentObjectArray[this._currentObjectArray.length] = Phaser.ArrayUtils.removeRandomItem(this._GameObjectArray);
                            console.log('Add object: ' + this._currentObjectArray[this._currentObjectArray.length - 1]);
                        }
                    }
                    break;
                case 'color':
                    if (this._GameObjectArray.length > 1) {
                        this._currentColorArray[this._currentColorArray.length] = Phaser.ArrayUtils.removeRandomItem(this._ObjectColorArray);
                        console.log('Add color: ' + this._currentColorArray[this._currentColorArray.length - 1]);
                    }
                    break;
            }
        };
        GameManager.prototype.FillCurrentObjectsArray = function () {
            // Вычисляем количество дубликатов для элементов
            var complitleElDub = Math.ceil((this._currentOrderNumber * 4) / this._currentObjectArray.length);
            //Очищаем темповый массив объектов
            this._tempCompliteObjects.splice(0, this._tempCompliteObjects.length);
            //Начинаем заполнять темповый массив объектами
            var curCol = 0; //Текущий цвет.
            for (var i = 0; i < this._currentObjectArray.length; i++) {
                for (var n = 0; n < complitleElDub; n++) {
                    if (curCol == this._currentColorArray.length) {
                        curCol = 0;
                    }
                    this._tempCompliteObjects[this._tempCompliteObjects.length] = this._currentObjectArray[i] + '_' + this._currentColorArray[curCol];
                    curCol += 1;
                }
            }
        };
        GameManager.prototype.tableIsDone = function () {
            this._tableIsDone += 1;
            if (this._tableIsDone == 4) {
                this._tableIsDone = 0;
                for (var i = 0; i < this._Table.length; i++) {
                    this._Table[i].tableReady();
                }
                this._currentOrderNumber += 1;
                this.DoSomthingWithObjColArray();
            }
        };
        GameManager.prototype.getOrderFromTable = function (currentTable) {
            var returnArray = [];
            for (var n = 0; n < this._currentOrderNumber; n++) {
                returnArray[n] = Phaser.ArrayUtils.removeRandomItem(this._tempCompliteObjects);
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
            this._GameObjectArray[8] = 'DuDec';
            this._GameObjectArray[9] = 'DyBovSky';
            this._GameObjectArray[10] = 'GodBen';
            this._GameObjectArray[11] = 'hehehe';
            this._GameObjectArray[12] = 'Kama';
            this._GameObjectArray[13] = 'Kanobu';
            this._GameObjectArray[14] = 'KotLetKi';
            this._GameObjectArray[15] = 'Kovrizjka';
            this._GameObjectArray[16] = 'Mouse';
            this._GameObjectArray[17] = 'NoFact';
            this._GameObjectArray[18] = 'PhillPhish';
            this._GameObjectArray[19] = 'Smoke';
        };
        GameManager.prototype.addColorsInArray = function () {
            this._ObjectColorArray[0] = '0xee1212';
            this._ObjectColorArray[1] = '0xe4f020';
            this._ObjectColorArray[2] = '0x3cf020';
            this._ObjectColorArray[3] = '0x20e0f0';
            this._ObjectColorArray[4] = '0x2039f0';
            this._ObjectColorArray[5] = '0xee20f0';
            this._ObjectColorArray[6] = '0xe5dce5';
        };
        GameManager.prototype.setOredersOnTable = function (orderLength) {
            //let tempObjectArray:string[] = this._GameObjectArray;
            for (var i = 0; i < 4; i++) {
                var returnArray = [];
                for (var n = 0; n < orderLength; n++) {
                    returnArray[n] = Phaser.ArrayUtils.removeRandomItem(this._tempCompliteObjects);
                    console.log(returnArray[n]);
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