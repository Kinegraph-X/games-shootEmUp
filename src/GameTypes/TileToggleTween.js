
const Types = require('src/GameTypes/CoreTypes'); 
const TileTween = require('src/GameTypes/TileTween');


/**
 * @constructor TileToggleTween
 * @param {CoreTypes.Transform} transform
 */
const TileToggleTween = function(windowSize, target, type, transform, speed, oneShot, positionCount) {	// FIXME: the "invert"" mode isn't available on this type
	TileTween.apply(this, arguments);
	this.positionCount = positionCount;
	this.offsetWidth = this.target.width;
	this.offsetHeight = this.target.height;		// only height for now
	this.currentOffsetPos = 0;
}
TileToggleTween.prototype = Object.create(TileTween.prototype);

TileToggleTween.prototype.nextStep = function(stepCount, timestamp) {
	// FIXME: this doesn't implement the stepCount => we're loosing frames
	if (this.currentOffsetPos < this.positionCount)
		this.currentOffsetPos++;
	else
		this.currentOffsetPos = 0;
	
	this.currentStep++;
	this.target.tilePosition.x  = (new Types.Coord(this.target.tilePosition.x))[this.type](this.transform.x.value * stepCount * this.speed);
	this.target.tilePosition.y  = (new Types.Coord(this.target.tilePosition.y + this.currentOffsetPos * this.offsetHeight))[this.type](this.transform.y.value * stepCount * this.speed);
	this.lastStepTimestamp = timestamp;
}













module.exports = TileToggleTween;