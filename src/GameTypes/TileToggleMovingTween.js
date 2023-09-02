
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
		oneShot,
		positionCount,
		tileTransform,
		tileTransformInterval,
		invert,
		endAfterTileLoop
	) {
	
	TileToggleTween.call(
		this, 
		windowSize,
		target,
		type,
		spriteTransform,
		spriteTransfomSpeed,
		oneShot,
		positionCount,
		tileTransformInterval,
		invert,
		endAfterTileLoop
	);
	this.positionCount = positionCount;
	this.offsetWidth = this.target.width;
	this.offsetHeight = this.target.height;		// only height for now

	this.tileTransform = tileTransform;
	this.tileTransformInterval = tileTransformInterval;
	this.invert = invert;
}
TileToggleMovingTween.prototype = Object.create(TileToggleTween.prototype);

TileToggleMovingTween.prototype.nextStep = function(stepCount, frameDuration, timestamp) {
	stepCount *= frameDuration / this.baseFrameDuration;
	this.nextStepForTiles(stepCount, timestamp);
	this.nextStepForSprite(stepCount, frameDuration, timestamp);
	if (this.target.name === "fireballSprite") {
		this.target.rotation =
		Math.atan2(this.transform.y.value, this.transform.x.value) + Math.PI / 2;
	}
	this.lastStepTimestamp = timestamp;
}

TileToggleMovingTween.prototype.nextStepForTiles = function(stepCount, timestamp) {
	this.currentPartialStep += stepCount;
	
	if (this.currentPartialStep >= this.tileTransformInterval) {
		if (this.currentOffsetPos < this.positionCount - 1)
			this.currentOffsetPos++;
		else {
			this.currentOffsetPos = 0;
			this.target.tilePosition.x = this.initialTilePosition.x.value;
			this.target.tilePosition.y = this.initialTilePosition.y.value;
		}
		this.currentPartialStep = 0;
	}
	else
		return;
	
	this.target.tilePosition.x  = (new Types.Coord(this.target.tilePosition.x))[this.type](this.tileTransform.x.value);
	this.target.tilePosition.y  = (new Types.Coord(this.target.tilePosition.y))[this.type](this.tileTransform.y.value);
}

TileToggleMovingTween.prototype.nextStepForSprite = function(stepCount, frameDuration, timestamp) {
	this.target.x = (new Types.Coord(this.target.x))[this.type](this.transform.x.value * stepCount * this.speed);
	this.target.y = (new Types.Coord(this.target.y))[this.type](this.transform.y.value * stepCount * this.speed);
}











module.exports = TileToggleMovingTween;
