var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Banner;
(function (Banner) {
    var attackButtons = (function (_super) {
        __extends(attackButtons, _super);
        function attackButtons(game, x, y) {
            _super.call(this, game, x, y, 'attackPlaneIcon');
            this.anchor.set(0.5, 0.5);
            this.scale.set(0); // = 0;
            this._btnAttack1 = new Banner.OButtonFromDragon(this.game, 'attackIcon1', this.btn1Start, this.btn1End); //this.game.add.sprite(0,0,'attackIcon1');
            this._btnAttack1.x = 5;
            this._btnAttack1.y = -50;
            //this._btnAttack1.alpha = 0;
            this._btnAttack1.scale.set(0);
            this._btnAttack1.setCBContext(this);
            this.addChild(this._btnAttack1);
            this._btnAttack2 = new Banner.OButtonFromDragon(this.game, 'attackIcon2', this.btn2Start, this.btn2End); //this.game.add.sprite(0,0,'attackIcon1');
            this._btnAttack2.x = 25;
            this._btnAttack2.y = 15;
            //this._btnAttack2.alpha = 0;
            this._btnAttack2.scale.set(0);
            this._btnAttack2.setCBContext(this);
            this.addChild(this._btnAttack2);
            this._btnAttack3 = new Banner.OButtonFromDragon(this.game, 'attackIcon3', this.btn3Start, this.btn3End); //this.game.add.sprite(0,0,'attackIcon1');
            this._btnAttack3.x = 5;
            this._btnAttack3.y = 80;
            //this._btnAttack3.alpha = 0;
            this._btnAttack3.scale.set(0);
            this._btnAttack3.setCBContext(this);
            this.addChild(this._btnAttack3);
            this._dragNdropObject = new Banner.dragNdropObject(this.game, 0, 0);
            this.addChild(this._dragNdropObject);
            this.startTween();
        }
        attackButtons.prototype.startTween = function () {
            this.game.add.tween(this.scale).to({ x: [this.scale.x, 1], y: [this.scale.y, 1] }, 250, Phaser.Easing.Back.Out, true, 100);
            this.game.add.tween(this._btnAttack1.scale).to({ x: [this._btnAttack1.scale.x, 1], y: [this._btnAttack1.scale.y, 1] }, 250, Phaser.Easing.Back.Out, true, 100);
            this.game.add.tween(this._btnAttack2.scale).to({ x: [this._btnAttack2.scale.x, 1], y: [this._btnAttack2.scale.y, 1] }, 250, Phaser.Easing.Back.Out, true, 100);
            this.game.add.tween(this._btnAttack3.scale).to({ x: [this._btnAttack3.scale.x, 1], y: [this._btnAttack3.scale.y, 1] }, 250, Phaser.Easing.Back.Out, true, 100);
        };
        attackButtons.prototype.btn1Start = function () {
            console.log('StartDrop');
            //Объекту, который драгндропится задаём тексутру кнопки и альфу 1
            this._dragNdropObject.showSprite('attackIcon1');
        };
        attackButtons.prototype.btn1End = function () {
            console.log('EndDrop');
            //Проверяем, куда положили объект. Если не на дракона, то убираем альфу драгндроп-объекта
            //Если на дракона, то всё ок - убираем меню, драгндроп объетка и показываем шкалу атаки 
            this._dragNdropObject.hideSprite();
        };
        attackButtons.prototype.btn2Start = function () {
            //this._btnAttack1.loadTexture('attackIcon2');
            this._dragNdropObject.showSprite('attackIcon2');
        };
        attackButtons.prototype.btn2End = function () {
            //this._btnAttack1.loadTexture('attackIcon2');
            this._dragNdropObject.hideSprite();
        };
        attackButtons.prototype.btn3Start = function () {
            //this._btnAttack1.loadTexture('attackIcon2');
            this._dragNdropObject.showSprite('attackIcon3');
        };
        attackButtons.prototype.btn3End = function () {
            //this._btnAttack1.loadTexture('attackIcon2');
            this._dragNdropObject.hideSprite();
        };
        return attackButtons;
    })(Phaser.Sprite);
    Banner.attackButtons = attackButtons;
})(Banner || (Banner = {}));
