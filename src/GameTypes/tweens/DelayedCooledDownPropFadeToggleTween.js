 /**
 * @typedef {import('src/GameTypes/sprites/Sprite')} Sprite
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const CooledDownPropFadeToggleTween = require('src/GameTypes/tweens/CoolDownTween'); 



/**
 * @class DelayedCooledDownPropFadeToggleTween
 * @param {Sprite} target
 * @param {CoreTypes.TweenTypes} type
 * @param {String} affectedProp
 * @param {Number} offset
 * @param {Number} transformDuration
 * @param {(e:Object) => Void} onEndedCalback
 * @param {Number} transformInterval
 * @param {Number} initialDelay
 */
const DelayedCooledDownPropFadeToggleTween = function(target, type, affectedProp, offset, transformDuration, onEndedCalback, transformInterval, initialDelay) {
	CooledDownPropFadeToggleTween.apply(this, arguments);
	this.transformInterval = transformInterval;
	this.initialDelay = initialDelay;
	this.initialDelayEnded = false;
	
	// HACK for the movements of the Boss : it also fires projectiles
	this.collisionTestsRegister = [];
	
	// HACK: we set the prop at its final value for the time of the delay (only works for fadeout)
	// FIXME: find something efficient
	if (this.initialDelay !== 0)
		// @ts-ignore target is inherited
		this.target[this.affectedProp] = (new CoreTypes.Coord(this.target[this.affectedProp]))[this.type](this.offset);
}
DelayedCooledDownPropFadeToggleTween.prototype = Object.create(CooledDownPropFadeToggleTween.prototype);
DelayedCooledDownPropFadeToggleTween.prototype.objectType = 'DelayedCooledDownPropFadeToggleTween';

/**
 * @method nextStep
 * @param {Number} stepCount
 * @param {Number} frameDuration
 * @param {Number} timestamp
 * @return Void
 */
DelayedCooledDownPropFadeToggleTween.prototype.nextStep = function(stepCount, frameDuration, timestamp) {
	// @ts-ignore baseFrameDuration is inherited
	stepCount *= frameDuration / this.baseFrameDuration;
	
	// @ts-ignore currentFrame is inherited
	this.currentFrame += stepCount;
	
	// @ts-ignore currentFrame is inherited
	if (this.currentFrame < this.initialDelay && !this.initialDelayEnded)
		return;
	else if (!this.initialDelayEnded) {
		this.currentFrame = stepCount;
		// @ts-ignore target is inherited
		this.target[this.affectedProp] = this.originalPropValue;
		this.initialDelayEnded = true;
	}
	
	// @ts-ignore currentPartialStep is inherited
	this.currentPartialStep += stepCount;
	
	// @ts-ignore currentPartialStep is inherited
	if (this.currentPartialStep >= this.transformInterval) {
		// @ts-ignore transformDuration is inherited
		if (this.currentFrame >= this.transformDuration) {
			this.ended = true;
			// @ts-ignore onEndedCalback is inherited
			this.onEndedCallback(this.target);
			// @ts-ignore target is inherited
			this.target[this.affectedProp] = this.originalPropValue;
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







module.exports = DelayedCooledDownPropFadeToggleTween;