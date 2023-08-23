
const Types = require('src/GameTypes/CoreTypes'); 
const TileToggleTween = require('src/GameTypes/TileToggleTween');


/**
 * @constructor TileToggleTween
 * @param {CoreTypes.Transform} transform
 * @param {CoreTypes.Transform} spriteTransform
 */
const TileToggleMovingTween = function(
		windowSize,
		target,
		type,
		startPosition,
		spriteTransform,
		spriteTransfomSpeed,
		positionCount,
		tileTransform,
		tileTransfomInterval,
		invert
	) {
		
	TileToggleTween.call(
		this, 
		windowSize,
		target,
		type,
		startPosition,
		spriteTransform,
		spriteTransfomSpeed,
		false,
		positionCount,
		invert
	);
	this.positionCount = positionCount;
	this.offsetWidth = this.target.width;
	this.offsetHeight = this.target.height;		// only height for now
	this.currentOffsetPos = 0;

	this.tileTransform = tileTransform;
	this.tileTransfomInterval = tileTransfomInterval;
	this.invert = invert;
	
	if (this.invert) {
		this.target.tilePosition.y = this.target.height - this.transform.y.value;		// only y for now
	}
}
TileToggleMovingTween.prototype = Object.create(TileToggleTween.prototype);

TileToggleMovingTween.prototype.nextStep = function(stepCount, timestamp) {
//	this.nextStepForTiles(stepCount, timestamp);
	this.nextStepForSprite(stepCount, timestamp);

	this.lastStepTimestamp = timestamp;
}

TileToggleMovingTween.prototype.nextStepForTiles = function(stepCount, timestamp) {
	// FIXME: this doesn't implement the stepCount => we're loosing frames
	if (this.invert) {
		if (this.currentOffsetPos > 0)
			this.currentOffsetPos--;
		else
			this.currentOffsetPos = this.positionCount;
	}
	else {
		if (this.currentOffsetPos < this.positionCount)
			this.currentOffsetPos++;
		else
			this.currentOffsetPos = 0;
	}
	
	this.currentStep++;
	this.target.tilePosition.x  = (new Types.Coord(this.target.tilePosition.x))[this.type](this.tileTransform.x.value * stepCount);
	this.target.tilePosition.y  = (new Types.Coord(this.target.tilePosition.y + this.currentOffsetPos * this.offsetHeight))[this.type](this.tileTransform.y.value * stepCount);
}

TileToggleMovingTween.prototype.nextStepForSprite = function(stepCount, timestamp) {
	this.target.x = (new Types.Coord(this.target.x))[this.type](this.transform.x.value * stepCount * this.speed);
	this.target.y = (new Types.Coord(this.target.y))[this.type](this.transform.y.value * stepCount * this.speed);
}











module.exports = TileToggleMovingTween;