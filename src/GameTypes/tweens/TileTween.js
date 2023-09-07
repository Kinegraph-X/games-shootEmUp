 /**
 * @typedef {import('src/GameTypes/sprites/TilingSprite')} TilingSprite
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes'); 
const Tween = require('src/GameTypes/tweens/Tween');


/**
 * @constructor TileTween
 * @param {CoreTypes.Dimension} windowSize
 * @param {TilingSprite} target
 * @param {CoreTypes.TweenTypes} type
 * @param {CoreTypes.Transform} transform
 * @param {Number} speed
 * @param {Boolean} oneShot
 */
const TileTween = function(windowSize, target, type, transform, speed, oneShot) {
	Tween.apply(this, arguments);
}
TileTween.prototype = Object.create(Tween.prototype);

/**
 * @method nextStep
 * @param {Number} stepCount
 * @param {Number} frameDuration
 * @param {Number} timestamp
 * @return Void
 */
TileTween.prototype.nextStep = function(stepCount, frameDuration, timestamp) {
	// @ts-ignore baseFrameDuration is inherited
	stepCount *= frameDuration / this.baseFrameDuration;
	// @ts-ignore currentStep is inherited
	this.currentStep++;
	// @ts-ignore target is inherited
	this.target.tilePositionX  = (new CoreTypes.Coord(this.target.tilePositionX))[this.type](this.transform.x.value * stepCount * this.speed);
	// @ts-ignore target is inherited
	this.target.tilePositionY  = (new CoreTypes.Coord(this.target.tilePositionY))[this.type](this.transform.y.value * stepCount * this.speed);
	
	this.lastStepTimestamp = timestamp;
}













module.exports = TileTween;