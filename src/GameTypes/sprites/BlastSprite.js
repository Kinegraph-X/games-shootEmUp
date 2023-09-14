/**
 * @typedef {Object} PIXI.Texture
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const Sprite = require('src/GameTypes/sprites/Sprite');


/**
 * @constructor BlastSprite
 * @param {CoreTypes.Point} position
 * @param {PIXI.Texture} texture
 */
const BlastSprite = function(position, texture) {
	 
	 Sprite.call(this);
	 
	 this.spriteObj = this.getSprite(texture);
	 this.x = position.x.value;
	 this.y = position.y.value;
	 this.width = this.defaulSpriteDimensions.x.value;
	 this.height = this.defaulSpriteDimensions.y.value;
}
BlastSprite.prototype = Object.create(Sprite.prototype);

/**
 * @static {String} objectType
 */
BlastSprite.prototype.objectType = 'BlastSprite';

/**
 * @method getSprite
 * @param {PIXI.Texture} texture
 * //@return {PIXI.Sprite}
 */
BlastSprite.prototype.getSprite = function(texture) {
	// @ts-ignore PIXI
	const sprite = PIXI.Sprite.from(texture);
	sprite.anchor.set(0.5);
	// @ts-ignore blendMode
	sprite.blendMode = PIXI.BLEND_MODES.ADD;
	return sprite;
}


BlastSprite.prototype.defaulSpriteDimensions = new CoreTypes.Dimension(950, 950);

 
 
 
 
 module.exports = BlastSprite;