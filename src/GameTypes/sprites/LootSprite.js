/**
 * @typedef {Object} PIXI.Texture
 */

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const Healer = require('src/GameTypes/interfaces/Healer');
const Sprite = require('src/GameTypes/sprites/Sprite');


/**
 * @constructor LootSprite
 * @param {CoreTypes.Point} position
 * @param {PIXI.Texture} texture
 * FIXME: Explicitly type that :
 * @param {String} lootType		// {medikit | weapon}
 */
const LootSprite = function(position, texture, lootType) {
	 this.lootType = lootType;
	 
	 Sprite.call(this);
	 Healer.call(this);
	 
	 this.spriteObj = this.getSprite(texture);
	 this.x = position.x.value;
	 this.y = position.y.value;
	 this.width = this.defaulSpriteDimensions.x.value;
	 this.height = this.defaulSpriteDimensions.y.value;
}
LootSprite.prototype = Object.create(Sprite.prototype);
/**
 * @static {String} objectType
 */
LootSprite.prototype.objectType = 'LootSprite';

/**
 * @method getSprite
 * @param {PIXI.Texture} texture
 * //@return {PIXI.Sprite}
 */
LootSprite.prototype.getSprite = function(texture) {
	// @ts-ignore
	const sprite = PIXI.Sprite.from(texture);
	sprite.anchor.set(0.5);
	return sprite;
}


LootSprite.prototype.defaulSpriteDimensions = new CoreTypes.Dimension(64, 64);

 
 
 
 
 module.exports = LootSprite;