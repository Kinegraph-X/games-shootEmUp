

const CoreTypes = require('src/GameTypes/CoreTypes');
const Sprite = require('src/GameTypes/Sprite');


/**
 * @constructor LootSprite
 * 
 */
 const LootSprite = function(position, dimensions, texture, type) {
	 this.dimensions = dimensions;
	 this.spriteObj = this.getSprite(position, texture);
	 this.spriteObj.lootType = type;
 }
 LootSprite.prototype = {};
 
 LootSprite.prototype.getSprite = function(position, texture) {
	const sprite = new Sprite(
		new CoreTypes.Point(0, 0),
		this.dimensions,
		texture
	);
	sprite.spriteObj.anchor.set(0.5);
	sprite.spriteObj.name = 'lootSprite';
	sprite.spriteObj.x = position.x.value;
	sprite.spriteObj.y = position.y.value;
	
	return sprite.spriteObj;
 }

 
 
 
 
 module.exports = LootSprite;