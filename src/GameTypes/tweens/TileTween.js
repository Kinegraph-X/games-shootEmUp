
const Types = require('src/GameTypes/gameSingletons/CoreTypes'); 
const Tween = require('src/GameTypes/tweens/Tween');


/**
 * @constructor Tween
 * @param {Transform} transform
 */
const TileTween = function(windowSize, target, type, transform, speed, oneShot) {
	Tween.apply(this, arguments);
}
TileTween.prototype = Object.create(Tween.prototype);

TileTween.prototype.nextStep = function(stepCount, frameDuration, timestamp) {
	stepCount *= frameDuration / this.baseFrameDuration;
//	console.log(this.target.tilePositionX, this.target)
	this.currentStep++;
	this.target.tilePositionX  = (new Types.Coord(this.target.tilePositionX))[this.type](this.transform.x.value * stepCount * this.speed);
	this.target.tilePositionY  = (new Types.Coord(this.target.tilePositionY))[this.type](this.transform.y.value * stepCount * this.speed);
	
	this.lastStepTimestamp = timestamp;
}













module.exports = TileTween;