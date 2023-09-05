

const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const Sprite = require('src/GameTypes/sprites/Sprite');


/**
 * @constructor LootSprite
 * @param {CoreTypes.Point} position
 * @param {CoreTypes.Dimension} dimensions
 * @param {PIXI.Texture} texture
 * FIXME: Explicitly type that :
 * @param {String} lootType		// {medikit | weapon}
 */
const LootSprite = function(position, texture, lootType) {
	 this.lootType = lootType;
	 
	 Sprite.call(this);
	 
	 this.spriteObj = this.getSprite(texture);
	 this.x = position.x.value;
	 this.y = position.y.value;
	 this.width = this.defaulSpriteDimensions.x.value;
	 this.height = this.defaulSpriteDimensions.y.value;
}
LootSprite.prototype = Object.create(Sprite.prototype);

/**
 * @static {String} name
 */
LootSprite.prototype.name = 'lootSprite';

/**
 * @method getSprite
 * @param {PIXI.Texture} texture
 */
LootSprite.prototype.getSprite = function(texture) {
	const sprite = PIXI.Sprite.from(texture);
	sprite.anchor.set(0.5);
	return sprite;
}


LootSprite.prototype.defaulSpriteDimensions = new CoreTypes.Dimension(64, 64);

 
 
 
 
 module.exports = LootSprite;