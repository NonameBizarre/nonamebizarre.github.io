var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game;
(function (Game) {
    var Table = (function (_super) {
        __extends(Table, _super);
        function Table(game, x, y, gameElementContainer, gameObjectConveyor, manager) {
            _super.call(this, game, x, y, 'TableClean');
            this.anchor.set(0.5);
            //this.scale.set(0.8);
            this._GameElementContainer = gameElementContainer;
            this._GameElementContainer.addChild(this);
            this._gameObjectConveyor = gameObjectConveyor;
            this._currentOrderLength = 0;
            this._manager = manager;
            this._tableIsBlocked = false;
            this._lastTableElementIsDroped = false;
            this.inputEnabled = true;
            this.events.onInputDown.add(this.listener, this);
            this._cellArray = [];
            this._cellArray.length = 3;
            for (var i = 0; i < 3; i++) {
                this._cellArray[i] = [];
                this._cellArray[i].length = 4;
            }
            for (var n = 0; n < 3; n++) {
                for (var i = 0; i < 4; i++) {
                    this._cellArray[n][i] = new Game.BasicCell(this.game, this.x, this.y, this._GameElementContainer, false, this);
                    this._cellArray[n][i].name = 'Cell_' + (i + n * 4 + n);
                    this._cellArray[n][i].scale.set(0.7, 0.7);
                    this._cellArray[n][i].x += -56 * 3 + (56 + 30) * i + 40; // Создамём полосу
                    this._cellArray[n][i].y += -56 * 2 + (56 + 30) * n + 25;
                }
            }
            this._tableOverlay = this.game.add.sprite(this.x, this.y, 'TableClean');
            this._tableOverlay.anchor.set(0.5);
            this._GameElementContainer.addChild(this._tableOverlay);
            this._tableOverlay.alpha = 0.5;
            this._tableOverlay.scale.set(0, 0);
        }
        Table.prototype.setOrder = function (orderArray) {
            for (var i = 0; i < orderArray.length; i++) {
                var cy = Math.floor(i / 4);
                var cx = i - 4 * cy;
                var correctObject = orderArray[i].split('_')[0];
                var correctColor = orderArray[i].split('_')[1];
                this._cellArray[cy][cx].loadCurrentTexture(correctObject, correctColor);
            }
            this._currentOrderLength = orderArray.length;
            this._gameObjectConveyor.addOrderObjects(orderArray);
            this.showOrderObjects();
        };
        Table.prototype.tableReady = function () {
            this._tableIsBlocked = false;
            this.tweenOverlayTable(true);
            for (var n = 0; n < 3; n++) {
                for (var m = 0; m < 4; m++) {
                    if (this._cellArray[n][m]._tableCellUsed) {
                        this._cellArray[n][m]._tableCellUsed = false;
                    }
                }
            }
        };
        Table.prototype.listener = function () {
            if (!this._tableIsBlocked) {
                var selectedArray = this._gameObjectConveyor._selectElementsArray;
                var goodOrderArray = [];
                var isGoodSelect = true;
                if (selectedArray.length > 0) {
                    var goodOrder = false;
                    for (var i = 0; i < selectedArray.length; i++) {
                        //console.log('I numb: '+i);
                        var missObjetc = true;
                        for (var n = 0; n < 3; n++) {
                            for (var m = 0; m < 4; m++) {
                                if (this._cellArray[n][m].key != 'CellClean' && this._cellArray[n][m].key == selectedArray[i].key && !this._cellArray[n][m]._tableCellUsed && this._cellArray[n][m].tint == selectedArray[i].tint) {
                                    goodOrderArray[goodOrderArray.length] = this._cellArray[n][m];
                                    this._cellArray[n][m]._tableCellUsed = true;
                                    missObjetc = false;
                                    break;
                                }
                                if (!missObjetc) {
                                    break;
                                }
                            }
                            if (!missObjetc) {
                                break;
                            }
                        }
                        if (missObjetc) {
                            var arraySelectNumb = selectedArray.length;
                            for (var x = 0; x < arraySelectNumb; x++) {
                                selectedArray[0].dropSelect();
                            }
                            var arrayToConveerOrderAdd = [];
                            for (var n = 0; n < 3; n++) {
                                for (var m = 0; m < 4; m++) {
                                    if (this._cellArray[n][m]._tableCellUsed) {
                                        this._cellArray[n][m]._tableCellUsed = false;
                                    }
                                    if (this._cellArray[n][m].key != 'CellClean' && this._cellArray[n][m]._mode == 'hide') {
                                        this._cellArray[n][m].hideShowCell('show');
                                        arrayToConveerOrderAdd[arrayToConveerOrderAdd.length] = this._cellArray[n][m]._currentTextureKey + '_' + this._cellArray[n][m].tint;
                                        this._currentOrderLength += 1;
                                    }
                                }
                            }
                            isGoodSelect = false;
                            if (arrayToConveerOrderAdd.length > 0) {
                                this._gameObjectConveyor.addOrderObjects(arrayToConveerOrderAdd);
                            }
                            break;
                        }
                    }
                    if (isGoodSelect) {
                        this._gameObjectConveyor.goodOrderSelect(selectedArray, goodOrderArray, this);
                        this._currentOrderLength -= goodOrderArray.length;
                        if (this._currentOrderLength == 0) {
                            this._tableIsBlocked = true;
                            this.tweenOverlayTable(false);
                            this._lastTableElementIsDroped = true;
                        }
                    }
                }
            }
        };
        Table.prototype.tweenOverlayTable = function (isHide) {
            if (isHide) {
                this.game.add.tween(this._tableOverlay.scale).to({ x: [this._tableOverlay.scale.x, 0], y: [this._tableOverlay.scale.y, 0] }, 100, Phaser.Easing.Linear.None, true);
            }
            else {
                this.game.add.tween(this._tableOverlay.scale).to({ x: [this._tableOverlay.scale.x, 1], y: [this._tableOverlay.scale.y, 1] }, 100, Phaser.Easing.Linear.None, true, 400);
            }
        };
        Table.prototype.showOrderObjects = function () {
            for (var n = 0; n < 3; n++) {
                for (var m = 0; m < 4; m++) {
                    if (this._cellArray[n][m].key != 'CellClean' && this._cellArray[n][m]._mode == 'hide') {
                        this._cellArray[n][m].hideShowCell('show');
                    }
                }
            }
        };
        Table.prototype.currentCellInHide = function () {
            this._lastTableElementIsDroped = false;
            this._manager.getOrderFromTable(this);
        };
        Table.prototype.update = function () {
        };
        return Table;
    }(Phaser.Sprite));
    Game.Table = Table;
})(Game || (Game = {}));
//# sourceMappingURL=Table.js.map