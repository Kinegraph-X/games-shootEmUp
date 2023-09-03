
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
	
	this.baseFrameDuration = 1000 / 60;
	this.transform = transform;
	this.duration = 0;
	this.shouldLoop = false;
	this.speed = speed || 1; 										// px.s-1
	this.currentStep = 0;
	this.lastStepTimestamp = 0;
	// collisionTestsRegister is a partial copy of the global collisionTest list
	// it's used to clean the collision tests when a foeSpaceShip goes out of the screen
	this.collisionTestsRegister = [];
}
Tween.prototype = {};

Tween.prototype.nextStep = function(stepCount, frameDuration, timestamp) {
	stepCount *= frameDuration / this.baseFrameDuration;
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
	
	if (this.target.name === 'fireballSprite') {		// fireballSprite must test the upper bound of the window
		if (this.target.y - this.target.height / 2 < 0
			|| this.target.x - this.target.width / 2 < 0
			|| this.target.x + this.target.width / 2 > this.windowSize.x.value) {
			return true;
		}
	}
	else if (this.target.y - this.target.height / 2 > this.windowSize.y.value		// other sprites go downwards through the window
			|| this.target.x > this.windowSize.x.value
			|| this.target.x + this.target.width < 0
		) {
		return true;
	}
		
	return false;
}

Tween.prototype.handleBoundaries = function() {
	
}









module.exports = Tween;