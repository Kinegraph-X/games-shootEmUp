 /**
 * @typedef {import('src/GameTypes/sprites/Sprite')} Sprite
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const CoolDownTween = require('src/GameTypes/tweens/CoolDownTween'); 



/**
 * @class CooledDownPropFadeToggleTween
 * @param {Sprite} target
 * @param {CoreTypes.TweenTypes} type
 * @param {String} affectedProp
 * @param {Number} offset
 * @param {Number} transformDuration
 * @param {(e:Object) => Void} onEndedCalback
 * @param {Number} transformInterval
 */
const CooledDownPropFadeToggleTween = function(target, type, affectedProp, offset, transformDuration, onEndedCalback, transformInterval) {
	CoolDownTween.apply(this, arguments);
	this.transformInterval = transformInterval;
}
CooledDownPropFadeToggleTween.prototype = Object.create(CoolDownTween.prototype);
CooledDownPropFadeToggleTween.prototype.objectType = 'CooledDownPropFadeToggleTween';

/**
 * @method nextStep
 * @param {Number} stepCount
 * @param {Number} frameDuration
 * @param {Number} timestamp
 * @return Void
 */
CooledDownPropFadeToggleTween.prototype.nextStep = function(stepCount, frameDuration, timestamp) {
	// @ts-ignore baseFrameDuration is inherited
	stepCount *= frameDuration / this.baseFrameDuration;
	
	// @ts-ignore currentPartialStep is inherited
	this.currentPartialStep += stepCount;
	// @ts-ignore currentFrame is inherited
	this.currentFrame += stepCount;
	
	// @ts-ignore currentPartialStep is inherited
	if (this.currentPartialStep >= this.transformInterval) {
		// @ts-ignore transformDuration is inherited
		if (this.currentFrame >= this.transformDuration) {
			this.ended = true;
			// @ts-ignore target is inherited
			this.target[this.affectedProp] = this.originalPropValue;
			// @ts-ignore onEndedCalback is inherited
			this.onEndedCallback(this.target);
			return;
		}
		this.offset = -this.offset;
		this.currentPartialStep = 0;
	}

	// @ts-ignore transformInterval is inherited
	let offset = this.offset / this.transformInterval;
	
	// @ts-ignore target is inherited
	this.target[this.affectedProp] = (new CoreTypes.Coord(this.target[this.affectedProp]))[this.type](offset);
	
	this.lastStepTimestamp = timestamp;
}







module.exports = CooledDownPropFadeToggleTween;