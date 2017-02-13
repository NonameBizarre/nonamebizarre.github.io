var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TBanner;
(function (TBanner) {
    var BaseCard = (function (_super) {
        __extends(BaseCard, _super);
        function BaseCard(game, x, y, cardName, isOpen, currentCardContainer) {
            _super.call(this, game, 0, 0, '');
            this.anchor.set(0.5, 0.5);
            this._cardName = cardName;
            this._isOpen = isOpen;
            this._startPosPoint = new Phaser.Point(x, y);
            if (this._isOpen) {
                this.loadTexture("MainAtlas", this._cardName);
            }
            else {
                this.loadTexture("MainAtlas", 'card_back');
            }
            this._currentCardContainer = currentCardContainer;
        }
        BaseCard.prototype.startCard = function (time) {
            this.game.add.tween(this).to({ x: this._startPosPoint.x, y: this._startPosPoint.y }, time, Phaser.Easing.Sinusoidal.Out, true, 150); //.onComplete.add(()=>{this.activeCard()});
        };
        BaseCard.prototype.activeCard = function () {
            this.inputEnabled = true;
            this.events.onInputUp.add(this.onTap, this);
            //console.log("active");
            //this._currentCardContainer.addCardToContainer(this._cardName);          
        };
        BaseCard.prototype.openCard = function () {
            var _this = this;
            if (!this._isOpen) {
                this._isOpen = true;
                this.game.add.tween(this.scale).to({ x: 0, y: 1 }, 50, Phaser.Easing.Sinusoidal.In, true).onComplete.add(function () { _this.loadTexture("MainAtlas", _this._cardName); _this.game.add.tween(_this.scale).to({ x: 1, y: 1 }, 50, Phaser.Easing.Sinusoidal.Out, true).onComplete.add(_this.activeCard, _this); });
            }
            this.activeCard();
        };
        BaseCard.prototype.deliteCard = function () {
            this._currentCardContainer.cardSubstr();
            this.events.destroy();
            //this._cardScoreText.cardRemove();
            this.destroy();
        };
        BaseCard.prototype.onTap = function () {
            this._currentCardContainer.goCardToCurrentCard(this);
        };
        BaseCard.prototype.rightCard = function () {
            //3) Даём очки
            this._cardScoreText = new TBanner.CardScore(this.game, this.world.x, this.world.y, 100);
            if (window["SOUND"]) {
                var audio = this.game.add.audioSprite('sfx');
                audio.play('swish', this.game.rnd.realInRange(0.13, 0.22));
            }
            if (this._currentCardContainer != null) {
                this._currentCardContainer.openChild(this._cardName);
            }
        };
        BaseCard.prototype.cardShake = function () {
            var _this = this;
            this.game.add.tween(this).to({ x: this.x - 5 }, 5, Phaser.Easing.Elastic.In, true).onComplete.add(function () {
                _this.game.add.tween(_this).to({ x: _this.x + 10 }, 5, Phaser.Easing.Elastic.In, true).onComplete.add(function () { _this.game.add.tween(_this).to({ x: _this.x - 5 }, 5, Phaser.Easing.Elastic.Out, true); });
            });
        };
        return BaseCard;
    })(Phaser.Sprite);
    TBanner.BaseCard = BaseCard;
})(TBanner || (TBanner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TBanner;
(function (TBanner) {
    var CardContainer = (function (_super) {
        __extends(CardContainer, _super);
        function CardContainer(game, x, y, childIndex, gameManager, cardHolder, baseCard, childCard, openChild, childXOff, childYOff) {
            if (childCard === void 0) { childCard = null; }
            if (openChild === void 0) { openChild = null; }
            if (childXOff === void 0) { childXOff = null; }
            if (childYOff === void 0) { childYOff = null; }
            _super.call(this, game, x, y, '');
            this.anchor.set(0.5, 0.5);
            this.alpha = 0;
            this._cardHolder = cardHolder;
            this._gameManager = gameManager;
            this._childIndex = childIndex;
            this._childCardArray = [];
            if (childCard != null) {
                for (var i = 0; i < childCard.length; i++) {
                    if (childCard.length == 1) {
                        this._childCardArray[i] = new TBanner.BaseCard(this.game, childXOff, childYOff + childYOff * i, childCard[i], openChild, null);
                    }
                    else {
                        var mod = void 0;
                        if ((i + 1) % 2 == 0) {
                            mod = 1;
                        }
                        else {
                            mod = -1;
                        }
                        this._childCardArray[i] = new TBanner.BaseCard(this.game, childXOff * mod, childYOff, childCard[i], openChild, null);
                    }
                    this.addChild(this._childCardArray[i]);
                }
            }
            this._mainCard = new TBanner.BaseCard(this.game, 0, 0, baseCard, true, this);
            //this._mainCard.activeCard(); !!
            this.addChild(this._mainCard);
            this.addCardToContainer(baseCard);
            this._baseCard = baseCard;
            this._cardInContainerCount = this._childCardArray.length + 1;
            this.game.time.events.add(Phaser.Timer.SECOND * 0.1, this.posCheck, this);
        }
        CardContainer.prototype.addCardToContainer = function (cardName) {
            this._cardHolder.addCardToBucked(cardName);
        };
        CardContainer.prototype.posCheck = function () {
            //console.log(this.world)
            //console.log();
            var _this = this;
            var startBucketPos = this._cardHolder.getBucketdPos();
            this._startPosPoint = this.world;
            this.x = startBucketPos.x - this._startPosPoint.x;
            this.y = startBucketPos.y - this._startPosPoint.y;
            var finalPint = new Phaser.Point(this.x - (startBucketPos.x - this._startPosPoint.x), this.y - (startBucketPos.y - this._startPosPoint.y));
            this.game.add.tween(this).to({ x: [this.x, finalPint.x], y: [this.y, finalPint.y] }, 325, Phaser.Easing.Sinusoidal.Out, true).interpolation(function (v, k) { return Phaser.Math.catmullRomInterpolation(v, k); }).onComplete.add(function () { _this._mainCard.activeCard(); });
            this.game.add.tween(this).to({ alpha: 1 }, 325, Phaser.Easing.Sinusoidal.InOut, true, 50);
            for (var i = 0; i < this._childCardArray.length; i++) {
                this._childCardArray[i].startCard(325);
            }
            this._mainCard.startCard(325);
        };
        CardContainer.prototype.openChild = function (currentCard) {
            if (currentCard == this._baseCard) {
                for (var i = 0; i < this._childCardArray.length; i++) {
                    this._childCardArray[i].openCard();
                    this._childCardArray[i]._currentCardContainer = this;
                    this.addCardToContainer(this._childCardArray[i]._cardName);
                }
            }
        };
        CardContainer.prototype.goCardToCurrentCard = function (currentCard) {
            var _this = this;
            if (this._cardHolder.cardCheck(currentCard._cardName, false)) {
                currentCard.rightCard();
                this._gameManager.changeChildIndex(this._childIndex);
                this._gameManager.addScoreInPlank();
                var finalPint = this._cardHolder.getCurrentCardPos();
                var xOffcet = currentCard.x;
                var yOffcet = currentCard.y;
                finalPint.x = finalPint.x - currentCard.world.x;
                finalPint.y = finalPint.y - currentCard.world.y;
                this.game.add.tween(currentCard).to({ x: [finalPint.x / 2, finalPint.x + xOffcet], y: [currentCard.y * 1.2, finalPint.y + yOffcet] }, 325, Phaser.Easing.Linear.None, true).interpolation(function (v, k) { return Phaser.Math.catmullRomInterpolation(v, k); }).onComplete.add(function () { _this._cardHolder.addCardInCurrentCard(currentCard._cardName); currentCard.deliteCard(); });
                this.game.add.tween(currentCard).to({ angle: 720 }, 325, Phaser.Easing.Sinusoidal.InOut, true);
            }
            else {
                currentCard.cardShake();
            }
        };
        CardContainer.prototype.cardSubstr = function () {
            this._cardInContainerCount -= 1;
            if (this._cardInContainerCount == 0) {
                this._gameManager.destroyCurrentCardContainer(this);
                this.destroy();
            }
        };
        return CardContainer;
    })(Phaser.Sprite);
    TBanner.CardContainer = CardContainer;
})(TBanner || (TBanner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TBanner;
(function (TBanner) {
    var CardHolder = (function (_super) {
        __extends(CardHolder, _super);
        function CardHolder(game, x, y) {
            _super.call(this, game, x, y);
            this.anchor.set(0.5, 0.5);
            this._cardInBuckedArray = [];
            this._gameBlock = true; //TRUE!!!!11
            this._arrowStart = false;
            this._cardHolderBack = this.game.add.sprite(25, -9, "MainAtlas", "card_holder_back");
            this._cardHolderBack.anchor.set(0.5);
            this.addChild(this._cardHolderBack);
            this._cardHolderCards = this.game.add.sprite(-85, -110, "MainAtlas", "card_holder_cards");
            this._cardHolderCards.anchor.set(0.5);
            this.addChild(this._cardHolderCards);
            this._currentCardName = "";
            this._cardHolderCurrentCard = this.game.add.sprite(70, -57, "MainAtlas", "");
            this._cardHolderCurrentCard.anchor.set(0.5);
            this.addChild(this._cardHolderCurrentCard);
            this._cardHolderCardInBucket = this.game.add.sprite(-72, -95, "MainAtlas", "card_back");
            this._cardHolderCardInBucket.anchor.set(0.5);
            this._cardHolderCardInBucket.angle = -6.8;
            this._cardHolderCardInBucket.scale.set(0.9);
            this._cardHolderCardInBucket.alpha = 0;
            this.addChild(this._cardHolderCardInBucket);
            this._hideCardPosX = this._cardHolderCardInBucket.x;
            this._hideCardPosY = this._cardHolderCardInBucket.y;
            this._hideCardAngle = this._cardHolderCardInBucket.angle;
            this._cardHolderBucket = this.game.add.sprite(-75, -47, "MainAtlas", "card_holder_bucket");
            this._cardHolderBucket.anchor.set(0.5);
            this.addChild(this._cardHolderBucket);
            this._cardHolderOverlay = this.game.add.sprite(0, 0, "MainAtlas", "card_holder_over");
            this._cardHolderOverlay.anchor.set(0.5);
            this.addChild(this._cardHolderOverlay);
            this._arrowCantMove = this.game.add.sprite(-45, -145, "MainAtlas", 'arrow_tutorial');
            this._cardHolderOverlay.addChild(this._arrowCantMove);
            this._arrowCantMove.anchor.set(0.5);
            this._arrowCantMove.alpha = 0;
            this.gameScoreText = this.game.add.bitmapText(x, y, 'font2', '100', 35);
            this.gameScoreText.anchor.set(0.5);
            this.gameScoreText.tint = 0xfefcc7;
            this._cardHolderBucket.addChild(this.gameScoreText);
            this.activeInput(true);
            this._cardHolderCards.events.onInputUp.add(this.inputUp, this);
            this._cardHolderBucket.events.onInputUp.add(this.inputUp, this);
        }
        CardHolder.prototype.addCardToBucked = function (cardName) {
            this._cardInBuckedArray[this._cardInBuckedArray.length] = cardName;
            //console.log(this._cardInBuckedArray)
        };
        CardHolder.prototype.deleteRightCard = function (cardName) {
            for (var i = 0; i < this._cardInBuckedArray.length; i++) {
                if (cardName == this._cardInBuckedArray[i]) {
                    this._cardInBuckedArray.splice(i, 1);
                    break;
                }
            }
            //console.log(this._cardInBuckedArray);
        };
        CardHolder.prototype.checkPlayerMove = function () {
            var playerCanMove = false;
            for (var i = 0; i < this._cardInBuckedArray.length; i++) {
                if (this.cardCheck(this._cardInBuckedArray[i], true)) {
                    playerCanMove = true;
                    break;
                }
            }
            if (!playerCanMove && !this._arrowStart) {
                //console.log('CTMV TEST');
                this._arrowStart = true;
                this.game.time.events.add(Phaser.Timer.SECOND * 0.7, this.startArrowTween, this);
            }
            else if (playerCanMove && this._arrowStart) {
                this._arrowStart = false;
                this._arrowCantMove.alpha = 0;
                this._arrowCantMove.x = -45;
                this._arrowCantMove.y = -145;
                this.game.tweens.remove(this._arrowTwine);
            }
        };
        CardHolder.prototype.startArrowTween = function () {
            var _this = this;
            if (this._arrowStart) {
                this._arrowCantMove.alpha = 1;
                this._arrowTwine = this.game.add.tween(this._arrowCantMove).to({ y: this._arrowCantMove.y + 20 }, 300, Phaser.Easing.Sinusoidal.Out, true, 0, 0, true);
                this._arrowTwine.onComplete.add(function () { _this._arrowCantMove.y = -145; ; _this.startArrowTween(); });
            }
        };
        CardHolder.prototype.getRandomCardToPlayer = function () {
            var cardName = Phaser.ArrayUtils.getRandomItem(this._cardInBuckedArray);
            var returnCard = '';
            var randomUpDown = this.game.rnd.integerInRange(0, 1);
            if (cardName == 'A_B' || cardName == 'A_R') {
                if (randomUpDown == 0) {
                    returnCard = 'K_R';
                }
                else {
                    returnCard = '2_B';
                }
            }
            else if (cardName == '2_B' || cardName == '2_R') {
                if (randomUpDown == 0) {
                    returnCard = 'A_B';
                }
                else {
                    returnCard = '3_R';
                }
            }
            else if (cardName == '3_B' || cardName == '3_R') {
                if (randomUpDown == 0) {
                    returnCard = '2_R';
                }
                else {
                    returnCard = '4_B';
                }
            }
            else if (cardName == '4_B' || cardName == '4_R') {
                if (randomUpDown == 0) {
                    returnCard = '3_B';
                }
                else {
                    returnCard = '5_R';
                }
            }
            else if (cardName == '5_B' || cardName == '5_R') {
                if (randomUpDown == 0) {
                    returnCard = '4_R';
                }
                else {
                    returnCard = '6_B';
                }
            }
            else if (cardName == '6_B' || cardName == '6_R') {
                if (randomUpDown == 0) {
                    returnCard = '5_B';
                }
                else {
                    returnCard = '7_R';
                }
            }
            else if (cardName == '7_B' || cardName == '7_R') {
                if (randomUpDown == 0) {
                    returnCard = '6_R';
                }
                else {
                    returnCard = '8_B';
                }
            }
            else if (cardName == '8_B' || cardName == '8_R') {
                if (randomUpDown == 0) {
                    returnCard = '7_B';
                }
                else {
                    returnCard = '9_R';
                }
            }
            else if (cardName == '9_B' || cardName == '9_R') {
                if (randomUpDown == 0) {
                    returnCard = '8_R';
                }
                else {
                    returnCard = '10_B';
                }
            }
            else if (cardName == '10_B' || cardName == '10_R') {
                if (randomUpDown == 0) {
                    returnCard = '9_B';
                }
                else {
                    returnCard = 'J_R';
                }
            }
            else if (cardName == 'J_B' || cardName == 'J_R') {
                if (randomUpDown == 0) {
                    returnCard = '10_R';
                }
                else {
                    returnCard = 'Q_B';
                }
            }
            else if (cardName == 'Q_B' || cardName == 'Q_R') {
                if (randomUpDown == 0) {
                    returnCard = 'J_B';
                }
                else {
                    returnCard = 'K_R';
                }
            }
            else if (cardName == 'K_B' || cardName == 'K_R') {
                if (randomUpDown == 0) {
                    returnCard = 'Q_R';
                }
                else {
                    returnCard = 'A_B';
                }
            }
            return returnCard;
        };
        CardHolder.prototype.startNewStage = function (stageNumb) {
            this._cardInBuckedArray = [];
            switch (stageNumb) {
                case 1:
                    this._currentCardNumber = 12;
                    this.generateNewCard('2_B');
                    break;
                case 2:
                    this._currentCardNumber = 14;
                    this.generateNewCard('J_B');
                    break;
                case 3:
                    this._currentCardNumber = 18;
                    this.generateNewCard('10_B');
                    break;
            }
        };
        CardHolder.prototype.activeInput = function (value) {
            this._cardHolderCards.inputEnabled = value;
            this._cardHolderBucket.inputEnabled = value;
        };
        CardHolder.prototype.generateNewCard = function (cardName) {
            var _this = this;
            if (window["SOUND"]) {
                var audio = this.game.add.audioSprite('sfx');
                audio.play('card_being_played', 0.3);
            }
            var modificator = 0; //2100;
            //this._cardHolderCardInBucket.angle = 186.8;
            this._cardHolderCardInBucket.alpha = 1;
            this.game.add.tween(this._cardHolderCardInBucket).to({ x: [this._cardHolderCardInBucket.x + 90, this._cardHolderCurrentCard.x], y: [this._cardHolderCurrentCard.y - 90, this._cardHolderCurrentCard.y] }, 425 + modificator, Phaser.Easing.Linear.None, true, 100).interpolation(function (v, k) { return Phaser.Math.catmullRomInterpolation(v, k); }).onComplete.add(function () { _this.endNewCardAnim(cardName); });
            this.game.add.tween(this._cardHolderCardInBucket).to({ angle: 360 }, 425 + modificator, Phaser.Easing.Sinusoidal.In, true);
            this.game.add.tween(this._cardHolderCardInBucket.scale).to({ x: 0, y: 1 }, 212.5 + modificator / 2, Phaser.Easing.Sinusoidal.In, true, 100).onComplete.add(function () { _this._cardHolderCardInBucket.loadTexture("MainAtlas", cardName); _this.game.add.tween(_this._cardHolderCardInBucket.scale).to({ x: 1, y: 1 }, 112.5 + modificator / 2, Phaser.Easing.Sinusoidal.Out, true); });
            this.game.add.tween(this._cardHolderBucket.scale).to({ x: 1.05, y: 0.9 }, 112.5 + modificator / 2, Phaser.Easing.Sinusoidal.In, true).onComplete.add(function () { _this.game.add.tween(_this._cardHolderBucket.scale).to({ x: 1, y: 1 }, 112.5 + modificator / 2, Phaser.Easing.Sinusoidal.Out, true); });
            this.game.add.tween(this._cardHolderCards.scale).to({ x: 1.05, y: 0.9 }, 112.5 + modificator / 2, Phaser.Easing.Sinusoidal.In, true).onComplete.add(function () { _this.game.add.tween(_this._cardHolderCards.scale).to({ x: 1, y: 1 }, 112.5 + modificator / 2, Phaser.Easing.Sinusoidal.Out, true); });
        };
        CardHolder.prototype.endNewCardAnim = function (cardName) {
            this._cardHolderCardInBucket.x = this._hideCardPosX;
            this._cardHolderCardInBucket.y = this._hideCardPosY;
            this._cardHolderCardInBucket.angle = this._hideCardAngle;
            this._cardHolderCardInBucket.scale.set(0.9);
            this._cardHolderCardInBucket.loadTexture("MainAtlas", "card_back");
            this._cardHolderCardInBucket.alpha = 0;
            this.activeInput(true);
            this._currentCardName = cardName;
            this.addCardInCurrentCard(this._currentCardName);
        };
        CardHolder.prototype.addCardInCurrentCard = function (cardName) {
            var _this = this;
            if (this._currentCardNumber != 0) {
                if (this._cardHolderCurrentCard.alpha == 0) {
                    this._cardHolderCurrentCard.alpha = 1;
                }
                this._cardHolderCurrentCard.loadTexture("MainAtlas", cardName);
                this._cardTween = this.game.add.tween(this._cardHolderCurrentCard).to({ y: this._cardHolderCurrentCard.y + 5 }, 25, Phaser.Easing.Sinusoidal.In, true);
                this._cardTween.onComplete.add(function () { _this.game.add.tween(_this._cardHolderCurrentCard).to({ y: _this._cardHolderCurrentCard.y - 5 }, 100, Phaser.Easing.Sinusoidal.InOut, true); _this.checkPlayerMove(); }); // 
            }
            if (window["SOUND"]) {
                var audio = this.game.add.audioSprite('sfx');
                audio.play('card_landing_on_card', 0.3);
            }
        };
        CardHolder.prototype.cardCheck = function (cardName, findCard) {
            if (findCard === void 0) { findCard = false; }
            var rightCard = false;
            if (this._currentCardName != '') {
                if (cardName == 'A_B' || cardName == 'A_R') {
                    if (this._currentCardName == 'K_R' || this._currentCardName == 'K_B' || this._currentCardName == '2_R' || this._currentCardName == '2_B') {
                        rightCard = true;
                    }
                }
                else if (cardName == '2_B' || cardName == '2_R') {
                    if (this._currentCardName == 'A_R' || this._currentCardName == 'A_B' || this._currentCardName == '3_R' || this._currentCardName == '3_B') {
                        rightCard = true;
                    }
                }
                else if (cardName == '3_B' || cardName == '3_R') {
                    if (this._currentCardName == '2_R' || this._currentCardName == '2_B' || this._currentCardName == '4_R' || this._currentCardName == '4_B') {
                        rightCard = true;
                    }
                }
                else if (cardName == '4_B' || cardName == '4_R') {
                    if (this._currentCardName == '3_R' || this._currentCardName == '3_B' || this._currentCardName == '5_R' || this._currentCardName == '5_B') {
                        rightCard = true;
                    }
                }
                else if (cardName == '5_B' || cardName == '5_R') {
                    if (this._currentCardName == '6_R' || this._currentCardName == '6_B' || this._currentCardName == '4_R' || this._currentCardName == '4_B') {
                        rightCard = true;
                    }
                }
                else if (cardName == '6_B' || cardName == '6_R') {
                    if (this._currentCardName == '7_R' || this._currentCardName == '7_B' || this._currentCardName == '5_R' || this._currentCardName == '5_B') {
                        rightCard = true;
                    }
                }
                else if (cardName == '7_B' || cardName == '7_R') {
                    if (this._currentCardName == '6_R' || this._currentCardName == '6_B' || this._currentCardName == '8_R' || this._currentCardName == '8_B') {
                        rightCard = true;
                    }
                }
                else if (cardName == '8_B' || cardName == '8_R') {
                    if (this._currentCardName == '7_R' || this._currentCardName == '7_B' || this._currentCardName == '9_R' || this._currentCardName == '9_B') {
                        rightCard = true;
                    }
                }
                else if (cardName == '9_B' || cardName == '9_R') {
                    if (this._currentCardName == '10_R' || this._currentCardName == '10_B' || this._currentCardName == '8_R' || this._currentCardName == '8_B') {
                        rightCard = true;
                    }
                }
                else if (cardName == '10_B' || cardName == '10_R') {
                    if (this._currentCardName == 'J_R' || this._currentCardName == 'J_B' || this._currentCardName == '9_R' || this._currentCardName == '9_B') {
                        rightCard = true;
                    }
                }
                else if (cardName == 'J_B' || cardName == 'J_R') {
                    if (this._currentCardName == '10_R' || this._currentCardName == '10_B' || this._currentCardName == 'Q_R' || this._currentCardName == 'Q_B') {
                        rightCard = true;
                    }
                }
                else if (cardName == 'Q_B' || cardName == 'Q_R') {
                    if (this._currentCardName == 'J_R' || this._currentCardName == 'J_B' || this._currentCardName == 'K_R' || this._currentCardName == 'K_B') {
                        rightCard = true;
                    }
                }
                else if (cardName == 'K_B' || cardName == 'K_R') {
                    if (this._currentCardName == 'A_R' || this._currentCardName == 'A_B' || this._currentCardName == 'Q_R' || this._currentCardName == 'Q_B') {
                        rightCard = true;
                    }
                }
            }
            if (rightCard) {
                if (!findCard) {
                    this._currentCardNumber -= 1;
                    this.deleteRightCard(cardName);
                    if (this._currentCardNumber == 0) {
                        this.game.tweens.remove(this._cardTween);
                        this.game.add.tween(this._cardHolderCurrentCard).to({ y: this._cardHolderCurrentCard.y + 155 }, 75, Phaser.Easing.Sinusoidal.In, true).onComplete.add(this.currentCardSetStartPos, this);
                    }
                    //Спускаем активную карту вниз, когда счётчик доходит до нуля.
                    this._currentCardName = cardName;
                    this.gameScoreText.text = this._currentCardName;
                }
                return true;
            }
            else {
                return false;
            }
        };
        CardHolder.prototype.currentCardSetStartPos = function () {
            this._cardHolderCurrentCard.alpha = 0;
            this._cardHolderCurrentCard.x = 70;
            this._cardHolderCurrentCard.y = -57;
        };
        CardHolder.prototype.inputUp = function () {
            if (!this._gameBlock) {
                var randomCard = this.getRandomCardToPlayer();
                if (randomCard != '') {
                    this.activeInput(false);
                    this.generateNewCard(randomCard);
                    this._arrowStart = false;
                    this._arrowCantMove.alpha = 0;
                    this._arrowCantMove.x = -45;
                    this._arrowCantMove.y = -145;
                    this.game.tweens.remove(this._arrowTwine);
                }
            }
        };
        CardHolder.prototype.getCurrentCardPos = function () {
            var CurrentPoint = this._cardHolderCurrentCard.world;
            if (this._currentCardNumber == 0) {
                CurrentPoint.y += 150;
            }
            return CurrentPoint;
        };
        CardHolder.prototype.getBucketdPos = function () {
            var CurrentPoint = this._cardHolderBucket.world;
            return CurrentPoint;
        };
        return CardHolder;
    })(Phaser.Sprite);
    TBanner.CardHolder = CardHolder;
})(TBanner || (TBanner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TBanner;
(function (TBanner) {
    var CardScore = (function (_super) {
        __extends(CardScore, _super);
        function CardScore(game, x, y, score) {
            _super.call(this, game, x, y);
            this.gameScoreText = this.game.add.bitmapText(x, y, 'font2', '100', 35);
            this.gameScoreText.anchor.set(0.5);
            this.gameScoreText.tint = 0xfefcc7;
            this.game.stage.addChild(this.gameScoreText);
            this.game.time.events.add(Phaser.Timer.SECOND * 0.1, this.changeIndex, this);
            this._currentTween = this.game.add.tween(this.gameScoreText).to({ y: this.gameScoreText.y - 20 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 100);
            this.game.add.tween(this.gameScoreText).to({ alpha: 0 }, 1000, Phaser.Easing.Sinusoidal.Out, true, 100).onComplete.add(this.cardEnd, this);
        }
        CardScore.prototype.changeIndex = function () {
            this.game.stage.setChildIndex(this.gameScoreText, this.game.stage.children.length - 1);
        };
        CardScore.prototype.cardEnd = function () {
            this.game.tweens.remove(this._currentTween);
            this.gameScoreText.destroy();
            this.destroy();
        };
        return CardScore;
    })(Phaser.Sprite);
    TBanner.CardScore = CardScore;
})(TBanner || (TBanner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TBanner;
(function (TBanner) {
    var GameManager = (function (_super) {
        __extends(GameManager, _super);
        function GameManager(game, x, y, cardHolder, scorePlank) {
            _super.call(this, game, x, y);
            this.containerInStage = 0;
            this._cardHolder = cardHolder;
            this._scorePlank = scorePlank;
            this._currentStage = 1;
            this._currentOspriteFromCC = [];
            this._currentCardContainers = [];
            this._buttonUI = new TBanner.OSprite(this.game, 0, 0);
            this._buttonUI.setLandscapePosition(TBanner.Config.defaultHeight, TBanner.Config.defaultWidth, true);
            this._buttonUI.setPortretPosition(TBanner.Config.hw, TBanner.Config.hh, true);
            this._ingameButtonMyakish = this.game.add.sprite(0, 0, "MainAtlas", 'ingameButtonMyakish');
            this._buttonUI.addChild(this._ingameButtonMyakish);
            this._ingameButtonMyakish.anchor.set(0.5);
            this._ingameButtonMyakish.tint = window["btnColor"]; //0x62d63a;
            this._ingameButtonMyakish.alpha = 1;
            this._ingameButtonMyakish.scale.set(1);
            this._buttonUI.inputEnabled = true;
            this._buttonUI.events.onInputDown.add(this.gotoLink, this);
            this._inButtonText = this.game.add.bitmapText(0, 0, 'font2', window["btnLabel"], 35);
            this._ingameButtonMyakish.addChild(this._inButtonText);
            this._inButtonText.anchor.set(0.5);
            this._inButtonText.tint = 0xfefcc7;
            this._inButtonText.align = 'center';
            this._ingameButtonPlank = this.game.add.sprite(0, 0, "MainAtlas", 'ingameButtonPlank');
            this._ingameButtonMyakish.addChild(this._ingameButtonPlank);
            this._ingameButtonPlank.anchor.set(0.5);
            this.startGameBtnYoYoIngame();
            //this.startGameBtnYoYoIngame();
            this.createUI();
            this.startStage();
            if (window["SOUND"]) {
                this.startEmbient();
            }
        }
        GameManager.prototype.changeOrientation = function (isPortret) {
            if (this._currentStage < 4) {
                if (isPortret) {
                    this._ingameButtonMyakish.x = 0;
                    this._ingameButtonMyakish.y = -370;
                }
                else {
                    this._ingameButtonMyakish.x = -160;
                    this._ingameButtonMyakish.y = -50;
                }
            }
            else {
                if (isPortret) {
                    this._ingameButtonMyakish.x = 0;
                    this._ingameButtonMyakish.y = 90;
                }
                else {
                    this._ingameButtonMyakish.x = 0;
                    this._ingameButtonMyakish.y = 90;
                }
            }
        };
        GameManager.prototype.startEmbient = function () {
            if (this._currentStage != 4) {
                var embString = ['forest_bird1', 'forest_bird2', 'forest_bird3'];
                var audio = this.game.add.audioSprite('sfx');
                audio.play(Phaser.ArrayUtils.getRandomItem(embString), 0.05);
                this.game.time.events.add(Phaser.Timer.SECOND * this.game.rnd.realInRange(1.8, 3.5), this.startEmbient, this);
            }
        };
        GameManager.prototype.gotoLink = function () {
            this._buttonUI.inputEnabled = false;
            this.game.input.enabled = false;
            var fnstring = "trackClick";
            var fn = window[fnstring];
            if (typeof fn === "function")
                fn();
        };
        GameManager.prototype.startStage = function () {
            switch (this._currentStage) {
                case 1:
                    this.createFirstStage();
                    this.updateStageText();
                    this.game.time.events.add(Phaser.Timer.SECOND * 0.7, this.startTutorial, this);
                    break;
                case 2:
                    this.createSecondStage();
                    this.updateStageText();
                    break;
                case 3:
                    this.createThirdStage();
                    this.updateStageText();
                    break;
                case 4:
                    //ОКНО ВЫИГРЫША
                    this.gameStageText.y -= 50;
                    this.gameStageKeepText.y -= 50;
                    this.startUIEndAnimation();
                    break;
            }
        };
        GameManager.prototype.startTutorial = function () {
            this._tutorial = new TBanner.Tutorial(this.game, 0, 0, this);
        };
        GameManager.prototype.createUI = function () {
            this._textStageUI = new TBanner.OSprite(this.game, 0, 0);
            this._textStageUI.setLandscapePosition(TBanner.Config.hh, TBanner.Config.hw, true);
            this._textStageUI.setPortretPosition(TBanner.Config.hw, TBanner.Config.hh, true);
            this._textStageUI.alpha = 0;
            this._stageBackOsprite = new TBanner.OSprite(this.game, 0, 0);
            this._stageBackOsprite.setLandscapePosition(0, 0, true);
            this._stageBackOsprite.setPortretPosition(0, 0, true);
            this._stageBackOsprite.setWideMode(true, true);
            this._textStageUI.addChild(this._stageBackOsprite);
            this._blackBack = this.game.add.graphics(0, 0);
            this._blackBack.beginFill(0x000000, 1);
            this._blackBack.alpha = 0.1;
            this._blackBack.drawRect(-568, -568, 1136, 1136);
            this._blackBack.endFill();
            this._stageBackOsprite.addChild(this._blackBack);
            this._hirtEmitter = this.game.add.emitter(0, 0, 70);
            this._hirtEmitter.gravity = 0;
            this._hirtEmitter.setAlpha(1, 0.5, 1300);
            this._hirtEmitter.setScale(1.2, 2.1, 1.2, 2.1, 1300);
            this._hirtEmitter.setXSpeed(-300, 300);
            this._hirtEmitter.setYSpeed(-300, 300);
            this._hirtEmitter.makeParticles("MainAtlas", ['part_1', 'part_2', 'part_3', 'part_4', 'part_5', 'part_6']);
            this._hirtEmitter.start(false, 1400, 2);
            this._hirtEmitter.on = false;
            this._textStageUI.addChild(this._hirtEmitter);
            this.lightFX = this.game.add.sprite(0, 0, "MainAtlas", 'light-spot');
            this._textStageUI.addChild(this.lightFX);
            this.lightFX.anchor.set(0.5);
            this.lightFX.scale.set(0.7);
            this.winFX = this.game.add.sprite(0, 0, "MainAtlas", 'ray_fx');
            this._textStageUI.addChild(this.winFX);
            this.winFX.anchor.set(0.5);
            this.winFX.scale.set(5.7);
            this.winFX.tint = 0xfefcc7;
            this.winFX.alpha = 0.1;
            this._gameLogo = this.game.add.sprite(0, -150, "MainAtlas", 'gameLogo');
            this._textStageUI.addChild(this._gameLogo);
            this._gameLogo.anchor.set(0.5);
            this._gameLogo.scale.set(0.1);
            this._gameLogo.alpha = 0;
            this.gameStageText = this.game.add.bitmapText(0, 0, 'font', '1 OF 3', 75);
            this._textStageUI.addChild(this.gameStageText);
            this.gameStageText.anchor.set(0.5);
            this.gameStageText.fontSize = 1;
            this.gameStageKeepText = this.game.add.bitmapText(0, 50, 'font2', 'KEEP GOING!', 35);
            this._textStageUI.addChild(this.gameStageKeepText);
            this.gameStageKeepText.anchor.set(0.5);
            this.gameStageKeepText.tint = 0xfefcc7;
            this.gameStageKeepText.fontSize = 1;
        };
        GameManager.prototype.startUIEndAnimation = function () {
            this._textStageUI.alpha = 1;
            this._ingameButtonMyakish.alpha = 1;
            this._gameLogo.alpha = 1;
            this._buttonUI.inputEnabled = false;
            this._buttonTween.onComplete.removeAll();
            this.game.tweens.remove(this._buttonTween);
            this._ingameButtonMyakish.x = 0;
            this._ingameButtonMyakish.y = 90;
            this.game.input.onDown.add(this.gotoLink, this);
            this._hirtEmitter.on = true;
            this._buttonUI.setPortretPosition(TBanner.Config.hw, TBanner.Config.hh, true);
            this._buttonUI.setLandscapePosition(TBanner.Config.hh, TBanner.Config.hw, true);
            this.game.stage.setChildIndex(this._buttonUI, this.game.stage.children.length - 1);
            this.gameStageText.text = ''; //'LEVEL COMPLETE!';
            this.gameStageKeepText.text = '';
            this.game.add.tween(this._gameLogo.scale).to({ x: 2, y: 2 }, 300, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(this._blackBack).to({ alpha: 0.4 }, 300, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(this.lightFX.scale).to({ x: 3.7, y: 3.7 }, 300, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(this.winFX).to({ alpha: 0.7 }, 300, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(this.winFX).to({ angle: 360 }, 8400, Phaser.Easing.Linear.None, true).onComplete.add(this.turnFX, this);
            this.game.add.tween(this.gameStageText).to({ fontSize: 75 }, 300, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(this.gameStageKeepText).to({ fontSize: 35 }, 300, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(this._ingameButtonMyakish.scale).to({ x: 1, y: 1 }, 400, Phaser.Easing.Sinusoidal.InOut, true).onComplete.add(this.endGameBtnYoYoIngame, this);
        };
        GameManager.prototype.turnFX = function () {
            this.winFX.angle = 0;
            this.game.add.tween(this.winFX).to({ angle: 360 }, 8400, Phaser.Easing.Linear.None, true).onComplete.add(this.turnFX, this);
        };
        GameManager.prototype.endGameBtnYoYoIngame = function () {
            this.game.tweens.remove(this._buttonTween);
            this._buttonTween = this.game.add.tween(this._ingameButtonMyakish.scale).to({ x: 1.25, y: 1.25 }, 650, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, true);
            this._buttonTween.onComplete.add(this.endGameBtnYoYoIngame, this);
        };
        GameManager.prototype.startGameBtnYoYoIngame = function () {
            this.game.tweens.remove(this._buttonTween);
            this._buttonTween = this.game.add.tween(this._ingameButtonMyakish.scale).to({ x: 0.85, y: 0.85 }, 650, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, true);
            this._buttonTween.onComplete.add(this.startGameBtnYoYoIngame, this);
        };
        GameManager.prototype.startUIAnimation = function () {
            this._textStageUI.alpha = 1;
            this.gameStageText.text = this._currentStage + ' OF 3';
            this.game.add.tween(this._blackBack).to({ alpha: 0.4 }, 300, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(this.lightFX.scale).to({ x: 3.7, y: 3.7 }, 300, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(this.winFX).to({ alpha: 0.7 }, 300, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(this.winFX).to({ angle: 90 }, 2100, Phaser.Easing.Linear.None, true).onComplete.add(this.endUIAnimation, this);
            this.game.add.tween(this.gameStageText).to({ fontSize: 75 }, 300, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(this.gameStageKeepText).to({ fontSize: 35 }, 300, Phaser.Easing.Sinusoidal.Out, true);
        };
        GameManager.prototype.endUIAnimation = function () {
            var _this = this;
            this.game.add.tween(this._blackBack).to({ alpha: 0 }, 300, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(this.lightFX.scale).to({ x: 0, y: 0 }, 300, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(this.winFX).to({ alpha: 0 }, 300, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(this.gameStageText).to({ fontSize: 0 }, 300, Phaser.Easing.Sinusoidal.Out, true);
            this.game.add.tween(this.gameStageKeepText).to({ fontSize: 0 }, 300, Phaser.Easing.Sinusoidal.Out, true).onComplete.add(function () { _this._textStageUI.alpha = 0; _this.winFX.angle = 0; _this.startStage(); });
            ;
        };
        GameManager.prototype.updateStageText = function () {
            this.game.stage.setChildIndex(this._textStageUI, this.game.stage.children.length - 1);
        };
        GameManager.prototype.createFirstStage = function () {
            this._cardHolder.startNewStage(this._currentStage);
            var offX = -15;
            var offY = 40;
            this.containerInStage = 0;
            if (window["SOUND"]) {
                var audio = this.game.add.audioSprite('sfx');
                audio.play('shuffle', 0.3);
            }
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 310, 430);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(180 + offX, 590 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, '3_R', ['J_B'], true, 0, -70);
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 550, 420);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(240 + offX, 575 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, '4_B', ['10_R'], true, 0, -70);
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 790, 410);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(300 + offX, 560 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, '5_B', ['Q_B'], true, 0, -70);
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 310, 280);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(360 + offX, 545 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, '6_R', ['J_R'], true, 0, -70);
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 550, 270);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(420 + offX, 530 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, '7_R', ['10_B'], true, 0, -70);
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 790, 260);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(480 + offX, 515 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, '8_B', ['9_R'], true, 0, -70);
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
        };
        GameManager.prototype.createSecondStage = function () {
            this._cardHolder.startNewStage(this._currentStage);
            var offX = 25;
            var offY = 35;
            if (window["SOUND"]) {
                var audio = this.game.add.audioSprite('sfx');
                audio.play('shuffle', 0.3);
            }
            this.containerInStage = 0;
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 940, 357);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(409 + offX, 590 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, '2_R', ['7_R'], false, -70, 10);
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 700, 382);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(332 + offX, 665 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, 'A_R', ['8_R'], false, -70, -35);
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 460, 382);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(255 + offX, 665 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, 'K_B', ['J_B'], false, -70, -35);
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 220, 357);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(180 + offX, 590 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, 'Q_R');
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 220, 275);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(180 + offX, 325 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, '4_R', ['2_R'], false, 65, -10);
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 460, 250);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(255 + offX, 250 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, '5_R', ['A_B'], false, 70, 35);
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 700, 250);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(332 + offX, 250 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, '4_B', ['K_R'], false, 70, 35);
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 940, 275);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(409 + offX, 325 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, '3_B');
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
        };
        GameManager.prototype.createThirdStage = function () {
            this._cardHolder.startNewStage(this._currentStage);
            var offX = 0;
            var offY = 40;
            if (window["SOUND"]) {
                var audio = this.game.add.audioSprite('sfx');
                audio.play('shuffle', 0.3);
            }
            this.containerInStage = 0;
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 340, 420);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(175 + offX, 590 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, '8_R', ['Q_B', 'Q_B'], true, -70, 10);
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 790, 420);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(317 + offX, 590 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, '9_R', ['4_B', '5_B'], false, -70, 10);
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 790, 320);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(459 + offX, 590 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, '6_B', ['5_R', 'K_R'], true, -70, 10);
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 340, 320);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(175 + offX, 330 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, '8_R', ['J_R', 'J_B'], true, -70, -10);
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 340, 220);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(317 + offX, 330 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, '9_B', ['3_R', '7_B'], false, -70, -10);
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
            this._currentOspriteFromCC[this.containerInStage] = new TBanner.OSprite(this.game, 790, 220);
            this._currentOspriteFromCC[this.containerInStage].setLandscapePosition(459 + offX, 330 + offY, true);
            this._currentCardContainers[this.containerInStage] = new TBanner.CardContainer(this.game, 0, 0, this.containerInStage, this, this._cardHolder, '6_R', ['4_R', '7_R'], true, -70, -10);
            this._currentOspriteFromCC[this.containerInStage].addChild(this._currentCardContainers[this.containerInStage]);
            this.containerInStage += 1;
        };
        GameManager.prototype.changeChildIndex = function (childNumb) {
            this.game.stage.setChildIndex(this._currentOspriteFromCC[childNumb], this.game.stage.children.length - 1);
        };
        GameManager.prototype.destroyCurrentCardContainer = function (currentCont) {
            this.containerInStage -= 1;
            if (this.containerInStage == 0) {
                //ПОДЧИЩАЕМ МАССИВЫ И ПЕРЕХОДИМ НА СЛЕДУЮШУЮ СТАДИЮ ИГРЫ!
                for (var i = 0; i < this._currentOspriteFromCC.length; i++) {
                    this._currentCardContainers[0].destroy();
                    this._currentOspriteFromCC[0].removeChild(this._currentCardContainers[0]);
                    this._currentOspriteFromCC[0].destroy();
                    this._currentCardContainers.splice(0, 1);
                    this._currentOspriteFromCC.splice(0, 1);
                }
                this._currentStage += 1;
                //console.log("STAGEWIN!");
                if (this._currentStage < 4) {
                    this.startUIAnimation();
                    if (window["SOUND"]) {
                        var audio = this.game.add.audioSprite('sfx');
                        audio.play('wedge_found', 0.3);
                    }
                }
                else {
                    this.startUIEndAnimation();
                    if (window["SOUND"]) {
                        var audio = this.game.add.audioSprite('sfx');
                        audio.play('challengecomplete_notification', 0.4);
                        audio.play('wedge_found', 0.3);
                    }
                }
            }
        };
        GameManager.prototype.ccUnblock = function () {
            this._cardHolder._gameBlock = false;
        };
        GameManager.prototype.addScoreInPlank = function () {
            this._scorePlank.addScore();
        };
        return GameManager;
    })(Phaser.Sprite);
    TBanner.GameManager = GameManager;
})(TBanner || (TBanner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TBanner;
(function (TBanner) {
    var ScorePlank = (function (_super) {
        __extends(ScorePlank, _super);
        function ScorePlank(game, x, y) {
            _super.call(this, game, x, y);
            this._totalScore = 0;
            this._currentModificator = 3.42;
            this._starOpenNumb = 0;
            this._currentScore = 0;
            this._allScore = 0;
            this._plankBack = this.game.add.sprite(8, -12.5, "MainAtlas", 'star_plank_bg');
            this._plankBack.anchor.set(0.5);
            this._plankBack.scale.set(1, 1.1);
            this.addChild(this._plankBack);
            this._plankStripe = this.game.add.sprite(-89, -12, "MainAtlas", 'star_plank_stik_begin');
            this._plankStripe.anchor.set(0, 0.5);
            this.addChild(this._plankStripe);
            this._plankStripeEnd = this.game.add.sprite(-86, -12, "MainAtlas", 'star_plank_stik_end');
            this._plankStripeEnd.anchor.set(0.5);
            this.addChild(this._plankStripeEnd);
            this._plankMain = this.game.add.sprite(0, 0, "MainAtlas", 'star_plank');
            this._plankMain.anchor.set(0.5);
            this.addChild(this._plankMain);
            this._gameScoreText = this.game.add.bitmapText(7, -5, 'font2', '' + this._currentScore, 35);
            this._plankMain.addChild(this._gameScoreText);
            this._gameScoreText.anchor.set(0.5);
            this._gameScoreText.tint = 0xfefcc7;
            this._gameScoreText.align = 'center';
            this._plankStar1 = this.game.add.sprite(-6, 21, "MainAtlas", 'star_star');
            this._plankStar1.anchor.set(0.5);
            this._plankStar1.alpha = 0;
            this.addChild(this._plankStar1);
            this._plankStar2 = this.game.add.sprite(44, 21, "MainAtlas", 'star_star');
            this._plankStar2.anchor.set(0.5);
            this._plankStar2.alpha = 0;
            this.addChild(this._plankStar2);
            this._plankStar3 = this.game.add.sprite(92, 21, "MainAtlas", 'star_star');
            this._plankStar3.anchor.set(0.5);
            this._plankStar3.alpha = 0;
            this.addChild(this._plankStar3);
        }
        ScorePlank.prototype.addScore = function () {
            this._totalScore += this._currentModificator;
            this._allScore += 100;
            this.game.add.tween(this._plankStripe.scale).to({ x: this._plankStripe.scale.x + this._currentModificator }, 200, Phaser.Easing.Back.In, true);
            this.game.add.tween(this._plankStripeEnd).to({ x: (this._plankStripeEnd.x + this._currentModificator * 2) }, 200, Phaser.Easing.Back.In, true).onComplete.add(this.starOpenCheck, this);
            this.scoreUpdate();
        };
        ScorePlank.prototype.scoreUpdate = function () {
            if (this._currentScore < this._allScore) {
                this._currentScore += 2;
                this._gameScoreText.text = '' + this._currentScore;
                this.game.time.events.add(1, this.scoreUpdate, this);
            }
        };
        ScorePlank.prototype.starOpenCheck = function () {
            if (this._starOpenNumb == 0 && this._totalScore >= 41) {
                this._starOpenNumb += 1;
                this._currentModificator = 1.79;
                this._plankStar1.alpha = 1;
                this._plankStar1.scale.set(0.1);
                this.game.add.tween(this._plankStar1.scale).to({ x: 1, y: 1 }, 400, Phaser.Easing.Back.Out, true);
            }
            if (this._starOpenNumb == 1 && this._totalScore >= 66) {
                this._starOpenNumb += 1;
                this._currentModificator = 1.89;
                this._plankStar2.alpha = 1;
                this._plankStar2.scale.set(0.1);
                this.game.add.tween(this._plankStar2.scale).to({ x: 1, y: 1 }, 400, Phaser.Easing.Back.Out, true);
            }
            if (this._starOpenNumb == 2 && this._totalScore >= 90) {
                this._starOpenNumb += 1;
                this._plankStar3.alpha = 1;
                this._plankStar3.scale.set(0.1);
                this.game.add.tween(this._plankStar3.scale).to({ x: 1, y: 1 }, 400, Phaser.Easing.Back.Out, true);
            }
        };
        return ScorePlank;
    })(Phaser.Sprite);
    TBanner.ScorePlank = ScorePlank;
})(TBanner || (TBanner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TBanner;
(function (TBanner) {
    var Tutorial = (function (_super) {
        __extends(Tutorial, _super);
        function Tutorial(game, x, y, manager) {
            _super.call(this, game, x, y, '');
            this._gameManager = manager;
            this._tutorialBackOsprite = new TBanner.OSprite(this.game, 0, 0);
            this._tutorialBackOsprite.setLandscapePosition(TBanner.Config.hh, TBanner.Config.hw, true);
            this._tutorialBackOsprite.setPortretPosition(TBanner.Config.hw, TBanner.Config.hh, true);
            this._tutorialBackOsprite.setWideMode(true, true);
            this._tutorialBack = this.game.add.graphics(0, 0);
            this._tutorialBack.beginFill(0x000000, 1);
            this._tutorialBack.alpha = 0.5;
            this._tutorialBack.drawRect(-568, -568, 1136, 1136);
            this._tutorialBack.endFill();
            this._tutorialBackOsprite.addChild(this._tutorialBack);
            this._tutorialTipsOsprite = new TBanner.OSprite(this.game, TBanner.Config.hw, 0);
            this._tutorialTipsOsprite.setLandscapePosition(TBanner.Config.hh, 0, true);
            this._tutorialTips = this.game.add.sprite(0, 0, "MainAtlas", 'tutorialTips');
            this._tutorialTipsOsprite.addChild(this._tutorialTips);
            this._tutorialTips.anchor.set(0.5);
            this.game.add.tween(this._tutorialTips).to({ y: this._tutorialTips.y + 50 }, 300, Phaser.Easing.Sinusoidal.Out, true);
            this._tutorialCard1Osprite = new TBanner.OSprite(this.game, 310, 430);
            this._tutorialCard1Osprite.setLandscapePosition(165, 630, true);
            this._tutorialCard1 = this.game.add.sprite(0, 0, "MainAtlas", '3_R');
            this._tutorialCard1Osprite.addChild(this._tutorialCard1);
            this._tutorialCard1.anchor.set(0.5);
            this.inputEnabled = true;
            this.game.input.onDown.add(this.onTap, this);
            this._tutorialArrow = this.game.add.sprite(45, -85, "MainAtlas", 'arrow_tutorial');
            this._tutorialCard1Osprite.addChild(this._tutorialArrow);
            this._tutorialArrow.anchor.set(0.5);
            this.startArrowTween();
            this._tutorialCard2Osprite = new TBanner.OSprite(this.game, TBanner.Config.hw, TBanner.Config.defaultHeight);
            this._tutorialCard2Osprite.setLandscapePosition(TBanner.Config.hh, TBanner.Config.defaultWidth, true);
            this._tutorialCard2 = this.game.add.sprite(70, -75, "MainAtlas", '2_B');
            this._tutorialCard2Osprite.addChild(this._tutorialCard2);
            this._tutorialCard2.anchor.set(0.5);
            var phaserRect = new Phaser.Rectangle(0, 0, this._tutorialCard2.width, this._tutorialCard2.height * 0.9);
            this._tutorialCard2.crop(phaserRect, false);
        }
        Tutorial.prototype.startArrowTween = function () {
            this._arrowTwine = this.game.add.tween(this._tutorialArrow).to({ y: this._tutorialArrow.y + 10 }, 300, Phaser.Easing.Sinusoidal.Out, true, 0, 0, true);
            this._arrowTwine.onComplete.add(this.startArrowTween, this);
        };
        Tutorial.prototype.onTap = function () {
            if (this._tutorialCard1.getBounds().contains(this.game.input.x, this.game.input.y)) {
                console.log('TUTORIAL!');
                this.inputEnabled = false;
                this.game.input.onDown.remove(this.onTap, this);
                this.game.tweens.remove(this._arrowTwine);
                this._tutorialCard2.destroy();
                this._tutorialCard1.destroy();
                this._tutorialArrow.destroy();
                this._tutorialBack.destroy();
                this._tutorialTips.destroy();
                this._tutorialTipsOsprite.destroy();
                this._tutorialBackOsprite.destroy();
                this._tutorialCard1Osprite.destroy();
                this._tutorialCard2Osprite.destroy();
                this._gameManager.ccUnblock();
            }
        };
        return Tutorial;
    })(Phaser.Sprite);
    TBanner.Tutorial = Tutorial;
})(TBanner || (TBanner = {}));

var TBanner;
(function (TBanner) {
    var Config = (function () {
        function Config() {
        }
        Config.isLandscape = function () {
            return this.height < this.width;
        };
        Config.isDefaultLandscape = function () {
            return this.defaultHeight < this.defaultWidth;
        };
        Config.changeScale = function (game) {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            var dw = this.width;
            var dh = this.height;
            if (this.isLandscape() != this.isDefaultLandscape()) {
                dw = this.height;
                dh = this.width;
            }
            this.scale = Math.min(dw / this.defaultWidth, dh / this.defaultHeight);
            this.maxScale = Math.max(dw / this.defaultWidth, dh / this.defaultHeight) / this.scale;
            //console.log("scale", this.scale, this.isLandscape() != game.scale.isLandscape, this.isLandscape() , game.scale.isLandscape)
            this.width /= this.scale;
            this.height /= this.scale;
            game.scale.setUserScale(this.scale, this.scale, 0, 0);
            game.scale.setGameSize(this.width, this.height);
            game.world.setBounds(0, 0, this.width, this.height);
            game.scale.refresh();
        };
        Object.defineProperty(Config, "halfWidth", {
            get: function () {
                return Config.width * 0.5;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Config, "halfHeight", {
            get: function () {
                return Config.height * 0.5;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Config, "hw", {
            get: function () {
                return Config.defaultWidth * 0.5;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Config, "hh", {
            get: function () {
                return Config.defaultHeight * 0.5;
            },
            enumerable: true,
            configurable: true
        });
        Config.defaultWidth = 1136;
        Config.defaultHeight = 640;
        Config.scale = 1;
        Config.maxScale = 1;
        return Config;
    })();
    TBanner.Config = Config;
})(TBanner || (TBanner = {}));

var TBanner;
(function (TBanner) {
    var Main = (function () {
        function Main() {
            this.game = new Phaser.Game(TBanner.Config.defaultWidth, TBanner.Config.defaultHeight, Phaser.AUTO, 'banner', null, false);
            TBanner.Config.globalEvents = new TBanner.OEventDispatcher();
            this.game.state.add('Boot', TBanner.Boot, true);
            this.game.state.add('Body', TBanner.Body);
        }
        return Main;
    })();
    TBanner.Main = Main;
})(TBanner || (TBanner = {}));
window.onload = function () {
    var game = new TBanner.Main();
    console.log("Load");
    console.log('[Solitaire Blast Banner] ver: ' + '1.0.0');
    setTimeout("window.scrollTo(0, 1)", 10);
};

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TBanner;
(function (TBanner) {
    var OButton = (function (_super) {
        __extends(OButton, _super);
        function OButton(game, key, frame, cb) {
            if (cb === void 0) { cb = null; }
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
            _super.call(this, game, 0, 0, key, null, null, over, up, down, null);
            this._framesString = [up, over, down];
            this.soundOver = "over";
            this.soundDown = "click";
            this.anchor.setTo(0.5);
            this._cb = cb;
            this._deltaScale = 0.1;
            this._defaultScale = 1.0;
            this._isDown = false;
            this._isOver = false;
            this.onInputOver.add(this.over, this);
            this.onInputOut.add(this.out, this);
            this.onInputDown.add(this.down, this);
            this.onInputUp.add(this.up, this);
            //this.onInputOverHandler.add(this.over, this);
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
        OButton.prototype.over = function () {
            if (!this._isDown) {
                this.scale.set(this._defaultScale + this._deltaScale);
            }
            this._isOver = true;
            console.log("OVER");
        };
        OButton.prototype.out = function () {
            if (!this._isDown) {
                this.scale.set(this._defaultScale);
            }
            this._isOver = false;
        };
        OButton.prototype.up = function () {
            var _this = this;
            this.scale.set(this._isOver ? this._defaultScale + this._deltaScale : this._defaultScale);
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
                // this.setCheck(!this._check);
                //soundClick
                //Config.audio.play(this.soundClick);
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
    })(Phaser.Button);
    TBanner.OButton = OButton;
})(TBanner || (TBanner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TBanner;
(function (TBanner) {
    var OButtonCheck = (function (_super) {
        __extends(OButtonCheck, _super);
        function OButtonCheck(game, key, frameOn, frameOff, cb) {
            if (cb === void 0) { cb = null; }
            var upOn = null;
            var overOn = null;
            var downOn = null;
            var upOff = null;
            var overOff = null;
            var downOff = null;
            if (frameOn.length > 0) {
                upOn = frameOn[0];
                if (frameOn.length > 1) {
                    overOn = frameOn[1];
                    if (frameOn.length > 2)
                        downOn = frameOn[2];
                    else
                        downOn = frameOn[0];
                }
                else {
                    overOn = frameOn[0];
                    downOn = frameOn[0];
                }
            }
            if (frameOff.length > 0) {
                upOff = frameOff[0];
                if (frameOff.length > 1) {
                    overOff = frameOff[1];
                    if (frameOff.length > 2)
                        downOff = frameOff[2];
                    else
                        downOff = frameOff[0];
                }
                else {
                    overOff = frameOff[0];
                    downOff = frameOff[0];
                }
            }
            _super.call(this, game, 0, 0, key, null, null, overOn, upOn, downOn, null);
            this._framesString = [upOn, overOn, downOn, upOff, overOff, downOff];
            this._check = true;
            this.soundOver = "over";
            this.soundDown = "click";
            this.anchor.setTo(0.5);
            this._cb = cb;
            this._deltaScale = 0.1;
            this._defaultScale = 1.0;
            this._isDown = false;
            this._isOver = false;
            this.onInputOver.add(this.over, this);
            this.onInputOut.add(this.out, this);
            this.onInputDown.add(this.down, this);
            this.onInputUp.add(this.up, this);
            //this.onInputOverHandler.add(this.over, this);
        }
        OButtonCheck.prototype.setCheck = function (value) {
            if (this._check == value) {
                return;
            }
            this._check = value;
            var delta = 0;
            if (!value) {
                delta = 3;
            }
            this.setFrames(this._framesString[delta + 1], this._framesString[delta], this._framesString[delta + 2], this._framesString[delta]);
        };
        Object.defineProperty(OButtonCheck.prototype, "check", {
            get: function () {
                return this._check;
            },
            enumerable: true,
            configurable: true
        });
        OButtonCheck.prototype.setCBContext = function (cntx) {
            this._cntxt = cntx;
        };
        OButtonCheck.prototype.setAnimationScale = function (delta, defaultScale) {
            if (delta === void 0) { delta = 0; }
            if (defaultScale === void 0) { defaultScale = 1; }
            this._deltaScale = delta;
            this._defaultScale = defaultScale;
        };
        OButtonCheck.prototype.over = function () {
            if (!this._isDown) {
                this.scale.set(this._defaultScale + this._deltaScale);
            }
            this._isOver = true;
            console.log("OVER");
        };
        OButtonCheck.prototype.out = function () {
            if (!this._isDown) {
                this.scale.set(this._defaultScale);
            }
            this._isOver = false;
        };
        OButtonCheck.prototype.up = function () {
            var _this = this;
            this.scale.set(this._isOver ? this._defaultScale + this._deltaScale : this._defaultScale);
            var tap = (this.game.device.desktop ? this._isOver : this.input.pointerOver());
            if (this._isOver) {
                this.frameName = this._framesString[1 + (this._check ? 0 : 3)];
            }
            else {
                if (tap) {
                    setTimeout(function () {
                        _this.frameName = _this._framesString[(_this._check ? 0 : 3)];
                    }, 5);
                }
            }
            this._isDown = false;
            if (tap && this._cb != null) {
                // this.setCheck(!this._check);
                //soundClick
                //Config.audio.play(this.soundClick);
                this.setCheck(!this.check);
                if (this._cntxt)
                    this._cb.bind(this._cntxt)();
                else
                    this._cb();
                this.frameName = this._framesString[(this._check ? 0 : 3)];
            }
            else {
                if (tap == false)
                    this.scale.set(this._defaultScale);
            }
        };
        OButtonCheck.prototype.down = function () {
            this.scale.set(this._defaultScale - this._deltaScale);
            this._isDown = true;
        };
        OButtonCheck.prototype.deleteFromParent = function () {
            if (this.parent) {
                this.parent.removeChild(this);
            }
            this.onInputOver.remove(this.over, this);
            this.onInputOut.remove(this.out, this);
            this.onInputDown.remove(this.down, this);
            this.onInputUp.remove(this.up, this);
        };
        Object.defineProperty(OButtonCheck.prototype, "enabled", {
            set: function (value) {
                var _this = this;
                this.inputEnabled = value;
                if (!value) {
                    setTimeout(function () {
                        _this.frameName = _this._framesString[(_this._check ? 0 : 3)];
                        _this.scale.set(_this._defaultScale);
                    }, 5);
                }
            },
            enumerable: true,
            configurable: true
        });
        return OButtonCheck;
    })(Phaser.Button);
    TBanner.OButtonCheck = OButtonCheck;
})(TBanner || (TBanner = {}));

var TBanner;
(function (TBanner) {
    var OEvent = (function () {
        function OEvent(name, cb, useCapture) {
            if (useCapture === void 0) { useCapture = false; }
            this.name = name;
            this.cb = cb;
            this.useCapture = useCapture;
        }
        return OEvent;
    })();
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
        OEventDispatcher.prototype.dispatch = function (msg) {
            for (var i = 0; i < this._listeners.length; i++) {
                if (msg == this._listeners[i].name) {
                    this._listeners[i].cb();
                    if (this._listeners[i].useCapture) {
                        return;
                    }
                }
            }
        };
        return OEventDispatcher;
    })();
    TBanner.OEventDispatcher = OEventDispatcher;
})(TBanner || (TBanner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TBanner;
(function (TBanner) {
    var OSprite = (function (_super) {
        __extends(OSprite, _super);
        function OSprite(game, x, y, key, frame) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            _super.call(this, game, 0, 0, key, frame);
            this.anchor.set(0.5);
            game.stage.addChild(this);
            this._landscapeScale = 1.0;
            this._portretScale = 1.0;
            this._wideMode = false;
            this._leftOffset = null;
            this._bottomOffset = null;
            this.setPortretPosition(x, y);
            this.setLandscapePosition(x, y);
            this._factory = new OFactory(game, this);
            TBanner.Config.globalEvents.on("changeOrientationAndResize", this.changeOrientation.bind(this), false);
            //window.addEventListener("changeOrientationAndResize", this.changeOrientation.bind(this), false)
        }
        /*
            Устанавливаем ОТНОСИТЕЛЬНУЮ позицию. На разных устройствах визуальное положение компонента
            может слегка отличаться
        */
        OSprite.prototype.setPortretPosition = function (x, y, update) {
            this._portretX = x / TBanner.Config.defaultWidth;
            this._portretY = y / TBanner.Config.defaultHeight;
            this._leftOffset = null;
            if (update) {
                this.changeOrientation();
            }
        };
        OSprite.prototype.setLandscapePosition = function (x, y, update) {
            this._landscapeX = x / TBanner.Config.defaultHeight;
            this._landscapeY = y / TBanner.Config.defaultWidth;
            this._bottomOffset = null;
            if (update) {
                this.changeOrientation();
            }
        };
        /*
            Устанавливаем сдвиги, относительно краев текущего экрана.
        */
        OSprite.prototype.setLeftOffset = function (value, update) {
            this._leftOffset = value;
            this._portretX = null;
            this._rigthOffset = null;
            if (update) {
                this.changeOrientation();
            }
        };
        OSprite.prototype.setBottomOffset = function (value, update) {
            this._bottomOffset = value;
            this._landscapeY = null;
            this._topOffset = null;
            if (update) {
                this.changeOrientation();
            }
        };
        OSprite.prototype.setRightOffset = function (value, update) {
            this._rigthOffset = value;
            this._portretX = null;
            this._leftOffset = null;
            if (update) {
                this.changeOrientation();
            }
        };
        OSprite.prototype.setTopOffset = function (value, update) {
            this._topOffset = value;
            this._landscapeY = null;
            this._bottomOffset = null;
            if (update) {
                this.changeOrientation();
            }
        };
        /*
            Можно установить дополнительные модификаторы для скейла в определенных ориентациях
        */
        OSprite.prototype.setCustomScale = function (portret, landscape, update) {
            if (portret === void 0) { portret = 1; }
            if (landscape === void 0) { landscape = 1; }
            this._portretScale = portret;
            this._landscapeScale = landscape;
            if (update) {
                this.changeOrientation();
            }
        };
        OSprite.prototype.getCustomScale = function () {
            if (TBanner.Config.isLandscape()) {
                return this._landscapeScale;
            }
            else {
                return this._portretScale;
            }
        };
        /*
            Общий скейл выбирается, как наименьшее среди частных соответствующих компонент размера текущего экрана и дефолтных.
            Эта опция позволяет для отдельно взятого спрайта устанавить такой скейл, будто бы выбирается максимальные значения.
            Имеет смысл применять только для тех вещей, которые растягиваются на весь экран.
        */
        OSprite.prototype.setWideMode = function (value, update) {
            this._wideMode = value;
            if (update) {
                this.changeOrientation();
            }
        };
        /*
            А тут творится магия.
        */
        OSprite.prototype.changeOrientation = function () {
            var coef = 1;
            if (this._wideMode) {
                coef = TBanner.Config.maxScale;
            }
            var offsetX = this._leftOffset;
            if (this._rigthOffset)
                offsetX = this._rigthOffset + TBanner.Config.width;
            var offsetY = this._topOffset;
            if (this._bottomOffset)
                offsetY = this._bottomOffset + TBanner.Config.height;
            if (TBanner.Config.isLandscape()) {
                this.x = offsetX ? offsetX : (TBanner.Config.width * this._landscapeX);
                this.y = offsetY ? offsetY : (TBanner.Config.height * this._landscapeY);
                this.scale.x = this.scale.y = this._landscapeScale * coef;
            }
            else {
                this.x = offsetX ? offsetX : (TBanner.Config.width * this._portretX);
                this.y = offsetY ? offsetY : (TBanner.Config.height * this._portretY);
                this.scale.x = this.scale.y = this._portretScale * coef;
            }
            //this.anchor.set(0.5);
        };
        OSprite.prototype.add = function () {
            return this._factory;
        };
        return OSprite;
    })(Phaser.Sprite);
    TBanner.OSprite = OSprite;
    var OFactory = (function () {
        function OFactory(game, sprite) {
            this._game = game;
            this._parent = sprite;
        }
        OFactory.prototype.button = function (key, frame, cb) {
            var btn = new TBanner.OButton(this._game, key, frame, cb);
            this._parent.addChild(btn);
            return btn;
        };
        return OFactory;
    })();
})(TBanner || (TBanner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TBanner;
(function (TBanner) {
    var OSpritePortret = (function (_super) {
        __extends(OSpritePortret, _super);
        function OSpritePortret(game, colorbg, alphabg) {
            _super.call(this, game, 0, 0);
            this.anchor.set(0.5);
            game.stage.addChild(this);
            if (colorbg) {
                this.setBackGround(colorbg, alphabg);
            }
            this.changeOrientation();
            TBanner.Config.globalEvents.on("changeOrientationAndResize", this.changeOrientation.bind(this), false);
        }
        OSpritePortret.prototype.setBackGround = function (color, alpha) {
            alpha = alpha ? alpha : 1;
            var bg = this.game.add.graphics(0, 0);
            bg.beginFill(color, alpha);
            bg.drawRect(-TBanner.Config.defaultWidth * 0.5, -TBanner.Config.defaultHeight * 0.5, TBanner.Config.defaultWidth, TBanner.Config.defaultHeight);
            bg.endFill();
            this.addChild(bg);
        };
        OSpritePortret.prototype.onMask = function () {
            this._mask = this.game.add.graphics(0, 0);
            this._mask.beginFill(0, 1.0);
            this._mask.drawRect(-TBanner.Config.defaultWidth * 0.5, -TBanner.Config.defaultHeight * 0.5, TBanner.Config.defaultWidth, TBanner.Config.defaultHeight);
            this._mask.endFill();
            this.mask = this._mask;
            this.changeOrientation();
        };
        OSpritePortret.prototype.changeOrientation = function () {
            var scale = Math.min(TBanner.Config.width / TBanner.Config.defaultWidth, TBanner.Config.height / TBanner.Config.defaultHeight);
            this.x = TBanner.Config.width * 0.5;
            this.y = TBanner.Config.height * 0.5;
            if (this._mask) {
                this._mask.x = this.x;
                this._mask.y = this.y;
                this._mask.scale.x = this._mask.scale.y = scale;
            }
            this.scale.x = this.scale.y = scale;
        };
        return OSpritePortret;
    })(Phaser.Sprite);
    TBanner.OSpritePortret = OSpritePortret;
})(TBanner || (TBanner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TBanner;
(function (TBanner) {
    var Body = (function (_super) {
        __extends(Body, _super);
        function Body() {
            _super.apply(this, arguments);
        }
        Body.prototype.create = function () {
            this._background = this.game.add.sprite(0, 0, "background");
            this._background.anchor.set(0.5);
            //Добавляем кардхолдер
            this._cardHolderOsprite = new TBanner.OSprite(this.game, TBanner.Config.hw, TBanner.Config.defaultHeight);
            this._cardHolderOsprite.setLandscapePosition(TBanner.Config.hh, TBanner.Config.defaultWidth, true);
            this._cardHolder = new TBanner.CardHolder(this.game, 0, -12);
            this._cardHolderOsprite.addChild(this._cardHolder);
            this._scorePlankOsprite = new TBanner.OSprite(this.game, TBanner.Config.defaultWidth, 0);
            this._scorePlankOsprite.setLandscapePosition(TBanner.Config.defaultHeight, 0, true);
            this._scorePlank = new TBanner.ScorePlank(this.game, -115, 38);
            this._scorePlankOsprite.addChild(this._scorePlank);
            this._gameManager = new TBanner.GameManager(this.game, 0, 0, this._cardHolder, this._scorePlank);
            TBanner.Config.globalEvents.on("changeOrientationAndResize", this.changeOrientation.bind(this), false);
            this.changeOrientation();
        };
        Body.prototype.changeOrientation = function () {
            var maxScale = Math.max(TBanner.Config.width / TBanner.Config.defaultWidth, TBanner.Config.height / TBanner.Config.defaultHeight);
            this._background.x = TBanner.Config.width * 0.5;
            this._background.y = TBanner.Config.height * 0.5;
            this._background.scale.set(maxScale);
            if (TBanner.Config.isLandscape()) {
                this._gameManager.changeOrientation(false);
            }
            else {
                this._gameManager.changeOrientation(true);
            }
        };
        Body.prototype.update = function () {
        };
        return Body;
    })(Phaser.State);
    TBanner.Body = Body;
})(TBanner || (TBanner = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TBanner;
(function (TBanner) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            // Здесь загружаем ресурсы
            var bg_name = window["BACKGROUND_PICNAME"];
            var texture_json = { "frames": { "10_B": { "frame": { "x": 480, "y": 249, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "10_R": { "frame": { "x": 576, "y": 265, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "2_B": { "frame": { "x": 672, "y": 265, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "2_R": { "frame": { "x": 1, "y": 519, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "3_B": { "frame": { "x": 507, "y": 407, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "3_R": { "frame": { "x": 385, "y": 533, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "4_B": { "frame": { "x": 699, "y": 407, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "4_R": { "frame": { "x": 891, "y": 407, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "5_B": { "frame": { "x": 97, "y": 471, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "5_R": { "frame": { "x": 193, "y": 471, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "6_B": { "frame": { "x": 289, "y": 510, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "6_R": { "frame": { "x": 481, "y": 549, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "7_B": { "frame": { "x": 768, "y": 265, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "7_R": { "frame": { "x": 864, "y": 265, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "8_B": { "frame": { "x": 123, "y": 329, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "8_R": { "frame": { "x": 219, "y": 329, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "9_B": { "frame": { "x": 315, "y": 368, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "9_R": { "frame": { "x": 1, "y": 377, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "A_B": { "frame": { "x": 411, "y": 391, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "A_R": { "frame": { "x": 603, "y": 407, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "J_B": { "frame": { "x": 865, "y": 549, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "J_R": { "frame": { "x": 673, "y": 549, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "K_B": { "frame": { "x": 193, "y": 613, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "K_R": { "frame": { "x": 769, "y": 549, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "Q_B": { "frame": { "x": 97, "y": 613, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "Q_R": { "frame": { "x": 577, "y": 549, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "arrow_tutorial": { "frame": { "x": 948, "y": 1, "w": 60, "h": 73 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 60, "h": 73 }, "sourceSize": { "w": 60, "h": 73 } }, "card_back": { "frame": { "x": 795, "y": 407, "w": 95, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 95, "h": 141 }, "sourceSize": { "w": 95, "h": 141 } }, "card_holder_back": { "frame": { "x": 289, "y": 691, "w": 242, "h": 54 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 242, "h": 54 }, "sourceSize": { "w": 242, "h": 54 } }, "card_holder_bucket": { "frame": { "x": 355, "y": 249, "w": 124, "h": 118 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 124, "h": 118 }, "sourceSize": { "w": 124, "h": 118 } }, "card_holder_cards": { "frame": { "x": 532, "y": 691, "w": 109, "h": 70 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 109, "h": 70 }, "sourceSize": { "w": 109, "h": 70 } }, "card_holder_over": { "frame": { "x": 615, "y": 202, "w": 341, "h": 62 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 341, "h": 62 }, "sourceSize": { "w": 341, "h": 62 } }, "gameLogo": { "frame": { "x": 455, "y": 1, "w": 291, "h": 141 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 291, "h": 141 }, "sourceSize": { "w": 291, "h": 141 } }, "ingameButtonMyakish": { "frame": { "x": 308, "y": 143, "w": 306, "h": 105 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 306, "h": 105 }, "sourceSize": { "w": 306, "h": 105 } }, "ingameButtonPlank": { "frame": { "x": 1, "y": 115, "w": 306, "h": 105 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 306, "h": 105 }, "sourceSize": { "w": 306, "h": 105 } }, "light-spot": { "frame": { "x": 1, "y": 221, "w": 121, "h": 155 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 121, "h": 155 }, "sourceSize": { "w": 121, "h": 155 } }, "part_1": { "frame": { "x": 948, "y": 132, "w": 56, "h": 60 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 56, "h": 60 }, "sourceSize": { "w": 56, "h": 60 } }, "part_2": { "frame": { "x": 1, "y": 661, "w": 90, "h": 78 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 90, "h": 78 }, "sourceSize": { "w": 90, "h": 78 } }, "part_3": { "frame": { "x": 651, "y": 143, "w": 23, "h": 49 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 23, "h": 49 }, "sourceSize": { "w": 23, "h": 49 } }, "part_4": { "frame": { "x": 948, "y": 75, "w": 71, "h": 56 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 71, "h": 56 }, "sourceSize": { "w": 71, "h": 56 } }, "part_5": { "frame": { "x": 615, "y": 143, "w": 35, "h": 41 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 35, "h": 41 }, "sourceSize": { "w": 35, "h": 41 } }, "part_6": { "frame": { "x": 675, "y": 143, "w": 29, "h": 30 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 29, "h": 30 }, "sourceSize": { "w": 29, "h": 30 } }, "ray_fx": { "frame": { "x": 747, "y": 1, "w": 200, "h": 200 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 200, "h": 200 }, "sourceSize": { "w": 200, "h": 200 } }, "star_plank": { "frame": { "x": 123, "y": 249, "w": 231, "h": 79 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 231, "h": 79 }, "sourceSize": { "w": 231, "h": 79 } }, "star_plank_bg": { "frame": { "x": 642, "y": 691, "w": 198, "h": 37 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 198, "h": 37 }, "sourceSize": { "w": 198, "h": 37 } }, "star_plank_stik_begin": { "frame": { "x": 1009, "y": 1, "w": 2, "h": 37 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 2, "h": 37 }, "sourceSize": { "w": 2, "h": 37 } }, "star_plank_stik_end": { "frame": { "x": 1012, "y": 1, "w": 2, "h": 37 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 2, "h": 37 }, "sourceSize": { "w": 2, "h": 37 } }, "star_star": { "frame": { "x": 705, "y": 143, "w": 29, "h": 29 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 29, "h": 29 }, "sourceSize": { "w": 29, "h": 29 } }, "tutorialTips": { "frame": { "x": 1, "y": 1, "w": 453, "h": 113 }, "rotated": false, "trimmed": false, "spriteSourceSize": { "x": 0, "y": 0, "w": 453, "h": 113 }, "sourceSize": { "w": 453, "h": 113 } } }, "meta": { "app": "Adobe Animate", "version": "15.1.1.13", "image": "BannerImages", "format": "RGBA8888", "size": { "w": 1024, "h": 1024 }, "scale": "1" } };
            var music_json = { "resources": ["mygameaudio.ogg", "mygameaudio.mp3"], "spritemap": { "card_being_played": { "start": 0, "end": 0.7586167800453515, "loop": false }, "card_landing_on_card": { "start": 2, "end": 2.2884126984126985, "loop": false }, "challengecomplete_notification": { "start": 4, "end": 8.468004535147394, "loop": false }, "forest_bird1": { "start": 10, "end": 12.456575963718821, "loop": false }, "forest_bird2": { "start": 14, "end": 17.73657596371882, "loop": false }, "forest_bird3": { "start": 19, "end": 21.48269841269841, "loop": false }, "shuffle": { "start": 23, "end": 25.328004535147393, "loop": false }, "swish": { "start": 27, "end": 27.75861678004535, "loop": false }, "wedge_found": { "start": 29, "end": 30.934126984126983, "loop": false } } };
            if (window["baseURL"] != "") {
                this.game.load.baseURL = window["baseURL"];
            }
            this.game.input.touch.preventDefault = false;
            if (window["SOUND"]) {
                //ЗАГРУЗКА ЗВУКОВОГО СПРАЙТА
                this.game.load.audiosprite('sfx', ['assets/sounds/mygameaudio.mp3', 'assets/sounds/mygameaudio.ogg'], null, music_json);
            }
            //ЗАГРУЗКА ФОНА
            this.game.load.image("background", "assets/" + bg_name);
            //ЗАГРУЗКА ВНУТРИИГРОВЫХ ИЗОБРАЖЕНИЙ
            this.game.load.atlasJSONHash('MainAtlas', "assets/BannerImages.png", null, texture_json);
            //Грузим шрифты
            this.game.load.bitmapFont('font', "assets/font.png", null, this.GetFontFile());
            this.game.load.bitmapFont('font2', "assets/font2.png", null, this.GetFontFile2());
        };
        Boot.prototype.create = function () {
            this.game.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            window.addEventListener("resize", this.changeOrientation.bind(this), false);
            this.game.scale.onOrientationChange.add(this.changeOrientation, this);
            this.changeOrientation();
            this.game.state.start("Body", true);
        };
        Boot.prototype.changeOrientation = function () {
            TBanner.Config.changeScale(this.game);
            TBanner.Config.globalEvents.dispatch("changeOrientationAndResize");
        };
        Boot.prototype.GetFontFile = function () {
            return '<font>  <info face="font" size="72" bold="0" italic="0" charset="" unicode="" stretchH="100" smooth="1" aa="1" padding="2,2,2,2" spacing="0,0" outline="0"/>  <common lineHeight="92" base="58" scaleW="153" scaleH="366" pages="1" packed="0"/>  <pages>    <page id="0" file="font.png"/>  </pages>  <chars count="13">    <char id="49" x="2" y="2" width="24" height="57" xoffset="11" yoffset="3" xadvance="37" page="0" chnl="15"/>    <char id="50" x="2" y="61" width="42" height="58" xoffset="2" yoffset="2" xadvance="37" page="0" chnl="15"/>    <char id="51" x="2" y="121" width="40" height="60" xoffset="3" yoffset="2" xadvance="37" page="0" chnl="15"/>    <char id="79" x="2" y="183" width="45" height="60" xoffset="2" yoffset="2" xadvance="40" page="0" chnl="15"/>    <char id="70" x="28" y="2" width="29" height="57" xoffset="4" yoffset="3" xadvance="26" page="0" chnl="15"/>    <char id="33" x="46" y="61" width="20" height="61" xoffset="5" yoffset="0" xadvance="20" page="0" chnl="15"/>    <char id="76" x="59" y="2" width="29" height="57" xoffset="4" yoffset="3" xadvance="24" page="0" chnl="15"/>    <char id="69" x="44" y="124" width="31" height="57" xoffset="4" yoffset="3" xadvance="28" page="0" chnl="15"/>    <char id="86" x="68" y="61" width="47" height="57" xoffset="-1" yoffset="3" xadvance="36" page="0" chnl="15"/>    <char id="67" x="2" y="245" width="35" height="60" xoffset="2" yoffset="2" xadvance="30" page="0" chnl="15"/>    <char id="77" x="90" y="2" width="61" height="57" xoffset="2" yoffset="3" xadvance="56" page="0" chnl="15"/>    <char id="80" x="2" y="307" width="39" height="57" xoffset="4" yoffset="3" xadvance="35" page="0" chnl="15"/>    <char id="84" x="39" y="245" width="34" height="57" xoffset="0" yoffset="3" xadvance="25" page="0" chnl="15"/>    <char id="32" x="0" y="0" width="0" height="0" xoffset="0" yoffset="3" xadvance="16" page="0" chnl="15"/>  </chars> </font>';
        };
        Boot.prototype.GetFontFile2 = function () {
            return '<font>  <info face="font2" size="60" bold="0" italic="0" charset="" unicode="" stretchH="100" smooth="1" aa="1" padding="2,2,2,2" spacing="0,0" outline="0"/>  <common lineHeight="78" base="50" scaleW="219" scaleH="490" pages="1" packed="0"/>  <pages>    <page id="0" file="font2.png"/>  </pages>  <chars count="36">    <char id="65" x="2" y="2" width="49" height="52" xoffset="0" yoffset="1" xadvance="44" page="0" chnl="15"/>    <char id="66" x="2" y="56" width="31" height="50" xoffset="5" yoffset="3" xadvance="35" page="0" chnl="15"/>    <char id="67" x="2" y="108" width="40" height="51" xoffset="3" yoffset="3" xadvance="42" page="0" chnl="15"/>    <char id="68" x="35" y="56" width="39" height="50" xoffset="5" yoffset="3" xadvance="44" page="0" chnl="15"/>    <char id="69" x="53" y="2" width="29" height="50" xoffset="5" yoffset="3" xadvance="34" page="0" chnl="15"/>    <char id="70" x="2" y="161" width="27" height="50" xoffset="5" yoffset="3" xadvance="30" page="0" chnl="15"/>    <char id="71" x="2" y="213" width="49" height="51" xoffset="3" yoffset="3" xadvance="51" page="0" chnl="15"/>    <char id="72" x="31" y="161" width="38" height="50" xoffset="5" yoffset="3" xadvance="44" page="0" chnl="15"/>    <char id="73" x="44" y="108" width="11" height="50" xoffset="5" yoffset="3" xadvance="18" page="0" chnl="15"/>    <char id="74" x="57" y="108" width="25" height="50" xoffset="-1" yoffset="3" xadvance="25" page="0" chnl="15"/>    <char id="75" x="76" y="54" width="38" height="50" xoffset="5" yoffset="3" xadvance="40" page="0" chnl="15"/>    <char id="76" x="84" y="2" width="24" height="50" xoffset="5" yoffset="3" xadvance="27" page="0" chnl="15"/>    <char id="77" x="2" y="266" width="55" height="55" xoffset="4" yoffset="0" xadvance="58" page="0" chnl="15"/>    <char id="78" x="2" y="323" width="44" height="56" xoffset="5" yoffset="0" xadvance="51" page="0" chnl="15"/>    <char id="79" x="53" y="213" width="52" height="51" xoffset="3" yoffset="3" xadvance="54" page="0" chnl="15"/>    <char id="80" x="110" y="2" width="30" height="50" xoffset="5" yoffset="3" xadvance="32" page="0" chnl="15"/>    <char id="81" x="71" y="160" width="53" height="51" xoffset="3" yoffset="3" xadvance="54" page="0" chnl="15"/>    <char id="82" x="84" y="106" width="34" height="50" xoffset="5" yoffset="3" xadvance="36" page="0" chnl="15"/>    <char id="83" x="120" y="54" width="33" height="51" xoffset="3" yoffset="3" xadvance="35" page="0" chnl="15"/>    <char id="84" x="142" y="2" width="32" height="50" xoffset="1" yoffset="3" xadvance="29" page="0" chnl="15"/>    <char id="85" x="120" y="107" width="38" height="50" xoffset="5" yoffset="3" xadvance="44" page="0" chnl="15"/>    <char id="86" x="2" y="381" width="45" height="53" xoffset="0" yoffset="3" xadvance="41" page="0" chnl="15"/>    <char id="87" x="48" y="323" width="68" height="55" xoffset="0" yoffset="1" xadvance="64" page="0" chnl="15"/>    <char id="88" x="155" y="54" width="41" height="50" xoffset="1" yoffset="3" xadvance="37" page="0" chnl="15"/>    <char id="89" x="176" y="2" width="41" height="50" xoffset="0" yoffset="3" xadvance="36" page="0" chnl="15"/>    <char id="33" x="59" y="266" width="12" height="50" xoffset="6" yoffset="3" xadvance="20" page="0" chnl="15"/>    <char id="48" x="73" y="266" width="36" height="51" xoffset="3" yoffset="3" xadvance="37" page="0" chnl="15"/>    <char id="49" x="107" y="213" width="19" height="50" xoffset="8" yoffset="3" xadvance="37" page="0" chnl="15"/>    <char id="50" x="126" y="159" width="35" height="50" xoffset="1" yoffset="3" xadvance="37" page="0" chnl="15"/>    <char id="51" x="160" y="106" width="33" height="51" xoffset="3" yoffset="3" xadvance="37" page="0" chnl="15"/>    <char id="52" x="111" y="265" width="39" height="53" xoffset="0" yoffset="0" xadvance="37" page="0" chnl="15"/>    <char id="53" x="128" y="211" width="35" height="50" xoffset="1" yoffset="3" xadvance="37" page="0" chnl="15"/>    <char id="54" x="2" y="436" width="35" height="52" xoffset="3" yoffset="2" xadvance="37" page="0" chnl="15"/>    <char id="55" x="39" y="436" width="39" height="51" xoffset="3" yoffset="3" xadvance="37" page="0" chnl="15"/>    <char id="56" x="49" y="380" width="33" height="51" xoffset="4" yoffset="3" xadvance="37" page="0" chnl="15"/>    <char id="57" x="80" y="433" width="35" height="52" xoffset="3" yoffset="3" xadvance="37" page="0" chnl="15"/>    <char id="32" x="0" y="0" width="0" height="0" xoffset="3" yoffset="3" xadvance="19" page="0" chnl="15"/>  </chars> </font>';
        };
        return Boot;
    })(Phaser.State);
    TBanner.Boot = Boot;
})(TBanner || (TBanner = {}));
