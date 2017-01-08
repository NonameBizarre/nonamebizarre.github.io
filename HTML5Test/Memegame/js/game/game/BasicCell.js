var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game;
(function (Game) {
    var BasicCell = (function (_super) {
        __extends(BasicCell, _super);
        function BasicCell(game, x, y, gameElementContainer, isSelectble, parentObject) {
            _super.call(this, game, x, y, 'CellClean');
            this.anchor.set(0.5);
            this._GameElementContainer = gameElementContainer;
            this._GameElementContainer.addChild(this);
            this._currentTextureKey = 'CellClean';
            this._parentObject = parentObject;
            this._mode = 'show';
            this._tableCellUsed = false;
            this._isSelect = false;
            this._isSelectble = isSelectble;
            if (this._isSelectble) {
                this.inputEnabled = true;
                this.events.onInputDown.add(this.listener, this);
            }
        }
        BasicCell.prototype.loadCurrentTexture = function (textureKey) {
            this._currentTextureKey = textureKey;
            this.loadTexture(this._currentTextureKey);
        };
        BasicCell.prototype.setDefoultVisible = function () {
            if (this.alpha != 0) {
                this.alpha = 1;
            }
        };
        BasicCell.prototype.goodOrederCall = function (currentCell, tableObject) {
            this.dropSelect();
            this.alpha = 1;
            var aninObject = new Game.AnimationCell(this.game, this.x, this.y, this._GameElementContainer, this._currentTextureKey, tableObject, currentCell);
            this.loadCurrentTexture('CellClean');
        };
        BasicCell.prototype.dropSelect = function () {
            if (this._isSelect) {
                this.setDefoultVisible();
                this._isSelect = false;
                this._parentObject.selectObjectsAddRemove(this, 'remove');
            }
        };
        BasicCell.prototype.listener = function () {
            if (this.key != 'CellClean') {
                this.game.add.tween(this.scale).to({ x: [this.scale.x, 0.7], y: [this.scale.y, 0.7] }, 100, Phaser.Easing.Back.Out, true).onComplete.add(this.onCompliteSelect, this);
            }
        };
        BasicCell.prototype.onCompliteSelect = function () {
            this.game.add.tween(this.scale).to({ x: [this.scale.x, 1], y: [this.scale.y, 1] }, 200, Phaser.Easing.Back.Out, true);
            if (this._isSelect) {
                this.alpha = 1;
                this._isSelect = false;
                this._parentObject.selectObjectsAddRemove(this, 'remove');
            }
            else {
                this.alpha = 0.5;
                this._isSelect = true;
                this._parentObject.selectObjectsAddRemove(this, 'add');
            }
        };
        BasicCell.prototype.tellTableFromCellIsHide = function () {
            if (this._parentObject._lastTableElementIsDroped)
                this._parentObject.currentCellInHide();
        };
        BasicCell.prototype.hideShowCell = function (mode) {
            switch (mode) {
                case 'hide':
                    if (this._mode != mode) {
                        this._mode = mode;
                        this.game.add.tween(this.scale).to({ x: [this.scale.x, 0], y: [this.scale.y, 0] }, 100, Phaser.Easing.Back.Out, true).onComplete.add(this.tellTableFromCellIsHide, this);
                    }
                    break;
                case 'show':
                    if (this._mode != mode) {
                        this._mode = mode;
                        this.game.add.tween(this.scale).to({ x: [this.scale.x, 0.7], y: [this.scale.y, 0.7] }, 100, Phaser.Easing.Back.Out, true);
                    }
                    break;
            }
        };
        return BasicCell;
    }(Phaser.Sprite));
    Game.BasicCell = BasicCell;
})(Game || (Game = {}));
//# sourceMappingURL=BasicCell.js.map