const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const Sprite = require('src/GameTypes/sprites/Sprite');
 
 /**
 * //@namespace PIXI
 * @typedef {Object} PIXI.Texture
 */
 
 /**
 * @constructor TilingSprite
 * @param {CoreTypes.Dimension} dimensions
 * @param {PIXI.Texture} texture
 * @param {Number} [zoom = 1] zoom
 * @param {Number} [rotation = 0] rotation
 */
 const TilingSprite = function(dimensions, texture, zoom, rotation) {

	Sprite.call(this)
	
	// @ts-ignore
	this.spriteObj = PIXI.TilingSprite.from(texture, {width : dimensions.x.value, height : dimensions.y.value});
	
	this.rotation = (rotation || 0) * Math.PI / 180 || 0;
	this.tileTransformScaleX = zoom || 1;
	this.tileTransformScaleY = zoom || 1;
	this.tileTransformRotation = rotation || 0;
}
TilingSprite.prototype = Object.create(Sprite.prototype);

/**
 * @virtual objectType
 */
TilingSprite.prototype.objectType = 'TilingSprite'					// VIRTUAL
 
 
 
module.exports = TilingSprite;