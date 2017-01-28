var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var PlayerDragon = (function (_super) {
        __extends(PlayerDragon, _super);
        function PlayerDragon(game, x, y) {
            _super.call(this, game, x, y, 'testDragon');
            this.anchor.set(0.5, 0.5);
            this._attackRound = 0;
            this._gameMode = "null";
            this._blockGame = false;
            //this._attackPlank = new AttackButtons(this.game,220,0);  
            //this.addChild(this._attackPlank);
            // Вот тут панель для кнопок атаки
            this._buttonAttackPanel = this.game.add.sprite(0, 0);
            this._buttonAttackPanel.scale.set(0);
            this.addChild(this._buttonAttackPanel);
            this._btnOne = new VAttackBut(game, 225, -50, "attackIcon1", this);
            this._buttonAttackPanel.addChild(this._btnOne);
            this._btnOne.scale.set(0);
            this._btnTwo = new VAttackBut(game, 245, 15, "attackIcon2", this);
            this._buttonAttackPanel.addChild(this._btnTwo);
            this._btnTwo.scale.set(0);
            this._btnThree = new VAttackBut(game, 225, 80, "attackIcon3", this);
            this._buttonAttackPanel.addChild(this._btnThree);
            this._btnThree.scale.set(0);
            this._btnOne.enabled = false;
            this._btnTwo.enabled = false;
            this._btnThree.enabled = false;
            // вот тут для других панелей место
            // ...
            this._progressAttackPanel = this.game.add.sprite(225, 0, "attackPlank_phase1");
            this._progressAttackPanel.anchor.set(0.5);
            this.addChild(this._progressAttackPanel);
            this._proAttPanStartX = this._progressAttackPanel.x;
            this._proAttPanStartY = this._progressAttackPanel.y;
            this._progressAttackPanel.visible = false;
            this._arg = 0;
            var radius = -200;
            this._arrow = game.add.image(radius - 50, 0, "testArrow");
            this._arrow.pivot.x = radius;
            this._progressAttackPanel.addChild(this._arrow);
            this._criticalAttack = false; // Если стрелка попала в ограничения
            this.game.input.onDown.add(this.onDownAttack, this);
            this._attackHelper = this.game.add.sprite(214, -29, "testArm");
            this._attackHelper.anchor.set(0.5);
            this._attackHelper.scale.set(1.8);
            this._attackHelper.alpha = 0;
            this.addChild(this._attackHelper);
            this._attackHelperActive = true;
            //Рука-помощник
            //Курсор нажимает на кнопку: x: 214, y:-29
            //Зелёные области
            //Первая итерация
            //Нижняя граница -0.060284060923254223
            //Верхняя граница -0.3381627507134902
            //Вторая итерация
            //Нижняя граница -0.18063722692808337
            //Верхняя граница -0.3045979556594794
            this.changeGameMode("attackBtnPanel");
        }
        PlayerDragon.prototype.update = function () {
            switch (this._gameMode) {
                case "progressAtackPanel":
                    if (this._blockGame) {
                        if (this._criticalAttack) {
                            var min = -4;
                            var max = 4;
                            this._progressAttackPanel.x += Math.floor(Math.random() * (max - min + 1)) + min;
                            this._progressAttackPanel.y += Math.floor(Math.random() * (max - min + 1)) + min;
                        }
                    }
                    else {
                        this._arrow.rotation = Math.sin(this._arg += 0.03) * 0.45 - 0.07;
                    }
                    break;
            }
        };
        PlayerDragon.prototype.onDownAttack = function () {
            if (this._gameMode == "progressAtackPanel" && !this._blockGame) {
                switch (this._attackRound) {
                    case 0:
                        if (this._arrow.rotation >= -0.3381627507134902 && this._arrow.rotation <= -0.060284060923254223) {
                            this._criticalAttack = true; // попали в зелёную!
                        }
                        break;
                    case 1:
                        if (this._arrow.rotation >= -0.3045979556594794 && this._arrow.rotation <= -0.18063722692808337) {
                            this._criticalAttack = true; // попали в зелёную!
                        }
                        break;
                }
                this.preEndTweenProgressPanel();
            }
        };
        PlayerDragon.prototype.refreshAttackButton = function (btn) {
            this._buttonAttackPanel.removeChild(btn);
            this._buttonAttackPanel.addChild(btn);
            if (this._attackHelperActive) {
                this._attackHelperActive = false;
                this.game.tweens.remove(this._tween);
                this._attackHelper.alpha = 0;
            }
        };
        PlayerDragon.prototype.hideAttackButons = function () {
            //this._buttonAttackPanel.visible = false;
            this._btnOne.enabled = false;
            this._btnTwo.enabled = false;
            this._btnThree.enabled = false;
            this._buttonAttackPanel.scale.set(0);
            this._btnOne.scale.set(0);
            this._btnTwo.scale.set(0);
            this._btnThree.scale.set(0);
            this._progressAttackPanel.visible = true;
        };
        PlayerDragon.prototype.changeGameMode = function (mode) {
            switch (mode) {
                case "attackBtnPanel":
                    this._gameMode = "attackBtnPanel";
                    this._blockGame = true;
                    this.startTweenAttackPanel();
                    break;
                case "progressAtackPanel":
                    this._gameMode = "progressAtackPanel";
                    this._blockGame = true;
                    this.hideAttackButons();
                    console.log(this._progressAttackPanel.alpha);
                    this.startTweenProgressPanel();
                    break;
                case "enemyAttack":
                    this._gameMode = "enemyAttack";
                    this._blockGame = true;
                    console.log("ВрагАтакует!");
                    this.changeGameMode("attackBtnPanel");
                    break;
            }
        };
        //Анимация для панели с заклинаниями
        PlayerDragon.prototype.startTweenAttackPanel = function () {
            if (this._blockGame) {
                this.game.add.tween(this._buttonAttackPanel.scale).to({ x: 1, y: 1 }, 330, Phaser.Easing.Elastic.Out, true, 100).onComplete.add(this.endTweenAttackPanel, this);
                this.game.add.tween(this._btnOne.scale).to({ x: 1, y: 1 }, 330, Phaser.Easing.Elastic.Out, true, 100);
                this.game.add.tween(this._btnTwo.scale).to({ x: 1, y: 1 }, 330, Phaser.Easing.Elastic.Out, true, 100);
                this.game.add.tween(this._btnThree.scale).to({ x: 1, y: 1 }, 330, Phaser.Easing.Elastic.Out, true, 100);
                this._blockGame = false;
            }
        };
        PlayerDragon.prototype.endTweenAttackPanel = function () {
            this._btnOne.enabled = true;
            this._btnTwo.enabled = true;
            this._btnThree.enabled = true;
            this.showArmHelper();
        };
        // Анимация для руки-помощника
        PlayerDragon.prototype.showArmHelper = function () {
            if (this._attackHelperActive) {
                this._attackHelper.alpha = 1;
                this.game.add.tween(this._attackHelper.scale).to({ x: 1, y: 1 }, 640, Phaser.Easing.Elastic.Out, true).onComplete.add(this.startMoveArmHelper, this);
            }
        };
        PlayerDragon.prototype.startMoveArmHelper = function () {
            if (this._attackHelperActive) {
                this.game.add.tween(this._attackHelper).to({ x: [this._attackHelper.x, this._attackHelper.x + 320, this._attackHelper.x + 520], y: [this._attackHelper.y, this._attackHelper.y - 60, this._attackHelper.y] }, 850, Phaser.Easing.Linear.None, true, 100).interpolation(function (v, k) { return Phaser.Math.catmullRomInterpolation(v, k); }).onComplete.add(this.endMoveArmHepler, this);
                this._tween = this.game.add.tween(this._attackHelper).to({ alpha: 0 }, 200, Phaser.Easing.Sinusoidal.Out, true, 750);
            }
        };
        PlayerDragon.prototype.endMoveArmHepler = function () {
            if (this._attackHelperActive) {
                this._tween = this.game.add.tween(this._attackHelper).to({ alpha: 0 }, 50, Phaser.Easing.Sinusoidal.Out, true, 550);
                this._tween.onComplete.add(this.showArmHelper, this);
                this._attackHelper.x = 214;
                this._attackHelper.y = -29;
                this._attackHelper.scale.set(1.8);
            }
        };
        //Анимация для атакующей панели
        PlayerDragon.prototype.startTweenProgressPanel = function () {
            this._blockGame = false;
            //this.game.add.tween(this._progressAttackPanel.scale).to({x:1,y:1},430,Phaser.Easing.Sinusoidal.Out,true,100).onComplete.add(this.preEndTweenProgressPanel,this);    
            //this.game.input inputEnabled = true;        
        };
        PlayerDragon.prototype.preEndTweenProgressPanel = function () {
            this._blockGame = true;
            var curDellay;
            if (this._criticalAttack) {
                curDellay = 200;
            }
            else {
                curDellay = 0;
            }
            this.game.add.tween(this._progressAttackPanel.scale).to({ x: 1.5, y: 1.5 }, 640, Phaser.Easing.Sinusoidal.Out, true, curDellay).onComplete.add(this.endTweenProgressPanel, this);
            this.game.add.tween(this._progressAttackPanel).to({ alpha: 0 }, 630, Phaser.Easing.Sinusoidal.Out, true, curDellay);
        };
        PlayerDragon.prototype.endTweenProgressPanel = function () {
            this._progressAttackPanel.x = this._proAttPanStartX;
            this._progressAttackPanel.y = this._proAttPanStartY;
            this._progressAttackPanel.visible = false;
            this._progressAttackPanel.scale.set(1);
            this._progressAttackPanel.alpha = 1;
            this._criticalAttack = false;
            this._progressAttackPanel.loadTexture("attackPlank_phase2");
            this._attackRound += 1;
            this._arg = 0;
            this.changeGameMode("enemyAttack");
        };
        return PlayerDragon;
    })(Phaser.Sprite);
    Banner.PlayerDragon = PlayerDragon;
    // классы которые нахуй никому не нужны, потому мы их просто набрасываем вниз и не экспортим
    var VAttackBut = (function (_super) {
        __extends(VAttackBut, _super);
        //private _parEmitter: any;
        function VAttackBut(game, x, y, iconPic, dragon) {
            if (iconPic === void 0) { iconPic = "attackIcon1"; }
            _super.call(this, game, x, y);
            this._dragon = dragon;
            this._bg = game.add.image(0, 0, "attackIconEmpty");
            this._bg.anchor.set(0.5, 0.5);
            this._bg.alpha = 0;
            this._icon = game.add.image(0, 0, iconPic);
            this._icon.anchor.set(0.5, 0.5);
            //this._parEmitter = this.game.add.emitter(this._icon.x,this._icon.y,20);
            //this._parEmitter.gravity = 200;
            //this._parEmitter.makeParticles('fx_sparks2');
            //this.addChild(this._parEmitter);
            this.enabled = true;
            this._icon.events.onInputOver.add(this.over, this);
            this._icon.events.onInputOut.add(this.out, this);
            this._icon.events.onInputDown.add(this.down, this);
            this._icon.events.onDragStop.add(this.dragStop, this);
            this._icon.events.onDragUpdate.add(this.dragUpdate, this);
            this.addChild(this._bg);
            this.addChild(this._icon);
        }
        VAttackBut.prototype.over = function () {
            this._icon.scale.set(1.1);
        };
        VAttackBut.prototype.out = function () {
            this._icon.scale.set(1.0);
        };
        VAttackBut.prototype.down = function () {
            this._icon.scale.set(0.9);
            this._bg.alpha = 1;
            this._dragon.refreshAttackButton(this);
        };
        VAttackBut.prototype.checkHit = function (x) {
            return x > Banner.Config.width * 0.6;
        };
        VAttackBut.prototype.dragUpdate = function (sprite, pointer, dragX, dragY, snapPoin) {
            // Тут мы подсвечиваем атаку, если это необходимо. Можешь поменять на хитбокс врага
            if (this.checkHit(pointer.x)) {
                this._icon.alpha = 0.5;
                this._icon.scale.set(1.3);
            }
            else {
                this._icon.alpha = 1;
                this._icon.scale.set(0.9);
            }
            //this._parEmitter.x = this._icon.x;
            //this._parEmitter.y = this._icon.y;                
            //if(this._parEmitter.length <= 7){
            //this._parEmitter.start(false, 500,null, 3);
            //}                
            //console.log(this._parEmitter.length)
        };
        VAttackBut.prototype.dragStop = function (sprite, pointer, dragX, dragY, snapPoin) {
            // Сбрасываем параметры и, если попадаем по врагу, то скрываем кнопки и показываем карусель
            this._icon.x = 0;
            this._icon.y = 0;
            this._icon.alpha = 1;
            this._icon.scale.set(1.0);
            this._bg.alpha = 0;
            if (this.checkHit(pointer.x)) {
                this._dragon.changeGameMode("progressAtackPanel");
            }
        };
        Object.defineProperty(VAttackBut.prototype, "enabled", {
            set: function (value) {
                this._icon.inputEnabled = value;
                if (value) {
                    this._icon.input.enableDrag();
                }
                else {
                    this._icon.input.disableDrag();
                }
            },
            enumerable: true,
            configurable: true
        });
        return VAttackBut;
    })(Phaser.Sprite);
})(Banner || (Banner = {}));
