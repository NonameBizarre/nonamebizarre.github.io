var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Game;
(function (Game) {
    var TimePlank = (function (_super) {
        __extends(TimePlank, _super);
        function TimePlank(game, x, y, gameElementContainer, GameManager) {
            _super.call(this, game, x, y, 'WholeTimePlank');
            this.anchor.set(0.5);
            this._gameManager = GameManager;
            this._edgeDistance = 374.5;
            this._maxEdgeDistance = this._edgeDistance * 2;
            this._allTime = 3; //100 секунд
            this._currentTime = this._allTime / 2; //Текущее время
            this._stopScale = false;
            this._currentComboLenght = 0;
            this._colorCounter = 0;
            this._timeRevordCounter = 0;
            this._isPaused = false;
            this._timeBarLine = this.game.add.sprite(this.x - this._edgeDistance, this.y, 'LineFromTimePlank');
            this._timeBarLine.anchor.set(0, 0.5);
            this._gameTimer = this.game.time.create(false);
            this._gameTimer.loop(100, this.changeTime, this);
            this._gameTimer.start();
            this._changeClolrArray = [];
            this._changeClolrArray[0] = 0xe51919;
            this._changeClolrArray[1] = 0xffffff;
            this._changeClolrArray[2] = 0xffffff;
            this._changeClolrArray[3] = 0xecd316;
            //this._changeClolrArray[4] = 0xf0e171
            //this._changeClolrArray[5] = 0xf0dc42
            this._timeRevordArray = [];
            this._timeRevordArray[0] = 0;
            this._timeRevordArray[1] = 3;
            this._timeRevordArray[2] = 4;
            this._timeRevordArray[3] = 6;
            this._timeRevordArray[4] = 5;
            this._timeRevordArray[5] = 4;
            this._timeBarLine.tint = this._changeClolrArray[0];
            this._GameElementContainer = gameElementContainer;
            this._GameElementContainer.addChild(this._timeBarLine);
            this._GameElementContainer.addChild(this);
            //this.changeBarFromTime();
        }
        TimePlank.prototype.changeBar = function () {
            if (this._currentTime > this._allTime) {
                this._currentTime = this._allTime;
            }
            this._timeBarLine.scale.x = (this._currentTime / this._allTime) * this._maxEdgeDistance;
        };
        TimePlank.prototype.changeTime = function () {
            if (!this._stopScale) {
                if (this._currentTime > 0) {
                    this._currentTime -= 0.1;
                    this.changeBar();
                }
                else {
                    console.log('GAME OVER!');
                    this._gameManager.changePauseState(true);
                }
            }
        };
        TimePlank.prototype.setPause = function (pauseSet) {
            if (pauseSet) {
                if (!this._isPaused) {
                    this._isPaused = true;
                    this._gameTimer.pause();
                }
            }
            else {
                if (this._isPaused) {
                    this._isPaused = false;
                    this._gameTimer.resume();
                }
            }
        };
        TimePlank.prototype.addTime = function (combo) {
            this._currentComboLenght += combo;
            this._colorCounter = combo;
            if (this._colorCounter > 3)
                this._colorCounter = 3;
            this._colorBackTimer = this.game.time.create(true);
            this._colorBackTimer.add(400, this.startCombo, this);
            this._colorBackTimer.start();
        };
        TimePlank.prototype.startCombo = function () {
            var _this = this;
            if (this._currentComboLenght > 0) {
                this._currentComboLenght -= 1;
                this._currentTime += this._timeRevordArray[this._timeRevordCounter];
                if (this._timeRevordCounter < 5)
                    this._timeRevordCounter += 1;
                this.tweenTint(this._timeBarLine, this._changeClolrArray[0], this._changeClolrArray[this._colorCounter], 100, function () { _this.getColorBack(); });
                this._stopScale = true;
                this.changeBar();
            }
        };
        TimePlank.prototype.getColorBack = function () {
            var _this = this;
            if (this._currentComboLenght > 0) {
                this.tweenTint(this._timeBarLine, this._changeClolrArray[this._colorCounter], this._changeClolrArray[0], 25, function () { _this.startCombo(); });
            }
            else {
                this.tweenTint(this._timeBarLine, this._changeClolrArray[this._colorCounter], this._changeClolrArray[0], 100);
                this._stopScale = false;
                this._timeRevordCounter = 0;
            }
        };
        TimePlank.prototype.tweenTint = function (obj, startColor, endColor, time, callback) {
            if (time === void 0) { time = 250; }
            if (callback === void 0) { callback = null; }
            if (obj) {
                //console.log(callback);
                var colorBlend_1 = { step: 0 };
                var colorTween = this.game.add.tween(colorBlend_1).to({ step: 100 }, time);
                colorTween.onUpdateCallback(function () {
                    obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend_1.step);
                });
                obj.tint = startColor;
                if (callback) {
                    colorTween.onComplete.add(function () {
                        callback();
                    });
                }
                colorTween.start();
            }
        };
        return TimePlank;
    }(Phaser.Sprite));
    Game.TimePlank = TimePlank;
})(Game || (Game = {}));
//# sourceMappingURL=TimePlank.js.map