const CoreTypes = require('src/GameTypes/CoreTypes');
 
 /**
 * @constructor TilingSprite
 * @param position {CoreType.Point}
 */
 const TilingSprite = function(position, dimensions, texture, zoom, rotation) {
	if (typeof PIXI === 'undefined') {
		console.warn('The PIXI lib must be present in the global scope of the page');
		return;
	}
	this.spriteObj = PIXI.TilingSprite.from(texture, {width : dimensions.x.value, height : dimensions.y.value});
	
	this.spriteObj.rotation = rotation * Math.PI / 180 || 0;
	this.spriteObj.tileTransform.scale.x = zoom || 1;
	this.spriteObj.tileTransform.scale.y = zoom || 1;
	
	position = position || new CoreTypes.Point()
	 
	this.spriteObj.tilePosition.x = position.x.value;
	this.spriteObj.tilePosition.y = position.y.value;
}
TilingSprite.prototype = {};
 
 
 
module.exports = TilingSprite;