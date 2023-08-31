
const Types = require('src/GameTypes/CoreTypes'); 
const Tween = require('src/GameTypes/Tween');


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
	this.currentStep++;
	this.target.tilePosition.x  = (new Types.Coord(this.target.tilePosition.x))[this.type](this.transform.x.value * stepCount * this.speed);
	this.target.tilePosition.y  = (new Types.Coord(this.target.tilePosition.y))[this.type](this.transform.y.value * stepCount * this.speed);
//	console.log(this.target.tilePosition);
	this.lastStepTimestamp = timestamp;
}













module.exports = TileTween;