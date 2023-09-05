
const Types = require('src/GameTypes/_game/CoreTypes'); 
const TileToggleTween = require('src/GameTypes/tweens/TileToggleTween');


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
//	console.log(
//		windowSize,
//		target,
//		type,
//		startPosition,
//		spriteTransform,
//		spriteTransfomSpeed,
//		oneShot,
//		positionCount,
//		tileTransform,
//		tileTransformInterval,
//		invert,
//		endAfterTileLoop
//	)
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
	
	this.startX = startPosition.x.value;
	this.startY = startPosition.y.value;
	this.hasReachedClimax = false;
	
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

	this.lastStepTimestamp = timestamp;
}

TileToggleMovingTween.prototype.nextStepForTiles = function(stepCount, timestamp) {
	this.currentPartialStep += stepCount;
	
	if (this.currentPartialStep >= this.tileTransformInterval) {
		if (this.currentOffsetPos < this.positionCount - 1)
			this.currentOffsetPos++;
		else {
			this.currentOffsetPos = 0;
			this.target.tilePositionX = this.initialTilePosition.x.value;
			this.target.tilePositionY = this.initialTilePosition.y.value;
		}
		this.currentPartialStep = 0;
	}
	else
		return;
	
	this.target.tilePositionX  = (new Types.Coord(this.target.tilePositionX))[this.type](this.tileTransform.x.value);
	this.target.tilePositionY  = (new Types.Coord(this.target.tilePositionY))[this.type](this.tileTransform.y.value);
}

TileToggleMovingTween.prototype.nextStepForSprite = function(stepCount, frameDuration, timestamp) {
	this.target.x = (new Types.Coord(this.target.x))[this.type](this.transform.x.value * stepCount * this.speed);
	
	if (this.target.name === "fireballSprite" && this.transform.x.value !== 0 && !this.hasReachedClimax) {
		const offset = Math.abs((this.target.x - this.startX) / 200);
		if (Math.round(offset * 5) === 5)
			this.hasReachedClimax = true;
		const quantifier = (-Math.sin(Math.acos(offset)) + 1);
		this.target.y = (new Types.Coord(this.target.y))[this.type](this.transform.y.value * stepCount * this.speed * quantifier);
		this.target.rotation = Math.atan2(this.transform.y.value * quantifier, this.transform.x.value) + Math.PI / 2;
	}
	else {
		this.target.y = (new Types.Coord(this.target.y))[this.type](this.transform.y.value * stepCount * this.speed);
		if (this.target.name === "fireballSprite") {
			this.transform.x.value = 0;
			this.target.rotation = Math.atan2(this.transform.y.value, this.transform.x.value) + Math.PI / 2;
		}
	}
	
}










module.exports = TileToggleMovingTween;