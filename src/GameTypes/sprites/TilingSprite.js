const CoreTypes = require('src/GameTypes/_game/CoreTypes');
const Sprite = require('src/GameTypes/sprites/Sprite');
 
 /**
 * @constructor TilingSprite
 * @param {CoreTypes.Dimension} dimensions
 * @param {PIXI.Texture} texture
 * @param {Number} zoom
 * @param {Number} rotation
 */
 const TilingSprite = function(dimensions, texture, zoom, rotation) {

	Sprite.call(this)
	
	this.spriteObj = PIXI.TilingSprite.from(texture, {width : dimensions.x.value, height : dimensions.y.value});
	
	this.rotation = (rotation || 0) * Math.PI / 180 || 0;
	this.tileTransformScaleX = zoom || 1;
	this.tileTransformScaleY = zoom || 1;
	this.tileTransformRotation = rotation || 0;
}
TilingSprite.prototype = Object.create(Sprite.prototype);
 
 
 
module.exports = TilingSprite;