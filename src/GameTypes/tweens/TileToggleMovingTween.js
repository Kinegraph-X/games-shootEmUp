 /**
 * @typedef {import('src/GameTypes/sprites/TilingSprite')} TilingSprite
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes'); 
const TileToggleTween = require('src/GameTypes/tweens/TileToggleTween');


/**
 * @constructor TileToggleMovingTween
 * @param {CoreTypes.Dimension} windowSize
 * @param {TilingSprite} target
 * @param {CoreTypes.TweenTypes} type
 * @param {CoreTypes.Point} startPosition
 * @param {CoreTypes.Transform} spriteTransform
 * @param {Number} spriteTransfomSpeed
 * @param {Boolean} oneShot
 * @param {Number} positionCount
 * @param {CoreTypes.Transform} tileTransform
 * @param {Number} tileTransformInterval
 * @param {String} invert
 * @param {Boolean} endAfterTileLoop
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
	
	this.startX = startPosition.x.value;
	this.startY = startPosition.y.value;
	this.hasReachedClimax = false;
	
	this.positionCount = positionCount;
	// @ts-ignore target is inherited
	this.offsetWidth = this.target.width;
	// @ts-ignore target is inherited
	this.offsetHeight = this.target.height;		// only height for now

	this.tileTransform = tileTransform;
	this.tileTransformInterval = tileTransformInterval;
	this.invert = invert;
}
TileToggleMovingTween.prototype = Object.create(TileToggleTween.prototype);

/**
 * @method nextStep
 * @param {Number} stepCount
 * @param {Number} frameDuration
 * @param {Number} timestamp
 */
TileToggleMovingTween.prototype.nextStep = function(stepCount, frameDuration, timestamp) {
	// @ts-ignore baseFrameDuration is inherited
	stepCount *= frameDuration / this.baseFrameDuration;
	this.nextStepForTiles(stepCount);
	this.nextStepForSprite(stepCount);

	this.lastStepTimestamp = timestamp;
}

/**
 * @method nextStepForTiles
 * @param {Number} stepCount
 */
TileToggleMovingTween.prototype.nextStepForTiles = function(stepCount) {
	this.currentPartialStep += stepCount;
	
	if (this.currentPartialStep >= this.tileTransformInterval) {
		if (this.currentOffsetPos < this.positionCount - 1)
			this.currentOffsetPos++;
		else {
			this.currentOffsetPos = 0;
			// @ts-ignore target is inherited, initialTilePosition is inherited
			this.target.tilePositionX = this.initialTilePosition.x.value;
			// @ts-ignore target is inherited, initialTilePosition is inherited
			this.target.tilePositionY = this.initialTilePosition.y.value;
		}
		this.currentPartialStep = 0;
	}
	else
		return;
	
	// @ts-ignore target is inherited
	this.target.tilePositionX  = (new CoreTypes.Coord(this.target.tilePositionX))[this.type](this.tileTransform.x.value);
	// @ts-ignore target is inherited
	this.target.tilePositionY  = (new CoreTypes.Coord(this.target.tilePositionY))[this.type](this.tileTransform.y.value);
}

/**
 * @method nextStepForSprite
 * @param {Number} stepCount
 */
TileToggleMovingTween.prototype.nextStepForSprite = function(stepCount) {
	// @ts-ignore target is inherited
	this.target.x = (new CoreTypes.Coord(this.target.x))[this.type](this.transform.x.value * stepCount * this.speed);
	
	// @ts-ignore target is inherited
	if (this.target.objectType === "Projectile" && this.transform.x.value !== 0 && !this.hasReachedClimax) {
		// @ts-ignore target is inherit
		const offset = Math.abs((this.target.x - this.startX) / 200);
		if (Math.round(offset * 5) === 5)
			this.hasReachedClimax = true;
		const quantifier = (-Math.sin(Math.acos(offset)) + 1);
		// @ts-ignore target is inherited
		this.target.y = (new CoreTypes.Coord(this.target.y))[this.type](this.transform.y.value * stepCount * this.speed * quantifier);
		// @ts-ignore target is inherited
		this.target.rotation = (Math.atan2(this.transform.y.value * quantifier, this.transform.x.value) + Math.PI / 2) * 180 / Math.PI;
	}
	else {
		// @ts-ignore target is inherited
		this.target.y = (new CoreTypes.Coord(this.target.y))[this.type](this.transform.y.value * stepCount * this.speed);
		// @ts-ignore target is inherited
		if (this.target.objectType === "Projectile") {
			// @ts-ignore transform is inherited
			this.transform.x.value = 0;
			// @ts-ignore target is inherited
			this.target.rotation = (Math.atan2(this.transform.y.value, this.transform.x.value) + Math.PI / 2) * 180 / Math.PI;
		}
	}
	
}










module.exports = TileToggleMovingTween;