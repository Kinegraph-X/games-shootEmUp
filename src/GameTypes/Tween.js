
const Types = require('src/GameTypes/CoreTypes'); 



/**
 * @constructor Tween
 * @param {Transform} transform
 */
const Tween = function(target, type, transform, speed, oneShot) {
	this.target = target;
	this.type = type;										// UNION{add, mult, div}
	this.oneShot = oneShot;
	
	this.transform = transform;
	this.duration = 0;
	this.shouldLoop = false;
	this.speed = speed || 1; 										// px.s-1
	this.currentStep = 0;
	this.lastStepTimestamp = 0;
}
Tween.prototype = {};

Tween.prototype.nextStep = function(stepCount, timestamp) {
	this.currentStep++;
	this.target.x  = (new Types.Coord(this.target.x))[this.type](this.transform.x.value * stepCount * this.speed);
	this.target.y  = (new Types.Coord(this.target.y))[this.type](this.transform.y.value * stepCount * this.speed);
	this.lastStepTimestamp = timestamp;
}













module.exports = Tween;