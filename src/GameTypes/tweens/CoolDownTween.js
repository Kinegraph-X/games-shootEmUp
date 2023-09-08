 /**
 * @typedef {import('src/GameTypes/sprites/Sprite')} Sprite
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes'); 



/**
 * @constructor CoolDownTween
 * @param {Sprite} target
 * @param {CoreTypes.TweenTypes} type
 * @param {String} affectedProp
 * @param {Number} offset
 * @param {Number} transformDuration
 * @param {(e:Object) => Void} onEndedCallback
 */
const CoolDownTween = function(target, type, affectedProp, offset, transformDuration, onEndedCallback) {
	this.target = target;
	this.type = type;
	this.affectedProp = affectedProp;
	this.offset = offset;
	this.transformDuration = transformDuration;
	this.onEndedCallback = onEndedCallback;
	// @ts-ignore inherited prop
	this.originalPropValue = this.target[this.affectedProp];
	this.lastStepTimestamp = 0;
	this.baseFrameDuration = 1000 / 60;
	this.currentPartialStep = 0;
	this.currentOffsetPos = 0;
	this.currentFrame = 0;
	this.ended = false;
}
//CoolDownTween.prototype = {};
CoolDownTween.prototype.objectType = 'CoolDownTween';

/**
 * @method nextStep
 */
CoolDownTween.prototype.nextStep = function() {}		// VIRTUAL (for now)

/**
 * @method testOutOfScreen
 */
CoolDownTween.prototype.testOutOfScreen = function() {
	return false;
}





module.exports = CoolDownTween;