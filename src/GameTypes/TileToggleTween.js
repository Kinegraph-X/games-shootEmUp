
const Types = require('src/GameTypes/CoreTypes'); 
const TileTween = require('src/GameTypes/TileTween');


/**
 * @constructor TileToggleTween
 * @param {CoreTypes.Transform} transform
 */
const TileToggleTween = function(
		windowSize,
		target,
		type,
		transform,
		speed,
		oneShot,
		positionCount,
		tileTransformInterval,
		invert,
		endAfterTileLoop
	) {
	
	// FIXME: the "invert"" mode isn't available on this type
	TileTween.apply(this, arguments);
	
	
	this.positionCount = positionCount;
	this.tileTransformInterval = tileTransformInterval;
	this.invert = invert;
	this.endAfterTileLoop = endAfterTileLoop;
	
	this.currentOffsetPos = 0;
	
	this.initialTilePosition = new Types.Point(1, 1);
	this.target.tilePosition.x = 1;
	this.target.tilePosition.y = 1;
	
	this.currentPartialStep = 0;
	
	if (this.invert) {
		this.initialTilePosition.x = new Types.Coord(this.target.tilePosition.x = this.target.height * this.positionCount + this.target.width) + 1;
		this.initialTilePosition.y = new Types.Coord(this.target.tilePosition.y = this.target.height * this.positionCount + this.target.height) + 1;
	}
}
TileToggleTween.prototype = Object.create(TileTween.prototype);

TileToggleTween.prototype.nextStep = function(stepCount, frameDuration, timestamp) {
	this.currentPartialStep += stepCount;
	
	if (this.currentPartialStep >= this.tileTransformInterval) {
		if (this.currentOffsetPos < this.positionCount - 1)
			this.currentOffsetPos++;
		else {
			if (this.endAfterTileLoop) {
				this.ended = true;
				return;
			}
			this.currentOffsetPos = 0;
			this.target.tilePosition.x = this.initialTilePosition.x.value;
			this.target.tilePosition.y = this.initialTilePosition.y.value;
		}
		this.currentPartialStep = 0;
	}
	else
		return;
	
	this.target.tilePosition.x  = (new Types.Coord(this.target.tilePosition.x))[this.type](this.transform.x.value);
	this.target.tilePosition.y  = (new Types.Coord(this.target.tilePosition.y))[this.type](this.transform.y.value);
	this.lastStepTimestamp = timestamp;
}













module.exports = TileToggleTween;