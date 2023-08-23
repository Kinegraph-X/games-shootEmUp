
const CoreTypes = require('src/GameTypes/CoreTypes');
const TilingSprite = require('src/GameTypes/TilingSprite');


/**
 * @constructor Projectile
 */
const Projectile = function(position, dimensions, texture, damage) {
	this.dimensions = dimensions;
	this.spriteObj = this.getSprite(position, texture);
	this.damage = damage;
}
Projectile.prototype = {};

Projectile.prototype.getSprite = function(position, texture) {
	const sprite = new TilingSprite(
		new CoreTypes.Point(0, 0),
		this.dimensions,
		texture
	);
	sprite.spriteObj.name = 'fireballSprite';
	sprite.spriteObj.x = position.x.value;
	sprite.spriteObj.y = position.y.value;
	
	return sprite.spriteObj;
}











module.exports = Projectile;