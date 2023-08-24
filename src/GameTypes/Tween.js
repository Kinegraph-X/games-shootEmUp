
const Types = require('src/GameTypes/CoreTypes'); 



/**
 * @constructor Tween
 * @param {Transform} transform
 */
const Tween = function(windowSize, target, type, transform, speed, oneShot) {
	this.windowSize = windowSize;
	this.target = target;
	this.type = type;										// UNION{add, mult, div}
	this.oneShot = oneShot;
	this.ended = false;
	
	this.transform = transform;
	this.duration = 0;
	this.shouldLoop = false;
	this.speed = speed || 1; 										// px.s-1
	this.currentStep = 0;
	this.lastStepTimestamp = 0;
	this.collisionTestsRegister = [];
}
Tween.prototype = {};

Tween.prototype.nextStep = function(stepCount, timestamp) {
	this.currentStep++;
	this.target.x  = (new Types.Coord(this.target.x))[this.type](this.transform.x.value * stepCount * this.speed);
	this.target.y  = (new Types.Coord(this.target.y))[this.type](this.transform.y.value * stepCount * this.speed);
	this.lastStepTimestamp = timestamp;
}

Tween.prototype.testOutOfScreen = function() {
	if (this.target.name.match(/bgLayer/) || this.target.name.match(/flame/))
		return false;
	
	if (!this.target.enteredScreen && this.target.y - this.target.height / 2 > 0) {
		this.target.enteredScreen = true;
	}
	
	
	if (this.target.name === 'fireballSprite') {
		if (this.target.y - this.target.height / 2 > this.windowSize.y.value
			|| (this.target.enteredScreen && this.target.y + this.target.height < 0)) {
			return true;
		}
	}
	else if (this.target.y - this.target.height / 2 > this.windowSize.y.value
		|| (this.target.enteredScreen && this.target.y - this.target.height / 2 < 0)) {
		return true;
	}
		
	return false;
}

Tween.prototype.handleBoundaries = function() {
	
}









module.exports = Tween;