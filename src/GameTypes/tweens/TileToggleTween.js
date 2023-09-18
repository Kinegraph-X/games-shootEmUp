 /**
 * @typedef {import('src/GameTypes/sprites/TilingSprite')} TilingSprite
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes'); 
const Tween = require('src/GameTypes/tweens/Tween');
const TileTween = require('src/GameTypes/tweens/TileTween');




/**
 * @constructor TileToggleTween
 * @param {CoreTypes.Dimension} windowSize
 * @param {TilingSprite} target
 * @param {CoreTypes.TweenTypes} type
 * @param {CoreTypes.Transform} transform
 * @param {Number} speed
 * @param {Boolean} oneShot
 * @param {Number} positionCount
 * @param {Number} tileTransformInterval
 * @param {String} invert
 * @param {Boolean} endAfterTileLoop
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
	
	this.initialTilePosition = new CoreTypes.Point(1, 1);
	
	// Hack for the FlameSprite's mis-alignment bug
	// @ts-ignore target is inherited
	if (this.target.tilePositionX === 0 && this.target.tilePositionY === 0) {
		// @ts-ignore target is inherited
		this.target.tilePositionX = 1;
		// @ts-ignore target is inherited
		this.target.tilePositionY = 1;
	}
	
	this.currentPartialStep = 0;
	
	if (this.invert) {
		// @ts-ignore target is inherited
		this.initialTilePosition.x = (this.target.tilePositionX = this.target.height * this.positionCount + this.target.width) + 1;
		// @ts-ignore target is inherited
		this.initialTilePosition.y = (this.target.tilePositionY = this.target.height * this.positionCount + this.target.height) + 1;
	}
}
TileToggleTween.prototype = Object.create(TileTween.prototype);

/**
 * @method nextStep
 * @param {Number} stepCount
 * @param {Number} frameDuration
 * @param {Number} timestamp
 * @return Void
 */
TileToggleTween.prototype.nextStep = function(stepCount, frameDuration, timestamp) {
	// @ts-ignore baseFrameDuration is inherited
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
			// @ts-ignore target is inherited
			this.target.tilePositionX = this.initialTilePosition.x.value;
			// @ts-ignore target is inherited
			this.target.tilePositionY = this.initialTilePosition.y.value;
		}
		this.currentPartialStep = 0;
	}
	else
		return;
	
	// @ts-ignore target is inherited
	this.target.tilePositionX  = (new CoreTypes.Coord(this.target.tilePositionX))[this.type](this.transform.x.value);
	// @ts-ignore target is inherited
	this.target.tilePositionY  = (new CoreTypes.Coord(this.target.tilePositionY))[this.type](this.transform.y.value);
	
	this.lastStepTimestamp = timestamp;
}













module.exports = TileToggleTween;