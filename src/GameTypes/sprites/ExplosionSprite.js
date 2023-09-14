/**
 * @typedef {Object} PIXI.Texture
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const Sprite = require('src/GameTypes/sprites/Sprite');
const TilingSprite = require('src/GameTypes/sprites/TilingSprite');


/**
 * @constructor ExplosionSprite
 * @param {CoreTypes.Point} position
 * @param {CoreTypes.Dimension} dimensions
 * @param {PIXI.Texture} texture
 */
const ExplosionSprite = function(position, texture, dimensions) {
	Sprite.call(this);
	this.objectType = 'ExplosionSprite';
	this.spriteObj = this.getSprite(dimensions, texture);
	 
	this.x = position.x.value;
	this.y = position.y.value;
}
ExplosionSprite.prototype = Object.create(Sprite.prototype);
/**
 * @static {String} objectType
 */
ExplosionSprite.prototype.objectType = 'ExplosionSprite';

/**
 * @method getSprite
 * @param {CoreTypes.Dimension} dimensions
 * @param {PIXI.Texture} texture
 * @return {TilingSprite}
 */
ExplosionSprite.prototype.getSprite = function(dimensions, texture) {
	 // Not sure we'll keep this "TilingSprite" type.
	 // As it inherits from Sprite, it looks quite redundant, structurally talking
	const sprite = new TilingSprite(
		dimensions || this.defaultExplosionDimensions,
		texture
	);
	sprite.spriteObj.anchor.set(0.5);
	
	return sprite.spriteObj;
}



/**
 * @static {CoreTypes.Dimension} objectType
 */
ExplosionSprite.prototype.defaultExplosionDimensions = new CoreTypes.Dimension(64, 64)



module.exports = ExplosionSprite;