var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var GameUI = (function (_super) {
        __extends(GameUI, _super);
        function GameUI(game, baseGame) {
            var _this = _super.call(this, game, 0.0, 0.0) || this;
            _this._baseGame = baseGame;
            return _this;
        }
        GameUI.prototype.init = function () {
            this._player = null;
            this._iceKing = null;
            this._score = 0;
            this._levelOrb = 0;
        };
        Object.defineProperty(GameUI.prototype, "player", {
            set: function (player) {
                this._player = player;
            },
            enumerable: true,
            configurable: true
        });
        GameUI.prototype.setEnemy = function (_iceKing) {
            this._iceKing = _iceKing;
        };
        GameUI.prototype.checkDangers = function (cx, cy) {
            if (this._player && this._player.cx == cx && this._player.cy == cy && this._player.canMove)
                this._player.hit();
            if (this._iceKing && this._iceKing.cx == cx && this._iceKing.cy == cy && this._iceKing.canMove)
                this._iceKing.hit();
        };
        GameUI.prototype.addPowerUP = function () {
            this._score += 2;
        };
        GameUI.prototype.checkPlayer = function () {
            if (this._player && this._player.imBooked(this._iceKing.cx, this._iceKing.cy)) {
                this._player.hit();
                this._iceKing.fight();
            }
        };
        GameUI.prototype.addScore = function () {
            this._score++;
            this._levelOrb--;
            if (this._levelOrb == 0)
                this._player.gameWin();
        };
        GameUI.prototype.gameOver = function () {
        };
        GameUI.prototype.gameWin = function () {
            var _this = this;
            console.log("WIN!");
            setTimeout(function () {
                _this._baseGame.newLevel();
            }, 600);
        };
        Object.defineProperty(GameUI.prototype, "levelOrb", {
            set: function (value) {
                this._levelOrb = value;
            },
            enumerable: true,
            configurable: true
        });
        return GameUI;
    }(Phaser.Sprite));
    TProject.GameUI = GameUI;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var Coord3D = (function () {
        function Coord3D(x, y, scale) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (scale === void 0) { scale = 0; }
            this.x = x;
            this.y = y;
            this.scale = scale;
        }
        return Coord3D;
    }());
    TProject.Coord3D = Coord3D;
    var GridCell = (function () {
        function GridCell(type, powerUps, visual, mark) {
            if (type === void 0) { type = 0; }
            if (powerUps === void 0) { powerUps = 0; }
            if (visual === void 0) { visual = null; }
            if (mark === void 0) { mark = -1; }
            this.type = type;
            this.powerUps = powerUps;
            this.visual = visual;
            this.mark = mark;
        }
        return GridCell;
    }());
    TProject.GridCell = GridCell;
    var PathPoint = (function () {
        function PathPoint(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        return PathPoint;
    }());
    TProject.PathPoint = PathPoint;
    var Grid = (function (_super) {
        __extends(Grid, _super);
        function Grid(game) {
            var _this = _super.call(this, game, 0.0, 0.0) || this;
            Grid._varCoord3D = new Coord3D();
            return _this;
        }
        Grid.prototype.init = function (gameUI) {
            this._map = [];
            this._bonfireArray = [];
            this._spikesArray = [];
            this._switchArray = [];
            this._totalOrb = 0;
            this._spikesOn = false;
            this._bonfireTimer = -100;
            this._gameUI = gameUI;
            for (var yy = 0; yy < Grid.MAP_HEIGHT; yy++) {
                this._map[yy] = [];
                for (var xx = 0; xx < Grid.MAP_WIDTH; xx++) {
                    this._map[yy][xx] = new GridCell();
                }
            }
        };
        Grid.prototype.clear = function () {
            this._bonfireArray = [];
            this._spikesArray = [];
            this._switchArray = [];
            this._totalOrb = 0;
            this._spikesOn = false;
            for (var yy = 0; yy < Grid.MAP_HEIGHT; yy++) {
                for (var xx = 0; xx < Grid.MAP_WIDTH; xx++) {
                    this.removeChild(this._map[yy][xx].visual);
                    this._map[yy][xx].visual = null;
                    this._map[yy][xx].powerUps = 0;
                    this._map[yy][xx].type = 0;
                }
            }
        };
        Grid.prototype.load = function (grid, powerUpsArray, onComplete) {
            var tween;
            var powerUpArray = [];
            for (var yy = 0; yy < Grid.MAP_HEIGHT; yy++) {
                for (var xx = 0; xx < Grid.MAP_WIDTH; xx++) {
                    this._map[yy][xx].type = grid[yy][xx];
                    this._map[yy][xx].powerUps = powerUpsArray[yy][xx];
                    if (grid[yy][xx] == 1)
                        this._totalOrb++;
                    if (grid[yy][xx] == 5)
                        this._bonfireArray.push(new Phaser.Point(xx, yy));
                    if (grid[yy][xx] == 6)
                        this._spikesArray.push(new Phaser.Point(xx, yy));
                    if (grid[yy][xx] == 7)
                        this._switchArray.push(new Phaser.Point(xx, yy));
                    if (grid[yy][xx] == 0) {
                        continue;
                    }
                    this._map[yy][xx].visual = new TProject.Platform(this.game, grid[yy][xx], xx, yy);
                    if (powerUpsArray[yy][xx] != 0) {
                        this._map[yy][xx].visual.setPowerUp(powerUpsArray[yy][xx]);
                        powerUpArray[powerUpArray.length] = this._map[yy][xx].visual;
                    }
                    var zPos = 100 - ((100 / 7) * yy);
                    var scaleRatio = Grid.FOCAL_LENGTH / (Grid.FOCAL_LENGTH + zPos);
                    var pos3d = Grid.get3DCoordinate(xx, yy);
                    this._map[yy][xx].visual.x = pos3d.x;
                    this._map[yy][xx].visual.y = pos3d.y;
                    this._map[yy][xx].visual.alpha = 0;
                    this._map[yy][xx].visual.scale.x = this._map[yy][xx].visual.scale.y = pos3d.scale;
                    this.addChild(this._map[yy][xx].visual);
                }
            }
            var h = grid.length;
            var w = grid[0].length;
            var wait = 0;
            var animation_time = 150;
            var dy = 20;
            for (var p = 0; p < h + w - 1; p++) {
                var flag = false;
                for (var q = Math.max(p - h + 1, 0); q < Math.min(p + 1, w); q++) {
                    if (grid[p - q][q] != 0) {
                        flag = true;
                        var visual = this._map[p - q][q].visual;
                        var y = visual.y;
                        visual.y = y + dy;
                        tween = this.game.add.tween(visual).to({ alpha: 1, y: y }, animation_time, Phaser.Easing.Linear.None, true, animation_time * wait * 3 / 4);
                        tween.start();
                    }
                }
                if (flag) {
                    wait++;
                }
            }
            for (var i = 0; i < powerUpArray.length; i++) {
                powerUpArray[i].setPowerUpAnumbtion(animation_time * wait * 3 / 4 + 150 * i);
            }
            if (onComplete)
                tween.onComplete.add(onComplete);
            this._gameUI.levelOrb = this._totalOrb;
            if (this._bonfireArray.length > 0) {
                this._bonfireTimer = 2.0;
                for (var i = 0; i < this._bonfireArray.length; i++) {
                    if (this.game.rnd.integerInRange(1, 2) % 2 == 0) {
                        this._map[this._bonfireArray[i].y][this._bonfireArray[i].x].visual.bonfireStatus = true;
                    }
                    else {
                        this._map[this._bonfireArray[i].y][this._bonfireArray[i].x].visual.bonfireStatus = false;
                    }
                }
            }
        };
        Grid.prototype.hide = function () {
            this.alpha = 0;
        };
        Grid.prototype.simpleShow = function () {
            this.alpha = 1;
        };
        Grid.prototype.timerUpdate = function () {
            var dt = this.game.time.elapsed / 1000;
            if (dt > 0.02) {
                dt = 0.02;
            }
            this._bonfireTimer -= dt;
            if (this._bonfireTimer < 0 && this._bonfireTimer > -100) {
                TProject.SoundMixer.playSound("burnOver");
                this._bonfireTimer = 2.0;
                for (var i = 0; i < this._bonfireArray.length; i++) {
                    this._map[this._bonfireArray[i].y][this._bonfireArray[i].x].visual.igniteFire();
                    if (this._map[this._bonfireArray[i].y][this._bonfireArray[i].x].visual.dangers) {
                        this._gameUI.checkDangers(this._bonfireArray[i].x, this._bonfireArray[i].y);
                    }
                }
            }
            for (var yy = 0; yy < Grid.MAP_HEIGHT; yy++) {
                for (var xx = 0; xx < Grid.MAP_WIDTH; xx++) {
                    if (this._map[yy][xx].visual) {
                        this._map[yy][xx].visual.hoopCheker();
                    }
                }
            }
        };
        Grid.prototype.getDistance = function (bx, by, ex, ey) {
            var dx = ex - bx;
            var dy = ey - by;
            return Math.sqrt(dx * dx + dy * dy);
        };
        Grid.prototype.findNextCellH = function (bx, by, ex, ey, max) {
            var left = this._map[by][bx - 1].type == 0 ? max : this.getDistance(bx - 1, by, ex, ey);
            var right = this._map[by][bx + 1].type == 0 ? max : this.getDistance(bx + 1, by, ex, ey);
            if (left < right) {
                return left == 0 ? -1 : -1 * left;
            }
            return right == 0 ? 1 : right;
        };
        Grid.prototype.findNextCellV = function (bx, by, ex, ey, max) {
            var up = this._map[by - 1][bx].type == 0 ? max : this.getDistance(bx, by - 1, ex, ey);
            var down = this._map[by + 1][bx].type == 0 ? max : this.getDistance(bx, by + 1, ex, ey);
            if (up < down) {
                return up == 0 ? -1 : -1 * up;
            }
            return down == 0 ? 1 : down;
        };
        Grid.prototype.findNextCell = function (bx, by, ex, ey, checkExit) {
            if (checkExit) {
                if (checkExit(bx, by)) {
                    return null;
                }
            }
            if (bx == ex && by == ey) {
                return null;
            }
            var max = 1000000;
            var res = new PathPoint(0, 0);
            res.x = bx != ex ? this.findNextCellH(bx, by, ex, ey, max) : max;
            res.y = by != ey ? this.findNextCellV(bx, by, ex, ey, max) : max;
            if (res.x < res.y) {
                if (res.x == max || res.x == 0) {
                    res.x = 0;
                }
                else {
                    res.x = res.x < 0 ? -1 : 1;
                }
                res.y = 0;
            }
            else {
                if (res.y == max || res.y == 0) {
                    res.y = 0;
                }
                else {
                    res.y = res.y < 0 ? -1 : 1;
                }
                res.x = 0;
            }
            return res;
        };
        Grid.prototype.pathFind = function (bx, by, ex, ey, cb) {
            var easystar = new EasyStar.js();
            var level = [];
            for (var yy = 0; yy < Grid.MAP_HEIGHT; yy++) {
                level[yy] = [];
                for (var xx = 0; xx < Grid.MAP_WIDTH; xx++) {
                    level[yy][xx] = 1;
                    if (this._map[yy][xx].type == 0) {
                        level[yy][xx] = 0;
                    }
                }
            }
            easystar.setGrid(level);
            easystar.setAcceptableTiles([1]);
            easystar.findPath(bx, by, ex, ey, cb);
            easystar.calculate();
            return null;
        };
        Grid.prototype.getMapValue = function (cx, cy) {
            if (cx < 0 || cy < 0 || cx >= Grid.MAP_WIDTH || cy >= Grid.MAP_HEIGHT) {
                return 0;
            }
            return this._map[cy][cx].type;
        };
        Grid.prototype.splashInPlatform = function (cx, cy, x, y, scale) {
            var splash = this.game.add.sprite(x - 10, y + 100, "Objects", "splash_10001");
            splash.anchor.set(0.5, 1);
            splash.scale.set(scale, scale);
            splash.animations.add("splash", Phaser.Animation.generateFrameNames("splash_", 10001, 10017), 24, false);
            splash.animations.play("splash", 24, false, true);
            console.log(cx, cy);
            var index = 0;
            var _cx = cx;
            var splashInBack = true;
            if (cy < 0) {
                index = 0;
            }
            else if (cy >= Grid.MAP_HEIGHT) {
                index = this.children.length;
            }
            else {
                for (var n = 0; n < Grid.MAP_WIDTH; n++) {
                    if (this._map[cy][n].visual) {
                        splashInBack = false;
                        break;
                    }
                }
                if (!splashInBack) {
                    for (var i = 0; i < Grid.MAP_WIDTH; i++) {
                        if (this._map[cy][_cx].visual) {
                            break;
                        }
                        else {
                            if (this._map[cy][_cx + 1].visual) {
                                _cx++;
                                break;
                            }
                            else if (this._map[cy][_cx - 1].visual) {
                                _cx--;
                                break;
                            }
                            _cx++;
                        }
                    }
                    index = this.getChildIndex(this._map[cy][_cx].visual) + 1;
                }
            }
            this.addChildAt(splash, index);
            TProject.SoundMixer.playSound("fallInWater");
        };
        Grid.prototype.getPowerUpValue = function (cx, cy) {
            if (cx < 0 || cy < 0 || cx >= Grid.MAP_WIDTH || cy >= Grid.MAP_HEIGHT) {
                return 0;
            }
            return this._map[cy][cx].powerUps;
        };
        Grid.prototype.actionOnPlatformStep = function (cx, cy, isPlayer, character) {
            var _this = this;
            if (cx < 0 || cy < 0 || cx >= Grid.MAP_WIDTH || cy >= Grid.MAP_HEIGHT || this._map[cy][cx].type == 0) {
                character.hit(true);
                return;
            }
            this._map[cy][cx].visual.stepOnPlatform(isPlayer);
            if (isPlayer) {
                if (this._map[cy][cx].type == 1) {
                    TProject.SoundMixer.playSound("bounce");
                    TProject.SoundMixer.playSound("cheese");
                    this._gameUI.addScore();
                    this._map[cy][cx].type = 1.5;
                }
                else if (this._map[cy][cx].type == 4) {
                    this._gameUI.dropScoreModificator();
                    this._gameUI.rechangePath();
                    TProject.SoundMixer.playSound("bounce");
                    setTimeout(function () {
                        _this.startPlatformCrash(cx, cy);
                        _this._map[cy][cx].type = 0;
                    }, 500);
                }
                else if (this._map[cy][cx].type == 7) {
                    this._gameUI.dropScoreModificator();
                    TProject.SoundMixer.playSound("switch");
                    this.activateSpikes();
                }
                else if (this._map[cy][cx].type == 3) {
                    TProject.SoundMixer.playSound("cup");
                }
                else if (this._map[cy][cx].type == 2) {
                    TProject.SoundMixer.playSound("drum");
                }
                else {
                    this._gameUI.dropScoreModificator();
                    TProject.SoundMixer.playSound("bounce");
                }
                if (this._map[cy][cx].powerUps != 0) {
                    this._map[cy][cx].powerUps = 0;
                    this._gameUI.addPowerUP();
                    TProject.SoundMixer.playSound("powerUp");
                }
            }
            if (this._map[cy][cx].type == 6) {
                if (this._spikesOn) {
                    character.hit();
                    if (isPlayer) {
                        TProject.SoundMixer.playSound("screamBurn");
                    }
                    else {
                        TProject.SoundMixer.playSound("screamEnemy");
                    }
                }
            }
            else if (this._map[cy][cx].type == 5) {
                if (this._map[cy][cx].visual.dangers) {
                    character.hit();
                    if (isPlayer) {
                        TProject.SoundMixer.playSound("screamBurn");
                    }
                    else {
                        TProject.SoundMixer.playSound("screamEnemy");
                    }
                }
            }
        };
        Grid.prototype.activateSpikes = function () {
            var _this = this;
            this._spikesOn = !this._spikesOn;
            this._spikesArray.forEach(function (element) {
                _this._map[element.y][element.x].visual.activateSoul(_this._spikesOn);
                _this._gameUI.checkDangers(element.x, element.y);
            });
            this._switchArray.forEach(function (element) {
                _this._map[element.y][element.x].visual.activateSoul(_this._spikesOn);
            });
        };
        Grid.prototype.startPlatformCrash = function (cx, cy) {
            var _this = this;
            this._map[cy][cx].visual.crashPlatform();
            setTimeout(function () {
                TProject.SoundMixer.playSound("cake");
                _this._gameUI.checkDangers(cx, cy, true);
            }, 500);
        };
        Grid.get3DCoordinate = function (cx, cy) {
            var zPos = 100 - ((100 / 7) * cy);
            var scaleRatio = Grid.FOCAL_LENGTH / (Grid.FOCAL_LENGTH + zPos);
            Grid._varCoord3D.x = ((((Grid.TILE_SIZE * cx) - Grid.X_START_POS) * (scaleRatio * 0.96)) + Grid.X_START_POS) - (Grid.TEMP_MODEL_WIDTH * scaleRatio) + Grid.X_START_OFFSET;
            Grid._varCoord3D.y = (((Grid.TILE_SIZE * cy) * 0.525) * scaleRatio) + Grid.Y_START_POS;
            Grid._varCoord3D.scale = scaleRatio;
            return Grid._varCoord3D;
        };
        return Grid;
    }(Phaser.Sprite));
    Grid.MAP_WIDTH = 9;
    Grid.MAP_HEIGHT = 8;
    Grid.X_START_POS = 420;
    Grid.X_START_OFFSET = -5;
    Grid.Y_START_POS = 110;
    Grid.FOCAL_LENGTH = 120;
    Grid.TEMP_MODEL_WIDTH = 30;
    Grid.MODEL_SIZE_SCALAR = 1.25;
    Grid.TILE_SIZE_CONSTANT = 85;
    Grid.TILE_SIZE = Grid.TILE_SIZE_CONSTANT * Grid.MODEL_SIZE_SCALAR;
    TProject.Grid = Grid;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var GridEntity = (function (_super) {
        __extends(GridEntity, _super);
        function GridEntity(game, cx, cy, grid) {
            var _this = _super.call(this, game, 0.0, 0.0) || this;
            _this._wattingTime = 25;
            _this._grid = grid;
            _this._cx = cx;
            _this._cy = cy;
            _this._canMove = true;
            _this._waitingTimer = _this._wattingTime;
            _this._stupid = 0;
            _this._stupedCounter = 0;
            _this._animationTimeHorizont = 400;
            _this._animationTimeVertical = 400;
            _this._stupidPath = [];
            _this.setGridPosition(_this._cx, _this._cy);
            _this._canUpdate = true;
            return _this;
        }
        Object.defineProperty(GridEntity.prototype, "animationTimeHorizont", {
            get: function () {
                return this._animationTimeHorizont;
            },
            set: function (val) {
                this._animationTimeHorizont = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridEntity.prototype, "animationTimeVertical", {
            get: function () {
                return this._animationTimeVertical;
            },
            set: function (val) {
                this._animationTimeVertical = val;
            },
            enumerable: true,
            configurable: true
        });
        GridEntity.prototype.setGrid = function (grid) {
            this._grid = grid;
        };
        GridEntity.prototype.setStupid = function (value) {
            this._stupid = value;
            this._stupedCounter = 0;
        };
        GridEntity.prototype.setGridPosition = function (cx, cy, animationTime) {
            var _this = this;
            if (animationTime === void 0) { animationTime = 0; }
            this._cx = cx;
            this._cy = cy;
            var pos3d = TProject.Grid.get3DCoordinate(this._cx, this._cy);
            if (animationTime == 0) {
                this.x = pos3d.x;
                this.y = pos3d.y;
                this.myScale = pos3d.scale;
            }
            else {
                this._canMove = false;
                var tween = void 0;
                this._updateTimer = GridEntity.ENTITY_TIME_UPDATE;
                tween = this.game.add.tween(this).to({ x: pos3d.x, y: pos3d.y, myScale: pos3d.scale }, animationTime, Phaser.Easing.Linear.None, true);
                tween.onComplete.addOnce(function () {
                    _this._canMove = true;
                    var p = _this.parent;
                    _this._waitingTimer = _this._wattingTime;
                    p.removeChild(_this);
                    p.addChild(_this);
                    _this.onStep();
                }, this);
                tween.onUpdateCallback(function () {
                    if (_this._updateTimer <= 0) {
                        _this._updateTimer = GridEntity.ENTITY_TIME_UPDATE;
                        var p = _this.parent;
                        p.removeChild(_this);
                        p.addChild(_this);
                    }
                    else {
                        _this._updateTimer--;
                    }
                });
            }
        };
        GridEntity.prototype.onStep = function () {
        };
        GridEntity.prototype.hit = function (jumpInWater) {
            if (jumpInWater === void 0) { jumpInWater = false; }
        };
        GridEntity.prototype.gameWin = function (zap) {
        };
        GridEntity.prototype._gotoRandom = function () {
            var k = Math.random() < 0.5 ? 1 : -1;
            var v;
            if (Math.random() < 0.5) {
                v = this._grid.getMapValue(this._cx + k, this._cy);
                if (v != 0) {
                    this.gotoHorizont(k, this.animationTimeHorizont);
                }
                else {
                    this.gotoRandom();
                }
            }
            else {
                v = this._grid.getMapValue(this._cx, this._cy + k);
                if (v != 0) {
                    this.gotoVertical(k, this.animationTimeVertical);
                }
                else {
                    this.gotoRandom();
                }
            }
        };
        GridEntity.prototype.gotoRandom = function () {
            if (!this._canMove) {
                return;
            }
            if (this._waitingTimer > 0) {
                this._waitingTimer--;
                return;
            }
            else {
                this._waitingTimer = this._wattingTime;
            }
            this._gotoRandom();
        };
        GridEntity.prototype.iNeedFindPath = function () {
            this._stupedCounter = 0;
            this._waitingTimer = this._wattingTime * 0.5;
        };
        GridEntity.prototype.goto = function (cx, cy) {
            var _this = this;
            if (!this._canUpdate) {
                return;
            }
            if (cx == this.cx && cy == this.cy) {
                return;
            }
            if (!this._canMove) {
                return;
            }
            if (this._waitingTimer > 0) {
                this._waitingTimer--;
                return;
            }
            else {
                this._waitingTimer = this._wattingTime;
            }
            if (this._stupid != 0) {
                if (this._stupedCounter > 0) {
                    var p = this._stupidPath.shift();
                    if (p == null) {
                        this._stupedCounter = 0;
                        this._waitingTimer = this._wattingTime * 0.5;
                        return;
                    }
                    p.x = p.x - this.cx;
                    p.y = p.y - this.cy;
                    this.gotoHorizont(p.x, this.animationTimeHorizont);
                    this.gotoVertical(p.y, this.animationTimeVertical);
                    this._stupedCounter--;
                    return;
                }
                else {
                    this._stupedCounter = this._stupid;
                }
            }
            this._canUpdate = false;
            this._grid.pathFind(this.cx, this.cy, cx, cy, function (path) {
                _this._stupidPath = path;
                _this._canUpdate = true;
                _this._stupidPath.shift();
                var p = _this._stupidPath.shift();
                if (p == null) {
                    _this._stupedCounter = 0;
                    return;
                }
                p.x = p.x - _this.cx;
                p.y = p.y - _this.cy;
                _this.gotoHorizont(p.x, _this.animationTimeHorizont);
                _this.gotoVertical(p.y, _this.animationTimeVertical);
            });
        };
        GridEntity.prototype.checkExit = function (x, y) {
            if (this._stupidPath == null) {
                return;
            }
            for (var i = 0; i < this._stupidPath.length; i++) {
                if (this._stupidPath[i].x == x && this._stupidPath[i].y == y) {
                    return true;
                }
            }
            return false;
        };
        GridEntity.prototype.gotoHorizont = function (value, animationTime, fuckRules) {
            if (value === void 0) { value = 1; }
            if (animationTime === void 0) { animationTime = 0; }
            if (fuckRules === void 0) { fuckRules = false; }
            if (!this._canMove || value == 0 || value == null) {
                return -2;
            }
            this._horisontMove = true;
            this._moveValue = value;
            this._cx += value;
            if (!fuckRules) {
                if (this._cx < 0 || this._cx > 8) {
                    this._cx -= value;
                    return;
                }
            }
            this.setGridPosition(this._cx, this._cy, animationTime);
            this.moveAnimation();
            this._cellType = this._grid.getMapValue(this._cx, this._cy);
            this._powerUpType = this._grid.getPowerUpValue(this._cx, this._cy);
            return this._cellType;
        };
        GridEntity.prototype.gotoVertical = function (value, animationTime, fuckRules) {
            if (value === void 0) { value = 1; }
            if (animationTime === void 0) { animationTime = 0; }
            if (fuckRules === void 0) { fuckRules = false; }
            if (!this._canMove || value == 0 || value == null) {
                return -2;
            }
            this._horisontMove = false;
            this._moveValue = value;
            this._cy += value;
            if (!fuckRules) {
                if (this._cy < 0 || this._cy > 7) {
                    this._cy -= value;
                    return;
                }
            }
            this.setGridPosition(this._cx, this._cy, animationTime);
            this.moveAnimation();
            this._cellType = this._grid.getMapValue(this._cx, this._cy);
            this._powerUpType = this._grid.getPowerUpValue(this._cx, this._cy);
            return this._cellType;
        };
        GridEntity.prototype.imBooked = function (cx, cy) {
            if (!this._canMove) {
                return false;
            }
            if (cx == this.cx && cy == this.cy) {
                return true;
            }
            return false;
        };
        GridEntity.prototype.moveAnimation = function () {
        };
        GridEntity.prototype.actionOnPlatformStep = function (isPlayer, character) {
            this._grid.actionOnPlatformStep(this._cx, this._cy, isPlayer, character);
        };
        Object.defineProperty(GridEntity.prototype, "myScale", {
            get: function () {
                return this.scale.x;
            },
            set: function (value) {
                this.scale.x = this.scale.y = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridEntity.prototype, "cx", {
            get: function () {
                return this._cx;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridEntity.prototype, "cy", {
            get: function () {
                return this._cy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridEntity.prototype, "cellType", {
            get: function () {
                return this._cellType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridEntity.prototype, "powerUpType", {
            get: function () {
                return this._powerUpType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridEntity.prototype, "canMove", {
            get: function () {
                return this._canMove;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridEntity.prototype, "horisontMove", {
            get: function () {
                return this._horisontMove;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridEntity.prototype, "moveValue", {
            get: function () {
                return this._moveValue;
            },
            enumerable: true,
            configurable: true
        });
        GridEntity.prototype.setWattingTimeAndDropTimer = function (value) {
            this._wattingTime = value;
            this._waitingTimer = this._wattingTime;
        };
        return GridEntity;
    }(Phaser.Sprite));
    GridEntity.ENTITY_TIME_UPDATE = 3;
    TProject.GridEntity = GridEntity;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var IceKing = (function (_super) {
        __extends(IceKing, _super);
        function IceKing(game, cx, cy, grid, gameUI) {
            var _this = _super.call(this, game, cx, cy, grid) || this;
            _this._linesAnimations = [];
            _this._gameUI = gameUI;
            _this._visual = new TProject.DBSprite(TProject.Boot.CHARACTERS, "_DB/hyperIceking");
            _this.addChild(_this._visual);
            var gr = new Phaser.Graphics(_this.game);
            gr.beginFill(0xff0000);
            gr.drawCircle(0, 0, 10);
            gr.endFill();
            _this.setWattingTimeAndDropTimer(60);
            _this.addChild(gr);
            _this.animationTimeHorizont = 500;
            _this.animationTimeVertical = 400;
            _this.setLinesOnIceking();
            return _this;
        }
        IceKing.prototype.myreset = function (position, grid, gameUI) {
            this._visual.play("down_idle");
            this.setGrid(grid);
            this.setGridPosition(position.x, position.y, 0);
            this._gameUI = gameUI;
        };
        IceKing.prototype.setLinesOnIceking = function () {
            this._visual.addEvent("frameEvent", this.hitEvent, this);
            for (var i = 1; i <= 7; i++) {
                var line = this.game.add.sprite(0, 0, "Objects", "fx_line_10000");
                line.anchor.set(0.5, 0.8);
                var lineAnimation = line.animations.add("line", Phaser.Animation.generateFrameNames("fx_line_", 10000, 10007));
                this._visual.getBone("fx" + i).addChild(line);
                this._linesAnimations.push(lineAnimation);
            }
            for (var i = 1; i <= 7; i++) {
                var line = this.game.add.sprite(0, 0, "Objects", "fx_line_10000");
                line.anchor.set(0.5, 0.8);
                var lineAnimation = line.animations.add("line", Phaser.Animation.generateFrameNames("fx_line_", 10000, 10007));
                this._visual.getBone("fx_" + i).addChild(line);
                this._linesAnimations.push(lineAnimation);
            }
        };
        IceKing.prototype.hitEvent = function (e) {
            if (e.name == "hit") {
                this._linesAnimations.forEach(function (line) { return line.play(30, true); });
                console.log("HIT!");
            }
        };
        IceKing.prototype.lineUpdate = function () {
            this._linesAnimations.forEach(function (line) {
                line.update();
                if (line.loopCount == 3) {
                    line.stop();
                }
            });
        };
        IceKing.prototype.onStep = function () {
            this.actionOnPlatformStep(false, this);
            this._gameUI.checkPlayer();
        };
        IceKing.prototype.hit = function () {
            var _this = this;
            this.setWattingTimeAndDropTimer(80);
            this._visual.playEx("burn", null, function (e) {
                if (e.label == "burn") {
                    _this.setWattingTimeAndDropTimer(25);
                }
            });
        };
        IceKing.prototype.lose = function () {
            this._visual.play("lose");
        };
        IceKing.prototype.fight = function () {
            this._visual.play("fight");
        };
        IceKing.prototype.moveAnimation = function () {
            if (this.horisontMove) {
                if (this.moveValue < 0) {
                    this._visual.scale.set(1, 1);
                    this._visual.play("left_jump");
                }
                else {
                    this._visual.scale.set(-1, 1);
                    this._visual.play("left_jump");
                }
            }
            else {
                if (this.moveValue < 0) {
                    this._visual.scale.set(1, 1);
                    this._visual.play("up_jump");
                }
                else {
                    this._visual.scale.set(1, 1);
                    this._visual.play("down_jump");
                }
            }
        };
        IceKing.prototype.free = function () {
            this._visual.removeEvent("frameEvent", this.hitEvent);
            this._visual.free();
        };
        return IceKing;
    }(TProject.GridEntity));
    TProject.IceKing = IceKing;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var Pinguin = (function (_super) {
        __extends(Pinguin, _super);
        function Pinguin(game, cx, cy, grid, gameUI) {
            var _this = _super.call(this, game, cx, cy, grid) || this;
            _this._linesAnimations = [];
            _this._gameUI = gameUI;
            _this._visual = new TProject.DBSprite(TProject.Boot.CHARACTERS, "_DB/hyperGunter");
            _this.addChild(_this._visual);
            var gr = new Phaser.Graphics(_this.game);
            gr.beginFill(0xff0000);
            gr.drawCircle(0, 0, 10);
            gr.endFill();
            _this.setWattingTimeAndDropTimer(45);
            _this.addChild(gr);
            _this.animationTimeVertical = 750;
            _this.animationTimeHorizont = 500;
            _this.setLinesOnPinguin();
            return _this;
        }
        Pinguin.prototype.hitEvent = function (e) {
            if (e.name == "hit") {
                console.log("HIT!");
                this._linesAnimations.forEach(function (line) { return line.play(30, true); });
            }
        };
        Pinguin.prototype.lineUpdate = function () {
            this._linesAnimations.forEach(function (line) {
                line.update();
                if (line.loopCount == 3) {
                    line.stop();
                }
            });
        };
        Pinguin.prototype.setLinesOnPinguin = function () {
            this._visual.addEvent("frameEvent", this.hitEvent, this);
            for (var i = 1; i <= 7; i++) {
                var line = this.game.add.sprite(0, 0, "Objects", "fx_line_10000");
                line.anchor.set(0.5, 0.8);
                var lineAnimation = line.animations.add("line", Phaser.Animation.generateFrameNames("fx_line_", 10000, 10007));
                this._visual.getBone("fx" + i).addChild(line);
                this._linesAnimations.push(lineAnimation);
            }
        };
        Pinguin.prototype.myreset = function (position, grid, gameUI) {
            this._visual.play("down_idle");
            this.setGrid(grid);
            this.setGridPosition(position.x, position.y, 0);
            this._gameUI = gameUI;
        };
        Pinguin.prototype.onStep = function () {
            this.actionOnPlatformStep(false, this);
            this._gameUI.checkPlayer();
        };
        Pinguin.prototype.hit = function () {
            var _this = this;
            this._burn = 0;
            this.setWattingTimeAndDropTimer(100);
            this._visual.playEx("burn", "burn", function (e) {
                if (e.label == "burn") {
                    _this._burn++;
                    if (_this._burn > 1) {
                        _this.setWattingTimeAndDropTimer(5);
                    }
                }
            });
        };
        Pinguin.prototype.fight = function () {
            this._visual.play("fight");
        };
        Pinguin.prototype.moveAnimation = function () {
            if (this.horisontMove) {
                if (this.moveValue < 0) {
                    this._visual.scale.set(1, 1);
                    this._visual.play("left_jump");
                }
                else {
                    this._visual.scale.set(-1, 1);
                    this._visual.play("left_jump");
                }
            }
            else {
                if (this.moveValue < 0) {
                    this._visual.scale.set(1, 1);
                    this._visual.play("up_jump");
                }
                else {
                    this._visual.scale.set(1, 1);
                    this._visual.play("down_jump");
                }
            }
        };
        Pinguin.prototype.lose = function () {
            this._visual.play("burn");
        };
        Pinguin.prototype.free = function () {
            this._visual.removeEvent("frameEvent", this.hitEvent);
            this._linesAnimations.forEach(function (a) { return a.destroy(); });
            this._visual.free();
        };
        return Pinguin;
    }(TProject.GridEntity));
    TProject.Pinguin = Pinguin;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var Platform = (function (_super) {
        __extends(Platform, _super);
        function Platform(game, type, cx, cy) {
            var _this = _super.call(this, game, 0.0, 0.0) || this;
            _this._flameArray = [];
            _this._flameAnimationArray = [];
            _this._cx = cx;
            _this._cy = cy;
            _this._type = type;
            _this._dangers = false;
            _this._bonfireStatus = false;
            _this.anchor.set(0.5);
            _this._hoop = _this.game.add.sprite(0, 0, "Objects", "hoop_10000");
            _this._hoop.anchor.set(0.5);
            _this.addChild(_this._hoop);
            _this._hoopAnimation = _this._hoop.animations.add("bounce", Phaser.Animation.generateFrameNames("hoop_", 10000, 10029), 24, false);
            _this._hoop.frameName = "hoop_10029";
            switch (_this._type) {
                case 1:
                    _this.createRandomBody();
                    _this._soul = _this.game.add.sprite(0, 0, "Objects", "pl_cheese_10000");
                    _this._soul.anchor.set(0.5, 0.9);
                    _this._soul.animations.add("idle", Phaser.Animation.generateFrameNames("pl_cheese_", 10000, 10007), 24, true);
                    _this._soul.animations.play("idle");
                    _this.addChild(_this._soul);
                    _this._hoop.position.set(0, _this._body.height * 0.45);
                    break;
                case 2:
                    _this._body = _this.game.add.sprite(0, 0, "Objects", "platform_drum_10000");
                    _this._body.anchor.set(0.7, 0.10);
                    _this.addChild(_this._body);
                    _this._body.animations.add("bounce", Phaser.Animation.generateFrameNames("platform_drum_", 10001, 10003), 24, false);
                    _this._body.animations.add("idle", Phaser.Animation.generateFrameNames("platform_drum_", 10003, 10003), 24, false);
                    _this._body.animations.play("idle");
                    _this._hoop.position.set(0, _this._body.height * 0.45);
                    break;
                case 3:
                    _this._body = _this.game.add.sprite(0, 0, "Objects", "platform_cup0000");
                    _this._body.anchor.set(0.7, 0.12);
                    _this.addChild(_this._body);
                    _this._hoop.position.set(0, _this._body.height * 0.5);
                    break;
                case 4:
                    _this._body = _this.game.add.sprite(0, 0, "Objects", "platform_cake_10000");
                    _this._body.anchor.set(0.62, 0.12);
                    _this.addChild(_this._body);
                    _this._body.animations.add("idle", Phaser.Animation.generateFrameNames("platform_cake_", 10000, 10000), 24, false);
                    _this._body.animations.add("bounce", Phaser.Animation.generateFrameNames("platform_cake_", 10001, 10006), 24, false);
                    _this._body.animations.add("break", Phaser.Animation.generateFrameNames("platform_cake_", 10007, 10041), 24, false);
                    _this._body.animations.play("idle");
                    _this._hoop.position.set(0, _this._body.height * 0.45);
                    break;
                case 5:
                    _this._body = _this.game.add.sprite(0, 0, "Objects", "platform_base_10000");
                    _this._body.anchor.set(0.7, 0.12);
                    _this.addChild(_this._body);
                    _this.createBonfire();
                    _this._hoop.position.set(-5, _this._body.height * 0.4);
                    break;
                case 6:
                    _this._body = _this.game.add.sprite(0, 0, "Objects", "platform_base_10000");
                    _this._body.anchor.set(0.7, 0.12);
                    _this.addChild(_this._body);
                    _this._soul = _this.game.add.sprite(0, 0, "Objects", "pl_spikes_10000");
                    _this._soul.anchor.set(0.5, 0.85);
                    _this.addChild(_this._soul);
                    _this._soul.animations.add("up", Phaser.Animation.generateFrameNames("pl_spikes_", 10000, 10008), 24, false);
                    _this._soul.animations.add("down", Phaser.Animation.generateFrameNames("pl_spikes_", 10008, 10000), 24, false);
                    _this._hoop.position.set(-5, _this._body.height * 0.4);
                    break;
                case 7:
                    _this._body = _this.game.add.sprite(0, 0, "Objects", "platform_base_10000");
                    _this._body.anchor.set(0.7, 0.12);
                    _this.addChild(_this._body);
                    _this._soul = _this.game.add.sprite(0, 0, "Objects", "platform_hot_plate_switch_10000");
                    _this._soul.anchor.set(0.5);
                    _this.addChild(_this._soul);
                    _this._soul.animations.add("up", Phaser.Animation.generateFrameNames("platform_hot_plate_switch_", 10001, 10003), 24, false);
                    _this._soul.animations.add("down", Phaser.Animation.generateFrameNames("platform_hot_plate_switch_", 10003, 10000), 24, false);
                    _this._hoop.position.set(-5, _this._body.height * 0.4);
                    break;
            }
            var gr = new Phaser.Graphics(_this.game);
            gr.beginFill(0x00ff00, 0.4);
            gr.drawCircle(0, 0, 10);
            gr.endFill();
            _this.addChild(gr);
            return _this;
        }
        Platform.prototype.stepOnPlatform = function (isPlayer) {
            if (!this._dangers) {
                this._hoop.alpha = 1;
                this._hoopAnimation.play();
                if (isPlayer && this._type == 1 && this._soul) {
                    this._soul.destroy();
                }
                else if (isPlayer && this._type == 4 && !this._dangers) {
                    this._body.animations.play("bounce");
                }
                else if (isPlayer && this._type == 2) {
                    this._body.animations.play("bounce");
                }
                if (isPlayer && this._boost)
                    this._boost.destroy();
            }
        };
        Platform.prototype.hoopCheker = function () {
            if (!this._hoopAnimation.isPlaying && this._hoopAnimation.frame != this._hoopAnimation.frameTotal && this._hoop.alpha == 1) {
                this._hoop.alpha = 0;
            }
        };
        Platform.prototype.crashPlatform = function () {
            if (!this._dangers) {
                this._dangers = true;
                this._body.animations.play("break");
            }
        };
        Platform.prototype.setPowerUp = function (type) {
            this._boost = this.game.add.sprite(-5, -10, "Objects", "pl_sausage_10000");
            this._boost.anchor.set(0.45, 0.9);
            this._boost.animations.add("idle", Phaser.Animation.generateFrameNames("pl_sausage_", 10000, 10065), 24, true);
            this._boost.animations.play("idle");
            this._boost.alpha = 0;
            this.addChild(this._boost);
        };
        Platform.prototype.setPowerUpAnumbtion = function (delay) {
            var yChange = 30;
            this._boost.y -= yChange;
            this.game.add.tween(this._boost).to({ alpha: 1 }, 50, Phaser.Easing.Linear.None, true, delay);
            this.game.add.tween(this._boost).to({ y: this._boost.y + yChange }, 250, Phaser.Easing.Bounce.Out, true, delay);
        };
        Platform.prototype.createRandomBody = function () {
            this._body = this.game.add.sprite(0, 0, "Objects", "platform_base_1000" + this.game.rnd.integerInRange(0, 4));
            this._body.anchor.set(0.7, 0.12);
            this.addChild(this._body);
        };
        Platform.prototype.createBonfire = function () {
            this._soul = this.game.add.sprite(0, 0, "Objects", "platform_firepit.png");
            this._soul.anchor.set(0.5);
            this._body.addChild(this._soul);
            this.getFlame(-12, -this._soul.height + 35, 0.34);
            this.getFlame(-12 + 24, -this._soul.height + 35, 0.34);
            this.getFlame(-12 + 12, -this._soul.height + 40, 0.34);
        };
        Platform.prototype.igniteFire = function () {
            this._bonfireStatus = !this._bonfireStatus;
            for (var i = 0; i < this._flameArray.length; i++) {
                if (this._bonfireStatus) {
                    this._flameArray[i].visible = this._bonfireStatus;
                    this._dangers = true;
                    this._flameAnimationArray[i].play();
                }
                else {
                    this._flameArray[i].visible = this._bonfireStatus;
                    this._dangers = false;
                }
            }
        };
        Platform.prototype.activateSoul = function (activate) {
            if (activate) {
                if (this._type == 6)
                    this._dangers = true;
                this._soul.animations.play("up");
            }
            else {
                if (this._type == 6)
                    this._dangers = false;
                this._soul.animations.play("down");
            }
        };
        Platform.prototype.getFlame = function (x, y, scale) {
            var i = this._flameArray.length;
            this._flameArray[i] = this.game.add.sprite(x, y, "Objects", "flambit_baby_10000");
            this._flameAnimationArray[i] = this._flameArray[i].animations.add("up", Phaser.Animation.generateFrameNames("flambit_baby_", 10000, 10009), 24, false);
            this._flameArray[i].scale.set(scale);
            this._flameArray[i].anchor.set(0.5, 0.9);
            this._soul.addChild(this._flameArray[i]);
            this._flameArray[i].visible = false;
        };
        Object.defineProperty(Platform.prototype, "dangers", {
            get: function () {
                return this._dangers;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Platform.prototype, "bonfireStatus", {
            set: function (value) {
                this._bonfireStatus = value;
            },
            enumerable: true,
            configurable: true
        });
        return Platform;
    }(Phaser.Sprite));
    TProject.Platform = Platform;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, cx, cy, grid, gameUI) {
            var _this = _super.call(this, game, cx, cy, grid) || this;
            _this._gameUI = gameUI;
            _this._myGrid = grid;
            _this._visual = new TProject.DBSprite(TProject.Boot.CHARACTERS, "_DB/hyperFinn");
            _this._visual.play("down_idle");
            _this.addChild(_this._visual);
            var gr = new Phaser.Graphics(_this.game);
            gr.beginFill(0xff0000);
            gr.drawCircle(0, 0, 10);
            gr.endFill();
            _this._wasHit = false;
            _this.addChild(gr);
            return _this;
        }
        Player.prototype.myreset = function (position, grid, gameUI) {
            this._wasHit = false;
            this.setGrid(grid);
            this.setGridPosition(position.x, position.y);
            this._gameUI = gameUI;
            this._visual.play("down_idle");
            this.visible = true;
        };
        Player.prototype.onStep = function () {
            this.actionOnPlatformStep(true, this);
            this._gameUI.checkPlayer();
            if (this.cellType == 2 && !this._wasHit) {
                if (this.horisontMove) {
                    this.gotoHorizont(this.moveValue * 2, 1000, true);
                }
                else {
                    this.gotoVertical(this.moveValue * 2, 900, true);
                }
            }
        };
        Player.prototype.hit = function (jumpInWater, enemyAttack) {
            var _this = this;
            if (jumpInWater === void 0) { jumpInWater = false; }
            if (enemyAttack === void 0) { enemyAttack = false; }
            console.log("Player hit");
            if (!this._wasHit) {
                this._wasHit = true;
                if (jumpInWater) {
                    setTimeout(function () {
                        _this._myGrid.splashInPlatform(_this.cx, _this.cy, _this.x, _this.y, _this.scale.x);
                    }, 250);
                }
                if (enemyAttack)
                    TProject.SoundMixer.playSound("caughtOnEnemyHit");
                this._visual.playEx("lose", "down_idle", function () {
                    _this.visible = false;
                });
                this._gameUI.gameOver();
            }
        };
        Object.defineProperty(Player.prototype, "isFlipped", {
            get: function () {
                return this._visual.scale.x < 0;
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.gameWin = function (zap) {
            TProject.SoundMixer.playSound("fullCharge");
            this._visual.playEx("sword", null, function (e) {
                if (e.label == "sword") {
                    zap();
                }
            });
        };
        Player.prototype.gameWinAnimation = function () {
            this._visual.play("win");
        };
        Player.prototype.moveAnimation = function () {
            var modificator = Math.abs(this.moveValue) == 1 ? "" : "X2";
            if (this.horisontMove) {
                if (this.moveValue < 0) {
                    this._visual.scale.set(1, 1);
                    this._visual.play("left_jump" + modificator);
                }
                else {
                    this._visual.scale.set(-1, 1);
                    this._visual.play("left_jump" + modificator);
                }
            }
            else {
                if (this.moveValue < 0) {
                    this._visual.scale.set(1, 1);
                    this._visual.playEx("up_jump" + modificator, "up_idle");
                }
                else {
                    this._visual.scale.set(1, 1);
                    this._visual.play("down_jump" + modificator);
                }
            }
        };
        Player.prototype.free = function () {
            this._visual.free();
        };
        return Player;
    }(TProject.GridEntity));
    TProject.Player = Player;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var PrincessUI = (function (_super) {
        __extends(PrincessUI, _super);
        function PrincessUI(game, x, y, currentPrincess) {
            var _this = _super.call(this, game, x, y) || this;
            _this.anchor.set(0.5);
            _this._iceShine = new TProject.DBSprite(TProject.Boot.PRINCESSES, "_DB/ice_shine", _this.game);
            _this._iceShine.setPos(5, 5);
            _this._iceShine.play("idle");
            _this.addChild(_this._iceShine);
            _this._iceShinePoly = new Phaser.Polygon([
                new Phaser.Point(81.1, 41.25), new Phaser.Point(104.2, 41.25), new Phaser.Point(127.1, 61.1),
                new Phaser.Point(132.2, 79), new Phaser.Point(111.1, 120.05), new Phaser.Point(65.1, 111.1),
                new Phaser.Point(54.1, 93.1), new Phaser.Point(60.2, 66.15)
            ]);
            _this._iceShineGraph = _this.game.add.graphics(_this._iceShine.x, _this._iceShine.y);
            _this._iceShineGraph.beginFill(0x00ff00);
            _this._iceShineGraph.drawPolygon(_this._iceShinePoly.points);
            _this._iceShineGraph.endFill();
            _this.addChild(_this._iceShineGraph);
            _this._iceShine.getBone("lines").mask = _this._iceShineGraph;
            _this._level_select_icon = new TProject.DBSprite(TProject.Boot.PRINCESSES, "_DB/level_select_icons", _this.game);
            _this._level_select_icon.setPos(0, 0);
            _this._level_select_icon.play("lock");
            _this.addChild(_this._level_select_icon);
            _this._level_select_icon.getBone("ice_shine").addChild(_this._iceShine);
            _this._iceShineGraph.scale.set(_this._level_select_icon.getBone("ice_shine").scale.x, _this._level_select_icon.getBone("ice_shine").scale.y);
            _this._iceShineGraph.x -= 132;
            _this._iceShineGraph.y -= 116;
            _this._currentPrincess = _this.game.add.sprite(7, 6, "Princesses", currentPrincess < 10 ? "princesses_1000" + currentPrincess : "princesses_100" + currentPrincess);
            _this._level_select_icon.getBone("princesses").addChild(_this._currentPrincess);
            _this._gems_reveal = new TProject.DBSprite(TProject.Boot.PRINCESSES, "_DB/gems_reveal", _this.game);
            _this._gems_reveal.setPos(7, 6);
            _this._gems_reveal.play("idle");
            _this.addChild(_this._gems_reveal);
            _this._level_select_icon.getBone("gems").addChild(_this._gems_reveal);
            return _this;
        }
        PrincessUI.prototype.setState = function (state, gemsPrincessNumber) {
            var _this = this;
            if (gemsPrincessNumber === void 0) { gemsPrincessNumber = 1; }
            switch (state) {
                case "changePrincess":
                    this._level_select_icon.play("lock");
                    this._gems_reveal.play("idle");
                    this._iceShine.play("idle");
                    this._currentPrincess.destroy();
                    this._currentPrincess = this.game.add.sprite(7, 6, "Princesses", gemsPrincessNumber < 10 ? "princesses_1000" + gemsPrincessNumber : "princesses_100" + gemsPrincessNumber);
                    this._level_select_icon.getBone("princesses").addChild(this._currentPrincess);
                    break;
                case "start":
                    this._level_select_icon.play("lock");
                    this._gems_reveal.play("idle");
                    this._iceShine.play("action");
                    break;
                case "fin":
                    this._gems_reveal.play("idle");
                    this._iceShine.play("idle");
                    this._level_select_icon.play("unlockanim");
                    setTimeout(function () {
                        _this._gems_reveal.play("gem" + gemsPrincessNumber);
                    }, 3000);
                    break;
                case "unlock":
                    this._level_select_icon.play("unlock");
                    this._gems_reveal.play("idle");
                    this._iceShine.play("action");
                    break;
            }
        };
        return PrincessUI;
    }(Phaser.Sprite));
    TProject.PrincessUI = PrincessUI;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var WorldModel = (function () {
        function WorldModel() {
            this._levels = new Array(20);
            var grid1 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 3, 0, 0, 0, 0], [0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 1, 1, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid1powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            this._levels[0] = {
                grid: grid1,
                gridPowerUps: grid1powerUps,
                playerPosition: new Phaser.Point(4, 2),
                enemy1: WorldModel.EMPTY_ENEMY,
                enemy2: WorldModel.EMPTY_ENEMY,
                enemy3: WorldModel.EMPTY_ENEMY,
                scoreArray: [80, 130, 150]
            };
            var grid2 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 3, 0, 0, 0, 0, 0, 0], [0, 0, 1, 1, 1, 1, 1, 0, 0], [0, 0, 1, 2, 0, 1, 1, 0, 0], [0, 0, 1, 1, 0, 2, 1, 0, 0], [0, 0, 1, 1, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 3, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid2powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var kingGrid2 = { name: WorldModel.KING, position: new Phaser.Point(5, 6), stupid: 3 };
            this._levels[1] = {
                grid: grid2,
                gridPowerUps: grid2powerUps,
                playerPosition: new Phaser.Point(2, 1),
                enemy1: kingGrid2,
                enemy2: WorldModel.EMPTY_ENEMY,
                enemy3: WorldModel.EMPTY_ENEMY,
                scoreArray: [150, 400, 535]
            };
            var grid3 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 3, 1, 1, 1, 1, 0, 0], [0, 0, 1, 5, 1, 5, 1, 0, 0], [0, 0, 1, 1, 4, 1, 1, 0, 0], [0, 0, 1, 1, 1, 1, 3, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid3powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 2, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var kingGrid3 = { name: WorldModel.KING, position: new Phaser.Point(6, 5), stupid: 3 };
            this._levels[2] = {
                grid: grid3,
                gridPowerUps: grid3powerUps,
                scoreArray: [170, 420, 565],
                playerPosition: new Phaser.Point(2, 2),
                enemy1: kingGrid3,
                enemy2: WorldModel.EMPTY_ENEMY,
                enemy3: WorldModel.EMPTY_ENEMY
            };
            var grid4 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 3, 1, 5, 1, 1, 0, 0], [0, 0, 1, 1, 0, 1, 1, 0, 0], [0, 0, 1, 1, 0, 1, 1, 0, 0], [0, 0, 3, 1, 5, 1, 3, 0, 0], [0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid4powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 2, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 2, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var kingGrid4 = { name: WorldModel.KING, position: new Phaser.Point(6, 5), stupid: 3 };
            var pinguinGrid4 = { name: WorldModel.PINGUIN, position: new Phaser.Point(2, 5), stupid: 3 };
            this._levels[3] = {
                grid: grid4,
                gridPowerUps: grid4powerUps,
                scoreArray: [300, 750, 1060],
                playerPosition: new Phaser.Point(2, 2),
                enemy1: kingGrid4,
                enemy2: pinguinGrid4,
                enemy3: WorldModel.EMPTY_ENEMY
            };
            var grid5 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 3, 0, 0, 0, 0, 0, 0], [0, 0, 1, 1, 1, 1, 5, 0, 0], [0, 0, 1, 7, 6, 2, 1, 0, 0], [0, 0, 1, 2, 6, 7, 1, 0, 0], [0, 0, 5, 1, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 3, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid5powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 2, 0, 0, 0], [0, 0, 0, 2, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var king5 = { name: WorldModel.KING, position: new Phaser.Point(6, 6), stupid: 3 };
            this._levels[4] = {
                grid: grid5,
                gridPowerUps: grid5powerUps,
                scoreArray: [120, 250, 330],
                playerPosition: new Phaser.Point(2, 1),
                enemy1: king5,
                enemy2: WorldModel.EMPTY_ENEMY,
                enemy3: WorldModel.EMPTY_ENEMY
            };
            var grid6 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 3, 0, 0, 0, 0], [0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 5, 1, 1, 2, 2, 1, 5, 0], [0, 5, 1, 2, 2, 1, 1, 5, 0], [0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 3, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid6powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0, 2, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var king6 = { name: WorldModel.KING, position: new Phaser.Point(4, 6), stupid: 3 };
            this._levels[5] = {
                grid: grid6,
                gridPowerUps: grid6powerUps,
                playerPosition: new Phaser.Point(4, 1),
                scoreArray: [150, 250, 385],
                enemy1: king6,
                enemy2: WorldModel.EMPTY_ENEMY,
                enemy3: WorldModel.EMPTY_ENEMY
            };
            var grid7 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 3, 0, 0, 0, 0], [0, 1, 4, 1, 1, 1, 4, 1, 0], [0, 1, 2, 1, 4, 1, 1, 1, 0], [0, 1, 4, 1, 1, 1, 4, 1, 0], [0, 3, 1, 1, 2, 1, 2, 3, 0], [0, 0, 1, 1, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid7powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 2, 0, 0, 0, 2, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var pinguin71 = { name: WorldModel.PINGUIN, position: new Phaser.Point(1, 5), stupid: 3 };
            var pinguin72 = { name: WorldModel.PINGUIN, position: new Phaser.Point(7, 5), stupid: 3 };
            this._levels[6] = {
                grid: grid7,
                gridPowerUps: grid7powerUps,
                scoreArray: [300, 700, 930],
                playerPosition: new Phaser.Point(4, 1),
                enemy1: WorldModel.EMPTY_ENEMY,
                enemy2: pinguin71,
                enemy3: pinguin72
            };
            var grid8 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 3, 1, 0, 0, 0], [0, 0, 0, 1, 6, 1, 0, 0, 0], [0, 1, 1, 7, 2, 7, 1, 1, 0], [0, 1, 6, 1, 0, 1, 6, 1, 0], [0, 3, 0, 1, 1, 1, 0, 3, 0], [0, 0, 0, 0, 5, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid8powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var pinguin81 = { name: WorldModel.PINGUIN, position: new Phaser.Point(1, 5), stupid: 3 };
            var pinguin82 = { name: WorldModel.PINGUIN, position: new Phaser.Point(7, 5), stupid: 3 };
            this._levels[7] = {
                grid: grid8,
                gridPowerUps: grid8powerUps,
                scoreArray: [80, 180, 265],
                playerPosition: new Phaser.Point(4, 1),
                enemy1: WorldModel.EMPTY_ENEMY,
                enemy2: pinguin81,
                enemy3: pinguin82
            };
            var grid9 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 3, 0, 0, 0, 0], [0, 1, 1, 1, 7, 1, 1, 1, 0], [0, 0, 2, 1, 1, 1, 2, 0, 0], [0, 4, 0, 6, 6, 6, 0, 4, 0], [0, 3, 1, 1, 1, 1, 1, 3, 0], [0, 1, 1, 1, 7, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid9powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0, 0, 2, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var pinguin91 = { name: WorldModel.PINGUIN, position: new Phaser.Point(1, 5), stupid: 2 };
            var pinguin92 = { name: WorldModel.PINGUIN, position: new Phaser.Point(7, 5), stupid: 2 };
            this._levels[8] = {
                grid: grid9,
                gridPowerUps: grid9powerUps,
                scoreArray: [80, 400, 590],
                playerPosition: new Phaser.Point(4, 1),
                enemy1: WorldModel.EMPTY_ENEMY,
                enemy2: pinguin91,
                enemy3: pinguin92
            };
            var grid10 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 5, 3, 1, 2, 1, 1, 5, 0], [0, 1, 1, 1, 5, 1, 1, 1, 0], [0, 1, 1, 5, 4, 5, 1, 1, 0], [0, 3, 1, 5, 4, 5, 1, 3, 0], [0, 1, 1, 1, 5, 1, 1, 1, 0], [0, 5, 1, 1, 3, 1, 1, 5, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid10powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 2, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var king10 = { name: WorldModel.KING, position: new Phaser.Point(4, 6), stupid: 2 };
            var pinguin101 = { name: WorldModel.PINGUIN, position: new Phaser.Point(7, 4), stupid: 2 };
            var pinguin102 = { name: WorldModel.PINGUIN, position: new Phaser.Point(1, 4), stupid: 2 };
            this._levels[9] = {
                grid: grid10,
                gridPowerUps: grid10powerUps,
                scoreArray: [80, 600, 875],
                playerPosition: new Phaser.Point(2, 1),
                enemy1: king10,
                enemy2: pinguin101,
                enemy3: pinguin102
            };
            var grid11 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 3, 1, 5, 1, 5, 0, 0], [0, 0, 5, 1, 5, 1, 5, 0, 0], [0, 0, 1, 1, 1, 1, 1, 0, 0], [0, 0, 5, 1, 5, 1, 3, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid11powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var king11 = { name: WorldModel.KING, position: new Phaser.Point(6, 5), stupid: 1 };
            this._levels[10] = {
                grid: grid11,
                gridPowerUps: grid11powerUps,
                scoreArray: [50, 120, 160],
                playerPosition: new Phaser.Point(2, 2),
                enemy1: king11,
                enemy2: WorldModel.EMPTY_ENEMY,
                enemy3: WorldModel.EMPTY_ENEMY
            };
            var grid12 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 3, 0, 0, 0, 0, 0, 0], [0, 0, 1, 4, 1, 4, 1, 0, 0], [0, 0, 1, 1, 1, 1, 1, 0, 0], [0, 4, 1, 4, 1, 4, 1, 4, 0], [0, 0, 1, 1, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 3, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid12powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0, 0, 2, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var king12 = { name: WorldModel.KING, position: new Phaser.Point(6, 6), stupid: 1 };
            this._levels[11] = {
                grid: grid12,
                gridPowerUps: grid12powerUps,
                scoreArray: [50, 400, 670],
                playerPosition: new Phaser.Point(2, 1),
                enemy1: king12,
                enemy2: WorldModel.EMPTY_ENEMY,
                enemy3: WorldModel.EMPTY_ENEMY
            };
            var grid13 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 3, 5, 0, 1, 5, 1, 1, 0], [0, 1, 1, 2, 1, 4, 1, 5, 0], [0, 5, 1, 0, 1, 1, 2, 1, 0], [0, 0, 1, 2, 0, 1, 0, 1, 0], [0, 4, 1, 0, 0, 5, 1, 1, 0], [0, 0, 1, 1, 1, 1, 3, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid13powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 2, 0], [0, 2, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var king13 = { name: WorldModel.KING, position: new Phaser.Point(6, 6), stupid: 1 };
            this._levels[12] = {
                grid: grid13,
                gridPowerUps: grid13powerUps,
                scoreArray: [50, 300, 480],
                playerPosition: new Phaser.Point(1, 1),
                enemy1: king13,
                enemy2: WorldModel.EMPTY_ENEMY,
                enemy3: WorldModel.EMPTY_ENEMY
            };
            var grid14 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 3, 0, 1, 1, 1, 0, 0, 0], [0, 7, 1, 1, 1, 1, 1, 0, 0], [0, 0, 1, 6, 6, 6, 1, 5, 0], [0, 1, 1, 6, 1, 6, 1, 3, 0], [0, 1, 1, 6, 6, 6, 1, 7, 0], [0, 5, 1, 1, 1, 1, 1, 5, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid14powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var king14 = { name: WorldModel.KING, position: new Phaser.Point(7, 4), stupid: 1 };
            this._levels[13] = {
                grid: grid14,
                gridPowerUps: grid14powerUps,
                scoreArray: [30, 80, 116],
                playerPosition: new Phaser.Point(1, 1),
                enemy1: king14,
                enemy2: WorldModel.EMPTY_ENEMY,
                enemy3: WorldModel.EMPTY_ENEMY
            };
            var grid15 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 3, 1, 1, 1, 1, 0, 0], [0, 0, 1, 1, 5, 1, 1, 0, 0], [0, 0, 1, 1, 5, 1, 1, 0, 0], [0, 0, 3, 1, 1, 1, 3, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid15powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 2, 0, 0, 0, 0], [0, 0, 0, 0, 2, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var pinguin151 = { name: WorldModel.PINGUIN, position: new Phaser.Point(2, 5), stupid: 1 };
            var pinguin152 = { name: WorldModel.PINGUIN, position: new Phaser.Point(6, 5), stupid: 1 };
            this._levels[14] = {
                grid: grid15,
                gridPowerUps: grid15powerUps,
                scoreArray: [80, 600, 730],
                playerPosition: new Phaser.Point(2, 2),
                enemy1: WorldModel.EMPTY_ENEMY,
                enemy2: pinguin151,
                enemy3: pinguin152
            };
            var grid16 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 3, 1, 1, 1, 0], [0, 2, 2, 0, 1, 0, 2, 2, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 2, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 1, 0], [0, 3, 1, 1, 5, 1, 1, 3, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid16powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 2, 2, 0, 0, 0, 2, 2, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var pinguin161 = { name: WorldModel.PINGUIN, position: new Phaser.Point(1, 6), stupid: 1 };
            var pinguin162 = { name: WorldModel.PINGUIN, position: new Phaser.Point(7, 6), stupid: 1 };
            this._levels[15] = {
                grid: grid16,
                gridPowerUps: grid16powerUps,
                scoreArray: [80, 800, 1080],
                playerPosition: new Phaser.Point(4, 1),
                enemy1: WorldModel.EMPTY_ENEMY,
                enemy2: pinguin161,
                enemy3: pinguin162
            };
            var grid17 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 3, 2, 0, 5, 0, 2, 1, 0], [0, 2, 0, 0, 2, 0, 0, 5, 0], [0, 0, 0, 0, 0, 0, 0, 1, 0], [0, 5, 2, 0, 5, 2, 0, 5, 0], [0, 1, 0, 2, 1, 0, 0, 1, 0], [0, 0, 0, 0, 1, 0, 4, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid17powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 2, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            this._levels[16] = {
                grid: grid17,
                gridPowerUps: grid17powerUps,
                scoreArray: [30, 180, 245],
                playerPosition: new Phaser.Point(1, 1),
                enemy1: WorldModel.EMPTY_ENEMY,
                enemy2: WorldModel.EMPTY_ENEMY,
                enemy3: WorldModel.EMPTY_ENEMY
            };
            var grid18 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 1, 5, 1, 3, 0], [0, 3, 1, 5, 1, 1, 1, 5, 0], [0, 0, 0, 0, 0, 0, 0, 2, 0], [0, 1, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 5, 1, 1, 1, 1, 0], [0, 3, 1, 1, 1, 5, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid18powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var pinguin181 = { name: WorldModel.PINGUIN, position: new Phaser.Point(7, 1), stupid: 1 };
            var pinguin182 = { name: WorldModel.PINGUIN, position: new Phaser.Point(1, 6), stupid: 1 };
            this._levels[17] = {
                grid: grid18,
                gridPowerUps: grid18powerUps,
                scoreArray: [80, 500, 770],
                playerPosition: new Phaser.Point(1, 2),
                enemy1: WorldModel.EMPTY_ENEMY,
                enemy2: pinguin181,
                enemy3: pinguin182
            };
            var grid19 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 3, 7, 6, 7, 6, 7, 3, 0], [0, 7, 6, 1, 6, 1, 6, 7, 0], [0, 6, 7, 6, 5, 6, 7, 6, 0], [0, 5, 6, 1, 6, 1, 6, 5, 0], [0, 6, 7, 6, 1, 6, 7, 6, 0], [0, 3, 1, 7, 6, 7, 1, 3, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid19powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0, 0, 2, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var king19 = { name: WorldModel.KING, position: new Phaser.Point(7, 6), stupid: 1 };
            this._levels[18] = {
                grid: grid19,
                gridPowerUps: grid19powerUps,
                scoreArray: [80, 135, 335],
                playerPosition: new Phaser.Point(1, 1),
                enemy1: king19,
                enemy2: WorldModel.EMPTY_ENEMY,
                enemy3: WorldModel.EMPTY_ENEMY
            };
            var grid20 = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 3, 0, 0, 0, 0, 0], [0, 0, 0, 1, 1, 1, 3, 0, 0], [0, 0, 0, 1, 5, 1, 0, 0, 0], [0, 0, 3, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 3, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var grid20powerUps = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 2, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 2, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 2, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
            var king20 = { name: WorldModel.KING, position: new Phaser.Point(5, 6), stupid: 1 };
            var pinguin201 = { name: WorldModel.PINGUIN, position: new Phaser.Point(2, 5), stupid: 1 };
            var pinguin202 = { name: WorldModel.PINGUIN, position: new Phaser.Point(6, 3), stupid: 1 };
            this._levels[19] = {
                grid: grid20,
                gridPowerUps: grid20powerUps,
                scoreArray: [80, 480, 580],
                playerPosition: new Phaser.Point(3, 2),
                enemy1: king20,
                enemy2: pinguin201,
                enemy3: pinguin202
            };
        }
        WorldModel.prototype.getLevel = function (id) {
            return this._levels[id];
        };
        return WorldModel;
    }());
    WorldModel.EMPTY_ENEMY = { name: "empty", position: new Phaser.Point(0, 0), stupid: 3 };
    WorldModel.KING = "KING";
    WorldModel.PINGUIN = "PINGUIN";
    TProject.WorldModel = WorldModel;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var ZSprite = (function (_super) {
        __extends(ZSprite, _super);
        function ZSprite(game) {
            return _super.call(this, game, 0.0, 0.0) || this;
        }
        ZSprite.prototype.addChild = function (child) {
            var i = 0;
            var lng = this.children.length;
            for (i; i < lng; i++) {
                if (this.children[i].y > child.y) {
                    break;
                }
            }
            return _super.prototype.addChildAt.call(this, child, i);
        };
        return ZSprite;
    }(Phaser.Sprite));
    TProject.ZSprite = ZSprite;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var PLACE;
    (function (PLACE) {
        PLACE[PLACE["LOSE"] = 0] = "LOSE";
        PLACE[PLACE["BRONZE"] = 1] = "BRONZE";
        PLACE[PLACE["SILVER"] = 2] = "SILVER";
        PLACE[PLACE["GOLD"] = 3] = "GOLD";
    })(PLACE = TProject.PLACE || (TProject.PLACE = {}));
    var AbstractGame = (function (_super) {
        __extends(AbstractGame, _super);
        function AbstractGame() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AbstractGame.prototype.create = function () {
            this.isPaused = false;
            this._debugMode = false;
            if (this.game.device.desktop) {
                this.game.input.keyboard.onDownCallback = this.onKeyDown;
                this.game.input.keyboard.onUpCallback = this.onKeyUp;
                this.game.onBlur.add(this.clearKeyBoard, this);
            }
            else {
                this._mobilePanel = new Phaser.Sprite(this.game, 110, 370);
                this._mobilePanel.scale.set(1.2);
                this._mobilePanel.alpha = 0;
                this._mobileButtons = [];
                var offsets = 46;
                this._mobileButtons.push(new SimpleButton(this, Phaser.Keyboard.UP, false, 0, -offsets * 0.5));
                this._mobilePanel.addChild(this._mobileButtons[0]);
                this._mobileButtons.push(new SimpleButton(this, Phaser.Keyboard.DOWN, false, 0, offsets * 1.5));
                this._mobilePanel.addChild(this._mobileButtons[1]);
                this._mobileButtons.push(new SimpleButton(this, Phaser.Keyboard.RIGHT, false, offsets, offsets * 0.5));
                this._mobilePanel.addChild(this._mobileButtons[2]);
                this._mobileButtons.push(new SimpleButton(this, Phaser.Keyboard.LEFT, false, -offsets, offsets * 0.5));
                this._mobilePanel.addChild(this._mobileButtons[3]);
                this.stage.addChild(this._mobilePanel);
            }
        };
        AbstractGame.prototype.showMobilePAD = function () {
            if (this._mobilePanel == null) {
                return;
            }
            this.add.tween(this._mobilePanel).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
        };
        AbstractGame.prototype.hideMobilePAD = function () {
            if (this._mobilePanel == null) {
                return;
            }
            this.add.tween(this._mobilePanel).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
        };
        AbstractGame.prototype.clearKeyBoard = function () {
            for (var key in AbstractGame.keysDown) {
                AbstractGame.keysDown[key] = false;
                AbstractGame.keysPressed[key] = false;
            }
        };
        AbstractGame.prototype.update = function () {
            for (var key in AbstractGame.keysPressed) {
                AbstractGame.keysPressed[key] = false;
            }
        };
        AbstractGame.prototype.onKeyDown = function (e) {
            if (AbstractGame.ValidKeyCodes.indexOf(e.keyCode) > -1 && !AbstractGame.keysDown[e.keyCode]) {
                AbstractGame.keysDown[e.keyCode] = true;
                AbstractGame.keysPressed[e.keyCode] = true;
            }
        };
        AbstractGame.prototype.onKeyUp = function (e) {
            if (AbstractGame.ValidKeyCodes.indexOf(e.keyCode) > -1) {
                AbstractGame.keysDown[e.keyCode] = false;
                AbstractGame.keysPressed[e.keyCode] = false;
            }
        };
        AbstractGame.prototype.isAnyKeyPressed = function () {
            for (var key in AbstractGame.keysPressed) {
                if (AbstractGame.keysPressed[key]) {
                    return true;
                }
            }
            return false;
        };
        AbstractGame.prototype.simulateKey = function (code, down) {
            if (down === void 0) { down = true; }
            if (down) {
                if (AbstractGame.ValidKeyCodes.indexOf(code) > -1 && !AbstractGame.keysDown[code]) {
                    AbstractGame.keysDown[code] = true;
                    AbstractGame.keysPressed[code] = true;
                }
            }
            else {
                if (AbstractGame.ValidKeyCodes.indexOf(code) > -1) {
                    AbstractGame.keysDown[code] = false;
                    AbstractGame.keysPressed[code] = false;
                }
            }
        };
        AbstractGame.prototype.shutdown = function () {
            if (this.game.device.desktop) {
                this.game.input.keyboard.onDownCallback = null;
                this.game.input.keyboard.onUpCallback = null;
                this.game.onBlur.remove(this.clearKeyBoard, this);
            }
            else {
                this.game.stage.removeChild(this._mobilePanel);
                while (this._mobileButtons.length) {
                    this._mobileButtons[this._mobileButtons.length - 1].enabled = false;
                    this._mobilePanel.removeChild(this._mobileButtons.pop());
                }
                this._mobileButtons = null;
            }
            this.free();
        };
        AbstractGame.prototype.setDebugMode = function () {
            this.game.time.advancedTiming = true;
            this._debugMode = true;
        };
        AbstractGame.prototype.free = function () {
        };
        AbstractGame.prototype.replay = function () {
        };
        AbstractGame.prototype.render = function () {
            if (this._debugMode) {
                this.game.debug.text("" + this.game.time.fps, 2, 14, "#00ff00");
            }
        };
        Object.defineProperty(AbstractGame.prototype, "currentLevel", {
            set: function (value) {
                AbstractGame.CURRENT_LEVEL = value;
            },
            enumerable: true,
            configurable: true
        });
        return AbstractGame;
    }(Phaser.State));
    AbstractGame.ValidKeyCodes = [
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN,
        Phaser.Keyboard.W,
        Phaser.Keyboard.A,
        Phaser.Keyboard.S,
        Phaser.Keyboard.D
    ];
    AbstractGame.keysPressed = {};
    AbstractGame.keysDown = {};
    AbstractGame.CURRENT_LEVEL = 0;
    TProject.AbstractGame = AbstractGame;
    var SimpleButton = (function (_super) {
        __extends(SimpleButton, _super);
        function SimpleButton(game, code, sticky, x, y) {
            if (sticky === void 0) { sticky = false; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            var _this = this;
            var char = "";
            _this = _super.call(this, game.game, x, y, "IngameUI", "mobileButton") || this;
            switch (code) {
                case Phaser.Keyboard.LEFT:
                    _this.angle = -90;
                    break;
                case Phaser.Keyboard.RIGHT:
                    _this.angle = 90;
                    break;
                case Phaser.Keyboard.UP:
                    _this.angle = 0;
                    break;
                case Phaser.Keyboard.DOWN:
                    _this.angle = 180;
                    break;
            }
            _this._code = code;
            _this._name = name;
            _this.anchor.set(0.5);
            _this.inputEnabled = false;
            _this.defScale = 1.0;
            _this._sticky = sticky;
            _this._agame = game;
            _this.enabled = true;
            _this._agame.game.world.add(_this);
            return _this;
        }
        Object.defineProperty(SimpleButton.prototype, "enabled", {
            get: function () {
                return this.inputEnabled;
            },
            set: function (value) {
                if (value && this.enabled) {
                    return;
                }
                this.inputEnabled = value;
                if (value) {
                    this.events.onInputDown.add(this.down, this);
                    this.events.onInputUp.add(this.up, this);
                }
                else {
                    this.events.onInputDown.removeAll(this);
                    this.events.onInputUp.removeAll(this);
                }
            },
            enumerable: true,
            configurable: true
        });
        SimpleButton.prototype.update = function () {
            if (this._down && this._sticky) {
                this.down();
            }
        };
        SimpleButton.prototype.testUp = function () {
            if (!this.input.pointerDown()) {
                return;
            }
            if (this._down) {
                this.up();
            }
        };
        SimpleButton.prototype.up = function () {
            this._agame.simulateKey(this._code, false);
            this._down = false;
            this.scale.set(this.defScale, 1.0);
        };
        SimpleButton.prototype.down = function () {
            if (this._agame.isPaused) {
                return;
            }
            var flag = false;
            if (this._sticky) {
                this._agame.simulateKey(this._code);
                flag = true;
            }
            if (this._down) {
                return;
            }
            this._down = true;
            this.scale.set(this.defScale * 0.9, 0.9);
            if (!flag) {
                this._agame.simulateKey(this._code);
            }
        };
        SimpleButton.prototype.setPos = function (x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        };
        return SimpleButton;
    }(Phaser.Sprite));
    TProject.SimpleButton = SimpleButton;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var ParallaxImage = (function (_super) {
        __extends(ParallaxImage, _super);
        function ParallaxImage(game, bgPicName, beginOffset, frame) {
            if (beginOffset === void 0) { beginOffset = 0.0; }
            var _this = _super.call(this, game, 0.0, 0.0) || this;
            game.world.add(_this);
            _this._images = [];
            _this._images.push(new Phaser.Image(game, beginOffset, 0.0, bgPicName, frame));
            _this._imgWidth = _this._images[0].width;
            _this._images.push(new Phaser.Image(game, beginOffset + _this._imgWidth - 1.0, 0.0, bgPicName, frame));
            _this.addChild(_this._images[0]);
            _this.addChild(_this._images[1]);
            return _this;
        }
        ParallaxImage.prototype.updateScroll = function (speed) {
            this._images[0].x -= speed;
            this._images[1].x -= speed;
            if (this._images[0].x <= -this._imgWidth) {
                this._images[0].x = this._images[1].x + this._imgWidth - 1;
            }
            if (this._images[1].x <= -this._imgWidth) {
                this._images[1].x = this._images[0].x + this._imgWidth - 1;
            }
        };
        ParallaxImage.prototype.free = function () {
            this.removeChild(this._images[0]);
            this.removeChild(this._images[1]);
            this._images.pop().destroy(true);
            this._images.pop().destroy(true);
            this._images = null;
        };
        ParallaxImage.prototype.setPosition = function (x) {
            this._images[0].x = x;
            this._images[1].x = x + this._imgWidth - 1.0;
        };
        return ParallaxImage;
    }(Phaser.Sprite));
    TProject.ParallaxImage = ParallaxImage;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var SavedData = (function () {
        function SavedData() {
        }
        SavedData.save = function () {
            if (!SavedData._canSaveProress) {
                return;
            }
            localStorage.setItem(this.SAVE_DATA_NAME, JSON.stringify(this._savedata));
        };
        SavedData.load = function () {
            SavedData._canSaveProress = false;
            if (!SavedData.isLocalStorageNameSupported()) {
                SavedData.reset();
                return;
            }
            SavedData._canSaveProress = true;
            this._savedata = JSON.parse(localStorage.getItem(this.SAVE_DATA_NAME));
            if (this._savedata == null) {
                SavedData.reset();
                localStorage.setItem(this.SAVE_DATA_NAME, JSON.stringify(this._savedata));
            }
        };
        SavedData.reset = function () {
            if (this._savedata == null) {
                this._savedata = {
                    "sfx": true,
                    "levelStatus": [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    "gemsStatus": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                };
            }
        };
        Object.defineProperty(SavedData, "levelStatus", {
            get: function () {
                return this._savedata.levelStatus;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SavedData, "gemsStatus", {
            get: function () {
                return this._savedata.gemsStatus;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SavedData, "sfx", {
            get: function () {
                return this._savedata.sfx;
            },
            set: function (value) {
                if (this._savedata.sfx == value) {
                    return;
                }
                this._savedata.sfx = value;
                if (value) {
                    TProject.SoundMixer.on();
                }
                else {
                    TProject.SoundMixer.off();
                }
            },
            enumerable: true,
            configurable: true
        });
        SavedData.isLocalStorageNameSupported = function () {
            var testKey = "test", storage = window.localStorage;
            try {
                storage.setItem(testKey, "1");
                storage.removeItem(testKey);
                return true;
            }
            catch (error) {
                return false;
            }
        };
        return SavedData;
    }());
    SavedData.SAVE_DATA_NAME = "FrostyFight_03";
    TProject.SavedData = SavedData;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var SoundMixer = (function () {
        function SoundMixer() {
        }
        SoundMixer.setGlobalAudioSettings = function (game) {
            SoundMixer._audio = game.add.audioSprite("Sfx");
        };
        SoundMixer.setAudioForState = function (currentState, volume) {
            if (volume === void 0) { volume = 0.16; }
            var bgString = SoundMixer.getBgNameMusic(currentState);
            SoundMixer._audio.stop(null);
            if (TProject.SavedData.sfx) {
                this._bgSound = SoundMixer._audio.play(bgString, volume);
                this._bgSound.allowMultiple = true;
            }
            SoundMixer._currentAudioLoop = currentState;
        };
        SoundMixer.getBgNameMusic = function (index) {
            switch (index) {
                case 0: return "bGLoop)";
                case 1: return "bGGameLoop";
            }
        };
        SoundMixer.playSound = function (key, volume) {
            if (volume === void 0) { volume = 0.3; }
            if (!TProject.SavedData.sfx)
                return;
            SoundMixer._audio.play(key, volume).allowMultiple = true;
        };
        SoundMixer.stopCurrentLoop = function () {
            var bgString = SoundMixer.getBgNameMusic(SoundMixer._currentAudioLoop);
            this._bgSound = SoundMixer._audio.stop(bgString);
        };
        SoundMixer.stopSound = function (soundName) {
            SoundMixer._audio.stop(soundName);
        };
        SoundMixer.on = function () {
            var bgString = SoundMixer.getBgNameMusic(SoundMixer._currentAudioLoop);
            this._bgSound = SoundMixer._audio.play(bgString, 0.16);
            this._bgSound.allowMultiple = true;
        };
        SoundMixer.off = function () {
            SoundMixer._audio.stop(null);
        };
        return SoundMixer;
    }());
    TProject.SoundMixer = SoundMixer;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var dragonBones;
(function (dragonBones) {
    var PhaserArmatureDisplay = (function (_super) {
        __extends(PhaserArmatureDisplay, _super);
        function PhaserArmatureDisplay(game) {
            var _this = _super.call(this, game) || this;
            _this._eventDispatcher = new EventEmitter();
            return _this;
        }
        PhaserArmatureDisplay.prototype._onClear = function () {
            if (this._debugDrawer) {
            }
            this._armature = null;
            this._debugDrawer = null;
            this.destroy();
        };
        PhaserArmatureDisplay.prototype._debugDraw = function (isEnabled) {
        };
        PhaserArmatureDisplay.prototype.hasEvent = function (type) {
            return this._eventDispatcher.listeners(type, true);
        };
        PhaserArmatureDisplay.prototype.addEvent = function (type, listener, target) {
            this._eventDispatcher.addListener(type, listener, target);
        };
        PhaserArmatureDisplay.prototype.removeEvent = function (type, listener, target) {
            this._eventDispatcher.removeListener(type, listener, target);
        };
        PhaserArmatureDisplay.prototype._dispatchEvent = function (type, data) {
            this._eventDispatcher.emit(type, data);
        };
        PhaserArmatureDisplay.prototype.dispose = function (disposeProxy) {
            if (disposeProxy === void 0) { disposeProxy = true; }
            if (this._armature) {
                this._armature.dispose();
                this._armature = null;
            }
        };
        Object.defineProperty(PhaserArmatureDisplay.prototype, "armature", {
            get: function () {
                return this._armature;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PhaserArmatureDisplay.prototype, "animation", {
            get: function () {
                return this._armature.animation;
            },
            enumerable: true,
            configurable: true
        });
        PhaserArmatureDisplay.prototype.advanceTimeBySelf = function (on) {
            if (on) {
                this._armature.clock = dragonBones.PhaserFactory._clock;
            }
            else {
                this._armature.clock = null;
            }
        };
        return PhaserArmatureDisplay;
    }(Phaser.Group));
    dragonBones.PhaserArmatureDisplay = PhaserArmatureDisplay;
})(dragonBones || (dragonBones = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var dragonBones;
(function (dragonBones) {
    var PhaserFactory = (function (_super) {
        __extends(PhaserFactory, _super);
        function PhaserFactory(dataParser, game) {
            if (dataParser === void 0) { dataParser = null; }
            var _this = _super.call(this, dataParser) || this;
            if (!PhaserFactory._eventManager) {
                PhaserFactory._eventManager = new dragonBones.PhaserArmatureDisplay(game);
                PhaserFactory._clock = new dragonBones.WorldClock();
                PhaserFactory._game = game;
            }
            return _this;
        }
        PhaserFactory._clockHandler = function (passedTime) {
            if (passedTime === void 0) { passedTime = -1; }
            if (PhaserFactory._clock == null) {
                return;
            }
            PhaserFactory._clock.advanceTime(passedTime);
        };
        Object.defineProperty(PhaserFactory, "clock", {
            get: function () {
                return PhaserFactory._clock;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PhaserFactory, "factory", {
            get: function () {
                if (!PhaserFactory._factory) {
                    PhaserFactory._factory = new PhaserFactory(null, this._game);
                }
                return PhaserFactory._factory;
            },
            enumerable: true,
            configurable: true
        });
        PhaserFactory.startLoop = function (interval) {
            if (interval === void 0) { interval = 20; }
            PhaserFactory._clockID = setInterval(function () {
                PhaserFactory._clockHandler();
            }, interval);
        };
        PhaserFactory.stopLoop = function () {
            if (PhaserFactory._clockID == -1) {
                return;
            }
            clearInterval(PhaserFactory._clockID);
        };
        PhaserFactory.prototype._generateTextureAtlasData = function (textureAtlasData, textureAtlas) {
            if (textureAtlasData) {
                textureAtlasData.texture = textureAtlas;
            }
            else {
                textureAtlasData = dragonBones.BaseObject.borrowObject(dragonBones.PhaserTextureAtlasData);
            }
            return textureAtlasData;
        };
        PhaserFactory.prototype._generateArmature = function (dataPackage) {
            var armature = dragonBones.BaseObject.borrowObject(dragonBones.Armature);
            var armatureDisplay = new dragonBones.PhaserArmatureDisplay(PhaserFactory._game);
            armatureDisplay._armature = armature;
            armature._init(dataPackage.armature, dataPackage.skin, armatureDisplay, armatureDisplay, PhaserFactory._eventManager);
            return armature;
        };
        PhaserFactory.prototype._generateSlot = function (dataPackage, skinSlotData, armature) {
            var slot = dragonBones.BaseObject.borrowObject(dragonBones.PhaserSlot);
            slot._init(skinSlotData, new Phaser.Sprite(PhaserFactory._game, null, null), null);
            var displayList = [];
            for (var i = 0, l = skinSlotData.displays.length; i < l; ++i) {
                var displayData = skinSlotData.displays[i];
                switch (displayData.type) {
                    case 0:
                        if (!displayData.texture || dataPackage.textureAtlasName) {
                            displayData.texture = this._getTextureData(dataPackage.textureAtlasName || dataPackage.dataName, displayData.path);
                        }
                        displayList.push(slot.rawDisplay);
                        break;
                    case 2:
                        if (!displayData.texture || dataPackage.textureAtlasName) {
                            displayData.texture = this._getTextureData(dataPackage.textureAtlasName || dataPackage.dataName, displayData.path);
                        }
                        if (!displayData.mesh && displayData.share) {
                            displayData.mesh = skinSlotData.getMesh(displayData.share);
                        }
                        displayList.push(slot.meshDisplay);
                        break;
                    case 1:
                        var childArmature = this.buildArmature(displayData.path, dataPackage.dataName, null, dataPackage.textureAtlasName);
                        if (childArmature) {
                            childArmature.inheritAnimation = displayData.inheritAnimation;
                            if (!childArmature.inheritAnimation) {
                                var actions = skinSlotData.slot.actions.length > 0 ? skinSlotData.slot.actions : childArmature.armatureData.actions;
                                if (actions.length > 0) {
                                    for (var i_1 = 0, l_1 = actions.length; i_1 < l_1; ++i_1) {
                                        childArmature._bufferAction(actions[i_1]);
                                    }
                                }
                                else {
                                    childArmature.animation.play();
                                }
                            }
                            displayData.armature = childArmature.armatureData;
                        }
                        displayList.push(childArmature);
                        break;
                    default:
                        displayList.push(null);
                        break;
                }
            }
            slot._setDisplayList(displayList);
            return slot;
        };
        PhaserFactory.prototype.buildArmatureDisplay = function (armatureName, dragonBonesName, skinName, textureAtlasName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            if (skinName === void 0) { skinName = null; }
            if (textureAtlasName === void 0) { textureAtlasName = null; }
            var armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);
            if (armature) {
                var armatureDisplay = armature.display;
                PhaserFactory._clock.add(armature);
                return armatureDisplay;
            }
            return null;
        };
        PhaserFactory.prototype.getTextureDisplay = function (textureName, dragonBonesName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            var textureData = this._getTextureData(dragonBonesName, textureName);
            if (textureData) {
                if (!textureData.texture) {
                    var textureAtlasTexture = textureData.parent.texture;
                    var originSize = new PIXI.Rectangle(0, 0, textureData.region.width, textureData.region.height);
                    textureData.texture = new PIXI.Texture(textureAtlasTexture, null, textureData.region, originSize);
                }
                return new PIXI.Sprite(textureData.texture);
            }
            return null;
        };
        Object.defineProperty(PhaserFactory.prototype, "soundEventManater", {
            get: function () {
                return PhaserFactory._eventManager;
            },
            enumerable: true,
            configurable: true
        });
        return PhaserFactory;
    }(dragonBones.BaseFactory));
    PhaserFactory._factory = null;
    PhaserFactory._eventManager = null;
    PhaserFactory._clock = null;
    PhaserFactory._clockID = -1;
    dragonBones.PhaserFactory = PhaserFactory;
})(dragonBones || (dragonBones = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var dragonBones;
(function (dragonBones) {
    var PhaserSlot = (function (_super) {
        __extends(PhaserSlot, _super);
        function PhaserSlot() {
            return _super.call(this) || this;
        }
        PhaserSlot.toString = function () {
            return "[class dragonBones.PhaserSlot]";
        };
        PhaserSlot.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this._renderDisplay = null;
        };
        PhaserSlot.prototype._initDisplay = function (value) {
        };
        PhaserSlot.prototype._disposeDisplay = function (value) {
            if (value) {
                value.destroy();
            }
        };
        PhaserSlot.prototype._onUpdateDisplay = function () {
            this._renderDisplay = (this._display ? this._display : this._rawDisplay);
        };
        PhaserSlot.prototype._addDisplay = function () {
            var container = this._armature.display;
            container.addChild(this._renderDisplay);
        };
        PhaserSlot.prototype._replaceDisplay = function (value) {
            var container = this._armature.display;
            var prevDisplay = value;
            container.addChild(this._renderDisplay);
            container.swapChildren(this._renderDisplay, prevDisplay);
            container.removeChild(prevDisplay);
        };
        PhaserSlot.prototype._removeDisplay = function () {
            this._renderDisplay.parent.removeChild(this._renderDisplay);
        };
        PhaserSlot.prototype._updateZOrder = function () {
            var container = this._armature.display;
            container.addChildAt(this._renderDisplay, this._zOrder);
        };
        PhaserSlot.prototype._updateVisible = function () {
            this._renderDisplay.visible = this._parent.visible;
        };
        PhaserSlot.prototype._updateBlendMode = function () {
            switch (this._blendMode) {
                case 0:
                    this._renderDisplay.blendMode = PIXI.blendModes.NORMAL;
                    break;
                case 1:
                    this._renderDisplay.blendMode = PIXI.blendModes.ADD;
                    break;
                case 3:
                    this._renderDisplay.blendMode = PIXI.blendModes.DARKEN;
                    break;
                case 4:
                    this._renderDisplay.blendMode = PIXI.blendModes.DIFFERENCE;
                    break;
                case 6:
                    this._renderDisplay.blendMode = PIXI.blendModes.HARD_LIGHT;
                    break;
                case 9:
                    this._renderDisplay.blendMode = PIXI.blendModes.LIGHTEN;
                    break;
                case 10:
                    this._renderDisplay.blendMode = PIXI.blendModes.MULTIPLY;
                    break;
                case 11:
                    this._renderDisplay.blendMode = PIXI.blendModes.OVERLAY;
                    break;
                case 12:
                    this._renderDisplay.blendMode = PIXI.blendModes.SCREEN;
                    break;
                default:
                    break;
            }
        };
        PhaserSlot.prototype._updateColor = function () {
            this._renderDisplay.alpha = this._colorTransform.alphaMultiplier;
        };
        PhaserSlot.prototype._updateFrame = function () {
            var isMeshDisplay = this._meshData && this._display === this._meshDisplay;
            var currentTextureData = this._textureData;
            if (this._displayIndex >= 0 && this._display && currentTextureData) {
                var currentTextureAtlasData = currentTextureData.parent;
                if (this._armature.replacedTexture && this._displayData && currentTextureAtlasData === this._displayData.texture.parent) {
                    currentTextureAtlasData = this._armature._replaceTextureAtlasData;
                    if (!currentTextureAtlasData) {
                        currentTextureAtlasData = dragonBones.BaseObject.borrowObject(dragonBones.PhaserTextureAtlasData);
                        currentTextureAtlasData.copyFrom(currentTextureData.parent);
                        currentTextureAtlasData.texture = this._armature.replacedTexture;
                        this._armature._replaceTextureAtlasData = currentTextureAtlasData;
                    }
                    currentTextureData = currentTextureAtlasData.getTexture(currentTextureData.name);
                }
                var currentTextureAtlas = currentTextureAtlasData.texture;
                if (currentTextureAtlas) {
                    if (!currentTextureData.texture) {
                        currentTextureData.texture = new PIXI.Texture(currentTextureAtlas, currentTextureData.region, currentTextureData.region, new PIXI.Rectangle(0, 0, currentTextureData.region.width, currentTextureData.region.height));
                    }
                    if (isMeshDisplay) {
                        var meshDisplay = this._renderDisplay;
                        var textureAtlasWidth = currentTextureAtlas ? currentTextureAtlas.width : 1;
                        var textureAtlasHeight = currentTextureAtlas ? currentTextureAtlas.height : 1;
                        meshDisplay.uvs = new Float32Array(this._meshData.uvs);
                        meshDisplay.vertices = new Float32Array(this._meshData.vertices);
                        meshDisplay.indices = new Uint16Array(this._meshData.vertexIndices);
                        for (var i = 0, l = meshDisplay.uvs.length; i < l; i += 2) {
                            var u = meshDisplay.uvs[i];
                            var v = meshDisplay.uvs[i + 1];
                            meshDisplay.uvs[i] = (currentTextureData.region.x + u * currentTextureData.region.width) / textureAtlasWidth;
                            meshDisplay.uvs[i + 1] = (currentTextureData.region.y + v * currentTextureData.region.height) / textureAtlasHeight;
                        }
                        meshDisplay.texture = currentTextureData.texture;
                        meshDisplay.dirty = true;
                    }
                    else {
                        var normalDisplay = this._renderDisplay;
                        normalDisplay.texture = currentTextureData.texture;
                    }
                    this._updateVisible();
                    return;
                }
            }
            if (isMeshDisplay) {
                var meshDisplay = this._renderDisplay;
                meshDisplay.visible = false;
                meshDisplay.texture = null;
                meshDisplay.x = 0.0;
                meshDisplay.y = 0.0;
            }
            else {
                var normalDisplay = this._renderDisplay;
                normalDisplay.visible = false;
                normalDisplay.texture = null;
                normalDisplay.x = 0.0;
                normalDisplay.y = 0.0;
            }
        };
        PhaserSlot.prototype._updateMesh = function () {
            var meshDisplay = this._renderDisplay;
            var hasFFD = this._ffdVertices.length > 0;
            if (this._meshData.skinned) {
                for (var i = 0, iF = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                    var iH = i / 2;
                    var boneIndices = this._meshData.boneIndices[iH];
                    var boneVertices = this._meshData.boneVertices[iH];
                    var weights = this._meshData.weights[iH];
                    var xG = 0.0, yG = 0.0;
                    for (var iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
                        var bone = this._meshBones[boneIndices[iB]];
                        var matrix = bone.globalTransformMatrix;
                        var weight = weights[iB];
                        var xL = 0.0, yL = 0.0;
                        if (hasFFD) {
                            xL = boneVertices[iB * 2] + this._ffdVertices[iF];
                            yL = boneVertices[iB * 2 + 1] + this._ffdVertices[iF + 1];
                        }
                        else {
                            xL = boneVertices[iB * 2];
                            yL = boneVertices[iB * 2 + 1];
                        }
                        xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
                        yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;
                        iF += 2;
                    }
                    meshDisplay.vertices[i] = xG;
                    meshDisplay.vertices[i + 1] = yG;
                }
            }
            else if (hasFFD) {
                var vertices = this._meshData.vertices;
                for (var i = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                    var xG = vertices[i] + this._ffdVertices[i];
                    var yG = vertices[i + 1] + this._ffdVertices[i + 1];
                    meshDisplay.vertices[i] = xG;
                    meshDisplay.vertices[i + 1] = yG;
                }
            }
        };
        PhaserSlot.prototype._updateTransform = function (isSkinnedMesh) {
            if (isSkinnedMesh) {
                this._renderDisplay.position.x = 0.0;
                this._renderDisplay.position.y = 0.0;
                this._renderDisplay.scale.x = 1.0;
                this._renderDisplay.scale.y = 1.0;
                this._renderDisplay.rotation = 0.0;
                this._renderDisplay.skew.x = 0.0;
                this._renderDisplay.skew.y = 0.0;
                this._renderDisplay.pivot.x = 0.0;
                this._renderDisplay.pivot.y = 0.0;
            }
            else {
                var x = this.globalTransformMatrix.tx - (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
                var y = this.globalTransformMatrix.ty - (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY);
                if (this._renderDisplay instanceof Phaser.Rope) {
                    this._renderDisplay.position.x = x || 0;
                    this._renderDisplay.position.y = y || 0;
                    this._renderDisplay.worldTransform.tx = this.globalTransformMatrix.tx;
                    this._renderDisplay.worldTransform.ty = this.globalTransformMatrix.ty;
                    this._renderDisplay.worldTransform.a = this.globalTransformMatrix.a;
                    this._renderDisplay.worldTransform.b = this.globalTransformMatrix.b;
                    this._renderDisplay.worldTransform.c = this.globalTransformMatrix.c;
                    this._renderDisplay.worldTransform.d = this.globalTransformMatrix.d;
                    var scaleX = !this._renderDisplay.parent.scale.x ? 1 : this._renderDisplay.parent.scale.x;
                    var scaleY = !this._renderDisplay.parent.scale.y ? 1 : this._renderDisplay.parent.scale.y;
                    this._renderDisplay.worldTransform.scale(scaleX, scaleY);
                    this._renderDisplay.worldTransform.translate(this._renderDisplay.parent.x, this._renderDisplay.parent.y);
                }
                else if (this._renderDisplay instanceof PIXI.Sprite) {
                    this.updateGlobalTransform();
                    this._renderDisplay.position.x = this.globalTransformMatrix.tx -
                        (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
                    this._renderDisplay.position.y = this.globalTransformMatrix.ty -
                        (this.globalTransformMatrix.b * this._pivotX + this.globalTransformMatrix.d * this._pivotY);
                    this._renderDisplay.scale.x = !this.global.scaleX ? 1 : this.global.scaleX;
                    this._renderDisplay.scale.y = !this.global.scaleY ? 1 : this.global.scaleY;
                    this._renderDisplay.rotation = this.global.skewX;
                    this._renderDisplay.skew.x = 0.0;
                    this._renderDisplay.skew.y = this.global.skewY - this.global.skewX;
                }
            }
        };
        return PhaserSlot;
    }(dragonBones.Slot));
    dragonBones.PhaserSlot = PhaserSlot;
})(dragonBones || (dragonBones = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var dragonBones;
(function (dragonBones) {
    var PhaserTextureAtlasData = (function (_super) {
        __extends(PhaserTextureAtlasData, _super);
        function PhaserTextureAtlasData() {
            return _super.call(this) || this;
        }
        PhaserTextureAtlasData.toString = function () {
            return "[class dragonBones.PhaserTextureAtlasData]";
        };
        PhaserTextureAtlasData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.texture) {
                this.texture = null;
            }
        };
        PhaserTextureAtlasData.prototype.generateTexture = function () {
            return dragonBones.BaseObject.borrowObject(PhaserTextureData);
        };
        return PhaserTextureAtlasData;
    }(dragonBones.TextureAtlasData));
    dragonBones.PhaserTextureAtlasData = PhaserTextureAtlasData;
    var PhaserTextureData = (function (_super) {
        __extends(PhaserTextureData, _super);
        function PhaserTextureData() {
            return _super.call(this) || this;
        }
        PhaserTextureData.toString = function () {
            return "[class dragonBones.PhaserTextureData]";
        };
        PhaserTextureData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.texture) {
                this.texture.destroy(true);
                this.texture = null;
            }
        };
        return PhaserTextureData;
    }(dragonBones.TextureData));
    dragonBones.PhaserTextureData = PhaserTextureData;
})(dragonBones || (dragonBones = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var BackGround = (function (_super) {
        __extends(BackGround, _super);
        function BackGround(game, x, y, currentAnimation) {
            var _this = _super.call(this, game, x, y) || this;
            _this._bg = new TProject.DBSprite(TProject.Boot.MENU_UI, "_DB/ice_kingdom", _this.game);
            _this.createRipples();
            _this.addChild(_this._bg);
            return _this;
        }
        BackGround.prototype.createRipples = function () {
            this._ripplesAnimation = [];
            this._ripples = [];
            this._timers = [];
            this._startRipples = false;
            for (var i = 1; i <= 7; i++) {
                var ripple = this.game.add.sprite(0, 0, "MenuUI", "ripple_movie_10000");
                ripple.anchor.set(0.1, 0.4);
                this._ripplesAnimation.push(ripple.animations.add("ripple", Phaser.Animation.generateFrameNames("ripple_movie_", 10000, 10065), 24, false));
                this._bg.getBone("ripples" + i).addChild(ripple);
                this._ripples.push(ripple);
            }
        };
        BackGround.prototype.getDBObject = function () {
            return this._bg;
        };
        BackGround.prototype.gotoLevel = function (value) {
            this.stopRipples();
            this._bg.play(value.toString());
            this.playRipples();
        };
        BackGround.prototype.playRipples = function () {
            for (var i = 0; i < 7; i++) {
                this._timers[i] = i * 0.5;
                this._ripplesAnimation[i].frame = 0;
            }
            this._startRipples = true;
        };
        BackGround.prototype.stopRipples = function () {
            this._startRipples = false;
        };
        BackGround.prototype.riplesUpdate = function () {
            var dt = this.game.time.elapsed / 1000;
            if (dt > 0.02) {
                dt = 0.02;
            }
            if (this._startRipples) {
                for (var i = 0; i < 7; i++) {
                    this._timers[i] -= dt;
                    this._ripplesAnimation[i].update();
                    if (!this._ripplesAnimation[i].isPlaying && this._ripplesAnimation[i].frame != this._ripplesAnimation[i].frameTotal && this._ripples[i].alpha == 1) {
                        this._ripples[i].alpha = 0;
                    }
                    if (this._timers[i] < 0 && this._timers[i] > -100) {
                        this._ripplesAnimation[i].play();
                        this._ripples[i].alpha = 1;
                        this._timers[i] = BackGround.RIPPLES_START_DELAY[i] + this._ripplesAnimation[i].frameTotal * 24 / 1000;
                    }
                }
            }
        };
        return BackGround;
    }(Phaser.Sprite));
    BackGround.RIPPLES_START_DELAY = [1.8, 3, 1.5, 1.5, 3, 1.5, 1];
    TProject.BackGround = BackGround;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var GameUI = (function (_super) {
        __extends(GameUI, _super);
        function GameUI(game, baseGame) {
            var _this = _super.call(this, game, 0.0, 0.0) || this;
            _this._baseGame = baseGame;
            _this._levelPanel = _this.game.add.sprite(381, 22, "IngameUI", "hud_short-02");
            _this._levelPanel.anchor.set(0.5);
            _this.addChild(_this._levelPanel);
            _this._levelText = _this.game.add.text(19, -7, "0", {
                font: TProject.Boot.LOCALE.pickUpFont(TProject.FontType.LIGHT),
                fontSize: "20px",
                fontWeight: "bold",
                fill: "#000000",
            });
            _this._levelText.anchor.set(0.5);
            _this._levelText.align = "center";
            _this._levelPanel.addChild(_this._levelText);
            _this._scorePanel = _this.game.add.sprite(540, 22, "IngameUI", "hud_long-01");
            _this._scorePanel.anchor.set(0.5);
            _this.addChild(_this._scorePanel);
            _this._scoreText = _this.game.add.text(3, -7, "0", {
                font: TProject.Boot.LOCALE.pickUpFont(TProject.FontType.LIGHT),
                fontSize: "20px",
                fontWeight: "bold",
                fill: "#000000",
            });
            _this._scoreText.anchor.set(0.5);
            _this._scoreText.align = "center";
            _this._scorePanel.addChild(_this._scoreText);
            _this._swordIndicator = new TProject.SwordIndicator(_this.game, 17, -15);
            _this.addChild(_this._swordIndicator);
            _this._scoreInScreen = new TProject.ScoreInScreen(_this.game);
            _this.addChild(_this._scoreInScreen);
            _this._startWinLose = new TProject.StartWinLose(_this.game, function () { _this._baseGame.simpleShowConrainer(); }, function () { _this._baseGame.restartLevel(); }, function () { _this._baseGame.newLevel(); }, function () { _this.game.state.start("Menu", true); });
            _this.addChild(_this._startWinLose);
            return _this;
        }
        GameUI.prototype.setDragToObject = function (sprite) {
            sprite.inputEnabled = true;
            sprite.input.enableDrag();
            sprite.events.onDragStop.add(this.onDragStop, this);
        };
        GameUI.prototype.onDragStop = function (sprite) {
            console.log(sprite.x + ", " + sprite.y + ",");
        };
        GameUI.prototype.init = function () {
            this._currentScoreArray = [];
            this._player = null;
            this._iceKing = null;
            this._score = 0;
            this._levelOrbMax = 0;
            this._levelOrbCurrent = 0;
            this._scoreModificator = 1;
            this._levelText.text = (TProject.AbstractGame.CURRENT_LEVEL + 1).toString();
            this._scoreText.text = "0";
            this._swordIndicator.setSwordScale(0);
        };
        GameUI.prototype.dropForNextLevel = function () {
            this._score = 0;
            this._levelOrbCurrent = 0;
            this._scoreModificator = 1;
            this._levelText.text = (TProject.AbstractGame.CURRENT_LEVEL + 1).toString();
            this._scoreText.text = "0";
            this._swordIndicator.setSwordScale(0);
        };
        Object.defineProperty(GameUI.prototype, "player", {
            set: function (player) {
                this._player = player;
            },
            enumerable: true,
            configurable: true
        });
        GameUI.prototype.setEnemy = function (_iceKing, pinguin1, pinguin2) {
            this._iceKing = _iceKing;
            this._pinguin1 = pinguin1;
            this._pinguin2 = pinguin2;
        };
        GameUI.prototype.checkDangers = function (cx, cy, jumpInWater) {
            if (jumpInWater === void 0) { jumpInWater = false; }
            if (this._player && this._player.cx == cx && this._player.cy == cy && this._player.canMove)
                this._player.hit(jumpInWater);
            if (this._iceKing && this._iceKing.cx == cx && this._iceKing.cy == cy && this._iceKing.canMove)
                this._iceKing.hit();
            if (this._pinguin1 && this._pinguin1.cx == cx && this._pinguin1.cy == cy && this._pinguin1.canMove)
                this._pinguin1.hit();
            if (this._pinguin2 && this._pinguin2.cx == cx && this._pinguin2.cy == cy && this._pinguin2.canMove)
                this._pinguin2.hit();
        };
        GameUI.prototype.addPowerUP = function () {
            this._score += 100;
            this._scoreText.text = this._score.toString();
            this._scoreInScreen.addScore(this._player.x, this._player.y, "100", true);
        };
        GameUI.prototype.checkPlayer = function () {
            var hitTrue = false;
            if (this._iceKing.visible && this._player && this._player.imBooked(this._iceKing.cx, this._iceKing.cy)) {
                this._player.hit(false, true);
                this._iceKing.fight();
                this.gameOver();
            }
            if (this._pinguin1.visible && this._player && this._player.imBooked(this._pinguin1.cx, this._pinguin1.cy)) {
                this._player.hit(false, true);
                this._pinguin1.fight();
                this.gameOver();
            }
            if (this._pinguin2.visible && this._player && this._player.imBooked(this._pinguin2.cx, this._pinguin2.cy)) {
                this._player.hit(false, true);
                this._pinguin2.fight();
                this.gameOver();
            }
        };
        GameUI.prototype.dropScoreModificator = function () {
            this._scoreModificator = 1;
        };
        GameUI.prototype.addScore = function () {
            var currentGetScore = 5 * this._scoreModificator;
            this._scoreModificator++;
            this._score += currentGetScore;
            this._scoreText.text = this._score.toString();
            this._levelOrbCurrent++;
            this._swordIndicator.setSwordScale(this._levelOrbCurrent / this._levelOrbMax);
            this._scoreInScreen.addScore(this._player.x, this._player.y, currentGetScore.toString());
            if (this._levelOrbCurrent == this._levelOrbMax)
                this.gameWin();
        };
        GameUI.prototype.gameOver = function () {
            this._baseGame.playerLost();
        };
        GameUI.prototype.gameWin = function () {
            TProject.SavedData.levelStatus[TProject.AbstractGame.CURRENT_LEVEL] = 3;
            if (TProject.AbstractGame.CURRENT_LEVEL < 19 && TProject.SavedData.levelStatus[TProject.AbstractGame.CURRENT_LEVEL + 1] != 3)
                TProject.SavedData.levelStatus[TProject.AbstractGame.CURRENT_LEVEL + 1] = 2;
            var gemsCount = 1;
            if (this._score >= this._currentScoreArray[1])
                gemsCount = 2;
            if (this._score >= this._currentScoreArray[2])
                gemsCount = 3;
            if (TProject.SavedData.gemsStatus[TProject.AbstractGame.CURRENT_LEVEL] < gemsCount)
                TProject.SavedData.gemsStatus[TProject.AbstractGame.CURRENT_LEVEL] = gemsCount;
            TProject.SavedData.save();
            this._baseGame.playerWon();
        };
        GameUI.prototype.showLevelStartMenu = function () {
            this._startWinLose.setState("start");
        };
        GameUI.prototype.showLevelWinMenu = function () {
            var gemsCount = 1;
            if (this._score >= this._currentScoreArray[1])
                gemsCount = 2;
            if (this._score >= this._currentScoreArray[2])
                gemsCount = 3;
            this._startWinLose.setState("win", gemsCount);
            this._baseGame.hideMobilePAD();
        };
        GameUI.prototype.showLevelLoseMenu = function () {
            TProject.SoundMixer.playSound("levelFail");
            this._startWinLose.setState("lose");
            this._baseGame.hideMobilePAD();
        };
        GameUI.prototype.showGameWinMenu = function () {
            var _this = this;
            this._baseGame.hideMobilePAD();
            var winPanel = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "IngameUI", "ingame_panel0000");
            winPanel.anchor.set(0.5);
            this.addChild(winPanel);
            var orb1 = this.game.add.sprite(140, 92, "MenuUI", "pl_cheese_10000");
            orb1.animations.add("orb", Phaser.Animation.generateFrameNames("pl_cheese_", 10000, 10007));
            orb1.play("orb", 30, true);
            orb1.scale.set(0.8);
            var orb2 = this.game.add.sprite(96, 100, "MenuUI", "pl_cheese_10000");
            orb2.animations.add("orb", Phaser.Animation.generateFrameNames("pl_cheese_", 10000, 10007));
            orb2.play("orb", 30, true);
            orb2.scale.set(0.7);
            var orb3 = this.game.add.sprite(61, 116, "MenuUI", "pl_cheese_10000");
            orb3.animations.add("orb", Phaser.Animation.generateFrameNames("pl_cheese_", 10000, 10007));
            orb3.play("orb", 30, true);
            orb3.scale.set(0.6);
            winPanel.addChild(orb2);
            winPanel.addChild(orb3);
            winPanel.addChild(orb1);
            var orb4 = this.game.add.sprite(-184, 97, "MenuUI", "pl_cheese_10000");
            orb4.animations.add("orb", Phaser.Animation.generateFrameNames("pl_cheese_", 10000, 10007));
            orb4.play("orb", 30, true);
            orb4.scale.set(0.6);
            var orb5 = this.game.add.sprite(-245, 98, "MenuUI", "pl_cheese_10000");
            orb5.animations.add("orb", Phaser.Animation.generateFrameNames("pl_cheese_", 10000, 10007));
            orb5.play("orb", 30, true);
            orb5.scale.set(0.6);
            winPanel.addChild(orb4);
            winPanel.addChild(orb5);
            var fin = new TProject.DBSprite(TProject.Boot.CHARACTERS, "_DB/hyperFinn");
            fin.setPos(140, 170);
            fin.play("win");
            fin.scale.set(-1.35, 1.35);
            winPanel.addChild(fin);
            var pbg = new TProject.DBSprite(TProject.Boot.CHARACTERS, "_DB/bubblegum_win");
            pbg.setPos(-190, 170);
            pbg.play("idle");
            winPanel.addChild(pbg);
            var heart1 = new TProject.DBSprite(TProject.Boot.CHARACTERS, "_DB/heart_fly");
            heart1.setPos(-160, -60);
            heart1.play("idle");
            winPanel.addChild(heart1);
            var heart2 = new TProject.DBSprite(TProject.Boot.CHARACTERS, "_DB/heart_fly2");
            heart2.setPos(-180, -80);
            heart2.play("idle");
            winPanel.addChild(heart2);
            var upText = this.game.add.text(-5, -95, TProject.Boot.LOCALE.get("complete"), {
                font: TProject.Boot.LOCALE.pickUpFont(TProject.FontType.LIGHT),
                fontSize: "35px",
                fontWeight: "bold",
                fill: "#FFFFFF",
            });
            upText.anchor.set(0.5);
            winPanel.addChild(upText);
            var downText = this.game.add.text(-3, -32, TProject.Boot.LOCALE.get("complete2"), {
                font: TProject.Boot.LOCALE.pickUpFont(TProject.FontType.LIGHT),
                fontSize: "20px",
                fontWeight: "normal",
                fill: "#FFFFFF",
            });
            downText.anchor.set(0.5);
            downText.wordWrap = true;
            downText.lineSpacing -= 10;
            downText.wordWrapWidth = 300;
            downText.align = "center";
            winPanel.addChild(downText);
            winPanel.inputEnabled = true;
            winPanel.events.onInputDown.add(function () {
                fin.free();
                pbg.free();
                heart1.free();
                heart2.free();
                winPanel.destroy(true);
                _this._baseGame.free();
            });
        };
        GameUI.prototype.rechangePath = function () {
            if (this._iceKing)
                this._iceKing.iNeedFindPath();
        };
        Object.defineProperty(GameUI.prototype, "levelOrb", {
            set: function (value) {
                this._levelOrbMax = value;
            },
            enumerable: true,
            configurable: true
        });
        GameUI.prototype.setScoreArray = function (array) {
            this._currentScoreArray = array;
        };
        return GameUI;
    }(Phaser.Sprite));
    TProject.GameUI = GameUI;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var LevelSelectIcon = (function (_super) {
        __extends(LevelSelectIcon, _super);
        function LevelSelectIcon(game, x, y, levelNumber, levelStatus, gemCount) {
            var _this = _super.call(this, game, x, y) || this;
            _this._levelStatus = levelStatus;
            _this._levelNumber = levelNumber;
            _this._gemCount = gemCount;
            if (_this._levelStatus == 1) {
                _this.createDiscAndPrincess();
                _this.createOverlay();
                _this._upOverlay.alpha = 0.9;
            }
            else if (_this._levelStatus == 2) {
                _this.createDiscAndPrincess();
                _this.createOverlay();
                _this._upOverlay.alpha = 0.8;
            }
            else if (_this._levelStatus == 3) {
                _this.createOverlay();
                _this.createDiscAndPrincess();
                if (_this._levelStatus == 3) {
                    _this.createGem();
                }
                _this._upOverlay.position.set(-2, 11);
            }
            return _this;
        }
        LevelSelectIcon.prototype.createOverlay = function () {
            this._upOverlay = this.game.add.sprite(0, 0, "MenuUI", "level_select_" + this._levelStatus);
            this._upOverlay.anchor.set(0.5);
            this.addChild(this._upOverlay);
            if (this._levelStatus == 1) {
                this._levelNumberText = this.game.add.text(0, -5, this._levelNumber.toString(), {
                    font: TProject.Boot.LOCALE.pickUpFont(TProject.FontType.MEDIUM),
                    fontSize: "35px",
                    fontWeight: "bold",
                    fill: "#71a2e1",
                    stroke: '#3d466a',
                    strokeThickness: 2
                });
                this._levelNumberText.anchor.set(0.5);
                this._upOverlay.addChild(this._levelNumberText);
            }
        };
        LevelSelectIcon.prototype.createDiscAndPrincess = function () {
            this._disc = this.game.add.sprite(0, 0, "MenuUI", "gfx.lvl_select_disk0000");
            this._disc.anchor.set(0.5);
            this.addChild(this._disc);
            var levelToPrincess = this._levelNumber - 1;
            this._princess = this.game.add.sprite(-1, -21, "MenuUI", levelToPrincess < 10 ? "princesses_1000" + levelToPrincess : "princesses_100" + levelToPrincess);
            this._princess.anchor.set(0.5);
            this.addChild(this._princess);
        };
        LevelSelectIcon.prototype.createGem = function () {
            if (this._gemCount > 0) {
                this._gem1 = this.game.add.sprite(-27, 39, "MenuUI", "gfx.lvl_select_gem_1");
                this._gem1.anchor.set(0.5);
                this.addChild(this._gem1);
                if (this._gemCount > 1) {
                    this._gem2 = this.game.add.sprite(0, 43, "MenuUI", "gfx.lvl_select_gem_2");
                    this._gem2.anchor.set(0.5);
                    this.addChild(this._gem2);
                    if (this._gemCount > 2) {
                        this._gem3 = this.game.add.sprite(28, 39, "MenuUI", "gfx.lvl_select_gem_3");
                        this._gem3.anchor.set(0.5);
                        this.addChild(this._gem3);
                    }
                }
            }
        };
        Object.defineProperty(LevelSelectIcon.prototype, "levelStatus", {
            get: function () {
                return this._levelStatus;
            },
            enumerable: true,
            configurable: true
        });
        return LevelSelectIcon;
    }(Phaser.Sprite));
    TProject.LevelSelectIcon = LevelSelectIcon;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var PrincessUI = (function (_super) {
        __extends(PrincessUI, _super);
        function PrincessUI(game, x, y, currentPrincess) {
            var _this = _super.call(this, game, x, y) || this;
            _this.anchor.set(0.5);
            _this._iceShine = new TProject.DBSprite(TProject.Boot.PRINCESSES, "_DB/ice_shine", _this.game);
            _this._iceShine.setPos(5, 5);
            _this._iceShine.play("idle");
            _this.addChild(_this._iceShine);
            _this._iceShinePoly = new Phaser.Polygon([
                new Phaser.Point(81.1, 41.25), new Phaser.Point(104.2, 41.25), new Phaser.Point(127.1, 61.1),
                new Phaser.Point(132.2, 79), new Phaser.Point(111.1, 120.05), new Phaser.Point(65.1, 111.1),
                new Phaser.Point(54.1, 93.1), new Phaser.Point(60.2, 66.15)
            ]);
            _this._iceShineGraph = _this.game.add.graphics(_this._iceShine.x, _this._iceShine.y);
            _this._iceShineGraph.beginFill(0x00ff00);
            _this._iceShineGraph.drawPolygon(_this._iceShinePoly.points);
            _this._iceShineGraph.endFill();
            _this.addChild(_this._iceShineGraph);
            _this._iceShine.getBone("lines").mask = _this._iceShineGraph;
            _this._level_select_icon = new TProject.DBSprite(TProject.Boot.PRINCESSES, "_DB/level_select_icons", _this.game);
            _this._level_select_icon.setPos(0, 0);
            _this._level_select_icon.play("lock");
            _this.addChild(_this._level_select_icon);
            _this._level_select_icon.addEvent("frameEvent", _this.hitEvent, _this);
            _this._level_select_icon.getBone("ice_shine").addChild(_this._iceShine);
            _this._iceShineGraph.scale.set(_this._level_select_icon.getBone("ice_shine").scale.x, _this._level_select_icon.getBone("ice_shine").scale.y);
            _this._iceShineGraph.x -= 132;
            _this._iceShineGraph.y -= 116;
            _this._currentPrincess = _this.game.add.sprite(7, 6, "Princesses", currentPrincess < 10 ? "princesses_1000" + currentPrincess : "princesses_100" + currentPrincess);
            _this._level_select_icon.getBone("princesses").addChild(_this._currentPrincess);
            _this._gems_reveal = new TProject.DBSprite(TProject.Boot.PRINCESSES, "_DB/gems_reveal", _this.game);
            _this._gems_reveal.setPos(7, 6);
            _this._gems_reveal.play("idle");
            _this.addChild(_this._gems_reveal);
            _this._level_select_icon.getBone("gems").addChild(_this._gems_reveal);
            return _this;
        }
        PrincessUI.prototype.hitEvent = function (e) {
            if (e.name == "sound") {
                TProject.SoundMixer.playSound("unlock");
            }
        };
        PrincessUI.prototype.setState = function (state, gemsPrincessNumber) {
            var _this = this;
            if (gemsPrincessNumber === void 0) { gemsPrincessNumber = 1; }
            switch (state) {
                case "changePrincess":
                    this._level_select_icon.play("lock");
                    this._gems_reveal.play("idle");
                    this._iceShine.play("idle");
                    this._currentPrincess.destroy();
                    this._gems_reveal.visible = false;
                    this._currentPrincess = this.game.add.sprite(7, 6, "Princesses", gemsPrincessNumber < 10 ? "princesses_1000" + gemsPrincessNumber : "princesses_100" + gemsPrincessNumber);
                    this._level_select_icon.getBone("princesses").addChild(this._currentPrincess);
                    break;
                case "start":
                    this._level_select_icon.play("lock");
                    this._gems_reveal.play("idle");
                    this._iceShine.play("action");
                    this._gems_reveal.visible = false;
                    break;
                case "fin":
                    this._gems_reveal.visible = true;
                    this._gems_reveal.play("idle");
                    this._iceShine.play("idle");
                    this._level_select_icon.play("unlockanim");
                    setTimeout(function () {
                        _this._gems_reveal.play("gem" + gemsPrincessNumber);
                    }, 3000);
                    break;
                case "unlock":
                    this._level_select_icon.play("unlock");
                    this._gems_reveal.play("idle");
                    this._gems_reveal.visible = false;
                    this._iceShine.play("action");
                    break;
            }
        };
        return PrincessUI;
    }(Phaser.Sprite));
    TProject.PrincessUI = PrincessUI;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var ScoreInScreen = (function (_super) {
        __extends(ScoreInScreen, _super);
        function ScoreInScreen(game) {
            var _this = _super.call(this, game, 0, 0) || this;
            _this._currentScore = [];
            _this.anchor.set(0.5);
            return _this;
        }
        ScoreInScreen.prototype.addScore = function (x, y, score, poverup) {
            var _this = this;
            if (poverup === void 0) { poverup = false; }
            var text = this.game.add.text(x - 5, y - 10, score, {
                font: TProject.Boot.LOCALE.pickUpFont(TProject.FontType.MEDIUM),
                fontSize: poverup ? "20px" : "25px",
                fontWeight: "bold",
                fill: poverup ? "#ff2121" : "#ffe52c",
                stroke: '#403f2e',
                strokeThickness: 2
            });
            text.anchor.set(0.5);
            text.alpha = 0;
            this.addChild(text);
            var tween_alpha = this.game.add.tween(text).to({ alpha: 1 }, 100, Phaser.Easing.Linear.None, true);
            var tween_y = this.game.add.tween(text).to({ y: text.y - 50 }, 350, Phaser.Easing.Linear.None, true);
            tween_y.onComplete.addOnce(function () {
                _this.game.add.tween(text).to({ alpha: 0 }, 250, Phaser.Easing.Linear.None, true, 450).
                    onComplete.addOnce(function () {
                    text.destroy();
                });
            });
        };
        return ScoreInScreen;
    }(Phaser.Sprite));
    TProject.ScoreInScreen = ScoreInScreen;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var StartWinLose = (function (_super) {
        __extends(StartWinLose, _super);
        function StartWinLose(game, cbStart, cbLose, cbWin, cbGotoMenu) {
            var _this = _super.call(this, game, game.world.centerX, -game.world.centerY) || this;
            _this.anchor.set(0.5);
            _this._cbStart = cbStart;
            _this._cbLose = cbLose;
            _this._cbWin = cbWin;
            _this._cbMenu = cbGotoMenu;
            _this._start = true;
            _this._back = _this.game.add.sprite(0, 0, "IngameUI", "ingame_panel0000");
            _this._back.anchor.set(0.5);
            _this.addChild(_this._back);
            _this._btnGoToMenu = new TProject.OButton(_this.game, "IngameUI", ["btn_exit0000", "btn_exit0001", "btn_exit0001"], function () { _this.goToMenu(); });
            _this._btnGoToMenu.position.set(-207, -157);
            _this._back.addChild(_this._btnGoToMenu);
            _this._btnGoToMenu.inputEnabled = false;
            _this._btnReplay = new TProject.OButton(_this.game, "IngameUI", ["btn_replay0000", "btn_replay0001", "btn_replay0001"], function () { _this.restart(); });
            _this._btnReplay.position.set(196, 170);
            _this._back.addChild(_this._btnReplay);
            _this._btnReplay.visible = false;
            _this._btnReplay.inputEnabled = false;
            _this._btnNext = new TProject.OButton(_this.game, "IngameUI", ["btn_next0000", "btn_next0001", "btn_next0001"], function () { _this.next(); });
            _this._btnNext.position.set(196, 170);
            _this._back.addChild(_this._btnNext);
            _this._btnNext.inputEnabled = false;
            _this._princess = new TProject.PrincessUI(_this.game, -129, -178, TProject.AbstractGame.CURRENT_LEVEL);
            _this._back.addChild(_this._princess);
            _this._banner = _this.game.add.sprite(11, 26, "IngameUI", "start_banner");
            _this._banner.anchor.set(0.5);
            _this._back.addChild(_this._banner);
            _this._banner.visible = false;
            _this._upText = _this.game.add.text(11, 127, "TEST", {
                font: TProject.Boot.LOCALE.pickUpFont(TProject.FontType.LIGHT),
                fontSize: "30px",
                fontWeight: "normal",
                fill: "#000000",
            });
            _this._upText.anchor.set(0.5);
            _this._back.addChild(_this._upText);
            _this._downText = _this.game.add.text(11, 81, "TEST", {
                font: TProject.Boot.LOCALE.pickUpFont(TProject.FontType.LIGHT),
                fontSize: "20px",
                fontWeight: "normal",
                fill: "#FFFFFF",
            });
            _this._downText.anchor.set(0.5);
            _this._back.addChild(_this._downText);
            _this._upText.wordWrap = true;
            _this._upText.lineSpacing -= 10;
            _this._upText.wordWrapWidth = 300;
            _this._upText.align = "center";
            _this._downText.wordWrap = true;
            _this._downText.lineSpacing -= 10;
            _this._downText.wordWrapWidth = 300;
            _this._downText.align = "center";
            return _this;
        }
        StartWinLose.prototype.setState = function (state, gemsCount) {
            var _this = this;
            if (gemsCount === void 0) { gemsCount = 1; }
            switch (state) {
                case "start":
                    this._princess.setState("changePrincess", TProject.AbstractGame.CURRENT_LEVEL);
                    this._btnReplay.visible = false;
                    this._btnNext.visible = true;
                    this._start = true;
                    this._upText.position.set(11, 127);
                    this._upText.fill = "#FFFFFF";
                    this._downText.text = TProject.Boot.LOCALE.get("IntroText");
                    this._upText.fontWeight = "normal";
                    this._downText.position.set(11, 85);
                    this._upText.text = TProject.Boot.LOCALE.get((TProject.AbstractGame.CURRENT_LEVEL + 1).toString());
                    this._banner.visible = false;
                    var tween1 = this.game.add.tween(this).to({ y: this.game.world.centerY }, TProject.Menu.BOARD_SHOW_TIME, Phaser.Easing.Bounce.Out, true);
                    tween1.onComplete.add(function () {
                        _this._btnNext.inputEnabled = true;
                        _this._btnGoToMenu.inputEnabled = true;
                        _this._princess.setState("start");
                    }, this);
                    break;
                case "lose":
                    this._btnReplay.visible = true;
                    this._btnNext.visible = false;
                    this._upText.position.set(6, 53);
                    this._upText.fill = "#000000";
                    this._downText.position.set(5, 106);
                    this._upText.text = TProject.Boot.LOCALE.get("loser");
                    this._upText.fontWeight = "bold";
                    this._downText.text = TProject.Boot.LOCALE.get("trapped");
                    this._banner.visible = true;
                    var tween2 = this.game.add.tween(this).to({ y: this.game.world.centerY }, TProject.Menu.BOARD_SHOW_TIME, Phaser.Easing.Bounce.Out, true);
                    tween2.onComplete.add(function () {
                        _this._btnReplay.inputEnabled = true;
                        _this._btnGoToMenu.inputEnabled = true;
                        _this._princess.setState("start");
                    }, this);
                    break;
                case "win":
                    this._btnReplay.visible = false;
                    this._btnNext.visible = true;
                    this._upText.position.set(11, 127);
                    this._upText.fill = "#FFFFFF";
                    this._downText.text = TProject.Boot.LOCALE.get("SavedPrincess");
                    this._upText.text = TProject.Boot.LOCALE.get((TProject.AbstractGame.CURRENT_LEVEL + 1).toString());
                    this._downText.position.set(11, 85);
                    this._upText.fontWeight = "normal";
                    this._banner.visible = false;
                    var tween3 = this.game.add.tween(this).to({ y: this.game.world.centerY }, TProject.Menu.BOARD_SHOW_TIME, Phaser.Easing.Bounce.Out, true);
                    tween3.onComplete.add(function () {
                        _this._btnNext.inputEnabled = true;
                        _this._btnGoToMenu.inputEnabled = true;
                        _this._princess.setState("fin", gemsCount);
                    }, this);
                    break;
            }
        };
        StartWinLose.prototype.goToMenu = function () {
            var _this = this;
            this._btnNext.inputEnabled = false;
            this._btnReplay.inputEnabled = false;
            this._btnGoToMenu.inputEnabled = false;
            var tween = this.game.add.tween(this).to({ y: -this.game.world.centerY }, TProject.Menu.BOARD_HIDE_TIME, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                console.log("GOTOMENU!");
                _this._cbMenu();
            });
        };
        StartWinLose.prototype.restart = function () {
            var _this = this;
            this._btnReplay.inputEnabled = false;
            this._btnNext.inputEnabled = false;
            this._btnGoToMenu.inputEnabled = false;
            var tween = this.game.add.tween(this).to({ y: -this.game.world.centerY }, TProject.Menu.BOARD_HIDE_TIME, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                console.log("RESTART!");
                _this._cbLose();
            });
        };
        StartWinLose.prototype.next = function () {
            var _this = this;
            this._btnNext.inputEnabled = false;
            this._btnReplay.inputEnabled = false;
            this._btnGoToMenu.inputEnabled = false;
            var tween = this.game.add.tween(this).to({ y: -this.game.world.centerY }, TProject.Menu.BOARD_HIDE_TIME, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                console.log("NEXT!");
                if (_this._start) {
                    _this._start = false;
                    _this._cbStart();
                }
                else {
                    _this._cbWin();
                }
            });
        };
        return StartWinLose;
    }(Phaser.Sprite));
    TProject.StartWinLose = StartWinLose;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var SwordIndicator = (function (_super) {
        __extends(SwordIndicator, _super);
        function SwordIndicator(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this.anchor.set(0.5);
            _this._glowBg = _this.game.add.image(37, 4, "IngameUI", "swordInd0000");
            _this.addChild(_this._glowBg);
            _this._swordBG = _this.game.add.sprite(53, 21, "IngameUI", "swordBG0000");
            _this.addChild(_this._swordBG);
            _this._swordBGPoly = new Phaser.Polygon([
                new Phaser.Point(50.7, 9.75), new Phaser.Point(94.65, 11.8), new Phaser.Point(89.15, 4.5),
                new Phaser.Point(142.15, 7.45), new Phaser.Point(138.85, 0.4), new Phaser.Point(201.25, 8.85),
                new Phaser.Point(197.15, 10.1), new Phaser.Point(163.6, 11.3), new Phaser.Point(168.2, 23.8),
                new Phaser.Point(113.1, 20.75), new Phaser.Point(117.55, 31.8), new Phaser.Point(50, 30.1)
            ]);
            _this._swordBGGraph = _this.game.add.graphics(3, 19);
            _this._swordBGGraph.beginFill(0x00ff00);
            _this._swordBGGraph.drawPolygon(_this._swordBGPoly.points);
            _this._swordBGGraph.endFill();
            _this.addChild(_this._swordBGGraph);
            _this._swordBGReal = _this.game.add.graphics(0, 0);
            _this._swordBGReal.beginFill(0xcc3366);
            _this._swordBGReal.drawRect(0, 0, 150.55, 40);
            _this._swordBGReal.endFill();
            _this._swordBGContainer = _this.game.add.sprite(54, 15, "");
            _this._swordBGContainer.addChild(_this._swordBGReal);
            _this._swordBGReal.mask = _this._swordBGGraph;
            _this._swordBGContainer.anchor.set(0, 0);
            _this.addChild(_this._swordBGContainer);
            _this._sword = _this.game.add.sprite(2, 18, "IngameUI", "sword_indicator0000");
            _this.addChild(_this._sword);
            _this._sheen = _this.game.add.sprite(56, 22, "IngameUI", "sheen0000");
            _this.addChild(_this._sheen);
            _this._swordBGContainer.scale.set(0, 1);
            return _this;
        }
        SwordIndicator.prototype.setSwordScale = function (scale) {
            if (scale < 0)
                scale = 0;
            if (scale > 1)
                scale = 1;
            if (scale < 0.53) {
                this._glowBg.alpha = 0;
            }
            else if (scale < 0.9) {
                this._glowBg.alpha = scale / 0.9 * 0.6;
            }
            else {
                this._glowBg.alpha = 0.6 + scale * 0.4;
            }
            this._swordBGContainer.scale.set(scale, 1);
        };
        return SwordIndicator;
    }(Phaser.Sprite));
    TProject.SwordIndicator = SwordIndicator;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var DBSprite = (function (_super) {
        __extends(DBSprite, _super);
        function DBSprite(factories, name, game) {
            var _this = _super.call(this) || this;
            game ? game.world.add(_this) : "";
            _this._eventsBounds = null;
            _this._visual = factories.buildArmatureDisplay(name);
            _this.addChild(_this._visual);
            return _this;
        }
        DBSprite.prototype.free = function () {
            if (this._eventsBounds) {
                this._eventsBounds.destroy(true);
            }
            this._visual.dispose(true);
        };
        DBSprite.prototype.stopInteractive = function () {
            this._eventsBounds.inputEnabled = false;
        };
        DBSprite.prototype.addEvent = function (type, listener, target) {
            this._visual.addEvent(type, listener, target ? target : this);
        };
        DBSprite.prototype.removeEvent = function (type, listener) {
            this._visual.removeEvent(type, listener, null);
        };
        DBSprite.prototype.removeFromParent = function () {
            if (this.parent) {
                this.parent.removeChild(this);
            }
        };
        DBSprite.prototype.play = function (name, playTimes) {
            if (name == this._currentLabel && this._playTimes == 0) {
                return;
            }
            this._currentLabel = name;
            var animState = this._visual.animation.play(name, playTimes);
            this._playTimes = animState.playTimes;
            return animState;
        };
        DBSprite.prototype.playEx = function (name, nextState, complete, contex) {
            this._nextState = nextState;
            this._cb = complete;
            this._cbContex = contex ? contex : this;
            var animState = this.play(name);
            if (nextState || complete) {
                this.addEvent(animState.playTimes == 1 ? "complete" : "loopComplete", this.completePlaying);
            }
            return animState;
        };
        DBSprite.prototype.completePlaying = function (e) {
            this.removeEvent("complete", this.completePlaying);
            this.removeEvent("loopComplete", this.completePlaying);
            e.label = this.currentLabel;
            if (typeof this._cb === "function") {
                this._cb.bind(this._cbContex)(e);
            }
            if (this._nextState) {
                this.playEx(this._nextState, null, this._cb, this._cbContex);
            }
            else {
                this._cb = null;
            }
        };
        DBSprite.prototype.getBone = function (name) {
            return this._visual.armature.getSlot(name).display;
        };
        DBSprite.prototype.getBoneAnimation = function (name) {
            return this._visual.armature.getSlot(name).childArmature.animation;
        };
        DBSprite.prototype.getSprite = function (index) {
            return this._visual.getAt(index);
        };
        DBSprite.prototype.setPos = function (x, y) {
            this.x = x ? x : this.x;
            this.y = y ? y : this.y;
        };
        DBSprite.prototype.createBounds = function (game) {
            if (this._eventsBounds != null) {
                this.removeChild(this._eventsBounds);
                this._eventsBounds.destroy(true);
            }
            var b = this.getBounds();
            this._eventsBounds = new Phaser.Graphics(game, 0.0, 0.0);
            this._eventsBounds.beginFill(0xff0000, 0.0);
            this._eventsBounds.drawRect(-b.width * 0.5, -b.height * 0.5, b.width, b.height);
            this._eventsBounds.endFill();
            this.addChild(this._eventsBounds);
        };
        Object.defineProperty(DBSprite.prototype, "animation", {
            get: function () {
                return this._visual.animation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DBSprite.prototype, "armature", {
            get: function () {
                return this._visual._armature;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DBSprite.prototype, "sprites", {
            get: function () {
                return this._visual.children;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DBSprite.prototype, "events", {
            get: function () {
                if (!this._eventsBounds) {
                    return null;
                }
                return this._eventsBounds.events;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DBSprite.prototype, "input", {
            get: function () {
                if (!this._eventsBounds) {
                    return null;
                }
                return this._eventsBounds.input;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DBSprite.prototype, "inputEnabled", {
            get: function () {
                if (!this._eventsBounds) {
                    return false;
                }
                return this._eventsBounds.inputEnabled;
            },
            set: function (value) {
                this._eventsBounds.inputEnabled = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DBSprite.prototype, "currentLabel", {
            get: function () {
                return this._currentLabel;
            },
            enumerable: true,
            configurable: true
        });
        DBSprite.prototype.update = function () { };
        DBSprite.prototype.postUpdate = function () { };
        return DBSprite;
    }(PIXI.DisplayObjectContainer));
    TProject.DBSprite = DBSprite;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var Factories = (function (_super) {
        __extends(Factories, _super);
        function Factories() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Factories.loadFactory = function (game, name, path, texturePrefix, skeletonPrefix) {
            texturePrefix = texturePrefix ? texturePrefix : "_tex";
            skeletonPrefix = skeletonPrefix ? skeletonPrefix : "_ske";
            path += name;
            game.load.json(name + "textureData", path + texturePrefix + ".json");
            game.load.json(name + "dragonBonesData", path + skeletonPrefix + ".json");
            game.load.image(name + "texture", path + texturePrefix + ".png");
        };
        Factories.createFactory = function (game, name) {
            var f = new dragonBones.PhaserFactory(null, game);
            f.parseDragonBonesData(game.cache.getJSON(name + "dragonBonesData"));
            f.parseTextureAtlasData(game.cache.getJSON(name + "textureData"), game.cache.getBaseTexture(name + "texture"));
            return f;
        };
        return Factories;
    }(Phaser.State));
    TProject.Factories = Factories;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var Glow = (function (_super) {
        __extends(Glow, _super);
        function Glow(game) {
            var _this = this;
            var fragmentSrc = [
                "precision lowp float;",
                "varying vec2 vTextureCoord;",
                "varying vec4 vColor;",
                'uniform sampler2D uSampler;',
                'void main() {',
                'vec4 sum = vec4(0);',
                'vec2 texcoord = vTextureCoord;',
                'for(int xx = -4; xx <= 4; xx++) {',
                'for(int yy = -3; yy <= 3; yy++) {',
                'float dist = sqrt(float(xx*xx) + float(yy*yy));',
                'float factor = 0.0;',
                'if (dist == 0.0) {',
                'factor = 2.0;',
                '} else {',
                'factor = 2.0/abs(float(dist));',
                '}',
                'sum += texture2D(uSampler, texcoord + vec2(xx, yy) * 0.002) * factor;',
                '}',
                '}',
                'gl_FragColor = sum * 0.025 + texture2D(uSampler, texcoord);',
                '}'
            ];
            _this = _super.call(this, game, [], fragmentSrc) || this;
            return _this;
        }
        return Glow;
    }(Phaser.Filter));
    TProject.Glow = Glow;
})(TProject || (TProject = {}));
;

var TProject;
(function (TProject) {
    var FontType;
    (function (FontType) {
        FontType[FontType["LIGHT"] = 0] = "LIGHT";
        FontType[FontType["MEDIUM"] = 1] = "MEDIUM";
        FontType[FontType["HARD"] = 2] = "HARD";
    })(FontType = TProject.FontType || (TProject.FontType = {}));
    var LanguageManager = (function () {
        function LanguageManager(curLocale, localeString) {
            this._xml = localeString;
            this._curLocale = curLocale;
        }
        LanguageManager.prototype.get = function (key) {
            return this._xml.getElementById(key).innerHTML;
        };
        LanguageManager.prototype.pickUpFont = function (type) {
            if (type === void 0) { type = FontType.MEDIUM; }
            if (this._curLocale == "ar") {
                return "Lubalin_Ara";
            }
            else if (this._curLocale == "ru") {
                if (type == FontType.LIGHT) {
                    return "Fred Fredburger W04 Regular";
                }
                return "Fred Fredburger W04 Bold";
            }
            switch (type) {
                case FontType.LIGHT: return "Lubalin_CnObl";
                case FontType.MEDIUM: return "Lubalin_Book";
                default: return "Lubalin_D14";
            }
        };
        Object.defineProperty(LanguageManager.prototype, "currentLocale", {
            get: function () {
                return this._curLocale;
            },
            enumerable: true,
            configurable: true
        });
        return LanguageManager;
    }());
    TProject.LanguageManager = LanguageManager;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var OButton = (function (_super) {
        __extends(OButton, _super);
        function OButton(game, key, frame, cb) {
            if (cb === void 0) { cb = null; }
            var _this = this;
            var up = null;
            var over = null;
            var down = null;
            if (frame.length > 0) {
                up = frame[0];
                if (frame.length > 1) {
                    over = frame[1];
                    if (frame.length > 2)
                        down = frame[2];
                    else
                        down = frame[0];
                }
                else {
                    over = frame[0];
                    down = frame[0];
                }
            }
            _this = _super.call(this, game, 0, 0, key, null, null, over, up, down, null) || this;
            _this._framesString = [up, over, down];
            _this.soundOver = "over";
            _this.soundDown = "click";
            _this.anchor.setTo(0.5);
            _this._cb = cb;
            _this._deltaScale = 0.1;
            _this._defaultScale = 1.0;
            _this._isDown = false;
            _this._isOver = false;
            _this.onInputOver.add(_this.over, _this);
            _this.onInputOut.add(_this.out, _this);
            _this.onInputDown.add(_this.down, _this);
            _this.onInputUp.add(_this.up, _this);
            return _this;
        }
        OButton.prototype.setCBContext = function (cntx) {
            this._cntxt = cntx;
        };
        OButton.prototype.setAnimationScale = function (delta, defaultScale) {
            if (delta === void 0) { delta = 0; }
            if (defaultScale === void 0) { defaultScale = 1; }
            this._deltaScale = delta;
            this._defaultScale = defaultScale;
        };
        OButton.prototype.setNewFrames = function (frame) {
            var up = null;
            var over = null;
            var down = null;
            if (frame.length > 0) {
                up = frame[0];
                if (frame.length > 1) {
                    over = frame[1];
                    if (frame.length > 2)
                        down = frame[2];
                    else
                        down = frame[0];
                }
                else {
                    over = frame[0];
                    down = frame[0];
                }
            }
            this._framesString = [up, over, down];
            this.setFrames(over, up, down);
        };
        OButton.prototype.over = function () {
            if (!this._isDown) {
            }
            TProject.SoundMixer.playSound("buttonOver");
            this._isOver = true;
        };
        OButton.prototype.out = function () {
            if (!this._isDown) {
                this.scale.set(this._defaultScale);
            }
            this._isOver = false;
        };
        OButton.prototype.up = function () {
            var _this = this;
            if (!this._isDown) {
                return;
            }
            this.scale.set(this._defaultScale);
            var tap = (this.game.device.desktop ? this._isOver : this.input.pointerOver());
            if (this._isOver) {
                this.frameName = this._framesString[1];
            }
            else {
                if (tap) {
                    setTimeout(function () {
                        _this.frameName = _this._framesString[0];
                    }, 5);
                }
            }
            this._isDown = false;
            if (tap && this._cb != null) {
                TProject.SoundMixer.playSound("button");
                if (this._cntxt)
                    this._cb.bind(this._cntxt)();
                else
                    this._cb();
                this.frameName = this._framesString[0];
            }
            else {
                if (tap == false)
                    this.scale.set(this._defaultScale);
            }
        };
        OButton.prototype.down = function () {
            if (this._isDown) {
                return;
            }
            this.scale.set(this._defaultScale - this._deltaScale);
            this._isDown = true;
        };
        OButton.prototype.deleteFromParent = function () {
            if (this.parent) {
                this.parent.removeChild(this);
            }
            this.onInputOver.remove(this.over, this);
            this.onInputOut.remove(this.out, this);
            this.onInputDown.remove(this.down, this);
            this.onInputUp.remove(this.up, this);
        };
        Object.defineProperty(OButton.prototype, "enabled", {
            set: function (value) {
                var _this = this;
                this.inputEnabled = value;
                if (!value) {
                    setTimeout(function () {
                        _this.frameName = _this._framesString[0];
                        _this.scale.set(_this._defaultScale);
                    }, 5);
                }
            },
            enumerable: true,
            configurable: true
        });
        return OButton;
    }(Phaser.Button));
    TProject.OButton = OButton;
})(TProject || (TProject = {}));


var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var Zap = (function (_super) {
        __extends(Zap, _super);
        function Zap(game, x, y, endPoint, childNum) {
            if (childNum === void 0) { childNum = 0; }
            var _this = _super.call(this, game, x, y) || this;
            _this._endPoint = endPoint;
            _this._lightningBitmap = null;
            _this._lightning = null;
            _this._childs = childNum;
            _this.generateBitmap();
            return _this;
        }
        Zap.prototype.generateBitmap = function () {
            var x = this._endPoint.x;
            var y = this._endPoint.y;
            var x0 = 75 - 40;
            var y0 = 240 + 80;
            var dy = y - y0;
            var dx = x - x0;
            var r = Math.sqrt(dx * dx + dy * dy);
            var phi = Math.atan2(dx, -dy);
            if (Math.abs(phi - Math.PI / 2) < 0.1) {
                y0 += 100;
                dy = y - y0;
                r = Math.sqrt(dx * dx + dy * dy);
                phi = Math.atan2(dx, -dy);
            }
            var w = Math.abs(r * Math.cos(phi));
            var h = Math.abs(r * Math.sin(phi));
            if (this._childs == 0) {
                this.rotation = phi;
            }
            this.lightningBimap = this.game.add.bitmapData(w + 15, h + 15);
        };
        Object.defineProperty(Zap.prototype, "lightningBimap", {
            set: function (bmp) {
                if (this._lightning == null) {
                    this._lightningBitmap = bmp;
                    this._lightning = this.game.add.image(0, 0, this._lightningBitmap);
                    this.addChild(this._lightning);
                    if (this._childs == 0) {
                        this._lightning.filters = [new TProject.Glow(this.game)];
                    }
                    this._lightning.anchor.set(0.5, 0);
                }
                else {
                    throw "Bitmap data already exists";
                }
            },
            enumerable: true,
            configurable: true
        });
        Zap.prototype.zap = function (onComplete, context) {
            var _this = this;
            this.createLightningTexture(this._lightningBitmap.width / 2, 0, 20, 3, false);
            this._lightning.alpha = 1;
            var tween = this.game.add.tween(this._lightning)
                .to({ alpha: 0.5 }, 100, Phaser.Easing.Bounce.Out)
                .to({ alpha: 1.0 }, 100, Phaser.Easing.Bounce.Out);
            tween.start();
            if (this._childs < 4) {
                tween.onComplete.add(function () {
                    var z = new Zap(_this.game, 0, 0, _this._endPoint, _this._childs + 1);
                    _this.addChild(z);
                    z.zap(onComplete, context);
                }, this);
            }
            var tween2 = this.game.add.tween(this._lightning).to({ alpha: 0.5 }, 100, Phaser.Easing.Bounce.Out)
                .to({ alpha: 1.0 }, 100, Phaser.Easing.Bounce.Out)
                .to({ alpha: 0.0 }, 250, Phaser.Easing.Bounce.Out);
            if (this._childs == 4 && onComplete) {
                tween.onComplete.add(onComplete, context);
            }
            tween.chain(tween2);
        };
        Zap.prototype.createLightningTexture = function (x, y, segments, boltWidth, branch) {
            var ctx = this._lightningBitmap.context;
            var width = this._lightningBitmap.width;
            var height = this._lightningBitmap.height;
            if (!branch) {
                ctx.clearRect(0, 0, width, height);
            }
            for (var i = 0; i < segments; i++) {
                ctx.strokeStyle = 'rgb(251, 211, 227)';
                ctx.lineWidth = boltWidth;
                ctx.beginPath();
                ctx.moveTo(x, y);
                if (branch) {
                    x += this.game.rnd.integerInRange(-10, 10);
                    y += this.game.rnd.integerInRange(10, 20);
                }
                else {
                    x += this.game.rnd.integerInRange(-10, 10);
                    y += this.game.rnd.integerInRange(20, height / segments);
                }
                if (x < 10)
                    x = 10;
                if (x > width - 10)
                    x = width - 10;
                if ((!branch && i == segments - 1) || y > height) {
                    y = height;
                }
                ctx.lineTo(x, y);
                ctx.stroke();
                if (y >= height)
                    break;
                if (!branch) {
                    if (Phaser.Utils.chanceRoll(20)) {
                        this.createLightningTexture(x, y, 10, 1, true);
                    }
                }
                this._lightningBitmap.dirty = true;
            }
        };
        return Zap;
    }(Phaser.Sprite));
    TProject.Zap = Zap;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var LocalConfig = (function () {
        function LocalConfig() {
        }
        return LocalConfig;
    }());
    LocalConfig.CURRENT_STATE = "Menu";
    TProject.LocalConfig = LocalConfig;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var LocalConfig = (function () {
        function LocalConfig() {
        }
        return LocalConfig;
    }());
    LocalConfig.CURRENT_STATE = "Menu";
    TProject.LocalConfig = LocalConfig;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var Main = (function () {
        function Main() {
            this.game = new Phaser.Game(750, 500, Phaser.AUTO, "game_container", null, false);
            this.game.state.add("Boot", TProject.Boot, true);
            this.game.state.add("Preloader", TProject.Preloader);
            this.game.state.add("BaseGame", TProject.BaseGame);
            this.game.state.add("Menu", TProject.Menu);
        }
        Main.gotoFunction = function (name) {
            var fnc = window[name];
            if (typeof fnc === "function") {
                fnc();
            }
        };
        return Main;
    }());
    Main.DEBUG = true;
    TProject.Main = Main;
})(TProject || (TProject = {}));
window.onload = function () {
    var game = new TProject.Main();
    setTimeout("window.scrollTo(0, 1)", 10);
    document.body.addEventListener('touchmove', function (event) {
        event.preventDefault();
    }, false);
};

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var LevelStates;
    (function (LevelStates) {
        LevelStates[LevelStates["ALPHA_CHANGIN"] = 0] = "ALPHA_CHANGIN";
        LevelStates[LevelStates["POST_ALPHA_CHANGING"] = 1] = "POST_ALPHA_CHANGING";
        LevelStates[LevelStates["PLAYER_WON"] = 2] = "PLAYER_WON";
        LevelStates[LevelStates["POST_WIN"] = 3] = "POST_WIN";
        LevelStates[LevelStates["PLAYER_LOST"] = 4] = "PLAYER_LOST";
        LevelStates[LevelStates["PLAYER_LOST_TIMEOUT"] = 5] = "PLAYER_LOST_TIMEOUT";
        LevelStates[LevelStates["GAME_RUNNING"] = 6] = "GAME_RUNNING";
    })(LevelStates || (LevelStates = {}));
    ;
    var BaseGame = (function (_super) {
        __extends(BaseGame, _super);
        function BaseGame() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BaseGame.prototype.create = function () {
            _super.prototype.create.call(this);
            this.setDebugMode();
            this._worldModel = new TProject.WorldModel();
            this._conainer = this.game.add.sprite(0, 0);
            this._entitiesContainer = new TProject.ZSprite(this.game);
            this._pinguins = new Array(2);
            this._grid = new TProject.Grid(this.game);
            this._gameUI = new TProject.GameUI(this.game, this);
            this._gameUI.init();
            this._currentLevel = this._worldModel.getLevel(TProject.AbstractGame.CURRENT_LEVEL);
            this._grid.init(this._gameUI);
            this._player = new TProject.Player(this.game, this._currentLevel.playerPosition.x, this._currentLevel.playerPosition.y, this._grid, this._gameUI);
            this._entitiesContainer.addChild(this._player);
            this._iceKing = new TProject.IceKing(this.game, 4, 6, this._grid, this._gameUI);
            this._iceKing.setStupid(3);
            this._entitiesContainer.addChild(this._iceKing);
            this._gameBG = new TProject.BackGround(this.game, this.world.centerX, 0, 1);
            this.world.addChild(this._gameBG);
            this._pinguins[0] = new TProject.Pinguin(this.game, 0, 0, this._grid, this._gameUI);
            this._pinguins[1] = new TProject.Pinguin(this.game, 0, 0, this._grid, this._gameUI);
            this._entitiesContainer.addChild(this._pinguins[0]);
            this._entitiesContainer.addChild(this._pinguins[1]);
            this.world.addChild(this._conainer);
            this._conainer.addChild(this._grid);
            this._conainer.addChild(this._entitiesContainer);
            this.world.addChild(this._gameUI);
            this._princess = new TProject.DBSprite(TProject.Boot.PRINCESSES, "_DB/mc.Ice cube game");
            this._conainer.addChild(this._princess);
            this._currentPrincess = this.game.add.sprite(-72, -173, "IngameUI", "princessFull_10000");
            this._princess.getBone("princess").addChild(this._currentPrincess);
            this._princess.setPos(60, this.game.world.height - 170);
            this._conainer.alpha = 0;
            this.isPaused = true;
            this.loadLevel(true);
            this._levelState = LevelStates.ALPHA_CHANGIN;
            this._gameBG.gotoLevel(TProject.AbstractGame.CURRENT_LEVEL + 1);
            this._gameUI.showLevelStartMenu();
            TProject.SoundMixer.setAudioForState(1);
        };
        BaseGame.prototype.zap = function () {
            var _this = this;
            var x = this._player.x - 10;
            var y = this._player.y - 220 * this._player.scale.y;
            if (this._player.isFlipped) {
                x += 33 * this._player.scale.x;
            }
            TProject.SoundMixer.playSound("sword");
            var z = new TProject.Zap(this.game, x, y, new Phaser.Point(x, y));
            this.world.addChild(z);
            z.zap(function () {
                TProject.SoundMixer.playSound("iceBreakWin");
                _this._princess.playEx("smash", null, function (e) {
                    if (e.label == "smash") {
                        _this._player.gameWinAnimation();
                        _this._levelState = LevelStates.POST_WIN;
                    }
                });
                _this._timer = 700;
                TProject.SoundMixer.stopSound("sword");
            }, this);
        };
        BaseGame.prototype.hideEntities = function () {
            this._player.alpha = 0;
            this._iceKing.alpha = 0;
            this._pinguins.forEach(function (p) { return p.alpha = 0; });
        };
        BaseGame.prototype.showEntities = function () {
            var _this = this;
            var y = this._player.y;
            var dy = 20;
            this._player.y -= dy;
            this._player.alpha = 0;
            this._player.visible = true;
            var tween = this.game.add.tween(this._player).to({ y: y }, 500, Phaser.Easing.Bounce.Out, true);
            tween.onComplete.add(function () {
                _this._levelState = LevelStates.POST_ALPHA_CHANGING;
                _this._timer = 300;
            });
            this.game.add.tween(this._player).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
            y = this._iceKing.y;
            this._iceKing.y -= dy;
            this.game.add.tween(this._iceKing).to({ y: y }, 500, Phaser.Easing.Bounce.Out, true);
            this.game.add.tween(this._iceKing).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
            this._pinguins.forEach(function (p) {
                var y = p.y;
                p.y -= dy;
                _this.game.add.tween(p).to({ y: y }, 500, Phaser.Easing.Bounce.Out, true);
                _this.game.add.tween(p).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
            });
        };
        BaseGame.prototype.loadLevel = function (firstRun) {
            if (firstRun === void 0) { firstRun = false; }
            console.log("LOAD LEVEL");
            this._gameWinWasCalled = false;
            this._princess.play("idle");
            this._grid.alpha = 1;
            this._levelState = LevelStates.ALPHA_CHANGIN;
            this._currentLevel = this._worldModel.getLevel(TProject.AbstractGame.CURRENT_LEVEL);
            if (!firstRun) {
                this._grid.load(this._currentLevel.grid, this._currentLevel.gridPowerUps, this.showEntities.bind(this));
            }
            else {
                this._grid.load(this._currentLevel.grid, this._currentLevel.gridPowerUps);
            }
            this._player.myreset(this._currentLevel.playerPosition, this._grid, this._gameUI);
            this._entitiesContainer.addChild(this._player);
            if (this._currentLevel.enemy1.name === TProject.WorldModel.KING) {
                var enemy = this._currentLevel.enemy1;
                this._iceKing.visible = true;
                this._iceKing.myreset(enemy.position, this._grid, this._gameUI);
                this._iceKing.setStupid(enemy.stupid);
            }
            else {
                this._iceKing.visible = false;
            }
            if (this._currentLevel.enemy2.name == TProject.WorldModel.PINGUIN) {
                var enemy = this._currentLevel.enemy2;
                this._pinguins[0].visible = true;
                this._pinguins[0].myreset(enemy.position, this._grid, this._gameUI);
                this._pinguins[0].setStupid(enemy.stupid);
            }
            else {
                this._pinguins[0].visible = false;
            }
            if (this._currentLevel.enemy3.name == TProject.WorldModel.PINGUIN) {
                var enemy = this._currentLevel.enemy3;
                this._pinguins[1].visible = true;
                this._pinguins[1].myreset(enemy.position, this._grid, this._gameUI);
                this._pinguins[1].setStupid(enemy.stupid);
            }
            else {
                this._pinguins[1].visible = false;
            }
            this._gameUI.player = this._player;
            this._gameUI.setEnemy(this._iceKing, this._pinguins[0], this._pinguins[1]);
            this._gameUI.setScoreArray(this._currentLevel.scoreArray);
            this.isPaused = false;
            var currentPrincessId = "";
            if (TProject.AbstractGame.CURRENT_LEVEL < 10) {
                currentPrincessId = "0";
            }
            currentPrincessId += TProject.AbstractGame.CURRENT_LEVEL.toString();
            this._currentPrincess.loadTexture("IngameUI", "princessFull_100" + currentPrincessId);
        };
        BaseGame.prototype.hide = function () {
            var _this = this;
            var tween = this.game.add.tween(this._conainer).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None);
            tween.onComplete.add(function () {
                _this._grid.hide();
                _this.hideEntities();
            });
            tween.start();
        };
        BaseGame.prototype.simpleShowConrainer = function () {
            var _this = this;
            var tween = this.game.add.tween(this._conainer).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                _this._levelState = LevelStates.POST_ALPHA_CHANGING;
                _this.showMobilePAD();
            }, this);
        };
        BaseGame.prototype.restartLevel = function () {
            this.hideEntities();
            this._grid.alpha = 0;
            this._gameUI.init();
            this._grid.clear();
            this.loadLevel();
            this.isPaused = false;
            this.showMobilePAD();
        };
        BaseGame.prototype.newLevel = function () {
            console.log("Preparing next level");
            this.isPaused = true;
            this._grid.hide();
            this._conainer.alpha = 0;
            this._gameUI.init();
            this._grid.clear();
            this._levelState = LevelStates.ALPHA_CHANGIN;
            TProject.AbstractGame.CURRENT_LEVEL++;
            if (TProject.AbstractGame.CURRENT_LEVEL < 20) {
                this.loadLevel(true);
                this._princess.alpha = 1;
                this._gameBG.gotoLevel(TProject.AbstractGame.CURRENT_LEVEL + 1);
                this._gameUI.dropForNextLevel();
                this._gameUI.showLevelStartMenu();
            }
            else {
                console.log("GAME OVER");
                this._gameUI.showGameWinMenu();
            }
        };
        BaseGame.prototype.playerLost = function () {
            if (this._levelState != LevelStates.PLAYER_LOST_TIMEOUT) {
                this._levelState = LevelStates.PLAYER_LOST;
            }
        };
        BaseGame.prototype.playerWon = function () {
            this._levelState = LevelStates.PLAYER_WON;
        };
        BaseGame.prototype.update = function () {
            this._gameBG.riplesUpdate();
            switch (this._levelState) {
                case LevelStates.ALPHA_CHANGIN:
                    {
                    }
                    break;
                case LevelStates.POST_ALPHA_CHANGING: {
                    if (this._timer > 0) {
                        this._timer -= this.game.time.elapsed;
                    }
                    else {
                        this.isPaused = false;
                        this._levelState = LevelStates.GAME_RUNNING;
                    }
                }
                case LevelStates.GAME_RUNNING:
                    {
                        if (!this.isPaused) {
                            if (TProject.AbstractGame.keysPressed[Phaser.Keyboard.LEFT]) {
                                this._player.gotoHorizont(-1, 600);
                            }
                            else if (TProject.AbstractGame.keysPressed[Phaser.Keyboard.RIGHT]) {
                                this._player.gotoHorizont(1, 600);
                            }
                            else if (TProject.AbstractGame.keysPressed[Phaser.Keyboard.UP]) {
                                this._player.gotoVertical(-1, 600);
                            }
                            else if (TProject.AbstractGame.keysPressed[Phaser.Keyboard.DOWN]) {
                                this._player.gotoVertical(1, 600);
                            }
                            if (this._iceKing.visible) {
                                this._iceKing.goto(this._player.cx, this._player.cy);
                            }
                            this._pinguins.forEach(function (p) {
                                if (p.visible)
                                    p.gotoRandom();
                            });
                            _super.prototype.update.call(this);
                            this._grid.timerUpdate();
                        }
                    }
                    break;
                case LevelStates.PLAYER_LOST:
                    {
                        _super.prototype.update.call(this);
                        if (!this.isPaused) {
                            this.isPaused = true;
                            this._timer = 1000;
                            this._levelState = LevelStates.PLAYER_LOST_TIMEOUT;
                        }
                    }
                    break;
                case LevelStates.PLAYER_LOST_TIMEOUT:
                    {
                        if (this._timer > 0) {
                            this._timer -= this.game.time.elapsedMS;
                        }
                        else {
                            this._gameUI.showLevelLoseMenu();
                            this._levelState = LevelStates.ALPHA_CHANGIN;
                        }
                    }
                    break;
                case LevelStates.PLAYER_WON:
                    {
                        _super.prototype.update.call(this);
                        if (!this.isPaused) {
                            this._player.gameWin(this.zap.bind(this));
                            if (this._iceKing.visible)
                                this._iceKing.lose();
                            this._pinguins.forEach(function (p) {
                                if (p.visible)
                                    p.lose();
                            });
                        }
                        this.isPaused = true;
                    }
                    break;
                case LevelStates.POST_WIN:
                    {
                        if (this._timer > 0) {
                            this._timer -= this.game.time.elapsedMS;
                        }
                        else {
                            if (!this._gameWinWasCalled) {
                                this._gameUI.showLevelWinMenu();
                                this._gameWinWasCalled = true;
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
            this._iceKing.lineUpdate();
            this._pinguins.forEach(function (p) { return p.lineUpdate(); });
        };
        BaseGame.prototype.free = function () {
            this._player.free();
            this._iceKing.free();
            this._pinguins.forEach(function (p) { return p.free(); });
            this._princess.free();
            this._grid.clear();
            this._grid.destroy(true);
            this._entitiesContainer.destroy(true);
            this._conainer.destroy(true);
            this._gameUI.destroy(true);
            this._gameBG.destroy(true);
        };
        return BaseGame;
    }(TProject.AbstractGame));
    TProject.BaseGame = BaseGame;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Boot.prototype.preload = function () {
            this.game.load.onFileComplete.add(this.loadingUpdate, this);
            TProject.SavedData.load();
            this._curLocale = "en";
            if (typeof window["LOCALE"] === "string") {
                this._curLocale = window["LOCALE"];
            }
            this.game.load.image("cn_logo", Boot.PATH_IMAGES + "Preloader/cnlogo.jpg");
            this.game.load.atlas("preload", Boot.PATH_IMAGES + "Preloader/Preloader.png", Boot.PATH_IMAGES + "Preloader/Preloader.json");
            this.game.load.xml("locale", Boot.PATH_LOCALE + this._curLocale + "/locale.xml");
        };
        Boot.prototype.create = function () {
            this.enabledMultitouch(true);
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            this.game.scale.refresh();
            this.game.input.touch.preventDefault = false;
            if (this.game.device.desktop) {
                this.game.input.mouse.enabled = true;
            }
            else {
                this.game.input.mouse.enabled = false;
            }
            this.game.stage.disableVisibilityChange = true;
            this.game.stage.backgroundColor = 0;
        };
        Boot.prototype.loadingUpdate = function (progress, cacheKey, success, totalLoaded, totalFiles) {
            if (progress >= 100.0) {
                this.game.load.onFileComplete.removeAll();
                Boot.LOCALE = new TProject.LanguageManager(this._curLocale, this.game.cache.getXML("locale"));
                this.game.state.start("Preloader", true);
            }
        };
        Boot.prototype.enabledMultitouch = function (value) {
            if (value) {
                this.game.input.maxPointers = 2;
                this.game.input.addPointer();
                this.game.input.addPointer();
            }
            else {
                this.game.input.maxPointers = 1;
            }
        };
        return Boot;
    }(Phaser.State));
    Boot.PATH_IMAGES = "./assets/images/";
    Boot.PATH_FONTS = "./assets/fonts/";
    Boot.PATH_LOCALE = "./assets/localStrings/";
    TProject.Boot = Boot;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Menu.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            this._overButton = false;
            this._backGround = new TProject.BackGround(this.game, this.world.centerX, 0, 1);
            this.world.addChild(this._backGround);
            console.log(TProject.Boot.LOCALE.get("1"));
            this._bgMainmenuFore = this.game.add.sprite(6, 7, "MenuUI", "menu_fore0000");
            this._menuOrbs = [];
            this._menuOrbs.push(this.game.add.sprite(337, 287, "MenuUI", "pl_cheese_10000"));
            this._menuOrbs[0].scale.set(0.8);
            this._menuOrbs[0].animations.add("orb", Phaser.Animation.generateFrameNames("pl_cheese_", 10000, 10007));
            this._menuOrbs.push(this.game.add.sprite(517 + 40, 313, "MenuUI", "pl_cheese_10000"));
            this._menuOrbs[1].animations.add("orb", Phaser.Animation.generateFrameNames("pl_cheese_", 10000, 10007));
            this._menuOrbs.forEach(function (orb) {
                _this._bgMainmenuFore.addChild(orb);
                orb.play("orb", 30, true);
            });
            this._playBtn = this.game.add.sprite(37, 10, "MenuUI", "btn_play0000");
            this._playBtn.anchor.set(1, 0.5);
            this._playBtn.inputEnabled = true;
            this._playBtn.events.onInputOver.add(function () {
                _this._playBtn.loadTexture("MenuUI", "btn_play0001");
                TProject.SoundMixer.playSound("buttonOver");
                _this._overButton = true;
            }, this);
            this._playBtn.events.onInputOut.add(function () {
                _this._overButton = false;
                _this._playBtn.loadTexture("MenuUI", "btn_play0000");
            });
            this._playBtn.events.onInputUp.add(function () {
                if (_this._overButton) {
                    TProject.SoundMixer.playSound("button");
                    _this.showLevelMenu();
                    console.log("SHOWLEVELMENU!");
                }
            }, this);
            this._playBtnText = this.game.add.text(-60, -3, TProject.Boot.LOCALE.get("play"), {
                font: TProject.Boot.LOCALE.pickUpFont(TProject.FontType.LIGHT),
                fontSize: "30px",
                fontWeight: "bold",
                fill: "#ffffff",
                stroke: '#eb991d',
                strokeThickness: 2
            });
            this._playBtnText.anchor.set(1, 0.5);
            this._playBtn.addChild(this._playBtnText);
            this._instractionBtn = this.game.add.sprite(37, 10, "MenuUI", "btn_instructions0000");
            this._instractionBtn.anchor.set(1, 0.5);
            this._instractionBtn.inputEnabled = true;
            this._instractionBtn.events.onInputOver.add(function () {
                _this._instractionBtn.loadTexture("MenuUI", "btn_instructions0001");
                _this._overButton = true;
                TProject.SoundMixer.playSound("buttonOver");
            }, this);
            this._instractionBtn.events.onInputOut.add(function () {
                _this._instractionBtn.loadTexture("MenuUI", "btn_instructions0000");
                _this._overButton = false;
            }, this);
            this._instractionBtn.events.onInputUp.add(function () {
                if (_this._overButton) {
                    TProject.SoundMixer.playSound("button");
                    _this.showInstructionsMenu();
                }
            }, this);
            this._instractionBtnText = this.game.add.text(-60, -3, TProject.Boot.LOCALE.get("instructions"), {
                font: TProject.Boot.LOCALE.pickUpFont(TProject.FontType.LIGHT),
                fontSize: "25px",
                fontWeight: "bold",
                fill: "#ffffff",
                stroke: '#eb991d',
                strokeThickness: 2
            });
            this._instractionBtnText.anchor.set(1, 0.5);
            this._instractionBtn.addChild(this._instractionBtnText);
            this._titleImage = this.game.add.sprite(0, 0, "Title");
            this.game.stage.backgroundColor = 0xbfffbf;
            this._menu = new TProject.DBSprite(TProject.Boot.MENU_UI, "_DB/main_menu", this.game);
            this._menu.getBone("bg_mainmenu_fore").addChild(this._bgMainmenuFore);
            this._menu.getBone("play btn").addChild(this._playBtn);
            this._menu.getBone("instructions btn").addChild(this._instractionBtn);
            this._menu.getBone("title").addChild(this._titleImage);
            this._menu.play("idle");
            this._menu.setPos(0, 0);
            this.world.addChild(this._menu);
            this._linesAnimations = [];
            this._boardHeaderTextStyle = { font: TProject.Boot.LOCALE.pickUpFont(TProject.FontType.MEDIUM), fill: "#ce3436", align: "center", fontSize: "20px", stroke: "#7b0714", strokeThickness: 2 };
            this._normalTextStyle = { font: TProject.Boot.LOCALE.pickUpFont(TProject.FontType.LIGHT), fill: "#8c8670", align: "center", fontSize: "14px" };
            this.changeCursorStyleEvents(this._instractionBtn);
            this.changeCursorStyleEvents(this._playBtn);
            this.initLevelMenu();
            this.initInructionsMenu();
            TProject.SoundMixer.setAudioForState(0);
        };
        Menu.prototype.initInstructionSprites = function () {
            var _this = this;
            this._finnSprite = new TProject.DBSprite(TProject.Boot.CHARACTERS, "_DB/hyperFinn");
            this._finnSprite.setPos(-230 + 10, -25);
            this._finnSprite.scale.set(0.75, 0.75);
            this._finnSprite.play("down_idle");
            this._instructionsBoard.addChild(this._finnSprite);
            var gunter = new TProject.DBSprite(TProject.Boot.CHARACTERS, "_DB/hyperGunter");
            gunter.setPos(-230 + 100, 165);
            gunter.scale.set(0.75, 0.75);
            gunter.play("down_idle");
            this._instructionsBoard.addChild(gunter);
            var iceKing = new TProject.DBSprite(TProject.Boot.CHARACTERS, "_DB/hyperIceking");
            iceKing.setPos(-230 + 5, 150 + 15);
            iceKing.scale.set(0.6, 0.6);
            iceKing.play("down_idle");
            this._instructionsBoard.addChild(iceKing);
            var platform = this.game.add.sprite(-230 + 130, 165 + 30, "Objects", "platform_base_10000");
            platform.anchor.set(0, 1);
            platform.scale.set(0.7);
            this._instructionsBoard.addChild(platform);
            var fire = this.game.add.sprite(platform.width / 2 + 10, -platform.height - 40, "Objects", "platform_firepit.png");
            fire.addChild(this.getFlame(-10 + 15, -fire.height + 10, 0.34));
            fire.addChild(this.getFlame(-10 + 30, -fire.height + 20, 0.34));
            fire.addChild(this.getFlame(-10 + 50, -fire.height + 10, 0.34));
            platform.addChild(fire);
            platform = this.game.add.sprite(40, 165 + 30, "Objects", "platform_base_10000");
            platform.anchor.set(0, 1);
            platform.scale.set(0.7);
            var button = this.game.add.sprite(72, -125, "Objects", "platform_hot_plate_switch_10000");
            this._buttonAnimation = button.animations.add("flame", Phaser.Animation.generateFrameNames("platform_hot_plate_switch_", 10000, 10003));
            this._buttonAnimation.play(24 / 6, false);
            platform.addChild(button);
            this._instructionsBoard.addChild(platform);
            this._iceKingOnSpikes = new TProject.DBSprite(TProject.Boot.CHARACTERS, "_DB/hyperIceking");
            this._iceKingOnSpikes.setPos(100, -140);
            this._iceKingOnSpikes.scale.set(0.8, 0.8);
            this.setLinesOnIceking();
            platform = this.game.add.sprite(40 + 130, 165 + 30, "Objects", "platform_base_10000");
            platform.anchor.set(0, 1);
            platform.scale.set(0.7);
            var spikes = this.game.add.sprite(70, -165 - 5, "Objects", "pl_spikes_10000");
            this._spikesAnimation = spikes.animations.add("spike", Phaser.Animation.generateFrameNames("pl_spikes_", 10000, 10008));
            this._animationsCounter = 0;
            this._buttonAnimation.onComplete.add(function () {
                _this._spikesAnimation.play(60);
            }, this);
            this._spikesAnimation.onComplete.add(function () {
                _this._spikesAnimation.reverse();
                _this._animationsCounter = (_this._animationsCounter + 1) % 2;
                if (_this._animationsCounter == 0) {
                    _this._buttonAnimation.play(12 / 2);
                }
                else {
                    _this._iceKingOnSpikes.play("burn");
                    _this._spikesAnimation.play(60);
                }
            }, this);
            platform.addChild(spikes);
            platform.addChild(this._iceKingOnSpikes);
            this._iceKingOnSpikes.play("down_idle", 0);
            this._instructionsBoard.addChild(platform);
            platform = this.game.add.sprite(71, 24, "Objects", "platform_base_10000");
            platform.anchor.set(0, 1);
            platform.scale.set(0.7);
            this._instructionsBoard.addChild(platform);
            fire = this.game.add.sprite(platform.width / 2 + 10, -platform.height - 40, "Objects", "platform_firepit.png");
            fire.addChild(this.getFlame(-10 + 15, -fire.height + 10, 0.34));
            fire.addChild(this.getFlame(-10 + 30, -fire.height + 20, 0.34));
            fire.addChild(this.getFlame(-10 + 50, -fire.height + 10, 0.34));
            platform.addChild(fire);
            platform = this.game.add.sprite(-141, 24, "Objects", "platform_base_10000");
            platform.anchor.set(0, 1);
            platform.scale.set(0.7);
            this._instructionsBoard.addChild(platform);
            var orb = this.game.add.sprite(81, -147, "Objects", "pl_cheese_10000");
            orb.animations.add("orb", Phaser.Animation.generateFrameNames("pl_cheese_", 10000, 10007));
            orb.play("orb", 24, true);
            platform.addChild(orb);
            platform = this.game.add.sprite(-46, 24, "Objects", "platform_base_10000");
            platform.anchor.set(0, 1);
            platform.scale.set(0.7);
            this._instructionsBoard.addChild(platform);
            var coin = this.game.add.sprite(72, -148, "Objects", "pl_sausage_10065");
            coin.animations.add("coin", Phaser.Animation.generateFrameNames("pl_sausage_", 10000, 10065));
            coin.play("coin", 24, true);
            platform.addChild(coin);
        };
        Menu.prototype.setLinesOnIceking = function () {
            var _this = this;
            this._iceKingOnSpikes.addEvent("frameEvent", function (event) {
                if (event.name == "hit") {
                    _this._linesAnimations.forEach(function (line) { return line.play(30, true); });
                }
            }, this);
            for (var i = 1; i <= 7; i++) {
                var line = this.game.add.sprite(0, 0, "Objects", "fx_line_10000");
                line.anchor.set(0.5, 0.8);
                var lineAnimation = line.animations.add("line", Phaser.Animation.generateFrameNames("fx_line_", 10000, 10007));
                this._iceKingOnSpikes.getBone("fx" + i).addChild(line);
                this._linesAnimations.push(lineAnimation);
            }
        };
        Menu.prototype.getFlame = function (x, y, scale) {
            var flame = this.game.add.sprite(x, y, "Objects", "flambit_baby_10004");
            flame.animations.add("flame", Phaser.Animation.generateFrameNames("flambit_baby_", 10004, 10009));
            flame.animations.play("flame", 24, true);
            flame.scale.set(scale);
            return flame;
        };
        Menu.prototype.initInructionsMenu = function () {
            var _this = this;
            this._instructionsBoard = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "MenuUI", "Instruction Menu0000");
            this._instructionsBoard.anchor.set(0.5);
            this.world.addChild(this._instructionsBoard);
            this._instructionsBoard.visible = false;
            this._continueBtn = this.game.add.sprite(0, this._instructionsBoard.height / 2, "MenuUI", "btn_close0000");
            this._continueBtn.anchor.set(0.5, 0.6);
            this._instructionsBoard.addChild(this._continueBtn);
            this._continueBtn.events.onInputOver.add(function () {
                TProject.SoundMixer.playSound("buttonOver");
                _this._overButton = true;
                _this._continueBtn.loadTexture("MenuUI", "btn_close0001");
            }, this);
            this._continueBtn.events.onInputOut.add(function () {
                _this._overButton = false;
                _this._continueBtn.loadTexture("MenuUI", "btn_close0000");
            }, this);
            this._continueBtn.events.onInputUp.add(function () {
                if (_this._overButton) {
                    TProject.SoundMixer.playSound("button");
                    _this.hideInstructionsMenu();
                }
            }, this);
            this.changeCursorStyleEvents(this._continueBtn);
            var continueText = this.game.add.text(0, -10, TProject.Boot.LOCALE.get("continueText"), {
                font: TProject.Boot.LOCALE.pickUpFont(TProject.FontType.MEDIUM), fill: "#ffffff", align: "center", fontSize: "24px"
            });
            continueText.anchor.set(0.5);
            this._continueBtn.addChild(continueText);
            var text = this.game.add.text(0, -110 - 80, TProject.Boot.LOCALE.get("instructions"), this._boardHeaderTextStyle);
            text.anchor.set(0.5, 0);
            this._instructionsBoard.addChild(text);
            text = this.game.add.text(-130, -110, TProject.Boot.LOCALE.get("inst1"), this._normalTextStyle);
            text.wordWrap = true;
            text.lineSpacing -= 10;
            text.wordWrapWidth = 200;
            text.align = "right";
            this._instructionsBoard.addChild(text);
            text = this.game.add.text(130, -110, TProject.Boot.LOCALE.get("inst2"), this._normalTextStyle);
            text.lineSpacing -= 10;
            text.wordWrap = true;
            text.wordWrapWidth = 150;
            text.align = "right";
            this._instructionsBoard.addChild(text);
            text = this.game.add.text(-200, 45, TProject.Boot.LOCALE.get("inst3"), this._normalTextStyle);
            text.lineSpacing -= 10;
            text.wordWrap = true;
            text.wordWrapWidth = 230;
            text.align = "right";
            this._instructionsBoard.addChild(text);
            text = this.game.add.text(-170 + 255, 45, TProject.Boot.LOCALE.get("inst4"), this._normalTextStyle);
            text.lineSpacing -= 10;
            text.wordWrap = true;
            text.wordWrapWidth = 100;
            text.align = "left";
            this._instructionsBoard.addChild(text);
            this.initInstructionSprites();
        };
        Menu.prototype.showInstructionsMenu = function () {
            var _this = this;
            this.game.canvas.style.cursor = "default";
            this.disableButtons();
            var tween = this.game.add.tween(this._menu).to({ alpha: 0 }, Menu.MAIN_MENU_HIDE_TIME, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                _this._instructionsBoard.y = -_this._instructionsBoard.height;
                _this._instructionsBoard.visible = true;
                var tween = _this.game.add.tween(_this._instructionsBoard).to({ y: _this.game.world.centerY - 15 }, Menu.BOARD_SHOW_TIME, Phaser.Easing.Bounce.Out, true);
                tween.onComplete.add(function () {
                    _this._continueBtn.inputEnabled = true;
                }, _this);
            });
        };
        Menu.prototype.hideInstructionsMenu = function () {
            var _this = this;
            this.game.canvas.style.cursor = "default";
            this._continueBtn.inputEnabled = false;
            this._overButton = false;
            this._continueBtn.loadTexture("MenuUI", "btn_close0000");
            var tween = this.game.add.tween(this._instructionsBoard).to({ y: -this.game.world.centerY }, Menu.BOARD_HIDE_TIME, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                _this._instructionsBoard.visible = false;
                _this._menu.alpha = 1;
                _this._menu.play("idle");
                _this.enableMenuButtonds();
            });
        };
        Menu.prototype.initLevelMenu = function () {
            var _this = this;
            this._downButton = false;
            this._levelSelectBack = this.game.add.sprite(this.world.centerX, -this.world.centerY, "MenuUI", "Level select0000");
            this._levelSelectBack.anchor.set(0.5);
            this._menuContainer = this.game.add.sprite(-this._levelSelectBack.width / 2, -this._levelSelectBack.height / 2);
            this._exitBtn = this.game.add.sprite(20, 95, "IngameUI", "btn_exit0000");
            this._exitBtn.anchor.set(0.5, 1);
            this._exitBtn.events.onInputOver.add(function () {
                TProject.SoundMixer.playSound("buttonOver");
                _this._overButton = true;
                _this._exitBtn.loadTexture("IngameUI", "btn_exit0001");
                if (_this._downButton) {
                    _this._exitBtn.scale.set(0.85);
                }
            });
            this._exitBtn.events.onInputOut.add(function () {
                _this._overButton = false;
                _this._exitBtn.loadTexture("IngameUI", "btn_exit0000");
                _this._exitBtn.scale.set(1);
            });
            this._exitBtn.events.onInputUp.add(function () {
                _this._downButton = false;
                if (_this._overButton) {
                    TProject.SoundMixer.playSound("button");
                    _this.hideLevelMenu();
                    _this._exitBtn.scale.set(1);
                }
            });
            this._exitBtn.events.onInputDown.add(function () {
                _this._downButton = true;
                _this._exitBtn.scale.set(0.85);
            });
            this.changeCursorStyleEvents(this._exitBtn);
            this._levelSelectBacktext = this.game.add.text(this._levelSelectBack.width / 2, this._exitBtn.centerY, TProject.Boot.LOCALE.get("levelselect"), this._boardHeaderTextStyle);
            this._levelSelectBacktext.anchor.set(0.5);
            if (window["LOCALE"] == "hu") {
                this._levelSelectBacktext.fontSize = 15;
            }
            var dx = 95;
            var offsetX = 32;
            var dy = 85;
            var offsetY = 52;
            this._levelIcons = [];
            for (var i = 1; i <= 4; i++) {
                for (var j = 1; j <= 5; j++) {
                    var level = 5 * (i - 1) + j;
                    var levelStatus = TProject.SavedData.levelStatus[level - 1];
                    var gemsCount = TProject.SavedData.gemsStatus[level - 1];
                    var icon = new TProject.LevelSelectIcon(this.game, offsetX + j * dx, offsetY + i * dy, level, levelStatus, gemsCount);
                    icon.anchor.set(0.5, 0);
                    icon.scale.set(0.7);
                    this._levelIcons.push(icon);
                    this._menuContainer.addChild(this._levelIcons[this._levelIcons.length - 1]);
                }
            }
            var _loop_1 = function (i) {
                if (this_1._levelIcons[i].levelStatus > 1) {
                    var overlayGraph = this_1.game.add.graphics(this_1._levelIcons[i].x, this_1._levelIcons[i].y);
                    overlayGraph.beginFill(0xcc3366, 0);
                    overlayGraph.drawRect(-40, -40, 80, 80);
                    overlayGraph.endFill();
                    this_1._menuContainer.addChild(overlayGraph);
                    overlayGraph.inputEnabled = true;
                    overlayGraph.events.onInputUp.add(function () {
                        TProject.SoundMixer.playSound("button");
                        TProject.AbstractGame.CURRENT_LEVEL = i;
                        _this.free();
                    });
                }
            };
            var this_1 = this;
            for (var i = 0; i < this._levelIcons.length; i++) {
                _loop_1(i);
            }
            this._levelSelectBack.addChild(this._menuContainer);
            this._menuContainer.addChild(this._exitBtn);
            this._menuContainer.addChild(this._levelSelectBacktext);
            this._levelSelectBack.visible = false;
        };
        Menu.prototype.showLevelMenu = function () {
            var _this = this;
            TProject.SoundMixer.stopCurrentLoop();
            this.game.canvas.style.cursor = "default";
            this.disableButtons();
            var tween = this.game.add.tween(this._menu).to({ alpha: 0 }, Menu.MAIN_MENU_HIDE_TIME, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                _this._levelSelectBack.y = -_this.world.height / 2;
                _this._levelSelectBack.visible = true;
                _this.game.add.tween(_this._levelSelectBack).to({ y: _this.world.centerY }, Menu.BOARD_SHOW_TIME, Phaser.Easing.Bounce.Out, true).onComplete.add(function () {
                    for (var i = 0; i < _this._levelIcons.length; i++) {
                        _this._levelIcons[i].inputEnabled = true;
                    }
                    ;
                    _this._exitBtn.inputEnabled = true;
                    _this._backGround.playRipples();
                });
            }, this);
        };
        Menu.prototype.hideLevelMenu = function () {
            var _this = this;
            this.game.canvas.style.cursor = "default";
            this._overButton = false;
            this._exitBtn.loadTexture("IngameUI", "btn_exit0000");
            this._exitBtn.inputEnabled = false;
            for (var i = 0; i < this._levelIcons.length; i++) {
                this._levelIcons[i].inputEnabled = false;
            }
            ;
            var tween = this.game.add.tween(this._levelSelectBack).to({ y: -this.world.centerY }, Menu.BOARD_HIDE_TIME, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                _this._backGround.stopRipples();
                _this._levelSelectBack.visible = false;
                _this._menu.alpha = 1;
                _this._menu.play("idle");
                TProject.SoundMixer.on();
                _this.enableMenuButtonds();
            });
        };
        Menu.prototype.update = function () {
            this._backGround.riplesUpdate();
            this._linesAnimations.forEach(function (line) {
                line.update();
                if (line.loopCount == 3) {
                    line.stop();
                }
            });
            this._menuOrbs.forEach(function (orb) { return orb.animations.getAnimation("orb").update(); });
        };
        Menu.prototype.changeCursorStyleEvents = function (button) {
            var _this = this;
            button.events.onInputOver.add(function () {
                _this.game.canvas.style.cursor = "pointer";
            }, this);
            button.events.onInputOut.add(function () {
                _this.game.canvas.style.cursor = "default";
            }, this);
        };
        Menu.prototype.disableButtons = function () {
            this._instractionBtn.inputEnabled = false;
            this._playBtn.inputEnabled = false;
        };
        Menu.prototype.enableMenuButtonds = function () {
            this._instractionBtn.loadTexture("MenuUI", "btn_instructions0000");
            this._playBtn.loadTexture("MenuUI", "btn_play0000");
            this._instractionBtn.inputEnabled = true;
            this._playBtn.inputEnabled = true;
        };
        Menu.prototype.shutdown = function () {
            if (this._menu)
                this._menu.free();
            if (this._bgMainmenuFore)
                this._bgMainmenuFore.destroy();
            if (this._playBtn) {
                this._playBtn.events.onInputUp.removeAll();
                this._playBtn.events.onInputOver.removeAll();
                this._playBtn.events.onInputOut.removeAll();
                this._playBtn.events.onInputDown.removeAll();
                this._playBtn.destroy();
            }
            if (this._instractionBtn) {
                this._instractionBtn.events.onInputUp.removeAll();
                this._instractionBtn.events.onInputOver.removeAll();
                this._instractionBtn.events.onInputOut.removeAll();
                this._instractionBtn.events.onInputDown.removeAll();
                this._instractionBtn.destroy();
            }
            if (this._titleImage)
                this._titleImage.destroy();
            if (this._playBtnText)
                this._playBtnText.destroy();
            if (this._levelSelectBack)
                this._levelSelectBack.destroy();
            if (this._levelSelectBacktext)
                this._levelSelectBacktext.destroy();
            if (this._menuContainer)
                this._menuContainer.destroy();
            if (this._exitBtn) {
                this._exitBtn.events.onInputUp.removeAll();
                this._exitBtn.events.onInputOver.removeAll();
                this._exitBtn.events.onInputOut.removeAll();
                this._exitBtn.events.onInputDown.removeAll();
                this._exitBtn.destroy();
            }
            if (this._volumeBtn) {
                this._volumeBtn.events.onInputUp.removeAll();
                this._volumeBtn.events.onInputOver.removeAll();
                this._volumeBtn.events.onInputOut.removeAll();
                this._volumeBtn.events.onInputDown.removeAll();
                this._volumeBtn.destroy();
            }
            if (this._continueBtn) {
                this._continueBtn.events.onInputUp.removeAll();
                this._continueBtn.events.onInputOver.removeAll();
                this._continueBtn.events.onInputOut.removeAll();
                this._continueBtn.events.onInputDown.removeAll();
                this._continueBtn.destroy();
            }
            if (this._finnSprite) {
                this._finnSprite.free();
            }
            if (this._spikesAnimation) {
                this._spikesAnimation.destroy();
            }
            if (this._buttonAnimation) {
                this._buttonAnimation.destroy();
            }
            if (this._iceKingOnSpikes) {
                this._iceKingOnSpikes.free();
            }
            this._linesAnimations.forEach(function (a) { return a.destroy(); });
            this._menuOrbs.forEach(function (orb) { return orb.destroy(); });
            if (this._backGround) {
                this._backGround.destroy();
            }
            this._levelIcons.forEach(function (x) { return x.destroy(); });
        };
        Menu.prototype.free = function () {
            this.game.state.start("BaseGame", true);
        };
        return Menu;
    }(Phaser.State));
    Menu.BOARD_SHOW_TIME = 1000;
    Menu.MAIN_MENU_HIDE_TIME = 100;
    Menu.BOARD_HIDE_TIME = 200;
    TProject.Menu = Menu;
})(TProject || (TProject = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TProject;
(function (TProject) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._loadedAssets = false;
            _this._loadedFont = false;
            return _this;
        }
        Preloader.prototype.preload = function () {
            var _this = this;
            this.game.load.onFileComplete.add(this.loadingUpdate, this);
            this._cnLogo = this.add.image(this.world.centerX - 3, this.world.centerY - 100 + 50, "cn_logo");
            this._cnLogo.anchor.set(0.5);
            this._loading = new TProject.ParallaxImage(this.game, "preload", 0, "bgProress0000");
            this._loading.anchor.set(0.5);
            this._footer = this.add.image(this.world.centerX, this.world.centerY + 120 - 20, "preload", "preloaderFooter0000");
            this._footer.anchor.set(0.5);
            this._loading.x = this._footer.x - this._footer.width * 0.5 - 2;
            this._loading.y = this._footer.y - 50;
            this._loadingMask = this.add.graphics(4, 24);
            this._loadingMask.beginFill(0xff0000, 0.5);
            this._loadingMask.drawRect(0, 0, this._footer.width - 5, this._footer.height - 5);
            this._loadingMask.endFill();
            this._loading.addChild(this._loadingMask);
            this._loading.mask = this._loadingMask;
            this._loadingMask.scale.x = 0;
            this._intervalId = setInterval(function () {
                _this._loading.updateScroll(0.02 * 60.0);
            }, 20);
            if (typeof window["LOCALE"] === "string") {
                this._curLogo = window["LOCALE"];
            }
            this.fontsLoading();
            TProject.Factories.loadFactory(this.game, "MenuUI", TProject.Boot.PATH_IMAGES + "DB/MenuUI/");
            TProject.Factories.loadFactory(this.game, "Chars", TProject.Boot.PATH_IMAGES + "DB/CharAndObj/");
            this.game.load.atlas("MenuUI", TProject.Boot.PATH_IMAGES + "MenuUI.png", TProject.Boot.PATH_IMAGES + "MenuUI.json");
            this.game.load.atlas("IngameUI", TProject.Boot.PATH_IMAGES + "IngameUI.png", TProject.Boot.PATH_IMAGES + "IngameUI.json");
            this.game.load.atlas("Objects", TProject.Boot.PATH_IMAGES + "CharsAndObjects.png", TProject.Boot.PATH_IMAGES + "CharsAndObjects.json");
            TProject.Factories.loadFactory(this.game, "Princesses", TProject.Boot.PATH_IMAGES + "DB/Princesses/");
            this.game.load.atlas("Princesses", TProject.Boot.PATH_IMAGES + "Princesses.png", TProject.Boot.PATH_IMAGES + "Princesses.json");
            this.game.load.atlas("MenuUI", TProject.Boot.PATH_IMAGES + "MenuUI.png", TProject.Boot.PATH_IMAGES + "MenuUI.json");
            this.game.load.image("Title", TProject.Boot.PATH_IMAGES + ("GameTitle/_gameTitle_" + this._curLogo + ".png"));
            this.game.load.audiosprite("Sfx", ["assets/sounds/sfx.mp3", "assets/sounds/sfx.ogg"], "assets/sounds/sfx.json");
        };
        Preloader.prototype.shutdown = function () {
            this._cnLogo.destroy();
            this._cnLogo = null;
            this._loading.destroy();
            this._loading = null;
            this._footer.destroy();
            this._footer = null;
            this._loadingMask.destroy();
            this._loadingMask = null;
        };
        Preloader.prototype.loadingUpdate = function (progress, cacheKey, success, totalLoaded, totalFiles) {
            this._loadingMask.scale.x = progress / 100;
            if (progress >= 100.0) {
                this.game.load.onFileComplete.removeAll();
                TProject.SoundMixer.setGlobalAudioSettings(this.game);
                TProject.Boot.MENU_UI = TProject.Factories.createFactory(this.game, "MenuUI");
                TProject.Boot.CHARACTERS = TProject.Factories.createFactory(this.game, "Chars");
                TProject.Boot.PRINCESSES = TProject.Factories.createFactory(this.game, "Princesses");
                dragonBones.PhaserFactory.startLoop();
                this._loadedAssets = true;
                clearInterval(this._intervalId);
            }
        };
        Preloader.prototype.update = function () {
            var _this = this;
            if (this._loadedAssets && this._loadedFont) {
                this._loadedAssets = false;
                setTimeout(function () {
                    _this.game.state.start(TProject.LocalConfig.CURRENT_STATE, true);
                }, 400);
            }
        };
        Preloader.prototype.fontsLoading = function () {
            var _this = this;
            var fontFamilies;
            if (TProject.Boot.LOCALE.currentLocale == "ru") {
                fontFamilies = ["Fred Fredburger W04 Regular", "Fred Fredburger W04 Bold"];
            }
            else if (TProject.Boot.LOCALE.currentLocale == "ar") {
                fontFamilies = ["Lubalin_Ara"];
            }
            else {
                fontFamilies = ["Lubalin_CnObl", "Lubalin_Book", "Lubalin_D14"];
            }
            WebFont.load({
                custom: {
                    families: fontFamilies,
                    urls: [
                        TProject.Boot.PATH_FONTS + "fonts_general.css"
                    ]
                },
                active: function () {
                    window.setTimeout(function () {
                        _this._loadedFont = true;
                    }, 100);
                }
            });
        };
        return Preloader;
    }(Phaser.State));
    TProject.Preloader = Preloader;
})(TProject || (TProject = {}));
