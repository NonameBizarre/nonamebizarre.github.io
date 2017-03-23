var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game;
(function (Game) {
    var Cell = (function (_super) {
        __extends(Cell, _super);
        function Cell(game, cx, cy, container, color) {
            _super.call(this, game, 0, 0);
            this.mark = false;
            this._check = false;
            this.anchor.set(0.5);
            this.setPosition(cx, cy);
            var hf = -Game.BaseLevel.LOCAL_CELL_SIZE * 0.5;
            this._bodySprite = game.add.sprite(0, -hf);
            this._bodySprite.anchor.set(0.5, 1.0);
            this.addChild(this._bodySprite);
            this._curTween = game.add.tween(this._bodySprite.scale).to({ x: 1.02, y: 0.98 }, 400, Phaser.Easing.Sinusoidal.Out, true, Math.random() * 0.2, -1, true);
            this._container = container;
            this._cx = cx;
            this._cy = cy;
            this._isSwap = false;
            this.stopUpdate = false;
            this.color = color;
            this._visual = game.add.image(0, hf, "gameplay", "monster_body0000");
            this._visual.anchor.set(0.5);
            this._bodySprite.addChild(this._visual);
            this._mouth = game.add.sprite(0, hf, "gameplay");
            this._mouth.anchor.set(0.5);
            this._mouth.animations.add("idle", Phaser.Animation.generateFrameNames("mouth_0" + this.color, 0, 0, "", 4), 12, false);
            this._mouth.animations.add("m1", Phaser.Animation.generateFrameNames("mouth_0" + this.color, 0, 15, "", 4), 12, false);
            this._mouth.animations.add("m2", Phaser.Animation.generateFrameNames("mouth_0" + this.color, 16, 30, "", 4), 12, false);
            this._mouth.animations.play("idle");
            this._eyes = game.add.sprite(0, hf, "gameplay");
            this._eyes.anchor.set(0.5);
            this._bodySprite.addChild(this._eyes);
            this._bodySprite.addChild(this._mouth);
            this._eyes.animations.add("idle", Phaser.Animation.generateFrameNames("eyes_0" + this.color, 0, 0, "", 4), 12, false);
            this._eyes.animations.add("e1", Phaser.Animation.generateFrameNames("eyes_0" + this.color, 0, 5, "", 4), 12, false);
            this._eyes.animations.add("e2", Phaser.Animation.generateFrameNames("eyes_0" + this.color, 6, 23, "", 4), 12, false);
            this._eyes.animations.add("e3", Phaser.Animation.generateFrameNames("eyes_0" + this.color, 24, 28, "", 4), 12, false);
            // this._eyes.animations.add("e_hit", Phaser.Animation.generateFrameNames("eyes_01", 29, 31, "", 4), 12, false);
            this._eyes.animations.play("idle");
            this._selected = game.add.image(0, hf, "gameplay", "selectedCell0000");
            this._selected.anchor.set(0.5);
            this._selected.visible = false;
            this._bodySprite.addChild(this._selected);
            this._visual.frameName = "monster_body000" + (this.color - 1); //Math.floor(Math.random()*6);
            this._speed = Cell.SPEED_FALL;
            this._mouthTimer = Math.random() * 400;
            this._eyesTimer = Math.random() * 200;
            this._iFall = true;
        }
        Cell.prototype.fall_animation = function () {
            if (this._iFall) {
            }
            this._iFall = true;
            this._mouthTimer = 400 + Math.random() * 400;
            this._eyesTimer = 200 + Math.random() * 200;
            this._mouth.animations.stop();
            this._eyes.animations.stop();
            this._mouth.animations.play("m2");
            this._eyes.animations.play("e3");
        };
        Cell.prototype.canCheck = function () {
            if (this._iFall || this._isSwap)
                return false;
            return true;
        };
        Cell.prototype.checkCombination = function () {
            console.log(this._container.checkBoardHorizont(this.cx, this.cy));
        };
        Cell.prototype.update = function () {
            var _this = this;
            if (this.stopUpdate) {
                return;
            }
            if (this._mouthTimer <= 0) {
                this._mouth.animations.play("m1");
                this._mouthTimer = 400 + Math.random() * 400;
            }
            else {
                this._mouthTimer--;
            }
            if (this._eyesTimer <= 0) {
                var ind = Math.floor(Math.random() * 2.5 + 1);
                this._eyes.animations.play("e" + ind);
                this._eyesTimer = 200 + Math.random() * 200;
            }
            else {
                this._eyesTimer--;
            }
            var posx = (this._cx - 4 + 1.5) * Game.BaseLevel.LOCAL_CELL_SIZE + Game.BaseLevel.LOCAL_CELL_SIZE * 0.5;
            var posy = (this._cy - 4 + 0.5) * Game.BaseLevel.LOCAL_CELL_SIZE;
            var speed = this._speed;
            //this._speed += 0.15;
            var noX = true;
            if (this._selected.visible)
                return;
            if (this.x < posx) {
                this.x += speed;
                if (this.x > posx) {
                    this.x = posx;
                    this._isSwap = false;
                    this.fall_animation();
                    if (this._check) {
                        this.checkCombination();
                        this._check = false;
                    }
                }
                noX = false;
            }
            else if (this.x > posx) {
                this.x -= speed;
                if (this.x < posx) {
                    this.x = posx;
                    this._isSwap = false;
                    this.fall_animation();
                    if (this._check) {
                        this.checkCombination();
                        this._check = false;
                    }
                }
                noX = false;
            }
            if (noX) {
                if (this.y < posy) {
                    this.y += speed;
                    if (this.y > posy) {
                        this.y = posy;
                        this._isSwap = false;
                        // this._iFall = false;
                        this._curTween.stop();
                        this.fall_animation();
                        if (this._check) {
                            this.checkCombination();
                            this._check = false;
                        }
                        this._curTween = this.game.add.tween(this._bodySprite.scale).to({ x: 1.1, y: 0.9 }, 120, Phaser.Easing.Sinusoidal.Out, true, 0, 0, true);
                        this._curTween.onComplete.add(function () {
                            _this._bodySprite.scale.x = 1.0;
                            _this._bodySprite.scale.y = 1.0;
                            _this._curTween = _this.game.add.tween(_this._bodySprite.scale).to({ x: 1.02, y: 0.98 }, 400, Phaser.Easing.Sinusoidal.Out, true, Math.random() * 0.2, -1, true);
                        }, this);
                    }
                }
                else if (this.y > posy) {
                    this.y -= speed;
                    if (this.y < posy) {
                        this.y = posy;
                        this._isSwap = false;
                        if (this._check) {
                            this.checkCombination();
                            this._check = false;
                        }
                    }
                }
                else {
                    this._isSwap = false;
                }
            }
            if (this._cy < 7 && this._isSwap == false) {
                if (this._container.container[this._cx][this._cy + 1] == null) {
                    this._container.container[this._cx][this._cy + 1] = this;
                    this._container.container[this._cx][this._cy] = null;
                    this._cy++;
                }
            }
        };
        Cell.prototype.setCell = function (cx, cy) {
            if (this._container.container && this._container.container[this._cx][this._cy] == this) {
                this._container.container[this._cx][this._cy] = null;
                this._container.container[cx][cy] = this;
                this._isSwap = true;
            }
            this._cx = cx;
            this._cy = cy;
        };
        Cell.prototype.swap = function (dx, dy, delta) {
            if (delta === void 0) { delta = false; }
            var vx = dx; //this.cx + dx;
            var vy = dy; //this.cy + dy;
            if (delta) {
                vx = this.cx + dx;
                vy = this.cy + dy;
            }
            if (vx == this.cx && vy == this.cy) {
                return;
            }
            // cx < 6 && cy < 8
            if (vx < 0 || vy < 0)
                return;
            if (vx > 4 || vy > 7)
                return;
            this._check = true;
            if (this._container.container[vx][vy]) {
                var vc = this._container.container[vx][vy];
                this._isSwap = true;
                vc._isSwap = true;
                vc._cx = this._cx;
                vc._cy = this._cy;
                this._cx = vx;
                this._cy = vy;
                this._container.container[vx][vy] = this;
                this._container.container[vc._cx][vc._cy] = vc;
            }
            else {
                this.setCell(vx, vy);
            }
        };
        Cell.prototype.setPosition = function (cx, cy) {
            this.x = (cx - 4 + 1.5) * Game.BaseLevel.LOCAL_CELL_SIZE + Game.BaseLevel.LOCAL_CELL_SIZE * 0.5;
            this.y = (cy - 4 + 0.5) * Game.BaseLevel.LOCAL_CELL_SIZE;
        };
        Cell.prototype.baseX = function () {
            return (this.cx - 4 + 1.5) * Game.BaseLevel.LOCAL_CELL_SIZE + Game.BaseLevel.LOCAL_CELL_SIZE * 0.5;
        };
        Cell.prototype.baseY = function () {
            return (this.cy - 4 + 0.5) * Game.BaseLevel.LOCAL_CELL_SIZE;
        };
        Object.defineProperty(Cell.prototype, "selected", {
            /*
                    static coordToCell(x: number, y: number):Object{
                        let yy: number = Math.floor(y / 100);
                        let xx: number =
                        return {x: xx, y: yy};
                    }
            */
            set: function (value) {
                this._selected.visible = value;
                this.stopUpdate = value;
                if (value) {
                    this.game.add.tween(this.scale).to({ x: 1.1, y: 1.1 }, 500, Phaser.Easing.Elastic.Out, true);
                }
                else {
                    this.game.add.tween(this.scale).to({ x: 1.0, y: 1.0 }, 800, Phaser.Easing.Elastic.Out, true);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cell.prototype, "cx", {
            get: function () {
                return this._cx;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cell.prototype, "cy", {
            get: function () {
                return this._cy;
            },
            enumerable: true,
            configurable: true
        });
        Cell.SPEED_FALL = 18;
        return Cell;
    }(Phaser.Sprite));
    Game.Cell = Cell;
})(Game || (Game = {}));
//# sourceMappingURL=Cell.js.map