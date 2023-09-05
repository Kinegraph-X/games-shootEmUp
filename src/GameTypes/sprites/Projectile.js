
const CoreTypes = require('src/GameTypes/gameSingletons/CoreTypes');
const Sprite = require('src/GameTypes/sprites/Sprite');
const TilingSprite = require('src/GameTypes/sprites/TilingSprite');

const {weapons} = require('src/GameTypes/gameSingletons/gameConstants');

/**
 * @constructor Projectile
 */
const Projectile = function(position, dimensions, texture, projectileType) {
	
	Sprite.call(this);
	
	this.damage = weapons[projectileType].damage;
	this.spriteObj = this.getSprite(dimensions, texture);
	this.x = position.x.value;
	this.y = position.y.value;
	
}
Projectile.prototype = Object.create(Sprite.prototype);

/**
 * @static {String} name
 */
Projectile.prototype.name = 'fireballSprite';

/**
 * @method getSprite
 */
Projectile.prototype.getSprite = function(dimensions, texture) {
	const sprite = new TilingSprite(
		dimensions,
		texture
	);
	sprite.spriteObj.anchor.set(0.5);
	
	return sprite.spriteObj;
}










module.exports = Projectile;