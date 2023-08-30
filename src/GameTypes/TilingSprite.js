const CoreTypes = require('src/GameTypes/CoreTypes');
 
 /**
 * @constructor TilingSprite
 * @param position {CoreType.Point}
 */
 const TilingSprite = function(UID, position, dimensions, texture, zoom, rotation) {
	if (typeof PIXI === 'undefined') {
		console.warn('The PIXI lib must be present in the global scope of the page');
		return;
	}
	this._UID = UID;
	this.spriteObj = PIXI.TilingSprite.from(texture, {width : dimensions.x.value, height : dimensions.y.value});
	this.spriteObj._UID = this._UID;
	this.spriteObj.enteredScreen = false;
	
	this.spriteObj.rotation = (rotation || 0) * Math.PI / 180 || 0;
	this.spriteObj.tileTransform.scale.x = zoom || 1;
	this.spriteObj.tileTransform.scale.y = zoom || 1;
}
TilingSprite.prototype = {};
 
 
 
module.exports = TilingSprite;