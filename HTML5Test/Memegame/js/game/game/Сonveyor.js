var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game;
(function (Game) {
    var Сonveyor = (function (_super) {
        __extends(Сonveyor, _super);
        function Сonveyor(game, x, y, gameElementContainer) {
            _super.call(this, game, x, y);
            this.anchor.set(0.5);
            this._GameElementContainer = gameElementContainer;
            this._GameElementContainer.addChild(this);
            this._speed = 0;
            this._cellLandscapeCount = 8;
            this._orderList = [];
            this._selectElementsArray = [];
            this._cellArray = [];
            this._cellArray.length = 3;
            for (var i = 0; i < 3; i++) {
                this._cellArray[i] = [];
                this._cellArray[i].length = this._cellLandscapeCount;
            }
            for (var n = 0; n < 3; n++) {
                for (var i = 0; i < this._cellLandscapeCount; i++) {
                    this._cellArray[n][i] = new Game.BasicCell(this.game, this.x, this.y, this._GameElementContainer, true, this);
                    this._cellArray[n][i].name = 'Cell_' + (i + n * this._cellLandscapeCount + n); // ВНИМАНИЕ! ПРИ РЕАЛИЗАЦИИ ДОБАВЛЕНИЯ БЛОКОВ В ЛЕНТУ, НЕОБХОДИМО УМНОЖАТЬ НЕ НА 6, А НА ДРУГОЕ ЧИСЛО! СЛАБОЕ МЕСТО!!!!!!
                    this._cellArray[n][i].x += -112 * 3 + (112 + 10) * i - 112; // Создамём полосу
                    this._cellArray[n][i].y += -112 * 2 + (112 + 10) * n + 10;
                }
            }
        }
        Сonveyor.prototype.update = function () {
            this.changePosition();
        };
        Сonveyor.prototype.setSpeed = function (spVal) {
            this._speed = spVal;
        };
        Сonveyor.prototype.addOrderObjects = function (objects) {
            for (var i = 0; i < objects.length; i++) {
                this._orderList[this._orderList.length] = objects[i];
            }
        };
        Сonveyor.prototype.selectObjectsAddRemove = function (object, mode) {
            switch (mode) {
                case 'add':
                    this._selectElementsArray[this._selectElementsArray.length] = object;
                    break;
                case 'remove':
                    var stop = false;
                    for (var i = 0; i < this._selectElementsArray.length; i++) {
                        if (!stop) {
                            if (this._selectElementsArray[i].name == object.name) {
                                this._selectElementsArray.splice(i, 1);
                                stop = true;
                            }
                        }
                    }
                    break;
            }
        };
        Сonveyor.prototype.goodOrderSelect = function (selectedArray, goodOrderArray, currentTable) {
            var arraySelectNumb = selectedArray.length;
            for (var i = 0; i < arraySelectNumb; i++) {
                for (var n = 0; n < goodOrderArray.length; n++) {
                    if (selectedArray[0].key == goodOrderArray[n].key && selectedArray[0].tint == goodOrderArray[n].tint) {
                        selectedArray[0].goodOrederCall(goodOrderArray[n], currentTable);
                        break;
                    }
                }
            }
        };
        Сonveyor.prototype.checkOrdersFromCell = function (currentCell) {
            currentCell.setDefoultVisible();
            var randomItem = Phaser.ArrayUtils.removeRandomItem(this._orderList);
            var correctObject = randomItem.split('_')[0];
            var correctColor = randomItem.split('_')[1];
            currentCell.loadCurrentTexture(correctObject, correctColor);
            //currentCell.loadTexture();
        };
        Сonveyor.prototype.changeCurrentCellFromOrdersCell = function (currentCell) {
            this._orderList[this._orderList.length] = currentCell._currentTextureKey + '_' + currentCell.tint;
            currentCell.setDefoultVisible();
            var firstItem = this._orderList[0];
            var correctObject = firstItem.split('_')[0];
            var correctColor = firstItem.split('_')[1];
            currentCell.loadCurrentTexture(correctObject, correctColor);
            this._orderList.splice(0, 1);
        };
        Сonveyor.prototype.shakeArrayAfterChangePosition = function (currentRow) {
            var cellKeysArray = [];
            for (var i = 0; i < 3; i++) {
                cellKeysArray[i] = this._cellArray[i][currentRow]._currentTextureKey + '_' + this._cellArray[i][currentRow].tint;
            }
            for (var n = 0; n < 3; n++) {
                var randomItem = Phaser.ArrayUtils.removeRandomItem(cellKeysArray);
                var correctObject = randomItem.split('_')[0];
                var correctColor = randomItem.split('_')[1];
                this._cellArray[n][currentRow].loadCurrentTexture(correctObject, correctColor);
                this._cellArray[n][currentRow].dropSelect();
            }
            console.log('SHAKED!');
        };
        Сonveyor.prototype.getFreeCell = function () {
            var freeCell = 0;
            for (var n = 0; n < 3; n++) {
                for (var i = 0; i < this._cellLandscapeCount; i++) {
                    if (this._cellArray[n][i].key == 'CellClean')
                        freeCell += 1;
                }
            }
            return freeCell;
        };
        Сonveyor.prototype.changePosition = function () {
            for (var n = 0; n < 3; n++) {
                for (var i = 0; i < this._cellLandscapeCount; i++) {
                    var nowOrderCheck = false;
                    if (this._cellArray[n][i].x > this.x - 400) {
                        this._cellArray[n][i].x -= this._speed;
                    }
                    else {
                        var maxX = this._cellArray[n][i].x;
                        for (var m = 0; m < this._cellLandscapeCount; m++) {
                            if (maxX < this._cellArray[n][m].x) {
                                maxX = this._cellArray[n][m].x;
                            }
                        }
                        this._cellArray[n][i].x = maxX + 122;
                        if (this._cellArray[n][i].key == 'CellClean' && this._orderList.length > 0) {
                            this.checkOrdersFromCell(this._cellArray[n][i]);
                            nowOrderCheck = true;
                        }
                        else {
                            if (this.getFreeCell() == 0) {
                                this.changeCurrentCellFromOrdersCell(this._cellArray[n][i]);
                            }
                        }
                        if (this._cellArray[n][i].key != 'CellClean') {
                            this._cellArray[n][i].dropSelect();
                        }
                        if (!nowOrderCheck) {
                            if (n == 0) {
                                if (this._cellArray[0][i].key != 'CellClean' || this._cellArray[1][i].key != 'CellClean' || this._cellArray[2][i].key != 'CellClean') {
                                    this.shakeArrayAfterChangePosition(i);
                                }
                            }
                        }
                    }
                }
            }
        };
        return Сonveyor;
    }(Phaser.Sprite));
    Game.Сonveyor = Сonveyor;
})(Game || (Game = {}));
//# sourceMappingURL=Сonveyor.js.map