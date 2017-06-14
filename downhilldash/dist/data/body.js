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
    var Background = (function (_super) {
        __extends(Background, _super);
        function Background(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this._sprites = [];
            _this._currentX = 0;
            _this._currentY = 0;
            _this._initialized = false;
            _this._reposition = false;
            return _this;
        }
        Object.defineProperty(Background.prototype, "movieClipId", {
            set: function (val) {
                if (!val) {
                    this._index = 3;
                }
                else {
                    this._index = val;
                }
                this.loadSprite();
            },
            enumerable: true,
            configurable: true
        });
        Background.prototype.loadSprite = function () {
            switch (this._index) {
                case 1:
                    {
                        this._sprites.push(this.game.add.sprite(0, 0, "bg1", "bgstreetMC_1"));
                        this.addChild(this._sprites[0]);
                        this._sprites.push(this.game.add.sprite(0, 0, "bg1", "bgstreetMC_2"));
                        this.addChild(this._sprites[1]);
                        this._sprites.push(this.game.add.sprite(0, 0, "bg1", "bgstreetMC_3"));
                        this.addChild(this._sprites[2]);
                        this._sprites[0].y = -253;
                    }
                    break;
                case 2:
                    {
                        this._sprites.push(this.game.add.sprite(0, 0, "bg0", "bgjunkMC_1"));
                        this.addChild(this._sprites[0]);
                        this._sprites.push(this.game.add.sprite(0, 0, "bg0", "bgjunkMC_2"));
                        this.addChild(this._sprites[1]);
                        this._sprites.push(this.game.add.sprite(0, 0, "bg0", "bgjunkMC_3"));
                        this.addChild(this._sprites[2]);
                        this._sprites[0].y = -351 - 266;
                    }
                    break;
                default:
                    {
                        this._sprites.push(this.game.add.sprite(0, 0, "bg0", "bgforestMC_1"));
                        this.addChild(this._sprites[0]);
                        this._sprites.push(this.game.add.sprite(0, 0, "bg0", "bgforestMC_2"));
                        this.addChild(this._sprites[1]);
                        this._sprites.push(this.game.add.sprite(0, 0, "bg0", "bgforestMC_3"));
                        this.addChild(this._sprites[2]);
                        this._sprites[0].y = -253;
                    }
                    break;
            }
            var tempLeftPos = -TProject.GameConfig.screenWidth * 0.5;
            this._sprites.forEach(function (el) {
                el.x = tempLeftPos;
            });
            this._sprites[1].y = this._sprites[0].y + this._sprites[0].height - 2;
            this._sprites[2].y = this._sprites[1].y + this._sprites[1].height - 2;
            this._initialized = true;
        };
        Background.prototype.setPos = function (_x, _y) {
            if (!this._initialized) {
                return;
            }
            this.x = this._currentX - _x;
            this.y = this._currentY - _y;
            if (-this.y - 250 > (this._sprites[2].y - 2) && !this._reposition) {
                console.log("change poistion 0");
                this._sprites[0].y = this._sprites[2].y - 2 + this._sprites[2].height;
                this._sprites[1].y = this._sprites[0].y - 2 + this._sprites[0].height;
                this._reposition = true;
            }
            if (-this.y > (this._sprites[1].y - 2 - 100) && this._reposition) {
                console.log("change poistion 1");
                this._sprites[2].y = this._sprites[1].y - 2 + this._sprites[1].height;
                this._reposition = false;
            }
        };
        Background.prototype.destroy = function () {
            var _this = this;
            this._sprites.forEach(function (el) {
                _this.removeChild(el);
                el.destroy();
            });
            _super.prototype.destroy.call(this);
        };
        return Background;
    }(Phaser.Sprite));
    TProject.Background = Background;
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
    var Bod = (function (_super) {
        __extends(Bod, _super);
        function Bod(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this._sledgeScale = 1;
            _this._trailArray = [];
            _this._hitAnimations = [];
            _this._dirtyFlag = true;
            return _this;
        }
        Object.defineProperty(Bod.prototype, "baseGame", {
            set: function (val) {
                this._baseGame = val;
                this._trails = this._baseGame.trails;
            },
            enumerable: true,
            configurable: true
        });
        Bod.prototype.initStuff = function (character) {
            var _this = this;
            this.pX = 0;
            this.pY = -400;
            this._shadowCircle = new Phaser.Circle(0, 0, 20 * 2);
            this._characterId = character;
            this._bodSnow = this.game.add.sprite(0, 0, "Characters", "mc.bod_snow_" + character + "0001");
            this._bodSnow.scale.set(0.65, 0.65);
            this._bodSnow.animations.add("angle0", Phaser.Animation.generateFrameNames("mc.bod_snow_", character * 10000 + 1, character * 10000 + 8), 24, true);
            this._startTY = 0;
            if (character == 1) {
                this._sprite = this.game.add.sprite(0, 0, "Characters", "mc.bod_10001");
                this._sledgeMovieGroundPositionY = -80 * this._sledgeScale;
                this._shadowSprite = this.game.add.sprite(0, 0, "Characters", "mc.bod_shadow_1");
                this._sprite.x = -this._shadowSprite.width / 2 - 20;
                this._sprite.y = -this._shadowSprite.height / 2 - 80;
                this._offset = new Phaser.Point(this._sprite.x, this._sprite.y);
                this._bodSnow.y = 95;
                this._bodSnow.x = 5;
                this._startTY = -15;
                this._fallAnimation = this._sprite.animations.add("fall", Phaser.Animation.generateFrameNames("mc.bod_", 10164, 10176), 6, false);
                this._hitAnimations.push(this._sprite.animations.add("hit0", Phaser.Animation.generateFrameNames("mc.bod_", 10029, 10058), 24, false));
                this._hitAnimations.push(this._sprite.animations.add("hit1", Phaser.Animation.generateFrameNames("mc.bod_", 10059, 10088), 24, false));
                this._hitAnimations.push(this._sprite.animations.add("hit2", Phaser.Animation.generateFrameNames("mc.bod_", 10089, 10111), 24, false));
                this._hitAnimations.push(this._sprite.animations.add("hit3", Phaser.Animation.generateFrameNames("mc.bod_", 10112, 10150), 24, false));
                this._hitAnimations.push(this._sprite.animations.add("hit4", Phaser.Animation.generateFrameNames("mc.bod_", 10151, 10163), 24, false));
            }
            else if (character == 2) {
                this._sprite = this.game.add.sprite(0, 0, "Characters", "mc.bod_20001");
                this._sledgeMovieGroundPositionY = -95 * this._sledgeScale;
                this._shadowSprite = this.game.add.sprite(0, 0, "Characters", "mc.bod_shadow_2");
                this._sprite.x = -this._shadowSprite.width / 2 - 25;
                this._sprite.y = -this._shadowSprite.height / 2 - 50;
                this._offset = new Phaser.Point(this._sprite.x, this._sprite.y);
                this._bodSnow.y = 90;
                this._bodSnow.x = 17;
                this._fallAnimation = this._sprite.animations.add("fall", Phaser.Animation.generateFrameNames("mc.bod_", 20186, 20201), 24, false);
                this._hitAnimations.push(this._sprite.animations.add("hit0", Phaser.Animation.generateFrameNames("mc.bod_", 20029, 20058), 24, false));
                this._hitAnimations.push(this._sprite.animations.add("hit1", Phaser.Animation.generateFrameNames("mc.bod_", 20059, 20088), 24, false));
                this._hitAnimations.push(this._sprite.animations.add("hit2", Phaser.Animation.generateFrameNames("mc.bod_", 20089, 20111), 24, false));
                this._hitAnimations.push(this._sprite.animations.add("hit3", Phaser.Animation.generateFrameNames("mc.bod_", 20112, 20150), 24, false));
                this._hitAnimations.push(this._sprite.animations.add("hit4", Phaser.Animation.generateFrameNames("mc.bod_", 20151, 20185), 24, false));
            }
            else if (character == 3) {
                this._sprite = this.game.add.sprite(0, 0, "Characters", "mc.bod_30001");
                this._sledgeMovieGroundPositionY = -130 * this._sledgeScale;
                this._shadowSprite = this.game.add.sprite(0, 0, "Characters", "mc.bod_shadow_3");
                this._sprite.x = -71;
                this._sprite.y = -130;
                this._offset = new Phaser.Point(this._sprite.x, this._sprite.y);
                this._bodSnow.y = -5;
                this._bodSnow.x = -25;
                this._fallAnimation = this._sprite.animations.add("fall", Phaser.Animation.generateFrameNames("mc.bod_", 30174, 30189), 5, false);
                this._hitAnimations.push(this._sprite.animations.add("hit0", Phaser.Animation.generateFrameNames("mc.bod_", 30029, 30056), 24, false));
                this._hitAnimations.push(this._sprite.animations.add("hit1", Phaser.Animation.generateFrameNames("mc.bod_", 30057, 30088), 24, false));
                this._hitAnimations.push(this._sprite.animations.add("hit2", Phaser.Animation.generateFrameNames("mc.bod_", 30089, 30127), 24, false));
                this._hitAnimations.push(this._sprite.animations.add("hit3", Phaser.Animation.generateFrameNames("mc.bod_", 30128, 30158), 24, false));
                this._hitAnimations.push(this._sprite.animations.add("hit4", Phaser.Animation.generateFrameNames("mc.bod_", 30159, 30173), 24, false));
            }
            else {
                console.log("Error, game character selection out of bounds");
            }
            this._woosh = this.game.add.sprite(90, 0, "Characters", "mc.woosh_10001");
            this._woosh.visible = false;
            var wooshAnimation = this._woosh.animations.add("play", Phaser.Animation.generateFrameNames("mc.woosh_", 10001, 10013), 24, false);
            wooshAnimation.onStart.add(function () {
                _this._woosh.visible = true;
            });
            wooshAnimation.onComplete.add(function () {
                _this._woosh.visible = false;
            });
            this._woosh.anchor.set(0.5, 0);
            this.addChild(this._woosh);
            this._sprite.animations.add("angle1", Phaser.Animation.generateFrameNames("mc.bod_", character * 10000 + 2, character * 10000 + 7), 24, true);
            this._sprite.animations.add("angle2", Phaser.Animation.generateFrameNames("mc.bod_", character * 10000 + 8, character * 10000 + 13), 24, true);
            this._sprite.animations.add("angle3", Phaser.Animation.generateFrameNames("mc.bod_", character * 10000 + 14, character * 10000 + 19), 24, true);
            this._sprite.animations.add("angle4", Phaser.Animation.generateFrameNames("mc.bod_", character * 10000 + 20, character * 10000 + 28), 24, true);
            this._shadowSprite.anchor.set(0.5, 0.5);
            if (this._characterId != 3) {
                this.addChild(this._shadowSprite);
                this.addChild(this._sprite);
                this._sprite.addChild(this._bodSnow);
            }
            else {
                this.addChild(this._bodSnow);
                this.addChild(this._shadowSprite);
                this.addChild(this._sprite);
            }
            this._hitAnimations.forEach(function (x) {
                x.onComplete.add(function () {
                    _this._prevFrame = 2;
                    _this._bodSnow.visible = true;
                    _this._sprite.scale.x = 1;
                    _this._sprite.x = _this._offset.x;
                    _this._angle = 180;
                    _this._sprite.loadTexture("Characters", "mc.bod_snow_" + character + "0001");
                });
            });
            this._collisionCircle = new Phaser.Circle(0, 0, TProject.GameConfig.sledgeCollisionRadius * 2);
            this._bodSnow.play("angle0", 24, true);
            this.myreset();
        };
        Bod.prototype.myreset = function () {
            this._dirX = 0;
            this._dirY = 0;
            this._angle = 180;
            this._rotation = 0;
            this._rotTotal = 0;
            this._rotSpeed = TProject.GameConfig.turningSpeed[this._characterId];
            this._speed = 0;
            this._trailArray = [];
            this._state = "active";
            this._hitDelay = 0;
            this._fallDelay = 0;
            this._sprayNum = 0;
            this._speedBoostTimer = 0;
            this._recoveryMovementY = 0;
            this._recoveryXPoint = -999;
            this._heightOffGround = 0;
            this._jumpSpeed = 0;
            this._skiloopPlaying = false;
            this._turningSound1Playing = false;
            this._turningSound2Playing = false;
            this._prevFrame = 0;
            this.setPos(this.pX, this.pY);
        };
        Object.defineProperty(Bod.prototype, "currentLevel", {
            set: function (val) {
                this._currentLevel = val;
                this._finishLine = TProject.GameConfig.getCourseLength(this._currentLevel);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bod.prototype, "collisionCentre", {
            get: function () {
                return new Phaser.Point(this.pX, this.pY - 125);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bod.prototype, "isFallen", {
            get: function () {
                return (this._fallDelay > 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bod.prototype, "hasDelay", {
            get: function () {
                return (this._hitDelay > 0 || this._fallDelay > 0);
            },
            enumerable: true,
            configurable: true
        });
        Bod.prototype.setRotation = function () {
            if (this.hasDelay) {
                return;
            }
            if (this._heightOffGround < 0.15 && this._shadowSprite.visible == true) {
                this._shadowSprite.visible = true;
            }
            if (this._heightOffGround > 0) {
                if (this._heightOffGround > 0.1 && this._shadowSprite.visible == false) {
                    this._shadowSprite.visible = true;
                }
                return;
            }
            var pFrame = Math.round(Math.abs((this._angle - 180) / 3));
            if (pFrame >= 18) {
                if (this._sprite.animations.currentAnim.name != "angle4") {
                    this._sprite.play("angle4", 24, true);
                    this._prevFrame = pFrame;
                    this._bodSnow.visible = false;
                }
            }
            else if (pFrame >= 12) {
                if (this._sprite.animations.currentAnim.name != "angle3") {
                    this._sprite.play("angle3", 24, true);
                    this._prevFrame = pFrame;
                    this._bodSnow.visible = false;
                }
            }
            else if (pFrame >= 6) {
                if (this._sprite.animations.currentAnim.name != "angle2") {
                    this._sprite.play("angle2", 24, true);
                    this._prevFrame = pFrame;
                    this._bodSnow.visible = false;
                }
            }
            else if (pFrame >= 1) {
                if (this._sprite.animations.currentAnim.name != "angle1") {
                    this._sprite.play("angle1", 24, true);
                    this._bodSnow.visible = false;
                    this._prevFrame = pFrame;
                }
            }
            else {
                if (pFrame != this._prevFrame) {
                    console.log("henlo");
                    this._sprite.loadTexture("Characters", "mc.bod_" + this._characterId + "0001");
                    this._prevFrame = pFrame;
                    this._bodSnow.visible = true;
                    this._sprite.scale.x = 1;
                    this._angle = 180;
                    this._sprite.x = this._offset.x;
                }
            }
            if (this._angle > 180) {
                if (this._sprite.scale.x > 0) {
                    this._sprite.scale.x = -this._sledgeScale;
                    this._sprite.x = 48;
                    if (this._characterId == 3) {
                        this._sprite.x = 70;
                    }
                }
            }
            else {
                if (this._sprite.scale.x < 0) {
                    this._sprite.scale.x = 1;
                    this._sprite.x = this._offset.x;
                }
            }
            this._sprite.scale.y = this._sledgeScale;
        };
        Bod.prototype.hitNormal = function () {
            console.log("Bod: hit normal");
            var tHit = Math.round(Math.random() * 4);
            this._hitAnimations[tHit].play(24 * 2, false);
        };
        Bod.prototype.straightenUpAfterHit = function () {
            this._angle = 180;
            this._rotTotal = 0;
            this._rotation = 0;
            this.setRotation();
        };
        Bod.prototype.startJump = function () {
            this._speed = Math.max(5, this._speed + 3);
            var pAngleDiff = this._angle - 180;
            this._angle = 180 + pAngleDiff * 0.3;
            this._rotTotal = 0;
            this._rotation = 0;
            this._bodSnow.visible = false;
            this._prevFrame = 2;
            this._sprite.scale.x = 1;
            this._sprite.x = this._offset.x;
            this._sprite.loadTexture("Characters", "mc.bod_" + this._characterId + "0001");
            this._jumpSpeed = TProject.GameConfig.jumpAmount * Math.max(2, this._speed);
            this._heightOffGround = 0.1;
            this._shadowSprite.visible = true;
        };
        Bod.prototype.hitScream = function () {
            console.log("Bod: hit scream");
            this._bodSnow.visible = false;
            this._fallAnimation.play(24, false);
        };
        Bod.prototype.hitObject = function (_object) {
            this._speed = _object.hitSpeed;
            this._speedBoostTimer = 0;
            this._heightOffGround = 0;
            this._jumpSpeed = 0;
            if (_object.isSlowdownPatch) {
                this.hitNormal();
                this._hitDelay = _object.hitDelay;
            }
            else if (_object.isLargeObject) {
                this._fallDelay = _object.hitDelay;
                this._recoveryMovementY = _object.collisionHeight * 0.5;
                this._recoveryXPoint = _object.collisionXPoint;
                this.hitScream();
                this.straightenUpAfterHit();
            }
            else {
                this._hitDelay = _object.hitDelay;
                this.hitNormal();
                this.straightenUpAfterHit();
            }
        };
        Bod.prototype.hideStarburst = function () {
        };
        Object.defineProperty(Bod.prototype, "jumpHeight", {
            get: function () {
                return this._heightOffGround;
            },
            enumerable: true,
            configurable: true
        });
        Bod.prototype.hitMe = function (_object) {
            if (_object.isGift) {
                if (!this._baseGame.isstarBurstVisible) {
                    this._speedBoostTimer = this._speedBoostTimer + TProject.GameConfig.speedBoostLength;
                    this._baseGame.showStarBurst();
                    this._woosh.anchor.set(1, 0);
                    this._woosh.play("play", 24, false);
                    console.log("henlo");
                }
            }
            else if (_object.isJumpObject) {
                if (this._angle > 180 + 32 || this._angle < 180 - 32) {
                    if (_object.xStart - this.collisionCentre.x > 25) {
                        this.hitObject(_object);
                    }
                    else {
                        this.startJump();
                    }
                }
                else {
                    this.startJump();
                }
            }
            else {
                this.hitObject(_object);
            }
        };
        Bod.prototype.nudge = function (tx, dt) {
            if (dt === void 0) { dt = 1.0 / 60.0; }
            var speedBoostValue = 0.0;
            if (this._speedBoostTimer > 30) {
                speedBoostValue = TProject.GameConfig.speedBoostAmount;
                this._speedBoostTimer = this._speedBoostTimer - 1;
            }
            else if (this._speedBoostTimer > 15) {
                speedBoostValue = TProject.GameConfig.speedBoostAmount * 0.66;
                this._speedBoostTimer = this._speedBoostTimer - 1;
            }
            else if (this._speedBoostTimer > 0) {
                speedBoostValue = TProject.GameConfig.speedBoostAmount * 0.33;
                this._speedBoostTimer = this._speedBoostTimer - 1;
            }
            if (this._turningSound1Playing && this._state == "gameover") {
                this._turningSound1Playing = false;
            }
            if (this._turningSound2Playing && this._state == "gameover") {
                this._turningSound2Playing = false;
            }
            if (this.pY < 0) {
                tx = 0;
            }
            if (this._hitDelay > 0) {
                this._hitDelay -= dt;
            }
            else if (this._fallDelay > 0) {
                this._fallDelay -= dt;
                if (this._fallDelay <= 0) {
                    this._prevFrame = 2;
                    this._bodSnow.visible = true;
                    this._sprite.scale.x = 1;
                    this._fallDelay = 0;
                    this._sprite.x = this._offset.x;
                    this._angle = 180;
                    this._sprite.loadTexture("Characters", "mc.bod_snow_" + this._characterId + "0001");
                    this._trailArray = [];
                    this.pY += Math.max(100, this._recoveryMovementY + 50);
                    console.log("test 100500");
                    if (this._recoveryXPoint != -999) {
                        this.pX = this._recoveryXPoint;
                    }
                }
            }
            else {
                if (this._skiloopPlaying == false && this._state != "gameover") {
                    this._skiloopPlaying = true;
                }
                if (tx != 0) {
                    this._rotTotal++;
                    if (this._rotTotal > 20) {
                        this._rotTotal = 20;
                    }
                    if (this._rotTotal > 3) {
                        this.spray();
                    }
                    this._rotation += (tx * this._rotSpeed) * Bod.SPEED_COEFF;
                }
                else {
                    this._rotTotal -= 3;
                    if (this._rotTotal < 0) {
                        this._rotTotal = 0;
                    }
                    this._rotation = -(this._angle - 180) / 15;
                }
                if (tx < 0 && this._rotation > 0) {
                    this._rotation = this._rotation * 0.35 * 2;
                }
                else if (tx > 0 && this._rotation < 0) {
                    this._rotation = this._rotation * 0.35 * 2;
                }
                if (this._rotation > 10) {
                    this._rotation = 10;
                }
                else if (this._rotation < -10) {
                    this._rotation = -10;
                }
                this._angle += this._rotation;
                if (this._angle > 260) {
                    this._angle = 260;
                    this._rotTotal = 0;
                }
                else if (this._angle < 100) {
                    this._angle = 100;
                    this._rotTotal = 0;
                }
                if (this._speed < TProject.GameConfig.minSpeed[this._characterId]) {
                    this._speed = TProject.GameConfig.minSpeed[this._characterId];
                }
                var turnSoundThreshold = 15;
                if (this._angle > 180 + turnSoundThreshold) {
                    if (this._turningSound1Playing == false) {
                        this._turningSound1Playing = true;
                    }
                }
                else if (this._angle < 180 - turnSoundThreshold) {
                    if (this._turningSound2Playing == false) {
                        this._turningSound2Playing = true;
                    }
                }
                else {
                    if (this._turningSound1Playing == true) {
                        this._turningSound1Playing = false;
                    }
                    if (this._turningSound2Playing == true) {
                        this._turningSound2Playing = false;
                    }
                }
                if (this._rotTotal == 0) {
                    var jumpSpeedBonus = 1.0;
                    if (this._heightOffGround > 0) {
                        jumpSpeedBonus = 1.2;
                    }
                    this._speed = Math.min(TProject.GameConfig.maxSpeed[this._characterId] * jumpSpeedBonus, this._speed + TProject.GameConfig.accelerationSpeed[this._characterId]);
                }
                else {
                    var bufferTurnAmount = 50;
                    if ((tx > 0 && this._angle > 180 + bufferTurnAmount) || (tx < 0 && this._angle < 180 - bufferTurnAmount)) {
                        this._speed = Math.max(TProject.GameConfig.minSpeed[this._characterId], this._speed - TProject.GameConfig.turnDeccelerationSpeed[this._characterId] * 0.2 * this._rotTotal);
                    }
                }
                this.setRotation();
            }
            var tAngleRads = (this._angle / 180) * Math.PI;
            var ttX = Math.sin(tAngleRads);
            var ttY = -Math.cos(tAngleRads);
            this._dirX = (this._speed + speedBoostValue) * ttX * Bod.SPEED_COEFF;
            this._dirY = (this._speed + speedBoostValue) * ttY * 0.53;
            this.pX += this._dirX;
            this.pY += this._dirY;
            if (this._jumpSpeed > 0) {
                this._heightOffGround = this._heightOffGround + this._jumpSpeed / 2;
            }
            else {
                if (this._heightOffGround > 0) {
                    this._heightOffGround = this._heightOffGround + this._jumpSpeed / 2;
                }
            }
            if (this._heightOffGround <= 0) {
                this._jumpSpeed = 0;
                this._heightOffGround = 0;
            }
            else {
                this._jumpSpeed = this._jumpSpeed - 0.3 * TProject.GameConfig.gravitySpeed / 2;
                this._jumpSpeed = this._jumpSpeed - 0.0075 * this._heightOffGround * TProject.GameConfig.gravitySpeed / 2;
            }
            this._sprite.y = this._sledgeMovieGroundPositionY - this._heightOffGround * 0.3;
            this._woosh.y = this._sprite.y - 50;
            if (this.pX > TProject.GameConfig.screenEdgeValue) {
                this._dirX -= (this.pX - TProject.GameConfig.screenEdgeValue);
                this.pX = TProject.GameConfig.screenEdgeValue;
                this._speed = 0;
            }
            else if (this.pX < -TProject.GameConfig.screenEdgeValue) {
                this._dirX -= (this.pX + TProject.GameConfig.screenEdgeValue);
                this.pX = -TProject.GameConfig.screenEdgeValue;
                this._speed = 0;
            }
            if (this.pY > (this._finishLine - 120)) {
                if (this._state != "gameover") {
                    if (this._baseGame.timerOn == true) {
                        this._baseGame.pCam.setState("gameover");
                        this._baseGame.timerOn = false;
                    }
                }
            }
            if (this.pY > this._finishLine) {
                if (this._state != "gameover" && this._dirtyFlag) {
                    this._baseGame.pCam.setState("gameover");
                    this._baseGame.gameOver();
                    this._dirtyFlag = false;
                }
            }
            this._trailArray.unshift(this._dirY);
            this._trailArray.unshift(this._dirX);
            this._trailArray.splice(300);
        };
        Bod.prototype.spray = function () {
            this._sprayNum++;
        };
        Bod.prototype.drawTrail = function () {
            var tx = 12;
            var ty = this._startTY;
            this._trails.clear();
            this._trails.lineStyle(2, 0xB0B0B0, 0.5);
            this._trails.moveTo(0, 0);
            var tmax = this._trailArray.length / 2 - 1;
            for (var i = 0; i < tmax; i++) {
                tx += this._trailArray[i * 2];
                ty += this._trailArray[i * 2 + 1];
                if (Math.abs(ty) > 0) {
                    if (i > 2) {
                        this._trails.lineTo(-tx, -ty);
                    }
                    else {
                        this._trails.moveTo(-tx, -ty);
                    }
                }
                if (ty > this._trails.y + 180 + TProject.GameConfig.screenHeight * 0.5) {
                    break;
                }
            }
            tx = -12;
            ty = this._startTY;
            this._trails.lineStyle(2, 0xB0B0B0, 0.5);
            this._trails.moveTo(tx, ty);
            tmax = (this._trailArray.length / 2) - 1;
            for (var i = 0; i < tmax; i++) {
                tx += this._trailArray[i * 2];
                ty += this._trailArray[i * 2 + 1];
                if (i > 2) {
                    this._trails.lineTo(-tx, -ty);
                }
                else {
                    this._trails.moveTo(-tx, -ty);
                }
                if (ty > this._trails.y + 180 + TProject.GameConfig.screenHeight * 0.5) {
                    break;
                }
            }
            this._trails.x = this.x;
            this._trails.y = this.y;
        };
        Bod.prototype.setPos = function (x, y) {
            this.x = this.pX - x;
            this.y = this.pY - y - 125;
            this.drawTrail();
        };
        Bod.prototype.killSounds = function () {
        };
        return Bod;
    }(Phaser.Sprite));
    Bod.SPEED_COEFF = 0.5;
    TProject.Bod = Bod;
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
    var Cam = (function (_super) {
        __extends(Cam, _super);
        function Cam(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this.x = TProject.GameConfig.screenWidth * 0.5;
            _this.y = TProject.GameConfig.screenHeight * 0.5;
            _this.resetCam();
            _this._objArr = [];
            _this._graphics = _this.game.add.graphics(0, 0);
            _this._objContainer = _this.game.add.sprite(0, 0);
            _this._debugContainer = _this.game.add.sprite(0, 0);
            _this._startBurstLayer = _this.game.add.sprite(0, 0);
            ;
            _this.addChild(_this._objContainer);
            _this.addChild(_this._debugContainer);
            _this.addChild(_this._startBurstLayer);
            _this._debugContainer.addChild(_this._graphics);
            return _this;
        }
        Object.defineProperty(Cam.prototype, "currentLevel", {
            set: function (val) {
                this._currentLevel = val;
            },
            enumerable: true,
            configurable: true
        });
        Cam.prototype.resetCam = function () {
            this.pX = 0;
            this.pY = 0;
            this._speedX = 0;
            this._speedY = 0;
            this._state = "active";
        };
        Cam.prototype.addBod = function (val) {
            this._bod = val;
            this._objContainer.addChild(this._bod);
        };
        Cam.prototype.addBackground = function (_background) {
            this._background = _background;
            this._objContainer.addChild(this._background);
        };
        Cam.prototype.addStartLine = function (_startLine) {
            this._startLine = _startLine;
            this._objContainer.addChild(this._startLine);
            console.log("FOO", this._startLine.x, this._startLine.y);
        };
        Cam.prototype.addFinishLine = function (_finishLine) {
            this._finishLine = _finishLine;
            this._objContainer.addChild(this._finishLine);
        };
        Cam.prototype.addTrails = function (_trails) {
            this._trails = _trails;
            this._objContainer.addChild(this._trails);
        };
        Cam.prototype.addStarBurst = function (_starBurst) {
            this._starBurst = _starBurst;
            this._startBurstLayer.addChild(this._starBurst);
        };
        Cam.prototype.addObj = function (tObj, tType) {
            this._objArr.push(tObj);
            this._objContainer.addChild(tObj);
        };
        Cam.prototype.setState = function (tf) {
            this._state = tf;
        };
        Cam.prototype.removeObj = function (tObj) {
            this.removeChild(tObj);
        };
        Cam.prototype.nudge = function (tx) {
            this.pY = tx;
            this.update();
        };
        Cam.prototype.destroy = function () {
            this._objArr.forEach(function (x) {
                if (x) {
                    x.parent.removeChild(x);
                    x.destroy();
                }
            });
            if (this._starBurst) {
                this._startBurstLayer.removeChild(this._starBurst);
                this._starBurst.destroy();
            }
            _super.prototype.destroy.call(this);
        };
        Cam.prototype.sortChildrenByFauxZ = function () {
            var numChildren = this._objArr.length;
            this._objArr.sort(function (a, b) {
                return a.yStart - b.yStart;
            });
            for (var i = 0; i < this._objArr.length; i++) {
                this._objContainer.setChildIndex(this._objArr[i], i + (this._objContainer.children.length - this._objArr.length));
            }
        };
        Cam.prototype.setStarBurstPos = function (speedY) {
            this._starBurst.y = this._starBurst.y - speedY;
        };
        Cam.prototype.update = function () {
            var _this = this;
            var tBodY = this._bod.pY;
            if (this._state == "gameover") {
                var tdiff = -(this.pY - TProject.GameConfig.getCourseLength(this._currentLevel) + 100) / 4;
                this._speedY = tdiff;
            }
            else {
                this._speedY = Math.floor((tBodY - this.pY) / 3);
            }
            this.pY += this._speedY;
            if (this.pY < 0) {
                this.pY = 0;
            }
            var tNum;
            var tObj;
            this._objArr.forEach(function (x) {
                x.setPos(_this.pX, _this.pY);
            });
            if (this._startLine != null) {
                this._startLine.setPos(this.pX, this.pY);
            }
            if (this._bod != null) {
                this._bod.setPos(this.pX, this.pY);
            }
            if (this._background != null) {
                this._background.setPos(this.pX, this.pY);
            }
            if (this._finishLine != null) {
                this._finishLine.setPos(this.pX, this.pY);
            }
            if (this._starBurst != null) {
                this.setStarBurstPos(this._speedY);
            }
            var tDist;
            var tempCount = 0;
            this._objArr.forEach(function (x) {
                x.checkZOrder(_this._bod);
                x.checkCollision(_this._bod);
            });
            if (TProject.GameConfig.DEBUG) {
                this._graphics.clear();
                this._graphics.beginFill(0x00ff00);
                this._graphics.drawCircle(this._bod.x, this._bod.y, TProject.GameConfig.sledgeCollisionRadius * 2);
                this._graphics.endFill();
                this._graphics.beginFill(0xff0000);
                this._objArr.forEach(function (el) {
                    _this._graphics.drawCircle(el.x, el.y, el.radius * 2);
                });
                this._graphics.endFill();
            }
        };
        return Cam;
    }(Phaser.Sprite));
    TProject.Cam = Cam;
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
    var GameObjectBase = (function (_super) {
        __extends(GameObjectBase, _super);
        function GameObjectBase(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this._isVisible = false;
            _this._radius = 0;
            _this._squareCollision = false;
            _this._squareCollisionHeight = 0;
            _this._squareCollisionWidth = 0;
            _this._largeObject = false;
            _this._gift = false;
            _this._slowdownPatch = false;
            _this._collisionHeight = 0;
            _this._isJump = false;
            _this._inFrontOfPlayer = false;
            _this._beenHit = false;
            _this._collidable = false;
            _this._xStart = x;
            _this._yStart = y;
            return _this;
        }
        Object.defineProperty(GameObjectBase.prototype, "collidable", {
            get: function () {
                return this._collidable;
            },
            set: function (val) {
                this._collidable = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObjectBase.prototype, "yStart", {
            get: function () {
                return this._yStart;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObjectBase.prototype, "isGift", {
            get: function () {
                return this._gift;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObjectBase.prototype, "isJumpObject", {
            get: function () {
                return this._isJump;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObjectBase.prototype, "hitSpeed", {
            get: function () {
                return this._hitSpeed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObjectBase.prototype, "hitDelay", {
            get: function () {
                return this._hitDelay;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObjectBase.prototype, "hasBeenHit", {
            get: function () {
                return this._beenHit;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObjectBase.prototype, "isSlowdownPatch", {
            get: function () {
                return this._slowdownPatch;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObjectBase.prototype, "isLargeObject", {
            get: function () {
                return this._largeObject;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObjectBase.prototype, "xStart", {
            get: function () {
                return this._xStart;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObjectBase.prototype, "collisionHeight", {
            get: function () {
                if (this._squareCollision) {
                    return this._graphicalObject.height;
                }
                else {
                    return this._radius * 2;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObjectBase.prototype, "collisionXPoint", {
            get: function () {
                if (this._squareCollision) {
                    if (this._graphicalObject.x + this._xStart + (this._graphicalObject.width * 0.5) < 0) {
                        return this._graphicalObject.x + this._xStart + this._graphicalObject.width + 60;
                    }
                    else {
                        return this._graphicalObject.x + this._xStart - 60;
                    }
                }
                else {
                    return -999;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObjectBase.prototype, "isCollidable", {
            get: function () {
                return this._collidable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GameObjectBase.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            enumerable: true,
            configurable: true
        });
        GameObjectBase.prototype.hitMe = function (_pBod) {
            this._beenHit = true;
            _pBod.hitMe(this);
            if (this._hitSound != null) {
            }
        };
        GameObjectBase.prototype.checkZOrder = function (_pBod) {
            if (this._collidable == true && this._gift == false && this._isVisible == true && this._inFrontOfPlayer == false) {
                var testDist = Utils.distanceSquared(this._xStart, this._yStart, _pBod.collisionCentre.x, _pBod.collisionCentre.y);
                if (testDist < TProject.GameConfig.sledgeZOrderCheckRadiusSquared) {
                    var objectIndex = this.parent.getChildIndex(this);
                    var pBodIndex = this.parent.getChildIndex(_pBod);
                    if (this._alwaysUnderPlayer) {
                        this.parent.setChildIndex(this, Math.max(2, objectIndex - 1));
                    }
                    else if (objectIndex > pBodIndex) {
                        if ((this.y < _pBod.y - 12 || (_pBod.isFallen && this.y < _pBod.y + 50))) {
                            this.parent.setChildIndex(_pBod, Math.min(this.parent.children.length - 1, objectIndex + 1));
                            this._inFrontOfPlayer = true;
                        }
                    }
                }
            }
        };
        GameObjectBase.prototype.isPointInsideRectangle = function (_xPoint, _yPoint, _rectShape) {
            var condition1 = (_xPoint > _rectShape.x && _xPoint < _rectShape.x + _rectShape.width);
            var condition2 = (_yPoint > _rectShape.y && _yPoint < _rectShape.y + _rectShape.height);
            return condition1 && condition2;
        };
        GameObjectBase.prototype.rectCollision = function (_pBod) {
            var rect1Left = _pBod.collisionCentre.x - TProject.GameConfig.sledgeCollisionRadius;
            var rect1Right = _pBod.collisionCentre.x + TProject.GameConfig.sledgeCollisionRadius;
            var rect1Top = _pBod.collisionCentre.y - TProject.GameConfig.sledgeCollisionRadius;
            var rect1Bottom = _pBod.collisionCentre.y + TProject.GameConfig.sledgeCollisionRadius;
            var rect2Left = this._graphicalObject.x + this._xStart;
            var rect2Right = this._graphicalObject.x + this._xStart + this._graphicalObject.width;
            var rect2Top = this._graphicalObject.y + this._yStart;
            var rect2Bottom = this._graphicalObject.y + this._yStart + this._graphicalObject.height;
            return !(rect2Left > rect1Right || rect2Right < rect1Left || rect2Top > rect1Bottom || rect2Bottom < rect1Top);
        };
        GameObjectBase.prototype.checkCollision = function (_pBod) {
            if (this._isVisible == true && this._collidable == true && this._beenHit == false) {
                var jumpHeight = _pBod.jumpHeight;
                if (jumpHeight * 0.1 > this._collisionHeight) {
                    return;
                }
                var testDist = Utils.distanceSquared(this._xStart, this._yStart, _pBod.collisionCentre.x, _pBod.collisionCentre.y);
                if (testDist < (TProject.GameConfig.sledgeCollisionRadius + this._radius) * (TProject.GameConfig.sledgeCollisionRadius + this._radius)) {
                    if (this._squareCollision) {
                        if (this.rectCollision(_pBod)) {
                            this.hitMe(_pBod);
                        }
                    }
                    else {
                        this.hitMe(_pBod);
                    }
                }
            }
        };
        GameObjectBase.prototype.setPos = function (_x, _y) {
            if (this._isVisible) {
                this.x = this._xStart - _x;
                this.y = this._yStart - _y;
            }
        };
        return GameObjectBase;
    }(Phaser.Sprite));
    GameObjectBase.appearYValue = 600;
    TProject.GameObjectBase = GameObjectBase;
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
    var Gift = (function (_super) {
        __extends(Gift, _super);
        function Gift(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this._radius = TProject.GameConfig.giftRadius;
            _this._gift = true;
            _this._isVisible = false;
            _this._collisionHeight = 100;
            _this.collidable = true;
            return _this;
        }
        Object.defineProperty(Gift.prototype, "basegame", {
            set: function (val) {
                this._baseGame = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gift.prototype, "mytype", {
            set: function (val) {
                if (this._type == null) {
                    this._type = val;
                    this.name = val;
                    if (this.y < TProject.GameObjectBase.appearYValue) {
                        this.createGraphics();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Gift.prototype.createGraphics = function () {
            this._sprite = this.game.add.sprite(0, 0, "GameAssets", "starMC");
            this._sprite.anchor.set(0.47, 0.86);
            this._sprite.y = 30;
            this.graphicalObject = new Phaser.Circle(0, 0, TProject.GameConfig.giftRadius * 2);
            this.addChild(this._sprite);
            this._isVisible = true;
            this._sprite.animations.add("burst", Phaser.Animation.generateFrameNames("starBurstMC_", 10001, 10047), 24, false);
        };
        Gift.prototype.hitMe = function (_pBod) {
            this._baseGame.collectGift();
            this._sprite.visible = false;
            _super.prototype.hitMe.call(this, _pBod);
        };
        Gift.prototype.setPos = function (_x, _y) {
            if (this._isVisible == true) {
                if (_y < -TProject.GameConfig.screenHeight * 0.5) {
                    this.parent.removeChild(this);
                    this._isVisible = false;
                }
            }
            else {
                if (_y > 200 && _y < TProject.GameObjectBase.appearYValue) {
                    this.createGraphics();
                }
            }
            _super.prototype.setPos.call(this, _x, _y);
        };
        Gift.prototype.destroy = function () {
            if (this._sprite != null) {
                this.removeChild(this._sprite);
                this._sprite.destroy();
            }
            _super.prototype.destroy.call(this);
        };
        return Gift;
    }(TProject.GameObjectBase));
    TProject.Gift = Gift;
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
    var Obstacle = (function (_super) {
        __extends(Obstacle, _super);
        function Obstacle(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this._beenHit = false;
            _this._alwaysUnderPlayer = false;
            _this._squareCollision = false;
            _this._squareCollisionWidth = 0;
            _this._squareCollisionHeight = 0;
            _this._obstacleType = null;
            _this.collidable = true;
            return _this;
        }
        Object.defineProperty(Obstacle.prototype, "mytype", {
            get: function () {
                return this._obstacleType;
            },
            set: function (val) {
                if (this._obstacleType == null) {
                    this._obstacleType = val;
                    this.name = val;
                    this.getInfo();
                    if (this.y < TProject.GameObjectBase.appearYValue) {
                        this.createGraphics();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Obstacle.prototype.getInfo = function () {
            this._collisionHeight = 10;
            switch (this._obstacleType) {
                case "Snowman":
                    this._radius = TProject.GameConfig.snowmanRadius;
                    this._largeObject = false;
                    this._collisionHeight = 20;
                    break;
                case "Gravelpatch":
                    this._radius = TProject.GameConfig.gravelPatchRadius;
                    this._largeObject = false;
                    this._slowdownPatch = true;
                    this._alwaysUnderPlayer = true;
                    break;
                case "Icepatch":
                    this._radius = TProject.GameConfig.icePatchRadius;
                    this._largeObject = false;
                    this._slowdownPatch = true;
                    this._alwaysUnderPlayer = true;
                    break;
                case "Tree":
                    this._radius = TProject.GameConfig.treeRadius;
                    this._largeObject = false;
                    this._hitSound = "hittree";
                    break;
                case "Grass":
                    this._radius = TProject.GameConfig.grassRadius;
                    this._largeObject = true;
                    this._hitSound = "hittree";
                    break;
                case "Rock":
                    this._radius = TProject.GameConfig.rockRadius;
                    this._largeObject = true;
                    this._hitSound = "hitrock";
                    break;
                case "Dustbin":
                    this._radius = TProject.GameConfig.dustbinRadius;
                    this._largeObject = false;
                    break;
                case "Hydrant":
                    this._radius = TProject.GameConfig.hydrantRadius;
                    this._largeObject = false;
                    break;
                case "Lampost":
                    this._radius = TProject.GameConfig.lampostRadius;
                    this._largeObject = true;
                    break;
                case "Cone":
                    this._radius = TProject.GameConfig.coneRadius;
                    this._largeObject = false;
                    break;
                case "Car":
                    this._radius = 100;
                    this._largeObject = true;
                    this._squareCollision = true;
                    this._squareCollisionWidth = 80;
                    this._squareCollisionHeight = 160;
                    break;
                case "Manhole":
                    this._radius = TProject.GameConfig.manholeRadius;
                    this._largeObject = true;
                    break;
                case "JunkCar":
                    this._radius = 100;
                    this._squareCollision = true;
                    this._largeObject = true;
                    this._squareCollisionWidth = 170;
                    this._squareCollisionHeight = 60;
                    break;
                case "Crusher":
                    this._radius = 40;
                    this._largeObject = false;
                    break;
                case "Thingy":
                    this._radius = 45;
                    this._largeObject = false;
                    break;
                case "Boxes":
                    this._radius = 45;
                    this._largeObject = false;
                    break;
                case "Rubbish":
                    this._radius = 45;
                    this._largeObject = false;
                    break;
                case "Tyres":
                    this._radius = 40;
                    this._largeObject = false;
                    break;
                case "Tyre":
                    this._radius = 40;
                    this._largeObject = false;
                    break;
                case "Fridge":
                    this._radius = 35;
                    this._largeObject = false;
                    break;
                case "Jump":
                    this._radius = 35;
                    this._isJump = true;
                    this._alwaysUnderPlayer = true;
                    break;
                default:
                    console.log("ERROR! Couldn't find obstacle type!!!");
                    this._radius = TProject.GameConfig.carRadius;
                    this._largeObject = true;
                    break;
            }
            if (this._largeObject == true) {
                this._hitDelay = 60 * 30 / 1000 + 0.6;
                this._hitSpeed = 0;
            }
            else {
                this._hitDelay = 14 * 30 / 1000;
                this._hitSpeed = 2;
            }
        };
        Obstacle.prototype.createAnimation = function (spriteName, sprite, from, end, idle) {
            var _this = this;
            if (from === void 0) { from = 10002; }
            if (end === void 0) { end = 10010; }
            if (idle === void 0) { idle = 10001; }
            var animation = sprite.animations.add("hit", Phaser.Animation.generateFrameNames(spriteName, from, end), 24, false);
            animation.onComplete.add(function () {
                _this._graphicalMovieObject.loadTexture("GameAssets", spriteName + idle);
            });
        };
        Obstacle.prototype.createGraphics = function () {
            switch (this._obstacleType) {
                case "Snowman":
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "snowmanMC_10001");
                    this._graphicalMovieObject.anchor.set(0.54, 0.66);
                    this.createAnimation("snowmanMC_", this._graphicalMovieObject);
                    break;
                case "Gravelpatch":
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "gravelpatchMC");
                    this._graphicalMovieObject.anchor.set(0.5, 0.5);
                    break;
                case "Icepatch":
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "icepatchMC");
                    this._graphicalMovieObject.anchor.set(0.5, 0.5);
                    break;
                case "Grass1":
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "grassMC_10001");
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject.anchor.set(0.5, 1);
                    this.createAnimation("grassMC_", this._graphicalMovieObject);
                    break;
                case "Tree1":
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "tree1MC_10001");
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject.anchor.set(0.53, 0.9);
                    this.createAnimation("tree1MC_", this._graphicalMovieObject);
                    break;
                case "Tree":
                    var treeType = void 0;
                    var randNum = Math.random();
                    if (randNum < 0.33) {
                        this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "tree1MC_10001");
                        this._graphicalMovieObject.anchor.set(0.53, 0.9);
                        this.createAnimation("tree1MC_", this._graphicalMovieObject);
                    }
                    else if (randNum < 0.66) {
                        this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "tree2MC_10001");
                        this._graphicalMovieObject.anchor.set(0.5, 0.91);
                        this.createAnimation("tree2MC_", this._graphicalMovieObject);
                    }
                    else {
                        this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "tree3MC_10001");
                        this._graphicalMovieObject.anchor.set(0.48, 0.96);
                        this.createAnimation("tree3MC_", this._graphicalMovieObject);
                    }
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    break;
                case "Rock":
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    randNum = Math.random();
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "rockMC_10001");
                    this._graphicalMovieObject.anchor.set(0.5, 0.61);
                    this._graphicalMovieObject.y = 20;
                    this.createAnimation("rockMC_", this._graphicalMovieObject);
                    break;
                case "Grass":
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    randNum = Math.random();
                    if (randNum < 0.5) {
                        this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "grassMC_10001");
                        this.createAnimation("grassMC_", this._graphicalMovieObject);
                    }
                    else {
                        this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "grassMC_20001");
                        this.createAnimation("grassMC_", this._graphicalMovieObject, 20002, 20010, 20001);
                    }
                    this._graphicalMovieObject.y = 16;
                    this._graphicalMovieObject.anchor.set(0.5, 1);
                    break;
                case "Hydrant":
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "hydrantMC_10001");
                    this._graphicalMovieObject.anchor.set(0.26, 0.78);
                    this.createAnimation("hydrantMC_", this._graphicalMovieObject);
                    break;
                case "Lampost":
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "lampostMC_10001");
                    this._graphicalMovieObject.anchor.set(0.41, 0.82);
                    this.createAnimation("lampostMC_", this._graphicalMovieObject);
                    break;
                case "Car":
                    this._graphicalObject = new Phaser.Rectangle(0, 0, this._squareCollisionWidth, this._squareCollisionHeight);
                    this._graphicalObject.x = this._graphicalObject.x - this._graphicalObject.width * 0.5;
                    this._graphicalObject.y = this._graphicalObject.y - this._graphicalObject.height * 0.5 - 20;
                    var tempRand = Math.random() * 6;
                    if (tempRand < 1) {
                        this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "car1MC_10001");
                        this._graphicalMovieObject.anchor.set(0.55, 0.52);
                        this.createAnimation("car1MC_", this._graphicalMovieObject);
                    }
                    else if (tempRand < 2) {
                        this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "car1MC_20001");
                        this._graphicalMovieObject.anchor.set(0.56, 0.53);
                        this.createAnimation("car1MC_", this._graphicalMovieObject, 20002, 20010, 20001);
                    }
                    else if (tempRand < 3) {
                        this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "car1MC_30001");
                        this._graphicalMovieObject.anchor.set(0.55, 0.53);
                        this.createAnimation("car1MC_", this._graphicalMovieObject, 30002, 30010, 30001);
                    }
                    else if (tempRand < 4) {
                        this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "car2MC_10001");
                        this._graphicalMovieObject.anchor.set(0.53, 0.64);
                        this.createAnimation("car2MC_", this._graphicalMovieObject);
                    }
                    else if (tempRand < 5) {
                        this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "car2MC_20001");
                        this._graphicalMovieObject.anchor.set(0.52, 0.64);
                        this.createAnimation("car2MC_", this._graphicalMovieObject, 20002, 20010, 20001);
                    }
                    else {
                        this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "car2MC_30001");
                        this._graphicalMovieObject.anchor.set(0.52, 0.64);
                        this.createAnimation("car2MC_", this._graphicalMovieObject, 30002, 30010, 30001);
                    }
                    break;
                case "GreenCarUp":
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "car1MC_20001");
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject.anchor.set(0.56, 0.53);
                    this.createAnimation("car1MC_", this._graphicalMovieObject, 20002, 20010, 20001);
                    break;
                case "GreenCarDown":
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "car2MC_30001");
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject.anchor.set(0.52, 0.64);
                    this.createAnimation("car2MC_", this._graphicalMovieObject, 30002, 30010, 30001);
                    break;
                case "Cone":
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "coneMC_10001");
                    this._graphicalMovieObject.anchor.set(0.54, 0.55);
                    this.createAnimation("coneMC_", this._graphicalMovieObject);
                    break;
                case "Dustbin":
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "dustbinMC_10001");
                    this._graphicalMovieObject.anchor.set(0.48, 0.74);
                    this.createAnimation("dustbinMC_", this._graphicalMovieObject);
                    break;
                case "Manhole":
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "manholeMC");
                    this._graphicalMovieObject.anchor.set(0.5, 0.5);
                    break;
                case "JunkCar":
                    this._graphicalObject = new Phaser.Rectangle(0, 0, this._squareCollisionWidth, this._squareCollisionHeight);
                    this._graphicalObject.x = this._graphicalObject.x - this._graphicalObject.width * 0.5;
                    this._graphicalObject.y = this._graphicalObject.y - this._graphicalObject.height * 0.5 - 20;
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "trash5MC");
                    this._graphicalMovieObject.anchor.set(0.55, 0.61);
                    break;
                case "Crusher":
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "trash4MC");
                    this._graphicalMovieObject.anchor.set(0.5, 0.5);
                    break;
                case "Thingy":
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "trash3MC_10001");
                    this._graphicalMovieObject.anchor.set(0.5, 0.48);
                    this.createAnimation("trash3MC_", this._graphicalMovieObject);
                    break;
                case "Boxes":
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "trash2MC_10001");
                    this._graphicalMovieObject.anchor.set(0.5, 0.5);
                    this.createAnimation("trash2MC_", this._graphicalMovieObject);
                    break;
                case "Rubbish":
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "trash1MC");
                    this._graphicalMovieObject.anchor.set(0.61, 0.54);
                    break;
                case "Tyres":
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "tyresMC_10001");
                    this._graphicalMovieObject.anchor.set(0.5, 0.64);
                    this.createAnimation("tyresMC_", this._graphicalMovieObject);
                    break;
                case "Tyre":
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "tyreMC_10001");
                    this._graphicalMovieObject.anchor.set(0.5, 0.43);
                    this.createAnimation("tyreMC_", this._graphicalMovieObject);
                    break;
                case "Fridge":
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "fridgeMC_10001");
                    this._graphicalMovieObject.anchor.set(0.5, 0.59);
                    this.createAnimation("fridgeMC_", this._graphicalMovieObject);
                    break;
                case "Jump":
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    tempRand = Math.random() * 3;
                    if (tempRand < 1) {
                        this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "rampMC_10001");
                    }
                    else if (tempRand < 2) {
                        this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "rampMC_20001");
                    }
                    else {
                        this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "rampMC_30001");
                    }
                    this._graphicalMovieObject.animations.add("idle", Phaser.Animation.generateFrameNames("rampMC_", (Math.floor(tempRand) + 1) * 10000 + 1, (Math.floor(tempRand) + 1) * 10000 + 11));
                    this._graphicalMovieObject.play("idle", 24, true);
                    this._graphicalMovieObject.anchor.set(0.5, 0.5);
                    break;
                default:
                    console.log("Error. Could't find graphics for type ", this._obstacleType);
                    this._graphicalObject = new Phaser.Circle(0, 0, this._radius * 2);
                    this._graphicalMovieObject = this.game.add.sprite(0, 0, "GameAssets", "car1MC_10001");
                    this._graphicalMovieObject.alpha = 0.5;
                    break;
            }
            this.addChild(this._graphicalMovieObject);
            this._isVisible = true;
        };
        Obstacle.prototype.hitMe = function (_pBod) {
            if (this._obstacleType != "Jump" && this._obstacleType != "Gravelpatch"
                && this._obstacleType != "Icepatch"
                && this._obstacleType != "JunkCar"
                && this._obstacleType != "Tyre"
                && this._obstacleType != "Tyres"
                && this._obstacleType != "Crusher"
                && this._obstacleType != "Boxes"
                && this._obstacleType != "Rubbish"
                && this._obstacleType != "Manhole") {
                this._graphicalMovieObject.play("hit", 24, false);
            }
            _super.prototype.hitMe.call(this, _pBod);
        };
        Obstacle.prototype.setPos = function (_x, _y) {
            if (this._isVisible == true) {
                if (_y < -TProject.GameConfig.screenHeight * 0.5) {
                    this.parent.removeChild(this);
                    this._isVisible = false;
                }
            }
            else {
                if (_y > 200 && _y < TProject.GameObjectBase.appearYValue) {
                    this.createGraphics();
                }
            }
            _super.prototype.setPos.call(this, _x, _y);
        };
        Obstacle.prototype.destroy = function () {
            if (this._graphicalObject != null) {
                this.removeChild(this._graphicalObject);
                this._graphicalObject = null;
            }
            _super.prototype.destroy.call(this);
        };
        return Obstacle;
    }(TProject.GameObjectBase));
    TProject.Obstacle = Obstacle;
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
    var ZFinishLine = (function (_super) {
        __extends(ZFinishLine, _super);
        function ZFinishLine(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this._sprite = _this.game.add.sprite(0, 0, "GameAssets", "finishlineMC_10001");
            _this._sprite.animations.add("play", Phaser.Animation.generateFrameNames("finishlineMC_", 10001, 10008), 24, true).play();
            _this._sprite.anchor.set(0.5, 0);
            _this._isVisible = true;
            _this.addChild(_this._sprite);
            return _this;
        }
        ZFinishLine.prototype.destroy = function () {
            this.removeChild(this._sprite);
            this._sprite.destroy();
            _super.prototype.destroy.call(this);
        };
        return ZFinishLine;
    }(TProject.GameObjectBase));
    TProject.ZFinishLine = ZFinishLine;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var GameConfig = (function () {
        function GameConfig() {
        }
        GameConfig.getObstableData = function (_level) {
            var pObstacleArray = [];
            switch (_level) {
                case 1:
                    pObstacleArray.push("GreenCarUp", -259, -278);
                    pObstacleArray.push("GreenCarDown", 273, -158);
                    pObstacleArray.push("Lampost", 338, 213, "Lampost", 338, 2, "Lampost", 338, -188, "Lampost", -345, -188, "Lampost", -345, 3, "Lampost", -355, 213);
                    pObstacleArray.push("Car", -317, 3091, "Car", -187, 3551, "Car", -310, 3460, "Car", 333, 2911, "Car", 323, 3921, "Car", -310, 1760, "Car", -317, 2271, "Car", -327, 1331, "Car", -317, 501, "Car", 343, 661, "Car", 353, 1961, "Car", 333, 1481, "Cone", -138, 5033, "Cone", -168, 4953, "Car", -177, 2891, "Car", -307, 701, "Manhole", -299, 4730, "Lampost", -335, 5503, "Jump", 33, 4858, "Icepatch", 30, 5081, "Lampost", -335, 6333, "Lampost", 305, 2353, "Car", 343, 2181, "Lampost", -305, 5003, "Car", 223, 4191, "Lampost", -315, 3323, "Lampost", -315, 2033, "Jump", 33, 6108, "Jump", 73, 4118, "Jump", 18, 3213, "Jump", 43, 2628, "Jump", 13, 1188, "Jump", 43, 488, "Dustbin", 321, 6573, "Hydrant", -232, 6779, "Dustbin", 361, 6523, "Lampost", 348, 6678, "Lampost", -305, 6653, "Dustbin", -151, 4078, "Lampost", 285, 3533, "Car", -217, 5391, "Car", -217, 5180, "Lampost", 313, 4133, "Cone", 182, 2923, "Car", 246, 5776, "Manhole", 31, 4490, "Manhole", 31, 1460, "Manhole", 111, 2400, "Icepatch", 45, 6256, "Icepatch", 25, 3366, "Dustbin", -206, 4133, "Lampost", -305, 2853, "Dustbin", -182, 3068, "Snowman", 85, 2101, "Dustbin", 188, 1708, "Dustbin", 218, 1638, "Car", -207, 1681, "Car", 293, 901, "Hydrant", -212, 609, "Lampost", 335, 493, "Car", 273, 381, "Car", -207, 411, "Gravelpatch", 11, 2851, "Dustbin", 311, 5903, "Dustbin", -292, 2518, "Dustbin", 208, 1058, "Car", -167, 6501, "Car", 296, 6366, "Car", 235, 6136, "Lampost", 271, 5408, "Car", -177, 6141, "Lampost", -282, 4528, "Car", 206, 5606, "Car", -177, 5841, "Car", -207, 5611, "Lampost", -325, 5903, "Lampost", -315, 4123, "Lampost", 298, 4498, "Car", -147, 4611, "Dustbin", 279, 5224, "Dustbin", 274, 5119, "Car", 293, 4961, "Car", 243, 4731, "Cone", -211, 4463, "Cone", -271, 4303, "Cone", 162, 4563, "Cone", -93, 4018, "Cone", 152, 4483, "Car", 163, 3951, "Cone", -88, 4113, "Lampost", -249, 3768, "Car", 283, 3251, "Lampost", 286, 3113, "Lampost", 265, 1863, "Car", -307, 3661, "Car", 208, 3746, "Car", -207, 3241, "Dustbin", 148, 1668, "Car", 223, 2711, "Dustbin", -222, 1838, "Car", -202, 2656, "Car", -192, 2316, "Car", -207, 2111, "Gravelpatch", 31, 971, "Lampost", -275, 1513, "Cone", -108, 1513, "Car", 213, 1491, "Car", 233, 1311, "Lampost", 275, 1083, "Lampost", -285, 963, "Cone", 146, 542, "Cone", -108, 1433, "Cone", -128, 1343, "Cone", -168, 1263, "Car", -227, 1141, "Car", -177, 791, "Cone", 186, 482, "Cone", 102, 5643, "Cone", 72, 5533, "Cone", 112, 5413, "Cone", -165, 4818, "Cone", -155, 4738, "Cone", -251, 4383, "Cone", 172, 4403, "Cone", -128, 4183, "Cone", 202, 4323, "Cone", 182, 2823, "Cone", 222, 3023, "Cone", 267, 2488, "Cone", 317, 2478, "Cone", 136, 612, "Dustbin", 248, 548, "Icepatch", -45, 1976, "Snowman", 180, 750, "Manhole", 152, 3160, "Lampost", -345, 333, "Hydrant", -266, 3914, "Hydrant", 324, 2744, "Hydrant", -272, 1589, "Manhole", -479, 590, "Lampost", -590, 718, "Car", -663, 507, "Hydrant", -624, 872, "Icepatch", -795, 1216, "Fridge", 878, 1651, "Tyre", 734, 1070, "Tyres", 574, 1023, "Rubbish", 613, 38, "Boxes", 830, 661, "Thingy", 615, 663, "Crusher", 803, 485, "JunkCar", 607, 438, "Grass", -604, 1324, "Rock", -742, 1572, "Tree", -848, 886, "Gravelpatch", -514, 916, "Snowman", -630, 1816, "Manhole", -514, 2575, "Dustbin", -576, 243, "Cone", -444, 158);
                    break;
                case 2:
                    pObstacleArray.push("GreenCarUp", -259, -278);
                    pObstacleArray.push("GreenCarDown", 273, -158);
                    pObstacleArray.push("Lampost", 338, 213, "Lampost", 338, 2, "Lampost", 338, -188, "Lampost", -345, -188, "Lampost", -345, 3, "Lampost", -355, 213);
                    pObstacleArray.push("Car", -307, 10651, "Dustbin", -202, 10128, "Car", -297, 10041, "Car", 253, 9220, "Icepatch", -20, 6921, "Car", -340, 6980, "Car", -387, 5581, "Jump", 23, 9328, "Jump", -37, 6268, "Jump", -67, 5128, "Jump", -27, 4148, "Jump", 53, 2878, "Jump", 63, 1758, "Jump", 93, 938, "Lampost", 355, 643, "Lampost", -375, 3313, "Car", -267, 3981, "Car", 343, 5881, "Gravelpatch", 71, 1101, "Gravelpatch", 21, 2521, "Lampost", 275, 10513, "Hydrant", 257, 8888, "Dustbin", -222, 8329, "Dustbin", -152, 8319, "Dustbin", -182, 8269, "Lampost", 620, 8238, "Car", 253, 8381, "Dustbin", -202, 7568, "Dustbin", -162, 7658, "Car", -247, 7441, "Dustbin", 228, 7328, "Dustbin", 238, 7398, "Dustbin", 188, 7258, "Car", 193, 6750, "Car", -277, 4891, "Icepatch", 10, 4341, "Gravelpatch", -179, 3761, "Dustbin", -222, 2368, "Dustbin", -222, 1868, "Car", 353, 1421, "Snowman", -95, 1371, "Lampost", 340, 1268, "Hydrant", -345, 1373, "Car", -230, 1375, "Hydrant", -235, 923, "Car", -237, 771, "Car", 283, 993, "Car", 313, 371, "Dustbin", -182, 338, "Dustbin", -152, 408, "Manhole", -9, 6450, "Cone", 62, 6043, "Dustbin", -232, 6378, "Dustbin", 218, 6358, "Dustbin", 178, 6418, "Icepatch", 256, 7921, "Lampost", 300, 10338, "Dustbin", 218, 10268, "Lampost", -305, 9173, "Snowman", 25, 10091, "Icepatch", 30, 9515, "Dustbin", 188, 8568, "Dustbin", 258, 8558, "Dustbin", 228, 8508, "Snowman", 25, 7461, "Lampost", 565, 8393, "Dustbin", -192, 7078, "Snowman", 45, 5891, "Dustbin", 138, 5798, "Dustbin", 158, 5708, "Car", 203, 5311, "Icepatch", -50, 5311, "Cone", 162, 4893, "Car", 273, 4851, "Dustbin", 208, 4728, "Dustbin", 278, 4688, "Snowman", 85, 4081, "Cone", 212, 4213, "Dustbin", -262, 4468, "Dustbin", -202, 4458, "Dustbin", -232, 4398, "Cone", 152, 4163, "Lampost", 270, 4428, "Car", 323, 4561, "Hydrant", -278, 4297, "Car", -377, 4121, "Car", -377, 3891, "Car", -380, 3692, "Cone", 22, 3953, "Cone", 42, 3883, "Cone", 152, 3653, "Car", 193, 3981, "Dustbin", 168, 3828, "Dustbin", 138, 3778, "Car", 293, 3821, "Dustbin", -222, 2958, "Dustbin", -162, 2918, "Icepatch", 45, 3057, "Car", 290, 2783, "Car", -217, 2711, "Car", -247, 2541, "Lampost", 335, 2945, "Snowman", 155, 2132, "Lampost", 285, 2574, "Car", -277, 2171, "Hydrant", 297, 2449, "Cone", -178, 1693, "Cone", 192, 1953, "Dustbin", -272, 1818, "Dustbin", -242, 2298, "Car", -290, 1556, "Manhole", 11, 1880, "Car", -267, 561, "Lampost", 305, 493, "Dustbin", 178, 10358, "Hydrant", -208, 9540, "Gravelpatch", 1, 8461, "Cone", -168, 10453, "Lampost", -295, 10463, "Lampost", 305, 9934, "Cone", -158, 10373, "Cone", -188, 10303, "Car", -297, 10251, "Cone", -218, 9983, "Cone", -248, 9903, "Cone", -268, 9823, "Cone", 232, 9702, "Car", 263, 10121, "Car", 223, 9941, "Lampost", -255, 9693, "Lampost", 295, 9644, "Lampost", 285, 9033, "Cone", 192, 9762, "Cone", 167, 8661, "Cone", 117, 8871, "Cone", 137, 8721, "Cone", 117, 8791, "Car", 303, 9411, "Car", 163, 9031, "Car", -247, 9391, "Car", -197, 9221, "Car", -177, 8970, "Lampost", -275, 8853, "Lampost", -265, 8053, "Cone", 502, 8293, "Cone", 542, 8233, "Car", -217, 8701, "Car", -247, 8501, "Lampost", -265, 8193, "Lampost", 245, 8743, "Cone", -48, 7813, "Cone", -18, 7873, "Cone", 572, 8123, "Cone", 22, 7933, "Car", 303, 8211, "Car", -277, 7711, "Cone", -68, 7743, "Car", -87, 8101, "Car", -157, 7911, "Car", 303, 7631, "Lampost", 285, 7293, "Lampost", 285, 7453, "Lampost", 255, 6613, "Car", -227, 7241, "Car", 223, 7131, "Car", 223, 6961, "Dustbin", -262, 7078, "Dustbin", -242, 7008, "Car", -237, 6561, "Car", -237, 6781, "Dustbin", -282, 6328, "Car", 273, 6471, "Gravelpatch", -9, 4791, "Cone", 112, 6083, "Cone", 162, 6123, "Dustbin", 98, 5748, "Car", -317, 5991, "Car", -337, 5811, "Lampost", 295, 5303, "Cone", 152, 4963, "Car", 273, 5121, "Lampost", -335, 5093, "Lampost", 285, 4103, "Dustbin", 198, 3528, "Dustbin", 228, 3439, "Car", -267, 3141, "Car", -227, 3311, "Car", 293, 3072, "Cone", 202, 1883, "Cone", 232, 1813, "Cone", -61, 1548, "Lampost", -302, 2008, "Dustbin", -212, 1788, "Lampost", 455, 1963, "Dustbin", 318, 1110, "Cone", -191, 1128, "Cone", 42, 653, "Cone", 32, 5973, "Lampost", 285, 1933, "Car", 293, 4281, "Cone", 172, 3593, "Dustbin", -282, 4208, "Dustbin", -322, 6258, "Lampost", 245, 6263, "Cone", -258, 5633, "Cone", -248, 5543, "Cone", -258, 5463, "Lampost", 225, 5633, "Lampost", 265, 4983, "Cone", 192, 4843, "Hydrant", -298, 5197, "Car", 183, 5511, "Car", -297, 5331, "Car", -287, 4631, "Dustbin", 228, 4658, "Lampost", -345, 4763, "Car", 283, 3243, "Lampost", -265, 3553, "Cone", 72, 3823, "Dustbin", 198, 3778, "Lampost", 295, 3454, "Lampost", -325, 4423, "Snowman", -55, 3551, "Dustbin", 258, 2659, "Lampost", -315, 2353, "Lampost", -315, 2923, "Lampost", -335, 1743, "Cone", 112, 2314, "Cone", 122, 2244, "Dustbin", -212, 2888, "Dustbin", -412, 2108, "Car", -667, 902, "Car", 220, 2322, "Car", 303, 2141, "Car", 313, 1741, "Car", -310, 1156, "Car", 343, 833, "Car", -287, 370, "Cone", -78, 463, "Cone", 22, 573, "Cone", -38, 523, "Cone", -141, 1188, "Cone", -221, 1068, "Hydrant", 297, 1588, "Cone", -138, 1643, "Cone", -51, 1468, "Cone", -231, 988, "Lampost", -355, 753, "Lampost", -467, 1358, "Lampost", -365, 533, "Fridge", 893, 2047, "Tyre", 760, 1465, "Tyres", 600, 1418, "Rubbish", 638, 433, "Boxes", 825, 1056, "Thingy", 640, 1058, "Crusher", 798, 880, "JunkCar", 553, 833, "Grass", -609, 1719, "Rock", -746, 1967, "Tree", -852, 1281, "Snowman", -635, 2211, "Manhole", -499, 970, "Dustbin", -581, 638, "Lampost", -545, 523, "Cone", -458, 563);
                    break;
                case 3:
                    pObstacleArray.push("GreenCarUp", -259, -272);
                    pObstacleArray.push("GreenCarDown", 273, -158);
                    pObstacleArray.push("Lampost", 338, 213, "Lampost", 338, 2, "Lampost", 338, -188, "Lampost", -345, -188, "Lampost", -345, 3, "Lampost", -355, 213);
                    pObstacleArray.push("Car", -380, 4380, "Car", -377, 5021, "Car", -390, 5490, "Car", 343, 3620, "Car", -350, 3490, "Car", -400, 1890, "Car", 333, 591, "Car", 390, 1440, "Car", -397, 1441, "Car", -370, 992, "Car", -277, 461, "Car", -357, 5961, "Jump", -67, 9868, "Jump", -27, 7768, "Jump", -37, 6288, "Jump", 23, 3258, "Car", 323, 351, "Car", 323, 971, "Lampost", -200, 3618, "Car", -377, 3211, "Dustbin", 148, 428, "Cone", 222, 293, "Lampost", 295, 763, "Dustbin", 158, 8898, "Dustbin", 203, 8953, "Manhole", 1, 8930, "Manhole", -89, 6440, "Cone", -168, 6163, "Cone", 87, 6558, "Dustbin", -292, 6388, "Dustbin", 148, 6408, "Dustbin", 108, 6468, "Icepatch", -35, 7946, "Lampost", -285, 10953, "Lampost", 270, 10378, "Icepatch", 35, 10546, "Dustbin", 188, 10308, "Lampost", -405, 9183, "Snowman", -15, 10111, "Dustbin", 138, 9568, "Dustbin", 238, 9558, "Dustbin", 168, 9518, "Dustbin", 138, 8978, "Icepatch", 10, 9411, "Dustbin", 188, 8548, "Dustbin", 258, 8538, "Dustbin", 228, 8488, "Snowman", 45, 7471, "Cone", 172, 7363, "Cone", -123, 7388, "Lampost", 350, 8149, "Lampost", 255, 8383, "Gravelpatch", 21, 6981, "Cone", 12, 6813, "Dustbin", -182, 7018, "Snowman", 55, 5961, "Dustbin", 168, 5778, "Dustbin", 168, 5688, "Car", 193, 5271, "Manhole", 31, 5270, "Icepatch", -20, 4981, "Cone", 62, 4833, "Car", 293, 4801, "Dustbin", 183, 4753, "Dustbin", 138, 4708, "Snowman", -15, 4111, "Cone", 122, 4323, "Dustbin", -167, 4453, "Dustbin", -142, 4398, "Dustbin", -172, 4358, "Cone", 82, 4263, "Cone", 52, 4183, "Lampost", 270, 4428, "Car", 273, 4571, "Hydrant", -238, 4297, "Car", -352, 4079, "Car", -380, 3692, "Cone", -68, 3953, "Cone", -38, 3883, "Cone", 187, 3679, "Car", 153, 3971, "Dustbin", -392, 3908, "Dustbin", -422, 3858, "Car", 283, 3812, "Cone", 267, 2879, "Dustbin", -182, 2948, "Dustbin", -122, 2908, "Icepatch", 65, 2746, "Cone", 232, 2924, "Car", 300, 2783, "Car", -197, 2671, "Car", -297, 2531, "Lampost", 325, 2944, "Snowman", -85, 2311, "Lampost", 265, 2573, "Cone", -168, 2023, "Car", -307, 2151, "Hydrant", -183, 2198, "Cone", -128, 1793, "Cone", 157, 1978, "Dustbin", -182, 1908, "Dustbin", -232, 1938, "Car", -277, 1561, "Manhole", 51, 1810, "Lampost", 295, 1353, "Car", 193, 731, "Lampost", -375, 353, "Dustbin", 168, 10398, "Hydrant", -233, 9528, "Gravelpatch", 11, 8371, "Car", -257, 10781, "Car", 193, 10871, "Car", 253, 10691, "Car", -207, 10601, "Car", 253, 10521, "Cone", -168, 10453, "Lampost", -295, 10463, "Lampost", 275, 11013, "Lampost", 255, 9953, "Cone", -158, 10373, "Cone", -188, 10303, "Car", -207, 10221, "Cone", -208, 10053, "Cone", -238, 9973, "Cone", -258, 9893, "Cone", 222, 9702, "Car", 213, 10140, "Car", 173, 9960, "Lampost", -265, 9763, "Lampost", 285, 9663, "Lampost", 225, 8843, "Cone", 182, 9762, "Cone", -118, 8683, "Cone", -168, 8893, "Cone", -148, 8743, "Cone", -168, 8813, "Car", 323, 9401, "Car", 263, 9241, "Car", 323, 9081, "Car", -347, 9401, "Car", -297, 9231, "Car", -297, 9071, "Lampost", -305, 8853, "Lampost", -325, 8053, "Cone", 172, 8353, "Cone", 182, 8283, "Car", -257, 8691, "Car", -257, 8511, "Lampost", -325, 8193, "Lampost", 235, 8683, "Cone", 242, 7843, "Cone", 232, 8073, "Cone", 162, 8202, "Cone", 202, 8143, "Car", -317, 8341, "Car", -267, 7721, "Cone", 232, 7703, "Cone", 222, 7763, "Car", 263, 7981, "Car", -287, 7901, "Car", 323, 7632, "Cone", -238, 7493, "Cone", -238, 7563, "Cone", -198, 7433, "Cone", 142, 7263, "Lampost", 235, 7293, "Lampost", 235, 7453, "Lampost", 225, 6713, "Car", -157, 7251, "Car", 223, 7131, "Car", 223, 6961, "Cone", -138, 7063, "Dustbin", -252, 7018, "Dustbin", -232, 6948, "Car", -327, 6551, "Car", -327, 6771, "Dustbin", -242, 6348, "Car", 233, 6451, "Gravelpatch", -59, 4691, "Cone", 252, 6043, "Cone", 252, 5973, "Dustbin", 218, 5738, "Car", -187, 6011, "Car", -207, 5831, "Lampost", 305, 5863, "Cone", 22, 4883, "Car", 303, 5161, "Lampost", -365, 5213, "Lampost", 245, 4093, "Dustbin", 228, 3529, "Dustbin", 238, 3439, "Car", -227, 3131, "Car", -187, 3301, "Car", 283, 3071, "Cone", 202, 1883, "Cone", 232, 1813, "Cone", 42, 1593, "Lampost", -315, 1983, "Dustbin", -222, 1868, "Lampost", 625, 2033, "Dustbin", 298, 1218, "Cone", 232, 1133, "Cone", -108, 1253, "Cone", 182, 1093, "Cone", -198, 1123, "Cone", 82, 783, "Cone", 82, 703, "Cone", 2, 6663, "Cone", -18, 6733, "Cone", 32, 6603, "Cone", -128, 6103, "Lampost", 285, 1933, "Car", 243, 4251, "Cone", 202, 3594, "Dustbin", -282, 4208, "Dustbin", -252, 6268, "Lampost", 235, 6263, "Cone", -248, 5673, "Cone", -268, 5603, "Cone", -278, 5533, "Lampost", 255, 5633, "Lampost", 255, 4983, "Cone", 102, 4783, "Hydrant", -283, 5228, "Car", 283, 5471, "Car", -237, 5381, "Car", -287, 4631, "Dustbin", 178, 4668, "Lampost", -365, 4873, "Car", 323, 3251, "Lampost", -345, 2953, "Cone", 32, 3813, "Dustbin", 188, 3769, "Lampost", 305, 3454, "Lampost", -285, 4423, "Snowman", 5, 3491, "Dustbin", 268, 2659, "Lampost", -345, 2333, "Lampost", -325, 2723, "Lampost", -315, 1763, "Cone", -198, 2773, "Cone", -128, 2543, "Cone", -108, 2433, "Dustbin", -172, 2878, "Dustbin", -1072, 2168, "Car", -927, 1021, "Car", 263, 2381, "Car", 313, 2111, "Car", 313, 1741, "Car", -297, 1201, "Car", 193, 971, "Car", -387, 621, "Cone", 112, 563, "Cone", 192, 343, "Cone", 132, 503, "Cone", -158, 1183, "Cone", -228, 1053, "Hydrant", 277, 1588, "Cone", -28, 1683, "Cone", 72, 1513, "Cone", 22, 1453, "Cone", -228, 973, "Lampost", -345, 833, "Lampost", -285, 1383, "Icepatch", 30, 1311, "Fridge", 873, 2046, "Tyre", 760, 1465, "Tyres", 600, 1418, "Rubbish", 638, 433, "Boxes", 825, 1056, "Thingy", 640, 1058, "Crusher", 798, 880, "JunkCar", 793, 703, "Grass", -609, 1719, "Rock", -746, 1967, "Tree", -852, 1281, "Snowman", -635, 2211, "Manhole", -869, 910, "Dustbin", -1151, 688, "Lampost", -1115, 573, "Cone", -1018, 603);
                    break;
                case 4:
                    pObstacleArray.push("Crusher", -258, -272);
                    pObstacleArray.push("JunkCar", 265, -174);
                    pObstacleArray.push("Tyre", -220, 4795, "Jump", -17, 4398, "Tyre", -40, 5575, "Jump", 133, 1298, "JunkCar", -298, 2523, "JunkCar", 476, 5468, "Tyres", 480, 5638, "Tyres", 300, 5698, "Thingy", 480, 4648, "Fridge", 311, 5048, "Tyre", -130, 4875, "Tyre", -320, 4715, "Tyre", -320, 4865, "JunkCar", -329, 5083, "Tyre", -360, 4065, "JunkCar", -379, 4233, "Tyre", 345, 4560, "Tyre", 370, 4355, "Tyre", 355, 4460, "JunkCar", -409, 3812, "Crusher", 351, 3540, "Tyre", 310, 3285, "Tyres", 340, 3428, "JunkCar", 411, 2892, "Tyres", -320, 2898, "Tyres", -340, 3188, "Tyre", -180, 3285, "Boxes", -347, 3606, "Fridge", 441, 1668, "Fridge", 241, 2748, "Tyres", 400, 2388, "Tyres", 220, 2198, "JunkCar", 347, 1908, "JunkCar", -328, 1183, "Tyre", -380, 1905, "Fridge", 371, 1348, "JunkCar", 402, 1183, "JunkCar", 352, 603, "Tyres", 340, 1038, "Tyres", -330, 668, "Tyres", -330, 818, "Tyre", -320, 955, "Tyres", -390, 1388, "Tyres", -340, 1598, "Tyre", -360, 1775, "JunkCar", -338, 2073, "Boxes", 43, 5786, "Tyres", -130, 5348, "Tyre", -220, 4635, "Tyre", -20, 5415, "Tyres", 390, 5328, "Tyre", 40, 5485, "Fridge", -19, 4968, "Tyre", 455, 4110, "Boxes", 183, 4226, "JunkCar", -229, 4463, "Tyres", 140, 4078, "Thingy", 430, 4258, "Tyre", 280, 4715, "Tyres", -100, 1138, "Tyre", -30, 1225, "Crusher", -189, 5210, "JunkCar", 226, 5198, "Icepatch", 30, 4546, "Thingy", 670, 4478, "JunkCar", 201, 3793, "Tyres", 250, 4878, "Tyre", -70, 4115, "Tyre", -230, 3955, "Tyre", 430, 3875, "Tyre", 110, 3925, "Tyre", -205, 3750, "Crusher", 161, 3410, "Tyres", -30, 3528, "Tyre", -220, 3855, "Tyre", 250, 3055, "Tyre", -140, 3425, "Tyre", -50, 2335, "Thingy", -200, 3118, "JunkCar", -18, 2913, "Tyres", 220, 3208, "Tyre", -230, 2675, "Tyre", -180, 2805, "Crusher", -419, 2230, "Fridge", 361, 2538, "Tyre", -150, 2225, "Tyres", 200, 2548, "Tyre", -380, 2345, "Tyre", 160, 2345, "Snowman", -115, 1701, "Tyre", -380, 3345, "Tyres", 300, 2078, "JunkCar", 187, 1748, "Thingy", -230, 1898, "Tyre", -110, 1435, "Tyre", -200, 1035, "JunkCar", -158, 603, "Tyre", 200, 475, "Tyres", 110, 868, "Icepatch", 110, 1501, "Crusher", 371, 1500, "Tyre", 789, 1095, "Fridge", -129, 2068, "Tyres", 220, 758, "Thingy", 150, 1088, "Dustbin", -506, 769, "Manhole", -479, 590, "Lampost", -590, 718, "Car", -663, 507, "Hydrant", -624, 872, "Icepatch", -795, 1216, "Fridge", 611, 1268, "Tyres", 604, 1023, "Rubbish", 643, 38, "Boxes", 830, 661, "Thingy", 645, 663, "Crusher", 803, 485, "JunkCar", 557, 438, "Grass", -604, 1324, "Rock", -742, 1572, "Tree", -848, 886, "Gravelpatch", -514, 916, "Snowman", -630, 1816, "Manhole", -514, 2575, "Dustbin", -576, 243, "Cone", -444, 158);
                    break;
                case 5:
                    pObstacleArray.push("Crusher", -258, -272);
                    pObstacleArray.push("JunkCar", 265, -174);
                    pObstacleArray.push("Tyres", 300, 8228, "Tyres", -310, 7908, "JunkCar", 401, 8033, "Jump", 143, 6798, "Jump", -17, 5758, "Jump", -117, 4688, "Jump", -27, 1708, "Tyres", -370, 6788, "Tyres", -380, 8228, "JunkCar", 371, 7853, "JunkCar", -369, 7503, "Tyres", -360, 7308, "Tyres", 390, 7528, "JunkCar", 401, 7303, "Boxes", 383, 7096, "Boxes", 403, 1486, "Boxes", 423, 3046, "Fridge", 381, 6868, "Crusher", 401, 6110, "Crusher", 351, 6690, "JunkCar", 371, 6503, "JunkCar", -339, 7053, "JunkCar", -309, 6503, "Tyres", -170, 6668, "JunkCar", -369, 6013, "Tyres", 172, 5543, "Fridge", -339, 5678, "JunkCar", 391, 5893, "Jump", 93, 3628, "Fridge", 381, 5688, "Tyres", 360, 5538, "Thingy", 380, 5358, "Tyres", 360, 5168, "Thingy", -200, 5738, "Tyre", -370, 5245, "Tyre", -370, 5135, "Tyres", 300, 4958, "JunkCar", -404, 4948, "Tyre", -450, 4795, "JunkCar", -379, 4653, "Tyres", 430, 4388, "Tyres", 90, 4798, "Tyres", -520, 3228, "Fridge", -479, 3408, "Tyre", -420, 3005, "Tyre", -410, 3825, "JunkCar", -338, 4353, "Crusher", -379, 4170, "Tyre", -310, 4015, "JunkCar", 372, 4033, "Crusher", 361, 3330, "JunkCar", -338, 3593, "JunkCar", 402, 3203, "Tyres", -400, 2808, "Crusher", 321, 2700, "Tyres", 420, 2558, "Tyre", 270, 2385, "JunkCar", 457, 2268, "Tyres", 450, 2108, "Tyres", 380, 2868, "JunkCar", -313, 2578, "JunkCar", -313, 2268, "JunkCar", 387, 1938, "Tyre", -370, 1795, "Thingy", -240, 1908, "JunkCar", -333, 1408, "Thingy", 695, 713, "Fridge", 421, 1118, "Tyre", 290, 865, "Tyres", 330, 618, "JunkCar", -308, 573, "Tyres", -280, 1148, "Tyre", -130, 1245, "JunkCar", -308, 833, "Snowman", -165, 8071, "Thingy", -20, 7888, "Fridge", 161, 7688, "Crusher", 161, 7980, "Tyre", -210, 7675, "Tyre", 225, 7460, "Tyre", -25, 6859, "Tyres", -30, 7508, "JunkCar", -79, 7153, "Crusher", 171, 6970, "Fridge", -219, 6168, "Tyre", -40, 6395, "Tyre", -160, 6805, "Tyres", -340, 6318, "Tyre", -185, 5490, "JunkCar", 241, 6343, "Gravelpatch", 163, 6011, "Snowman", -35, 5941, "Thingy", -300, 5408, "Fridge", 181, 5728, "Tyre", -185, 4480, "Tyres", -340, 5848, "Crusher", 141, 5290, "JunkCar", -144, 5158, "Icepatch", -115, 4876, "Tyre", -160, 7335, "Thingy", 20, 4518, "JunkCar", 211, 4673, "Tyres", 430, 4238, "Tyre", 120, 4285, "Tyre", -167, 4090, "Tyre", 250, 3765, "Tyre", -12, 4165, "Tyre", -205, 3750, "Crusher", 11, 3800, "Tyres", 200, 3918, "Tyre", -250, 3875, "Tyre", 230, 3435, "Tyre", -20, 3525, "Tyre", 5, 2370, "Thingy", -150, 3258, "JunkCar", -108, 3023, "Tyres", 200, 3108, "Tyre", -155, 2680, "Tyre", -230, 2835, "Crusher", 21, 2770, "Fridge", -59, 2488, "Tyre", -55, 2160, "Tyres", 190, 2638, "Tyre", 210, 2495, "Tyre", 290, 2285, "Snowman", 195, 2111, "Tyre", -90, 3405, "Tyres", -170, 2038, "JunkCar", 197, 1778, "Thingy", -360, 1598, "Tyre", 240, 1545, "Tyre", 250, 1275, "Tyre", -320, 955, "JunkCar", 182, 493, "Tyre", -220, 435, "Tyres", -170, 618, "Gravelpatch", -9, 1851, "Icepatch", 80, 1081, "Crusher", 71, 1550, "Tyre", 789, 1095, "Fridge", -139, 1558, "Tyres", 230, 758, "Thingy", -100, 908, "Dustbin", -506, 769, "Manhole", -479, 590, "Lampost", -590, 718, "Car", -663, 507, "Hydrant", -624, 872, "Icepatch", -795, 1216, "Fridge", 611, 1268, "Tyre", 340, 975, "Tyres", 604, 1023, "Rubbish", 643, 38, "Boxes", 830, 661, "Thingy", 415, 1333, "Crusher", 803, 485, "JunkCar", 557, 438, "Grass", -604, 1324, "Rock", -742, 1572, "Tree", -848, 886, "Gravelpatch", -514, 916, "Snowman", -630, 1816, "Manhole", -514, 2575, "Dustbin", -576, 243, "Cone", -444, 158);
                    break;
                case 6:
                    pObstacleArray.push("Crusher", -258, -272);
                    pObstacleArray.push("JunkCar", 265, -174);
                    pObstacleArray.push("Jump", 73, 3418, "Jump", 43, 9598, "Tyre", 280, 10775, "Fridge", -249, 10778, "JunkCar", 291, 10622, "JunkCar", -219, 10562, "Tyre", -170, 10415, "Tyre", -180, 10295, "Tyres", 390, 9558, "JunkCar", 396, 9947, "JunkCar", 326, 9807, "Tyres", -250, 9708, "JunkCar", -354, 9487, "Tyres", 350, 10178, "Tyres", -330, 9188, "Tyres", -410, 8658, "JunkCar", -414, 8978, "Jump", 173, 7448, "JunkCar", 466, 9157, "Tyres", 280, 8898, "Tyres", 380, 8798, "Thingy", -300, 8778, "JunkCar", 416, 8638, "JunkCar", 346, 8458, "Tyres", -360, 8038, "JunkCar", -354, 8348, "JunkCar", 466, 8208, "Tyres", 370, 8058, "JunkCar", 456, 7688, "JunkCar", -334, 7848, "Tyres", -370, 7578, "Tyres", 430, 7338, "JunkCar", 491, 7533, "Tyres", 410, 5688, "Tyres", -400, 5798, "Tyres", -390, 6748, "Tyres", -260, 6958, "Tyre", -310, 6535, "JunkCar", 371, 7193, "Tyres", 190, 7898, "Thingy", 330, 6818, "JunkCar", -319, 7063, "Tyres", -380, 6158, "Boxes", 373, 6596, "JunkCar", 411, 6453, "JunkCar", 366, 5918, "Tyres", 350, 6288, "Crusher", -309, 6390, "Jump", 33, 5558, "JunkCar", -344, 5458, "JunkCar", -344, 5098, "JunkCar", 436, 5448, "Thingy", 470, 5308, "Tyres", 360, 5218, "Tyres", 240, 5118, "JunkCar", 406, 4918, "Tyres", -390, 3848, "Boxes", -407, 3646, "Tyre", 540, 4005, "Tyres", 340, 4018, "Tyres", 380, 4378, "Tyre", -350, 4715, "Tyre", -370, 4555, "JunkCar", -369, 4333, "JunkCar", 371, 3603, "Tyre", 300, 2905, "Tyre", -400, 2705, "Crusher", -329, 2990, "Tyre", -150, 3085, "JunkCar", -329, 3363, "JunkCar", 371, 3283, "Tyre", 330, 3135, "JunkCar", 381, 2703, "Tyre", -410, 1135, "JunkCar", 112, 2303, "Tyres", 400, 2298, "JunkCar", -353, 1898, "Tyres", -120, 1978, "Tyres", 380, 918, "Tyres", 400, 768, "Boxes", 313, 2136, "JunkCar", 362, 593, "JunkCar", -298, 803, "Tyre", -350, 1245, "Tyre", -180, 965, "JunkCar", 367, 1358, "Thingy", -60, 10618, "Tyre", 100, 10545, "Tyre", -100, 10215, "Tyres", 90, 10418, "JunkCar", 221, 10312, "Crusher", 261, 10070, "Tyre", -70, 10045, "Tyre", 10, 10105, "Tyres", -380, 9848, "JunkCar", -194, 9977, "Tyre", 30, 9765, "Tyre", 120, 9715, "Snowman", 205, 9661, "Tyres", 250, 9348, "Tyre", 205, 9220, "JunkCar", -59, 9422, "JunkCar", -194, 9297, "Icepatch", -159, 8956, "Tyre", -40, 8725, "Tyre", -90, 8635, "Tyre", 60, 9055, "Fridge", 151, 8968, "Tyres", -230, 8176, "JunkCar", -194, 8538, "Thingy", 250, 8718, "Tyre", 50, 8335, "Tyre", 131, 8285, "Snowman", 215, 8235, "Tyre", -100, 7895, "Tyre", -140, 7805, "Thingy", -50, 8008, "Tyres", 390, 6958, "Tyre", -170, 7325, "Boxes", -137, 7696, "JunkCar", -64, 7438, "Tyre", 238, 7745, "Tyres", -265, 7243, "Tyre", 130, 7125, "Tyre", 220, 7065, "Gravelpatch", 81, 7651, "Icepatch", -14, 5791, "Tyre", 255, 6680, "Tyre", -170, 6795, "Tyre", -205, 5870, "Crusher", -219, 6690, "Tyres", 140, 5888, "JunkCar", -144, 6288, "Tyre", -15, 5380, "JunkCar", 161, 6133, "Tyre", 210, 5725, "Tyre", 140, 5995, "Thingy", -230, 6128, "Snowman", -245, 5651, "Tyres", -240, 5268, "Tyre", -80, 4635, "Tyres", 0, 4348, "Tyre", 110, 4285, "Icepatch", 90, 4026, "Boxes", 253, 3876, "Tyre", -190, 2965, "Tyre", 270, 3015, "Tyre", -10, 2365, "JunkCar", -94, 2768, "JunkCar", -359, 2403, "Tyres", -360, 1548, "Tyre", -180, 1765, "Boxes", 123, 1806, "Boxes", 3, 6546, "Tyres", -140, 5318, "Tyre", -170, 4575, "Tyre", 180, 6745, "Tyres", 250, 5608, "Tyre", -250, 5765, "Fridge", 191, 4848, "Tyre", 455, 4110, "Boxes", -637, 3876, "JunkCar", 261, 4233, "Tyres", -110, 3938, "Thingy", -250, 4488, "Tyre", 280, 4715, "Tyres", 60, 1158, "Tyre", 150, 1055, "Crusher", -289, 4890, "JunkCar", 66, 4978, "Icepatch", -750, 4436, "Thingy", 670, 4478, "JunkCar", 51, 3623, "Tyres", 310, 4598, "Tyre", -370, 4115, "Tyre", -220, 3855, "Tyre", -270, 3605, "Tyre", 360, 3735, "Tyre", -180, 3445, "Crusher", 61, 3040, "Tyres", -50, 3318, "Tyre", -260, 3725, "Tyre", -630, 2755, "Tyre", -160, 3215, "Tyre", -90, 2465, "Thingy", 260, 3458, "JunkCar", -518, 2933, "Tyre", 320, 2795, "Tyre", 500, 2855, "Crusher", -549, 2280, "Fridge", -179, 2618, "Tyre", -180, 2045, "Tyres", 240, 2548, "Tyre", -370, 2575, "Tyre", 150, 2585, "Snowman", -85, 1621, "Tyre", -320, 2825, "Tyres", 100, 1968, "JunkCar", 247, 1648, "Thingy", -370, 2148, "Tyre", -250, 1345, "Tyre", -350, 1025, "JunkCar", 32, 753, "Tyre", -190, 465, "Tyres", -130, 618, "Icepatch", 20, 1331, "Crusher", 431, 1940, "Tyre", 789, 1095, "Fridge", -89, 2158, "Tyres", -200, 1468, "Thingy", 230, 978, "Dustbin", -506, 769, "Manhole", -479, 590, "Lampost", -590, 718, "Car", -663, 507, "Hydrant", -624, 872, "Icepatch", -795, 1216, "Fridge", 611, 1268, "Tyres", 604, 1023, "Rubbish", 643, 38, "Boxes", 830, 661, "Thingy", 645, 663, "Crusher", 803, 485, "JunkCar", 557, 438, "Grass", -604, 1324, "Rock", -742, 1572, "Tree", -848, 886, "Gravelpatch", -514, 916, "Snowman", -630, 1816, "Manhole", -514, 2575, "Dustbin", -576, 243, "Cone", -444, 158);
                    break;
                case 7:
                    pObstacleArray.push("Grass1", -258, -170);
                    pObstacleArray.push("Tree1", 273, -15);
                    pObstacleArray.push("Jump", -17, 4998, "Jump", -177, 4208, "Rock", -157, 3467, "Jump", -27, 2938, "Jump", 43, 1178, "Tree", -441, 6165, "Rock", 303, 6047, "Rock", 348, 5922, "Tree", -428, 5849, "Rock", 398, 5242, "Rock", 373, 5437, "Rock", 438, 5052, "Tree", -422, 5425, "Tree", -407, 5030, "Tree", 428, 4935, "Tree", 428, 375, "Rock", -432, 4152, "Tree", -407, 4490, "Rock", 338, 4082, "Tree", 308, 4365, "Rock", -432, 3832, "Rock", 443, 3677, "Tree", 358, 3585, "Tree", -367, 3340, "Rock", -337, 3117, "Tree", -347, 2700, "Tree", 368, 2845, "Tree", 423, 2530, "Grass", 351, 2249, "Tree", 393, 2070, "Tree", 418, 1845, "Tree", -367, 2290, "Rock", -407, 1807, "Tree", -421, 1501, "Tree", 448, 1545, "Tree", 413, 1360, "Tree", 408, 1085, "Tree", 383, 910, "Tree", 388, 615, "Tree", -327, 550, "Tree", -392, 1175, "Rock", -332, 962, "Rock", -327, 857, "Rock", -223, 256, "Grass", 286, 294, "Tree", 132, 6291, "Tree", 117, 6126, "Tree", -238, 6191, "Tree", -293, 6006, "Grass", -244, 5744, "Grass", -159, 5059, "Tree", 32, 5961, "Tree", -342, 5635, "Tree", -277, 5220, "Tree", 278, 5125, "Rock", 128, 5422, "Rock", -137, 5427, "Rock", -12, 5172, "Grass", -229, 5819, "Grass", 246, 4554, "Tree", -290, 4817, "Tree", 143, 5000, "Tree", 218, 4865, "Tree", 313, 4720, "Tree", -32, 4785, "Tree", -292, 4650, "Grass", -209, 4919, "Grass", 161, 4419, "Tree", 85, 4327, "Rock", -82, 3852, "Tree", -317, 4315, "Tree", -302, 4060, "Tree", -50, 4202, "Tree", 95, 4107, "Tree", 230, 3982, "Tree", 328, 3825, "Tree", 478, 3351, "Rock", -137, 4397, "Tree", -262, 3725, "Tree", -307, 3560, "Grass", 141, 3669, "Grass", 276, 2374, "Tree", 328, 3195, "Tree", 223, 3060, "Rock", -152, 3332, "Snowman", 115, 3341, "Icepatch", -15, 3116, "Rock", 133, 2877, "Tree", -172, 3005, "Tree", -227, 2840, "Tree", 178, 2785, "Tree", 223, 2640, "Tree", -112, 2675, "Tree", -197, 2510, "Rock", -182, 2292, "Tree", 168, 2495, "Grass", 1, 3529, "Grass", 381, 2169, "Tree", 173, 1970, "Icepatch", 160, 2131, "Rock", -87, 2187, "Tree", -187, 2130, "Tree", -312, 2005, "Tree", -297, 1710, "Rock", -232, 1522, "Tree", -12, 1865, "Tree", 143, 1760, "Tree", 283, 1240, "Snowman", 275, 1581, "Rock", 63, 1367, "Grass", 151, 1119, "Grass", 266, 364, "Tree", -132, 1415, "Tree", -247, 1300, "Rock", -132, 1012, "Tree", 88, 975, "Tree", 183, 870, "Tree", 268, 755, "Tree", 233, 500, "Grass", 131, 1049, "Tree", 287, 5754, "Tree", 147, 5821, "Rock", 3, 617, "Tree", -172, 435, "Snowman", -225, 691, "Tyre", 825, 4150, "Boxes", -637, 3876, "Icepatch", -750, 4436, "Thingy", 670, 4478, "Tyre", 860, 3995, "Tyre", -1000, 2835, "JunkCar", -908, 2963, "Crusher", -549, 2280, "Tyre", -720, 2465, "Thingy", -520, 1918, "Tyre", 789, 1095, "Dustbin", -886, 759, "Manhole", -859, 580, "Lampost", -970, 708, "Car", -1042, 497, "Hydrant", -1003, 862, "Icepatch", -995, 1226, "Fridge", 611, 1268, "Tyres", 604, 1023, "Rubbish", 643, 38, "Boxes", 830, 661, "Thingy", 645, 663, "Crusher", 803, 485, "JunkCar", 827, 288, "Grass", -359, 1349, "Rock", -942, 1582, "Gravelpatch", -894, 906, "Snowman", -1065, 1831, "Manhole", -839, 2650, "Dustbin", -956, 233, "Cone", -823, 148);
                    break;
                case 8:
                    pObstacleArray.push("Grass1", -258, -170);
                    pObstacleArray.push("Tree1", 273, -15);
                    pObstacleArray.push("Jump", 13, 7238, "Jump", 13, 4658, "Jump", 3, 3908, "Rock", 3, 4097, "Jump", 93, 2478, "Tree", -428, 426, "Tree", 483, 8440, "Tree", -337, 8440, "Rock", 248, 7172, "Tree", 382, 6399, "Rock", -272, 6072, "Rock", -142, 6112, "Rock", -412, 6692, "Rock", -442, 7532, "Rock", -407, 7327, "Tree", -371, 7901, "Tree", 369, 7881, "Tree", 404, 7416, "Tree", -312, 7175, "Tree", -287, 6990, "Tree", 343, 6770, "Rock", 203, 6577, "Rock", -217, 6677, "Tree", -418, 6349, "Tree", 438, 6191, "Tree", -208, 5929, "Tree", 407, 5484, "Rock", -392, 5232, "Tree", -348, 5739, "Tree", -373, 5084, "Tree", 302, 5209, "Tree", 427, 5064, "Rock", -432, 4012, "Rock", 378, 4332, "Rock", 198, 4412, "Tree", -393, 4601, "Tree", -388, 4426, "Tree", 367, 4101, "Tree", -403, 3871, "Tree", 372, 3846, "Rock", 388, 3632, "Rock", 253, 3537, "Tree", 417, 3521, "Rock", -347, 3557, "Rock", -117, 3397, "Tree", -371, 3271, "Rock", 438, 2472, "Tree", 414, 3056, "Tree", -348, 2906, "Tree", -303, 2611, "Tree", -371, 2125, "Rock", -247, 2327, "Tree", 407, 1971, "Tree", -203, 2171, "Tree", -403, 1771, "Tree", 352, 1796, "Tree", 437, 1461, "Tree", -333, 1471, "Tree", 357, 421, "Tree", 432, 976, "Tree", -338, 996, "Tree", -308, 746, "Tree", -333, 581, "Rock", -37, 8507, "Grass", 116, 7854, "Tree", 273, 8460, "Tree", 318, 8325, "Tree", 353, 8170, "Tree", -117, 8410, "Tree", -232, 8245, "Tree", -267, 8040, "Tree", 238, 8005, "Tree", -21, 8121, "Tree", -196, 7866, "Grass", -19, 7049, "Tree", 224, 7706, "Tree", -231, 7671, "Tree", -246, 7456, "Tree", 249, 7551, "Icepatch", -10, 7401, "Tree", 194, 7386, "Rock", -202, 7262, "Tree", -81, 7191, "Tree", 303, 7080, "Tree", 268, 6925, "Grass", 156, 6794, "Rock", 33, 6967, "Tree", -92, 6925, "Rock", -207, 6777, "Grass", 131, 7759, "Grass", 21, 5979, "Rock", 228, 6412, "Tree", -272, 6555, "Tree", 13, 6650, "Tree", 68, 6535, "Tree", 83, 6410, "Tree", -172, 6415, "Tree", -197, 6260, "Rock", -387, 6147, "Grass", 51, 6709, "Grass", -69, 6019, "Tree", 88, 6275, "Tree", 227, 6224, "Rock", 288, 6022, "Rock", 313, 5887, "Tree", 347, 5814, "Tree", 92, 5919, "Tree", -33, 5814, "Tree", 292, 5669, "Rock", -147, 5657, "Tree", 167, 5564, "Grass", 91, 5439, "Grass", -144, 5084, "Tree", -203, 5554, "Tree", -213, 5374, "Tree", 142, 5299, "Rock", 118, 5122, "Rock", 163, 5017, "Grass", 111, 5359, "Grass", 156, 3904, "Tree", -198, 5209, "Tree", -202, 4905, "Tree", 247, 4954, "Tree", 302, 4819, "Tree", 317, 4674, "Tree", -237, 4770, "Tree", -152, 4625, "Tree", 302, 4534, "Rock", 18, 4822, "Rock", 403, 4197, "Tree", 137, 4279, "Tree", -73, 4471, "Tree", -168, 4326, "Tree", -273, 4191, "Tree", -188, 3996, "Tree", 142, 4046, "Grass", -159, 4969, "Grass", 161, 3799, "Rock", 208, 3732, "Rock", 103, 3637, "Tree", -103, 3831, "Tree", -228, 3736, "Rock", -412, 3432, "Tree", 147, 3531, "Tree", 252, 3416, "Tree", 317, 3301, "Tree", -86, 3266, "Tree", -171, 3111, "Tree", -156, 2946, "Tree", 342, 2896, "Rock", 193, 3057, "Grass", -29, 3069, "Grass", -9, 2829, "Rock", 318, 2712, "Rock", 313, 2607, "Tree", -171, 2791, "Icepatch", 110, 2661, "Rock", -82, 2442, "Tree", -93, 2631, "Tree", 247, 2521, "Tree", 342, 2386, "Tree", 357, 2261, "Tree", 302, 2116, "Rock", 153, 1987, "Rock", 38, 1942, "Tree", 2, 2346, "Tree", -103, 2221, "Tree", -362, 1951, "Grass", -229, 1559, "Grass", -169, 1499, "Tree", -63, 1901, "Rock", 113, 1657, "Rock", 198, 1572, "Tree", -23, 1771, "Tree", 272, 1506, "Tree", 277, 1351, "Rock", -67, 1417, "Tree", -170, 1349, "Tree", -208, 1186, "Tree", 302, 1096, "Tree", 147, 1221, "Rock", -82, 1012, "Tree", 307, 831, "Grass", -249, 369, "Grass", -149, 829, "Rock", -137, 577, "Tree", 158, 395, "Grass", -189, 449, "Grass", -139, 909, "Snowman", 215, 911, "Tree", 312, 686, "Tree", -33, 769, "Tyre", 900, 4195, "Boxes", -867, 3846, "Icepatch", -980, 4406, "Thingy", 960, 4518, "Tyre", 935, 4040, "Tyre", -1000, 2775, "JunkCar", -988, 3143, "Crusher", -919, 2300, "Tyre", -770, 2405, "Thingy", -890, 1938, "Crusher", 1071, 1940, "Tyre", 890, 1135, "Dustbin", -636, 759, "Manhole", -609, 580, "Lampost", -720, 708, "Car", -792, 497, "Hydrant", -753, 862, "Icepatch", -795, 1216, "Fridge", 711, 1308, "Tyres", 705, 1063, "Rubbish", 643, 38, "Boxes", 1158, 726, "Thingy", 973, 728, "Crusher", 1131, 550, "JunkCar", 885, 503, "Grass", -604, 1324, "Rock", -742, 1572, "Tree", 232, 546, "Gravelpatch", -514, 916, "Snowman", -555, 1521, "Manhole", -884, 2595, "Dustbin", -706, 233, "Cone", -444, 158);
                    break;
                case 9:
                    pObstacleArray.push("Grass1", -258, -170);
                    pObstacleArray.push("Tree1", 273, -15);
                    pObstacleArray.push("Jump", -17, 4958, "Jump", -167, 6728, "Rock", -372, 902, "Rock", 393, 1957, "Tree", -411, 3525, "Tree", 368, 4315, "Tree", 380, 6599, "Tree", 380, 6429, "Tree", 360, 7129, "Tree", 318, 11335, "Tree", -292, 11355, "Tree", -422, 11095, "Tree", -322, 10895, "Tree", 365, 11114, "Tree", 375, 10894, "Tree", 395, 10754, "Rock", 357, 10486, "Rock", 367, 10346, "Tree", -342, 10655, "Tree", -382, 10425, "Tree", -392, 9845, "Tree", 388, 9665, "Rock", 337, 9956, "Tree", 340, 9399, "Rock", 367, 9136, "Rock", -343, 8996, "Rock", -363, 9276, "Tree", -350, 9519, "Tree", -320, 8829, "Tree", 390, 8899, "Tree", 410, 8699, "Tree", 340, 8529, "Tree", 360, 8199, "Tree", 340, 8009, "Tree", -340, 8129, "Tree", -350, 8539, "Jump", -57, 7968, "Tree", -390, 7769, "Tree", -420, 7609, "Rock", -223, 7136, "Tree", -330, 6929, "Tree", -350, 6709, "Tree", -340, 6479, "Tree", 362, 5309, "Rock", 338, 5052, "Rock", -392, 4572, "Tree", 415, 4778, "Tree", -392, 3015, "Tree", 359, 4621, "Rock", -289, 2826, "Tree", 298, 4085, "Tree", 338, 3915, "Tree", -311, 4415, "Tree", -328, 4809, "Tree", 357, 5644, "Tree", 357, 6094, "Tree", -378, 6029, "Tree", -388, 5849, "Tree", -402, 5355, "Jump", -7, 1218, "Jump", 3, 3008, "Jump", -137, 3768, "Rock", -362, 4142, "Rock", -392, 4002, "Tree", -403, 3894, "Tree", -333, 3714, "Tree", 392, 3469, "Tree", 332, 3309, "Tree", 372, 3009, "Tree", 402, 2779, "Rock", 388, 342, "Rock", -372, 272, "Rock", 308, 632, "Rock", 383, 2307, "Tree", 377, 2181, "Tree", 387, 2601, "Tree", -332, 2665, "Tree", -353, 2474, "Rock", -377, 2227, "Tree", 337, 1841, "Rock", -242, 1662, "Tree", -443, 2021, "Tree", -413, 1841, "Tree", 377, 1661, "Tree", -313, 1491, "Tree", 377, 1411, "Tree", -383, 1181, "Tree", 387, 1221, "Tree", 377, 1061, "Tree", -363, 741, "Tree", 368, 505, "Tree", -342, 515, "Rock", -218, 11111, "Grass", 206, 11054, "Grass", 151, 11099, "Grass", 251, 359, "Grass", 196, 814, "Rock", -177, 487, "Tree", -202, 385, "Tree", -125, 10964, "Rock", 222, 10921, "Icepatch", 45, 10746, "Tree", -175, 10794, "Tree", 220, 10639, "Grass", -224, 10454, "Grass", -199, 10499, "Grass", 121, 9429, "Rock", 17, 10406, "Tree", -195, 10294, "Tree", -270, 10129, "Tree", 255, 10254, "Tree", 240, 9879, "Tree", -223, 9951, "Rock", 2, 10001, "Tree", -148, 9776, "Tree", 195, 9734, "Tree", 200, 9589, "Tree", -215, 9614, "Grass", 51, 9339, "Rock", 147, 9266, "Rock", 162, 9121, "Tree", -113, 8894, "Tree", -170, 9199, "Tree", -115, 9044, "Tree", 240, 9029, "Tree", 10, 8749, "Grass", -119, 8589, "Rock", -203, 8506, "Rock", 102, 8401, "Tree", 215, 8344, "Tree", -220, 8349, "Icepatch", -50, 8131, "Grass", -219, 7899, "Grass", 256, 7294, "Tree", 265, 7834, "Tree", 25, 7864, "Rock", -153, 7516, "Tree", 150, 7609, "Tree", 215, 7454, "Grass", -249, 7809, "Grass", -134, 6864, "Tree", -70, 7399, "Rock", -208, 7231, "Rock", -333, 7396, "Rock", 38, 7102, "Tree", 228, 6905, "Tree", 180, 7029, "Grass", 181, 7189, "Snowman", 285, 6701, "Tree", 25, 6754, "Rock", 153, 6477, "Tree", 240, 6289, "Tree", -55, 6574, "Tree", -50, 6419, "Tree", -215, 6314, "Tree", -270, 6159, "Tree", 17, 6154, "Tree", 122, 6059, "Tree", 207, 5924, "Grass", 221, 5169, "Grass", -189, 5859, "Rock", -227, 5717, "Rock", 188, 5742, "Tree", -278, 5569, "Tree", 227, 5484, "Tree", -8, 5599, "Tree", 137, 5334, "Tree", -188, 5369, "Tree", -278, 5149, "Grass", -129, 4889, "Grass", -199, 4949, "Rock", -37, 5117, "Tree", 117, 5084, "Tree", 232, 4949, "Snowman", 215, 4721, "Rock", -52, 4782, "Rock", -137, 4687, "Tree", -178, 4579, "Tree", 87, 4604, "Tree", 222, 4489, "Grass", -109, 4369, "Grass", -159, 4269, "Tree", 108, 4025, "Tree", 167, 4324, "Tree", 132, 4169, "Tree", 57, 3884, "Tree", 192, 3799, "Tree", 237, 3674, "Tree", -212, 3105, "Tree", -288, 3249, "Tree", -183, 3564, "Grass", 251, 3159, "Grass", 141, 3299, "Snowman", -155, 3351, "Rock", 3, 3187, "Tree", 202, 3099, "Tree", -123, 2974, "Rock", 138, 2932, "Grass", 231, 2859, "Grass", 251, 2799, "Grass", -219, 2319, "Grass", -129, 1609, "Tree", 12, 2729, "Tree", -143, 2634, "Tree", -68, 2469, "Tree", 227, 2471, "Rock", 203, 2047, "Tree", 62, 2306, "Tree", -103, 2231, "Tree", -208, 2146, "Grass", -154, 1514, "Rock", -412, 1612, "Tree", -53, 1911, "Tree", 62, 1816, "Tree", 197, 1711, "Tree", 212, 1566, "Grass", 151, 1899, "Grass", 211, 419, "Tree", -193, 1341, "Tree", -168, 1066, "Tree", -193, 1191, "Rock", 198, 1272, "Rock", -17, 1377, "Icepatch", 130, 1061, "Snowman", 235, 911, "Tree", -38, 966, "Tree", -103, 811, "Tree", 142, 716, "Tree", -153, 681, "Icepatch", -140, 3956, "Tyre", 805, 4260, "Boxes", -857, 3876, "Icepatch", -750, 4436, "Thingy", 670, 4478, "Tyre", 840, 4105, "Tyre", -900, 2785, "JunkCar", -788, 2963, "Crusher", -824, 2245, "Tyre", -850, 2375, "Thingy", -740, 1918, "Crusher", 821, 1970, "Tyre", 789, 1095, "Dustbin", -826, 739, "Manhole", -799, 560, "Lampost", -910, 688, "Car", -982, 477, "Hydrant", -943, 842, "Icepatch", -1100, 1231, "Fridge", 611, 1268, "Tyres", 604, 1023, "Rubbish", 643, 38, "Boxes", 1150, 691, "Thingy", 965, 693, "Crusher", 1123, 515, "JunkCar", 877, 468, "Grass", -909, 1339, "Rock", -1046, 1587, "Tree", 192, 576, "Gravelpatch", -834, 886, "Snowman", -859, 1536, "Manhole", -789, 2540, "Dustbin", -781, 308, "Cone", -648, 223);
                    break;
            }
            return pObstacleArray;
        };
        GameConfig.getGiftData = function (_level) {
            var pGiftArray = [];
            switch (_level) {
                case 1:
                    pGiftArray.push("Star", -52, 5631, "Star", 198, 3411, "Star", 19, 3061, "Star", 103, 1846, "Star", 38, 5991, "Star", 31, 5281, "Star", 76, 4311, "Star", 44, 3846, "Star", 219, 2161, "Star", 93, 1276, "Star", 38, 691, "Star", -507, 126);
                    break;
                case 2:
                    pGiftArray.push("Star", -46, 2386, "Star", 198, 1311, "Star", -27, 9831, "Star", -2, 10326, "Star", 8, 9141, "Star", -27, 8721, "Star", 113, 8221, "Star", 113, 7691, "Star", -2, 7181, "Star", -17, 6701, "Star", -92, 2101, "Star", -177, 6151, "Star", -82, 5716, "Star", -42, 5001, "Star", 3, 4577, "Star", -112, 4061, "Star", 29, 3311, "Star", 58, 2761, "Star", 138, 1571, "Star", 178, 821, "Star", 158, 471);
                    break;
                case 3:
                    pGiftArray.push("Star", -42, 9701, "Star", 28, 10816, "Star", -7, 9231, "Star", 93, 8621, "Star", -67, 8191, "Star", 33, 7211, "Star", -157, 6711, "Star", -1, 2141, "Star", 58, 6171, "Star", 48, 5586, "Star", -201, 4881, "Star", 43, 4497, "Star", -216, 3816, "Star", 48, 3101, "Star", 98, 2551, "Star", 129, 1731, "Star", 59, 1181, "Star", -51, 561);
                    break;
                case 4:
                    pGiftArray.push("Star", 183, 5416, "Star", 153, 3616, "Star", -12, 4751, "Star", -167, 4296, "Star", 8, 3161, "Star", -7, 2566, "Star", 98, 1981, "Star", -42, 791, "Star", -507, 126);
                    break;
                case 5:
                    pGiftArray.push("Star", -21, 7711, "Star", 169, 7211, "Star", 78, 6641, "Star", 53, 6186, "Star", -42, 5511, "Star", 83, 5096, "Star", 238, 4461, "Star", 58, 4051, "Star", 58, 3201, "Star", 73, 2556, "Star", 58, 2011, "Star", 43, 1346, "Star", 8, 701, "Star", -507, 126);
                    break;
                case 6:
                    pGiftArray.push("Star", -52, 10386, "Star", 123, 9941, "Star", 198, 9516, "Star", -187, 9151, "Star", 118, 8566, "Star", 143, 8051, "Star", -82, 7111, "Star", 178, 6461, "Star", -62, 6071, "Star", -122, 3751, "Star", 178, 2841, "Star", 78, 1521, "Star", 173, 5426, "Star", 123, 3276, "Star", -132, 4841, "Star", -147, 4206, "Star", 223, 2386, "Star", -42, 1991, "Star", -197, 1166, "Star", 198, 861, "Star", -507, 126);
                    break;
                case 7:
                    pGiftArray.push("Star", 208, 5221, "Star", 178, 4711, "Star", -92, 4571, "Star", -2, 3721, "Star", 268, 3321, "Star", -77, 5676, "Star", -42, 2401, "Star", 58, 1541, "Star", -142, 881, "Star", 38, 481, "Star", -861, 141, "Star", -187, 1826);
                    break;
                case 8:
                    pGiftArray.push("Star", 158, 8131, "Star", -27, 7596, "Star", -112, 6691, "Star", -22, 5431, "Star", -2, 4971, "Star", 83, 6066, "Star", -12, 4301, "Star", 48, 2971, "Star", 178, 2241, "Star", -232, 1761, "Star", -147, 3526, "Star", 98, 1351, "Star", -611, 141, "Star", 143, 706);
                    break;
                case 9:
                    pGiftArray.push("Star", 18, 10571, "Star", 178, 10001, "Star", -197, 9386, "Star", 188, 8731, "Star", -47, 8346, "Star", -202, 7681, "Star", -117, 6986, "Star", 98, 6321, "Star", 163, 5596, "Star", -32, 5301, "Star", 203, 3446, "Star", 8, 3341, "Star", 213, 2226, "Star", -232, 1851, "Star", 143, 1376, "Star", 38, 821, "Star", 218, 2641, "Star", -17, 4266, "Star", -711, 191);
                    break;
            }
            return pGiftArray;
        };
        GameConfig.getCourseLength = function (_level) {
            return GameConfig.courseLengths[_level - 1];
        };
        return GameConfig;
    }());
    GameConfig.screenWidth = 750;
    GameConfig.screenHeight = 500;
    GameConfig.DEBUG = false;
    GameConfig.screenEdgeValue = 340;
    GameConfig.turningSpeed = [0, 1.2, 1.06, 1.1];
    GameConfig.minSpeed = [0, 4, 5.5, 5];
    GameConfig.maxSpeed = [0, 13, 15, 14];
    GameConfig.accelerationSpeed = [0, 0.2, 0.17, 0.22];
    GameConfig.turnDeccelerationSpeed = [0, 0.25, 0.23, 0.23];
    GameConfig.sledgeCollisionRadius = 25;
    GameConfig.sledgeZOrderCheckRadiusSquared = 100000;
    GameConfig.numberLocations = 3;
    GameConfig.numberLevelsPerLocation = 3;
    GameConfig.numberCharacters = 3;
    GameConfig.numFramesPerSecond = 30;
    GameConfig.speedBoostLength = 40;
    GameConfig.speedBoostAmount = 3.5;
    GameConfig.jumpAmount = 2.1;
    GameConfig.gravitySpeed = 0.95;
    GameConfig.giftRadius = 20;
    GameConfig.levelMedalTimes = [17, 19, 21, 24, 28, 31, 15, 18, 20, 23, 33, 37, 16, 18, 23, 26, 34, 38];
    GameConfig.courseLengths = [6700, 10760, 11250, 6300, 8400, 11050, 6500, 9000, 11400];
    GameConfig.snowmanRadius = 30;
    GameConfig.gravelPatchRadius = 30;
    GameConfig.icePatchRadius = 60;
    GameConfig.treeRadius = 20;
    GameConfig.grassRadius = 20;
    GameConfig.rockRadius = 40;
    GameConfig.hydrantRadius = 20;
    GameConfig.carRadius = 100;
    GameConfig.coneRadius = 30;
    GameConfig.dustbinRadius = 20;
    GameConfig.lampostRadius = 20;
    GameConfig.manholeRadius = 30;
    GameConfig.currentLevel = 1;
    GameConfig.currentLocation = 1;
    TProject.GameConfig = GameConfig;
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
    var Timeout = (function () {
        function Timeout(cb, delay, index) {
            this.cb = cb;
            this.delay = delay;
            this.index = index;
        }
        return Timeout;
    }());
    var AbstractGame = (function (_super) {
        __extends(AbstractGame, _super);
        function AbstractGame() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._mouseModule = 40;
            return _this;
        }
        AbstractGame.prototype.create = function () {
            var _this = this;
            this.isPaused = false;
            this._debugMode = false;
            if (this.game.device.desktop) {
                this.game.input.keyboard.onDownCallback = this.onKeyDown;
                this.game.input.keyboard.onUpCallback = this.onKeyUp;
                this.game.onBlur.add(this.clearKeyBoard, this);
            }
            else {
                this._downMouse = false;
                this.game.input.onDown.add(function (e) {
                    _this._downMouse = true;
                    _this._mx = e.x;
                    _this._my = e.y;
                });
                this.game.input.onUp.add(function (e) {
                    if (_this._downMouse == false) {
                        return;
                    }
                    _this._downMouse = false;
                    _this._mx -= e.x;
                    _this._my -= e.y;
                    _this._mx = Math.floor((_this._mx / _this._mouseModule));
                    _this._my = Math.floor((_this._my / _this._mouseModule));
                    if (_this._mx == 0 && _this._my == 0) {
                        return;
                    }
                    if (Math.abs(_this._mx) >= Math.abs(_this._my)) {
                        _this._mx < 0 ? _this.RightSwipe() : _this.LeftSwipe();
                    }
                    else {
                        _this._my < 0 ? _this.UpSwipe() : _this.TopSwipe();
                    }
                });
            }
        };
        AbstractGame.prototype.setTimeout = function (cb, delay) {
            if (this._timeouts == null) {
                this._timeouts = [];
            }
            this._timeouts.push(new Timeout(cb, delay, this._timeouts.length));
            return this._timeouts.length - 1;
        };
        AbstractGame.prototype.setPause = function (value) {
            this.isPaused = value;
            if (dragonBones.PhaserFactory.DBLooping == value) {
                if (value) {
                    dragonBones.PhaserFactory.stopLoop();
                }
                else {
                    dragonBones.PhaserFactory.startLoop();
                }
            }
        };
        AbstractGame.prototype.LeftSwipe = function () {
        };
        AbstractGame.prototype.RightSwipe = function () {
        };
        AbstractGame.prototype.TopSwipe = function () {
        };
        AbstractGame.prototype.UpSwipe = function () {
        };
        AbstractGame.prototype.clearKeyBoard = function () {
            for (var key in AbstractGame.keysDown) {
                AbstractGame.keysDown[key] = false;
                AbstractGame.keysPressed[key] = false;
            }
        };
        AbstractGame.prototype.clearTimeouts = function (index) {
            if (index === void 0) { index = -1; }
            if (index != -1) {
                var i = void 0;
                for (i = 0; i < this._timeouts.length; i++) {
                    if (this._timeouts[i].index == index) {
                        break;
                    }
                }
                this._timeouts.splice(i, 1);
                return;
            }
            while (this._timeouts && this._timeouts.length) {
                this._timeouts.pop().cb = null;
            }
            this._timeouts = null;
        };
        AbstractGame.prototype.update = function () {
            var dt = this.game.time.elapsedMS;
            if (dt > 20)
                dt = 20;
            var i = 0;
            while (this._timeouts && i < this._timeouts.length) {
                this._timeouts[i].delay -= dt;
                if (this._timeouts[i].delay <= 0) {
                    this._timeouts[i].cb();
                    this._timeouts[i].cb = null;
                    this._timeouts.splice(i, 1);
                    continue;
                }
                i++;
            }
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
                this.game.input.onDown.removeAll();
                this.game.input.onUp.removeAll();
                this._downMouse = false;
            }
            this.clearTimeouts();
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
        Phaser.Keyboard.D,
        Phaser.Keyboard.SPACEBAR
    ];
    AbstractGame.keysPressed = {};
    AbstractGame.keysDown = {};
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

var TProject;
(function (TProject) {
    var SaveManager = (function () {
        function SaveManager() {
            this._saveDataName = "~NoName~";
            if (SaveManager._instance != null) {
                throw "Попытка создать дубликат SaveManager!";
            }
            SaveManager._instance = this;
        }
        Object.defineProperty(SaveManager, "getInstance", {
            get: function () {
                if (SaveManager._instance == null) {
                    new SaveManager();
                }
                return SaveManager._instance;
            },
            enumerable: true,
            configurable: true
        });
        SaveManager.prototype.init = function (name, saveData) {
            this._saveDataName = name;
            this._saveData = saveData;
        };
        SaveManager.prototype.save = function () {
            if (!SaveManager._canSave) {
                return false;
            }
            localStorage.setItem(this._saveDataName, JSON.stringify(this._saveData));
            return true;
        };
        SaveManager.prototype.load = function () {
            SaveManager._canSave = false;
            if (!this.isLocalStorageNameSupported()) {
                this._saveData.reset();
                return;
            }
            SaveManager._canSave = true;
            var varSaveData = JSON.parse(localStorage.getItem(this._saveDataName));
            if (varSaveData == null) {
                this.save();
                return this._saveData;
            }
            this._saveData = varSaveData;
            return this._saveData;
        };
        SaveManager.prototype.isLocalStorageNameSupported = function () {
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
        return SaveManager;
    }());
    TProject.SaveManager = SaveManager;
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
            PhaserFactory._clockID = -1;
        };
        Object.defineProperty(PhaserFactory, "DBLooping", {
            get: function () {
                return PhaserFactory._clockID != -1;
            },
            enumerable: true,
            configurable: true
        });
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
            var _this = _super.call(this) || this;
            _this._renderDisplayX = 0;
            _this._renderDisplayY = 0;
            return _this;
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
            this._renderDisplayX = this.armature.getBone(this.name).origin.x * 0.0;
            this._renderDisplayY = this.armature.getBone(this.name).origin.y * 0.0;
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
                else {
                    this.updateGlobalTransform();
                    this._renderDisplay.position.x = this._renderDisplayX + this.globalTransformMatrix.tx -
                        (this.globalTransformMatrix.a * this._pivotX + this.globalTransformMatrix.c * this._pivotY);
                    this._renderDisplay.position.y = this._renderDisplayY + this.globalTransformMatrix.ty -
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

var TProject;
(function (TProject) {
    var SaveData = (function () {
        function SaveData() {
        }
        return SaveData;
    }());
    TProject.SaveData = SaveData;
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
        function DBSprite(data, name, game) {
            var _this = _super.call(this) || this;
            _this._eventsBounds = null;
            if (data instanceof dragonBones.PhaserFactory) {
                game ? game.world.add(_this) : "";
                _this._visual = data.buildArmatureDisplay(name);
                _this.addChild(_this._visual);
            }
            else {
                _this._visual = data;
            }
            _this._pausedTime = -1;
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
        DBSprite.prototype._play = function (name, playTimes) {
            if (name == this._currentLabel && this._playTimes == 0 && this._visual.animation.isPlaying) {
                return;
            }
            this._currentLabel = name;
            this._pausedTime = -1;
            this._currentAnimState = this._visual.animation.play(name, playTimes);
            this._playTimes = this._currentAnimState.playTimes;
            return this._currentAnimState;
        };
        DBSprite.prototype.playEx = function (name, nextState, complete, context) {
            this._nextState = nextState;
            this._cb = complete;
            this._cbContext = context ? context : this;
            this._play(name);
            if (nextState || complete) {
                this.addEvent(this._playTimes == 1 ? "complete" : "loopComplete", this.completePlaying);
            }
            return this._currentAnimState;
        };
        DBSprite.prototype.play = function (name, a, b, c) {
            if (typeof a === "string") {
                return this.playEx(name, a, b, c);
            }
            else if (typeof a === "function") {
                return this.playEx(name, null, a, b);
            }
            else {
                return this._play(name);
            }
        };
        DBSprite.prototype.stop = function () {
            this._visual.animation.stop();
        };
        DBSprite.prototype.pause = function () {
            if (this._currentAnimState == null) {
                this._visual.animation.stop();
            }
            this._pausedTime = this._currentAnimState.currentTime;
            this._visual.animation.stop(this._currentLabel);
        };
        DBSprite.prototype.resume = function () {
            if (this._pausedTime == -1) {
                return;
            }
            this._pausedTime = -1;
            this._visual.animation.gotoAndPlayByTime(this._currentLabel, this._pausedTime);
        };
        DBSprite.prototype.completePlaying = function (e) {
            this.removeEvent("complete", this.completePlaying);
            this.removeEvent("loopComplete", this.completePlaying);
            e.label = this.currentLabel;
            if (typeof this._cb === "function") {
                this._cb.bind(this._cbContext)(e);
            }
            if (this._nextState) {
                this.playEx(this._nextState, null, this._cb, this._cbContext);
            }
            else {
                this._cb = null;
            }
        };
        DBSprite.prototype.getBone = function (name) {
            var slot = this._visual.armature.getSlot(name);
            if (slot.childArmature) {
                return slot.childArmature.display;
            }
            return slot.display;
        };
        DBSprite.prototype.getBoneArmature = function (name) {
            return this._visual.armature.getSlot(name).childArmature;
        };
        DBSprite.prototype.getSlot = function (name, nonChildArmature) {
            if (nonChildArmature === void 0) { nonChildArmature = false; }
            var slot = this._visual.armature.getSlot(name);
            if (slot == null) {
                return null;
            }
            if (!nonChildArmature && slot.childArmature == null) {
                return null;
            }
            return slot.childArmature ? slot.childArmature.animation : slot.armature.animation;
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
    var OButton = (function (_super) {
        __extends(OButton, _super);
        function OButton(game, key, frame, cb, invert) {
            if (cb === void 0) { cb = null; }
            if (invert === void 0) { invert = false; }
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
            _this.soundDown = null;
            _this.anchor.setTo(0.5);
            _this._cb = cb;
            _this._deltaScale = 0.1;
            _this._defaultScale = 1.0;
            _this._isDown = false;
            _this._isOver = false;
            _this._invert = invert;
            if (_this._invert) {
                _this.scale.set(-_this._defaultScale, _this._defaultScale);
            }
            else {
                _this.scale.set(_this._defaultScale);
            }
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
            this._isOver = true;
        };
        OButton.prototype.out = function () {
            if (!this._isDown) {
                if (this._invert) {
                    this.scale.set(-this._defaultScale, this._defaultScale);
                }
                else {
                    this.scale.set(this._defaultScale);
                }
            }
            this._isOver = false;
        };
        OButton.prototype.up = function () {
            var _this = this;
            if (!this._isDown) {
                return;
            }
            if (this._invert) {
                this.scale.set(-this._defaultScale, this._defaultScale);
            }
            else {
                this.scale.set(this._defaultScale);
            }
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
                if (this._cntxt)
                    this._cb.bind(this._cntxt)();
                else
                    this._cb();
                this.frameName = this._framesString[0];
            }
            else {
                if (tap == false) {
                    if (this._invert) {
                        this.scale.set(-this._defaultScale, this._defaultScale);
                    }
                    else {
                        this.scale.set(this._defaultScale);
                    }
                }
            }
        };
        OButton.prototype.down = function () {
            if (this._isDown) {
                return;
            }
            if (this._invert) {
                this.scale.set(-(this._defaultScale - this._deltaScale), this._defaultScale - this._deltaScale);
            }
            else {
                this.scale.set(this._defaultScale - this._deltaScale);
            }
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
                this.inputEnabled = value;
                if (!value) {
                    this.frameName = this._framesString[0];
                    if (this._invert) {
                        this.scale.set(-this._defaultScale, this._defaultScale);
                    }
                    else {
                        this.scale.set(this._defaultScale);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        return OButton;
    }(Phaser.Button));
    TProject.OButton = OButton;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var SoundMixer = (function () {
        function SoundMixer() {
        }
        return SoundMixer;
    }());
    TProject.SoundMixer = SoundMixer;
})(TProject || (TProject = {}));

var Utils;
(function (Utils) {
    function randomRange(min, max) {
        return min + Math.random() * (max - min);
    }
    Utils.randomRange = randomRange;
    function distanceSquared(_x1, _y1, x2, y2) {
        return ((_x1 - x2) * (_x1 - x2) + (_y1 - y2) * (_y1 - y2));
    }
    Utils.distanceSquared = distanceSquared;
})(Utils || (Utils = {}));

var TProject;
(function (TProject) {
    var LocalConfig = (function () {
        function LocalConfig() {
        }
        return LocalConfig;
    }());
    LocalConfig.CURRENT_STATE = "BaseGame";
    TProject.LocalConfig = LocalConfig;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var Main = (function () {
        function Main() {
            this.game = new Phaser.Game(TProject.GameConfig.screenWidth, TProject.GameConfig.screenHeight, Phaser.AUTO, "game_container", null, false);
            this.game.state.add("Boot", TProject.Boot, true);
            this.game.state.add("Preloader", TProject.Preloader);
            this.game.state.add("FinishScreen", TProject.FinishScreen);
            this.game.state.add("BaseGame", TProject.BaseGame);
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
    var BaseGame = (function (_super) {
        __extends(BaseGame, _super);
        function BaseGame() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BaseGame.prototype.create = function () {
            _super.prototype.create.call(this);
            console.log("Start Game");
            this._stepsCounter = 0;
            this.setDebugMode();
            this.setGameData(1, 1, 1);
        };
        BaseGame.prototype.myinit = function () {
            _super.prototype.init.call(this);
            var currentLevel = this.getCurrentLevel();
            this._obstacleArray = TProject.GameConfig.getObstableData(currentLevel);
            this._giftArray = TProject.GameConfig.getGiftData(currentLevel);
            this._cam = new TProject.Cam(this.game, 0, 0);
            this.world.addChild(this._cam);
            this._cam.currentLevel = currentLevel;
            this.initStuff();
            this.setCourse();
            this.isPaused = false;
            this._startTimer = 0;
            this._timer = 0;
            this._secs = 0;
            this._gameStarted = false;
            this._timerOn = false;
            this._numberItems = 0;
        };
        BaseGame.prototype.setGameData = function (characterId, currentLevel, currentLocation) {
            var _this = this;
            this._characterSelcted = characterId;
            this._currentLocation = currentLocation;
            this._level = currentLevel;
            this.myinit();
            if (TProject.GameConfig.DEBUG) {
                this._startTimer = 60;
                this._gameStarted = true;
            }
            else {
                this._starsCountPlank = this.game.add.sprite(196, -154, "GUI_Test", "mc.items_panel");
                this.world.addChild(this._starsCountPlank);
                this._timeCountPlank = this.game.add.sprite(402, -154, "GUI_Test", "mc.time_panel");
                this.world.addChild(this._timeCountPlank);
                this._lightPlank = this.game.add.sprite(196, -250, "GUI_Test", "ligths_export_10001");
                this.world.addChild(this._lightPlank);
                this._currentStarsText = this.game.add.text(76, 79, this._numberItems.toString(), {
                    fontSize: "20px",
                    fontWeight: "normal",
                    fill: "#ffffff",
                    align: "left",
                    stroke: '#eb991d',
                    strokeThickness: 2
                });
                this._currentStarsText.anchor.set(0, 0.5);
                this._starsCountPlank.addChild(this._currentStarsText);
                this._currentTimeText = this.game.add.text(59, 78, "00:00", {
                    fontSize: "20px",
                    fontWeight: "normal",
                    fill: "#ffffff",
                    align: "left",
                    stroke: '#eb991d',
                    strokeThickness: 2
                });
                this._currentTimeText.anchor.set(0, 0.5);
                this._timeCountPlank.addChild(this._currentTimeText);
                this._soundBtnOn = new TProject.OButton(this.game, "GUI_Test", ["mc.btn_sound_10001", "mc.btn_sound_10002", "mc.btn_sound_10002"], function () {
                    _this._soundBtnOff.visible = true;
                    _this._soundBtnOff.enabled = true;
                    _this._soundBtnOn.visible = false;
                    _this._soundBtnOn.enabled = false;
                    console.log("SndOnDown");
                });
                this._soundBtnOn.position.set(718, 31);
                this.world.addChild(this._soundBtnOn);
                this._soundBtnOff = new TProject.OButton(this.game, "GUI_Test", ["mc.btn_sound_10003", "mc.btn_sound_10004", "mc.btn_sound_10004"], function () {
                    _this._soundBtnOff.visible = false;
                    _this._soundBtnOff.enabled = false;
                    _this._soundBtnOn.visible = true;
                    _this._soundBtnOn.enabled = true;
                    console.log("SndOffDown");
                });
                this._soundBtnOff.position.set(718, 31);
                this._soundBtnOff.visible = false;
                this._soundBtnOff.enabled = false;
                this.world.addChild(this._soundBtnOff);
                this._exitBtn = new TProject.OButton(this.game, "GUI_Test", ["mc.btn_exit_10001", "mc.btn_exit_10002", "mc.btn_exit_10002"], function () {
                    console.log("EXIT!");
                });
                this._exitBtn.position.set(35, 31);
                this.world.addChild(this._exitBtn);
                this._testBigFoot = new TProject.DBSprite(TProject.Boot.TEST_BIGFOOT, "mc/all levels/Hector movie 01 with shake", this.game);
                this._testBigFoot.setPos(385.0 - 10, 170.0);
                this._testBigFoot.play("idle", function () {
                    _this.game.add.tween(_this._timeCountPlank).to({ y: -57 }, 1200, Phaser.Easing.Elastic.InOut, true);
                    _this.game.add.tween(_this._starsCountPlank).to({ y: -57 }, 1200, Phaser.Easing.Elastic.InOut, true, 500);
                    _this.game.add.tween(_this._lightPlank).to({ y: -87 }, 600, Phaser.Easing.Sinusoidal.InOut, true, 1500).onComplete.addOnce(function () {
                        _this.setTimeout(function () {
                            _this._lightPlank.frameName = "ligths_export_10002";
                            _this.setTimeout(function () {
                                _this._lightPlank.frameName = "ligths_export_10003";
                                _this.setTimeout(function () {
                                    _this._lightPlank.frameName = "ligths_export_10004";
                                    _this.setTimeout(function () {
                                        _this._lightPlank.frameName = "ligths_export_10005";
                                        _this.game.add.tween(_this._lightPlank).to({ y: -250 }, 600, Phaser.Easing.Sinusoidal.InOut, true, 800);
                                        _this._gameStarted = true;
                                        _this._timerOn = true;
                                    }, 800);
                                }, 800);
                            }, 800);
                        }, 800);
                    }, _this);
                });
                this.world.addChild(this._testBigFoot);
            }
        };
        BaseGame.prototype.setDragToObject = function (sprite) {
            sprite.inputEnabled = true;
            sprite.input.enableDrag();
            sprite.events.onDragStop.add(this.onDragStop, this);
        };
        BaseGame.prototype.onDragStop = function (sprite) {
            console.log(sprite.x + ", " + sprite.y + ",");
        };
        BaseGame.prototype.initStuff = function () {
            var _this = this;
            if (!TProject.GameConfig.DEBUG) {
                var background = new TProject.Background(this.game, 0, 0);
                background.movieClipId = this._currentLocation;
                this._cam.addBackground(background);
            }
            this._trails = this.game.add.graphics(0, 0);
            this._cam.addTrails(this._trails);
            this._bod = new TProject.Bod(this.game, 0, 0);
            this._bod.baseGame = this;
            this._bod.currentLevel = this.getCurrentLevel();
            this._bod.initStuff(this._characterSelcted);
            this._cam.addBod(this._bod);
            this._startLine = new TProject.ZFinishLine(this.game, 0, -120);
            this._cam.addStartLine(this._startLine);
            this._finishLine = new TProject.ZFinishLine(this.game, 0, TProject.GameConfig.getCourseLength(this.getCurrentLevel()) - 100);
            this._cam.addFinishLine(this._finishLine);
            this._starBurst = this.game.add.sprite(0, 0, "GameAssets", "starBurstMC_10001");
            this._starBurst.scale.set(0.5, 0.5);
            this._starBurst.anchor.set(0.5);
            var animation = this._starBurst.animations.add("show", Phaser.Animation.generateFrameNames("starBurstMC_", 10001, 10047), 120, false);
            animation.onComplete.add(function () {
                _this._starBurst.visible = false;
            });
            this._starBurst.visible = false;
            this._cam.addStarBurst(this._starBurst);
        };
        Object.defineProperty(BaseGame.prototype, "trails", {
            get: function () {
                return this._trails;
            },
            enumerable: true,
            configurable: true
        });
        BaseGame.prototype.setCourse = function () {
            this.setObstacles();
            this.setGifts();
            this._cam.sortChildrenByFauxZ();
        };
        BaseGame.prototype.setObstacles = function () {
            var pCX = 0;
            var pCY = 0;
            var tX;
            var tY;
            var tType;
            var pObstacle;
            var i = 0;
            var tObstacleArray = this._obstacleArray.slice();
            do {
                i++;
                tType = tObstacleArray.shift();
                tX = tObstacleArray.shift();
                tY = tObstacleArray.shift();
                pCX = tX;
                pCY = tY;
                pObstacle = new TProject.Obstacle(this.game, pCX, pCY);
                pObstacle.mytype = tType;
                this._cam.addObj(pObstacle, tType);
            } while (tObstacleArray.length > 0);
            pObstacle = null;
        };
        BaseGame.prototype.setGifts = function () {
            var pCX = 0;
            var pCY = 0;
            var tX;
            var tY;
            var tType;
            var pGift;
            var i = 0;
            var tGiftArray = this._giftArray.slice();
            do {
                i++;
                tType = tGiftArray.shift();
                tX = tGiftArray.shift();
                tY = tGiftArray.shift();
                pCX = tX;
                pCY = tY;
                pGift = new TProject.Gift(this.game, pCX, pCY);
                pGift.basegame = this;
                pGift.mytype = tType;
                this._cam.addObj(pGift, "gift");
            } while (tGiftArray.length > 0);
            pGift = null;
        };
        BaseGame.prototype.getCurrentLevel = function () {
            return (TProject.GameConfig.numberLevelsPerLocation * (this._currentLocation - 1) + this._level);
        };
        BaseGame.prototype.collectGift = function () {
            this._numberItems = this._numberItems + 1;
            this.updateItemsText();
        };
        BaseGame.prototype.updateItemsText = function () {
            this._currentStarsText.text = this._numberItems.toString();
        };
        BaseGame.prototype.update = function () {
            var dt = this.game.time.elapsedMS / 1000;
            if (dt > 0.20) {
                dt = 0.2;
            }
            _super.prototype.update.call(this);
            if (!this._gameStarted)
                return;
            if (this._startTimer > 0) {
                this._startTimer--;
                switch (this._startTimer) {
                    case 45:
                        break;
                    case 30:
                        break;
                    case 15:
                        break;
                    case 0:
                        this._timerOn = true;
                        break;
                }
            }
            if (this._startTimer < 40) {
                if (this.isPaused) {
                    return;
                }
                var tempValue = 0;
                if (TProject.AbstractGame.keysDown[Phaser.Keyboard.LEFT]) {
                    tempValue = TProject.GameConfig.turningSpeed[this._characterSelcted];
                }
                else if (TProject.AbstractGame.keysDown[Phaser.Keyboard.RIGHT]) {
                    tempValue = -TProject.GameConfig.turningSpeed[this._characterSelcted];
                }
                if (this._bod.jumpHeight > 0) {
                    tempValue = tempValue * 0.04;
                }
                this._bod.nudge(tempValue / 2, dt);
                if (this._timerOn) {
                    this._timer += dt;
                    var timeString = this.convertTime();
                    var secString = this._secs.toString();
                    if (this._secs < 10) {
                        timeString = timeString.slice(0, 4);
                        secString = "0" + secString;
                        timeString = "0" + timeString;
                    }
                    else {
                        timeString = timeString.slice(0, 5);
                    }
                    timeString = timeString.replace(".", ":");
                    this._currentTimeText.text = timeString;
                }
            }
        };
        Object.defineProperty(BaseGame.prototype, "isstarBurstVisible", {
            get: function () {
                return this._starBurst.visible;
            },
            enumerable: true,
            configurable: true
        });
        BaseGame.prototype.showStarBurst = function () {
            this._starBurst.x = this._bod.x;
            this._starBurst.y = this._bod.y;
            this._starBurst.visible = true;
            this._starBurst.play("show");
            console.log("!!!!!START!");
        };
        Object.defineProperty(BaseGame.prototype, "timerOn", {
            get: function () {
                return this._timerOn;
            },
            set: function (val) {
                this._timerOn = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseGame.prototype, "pCam", {
            get: function () {
                return this._cam;
            },
            enumerable: true,
            configurable: true
        });
        BaseGame.prototype.gameOver = function () {
            var _this = this;
            console.log("game over");
            this.setTimeout(function () {
                _this.createLevelEndPopup();
            }, 2000);
        };
        BaseGame.prototype.createLevelEndPopup = function () {
            this._gameStarted = false;
            var levelIndex = this.getCurrentLevel();
            var goldTime = TProject.GameConfig.levelMedalTimes[(levelIndex - 1) * 2];
            var silverTime = TProject.GameConfig.levelMedalTimes[(levelIndex - 1) * 2 + 1];
            var position;
            var medal;
            if (this._secs < goldTime) {
                position = 1;
                medal = 3;
            }
            else if (this._secs < silverTime) {
                position = 2;
                medal = 2;
            }
            else {
                position = 3;
                medal = 1;
            }
            console.log("GAME OVER! medal = " + medal + ", sec: " + this._secs);
            this.game.state.start("FinishScreen");
        };
        BaseGame.prototype.shutdown = function () {
            this.clean();
        };
        BaseGame.prototype.convertTime = function () {
            this._secs = Math.floor(this._timer);
            this._mils = this._timer - this._secs;
            var tStr = this._secs + this._mils;
            return tStr.toString();
        };
        BaseGame.prototype.clean = function () {
            this._cam.destroy();
            if (this._testBigFoot) {
                this._testBigFoot.parent.removeChild(this._testBigFoot);
                this._testBigFoot.free();
            }
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
            this.game.load.image("cn_logo", Boot.PATH_IMAGES + "Preloader/cnlogo.jpg");
            this.game.load.atlas("preload", Boot.PATH_IMAGES + "Preloader/Preloader.png", Boot.PATH_IMAGES + "Preloader/Preloader.json");
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
            if (window["DONT_USE_OPTIMIZATION_FOR_MOBILE"] != true) {
                Boot.OPTIMIZATION = !this.game.device.desktop;
            }
        };
        Boot.prototype.loadingUpdate = function (progress, cacheKey, success, totalLoaded, totalFiles) {
            if (progress >= 100.0) {
                this.game.load.onFileComplete.removeAll();
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
    Boot.PATH_SOUNDS = "./assets/sounds/";
    Boot.PATH_SETTINGS = "./assets/settings/";
    Boot.GAME_DATA = new TProject.SaveData();
    Boot.OPTIMIZATION = false;
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
    var FinishScreen = (function (_super) {
        __extends(FinishScreen, _super);
        function FinishScreen() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FinishScreen.prototype.create = function () {
            _super.prototype.create.call(this);
            console.log("Start Finish");
            this.setDebugMode();
            this.myinit();
        };
        FinishScreen.prototype.myinit = function () {
            var _this = this;
            _super.prototype.init.call(this);
            this._playerPlace = 2;
            this._playerType = 3;
            this._bg = this.game.add.sprite(-7, 0, "GUI_Test", "podium_bg");
            this.game.stage.addChild(this._bg);
            this._podium = this.game.add.sprite(146, 291, "GUI_Test", "podium");
            this._bg.addChild(this._podium);
            this._gumball = this.game.add.sprite(372, 300, "finish_chars", "podium_gumball_10001");
            this._gumball.anchor.set(0.5, 1);
            this._gumball.animations.add("gold", Phaser.Animation.generateFrameNames("podium_gumball_", 10001, 10038), 24, true);
            this._gumball.animations.add("silver", Phaser.Animation.generateFrameNames("podium_gumball_", 10039, 10092), 24, true);
            this._gumball.animations.add("bronze", Phaser.Animation.generateFrameNames("podium_gumball_", 10093, 10150), 24, true);
            this._bg.addChild(this._gumball);
            this._darwin = this.game.add.sprite(488, 360, "finish_chars", "podium_darwin_10001");
            this._darwin.anchor.set(0.5, 1);
            this._darwin.animations.add("gold", Phaser.Animation.generateFrameNames("podium_darwin_", 10001, 10034), 24, true);
            this._darwin.animations.add("silver", Phaser.Animation.generateFrameNames("podium_darwin_", 10035, 10077), 24, true);
            this._darwin.animations.add("bronze", Phaser.Animation.generateFrameNames("podium_darwin_", 10078, 10120), 24, true);
            this._bg.addChild(this._darwin);
            this._anais = this.game.add.sprite(284, 391, "finish_chars", "podium_anis_10001");
            this._anais.anchor.set(0.5, 1);
            this._anais.animations.add("gold", Phaser.Animation.generateFrameNames("podium_anis_", 10001, 10036), 24, true);
            this._anais.animations.add("silver", Phaser.Animation.generateFrameNames("podium_anis_", 10037, 10083), 24, true);
            this._anais.animations.add("bronze", Phaser.Animation.generateFrameNames("podium_anis_", 10084, 10138), 24, true);
            this._bg.addChild(this._anais);
            if (this._playerPlace == 3) {
                if (this._playerType == 1) {
                    this._gumball.position.set(372, 300);
                    this._gumball.play("gold");
                    this._anais.position.set(506, 360);
                    this._anais.play("silver");
                    this._darwin.position.set(262, 392);
                    this._darwin.play("bronze");
                }
                else if (this._playerType == 2) {
                    this._darwin.position.set(372, 296);
                    this._darwin.play("gold");
                    this._gumball.position.set(487, 361);
                    this._gumball.play("silver");
                    this._anais.position.set(283, 389);
                    this._anais.play("bronze");
                }
                else if (this._playerType == 3) {
                    this._anais.position.set(391, 295);
                    this._anais.play("gold");
                    this._gumball.position.set(487, 361);
                    this._gumball.play("silver");
                    this._darwin.position.set(262, 392);
                    this._darwin.play("bronze");
                }
            }
            else if (this._playerPlace == 2) {
                if (this._playerType == 3) {
                    this._gumball.position.set(372, 300);
                    this._gumball.play("gold");
                    this._anais.position.set(506, 360);
                    this._anais.play("silver");
                    this._darwin.position.set(262, 392);
                    this._darwin.play("bronze");
                }
                else if (this._playerType == 1) {
                    this._darwin.position.set(372, 296);
                    this._darwin.play("gold");
                    this._gumball.position.set(487, 361);
                    this._gumball.play("silver");
                    this._anais.position.set(283, 389);
                    this._anais.play("bronze");
                }
                else if (this._playerType == 2) {
                    this._anais.position.set(391, 295);
                    this._anais.play("gold");
                    this._darwin.position.set(488, 361);
                    this._darwin.play("silver");
                    this._gumball.position.set(263, 393);
                    this._gumball.play("bronze");
                }
            }
            else if (this._playerPlace == 1) {
                if (this._playerType == 2) {
                    this._gumball.position.set(372, 300);
                    this._gumball.play("gold");
                    this._anais.position.set(506, 360);
                    this._anais.play("silver");
                    this._darwin.position.set(262, 392);
                    this._darwin.play("bronze");
                }
                else if (this._playerType == 3) {
                    this._darwin.position.set(372, 296);
                    this._darwin.play("gold");
                    this._gumball.position.set(487, 361);
                    this._gumball.play("silver");
                    this._anais.position.set(283, 389);
                    this._anais.play("bronze");
                }
                else if (this._playerType == 1) {
                    this._anais.position.set(391, 295);
                    this._anais.play("gold");
                    this._darwin.position.set(488, 361);
                    this._darwin.play("silver");
                    this._gumball.position.set(263, 393);
                    this._gumball.play("bronze");
                }
            }
            this._contininiueBtn = new TProject.OButton(this.game, "GUI_Test", ["btn_continue_10001", "btn_continue_10002", "btn_continue_10002"], function () {
                console.log("ExitToLevelSelect");
            });
            this._contininiueBtn.position.set(570, 520);
            this._contininiueBtn.alpha = 0;
            this._contininiueBtn.enabled = false;
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this._confettiEmmiter = this.game.add.emitter(0, 0, 300);
            this._confettiEmmiter.makeParticles("GUI_Test", ['explosion_particles_10001', 'explosion_particles_10002', 'explosion_particles_10003', 'explosion_particles_10004', 'explosion_particles_10005', 'explosion_particles_10006']);
            this._confettiEmmiter.gravity = 400;
            this._confettiEmmiter.minParticleSpeed.setTo(-85, -300);
            this._confettiEmmiter.maxParticleSpeed.setTo(85, -450);
            this._podiumDB = new TProject.DBSprite(TProject.Boot.FINISH_SCREEN, "gameover/mc.ui_gameover", this.game);
            this._podiumDB.setPos(375.0, 250.0);
            this._podiumDB.play("idle");
            this._bg.addChild(this._podiumDB);
            this._bg.addChild(this._confettiEmmiter);
            this._podiumDB.getBone("congratulations").addChild(this._contininiueBtn);
            if (this._playerPlace < 3) {
                this._podiumDB.getSlot("congratulations").play("lose_lable");
            }
            else {
                this._podiumDB.getSlot("congratulations").play("win_lable");
            }
            var bronzeMedal = new TProject.DBSprite(this._podiumDB.getBone("bronze"));
            var silverMedal = new TProject.DBSprite(this._podiumDB.getBone("silver"));
            var goldMedal = new TProject.DBSprite(this._podiumDB.getBone("gold"));
            this._miniGold = this.game.add.sprite(358, 233, "GUI_Test", "medal_mini_gold");
            this._miniSilver = this.game.add.sprite(469, 313, "GUI_Test", "medal_mini_silver");
            this._miniBronze = this.game.add.sprite(246, 334, "GUI_Test", "medal_mini_bronze");
            this._miniGold.visible = false;
            this._miniSilver.visible = false;
            this._miniBronze.visible = false;
            this._bg.addChild(this._miniGold);
            this._bg.addChild(this._miniSilver);
            this._bg.addChild(this._miniBronze);
            if (this._playerPlace == 3) {
                this._currentMedal = goldMedal;
                this._currentMedal.armature.getSlot("MEDAL").childArmature.animation.play("gold");
                this._otherMedal = silverMedal;
                this._otherMedal.armature.getSlot("MEDAL").childArmature.animation.play("silver");
                this._miniMedal = this._miniSilver;
                this._otherMedal2 = bronzeMedal;
                this._otherMedal2.armature.getSlot("MEDAL").childArmature.animation.play("bronze");
                this._miniMedal2 = this._miniBronze;
            }
            else if (this._playerPlace == 2) {
                this._currentMedal = silverMedal;
                this._currentMedal.armature.getSlot("MEDAL").childArmature.animation.play("silver");
                this._otherMedal = goldMedal;
                this._otherMedal.armature.getSlot("MEDAL").childArmature.animation.play("gold");
                this._miniMedal = this._miniGold;
                this._otherMedal2 = bronzeMedal;
                this._otherMedal2.armature.getSlot("MEDAL").childArmature.animation.play("bronze");
                this._miniMedal2 = this._miniBronze;
            }
            else if (this._playerPlace == 1) {
                this._currentMedal = bronzeMedal;
                this._currentMedal.armature.getSlot("MEDAL").childArmature.animation.play("bronze");
                this._otherMedal = silverMedal;
                this._otherMedal.armature.getSlot("MEDAL").childArmature.animation.play("silver");
                this._miniMedal = this._miniSilver;
                this._otherMedal2 = goldMedal;
                this._otherMedal2.armature.getSlot("MEDAL").childArmature.animation.play("gold");
                this._miniMedal2 = this._miniGold;
            }
            this.setTimeout(function () {
                _this._currentMedal.play("show", function () {
                    if (_this._playerPlace == 1) {
                        _this._miniBronze.visible = true;
                    }
                    else if (_this._playerPlace == 2) {
                        _this._miniSilver.visible = true;
                    }
                    else if (_this._playerPlace == 3) {
                        _this._miniGold.visible = true;
                    }
                    _this._currentMedal.armature.getBone("MEDAL").visible = false;
                    _this._otherMedal.play("showall", function () { _this._otherMedal.armature.getBone("MEDAL").visible = false; _this._miniMedal.visible = true; }, _this);
                    _this._otherMedal2.play("showall", function () { _this._otherMedal2.armature.getBone("MEDAL").visible = false; _this._miniMedal2.visible = true; }, _this);
                });
            }, 1500);
            this.setTimeout(function () {
                _this.game.add.tween(_this._contininiueBtn).to({ alpha: 1 }, 700, Phaser.Easing.Linear.None, true).onComplete.addOnce(function () {
                    _this._contininiueBtn.enabled = true;
                }, _this);
            }, 4000);
            this._soundBtnOn = new TProject.OButton(this.game, "GUI_Test", ["mc.btn_sound_10001", "mc.btn_sound_10002", "mc.btn_sound_10002"], function () {
                _this._soundBtnOff.visible = true;
                _this._soundBtnOff.enabled = true;
                _this._soundBtnOn.visible = false;
                _this._soundBtnOn.enabled = false;
                console.log("SndOnDown");
            });
            this._soundBtnOn.position.set(728, 31);
            this._bg.addChild(this._soundBtnOn);
            this._soundBtnOff = new TProject.OButton(this.game, "GUI_Test", ["mc.btn_sound_10003", "mc.btn_sound_10004", "mc.btn_sound_10004"], function () {
                _this._soundBtnOff.visible = false;
                _this._soundBtnOff.enabled = false;
                _this._soundBtnOn.visible = true;
                _this._soundBtnOn.enabled = true;
                console.log("SndOffDown");
            });
            this._soundBtnOff.position.set(728, 31);
            this._soundBtnOff.visible = false;
            this._soundBtnOff.enabled = false;
            this._bg.addChild(this._soundBtnOff);
            this._exitBtn = new TProject.OButton(this.game, "GUI_Test", ["mc.btn_exit_10001", "mc.btn_exit_10002", "mc.btn_exit_10002"], function () {
                console.log("EXIT!");
            });
            this._exitBtn.position.set(40, 31);
            this._bg.addChild(this._exitBtn);
            this.startFire();
        };
        FinishScreen.prototype.startFire = function () {
            var _this = this;
            this._podiumDB.getBone("streamers").armature.getSlot("Layer 3").childArmature.animation.play("fire");
            this._podiumDB.getBone("streamers").armature.getSlot("Layer 2").childArmature.animation.play("fire");
            this.particleBurst(119, 360);
            this.particleBurst(632, 360);
            this.setTimeout(function () { _this.startFire(); }, 3500);
        };
        FinishScreen.prototype.particleBurst = function (x, y) {
            this._confettiEmmiter.x = x;
            this._confettiEmmiter.y = y;
            this._confettiEmmiter.start(true, 2700, null, 80);
        };
        FinishScreen.prototype.update = function () {
            var _this = this;
            var dt = this.game.time.elapsedMS / 1000;
            this._confettiEmmiter.forEachAlive(function (p) {
                if (p.lifespan < _this._confettiEmmiter.lifespan * 0.3) {
                    p.alpha *= 0.9;
                }
            }, this);
            _super.prototype.update.call(this);
        };
        return FinishScreen;
    }(TProject.AbstractGame));
    TProject.FinishScreen = FinishScreen;
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
            this._cnLogo = this.add.image(this.world.centerX - 3, this.world.centerY - 100 + 60, "cn_logo");
            this._cnLogo.scale.set(0.8);
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
            this.game.load.atlas("GameAssets", TProject.Boot.PATH_IMAGES + "objects.png", TProject.Boot.PATH_IMAGES + "objects.json");
            this.game.load.atlas("Characters", TProject.Boot.PATH_IMAGES + "characters.png", TProject.Boot.PATH_IMAGES + "characters.json");
            this.game.load.atlas("bg1", TProject.Boot.PATH_IMAGES + "bg1.png", TProject.Boot.PATH_IMAGES + "bg1.json");
            this.game.load.atlas("bg0", TProject.Boot.PATH_IMAGES + "bg0.png", TProject.Boot.PATH_IMAGES + "bg0.json");
            this.game.load.atlas("finish_chars", TProject.Boot.PATH_IMAGES + "finish_chars.png", TProject.Boot.PATH_IMAGES + "finish_chars.json");
            this.game.load.atlas("GUI_Test", TProject.Boot.PATH_IMAGES + "gui_and_objects.png", TProject.Boot.PATH_IMAGES + "gui_and_objects.json");
            TProject.Factories.loadFactory(this.game, "bigfoot_step", TProject.Boot.PATH_IMAGES + "DB/");
            TProject.Factories.loadFactory(this.game, "finish_level", TProject.Boot.PATH_IMAGES + "DB/");
            this._loadedFont = true;
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
                TProject.Boot.TEST_BIGFOOT = TProject.Factories.createFactory(this.game, "bigfoot_step");
                TProject.Boot.FINISH_SCREEN = TProject.Factories.createFactory(this.game, "finish_level");
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
            WebFont.load({
                custom: {
                    families: ["gumball_roundedregular"],
                    urls: [
                        TProject.Boot.PATH_FONTS + "stylesheet.css"
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
