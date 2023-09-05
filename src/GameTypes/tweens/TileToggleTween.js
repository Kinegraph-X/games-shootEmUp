
const Types = require('src/GameTypes/gameSingletons/CoreTypes'); 
const TileTween = require('src/GameTypes/tweens/TileTween');


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
	this.target.tilePositionX = 1;
	this.target.tilePositionY = 1;
	
	this.currentPartialStep = 0;
	
	if (this.invert) {
		this.initialTilePosition.x = new Types.Coord(this.target.tilePositionX = this.target.height * this.positionCount + this.target.width) + 1;
		this.initialTilePosition.y = new Types.Coord(this.target.tilePositionY = this.target.height * this.positionCount + this.target.height) + 1;
	}
}
TileToggleTween.prototype = Object.create(TileTween.prototype);

TileToggleTween.prototype.nextStep = function(stepCount, frameDuration, timestamp) {
	stepCount *= frameDuration / this.baseFrameDuration;
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
			this.target.tilePositionX = this.initialTilePosition.x.value;
			this.target.tilePositionY = this.initialTilePosition.y.value;
		}
		this.currentPartialStep = 0;
	}
	else
		return;
	
	this.target.tilePositionX  = (new Types.Coord(this.target.tilePositionX))[this.type](this.transform.x.value);
	this.target.tilePositionY  = (new Types.Coord(this.target.tilePositionY))[this.type](this.transform.y.value);
	this.lastStepTimestamp = timestamp;
}













module.exports = TileToggleTween;