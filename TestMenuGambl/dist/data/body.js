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
        DBSprite.prototype.stopInteractive = function () {
            this._eventsBounds.inputEnabled = false;
        };
        DBSprite.prototype.addEvent = function (type, listener, target) {
            this._visual.addEvent(type, listener, target ? target : this);
        };
        DBSprite.prototype.removeEvent = function (type, listener) {
            this._visual.removeEvent(type, listener, null);
        };
        DBSprite.prototype.play = function (name, playTimes) {
            return this._visual.animation.play(name, playTimes);
        };
        DBSprite.prototype.playEx = function (name, nextState, complete, contex) {
            this._nextState = nextState;
            this._cb = complete;
            this._cbContex = contex ? contex : this;
            if (nextState || complete) {
                this.addEvent("complete", this.completePlaying);
                this.addEvent("loopComplete", this.completePlaying);
            }
            return this.play(name);
        };
        DBSprite.prototype.completePlaying = function (e) {
            this.removeEvent("complete", this.completePlaying);
            this.removeEvent("loopComplete", this.completePlaying);
            if (this._nextState) {
                this.play(this._nextState);
            }
            this._nextState = null;
            if (typeof this._cb === "function") {
                this._cb.bind(this._cbContex)();
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

var GamesConfig;
(function (GamesConfig) {
    var TugGame = (function () {
        function TugGame() {
        }
        return TugGame;
    }());
    TugGame.effortLow = 0.33;
    TugGame.effortOpt = 0.5;
    TugGame.effortHigh = 0.66;
    TugGame.effort = [
        [0.070, 0.2],
        [0.085, 0.2],
        [0.100, 0.3]
    ];
    TugGame.strengthAtLow = 35;
    TugGame.strengthAtOpt = 100;
    TugGame.strengthAtHigh = 45;
    TugGame.strengthToSpeed = 0.5;
    TugGame.maxRounds = 5;
    TugGame.checkTime = 0.25;
    TugGame.moveDistance = 15;
    TugGame.moveTime = 1;
    TugGame.moveTransition = "easeOutElastic";
    TugGame.iaMashTimeMin = [0.30, 0.10, 0.10];
    TugGame.iaMashTimeMax = [0.27, 0.17, 0.17];
    TugGame.iaCheckTimeMin = [0.9, 0.7, 0.4];
    TugGame.iaCheckTimeMax = [1, 0.8, 0.5];
    TugGame.iaBalance = [1, 1, 1.5, 2, 2.5];
    TugGame.loseGroundSoundTime = 0.1;
    TugGame.gumballLoseGroundSoundsIds = ["tug_gumball_lose_ground1", "tug_gumball_lose_ground2"];
    TugGame.gumballLoseGroundSoundsChances = [50, 50];
    TugGame.darwinLoseGroundSoundsIds = ["tug_darwin_lose_ground1", "tug_darwin_lose_ground2"];
    TugGame.darwinLoseGroundSoundsChances = [50, 50];
    TugGame.teamPullSoundTime = 0.1;
    TugGame.gumballPullSoundsIds = ["tug_pullteam1_1", "tug_pullteam1_2", "tug_pullteam1_3"];
    TugGame.gumballPullSoundsChances = [30, 30, 30];
    TugGame.darwinPullSoundsIds = ["tug_pullteam2_1", "tug_pullteam2_2", "tug_pullteam2_3"];
    TugGame.darwinPullSoundsChances = [30, 30, 30];
    TugGame.bgm = "bgm_games3";
    TugGame.fanfare = "fanfare";
    TugGame.win = "win";
    TugGame.lose = "lose";
    GamesConfig.TugGame = TugGame;
})(GamesConfig || (GamesConfig = {}));

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
    var AnimateBackground = (function (_super) {
        __extends(AnimateBackground, _super);
        function AnimateBackground(game, left) {
            var _this = _super.call(this, game, 0.0, 0.0) || this;
            _this._left = (left == true ? 1 : -1);
            game.world.add(_this);
            _this._visual = new Phaser.Image(game, left == true ? 0.0 : -640.0, 0.0, "MainMenu", "joust_action_bg0000");
            _this.addChild(_this._visual);
            _this._visual.addChild(new Phaser.Image(game, 640.0, 0.0, "MainMenu", "joust_action_bg0000"));
            _this._mask = game.add.graphics(0.0, 0.0);
            _this._mask.beginFill(0);
            _this._mask.drawRect(0.0, 0.0, game.world.centerX, game.world.height);
            _this._mask.endFill();
            _this.addChild(_this._mask);
            _this.mask = _this._mask;
            var fragmentSrcLeft = [
                'precision mediump float;',
                'varying vec2 vTextureCoord;',
                'varying vec4 vColor;',
                'uniform sampler2D uSampler;',
                'void main(void) {',
                'vec4 mul_color = vec4(1.0, 0.89, 1.0, 1.0);',
                'vec4 add_color = vec4(0.22, 0.0, 0.0, 0.0);',
                ' gl_FragColor = (texture2D(uSampler, vTextureCoord) * mul_color) + add_color;',
                '}'
            ];
            var fragmentSrcRight = [
                'precision mediump float;',
                'varying vec2 vTextureCoord;',
                'varying vec4 vColor;',
                'uniform sampler2D uSampler;',
                'void main(void) {',
                'vec4 mul_color = vec4(0.54, 0.83, 0.77, 1.0);',
                'vec4 add_color = vec4(-0.09, -0.055, 0.114, 0.0);',
                ' gl_FragColor = (texture2D(uSampler, vTextureCoord) * mul_color) + add_color;',
                '}'
            ];
            var fltr = new PIXI.AbstractFilter((left == false ? fragmentSrcLeft : fragmentSrcRight), null);
            _this._visual.filters = [fltr];
            return _this;
        }
        AnimateBackground.prototype.update = function () {
            this._visual.x -= AnimateBackground.SPEED * this._left;
            if (this._visual.x <= -640.0 || this._visual.x > 0.0) {
                this._visual.x = this._left == 1 ? 0.0 : -640.0;
            }
        };
        return AnimateBackground;
    }(Phaser.Sprite));
    AnimateBackground.SPEED = 20;
    TProject.AnimateBackground = AnimateBackground;
})(TProject || (TProject = {}));

var dragonBones;
(function (dragonBones) {
    var OEvent = (function () {
        function OEvent(name, cb, userData, useCapture) {
            if (useCapture === void 0) { useCapture = false; }
            this.name = name;
            this.cb = cb;
            this.useCapture = useCapture;
            this.userData = userData;
        }
        return OEvent;
    }());
    var OEventDispatcher = (function () {
        function OEventDispatcher() {
            this._listeners = [];
        }
        OEventDispatcher.prototype.on = function (msg, cb, useCapture) {
            if (cb == null)
                return;
            for (var i = 0; i < this._listeners.length; i++) {
                if (msg == this._listeners[i].name) {
                    if (cb == this._listeners[i].cb) {
                        return;
                    }
                }
            }
            this._listeners.push(new OEvent(msg, cb, useCapture));
        };
        OEventDispatcher.prototype.off = function (msg, cb) {
            var i = 0;
            while (i < this._listeners.length) {
                if (msg == this._listeners[i].name) {
                    if (cb == null || cb == this._listeners[i].cb) {
                        this._listeners.splice(i, 1);
                        continue;
                    }
                }
                i++;
            }
        };
        OEventDispatcher.prototype.dispatch = function (msg, userData) {
            for (var i = 0; i < this._listeners.length; i++) {
                if (msg == this._listeners[i].name) {
                    this._listeners[i].cb(userData);
                    if (this._listeners[i].useCapture) {
                        return;
                    }
                }
            }
        };
        return OEventDispatcher;
    }());
    dragonBones.OEventDispatcher = OEventDispatcher;
})(dragonBones || (dragonBones = {}));
;

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
            _this._eventDispatcher = new dragonBones.OEventDispatcher();
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
            return true;
        };
        PhaserArmatureDisplay.prototype.addEvent = function (type, listener, target) {
            this._eventDispatcher.on(type, listener.bind(target));
        };
        PhaserArmatureDisplay.prototype.removeEvent = function (type, listener, target) {
            this._eventDispatcher.off(type, listener);
        };
        PhaserArmatureDisplay.prototype._dispatchEvent = function (type, data) {
            this._eventDispatcher.dispatch(type, data);
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
            slot._init(skinSlotData, new Phaser.Sprite(PhaserFactory._game, null, null), new Phaser.Rope(PhaserFactory._game, null, null, null, null, []));
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
            value.destroyCachedSprite();
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
    var Meter = (function (_super) {
        __extends(Meter, _super);
        function Meter(game, x, y) {
            var _this = _super.call(this, game, x, y) || this;
            _this._bar = _this.game.add.sprite(5, 7, "TugGame", "rope_meter_scale0000");
            _this._bar.width += 2;
            _this.addChild(_this._bar);
            _this._border = _this.game.add.sprite(0, 0, "TugGame", "rope_meter_frame0000");
            _this.addChild(_this._border);
            _this._pointer = _this.game.add.sprite(0, 0, "TugGame", "rope_meter_gauge0000");
            _this._bar.addChild(_this._pointer);
            _this._faces = new Array(3);
            for (var i = 0; i < 3; i++) {
                var face = _this.game.add.sprite(0, -40, "TugGame", "hud_faces000" + i);
                _this.addChild(face);
                _this._faces[i] = face;
            }
            _this.setFace("low");
            return _this;
        }
        Meter.prototype.updateMeter = function (effort) {
            this._pointer.y = this._bar.height * (1 - effort);
        };
        Meter.prototype.setFace = function (name) {
            if (name == "low") {
                this._faces[1].visible = true;
                this._faces[0].visible = false;
                this._faces[2].visible = false;
            }
            else if (name == "high") {
                this._faces[0].visible = true;
                this._faces[1].visible = false;
                this._faces[2].visible = false;
            }
            else {
                this._faces[2].visible = true;
                this._faces[1].visible = false;
                this._faces[0].visible = false;
            }
        };
        return Meter;
    }(Phaser.Sprite));
    TProject.Meter = Meter;
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
    var Team = (function (_super) {
        __extends(Team, _super);
        function Team(game, x, y, name, container) {
            var _this = _super.call(this, game, x, y) || this;
            _this._name = name;
            _this._characters = new Array(3);
            _this._iaCheckTimer = new Array(3);
            _this._iaInput = new Array(3);
            _this._iaMashTimer = new Array(3);
            _this._keyCodes = new Array(3);
            _this._keys = new Array(3);
            _this._keyPressed = new Array(3);
            _this._timeButtonTint = new Array(3);
            _this._wins = 0;
            _this._iaBalance = 1;
            for (var i = 0; i < _this._characters.length; i++) {
                if (name == "player_1") {
                    _this._keys[i] = _this.game.add.sprite(70 * i, 400, "button_" + (i + 1));
                    _this.addChild(_this._keys[i]);
                }
                _this._characters[i] = { meter: new TProject.Meter(_this.game, 70 * i, 140), currentAnimation: "low" };
                _this.addChild(_this._characters[i].meter);
            }
            _this.myReset();
            return _this;
        }
        Team.prototype.setKeyCodes = function (key1, key2, key3) {
            this._keyCodes[0] = key1;
            this._keyCodes[1] = key2;
            this._keyCodes[2] = key3;
        };
        Object.defineProperty(Team.prototype, "changeAnimationCallback", {
            set: function (cb) {
                this._changeAnimationCallback = cb;
            },
            enumerable: true,
            configurable: true
        });
        Team.prototype.setCharacters = function (characters) {
            if (characters.length != 3)
                throw "There should be 3 charcters";
            for (var i = 0; i < characters.length; i++) {
                this._characters[i].mc = characters[i];
            }
        };
        Object.defineProperty(Team.prototype, "ia", {
            set: function (val) {
                this._ia = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Team.prototype, "wins", {
            get: function () {
                return this._wins;
            },
            set: function (n) {
                this._wins = n;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Team.prototype, "difficulty", {
            get: function () {
                return this._difficulty;
            },
            set: function (n) {
                this._difficulty = n;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Team.prototype, "advantageTime", {
            get: function () {
                return this._advantageTime;
            },
            set: function (val) {
                this._advantageTime = val;
            },
            enumerable: true,
            configurable: true
        });
        Team.prototype.update = function () {
        };
        Team.prototype.myReset = function () {
            for (var i = 0; i < 3; i++) {
                this._iaMashTimer[i] = 0;
                this._iaCheckTimer[i] = 0;
                this._characters[i].effort = 0;
                this._keyPressed[i] = false;
            }
            this._advantageTime = 0;
        };
        Team.prototype.balance = function (otherWins) {
            if (this._ia) {
                console.log("wins: " + this._wins + " otherWins: " + otherWins);
                this._iaBalance = GamesConfig.TugGame.iaBalance[this._wins - otherWins + GamesConfig.TugGame.iaBalanceOffset];
                console.log("IA balance: " + this._iaBalance);
            }
        };
        Team.prototype.moveTo = function (slide) {
            this._characters.forEach(function (character) {
            });
        };
        Team.prototype.getStrength = function (dt) {
            var acc = 0;
            for (var i = 0; i < 3; i++) {
                var character = this._characters[i];
                var keyPressed = void 0;
                if (this._ia) {
                    this._iaCheckTimer[i] -= dt;
                    if (this._iaCheckTimer[i] < 0) {
                        this._iaCheckTimer[i] = Utils.randomRangeF(GamesConfig.TugGame.iaMashTimeMin[this._difficulty], GamesConfig.TugGame.iaMashTimeMax[this._difficulty]) * this._iaBalance;
                        this._iaInput[i] = character.effort < 0.5;
                    }
                    this._iaMashTimer[i] -= dt;
                    if (this._iaMashTimer[i] < 0) {
                        this._iaMashTimer[i] = Utils.randomRangeF(GamesConfig.TugGame.iaMashTimeMin[this._difficulty], GamesConfig.TugGame.iaMashTimeMax[this._difficulty]) * this._iaBalance;
                        keyPressed = this._iaInput[i];
                    }
                    else {
                        keyPressed = false;
                    }
                }
                else {
                    var prevKeyPressedValues = this._keyPressed[i];
                    this._keyPressed[i] = this.game.input.keyboard.isDown(this._keyCodes[i]);
                    keyPressed = !prevKeyPressedValues && this._keyPressed[i];
                    if (keyPressed) {
                        this._timeButtonTint[i] = 100 / 1000;
                        this._keys[i].tint = 0x333333;
                    }
                    else {
                        if (this._timeButtonTint[i] < 0) {
                            this._keys[i].tint = 0xffffff;
                        }
                        this._timeButtonTint[i] -= dt;
                    }
                }
                if (keyPressed) {
                    character.effort += GamesConfig.TugGame.effort[i][0];
                }
                else {
                    character.effort -= GamesConfig.TugGame.effort[i][1] * dt;
                }
                if (character.effort < 0)
                    character.effort = 0;
                if (character.effort > 1)
                    character.effort = 1;
                character.meter.updateMeter(character.effort);
                var strT = void 0;
                var strA = void 0;
                if (character.effort < GamesConfig.TugGame.effortOpt) {
                    strT = character.effort / GamesConfig.TugGame.effortOpt;
                    strA = GamesConfig.TugGame.strengthAtLow;
                }
                else {
                    strT = 1 - ((character.effort - GamesConfig.TugGame.effortOpt) / (GamesConfig.TugGame.effortOpt));
                    strA = GamesConfig.TugGame.strengthAtHigh;
                }
                acc += Utils.easeOutQuint(strT, strA, GamesConfig.TugGame.strengthAtOpt, 1);
                if (character.effort < GamesConfig.TugGame.effortLow) {
                    if (character.currentAnimation != "low") {
                        this._changeAnimationCallback(character.mc, "low");
                        character.currentAnimation = "low";
                        character.meter.setFace("low");
                    }
                    acc += GamesConfig.TugGame.strengthAtLow;
                }
                else if (character.effort > GamesConfig.TugGame.effortHigh) {
                    if (character.currentAnimation != "high") {
                        this._changeAnimationCallback(character.mc, "high");
                        character.currentAnimation = "high";
                        character.meter.setFace("high");
                    }
                    acc += GamesConfig.TugGame.strengthAtHigh;
                }
                else {
                    if (character.currentAnimation != "optimal") {
                        this._changeAnimationCallback(character.mc, "optimal");
                        character.currentAnimation = "optimal";
                        character.meter.setFace("optimal");
                    }
                    acc += GamesConfig.TugGame.strengthAtOpt;
                }
            }
            return acc;
        };
        return Team;
    }(Phaser.Sprite));
    TProject.Team = Team;
})(TProject || (TProject = {}));

var Utils;
(function (Utils) {
    function randomRangeF(min, max) {
        return Utils.lerp(min, max, Math.random());
    }
    Utils.randomRangeF = randomRangeF;
    function lerp(v0, v1, t) {
        return (1 - t) * v0 + t * v1;
    }
    Utils.lerp = lerp;
    function easeOutQuint(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    }
    Utils.easeOutQuint = easeOutQuint;
    function easeInOutQuint(t, b, c, d) {
        if ((t /= d / 2) < 1)
            return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    }
    Utils.easeInOutQuint = easeInOutQuint;
})(Utils || (Utils = {}));

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
        DBSprite.prototype.stopInteractive = function () {
            this._eventsBounds.inputEnabled = false;
        };
        DBSprite.prototype.addEvent = function (type, listener, target) {
            this._visual.addEvent(type, listener, target ? target : this);
        };
        DBSprite.prototype.removeEvent = function (type, listener) {
            this._visual.removeEvent(type, listener, null);
        };
        DBSprite.prototype.play = function (name, playTimes) {
            return this._visual.animation.play(name, playTimes);
        };
        DBSprite.prototype.playEx = function (name, nextState, complete, contex) {
            this._nextState = nextState;
            this._cb = complete;
            this._cbContex = contex ? contex : this;
            if (nextState || complete) {
                this.addEvent("complete", this.completePlaying);
                this.addEvent("loopComplete", this.completePlaying);
            }
            return this.play(name);
        };
        DBSprite.prototype.completePlaying = function (e) {
            this.removeEvent("complete", this.completePlaying);
            this.removeEvent("loopComplete", this.completePlaying);
            if (this._nextState) {
                this.play(this._nextState);
            }
            this._nextState = null;
            if (typeof this._cb === "function") {
                this._cb.bind(this._cbContex)();
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

var Utils;
(function (Utils) {
    function randomRangeF(min, max) {
        return Utils.lerp(min, max, Math.random());
    }
    Utils.randomRangeF = randomRangeF;
    function lerp(v0, v1, t) {
        return (1 - t) * v0 + t * v1;
    }
    Utils.lerp = lerp;
    function easeOutQuint(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    }
    Utils.easeOutQuint = easeOutQuint;
    function easeInOutQuint(t, b, c, d) {
        if ((t /= d / 2) < 1)
            return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    }
    Utils.easeInOutQuint = easeInOutQuint;
})(Utils || (Utils = {}));

var Config;
(function (Config) {
    var tugGame = (function () {
        function tugGame() {
        }
        return tugGame;
    }());
    tugGame.effortLow = 0.33;
    tugGame.effortOpt = 0.5;
    tugGame.effortHigh = 0.66;
    tugGame.effort = [
        [0.070, 0.2],
        [0.085, 0.2],
        [0.100, 0.3]
    ];
    tugGame.strengthAtLow = 35;
    tugGame.strengthAtOpt = 100;
    tugGame.strengthAtHigh = 45;
    tugGame.strengthToSpeed = 0.5;
    tugGame.maxRounds = 5;
    tugGame.checkTime = 0.25;
    tugGame.moveDistance = 15;
    tugGame.moveTime = 1;
    tugGame.moveTransition = "easeOutElastic";
    tugGame.iaMashTimeMin = [0.30, 0.10, 0.10];
    tugGame.iaMashTimeMax = [0.27, 0.17, 0.17];
    tugGame.iaCheckTimeMin = [0.9, 0.7, 0.4];
    tugGame.iaCheckTimeMax = [1, 0.8, 0.5];
    tugGame.iaBalance = [1, 1, 1.5, 2, 2.5];
    tugGame.loseGroundSoundTime = 0.1;
    tugGame.gumballLoseGroundSoundsIds = ["tug_gumball_lose_ground1", "tug_gumball_lose_ground2"];
    tugGame.gumballLoseGroundSoundsChances = [50, 50];
    tugGame.darwinLoseGroundSoundsIds = ["tug_darwin_lose_ground1", "tug_darwin_lose_ground2"];
    tugGame.darwinLoseGroundSoundsChances = [50, 50];
    tugGame.teamPullSoundTime = 0.1;
    tugGame.gumballPullSoundsIds = ["tug_pullteam1_1", "tug_pullteam1_2", "tug_pullteam1_3"];
    tugGame.gumballPullSoundsChances = [30, 30, 30];
    tugGame.darwinPullSoundsIds = ["tug_pullteam2_1", "tug_pullteam2_2", "tug_pullteam2_3"];
    tugGame.darwinPullSoundsChances = [30, 30, 30];
    tugGame.bgm = "bgm_games3";
    tugGame.fanfare = "fanfare";
    tugGame.win = "win";
    tugGame.lose = "lose";
    Config.tugGame = tugGame;
})(Config || (Config = {}));

var TProject;
(function (TProject) {
    var Main = (function () {
        function Main() {
            this.game = new Phaser.Game(640, 480, Phaser.AUTO, "game_container", null, false);
            this.game.state.add("Boot", TProject.Boot, true);
            this.game.state.add("MainMenu", TProject.MainMenu);
            this.game.state.add("TugGame", TProject.TugGame);
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
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Boot.prototype.preload = function () {
            this.game.load.onFileComplete.add(this.loadingUpdate, this);
            this.game.load.atlas("MainMenu", Boot.PATH_IMAGES + "Menu/Menu.png", Boot.PATH_IMAGES + "Menu/Menu.json");
            this.game.load.atlas("MenuLogo", Boot.PATH_IMAGES + "Menu/Logo.png", Boot.PATH_IMAGES + "Menu/Logo.json");
            this.game.load.atlas("TugGame", Boot.PATH_IMAGES + "Games/TugGame/TugGame.png", Boot.PATH_IMAGES + "Games/TugGame/TugGame.json");
            this.game.load.image("player_11", Boot.PATH_IMAGES + "Games/TugGame/player_11.png");
            this.game.load.image("player_12", Boot.PATH_IMAGES + "Games/TugGame/player_12.png");
            this.game.load.image("player_13", Boot.PATH_IMAGES + "Games/TugGame/player_13.png");
            this.game.load.image("player_21", Boot.PATH_IMAGES + "Games/TugGame/player_21.png");
            this.game.load.image("player_22", Boot.PATH_IMAGES + "Games/TugGame/player_22.png");
            this.game.load.image("player_23", Boot.PATH_IMAGES + "Games/TugGame/player_23.png");
            this.game.load.image("button_1", Boot.PATH_IMAGES + "Games/TugGame/button_1.png");
            this.game.load.image("button_2", Boot.PATH_IMAGES + "Games/TugGame/button_2.png");
            this.game.load.image("button_3", Boot.PATH_IMAGES + "Games/TugGame/button_3.png");
            this.game.load.image("bg", Boot.PATH_IMAGES + "Games/bg1.png");
            this.game.load.image("rope_goal", Boot.PATH_IMAGES + "Games/TugGame/rope_goal.png");
            TProject.Factories.loadFactory(this.game, "Menu", Boot.PATH_IMAGES + "Menu/db/");
            TProject.Factories.loadFactory(this.game, "TugGame", Boot.PATH_IMAGES + "Games/TugGame/db/");
        };
        Boot.prototype.create = function () {
            this.enabledMultitouch(false);
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
            this.game.stage.backgroundColor = 0xff0000;
        };
        Boot.prototype.loadingUpdate = function (progress, cacheKey, success, totalLoaded, totalFiles) {
            var _this = this;
            if (progress >= 100.0) {
                Boot.MAIN_MENU = TProject.Factories.createFactory(this.game, "Menu");
                Boot.TUG_GAME = TProject.Factories.createFactory(this.game, "TugGame");
                dragonBones.PhaserFactory.startLoop();
                setTimeout(function () {
                    _this.game.state.start(TProject.LocalConfig.CURRENT_STATE, true);
                }, 500);
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
            console.log("Show MainMenu");
            this.game.time.advancedTiming = true;
            this._animBgLeft = new TProject.AnimateBackground(this.game, true);
            this._animBgRight = new TProject.AnimateBackground(this.game, false);
            this._animBgRight.x = this.game.world.centerX;
            this._separator = this.add.image(this.world.centerX, this.world.centerY, "MainMenu", "separator0000");
            this._separator.anchor.set(0.5);
            this._logo = this.add.image(0.0, 30.0, "MenuLogo", "logo0000");
            this._logo.anchor.set(0.5);
            this._menuAnimation = new TProject.DBSprite(TProject.Boot.MAIN_MENU, "_DB/menu_animation", this.game);
            this._menuAnimation.play("idle");
            this._gumball = new TProject.DBSprite(TProject.Boot.MAIN_MENU, "_DB/main_gumball", this.game);
            this._gumball.play("idle");
            this._darwin = new TProject.DBSprite(TProject.Boot.MAIN_MENU, "_DB/main_darwin", this.game);
            this._darwin.scale.x = -1.0;
            this._darwin.play("idle");
            this._btn1 = new TProject.DBSprite(TProject.Boot.MAIN_MENU, "_DB/btn_main", this.game);
            this._btn1.play("idle");
            this._btn2 = new TProject.DBSprite(TProject.Boot.MAIN_MENU, "_DB/btn_main", this.game);
            this._btn2.play("idle");
            this._menuAnimation.getBone("main_gumball").addChild(this._gumball);
            this._menuAnimation.getBone("main_darwin").addChild(this._darwin);
            this._menuAnimation.getBone("btn_1p").addChild(this._btn1);
            this._menuAnimation.getBone("btn_2p").addChild(this._btn2);
            this._crowd = new Phaser.Image(this.game, this.world.centerX, -5.0, "MainMenu", "menu_crowd0000");
            this._crowd.anchor.set(0.5);
            this._menuAnimation.getBone("crowd").addChildAt(this._crowd, 0);
            this._menuAnimation.getBone("logo").addChild(this._logo);
            setTimeout(function () {
                _this.startMenu();
            }, 200);
        };
        MainMenu.prototype.startMenu = function () {
            var _this = this;
            console.log("Start MainMenu");
            var time = this._menuAnimation.playEx("in", "loop").totalTime;
            setTimeout(function () {
                _this._gumball.play("loop");
                _this._darwin.play("loop");
                _this._btn1.createBounds(_this.game);
                _this._btn1.inputEnabled = true;
                _this._btn2.createBounds(_this.game);
                _this._btn2.inputEnabled = true;
                _this._btn1.events.onInputOver.add(function () {
                    _this._btn1.play("mouseOver");
                }, _this);
                _this._btn1.events.onInputOut.add(function () {
                    _this._btn1.play("mouseOut");
                }, _this);
                _this._btn2.events.onInputOver.add(function () {
                    _this._btn2.play("mouseOver");
                }, _this);
                _this._btn2.events.onInputOut.add(function () {
                    _this._btn2.play("mouseOut");
                }, _this);
            }, time * 1000 - 500);
        };
        MainMenu.prototype.onePlayer = function () {
        };
        MainMenu.prototype.update = function () {
        };
        MainMenu.prototype.render = function () {
            this.game.debug.text("" + this.game.time.fps, 2, 14, "#00ff00");
        };
        return MainMenu;
    }(Phaser.State));
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
    var TugGame = (function (_super) {
        __extends(TugGame, _super);
        function TugGame() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TugGame.prototype.create = function () {
            var _this = this;
            console.log("Show TugGame");
            this.game.time.advancedTiming = true;
            GamesConfig.TugGame.iaBalanceOffset = Math.floor(GamesConfig.TugGame.maxRounds / 2);
            this._container = this.game.add.sprite(0, 0);
            this._bg = this.game.add.sprite(0, 0, "bg");
            this._bg.crop(new Phaser.Rectangle(400, 0, 640, 480), true);
            this.game.stage.addChild(this._bg);
            this._ropeGoals = [this.game.add.sprite(340, 480, "rope_goal"),
                this.game.add.sprite(340 - 100 - 10, 480, "rope_goal"),
                this.game.add.sprite(340 + 100, 480, "rope_goal"),
            ];
            this._ropeGoals.forEach(function (rope) {
                _this._bg.addChild(rope);
                rope.anchor.set(1, 1);
            });
            this._ropeGoals[2].tint = 0xf56006;
            this._ropeGoals[1].tint = 0x478cc4;
            this.game.stage.addChild(this._container);
            this._teamG = new TProject.Team(this.game, 40, 40, "player_1");
            this._teamD = new TProject.Team(this.game, 350, 40, "player_2");
            this._container.addChild(this._teamG);
            this._container.addChild(this._teamD);
            this._charactersStartX = 50;
            this.openGame();
            this._characterDBArray = [];
            this._characterNamesArray = [];
            this._TugGameContainer = new TProject.DBSprite(TProject.Boot.TUG_GAME, "_DB/rope_container", this.game);
            this._TugGameContainer.play("idle");
            this._container.addChild(this._TugGameContainer);
            this._ropeAnimation = new TProject.DBSprite(TProject.Boot.TUG_GAME, "_DB/rope", this.game);
            this._ropeAnimation.play("idle");
            this._TugGameContainer.x = TugGame.START_POSITION;
            this._TugGameContainer.y = 390;
            this._ropeAnimation.y += 3;
            this._TugGameContainer.getBone("rope").addChild(this._ropeAnimation);
            this.characterCreator("bobert", "low");
            this.characterCreator("tobias", "low");
            this.characterCreator("gumball", "low");
            this.characterCreator("darwin", "low");
            this.characterCreator("banana", "low");
            this.characterCreator("anais", "low");
            this._teamG.setCharacters([0, 1, 2]);
            this._teamD.setCharacters([3, 4, 5]);
            this._teamG.changeAnimationCallback = this.characterSetAnimationById.bind(this);
            this._teamD.changeAnimationCallback = this.characterSetAnimationById.bind(this);
        };
        TugGame.prototype.characterCreator = function (charName, startAnimation) {
            var i = this._characterDBArray.length;
            this._characterDBArray[i] = [];
            this._characterDBArray[i].push(new TProject.DBSprite(TProject.Boot.TUG_GAME, "_DB/rope_" + charName, this.game));
            this._characterDBArray[i].push(new TProject.DBSprite(TProject.Boot.TUG_GAME, "_DB/" + charName + "_head", this.game));
            this._TugGameContainer.getBone("characters_" + charName).addChild(this._characterDBArray[i][0]);
            this._characterDBArray[i][0].getBone("head").addChild(this._characterDBArray[i][1]);
            this._characterNamesArray[i] = charName;
            this.characterSetAnimation(charName, startAnimation);
        };
        TugGame.prototype.characterSetAnimation = function (charName, currentAnimation) {
            for (var i = 0; i < this._characterNamesArray.length; i++) {
                if (this._characterNamesArray[i] == charName) {
                    this._characterDBArray[i][0].play(currentAnimation);
                    this._characterDBArray[i][1].play(charName + "_" + currentAnimation);
                    break;
                }
            }
        };
        TugGame.prototype.characterSetAnimationById = function (id, animationName) {
            var charName = this._characterNamesArray[id];
            this._characterDBArray[id][0].play(animationName);
            this._characterDBArray[id][1].play(charName + "_" + animationName);
        };
        TugGame.prototype.onePlayer = function () {
        };
        TugGame.prototype.openGame = function () {
            this._isTweenOn = false;
            this._teamG.wins = 0;
            this._teamG.ia = false;
            this._teamG.setKeyCodes(Phaser.KeyCode.A, Phaser.KeyCode.S, Phaser.KeyCode.D);
            this._teamD.wins = 0;
            this._teamD.ia = true;
            this._teamD.setKeyCodes(Phaser.KeyCode.LEFT, Phaser.KeyCode.UP, Phaser.KeyCode.RIGHT);
            this._teamD.difficulty = Math.floor(Math.random() * 3);
            console.log("difficulty: " + this._teamD.difficulty);
            this.resetScore();
            this.resetGame();
        };
        TugGame.prototype.resetGame = function () {
            console.log("hello from reset");
            this._container.x = this._charactersStartX;
            this._teamG.myReset();
            this._teamG.balance(this._teamD.wins);
            this._teamD.myReset();
            this._teamD.balance(this._teamG.wins);
            this._roundFinished = false;
        };
        TugGame.prototype.prepareNextRound = function () {
            this.resetGame();
        };
        TugGame.prototype.resetScore = function () {
        };
        TugGame.prototype.update = function () {
            var _this = this;
            if (this._roundFinished)
                setTimeout(function () {
                    _this.prepareNextRound();
                }, 1000);
            var diffX = this._container.x - 50;
            var gumballWon = diffX < -100;
            if (gumballWon || diffX > 100) {
                this._roundFinished = true;
                if (gumballWon) {
                    this._teamG.wins++;
                    console.log("GUMBALL WON");
                }
                else {
                    this._teamD.wins++;
                    console.log("TEAM RED WON");
                }
            }
            else {
                var dt = this.game.time.elapsed / 1000;
                var gumballStrength = this._teamG.getStrength(dt);
                var darwinStrength = this._teamD.getStrength(dt);
                var pullStrength = (darwinStrength - gumballStrength) * GamesConfig.TugGame.strengthToSpeed * dt;
                if (gumballStrength > darwinStrength) {
                    this._teamG.advantageTime += dt;
                }
                else if (gumballStrength < darwinStrength) {
                    this._teamD.advantageTime += dt;
                }
                if (this._isTweenOn) {
                }
                if (!this._isTweenOn && this._teamG.advantageTime > GamesConfig.TugGame.checkTime) {
                    this._isTweenOn = true;
                    this._teamG.moveTo("left");
                    this._teamD.moveTo("right");
                    var tween = this.game.add.tween(this._container).to({ x: this._container.x - GamesConfig.TugGame.moveDistance * 1 }, GamesConfig.TugGame.moveTime * 1000, Phaser.Easing.Elastic.Out, true);
                    tween.onComplete.add(function () {
                        _this._isTweenOn = false;
                    }, this);
                }
                else if (!this._isTweenOn && this._teamD.advantageTime > GamesConfig.TugGame.checkTime) {
                    this._isTweenOn = true;
                    this._teamG.moveTo("right");
                    this._teamD.moveTo("left");
                    var tween = this.game.add.tween(this._container).to({ x: this._container.x + GamesConfig.TugGame.moveDistance * 1 }, GamesConfig.TugGame.moveTime * 1000, Phaser.Easing.Elastic.Out, true);
                    tween.onComplete.add(function () {
                        _this._isTweenOn = false;
                    }, this);
                }
                else {
                }
            }
        };
        TugGame.prototype.render = function () {
            this.game.debug.text("" + this.game.time.fps, 2, 14, "#00ff00");
            this.game.debug.spriteInfo(this._container, 32, 32);
        };
        return TugGame;
    }(Phaser.State));
    TugGame.START_POSITION = 300 - 27;
    TProject.TugGame = TugGame;
})(TProject || (TProject = {}));
