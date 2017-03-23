var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game;
(function (Game) {
    var BaseLevel = (function (_super) {
        __extends(BaseLevel, _super);
        function BaseLevel() {
            _super.apply(this, arguments);
            this._dx = 0;
            this._dy = 0;
        }
        /*
                private _logoContainer: OSprite;
                private _logo: Phaser.Image;
        
                private _playBtnContainer: OSprite;
                private _playBtn: Phaser.Image;
        
                private _menuBtnContainer: OSprite;
                private _menuBtn: Phaser.Image;
        */
        BaseLevel.prototype.create = function () {
            //  console.log("Base level created");
            this.game.stage.backgroundColor = 0x075C82;
            var newBG = this.game.add.sprite(400, 640, "player");
            this._bg = new Game.OSprite(this.game, 400, 640, "gameplay", "bg0000");
            this._bg.setLandscapePosition(640, 400 - 120);
            this._bg.setWideMode(true, true);
            this._cellsContainer = new Game.OSprite(this.game, 400, 640 + 100);
            this._cellsContainer.setLandscapePosition(640, 400);
            this._cellsContainer.setCustomScale(1.0, 0.75, true);
            //this._cellsContainer.setWideMode(true, true);
            this._cells = this.game.add.image(0, 0, "gameplay", "cells0000");
            this._cells.anchor.set(0.5);
            this._cellsContainer.addChild(this._cells);
            this._cells.inputEnabled = true;
            this._cells.events.onInputDown.add(this.mouseDown, this);
            this._cells.events.onInputUp.add(this.mouseUp, this);
            this.input.onUp.add(function () {
                /*
                if (this._nextDude) this._nextDude.stopUpdate = false;
                if (this._selectedDude) this._selectedDude.selected = false;
                this._nextDude = null;
                this._selectedDude = null;
                */
            }, this);
            this._dudes = [];
            this._dudes.length = 5;
            for (var i = 0; i < 5; i++) {
                this._dudes[i] = [];
                this._dudes[i].length = 8;
            }
            this._selectedDude = null;
            this._nextDude = null;
            this.addCell(1, 7, 1);
            this.addCell(3, 7, 1);
            this.addCell(4, 7, 1);
            /*
                        this._logoContainer = new OSprite(this.game, 414, 303);
                        this._logoContainer.setLandscapePosition(650, 191, true);
                        //this._logoContainer.setLPScale(1.0, 1.2, true);
            
                        this._logo = this.game.add.image(0, 0, "test2", "logo20000");
                        this._logo.anchor.set(0.5);
                        this._logoContainer.addChild(this._logo);
            
                        this._playBtnContainer = new OSprite(this.game, 412, 875);
                        this._playBtnContainer.setLandscapePosition(652, 590, true);
            
                        this._playBtn = this.game.add.image(0, 0, "test2", "play0000");
                        this._playBtn.anchor.set(0.5);
                        this._playBtnContainer.addChild(this._playBtn);
            
                        this._menuBtnContainer = new OSprite(this.game);
                        this._menuBtnContainer.setLeftOffset(-26 + 162 * 0.5);
                        this._menuBtnContainer.setBottomOffset(25 - 154 * 0.5, true);
            
                        this._menuBtn = this.game.add.image(0, 0, "test2", "btnmenu0000");
                        this._menuBtn.anchor.set(0.5);
                        this._menuBtnContainer.addChild(this._menuBtn);
            */
        };
        BaseLevel.prototype.addCell = function (cx, cy, color) {
            var c = new Game.Cell(this.game, cx, cy, this, color);
            this._dudes[cx][cy] = c;
            // c.setPosition(cx, cy - 1); 
            this._cellsContainer.addChild(c);
        };
        /*
                checkBoardVert(cx: number, cy: number){
                    let count;
                    if (this._dudes[cx][cy] != null && this._dudes[cx][cy].canCheck()){
                        let color: number = this._dudes[cx][cy].color;
                        count = 1;
                        for (let i: number = cy-1; i >= 0; i --){
                            if (this._dudes[cx][i] != null && this._dudes[cx][i].canCheck() && this._dudes[cx][i].color == color){
                                count ++;
                            } else {
                                return count;
                            }
                        }
                    }
        
                    return count;
                }
            */
        BaseLevel.prototype.checkBoardHorizont = function (cx, cy) {
            var res = [{ x: cx, y: cy }];
            var color = this._dudes[cx][cy].color;
            /*
                        let s = "";
                        for (let i: number = 0; i < 5; i++){
                            console.log(i, this._dudes[i][cy]?this._dudes[i][cy].color:null)
                        }
            
                        console.log("-------------------------")
                    */
            for (var i = cx - 1; i >= 0; i--) {
                if (this._dudes[i][cy] != null) {
                    if (this._dudes[i][cy].color == color) {
                        res.push({ x: i, y: cy });
                    }
                    else {
                        break;
                    }
                }
                else
                    break;
            }
            for (var i = cx + 1; i < this._dudes.length; i++) {
                if (this._dudes[i][cy] != null) {
                    if (this._dudes[i][cy].color == color) {
                        res.push({ x: i, y: cy });
                    }
                    else {
                        break;
                    }
                }
                else
                    break;
            }
            if (res.length < 3) {
                res = null;
            }
            return res;
        };
        BaseLevel.prototype.update = function () {
            for (var i = 0; i < this._dudes.length; i++) {
                for (var j = 0; j < this._dudes[i].length; j++) {
                    if (this._dudes[i][j] != null) {
                        this._dudes[i][j].update();
                    }
                }
            }
            if (this._selectedDude != null) {
                var scale = this._cellsContainer.getCustomScale();
                var xx = this.game.device.desktop ? this.game.input.mousePointer.x : this.game.input.pointer1.x;
                var yy = this.game.device.desktop ? this.game.input.mousePointer.y : this.game.input.pointer1.y;
                var dx = Math.max(-125, Math.min(125, (xx - this._cellsContainer.x) / scale - this._selectedDude.baseX()));
                var dy = Math.max(-125, Math.min(125, (yy - this._cellsContainer.y) / scale - this._selectedDude.baseY()));
                var cdx = Math.abs(dx) > Math.abs(dy) ? dx : 0;
                var cdy = Math.abs(dy) > Math.abs(dx) ? dy : 0;
                cdx = (cdx != 0 ? cdx / Math.abs(cdx) : 0);
                cdy = (cdy != 0 ? cdy / Math.abs(cdy) : 0);
                var cx = this._selectedDude.cx + cdx;
                var cy = this._selectedDude.cy + cdy;
                if (cx >= 0 && cy >= 0 && cx < 5 && cy < 8) {
                    if (this._nextDude) {
                        this._nextDude.stopUpdate = false;
                    }
                    if (this._dudes[cx][cy] != null) {
                        this._nextDude = this._dudes[cx][cy];
                        this._nextDude.stopUpdate = true;
                    }
                    else {
                        this._nextDude = null;
                    }
                }
                else {
                    return;
                }
                if (this._nextDude) {
                    var coefX = Math.abs(this._selectedDude.cx - this._nextDude.cx);
                    var coefY = Math.abs(this._selectedDude.cy - this._nextDude.cy);
                    this._selectedDude.x = Math.floor(this._selectedDude.baseX() + dx * coefX);
                    this._nextDude.x = Math.floor(this._nextDude.baseX() - dx * coefX);
                    this._selectedDude.y = Math.floor(this._selectedDude.baseY() + dy * coefY);
                    this._nextDude.y = Math.floor(this._nextDude.baseY() - dy * coefY);
                    this._dx = Math.abs(dx * coefX);
                    this._dy = Math.abs(dy * coefY);
                }
                else {
                    cdx = cdx ? 1 : 0;
                    cdy = cdy ? 1 : 0;
                    this._selectedDude.x = this._selectedDude.baseX() + dx * cdx;
                    this._selectedDude.y = this._selectedDude.baseY() + dy * cdy;
                    this._dx = Math.abs(dx * cdx);
                    this._dy = Math.abs(dy * cdy);
                }
            }
        };
        BaseLevel.prototype.mouseDown = function (sprite, pointer) {
            var scale = this._cellsContainer.getCustomScale();
            var custom_scale = BaseLevel.LOCAL_CELL_SIZE * scale;
            var cx = Math.floor((pointer.x - this._cellsContainer.x + BaseLevel.BOARD_WIDTH_HALF * scale) / custom_scale);
            var cy = Math.floor((pointer.y - this._cellsContainer.y + BaseLevel.BOARD_HEIGHT_HALF * scale) / custom_scale);
            if (this._selectedDude != null) {
                this._selectedDude.selected = false;
            }
            this._selectedDude = null;
            if (cx > 0 && cy > 0 && cx < 6 && cy < 8) {
                if (this._dudes[cx - 1][cy] != null) {
                    this._selectedDude = this._dudes[cx - 1][cy];
                    this._selectedDude.selected = true;
                    this._cellsContainer.removeChild(this._selectedDude);
                    this._cellsContainer.addChild(this._selectedDude);
                }
            }
        };
        BaseLevel.prototype.mouseUp = function (sprite, pointer) {
            if (this._selectedDude == null)
                return;
            var scale = this._cellsContainer.getCustomScale();
            var custom_scale = BaseLevel.LOCAL_CELL_SIZE * scale;
            var cx = Math.floor((pointer.x - this._cellsContainer.x + BaseLevel.BOARD_WIDTH_HALF * scale) / custom_scale);
            var cy = Math.floor((pointer.y - this._cellsContainer.y + BaseLevel.BOARD_HEIGHT_HALF * scale) / custom_scale);
            this._selectedDude.selected = false;
            if (this._nextDude) {
                this._nextDude.stopUpdate = false;
                if (this._dx > 50 || this._dy > 50) {
                    this._selectedDude.swap(this._nextDude.cx, this._nextDude.cy);
                }
            }
            else {
                // if (cx > 0 && cy > 0 && cx < 6 && cy < 8){
                var dx = this._selectedDude.cx - cx + 1;
                var dy = this._selectedDude.cy - cy;
                dx = dx ? dx / Math.abs(dx) : 0;
                dy = dy ? dy / Math.abs(dy) : 0;
                if (dx * dy != 0) {
                    dx = Math.abs(dx) > Math.abs(dy) ? dx : 0;
                    dy = Math.abs(dy) > Math.abs(dx) ? dy : 0;
                }
                this._selectedDude.swap(-dx, -dy, true);
            }
            if (this._selectedDude)
                this._selectedDude.selected = false;
            this._nextDude = null;
            this._selectedDude = null;
        };
        Object.defineProperty(BaseLevel.prototype, "container", {
            get: function () {
                return this._dudes;
            },
            enumerable: true,
            configurable: true
        });
        BaseLevel.LOCAL_CELL_SIZE = 125;
        BaseLevel.BOARD_WIDTH_HALF = 7 * BaseLevel.LOCAL_CELL_SIZE * 0.5;
        BaseLevel.BOARD_HEIGHT_HALF = 8 * BaseLevel.LOCAL_CELL_SIZE * 0.5;
        return BaseLevel;
    }(Phaser.State));
    Game.BaseLevel = BaseLevel;
})(Game || (Game = {}));
//# sourceMappingURL=BaseLevel.js.map