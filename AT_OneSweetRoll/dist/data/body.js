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
    var Block = (function (_super) {
        __extends(Block, _super);
        function Block(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
            _this.body.immovable = true;
            _this.body.setSize(80, 80, 0, 0);
            _this._sprite = null;
            return _this;
        }
        Object.defineProperty(Block.prototype, "sprite", {
            set: function (val) {
                if (this._sprite == null) {
                    this._sprite = val;
                    this._sprite.x = TProject.GameConfig.BLOCK_SIZE / 2;
                    this._sprite.y = TProject.GameConfig.BLOCK_SIZE / 2;
                    if (val.frameName == "block_40000" || val.frameName == "block_30000") {
                    }
                    else {
                    }
                    this._sprite.anchor.set(0.5, 0.5);
                    this.addChild(this._sprite);
                }
            },
            enumerable: true,
            configurable: true
        });
        Block.prototype.destroy = function () {
            if (this.body) {
                this.body.destroy();
            }
            if (this._sprite) {
                this.removeChild(this._sprite);
                this._sprite.destroy();
            }
            _super.prototype.destroy.call(this);
        };
        return Block;
    }(Phaser.Sprite));
    TProject.Block = Block;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var BossFightFactory = (function () {
        function BossFightFactory(game) {
            this.game = game;
        }
        BossFightFactory.prototype.spawnPinguin = function (right) {
            var _this = this;
            if (right === void 0) { right = true; }
            var x = TProject.GameConfig.WIDTH;
            var y = TProject.GameConfig.HEIGHT - TProject.GameConfig.BLOCK_SIZE * 2 + 4;
            var velocityX = -TProject.GameConfig.PINGUIN_SPEED;
            if (!right) {
                x = -40;
                velocityX = TProject.GameConfig.PINGUIN_SPEED;
            }
            var sprite = this.game.add.sprite(x, y, "Boss", "Boss1_mc_10001");
            if (!right) {
                sprite.scale.set(-1, 1);
            }
            sprite.name = "pinguin";
            sprite.animations.add("walk", Phaser.Animation.generateFrameNames("Boss1_mc_", 10001, 10010), 24, true);
            var dieAnimation = sprite.animations.add("die", Phaser.Animation.generateFrameNames("Boss_1_dead_mc_", 10001, 10015), 24, true);
            dieAnimation.onComplete.add(function () {
                var tween = _this.game.add.tween(sprite).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(function () {
                    sprite.parent.removeChild(sprite);
                    sprite.destroy();
                });
            });
            sprite.play("walk", 24, true);
            sprite.inputEnabled = true;
            sprite.events.onInputDown.add(function (obj, pointer) {
                if (Phaser.Rectangle.contains(sprite.body, pointer.x, pointer.y)) {
                    if (sprite.body) {
                        sprite.inputEnabled = false;
                        sprite.body.destroy();
                        TProject.SoundMixer.play("sound 640 (pop)", 0.2);
                        sprite.play("die", 24, false);
                    }
                }
            });
            sprite.anchor.set(0, 1);
            this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
            sprite.body.setSize(38, 66, 2, 35);
            sprite.body.velocity.x = velocityX;
            return sprite;
        };
        BossFightFactory.prototype.createIceking = function () {
            var x = 780;
            var y = 322;
            var sprite = new TProject.Iceking(this.game, x, y);
            return sprite;
        };
        BossFightFactory.prototype.spawnMagicBall = function () {
            var x = TProject.GameConfig.WIDTH - TProject.GameConfig.BLOCK_SIZE * 2;
            var y = TProject.GameConfig.HEIGHT - TProject.GameConfig.BLOCK_SIZE * 2.5;
            var sprite = this.game.add.sprite(x, y, "Boss", "fire_ball_correct_size_10001");
            sprite.anchor.set(0.5, 0.5);
            sprite.name = "magic";
            var animation = sprite.animations.add("play", Phaser.Animation.generateFrameNames("fire_ball_correct_size_", 10001, 10003), 24, true);
            animation.play();
            this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
            sprite.body.setSize(27, 27, 25, 25);
            sprite.body.velocity.x = -TProject.GameConfig.MAGIC_SPEED;
            return sprite;
        };
        return BossFightFactory;
    }());
    TProject.BossFightFactory = BossFightFactory;
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
        function GameUI(game, x, y, baseGame) {
            var _this = _super.call(this, game, x, y) || this;
            _this._baseGame = baseGame;
            _this._currentTutorialLevel = -1;
            _this._pauseBtn = _this.game.add.sprite(678, 4, "Menu", "pause_button");
            _this.addChild(_this._pauseBtn);
            _this._pauseBtn.inputEnabled = true;
            _this._pauseBtn.events.onInputDown.add(function () {
                _this._baseGame.openMenu();
                _this._pauseBtn.inputEnabled = false;
                _this._pauseBtn.visible = false;
                _this._baseGame.pauseBossGame(true);
                for (var i = 0; i < _this._buttonsArray.length; i++) {
                    _this._buttonsArray[i].visible = true;
                    _this._buttonsArray[i].inputEnabled = true;
                }
            });
            _this._currentComix = _this.game.add.sprite(0, 0, "Comics", "Comix1_mc");
            _this.addChild(_this._currentComix);
            _this._currentComix.visible = false;
            _this._currentComixStaff = _this.game.add.sprite(0, 0);
            _this.addChild(_this._currentComixStaff);
            _this._currentComixStaff.visible = false;
            _this._tutorialArm = _this.game.add.sprite(0, 0, "Menu", "hand_10001");
            _this._tutorialArm.anchor.set(0.5, 0.5);
            _this.addChild(_this._tutorialArm);
            _this._tutorialArm.animations.add("idle", Phaser.Animation.generateFrameNames("hand_", 10001, 10030), 30, true);
            _this._tutorialArm.play("idle");
            _this._tutorialArm.visible = false;
            _this._tutoriaText = _this.game.add.sprite(0, 0, "Menu", "Hand1_mc");
            _this._tutoriaText.anchor.set(0.5, 0.5);
            _this.addChild(_this._tutoriaText);
            _this._tutoriaText.visible = false;
            _this._ingameMenuContainer = _this.game.add.sprite(0, 0);
            _this.addChild(_this._ingameMenuContainer);
            _this._buttonsArray = [];
            _this.createIngameButton("resume_lbl", 274, 14.7, function () {
                _this.closeMenu();
            });
            _this.createIngameButton("restart_lbl", 274, 106.85, function () {
                _this.endGame();
            });
            _this.createIngameButton("music_lbl", 274, 199, function () {
                if (_this._buttonsArray[2].alpha == 1) {
                    _this._buttonsArray[2].alpha = 0.5;
                    TProject.SoundMixer.bgStop();
                    TProject.Boot.GAME_DATA.playMusic = false;
                    TProject.SaveManager.getInstance.save();
                }
                else {
                    _this._buttonsArray[2].alpha = 1;
                    TProject.Boot.GAME_DATA.playMusic = true;
                    TProject.SoundMixer.on();
                    TProject.SaveManager.getInstance.save();
                }
            });
            _this.createIngameButton("sound_lbl", 274, 291.15, function () {
                if (_this._buttonsArray[3].alpha == 1) {
                    _this._buttonsArray[3].alpha = 0.5;
                    TProject.Boot.GAME_DATA.playSFX = false;
                    TProject.SaveManager.getInstance.save();
                }
                else {
                    _this._buttonsArray[3].alpha = 1;
                    TProject.Boot.GAME_DATA.playSFX = true;
                    TProject.SaveManager.getInstance.save();
                }
            });
            _this.createIngameButton("exit_lbl", 274, 383.3, function () {
                for (var i = 0; i < _this._buttonsArray.length; i++) {
                    _this._buttonsArray[i].inputEnabled = false;
                }
                _this._finnSplash.position.set(163, -256);
                _this._jakeSplash.position.set(519, 735);
                _this.game.add.tween(_this._finnSplash).to({ y: 245 }, 300, Phaser.Easing.Linear.None, true);
                _this.game.add.tween(_this._jakeSplash).to({ y: 245 }, 300, Phaser.Easing.Linear.None, true).onComplete.addOnce(function () {
                    setTimeout(function () {
                        _this.game.state.start("MainMenu", true);
                    }, 200);
                }, _this);
            });
            if (TProject.Boot.GAME_DATA.playMusic) {
                _this._buttonsArray[2].alpha = 1;
            }
            else {
                _this._buttonsArray[2].alpha = 0.5;
            }
            if (TProject.Boot.GAME_DATA.playSFX) {
                _this._buttonsArray[3].alpha = 1;
            }
            else {
                _this._buttonsArray[3].alpha = 0.5;
            }
            _this.createSplash();
            return _this;
        }
        GameUI.prototype.startComix = function (level) {
            var _this = this;
            switch (level) {
                case 0:
                    this.readyToRestart();
                    this._currentComixStaff.visible = true;
                    this._currentComix.visible = true;
                    this._currentComix.position.set(0, 0);
                    this._currentComix.frameName = "Comix1_mc";
                    var textBubble_1 = this.game.add.sprite(-12, 488, "Comics", "comixBubble");
                    textBubble_1.anchor.set(0, 1);
                    textBubble_1.scale.set(0);
                    this._currentComixStaff.addChild(textBubble_1);
                    var comixText_1 = this.game.add.sprite(166, -86, "Comics", "comix_text1");
                    comixText_1.anchor.set(0.5);
                    textBubble_1.addChild(comixText_1);
                    this.game.add.tween(textBubble_1.scale).to({ x: 1, y: 1 }, 500, Phaser.Easing.Elastic.Out, true, 500);
                    setTimeout(function () {
                        textBubble_1.scale.set(0);
                        comixText_1.frameName = "comix_text2";
                    }, 5300);
                    this.game.add.tween(textBubble_1.scale).to({ x: 1, y: 1 }, 500, Phaser.Easing.Elastic.Out, true, 5500);
                    var donat_1 = this.game.add.sprite(502, 477, "Comics", "cb_mc");
                    this._currentComixStaff.addChild(donat_1);
                    this.game.add.tween(donat_1).to({ y: 248 }, 200, Phaser.Easing.Linear.None, true, 5500);
                    this.game.add.tween(this._currentComix).to({ x: -99 }, 5700, Phaser.Easing.Linear.None, true).onComplete.add(function () {
                        setTimeout(function () {
                            setTimeout(function () {
                                textBubble_1.destroy(true);
                                donat_1.destroy(true);
                            }, 300);
                            TProject.SoundMixer.play("sound 644 (ingame_music)", 0.2, true, true);
                            _this.endGame();
                        }, 1300);
                    }, this);
                    break;
                case 7:
                    this.readyToRestart();
                    this._currentComixStaff.visible = true;
                    this._currentComix.visible = true;
                    this._currentComix.position.set(0, 0);
                    this._currentComix.frameName = "Comix2_mc";
                    this._currentComix.inputEnabled = true;
                    this._currentComix.events.onInputDown.addOnce(function () {
                        _this._currentComix.inputEnabled = false;
                        _this.endGame();
                    }, this);
                    break;
                case 13:
                    this.readyToRestart();
                    this._currentComixStaff.visible = true;
                    this._currentComix.visible = true;
                    this._currentComix.position.set(0, 0);
                    this._currentComix.frameName = "Comix3_mc";
                    var buttonPlay_1 = this.game.add.sprite(505, 373, "Comics", "playButton");
                    this._currentComixStaff.addChild(buttonPlay_1);
                    buttonPlay_1.inputEnabled = true;
                    buttonPlay_1.events.onInputDown.addOnce(function () {
                        buttonPlay_1.inputEnabled = false;
                        setTimeout(function () {
                            buttonPlay_1.destroy();
                        }, 300);
                        _this.endGame();
                    }, this);
                    break;
                case 20:
                    this.readyToRestart();
                    this._currentComixStaff.visible = true;
                    this._currentComix.visible = true;
                    this._currentComix.position.set(0, 0);
                    this._currentComix.frameName = "Comix4_mc";
                    var buttonPlayAgain_1 = this.game.add.sprite(505, 373, "Comics", "playButton");
                    this._currentComixStaff.addChild(buttonPlayAgain_1);
                    buttonPlayAgain_1.inputEnabled = true;
                    buttonPlayAgain_1.events.onInputDown.addOnce(function () {
                        buttonPlayAgain_1.inputEnabled = false;
                        setTimeout(function () {
                            buttonPlayAgain_1.destroy();
                        }, 300);
                        _this.endGame();
                    }, this);
                    break;
                case 21:
                    this.readyToRestart();
                    this._currentComixStaff.visible = true;
                    this._currentComix.visible = true;
                    this._currentComix.position.set(0, 0);
                    this._currentComix.frameName = "Comix5_mc";
                    var buttonRePlay_1 = this.game.add.sprite(505, 373, "Comics", "playAgainButton");
                    this._currentComixStaff.addChild(buttonRePlay_1);
                    buttonRePlay_1.inputEnabled = true;
                    buttonRePlay_1.events.onInputDown.addOnce(function () {
                        buttonRePlay_1.inputEnabled = false;
                        setTimeout(function () {
                            buttonRePlay_1.destroy();
                        }, 300);
                        TProject.Boot.GAME_DATA.currentLevel = 0;
                        TProject.SaveManager.getInstance.save();
                        _this._baseGame.endGame();
                        TProject.SoundMixer.play("sound 644 (ingame_music)", 0.2, true, true);
                        _this.endGame();
                    }, this);
                    break;
            }
        };
        GameUI.prototype.closeMenu = function (doNotTouchPlayer) {
            if (doNotTouchPlayer === void 0) { doNotTouchPlayer = false; }
            this._baseGame.closeMenu(doNotTouchPlayer);
            this._baseGame.pauseBossGame(false);
            if (!doNotTouchPlayer) {
                this._pauseBtn.inputEnabled = true;
                this._pauseBtn.visible = true;
            }
            for (var i = 0; i < this._buttonsArray.length; i++) {
                this._buttonsArray[i].visible = false;
                this._buttonsArray[i].inputEnabled = false;
            }
        };
        GameUI.prototype.createIngameButton = function (key, x, y, cb) {
            var back = this.game.add.sprite(x, y, "Menu", "buton_bg");
            var name = this.game.add.sprite(back.width / 2, back.height / 2, "Menu", key);
            name.anchor.set(0.5);
            back.addChild(name);
            this._buttonsArray.push(back);
            this._ingameMenuContainer.addChild(this._buttonsArray[this._buttonsArray.length - 1]);
            this._buttonsArray[this._buttonsArray.length - 1].visible = false;
            this._buttonsArray[this._buttonsArray.length - 1].events.onInputDown.add(function () { cb(); }, this);
        };
        GameUI.prototype.showTutorial = function (level) {
            switch (level) {
                case 0:
                    this._tutoriaText.frameName = "Hand1_mc";
                    this.tutorialShowRight(level);
                    this._tutorialArm.position.set(286, 226);
                    this._tutoriaText.position.set(418, 202);
                    this._tutorialArm.angle = 0;
                    this._tutorialArm.scale.set(1, 1);
                    break;
                case 2:
                    this._tutoriaText.frameName = "Hand2_mc";
                    this.tutorialShowRight(level);
                    this._tutorialArm.position.set(288, 208);
                    this._tutoriaText.position.set(490, 200);
                    this._tutorialArm.angle = 0;
                    this._tutorialArm.scale.set(1, 1);
                    break;
                case 7:
                    this._tutoriaText.frameName = "Hand3_mc";
                    this.tutorialShowRight(level);
                    this._tutorialArm.position.set(288, 208);
                    this._tutorialArm.visible = false;
                    this._tutoriaText.position.set(369, 155);
                    this._tutorialArm.angle = 0;
                    this._tutorialArm.scale.set(1, 1);
                    break;
                case 8:
                    this._tutoriaText.frameName = "Hand4_mc";
                    this.tutorialShowRight(level);
                    this._tutorialArm.position.set(506, 199);
                    this._tutoriaText.position.set(507, 136);
                    this._tutorialArm.angle = 90;
                    this._tutorialArm.scale.set(1, -1);
                    break;
                case 13:
                    this._tutoriaText.frameName = "Hand5_mc";
                    this.tutorialShowRight(level);
                    this._tutorialArm.position.set(288, 208);
                    this._tutorialArm.visible = false;
                    this._tutoriaText.position.set(376, 168);
                    this._tutorialArm.angle = 0;
                    this._tutorialArm.scale.set(1, 1);
                    break;
                case 14:
                    this._tutoriaText.frameName = "Hand6_mc";
                    this.tutorialShowRight(level);
                    this._tutorialArm.position.set(270, 200);
                    this._tutoriaText.position.set(273, 130);
                    this._tutorialArm.angle = 90;
                    this._tutorialArm.scale.set(1, -1);
                    break;
                case 20:
                    this._tutoriaText.frameName = "Hand7_mc";
                    this.tutorialShowRight(level);
                    this._tutorialArm.position.set(270, 113);
                    this._tutoriaText.position.set(119, 110);
                    this._tutorialArm.angle = 90;
                    this._tutorialArm.scale.set(1, -1);
                    break;
            }
        };
        GameUI.prototype.tutorialShowRight = function (level) {
            var _this = this;
            this._currentTutorialLevel = level;
            this._tutorialArm.visible = true;
            this._tutoriaText.visible = true;
            this.game.input.onDown.addOnce(function () {
                _this.hideTutorial();
            }, this);
        };
        GameUI.prototype.hideTutorial = function () {
            if (this._currentTutorialLevel != -1 && this._tutoriaText.visible) {
                this._tutorialArm.visible = false;
                this._tutoriaText.visible = false;
                this._currentTutorialLevel = -1;
            }
        };
        GameUI.prototype.createSplash = function () {
            this._finnSplash = this.game.add.sprite(163, 245, "Menu", "fin_splash");
            this._finnSplash.anchor.set(0.5, 0.5);
            this.addChild(this._finnSplash);
            this._finnSplash.inputEnabled = true;
            this._finnSplash.events.onInputDown.add(function () { }, this);
            this._jakeSplash = this.game.add.sprite(519, 245, "Menu", "jake_splash");
            this._jakeSplash.anchor.set(0.5, 0.5);
            this.addChild(this._jakeSplash);
            this._jakeSplash.inputEnabled = true;
            this._jakeSplash.events.onInputDown.add(function () { }, this);
            this._finnSplash.scale.set(1.05);
            this._jakeSplash.scale.set(1.05);
        };
        GameUI.prototype.offMenuBtn = function () {
            this._pauseBtn.inputEnabled = false;
        };
        GameUI.prototype.endGame = function (currentLevel, isNewLevel) {
            var _this = this;
            if (currentLevel === void 0) { currentLevel = -1; }
            if (isNewLevel === void 0) { isNewLevel = false; }
            this._finnSplash.position.set(163, -256);
            this._jakeSplash.position.set(519, 735);
            this._jakeSplash.inputEnabled = true;
            this._finnSplash.inputEnabled = true;
            this.game.add.tween(this._finnSplash).to({ y: 245 }, 300, Phaser.Easing.Linear.None, true);
            this.game.add.tween(this._jakeSplash).to({ y: 245 }, 300, Phaser.Easing.Linear.None, true).onComplete.addOnce(function () {
                if (_this._currentComix.visible)
                    _this._currentComix.visible = false;
                if (!isNewLevel) {
                    _this.loadNewLevelBaseGame();
                }
                else {
                    if (currentLevel == 0 || currentLevel == 20 || currentLevel == 7 || currentLevel == 13 || currentLevel == 21) {
                        _this.startComix(currentLevel);
                        TProject.SoundMixer.play("sound 646 (bosses)", 0.2, true, true);
                    }
                    else {
                        _this.loadNewLevelBaseGame();
                        if (currentLevel == 8 || currentLevel == 14) {
                            TProject.SoundMixer.play("sound 644 (ingame_music)", 0.2, true, true);
                        }
                    }
                }
            }, this);
        };
        GameUI.prototype.initialFirstLevel = function (currentLevel) {
            if (currentLevel == 0 || currentLevel == 20 || currentLevel == 7 || currentLevel == 13 || currentLevel == 21) {
                this.startComix(currentLevel);
                TProject.SoundMixer.play("sound 646 (bosses)", 0.2, true, true);
            }
            else {
                this.loadNewLevelBaseGame();
                TProject.SoundMixer.play("sound 644 (ingame_music)", 0.2, true, true);
            }
        };
        GameUI.prototype.loadNewLevelBaseGame = function () {
            var _this = this;
            if (!this._pauseBtn.visible) {
                this.closeMenu(true);
            }
            setTimeout(function () {
                _this._baseGame.loadLevel();
                console.log("Загружаем уровень");
            }, 200);
        };
        GameUI.prototype.readyToRestart = function () {
            var _this = this;
            this.game.add.tween(this._finnSplash).to({ x: -190 }, 300, Phaser.Easing.Linear.None, true);
            this.game.add.tween(this._jakeSplash).to({ x: 930 }, 300, Phaser.Easing.Linear.None, true).onComplete.addOnce(function () {
                _this._jakeSplash.inputEnabled = false;
                _this._finnSplash.inputEnabled = false;
                _this._pauseBtn.visible = true;
                _this._pauseBtn.inputEnabled = true;
            });
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
    var IceBlock = (function (_super) {
        __extends(IceBlock, _super);
        function IceBlock(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this._clickCounter = 0;
            _this._spriteNumber = 10001;
            _this._sprite = _this.game.add.sprite(0, 0, "Boss", "boss3_correct_size_10001");
            _this._sprite.anchor.set(0, 1);
            _this._finalAnimation = _this._sprite.animations.add("play", Phaser.Animation.generateFrameNames("boss3_correct_size_", 10006, 10020), 24, false);
            _this.addChild(_this._sprite);
            _this._iceBlockPoly = new Phaser.Polygon([
                new Phaser.Point(-76, 141), new Phaser.Point(-109, 93), new Phaser.Point(-112, 68),
                new Phaser.Point(-99, 13), new Phaser.Point(-106, -16), new Phaser.Point(-93, -77),
                new Phaser.Point(-35, -133), new Phaser.Point(-10, -141), new Phaser.Point(62, -134),
                new Phaser.Point(110, -87), new Phaser.Point(104, -24), new Phaser.Point(90, 28),
                new Phaser.Point(91, 89), new Phaser.Point(66, 141)
            ]);
            _this._graphics = _this.game.add.graphics(176, -148);
            _this._graphics.beginFill(0, 0);
            _this._graphics.drawPolygon(_this._iceBlockPoly.points);
            _this._graphics.endFill();
            _this._sprite.addChild(_this._graphics);
            _this._graphics.inputEnabled = true;
            _this._graphics.events.onInputDown.add(function (obj, poiner) {
                _this._clickCounter++;
                var effect = _this.createClickEffect(poiner.x - _this.x, poiner.y - _this.y);
                effect.play("play", 24, false);
                _this.addChild(effect);
                switch (_this._clickCounter) {
                    case 5:
                        {
                            _this._spriteNumber++;
                            _this._sprite.loadTexture("Boss", "boss3_correct_size_" + _this._spriteNumber);
                            _this._iceBlockPoly = new Phaser.Polygon([
                                new Phaser.Point(-76, 141), new Phaser.Point(-109, 93), new Phaser.Point(-112, 68),
                                new Phaser.Point(-99, 13), new Phaser.Point(-106, -16), new Phaser.Point(-30, -72),
                                new Phaser.Point(16, -139), new Phaser.Point(62, -134),
                                new Phaser.Point(110, -87), new Phaser.Point(104, -24), new Phaser.Point(90, 28),
                                new Phaser.Point(91, 89), new Phaser.Point(66, 141)
                            ]);
                            _this._graphics.clear();
                            _this._graphics.beginFill(0, 0);
                            _this._graphics.drawPolygon(_this._iceBlockPoly.points);
                            _this._graphics.endFill();
                        }
                        break;
                    case 10:
                        {
                            _this._spriteNumber++;
                            _this._sprite.loadTexture("Boss", "boss3_correct_size_" + _this._spriteNumber);
                            _this._iceBlockPoly = new Phaser.Polygon([
                                new Phaser.Point(-76, 141), new Phaser.Point(-109, 93), new Phaser.Point(-112, 68),
                                new Phaser.Point(-99, 13), new Phaser.Point(-106, -16), new Phaser.Point(-5, -78),
                                new Phaser.Point(108, -71), new Phaser.Point(104, -24), new Phaser.Point(90, 28),
                                new Phaser.Point(91, 89), new Phaser.Point(66, 141)
                            ]);
                            _this._graphics.clear();
                            _this._graphics.beginFill(0, 0);
                            _this._graphics.drawPolygon(_this._iceBlockPoly.points);
                            _this._graphics.endFill();
                        }
                        break;
                    case 20:
                        {
                            _this._spriteNumber++;
                            _this._sprite.loadTexture("Boss", "boss3_correct_size_" + _this._spriteNumber);
                            _this._iceBlockPoly = new Phaser.Polygon([
                                new Phaser.Point(-57, 141), new Phaser.Point(-70, 50), new Phaser.Point(-102, 34),
                                new Phaser.Point(-99, 13), new Phaser.Point(-106, -16), new Phaser.Point(-5, -78),
                                new Phaser.Point(108, -71), new Phaser.Point(104, -24), new Phaser.Point(90, 28),
                                new Phaser.Point(91, 89), new Phaser.Point(66, 141)
                            ]);
                            _this._graphics.clear();
                            _this._graphics.beginFill(0, 0);
                            _this._graphics.drawPolygon(_this._iceBlockPoly.points);
                            _this._graphics.endFill();
                        }
                        break;
                    case 30:
                        {
                            _this._spriteNumber++;
                            _this._sprite.loadTexture("Boss", "boss3_correct_size_" + _this._spriteNumber);
                            _this._iceBlockPoly = new Phaser.Polygon([
                                new Phaser.Point(-57, 141), new Phaser.Point(-70, 50), new Phaser.Point(-102, 34),
                                new Phaser.Point(-99, 13), new Phaser.Point(-106, -16), new Phaser.Point(-5, -78),
                                new Phaser.Point(108, -71), new Phaser.Point(104, -24), new Phaser.Point(90, 28),
                                new Phaser.Point(90, 38), new Phaser.Point(42, 64), new Phaser.Point(46, 80),
                                new Phaser.Point(35, 141)
                            ]);
                            _this._graphics.clear();
                            _this._graphics.beginFill(0, 0);
                            _this._graphics.drawPolygon(_this._iceBlockPoly.points);
                            _this._graphics.endFill();
                        }
                        break;
                    case 40:
                        {
                            _this._finalAnimation.play(24, false);
                        }
                        break;
                    default:
                        break;
                }
            });
            return _this;
        }
        IceBlock.prototype.setDragToObject = function (sprite) {
            sprite.inputEnabled = true;
            sprite.input.enableDrag();
            sprite.events.onDragStop.add(this.onDragStop, this);
        };
        IceBlock.prototype.onDragStop = function (sprite) {
            console.log(sprite.x + ", " + sprite.y + ",");
        };
        Object.defineProperty(IceBlock.prototype, "disableInput", {
            set: function (val) {
                this._graphics.inputEnabled = !val;
            },
            enumerable: true,
            configurable: true
        });
        IceBlock.prototype.hit = function (x, y) {
            return false;
        };
        IceBlock.prototype.createClickEffect = function (x, y) {
            var sprite = this.game.add.sprite(x, y, "Boss", "Bang_mc_10001");
            sprite.anchor.set(0.5, 0.5);
            var animation = sprite.animations.add("play", Phaser.Animation.generateFrameNames("Bang_mc_", 10001, 10009), 24, false);
            animation.onComplete.add(function () {
                sprite.parent.removeChild(sprite);
                sprite.destroy();
            });
            return sprite;
        };
        Object.defineProperty(IceBlock.prototype, "completeAnimationCallback", {
            set: function (val) {
                var _this = this;
                this._finalAnimation.onComplete.add(function () {
                    val();
                    _this._sprite.inputEnabled = false;
                    _this._sprite.events.onInputDown.removeAll();
                });
            },
            enumerable: true,
            configurable: true
        });
        return IceBlock;
    }(Phaser.Sprite));
    TProject.IceBlock = IceBlock;
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
    var IcekingStates;
    (function (IcekingStates) {
        IcekingStates[IcekingStates["INIT"] = 0] = "INIT";
        IcekingStates[IcekingStates["IDLE"] = 1] = "IDLE";
        IcekingStates[IcekingStates["START_CAST"] = 2] = "START_CAST";
        IcekingStates[IcekingStates["CAST"] = 3] = "CAST";
    })(IcekingStates || (IcekingStates = {}));
    var Iceking = (function (_super) {
        __extends(Iceking, _super);
        function Iceking(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this._state = IcekingStates.INIT;
            _this._sprite = _this.game.add.sprite(0, 0, "Boss", "boss2_correctSize_10031");
            _this._sprite.anchor.set(1, 1);
            _this._castAnimation = _this._sprite.animations.add("cast", Phaser.Animation.generateFrameNames("boss2_correctSize_", 10000, 10030), 24, false);
            _this._timer = 0;
            _this.addChild(_this._sprite);
            _this._minTimer = 40 * 30;
            _this._maxTimer = 70 * 30;
            _this._zapped = false;
            _this._animationWasPaused = false;
            _this._paused = false;
            return _this;
        }
        Iceking.prototype.setTimer = function (min, max) {
            this._minTimer = min;
            this._maxTimer = max;
        };
        Object.defineProperty(Iceking.prototype, "zap", {
            set: function (val) {
                var _this = this;
                this._zapFunction = val;
                this._castAnimation.onComplete.add(function () {
                    _this._sprite.loadTexture("Boss", "boss2_correctSize_10031");
                    _this._state = IcekingStates.IDLE;
                    _this._zapped = false;
                });
                this._state = IcekingStates.IDLE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Iceking.prototype, "pause", {
            set: function (val) {
                this._paused = val;
                this.visible = !val;
                if (val) {
                    if (this._castAnimation.isPlaying) {
                        this._castAnimation.paused = true;
                        this._animationWasPaused = true;
                    }
                }
                else {
                    if (this._animationWasPaused) {
                        this._castAnimation.paused = false;
                        this._animationWasPaused = false;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Iceking.prototype.update = function () {
            if (this._paused) {
                return;
            }
            var dt = this.game.time.elapsedMS;
            if (dt > 200) {
                dt = 200;
            }
            switch (this._state) {
                case IcekingStates.IDLE:
                    {
                        if (this._timer > 0) {
                            this._timer -= dt;
                        }
                        else {
                            this._state = IcekingStates.START_CAST;
                        }
                    }
                    break;
                case IcekingStates.START_CAST:
                    {
                        this._zapped = false;
                        this._castAnimation.play(24, false);
                        this._state = IcekingStates.CAST;
                        this._timer = Utils.randomRange(this._minTimer, this._maxTimer);
                    }
                    break;
                case IcekingStates.CAST:
                    {
                        if (!this._zapped && this._sprite.frameName == "boss2_correctSize_10017") {
                            this._zapFunction();
                            this._zapped = true;
                        }
                    }
                    break;
                default:
                    break;
            }
        };
        return Iceking;
    }(Phaser.Sprite));
    TProject.Iceking = Iceking;
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
    var Level = (function (_super) {
        __extends(Level, _super);
        function Level(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this._materialFactory = new TProject.Materail(game);
            _this._blocks = [];
            _this._playerInitPosition = new Phaser.Point(0, 0);
            _this._movingDanger = [];
            _this._deathBlocks = [];
            _this._movingLayer = _this.game.add.sprite(0, 0);
            _this.addChild(_this._movingLayer);
            _this._blockLayer = _this.game.add.sprite(0, 0);
            _this.addChild(_this._blockLayer);
            _this._menuBG = new Phaser.Graphics(_this.game, 0, 0);
            _this._menuBG.beginFill(0x258CDE, 1);
            _this._menuBG.drawRect(0, 0, _this.game.width, _this.game.height);
            _this._menuBG.endFill();
            _this.addChild(_this._menuBG);
            _this._menuBG.visible = false;
            _this._overlayPointsLayer = _this.game.add.sprite(0, 0, "Menu", "ol_points");
            _this.addChild(_this._overlayPointsLayer);
            _this._overlayPointsLayer.blendMode = PIXI.blendModes.OVERLAY;
            _this._overlayPointsLayer.alpha = 0.25;
            _this._overlayTextLayer = _this.game.add.sprite(0, 0, "Menu", "ol_t");
            _this.addChild(_this._overlayTextLayer);
            _this._overlayTextLayer.blendMode = PIXI.blendModes.MULTIPLY;
            _this._teleportIn = null;
            _this._teleportOut = null;
            _this._initialized = false;
            _this._disableDestorying = false;
            return _this;
        }
        Object.defineProperty(Level.prototype, "level", {
            set: function (map) {
                this._map = map;
                this.generateMap();
                this._initialized = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Level.prototype, "disableDestroying", {
            set: function (val) {
                this._disableDestorying = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Level.prototype, "blocks", {
            get: function () {
                return this._blocks;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Level.prototype, "deathBlocks", {
            get: function () {
                return this._deathBlocks;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Level.prototype, "playerInitlPosition", {
            get: function () {
                return this._playerInitPosition;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Level.prototype, "finishBlock", {
            get: function () {
                return this._finishBlock;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Level.prototype, "movingDanger", {
            get: function () {
                return this._movingDanger;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Level.prototype, "teleportOut", {
            get: function () {
                return this._teleportOut;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Level.prototype, "teleportIn", {
            get: function () {
                return this._teleportIn;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Level.prototype, "menuOver", {
            set: function (value) {
                this._menuBG.visible = value;
            },
            enumerable: true,
            configurable: true
        });
        Level.prototype.generateMap = function () {
            var _this = this;
            var playerPosX = 0;
            var playerPosY = 0;
            var _loop_1 = function (i) {
                this_1._blocks.push(new Array(TProject.GameConfig.MAP_COLS));
                var _loop_2 = function (j) {
                    switch (this_1._map[i][j]) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 9:
                            {
                                var sprite = this_1._materialFactory.createMaterial(this_1._map[i][j], j * TProject.GameConfig.BLOCK_SIZE, i * TProject.GameConfig.BLOCK_SIZE);
                                var block_1 = new TProject.Block(this_1.game, j * TProject.GameConfig.BLOCK_SIZE, i * TProject.GameConfig.BLOCK_SIZE);
                                block_1.name = "TYPE_" + this_1._map[i][j];
                                block_1.sprite = sprite;
                                this_1._blockLayer.addChild(block_1);
                                this_1._blocks[i][j] = block_1;
                                if (this_1._map[i][j] < 6) {
                                    var endAnim_1 = this_1.game.add.sprite(0, 0, "LevelAssets", "anim_block_" + this_1._map[i][j] + "_10001");
                                    endAnim_1.animations.add("idle", Phaser.Animation.generateFrameNames("anim_block_" + this_1._map[i][j] + "_", 10001, 10010), 24, false);
                                    endAnim_1.visible = false;
                                    endAnim_1.anchor.set(0, 0.22);
                                    endAnim_1.position.set(j * TProject.GameConfig.BLOCK_SIZE - 6, i * TProject.GameConfig.BLOCK_SIZE + 40);
                                    this_1._blockLayer.addChild(endAnim_1);
                                    if (!this_1._disableDestorying) {
                                        sprite.inputEnabled = true;
                                        sprite.events.onInputDown.add(function () {
                                            _this._blockLayer.removeChild(block_1);
                                            _this._map[i][j] = 0;
                                            _this._blocks[i][j] = null;
                                            block_1.destroy();
                                            endAnim_1.visible = true;
                                            TProject.SoundMixer.play("sound 641 (block_don)", 0.2);
                                            endAnim_1.animations.play("idle").onComplete.addOnce(function () { endAnim_1.destroy(); }, _this);
                                        }, this_1);
                                    }
                                }
                            }
                            break;
                        case TProject.MaterialType.FINISH:
                            {
                                var sprite = this_1._materialFactory.createMaterial(this_1._map[i][j], j * TProject.GameConfig.BLOCK_SIZE, i * TProject.GameConfig.BLOCK_SIZE);
                                this_1.game.physics.enable(sprite, Phaser.Physics.ARCADE);
                                sprite.name = "TYPE_" + this_1._map[i][j];
                                sprite.body.immovable = true;
                                sprite.body.setSize(40, 40, 20, 20);
                                sprite.anchor.set(0.45);
                                this_1._blockLayer.addChild(sprite);
                                this_1._map[i][j] = 0;
                                this_1._finishBlock = sprite;
                            }
                            break;
                        case "x":
                            {
                                playerPosX = j * 80 + 40;
                                playerPosY = i * 80 + 40;
                                this_1._map[i][j] = 0;
                            }
                            break;
                        case "XL":
                        case "L":
                            {
                                var moving = this_1._map[i][j] == "XL";
                                var sprite = this_1._materialFactory.createDanger(TProject.MaterialType.DANGER_LEFT, j * TProject.GameConfig.BLOCK_SIZE, i * TProject.GameConfig.BLOCK_SIZE, moving);
                                this_1._map[i][j] = 0;
                                if (moving) {
                                    sprite.y += 1;
                                    this_1._movingLayer.addChild(sprite);
                                    this_1._movingDanger.push(sprite);
                                }
                                else {
                                    this_1._blockLayer.addChild(sprite);
                                    this_1._deathBlocks.push(sprite);
                                }
                            }
                            break;
                        case "XR":
                        case "R":
                            {
                                var moving = this_1._map[i][j] == "XR";
                                var sprite = this_1._materialFactory.createDanger(TProject.MaterialType.DANGER_RIGHT, j * TProject.GameConfig.BLOCK_SIZE, i * TProject.GameConfig.BLOCK_SIZE, moving);
                                this_1._blockLayer.addChild(sprite);
                                this_1._map[i][j] = 0;
                                if (moving) {
                                    sprite.y += 1;
                                    this_1._movingLayer.addChild(sprite);
                                    this_1._movingDanger.push(sprite);
                                }
                                else {
                                    this_1._blockLayer.addChild(sprite);
                                    this_1._deathBlocks.push(sprite);
                                }
                            }
                            break;
                        case "B":
                            {
                                var sprite = this_1._materialFactory.createDanger(TProject.MaterialType.DANGER_BOTTOM, j * TProject.GameConfig.BLOCK_SIZE, i * TProject.GameConfig.BLOCK_SIZE);
                                this_1._blockLayer.addChild(sprite);
                                this_1._map[i][j] = 0;
                                this_1._deathBlocks.push(sprite);
                            }
                            break;
                        case "XT":
                            {
                                var sprite = this_1._materialFactory.createDanger(TProject.MaterialType.DANGER_TOP, j * TProject.GameConfig.BLOCK_SIZE, i * TProject.GameConfig.BLOCK_SIZE, true);
                                this_1._blockLayer.addChild(sprite);
                                this_1._map[i][j] = 0;
                                sprite.y += 1;
                                this_1._movingLayer.addChild(sprite);
                                this_1._movingDanger.push(sprite);
                            }
                            break;
                        case "i":
                            {
                                var sprite = this_1._materialFactory.createMaterial(TProject.MaterialType.TELEPORT_IN, j * TProject.GameConfig.BLOCK_SIZE, i * TProject.GameConfig.BLOCK_SIZE);
                                var block = new TProject.Block(this_1.game, j * TProject.GameConfig.BLOCK_SIZE, i * TProject.GameConfig.BLOCK_SIZE);
                                block.sprite = sprite;
                                block.y += 2;
                                block.body.setSize(79, 79, -1, -1);
                                this_1.addChild(block);
                                this_1._map[i][j] = 0;
                                this_1._teleportIn = block;
                            }
                            break;
                        case "o":
                            {
                                var sprite = this_1._materialFactory.createMaterial(TProject.MaterialType.TELEPORT_OUT, j * TProject.GameConfig.BLOCK_SIZE, i * TProject.GameConfig.BLOCK_SIZE);
                                sprite.y += 2;
                                this_1.game.physics.enable(sprite, Phaser.Physics.ARCADE);
                                sprite.body.immovable = true;
                                this_1.addChild(sprite);
                                this_1._map[i][j] = 0;
                                this_1._teleportOut = sprite;
                            }
                            break;
                        default:
                            break;
                    }
                };
                for (var j = 0; j < TProject.GameConfig.MAP_COLS; j++) {
                    _loop_2(j);
                }
            };
            var this_1 = this;
            for (var i = 0; i < TProject.GameConfig.MAP_ROWS; i++) {
                _loop_1(i);
            }
            this._playerInitPosition.x = playerPosX;
            this._playerInitPosition.y = playerPosY;
        };
        Level.prototype.clean = function () {
            var _this = this;
            if (!this._initialized) {
                return;
            }
            this._initialized = false;
            this._map = [];
            for (var i = 0; i < this._blocks.length; i++) {
                for (var j = 0; j < this._blocks[i].length; j++) {
                    if (this._blocks[i][j]) {
                        this.removeChild(this._blocks[i][j]);
                        this._blocks[i][j].destroy();
                    }
                }
                this._blocks[i].length = 0;
            }
            this._blocks.length = 0;
            this._deathBlocks.forEach(function (x) {
                _this.removeChild(x);
                x.destroy();
            });
            this._deathBlocks.length = 0;
            this._movingDanger.forEach(function (x) {
                _this._movingLayer.removeChild(x);
                x.destroy();
            });
            this._movingDanger.length = 0;
            if (this._finishBlock) {
                this.removeChild(this._finishBlock);
                this._finishBlock.destroy();
                this._finishBlock = null;
            }
            if (this._teleportIn != null) {
                this.removeChild(this._teleportIn);
                this._teleportIn.destroy();
                this._teleportIn = null;
            }
            if (this._teleportOut != null) {
                this.removeChild(this._teleportOut);
                this._teleportOut.destroy();
                this._teleportOut = null;
            }
        };
        Level.prototype.update = function () {
            this._movingDanger.forEach(function (x) { return x.update(); });
        };
        return Level;
    }(Phaser.Sprite));
    TProject.Level = Level;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var MaterialType;
    (function (MaterialType) {
        MaterialType[MaterialType["PLAYER"] = 0] = "PLAYER";
        MaterialType[MaterialType["BLOCK_1"] = 1] = "BLOCK_1";
        MaterialType[MaterialType["BLOCK_2"] = 2] = "BLOCK_2";
        MaterialType[MaterialType["BLOCK_3"] = 3] = "BLOCK_3";
        MaterialType[MaterialType["BLOCK_4"] = 4] = "BLOCK_4";
        MaterialType[MaterialType["BLOCK_5"] = 5] = "BLOCK_5";
        MaterialType[MaterialType["METAL"] = 6] = "METAL";
        MaterialType[MaterialType["TELEPORT_IN"] = 7] = "TELEPORT_IN";
        MaterialType[MaterialType["TELEPORT_OUT"] = 8] = "TELEPORT_OUT";
        MaterialType[MaterialType["REVERSE"] = 9] = "REVERSE";
        MaterialType[MaterialType["FINISH"] = 10] = "FINISH";
        MaterialType[MaterialType["DANGER_TOP"] = 11] = "DANGER_TOP";
        MaterialType[MaterialType["DANGER_BOTTOM"] = 12] = "DANGER_BOTTOM";
        MaterialType[MaterialType["DANGER_LEFT"] = 13] = "DANGER_LEFT";
        MaterialType[MaterialType["DANGER_RIGHT"] = 14] = "DANGER_RIGHT";
    })(MaterialType = TProject.MaterialType || (TProject.MaterialType = {}));
    ;
    var Materail = (function () {
        function Materail(game) {
            this.game = game;
            this._spriteNames = new Array(15);
            this._spriteNames[MaterialType.BLOCK_1] = this.simpleBlock("block_10000");
            this._spriteNames[MaterialType.BLOCK_2] = this.simpleBlock("block_20000");
            this._spriteNames[MaterialType.BLOCK_3] = this.simpleBlock("block_30000");
            this._spriteNames[MaterialType.BLOCK_4] = this.simpleBlock("block_40000");
            this._spriteNames[MaterialType.BLOCK_5] = this.simpleBlock("block_50000");
            this._spriteNames[MaterialType.METAL] = this.simpleBlock("block_60000");
            this._spriteNames[MaterialType.TELEPORT_IN] = this.teleportBlock.bind(this);
            this._spriteNames[MaterialType.TELEPORT_OUT] = this.teleportBlock.bind(this);
            this._spriteNames[MaterialType.REVERSE] = this.reverseBlock.bind(this);
            this._spriteNames[MaterialType.FINISH] = this.finishBlock.bind(this);
        }
        Materail.prototype.createMaterial = function (material, x, y) {
            var sprite = this._spriteNames[material]();
            sprite.anchor.set(0.5, 0.5);
            sprite.x = x + 40;
            sprite.y = y + 40;
            return sprite;
        };
        Materail.prototype.simpleBlock = function (name) {
            var _this = this;
            return function () {
                return _this.game.add.sprite(0, 0, "LevelAssets", name);
            };
        };
        Materail.prototype.finishBlock = function () {
            var finish = this.game.add.sprite(0, 0, "LevelAssets", "finish_10001");
            finish.animations.add("idle", Phaser.Animation.generateFrameNames("finish_", 10001, 10005), 24, true);
            finish.animations.play("idle");
            return finish;
        };
        Materail.prototype.teleportBlock = function () {
            var teleport = this.game.add.sprite(0, 0, "LevelAssets", "block_70000");
            teleport.animations.add("play", Phaser.Animation.generateFrameNames("block_", 70000, 70008), TProject.GameConfig.TELEPORTATION_FRAMERATE, false);
            return teleport;
        };
        Materail.prototype.reverseBlock = function () {
            var reverse = this.game.add.sprite(0, 0, "LevelAssets", "block_80000");
            reverse.animations.add("play", Phaser.Animation.generateFrameNames("block_", 80000, 80024), TProject.GameConfig.REVERSE_FRAMERATE, false);
            reverse.animations.play("play", TProject.GameConfig.REVERSE_FRAMERATE, true);
            return reverse;
        };
        Materail.prototype.createDanger = function (material, x, y, moving) {
            if (moving === void 0) { moving = false; }
            var angle = 0;
            var dx = 0;
            var dy = 0;
            var w = TProject.GameConfig.BLOCK_SIZE;
            var h = TProject.GameConfig.BLOCK_SIZE / 2;
            var offsetX = 0;
            var offsetY = 0;
            var diraction = new Phaser.Point(0, 0);
            switch (material) {
                case MaterialType.DANGER_TOP:
                    angle = 180;
                    dx = TProject.GameConfig.BLOCK_SIZE;
                    dy = TProject.GameConfig.BLOCK_SIZE / 2;
                    diraction.y = -50;
                    w -= 5;
                    offsetX += 2;
                    y -= 2;
                    break;
                case MaterialType.DANGER_LEFT:
                    {
                        angle = -90;
                        dx = TProject.GameConfig.BLOCK_SIZE / 2;
                        dy = TProject.GameConfig.BLOCK_SIZE;
                        w = TProject.GameConfig.BLOCK_SIZE / 2;
                        h = TProject.GameConfig.BLOCK_SIZE;
                        offsetY = -TProject.GameConfig.BLOCK_SIZE;
                        diraction.x = 50;
                        offsetY += 4;
                        h -= 10;
                        dy += 0.5;
                        x += 2;
                        if (moving) {
                            offsetX += TProject.GameConfig.BLOCK_SIZE / 2;
                            offsetY += TProject.GameConfig.BLOCK_SIZE;
                        }
                    }
                    break;
                case MaterialType.DANGER_BOTTOM:
                    angle = 0;
                    dy = TProject.GameConfig.BLOCK_SIZE / 2;
                    w -= 5;
                    offsetX += 2;
                    dx -= 1;
                    y += 2;
                    break;
                case MaterialType.DANGER_RIGHT:
                    {
                        angle = 90;
                        x -= 2;
                        dx = TProject.GameConfig.BLOCK_SIZE / 2;
                        w = TProject.GameConfig.BLOCK_SIZE / 2;
                        h = TProject.GameConfig.BLOCK_SIZE;
                        offsetX = -TProject.GameConfig.BLOCK_SIZE / 2;
                        diraction.x = -50;
                        h -= 5;
                        offsetY += 5;
                        if (moving) {
                            dy -= 0.5;
                            offsetX = 0;
                        }
                    }
                    break;
                default:
                    break;
            }
            var x0 = x;
            var y0 = y;
            if (moving) {
                x0 = 0;
                y0 = 0;
            }
            var danger = this.game.add.sprite(x0 + dx, y0 + dy, "LevelAssets", "Danger_bottom0000");
            danger.width = 80;
            danger.height = 40;
            danger.angle = angle;
            if (moving) {
                var movingDanger = new TProject.MovingDanger(this.game, x, y);
                this.game.physics.enable(movingDanger, Phaser.Physics.ARCADE);
                movingDanger.body.setSize(w, h, offsetX, offsetY);
                movingDanger.body.immovable = true;
                movingDanger.setData(danger, diraction);
                return movingDanger;
            }
            else {
                this.game.physics.enable(danger, Phaser.Physics.ARCADE);
                danger.body.setSize(w, h, offsetX, offsetY);
                danger.body.immovable = true;
                return danger;
            }
        };
        return Materail;
    }());
    TProject.Materail = Materail;
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
    var DangerState;
    (function (DangerState) {
        DangerState[DangerState["INIT"] = 0] = "INIT";
        DangerState[DangerState["SHOW"] = 1] = "SHOW";
        DangerState[DangerState["MOVING_HIDE"] = 2] = "MOVING_HIDE";
        DangerState[DangerState["HIDE"] = 3] = "HIDE";
        DangerState[DangerState["MOVING_SHOW"] = 4] = "MOVING_SHOW";
    })(DangerState || (DangerState = {}));
    var MovingDanger = (function (_super) {
        __extends(MovingDanger, _super);
        function MovingDanger(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this._sprite = null;
            _this._state = DangerState.INIT;
            _this._timer = MovingDanger.SHOW_TIME;
            return _this;
        }
        MovingDanger.prototype.setData = function (sprite, hideDiraction) {
            var _this = this;
            this._sprite = sprite;
            this._diraction = hideDiraction;
            this._state = DangerState.SHOW;
            this.addChild(this._sprite);
            this._hideTween = this.game.add.tween(this).to({ x: this.x + hideDiraction.x, y: this.y + hideDiraction.y }, MovingDanger.MOVING_TIME, Phaser.Easing.Linear.None, false);
            this._hideTween.onComplete.add(function () {
                _this._state = DangerState.HIDE;
                _this._timer = MovingDanger.HIDE_TIME;
                _this.body.enable = false;
            });
            this._showTween = this.game.add.tween(this).to({ x: this.x, y: this.y }, MovingDanger.MOVING_TIME, Phaser.Easing.Linear.None, false);
            this._showTween.onComplete.add(function () {
                _this._state = DangerState.SHOW;
                _this._timer = MovingDanger.SHOW_TIME;
            });
        };
        MovingDanger.prototype.update = function () {
            var dt = this.game.time.elapsedMS;
            switch (this._state) {
                case DangerState.SHOW:
                    {
                        if (this._timer > 0) {
                            this._timer -= dt;
                        }
                        else {
                            this._state = DangerState.MOVING_HIDE;
                            this._hideTween.start();
                        }
                    }
                    break;
                case DangerState.HIDE: {
                    if (this._timer > 0) {
                        this._timer -= dt;
                    }
                    else {
                        this._state = DangerState.MOVING_SHOW;
                        this.body.enable = true;
                        this._showTween.start();
                    }
                }
                default:
                    break;
            }
        };
        return MovingDanger;
    }(Phaser.Sprite));
    MovingDanger.SHOW_TIME = 3000;
    MovingDanger.HIDE_TIME = 3000;
    MovingDanger.MOVING_TIME = 500;
    TProject.MovingDanger = MovingDanger;
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
        function Player(game, x, y, baseGame) {
            var _this = _super.call(this, game, x, y) || this;
            _this._baseGame = baseGame;
            _this._sprite = _this.game.add.sprite(0, 0, "Player", "CB_idle_10000");
            _this._sprite.width = 73.95;
            _this._sprite.height = 73.95;
            _this._sprite.anchor.set(0.5, 0.5);
            _this.addChild(_this._sprite);
            _this._eyes = _this.game.add.sprite(7, -15, "Player", "eyes_10000");
            _this._eyes.anchor.set(0.5, 0.5);
            _this._sprite.addChild(_this._eyes);
            _this._mouth = _this.game.add.sprite(7, 0, "Player", "mouth_10000");
            _this._mouth.anchor.set(0.5, 0.5);
            _this._sprite.addChild(_this._mouth);
            _this._eyebrows = _this.game.add.sprite(6, -24, "Player", "eyebrow_10000");
            _this._eyebrows.anchor.set(0.5, 0.5);
            _this._sprite.addChild(_this._eyebrows);
            _this._sprite.animations.add("idle", Phaser.Animation.generateFrameNames("CB_idle_", 10000, 10019), 24, true);
            _this._sprite.animations.add("die", Phaser.Animation.generateFrameNames("CB_die_", 10000, 10013), 24, false);
            _this._sprite.animations.add("win", Phaser.Animation.generateFrameNames("CB_win_", 10000, 10008), 24, false);
            _this._eyes.animations.add("idle", Phaser.Animation.generateFrameNames("eyes_", 10000, 10029), 24, true);
            _this._mouth.animations.add("idle", Phaser.Animation.generateFrameNames("mouth_", 10000, 10109), 24, true);
            _this._eyebrows.animations.add("idle", Phaser.Animation.generateFrameNames("eyebrow_", 10000, 10093), 24, true);
            _this._sprite.play("idle");
            _this._eyes.play("idle");
            _this._mouth.play("idle");
            _this._eyebrows.play("idle");
            _this._tempVelocity = new Phaser.Point(0, 0);
            _this._diraction = 1;
            _this._falling = false;
            _this._isMoving = true;
            _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
            _this.body.setSize(73.95, 80, -73.95 / 2, -43);
            _this.body.gravity.set(0, 800);
            _this.body.velocity.x = TProject.GameConfig.PLAYER_SPEED_X;
            _this._isJumping = false;
            _this._jumpTimer = 0;
            _this._savePosition = false;
            _this._sprite.inputEnabled = true;
            _this._sprite.events.onInputDown.add(function () {
                _this.jump();
            });
            if (TProject.GameConfig.PLAYER_SPEED_X < 100) {
                _this._rotationSpeed = 145 / 73.95 / 4;
            }
            else {
                _this._rotationSpeed = 145 / 73.95;
            }
            return _this;
        }
        Object.defineProperty(Player.prototype, "disableJump", {
            get: function () {
                return !this._sprite.inputEnabled;
            },
            set: function (val) {
                if (val) {
                    this._sprite.inputEnabled = false;
                }
                else {
                    this._sprite.inputEnabled = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.jump = function () {
            var _this = this;
            if (!this._isJumping && this._jumpTimer <= 0 && !this._falling && !this._baseGame.isPaused && this.body) {
                this.body.velocity.y = -405 + 50;
                this._isJumping = true;
                setTimeout(function () {
                    if (_this._isJumping)
                        TProject.SoundMixer.play("sound 642 (jump)", 0.2);
                }, 30);
                this._jumpTimer = 0.10;
            }
        };
        Player.prototype.win = function () {
            var _this = this;
            this._sprite.inputEnabled = false;
            this._sprite.events.onInputDown.removeAll();
            this._eyes.animations.stop("idle");
            this._mouth.animations.stop("idle");
            this._eyebrows.animations.stop("idle");
            this._eyes.visible = false;
            this._mouth.visible = false;
            this._eyebrows.visible = false;
            this._sprite.play("win").onComplete.addOnce(function () {
                _this._baseGame.hideOn(true);
            }, this);
            ;
            this._sprite.anchor.set(0.5);
        };
        Player.prototype.lose = function () {
            var _this = this;
            this._sprite.inputEnabled = false;
            this._sprite.events.onInputDown.removeAll();
            this._eyes.animations.stop("idle");
            this._mouth.animations.stop("idle");
            this._eyebrows.animations.stop("idle");
            this._eyes.visible = false;
            this._mouth.visible = false;
            this._eyebrows.visible = false;
            TProject.SoundMixer.play("sound 645 (dead_don)", 0.2);
            this._sprite.play("die").onComplete.addOnce(function () {
                _this._baseGame.hideOn();
            }, this);
            this._sprite.anchor.set(0.49, 0.36);
        };
        Player.prototype.setPause = function (pause) {
            if (pause) {
                this._tempVelocity.set(this.body.velocity.x, this.body.velocity.y);
                this.body.velocity.set(0);
                this.body.gravity.set(0);
            }
            else {
                this.body.velocity.set(this._tempVelocity.x, this._tempVelocity.y);
                this.body.gravity.set(0, 800);
            }
        };
        Object.defineProperty(Player.prototype, "jumping", {
            get: function () {
                return this._isJumping;
            },
            set: function (val) {
                this._isJumping = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "savePosition", {
            set: function (val) {
                this.body.gravity.set(0, 0);
                this._savePosition = val;
                this._pos = new Phaser.Point(this.x, this.y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "falling", {
            get: function () {
                return this._falling;
            },
            set: function (val) {
                this._falling = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "diraction", {
            get: function () {
                return this._diraction;
            },
            set: function (val) {
                this._diraction = val;
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.update = function () {
            var dt = this.game.time.elapsedMS / 1000;
            if (Math.abs(this.body.velocity.x) > 1) {
                this._sprite.rotation += this._rotationSpeed * dt * this._diraction;
            }
            if (this._jumpTimer > 0) {
                if (dt > 0.015) {
                    dt = 0.015;
                }
                this._jumpTimer -= dt;
                this.body.velocity.y = -300 * dt * 65;
            }
            if (this._savePosition) {
                this.x = this._pos.x;
                this.y = this._pos.y;
            }
        };
        Player.prototype.render = function () {
        };
        return Player;
    }(Phaser.Sprite));
    TProject.Player = Player;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var GameConfig = (function () {
        function GameConfig() {
        }
        return GameConfig;
    }());
    GameConfig.MAP_COLS = 9;
    GameConfig.MAP_ROWS = 6;
    GameConfig.BLOCK_SIZE = 80;
    GameConfig.TELEPORTATION_FRAMERATE = 24;
    GameConfig.REVERSE_FRAMERATE = 24;
    GameConfig.PLAYER_SPEED_X = 100;
    GameConfig.PINGUIN_SPAWN_TIME = 2;
    GameConfig.PINGUIN_SPEED = 75;
    GameConfig.MAGIC_SPEED = 240;
    GameConfig.PLAYER_SPPED_Y = 400;
    GameConfig.WIDTH = 720;
    GameConfig.HEIGHT = 480;
    GameConfig.LEVEL_MAP = [
        [
            [4, 4, 3, 4, 5, 4, 3, 4, 4],
            [3, 4, 4, 2, 3, 5, 5, 4, 3],
            [4, 3, 4, 4, 3, 4, 3, 3, 4],
            ["x", 0, 0, 5, 4, 3, 1, 4, 10],
            [4, 3, 5, 5, 4, 4, 5, 5, 3],
            [5, 5, 3, 3, 4, 3, 5, 4, 4]
        ],
        [
            [4, 3, 4, 3, 4, 3, 4, 4, 4],
            [4, 5, 5, 5, 4, 3, 3, 3, 5],
            ["x", 0, 0, 0, "L", 6, 5, 4, 5],
            [3, 3, 4, 4, 4, 10, 4, 5, 5],
            [5, 5, 3, 1, 5, 5, 2, 4, 3],
            [3, 5, 4, 3, 3, 4, 3, 3, 5]
        ],
        [
            [4, 3, 5, 3, 4, 2, 5, 3, 3],
            [5, 5, 5, 4, 4, 5, 5, 4, 4],
            [3, 4, 3, 0, 0, 0, 0, "L", 6],
            ["x", 0, 0, 0, 6, 4, 3, 4, 3],
            [4, 4, 3, 5, 5, "L", 6, 4, 10],
            [4, 3, 3, 5, 1, 3, 3, 4, 5]
        ],
        [
            [4, 4, 4, 3, 4, 3, 4, 3, 4],
            ["x", 0, "L", 6, 2, 3, 3, 4, 3],
            [4, 1, 3, 4, 5, 5, 4, 4, 3],
            [4, 3, 4, "L", 6, 5, 3, 10, 5],
            [5, 5, 4, 3, 5, 5, 6, 1, 4],
            [3, 5, 3, 4, 4, 3, 4, 3, 5]
        ],
        [
            [4, 5, 4, 3, 4, 4, 4, 5, 5],
            [5, 1, 5, 3, 3, 4, 3, "L", 6],
            [4, 5, 4, 4, 3, 6, 2, 5, 5],
            [4, 3, 3, 4, 6, 3, 4, 4, 10],
            ["x", 0, 6, 6, 3, 3, 4, 3, 4],
            [3, 3, 4, 5, 5, 5, 5, 3, 4]
        ],
        [
            [3, 3, 4, 4, 4, 5, 3, 4, 4],
            ["x", 0, 3, 1, 5, 3, 5, 4, 3],
            [4, 4, 4, 3, 6, "B", 6, 2, 6],
            [3, 4, 3, 3, 5, 6, 5, 3, 3],
            [3, 4, "L", 6, "R", 5, 4, 10, 4],
            [4, 2, 3, 4, 3, 4, 3, 3, 4]
        ],
        [
            [4, 4, 3, 4, 3, 4, 5, 5, 5],
            [3, 4, 3, 3, 4, 6, 4, 10, 3],
            [3, 5, 4, 5, 5, 1, 4, 5, "L"],
            ["x", 0, "L", 6, 4, 3, 3, 4, 3],
            [4, 5, 5, 5, 4, 4, "L", 6, 4],
            [2, 3, 5, 3, 5, 4, 5, 5, 4]
        ],
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            ["x", 0, 0, 0, 0, 0, 0, 10, 0],
            [6, 6, 6, 6, 6, 6, 6, 6, 6],
            [5, 5, 5, 5, 5, 5, 5, 5, 5]
        ],
        [
            [3, 4, 4, 3, 3, 4, 3, 3, 5],
            ["x", 0, 0, 0, 0, 0, 0, 4, 5],
            [6, 6, 6, 4, 0, 0, 0, 9, 3],
            [4, 4, 4, 3, 1, 3, 4, 4, 3],
            [5, 10, 3, 3, 4, 3, 3, 4, 3],
            [5, 5, 5, 2, 3, 4, 4, 3, 3]
        ],
        [
            [1, 3, 5, "x", 0, 3, 4, 4, 3],
            [4, 10, 4, 3, 0, 3, 3, 3, 4],
            [3, 4, 4, 3, 0, 0, "L", 6, 2],
            [5, 3, 4, 3, 4, 3, 4, 9, 3],
            [5, 4, 3, 4, 3, 3, 3, 4, 3],
            [3, 4, 1, 3, 5, 5, 5, 5, 5]
        ],
        [
            [3, 5, 5, 5, 3, 3, 4, 4, 5],
            [3, 3, 4, 4, 4, 2, 3, 3, 5],
            [1, 4, 6, 3, 4, 4, 4, "XL", 6],
            ["x", 0, 6, 4, "XL", 6, 6, 3, 3],
            [5, 3, 4, 4, 2, 6, 10, 3, 9],
            [5, 5, 4, 4, 4, 4, 5, 5, 5]
        ],
        [
            [3, 3, 5, "XL", 6, 4, 3, 4, 4],
            ["x", 0, 6, 3, 2, "XL", 6, 6, 1],
            [3, 6, 3, 6, 6, 4, 4, 9, 5],
            [3, 6, "XR", 4, 5, 5, 1, 6, 5],
            [6, 10, 3, 6, 3, 3, 3, 4, 3],
            [4, 3, 3, 4, 4, 3, 4, 5, 5]
        ],
        [
            [3, 3, 4, 4, 3, 3, 3, 4, 4],
            ["x", 0, "XL", 6, 3, 4, 3, 5, 5],
            [3, 5, 2, 6, "B", 1, "XL", 6, 4],
            [5, 5, 3, 6, 6, "XR", 3, 4, 9],
            [3, 3, 4, 6, 10, 3, 6, 3, 3],
            [3, 4, 4, 1, 3, 4, 4, 3, 4]
        ],
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            ["x", 0, 0, 0, 0, 10, 0, 0, 0],
            [5, 5, 5, 5, 5, 5, 5, 5, 5],
            [4, 4, 4, 4, 4, 4, 4, 4, 4]
        ],
        [
            [3, 5, 5, 5, 3, 3, 4, 4, 3],
            [4, 3, 4, 3, 3, 5, 5, 1, 3],
            ["x", 0, 0, 0, "i", 3, 4, 4, 3],
            [4, 4, 4, 3, 3, 3, 4, 4, 4],
            [3, 2, 3, 3, 3, "o", 0, 10, 5],
            [4, 3, 4, 3, 3, 3, 4, 4, 5]
        ],
        [
            [3, 3, 3, 3, 4, 4, 3, 3, 3],
            [4, 4, 6, "o", 0, "L", 6, 5, 5],
            [4, 4, 6, 5, 5, 5, 6, 1, 4],
            ["x", 1, "XT", "i", 6, 2, 4, 10, 4],
            [3, 6, 3, 3, 6, 4, "XL", 6, 4],
            [4, 4, 4, 3, 3, 3, 3, 3, 4]
        ],
        [
            [3, 4, 4, 6, 3, 6, 10, 0, "o"],
            ["x", 0, 4, "XT", 3, 6, 3, 1, 4],
            [6, 6, 6, 4, 4, "XT", 3, 4, 9],
            [2, "i", 6, 6, 6, "XR", 5, 5, 5],
            [3, 5, "XT", 5, 4, 4, 4, 3, 3],
            [3, 3, 4, 3, 4, 4, 3, 3, 3]
        ],
        [
            [10, 0, 4, 4, 4, 3, 3, 4, 3],
            [3, "o", 5, 5, 5, 1, 4, 6, 4],
            [4, 4, 4, 6, 3, 6, 4, "XT", 9],
            [4, "i", 6, "x", 2, "XT", 4, 3, 5],
            [5, 4, "XT", 4, 3, 6, 3, 3, 5],
            [5, 3, 4, 3, 3, 3, 4, 3, 5]
        ],
        [
            [3, "o", 6, 5, 5, 5, 6, 4, 3],
            [6, "XR", 6, 4, "x", 2, "XT", 3, 3],
            [3, 4, 6, 6, 4, 6, 3, 1, 4],
            [4, 3, "XT", 3, 6, 3, 6, 4, 3],
            [10, 5, 6, 3, 3, "i", 3, 4, 9],
            [5, 5, 4, 3, 4, 4, 5, 5, 5]
        ],
        [
            [4, 3, 6, 4, 4, 4, 3, 6, "o"],
            ["x", 1, "XT", 5, 5, 5, 4, 6, 0],
            [3, 6, 6, 3, 6, 4, 6, 10, 4],
            [4, "XT", 3, 2, 4, 4, "XT", 9, 3],
            [3, "i", 6, 6, "XR", 4, 4, 6, 3],
            [3, 4, 4, 4, 3, 3, 4, 3, 4]
        ],
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            ["x", 0, 0, 0, 0, 0, 0, 0, 0],
            [5, 5, 5, 5, 5, 5, 5, 5, 5],
            [4, 4, 4, 4, 4, 4, 4, 4, 4]
        ],
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    ];
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
    var SaveData = (function () {
        function SaveData() {
            this.currentLevel = 0;
            this.firstGame = true;
            this.playMusic = true;
            this.playSFX = true;
        }
        return SaveData;
    }());
    TProject.SaveData = SaveData;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var SoundMixer = (function () {
        function SoundMixer() {
        }
        SoundMixer.init = function (game) {
            SoundMixer._audio = game.add.audioSprite("sfx");
        };
        SoundMixer.play = function (key, volume, bgMusic, loop) {
            if (volume === void 0) { volume = 0.3; }
            if (bgMusic === void 0) { bgMusic = false; }
            if (loop === void 0) { loop = false; }
            if (TProject.Boot.GAME_DATA.playMusic == false) {
                if (bgMusic) {
                    SoundMixer._bgKey = key;
                    SoundMixer._bgVolume = volume;
                    return;
                }
            }
            if (bgMusic) {
                if (SoundMixer._bg) {
                    SoundMixer._bg.stop();
                }
                SoundMixer._bgKey = key;
                SoundMixer._bgVolume = volume;
                SoundMixer._bg = SoundMixer._audio.play(key, volume);
                SoundMixer._bg.allowMultiple = true;
                SoundMixer._bg.loop = true;
                return SoundMixer._bg;
            }
            else {
                if (TProject.Boot.GAME_DATA.playSFX) {
                    var s = SoundMixer._audio.play(key, volume);
                    s.allowMultiple = true;
                    s.loop = loop;
                    return s;
                }
            }
        };
        SoundMixer.bgStop = function () {
            SoundMixer._bg.stop();
        };
        SoundMixer.on = function () {
            if (SoundMixer._bgKey) {
                SoundMixer.play(SoundMixer._bgKey, SoundMixer._bgVolume, true, true);
            }
        };
        SoundMixer.off = function () {
            SoundMixer._audio.stop(null);
        };
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
})(Utils || (Utils = {}));

var TProject;
(function (TProject) {
    var LocalConfig = (function () {
        function LocalConfig() {
        }
        return LocalConfig;
    }());
    LocalConfig.CURRENT_STATE = "MainMenu";
    TProject.LocalConfig = LocalConfig;
})(TProject || (TProject = {}));

var TProject;
(function (TProject) {
    var Main = (function () {
        function Main() {
            this.game = new Phaser.Game(720, 480, Phaser.AUTO, "game_container", null, false);
            this.game.state.add("Boot", TProject.Boot, true);
            this.game.state.add("Preloader", TProject.Preloader);
            this.game.state.add("BaseGame", TProject.BaseGame);
            this.game.state.add("MainMenu", TProject.MainMenu);
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
    var GameStates;
    (function (GameStates) {
        GameStates[GameStates["INIT_LEVEL"] = 0] = "INIT_LEVEL";
        GameStates[GameStates["RUN"] = 1] = "RUN";
        GameStates[GameStates["GAME_OVER"] = 2] = "GAME_OVER";
        GameStates[GameStates["WIN"] = 3] = "WIN";
    })(GameStates = TProject.GameStates || (TProject.GameStates = {}));
    ;
    var BaseGame = (function (_super) {
        __extends(BaseGame, _super);
        function BaseGame() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BaseGame.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this._container = this.game.add.sprite(0, 0);
            this.setDebugMode();
            this._bg = this.game.add.sprite(0, 0, "Menu", "bg");
            this._mountBoss = this.game.add.sprite(-24, 167, "Menu", "BossMount");
            this._bg.addChild(this._mountBoss);
            this._mountBoss.visible = false;
            this._currentLevel = TProject.Boot.GAME_DATA.currentLevel;
            this._level = new TProject.Level(this.game, 0, 0);
            this.world.addChild(this._container);
            this._container.addChild(this._level);
            this._gameUI = new TProject.GameUI(this.game, 0, 0, this);
            this.world.addChild(this._gameUI);
            this._state = GameStates.INIT_LEVEL;
            this._bossFightFactory = new TProject.BossFightFactory(this.game);
            this._spawTimer = 1;
            this._spawnPinguinRight = true;
            this._iceking = null;
            this.setPause(true);
            setTimeout(function () {
                _this._gameUI.initialFirstLevel(_this._currentLevel);
            }, 200);
        };
        Object.defineProperty(BaseGame.prototype, "currentPlayerCoordinates", {
            get: function () {
                var dir = this._player.diraction;
                var res = new Phaser.Point(this._player.x, this._player.y);
                res.x = Math.max(Math.floor((res.x - dir * 73.95 / 2) / 80), 0);
                res.y = Math.max(Math.floor((res.y - 73.95 / 2) / 80), 0);
                return res;
            },
            enumerable: true,
            configurable: true
        });
        BaseGame.prototype.updatePlayer = function (dt) {
            this._player.update();
            var mapPlayerLocation = this.currentPlayerCoordinates;
            var dir = this._player.diraction;
            if (mapPlayerLocation.y == 0) {
                this._player.disableJump = true;
            }
            else {
                if (this._player.disableJump) {
                    this._player.disableJump = false;
                }
            }
            if (mapPlayerLocation.x + dir < TProject.GameConfig.MAP_COLS && mapPlayerLocation.x + dir >= 0 && this._currentMap[mapPlayerLocation.y][mapPlayerLocation.x + dir] != 0) {
                this._blockHorizontal = this._level.blocks[mapPlayerLocation.y][mapPlayerLocation.x + dir];
                if (this._blockHorizontal.name == "TYPE_10") {
                    this._player.body.velocity.x = dir * TProject.GameConfig.PLAYER_SPEED_X;
                }
                if (this._blockHorizontal.name == "TYPE_9" && dir > 0 && Math.abs(this._blockHorizontal.x - this._player.x - 73.95 / 2) < 0.1) {
                    this._player.diraction = -this._player.diraction;
                }
            }
            else if (this._player.body.velocity.x < TProject.GameConfig.PLAYER_SPEED_X) {
                if (!this._player.falling) {
                    this._player.body.velocity.x = dir * TProject.GameConfig.PLAYER_SPEED_X;
                }
                this._blockHorizontal = null;
            }
            if (mapPlayerLocation.y + 1 < TProject.GameConfig.MAP_ROWS && mapPlayerLocation.x + dir >= 0 && mapPlayerLocation.x + dir < TProject.GameConfig.MAP_COLS && this._currentMap[mapPlayerLocation.y + 1][mapPlayerLocation.x + dir] != 0) {
                this._blockVert1 = this._level.blocks[mapPlayerLocation.y + 1][mapPlayerLocation.x + dir];
            }
            var i = mapPlayerLocation.y + 1;
            while (i < TProject.GameConfig.MAP_ROWS && this._currentMap[i][mapPlayerLocation.x] == 0) {
                i++;
            }
            if (i < TProject.GameConfig.MAP_ROWS) {
                this._blockVert2 = this._level.blocks[i][mapPlayerLocation.x];
                if (this._blockVert1 == this._blockVert2) {
                    this._blockVert1 = null;
                }
            }
            if (mapPlayerLocation.y + 1 < TProject.GameConfig.MAP_ROWS && this._currentMap[mapPlayerLocation.y + 1][mapPlayerLocation.x] == 0 && !this._player.jumping && !this._collideVert1) {
                this._player.body.velocity.y = TProject.GameConfig.PLAYER_SPPED_Y;
                if (!this._player.falling) {
                    this._player.y += 10;
                    this._player.falling = true;
                }
            }
            this._collideVert1 = false;
            if (mapPlayerLocation.y > 0 && this._currentMap[mapPlayerLocation.y - 1][mapPlayerLocation.x] != 0) {
                this._blockVertUp1 = this._level.blocks[mapPlayerLocation.y - 1][mapPlayerLocation.x];
            }
            if (mapPlayerLocation.y > 0 && this.isPositionXAllowed(mapPlayerLocation.x) && this._currentMap[mapPlayerLocation.y - 1][mapPlayerLocation.x + dir] != 0) {
                this._blockVertUp2 = this._level.blocks[mapPlayerLocation.y - 1][mapPlayerLocation.x + dir];
            }
            if (this._player.x > TProject.GameConfig.WIDTH || this._player.x < 0 || this._player.y + 73.95 / 2 > TProject.GameConfig.HEIGHT) {
                this._state = GameStates.GAME_OVER;
                this._player.body.gravity.set(0, 0);
                this._player.body.immovable = true;
                this._player.body.moves = false;
                this._player.savePosition = true;
            }
        };
        BaseGame.prototype.isPositionXAllowed = function (x) {
            var dir = this._player.diraction;
            return (x + dir) >= 0 && (x + dir) < TProject.GameConfig.MAP_COLS;
        };
        BaseGame.prototype.pauseBossGame = function (val) {
            if (this._iceking) {
                this._iceking.pause = val;
            }
            this._deathBlocks.forEach(function (x) {
                x.visible = !val;
                if (x.body) {
                    x.body.enable = !val;
                }
            });
        };
        BaseGame.prototype.detectCollisions = function () {
            var _this = this;
            if (this._deathBlocks.length > 0) {
                this.game.physics.arcade.overlap(this._player, this._deathBlocks, function () {
                    _this._state = GameStates.GAME_OVER;
                });
            }
            if (this._level.teleportIn != null) {
                var teleportIn_1 = this._level.teleportIn;
                var teleportOut_1 = this._level.teleportOut;
                this.game.physics.arcade.overlap(this._player, teleportIn_1, function () {
                    _this._player.x = teleportOut_1.x;
                    _this._player.y = teleportOut_1.y;
                    teleportIn_1.play("play", TProject.GameConfig.TELEPORTATION_FRAMERATE, false);
                    teleportOut_1.play("play", TProject.GameConfig.TELEPORTATION_FRAMERATE, false);
                });
            }
            if (this._blockVert1) {
                this.game.physics.arcade.collide(this._player, this._blockVert1, function () {
                    _this._collideVert1 = true;
                    if (_this._player.falling) {
                        _this._player.falling = false;
                    }
                    if (_this._currentLevel == 13 && _this._player.jumping) {
                        _this._player.jumping = false;
                    }
                });
            }
            if (this._blockVert2) {
                this.game.physics.arcade.collide(this._player, this._blockVert2, function () {
                    if (_this._player.jumping) {
                        _this._player.jumping = false;
                    }
                    if (_this._player.falling) {
                        _this._player.falling = false;
                    }
                });
            }
            this.game.physics.arcade.overlap(this._player, this._level.finishBlock, function () {
                _this._state = GameStates.WIN;
            });
            if (this._blockHorizontal) {
                this.game.physics.arcade.collide(this._player, this._blockHorizontal, function (player, block) {
                    switch (block.name) {
                        case "TYPE_10":
                            {
                                _this._state = GameStates.WIN;
                            }
                            break;
                        case "TYPE_9":
                            {
                                _this._player.diraction = -_this._player.diraction;
                            }
                            break;
                        default:
                            {
                                if (_this._player.diraction > 0) {
                                    _this._player.x = block.x - 73.95 / 2;
                                }
                                else {
                                    _this._player.x = block.x + TProject.GameConfig.BLOCK_SIZE + 73.95 / 2;
                                }
                            }
                            break;
                    }
                });
            }
            if (this._blockVertUp1) {
                this.game.physics.arcade.collide(this._player, this._blockVertUp1);
            }
            if (this._blockVertUp2) {
                this.game.physics.arcade.collide(this._player, this._blockVertUp2);
            }
        };
        BaseGame.prototype.bossFight1 = function (dt) {
            if (this._spawTimer > 0) {
                this._spawTimer -= dt;
            }
            else {
                if (this._player.x > 200) {
                    this._spawTimer = Utils.randomRange(this._minTimeSpawn, this._maxTimeSpawn) / 2;
                    this._spawnPinguinRight = !this._spawnPinguinRight;
                }
                else {
                    this._spawTimer = Utils.randomRange(this._minTimeSpawn, this._maxTimeSpawn);
                }
                var sprite = this._bossFightFactory.spawnPinguin(this._spawnPinguinRight);
                this._deathBlocks.push(sprite);
                this._container.addChild(sprite);
            }
        };
        BaseGame.prototype.bossFight2 = function (dt) {
            this._iceking.update();
            while (this._deathBlocks.length > 0 && this._deathBlocks[0].x < -80) {
                var sprite = this._deathBlocks.shift();
                this._container.removeChild(sprite);
                sprite.destroy();
            }
        };
        BaseGame.prototype.bossFight3 = function (dt) {
            this.bossFight1(dt);
            this.bossFight2(dt);
        };
        BaseGame.prototype.cleanFight1 = function () {
            var _this = this;
            this._deathBlocks.forEach(function (x) {
                _this._container.removeChild(x);
                x.destroy();
            });
            this._deathBlocks.length = 0;
            if (this._iceking) {
                this._container.removeChild(this._container);
                this._iceking.destroy();
                this._iceking = null;
            }
            if (this._iceBlock) {
                this._container.removeChild(this._iceBlock);
                this._iceBlock.destroy();
                this._iceBlock = null;
            }
        };
        BaseGame.prototype.update = function () {
            if (this.isPaused) {
                return;
            }
            var dt = this.game.time.elapsedMS / 1000;
            switch (this._state) {
                case GameStates.INIT_LEVEL:
                    {
                    }
                    break;
                case GameStates.RUN:
                    {
                        this._level.update();
                        this.updatePlayer(dt);
                        switch (this._currentLevel) {
                            case 7:
                                this.bossFight1(dt);
                                break;
                            case 13:
                                this.bossFight2(dt);
                                break;
                            case 20:
                                this.bossFight3(dt);
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                case GameStates.GAME_OVER:
                    {
                        if (this._player.body) {
                            this.game.input.onDown.removeAll();
                            if (this._iceBlock) {
                                this._iceBlock.disableInput = true;
                            }
                            this._gameUI.offMenuBtn();
                            this._player.update();
                            this._player.lose();
                            this._player.body.destroy();
                        }
                    }
                    break;
                case GameStates.WIN:
                    {
                        if (this._player.body) {
                            if (this._iceBlock) {
                                this._iceBlock.disableInput = true;
                            }
                            this._gameUI.offMenuBtn();
                            this._player.win();
                            this._player.body.destroy();
                            this._currentLevel++;
                            TProject.Boot.GAME_DATA.currentLevel = this._currentLevel;
                            TProject.SaveManager.getInstance.save();
                            TProject.SoundMixer.play("sound 643 (finish)", 0.2);
                        }
                    }
                    break;
                default:
                    break;
            }
            this.detectCollisions();
            _super.prototype.update.call(this);
        };
        BaseGame.prototype.getMap = function () {
            return TProject.GameConfig.LEVEL_MAP[this._currentLevel].map(function (arr) {
                return arr.slice();
            });
        };
        BaseGame.prototype.loadLevel = function () {
            var _this = this;
            if (this._boosFight) {
                this.game.input.onDown.removeAll();
                this.cleanFight1();
            }
            if (this._currentLevel == 13) {
                this.game.input.onDown.add(function (pointer) {
                    if (!_this.isPaused && pointer.y > 50) {
                        _this._player.jump();
                    }
                });
            }
            if (this._currentLevel == 20) {
                this.game.input.onDown.add(function (pointer) {
                    if (!_this.isPaused && pointer.y > 50) {
                        var hitSomething = false;
                        for (var i = 1; i < _this._deathBlocks.length; i++) {
                            if (_this._deathBlocks[i].name == "magic") {
                                continue;
                            }
                            if (_this._deathBlocks[i].body) {
                                hitSomething = hitSomething || Phaser.Rectangle.contains(_this._deathBlocks[i].body, pointer.x, pointer.y);
                                if (hitSomething) {
                                    break;
                                }
                            }
                        }
                        var inputHandler = _this.game.input.activePointer.targetObject;
                        if (!hitSomething && inputHandler == null) {
                            _this._player.jump();
                        }
                    }
                });
            }
            this._level.clean();
            this._spawnPinguinRight = true;
            this._gameUI.hideTutorial();
            if (this.isPaused)
                this.setPause(false);
            if (this._currentLevel == 7 || this._currentLevel == 13) {
                TProject.GameConfig.PLAYER_SPEED_X = 100 / 4.25;
                this._mountBoss.visible = true;
                this._level.disableDestroying = true;
                TProject.GameConfig.MAGIC_SPEED = 10 * 30;
                this._boosFight = true;
            }
            else if (this._currentLevel == 20) {
                TProject.GameConfig.PLAYER_SPEED_X = 0;
                this._boosFight = true;
                TProject.GameConfig.MAGIC_SPEED = 11 * 30;
                this._level.disableDestroying = true;
                this._mountBoss.visible = true;
                this._minTimeSpawn = 110 * 30 / 1000;
                this._maxTimeSpawn = 150 * 30 / 1000;
            }
            else {
                TProject.GameConfig.PLAYER_SPEED_X = 100;
                this._mountBoss.visible = false;
                this._level.disableDestroying = false;
                this._boosFight = false;
            }
            this._currentMap = this.getMap();
            this._level.level = this._currentMap;
            var playerPos = this._level.playerInitlPosition;
            if (this._player) {
                this._container.removeChild(this._player);
                this._player.destroy();
            }
            this._player = new TProject.Player(this.game, playerPos.x, playerPos.y, this);
            if (this._currentLevel == 7) {
                this._minTimeSpawn = 45 * 30 / 1000;
                this._maxTimeSpawn = 65 * 30 / 1000;
                this._player.disableJump = true;
            }
            this._container.addChild(this._player);
            this._deathBlocks = this._level.deathBlocks.concat(this._level.movingDanger);
            if (this._currentLevel == 13 || this._currentLevel == 20) {
                this._iceking = this._bossFightFactory.createIceking();
                this._iceking.zap = function () {
                    var sprite = _this._bossFightFactory.spawnMagicBall();
                    _this._container.addChild(sprite);
                    _this._deathBlocks.push(sprite);
                };
                this._container.addChild(this._iceking);
                if (this._currentLevel == 20) {
                    this._iceking.setTimer(90 * 30, 150 * 30);
                    this._iceBlock = new TProject.IceBlock(this.game, 80 * 2, TProject.GameConfig.HEIGHT - 2 * TProject.GameConfig.BLOCK_SIZE + 10);
                    this._iceBlock.completeAnimationCallback = function () {
                        _this.game.input.onDown.removeAll();
                        _this._deathBlocks.forEach(function (x) {
                            if (x.body) {
                                x.inputEnabled = false;
                                x.body.enable = false;
                            }
                        });
                        _this._state = GameStates.WIN;
                    };
                    this._container.addChild(this._iceBlock);
                }
            }
            this._gameUI.readyToRestart();
            this._state = GameStates.RUN;
            this._gameUI.showTutorial(this._currentLevel);
        };
        BaseGame.prototype.hideOn = function (isNewLevel) {
            if (isNewLevel === void 0) { isNewLevel = false; }
            this._gameUI.endGame(this._currentLevel, isNewLevel);
        };
        BaseGame.prototype.openMenu = function () {
            this.setPause(true);
            this._player.setPause(true);
            this._player.visible = false;
            this._level.menuOver = true;
            if (this._iceBlock) {
                this._iceBlock.visible = false;
                this._iceBlock.disableInput = true;
            }
        };
        BaseGame.prototype.closeMenu = function (doNotTouchPlayer) {
            if (doNotTouchPlayer === void 0) { doNotTouchPlayer = false; }
            this.setPause(false);
            if (!doNotTouchPlayer) {
                this._player.setPause(false);
                this._player.visible = true;
                if (this._iceBlock) {
                    this._iceBlock.visible = true;
                    this._iceBlock.disableInput = false;
                }
            }
            this._level.menuOver = false;
        };
        BaseGame.prototype.endGame = function () {
            this._currentLevel = 0;
        };
        BaseGame.prototype.render = function () {
            _super.prototype.render.call(this);
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
            this.initSaveManager();
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
        Boot.prototype.initSaveManager = function () {
            TProject.SaveManager.getInstance.init("OneSweetRoll_01", Boot.GAME_DATA);
            Boot.GAME_DATA = TProject.SaveManager.getInstance.load();
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
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MainMenu.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            this.setDebugMode();
            this._easterEggCount = 0;
            this._bg = this.game.add.sprite(0, 0, "Menu", "bg");
            this._mount = this.game.add.sprite(-24, 326, "Menu", "BossMount");
            this._bgContainer = this.game.add.sprite(0, 10, "Menu", "Main_page_mc");
            this._creditsBG = this.game.add.sprite(2, 2, "Menu", "Credits_page_mc");
            this._newGame = this.game.add.sprite(375, 394, "Menu", "new_btn_10001");
            this._newGame.animations.add("over", Phaser.Animation.generateFrameNames("new_btn_", 10001, 10007), 24, false);
            this._continue = this.game.add.sprite(136, 406, "Menu", "cont_btn_10001");
            this._continue.animations.add("over", Phaser.Animation.generateFrameNames("cont_btn_", 10001, 10007), 24, false);
            this._credits = this.game.add.sprite(6, 444, "Menu", "credits_right_10001");
            this._credits.animations.add("over", Phaser.Animation.generateFrameNames("credits_right_", 10001, 10007), 24, false);
            this._fishSpace = this.game.add.graphics(233, 84);
            this._fishSpace.beginFill(0x696969, 0);
            this._fishSpace.drawRect(0, 0, 280, 100);
            this._fishSpace.endFill();
            this._fishSpace.inputEnabled = false;
            this._fishSpace.events.onInputDown.add(function () {
                _this._easterEggCount++;
                if (_this._easterEggCount == 5) {
                    _this.game.add.tween(_this._portedPlank).to({ x: -30 }, 300, Phaser.Easing.Sinusoidal.Out, true);
                }
            }, this);
            this._portedPlank = this.game.add.sprite(-300, 375, "Menu", "credits_port");
            this._portedPlank.scale.set(0.85);
            this._portedPlank.visible = false;
            this._soundBtn = this.game.add.sprite(673, 6, "Menu", "Sound_button_mc");
            this._backToMenu = this.game.add.sprite(673, 6, "Menu", "Gomenu_button");
            if (!TProject.Boot.GAME_DATA.playMusic) {
                this._soundBtn.alpha = 0.5;
            }
            TProject.SoundMixer.play("sound 647 (maintheme)", 0.2, true, true);
            this._soundBtn.inputEnabled = true;
            this._soundBtn.events.onInputDown.add(function () {
                if (_this._soundBtn.alpha == 1) {
                    _this._soundBtn.alpha = 0.5;
                    TProject.Boot.GAME_DATA.playMusic = false;
                    TProject.Boot.GAME_DATA.playSFX = false;
                    TProject.SaveManager.getInstance.save();
                    TProject.SoundMixer.off();
                }
                else {
                    _this._soundBtn.alpha = 1;
                    TProject.Boot.GAME_DATA.playMusic = true;
                    TProject.Boot.GAME_DATA.playSFX = true;
                    TProject.SaveManager.getInstance.save();
                    TProject.SoundMixer.on();
                }
            }, this);
            this._continue.inputEnabled = true;
            this._continue.events.onInputOver.add(function () { _this._continue.play("over"); }, this);
            this._continue.events.onInputDown.add(function () {
                _this.startGame();
            }, this);
            if (TProject.Boot.GAME_DATA.firstGame) {
                this._continue.inputEnabled = false;
                this._continue.visible = false;
            }
            this._newGame.inputEnabled = true;
            this._newGame.events.onInputOver.add(function () { _this._newGame.play("over"); }, this);
            this._newGame.events.onInputDown.add(function () {
                TProject.Boot.GAME_DATA.currentLevel = 0;
                TProject.SaveManager.getInstance.save();
                _this.startGame();
            }, this);
            this._credits.inputEnabled = true;
            this._credits.events.onInputOver.add(function () { _this._credits.play("over"); }, this);
            this._credits.events.onInputDown.add(function () {
                _this._credits.inputEnabled = false;
                _this._newGame.inputEnabled = false;
                _this._continue.inputEnabled = false;
                _this._soundBtn.inputEnabled = false;
                _this.splashOn(function () {
                    _this._easterEggCount = 0;
                    _this._bgContainer.visible = false;
                    _this._newGame.visible = false;
                    _this._continue.visible = false;
                    _this._soundBtn.visible = false;
                    _this._credits.visible = false;
                    _this._creditsBG.visible = false;
                    _this._portedPlank.visible = true;
                    _this._portedPlank.position.set(-300, 376);
                    _this._creditsBG.visible = true;
                    _this._backToMenu.visible = true;
                    setTimeout(function () {
                        _this.splashOff(function () {
                            _this._backToMenu.inputEnabled = true;
                            _this._fishSpace.inputEnabled = true;
                        });
                    }, 300);
                });
            }, this);
            this._backToMenu.inputEnabled = false;
            this._backToMenu.events.onInputOver.add(function () { _this._credits.play("over"); }, this);
            this._backToMenu.events.onInputDown.add(function () {
                _this._backToMenu.inputEnabled = false;
                _this._fishSpace.inputEnabled = false;
                _this.splashOn(function () {
                    _this._bgContainer.visible = true;
                    _this._newGame.visible = true;
                    if (!TProject.Boot.GAME_DATA.firstGame) {
                        _this._continue.visible = true;
                    }
                    _this._soundBtn.visible = true;
                    _this._credits.visible = true;
                    _this._creditsBG.visible = true;
                    _this._creditsBG.visible = false;
                    _this._backToMenu.visible = false;
                    _this._portedPlank.visible = false;
                    _this._portedPlank.position.set(-300, 376);
                    setTimeout(function () {
                        _this.splashOff(function () {
                            _this._credits.inputEnabled = true;
                            _this._newGame.inputEnabled = true;
                            if (!TProject.Boot.GAME_DATA.firstGame) {
                                _this._continue.inputEnabled = true;
                            }
                            _this._continue.inputEnabled = true;
                            _this._soundBtn.inputEnabled = true;
                        });
                    }, 300);
                });
            }, this);
            this._bg.addChild(this._mount);
            this._bg.addChild(this._bgContainer);
            this._bg.addChild(this._newGame);
            this._bg.addChild(this._continue);
            this._bg.addChild(this._credits);
            this._bg.addChild(this._soundBtn);
            this._bg.addChild(this._creditsBG);
            this._bg.addChild(this._backToMenu);
            this._bg.addChild(this._fishSpace);
            this._bg.addChild(this._portedPlank);
            this._creditsBG.visible = false;
            this._backToMenu.visible = false;
            this.createSplash();
            this._credits.inputEnabled = false;
            this._newGame.inputEnabled = false;
            this._continue.inputEnabled = false;
            this._soundBtn.inputEnabled = false;
            setTimeout(function () {
                _this.initialMenu();
            }, 150);
        };
        MainMenu.prototype.initialMenu = function () {
            var _this = this;
            this.game.add.tween(this._finnSplash).to({ x: -190 }, 300, Phaser.Easing.Linear.None, true);
            this.game.add.tween(this._jakeSplash).to({ x: 930 }, 300, Phaser.Easing.Linear.None, true).onComplete.addOnce(function () {
                _this._credits.inputEnabled = true;
                _this._newGame.inputEnabled = true;
                if (!TProject.Boot.GAME_DATA.firstGame) {
                    _this._continue.inputEnabled = true;
                }
                _this._soundBtn.inputEnabled = true;
            }, this);
        };
        MainMenu.prototype.startGame = function () {
            var _this = this;
            this.splashOn(function () {
                if (TProject.Boot.GAME_DATA.firstGame) {
                    TProject.Boot.GAME_DATA.firstGame = false;
                    TProject.SaveManager.getInstance.save();
                }
                _this._bgContainer.visible = false;
                _this._newGame.visible = false;
                _this._continue.visible = false;
                _this._soundBtn.visible = false;
                _this._credits.visible = false;
                _this._creditsBG.visible = false;
                _this._credits.inputEnabled = false;
                _this.game.state.start("BaseGame", true);
            });
        };
        MainMenu.prototype.createSplash = function () {
            this._finnSplash = this.game.add.sprite(163, 245, "Menu", "fin_splash");
            this._finnSplash.anchor.set(0.5, 0.5);
            this._bg.addChild(this._finnSplash);
            this._jakeSplash = this.game.add.sprite(519, 245, "Menu", "jake_splash");
            this._jakeSplash.anchor.set(0.5, 0.5);
            this._bg.addChild(this._jakeSplash);
            this._finnSplash.scale.set(1.05);
            this._jakeSplash.scale.set(1.05);
        };
        MainMenu.prototype.splashOn = function (cb) {
            this._finnSplash.position.set(163, -256);
            this._jakeSplash.position.set(519, 735);
            this.game.add.tween(this._finnSplash).to({ y: 245 }, 300, Phaser.Easing.Linear.None, true);
            this.game.add.tween(this._jakeSplash).to({ y: 245 }, 300, Phaser.Easing.Linear.None, true).onComplete.addOnce(function () {
                cb();
            }, this);
        };
        MainMenu.prototype.splashOff = function (cb) {
            this.game.add.tween(this._finnSplash).to({ x: -190 }, 300, Phaser.Easing.Linear.None, true);
            this.game.add.tween(this._jakeSplash).to({ x: 930 }, 300, Phaser.Easing.Linear.None, true).onComplete.addOnce(function () {
                cb();
            }, this);
        };
        return MainMenu;
    }(TProject.AbstractGame));
    TProject.MainMenu = MainMenu;
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
            _this._loadedFont = true;
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
            this._loadedFont = true;
            this.game.load.atlas("LevelAssets", TProject.Boot.PATH_IMAGES + "blocks.png", TProject.Boot.PATH_IMAGES + "blocks.json");
            this.game.load.atlas("Boss", TProject.Boot.PATH_IMAGES + "boss.png", TProject.Boot.PATH_IMAGES + "boss.json");
            this.game.load.atlas("Player", TProject.Boot.PATH_IMAGES + "player.png", TProject.Boot.PATH_IMAGES + "player.json");
            this.game.load.atlas("Menu", TProject.Boot.PATH_IMAGES + "gui.png", TProject.Boot.PATH_IMAGES + "gui.json");
            this.game.load.atlas("Comics", TProject.Boot.PATH_IMAGES + "comics.png", TProject.Boot.PATH_IMAGES + "comics.json");
            this.game.load.audiosprite("sfx", [TProject.Boot.PATH_SOUNDS + "sfx.mp3", TProject.Boot.PATH_SOUNDS + "sfx.ogg"], TProject.Boot.PATH_SOUNDS + "sfx.json");
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
                dragonBones.PhaserFactory.startLoop();
                this._loadedAssets = true;
                TProject.SoundMixer.init(this.game);
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
