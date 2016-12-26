(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(960, 640, Phaser.CANVAS, 'christmas-catch');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  game.state.add('testbed', require('./states/testbed'));
  

  game.state.start('boot');
};
},{"./states/boot":20,"./states/gameover":21,"./states/menu":22,"./states/play":23,"./states/preload":24,"./states/testbed":25}],2:[function(require,module,exports){
/**
 * Created by JS on 10.12.2015.
 */

"use strict";

var Ability = function() {

};

Ability.NONE = "none";
Ability.JUMP = "jump";
Ability.DASH = "dash";

module.exports = Ability;
},{}],3:[function(require,module,exports){
"use strict";

var BackgroundEventType = require("./BackgroundEventType");
var SnowGenerator = require("./SnowGenerator");

var Background = function(game, decorData, decorInd, fgEffectsContainer) {
	Phaser.Group.call(this, game);

	this.fgEffectsContainer = fgEffectsContainer;
	this.snowGenerator = new SnowGenerator(this.game);
	this.fgEffectsContainer.addChild(this.snowGenerator);
	//this.snowGenerator.start();

	this.decorData = decorData;

	this.onAddedDecorObject = new Phaser.Signal();

	this.bitmapData = this.game.add.bitmapData(960, 640);
	this.mainImage = this.bitmapData.addToWorld();
	this.add(this.mainImage);

	this.objectsLayer = new Phaser.Group(this.game, this);

	this.bouncesUntilDecorStart = this.bouncesUntilDecor = 3;
	this.bouncesUntilDecorMultStart = this.bouncesUntilDecorMult = 0.8; //1.8
	this.bouncesUntilDecorMultAcc = 0.9;
	this.bounces = 0;

	this.imageLoader = new Phaser.Loader(this.game);

	/*var score;
	for (var i = 0; i < 20; i++) {
		console.log(this.bouncesUntilDecor - score, this.bouncesUntilDecorMult);
		score = this.bouncesUntilDecor;
		this.bouncesUntilDecor = Math.round(this.bouncesUntilDecor * (1 + this.bouncesUntilDecorMult));
		this.bouncesUntilDecorMult *= this.bouncesUntilDecorMultAcc;
	}

	this.bouncesUntilDecorStart = this.lastBouncesUntilDecor = this.bouncesUntilDecor = 3;
	this.bouncesUntilDecorMultStart = this.bouncesUntilDecorMult = 0.8; //1.8*/

	//this.skyBmd = this.game.cache.getBitmapData("sky");

	this.flattenNeeded = false;
	this.decorInd = decorInd;
	this.setDecor(decorInd);
};

Background.prototype = Object.create(Phaser.Group.prototype);
Background.prototype.constructor = Background;

Background.prototype.setDecor = function(decorInd) {
	if (this.decorInd != decorInd) {
		//TODO Удалять графику текущих декораций из памяти и загружать графику новых
	}
	this.decorInd = decorInd;
	this.reset();
};

Background.prototype.showNextDecorObject = function(animate) {
	this.bouncesUntilDecor = Math.round(this.bouncesUntilDecor * (1 + this.bouncesUntilDecorMult));
	this.bouncesUntilDecorMult *= this.bouncesUntilDecorMultAcc;
	this.onAddedDecorObject.dispatch();
	if (this.allDecorShown)
		return;
	animate = animate === undefined ? true : animate;

	if (this.decorObjectData.image != undefined) {
		var curDecorImage = this.game.add.image(this.decorObjectData.x, this.decorObjectData.y, this.decorObjectData.image);
		if (this.decorObjectData.anchor === undefined)
			curDecorImage.anchor.setTo(0.5, 0.5);
		else
			curDecorImage.anchor.setTo(this.decorObjectData.anchor.x, this.decorObjectData.anchor.y);
		if (animate) {
			if (this.decorObjectData.behind === undefined || this.decorObjectData.behind == false)
				this.objectsLayer.addChild(curDecorImage);
			else
				this.objectsLayer.addChildAt(curDecorImage, 0);
			//curDecorImage.scale.setTo(0.4, 0.4);
			curDecorImage.y = this.decorObjectData.y + curDecorImage.height * 0.6;
			curDecorImage.scale.y = 0.2;
			this.game.add.tween(curDecorImage)
				.to({y: this.decorObjectData.y}, 0.6 * Phaser.Timer.SECOND, Phaser.Easing.Back.Out, true)
				.onComplete.addOnce(this.drawDecorObject, this, 0, curDecorImage, this.curLayerData.flattenEachObject);
			this.game.add.tween(curDecorImage.scale)
				.to({y: 1}, 0.6 * Phaser.Timer.SECOND, Phaser.Easing.Back.Out, true);
		}
		else {
			this.drawDecorObject(undefined, undefined, curDecorImage, this.curLayerData.flattenEachObject);
		}
	}
	else if (this.decorObjectData.event != undefined) {
		switch (this.decorObjectData.event) {
			case BackgroundEventType.SNOW : {
				this.snowGenerator.start();
				break;
			}
		}
	}
	if (this.curLayerObjects.length == 0) {
		if (!this.curLayerData.flattenEachObject) {
			this.flattenNeeded = true;
		}
		this.curLayerInd++;
		if (this.curLayerInd >= this.decorData[this.decorInd].layers.length) {
			this.allDecorShown = true;
		}
		else {
			this.curLayerData = this.decorData[this.decorInd].layers[this.curLayerInd];
			this.curLayerObjects = this.curLayerData.objects.slice(0);
			this.loadNextObject();
		}
	}
	else {
		this.loadNextObject();
	}
};

Background.prototype.drawDecorObject = function(target, tween, decorImage, flattenEachObject) {
	flattenEachObject = flattenEachObject === undefined ? false : flattenEachObject;
	if (flattenEachObject) {
		this.bitmapData.draw(decorImage, decorImage.x, decorImage.y);
		if (decorImage.parent == this.objectsLayer)
			this.objectsLayer.removeChild(decorImage);
	}
	else if (this.flattenNeeded) {
		this.bitmapData.drawGroup(this.objectsLayer);
		this.objectsLayer.removeAll(true);
	}
};

Background.prototype.reset = function() {
	this.bouncesUntilDecorMult = this.bouncesUntilDecorMultStart;
	this.bouncesUntilDecor = this.bouncesUntilDecorStart;
	this.bounces = 0;
	this.curLayerInd = 0;
	this.allDecorShown = false;
	this.curLayerData = this.decorData[this.decorInd].layers[this.curLayerInd];
	this.curLayerObjects = this.curLayerData.objects.slice(0);
	this.flattenNeeded = false;
	this.objectsLayer.removeAll(true);

	var testObj = new Phaser.Image(this.game, 0, 0, "playAtlas", "coin");
	this.objectsLayer.addChild(testObj);

	this.snowGenerator.stop();
	this.drawSky();

	this.loadNextObject();
};

Background.prototype.loadNextObject = function() {
	if (this.curLayerData.randomOrder)
		this.objectInd = Math.floor(Math.random() * this.curLayerObjects.length);
	else
		this.objectInd = 0;
	this.decorObjectData = this.curLayerObjects.splice(this.objectInd, 1)[0];
	if (this.decorObjectData.image != undefined) {
		if (this.game.cache.checkImageKey(this.decorObjectData.image)) {
			this.decorObjectData.loaded = true;
		}
		else {
			this.decorObjectData.loaded = false;
			this.imageLoader.onFileComplete.add(this.fileLoadCompleteHandler, this);
			this.imageLoader.image(this.decorObjectData.image, "assets/decor/" + this.decorObjectData.image + ".png");
			this.imageLoader.start();
		}
	}
};

Background.prototype.fileLoadCompleteHandler = function(progress, fileKey, success, totalLoadedFiles, totalFiles) {
	if (fileKey == this.decorObjectData.image) {
		this.imageLoader.onFileComplete.remove(this.fileLoadCompleteHandler);
		this.decorObjectData.loaded = true;
	}
};

Background.prototype.addBounce = function() {
	this.bounces++;
	//this.bouncesUntilDecor--;
	if (this.bounces >= this.bouncesUntilDecor)
		this.showNextDecorObject();
};

Background.prototype.drawSky = function() {
	var skyImage = this.game.cache.getImage(this.decorData[this.decorInd].id + "_bg");
	var i;
	var l = Math.ceil(this.game.width / skyImage.width);
	for (i = 0; i < l; i++) {
		//this.bitmapData.draw(skyImage, i * skyImage.width, this.game.height - skyImage.height);
		this.bitmapData.draw(skyImage, i * skyImage.width, 0);
	}
	//skyImage.destroy();
};

module.exports = Background;
},{"./BackgroundEventType":4,"./SnowGenerator":12}],4:[function(require,module,exports){
/**
 * Created by romzes on 12.01.2016.
 */

"use strict";

var BackgroundEventType = function() {

};

BackgroundEventType.SNOW = "snow";

module.exports = BackgroundEventType;
},{}],5:[function(require,module,exports){
/**
 * Created by JS on 17.12.2015.
 */

"use strict";

var BalanceManager = function(game, gold) {
	Phaser.Group.call(this, game);
	this.gold = gold;
	this.position.setTo(this.game.width * 0.5, this.game.height + 70);
	this.goldText = new Phaser.BitmapText(this.game, 0, -9, "chromoFont2", this.gold.toString(10), 72);
	this.goldText.anchor.setTo(0.5, 0.5);
	this.goldText.tint = 0xabcef6;
	this.addChild(this.goldText);
	this.goldIcon = new Phaser.Image(this.game, -this.goldText.width * 0.5 - 30, 0, "playAtlas", "coin");
	this.goldIcon.scale.setTo(0.6, 0.6);
	this.goldIcon.anchor.setTo(0.5, 0.5);
	this.addChild(this.goldIcon);
};

BalanceManager.prototype = Object.create(Phaser.Group.prototype);
BalanceManager.prototype.constructor = BalanceManager;

BalanceManager.prototype.show = function() {
	if (this.tween) {
		try {
			this.tween.stop();
		}
		catch(error) {

		}
		this.tween = null;
	}
	this.game.add.tween(this)
		.to({y:this.game.height - 50}, Phaser.Timer.SECOND * 0.4, Phaser.Easing.Back.Out, true);
};

BalanceManager.prototype.hide = function() {
	this.tween = this.game.add.tween(this)
		.to({y:this.game.height + 80}, Phaser.Timer.SECOND * 0.4, Phaser.Easing.Back.In, true);
};

BalanceManager.prototype.updateBalanceDisplay = function() {
	this.goldText.text = this.gold.toString(10);
	//this.goldText.texture.requiresReTint = true;
	this.goldIcon.x = -this.goldText.width * 0.5 - 30;
};

BalanceManager.prototype.reduceBalance = function(reducedValue) {
	this.gold -= reducedValue;
	this.updateBalanceDisplay();
	/*this.game.add.tween(this)
		.to({y:this.game.height + 80}, Phaser.Timer.SECOND * 0.4, Phaser.Easing.Back.In, true, Phaser.Timer.SECOND * 0.7);*/
};

BalanceManager.prototype.addBalance = function(addedValue) {
	this.gold += addedValue;
	 //this.goldCont.y = this.game.height + 80;
	this.tween = this.game.add.tween(this)
		.to({y:this.game.height - 50}, Phaser.Timer.SECOND * 0.4, Phaser.Easing.Back.Out, true)
		.onComplete.addOnce(function() {
			this.updateBalanceDisplay();
			this.tween = this.game.add.tween(this)
				.to({y:this.game.height + 80}, Phaser.Timer.SECOND * 0.4, Phaser.Easing.Back.In, true, Phaser.Timer.SECOND * 0.7);
			this.tween.onComplete.addOnce(function() {
				this.tween = null;
			}, this)
		}, this);
};

module.exports = BalanceManager;
},{}],6:[function(require,module,exports){
/**
 * Created by romzes on 09.12.2015.
 */

"use strict";

var GameObjectType = function() {

};
GameObjectType.NONE = "none";
GameObjectType.HERO = "hero";
GameObjectType.SACK = "sack";
GameObjectType.COLLECTIBLE = "collectible";
GameObjectType.HOSTILE = "hostile";

module.exports = GameObjectType;
},{}],7:[function(require,module,exports){
/**
 * Created by JS on 18.01.2016.
 */

"use strict";

var LangManager = function(gameTexts, languageId) {
	this.gameTexts = gameTexts[languageId];
};

LangManager.prototype = Object.create(Object);
LangManager.prototype.constructor = Object.constructor;

LangManager.prototype.getLocaleString = function(stringId) {
	return this.gameTexts[stringId];
};

module.exports = LangManager;
},{}],8:[function(require,module,exports){
/**
 * Created by JS on 18.01.2016.
 */

"use strict";

var LanguageId = function() {

};

LanguageId.EN = "en";
LanguageId.ES = "es";
LanguageId.DE = "de";
LanguageId.FR = "fr";
LanguageId.IT = "it";
LanguageId.PT = "pt";
LanguageId.TR = "tr";
LanguageId.RU = "ru";
LanguageId.PL = "pl";
LanguageId.NL = "nl";

module.exports = LanguageId;
},{}],9:[function(require,module,exports){
/**
 * Created by JS on 22.12.2015.
 */

"use strict";

var LittleStars = function(game) {
	Phaser.Group.call(this, game);
};

LittleStars.prototype = Object.create(Phaser.Group.prototype);
LittleStars.prototype.constructor = LittleStars;

LittleStars.prototype.addStarAt = function(x, y, delay) {

};

module.exports = LittleStars;
},{}],10:[function(require,module,exports){
/**
 * Created by JS on 15.12.2015.
 */

"use strict";

var PauseMenu = function(game, sound) {
	Phaser.Group.call(this, game);

	this.pauseBtn = this.game.add.button(this.game.width - 65, 65,	"playAtlas", this.pauseButtonHandler, this,
		"btn_pause", "btn_pause", "btn_pause", "btn_pause", this);
	this.pauseBtn.anchor.setTo(0.5, 0.5);
	this.pauseBtn.visible = false;
	this.pauseBtn.alpha = 0.5;

	this.unpauseBtn = this.game.add.button(this.game.width * 0.5, this.game.height * 0.5,	"playAtlas", this.unpauseButtonHandler, this,
		"btn_unpause", "btn_unpause", "btn_unpause", "btn_unpause", this);
	this.unpauseBtn.anchor.setTo(0.5, 0.5);
	this.unpauseBtn.visible = false;

	this.game.sound.mute = !sound;
	var soundBtnTextureKey = sound ? "btn_sound" : "btn_sound_off";
	this.soundBtn = this.game.add.button(65, 65,	"playAtlas", this.soundButtonHandler, this,
		soundBtnTextureKey, soundBtnTextureKey, soundBtnTextureKey, soundBtnTextureKey, this);
	this.soundBtn.anchor.setTo(0.5, 0.5);
	this.soundBtn.alpha = 0.5;

	this.shown = false;

	this.game.onBlur.add(function() {
		this.oldMuted = this.game.sound.mute;
		this.game.sound.mute = true;
		this.pauseButtonHandler();
	}, this);
	this.game.onFocus.add(function() {
		this.game.sound.mute = this.oldMuted;
	}, this);

	this.game.onPause.add(this.gamePauseHandler, this);
	this.game.onResume.add(this.gameResumeHandler, this);

	this.onSoundToggled = new Phaser.Signal();
};

PauseMenu.prototype = Object.create(Phaser.Group.prototype);
PauseMenu.prototype.constructor = PauseMenu;

PauseMenu.prototype.soundButtonHandler = function() {
	this.game.sound.mute = !this.game.sound.mute;
	this.onSoundToggled.dispatch(this.game.sound.mute);
	if (this.game.sound.mute)
		this.soundBtn.setFrames("btn_sound_off", "btn_sound_off", "btn_sound_off", "btn_sound_off");
	else
		this.soundBtn.setFrames("btn_sound", "btn_sound", "btn_sound", "btn_sound");
};

PauseMenu.prototype.gamePauseHandler = function() {
	if (this.shown) {
		this.pauseBtn.visible = false;
		this.unpauseBtn.visible = true;
		this.game.input.onDown.addOnce(this.unpauseButtonHandler, this);
	}
};

PauseMenu.prototype.gameResumeHandler = function() {
	console.log("oldMuted:" + this.oldMuted);
	this.game.sound.mute = this.oldMuted;
	if (this.shown) {
		this.pauseBtn.visible = true;
		this.unpauseBtn.visible = false;
	}
	//this.game.input.onDown.addOnce(this.unpauseButtonHandler, this);
};

PauseMenu.prototype.pauseButtonHandler = function() {
	//this.pauseBtn.visible = false;
	//this.unpauseBtn.visible = true;
	if (this.shown)
		this.game.paused = true;
	//this.game.input.onDown.addOnce(this.unpauseButtonHandler, this);
	//this.onPaused.dispatch(true);
};

PauseMenu.prototype.unpauseButtonHandler = function() {
	//this.pauseBtn.visible = true;
	//this.unpauseBtn.visible = false;
	if (this.shown)
		this.game.paused = false;
	//this.onPaused.dispatch(false);
};

PauseMenu.prototype.show = function() {
	this.shown = true;
	this.pauseBtn.visible = true;
};

PauseMenu.prototype.hide = function() {
	this.shown = false;
	this.pauseBtn.visible = false;
};

module.exports = PauseMenu;
},{}],11:[function(require,module,exports){
/**
 * Created by romzes on 12.01.2016.
 */

"use strict";

var SnowFlake = function(game, parent) {
	Phaser.Image.call(this, game, 0, 0, "playAtlas", "snowflake");
	parent.addChild(this);
	this.anchor.setTo(0.5, 0.5);
	//this.visible = false;
	//this.exists = false;
};

SnowFlake.prototype = Object.create(Phaser.Image.prototype);
SnowFlake.prototype.constructor = SnowFlake;

SnowFlake.prototype.reset = function() {
	this.startX = this.x = Math.random() * this.game.width;
	this.y = -40;
	this.distance = Math.random();
	this.scale.x = this.scale.y = 1 - this.distance * 0.9;
	this.velocityY = 120 - 110 * this.distance;
	this.amplitude = 90 - 70 * this.distance;
	this.sineVelocity = 0.885 - 0.75 * this.distance;
	this.phase = 0;

	this.visible = true;
	this.exists = true;
};

SnowFlake.prototype.update = function() {
	Phaser.Image.prototype.update.call(this);

	//return;

	this.y += this.velocityY * this.game.time.elapsed / Phaser.Timer.SECOND;
	this.phase += this.sineVelocity * this.game.time.elapsed / Phaser.Timer.SECOND;
	this.x = this.startX + this.amplitude * Math.sin(this.phase);
	if (this.y > this.game.height + 50) {
		this.visible = false;
		this.exists = false;
	}
};

SnowFlake.prototype.remove = function(animate) {
	animate = animate === undefined ? true : animate;
	if (animate) {
		this.game.add.tween(this.scale)
			.to({x:0, y:0}, Phaser.Timer.SECOND * (0.7 + Math.random() * 2), Phaser.Easing.Cubic.In, true, Math.random() * Phaser.Timer.SECOND * 0.3)
			.onComplete.addOnce(function() {
				this.visible = false;
				this.exists = false;
			}, this);
	}
};

module.exports = SnowFlake;
},{}],12:[function(require,module,exports){
/**
 * Created by romzes on 12.01.2016.
 */

"use strict";

var SnowFlake = require("./SnowFlake");

var SnowGenerator = function(game) {
	Phaser.Group.call(this, game);
};

SnowGenerator.prototype = Object.create(Phaser.Group.prototype);
SnowGenerator.prototype.constructor = SnowGenerator;

SnowGenerator.prototype.start = function() {
	this.game.time.events.add(Phaser.Timer.SECOND, this.addSnowFlake, this);
};

SnowGenerator.prototype.addSnowFlake = function() {
	var snowflake = this.getFirstExists(false);
	if (!snowflake)
		snowflake = new SnowFlake(this.game, this);
	snowflake.reset();
	this.snowTimer = this.game.time.events.add(Phaser.Timer.SECOND, this.addSnowFlake, this);
};

SnowGenerator.prototype.stop = function(removeExistingSnowflakes) {
	removeExistingSnowflakes = removeExistingSnowflakes === undefined ? true : removeExistingSnowflakes;
	if (this.snowTimer) {
		//this.game.time.events.remove(this.snowTimer);
		this.game.time.events.remove(this.snowTimer);
		this.snowTimer = null;
	}
	if (removeExistingSnowflakes)
		this.callAllExists("remove", true);
};

module.exports = SnowGenerator;
},{"./SnowFlake":11}],13:[function(require,module,exports){
/**
 * Created by romzes on 14.12.2015.
 */

"use strict";

var GameObjectType = require("./GameObjectType");

var Spike = function(game, parent) {
	Phaser.Sprite.call(this, game, 0, 0, "playAtlas", "spike");
	parent.add(this);
	this.baseWidth = this.width;
	this.objectType = GameObjectType.HOSTILE;
	this.game.physics.p2.enable(this);
	this.body.kinematic = true;
	//this.body.debug = true;
	this.body.clearShapes();
	this.body.addRectangle(this.width - 5, this.height * 0.5);
	this.anchor.setTo(0.5, 0.5);
};

Spike.prototype = Object.create(Phaser.Sprite.prototype);
Spike.prototype.constructor = Spike;

Spike.SIDE_LEFT = "sideLeft";
Spike.SIDE_RIGHT = "sideRight";

Spike.prototype.reset = function(side, y, delay) {
	this.side = side === undefined ? Spike.SIDE_LEFT : side;
	this.delay = delay === undefined ? 0 : delay;
	this.exists = true;
	this.visible = true;
	this.scale.x = 0;
	this.body.addToWorld();
	if (this.side == Spike.SIDE_LEFT) {
		this.baseX = this.baseWidth * 0.5;
		this.startX = -this.baseWidth;
		this.scaleMult = 1;
	}
	else {
		this.baseX = this.game.width - this.baseWidth * 0.5;
		this.startX = this.game.width + this.baseWidth;
		this.scaleMult = -1;
	}
	this.body.reset(this.startX, y);
	this.isKilling = false;
	this.objectType = GameObjectType.HOSTILE;
	this.animTween = this.game.add.tween(this.scale)
		.to({x:this.scaleMult}, 0.2 * Phaser.Timer.SECOND, Phaser.Easing.Back.Out, true, delay);
	this.animTween.onComplete.addOnce(function() {
		this.animTween = this.game.add.tween(this.scale)
			.to({x:this.scaleMult * 1.2}, 0.6 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.InOut, true, 0.3 * Phaser.Timer.SECOND, -1, true);
	}, this);
	this.tween = this.game.add.tween(this.body)
		.to({x:this.baseX}, 0.2 * Phaser.Timer.SECOND, Phaser.Easing.Back.Out, true, this.delay);
};

Spike.prototype.kill = function(animate, delay) {
	if (this.isKilling)
		return;
	animate = animate === undefined ? true : animate;
	delay = delay === undefined ? 0 : delay;
	this.objectType = GameObjectType.NONE;
	if (this.tween)
		this.tween.stop();
	if (this.animTween) {
		this.animTween.stop();
		this.animTween = null;
	}
	if (animate) {
		this.game.add.tween(this.scale)
			.to({x:0}, 0.2 * Phaser.Timer.SECOND, Phaser.Easing.Back.In, true, delay);
		this.tween = this.game.add.tween(this.body)
			.to({x: this.startX}, 0.2 * Phaser.Timer.SECOND, Phaser.Easing.Back.In, true, delay)
			.onComplete.addOnce(this.killAnimationCompleteHandler, this);
	}
	else {
		this.killAnimationCompleteHandler();
	}
};

Spike.prototype.killAnimationCompleteHandler = function() {
	this.body.removeFromWorld();
	this.tween = null;
	this.isKilling = false;
	this.visible = false;
	this.exists = false;
};

module.exports = Spike;
},{"./GameObjectType":6}],14:[function(require,module,exports){
/**
 * Created by romzes on 14.12.2015.
 */

"use strict";

var Spike = require("./Spike");
var Warning = require("./Warning");

var SpikesManager = function(game, bouncesUntilFirstSpike) {
	Phaser.Group.call(this, game);
	this.startBouncesUntilSpike = this.bouncesUntilSpike = bouncesUntilFirstSpike === undefined ? 40 : bouncesUntilFirstSpike;
	this.bounces = 0;
	this.bouncesUntilremove = 0;
	this.startDurationMin = this.durationMin = 3;
	this.startDurationMax = this.durationMax = 6;
	this.durationGrowth = 0.1;
	this.startPauseMin = this.pauseMin = 6;
	this.startPauseMax = this.pauseMax = 10;
	this.pauseGrowth = 0.1;
	this.durationLimit = 10;
	this.startSizeMin = this.sizeMin = 1;
	this.startSizeMax = this.sizeMax = 3;
	this.sizeGrowth = 0.1;
	this.sizeLimit = 7;
	this.startDoubleSideProbability = this.doubleSideProbability = 0.5;
	this.doubleSideProbabilityGrowth = 0.1;
	this.doubleSideProbabilityLimit = 0.8;
	this.warningsGroup = this.game.add.group();
};

SpikesManager.prototype = Object.create(Phaser.Group.prototype);
SpikesManager.prototype.constructor = SpikesManager;

SpikesManager.prototype.addBounce = function() {
	this.bounces++;
	if (this.bouncesUntilSpike > 0) {
		this.bouncesUntilSpike--;
		if (this.bouncesUntilSpike <= 0) {
			this.bouncesUntilSpike = Math.round(this.pauseMin + Math.random() * (this.pauseMax - this.pauseMin));
			if (this.pauseMin > 0)
				this.pauseMin -= this.pauseGrowth;
			if (this.pauseMax > 0)
				this.pauseMax -= this.pauseGrowth;
			this.bouncesUntilRemove = Math.round(this.durationMin + Math.random() * (this.durationMax - this.durationMin));
			if (this.durationMin < this.durationLimit)
				this.durationMin += this.durationGrowth;
			if (this.durationMax < this.durationLimit)
				this.durationMax += this.durationGrowth;
			var doubleSide = Math.random() <= this.doubleSideProbability;
			if (doubleSide) {
				this.addSpike(undefined, undefined, Spike.SIDE_LEFT);
				this.addSpike(undefined, undefined, Spike.SIDE_RIGHT);
			}
			else {
				var side = (Math.random() < 0.5 ? Spike.SIDE_LEFT : Spike.SIDE_RIGHT);
				this.addSpike(undefined, undefined, side);
			}
			//var size = Math.round(this.sizeMin + Math.random() * (this.sizeMax - this.sizeMin));
			//var startY = Math.round(83 * 0.5 + Math.random() * (this.game.height - 180 - size * 83));
			if (this.sizeMin < this.sizeLimit)
				this.sizeMin += this.sizeGrowth;
			if (this.sizeMax < this.sizeLimit)
				this.sizeMax += this.sizeGrowth;
			if (this.doubleSideProbability < this.doubleSideProbabilityLimit)
				this.doubleSideProbability += this.doubleSideProbabilityGrowth;
		}
	}
	if (this.bouncesUntilRemove > 0) {
		this.bouncesUntilRemove--;
		if (this.bouncesUntilRemove <= 0)
			this.removeAllSpikes();

	}
};

SpikesManager.prototype.addSpike = function(size, startY, side) {
	size = (size === undefined ? Math.round(this.sizeMin + Math.random() * (this.sizeMax - this.sizeMin)) : size);
	startY = (startY === undefined ? Math.round(83 * 0.5 + Math.random() * (this.game.height - 180 - size * 83)) : startY);
	side = (side === undefined ? (Math.random() < 0.5 ? Spike.SIDE_LEFT : Spike.SIDE_RIGHT) : side);

	var warningDuration = Phaser.Timer.SECOND * 1.5;
	var warning = this.warningsGroup.getFirstExists(false);
	if (!warning)
		warning = new Warning(this.game, this.warningsGroup);
	warning.reset(side, warningDuration);

	var i;
	for (i = 0; i < size; i++) {
		var spike = this.getFirstExists(false);
		if (!spike)
			spike = new Spike(this.game, this);
		spike.reset(side, startY + spike.height * i, warningDuration + Phaser.Timer.SECOND * (0.4 + 0.1 * i));
	}
};

SpikesManager.prototype.removeAllSpikes = function(animate) {
	animate = animate === undefined ? true : animate;
	var i;
	var delay = 0;
	for (i = 0; i < this.children.length; i++) {
		if (this.children[i].exists) {
			this.children[i].kill(animate, delay);
			delay += 0.1 * Phaser.Timer.SECOND;
		}
	}
};

SpikesManager.prototype.reset = function(animate) {
	this.durationMin = this.startDurationMin;
	this.durationMax = this.startDurationMax;
	this.pauseMin = this.startPauseMin;
	this.pauseMax = this.startPauseMax;
	this.sizeMin = this.startSizeMin;
	this.sizeMax = this.startSizeMax;
	this.doubleSideProbability = this.startDoubleSideProbability;
	this.bounces = 0;
	this.bouncesUntilRemove = 0;
	this.bouncesUntilSpike = this.startBouncesUntilSpike;
	this.removeAllSpikes(animate);
};

module.exports = SpikesManager;
},{"./Spike":13,"./Warning":16}],15:[function(require,module,exports){
/**
 * Created by JS on 20.01.2016.
 */

"use strict";

var Title = function(game, x, y) {
	Phaser.Group.call(this, game);
	x = x === undefined ? 0 : x;
	y = y === undefined ? 0 : y;
	this.position.setTo(x, y);

	this.btn = this.game.add.image(0, 34, "startAtlas", "btn", this);
	this.btn.anchor.setTo(Math.round(this.btn.width * 0.5) / this.btn.width, Math.round(this.btn.height * 0.5) / this.btn.height);
	this.btn.alpha = 0;
	this.startText = new Phaser.BitmapText(this.game, 0, -6, "chromoFont2", this.game.lang.getLocaleString("startText"), 45);
	this.startText.tint = 0xabcef6;
	this.startText.align = "center";
	this.startText.rotation = -8 / 180 * Math.PI;
	this.startText.x = Math.round(0 - this.startText.width * 0.5);
	this.btn.addChild(this.startText);

	this.bounce = this.game.add.image(0, 34, "startAtlas", "bounce", this);
	this.bounce.anchor.setTo(Math.round(this.bounce.width * 0.5) / this.bounce.width, Math.round(this.bounce.height * 0.5) / this.bounce.height);
	this.bounce.alpha = 0;
	this.merry = this.game.add.image(-170, -128, "startAtlas", "merry", this);
	this.merry.anchor.setTo(Math.round(this.merry.width * 0.5) / this.merry.width, Math.round(this.merry.height * 0.5) / this.merry.height);
	this.merry.alpha = 0;
	this.christmas = this.game.add.image(-3, -58, "startAtlas", "christmas", this);
	this.christmas.anchor.setTo(Math.round(this.christmas.width * 0.5) / this.christmas.width, Math.round(this.christmas.height * 0.5) / this.christmas.height);
	this.christmas.alpha = 0;

};

Title.prototype = Object.create(Phaser.Group.prototype);
Title.prototype.constructor = Title;

Title.prototype.show = function(delay) {
	if (delay == 0)
		this._show();
	else
		this.game.time.events.add(delay, this._show, this);
};

Title.prototype._show = function() {
	//Bounce
	this.bounce.scale.setTo(0.66, 0.66);
	this.game.add.tween(this.bounce)
		.to({alpha:1, rotation:-3.7 / 180 * Math.PI}, 0.167 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.Out, true)
		.onComplete.addOnce(function() {
			this.game.add.tween(this.bounce)
				.to({rotation:0}, 0.117 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.In, true);
		}, this);
	this.game.add.tween(this.bounce.scale)
		.to({x:1.12, y:1.28}, 0.167 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.Out, true)
		.onComplete.addOnce(function() {
			this.game.add.tween(this.bounce.scale)
				.to({x:1, y:1}, 0.117 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.In, true);
		}, this);

	//Christmas
	this.christmas.position.setTo(-3, -14);
	this.christmas.scale.setTo(0.94, 1.15);
	this.game.add.tween(this.christmas)
		.to({alpha:1, x:-3, y:-90}, 0.1 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.Out, true, 0.117 * Phaser.Timer.SECOND)
		.onComplete.addOnce(function() {
			this.game.add.tween(this.christmas)
				.to({y:-50, rotation:-1.7 / 180 * Math.PI}, 0.133 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.In, true)
				.onComplete.addOnce(function() {
					this.game.add.tween(this.christmas)
						.to({y:-58, rotation:0}, 0.166 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.Out, true);
				}, this);
		}, this);
	this.game.add.tween(this.christmas.scale)
		.to({x:0.93, y:1.19}, 0.1 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.Out, true, 0.117 * Phaser.Timer.SECOND)
		.onComplete.addOnce(function() {
			this.game.add.tween(this.christmas.scale)
				.to({x:1.06, y:0.82}, 0.133 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.In, true)
				.onComplete.addOnce(function() {
					this.game.add.tween(this.christmas.scale)
						.to({x:1, y:1}, 0.166 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.Out, true);
				}, this);
		}, this);

	//Merry
	this.merry.position.setTo(-167, -84);
	this.game.add.tween(this.merry)
		.to({alpha:1, x:-180, y:-174, rotation:-10 / 180 * Math.PI}, 0.1 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.Out, true, 0.217 * Phaser.Timer.SECOND)
		.onComplete.addOnce(function() {
			this.game.add.tween(this.merry)
				.to({x:-170, y:-120, rotation:-1.7 / 180 * Math.PI}, 0.133 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.In, true)
				.onComplete.addOnce(function() {
					this.game.add.tween(this.merry)
						.to({x:-170, y:-128, rotation:0}, 0.166 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.Out, true);
				}, this);
		}, this);
	this.game.add.tween(this.merry.scale)
		.to({x:0.93, y:1.19}, 0.1 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.Out, true, 0.217 * Phaser.Timer.SECOND)
		.onComplete.addOnce(function() {
			this.game.add.tween(this.merry.scale)
				.to({x:1.06, y:0.82}, 0.133 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.In, true)
				.onComplete.addOnce(function() {
					this.game.add.tween(this.merry.scale)
						.to({x:1, y:1}, 0.166 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.Out, true);
				}, this);
		}, this);

	//btn
	this.btn.position.setTo(190, 57);
	this.game.add.tween(this.btn)
		.to({alpha:1, x:190, y:179, rotation:5 / 180 * Math.PI}, 0.1 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.In, true, 0.267 * Phaser.Timer.SECOND)
		.onComplete.addOnce(function() {
			this.game.add.tween(this.btn)
				.to({x:190, y:107, rotation:-3.5 / 180 * Math.PI}, 0.117 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.Out, true)
				.onComplete.addOnce(function() {
					this.game.add.tween(this.btn)
						.to({x:190, y:146, rotation:3 / 180 * Math.PI}, 0.117 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.In, true)
						.onComplete.addOnce(function() {
							this.game.add.tween(this.btn)
								.to({x:190, y:131, rotation:0}, 0.117 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.Out, true);
						}, this);
				}, this);
		}, this);
};

Title.prototype.hide = function() {
	if (this.parent)
		this.parent.removeChild(this);
};

module.exports = Title;
},{}],16:[function(require,module,exports){
/**
 * Created by JS on 15.12.2015.
 */

"use strict";

var Spike = require("./Spike");

var Warning = function(game, parent) {
	Phaser.Sprite.call(this, game, 0, 0, "playAtlas", "warning");
	this.anchor.setTo(0.5, 0.5);
	parent.add(this);
};

Warning.prototype = Object.create(Phaser.Sprite.prototype);
Warning.prototype.constructor = Warning;

Warning.prototype.reset = function(side, duration) {
	this.visible = true;
	this.exists = true;
	this.duration = duration === undefined ? 1.5 * Phaser.Timer.SECOND : duration;
	this.scale.setTo(1, 1);
	this.y = this.game.height * 0.5 - 50;
	this.x = side == Spike.SIDE_LEFT ? this.width * 0.5 + 5 : this.game.width - this.width * 0.5 - 5;
	this.scale.setTo(0, 0);
	this.tween = this.game.add.tween(this.scale)
		.to({x:1, y:1}, 0.3 * Phaser.Timer.SECOND, Phaser.Easing.Back.Out, true)
		.onComplete.addOnce(this.appearAnimationCompleteHandler, this);
};


Warning.prototype.appearAnimationCompleteHandler = function() {
	var cycleDur = 0.2 * Phaser.Timer.SECOND;
	this.tween = this.game.add.tween(this)
		.to({alpha:0}, cycleDur, Phaser.Easing.Linear.None, true, 0, Math.floor(this.duration / (cycleDur * 2)), true)
		.onComplete.addOnce(this.blinkAnimationCompleteHandler, this);
};

Warning.prototype.blinkAnimationCompleteHandler = function() {
	this.tween = null;
	this.kill(true);
};

Warning.prototype.kill = function(animate) {
	animate = animate === undefined ? true : animate;
	this.tween = this.game.add.tween(this.scale)
		.to({x:0, y:0}, 0.3 * Phaser.Timer.SECOND, Phaser.Easing.Back.In, true)
		.onComplete.addOnce(function() {
			this.visible = false;
			this.exists = false;
		}, this);
};

module.exports = Warning;
},{"./Spike":13}],17:[function(require,module,exports){
'use strict';

var GameObjectType = require("./GameObjectType");

var Coin = function(game, parent, x, y) {
	Phaser.Sprite.call(this, game, x, y, "playAtlas", "coin");
	parent.addChild(this);

	this.objectType = GameObjectType.COLLECTIBLE;

	this.scaleX = this.scaleY = 1;
	this.onCollected = new Phaser.Signal();

	this.game.physics.p2.enable(this);
	this.body.static = true;
	this.body.data.shapes[0].sensor = true;

	this.rays = new Phaser.Image(this.game, 0, 0, "playAtlas");
	this.rays.animations.add("shine", Phaser.Animation.generateFrameNames("star_rays_", 1, 19, "", 4), 20, true);
	this.rays.anchor.setTo(0.5, 0.5);
	this.addChild(this.rays);
	this.raysAnimation = this.rays.animations.play("shine", 30, true);
	this.raysAnimation.stop();
};

Coin.prototype = Object.create(Phaser.Sprite.prototype);
Coin.prototype.constructor = Coin;

Coin.prototype.reset = function(startX, startY, duration, collectTarget) {
	duration = duration === undefined ? 3 * Phaser.Timer.SECOND : duration;
	this.collectTarget = collectTarget;
	this.isCollecting = false;
	this.body.addToWorld();
	this.exists = true;
	this.visible = true;
	this.scaleX = this.scaleY = 0.2;
	this.scale.setTo(0.2, 0.2);
	this.rotation = 0;
	this.alpha = 1;
	this.body.x = startX;
	this.body.y = startY;
	this.body.onBeginContact.addOnce(this.beginContactHandler, this);
	this.removeTimerEvent = this.game.time.events.add(duration, this.startBlinking, this);
	this.raysAnimation.play(20, true);
	this.blinkTween = this.game.add.tween(this)
		.to({scaleX:1, scaleY:1}, Phaser.Timer.SECOND * 0.2, Phaser.Easing.Back.Out, true);
};

Coin.prototype.startBlinking = function() {
	this.blinkTween = this.game.add.tween(this)
		.to({alpha:0.1}, Phaser.Timer.SECOND * 0.2, Phaser.Easing.Linear.None, true, 0, 4, true);
	this.blinkTween.onComplete.addOnce(function() {
		this.blinkTween = this.game.add.tween(this)
			.to({scaleX:0.1, scaleY:0.1}, Phaser.Timer.SECOND * 0.2, Phaser.Easing.Back.In, true);
		this.blinkTween.onComplete.addOnce(function(){this.removeCoin(false)}, this);
	}, this);
	//this.removeTimerEvent = this.game.time.events.add(1.5 * Phaser.Timer.SECOND, this.removeCoin, this);
};

Coin.prototype.beginContactHandler = function(body2, shape1, shape2, equation) {
	if (body2.sprite.objectType != GameObjectType.SACK)
		return;
	this.onCollected.dispatch();
	this.removeTimers();
	this.alpha = 1;
	/*this.blinkTween = this.game.add.tween(this)
		.to({rotation:(-30 + Math.random() * 60) / 180 * Math.PI, scaleX:1.3, scaleY:1.6}, Phaser.Timer.SECOND * 0.15, Phaser.Easing.Cubic.Out, true);
	this.blinkTween.onComplete.addOnce(function() {
		this.blinkTween = this.game.add.tween(this)
			.to({rotation:0, scaleX:0.2, scaleY:0.2}, Phaser.Timer.SECOND * 0.2, Phaser.Easing.Cubic.In, true);
		this.blinkTween.onComplete.addOnce(function(){this.removeCoin(false)}, this);
	}, this);*/

	//this.body.removeFromWorld();
	this.isCollecting = true;
	this.collectX = this.collectTarget.worldPosition.x;
	this.collectY = this.collectTarget.worldPosition.y;
	var randomRadius = 30;
	var midX = this.x + (this.collectX - this.x) * 0.5 - randomRadius + 2 * randomRadius * Math.random();
	var midY = this.y + (this.collectY - this.y) * 0.5 - randomRadius + 2 * randomRadius * Math.random();
	var dist = Math.sqrt(Math.pow(this.collectX - this.body.x, 2) + Math.pow(this.collectY - this.body.y, 2));
	this.halfTweenDuration = dist / 700 * 0.5;
	var tween = this.game.add.tween(this)
		.to({scaleX:2, scaleY:2}, Phaser.Timer.SECOND * this.halfTweenDuration, Phaser.Easing.Cubic.In, true);
	tween.onComplete.addOnce(function() {
		tween = this.game.add.tween(this)
			.to({scaleX:0.6, scaleY:0.6}, Phaser.Timer.SECOND * this.halfTweenDuration, Phaser.Easing.Cubic.Out, true);
		//tween.onComplete.addOnce(function(){this.removeCoin(false)}, this);
	}, this);

	this.blinkTween = this.game.add.tween(this.body)
		.to({x:midX, y:midY, rotation:(30 + Math.random() * 30) * (Math.random() > 0.5 ? -1 : 1) / 180 * Math.PI}, Phaser.Timer.SECOND * this.halfTweenDuration, Phaser.Easing.Cubic.In, true);
	this.blinkTween.onComplete.addOnce(function() {
		this.collectX = this.collectTarget.worldPosition.x;
		this.collectY = this.collectTarget.worldPosition.y;
		this.blinkTween = this.game.add.tween(this.body)
			.to({x:this.collectX, y:this.collectY, rotation:0}, Phaser.Timer.SECOND * this.halfTweenDuration, Phaser.Easing.Cubic.Out, true);
		this.blinkTween.onComplete.addOnce(function(){
			this.isCollecting = false;
			this.removeCoin(false)
		}, this);
	}, this);
};

Coin.prototype.removeTimers = function() {
	if (this.removeTimerEvent !== undefined) {
		this.game.time.events.remove(this.removeTimerEvent);
		this.removeTimerEvent = undefined;
	}
	if (this.blinkTween !== undefined) {
		this.blinkTween.onComplete.removeAll();
		this.blinkTween.stop();
		this.blinkTween = undefined;
	}
};

Coin.prototype.removeCoin = function(animate) {
	if (this.isCollecting)
		return;
	animate = animate === undefined ? false : animate;
	this.removeTimers();
	this.body.onBeginContact.removeAll();
	this.raysAnimation.stop();
	if (animate) {
		this.game.add.tween(this)
			.to({scaleX:0.1, scaleY:0.1}, 0.2 * Phaser.Timer.SECOND, Phaser.Easing.Back.In, true)
			.onComplete.addOnce(this.completeRemove, this);
	}
	else {
		this.completeRemove();
	}
};

Coin.prototype.completeRemove = function() {
	this.visible = false;
	this.exists = false;
};

Coin.prototype.update = function() {
	this.scale.setTo(this.scaleX, this.scaleY);
};

module.exports = Coin;

},{"./GameObjectType":6}],18:[function(require,module,exports){
'use strict';

var GameObjectType = require('./GameObjectType');

var Sack = function(game, x, y, material, maxSpeed, bounceVelocity) {
	Phaser.Sprite.call(this, game, x, y);

	this.gorlo = new Phaser.Image(this.game, 0, 0, "playAtlas", "sack_gorlo");
	this.gorlo.anchor.setTo(0.5, 0.5);
	this.addChild(this.gorlo);
	this.gorlo.x = this.gorloBaseX = 29;
	this.gorlo.y = this.gorloBaseY = -29;

	this.sack = new Phaser.Image(this.game, 0, 0, "playAtlas", "sack");
	this.sack.anchor.setTo(Math.round(this.sack.width * 0.5) / this.sack.width, Math.round(this.sack.height * 0.5) / this.sack.height);
	this.addChild(this.sack);

	this.baseScale = 1;
	this.scale.setTo(this.baseScale, this.baseScale);

	this.objectType = GameObjectType.SACK;
	this.onReady = new Phaser.Signal();
	this.onDead = new Phaser.Signal();

	this.hasShield = false;

	this.face = new Phaser.Image(this.game, 0, 0, "playAtlas", "face_happy0");
	this.face.anchor.setTo(Math.round(this.face.width * 0.5) / this.face.width, Math.round(this.face.height * 0.5) / this.face.height);
	this.addChild(this.face);

	this.maxSpeed = maxSpeed === undefined ? 300 : maxSpeed;
	this.maxSpeedPow = Math.pow(this.maxSpeed, 2);
	this.bounceVelocity = bounceVelocity === undefined ? 560 : bounceVelocity;

	this.minBounceVelocity = 560;
	this.maxBounceVelocity = 850;
	this.wind = 0;

	//this.anchor.setTo(0.5, 0.5);
	this.game.physics.p2.enable(this);
	this.body.clearShapes();
	this.body.addCircle(this.sack.width * 0.5);
	//this.body.debug = true;
	this.body.setMaterial(material);
	this.body.mass = 1;
	this.body.damping = 0;
	this.body.angularDamping = 0;
	//this.body.collides(this.game.physics.p2.everythingCollisionGroup);
	//this.body.setCollisionGroup(this.game.physics.p2.boundsCollisionGroup);

	this.shadow = new Phaser.Sprite(this.game, x, this.game.height - 30, "playAtlas", "dropShadow");
	this.shadow.anchor.setTo(0.5, 0.5);

	this.reset(x, y, false);
	this.oldX = x;
	this.oldY = y;
	this.targetRotation = 0;

	this.marker = this.game.add.image(0, 50, "playAtlas", "sack_marker");
	this.marker.anchor.setTo(0.5, 0.5);
	this.marker.alpha = 0;
	this.markerShown = false;
};

Sack.prototype = Object.create(Phaser.Sprite.prototype);
Sack.prototype.constructor = Sack;

Sack.HAPPY = "happy";
Sack.SAD = "sad";
Sack.ALIVE_STATE = "alive_state";
Sack.DEAD_STATE = "dead_state";

Sack.prototype.update = function() {
	//return;
	if (this.parent && !this.shadow.parent)
		this.parent.addChildAt(this.shadow, this.parent.getChildIndex(this));

	this.shadow.x = this.body.x;
	var elevation = this.game.height - 30 - this.body.y;
	var minElevation = 30;
	var maxElevation = 450;
	var elevationCoef = 1 - Math.max(Math.min((elevation - minElevation) /  (maxElevation - minElevation), 1), 0);
	this.shadow.scale.x = this.shadow.scale.y = 0.2 + 0.8 * elevationCoef;
	this.shadow.alpha = elevationCoef;

	if (this.state == Sack.ALIVE_STATE) {
		var dirX = this.body.x - this.oldX;
		var dirY = this.body.y - this.oldY;
		this.oldX = this.body.x;
		this.oldY = this.body.y;
		//var a = Math.atan2(this.body.velocity.y, this.body.velocity.x);
		var a = Math.atan2(dirY, dirX);
		var scalSpeed = Math.pow(this.body.velocity.x, 2) + Math.pow(this.body.velocity.y, 2);
		if (scalSpeed > this.maxSpeedPow) {
			this.body.velocity.x = Math.cos(a) * this.maxSpeed;
			this.body.velocity.y = Math.sin(a) * this.maxSpeed;
			scalSpeed = this.maxSpeedPow;
		}
		var speedCoef = scalSpeed / this.maxSpeedPow;
		if (Math.abs(scalSpeed) > 3)
			this.targetRotation = a - Math.PI * 0.5;
		if (this.targetRotation > Math.PI * 0.5)
			this.targetRotation -= Math.PI;
		else if (this.targetRotation < -Math.PI * 0.5)
			this.targetRotation += Math.PI;
		//if (this.scale.y >= 1)
		//this.scale.y = (1 + 0.4 * speedCoef) * this.scaleMult * this.baseScale;
		this.scale.y = (1 + 0.4 * Math.abs(this.body.velocity.y) / this.maxSpeed) * this.scaleMult * this.baseScale;
		var velocityDir =  this.body.velocity.y / Math.abs(this.body.velocity.y);
		//this.anchor.y = 0.5 - 0.2 * speedCoef * velocityDir;
		//else
		//this.scale.y += 0.03;
		//this.face.y = 50 * speedCoef * this.body.velocity.y / Math.abs(this.body.velocity.y);
		if (this.scaleMult < 1)
			this.scaleMult += 0.02;

		var sinCoef = Math.sin(speedCoef * Math.PI * 0.5) * velocityDir;

		this.face.y = -50 * sinCoef - (this.anchor.y - 0.5) * 136;
		this.face.scale.y = 1 - 0.6 * speedCoef;

		//this.gorlo.y = this.gorloBaseY + 20 * sinCoef;
		//this.gorlo.rotation = (0 + 15 * sinCoef) * Math.PI / 180;
		//this.gorlo.scale.y = 1 - 0.6 * speedCoef;

		if (this.body.velocity.y > 290 && this.faceState != Sack.SAD) {
			this.faceState = Sack.SAD;
			this.face.frameName = "face_sad0";
		}
		else if (this.body.velocity.y <= 290 && this.faceState != Sack.HAPPY) {
			this.faceState = Sack.HAPPY;
			this.face.frameName = "face_happy0";
		}
		//this.body.velocity.x += this.wind * this.game.time.elapsed;
		this.body.x += this.wind * this.game.time.elapsed;

		var rotationDiff = this.targetRotation - this.rotation;
		if (rotationDiff > Math.PI)
			rotationDiff -= Math.PI;
		else if (rotationDiff < -Math.PI)
			rotationDiff += Math.PI;
		if (Math.abs(this.targetRotation - this.rotation) > 0.01) {
			var rotationVelocity = (this.targetRotation - this.rotation) * 0.1;
			if (Math.abs(rotationVelocity) > 0.1)
				rotationVelocity = 0.1 * rotationVelocity / Math.abs(rotationVelocity);
			this.rotation += rotationVelocity;
		}
		//this.rotation = this.targetRotation;
		//console.log(this.rotation / Math.PI * 180);

		if (this.body.y < -55) {
			if (!this.markerShown) {
				//console.log("show marker!");
				this.markerShown = true;
				if (this.markerTween)
					this.markerTween.stop();
				this.markerTween = this.game.add.tween(this.marker)
					.to({alpha:1}, 0.2 * Phaser.Timer.SECOND, Phaser.Easing.Linear.None, true);
			}
		}
		else {
			if (this.markerShown) {
				//console.log("hide marker!");
				this.markerShown = false;
				if (this.markerTween)
					this.markerTween.stop();
				this.markerTween = this.game.add.tween(this.marker)
					.to({alpha:0}, 0.15 * Phaser.Timer.SECOND, Phaser.Easing.Linear.None, true);
			}
		}
	}

	this.sack.rotation = -this.rotation;

	if (this.marker.alpha > 0) {
		this.marker.x = this.body.x;
		//console.log((this.body.y + 55) / 650);
		this.marker.scale.x = this.marker.scale.y = Math.min(Math.max(1 + (this.body.y + 55) / 300, 0.2), 1);
	}
};

Sack.prototype.setShield = function(value) {
	this.hasShield = value;
};

Sack.prototype.reset = function(x, y, animate) {
	animate = animate === undefined ? false : animate;
	this.wind = 0;
	this.hasShield = false;
	this.faceState = Sack.HAPPY;
	this.scaleMult = 1;
	this.body.fixedRotation = true;
	this.face.frameName = "face_happy0";
	this.face.scale.setTo(1, 1);
	this.face.position.setTo(0, 0);
	//this.body.reset(x, y, true);
	this.scale.setTo(this.baseScale, this.baseScale);
	this.body.damping = 0; //0.1
	this.body.angularDamping = 0;
	this.body.rotation = 0;
	//this.body.velocity.x = this.body.velocity.y = 0;
	//this.body.acceleration.x = this.body.acceleration.y = 0;
	//this.body.angularVelocity = 0;

	if (animate) {
		this.body.reset(this.body.x, this.body.y, true);
		//this.body.kinematic = true;
		this.game.add.tween(this)
			.to({rotation:0}, Phaser.Timer.SECOND, Phaser.Easing.Cubic.InOut, true);
		this.game.add.tween(this.body)
			.to({x: x, y: y, rotation:0}, Phaser.Timer.SECOND, Phaser.Easing.Cubic.InOut, true)
			.onComplete.addOnce(this.start, this);
	}
	else {
		this.state = Sack.ALIVE_STATE;
		this.body.reset(x, y, true);
		this.start();
	}
};

Sack.prototype.start = function() {
	this.body.onBeginContact.add(this.beginContactHandler, this);
	this.body.onEndContact.add(this.endContactHandler, this);
	//this.body.kinematic = false;
	this.state = Sack.ALIVE_STATE;
	this.body.reset(this.body.x, this.body.y, true);
	this.onReady.dispatch();
};

Sack.prototype.stop = function() {
	this.state = Sack.DEAD_STATE;
	this.body.fixedRotation = false;
	this.face.frameName = "face_sad0";
	this.face.scale.setTo(1, 1);
	this.face.position.setTo(0, 0);
	this.scale.setTo(this.baseScale, this.baseScale);
	//this.body.damping = 0.85;
	this.body.angularDamping = 0.8;
	this.body.onBeginContact.remove(this.beginContactHandler, this);
	this.body.onEndContact.remove(this.endContactHandler, this);
};

Sack.prototype.setWind = function(wind) {
	this.wind = wind;
};

Sack.prototype.beginContactHandler = function(body2, shape1, shape2, equation) {
	if (body2 === undefined || body2 === null || body2.sprite.objectType == GameObjectType.HERO) {
		this.scaleMult = 0.7;
		if (body2 !== undefined && body2 !== null && body2.sprite !== undefined && body2.sprite.objectType == GameObjectType.HERO) {
			body2.sprite.squash(Math.abs(this.body.velocity.y / this.maxSpeed));
		}
		return;
	}
	switch (body2.sprite.objectType) {
		case GameObjectType.HOSTILE: {
			if (this.hasShield) {
				this.setShield(false);
			}
			else {
				this.onDead.dispatch();
			}
			break;
		}
	}
	/*this.scale.y *= 0.7;
	if (this.scale.y < 0.8)
		this.scale.y = 0.8;*/
	//console.log(body1, body2);
};

Sack.prototype.endContactHandler = function(body2, shape1, shape2, equation) {
	return;
	console.log("body2:", body2);
	if (body2 && body2.sprite && body2.sprite.objectType == GameObjectType.HERO) {
		var bounceVelocity = Math.sqrt(Math.pow(this.body.velocity.x, 2) + Math.pow(this.body.velocity.y, 2));
		//console.log("bounce velocity:" + bounceVelocity);
		//return;
		var a;
		if (bounceVelocity < this.minBounceVelocity) {
			a = Math.atan2(this.body.velocity.y, this.body.velocity.x);
			this.body.velocity.x = Math.cos(a) * this.minBounceVelocity;
			this.body.velocity.y = Math.sin(a) * this.minBounceVelocity;
		}
		if (Math.abs(this.body.velocity.y) < this.minBounceVelocity * 0.8) {
			this.body.velocity.y = this.minBounceVelocity * 0.8 * this.body.velocity.y / Math.abs(this.body.velocity.y);
		}
		/*else if (bounceVelocity > this.maxBounceVelocity) {
			a = Math.atan2(this.body.velocity.y, this.body.velocity.x);
			this.body.velocity.x = Math.cos(a) * this.maxBounceVelocity;
			this.body.velocity.y = Math.sin(a) * this.maxBounceVelocity;
		}*/
	}
};

module.exports = Sack;

},{"./GameObjectType":6}],19:[function(require,module,exports){
'use strict';

var GameObjectType = require('./GameObjectType');

var Santa = function(game, x, y, material) {
	Phaser.Sprite.call(this, game, x, y, "santaAtlas");
	this.animSpeed = 30;
	this.standAnimSpeed = 7;
	this.animations.add("run", Phaser.Animation.generateFrameNames("santa_run_", 0, 28, "", 5), this.animSpeed, true);
	this.animations.add("turn", Phaser.Animation.generateFrameNames("santa_turn_", 0, 15, "", 5), this.animSpeed, true);
	var standFrames = Phaser.Animation.generateFrameNames("santa_stand_", 0, 4, "", 5).concat(
							Phaser.Animation.generateFrameNames("santa_stand_", 3, 1, "", 5));
	this.animations.add("stand", standFrames, this.standAnimSpeed, true);
	this.animations.play("stand", this.standAnimSpeed, true);
	//this.alpha = 0.5;
	this.floorY = y;
	this.maxVelocity = 500;
	this.oldX = x;
	this.objectType = GameObjectType.HERO;

	this.state = Santa.STANDING;
	this.animatingDirectionChange = false;
	this.anchor.setTo(Math.round(this.width * 0.5) / this.width, Math.round(this.height * 0.5) / this.height);
	this.game.physics.p2.enable(this);
	this.body.clearShapes();
	//this.santaShape = this.body.addCircle(this.width * 0.5 - 17, 0, -20);
	this.santaShape = this.body.addCapsule(45, 70, 0, 3); //-25
	this.anchor.setTo(0.5, 0.5);
	this.body.kinematic = true;
	this.body.mass = 2;
	this.body.fixedRotation = true;
	//this.body.data.gravityScale = 0;
	//this.body.collideWorldBounds = false;
	//this.body.debug = true;
	this.body.setMaterial(material);
	this.onGround = true;
	this.isDashing = false;
	this.dashDuration = 0;
	this.dashCooldown = 0;

	this.shadow = new Phaser.Sprite(this.game, 0, 70, "playAtlas", "dropShadow");
	this.shadow.anchor.setTo(0.5, 0.5);

	this.acceleration = new Phaser.Point(0, 0);
};

Santa.prototype = Object.create(Phaser.Sprite.prototype);
Santa.prototype.constructor = Santa;

Santa.STANDING = "standing";
Santa.RUNNING = "running";
Santa.STOPPING = "stopping";
Santa.STOPPED = "stopped";

Santa.prototype.update = function() {
	if (this.parent && !this.shadow.parent)
		this.parent.addChildAt(this.shadow, this.parent.getChildIndex(this));
	this.shadow.position.setTo(this.body.x, this.body.y + 107);
	var velocityX = (this.body.x - this.oldX) / this.game.time.elapsed * Phaser.Timer.SECOND;
	//console.log("elapsed:" + this.game.time.elapsed + (this.body.x - this.oldX).toString(10) + "; dist:" + "; velocityX:" + velocityX)
	this.oldX = this.body.x;
	var velocityDirection;
	switch (this.state) {
		case Santa.RUNNING: {
			//console.log(this.game.time.elapsed);
			this.body.velocity.x += this.acceleration.x * this.game.time.elapsed * this.gameSpeed;
			if (!this.isDashing) {
				var sign = this.body.velocity.x / Math.abs(this.body.velocity.x);
				if (Math.abs(this.body.velocity.x) > this.maxSpeed)
					this.body.velocity.x = this.maxSpeed * sign;
			}
			this.body.velocity.y += this.acceleration.y;

			if (this.body.x >= this.game.width - this.width * 0 && this.direction == 1) {
				this.setDirection(-1);
				this.scale.x = -this.direction;
			}
			if (this.body.x <= this.width * 0 && this.direction == -1) {
				this.setDirection(1);
				this.scale.x = -this.direction;
			}
			velocityDirection = this.direction;
			break;
		}
		case Santa.STOPPING: {
			if (Math.abs(this.body.velocity.x) > .1) {
				this.body.velocity.x *= .94;
			}
			else {
				this.body.velocity.x = 0;
				this.state = Santa.STOPPED;
				//this.runAnimation = this.animations.play("stand", this.animSpeed, true);
			}
			velocityDirection = velocityX / Math.abs(velocityX);
			break;
		}
	}
	if (!this.onGround) {
		if (this.body.y > this.floorY) {
			this.body.y = this.floorY;
			this.acceleration.y = 0;
			this.body.velocity.y = 0;
			this.onGround = true;
		}
	}
	//console.log(velocityX, this.body.velocity.x);
	var speedCoef = Math.abs(velocityX) / (this.maxVelocity * 2);
	//this.scale.x = /*Math.min(1 + 0.15 * speedCoef, 1.4) * */(velocityX > 0 ? -1 : 1);
	//this.scale.x = -velocityDirection;
	this.rotation = -0.436 * speedCoef * velocityDirection;
	if (this.runAnimation)
		this.runAnimation.speed = 17 + 39 * speedCoef;

	if (Math.abs(1 - this.scale.y) > 0.01)
		this.scale.y += (1 - this.scale.y) * 0.1;
	else
		this.scale.y = 1;
	if (Math.abs(0.5 - this.anchor.y) > 0.01)
		this.anchor.y += (0.5 - this.anchor.y) * 0.1;
	else
		this.anchor.y = 0.5;
	/*if (this.scale.y < 1)
		this.scale.y += 0.001 * this.game.time.elapsed;
	else
		this.scale.y = 1;
	if (this.anchor.y < 0.5)
		this.anchor.y += 0.001 * this.game.time.elapsed;
	else
		this.anchor.y = 0.5;*/

	if (this.isDashing) {
		this.dashDuration -= this.game.time.elapsed;
		if (this.dashDuration <= 0) {
			this.isDashing = false;
			this.dashCooldown = Phaser.Timer.SECOND * 0.2;
		}
	}
	else {
		if (this.dashCooldown > 0)
			this.dashCooldown -= this.game.time.elapsed;
	}
};

Santa.prototype.squash = function(power) {
	//console.log(power);
	power = power === undefined ? 1 : power;
	this.scale.y = 1 - 0.4 * power; //0.4
	this.anchor.y = 0.5 - 0.3 * power; //0.3
};

Santa.prototype.start = function(startAcceleration, maxSpeed, gameSpeed) {
	this.gameSpeed = gameSpeed === undefined ? 1 : gameSpeed;
	this.startAcceleration = startAcceleration === undefined ? 0.012 : Math.abs(startAcceleration);
	this.direction = this.game.rnd.frac() > 0.5 ? 1 : -1;
	this.maxSpeed = maxSpeed === undefined ? 400 : Math.abs(maxSpeed);
	this.acceleration.x = this.direction * this.startAcceleration;
	this.scale.x = -this.direction;
	this.state = Santa.RUNNING;
	this.runAnimation = this.animations.play("run", this.animSpeed, true);
};

Santa.prototype.reset = function(x, y, animate, animateStop) {
	animate = animate === undefined ? false : animate;
	animateStop = animateStop === undefined ? false : animateStop;
	console.log(animateStop);
	this.state = Santa.STANDING;
	this.animatingDirectionChange = false;
	//this.body.velocity.x = this.body.velocity.y = 0;
	this.body.reset(this.body.x, this.body.y, true);
	//this.body.setCollisionGroup(this.game.physics.p2.boundsCollisionGroup);
	this.body.data.shapes[0].sensor = false;
	this.direction = (x - this.body.x) / Math.abs(x - this.body.x);
	this.scale.setTo(-this.direction, 1);
	this.runAnimation = this.animations.play("run", this.animSpeed, true);
	var santaTween = this.game.add.tween(this.body)
		.to({x:x, y:y}, Phaser.Timer.SECOND, Phaser.Easing.Cubic.InOut, true);
	if (animateStop)
		this.game.time.events.add(Phaser.Timer.SECOND * 0.85, this.animateStop, this);
	else
		santaTween.onComplete.addOnce(this.resetAnimationCompleteHandler, this, 0);
};

Santa.prototype.resetAnimationCompleteHandler = function(target, tween) {
	this.animations.play("stand", this.standAnimSpeed, true);
	this.runAnimation = null;
};

Santa.prototype.stop = function() {
	//this.body.setCollisionGroup(this.game.physics.p2.nothingCollisionGroup);
	this.body.data.shapes[0].sensor = true;
	this.acceleration.x = 0;
	this.acceleration.y = 0;
	this.isDashing = false;
	this.state = Santa.STOPPING;
	this.animateStop();
};

Santa.prototype.animateStop = function() {
	this.runAnimation = this.animations.play("turn", this.animSpeed, false);
	this.runAnimation.onComplete.addOnce(function() {
		this.scale.x *= -1;
		this.animations.play("stand", this.standAnimSpeed, true);
		this.runAnimation = null;
	}, this);
};

Santa.prototype.dash = function() {
	if (this.isDashing || this.dashCooldown > 0)
		return;
	this.isDashing = true;
	//var velocitySign = this.body.velocity.x / Math.abs(this.body.velocity.x);
	this.body.velocity.x = this.maxSpeed * 6.5 * this.direction;
	this.dashDuration = 0.045 * Phaser.Timer.SECOND;
};

Santa.prototype.jump = function() {
	if (!this.onGround)
		return;
	this.onGround = false;
	this.acceleration.y = 35;
	//this.body.y -= 10;
	this.body.velocity.y = -600;
};

Santa.prototype.changeDirection = function() {
	//console.log("velocity:" + Math.abs(this.body.velocity.x) + "; maxSpeed:" + this.maxSpeed);
	//if (Math.abs(this.body.velocity.x) < this.maxSpeed * 0.2)
	//	return;
	if (this.state == Santa.RUNNING) {
		if (this.body.velocity <= 0 && this.acceleration.x > 0 || this.body.velocity >= 0 && this.acceleration.x < 0)
			return;
		if (this.animatingDirectionChange)
			this.scale.x = -this.direction;
		this.direction *= -1;
		this.acceleration.x = this.startAcceleration * this.direction;
		if (this.runAnimation) {
			this.runAnimation.onComplete.remove(this.turnAnimationCompleteHandler);
			this.runAnimation.stop();
		}
		this.animatingDirectionChange = true;
		this.runAnimation = this.animations.play("turn", this.animSpeed, false);
		this.runAnimation.onComplete.addOnce(this.turnAnimationCompleteHandler, this);
	}
};

Santa.prototype.turnAnimationCompleteHandler = function() {
	this.runAnimation = this.animations.play("run", this.animSpeed, true);
	this.scale.x = -this.direction;
	this.animatingDirectionChange = false;
};

Santa.prototype.setDirection = function(direction) {
	this.direction = direction;
	this.acceleration.x = this.startAcceleration * this.direction;
};

module.exports = Santa;

},{"./GameObjectType":6}],20:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
	preload: function() {
		this.load.image('preloader', 'assets/preloader.gif');
	},
	create: function() {

		/*this.stage.disableVisibilityChange = true;

		if (this.game.device.desktop)
		{
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.setMinMax(480, 260, 1024, 768);
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;
		}
		else
		{
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.setMinMax(480, 260, 1024, 768);
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;
			this.scale.forceOrientation(true, false);
			this.scale.setResizeCallback(this.gameResized, this);
			this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
			this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
		}*/

		this.parentElement = this.game.canvas;

		//this.game.forceSingleUpdate = true;

		this.game.scale.fullScreenTarget = this.parentElement;
		//this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
		this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL; // Important
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		this.game.scale.forceOrientation(true, false);
		this.game.stage.disableVisibilityChange = true;
		this.game.input.maxPointers = 1;

		/*if (this.game.device.desktop) {
			this.parentElement.style.maxWidth = "450px";
			this.parentElement.style.maxHeight = "300px";
		}*/

		//this.game.scale.setResizeCallback(this.resize, this);

		/*this.game.canvas.style.width = "100%";
		this.game.canvas.style.height = "100%";*/

		this.game.state.start('preload');
	},
	gameResized: function (width, height) {

		//  This could be handy if you need to do any extra processing if the game resizes.
		//  A resize could happen if for example swapping orientation on a device.

	},

	enterIncorrectOrientation: function () {

		BasicGame.orientated = false;

		document.getElementById('orientation').style.display = 'block';

	},

	leaveIncorrectOrientation: function () {

		BasicGame.orientated = true;

		document.getElementById('orientation').style.display = 'none';

	},

	resize: function() {
		// A value of 1 means no scaling 0.5 means half size, 2 double the size and so on.
		var scale = Math.min(window.innerWidth / this.game.width, window.innerHeight / this.game.height);

		// Resize parent div in order to vertically center the canvas correctly.
		this.parentElement.style.minHeight = window.innerHeight.toString() + "px";

		// Resize the canvas keeping the original aspect ratio.
		this.game.scale.setUserScale(scale, scale, 0, 0);

		/*var height = window.height;
		var width = window.width;

		this.game.width = width;
		this.game.height = height;
		//this.game.stage.bounds.width = width;
		//this.game.stage.bounds.height = height;

		if (this.game.renderType === Phaser.WEBGL)
		{
			this.game.renderer.resize(width, height);
		}*/
	}
};

module.exports = Boot;

},{}],21:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
	preload: function () {

	},
	create: function () {
		//console.log("gameover.create");
		this.titleText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY - 150, "chromoFont", "Game over", 80);
		this.titleText.anchor.setTo(0.5, 0.5);
		this.titleText.alpha = 0;
		this.game.add.tween(this.titleText)
			.to({alpha:1}, 0.8 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.In, true);

		this.instructionText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY - 150 + 70, "chromoFont", "Tap to play again", 48);
		this.instructionText.anchor.setTo(0.5, 0.5);
		this.instructionText.alpha = 0;
		this.game.add.tween(this.instructionText)
			.to({alpha:1}, 1.3 * Phaser.Timer.SECOND, Phaser.Easing.Cubic.In, true);
	},
	update: function () {
		if(this.game.input.activePointer.justPressed()) {
			this.game.state.start('play');
		}
	}
};
module.exports = GameOver;

},{}],22:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
	preload: function() {

	},
	create: function() {
		this.startText = this.game.add.bitmapText(this.game.width * 0.5, this.game.height * 0.4, "chromoFont", "Tap\nto start", 48);
		this.startText.align = "center";
		this.startText.x = (this.game.width - this.startText.width) * 0.5;

		this.game.input.onDown.add(this.tapHandler, this);
	},
	update: function() {
		/*if(this.game.input.activePointer.justPressed()) {
			this.goFullScreen();
			this.game.state.start('play');
		}*/
	},
	tapHandler: function() {
		if (!this.game.device.desktop)
			this.goFullScreen();
		//this.game.scale.startFullScreen();
		this.game.state.start('play');
	},
	goFullScreen: function() {
		//this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
		/*if (this.game.scale.isFullScreen) {
			this.game.scale.stopFullScreen();
		} else {
			this.game.scale.startFullScreen();
		}*/

		var elem = this.game.canvas;
		//var elem = document.getElementById("game");
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();
		}
		/*//this.input.maxPointers = 1;
		 this.stage.disableVisibilityChange = true;

		 //BasicGame.orientated = true;
		 this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
		 this.game.scale.minWidth = this.game.width / 2;
		 this.game.scale.minHeight = this.game.height / 2;
		 this.game.scale.pageAlignHorizontally = true;
		 this.game.scale.pageAlignVertically = true;
		 if (this.game.device.desktop)
		 {
		 this.game.scale.maxWidth = this.game.width;
		 this.game.scale.maxHeight = this.game.height;
		 this.game.scale.setScreenSize(true);
		 }
		 else
		 {
		 this.game.scale.maxWidth = this.game.width * 2.5;
		 this.game.scale.maxHeight = this.game.height * 2.5;
		 this.game.scale.forceOrientation(false, true);
		 //this.game.scale.hasResized.add(this.gameResized, this);
		 //this.game.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
		 //this.game.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
		 this.game.scale.setScreenSize(true);
		 }

		 this.state.start('CheckOrientation');*/
	}
};

module.exports = Menu;

},{}],23:[function(require,module,exports){

'use strict';

var GameObjectType = require('../prefabs/GameObjectType');
var Santa = require('../prefabs/santa');
var Sack = require('../prefabs/sack');
var Coin = require('../prefabs/coin');
var Background = require('../prefabs/Background');
var Ability = require('../prefabs/Ability');
var SpikesManager = require('../prefabs/SpikesManager');
var PauseMenu = require('../prefabs/PauseMenu');
var BalanceManager = require('../prefabs/BalanceManager');
var LittleStars = require('../prefabs/LittleStars');
var Title = require('../prefabs/Title');

function Play() {}
Play.prototype = {
	create: function() {
		//this.game.time.desiredFps = 30;
		this.usePhysics = Phaser.Physics.P2JS;

		console.log("play.create");

		this.PLAY_STATE = "playState";
		this.GAME_OVER_STATE = "gameOverState";

		this.savedData = {};
		var curSavedDataVersion = "0.1";
		var defaultSavedData = {
			bestScore:0,
			gold:0,
			chars:[0],
			boosters:[],
			sound:true
		};
		var savedDataString = localStorage.getItem("bulbokaChBounceData");
		if (savedDataString !== null) {
			this.savedData = JSON.parse(savedDataString);
			if (this.savedData.v === undefined ||this.savedData.v == null || this.savedData.v != curSavedDataVersion) {
				var prop;
				for (prop in defaultSavedData) {
					if (this.savedData[prop] === undefined || this.savedData[prop] == null)
						this.savedData[prop] = defaultSavedData[prop];
				}
			}
		}
		else {
			this.savedData = defaultSavedData;
		}
		this.savedData.v = curSavedDataVersion;

		this.playOnStartPrice = 5;
		this.playOnPriceMult = 1.6;
		this.playOnPrice = this.playOnStartPrice;

		this.parentElement = this.game.canvas;
		this.lastGameHeight = this.game.height;
		this.lastGameWidth = this.game.width;
		this.resizeHandler();
		this.game.scale.setResizeCallback(this.resizeHandler, this);

		this.game.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
		this.game.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);

		var worldBorderWidth = 0;
		var topBorderWidth = 300;
		this.game.world.setBounds(-worldBorderWidth, -topBorderWidth, this.game.width + worldBorderWidth * 2, this.game.height + topBorderWidth);

		this.effectsContainer = new Phaser.Group(this.game, null);

		this.background = new Background(this.game, this.game.cache.getJSON("config").decor, 0, this.effectsContainer);
		this.background.scale.x = this.background.scale.y = this.game.width / 960;
		this.background.y = this.game.height - 640 * this.background.scale.x;
		this.background.onAddedDecorObject.add(this.addedDecorObjectHandler, this);
		this.game.add.existing(this.background);

		this.ground = this.game.add.image(0, 0, "playAtlas", "ground");
		this.ground.y = this.game.height - this.ground.height;
		this.ground.scale.x = this.game.width / 960;
		//this.ground.alpha = 0.5;

		this.spikesManager = new SpikesManager(this.game, 2);
		this.game.add.existing(this.spikesManager);

		this.floor = this.game.add.sprite(this.game.width * 0.5, this.game.height - 25, "playAtlas", "sack");
		this.floor.visible = false;

		this.gameSpeed = 1;
		this.gameSpeedMax = 2.5;
		this.gameSpeedAcc = 0.04;

		switch (this.usePhysics) {
			case Phaser.Physics.P2JS: {
				this.game.physics.startSystem(Phaser.Physics.P2JS);
				//this.game.physics.p2.useElapsedTime = true;
				this.game.physics.p2.frameRate = 1 / 60 * this.gameSpeed;
				this.game.physics.p2.restituion = 1;
				this.game.physics.p2.stiffness = Number.MAX_VALUE;
				this.startGravity = 600; //600
				this.game.physics.p2.gravity.y = 0; //600

				this.mainMaterial = this.game.physics.p2.createMaterial("mainMaterial");
				//this.worldMaterial = this.game.physics.p2.createMaterial("worldMaterial");
				this.game.physics.p2.setWorldMaterial(this.mainMaterial, false, false, false, false);
				this.floorMaterial = this.game.physics.p2.createMaterial("floorMaterial");

				var contactMaterial1 = this.game.physics.p2.createContactMaterial(this.mainMaterial, this.mainMaterial);
				contactMaterial1.friction = 10;     //10
				this.startRestitution = contactMaterial1.restitution = 1;  // 1.096, 4.411, 4.44, 4.419
				contactMaterial1.stiffness = Number.MAX_VALUE;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
				//contactMaterial1.relaxation = 0.01;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
				//contactMaterial1.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
				//contactMaterial1.frictionRelaxation = 0.01;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
				//contactMaterial1.surfaceVelocity = 0;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.

				//var contactMaterial2 = this.game.physics.p2.createContactMaterial(this.mainMaterial, this.worldMaterial);
				//contactMaterial2.friction = 1;     // Friction to use in the contact of these two materials.
				//contactMaterial2.restitution = 1;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
				//contactMaterial2.stiffness = 1e7;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
				//contactMaterial2.relaxation = 0.01;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
				//contactMaterial2.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
				//contactMaterial2.frictionRelaxation = 0.01;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
				//contactMaterial2.surfaceVelocity = 0;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.

				var floorContactMaterial = this.game.physics.p2.createContactMaterial(this.mainMaterial, this.floorMaterial);
				floorContactMaterial.friction = 1;     // Friction to use in the contact of these two materials.
				floorContactMaterial.restitution = 0.2;  // 1.096 Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
				floorContactMaterial.stiffness = Number.MAX_VALUE;  // 1.096 Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.

				this.game.physics.p2.enable(this.floor);
				this.floor.body.clearShapes();
				this.floorShape = this.floor.body.addRectangle(this.game.width, 20, 0, 0);
				this.floor.body.static = true;
				this.floor.body.debug = false;
				this.floor.body.setMaterial(this.floorMaterial);
				this.floor.objectType = GameObjectType.HOSTILE;
				//this.floor.body.onBeginContact.add(this.floorBeginContactHandler, this);

				break;
			}
			case Phaser.Physics.ARCADE: {
				this.game.physics.startSystem(Phaser.Physics.ARCADE);
			}

		}

		this.santa = new Santa(this.game, -200, this.game.height - 140, this.mainMaterial);
		this.game.add.existing(this.santa);
		//this.santa.start(14, 500);

		/*this.mark = this.game.add.sprite(this.game.width * 0.5, 100, "playAtlas", "sack");
		this.mark.anchor.setTo(0.5, 0.5);
		this.mark.alpha = 0.6;*/

		this.sack = new Sack(this.game, this.game.width * 0.5 + 289, -200, this.mainMaterial, 800);
		this.game.add.existing(this.sack);
		this.sack.onDead.add(this.gameOver, this);

		this.tapEnabled = false;
		this.firstBounce = true;
		this.santa.body.onBeginContact.add(this.santaBeginContactHandler, this);

		this.coinsGroup = this.game.add.group(undefined, "coinsGroup");

		this.littleStars = new LittleStars(this.game);

		this.game.add.existing(this.effectsContainer);

		this.scoreText = this.game.add.bitmapText(this.game.width * 0.5, 50, "chromoFont2", "0", 72);
		this.scoreText.anchor.setTo(0.5, 0.5);
		this.score = 0;
		this.scoreText.alpha = 0;
		this.bestScore = this.savedData.bestScore;

		this.state = this.PLAY_STATE;
		//this.game.time.events.add((0.2 * 3 + 0) * Phaser.Timer.SECOND, this.startGame, this);

		this.balanceManager = new BalanceManager(this.game, this.savedData.gold);
		this.game.add.existing(this.balanceManager);

		this.pauseMenu = new PauseMenu(this.game, this.savedData.sound);
		this.game.add.existing(this.pauseMenu);
		this.pauseMenu.onSoundToggled.add(this.soundToggledHandler, this);
		this.game.onPause.add(this.pauseHandler, this);
		this.game.onResume.add(this.resumeHandler, this);

		this.curAbility = Ability.DASH;

		this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
		//this.game.input.onDown.addOnce(this.startGameTapHandler, this);

		this.title = new Title(this.game, this.game.width * 0.5, this.game.height * 0.5 - 62);
		this.game.add.existing(this.title);
		this.title.show(Phaser.Timer.SECOND * 1.1);

		this.santa.reset(this.game.width * 0.5 - 220, this.santa.y, true, true);
		this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {
			this.game.input.onDown.addOnce(this.startGameTapHandler, this);
		}, this);

		this.bgMusic = this.game.add.audio("theme1");
		this.bgMusic.play("", 0, 1, true);

		this.lastBounceTime = Date.now();
		this.oldGameSpeed = -1;
	},

	pauseHandler:function() {
		this.lastTapEnabled = this.tapEnabled;
		this.tapEnabled = false;
	},

	resumeHandler:function() {
		this.tapEnabled = this.lastTapEnabled;
		this.oldGameSpeed = this.gameSpeed;
		this.setGameSpeed(0);
	},

	soundToggledHandler:function(mute) {
		this.savedData.sound = !mute;
		this.saveData();
	},

	addedDecorObjectHandler:function() {
		this.setGameSpeed(this.gameSpeed + this.gameSpeedAcc);
	},

	setGameSpeed:function(value) {
		this.gameSpeed = Math.min(value, this.gameSpeedMax);
		this.santa.gameSpeed = this.gameSpeed;
		this.game.physics.p2.frameRate = 1 / 60 * this.gameSpeed;
	},

	generateNextCoin:function() {
		this.bouncesUntilCoin = Math.round(2 + Math.random() * 2);
	},

	addCoin: function() {
		this.generateNextCoin();
		var coin = this.coinsGroup.getFirstExists(false);
		if (!coin)
			coin = new Coin(this.game, this.coinsGroup, 0, 0);
		coin.onCollected.addOnce(this.coinCollectedHandler, this);
		var coinStartX;
		//console.log(this.sack.x);
		var minDistanceFromSack = 270;
		var minDistanceFromBorder = 150;
		var minDistanceBetweenCoins = 200;
		if (this.sack.x < this.game.width * 0.5)
			coinStartX = this.sack.x + minDistanceFromSack + (this.game.width  - this.sack.x - minDistanceFromSack - minDistanceFromBorder) * Math.random();
		else
			coinStartX = minDistanceFromBorder + (this.sack.x - minDistanceFromSack - minDistanceFromBorder) * Math.random();
		var curCoin;
		var coinMinY = this.game.height * 0.2;
		var coinMaxY = this.game.height * 0.6;
		var coinYInterval = coinMaxY - coinMinY;
		var coinStartY = coinMinY + Math.random() * coinYInterval;
		for (var i = 0; i < this.coinsGroup.children; i++) {
			curCoin = this.coinsGroup.children(i);
			if (!curCoin.exists)
				continue;
			if (Math.abs(coinStartX - curCoin.x) < minDistanceBetweenCoins) {
				if (curCoin.y < coinMinY + coinYInterval * 0.5)
					coinStartY = curCoin.y + minDistanceBetweenCoins + (coinMaxY - curCoin.y - minDistanceBetweenCoins) * Math.random();
				else
					coinStartY = coinMinY + (curCoin.y - coinMinY - minDistanceBetweenCoins) * Math.random();
			}
		}
		coin.reset(coinStartX, coinStartY, 3 * Phaser.Timer.SECOND, this.balanceManager.goldIcon);

	},
	coinCollectedHandler: function() {
		this.balanceManager.addBalance(1);
	},
	enterIncorrectOrientation: function () {
		BasicGame.orientated = false;
		document.getElementById('orientation').style.display = 'block';
	},
	leaveIncorrectOrientation: function () {
		BasicGame.orientated = true;
		document.getElementById('orientation').style.display = 'none';
	},
	update: function() {
		if (this.tapEnabled) {
			if (this.spaceKey.downDuration(250)) {
				this.useAbility();
			}
		}
		if (this.oldGameSpeed > 0) {
			if (this.gameSpeed < this.oldGameSpeed)
				this.setGameSpeed(this.gameSpeed + 0.02);
			if (this.gameSpeed >= this.oldGameSpeed) {
				this.setGameSpeed(this.oldGameSpeed);
				this.oldGameSpeed = -1;
			}
		}
	},
	useAbility: function() {
		switch (this.curAbility) {
			case Ability.JUMP: {
				this.santa.jump();
				break;
			}
			case Ability.DASH: {
				this.santa.dash();
				break;
			}
		}
	},
	resizeHandler: function() {

		var screenAspect = window.innerHeight / window.innerWidth;
		//this.game.height = this.game.width * screenAspect;
		this.game.scale.setGameSize(this.game.height / screenAspect, this.game.height);
		//console.log("w:" + window.innerWidth + "; h:" + window.innerHeight);
		this.game.scale.setUserScale((window.innerWidth-2) / this.game.width, (window.innerHeight-2) / this.game.height);
		//this.game.scale.setUserScale(0.5, 0.5);

		return;

		//console.log("window:" + window.innerWidth + "; " + window.innerHeight);
		var screenAspect = window.innerHeight / window.innerWidth;
		//this.game.height = this.game.width * screenAspect;
		this.game.scale.setGameSize(this.game.width, this.game.width * screenAspect);
		//console.log("game:" + this.game.width + "; " + this.game.height);
		//console.log("canvas:" + this.parentElement.width + "; " + this.parentElement.height);
		//this.game.scale.refresh();
		//this.parentElement.style.height = window.innerHeight.toString() + "px";
		//this.parentElement.style.margin = "0";

		if (this.santa && this.santa.body)
			this.santa.body.y = this.game.height - (this.lastGameHeight - this.santa.body.y);
		if (this.sack && this.sack.body)
			this.sack.body.y = this.game.height - (this.lastGameHeight - this.sack.body.y);
		if (this.floor && this.floor.body)
			this.floor.body.y = this.game.height - (this.lastGameHeight - this.floor.body.y);
		if (this.title)
			this.title.y = this.game.height * 0.5;
		if (this.gameOverText)
			this.gameOverText.y = this.game.height * 0.5;
		this.lastGameHeight = this.game.height;
		this.lastGameWidth = this.game.width;
	},
	startGameTapHandler: function() {
		this.title.hide();
		this.game.input.onDown.add(this.tapHandler, this);
		if (!this.game.device.desktop)
			this.goFullScreen();
		this.pauseMenu.show();
		this.game.physics.p2.gravity.y = this.startGravity;
	},
	goFullScreen: function() {
		//this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
		/*if (this.game.scale.isFullScreen) {
		 this.game.scale.stopFullScreen();
		 } else {
		 this.game.scale.startFullScreen();
		 }*/

		var elem = this.game.canvas;
		//var elem = document.getElementById("game");
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();
		}
		/*//this.input.maxPointers = 1;
		 this.stage.disableVisibilityChange = true;

		 //BasicGame.orientated = true;
		 this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
		 this.game.scale.minWidth = this.game.width / 2;
		 this.game.scale.minHeight = this.game.height / 2;
		 this.game.scale.pageAlignHorizontally = true;
		 this.game.scale.pageAlignVertically = true;
		 if (this.game.device.desktop)
		 {
		 this.game.scale.maxWidth = this.game.width;
		 this.game.scale.maxHeight = this.game.height;
		 this.game.scale.setScreenSize(true);
		 }
		 else
		 {
		 this.game.scale.maxWidth = this.game.width * 2.5;
		 this.game.scale.maxHeight = this.game.height * 2.5;
		 this.game.scale.forceOrientation(false, true);
		 //this.game.scale.hasResized.add(this.gameResized, this);
		 //this.game.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
		 //this.game.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
		 this.game.scale.setScreenSize(true);
		 }

		 this.state.start('CheckOrientation');*/
	},
	floorBeginContactHandler: function(body1, body2, shape1, shape2, equation) {
		//console.log("floorBeginContactHandler:", body1, body2, shape1, shape2);
		//console.log(body2);

		if (body2.parent.sprite === this.sack)
			this.gameOver();
	},
	tapHandler: function() {
		if (!this.tapEnabled)
			return;
		var pointer = this.game.input.activePointer;
		//console.log(pointer.targetObject);
		if (pointer.targetObject != null)
			return;
		this.santa.changeDirection();
	},
	santaBeginContactHandler: function() {
		//return;

		var newBounceTime = Date.now();
		var timeSinceLastBounce = newBounceTime - this.lastBounceTime;
		//console.log(timeSinceLastBounce + "ms since last bounce");
		if (timeSinceLastBounce < Play.MIN_BOUNCE_INTERVAL)
			return;
		this.lastBounceTime = newBounceTime;

		this.addScore();
		this.bouncesUntilCoin--;
		if (this.bouncesUntilCoin <= 0)
			this.addCoin();
		this.background.addBounce();
		this.spikesManager.addBounce();

		if (this.firstBounce) {
			//return;
			this.firstBounce = false;
			this.tapEnabled = true;
			this.santa.start(20 * 60 / 1000, 500, this.gameSpeed);
			//this.sack.setWind(0.1);
		}
	},
	addScore: function() {
		this.score++;
		this.scoreText.text = this.score.toString(10);
		if (this.scoreText.alpha == 0)
			this.game.add.tween(this.scoreText)
				.to({alpha:0.5}, Phaser.Timer.SECOND * 0.2, Phaser.Easing.Linear.None, true);
	},
	gameOver: function() {
		console.log("gameOver");
		this.pauseMenu.hide();
		this.tapEnabled = false;
		this.santa.stop();
		this.sack.stop();
		if (!this.game.sound.mute)
			this.bgMusic.fadeTo(0.4 * Phaser.Timer.SECOND, 0.2);

		this.coinsGroup.callAllExists("removeCoin", true, true);

		this.balanceManager.show();

		var bestScoreText = this.bestScore > 0 ? (this.game.lang.getLocaleString("bestScore").replace("%val0%", this.bestScore.toString(10)) + "\n") : "";
		if (this.score > this.bestScore) {
			this.bestScore = this.score;
			bestScoreText = this.game.lang.getLocaleString("newBest") + "\n";
		}
		this.savedData.gold = this.balanceManager.gold;
		this.saveData();
		this.game.add.tween(this.scoreText)
			.to({alpha:0}, Phaser.Timer.SECOND * 0.2, Phaser.Easing.Linear.None, true);
		//var gameOverString = "Game over\nYour score is " + this.score.toString(10) + "\n" + bestScoreText;
		var gameOverString = this.game.lang.getLocaleString("gameOver") + "\n";
		gameOverString += this.game.lang.getLocaleString("score").replace("%val0%", this.score.toString(10) + "\n") + bestScoreText;
		this.gameOverText = this.game.add.bitmapText(this.game.width * 0.5, this.game.height * 0.5 - 130, "chromoFont2", gameOverString, 64);
		this.gameOverText.align = "center";
		this.gameOverText.anchor.setTo(0.5, 0.5);
		this.replayButton = this.game.add.button(this.game.width * 0.5, this.gameOverText.y + this.gameOverText.height * 0.5 + 95,
			"playAtlas", this.replayButtonHandler, this, "btn_replay", "btn_replay", "btn_replay", "btn_replay");
		this.replayButton.anchor.setTo(0.5, 0.5);

		if (this.balanceManager.gold >= this.playOnPrice) {
			this.playOnButton = this.game.add.button(this.game.width * 0.5 + 110, this.gameOverText.y + this.gameOverText.height * 0.5 + 95,
				"playAtlas", this.playOnButtonHandler, this, "btn_play_on", "btn_play_on", "btn_play_on", "btn_play_on");
			var coinIcon = new Phaser.Image(this.game, 10, -4, "playAtlas", "coin");
			coinIcon.anchor.setTo(0.5, 0.5);
			coinIcon.scale.setTo(0.9, 0.9);
			this.playOnButton.addChild(coinIcon);
			var playOnPriceText = new Phaser.BitmapText(this.game, 0, -8, "chromoFont2", this.playOnPrice.toString(10), 72);
			playOnPriceText.tint = 0xabcef6;
			playOnPriceText.anchor.setTo(0.5, 0.5);
			playOnPriceText.x = Math.round(50 + playOnPriceText.width * 0.5);
			this.playOnButton.addChild(playOnPriceText);
			this.playOnButton.anchor.setTo(0.5, 0.5);
			this.replayButton.x = this.game.width * 0.5 - 150;
		}

		this.state = this.GAME_OVER_STATE;
		this.santa.body.onBeginContact.remove(this.santaBeginContactHandler, this);
		this.floor.body.onBeginContact.remove(this.floorBeginContactHandler, this);
		this.game.input.onDown.remove(this.tapHandler, this);
		//this.game.input.onDown.addOnce(this.gameOverTapHandler, this);

	},
	saveData:function() {
		this.savedData.bestScore = this.bestScore;
		this.savedData.gold = this.balanceManager.gold;
		localStorage.setItem("bulbokaChBounceData", JSON.stringify(this.savedData));
	},
	replayButtonHandler: function() {
		this.removeGameOver();
		this.resetState();
	},
	playOnButtonHandler: function() {
		this.balanceManager.reduceBalance(this.playOnPrice);
		this.playOnPrice = Math.round(this.playOnPrice * this.playOnPriceMult);
		this.saveData();

		if (this.replayButton)
			this.replayButton.kill();
		if (this.playOnButton)
			this.playOnButton.kill();

		this.game.time.events.add(Phaser.Timer.SECOND * 0.4, this.playOn, this);
	},
	playOn: function() {
		this.removeGameOver();
		this.startGame();
	},
	removeGameOver: function() {
		this.balanceManager.hide();
		if (this.gameOverText)
			this.gameOverText.kill();
		if (this.replayButton)
			this.replayButton.kill();
		if (this.playOnButton)
			this.playOnButton.kill();
	},
	gameOverTapHandler: function() {
		//this.game.state.start('play');
		if (this.gameOverText)
			this.gameOverText.kill();
		this.resetState();
	},
	resetState: function() {
		this.score = 0;
		//this.scoreText.text = "0";
		this.game.add.tween(this.scoreText)
			.to({alpha:0}, Phaser.Timer.SECOND * 0.2, Phaser.Easing.Linear.None, true);
		this.playOnPrice = this.playOnStartPrice;
		this.background.reset();
		this.spikesManager.reset();
		this.setGameSpeed(1);
		this.generateNextCoin();
		this.startGame();
	},
	startGame: function() {
		this.tapEnabled = false;
		if (!this.game.sound.mute)
			this.bgMusic.fadeTo(0.4 * Phaser.Timer.SECOND, 1);
		if (!this.game.device.desktop)
			this.goFullScreen();
		this.sack.onReady.addOnce(this.startGamePlay, this);
		this.santa.reset(this.game.width * 0.5, this.game.height - 140);
		this.sack.reset(this.game.width * 0.5, 100, true);
	},
	startGamePlay: function() {
		this.pauseMenu.show();
		this.game.input.onDown.add(this.tapHandler, this);
		this.firstBounce = true;
		this.santa.body.onBeginContact.add(this.santaBeginContactHandler, this);
		this.floor.body.onBeginContact.add(this.floorBeginContactHandler, this);
		this.game.physics.p2.gravity.y = this.startGravity;
		this.state = this.PLAY_STATE;
	},
	shutdown: function() {
		console.log("play.shutdown");
		this.game.input.onDown.remove(this.tapHandler);
		this.game.physics.p2.clear();
		if (this.santa)
			this.santa.kill();
		if (this.sack)
			this.sack.kill();
		if (this.floor)
			this.floor.kill();
		this.game.scale.setResizeCallback(null);
		this.scoreText.kill();
	}
};

Play.MIN_BOUNCE_INTERVAL = 350;

module.exports = Play;
},{"../prefabs/Ability":2,"../prefabs/Background":3,"../prefabs/BalanceManager":5,"../prefabs/GameObjectType":6,"../prefabs/LittleStars":9,"../prefabs/PauseMenu":10,"../prefabs/SpikesManager":14,"../prefabs/Title":15,"../prefabs/coin":17,"../prefabs/sack":18,"../prefabs/santa":19}],24:[function(require,module,exports){

'use strict';

var LangManager = require("../prefabs/LangManager");
var LanguageId = require("../prefabs/LanguageId");

function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
	preload: function() {
		this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
		this.asset.anchor.setTo(0.5, 0.5);

		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
		this.load.setPreloadSprite(this.asset);
		this.load.atlasJSONHash("playAtlas", "assets/gameplayAtlas.png", "assets/gameplayAtlas.json");
		this.load.atlasJSONHash("santaAtlas", "assets/santaAtlas.png", "assets/santaAtlas.json");
		this.load.bitmapFont("chromoFont2", "assets/fonts/leto_slab.png", "assets/fonts/leto_slab.fnt");
		this.load.json("config", "assets/data/config.json");
		this.load.json("gametexts", "assets/data/gametexts.json");
		this.load.image("decor0_bg", "assets/decor/sky.jpg");
		this.load.image("title", "assets/title.png");
		this.load.atlasJSONHash("startAtlas", "assets/startAtlas.png", "assets/startAtlas.json");
		this.load.audio("theme1", ["assets/sound/theme1.ogg"]);

		this.game.stage.backgroundColor = 0xffffff;
	},
	create: function() {
		this.asset.cropEnabled = false;
	},
	update: function() {
		if(!!this.ready) {
			this.game.lang = new LangManager(this.game.cache.getJSON("gametexts"), LanguageId.EN);
			this.game.state.start('play');
			//this.game.state.start('testbed');
		}
	},
	onLoadComplete: function() {
		this.ready = true;
	}
};

module.exports = Preload;

},{"../prefabs/LangManager":7,"../prefabs/LanguageId":8}],25:[function(require,module,exports){
'use strict';
function Testbed() {}

Testbed.prototype = {
	preload: function() {

	},
	create: function() {
		/*this.startText = this.game.add.bitmapText(this.game.width * 0.5, this.game.height * 0.4, "chromoFont", "Hay hop!", 48);
		this.startText.align = "center";
		this.startText.x = (this.game.width - this.startText.width) * 0.5*/

		this.center = new Phaser.Point(this.game.width * 0.5, this.game.height * 0.5);

		this.game.forceSingleUpdate = true;

		var testSprite;
		var rndHeight;
		var rndDur;
		var rndX;
		var colors = ["red", "yellow", "blue"];
		var rndColor;
		for (var i = 0; i < 10; i++) {
			rndHeight = (this.game.height * (0.1 + Math.random() * 0.4)) * (Math.random() > 0.5 ? 1 : -1);
			rndX = this.game.width * (0.05 + Math.random() * 0.9);
			rndColor = "segment_" + colors[this.game.rnd.integerInRange(0, colors.length - 1)];
			testSprite = this.game.add.sprite(rndX, this.center.y + rndHeight, "playAtlas", rndColor);
			testSprite.anchor.setTo(0.5, 0.5);
			//testSprite.rotation = Math.random() * Math.PI * 2;
			//testSprite.scale.x = testSprite.scale.y = 0.5 + Math.random() * 1;
			rndDur = 2 + Math.random() * 4;
			this.game.add.tween(testSprite)
				.to({y:this.center.y - rndHeight}, Phaser.Timer.SECOND * rndDur, Phaser.Easing.Cubic.InOut, true, 0, -1, true);
		}

		/*this.testSprite1 = this.game.add.sprite(this.center.x, this.center.y + 150, "playAtlas", "triangle_red");
		this.testSprite1.anchor.setTo(0.5, 0.5);
		this.game.add.tween(this.testSprite1)
			.to({y:this.center.y - 150}, Phaser.Timer.SECOND * 3, Phaser.Easing.Cubic.InOut, true, 0, -1, true);*/
	},
	update: function() {
		/*if(this.game.input.activePointer.justPressed()) {
			this.goFullScreen();
			this.game.state.start('play');
		}*/
	}
};

module.exports = Testbed;

},{}]},{},[1]);
